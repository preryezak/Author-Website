import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import SpeakingInviteForm from "@/components/site/speaking-invite-form";
import { SPEAKING, SITE } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Speaking · Eryeza Speaks",
  description:
    "Invite Eryeza Kalalu to speak at churches, conferences, retreats, universities and corporate gatherings.",
  alternates: { canonical: "/speaking" },
};

export default function SpeakingPage() {
  return (
    <SiteShell active="/speaking">
      <section className="section surface-100 page-hero">
        <div className="container">
          <span className="eyebrow">{SPEAKING.heroEyebrow}</span>
          <h1 className="display page-hero__title">{SPEAKING.heroHeading}</h1>
          <p className="body page-hero__lede">{SPEAKING.heroLede}</p>
          <div className="page-hero__actions">
            <a className="btn btn-gold" href="#invite-form">
              Invite Eryeza
            </a>
            <a className="btn btn-outline" href={`mailto:${SITE.speakingEmail}`}>
              {SITE.speakingEmail}
            </a>
          </div>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <span className="eyebrow">{SPEAKING.whereEyebrow}</span>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", marginTop: 10, fontWeight: 400 }}>
            {SPEAKING.whereHeading}
          </h2>
          <p className="body" style={{ marginTop: 12, color: "var(--ink-500)", maxWidth: "62ch" }}>
            {SPEAKING.whereLede}
          </p>
          <div className="card-grid card-grid--serve" style={{ marginTop: 30 }}>
            {SPEAKING.whereItems.map((w, i) => (
              <article className={i === 0 ? "card card--anchor" : "card card--quiet"} key={w.title}>
                <h3 className="card__title">{w.title}</h3>
                <p className="card__desc">{w.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-100">
        <div className="container">
          <span className="eyebrow">{SPEAKING.themesEyebrow}</span>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", marginTop: 10, fontWeight: 400 }}>
            {SPEAKING.themesHeading}
          </h2>
          <p className="body" style={{ marginTop: 12, color: "var(--ink-500)", maxWidth: "62ch" }}>
            {SPEAKING.themesLede}
          </p>
          <div className="card-grid card-grid--themes" style={{ marginTop: 30 }}>
            {SPEAKING.themes.map((t, i) => (
              <article className={i === 0 ? "card card--anchor" : "card card--standard"} key={t.title}>
                <span className="card__tag">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="card__title">{t.title}</h3>
                <p className="card__desc">{t.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <span className="eyebrow">{SPEAKING.howEyebrow}</span>
          <h2 className="display" style={{ fontSize: "clamp(26px, 3.2vw, 38px)", marginTop: 10, fontWeight: 400 }}>
            {SPEAKING.howHeading}
          </h2>
          <div className="prose-feature" style={{ maxWidth: "66ch", marginTop: 16 }}>
            {SPEAKING.howParas.map((p, i) => (
              <p key={i} className="body" style={{ color: "var(--ink-500)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-100" id="invite-form" style={{ scrollMarginTop: 110 }}>
        <div className="container">
          <div className="invite-panel">
            <span className="eyebrow">{SPEAKING.invite.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 8, fontWeight: 400 }}>
              {SPEAKING.invite.heading}
            </h2>
            <p className="body" style={{ marginTop: 12, color: "var(--ink-500)", maxWidth: "62ch" }}>
              {SPEAKING.invite.intro}
            </p>
            <SpeakingInviteForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
