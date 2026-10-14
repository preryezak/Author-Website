import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import GiveForm from "@/components/site/give-form";
import { OrnamentRule } from "@/components/site/ui-bits";
import { GIVING } from "@/lib/site-content";

/**
 * The Giving page (handoff P0-1, copy used exactly).
 *
 * Giving happens on this page (GiveForm): once or monthly, in the giver's
 * currency, checked on the server by the eryeza-checkout Worker. Every giver
 * joins the partners list.
 */
export const metadata: Metadata = {
  title: GIVING.eyebrow,
  description: GIVING.lede,
  alternates: { canonical: "/give" },
  openGraph: {
    type: "website",
    url: "/give",
    title: `${GIVING.eyebrow} · Eryeza Kalalu`,
    description: GIVING.lede,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Eryeza Kalalu" }],
  },
  twitter: { card: "summary_large_image", title: `${GIVING.eyebrow} · Eryeza Kalalu`, description: GIVING.lede, images: ["/og.png"] },
};

export default function GivePage() {
  return (
    <SiteShell active="/give">
      <section className="section surface-100">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">{GIVING.eyebrow}</span>
            <h1 className="page-head__title">{GIVING.heading}</h1>
            <p className="page-head__lede">{GIVING.lede}</p>
          </div>
          <div className="give-grid">
            <div className="give-why">
              <h2 className="give-h">What your gift does</h2>
              <ul className="give-list">
                <li>Keeps Devotion in Season and the daily devotionals free for every listener.</li>
                <li>Covers recording, editing and hosting each week.</li>
                <li>Supports the writing and publishing of new books and free study guides.</li>
              </ul>
              <h2 className="give-h">Partners</h2>
              <p className="give-p">Everyone who gives joins our partners list. Partners receive early access and special offers on new books and resources, beginning with Unedited Christmas.</p>
              <p className="caption" style={{ marginTop: 12, color: "var(--ink-300)" }}>{GIVING.smallPrint}</p>
            </div>
            <div className="give-box">
              <GiveForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-200">
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: 680 }}>
            <OrnamentRule>§</OrnamentRule>
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.2vw, 36px)", fontWeight: 400, letterSpacing: "-0.01em" }}>{GIVING.readHeading}</h2>
            <div style={{ marginTop: 24 }}>
              <a className="btn btn-ghost" href={GIVING.readHref}>{GIVING.readCta}</a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
