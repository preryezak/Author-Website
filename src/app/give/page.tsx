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
 *
 * The three reassurances are set as a rule-separated fact row rather than three
 * equal cards, which the site's own style contract rules out.
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
      <section className="section surface-100">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">{GIVING.eyebrow}</span>
            <h1 className="page-head__title">{GIVING.heading}</h1>
            <p className="page-head__lede">{GIVING.lede}</p>
            <div className="page-head__actions">
              <GiveButton source="give-page" variant="button" className="btn btn-gold" />
            </div>
            <p className="caption" style={{ marginTop: 12, color: "var(--ink-300)" }}>
              Opens the secure giving page in a new tab.
            </p>
          </div>

          <div className="fact-row">
            {GIVING.trust.map((t, i) => (
              <div className="fact-row__item" key={i}>
                <p className="fact-row__label">{t.title}</p>
                <p className="fact-row__body">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <div className="route-prose route-measure">
            {GIVING.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="caption" style={{ marginTop: 24, color: "var(--ink-300)", maxWidth: "62ch" }}>
            {GIVING.disclaimer}
          </p>
        </div>
      </section>

      <section className="section surface-100">
        <div className="container">
          <div className="split-editorial">
            <div>
              <span className="eyebrow">Another way</span>
              <h2 className="speaking-block-h" style={{ marginTop: 10 }}>
                Prefer to give by another route?
              </h2>
              <p className="body" style={{ marginTop: 12, color: "var(--ink-500)", maxWidth: "58ch" }}>
                Write to me and we will find a way that suits you. If you would rather not use an online
                provider at all, that is entirely understandable.
              </p>
            </div>
            <div>
              <ul className="link-list">
                <li>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
