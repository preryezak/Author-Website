import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import GiveButton from "@/components/site/give-button";
import { SITE } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Eryeza Kalalu for speaking invitations, press, or general enquiries.",
  alternates: { canonical: "/contact" },
};

/**
 * Contact.
 *
 * A reading-first page: one measured heading and a rule-separated list of ways
 * to reach the office. No cards, because two equal marketing cards is exactly
 * the pattern the site's style contract rules out.
 */
export default function ContactPage() {
  return (
    <SiteShell active="/contact">
      <section className="section surface-100">
        <div className="container">
          <div className="page-head page-head--left">
            <span className="eyebrow">Contact</span>
            <h1 className="page-head__title">Write to me.</h1>
            <p className="page-head__lede">
              I read what comes in, though I cannot always reply as quickly as I would like.
            </p>
          </div>

          <div className="split-editorial">
            <div>
              <ul className="link-list">
                <li>
                  <a href={`mailto:${SITE.speakingEmail}`}>{SITE.speakingEmail}</a>
                  <p className="fact-row__body" style={{ marginTop: -6, paddingBottom: 14 }}>
                    Speaking invitations: churches, conferences, retreats, universities and corporate gatherings.
                  </p>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  <p className="fact-row__body" style={{ marginTop: -6, paddingBottom: 14 }}>
                    Press, permissions, partnerships and everything else.
                  </p>
                </li>
                <li>
                  <a href="/speaking">The invitation form</a>
                  <p className="fact-row__body" style={{ marginTop: -6, paddingBottom: 14 }}>
                    For speaking requests with dates, audience and format already in mind.
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <div className="fact-row" style={{ gridTemplateColumns: "1fr" }}>
                <div className="fact-row__item">
                  <p className="fact-row__label">Ministry</p>
                  <p className="fact-row__body">{SITE.org}</p>
                </div>
                <div className="fact-row__item">
                  <p className="fact-row__label">Based</p>
                  <p className="fact-row__body">{SITE.eyebrow}</p>
                </div>
                <div className="fact-row__item">
                  <p className="fact-row__label">Support</p>
                  <p className="fact-row__body">
                    <GiveButton source="contact" variant="footer" />
                    <span style={{ color: "var(--paper-100)" }} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
