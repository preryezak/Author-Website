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
import { STUDY, STUDY_COVER, ENDPOINTS, currentEpisode, type StudyEpisode } from "@/lib/site-content";
import { ArrowRight } from "@/components/site/ui-bits";
import Turnstile from "@/components/site/turnstile";

const ENDPOINT = ENDPOINTS.study;
const FALLBACK_ERROR = "That did not go through. Please try again in a moment.";

export default function StudySignup({ themeTitle, initialEpisode, hasCover }: { themeTitle: string; initialEpisode: StudyEpisode; hasCover: boolean }) {
  const [episode, setEpisode] = useState<StudyEpisode>(initialEpisode);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [tsToken, setTsToken] = useState("");
  const [tsReset, setTsReset] = useState(0);

  useEffect(() => { setEpisode(currentEpisode()); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!tsToken) { setError("One moment while the security check finishes, then press the button again."); setStatus("error"); return; }
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

  return (
    <div className="study-grid">
      {/* ---- Latest episode ---- */}
      <article className="study-week" aria-labelledby="study-week-title">
        <div className="study-week__cover">
          {hasCover ? (
            <img src={STUDY_COVER} alt="Devotion in Season study guide cover" width={600} height={800} loading="lazy" decoding="async" />
          ) : (
            <div className="study-week__seal" aria-hidden="true">
              <img src="/brand/dis-mark.svg" alt="" width={96} height={96} />
              <span>Study guide</span>
            </div>
          )}
        </div>
        <div className="study-week__text">
          <span className="eyebrow">{STUDY.latestLabel}</span>
          <h2 id="study-week-title" className="display study-week__title">{episode.title}</h2>
          <p className="study-week__episode">{themeTitle}, episode {episode.n}</p>
        </div>
      </article>

      {/* ---- Form / success ---- */}
      <div className="study-form-card">
        {status === "done" ? (
          <div role="status" aria-live="polite">
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
            <div className="invite-fields">
              <div className="invite-field">
                <label className="invite-field__label" htmlFor="study-first">{STUDY.firstNameLabel}<span className="req" aria-hidden="true">*</span></label>
                <input id="study-first" name="firstName" type="text" autoComplete="given-name" required maxLength={80} />
              </div>
              <div className="invite-field">
                <label className="invite-field__label" htmlFor="study-email">{STUDY.emailLabel}<span className="req" aria-hidden="true">*</span></label>
                <input id="study-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={200} />
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
            <Turnstile onToken={setTsToken} onFail={() => { setError("The security check could not run in this browser. Try another browser or turn off content blockers for this site, or write to hello@eryezakalalu.com instead."); setStatus("error"); }} resetKey={tsReset} />
            <div style={{ marginTop: 24 }}>
              <button className="btn btn-accent" type="submit" disabled={status === "sending"} aria-busy={status === "sending"}>
                {STUDY.submit}<ArrowRight />
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
