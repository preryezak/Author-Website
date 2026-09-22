import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import GiveButton from "@/components/site/give-button";
import { GIVING, SITE } from "@/lib/site-content";

/**
 * The Giving page.
 *
 * Deliberately link-only. There is no payment code in this application: the
 * button opens the hosted Flutterwave donation page in a new tab, and
 * Flutterwave holds the transaction record, the receipt and the payout.
 */
export const metadata: Metadata = {
  title: "Give · Support the work",
  description:
    "Support the writing, teaching and pastoral work of Eryeza Kalalu. Gifts are received securely through Flutterwave.",
  alternates: { canonical: "/give" },
};

export default function GivePage() {
  return (
    <SiteShell active="/give">
      <section className="section surface-100 page-hero">
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow">{GIVING.eyebrow}</span>
            <h1 className="display page-hero__title">{GIVING.heading}</h1>
            <p className="body page-hero__lede">{GIVING.lede}</p>
            <div className="page-hero__actions">
              <GiveButton source="give-page" variant="button" className="btn btn-gold" />
              <span className="caption page-hero__note">Opens the secure giving page in a new tab.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <div className="prose-feature" style={{ maxWidth: "64ch" }}>
            {GIVING.body.map((p, i) => (
              <p key={i} className="body" style={{ color: "var(--ink-500)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-100">
        <div className="container">
          <div className="trust-grid">
            {GIVING.trust.map((t, i) => (
              <article className="trust-card" key={i}>
                <h2 className="trust-card__title">{t.title}</h2>
                <p className="trust-card__desc">{t.desc}</p>
              </article>
            ))}
          </div>
          <p className="caption" style={{ marginTop: 28, color: "var(--ink-300)", maxWidth: "62ch" }}>
            {GIVING.disclaimer}
          </p>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <div className="grid-12" style={{ gap: 40, alignItems: "center" }}>
            <div className="col-7">
              <span className="eyebrow">Another way</span>
              <h2 className="display" style={{ fontSize: "clamp(26px, 3.2vw, 36px)", marginTop: 10, fontWeight: 400 }}>
                Prefer to give by another route?
              </h2>
              <p className="body" style={{ marginTop: 12, color: "var(--ink-500)", maxWidth: "58ch" }}>
                Write to me and we will find a way that suits you. If you would rather not use an online
                provider at all, that is entirely understandable.
              </p>
            </div>
            <div className="col-5">
              <a className="btn btn-outline" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
