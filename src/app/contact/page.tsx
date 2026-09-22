import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { SITE } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Eryeza Kalalu for speaking invitations, press, or general enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const rows = [
    {
      label: "Speaking invitations",
      value: SITE.speakingEmail,
      href: `mailto:${SITE.speakingEmail}`,
      note: "Conferences, churches, retreats, universities and corporate gatherings.",
    },
    {
      label: "General enquiries",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      note: "Press, permissions, partnerships and everything else.",
    },
  ];

  return (
    <SiteShell active="/contact">
      <section className="section surface-100 page-hero">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1 className="display page-hero__title">Write to me.</h1>
          <p className="body page-hero__lede" style={{ maxWidth: "58ch" }}>
            I read what comes in, though I cannot always reply as quickly as I would like.
          </p>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <div className="card-grid card-grid--contact">
            {rows.map((r, i) => (
              <article className={i === 0 ? "card card--anchor" : "card card--standard"} key={r.label}>
                <span className="card__tag">{r.label}</span>
                <h2 className="card__title">
                  <a href={r.href}>{r.value}</a>
                </h2>
                <p className="card__desc">{r.note}</p>
              </article>
            ))}
          </div>

          <div className="contact-meta" style={{ marginTop: 40 }}>
            <p className="caption" style={{ color: "var(--ink-400)" }}>
              {SITE.author} · {SITE.org}
            </p>
            <p className="caption" style={{ color: "var(--ink-400)" }}>
              {SITE.eyebrow}
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
