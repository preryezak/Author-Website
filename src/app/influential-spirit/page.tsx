import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import BooksEditions from "@/components/site/books-editions";
import { LIBRARY, FAQ, REVIEWS, FEATURED_BOOK, FLAGSHIP } from "@/lib/site-content";

const BOOK = LIBRARY.books[0];

export const metadata: Metadata = {
  title: "The Influential Spirit",
  description:
    "The Influential Spirit is a thirty-day devotional about the person behind the influence: character, formation and the life Christ is forming in us.",
  alternates: { canonical: "/influential-spirit" },
  openGraph: { type: "website", url: "/influential-spirit", title: "The Influential Spirit · Eryeza Kalalu", images: [{ url: "/og.png", width: 1200, height: 630, alt: "The Influential Spirit" }] },
};

/**
 * Home-page anchors on a standalone page: sections that exist here (editions,
 * questions) stay in-page; anything else points at its home-page section.
 * The earlier version turned "#editions" into "/editions", a 404.
 */
const ON_THIS_PAGE = new Set(["#editions", "#questions"]);
const route = (href: string) => (!href.startsWith("#") || ON_THIS_PAGE.has(href) ? href : "/" + href);

/**
 * The book page.
 *
 * The opening is the home page's `featured-book` presentation, copied exactly:
 * the same device frame around the cover, the same stamp, the same type
 * hierarchy. The previous draft used a plain bordered image, which is what made
 * the page read as a plainer cousin of the home page.
 */
export default function InfluentialSpiritPage() {
  return (
    <SiteShell active="/influential-spirit">
      {/* ---------- OPENING: the home page's featured-book block ---------- */}
      <section className="section surface-200 loose">
        <div className="container">
          <div className="featured-book">
            <div className="featured-book__media">
              <div className="device">
                <span className="device__bezel-mark" aria-hidden="true" />
                <div className="device__screen">
                  <img
                    src="/images/cover-640.webp"
                    srcSet="/images/cover-640.webp 640w, /images/cover-1200.webp 1200w"
                    sizes="(max-width: 1024px) 70vw, 460px"
                    width={1200}
                    height={1800}
                    alt="The Influential Spirit, the actual book front cover"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
                <div className="device__chrome">
                  <span>Digital edition</span>
                  <span className="device__battery" aria-hidden="true" />
                </div>
              </div>
              <div className="cover-stamp">
                <span className="orn">§</span>
                {FLAGSHIP.stampMeta}
                <strong>{FLAGSHIP.stampTitle}</strong>
              </div>
            </div>

            <div>
              <span className="eyebrow">{FEATURED_BOOK.eyebrow}</span>
              <h1 className="featured-book__title">{FEATURED_BOOK.title}</h1>
              <p className="featured-book__subtitle">{FEATURED_BOOK.subtitle}</p>
              <p className="featured-book__headline">{FEATURED_BOOK.headline}</p>
              {FEATURED_BOOK.paras.map((p, i) => (
                <p
                  key={i}
                  className="body body-lg"
                  style={{ maxWidth: "60ch", marginTop: i === 0 ? 0 : 16 }}
                >
                  {p}
                </p>
              ))}
              <p className="featured-book__audience">{FEATURED_BOOK.audience}</p>
              <div className="flex-wrap-gap gap-4" style={{ marginTop: 24 }}>
                <a className="btn btn-primary" href={route(FEATURED_BOOK.ctaPrimaryHref)}>
                  {FEATURED_BOOK.ctaPrimary}
                </a>
                <a className="btn btn-ghost" href={route(FEATURED_BOOK.ctaSecondaryHref)}>
                  {FEATURED_BOOK.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHAT THE BOOK ASKS ---------- */}
      <section className="section surface-50">
        <div className="container">
          <div className="route-prose route-measure">
            <p>
              The book asks a simple question: who are you becoming? Influence, platform and
              visibility follow from the answer, and the answer is formed in the presence of God and in ordinary
              life.
            </p>
            <p>
              Thirty days, each with Scripture, a short reflection and a prayer. Written for people with real
              responsibility at home, at work, in church and in public life.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- EDITIONS (shared with /books) ---------- */}
      <BooksEditions />

      {/* ---------- READER RESPONSES ---------- */}
      {REVIEWS.items.length > 0 && (
        <section className="section surface-50">
          <div className="container">
            <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 48 }}>
              <span className="eyebrow">{REVIEWS.eyebrow}</span>
              <h2
                className="display"
                style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 8, letterSpacing: "-0.01em" }}
              >
                {REVIEWS.heading}
              </h2>
              <p className="caption mt-3">{REVIEWS.subhead}</p>
            </div>
            <div className="ornament-rule" aria-hidden="true">
              <span>§</span>
            </div>
            <div className="grid-12" style={{ gap: 24, marginTop: 32 }}>
              {REVIEWS.items.map((r, i) => (
                <figure className={`col-6 review-card review-card--${i % 2 === 0 ? "a" : "b"}`} key={i}>
                  <div className="orn">“</div>
                  <blockquote>{r.quote}</blockquote>
                  <figcaption>
                    <span className="reviewer-name">{r.name}</span>
                    <span className="reviewer-role">{r.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- QUESTIONS ---------- */}
      <section className="section surface-100" id="questions">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <span className="eyebrow">{FAQ.eyebrow}</span>
            <div className="ornament-rule" aria-hidden="true">
              <span>§</span>
            </div>
            {FAQ.items.map((f, i) => (
              <details className="faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="faq-body">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
