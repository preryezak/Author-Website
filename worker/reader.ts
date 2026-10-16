/**
 * Cloudflare Worker for eryezakalalu.com: the parts of the book funnel that
 * Selar does not do. Books are bought, paid for and delivered on Selar.
 * The Cloudflare name stays `eryeza-checkout` so its saved settings carry over.
 *
 * Same-origin routes (worker/reader.wrangler.toml):
 *   POST /api/lead              Day 1 sign-up: emails Day 1 now; worker/sequence.ts letters follow by cron.
 *   GET|POST /api/lead/unsub    Stop the letters (GET shows a button; POST and one-click unsubscribe act).
 *   POST /api/find-day          "Find your day": matches a visitor's sentence to a day of the book
 *                               with Workers AI embeddings (no generated text, nothing stored).
 *   GET  /free/NAME             Free files (Day 1 PDF) from the R2 prefix free/.
 *   GET  /api/admin/send-links  Emails the owner's private test link to the owner's inbox.
 *   GET  /api/admin/tester      Owner-only: lets the owner's browser try the Day 1 sign-up before launch.
 *   GET  /api/reader            Health: which parts are configured, never the values.
 *
 * Secrets: RESEND_API_KEY, ADMIN_KEY, optional IP_SALT, META_CAPI_TOKEN, BEEHIIV_API_KEY.
 */

import { SEQUENCE } from "./sequence";
import { DAYS } from "../src/lib/days";

interface Env {
  DB: D1Database;
  BOOKS: R2Bucket;
  AI?: Ai;
  EMAIL?: { send(m: { to: string; from: string; subject: string; text: string }): Promise<unknown> };
  RESEND_API_KEY?: string;
  ADMIN_KEY?: string;
  IP_SALT?: string;
  META_PIXEL_ID?: string;
  META_CAPI_TOKEN?: string;
  META_GRAPH_VERSION?: string;
  BEEHIIV_API_KEY?: string;
  BEEHIIV_PUB_ID?: string;
  SITE: string;
  MAIL_FROM: string;
  REPLY_TO: string;
  NOTIFY_EMAIL: string;
  NOTIFY_FROM: string;
  LEADS_LIVE?: string;       // "1" opens the Day 1 sign-up to everyone (until then, the owner's test browser only)
  LEAD_DAILY_CAP?: string;   // max new Day 1 sign-ups a day (default 60), keeps email quota
}

const TIMEOUT = 10000;

/* ---------------------------------------------------------------- helpers */

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}

function html(body: string, status = 200): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Eryeza Kalalu</title><style>body{font:16px/1.6 system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;color:#2a2420;background:#faf7f2}button{font:inherit;padding:10px 18px;border-radius:8px;border:0;background:#7B3F2E;color:#fff;cursor:pointer}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border-bottom:1px solid #e5dccf;padding:6px 4px;text-align:left}</style></head><body>${body}</body></html>`,
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

async function resend(env: Env, to: string, subject: string, text: string, htmlBody: string): Promise<string> {
  if (!env.RESEND_API_KEY) return "skipped:no-key";
  const res = await fetch("https://api.resend.com/emails", timed({
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY.trim()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], reply_to: env.REPLY_TO, subject, text, html: htmlBody }),
  }));
  return res.ok ? "ok" : `error:${res.status}`;
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


/** Readers who ticked the box join Eryeza Writes (Beehiiv). */
async function addToList(env: Env, email: string, firstName: string): Promise<string> {
  if (!env.BEEHIIV_API_KEY || !env.BEEHIIV_PUB_ID) return "skipped:no-key";
  const res = await fetch(`https://api.beehiiv.com/v2/publications/${encodeURIComponent(env.BEEHIIV_PUB_ID)}/subscriptions`, timed({
    method: "POST",
    headers: { Authorization: `Bearer ${env.BEEHIIV_API_KEY.trim()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email, reactivate_existing: false, send_welcome_email: true,
      utm_source: "day1", utm_medium: "website", utm_campaign: "influential-spirit",
      custom_fields: [{ name: "First Name", value: firstName }],
    }),
  }));
  return res.ok ? "ok" : `error:${res.status}`;
}

/** Before LEADS_LIVE, only a browser holding the owner's tester cookie may sign up (for testing). */
async function testGate(env: Env, request: Request): Promise<Response | null> {
  if (env.LEADS_LIVE === "1") return null;
  const cookie = request.headers.get("Cookie") || "";
  const want = env.ADMIN_KEY ? await hmac(env.ADMIN_KEY, "tester") : "";
  const got = /(?:^|; )ek_tester=([a-f0-9]{64})/.exec(cookie)?.[1] || "";
  return want && safeEqual(got, want) ? null : json({ ok: false, error: "This opens soon." }, 503);
}


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
    if (letterOptIn) await addToList(env, email, firstName).catch(() => "");
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
      if (p === "/api/lead" && request.method === "POST") return await leadStart(env, ctx, request);
      if (p === "/api/lead/unsub") return await leadUnsub(env, request, url);
      if (p === "/api/find-day" && request.method === "POST") return await findDay(env, request);
      if (p.startsWith("/free/") && (request.method === "GET" || request.method === "HEAD")) return await serveFree(env, request, p.slice(6));
      if (p === "/api/admin/send-links" && request.method === "GET") {
        if (!env.ADMIN_KEY) return html("<p>Not configured.</p>", 503);
        if (!(await rateOk(env, await ipHash(env, request), "sendlinks", 3, true))) return html("<p>Please wait an hour.</p>", 429);
        const tester = await hmac(env.ADMIN_KEY, "tester");
        await notifyOwner(env, "Your private website link",
          `Try the Day 1 sign-up before launch (this browser only):\n${env.SITE}/api/admin/tester?s=${tester}\n\nDo not forward this link.`);
        return html("<p>Sent to the owner's email address.</p>");
      }
      if (p === "/api/admin/tester" && request.method === "GET") {
        const want = env.ADMIN_KEY ? await hmac(env.ADMIN_KEY, "tester") : "";
        if (!want || !safeEqual(clean(url.searchParams.get("s"), 64), want)) return html("<p>This link is not valid.</p>", 403);
        const res = html("<p>This browser can now try the Day 1 sign-up. Open the book page.</p>");
        res.headers.append("Set-Cookie", `ek_tester=${want}; Path=/; Max-Age=1209600; Secure; HttpOnly; SameSite=Lax`);
        res.headers.append("Set-Cookie", "ek_t=1; Path=/; Max-Age=1209600; Secure; SameSite=Lax");
        return res;
      }
      if (p === "/api/reader" && request.method === "GET") {
        return json({ ok: true, service: "reader", leadsLive: env.LEADS_LIVE === "1", db: Boolean(env.DB), files: Boolean(env.BOOKS), ai: Boolean(env.AI), email: Boolean(env.RESEND_API_KEY), admin: Boolean(env.ADMIN_KEY) });
      }
      return json({ ok: false, error: "Not found" }, 404);
    } catch (e) {
      console.error("reader error", (e as Error).message);
      return json({ ok: false, error: "Something went wrong on our side. Please try again." }, 500);
    }
  },

  /** Every 30 minutes: send the Day 1 letters that are due; prune the rate-limit table. */
  async scheduled(_e: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(sendDueLetters(env));
    await env.DB.prepare("DELETE FROM checkout_rate WHERE hour < ?").bind(new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 13)).run();
  },
};
