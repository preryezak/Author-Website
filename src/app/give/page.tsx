import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import GiveButton from "@/components/site/give-button";
import { OrnamentRule } from "@/components/site/ui-bits";
import { GIVING } from "@/lib/site-content";

/**
 * The Giving page (handoff P0-1, copy used exactly).
 *
 * Link-only. There is no payment code in this application: GiveButton opens
 * the hosted Flutterwave donation page (GIVING.url) in a new tab and records a
 * non-personal click event, and Flutterwave holds the transaction, the receipt
 * and the payout.
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
            <div className="page-head__actions">
              <GiveButton source="give-page" variant="button" className="btn btn-gold" label={GIVING.pageCta} />
            </div>
            <p className="caption" style={{ marginTop: 12, color: "var(--ink-300)" }}>{GIVING.smallPrint}</p>
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
