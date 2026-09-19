import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SPEAKING_EMAIL = "speaking@eryezakalalu.com";
const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

function isEmail(v: string) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 200;
}
function clean(v: unknown, max = 4000) {
  if (typeof v !== "string") return "";
  return v.slice(0, max).trim();
}
function esc(s: string) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Sections for the email, in order. Each field: [key, label].
const SECTIONS: Array<{ heading: string; fields: Array<[string, string]> }> = [
  { heading: "Your Details", fields: [["name", "Full name"], ["email", "Email"], ["phone", "Phone / WhatsApp"], ["organisation", "Organisation"], ["role", "Role"], ["country", "Country"], ["city", "City / Location"]] },
  { heading: "Your Gathering", fields: [["eventName", "Event / gathering name"], ["gatheringType", "Type of gathering"], ["eventDate", "Event date"], ["altDate", "Alternative date"], ["location", "Location"], ["format", "Event format"], ["attendance", "Expected attendance"], ["sessions", "Number of sessions"], ["duration", "Approximate duration"]] },
  { heading: "Reason for Invitation", fields: [["speakAbout", "What to speak about"], ["contribute", "What Eryeza should contribute"], ["audience", "Who is the audience"], ["leaveWith", "What participants should leave with"], ["themeOutcome", "Theme / Scripture / outcome"]] },
  { heading: "Practical Arrangements", fields: [["honorarium", "Honorarium / budget"], ["budget", "Available budget"], ["travel", "Travel arrangements"], ["accommodation", "Accommodation"], ["logistics", "Additional logistics"]] },
  { heading: "Recording & Media", fields: [["recorded", "Will it be recorded"], ["photosVideo", "Photos / video"], ["contentUse", "How recorded content used"]] },
  { heading: "Books & Resources", fields: [["booksInterest", "Interest in books"], ["booksInfo", "Books / resources info"]] },
  { heading: "Anything Else", fields: [["anythingElse", "Anything else"]] },
  { heading: "How You Found Eryeza", fields: [["howFound", "How did you hear"], ["referrer", "Who referred you"]] },
];

function buildEmailHtml(d: Record<string, string>, receivedAt: string) {
  const head = (label: string) => label.replace(/&/g, "&amp;");
  const row = (label: string, val: string) =>
    `<tr><td style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#97754A;padding:10px 18px 4px 0;vertical-align:top;white-space:nowrap;width:160px;">${esc(label)}</td><td style="font-family:Georgia,'Source Serif 4',serif;font-size:14px;color:#1E1A16;padding:10px 0 4px;vertical-align:top;line-height:1.5;white-space:pre-wrap;">${esc(val) || "—"}</td></tr>`;
  const section = (s: { heading: string; fields: Array<[string, string]> }) => `
    <tr><td style="padding:20px 28px 4px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7B3F2E;font-weight:700;">${esc(head(s.heading))}</td></tr>
    <tr><td style="padding:0 28px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(30,26,22,0.12);">
        ${s.fields.map(([k, label]) => row(label, d[k] || "")).join("")}
      </table>
    </td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#F5F0E8;padding:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FBF8F2;border:1px solid rgba(30,26,22,0.12);border-top:3px solid #7B3F2E;">
    <tr><td style="padding:24px 28px 8px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7B3F2E;font-weight:700;">New speaking invitation</td></tr>
    <tr><td style="padding:0 28px 20px;font-family:Georgia,'Source Serif 4',serif;font-size:20px;color:#1E1A16;line-height:1.3;">From ${esc(d.name || "a visitor")}, received ${esc(receivedAt)}</td></tr>
    ${SECTIONS.map(section).join("")}
    <tr><td style="padding:16px 28px 24px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;color:#5C544A;">Reply to the requester at ${esc(d.email || "")}. This submission is also stored in the SpeakingRequest database.</td></tr>
  </table></body></html>`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Clean all fields.
  const d: Record<string, string> = {};
  for (const s of SECTIONS) for (const [k] of s.fields) d[k] = clean(body[k]);
  // Also keep name/email at top-level for indexing.
  const name = d.name;
  const email = d.email;

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please share your name." }, { status: 422 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is needed so we can reply." }, { status: 422 });
  }
  if (!d.eventName || d.eventName.length < 2) {
    return NextResponse.json({ ok: false, error: "Please share the name of your event or gathering." }, { status: 422 });
  }
  if (!d.speakAbout || d.speakAbout.length < 10) {
    return NextResponse.json({ ok: false, error: "Please share what you would like Eryeza to speak about." }, { status: 422 });
  }

  const receivedAt = new Date().toISOString();

  // 1) Store the full submission.
  try {
    await db.speakingRequest.create({
      data: { name, email, data: JSON.stringify(d) },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong storing your request. Please try again." },
      { status: 500 }
    );
  }

  // 2) Email the team, if Resend is configured.
  let emailed = false;
  if (RESEND_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_KEY);
      await resend.emails.send({
        from: RESEND_FROM,
        to: SPEAKING_EMAIL,
        replyTo: email,
        subject: `Speaking invitation from ${name}${d.organisation ? ", " + d.organisation : ""}`,
        html: buildEmailHtml(d, receivedAt),
      });
      emailed = true;
    } catch {
      // Email failed; DB has the submission.
    }
  }

  return NextResponse.json(
    { ok: true, emailed, message: "Thank you. Your speaking invitation has been received." },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "speaking", emailConfigured: Boolean(RESEND_KEY) });
}
