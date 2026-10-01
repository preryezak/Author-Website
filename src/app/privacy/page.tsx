import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { OrnamentRule, renderRich } from "@/components/site/ui-bits";
import { PRIVACY } from "@/lib/site-content";

/**
 * Privacy notice as a real page. It used to live only in a modal on the home
 * page, so the cookie banner's "privacy page" link and the /study/ privacy
 * line had nowhere to go. Copy is unchanged (PRIVACY in site-content.ts).
 */
export const metadata: Metadata = {
  title: "Privacy",
  description: "How eryezakalalu.com collects and uses information from visitors, subscribers, readers and anyone who writes in.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <SiteShell active="/privacy">
      <section className="section surface-100">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 720 }}>
            <span className="eyebrow">{PRIVACY.eyebrow}</span>
            <h1 className="page-head__title">{PRIVACY.heading}</h1>
            <p className="caption" style={{ marginTop: 8, color: "var(--ink-300)" }}>{PRIVACY.updated}</p>
            <OrnamentRule>§</OrnamentRule>
            {PRIVACY.paras.map((p, i) => (<p key={i} className="privacy-para">{renderRich(p)}</p>))}
            <p className="caption" style={{ marginTop: 16 }}>{PRIVACY.contactLine}</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
