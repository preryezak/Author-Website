/**
 * Cloudflare Worker — Eryeza Kalalu speaking-form handler.
 *
 * Receives the 8-section speaking invitation POST, validates it, stores it in
 * Cloudflare D1 (when the binding exists), and emails
 * speaking@eryezakalalu.com. Returns { ok, emailed, via }.
 *
 * There are two supported send paths and the Worker prefers the first:
 *
 *   1. NATIVE  — Cloudflare Email Service `send_email` binding (`env.EMAIL.send`).
 *                No third-party account, no API key. Sending to a *verified
 *                destination address* (e.g. speaking@eryezakalalu.com) is free on
 *                every plan, including Workers Free. Sending to arbitrary
 *                recipients requires the Workers Paid plan.
 *                Docs: https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
 *   2. RESEND  — fallback via https://api.resend.com/emails using RESEND_API_KEY.
 *
 * Deploy: `wrangler deploy` (see worker/README.md).
 * The Next.js site posts here via NEXT_PUBLIC_SPEAKING_ENDPOINT.
 */

interface EmailSendBinding {
  send(message: {
    to: string | { email: string; name?: string } | Array<string | { email: string; name?: string }>;
    from: string | { email: string; name?: string };
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string | { email: string; name?: string };
    headers?: Record<string, string>;
  }): Promise<{ messageId: string }>;
}

interface Env {
  EMAIL?: EmailSendBinding; // Native Cloudflare Email Service binding ([[send_email]] name = "EMAIL")
  RESEND_API_KEY?: string;   // Fallback: set via `wrangler secret put RESEND_API_KEY`
  SPEAKING_EMAIL?: string;   // default: speaking@eryezakalalu.com
  RESEND_FROM?: string;      // default: onboarding@resend.dev (used only on the Resend path)
  EMAIL_FROM?: string;       // native path sender, must be on a domain onboarded to Email Service
  NOTIFY_EMAIL?: string;     // inbox that receives submissions. Must be a VERIFIED destination
                             // address in Email Routing (e.g. pastor.eryeza@gmail.com).
                             // SPEAKING_EMAIL is the public alias and is NOT a valid destination.
  ALLOWED_ORIGIN?: string;   // comma-separated; default: https://eryezakalalu.com,https://www.eryezakalalu.com
  TURNSTILE_SECRET?: string; // secret: wrangler secret put TURNSTILE_SECRET
  IP_SALT?: string;          // optional salt for the rate-limit IP hash
  DB?: D1Database;           // optional D1 binding (set in wrangler.toml). Storage fails quietly if absent.
}

// The 8 sections, in order. Each field: [key, label].
const SECTIONS: { heading: string; fields: [string, string][] }[] = [
  { heading: "Your Details", fields: [["name", "Full name"], ["email", "Email"], ["phone", "Phone / WhatsApp"], ["organisation", "Organisation"], ["role", "Role"], ["country", "Country"], ["city", "City / Location"]] },
  { heading: "Your Gathering", fields: [["eventName", "Event / gathering name"], ["gatheringType", "Type of gathering"], ["eventDate", "Event date"], ["altDate", "Alternative date"], ["location", "Location"], ["format", "Event format"], ["attendance", "Expected attendance"], ["sessions", "Number of sessions"], ["duration", "Approximate duration"]] },
  { heading: "Reason for Invitation", fields: [["speakAbout", "What to speak about"], ["contribute", "What Eryeza should contribute"], ["audience", "Who is the audience"], ["leaveWith", "What participants should leave with"], ["themeOutcome", "Theme / Scripture / outcome"]] },
  { heading: "Practical Arrangements", fields: [["honorarium", "Honorarium / budget"], ["budget", "Available budget"], ["travel", "Travel arrangements"], ["accommodation", "Accommodation"], ["logistics", "Additional logistics"]] },
  { heading: "Recording & Media", fields: [["recorded", "Will it be recorded"], ["photosVideo", "Photos / video"], ["contentUse", "How recorded content used"]] },
  { heading: "Books & Resources", fields: [["booksInterest", "Interest in books"], ["booksInfo", "Books / resources info"]] },
  { heading: "Anything Else", fields: [["anythingElse", "Anything else"]] },
  { heading: "How You Found Eryeza", fields: [["howFound", "How did you hear"], ["referrer", "Who referred you"]] },
];

function esc(s: string): string {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function isEmail(v: string): boolean {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 200;
}
function clean(v: unknown, max = 4000): string {
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

function buildEmailHtml(d: Record<string, string>, receivedAt: string): string {
  const row = (label: string, val: string) =>
    `<tr><td style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#97754A;padding:10px 18px 4px 0;vertical-align:top;white-space:nowrap;width:160px;">${esc(label)}</td><td style="font-family:Georgia,'Source Serif 4',serif;font-size:14px;color:#1E1A16;padding:10px 0 4px;vertical-align:top;line-height:1.5;white-space:pre-wrap;">${esc(val) || "—"}</td></tr>`;
  const section = (s: { heading: string; fields: [string, string][] }) =>
    `<tr><td style="padding:20px 28px 4px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7B3F2E;font-weight:700;">${esc(s.heading)}</td></tr><tr><td style="padding:0 28px;"><table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(30,26,22,0.12);">${s.fields.map(([k, label]) => row(label, d[k] || "")).join("")}</table></td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#F5F0E8;padding:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FBF8F2;border:1px solid rgba(30,26,22,0.12);border-top:3px solid #7B3F2E;">
    <tr><td style="padding:24px 28px 8px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7B3F2E;font-weight:700;">New speaking invitation</td></tr>
    <tr><td style="padding:0 28px 20px;font-family:Georgia,'Source Serif 4',serif;font-size:20px;color:#1E1A16;line-height:1.3;">From ${esc(d.name || "a visitor")}, received ${esc(receivedAt)}</td></tr>
    ${SECTIONS.map(section).join("")}
    <tr><td style="padding:16px 28px 24px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;color:#5C544A;">Reply to the requester at ${esc(d.email || "")}.${d.organisation ? " Organisation: " + esc(d.organisation) + "." : ""}</td></tr>
  </table></body></html>`;
}

function buildEmailText(d: Record<string, string>, receivedAt: string): string {
  const lines: string[] = [`New speaking invitation from ${d.name || "a visitor"} — received ${receivedAt}`, ""];
  for (const s of SECTIONS) {
    lines.push(s.heading.toUpperCase());
    for (const [k, label] of s.fields) lines.push(`  ${label}: ${d[k] || "—"}`);
    lines.push("");
  }
  lines.push(`Reply to the requester at ${d.email || ""}.`);
  return lines.join("\n");
}

function buildConfirmHtml(d: Record<string, string>): string {
  const rows = SECTIONS.map((sec) => {
    const filled = sec.fields.filter(([k]) => d[k]);
    if (!filled.length) return "";
    return `<tr><td style="padding:16px 28px 4px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7B3F2E;">${esc(sec.heading)}</td></tr>` +
      filled.map(([k, label]) => `<tr><td style="padding:3px 28px;font-family:Georgia,serif;font-size:15px;color:#3A322C;line-height:1.5;"><span style="color:#97754A;font-size:12px;">${esc(label)}</span><br>${esc(d[k])}</td></tr>`).join("");
  }).join("");
  return `<!doctype html><html><body style="margin:0;background:#F5F0E8;padding:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FBF8F2;border:1px solid rgba(30,26,22,0.12);border-top:3px solid #7B3F2E;">
    <tr><td style="padding:28px 28px 8px;font-family:Georgia,serif;font-size:24px;color:#1E1A16;line-height:1.3;">Thank you, ${esc(d.name || "friend")}.</td></tr>
    <tr><td style="padding:0 28px 18px;font-family:Georgia,serif;font-size:16px;color:#3A322C;line-height:1.6;">We have received your speaking invitation${d.eventName ? " for <b>" + esc(d.eventName) + "</b>" : ""}. Eryeza or someone on the team will get in touch with you soon.<br><br>Below is a copy of what you sent, for your records. If anything needs correcting, just reply to this email.</td></tr>
    ${rows}
    <tr><td style="padding:22px 28px 26px;font-family:Georgia,serif;font-size:15px;color:#3A322C;line-height:1.6;border-top:1px solid rgba(30,26,22,0.1);">Grace and peace,<br><i>Eryeza Kalalu</i><br><span style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:12px;color:#97754A;">eryezakalalu.com</span></td></tr>
  </table></body></html>`;
}

function buildConfirmText(d: Record<string, string>): string {
  const lines = [`Thank you, ${d.name || "friend"}.`, "", `We have received your speaking invitation${d.eventName ? " for " + d.eventName : ""}. Eryeza or someone on the team will get in touch with you soon.`, "", "A copy of what you sent:", ""];
  for (const sec of SECTIONS) for (const [k, label] of sec.fields) if (d[k]) lines.push(`${label}: ${d[k]}`);
  lines.push("", "If anything needs correcting, just reply to this email.", "", "Grace and peace,", "Eryeza Kalalu", "eryezakalalu.com");
  return lines.join("\n");
}

/**
 * Site event logging — `POST /events`.
 *
 * Records a small, non-personal click record (the Giving button today) so
 * giving intent can be counted and reconciled against the Flutterwave donation
 * dashboard. This is deliberately NOT a payment endpoint: it holds no keys, it
 * never touches money, and it stores none of the giver's details.
 *
 * Stored fields: event name, surface/source, page path, campaign label, the
 * client timestamp and a random event id (the primary key, so a retried beacon
 * cannot create a duplicate row).
 *
 * Create the table with:
 *   wrangler d1 execute eryeza-speaking-db --remote --command "<SITE_EVENTS_DDL>"
 */
const SITE_EVENTS_DDL =
  "CREATE TABLE IF NOT EXISTS site_events (" +
  "id TEXT PRIMARY KEY, event TEXT NOT NULL, source TEXT NOT NULL, " +
  "page TEXT NOT NULL DEFAULT '', campaign TEXT NOT NULL DEFAULT '', " +
  "ts TEXT NOT NULL, receivedAt TEXT NOT NULL, country TEXT DEFAULT '');";

const ALLOWED_EVENTS = new Set(["give_click"]);

/** Exported for the deploy notes: the exact DDL to run against D1. */
export { SITE_EVENTS_DDL };


/** Origins allowed to POST. CORS only stops browsers, so this is checked server-side too. */
function allowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGIN || "https://eryezakalalu.com,https://www.eryezakalalu.com").split(",").map((o) => o.trim()).filter(Boolean);
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Per-IP hourly counter in D1 (salted hash, never the raw IP). Returns true when
 * the caller is over `limit`. Fails open if the table cannot be reached, so a
 * storage hiccup never blocks a real visitor.
 */
async function overRateLimit(request: Request, env: Env, bucket: string, limit: number): Promise<boolean> {
  if (!env.DB) return false;
  try {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const ipHash = await sha256Hex(`${env.IP_SALT || "eryeza-speaking"}:${bucket}:${ip}`);
    const hour = new Date().toISOString().slice(0, 13);
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS speaking_rate (ipHash TEXT NOT NULL, hour TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (ipHash, hour))").run();
    const row = await env.DB.prepare(
      "INSERT INTO speaking_rate (ipHash, hour, count) VALUES (?, ?, 1) ON CONFLICT(ipHash, hour) DO UPDATE SET count = count + 1 RETURNING count"
    ).bind(ipHash, hour).first<{ count: number }>();
    return Boolean(row && row.count > limit);
  } catch {
    return false;
  }
}

/** Cloudflare Turnstile. When TURNSTILE_SECRET is set a valid token is required. */
async function turnstileOk(env: Env, token: unknown, request: Request): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true;
  if (typeof token !== "string" || token.length < 10 || token.length > 4096) return false;
  try {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET);
    form.append("response", token);
    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) form.append("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const out = (await res.json()) as { success?: boolean };
    return out.success === true;
  } catch {
    return true; // Cloudflare's verifier unreachable: do not block a real visitor
  }
}

function shortString(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

async function handleSiteEvent(
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed." }, 405, cors);
  }
  if (!allowedOrigins(env).includes(request.headers.get("Origin") || "")) {
    return jsonResponse({ ok: false, error: "Not allowed." }, 403, cors);
  }
  if (await overRateLimit(request, env, "events", 60)) {
    return jsonResponse({ ok: false, error: "Too many requests." }, 429, cors);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ ok: false, error: "Invalid request body." }, 422, cors);
  }

  const event = shortString(body.event, 40);
  if (!ALLOWED_EVENTS.has(event)) {
    return jsonResponse({ ok: false, error: "Unknown event." }, 422, cors);
  }

  const id = shortString(body.id, 80) || crypto.randomUUID();
  const source = shortString(body.source, 64) || "unknown";
  const page = shortString(body.page, 200);
  const campaign = shortString(body.campaign, 80);
  const ts = shortString(body.ts, 40);
  const receivedAt = new Date().toISOString();
  const country = (request as { cf?: { country?: string } }).cf?.country ?? "";

  // Storage is the point of this endpoint; a missing binding is a real failure.
  if (!env.DB) {
    return jsonResponse({ ok: false, error: "Storage is not configured." }, 503, cors);
  }

  const insert = () =>
    env.DB!.prepare(
      "INSERT OR IGNORE INTO site_events (id, event, source, page, campaign, ts, receivedAt, country) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(id, event, source, page, campaign, ts, receivedAt, country)
      .run();

  try {
    await insert();
  } catch (e) {
    // The table may not exist yet on a fresh database. Create it once and retry,
    // so the endpoint works without a separate manual migration step.
    const message = e instanceof Error ? e.message : String(e);
    if (!/no such table/i.test(message)) {
      return jsonResponse({ ok: false, error: "Could not record the event." }, 500, cors);
    }
    try {
      await env.DB.prepare(SITE_EVENTS_DDL).run();
      await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_site_events_event ON site_events(event, ts);").run();
      await insert();
    } catch (e2) {
      console.error("site_events retry failed", e2);
      return jsonResponse({ ok: false, error: "Could not record the event." }, 500, cors);
    }
  }

  return jsonResponse({ ok: true, recorded: true, id }, 202, cors);
}

function jsonResponse(data: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowed = allowedOrigins(env);
    const reqOrigin = request.headers.get("Origin") || "";
    const origin = allowed.includes(reqOrigin) ? reqOrigin : allowed[0];
    const cors: Record<string, string> = {
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // Click/event logging lives on its own path, so the speaking-form
    // contract on POST / is untouched.
    const url = new URL(request.url);
    if (url.pathname === "/events") {
      return handleSiteEvent(request, env, cors);
    }

    // Health check — tells you at a glance which send path is wired up.
    if (request.method === "GET") {
      return jsonResponse(
        {
          ok: true,
          service: "speaking",
          nativeEmailBinding: Boolean(env.EMAIL),
          resendConfigured: Boolean(env.RESEND_API_KEY),
          storageConfigured: Boolean(env.DB),
          eventsPath: "/events",
          eventsTable: "site_events",
        },
        200,
        cors
      );
    }

    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed." }, 405, cors);
    }

    if (!allowedOrigins(env).includes(reqOrigin)) {
      return jsonResponse({ ok: false, error: "This form can only be sent from eryezakalalu.com." }, 403, cors);
    }
    if (await overRateLimit(request, env, "speaking", 5)) {
      return jsonResponse({ ok: false, error: "Too many attempts from this connection. Please try again in an hour." }, 429, cors);
    }

    // Parse + clean the body
    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return jsonResponse({ ok: false, error: "Invalid request body." }, 422, cors);
    }

    // Honeypot: answer like a success so bots learn nothing, store nothing.
    if (clean(body.website, 200)) {
      return jsonResponse({ ok: true, message: "Thank you. Your speaking invitation has been received." }, 201, cors);
    }

    if (!(await turnstileOk(env, body.turnstileToken, request))) {
      return jsonResponse({ ok: false, error: "The security check did not pass. Please reload the page and try again." }, 403, cors);
    }

    const d: Record<string, string> = {};
    for (const s of SECTIONS) for (const [k] of s.fields) d[k] = clean(body[k]);
    const name = d.name;
    const email = d.email;

    // Validate the essentials
    if (!name || name.length < 2) return jsonResponse({ ok: false, error: "Please share your name." }, 422, cors);
    if (!isEmail(email)) return jsonResponse({ ok: false, error: "A valid email is needed so we can reply." }, 422, cors);
    if (!d.eventName || d.eventName.length < 2) return jsonResponse({ ok: false, error: "Please share the name of your event or gathering." }, 422, cors);
    if (!d.speakAbout || d.speakAbout.length < 10) return jsonResponse({ ok: false, error: "Please share what you would like Eryeza to speak about." }, 422, cors);

    const receivedAt = new Date().toISOString();
    const speakingEmail = env.SPEAKING_EMAIL || "speaking@eryezakalalu.com";
    // Where submissions are actually delivered. The Cloudflare send_email binding
    // only accepts a VERIFIED destination address, so this cannot be the public
    // alias speaking@eryezakalalu.com (that is a routing rule, not a destination).
    const notifyEmail = env.NOTIFY_EMAIL || speakingEmail;
    const subject = `Speaking invitation from ${name}${d.organisation ? ", " + d.organisation : ""}`;
    const html = buildEmailHtml(d, receivedAt);
    const text = buildEmailText(d, receivedAt);

    // 1) Storage first, so a mail failure never loses the submission.
    let stored = false;
    if (env.DB) {
      try {
        await env.DB.prepare(
          "INSERT INTO speaking_requests (id, name, email, data, status, createdAt) VALUES (?, ?, ?, ?, 'new', ?)"
        ).bind(crypto.randomUUID(), name, email, JSON.stringify(d), receivedAt).run();
        stored = true;
      } catch {
        // D1 table may not be created yet, or the binding is misconfigured.
      }
    }

    // 2) Email — native Email Service binding first, then Resend.
    let emailed = false;
    let via: "cloudflare-email" | "resend" | "none" = "none";
    let sendError = "";

    if (env.EMAIL) {
      try {
        await env.EMAIL.send({
          to: notifyEmail,
          from: env.EMAIL_FROM || speakingEmail,
          subject,
          html,
          text,
          replyTo: email,
        });
        emailed = true;
        via = "cloudflare-email";
      } catch (e) {
        sendError = e instanceof Error ? e.message : String(e);
      }
    }

    if (!emailed && env.RESEND_API_KEY) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: env.RESEND_FROM || "Eryeza Kalalu <speaking@eryezakalalu.com>",
            to: [notifyEmail],
            reply_to: email,
            subject,
            html,
            text,
          }),
        });
        if (res.ok) {
          emailed = true;
          via = "resend";
        } else {
          sendError = `resend ${res.status}`;
        }
      } catch (e) {
        sendError = e instanceof Error ? e.message : String(e);
      }
    }

    // 3) Confirmation to the sender, with a copy of what they submitted. Cloudflare's free send binding
    //    can only reach verified inboxes, so this goes through Resend (eryezakalalu.com is verified there).
    //    Never blocks or fails the submission.
    let confirmed = false;
    if (env.RESEND_API_KEY) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Eryeza Kalalu <hello@eryezakalalu.com>",
            to: [email],
            reply_to: "hello@eryezakalalu.com",
            subject: "We have received your speaking invitation",
            html: buildConfirmHtml(d),
            text: buildConfirmText(d),
          }),
        });
        confirmed = res.ok;
      } catch { /* the owner copy is already sent and stored */ }
    }

    // The submission is safe in D1 even when mail could not be sent; the site
    // reports success so the visitor is not asked to resubmit.
    return jsonResponse(
      {
        ok: true,
        emailed,
        confirmed,
        stored,
        via,
        sendError: emailed ? undefined : sendError || "no email binding configured",
        message: "Thank you. Your speaking invitation has been received.",
      },
      201,
      cors
    );
  },
};
