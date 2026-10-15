/**
 * Cloudflare Worker `eryeza-checkout`: buying, paying and receiving books on
 * eryezakalalu.com without leaving the site.
 *
 * Same-origin Worker routes (worker/checkout.wrangler.toml), so the pages need no CORS:
 *
 *   POST /api/checkout/start     { edition, currency, name, email, phone, letterOptIn, addons[], fbp, fbc, source }
 *        The SERVER sets the price from src/lib/editions.ts, creates the order (status pending)
 *        and returns what the Flutterwave window needs. The browser never decides the amount.
 *   GET  /api/order?t=TOKEN      The buyer's order: status, files, audio. If still pending, the
 *        Worker asks Flutterwave directly (verify_by_reference) and fulfils when paid.
 *   POST /api/order/confirm      { t, transaction_id }  Called by the Flutterwave callback. Same check.
 *   POST /api/flw/webhook        Flutterwave webhook (verif-hash). Same check, covers closed tabs.
 *   POST /api/order/resend       { email }  Emails the buyer their order links again (rate limited).
 *   POST /api/order/refund       { t, reason }  Refund request inside the 14-day guarantee.
 *   GET|POST /api/admin/refund   Owner approves a refund from the signed link in the email.
 *   GET  /dl/TOKEN/FILEID        Download (PDFs stamped with the buyer's name and email).
 *   GET  /dl/TOKEN/audio/COLL/NAME  Stream or download one audio chapter (HTTP Range).
 *   GET  /api/checkout           Health: which parts are configured, never the values.
 *
 * Payment is only ever trusted after the Worker has called Flutterwave's verify endpoint
 * with the secret key and matched status, tx_ref, currency and amount (Flutterwave's own rule).
 * A payment can fulfil an order once: the UPDATE only moves a row out of 'pending'.
 *
 * Secrets (wrangler secret put ... -c worker/checkout.wrangler.toml):
 *   FLW_SECRET_KEY, FLW_SECRET_HASH, RESEND_API_KEY, ADMIN_KEY, IP_SALT,
 *   META_CAPI_TOKEN (optional), BEEHIIV_API_KEY (optional)
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  ADDONS, AUDIO, CURRENCIES, EDITIONS, FILES, PAYMENT_OPTIONS,
  currencyFor, formatMoney, priceOf,
  type Currency, type EditionId,
} from "../src/lib/editions";
import { SEQUENCE } from "./sequence";
import { DAYS } from "../src/lib/days";
import { FEE_COVER_RATE, GIFT_MAX, GIFT_MIN, GIFT_PRESETS, MONTHLY_PAYMENT_OPTIONS, roundGift } from "../src/lib/giving";

interface Env {
  DB: D1Database;
  AI?: Ai;                  // Workers AI (embeddings for Find your day)
  BOOKS: R2Bucket;
  EMAIL?: { send(m: { to: string; from: string; subject: string; text: string }): Promise<unknown> };
  FLW_PUBLIC_KEY: string;
  FLW_SECRET_KEY?: string;
  FLW_SECRET_HASH?: string;
  RESEND_API_KEY?: string;
  ADMIN_KEY?: string;
  IP_SALT?: string;
  META_PIXEL_ID?: string;
  META_CAPI_TOKEN?: string;
  META_GRAPH_VERSION?: string;
  BEEHIIV_API_KEY?: string;
  BEEHIIV_PUB_ID?: string;
  SITE: string;              // https://eryezakalalu.com
  MAIL_FROM: string;         // Eryeza Kalalu <books@eryezakalalu.com>
  REPLY_TO: string;          // books@eryezakalalu.com
  NOTIFY_EMAIL: string;      // owner inbox (send_email binding, verified)
  NOTIFY_FROM: string;       // verified sender for the binding
  REFUND_DAYS?: string;      // default 14
  GUARANTEE?: string;        // "1" once Eryeza approves the 7-day/14-day guarantee; shows it in receipts and on the order page
  TEST_MODE?: string;
  LEAD_DAILY_CAP?: string;   // max new Day 1 sign-ups a day, keeps email quota for receipts (default 60)        // "1" while using Flutterwave test keys
}

const FLW = "https://api.flutterwave.com/v3";
const TIMEOUT = 10000;
const EDITION_IDS = Object.keys(EDITIONS) as EditionId[];

/* ---------------------------------------------------------------- helpers */

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}

function html(body: string, status = 200): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Orders</title><style>body{font:16px/1.6 system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;color:#2a2420;background:#faf7f2}button{font:inherit;padding:10px 18px;border-radius:8px;border:0;background:#7B3F2E;color:#fff;cursor:pointer}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border-bottom:1px solid #e5dccf;padding:6px 4px;text-align:left}</style></head><body>${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "X-Frame-Options": "DENY", "Content-Security-Policy": "frame-ancestors 'none'" } },
  );
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().replace(/[\u0000-\u001f]/g, "").slice(0, max) : "";
}

/** A person's name: letters, spaces and common punctuation only (no links or markup, which would turn emails into phishing). */
function cleanName(v: unknown, max: number): string {
  const n = clean(v, max);
  return /(:\/\/|www\.|@|<|>|\.(com|net|org|xyz|io)\b)/i.test(n) ? "" : n;
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 200;
}

function timed(init: RequestInit = {}): RequestInit {
  return { ...init, signal: AbortSignal.timeout(TIMEOUT) };
}

function randomId(len: number, alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
}

function token(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(key: string, msg: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time string compare (secrets and signatures). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function ipHash(env: Env, request: Request): Promise<string> {
  const raw = request.headers.get("CF-Connecting-IP") || "";
  const ip = raw.includes(":") ? raw.split(":").slice(0, 4).join(":") : raw; // IPv6 counted per /64
  return ip ? (await sha256Hex(`${env.IP_SALT || "eryeza"}:${ip}`)).slice(0, 32) : "";
}

function sameOrigin(env: Env, request: Request): boolean {
  const origin = request.headers.get("Origin") || "";
  const site = new URL(env.SITE);
  return origin === site.origin || origin === `${site.protocol}//www.${site.host}`;
}

/** Allows `limit` actions of `kind` per salted IP per UTC hour. */
async function rateOk(env: Env, ip: string, kind: string, limit: number, strict = false): Promise<boolean> {
  if (!ip) return true;
  const hour = new Date().toISOString().slice(0, 13);
  try {
    const row = await env.DB.prepare(
      "INSERT INTO checkout_rate (ipHash, hour, kind, count) VALUES (?, ?, ?, 1) ON CONFLICT(ipHash, hour, kind) DO UPDATE SET count = count + 1 RETURNING count",
    ).bind(ip, hour, kind).first<{ count: number }>();
    return (row?.count ?? 0) <= limit;
  } catch {
    return !strict;
  }
}

interface Order {
  id: string; token: string; createdAt: string; edition: EditionId; addons: string; currency: Currency; amount: number;
  name: string; email: string; phone: string; country: string; letterOptIn: number; status: string;
  flwTxId: string | null; paidAt: string | null; paidAmount: number | null; paidCurrency: string | null; channel: string | null;
  emailStatus: string; capiStatus: string; listStatus: string; notifyStatus: string;
  fbp: string; fbc: string; userAgent: string; ipHash: string; source: string; downloads: number;
  refundReason: string; refundAt: string | null; note: string;
}

const getByToken = (env: Env, t: string) => env.DB.prepare("SELECT * FROM orders WHERE token = ?").bind(t).first<Order>();
const getById = (env: Env, id: string) => env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first<Order>();

const orderUrl = (env: Env, o: Order) => `${env.SITE}/order/?t=${encodeURIComponent(o.token)}`;

/* --------------------------------------------------------- Flutterwave */

interface FlwTx {
  id: number; tx_ref: string; status: string; amount: number; charged_amount?: number; currency: string;
  payment_type?: string; customer?: { email?: string };
}

async function flwVerify(env: Env, by: { id?: string; ref?: string }): Promise<FlwTx | null> {
  if (!env.FLW_SECRET_KEY) throw new Error("FLW_SECRET_KEY not set");
  const url = by.id
    ? `${FLW}/transactions/${encodeURIComponent(by.id)}/verify`
    : `${FLW}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(by.ref || "")}`;
  const res = await fetch(url, timed({ headers: { Authorization: `Bearer ${env.FLW_SECRET_KEY}` } }));
  if (res.status === 404 || res.status === 400) return null; // not found / not yet paid
  if (!res.ok) throw new Error(`flw verify ${res.status}`);
  const body = (await res.json()) as { status?: string; data?: FlwTx };
  return body.status === "success" && body.data ? body.data : null;
}

/**
 * The one place an order becomes paid. Matches Flutterwave's record against the
 * order the server created, then moves the row out of 'pending' exactly once.
 * Returns the fresh order.
 */
async function settle(env: Env, ctx: ExecutionContext, order: Order, tx: FlwTx | null): Promise<Order> {
  if (order.status !== "pending" || !tx) return order;
  if (tx.tx_ref !== order.id) return order;
  if (tx.status !== "successful") {
    if (tx.status === "failed") {
      await env.DB.prepare("UPDATE orders SET note = ? WHERE id = ? AND status = 'pending'").bind(`flw:${tx.status}`, order.id).run();
    }
    return order;
  }
  if (tx.currency !== order.currency || Number(tx.amount) < order.amount) {
    const m = await env.DB.prepare("UPDATE orders SET status = 'mismatch', note = ? WHERE id = ? AND status = 'pending'")
      .bind(`mismatch: paid ${tx.amount} ${tx.currency}, expected ${order.amount} ${order.currency}, flw ${tx.id}`, order.id).run();
    if (m.meta.changes === 1) await notifyOwner(env, `Payment mismatch on ${order.id}`, `Flutterwave transaction ${tx.id} paid ${tx.amount} ${tx.currency}; the order expected ${order.amount} ${order.currency}. Files were NOT released. Check the Flutterwave dashboard.`);
    return order;
  }
  const now = new Date().toISOString();
  const res = await env.DB.prepare(
    "UPDATE orders SET status = 'paid', flwTxId = ?, paidAt = ?, paidAmount = ?, paidCurrency = ?, channel = ? WHERE id = ? AND status = 'pending'",
  ).bind(String(tx.id), now, tx.amount, tx.currency, tx.payment_type || "", order.id).run();
  const fresh = (await getById(env, order.id))!;
  if (res.meta.changes === 1) ctx.waitUntil(fulfil(env, fresh));
  return fresh;
}

/* ------------------------------------------------------------ fulfil */

async function fulfil(env: Env, o: Order): Promise<void> {
  const tasks: [string, Promise<string>][] = [
    ["emailStatus", sendReceipt(env, o)],
    ["capiStatus", sendCapi(env, o)],
    ["listStatus", addToList(env, o)],
    ["notifyStatus", notifyOwner(env, `New sale: ${EDITIONS[o.edition].name}, ${formatMoney(o.amount, o.currency)}`,
      `${o.name} <${o.email}>${o.phone ? `, ${o.phone}` : ""}\nCountry: ${o.country || "?"}\nPaid with: ${o.channel || "?"}\nOrder: ${o.id}\nSource: ${o.source || "direct"}\nLetter opt-in: ${o.letterOptIn ? "yes" : "no"}`)],
    ["note", prestamp(env, o)],
  ];
  const results = await Promise.allSettled(tasks.map(([, p]) => p));
  const sets: string[] = [];
  const vals: string[] = [];
  results.forEach((r, i) => {
    const col = tasks[i][0];
    const v = r.status === "fulfilled" ? r.value : `error:${String((r.reason as Error)?.message || r.reason).slice(0, 150)}`;
    if (col === "note" && v === "ok") return;
    sets.push(`${col} = ?`);
    vals.push(v.slice(0, 300));
  });
  if (sets.length) await env.DB.prepare(`UPDATE orders SET ${sets.join(", ")} WHERE id = ?`).bind(...vals, o.id).run();
}

async function resend(env: Env, to: string, subject: string, text: string, htmlBody: string): Promise<string> {
  if (!env.RESEND_API_KEY) return "skipped:no-key";
  const res = await fetch("https://api.resend.com/emails", timed({
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY.trim()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], reply_to: env.REPLY_TO, subject, text, html: htmlBody }),
  }));
  return res.ok ? "ok" : `error:${res.status}`;
}

function receiptBody(env: Env, o: Order): { text: string; html: string } {
  const ed = EDITIONS[o.edition];
  const link = orderUrl(env, o);
  const first = o.name.split(" ")[0] || "friend";
  const text = [
    `Dear ${first},`,
    ``,
    `Thank you for getting ${ed.name} of The Influential Spirit. Your files are ready.`,
    ``,
    `Open your books: ${link}`,
    ``,
    `That page is yours. You can return to it at any time to download again or to listen to the audio. Please keep this email.`,
    ``,
    `Begin with Start Here, then read Day 1 tomorrow morning. Ten to fifteen minutes is enough.`,
    ``,
    `Order ${o.id}, ${formatMoney(o.amount, o.currency)}.`,
    env.GUARANTEE === "1" ? `If the book is not helping you after the first seven days, you can ask for a refund from your order page within ${env.REFUND_DAYS || "14"} days of your order.` : `Questions? Reply to this email.`,
    ``,
    `May the Lord meet you in these thirty mornings.`,
    `Eryeza Kalalu`,
  ].join("\n");
  const htmlBody = `<div style="font:16px/1.6 Georgia,serif;color:#2a2420;max-width:560px">
<p>Dear ${esc(first)},</p>
<p>Thank you for getting <strong>${esc(ed.name)}</strong> of <em>The Influential Spirit</em>. Your files are ready.</p>
<p><a href="${esc(link)}" style="display:inline-block;background:#7B3F2E;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-family:system-ui,sans-serif">Open your books</a></p>
<p>That page is yours. You can return to it at any time to download again or to listen to the audio. Please keep this email.</p>
<p>Begin with Start Here, then read Day 1 tomorrow morning. Ten to fifteen minutes is enough.</p>
<p style="font-size:14px;color:#6b5f55">Order ${esc(o.id)}, ${esc(formatMoney(o.amount, o.currency))}. ${env.GUARANTEE === "1" ? `If the book is not helping you after the first seven days, you can ask for a refund from your order page within ${esc(env.REFUND_DAYS || "14")} days of your order.` : "Questions? Reply to this email."}</p>
<p>May the Lord meet you in these thirty mornings.<br>Eryeza Kalalu</p></div>`;
  return { text, html: htmlBody };
}

async function sendReceipt(env: Env, o: Order): Promise<string> {
  const b = receiptBody(env, o);
  return resend(env, o.email, "Your copy of The Influential Spirit", b.text, b.html);
}

async function notifyOwner(env: Env, subject: string, text: string): Promise<string> {
  try {
    if (env.EMAIL) {
      await env.EMAIL.send({ to: env.NOTIFY_EMAIL, from: env.NOTIFY_FROM, subject, text });
      return "ok";
    }
    return await resend(env, env.NOTIFY_EMAIL, subject, text, `<pre style="font:14px/1.5 system-ui">${esc(text)}</pre>`);
  } catch (e) {
    return `error:${(e as Error).message}`.slice(0, 120);
  }
}

/** Meta Conversions API: the Purchase event, de-duplicated with the browser event by event_id = order id. */
async function sendCapi(env: Env, o: Order): Promise<string> {
  if (!env.META_PIXEL_ID || !env.META_CAPI_TOKEN) return "skipped:no-config";
  const user: Record<string, unknown> = { em: [await sha256Hex(o.email.toLowerCase())] };
  if (o.phone) user.ph = [await sha256Hex(o.phone.replace(/\D/g, ""))];
  const fn = o.name.split(" ")[0]?.toLowerCase();
  if (fn) user.fn = [await sha256Hex(fn)];
  if (o.country) user.country = [await sha256Hex(o.country.toLowerCase())];
  if (o.fbp) user.fbp = o.fbp;
  if (o.fbc) user.fbc = o.fbc;
  if (o.userAgent) user.client_user_agent = o.userAgent;
  const body = {
    data: [{
      event_name: "Purchase",
      event_time: Math.floor(Date.parse(o.paidAt || o.createdAt) / 1000),
      event_id: o.id,
      action_source: "website",
      event_source_url: `${env.SITE}/influential-spirit/`,
      user_data: user,
      custom_data: { currency: o.currency, value: o.amount, content_ids: [o.edition], content_type: "product", order_id: o.id },
    }],
  };
  const v = env.META_GRAPH_VERSION || "v24.0";
  const res = await fetch(`https://graph.facebook.com/${v}/${env.META_PIXEL_ID}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, timed({
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  }));
  return res.ok ? "ok" : `error:${res.status}`;
}

/** Buyers who ticked the box join Eryeza Writes (Beehiiv). */
async function addToList(env: Env, o: Order): Promise<string> {
  if (!o.letterOptIn) return "n/a";
  if (!env.BEEHIIV_API_KEY || !env.BEEHIIV_PUB_ID) return "skipped:no-key";
  const res = await fetch(`https://api.beehiiv.com/v2/publications/${encodeURIComponent(env.BEEHIIV_PUB_ID)}/subscriptions`, timed({
    method: "POST",
    headers: { Authorization: `Bearer ${env.BEEHIIV_API_KEY.trim()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: o.email, reactivate_existing: false, send_welcome_email: true,
      utm_source: "book-purchase", utm_medium: "checkout", utm_campaign: "influential-spirit",
      custom_fields: [{ name: "First Name", value: o.name.split(" ")[0] || "" }],
    }),
  }));
  return res.ok ? "ok" : `error:${res.status}`;
}

/* ------------------------------------------------------------ PDFs */

const stampedKey = (o: Order, fileId: string) => `orders/${o.id}/${fileId}.pdf`;

async function stamp(env: Env, o: Order, fileId: string, sourceKey: string): Promise<R2ObjectBody | null> {
  const cached = await env.BOOKS.get(stampedKey(o, fileId));
  if (cached) return cached;
  const src = await env.BOOKS.get(sourceKey);
  if (!src) return null;
  const pdf = await PDFDocument.load(await src.arrayBuffer(), { updateMetadata: false });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const date = (o.paidAt || o.createdAt).slice(0, 10);
  // Helvetica covers only Western characters: strip accents (ọ to o) and replace anything else, so every name can be stamped.
  const safe = (v: string) => v.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "?");
  const line = safe(`Licensed to ${o.name} (${o.email}), order ${o.id}, ${date}. For personal use. Please do not share this file.`);
  for (const page of pdf.getPages()) {
    const { width } = page.getSize();
    const size = 6.5;
    const w = font.widthOfTextAtSize(line, size);
    page.drawText(line, { x: Math.max(12, (width - w) / 2), y: 10, size, font, color: rgb(0.45, 0.42, 0.4), opacity: 0.85 });
  }
  pdf.setSubject(`Licensed to ${o.email}, order ${o.id}`);
  pdf.setKeywords([o.id, o.email]);
  const bytes = await pdf.save({ useObjectStreams: true });
  await env.BOOKS.put(stampedKey(o, fileId), bytes, { httpMetadata: { contentType: "application/pdf" } });
  return env.BOOKS.get(stampedKey(o, fileId));
}

/** Prepares the stamped PDFs straight after payment, so the first download is instant. */
async function prestamp(env: Env, o: Order): Promise<string> {
  for (const f of FILES[o.edition]) if (f.stamp) { try { await stamp(env, o, f.id, f.key); } catch { /* stamped on first download, or served plain */ } }
  return "ok";
}

/* ------------------------------------------------------------ handlers */

/** While TEST_MODE is "1" only a browser holding the owner's test cookie may start a payment, so test keys can never release real files to the public. */
/**
 * TEST_MODE "1": checkout is open only to a browser holding the owner's tester cookie
 * (set by /api/admin/tester), and every price becomes a token amount, so real
 * mobile money and card payments can be tested cheaply before launch.
 */
const TEST_AMOUNT: Record<Currency, number> = { UGX: 1000, KES: 50, TZS: 1000, RWF: 500, ZMW: 10, GHS: 5, NGN: 500, XOF: 500, XAF: 500, ZAR: 10, USD: 1 };

async function testGate(env: Env, request: Request): Promise<Response | null> {
  if (env.TEST_MODE !== "1") return null;
  const cookie = request.headers.get("Cookie") || "";
  const want = env.ADMIN_KEY ? await hmac(env.ADMIN_KEY, "tester") : "";
  const got = /(?:^|; )ek_tester=([a-f0-9]{64})/.exec(cookie)?.[1] || "";
  return want && safeEqual(got, want) ? null : json({ ok: false, error: "Checkout opens soon. Please try again shortly." }, 503);
}

async function start(env: Env, request: Request): Promise<Response> {
  if (!sameOrigin(env, request)) return json({ ok: false, error: "Please buy from eryezakalalu.com." }, 403);
  const gate = await testGate(env, request);
  if (gate) return gate;
  const ip = await ipHash(env, request);
  if (!(await rateOk(env, ip, "start", 20))) return json({ ok: false, error: "Too many attempts. Please wait a few minutes and try again." }, 429);
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false, error: "Please fill in the form and try again." }, 422); }

  const edition = clean(b.edition, 20) as EditionId;
  if (!EDITION_IDS.includes(edition)) return json({ ok: false, error: "Please choose an edition." }, 422);
  const cf = (request as unknown as { cf?: { country?: string; continent?: string } }).cf || {};
  const country = (cf.country || "").toUpperCase();
  const asked = clean(b.currency, 3).toUpperCase() as Currency;
  const currency: Currency = CURRENCIES.includes(asked) ? asked : currencyFor(country);
  if (currency !== "USD" && cf.continent && cf.continent !== "AF") {
    return json({ ok: false, error: "Local African prices are for buyers in Africa. Please choose Rest of the world (USD)." }, 422);
  }
  const name = cleanName(b.name, 80);
  const email = clean(b.email, 200).toLowerCase();
  const phoneRaw = clean(b.phone, 24).replace(/[\s()-]/g, "");
  const phone = /^\+?[0-9]{7,15}$/.test(phoneRaw) ? phoneRaw : "";
  if (name.length < 2) return json({ ok: false, error: "Please add your name." }, 422);
  if (!isEmail(email)) return json({ ok: false, error: "Please check your email address. Your books are sent there." }, 422);

  const addons = (Array.isArray(b.addons) ? b.addons : []).map((a) => clean(a, 20))
    .filter((a): a is keyof typeof ADDONS => a in ADDONS && ADDONS[a as keyof typeof ADDONS].enabled);
  let amount = env.TEST_MODE === "1" ? TEST_AMOUNT[currency] : priceOf(edition, currency);
  for (const a of addons) amount += ADDONS[a].price[currency];

  const id = `IS-${randomId(8)}`;
  const t = token();
  const source = clean(b.source, 200);
  await env.DB.prepare(
    `INSERT INTO orders (id, token, createdAt, edition, addons, currency, amount, name, email, phone, country, letterOptIn, fbp, fbc, userAgent, ipHash, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(id, t, new Date().toISOString(), edition, addons.join(","), currency, amount, name, email, phone, country,
    b.letterOptIn === true ? 1 : 0, clean(b.fbp, 120), clean(b.fbc, 200), clean(request.headers.get("User-Agent"), 300), ip, source).run();

  return json({
    ok: true,
    order: { id, token: t, amount, currency, display: formatMoney(amount, currency), edition: EDITIONS[edition].name },
    flutterwave: {
      public_key: env.FLW_PUBLIC_KEY,
      tx_ref: id,
      amount,
      currency,
      payment_options: PAYMENT_OPTIONS[currency],
      customer: { email, name, phone_number: phone || undefined },
      customizations: { title: "The Influential Spirit", description: EDITIONS[edition].name, logo: `${env.SITE}/apple-touch-icon.png` },
      meta: { order: id, edition },
    },
  });
}

/** What the order page shows. Never exposes another order, the phone number or provider notes. */
async function publicOrder(env: Env, o: Order): Promise<Record<string, unknown>> {
  const paid = o.status === "paid" || o.status === "refund_requested";
  const base = {
    id: o.id, status: o.status, edition: o.edition, editionName: EDITIONS[o.edition].name,
    amount: o.amount, currency: o.currency, display: formatMoney(o.amount, o.currency),
    name: o.name.split(" ")[0], email: o.email, paidAt: o.paidAt,
    refundable: env.GUARANTEE === "1" && o.status === "paid" && withinRefundWindow(env, o),
  };
  if (!paid) return base;
  const files = FILES[o.edition].map((f) => ({ id: f.id, label: f.label, type: f.type, url: `/dl/${o.token}/${f.id}` }));
  const audio = [];
  for (const coll of AUDIO[o.edition]) {
    const listed = await env.BOOKS.list({ prefix: coll.prefix, limit: 100 });
    const chapters = listed.objects
      .filter((x) => x.key.endsWith(".mp3"))
      .map((x) => {
        const name = x.key.slice(coll.prefix.length);
        return { name, title: name.replace(/\.mp3$/, "").replace(/^\d+[-_ ]?/, "").replace(/[-_]/g, " "), url: `/dl/${o.token}/audio/${coll.id}/${encodeURIComponent(name)}`, size: x.size };
      });
    audio.push({ id: coll.id, label: coll.label, chapters, zipUrl: `/dl/${o.token}/audio/${coll.id}/all.zip` });
  }
  return { ...base, files, audio };
}

function withinRefundWindow(env: Env, o: Order): boolean {
  const days = Number(env.REFUND_DAYS || "14");
  return Boolean(o.paidAt) && Date.now() - Date.parse(o.paidAt!) < days * 86400000;
}

async function orderStatus(env: Env, ctx: ExecutionContext, url: URL): Promise<Response> {
  const t = clean(url.searchParams.get("t"), 64);
  if (!t) return json({ ok: false, error: "Missing order link." }, 400);
  let o = await getByToken(env, t);
  if (!o) return json({ ok: false, error: "We could not find this order. Use the link in your email, or ask us to resend it." }, 404);
  if (o.status === "pending" && Date.now() - Date.parse(o.createdAt) < 7 * 86400000) {
    try { o = await settle(env, ctx, o, await flwVerify(env, { ref: o.id })); } catch { /* keep pending; the page retries */ }
  }
  return json({ ok: true, order: await publicOrder(env, o) });
}

async function confirm(env: Env, ctx: ExecutionContext, request: Request): Promise<Response> {
  if (!sameOrigin(env, request)) return json({ ok: false }, 403);
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 422); }
  const o = await getByToken(env, clean(b.t, 64));
  if (!o) return json({ ok: false, error: "Order not found." }, 404);
  const txId = clean(String(b.transaction_id ?? ""), 20);
  let fresh = o;
  try {
    fresh = await settle(env, ctx, o, await flwVerify(env, /^\d+$/.test(txId) ? { id: txId } : { ref: o.id }));
  } catch { /* the order page polls again */ }
  return json({ ok: true, order: await publicOrder(env, fresh) });
}

async function webhook(env: Env, ctx: ExecutionContext, request: Request): Promise<Response> {
  const sent = request.headers.get("verif-hash") || "";
  if (!env.FLW_SECRET_HASH || !safeEqual(sent, env.FLW_SECRET_HASH)) return new Response("unauthorised", { status: 401 });
  let b: { event?: string; data?: { id?: number; tx_ref?: string } };
  try { b = await request.json(); } catch { return new Response("bad request", { status: 400 }); }
  const ref = b.data?.tx_ref || "";
  try {
    if (ref.startsWith("GV-")) {
      const g = await giftById(env, ref);
      if (g && g.status === "pending") await settleGift(env, ctx, g, await flwVerify(env, b.data?.id ? { id: String(b.data.id) } : { ref }));
      else if (!g && b.data?.id) await recordRenewal(env, ctx, String(b.data.id)); // e.g. GV-XXXX_PMCKDU_1
      return new Response("ok");
    }
    if (!ref.startsWith("IS-") && b.event === "charge.completed" && b.data?.id) {
      await recordRenewal(env, ctx, String(b.data.id)); // monthly gift renewal (Flutterwave's own tx_ref)
      return new Response("ok");
    }
  } catch (e) {
    console.error("webhook", (e as Error).message);
    return new Response("retry", { status: 500 });
  }
  const o = ref ? await getById(env, ref) : null;
  if (o && o.status === "pending") {
    // Never trust the webhook body: ask Flutterwave again with the secret key.
    try { await settle(env, ctx, o, await flwVerify(env, b.data?.id ? { id: String(b.data.id) } : { ref })); } catch (e) {
      console.error("webhook", (e as Error).message);
    return new Response("retry", { status: 500 }); // Flutterwave retries
    }
  }
  return new Response("ok");
}

async function resendLinks(env: Env, request: Request): Promise<Response> {
  if (!sameOrigin(env, request)) return json({ ok: false }, 403);
  const ip = await ipHash(env, request);
  if (!(await rateOk(env, ip, "resend", 5))) return json({ ok: false, error: "Please wait an hour before asking again." }, 429);
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 422); }
  const email = clean(b.email, 200).toLowerCase();
  // Same answer whether or not the email has orders, so the form cannot be used to check who bought.
  const reply = json({ ok: true, message: "If that email has an order, the links are on their way. Please check your inbox and spam folder." });
  if (!isEmail(email)) return reply;
  const rows = await env.DB.prepare("SELECT * FROM orders WHERE email = ? AND status IN ('paid','refund_requested') ORDER BY createdAt DESC LIMIT 5").bind(email).all<Order>();
  for (const o of rows.results) await sendReceipt(env, o);
  return reply;
}

async function refundRequest(env: Env, request: Request): Promise<Response> {
  if (!sameOrigin(env, request)) return json({ ok: false }, 403);
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 422); }
  const o = await getByToken(env, clean(b.t, 64));
  if (!o) return json({ ok: false, error: "Order not found." }, 404);
  if (env.GUARANTEE !== "1") return json({ ok: false, error: "Please write to books@eryezakalalu.com." }, 409);
  if (o.status !== "paid") return json({ ok: false, error: o.status === "refund_requested" ? "Your request is already with us." : "This order cannot be refunded online. Please write to books@eryezakalalu.com." }, 409);
  if (!withinRefundWindow(env, o)) return json({ ok: false, error: `The ${env.REFUND_DAYS || "14"}-day refund period has passed. Please write to books@eryezakalalu.com.` }, 409);
  // One refund per email address, ever.
  const prior = await env.DB.prepare("SELECT COUNT(*) AS n FROM orders WHERE email = ? AND status IN ('refunded','refund_manual')").bind(o.email).first<{ n: number }>();
  if ((prior?.n ?? 0) > 0) return json({ ok: false, error: "A refund was already given to this email address. Please write to books@eryezakalalu.com." }, 409);
  const reason = clean(b.reason, 500);
  const req = await env.DB.prepare("UPDATE orders SET status = 'refund_requested', refundReason = ? WHERE id = ? AND status = 'paid'").bind(reason, o.id).run();
  if (req.meta.changes !== 1) return json({ ok: true, message: "Your request is already with us." });
  const sig = env.ADMIN_KEY ? await hmac(env.ADMIN_KEY, `refund:${o.id}`) : "";
  const dl = await env.DB.prepare("SELECT COUNT(*) AS n FROM downloads WHERE orderId = ?").bind(o.id).first<{ n: number }>();
  await notifyOwner(env, `Refund request: ${o.id}, ${formatMoney(o.amount, o.currency)}`,
    `${o.name} <${o.email}> asked for a refund.\nEdition: ${EDITIONS[o.edition].name}\nPaid: ${o.paidAt} with ${o.channel}\nDownloads so far: ${dl?.n ?? 0}\nReason: ${reason || "(none given)"}\n\nApprove or decline: ${env.SITE}/api/admin/refund?o=${o.id}&s=${sig}`);
  await resend(env, o.email, "We received your refund request",
    `Dear ${o.name.split(" ")[0]},\n\nWe have received your request for order ${o.id}. You will hear from us within two working days.\n\nEryeza Kalalu`,
    `<p>Dear ${esc(o.name.split(" ")[0])},</p><p>We have received your request for order ${esc(o.id)}. You will hear from us within two working days.</p><p>Eryeza Kalalu</p>`);
  return json({ ok: true, message: "Your request has been sent. You will hear from us within two working days." });
}

/** Owner-only page. GET shows the order and two buttons (email scanners only GET); POST acts. */
async function adminRefund(env: Env, request: Request, url: URL): Promise<Response> {
  if (!env.ADMIN_KEY) return html("<p>Not configured.</p>", 503);
  const id = clean(url.searchParams.get("o"), 20);
  const s = clean(url.searchParams.get("s"), 64);
  if (!id || !safeEqual(s, await hmac(env.ADMIN_KEY, `refund:${id}`))) return html("<p>This link is not valid.</p>", 403);
  const o = await getById(env, id);
  if (!o) return html("<p>Order not found.</p>", 404);
  if (request.method === "GET") {
    return html(`<h2>Refund ${esc(o.id)}</h2><p>${esc(o.name)} &lt;${esc(o.email)}&gt;<br>${esc(EDITIONS[o.edition].name)}, ${esc(formatMoney(o.amount, o.currency))}, paid ${esc(o.paidAt || "")} with ${esc(o.channel || "")}<br>Status: <b>${esc(o.status)}</b><br>Reason: ${esc(o.refundReason || "(none)")}</p>
<form method="post"><input type="hidden" name="do" value="approve"><button>Approve and refund</button></form><br>
<form method="post"><input type="hidden" name="do" value="decline"><button style="background:#6b5f55">Decline and keep access</button></form>`);
  }
  const form = await request.formData();
  const action = form.get("do");
  if (o.status !== "refund_requested") return html(`<p>Nothing to do. Status is ${esc(o.status)}.</p>`);
  if (action === "decline") {
    await env.DB.prepare("UPDATE orders SET status = 'paid' WHERE id = ? AND status = 'refund_requested'").bind(o.id).run();
    return html("<p>Declined. The buyer keeps access. Please write to them personally.</p>");
  }
  const claim = await env.DB.prepare("UPDATE orders SET status = 'refund_processing' WHERE id = ? AND status = 'refund_requested'").bind(o.id).run();
  if (claim.meta.changes !== 1) return html("<p>This refund is already being processed.</p>");
  let status = "refund_manual";
  let note = "";
  if (env.FLW_SECRET_KEY && o.flwTxId) {
    const res = await fetch(`${FLW}/transactions/${encodeURIComponent(o.flwTxId)}/refund`, timed({
      method: "POST",
      headers: { Authorization: `Bearer ${env.FLW_SECRET_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: o.paidAmount ?? o.amount }),
    }));
    const body = (await res.json().catch(() => ({}))) as { status?: string; message?: string };
    if (res.ok && body.status === "success") status = "refunded";
    else note = `flw refund ${res.status}: ${body.message || ""}`.slice(0, 200);
  }
  await env.DB.prepare("UPDATE orders SET status = ?, refundAt = ?, note = ? WHERE id = ? AND status = 'refund_processing'").bind(status, new Date().toISOString(), note, o.id).run();
  await resend(env, o.email, "Your refund",
    `Dear ${o.name.split(" ")[0]},\n\nYour refund for order ${o.id} has been ${status === "refunded" ? "sent. Card refunds can take 5 to 10 working days to appear" : "approved. We will send it to you shortly"}. Your download links are now closed.\n\nThank you for reading. May the Lord keep you.\nEryeza Kalalu`,
    `<p>Dear ${esc(o.name.split(" ")[0])},</p><p>Your refund for order ${esc(o.id)} has been ${status === "refunded" ? "sent. Card refunds can take 5 to 10 working days to appear" : "approved. We will send it to you shortly"}. Your download links are now closed.</p><p>Thank you for reading. May the Lord keep you.<br>Eryeza Kalalu</p>`);
  return html(status === "refunded"
    ? "<p>Refunded through Flutterwave. Access is closed and the buyer has been told.</p>"
    : `<p>Flutterwave could not refund this automatically (${esc(note || "no transaction id")}). Access is closed. Please send ${esc(formatMoney(o.paidAmount ?? o.amount, o.currency))} back to ${esc(o.phone || o.email)} yourself, by mobile money or bank.</p>`);
}

/* ------------------------------------------------------------ downloads */

async function serveR2(request: Request, obj: R2ObjectBody | R2Object | null, filename: string, inline: boolean): Promise<Response> {
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("ETag", obj.httpEtag);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Robots-Tag", "noindex");
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  headers.set("Content-Disposition", `${inline ? "inline" : "attachment"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  if (!("body" in obj)) return new Response(null, { status: 412, headers });
  const r = (obj as R2ObjectBody & { range?: { offset?: number; length?: number; suffix?: number } }).range;
  if (r && request.headers.has("Range")) {
    const range = { offset: r.suffix !== undefined ? obj.size - r.suffix : (r.offset ?? 0), length: r.suffix ?? r.length };
    const end = range.offset + (range.length ?? obj.size - range.offset) - 1;
    headers.set("Content-Range", `bytes ${range.offset}-${end}/${obj.size}`);
    headers.set("Content-Length", String(end - range.offset + 1));
    return new Response(request.method === "HEAD" ? null : obj.body, { status: 206, headers });
  }
  headers.set("Content-Length", String(obj.size));
  return new Response(request.method === "HEAD" ? null : obj.body, { status: 200, headers });
}

async function download(env: Env, request: Request, ctx: ExecutionContext, parts: string[]): Promise<Response> {
  const [t, fileId, coll, name] = parts;
  const o = t ? await getByToken(env, t) : null;
  if (!o || (o.status !== "paid" && o.status !== "refund_requested")) {
    return new Response("This download link is not active. Use the link in your email, or write to books@eryezakalalu.com.", { status: 403 });
  }
  const ip = await ipHash(env, request);
  const log = (id: string) => ctx.waitUntil(env.DB.batch([
    env.DB.prepare("INSERT INTO downloads (orderId, fileId, at, ipHash) VALUES (?, ?, ?, ?)").bind(o.id, id, new Date().toISOString(), ip),
    env.DB.prepare("UPDATE orders SET downloads = downloads + 1 WHERE id = ?").bind(o.id),
  ]).then(() => undefined));

  if (fileId === "audio") {
    const c = AUDIO[o.edition].find((x) => x.id === coll);
    if (!c || !name) return new Response("Not found", { status: 404 });
    let file = "";
    try { file = decodeURIComponent(name); } catch { return new Response("Not found", { status: 404 }); }
    if (file.includes("/") || file.includes("..")) return new Response("Not found", { status: 404 });
    const key = file === "all.zip" ? `${c.prefix.replace(/\/$/, "")}.zip` : `${c.prefix}${file}`;
    if (!request.headers.has("Range") || request.headers.get("Range")?.startsWith("bytes=0-")) log(`${coll}/${file}`);
    const obj = await env.BOOKS.get(key, { range: request.headers });
    const pretty = file === "all.zip" ? `The_Influential_Spirit_${coll}.zip` : file;
    return serveR2(request, obj, pretty, file !== "all.zip");
  }

  const f = FILES[o.edition].find((x) => x.id === fileId);
  if (!f) return new Response("Not found", { status: 404 });
  log(f.id);
  const filename = f.key.split("/").pop()!;
  if (f.stamp) {
    try {
      if (!(await stamp(env, o, f.id, f.key))) return new Response("Not found", { status: 404 });
      return await serveR2(request, await env.BOOKS.get(stampedKey(o, f.id), { range: request.headers }), filename, false);
    } catch (e) {
      // A PDF that cannot be stamped is still delivered; the owner is told.
      ctx.waitUntil(notifyOwner(env, `Stamping failed for ${o.id}`, `${f.key}: ${(e as Error).message}`).then(() => undefined));
      return serveR2(request, await env.BOOKS.get(f.key, { range: request.headers }), filename, false);
    }
  }
  return serveR2(request, await env.BOOKS.get(f.key, { range: request.headers }), filename, false);
}

/* ------------------------------------------------------------ giving */

interface Gift {
  id: string; token: string; createdAt: string; kind: string; frequency: "once" | "monthly"; currency: Currency; amount: number; coverFee: number;
  name: string; email: string; phone: string; country: string; note: string; status: string; planId: string | null;
  flwTxId: string | null; paidAt: string | null; channel: string | null; fbp: string; fbc: string; userAgent: string; source: string;
}

const giftByToken = (env: Env, t: string) => env.DB.prepare("SELECT * FROM gifts WHERE token = ?").bind(t).first<Gift>();
const giftById = (env: Env, id: string) => env.DB.prepare("SELECT * FROM gifts WHERE id = ?").bind(id).first<Gift>();

/** One Flutterwave monthly plan per currency and amount, created the first time it is needed. */
async function planFor(env: Env, currency: Currency, amount: number): Promise<string> {
  const k = `${currency}:${amount}`;
  const row = await env.DB.prepare("SELECT planId FROM plans WHERE k = ?").bind(k).first<{ planId: string }>();
  if (row) return row.planId;
  if (!env.FLW_SECRET_KEY) throw new Error("no key");
  const res = await fetch(`${FLW}/payment-plans`, timed({
    method: "POST",
    headers: { Authorization: `Bearer ${env.FLW_SECRET_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount, name: `Monthly partner gift ${currency} ${amount}`, interval: "monthly", currency }),
  }));
  const body = (await res.json().catch(() => ({}))) as { status?: string; data?: { id?: number } };
  if (!res.ok || body.status !== "success" || !body.data?.id) throw new Error(`plan ${res.status}`);
  const planId = String(body.data.id);
  await env.DB.prepare("INSERT OR IGNORE INTO plans (k, planId, createdAt) VALUES (?, ?, ?)").bind(k, planId, new Date().toISOString()).run();
  return planId;
}

async function giveStart(env: Env, request: Request): Promise<Response> {
  if (!sameOrigin(env, request)) return json({ ok: false, error: "Please give from eryezakalalu.com." }, 403);
  const gate = await testGate(env, request);
  if (gate) return gate;
  const ip = await ipHash(env, request);
  if (!(await rateOk(env, ip, "give", 20))) return json({ ok: false, error: "Too many attempts. Please wait a few minutes and try again." }, 429);
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false, error: "Please fill in the form and try again." }, 422); }

  const country = ((request as unknown as { cf?: { country?: string } }).cf?.country || "").toUpperCase();
  const asked = clean(b.currency, 3).toUpperCase() as Currency;
  const currency: Currency = CURRENCIES.includes(asked) ? asked : currencyFor(country);
  const frequency = b.frequency === "monthly" ? "monthly" : "once";
  const base = Math.floor(Number(b.amount));
  if (!Number.isFinite(base) || base < GIFT_MIN[currency]) return json({ ok: false, error: `The smallest gift online is ${formatMoney(GIFT_MIN[currency], currency)}.` }, 422);
  if (base > GIFT_MAX[currency]) return json({ ok: false, error: "For a gift of this size, please write to hello@eryezakalalu.com and we will arrange it with you." }, 422);
  const coverFee = b.coverFee === true;
  const amount = coverFee ? roundGift(base * (1 + FEE_COVER_RATE), currency) : base;
  const name = cleanName(b.name, 80);
  const email = clean(b.email, 200).toLowerCase();
  const phoneRaw = clean(b.phone, 24).replace(/[\s()-]/g, "");
  const phone = /^\+?[0-9]{7,15}$/.test(phoneRaw) ? phoneRaw : "";
  if (name.length < 2) return json({ ok: false, error: "Please add your name." }, 422);
  if (!isEmail(email)) return json({ ok: false, error: "Please check your email address. Your receipt is sent there." }, 422);

  let planId: string | null = null;
  if (frequency === "monthly" && !GIFT_PRESETS[currency].includes(base)) {
    return json({ ok: false, error: "Monthly gifts use the suggested amounts. Please choose one, or give your own amount once." }, 422);
  }
  if (frequency === "monthly") {
    try { planId = await planFor(env, currency, amount); } catch {
      return json({ ok: false, error: "Monthly giving is not available at this moment. Please give once, or try again later." }, 503);
    }
  }
  const id = `GV-${randomId(8)}`;
  const t = token();
  await env.DB.prepare(
    `INSERT INTO gifts (id, token, createdAt, frequency, currency, amount, coverFee, name, email, phone, country, note, planId, fbp, fbc, userAgent, ipHash, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(id, t, new Date().toISOString(), frequency, currency, amount, coverFee ? 1 : 0, name, email, phone, country, clean(b.note, 300), planId,
    clean(b.fbp, 120), clean(b.fbc, 200), clean(request.headers.get("User-Agent"), 300), ip, clean(b.source, 200)).run();

  return json({
    ok: true,
    gift: { id, token: t, amount, currency, display: formatMoney(amount, currency), frequency },
    flutterwave: {
      public_key: env.FLW_PUBLIC_KEY,
      tx_ref: id,
      amount,
      currency,
      payment_options: frequency === "monthly" ? MONTHLY_PAYMENT_OPTIONS : PAYMENT_OPTIONS[currency],
      ...(planId ? { payment_plan: planId } : {}),
      customer: { email, name, phone_number: phone || undefined },
      customizations: { title: "Support the ministry", description: frequency === "monthly" ? "Monthly gift" : "Gift", logo: `${env.SITE}/apple-touch-icon.png` },
      meta: { gift: id, frequency },
    },
  });
}

/** Marks a gift paid once, then thanks the giver and adds them to the partners list. */
async function settleGift(env: Env, ctx: ExecutionContext, g: Gift, tx: FlwTx | null): Promise<Gift> {
  if (g.status !== "pending" || !tx || tx.tx_ref !== g.id) return g;
  if (tx.status !== "successful") return g;
  if (tx.currency !== g.currency || Number(tx.amount) < g.amount) {
    const m = await env.DB.prepare("UPDATE gifts SET status = 'mismatch' WHERE id = ? AND status = 'pending'").bind(g.id).run();
    if (m.meta.changes === 1) await notifyOwner(env, `Gift mismatch on ${g.id}`, `Flutterwave ${tx.id} paid ${tx.amount} ${tx.currency}; expected ${g.amount} ${g.currency}.`);
    return g;
  }
  const res = await env.DB.prepare("UPDATE gifts SET status = 'paid', flwTxId = ?, paidAt = ?, channel = ? WHERE id = ? AND status = 'pending'")
    .bind(String(tx.id), new Date().toISOString(), tx.payment_type || "", g.id).run();
  const fresh = (await giftById(env, g.id))!;
  if (res.meta.changes === 1) ctx.waitUntil(thankGiver(env, fresh));
  return fresh;
}

async function upsertPartner(env: Env, g: Gift): Promise<{ manageToken: string; isNew: boolean }> {
  const existing = await env.DB.prepare("SELECT manageToken FROM partners WHERE email = ?").bind(g.email).first<{ manageToken: string }>();
  const now = g.paidAt || new Date().toISOString();
  if (existing) {
    await env.DB.prepare("UPDATE partners SET name = ?, lastGiftAt = ?, gifts = gifts + 1, monthly = CASE WHEN ? = 'monthly' THEN 1 ELSE monthly END, phone = CASE WHEN ? <> '' THEN ? ELSE phone END WHERE email = ?")
      .bind(g.name, now, g.frequency, g.phone, g.phone, g.email).run();
    return { manageToken: existing.manageToken, isNew: false };
  }
  const manageToken = token();
  await env.DB.prepare("INSERT INTO partners (email, name, phone, country, firstGiftAt, lastGiftAt, gifts, monthly, manageToken) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)")
    .bind(g.email, g.name, g.phone, g.country, now, now, g.frequency === "monthly" ? 1 : 0, manageToken).run();
  return { manageToken, isNew: true };
}

/** Partners join Eryeza Writes with the custom field Partner = yes (create that field once in Beehiiv). */
async function partnerToList(env: Env, g: Gift): Promise<string> {
  if (!env.BEEHIIV_API_KEY || !env.BEEHIIV_PUB_ID) return "skipped:no-key";
  const res = await fetch(`https://api.beehiiv.com/v2/publications/${encodeURIComponent(env.BEEHIIV_PUB_ID)}/subscriptions`, timed({
    method: "POST",
    headers: { Authorization: `Bearer ${env.BEEHIIV_API_KEY.trim()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: g.email, reactivate_existing: false, send_welcome_email: false,
      utm_source: "giving", utm_medium: g.frequency, utm_campaign: "partners",
      custom_fields: [{ name: "Partner", value: "yes" }, { name: "First Name", value: g.name.split(" ")[0] || "" }],
    }),
  }));
  return res.ok ? "ok" : `error:${res.status}`;
}

async function thankGiver(env: Env, g: Gift): Promise<void> {
  const { manageToken } = await upsertPartner(env, g);
  const first = g.name.split(" ")[0] || "friend";
  const monthly = g.frequency === "monthly";
  const manage = `${env.SITE}/give/manage/?t=${encodeURIComponent(manageToken)}`;
  const date = (g.paidAt || g.createdAt).slice(0, 10);
  const lines = [
    `Dear ${first},`,
    `Thank you for your ${monthly ? "monthly " : ""}gift of ${formatMoney(g.amount, g.currency)}. It helps Devotion in Season, the daily devotionals and the books reach working believers in Uganda and around the world.`,
    `You are now one of our ministry partners. Partners receive early access and special offers on new books and resources, beginning with Unedited Christmas.`,
    monthly ? `Your gift renews each month on your card. You can change or stop it at any time here: ${manage}` : `If you would like to give again, or to give monthly: ${env.SITE}/give/`,
    `Receipt: ${g.id}, ${date}, ${formatMoney(g.amount, g.currency)}${g.coverFee ? " (including payment fees)" : ""}.`,
    `May the Lord bless you and repay your kindness.\nEryeza Kalalu`,
  ];
  const text = lines.join("\n\n");
  const htmlBody = `<div style="font:16px/1.6 Georgia,serif;color:#2a2420;max-width:560px">${lines.map((l) => `<p>${esc(l).replace(/\n/g, "<br>").replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')}</p>`).join("")}</div>`;
  const results = await Promise.allSettled([
    resend(env, g.email, monthly ? "Thank you for your monthly gift" : "Thank you for your gift", text, htmlBody),
    partnerToList(env, g),
    notifyOwner(env, `New ${monthly ? "monthly " : ""}gift: ${formatMoney(g.amount, g.currency)}`,
      `${g.name} <${g.email}>${g.phone ? `, ${g.phone}` : ""}\nCountry: ${g.country || "?"}\nPaid with: ${g.channel || "?"}\nGift: ${g.id} (${g.kind})\nNote: ${g.note || "(none)"}`),
  ]);
  const v = (r: PromiseSettledResult<string>) => (r.status === "fulfilled" ? r.value : `error:${String((r.reason as Error)?.message).slice(0, 100)}`);
  await env.DB.batch([
    env.DB.prepare("UPDATE gifts SET emailStatus = ?, listStatus = ?, notifyStatus = ? WHERE id = ?").bind(v(results[0]), v(results[1]), v(results[2]), g.id),
    env.DB.prepare("UPDATE partners SET listStatus = ? WHERE email = ?").bind(v(results[1]), g.email),
  ]);
}

/** A monthly renewal arrives only as a webhook with Flutterwave's own tx_ref. Verified, recorded, owner told. */
async function recordRenewal(env: Env, ctx: ExecutionContext, txId: string): Promise<void> {
  const tx = await flwVerify(env, { id: txId }) as (FlwTx & { plan?: number | string; payment_plan?: number | string }) | null;
  if (!tx || tx.status !== "successful") return;
  // Only charges made under one of our monthly plans count as renewals.
  const planOf = String(tx.plan ?? tx.payment_plan ?? "");
  const known = planOf ? await env.DB.prepare("SELECT 1 AS x FROM plans WHERE planId = ?").bind(planOf).first() : null;
  if (!known) return;
  const done = await env.DB.prepare("SELECT 1 AS x FROM gifts WHERE flwTxId = ?").bind(String(tx.id)).first();
  if (done) return;
  const email = (tx.customer?.email || "").toLowerCase();
  const partner = email ? await env.DB.prepare("SELECT name, phone, country FROM partners WHERE email = ? AND monthly = 1").bind(email).first<{ name: string; phone: string; country: string }>() : null;
  if (!partner) return;
  const now = new Date().toISOString();
  const ins = await env.DB.prepare(
    "INSERT OR IGNORE INTO gifts (id, token, createdAt, kind, frequency, currency, amount, name, email, phone, country, status, flwTxId, paidAt, channel) VALUES (?, ?, ?, 'renewal', 'monthly', ?, ?, ?, ?, ?, ?, 'paid', ?, ?, ?)",
  ).bind(`GVR-${tx.id}`, token(), now, tx.currency, Math.round(tx.amount), partner.name, email, partner.phone, partner.country, String(tx.id), now, tx.payment_type || "").run();
  if (ins.meta.changes !== 1) return;
  await env.DB.prepare("UPDATE partners SET lastGiftAt = ?, gifts = gifts + 1 WHERE email = ?").bind(now, email).run();
  ctx.waitUntil(notifyOwner(env, `Monthly gift renewed: ${tx.currency} ${Math.round(tx.amount)}`, `${partner.name} <${email}>, Flutterwave ${tx.id}`).then(() => undefined));
}

async function giveStatus(env: Env, ctx: ExecutionContext, url: URL): Promise<Response> {
  let g = await giftByToken(env, clean(url.searchParams.get("t"), 64));
  if (!g) return json({ ok: false, error: "Gift not found." }, 404);
  if (g.status === "pending" && Date.now() - Date.parse(g.createdAt) < 7 * 86400000) {
    try { g = await settleGift(env, ctx, g, await flwVerify(env, { ref: g.id })); } catch { /* retry later */ }
  }
  return json({ ok: true, gift: { id: g.id, status: g.status, amount: g.amount, currency: g.currency, display: formatMoney(g.amount, g.currency), frequency: g.frequency, name: g.name.split(" ")[0] } });
}

async function giveConfirm(env: Env, ctx: ExecutionContext, request: Request): Promise<Response> {
  if (!sameOrigin(env, request)) return json({ ok: false }, 403);
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 422); }
  const g = await giftByToken(env, clean(b.t, 64));
  if (!g) return json({ ok: false }, 404);
  const txId = clean(String(b.transaction_id ?? ""), 20);
  try { await settleGift(env, ctx, g, await flwVerify(env, /^\d+$/.test(txId) ? { id: txId } : { ref: g.id })); } catch { /* page polls */ }
  return json({ ok: true });
}

/** Partner's own page: see monthly status and stop it. */
async function giveManage(env: Env, request: Request): Promise<Response> {
  if (!sameOrigin(env, request)) return json({ ok: false }, 403);
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 422); }
  const p = await env.DB.prepare("SELECT email, name, monthly, gifts, firstGiftAt FROM partners WHERE manageToken = ?").bind(clean(b.t, 64))
    .first<{ email: string; name: string; monthly: number; gifts: number; firstGiftAt: string }>();
  if (!p) return json({ ok: false, error: "This link is not valid. Please write to hello@eryezakalalu.com." }, 404);
  if (b.action === "cancel" && p.monthly && env.FLW_SECRET_KEY) {
    const list = await fetch(`${FLW}/subscriptions?email=${encodeURIComponent(p.email)}&status=active`, timed({ headers: { Authorization: `Bearer ${env.FLW_SECRET_KEY}` } }));
    const subs = ((await list.json().catch(() => ({}))) as { data?: { id: number }[] }).data || [];
    let ok = list.ok;
    for (const s of subs) {
      const r = await fetch(`${FLW}/subscriptions/${s.id}/cancel`, timed({ method: "PUT", headers: { Authorization: `Bearer ${env.FLW_SECRET_KEY}` } }));
      const rb = (await r.json().catch(() => ({}))) as { status?: string };
      ok = ok && r.ok && rb.status === "success";
    }
    if (ok) {
      await env.DB.prepare("UPDATE partners SET monthly = 0 WHERE email = ?").bind(p.email).run();
      await notifyOwner(env, `Monthly gift stopped: ${p.name}`, `${p.name} <${p.email}> stopped their monthly gift from the manage page.`);
      return json({ ok: true, monthly: false, message: "Your monthly gift has been stopped. Thank you for every month you gave." });
    }
    await notifyOwner(env, `Please stop a monthly gift: ${p.name}`, `${p.name} <${p.email}> asked to stop their monthly gift, and Flutterwave did not confirm every cancellation. Please cancel it in the Flutterwave dashboard (Subscriptions).`);
    return json({ ok: false, error: "We could not stop it automatically. We have been told and will stop it for you today." }, 502);
  }
  return json({ ok: true, name: p.name.split(" ")[0], monthly: Boolean(p.monthly), gifts: p.gifts, since: p.firstGiftAt.slice(0, 10) });
}

/** Owner-only CSV of partners: /api/admin/partners?s=<HMAC-SHA256 of "partners" with ADMIN_KEY>. */
async function adminPartners(env: Env, url: URL): Promise<Response> {
  if (!env.ADMIN_KEY || !safeEqual(clean(url.searchParams.get("s"), 64), await hmac(env.ADMIN_KEY, "partners"))) return new Response("Forbidden", { status: 403 });
  const rows = await env.DB.prepare("SELECT email, name, phone, country, firstGiftAt, lastGiftAt, gifts, monthly FROM partners ORDER BY firstGiftAt").all<Record<string, string | number>>();
  const cols = ["email", "name", "phone", "country", "firstGiftAt", "lastGiftAt", "gifts", "monthly"];
  const csv = [cols.join(","), ...rows.results.map((r) => cols.map((c) => { const v = String(r[c] ?? ""); return `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`; }).join(","))].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="partners.csv"', "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}

/* ------------------------------------------------------------ Day 1 sign-ups and follow-up letters */

interface Lead { email: string; firstName: string; token: string; createdAt: string; step: number; status: string; letterOptIn: number; source: string }

function fillLetter(env: Env, text: string, l: Lead): string {
  return text
    .replace(/\{first\}/g, l.firstName || "friend")
    .replace(/\{site\}/g, env.SITE)
    .replace(/\{buy\}/g, `${env.SITE}/influential-spirit/?utm_source=email&utm_medium=sequence&utm_campaign=day1#editions`)
    .replace(/\{unsub\}/g, `${env.SITE}/api/lead/unsub?t=${encodeURIComponent(l.token)}`);
}

async function sendLetter(env: Env, l: Lead, step: number): Promise<string> {
  const letter = SEQUENCE[step];
  const unsub = `${env.SITE}/api/lead/unsub?t=${encodeURIComponent(l.token)}`;
  const text = `${fillLetter(env, letter.body, l)}\n\n--\nYou asked for Day 1 of The Influential Spirit at eryezakalalu.com. Stop these letters: ${unsub}`;
  const htmlBody = `<div style="font:17px/1.65 Georgia,serif;color:#2a2420;max-width:560px">${fillLetter(env, letter.body, l)
    .split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, "<br>").replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#7B3F2E">$1</a>')}</p>`).join("")}
<p style="font:12px/1.5 system-ui,sans-serif;color:#8a7e70;margin-top:28px">You asked for Day 1 of The Influential Spirit at eryezakalalu.com. <a href="${esc(unsub)}" style="color:#8a7e70">Stop these letters</a>.</p></div>`;
  if (!env.RESEND_API_KEY) return "skipped:no-key";
  const res = await fetch("https://api.resend.com/emails", timed({
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY.trim()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.MAIL_FROM, to: [l.email], reply_to: env.REPLY_TO, subject: letter.subject, text, html: htmlBody,
      headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    }),
  }));
  return res.ok ? "ok" : `error:${res.status}`;
}

async function leadCapi(env: Env, l: Lead, request: Request, fbp: string, fbc: string, eventId: string): Promise<void> {
  if (!env.META_PIXEL_ID || !env.META_CAPI_TOKEN) return;
  const v = env.META_GRAPH_VERSION || "v24.0";
  const user: Record<string, unknown> = { em: [await sha256Hex(l.email)], client_user_agent: request.headers.get("User-Agent") || "" };
  if (fbp) user.fbp = fbp;
  if (fbc) user.fbc = fbc;
  await fetch(`https://graph.facebook.com/${v}/${env.META_PIXEL_ID}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, timed({
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [{ event_name: "Lead", event_time: Math.floor(Date.now() / 1000), event_id: eventId, action_source: "website", event_source_url: `${env.SITE}/influential-spirit/`, user_data: user, custom_data: { content_name: "day1" } }] }),
  })).catch(() => undefined);
}

async function leadStart(env: Env, ctx: ExecutionContext, request: Request): Promise<Response> {
  if (!sameOrigin(env, request)) return json({ ok: false }, 403);
  const gate = await testGate(env, request);
  if (gate) return gate;
  const ip = await ipHash(env, request);
  if (!(await rateOk(env, ip, "lead", 6, true))) return json({ ok: false, error: "Please wait a little and try again." }, 429);
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false, error: "Please fill in the form." }, 422); }
  if (clean(b.website, 100)) return json({ ok: true, eventId: "" }); // honeypot
  const email = clean(b.email, 200).toLowerCase();
  const firstName = cleanName(b.firstName, 60);
  if (!isEmail(email)) return json({ ok: false, error: "Please check your email address." }, 422);
  const letterOptIn = b.letterOptIn === true ? 1 : 0;
  const eventId = `lead-${randomId(12)}`;
  const existing = await env.DB.prepare("SELECT * FROM leads WHERE email = ?").bind(email).first<Lead>();
  let lead: Lead;
  if (existing) {
    // Already signed up (or unsubscribed): send nothing again, so this form cannot be used to mail someone repeatedly.
    return json({ ok: true, eventId });
  } else {
    const today = new Date().toISOString().slice(0, 10);
    const n = await env.DB.prepare("SELECT COUNT(*) AS n FROM leads WHERE substr(createdAt, 1, 10) = ?").bind(today).first<{ n: number }>();
    if ((n?.n ?? 0) >= Number(env.LEAD_DAILY_CAP || "60")) return json({ ok: false, error: "We have had many requests today. Please try again tomorrow, or read Day 1 on this page." }, 429);
    lead = { email, firstName, token: token(), createdAt: new Date().toISOString(), step: 0, status: "active", letterOptIn, source: clean(b.source, 200) };
    await env.DB.prepare("INSERT INTO leads (email, firstName, token, createdAt, step, status, letterOptIn, source, ipHash) VALUES (?, ?, ?, ?, 0, 'active', ?, ?, ?)")
      .bind(email, firstName, lead.token, lead.createdAt, letterOptIn, lead.source, ip).run();
  }
  // The first letter (Day 1) goes now; the rest follow on the cron schedule.
  ctx.waitUntil((async () => {
    if (lead.step === 0) {
      const r = await sendLetter(env, lead, 0);
      if (r === "ok") await env.DB.prepare("UPDATE leads SET step = 1, lastSentAt = ?, nextDueAt = ? WHERE email = ? AND step = 0").bind(new Date().toISOString(), new Date(Date.parse(lead.createdAt) + SEQUENCE[1].day * 86400000).toISOString(), email).run();
      else await env.DB.prepare("UPDATE leads SET note = ? WHERE email = ?").bind(r, email).run();
    }
    await leadCapi(env, lead, request, clean(b.fbp, 120), clean(b.fbc, 200), eventId);
    if (letterOptIn) await addToList(env, { email, name: firstName, letterOptIn: 1 } as unknown as Order).catch(() => "");
  })());
  return json({ ok: true, eventId });
}

/** GET shows a button (email scanners open links and must not unsubscribe anyone); POST unsubscribes (also RFC 8058 one-click). */
async function leadUnsub(env: Env, request: Request, url: URL): Promise<Response> {
  const t = clean(url.searchParams.get("t"), 64);
  if (request.method === "POST") {
    if (t) await env.DB.prepare("UPDATE leads SET status = 'unsubscribed' WHERE token = ?").bind(t).run();
    return html("<h2>Done</h2><p>You will not receive more of these letters. Thank you for reading. If you change your mind, ask for Day 1 again on the book page.</p>");
  }
  return html(`<h2>Stop these letters?</h2><p>You will receive no more of the Day 1 follow-up letters.</p><form method="post"><button>Yes, stop them</button></form>`);
}

/** Cron: sends the letters that are due. Buyers stop receiving the sales letters once they have bought. */
async function sendDueLetters(env: Env): Promise<void> {
  const rows = await env.DB.prepare("SELECT * FROM leads WHERE status = 'active' AND step >= 1 AND step < ? AND (nextDueAt IS NULL OR nextDueAt <= ?) ORDER BY nextDueAt LIMIT 40")
    .bind(SEQUENCE.length, new Date().toISOString()).all<Lead>();
  for (const l of rows.results) {
    const due = Date.parse(l.createdAt) + SEQUENCE[l.step].day * 86400000;
    if (Date.now() < due) { await env.DB.prepare("UPDATE leads SET nextDueAt = ? WHERE email = ?").bind(new Date(due).toISOString(), l.email).run(); continue; }
    await new Promise((r) => setTimeout(r, 600)); // Resend allows 2 requests a second
    const bought = await env.DB.prepare("SELECT 1 AS x FROM orders WHERE email = ? AND status IN ('paid','refund_requested')").bind(l.email).first();
    if (bought) { await env.DB.prepare("UPDATE leads SET status = 'customer' WHERE email = ?").bind(l.email).run(); continue; }
    const r = await sendLetter(env, l, l.step);
    const next = SEQUENCE[l.step + 1] ? new Date(Date.parse(l.createdAt) + SEQUENCE[l.step + 1].day * 86400000).toISOString() : null;
    if (r === "ok") await env.DB.prepare("UPDATE leads SET step = step + 1, lastSentAt = ?, nextDueAt = ? WHERE email = ? AND step = ?").bind(new Date().toISOString(), next, l.email, l.step).run();
    else { await env.DB.prepare("UPDATE leads SET note = ? WHERE email = ?").bind(r, l.email).run(); if (r.startsWith("error:429")) break; }
  }
}

/** Free files (Day 1 PDF) from the R2 prefix free/. Public, cached. */
async function serveFree(env: Env, request: Request, name: string): Promise<Response> {
  if (!/^[A-Za-z0-9_.-]+$/.test(name)) return new Response("Not found", { status: 404 });
  const obj = await env.BOOKS.get(`free/${name}`, { range: request.headers });
  const res = await serveR2(request, obj, name, true);
  res.headers.set("Cache-Control", "public, max-age=86400");
  return res;
}

/* ------------------------------------------------------------ Find your day (Workers AI) */

/**
 * The visitor writes what they are facing; we return the two closest days of the book.
 * Uses text embeddings only (similarity), so nothing new is written or invented: every
 * word shown comes from src/lib/days.ts. The visitor's sentence is not stored.
 */
const EMBED_MODEL = "@cf/baai/bge-base-en-v1.5";
let dayVectors: { day: number; v: number[] }[] | null = null;

/** Each day is represented by its title, its question and each sentence of `need`; a query scores a day by its best sentence. */
function dayParts(): { day: number; t: string }[] {
  const parts: { day: number; t: string }[] = [];
  for (const d of DAYS) {
    parts.push({ day: d.day, t: d.title }, { day: d.day, t: d.question });
    for (const x of d.need.split(/(?<=[.?])\s+/)) if (x.trim()) parts.push({ day: d.day, t: x.trim() });
  }
  return parts;
}

const CRISIS = /\b(suicid\w*|kill (my ?self|myself)|end (my|it all|my life)|take my (own )?life|don'?t want to (live|be alive)|self[- ]?harm|hurt myself)\b/i;

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

async function embed(env: Env, texts: string[]): Promise<number[][]> {
  if (!env.AI) throw new Error("no ai");
  const all: number[][] = [];
  for (let i = 0; i < texts.length; i += 50) {
    const out = (await env.AI.run(EMBED_MODEL, { text: texts.slice(i, i + 50) })) as { data: number[][] };
    all.push(...out.data);
  }
  return all;
}

async function findDay(env: Env, request: Request): Promise<Response> {
  if (!sameOrigin(env, request)) return json({ ok: false }, 403);
  const ip = await ipHash(env, request);
  if (!(await rateOk(env, ip, "findday", 30))) return json({ ok: false, error: "Please try again in a little while." }, 429);
  let b: Record<string, unknown>;
  try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false }, 422); }
  const q = clean(b.q, 300);
  if (q.length < 3) return json({ ok: false, error: "Write a few words about what you are facing." }, 422);
  const crisis = CRISIS.test(q);
  try {
    if (!dayVectors) {
      const parts = dayParts();
      const vs = await embed(env, parts.map((p) => p.t));
      dayVectors = parts.map((p, i) => ({ day: p.day, v: vs[i] }));
    }
    const [qv] = await embed(env, [q]);
    const best = new Map<number, number>();
    for (const p of dayVectors) best.set(p.day, Math.max(best.get(p.day) ?? -1, cosine(qv, p.v)));
    const ranked = DAYS.map((d) => ({ d, s: best.get(d.day) ?? -1 })).sort((x, y) => y.s - x.s);
    let picks = ranked.slice(0, 2).map((r) => r.d);
    if (crisis) picks = [DAYS[26], DAYS[24]]; // Resilience in the Valley, Past the Wall
    return json({ ok: true, crisis, days: picks.map((d) => ({ day: d.day, title: d.title, ref: d.ref, question: d.question })) });
  } catch {
    return json({ ok: false, error: "This is not available at the moment. Start with Day 1 below." }, 503);
  }
}

/* ------------------------------------------------------------ router */

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const p = url.pathname.replace(/\/+$/, "");
    try {
      if (p === "/api/checkout" && request.method === "GET") {
        return json({
          ok: true, service: "checkout", test: env.TEST_MODE === "1",
          db: Boolean(env.DB), files: Boolean(env.BOOKS), flwPublic: Boolean(env.FLW_PUBLIC_KEY), flwSecret: Boolean(env.FLW_SECRET_KEY),
          flwHash: Boolean(env.FLW_SECRET_HASH), receipts: Boolean(env.RESEND_API_KEY), capi: Boolean(env.META_PIXEL_ID && env.META_CAPI_TOKEN),
          letter: Boolean(env.BEEHIIV_API_KEY && env.BEEHIIV_PUB_ID), admin: Boolean(env.ADMIN_KEY),
        });
      }
      if (p === "/api/checkout/start" && request.method === "POST") return await start(env, request);
      if (p === "/api/order" && request.method === "GET") return await orderStatus(env, ctx, url);
      if (p === "/api/order/confirm" && request.method === "POST") return await confirm(env, ctx, request);
      if (p === "/api/order/resend" && request.method === "POST") return await resendLinks(env, request);
      if (p === "/api/order/refund" && request.method === "POST") return await refundRequest(env, request);
      if (p === "/api/flw/webhook" && request.method === "POST") return await webhook(env, ctx, request);
      if (p === "/api/admin/refund") return await adminRefund(env, request, url);
      if (p === "/api/admin/partners" && request.method === "GET") return await adminPartners(env, url);
      if (p === "/api/admin/send-links" && request.method === "GET") {
        // Emails the owner's private links to the owner's inbox only (nobody else can receive them).
        if (!env.ADMIN_KEY) return html("<p>Not configured.</p>", 503);
        if (!(await rateOk(env, await ipHash(env, request), "sendlinks", 3, true))) return html("<p>Please wait an hour.</p>", 429);
        const tester = await hmac(env.ADMIN_KEY, "tester");
        const partners = await hmac(env.ADMIN_KEY, "partners");
        await notifyOwner(env, "Your private website links",
          `Test buying (opens checkout on this browser only, token prices while test mode is on):
${env.SITE}/api/admin/tester?s=${tester}

Partners list (CSV download):
${env.SITE}/api/admin/partners?s=${partners}

Do not forward these links.`);
        return html("<p>Sent to the owner's email address.</p>");
      }
      if (p === "/api/admin/tester" && request.method === "GET") {
        // Owner-only: /api/admin/tester?s=<HMAC of "tester"> marks this browser as a tester while TEST_MODE is on.
        const want = env.ADMIN_KEY ? await hmac(env.ADMIN_KEY, "tester") : "";
        if (!want || !safeEqual(clean(url.searchParams.get("s"), 64), want)) return html("<p>This link is not valid.</p>", 403);
        const res = html("<p>This browser can now make test purchases. Open the book page.</p>");
        res.headers.append("Set-Cookie", `ek_tester=${want}; Path=/; Max-Age=1209600; Secure; HttpOnly; SameSite=Lax`);
        res.headers.append("Set-Cookie", "ek_t=1; Path=/; Max-Age=1209600; Secure; SameSite=Lax"); // lets the page show the on-site checkout
        return res;
      }
      if (p === "/api/give/start" && request.method === "POST") return await giveStart(env, request);
      if (p === "/api/give" && request.method === "GET") return await giveStatus(env, ctx, url);
      if (p === "/api/give/confirm" && request.method === "POST") return await giveConfirm(env, ctx, request);
      if (p === "/api/give/manage" && request.method === "POST") return await giveManage(env, request);
      if (p === "/api/find-day" && request.method === "POST") return await findDay(env, request);
      if (p === "/api/lead" && request.method === "POST") return await leadStart(env, ctx, request);
      if (p === "/api/lead/unsub") return await leadUnsub(env, request, url);
      if (p.startsWith("/free/") && (request.method === "GET" || request.method === "HEAD")) return await serveFree(env, request, p.slice(6));
      if (p.startsWith("/dl/") && (request.method === "GET" || request.method === "HEAD")) {
        return download(env, request, ctx, p.slice(4).split("/"));
      }
      return json({ ok: false, error: "Not found" }, 404);
    } catch (e) {
      console.error("checkout error", (e as Error).message);
      return json({ ok: false, error: "Something went wrong on our side. Your payment, if made, is safe. Please try again or write to books@eryezakalalu.com." }, 500);
    }
  },

  /** Every 30 minutes: re-check orders still pending from the last 2 days (closed tabs, missed webhooks). */
  async scheduled(_e: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    const since = new Date(Date.now() - 2 * 86400000).toISOString();
    const rows = await env.DB.prepare("SELECT * FROM orders WHERE status = 'pending' AND createdAt > ? LIMIT 50").bind(since).all<Order>();
    for (const o of rows.results) {
      try { await settle(env, ctx, o, await flwVerify(env, { ref: o.id })); } catch { /* next run */ }
    }
    ctx.waitUntil(sendDueLetters(env));
    const failed = await env.DB.prepare("SELECT * FROM orders WHERE status = 'paid' AND emailStatus LIKE 'error%' AND paidAt > ? LIMIT 20").bind(since).all<Order>();
    for (const o of failed.results) {
      const r = await sendReceipt(env, o);
      await env.DB.prepare("UPDATE orders SET emailStatus = ? WHERE id = ?").bind(r, o.id).run();
    }
    await env.DB.prepare("DELETE FROM checkout_rate WHERE hour < ?").bind(new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 13)).run();
    const gifts = await env.DB.prepare("SELECT * FROM gifts WHERE status = 'pending' AND createdAt > ? LIMIT 50").bind(since).all<Gift>();
    for (const g of gifts.results) {
      try { await settleGift(env, ctx, g, await flwVerify(env, { ref: g.id })); } catch { /* next run */ }
    }
  },
};
