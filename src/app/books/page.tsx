import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { LIBRARY, EDITIONS } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Books · The Deep Encounter Library",
  description:
    "Books and resources by Eryeza Kalalu, including The Influential Spirit. Choose an edition and buy securely.",
  alternates: { canonical: "/books" },
};

export default function BooksPage() {
  const usd = EDITIONS.tiers.filter((t) => t.region === "usd");
  const ugx = EDITIONS.tiers.filter((t) => t.region === "ugx");

  return (
    <SiteShell active="/books">
      <section className="section surface-100 page-hero">
        <div className="container">
          <span className="eyebrow">{LIBRARY.eyebrow}</span>
          <h1 className="display page-hero__title">{LIBRARY.heading}</h1>
          <p className="body page-hero__lede" style={{ maxWidth: "62ch" }}>
            Books, devotionals and study resources written to help people encounter God, understand His Word,
            and live faithfully in ordinary life.
          </p>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <div className="card-grid card-grid--library">
            {LIBRARY.books.map((b, i) => (
              <article className={i === 0 ? "card card--anchor" : "card card--standard"} key={b.title}>
                <span className="card__tag">{b.status}</span>
                <h2 className="card__title">{b.title}</h2>
                <p className="card__meta">{b.role}</p>
                <p className="card__desc">{b.excerpt}</p>
                <p className="card__foot caption">{b.caption}</p>
                {i === 0 ? (
                  <a className="card__cta" href="/influential-spirit">
                    Read about this book
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-100" id="editions">
        <div className="container">
          <span className="eyebrow">{EDITIONS.eyebrow}</span>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", marginTop: 10, fontWeight: 400 }}>
            Choose an edition.
          </h2>
          <p className="caption" style={{ marginTop: 10, color: "var(--ink-400)", maxWidth: "62ch" }}>
            {EDITIONS.note}
          </p>

          {[
            { label: EDITIONS.regionUSD, sub: EDITIONS.regionUSDSub, list: usd },
            { label: EDITIONS.regionUGX, sub: EDITIONS.regionUGXSub, list: ugx },
          ].map((group) => (
            <div className="edition-group" key={group.label}>
              <div className="edition-group__head">
                <h3 className="edition-group__label">{group.label}</h3>
                <span className="caption">{group.sub}</span>
              </div>
              <div className="card-grid card-grid--editions">
                {group.list.map((t, i) => (
                  <article className={i === 1 ? "card card--anchor" : "card card--standard"} key={t.name}>
                    <h4 className="card__title">{t.name}</h4>
                    <p className="card__price">
                      <strong>{t.price}</strong>
                      <s className="card__was">{t.was}</s>
                    </p>
                    <p className="card__desc">{t.desc}</p>
                    <a
                      className="card__cta"
                      href={t.href}
                      target="_blank"
                      rel="noopener noreferrer external"
                    >
                      Buy this edition
                    </a>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
