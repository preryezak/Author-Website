import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import SiteShell from "@/components/site/site-shell";
import StudySignup from "@/components/site/study-signup";
import StudyStage from "@/components/site/study-stage";
import SeriesGrid from "@/components/site/series-grid";
import { OrnamentRule } from "@/components/site/ui-bits";
import { STUDY, STUDY_COVER, CURRENT_THEME, currentEpisode } from "@/lib/site-content";

export const dynamic = "force-static";

const TITLE = "Free study guides";
const DESCRIPTION = STUDY.lede;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/resources" },
  openGraph: {
    type: "website",
    url: "/resources",
    title: `${TITLE} · Devotion in Season`,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Eryeza Kalalu" }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} · Devotion in Season`, description: DESCRIPTION, images: ["/og.png"] },
};

const STEPS = [
  { n: "I", title: "The passages", text: "The Scripture behind the episode, with what it meant when it was written." },
  { n: "II", title: "Five questions", text: "Honest questions that move from easy to costly, for you or for a group." },
  { n: "III", title: "One practice", text: "A single thing to do this week, small enough to actually do." },
  { n: "IV", title: "A prayer", text: "A prayer to say slowly, in your own voice, at the end." },
];

const FAQ = [
  { q: "Is it really free?", a: "Yes. The guides are free, every week of the series, and you can print them and share them with your group." },
  { q: "How do I get each new guide?", a: "Sign up once and confirm your email. The study library opens, and every guide that has aired is there. A new one opens every Sunday at 8 PM East Africa Time, when its episode airs." },
  { q: "Why ask for a phone number?", a: "It is optional. It lets Eryeza's team reach you directly if it matters, for example about a gathering you asked about. We will never spam you or share your number." },
  { q: "Can I use it with a group?", a: "That is what it is built for. The five questions work for a small group, a team at work or a family, and a session takes about forty-five minutes." },
];

export default function StudyPage() {
  // The series cover. Until it exists the card shows a seal panel.
  const hasCover = existsSync(join(process.cwd(), "public", STUDY_COVER));
  const buildTime = Date.now();
  return (
    <SiteShell active="/resources">
      {/* ---------- OPENING ---------- */}
      <section className="section study-hero">
        <div className="container">
          <div className="study-hero__grid">
            <div className="study-hero__copy">
              <span className="eyebrow">{STUDY.eyebrow}</span>
              <h1 className="study-hero__title">{STUDY.heading}</h1>
              <p className="study-hero__lede">{STUDY.lede}</p>
              <ul className="study-hero__points">
                <li><b>8 Sundays</b><span>one guide for each episode</span></li>
                <li><b>20 minutes</b><span>on your own, or 45 with a group</span></li>
                <li><b>Free</b><span>print it, share it, keep it</span></li>
              </ul>
              <div className="flex-wrap-gap gap-4">
                <a className="btn btn-gold" href="#get-the-guide">Get the guide</a>
                <a className="btn btn-link study-hero__link" href="#series">See the eight Sundays</a>
              </div>
            </div>
            <StudyStage />
          </div>
        </div>
      </section>

      {/* ---------- SIGN-UP ---------- */}
      <section className="section surface-100 loose" style={{ paddingTop: 56 }}>
        <div className="container">
          <StudySignup themeTitle={CURRENT_THEME.title} initialEpisode={currentEpisode()} hasCover={hasCover} />
        </div>
      </section>

      {/* ---------- WHAT IS IN EACH GUIDE ---------- */}
      <section className="section surface-parchment">
        <div className="container">
          <div className="text-center mx-auto" style={{ maxWidth: 640 }}>
            <span className="eyebrow">Inside every guide</span>
            <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", marginTop: 8, letterSpacing: "-0.01em" }}>Four parts, about twenty minutes.</h2>
          </div>
          <OrnamentRule>§</OrnamentRule>
          <ol className="steps4">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="steps4__n" aria-hidden="true">{s.n}</span>
                <h3 className="display steps4__t">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- THE SERIES ---------- */}
      <section id="series" className="section surface-100">
        <div className="container">
          <div className="text-center mx-auto" style={{ maxWidth: 680 }}>
            <span className="eyebrow">{CURRENT_THEME.title}</span>
            <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", marginTop: 8, letterSpacing: "-0.01em" }}>Eight Sundays, one guide each.</h2>
            <p className="caption" style={{ marginTop: 12 }}>Every guide opens when its episode airs, Sunday at 8 PM East Africa Time.</p>
          </div>
          <OrnamentRule>§</OrnamentRule>
          <SeriesGrid buildTime={buildTime} />
        </div>
      </section>

      {/* ---------- QUESTIONS + THE BOOK ---------- */}
      <section className="section surface-50">
        <div className="container">
          <div className="study-end">
            <div>
              <span className="eyebrow">Questions</span>
              <div style={{ marginTop: 14 }}>
                {FAQ.map((f, i) => (
                  <details className="faq-item" key={i}>
                    <summary>{f.q}</summary>
                    <div className="faq-body">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
            <a className="study-book study-book--big" href={STUDY.bookHref}>
              <img src="/images/cover-640.webp" alt="" width={640} height={960} loading="lazy" decoding="async" />
              <span>
                <span className="study-book__line">{STUDY.bookLine}</span>
                <span className="study-book__cta">Get the book &rarr;</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
