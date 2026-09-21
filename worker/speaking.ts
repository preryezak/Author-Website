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
  ALLOWED_ORIGIN?: string;   // default: https://eryezakalalu.com
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

function jsonResponse(data: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN || "https://eryezakalalu.com";
    const cors: Record<string, string> = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
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
        },
        200,
        cors
      );
    }

    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed." }, 405, cors);
    }

    // Parse + clean the body
    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return jsonResponse({ ok: false, error: "Invalid request body." }, 422, cors);
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
          to: speakingEmail,
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
            from: env.RESEND_FROM || "onboarding@resend.dev",
            to: [speakingEmail],
            replyTo: email,
            subject,
            html,
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

    // The submission is safe in D1 even when mail could not be sent; the site
    // reports success so the visitor is not asked to resubmit.
    return jsonResponse(
      {
        ok: true,
        emailed,
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
