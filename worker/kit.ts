/**
 * Kit (ConvertKit) bridge for the reader Worker.
 *
 * Selar adds a Kit tag to every buyer (Selar > Integrations > Kit, then the tag on
 * each product). Every cron run this module reads the subscribers on those tags,
 * records each buyer once, stops the Day 1 sales letters for them, and sends the
 * buyer letters in worker/buyer-sequence.ts through Resend.
 *
 * Config:
 *   KIT_API_KEY      secret, Kit > Settings > Developer > API key (v4)
 *   KIT_BUYER_TAGS   var, "tagId:edition,tagId:edition", edition = influential (any tier) | reader | formation | complete | christmas
 *   KIT_LEAD_TAG     var, optional Kit tag id added to Day 1 sign-ups who ticked the letters box
 *   CHRISTMAS_URL    var, the Unscripted Christmas page, used in the last buyer letter
 */

import { BUYER_SEQUENCE, EDITION_NAME, EXTRAS, GROUP, type Edition } from "./buyer-sequence";

export interface KitEnv {
  DB: D1Database;
  KIT_API_KEY?: string;
  KIT_BUYER_TAGS?: string;
  KIT_LEAD_TAG?: string;
  CHRISTMAS_URL?: string;
  RESEND_API_KEY?: string;
  SITE: string;
  MAIL_FROM: string;
  REPLY_TO: string;
}

const KIT = "https://api.kit.com/v4";
const EDITIONS: Edition[] = ["influential", "reader", "formation", "complete", "christmas"];
/** Higher rank wins when one person owns several editions. */
const RANK: Record<Edition, number> = { christmas: 0, influential: 1, reader: 1, formation: 2, complete: 3 };

interface Buyer { email: string; firstName: string; edition: string; token: string; boughtAt: string; step: number; status: string }

function kitFetch(env: KitEnv, path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${KIT}${path}`, {
    ...init,
    signal: AbortSignal.timeout(10000),
    headers: { "X-Kit-Api-Key": (env.KIT_API_KEY || "").trim(), "Content-Type": "application/json", Accept: "application/json" },
  });
}

function buyerTags(env: KitEnv): { tag: string; edition: Edition }[] {
  return (env.KIT_BUYER_TAGS || "").split(",").map((p) => p.trim().split(":")).filter(([t, e]) => /^\d+$/.test(t || "") && EDITIONS.includes(e as Edition))
    .map(([tag, edition]) => ({ tag, edition: edition as Edition }));
}

function token(): string {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

/** Adds a Day 1 sign-up to Kit with the lead tag (only when they ticked the letters box). */
export async function kitAddLead(env: KitEnv, email: string, firstName: string): Promise<string> {
  if (!env.KIT_API_KEY || !env.KIT_LEAD_TAG) return "skipped:no-key";
  const s = await kitFetch(env, "/subscribers", { method: "POST", body: JSON.stringify({ email_address: email, first_name: firstName || undefined }) });
  if (!s.ok) return `error:${s.status}`;
  const t = await kitFetch(env, `/tags/${encodeURIComponent(env.KIT_LEAD_TAG)}/subscribers`, { method: "POST", body: JSON.stringify({ email_address: email }) });
  return t.ok ? "ok" : `error:${t.status}`;
}

/** Reads new buyers from the Kit tags Selar sets. Runs on the cron; cheap when nothing changed. */
export async function syncBuyers(env: KitEnv): Promise<number> {
  const tags = buyerTags(env);
  if (!env.KIT_API_KEY || !tags.length) return 0;
  const since = (await env.DB.prepare("SELECT value FROM kv WHERE key = 'kit_sync'").first<{ value: string }>())?.value;
  const started = new Date().toISOString();
  let added = 0;
  for (const { tag, edition } of tags) {
    let after = "";
    for (let page = 0; page < 20; page++) {
      const q = new URLSearchParams({ per_page: "500" });
      if (since) q.set("tagged_after", new Date(Date.parse(since) - 3600000).toISOString()); // an hour of overlap
      if (after) q.set("after", after);
      const res = await kitFetch(env, `/tags/${tag}/subscribers?${q}`);
      if (!res.ok) { console.error("kit tag read", tag, res.status); return added; }
      const out = (await res.json()) as { subscribers: { email_address: string; first_name: string | null; tagged_at?: string }[]; pagination?: { has_next_page: boolean; end_cursor: string } };
      for (const s of out.subscribers || []) {
        const email = (s.email_address || "").trim().toLowerCase();
        if (!email.includes("@")) continue;
        const firstName = (s.first_name || "").trim().slice(0, 60);
        const had = await env.DB.prepare("SELECT edition FROM buyers WHERE email = ?").bind(email).first<{ edition: Edition }>();
        if (!had) {
          const at = s.tagged_at || started;
          // Buyers from before this went live are recorded but get no letters.
          const status = Date.now() - Date.parse(at) > 3 * 86400000 ? "past" : "active";
          await env.DB.prepare("INSERT INTO buyers (email, firstName, edition, token, boughtAt, step, status) VALUES (?, ?, ?, ?, ?, 0, ?)")
            .bind(email, firstName, edition, token(), at, status).run();
          added++;
        } else if (RANK[edition] > RANK[had.edition]) {
          await env.DB.prepare("UPDATE buyers SET edition = ? WHERE email = ?").bind(edition, email).run();
        }
        // A buyer of the book stops receiving the Day 1 sales letters.
        if (edition !== "christmas") await env.DB.prepare("UPDATE leads SET status = 'customer' WHERE email = ? AND status = 'active'").bind(email).run();
      }
      if (!out.pagination?.has_next_page) break;
      after = out.pagination.end_cursor;
    }
  }
  await env.DB.prepare("INSERT INTO kv (key, value) VALUES ('kit_sync', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(started).run();
  return added;
}

function fill(env: KitEnv, text: string, b: Buyer): string {
  const ed = (EDITIONS.includes(b.edition as Edition) ? b.edition : "reader") as Edition;
  const christmas = env.CHRISTMAS_URL
    ? `P.S. Christmas is coming, and for many people it is a hard season. I have written Unscripted Christmas, twenty-four days with Christ for the Christmas you are actually having. You can find it here: ${env.CHRISTMAS_URL}`
    : "";
  return text
    .replace(/\{first\}/g, b.firstName || "friend")
    .replace(/\{edition\}/g, EDITION_NAME[ed])
    .replace(/\{extras\}/g, EXTRAS[ed])
    .replace(/\{group\}/g, GROUP[ed])
    .replace(/\{christmas\}/g, christmas)
    .replace(/\{site\}/g, env.SITE)
    .replace(/ +\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function sendBuyerLetter(env: KitEnv, b: Buyer, step: number): Promise<string> {
  if (!env.RESEND_API_KEY) return "skipped:no-key";
  const letter = BUYER_SEQUENCE[step];
  const unsub = `${env.SITE}/api/lead/unsub?t=${encodeURIComponent(b.token)}`;
  const body = fill(env, letter.body, b);
  const foot = "You bought The Influential Spirit from Eryeza Kalalu.";
  const htmlBody = `<div style="font:17px/1.65 Georgia,serif;color:#2a2420;max-width:560px">${body.split(/\n{2,}/)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>").replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#7B3F2E">$1</a>')}</p>`).join("")}
<p style="font:12px/1.5 system-ui,sans-serif;color:#8a7e70;margin-top:28px">${foot} <a href="${esc(unsub)}" style="color:#8a7e70">Stop these letters</a>.</p></div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(10000),
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY.trim()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.MAIL_FROM, to: [b.email], reply_to: env.REPLY_TO, subject: letter.subject,
      text: `${body}\n\n--\n${foot} Stop these letters: ${unsub}`, html: htmlBody,
      headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    }),
  });
  return res.ok ? "ok" : `error:${res.status}`;
}

/** Cron: sends the buyer letters that are due (Christmas pre-order buyers get none of these). */
export async function sendBuyerLetters(env: KitEnv): Promise<void> {
  const rows = await env.DB.prepare("SELECT * FROM buyers WHERE status = 'active' AND edition != 'christmas' AND step < ? ORDER BY boughtAt LIMIT 200")
    .bind(BUYER_SEQUENCE.length).all<Buyer>();
  let sent = 0;
  for (const b of rows.results) {
    const due = Date.parse(b.boughtAt) + BUYER_SEQUENCE[b.step].day * 86400000;
    if (Date.now() < due) continue;
    if (sent >= 40) break;
    await new Promise((r) => setTimeout(r, 600)); // Resend allows 2 requests a second
    const r = await sendBuyerLetter(env, b, b.step);
    sent++;
    if (r === "ok") await env.DB.prepare("UPDATE buyers SET step = step + 1, lastSentAt = ? WHERE email = ? AND step = ?").bind(new Date().toISOString(), b.email, b.step).run();
    else { await env.DB.prepare("UPDATE buyers SET note = ? WHERE email = ?").bind(r, b.email).run(); if (r.startsWith("error:429")) break; }
  }
}

/* ------------------------------------------------------------ one-off affiliate outreach (admin) */

/** Kit passthrough for the affiliate outreach: create a tag and custom field, add subscribers, send a broadcast. */
export async function kitAdmin(env: KitEnv, body: Record<string, unknown>): Promise<unknown> {
  const call = async (path: string, init: RequestInit = {}) => {
    const r = await kitFetch(env, path, init);
    const text = await r.text();
    let data: unknown = text;
    try { data = JSON.parse(text); } catch { /* keep text */ }
    return { status: r.status, data };
  };
  switch (body.op) {
    case "tag":
      return call("/tags", { method: "POST", body: JSON.stringify({ name: String(body.name) }) });
    case "field":
      return call("/custom_fields", { method: "POST", body: JSON.stringify({ label: String(body.label) }) });
    case "subscribers": {
      // [{email, first_name, fields}] -> create (or update) each, then tag.
      const list = (body.subscribers as { email: string; first_name?: string; fields?: Record<string, string> }[]) || [];
      const out: string[] = [];
      for (const s of list.slice(0, 40)) {
        const c = await kitFetch(env, "/subscribers", { method: "POST", body: JSON.stringify({ email_address: s.email, first_name: s.first_name || undefined, fields: s.fields || undefined }) });
        const t = await kitFetch(env, `/tags/${encodeURIComponent(String(body.tag))}/subscribers`, { method: "POST", body: JSON.stringify({ email_address: s.email }) });
        out.push(`${c.status}/${t.status}`);
      }
      return { done: out.length, results: out };
    }
    case "count":
      return call(`/tags/${encodeURIComponent(String(body.tag))}/subscribers?per_page=1&include_total_count=true`);
    case "get":
      return call(String(body.path));
    case "broadcast":
      return call("/broadcasts", { method: "POST", body: JSON.stringify(body.broadcast) });
    default:
      return { error: "unknown op" };
  }
}
