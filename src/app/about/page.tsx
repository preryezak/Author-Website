import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { ABOUT } from "@/lib/site-content";

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

export default function AboutPage() {
  return (
    <SiteShell active="/about">
      <section className="section surface-100 page-hero">
        <div className="container">
          <div className="grid-12" style={{ gap: 56, alignItems: "center" }}>
            <div className="col-7">
              <span className="eyebrow">{ABOUT.eyebrow}</span>
              <h1 className="display page-hero__title">{ABOUT.heading}</h1>
              <p className="body page-hero__lede">{ABOUT.lead}</p>
            </div>
            <div className="col-5">
              <img
                className="about-portrait"
                src={ABOUT.photo}
                alt="Portrait of Eryeza Kalalu"
                width={640}
                height={640}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <div className="prose-feature" style={{ maxWidth: "68ch" }}>
            {ABOUT.paras.map((p, i) => (
              <p key={i} className="about-para">
                {renderRich(p)}
              </p>
            ))}
          </div>
          <p className="about-closer" style={{ maxWidth: "60ch" }}>
            {ABOUT.closer}
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
