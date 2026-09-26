import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { ABOUT, SITE } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About Eryeza Kalalu",
  description:
    "Eryeza Kalalu is a pastor, author, speaker and communicator writing about faith, character, purpose and influence.",
  alternates: { canonical: "/about" },
};

/** Render **bold** and *italic* markers from the content file. */
function renderRich(text: string) {
  const out: React.ReactNode[] = [];
  text.split("**").forEach((boldPart, bi) => {
    if (bi % 2 === 1) {
      out.push(<strong key={`b${bi}`}>{boldPart}</strong>);
      return;
    }
    boldPart.split("*").forEach((italicPart, ii) => {
      if (ii % 2 === 1) out.push(<em key={`i${bi}-${ii}`}>{italicPart}</em>);
      else if (italicPart) out.push(<span key={`t${bi}-${ii}`}>{italicPart}</span>);
    });
  });
  return out;
}

/**
 * About, on its own route.
 *
 * Uses the home page's own `.about-section` layout: the mark and portrait in a
 * media column, the bio in the reading column. Same classes, same rhythm.
 */
export default function AboutPage() {
  return (
    <SiteShell active="/about">
      <section className="section surface-parchment">
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: 720, marginBottom: 48 }}>
            <span className="eyebrow">{ABOUT.eyebrow}</span>
            <h1 className="page-head__title">{ABOUT.heading}</h1>
          </div>

          <div className="about-section">
            <div className="about-section__media">
              <img className="about-logo" src={ABOUT.logo} alt="EK monogram" width={96} height={96} />
              <div className="about-portrait">
                <img
                  src={ABOUT.photo}
                  width={640}
                  height={960}
                  alt="Pastor Eryeza Kalalu"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="about-section__body">
              <p className="about-lead">{ABOUT.lead}</p>
              {ABOUT.paras.map((p, i) => (
                <p key={i} className="about-para">
                  {renderRich(p)}
                </p>
              ))}
              <div className="about-section__closer">{ABOUT.closer}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-100">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">Elsewhere</span>
            <h2 className="page-head__title">Where to find the work.</h2>
          </div>
          <ul className="link-list">
            <li>
              <a href="/books">The library</a>
            </li>
            <li>
              <a href="/speaking">Invite Eryeza to speak</a>
            </li>
            <li>
              <a href="/podcast">Devotion In Season, the podcast</a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
