import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { LIBRARY, EDITIONS, FAQ, REVIEWS } from "@/lib/site-content";

const BOOK = LIBRARY.books[0];

export const metadata: Metadata = {
  title: "The Influential Spirit · Eryeza Kalalu",
  description:
    "The Influential Spirit is a thirty-day devotional about the person behind the influence: character, formation and the life Christ is forming in us.",
  alternates: { canonical: "/influential-spirit" },
};

export default function InfluentialSpiritPage() {
  return (
    <SiteShell active="/influential-spirit">
      <section className="section surface-100 page-hero">
        <div className="container">
          <div className="grid-12" style={{ gap: 56, alignItems: "center" }}>
            <div className="col-7">
              <span className="eyebrow">{BOOK.status} · {BOOK.caption}</span>
              <h1 className="display page-hero__title">The Influential Spirit</h1>
              <p className="card__meta" style={{ marginTop: 10 }}>{BOOK.role}</p>
              <p className="body page-hero__lede">{BOOK.excerpt}</p>
              <div className="page-hero__actions">
                <a className="btn btn-gold" href="#editions">
                  Choose an edition
                </a>
                <a
                  className="btn btn-outline"
                  href={EDITIONS.tiers[0].href}
                  target="_blank"
                  rel="noopener noreferrer external"
                >
                  Read a sample
                </a>
              </div>
            </div>
            <div className="col-5">
              <div className="book-cover-frame">
                <img
                  src="/images/cover-640.webp"
                  alt="Cover of The Influential Spirit by Eryeza Kalalu"
                  width={640}
                  height={960}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <div className="prose-feature" style={{ maxWidth: "66ch" }}>
            <p className="body" style={{ color: "var(--ink-500)" }}>
              The book asks a simple, uncomfortable question: who are you becoming? Influence, platform and
              visibility are not the target. The target is the person behind them, formed quietly in the
              presence of God and tested in ordinary life.
            </p>
            <p className="body" style={{ color: "var(--ink-500)" }}>
              Thirty days, each with Scripture, a short reflection and a prayer. Written for people carrying
              real responsibility: at home, at work, in church and in public life.
            </p>
          </div>
        </div>
      </section>

      <section className="section surface-100" id="editions">
        <div className="container">
          <span className="eyebrow">{EDITIONS.eyebrow}</span>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", marginTop: 10, fontWeight: 400 }}>
            Editions
          </h2>
          <div className="card-grid card-grid--editions" style={{ marginTop: 28 }}>
            {EDITIONS.tiers.map((t, i) => (
              <article className={i === 1 ? "card card--anchor" : "card card--standard"} key={`${t.region}-${t.name}`}>
                <span className="card__tag">{t.region === "usd" ? "Rest of the world" : "Africa"}</span>
                <h3 className="card__title">{t.name}</h3>
                <p className="card__price">
                  <strong>{t.price}</strong>
                  <s className="card__was">{t.was}</s>
                </p>
                <p className="card__desc">{t.desc}</p>
                <a className="card__cta" href={t.href} target="_blank" rel="noopener noreferrer external">
                  Buy
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {REVIEWS.items.length > 0 && (
        <section className="section surface-50">
          <div className="container">
            <span className="eyebrow">{REVIEWS.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.2vw, 38px)", marginTop: 10, fontWeight: 400 }}>
              {REVIEWS.heading}
            </h2>
            <div className="card-grid card-grid--reviews" style={{ marginTop: 28 }}>
              {REVIEWS.items.map((r, i) => (
                <article className={i === 0 ? "card card--anchor" : "card card--quiet"} key={i}>
                  <blockquote className="card__quote">“{r.quote}”</blockquote>
                  <p className="card__meta">
                    {r.name} · {r.role}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section surface-100">
        <div className="container">
          <span className="eyebrow">{FAQ.eyebrow}</span>
          <div className="prose-feature" style={{ maxWidth: "70ch", marginTop: 20 }}>
            {FAQ.items.map((f, i) => (
              <div className="faq-item" key={i}>
                <h3 className="faq-item__q">{f.q}</h3>
                <p className="faq-item__a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
