/**
 * Cloudflare Worker `eryeza-study`: the free weekly study-guide sign-up.
 *
 * Served same-origin at https://eryezakalalu.com/api/study (a Worker route that
 * runs in front of the `ccndaily-books` custom-domain site), so the page needs
 * no CORS and no CSP change.
 *
 * POST JSON { firstName, email, letterOptIn: boolean, week: number, website: "" }
 *   1. reject if the honeypot `website` is filled, the Origin is not allowed,
 *      the email is malformed, or the IP has posted more than 5 times this hour
 *   2. store the submission in D1 (`study_signups`) BEFORE any API call
 *   3. Kit. Free plan (no KIT_API_KEY): submit to form KIT_FORM_ID's public
 *      subscribe address, so the form's confirmation email sends the guide.
 *      Paid plan (KIT_API_KEY set): Kit v4 API, upsert subscriber -> add to
 *      form -> tag `study-guide`, `week-{N}` and, when opted in, `letter-optin`
 *   4. Beehiiv (only when opted in AND BEEHIIV_API_KEY + BEEHIIV_PUB_ID are set):
 *      create the letter subscription. Without API access this is skipped and the
 *      `letter-optin` Kit tag is exported for a manual import instead.
 *   5. record kitStatus / beehiivStatus on the D1 row
 * Responds { ok: true } or { ok: false, error } with a human-readable message.
 * Provider errors are never returned to the client; they are kept in D1.
 *
 * Config: worker/study.wrangler.toml. Schema: worker/study-schema.sql.
 * Deploy: see worker/README.md ("Study guide Worker").
 */

interface Env {
  DB?: D1Database;
  KIT_API_KEY?: string;      // secret; paid Kit plans only. Without it the public form address is used.
  KIT_FORM_ID?: string;      // the Kit form whose confirmation email delivers the guide
  KIT_TAG_STUDY?: string;    // optional tag id; otherwise the "study-guide" tag is looked up/created by name
  KIT_TAG_LETTER?: string;   // optional tag id; otherwise "letter-optin" by name
  BEEHIIV_API_KEY?: string;  // secret, only if the Beehiiv plan includes API access
  BEEHIIV_PUB_ID?: string;
  ALLOWED_ORIGIN?: string;   // comma-separated; default https://eryezakalalu.com,https://www.eryezakalalu.com
  IP_SALT?: string;          // optional; salts the stored IP hash
}

const KIT = "https://api.kit.com/v4";
/** Public form endpoint used by Kit embed code (works on the free plan). */
const KIT_FORM_BASE = "https://app.kit.com/forms";
const RATE_LIMIT_PER_HOUR = 5;
const API_TIMEOUT_MS = 8000;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 200;
}

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timed(init: RequestInit): RequestInit {
  return { ...init, signal: AbortSignal.timeout(API_TIMEOUT_MS) };
}

/** Kit v4 call. Returns the parsed body, or throws with "kit <step> <status>". */
async function kit(env: Env, step: string, path: string, body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch(`${KIT}${path}`, timed({
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", "X-Kit-Api-Key": env.KIT_API_KEY || "" },
    body: JSON.stringify(body),
  }));
  if (!res.ok) throw new Error(`kit ${step} ${res.status}`);
  return (await res.json().catch(() => ({}))) as Record<string, unknown>;
}

/** Tag id from a configured var, or create-or-get by name (Kit returns the existing tag with 200). */
async function tagId(env: Env, configured: string | undefined, name: string): Promise<string> {
  if (configured) return configured;
  const data = await kit(env, `tag:${name}`, "/tags", { name });
  const id = (data.tag as { id?: number | string } | undefined)?.id;
  if (id === undefined) throw new Error(`kit tag:${name} no-id`);
  return String(id);
}

/**
 * Kit free (Newsletter) plan: no API. The Worker submits to the form's public
 * subscribe address, exactly what Kit's own embed code posts, so Kit treats it
 * as a normal form sign-up and sends the form's confirmation (incentive) email,
 * which carries this week's guide. No key involved.
 */
async function runKitFormPost(env: Env, s: { email: string; firstName: string }): Promise<string> {
  const id = encodeURIComponent(env.KIT_FORM_ID || "");
  const res = await fetch(`${KIT_FORM_BASE}/${id}/subscriptions`, timed({
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({ email_address: s.email, "fields[first_name]": s.firstName }).toString(),
  }));
  return res.ok ? "form:ok" : `error:form ${res.status}`;
}

async function runKit(env: Env, s: { email: string; firstName: string; week: number; letterOptIn: boolean }): Promise<string> {
  // No API key (Kit free plan): public form subscribe address instead of the API.
  if (!env.KIT_API_KEY) return env.KIT_FORM_ID ? runKitFormPost(env, s) : "skipped:no-kit";
  const steps: string[] = [];
  // 1) upsert the subscriber (required before form/tag calls)
  await kit(env, "subscriber", "/subscribers", { email_address: s.email, first_name: s.firstName });
  // 2) add to the form so Kit's incentive email / automation sends the guide
  if (env.KIT_FORM_ID) {
    await kit(env, "form", `/forms/${encodeURIComponent(env.KIT_FORM_ID)}/subscribers`, {
      email_address: s.email,
      referrer: `https://eryezakalalu.com/resources/?utm_source=study-guide&week=${s.week}`,
    });
  } else {
    steps.push("no-form-id");
  }
  // 3) tags. A failed tag does not undo the subscription; it is recorded.
  const tags: [string | undefined, string][] = [[env.KIT_TAG_STUDY, "study-guide"], [undefined, `week-${s.week}`]];
  if (s.letterOptIn) tags.push([env.KIT_TAG_LETTER, "letter-optin"]);
  for (const [configured, name] of tags) {
    try {
      const id = await tagId(env, configured, name);
      await kit(env, `tag:${name}`, `/tags/${encodeURIComponent(id)}/subscribers`, { email_address: s.email });
    } catch (e) {
      steps.push(e instanceof Error ? e.message : `tag:${name} failed`);
    }
  }
  return steps.length ? `partial:${steps.join(";")}` : "ok";
}

async function runBeehiiv(env: Env, email: string, letterOptIn: boolean): Promise<string> {
  if (!letterOptIn) return "n/a";
  if (!env.BEEHIIV_API_KEY || !env.BEEHIIV_PUB_ID) return "skipped:manual-import";
  const res = await fetch(`https://api.beehiiv.com/v2/publications/${encodeURIComponent(env.BEEHIIV_PUB_ID)}/subscriptions`, timed({
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.BEEHIIV_API_KEY}` },
    body: JSON.stringify({ email, reactivate_existing: false, send_welcome_email: true, utm_source: "study-guide" }),
  }));
  return res.ok ? "ok" : `error:${res.status}`;
}

async function runApis(env: Env, id: string | null, s: { email: string; firstName: string; week: number; letterOptIn: boolean }): Promise<{ kitStatus: string; beehiivStatus: string }> {
  let kitStatus: string;
  try { kitStatus = await runKit(env, s); } catch (e) { kitStatus = `error:${e instanceof Error ? e.message : "unknown"}`; }
  let beehiivStatus: string;
  try { beehiivStatus = await runBeehiiv(env, s.email, s.letterOptIn); } catch (e) { beehiivStatus = `error:${e instanceof Error ? e.message : "unknown"}`; }
  if (env.DB && id) {
    try {
      await env.DB.prepare("UPDATE study_signups SET kitStatus = ?, beehiivStatus = ? WHERE id = ?").bind(kitStatus, beehiivStatus, id).run();
    } catch { /* the row still holds the submission */ }
  }
  return { kitStatus, beehiivStatus };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === "GET") {
      // Health check: shows which paths are configured, never the values.
      return json({
        ok: true,
        service: "study",
        storageConfigured: Boolean(env.DB),
        kitMode: env.KIT_API_KEY ? "api" : env.KIT_FORM_ID ? "form" : "none",
        kitFormConfigured: Boolean(env.KIT_FORM_ID),
        beehiivConfigured: Boolean(env.BEEHIIV_API_KEY && env.BEEHIIV_PUB_ID),
      });
    }
    if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);

    const allowed = (env.ALLOWED_ORIGIN || "https://eryezakalalu.com,https://www.eryezakalalu.com").split(",").map((s) => s.trim());
    const origin = request.headers.get("Origin") || "";
    if (!allowed.includes(origin)) return json({ ok: false, error: "This form can only be sent from eryezakalalu.com." }, 403);

    let body: Record<string, unknown>;
    try { body = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false, error: "Please fill in the form and try again." }, 422); }

    // Honeypot: answer like a success so bots learn nothing, store nothing.
    if (clean(body.website, 200)) return json({ ok: true });

    const firstName = clean(body.firstName, 80);
    const email = clean(body.email, 200).toLowerCase();
    const letterOptIn = body.letterOptIn === true;
    const week = Number(body.week);
    if (!firstName) return json({ ok: false, error: "Please add your first name." }, 422);
    if (!isEmail(email)) return json({ ok: false, error: "Please check your email address." }, 422);
    if (!Number.isInteger(week) || week < 1 || week > 52) return json({ ok: false, error: "Please reload the page and try again." }, 422);

    // Rate limit: at most 5 posts per IP per hour (D1 counter on a salted hash, never the raw IP).
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const ipHash = await sha256(`${env.IP_SALT || "eryeza-study"}:${ip}`);
    if (env.DB) {
      try {
        const hour = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH (UTC)
        const row = await env.DB.prepare(
          "INSERT INTO study_rate (ipHash, hour, count) VALUES (?, ?, 1) ON CONFLICT(ipHash, hour) DO UPDATE SET count = count + 1 RETURNING count"
        ).bind(ipHash, hour).first<{ count: number }>();
        if (row && row.count > RATE_LIMIT_PER_HOUR) {
          return json({ ok: false, error: "Too many attempts from this connection. Please try again in an hour." }, 429);
        }
      } catch { /* table missing: fail open rather than block real readers */ }
    }

    // Store first, so a provider outage never loses a sign-up.
    const id = crypto.randomUUID();
    let stored = false;
    if (env.DB) {
      try {
        await env.DB.prepare(
          "INSERT INTO study_signups (id, createdAt, email, firstName, week, letterOptIn, kitStatus, beehiivStatus, ipHash) VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending', ?)"
        ).bind(id, new Date().toISOString(), email, firstName, week, letterOptIn ? 1 : 0, ipHash).run();
        stored = true;
      } catch { /* fall through to the synchronous path below */ }
    }

    const sub = { email, firstName, week, letterOptIn };
    if (stored) {
      // Safe in D1: finish the provider calls after replying, so the reader is not kept waiting.
      ctx.waitUntil(runApis(env, id, sub));
      return json({ ok: true });
    }
    // Not stored: only report success if Kit actually took it.
    const { kitStatus } = await runApis(env, null, sub);
    if (kitStatus === "ok" || kitStatus === "form:ok" || kitStatus.startsWith("partial")) return json({ ok: true });
    return json({ ok: false, error: "That did not go through. Please try again in a moment." }, 502);
  },
};
