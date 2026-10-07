import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import InvitePanel from "@/components/site/invite-panel";
import EngagementsGrid from "@/components/site/engagements";
import ServeIcon from "@/components/site/serve-icon";
import { SPEAKING, SITE, FEATURED_BOOK } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Speaking · Eryeza Speaks",
  description:
    "Invite Eryeza Kalalu to speak at churches, conferences, retreats, universities and corporate gatherings.",
  alternates: { canonical: "/speaking" },
  openGraph: {
    type: "website",
    url: "/speaking",
    title: "Speaking · Eryeza Kalalu",
    description: "Invite Eryeza Kalalu to speak at churches, conferences, retreats, universities and corporate gatherings.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Eryeza Kalalu" }],
  },
  twitter: { card: "summary_large_image", title: "Speaking · Eryeza Kalalu", description: "Invite Eryeza Kalalu to speak at churches, conferences, retreats, universities and corporate gatherings.", images: ["/og.png"] },
};

function OrnamentRule({ children }: { children?: React.ReactNode }) {
  return (
    <div className="ornament-rule" aria-hidden="true">
      <span>{children ?? "§"}</span>
    </div>
  );
}

/**
 * The hero heading is split into two deliberate lines so it never runs as one
 * stretched string across a desktop viewport. The words come from
 * SPEAKING.heroHeading, split at the natural break, so the copy stays in one
 * place and cannot drift from the source.
 */
const HERO_HEADING = SPEAKING.heroHeading;
const HERO_SPLIT_AT = " where ";
const heroParts = HERO_HEADING.includes(HERO_SPLIT_AT)
  ? [HERO_HEADING.split(HERO_SPLIT_AT)[0], "where " + HERO_HEADING.split(HERO_SPLIT_AT).slice(1).join(HERO_SPLIT_AT)]
  : [HERO_HEADING, ""];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export default function SpeakingPage() {
  return (
    <SiteShell active="/speaking">
      {/* ---------- HERO ---------- */}
      <section className="section" style={{ background: "var(--oxblood-50)" }}>
        <div className="container">
          <img
            className="speaking-seal"
            src="/brand/logo-es.svg"
            alt="Eryeza Speaks mark"
            width={72}
            height={72}
            style={{ marginBottom: 20 }}
          />

          <div className="page-head">
            <span className="eyebrow">{SPEAKING.heroEyebrow}</span>
            <h1 className="hero-split">
              <span className="hero-split__line">{heroParts[0]}</span>
              {heroParts[1] ? <span className="hero-split__line">{heroParts[1]}</span> : null}
            </h1>
            <p className="page-head__lede">{SPEAKING.heroLede}</p>
            <div className="page-head__actions">
              <a className="btn btn-gold" href="#invite-form">
                Invite Eryeza to Speak
              </a>
              <a className="btn btn-ghost" href={`mailto:${SITE.speakingEmail}`}>
                {SITE.speakingEmail}
              </a>
            </div>
          </div>

          {/* The black quote card, exactly as the home page carries it */}
          <div className="speaking-hero-cta">
            <img className="shc-wordmark" src="/brand/logo-es.svg" alt="" width={56} height={56} />
            <p className="shc-words">{FEATURED_BOOK.standout}</p>
            <div className="shc-rule" />
            <div className="shc-cta-row">
              <a
                className="btn btn-ghost"
                style={{ color: "var(--paper-50)", borderColor: "rgba(184,146,90,0.5)" }}
                href="#invite-form"
              >
                Invite Eryeza to Speak
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHERE ERYEZA CAN SERVE ---------- */}
      <section className="section surface-100">
        <div className="container">
          <div className="speaking-block-head">
            <span className="eyebrow">{SPEAKING.whereEyebrow}</span>
            <h2 className="speaking-block-h">{SPEAKING.whereHeading}</h2>
            <OrnamentRule>§</OrnamentRule>
            <p className="speaking-lede">{SPEAKING.whereLede}</p>
          </div>
          <div className="serve-grid">
            {SPEAKING.whereItems.map((w, i) => (
              <article className="serve-card" key={i}>
                <span className="serve-card__icon" aria-hidden="true">
                  <ServeIcon name={w.icon} />
                </span>
                <h3 className="serve-card__title">{w.title}</h3>
                <p className="serve-card__desc">{w.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- THEMES ---------- */}
      <section className="section surface-50">
        <div className="container">
          <div className="speaking-block-head">
            <span className="eyebrow">{SPEAKING.themesEyebrow}</span>
            <h2 className="speaking-block-h">{SPEAKING.themesHeading}</h2>
            <OrnamentRule>§</OrnamentRule>
            <p className="speaking-lede">{SPEAKING.themesLede}</p>
          </div>
          <div className="grid-12" style={{ gap: 24 }}>
            {SPEAKING.themes.map((t, i) => (
              <article className="col-4 speaking-card speaking-card--c" key={i}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: 30,
                    color: "var(--gold-400)",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {ROMAN[i]}
                </div>
                <h3 className="sc-title">{t.title}</h3>
                <div className="sc-body">{t.desc}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW I TEACH ---------- */}
      <section className="section surface-100">
        <div className="container">
          <div className="speaking-block-head">
            <span className="eyebrow">{SPEAKING.howEyebrow}</span>
            <h2 className="speaking-block-h">{SPEAKING.howHeading}</h2>
            <OrnamentRule>§</OrnamentRule>
          </div>
          <div className="speaking-card speaking-card--d" style={{ padding: 32 }}>
            <div className="prose-feature route-measure">
              {SPEAKING.howParas.map((p, i) => (
                <p key={i} className="reader__prose">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SELECTED ENGAGEMENTS (alternating, shared with the home page) ---------- */}
      <section className="section surface-50">
        <div className="container">
          <div className="speaking-block-head">
            <span className="eyebrow">{SPEAKING.engagementsEyebrow}</span>
            <h2 className="speaking-block-h">{SPEAKING.engagementsHeading}</h2>
            <OrnamentRule>§</OrnamentRule>
            <p className="caption" style={{ margin: 0 }}>
              {SPEAKING.engagementsLede}
            </p>
          </div>
          <EngagementsGrid />
        </div>
      </section>

      {/* ---------- INVITATION (collapsed until asked for) ---------- */}
      <section className="section surface-100">
        <div className="container">
          <InvitePanel />
        </div>
      </section>
    </SiteShell>
  );
}
