"use client";

/**
 * /study/ "This week" card + sign-up form.
 *
 * The week shown is computed at build time (latest released, else week 1) and
 * re-checked in the browser on load, so a new week appears at its release
 * moment as long as its STUDY_WEEKS entry was in the last build.
 *
 * Posts JSON to NEXT_PUBLIC_STUDY_ENDPOINT (default: same-origin /api/study,
 * served by the `eryeza-study` Worker route). No client libraries.
 */

import { useEffect, useState } from "react";
import { STUDY, ENDPOINTS, currentStudyWeek, type StudyWeek } from "@/lib/site-content";
import { ArrowRight } from "@/components/site/ui-bits";

const ENDPOINT = ENDPOINTS.study;
const FALLBACK_ERROR = "That did not go through. Please try again in a moment.";

export default function StudySignup({ initialWeek, coversPresent }: { initialWeek: StudyWeek; coversPresent: string[] }) {
  const [week, setWeek] = useState<StudyWeek>(initialWeek);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => { setWeek(currentStudyWeek()); }, []);

  const hasCover = coversPresent.includes(week.cover);
  const showEpisodeTitle = week.episodeTitle && week.episodeTitle !== week.title;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending"); setError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(fd.get("firstName") || "").trim(),
          email: String(fd.get("email") || "").trim(),
          letterOptIn: fd.get("letterOptIn") === "on",
          week: week.week,
          website: String(fd.get("website") || ""),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) { setStatus("done"); return; }
      setError(data.error || FALLBACK_ERROR); setStatus("error");
    } catch {
      setError(FALLBACK_ERROR); setStatus("error");
    }
  }

  return (
    <div className="study-grid">
      {/* ---- This week ---- */}
      <article className="study-week" aria-labelledby="study-week-title">
        <div className="study-week__cover">
          {hasCover ? (
            <img src={week.cover} alt={`Study guide cover, week ${week.week}: ${week.title}`} width={600} height={800} loading="lazy" decoding="async" />
          ) : (
            <div className="study-week__seal" aria-hidden="true">
              <img src="/brand/dis-mark.svg" alt="" width={96} height={96} />
              <span>Week {week.week}</span>
            </div>
          )}
        </div>
        <div className="study-week__text">
          <span className="eyebrow">{STUDY.thisWeekLabel} · Week {week.week}</span>
          <h2 id="study-week-title" className="display study-week__title">{week.title}</h2>
          {showEpisodeTitle ? <p className="study-week__episode">{week.episodeTitle}</p> : null}
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
