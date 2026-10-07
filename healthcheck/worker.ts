/**
 * Site health check for eryezakalalu.com (Cloudflare free plan).
 *
 * Cron: every 6 hours (4 runs a day, ~20 requests each: far under the free
 * limits of 100,000 requests/day and 50 subrequests per run). It emails
 * pastor.eryeza@gmail.com only when something CHANGES (a check starts failing,
 * or recovers), repeats a still-failing alert once a day, and sends one short
 * "all green" note each Monday morning so silence never means "broken".
 *
 * A second cron fires once, on 1 Nov 08:00 EAT, with the end-of-launch-pricing reminder.
 *
 * State lives in the existing D1 database (table `health_state`).
 * Manual run: GET https://<worker>/run  (returns the report as JSON, sends nothing).
 */

interface EmailBinding { send(m: { to: string; from: string; subject: string; text: string }): Promise<unknown> }
interface Env { RUN_TOKEN?: string; SPEAKING: { fetch(r: Request): Promise<Response> }; EMAIL: EmailBinding; DB: D1Database; SITE?: string; NOTIFY_EMAIL?: string; FROM_EMAIL?: string }

type Check = { name: string; ok: boolean; detail: string };

const PAGES = ["/", "/influential-spirit/", "/books/", "/speaking/", "/resources/", "/podcast/", "/give/", "/letter/", "/about/", "/contact/", "/privacy/"];

async function timed(url: string, init?: RequestInit): Promise<{ res: Response | null; ms: number; err?: string }> {
  const t = Date.now();
  try {
    const res = await fetch(url, { ...init, redirect: "manual", signal: AbortSignal.timeout(12000), headers: { "User-Agent": "eryeza-healthcheck/1.0", ...(init?.headers || {}) } });
    return { res, ms: Date.now() - t };
  } catch (e) {
    return { res: null, ms: Date.now() - t, err: e instanceof Error ? e.message : String(e) };
  }
}

async function runChecks(site: string, env: Env): Promise<Check[]> {
  const out: Check[] = [];

  const pageChecks = await Promise.all(PAGES.map(async (p) => {
    const { res, ms, err } = await timed(site + p);
    if (!res) return { name: `page ${p}`, ok: false, detail: err || "no response" };
    const ok = res.status === 200 && ms < 6000;
    return { name: `page ${p}`, ok, detail: `${res.status} in ${ms} ms` };
  }));
  out.push(...pageChecks);

  // Security headers on the home page.
  const home = await timed(site + "/");
  if (home.res) {
    const h = home.res.headers;
    const missing = ["content-security-policy", "strict-transport-security", "x-content-type-options"].filter((k) => !h.get(k));
    out.push({ name: "security headers", ok: missing.length === 0, detail: missing.length ? `missing: ${missing.join(", ")}` : "present" });
  }

  // Real 404s, not a soft homepage.
  const nf = await timed(site + "/this-page-should-not-exist-" + Date.now());
  out.push({ name: "404 page", ok: nf.res?.status === 404, detail: nf.res ? String(nf.res.status) : nf.err || "no response" });

  for (const f of ["/robots.txt", "/sitemap.xml"]) {
    const r = await timed(site + f);
    out.push({ name: f, ok: r.res?.status === 200, detail: r.res ? String(r.res.status) : r.err || "no response" });
  }

  // Film must answer byte ranges (iPhone Safari needs 206).
  const v = await timed(site + "/video/influential-spirit-film.mp4", { headers: { Range: "bytes=0-99" } });
  out.push({
    name: "film range request",
    ok: v.res?.status === 206 && v.res.headers.get("content-range") !== null,
    detail: v.res ? `${v.res.status} ${v.res.headers.get("content-range") || ""}` : v.err || "no response",
  });

  const geo = await timed(site + "/api/geo");
  let geoOk = false;
  try { geoOk = geo.res?.status === 200 && ["usd", "ugx"].includes(((await geo.res.json()) as { region?: string }).region || ""); } catch { /* keep false */ }
  out.push({ name: "/api/geo", ok: geoOk, detail: geo.res ? String(geo.res.status) : geo.err || "no response" });

  // Form back ends.
  // Service binding: Workers cannot fetch workers.dev URLs of their own account directly.
  let spStatus = 0;
  let spBody: { ok?: boolean; storageConfigured?: boolean } = {};
  try { const r = await env.SPEAKING.fetch(new Request("https://speaking.internal/")); spStatus = r.status; spBody = await r.json(); } catch { /* stays 0 */ }
  out.push({ name: "speaking Worker", ok: spStatus === 200 && spBody.ok === true && spBody.storageConfigured === true, detail: `${spStatus}${spBody.storageConfigured ? ", storage ok" : ""}` });
  const st = await timed(site + "/api/study");
  out.push({ name: "study Worker", ok: st.res?.status === 200, detail: st.res ? String(st.res.status) : st.err || "no response" });

  // Mail DNS, via Cloudflare's DNS-over-HTTPS.
  const doh = async (name: string, type: string): Promise<string[]> => {
    try {
      const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`, { headers: { Accept: "application/dns-json" }, signal: AbortSignal.timeout(8000) });
      const j = (await r.json()) as { Answer?: { data: string }[] };
      return (j.Answer || []).map((a) => a.data);
    } catch { return []; }
  };
  const mx = await doh("eryezakalalu.com", "MX");
  out.push({ name: "email MX (books@ etc.)", ok: mx.some((m) => m.includes("mx.cloudflare.net")), detail: mx.length ? "Cloudflare Email Routing" : "no MX found" });
  const dmarc = (await doh("_dmarc.eryezakalalu.com", "TXT")).join(" ");
  out.push({ name: "DMARC record", ok: /v=DMARC1/.test(dmarc), detail: dmarc ? dmarc.replace(/"/g, "").slice(0, 90) : "none" });

  return out;
}

function report(checks: Check[]): string {
  return checks.map((c) => `${c.ok ? "OK  " : "FAIL"}  ${c.name}: ${c.detail}`).join("\n");
}

async function getState(env: Env): Promise<{ status: string; ts: string } | null> {
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS health_state (id TEXT PRIMARY KEY, status TEXT NOT NULL, ts TEXT NOT NULL, note TEXT DEFAULT '')").run();
  return env.DB.prepare("SELECT status, ts FROM health_state WHERE id = 'site'").first<{ status: string; ts: string }>();
}
async function setState(env: Env, status: string, note = ""): Promise<void> {
  await env.DB.prepare("INSERT INTO health_state (id, status, ts, note) VALUES ('site', ?, ?, ?) ON CONFLICT(id) DO UPDATE SET status = excluded.status, ts = excluded.ts, note = excluded.note")
    .bind(status, new Date().toISOString(), note).run();
}

async function mail(env: Env, subject: string, text: string): Promise<void> {
  await env.EMAIL.send({ to: env.NOTIFY_EMAIL || "pastor.eryeza@gmail.com", from: env.FROM_EMAIL || "speaking@eryezakalalu.com", subject, text });
}

async function scheduled(controller: ScheduledController, env: Env): Promise<void> {
  // End-of-launch-pricing reminder (the second cron).
  if (controller.cron === "0 5 1 11 *") {
    await mail(env, "Launch pricing ended today: redeploy the site",
      "Launch pricing on eryezakalalu.com ended at midnight (31 Oct, EAT).\n\n" +
      "On the site, the visible prices and the launch-price notes switch to the normal prices by themselves.\n" +
      "Two things still need a redeploy so search engines and AI assistants see the normal prices:\n" +
      "  1. the JSON-LD offers (priceValidUntil 2026-10-31) in src/app/layout.tsx\n" +
      "  2. the prices and the Last updated line in public/llms.txt\n\n" +
      "Easiest: open Claude Code in the website repo and say: launch pricing ended, update the structured data and llms.txt to the normal prices and deploy.\n" +
      "Payhip and Selar change their prices on their own schedule, so nothing to do there.");
    return;
  }

  const site = env.SITE || "https://eryezakalalu.com";
  const checks = await runChecks(site, env);
  const failed = checks.filter((c) => !c.ok);
  const status = failed.length ? "fail" : "ok";
  const prev = await getState(env);
  const now = Date.now();
  const hoursSince = prev ? (now - Date.parse(prev.ts)) / 3_600_000 : 999;
  const d = new Date();
  const mondayMorning = d.getUTCDay() === 1 && d.getUTCHours() >= 4 && d.getUTCHours() < 10;

  if (status === "fail" && (!prev || prev.status !== "fail" || hoursSince >= 24)) {
    await mail(env, `eryezakalalu.com: ${failed.length} check(s) failing`, `${new Date().toISOString()}\n\n${report(checks)}\n\nThis alert repeats once a day while anything is failing.`);
    await setState(env, "fail", failed.map((f) => f.name).join(", "));
  } else if (status === "ok" && prev?.status === "fail") {
    await mail(env, "eryezakalalu.com: recovered", `${new Date().toISOString()}\n\nAll checks pass again.\n\n${report(checks)}`);
    await setState(env, "ok");
  } else if (status === "ok" && mondayMorning && hoursSince >= 24) {
    await mail(env, "eryezakalalu.com: weekly check, all green", `${new Date().toISOString()}\n\n${report(checks)}`);
    await setState(env, "ok", "weekly");
  } else if (!prev) {
    await setState(env, status);
  }
}

export default {
  scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(scheduled(controller, env));
  },
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/run") {
      // Manual runs need the secret RUN_TOKEN (wrangler secret put RUN_TOKEN) so the public cannot spend the free quota.
      if (!env.RUN_TOKEN || url.searchParams.get("t") !== env.RUN_TOKEN) return new Response("Not found", { status: 404 });
      const checks = await runChecks(env.SITE || "https://eryezakalalu.com", env);
      if (url.searchParams.get("mail") === "1") {
        await mail(env, "eryezakalalu.com: test of the health-check email", `If you can read this, health-check alerts reach you.

${report(checks)}`);
      }
      return new Response(JSON.stringify({ ok: checks.every((c) => c.ok), checks }, null, 2), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
    }
    return new Response("eryeza-healthcheck", { status: 200 });
  },
};
