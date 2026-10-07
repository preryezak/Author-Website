"use client";

/**
 * /resources/ (study guides) "Latest episode" card + sign-up form.
 *
 * The episode shown is computed at build time (latest aired in the current
 * theme, else its first) and re-checked in the browser on load, so it advances
 * at each Sunday air time without a rebuild.
 *
 * Posts JSON to NEXT_PUBLIC_STUDY_ENDPOINT (default: same-origin /api/study,
 * served by the `eryeza-study` Worker route). No client libraries.
 */

import { useEffect, useState } from "react";
import { STUDY, STUDY_COVER, ENDPOINTS, CURRENT_THEME, currentEpisode, type StudyEpisode } from "@/lib/site-content";

const CURRENT_THEME_EPISODES = CURRENT_THEME.episodes;
import { ArrowRight } from "@/components/site/ui-bits";
import Turnstile from "@/components/site/turnstile";
import { COUNTRIES, dialFor } from "@/lib/countries";

const ENDPOINT = ENDPOINTS.study;
const FALLBACK_ERROR = "That did not go through. Please try again in a moment.";

export default function StudySignup({ themeTitle, initialEpisode, hasCover }: { themeTitle: string; initialEpisode: StudyEpisode; hasCover: boolean }) {
  const [episode, setEpisode] = useState<StudyEpisode>(initialEpisode);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [iso, setIso] = useState("");
  const [tsToken, setTsToken] = useState("");
  const [tsReset, setTsReset] = useState(0);
  const [tsFailed, setTsFailed] = useState(false);

  useEffect(() => { setEpisode(currentEpisode()); }, []);

  // Pre-select the visitor's own dialling code: where Cloudflare sees them, else their browser language.
  useEffect(() => {
    let live = true;
    const fromLang = () => (navigator.language.split("-")[1] || "").toUpperCase();
    fetch("/api/geo", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((g) => { if (live) setIso((cur) => cur || (g?.country && dialFor(g.country) ? g.country : dialFor(fromLang()) ? fromLang() : "")); })
      .catch(() => { if (live) setIso((cur) => cur || (dialFor(fromLang()) ? fromLang() : "")); });
    return () => { live = false; };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rawPhone = String(fd.get("phone") || "").replace(/[^0-9]/g, "").replace(/^0+/, "");
    if (rawPhone && (rawPhone.length < 5 || rawPhone.length > 12 || !iso)) { setError("Please check the phone number and pick its country code, or leave the phone box empty."); setStatus("error"); return; }
    if (!tsToken && !tsFailed) { setError("One moment while the security check finishes, then press the button again."); setStatus("error"); return; }
    setStatus("sending"); setError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(fd.get("firstName") || "").trim(),
          email: String(fd.get("email") || "").trim(),
          letterOptIn: fd.get("letterOptIn") === "on",
          // The Worker and D1 call this `week`; it is the episode number within the theme.
          week: episode.n,
          website: String(fd.get("website") || ""),
          turnstileToken: tsToken,
          turnstileFailed: !tsToken && tsFailed,
          phone: rawPhone ? `+${dialFor(iso)}${rawPhone}` : "",
          phoneCountry: rawPhone ? iso : "",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; id?: string; kitFormId?: string };
      if (res.ok && data.ok && data.kitFormId) {
        // Kit quarantines sign-ups posted from a server, so the browser posts to
        // the Kit form itself (as Kit's embed code does), then reports the result.
        let kit = "unknown";
        try {
          const kr = await fetch(`https://app.kit.com/forms/${encodeURIComponent(data.kitFormId)}/subscriptions`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
            body: new URLSearchParams({ email_address: String(fd.get("email") || "").trim(), "fields[first_name]": String(fd.get("firstName") || "").trim() }).toString(),
          });
          const kd = (await kr.json().catch(() => ({}))) as { status?: string; errors?: { messages?: string[] } };
          kit = kd.status === "success" ? "success" : `${kd.status || kr.status} ${(kd.errors?.messages || []).join("; ")}`.trim();
        } catch { kit = "network"; }
        fetch(`${ENDPOINT.replace(/\/$/, "")}/result`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: data.id, kit }), keepalive: true }).catch(() => {});
        if (kit === "success") { setStatus("done"); return; }
        setError(FALLBACK_ERROR); setStatus("error"); return;
      }
      if (res.ok && data.ok) { setStatus("done"); return; }
      setError(data.error || FALLBACK_ERROR); setStatus("error");
    } catch {
      setError(FALLBACK_ERROR); setStatus("error");
    } finally {
      setTsReset((n) => n + 1);
    }
  }

  const total = 8;
  const opensNext = (() => {
    const next = CURRENT_THEME_EPISODES.find((e) => e.n === episode.n + 1);
    return next ? `Episode ${next.n} opens Sunday ${new Date(next.sunday + "T12:00:00+03:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "Africa/Kampala" })}, 8 PM East Africa Time.` : "";
  })();

  return (
    <div className="sg" id="get-the-guide">
      {/* ---- Left: the guide ---- */}
      <article className="sg-guide" aria-labelledby="study-week-title">
        <div className="sg-guide__cover">
          {hasCover ? (
            <img src={STUDY_COVER} alt="Devotion in Season study guide cover" width={600} height={800} loading="lazy" decoding="async" />
          ) : (
            <div className="study-week__seal" aria-hidden="true"><img src="/brand/dis-mark.svg" alt="" width={96} height={96} /><span>Study guide</span></div>
          )}
        </div>
        <div className="sg-guide__text">
          <span className="eyebrow">{STUDY.latestLabel}</span>
          <h2 id="study-week-title" className="display sg-guide__title">{episode.title}</h2>
          <p className="sg-guide__ep">{themeTitle}, episode {episode.n} of {total}</p>
          <ol className="sg-dots" aria-label={`Episode ${episode.n} of ${total}`}>
            {Array.from({ length: total }, (_, k) => <li key={k} className={k + 1 <= episode.n ? "is-open" : ""} aria-hidden="true">{k + 1}</li>)}
          </ol>
          {opensNext ? <p className="sg-guide__next">{opensNext}</p> : null}
        </div>
      </article>

      {/* ---- Right: the form ---- */}
      <div className="sg-card">
        {status === "done" ? (
          <div role="status" aria-live="polite" className="sg-done">
            <span className="sg-done__mark" aria-hidden="true">&#10003;</span>
            <p className="display study-success">{STUDY.success}</p>
            <a className="study-book" href={STUDY.bookHref}>
              <img src="/images/cover-640.webp" alt="" width={640} height={960} loading="lazy" decoding="async" />
              <span>
                <span className="study-book__line">{STUDY.bookLine}</span>
                <span className="study-book__cta">Get the book <ArrowRight /></span>
              </span>
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate={false}>
            <span className="eyebrow">Free, every Sunday</span>
            <h2 className="display sg-card__title">Get the guide</h2>
            <p className="sg-card__lede">Passages, five questions, one practice and a prayer, for you or your group. Sign up once and every guide is yours.</p>
            <div className="invite-fields">
              <div className="invite-field">
                <label className="invite-field__label" htmlFor="study-first">{STUDY.firstNameLabel}<span className="req" aria-hidden="true">*</span></label>
                <input id="study-first" name="firstName" type="text" autoComplete="given-name" required maxLength={80} />
              </div>
              <div className="invite-field">
                <label className="invite-field__label" htmlFor="study-email">{STUDY.emailLabel}<span className="req" aria-hidden="true">*</span></label>
                <input id="study-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={200} />
              </div>
              <div className="invite-field">
                <label className="invite-field__label" htmlFor="study-phone">Phone / WhatsApp <span className="sg-opt">optional</span></label>
                <div className="sg-phone">
                  <select aria-label="Country code" value={iso} onChange={(e) => setIso(e.target.value)} autoComplete="tel-country-code">
                    <option value="">Code</option>
                    {COUNTRIES.map((c) => <option key={c.iso} value={c.iso}>{c.iso} +{c.dial} {c.name}</option>)}
                  </select>
                  <input id="study-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={20} placeholder="700 000 000" />
                </div>
                <p className="sg-note">Only so Eryeza's team can reach you directly if it matters. We will never spam you, call you without a reason, or share your number.</p>
              </div>
              {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
              <div className="study-hp" aria-hidden="true">
                <label htmlFor="study-website">Website</label>
                <input id="study-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <label className="study-check">
                <input name="letterOptIn" type="checkbox" defaultChecked={false} />
                <span>{STUDY.letterOptIn}</span>
              </label>
            </div>
            <Turnstile onToken={(v) => { setTsToken(v); if (v) setTsFailed(false); }} onFail={() => setTsFailed(true)} resetKey={tsReset} />
            <div style={{ marginTop: 22 }}>
              <button className="btn btn-accent sg-submit" type="submit" disabled={status === "sending"} aria-busy={status === "sending"}>
                {status === "sending" ? "Sending…" : STUDY.submit}<ArrowRight />
              </button>
            </div>
            {status === "error" ? <p className="study-error" role="alert">{error}</p> : null}
            <p className="caption study-privacy"><a href={STUDY.privacyHref}>{STUDY.privacy}</a></p>
          </form>
        )}
      </div>
    </div>
  );
}
