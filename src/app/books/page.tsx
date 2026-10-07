import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import BookCard from "@/components/site/book-card";
import BooksEditions from "@/components/site/books-editions";
import { LIBRARY, WHATS_NEXT, PODCAST } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Books · The Deep Encounter Library",
  description:
    "Books and resources by Eryeza Kalalu, including The Influential Spirit. Choose an edition and buy securely.",
  alternates: { canonical: "/books" },
  openGraph: {
    type: "website",
    url: "/books",
    title: "Books · The Deep Encounter Library · Eryeza Kalalu",
    description: "Books and resources by Eryeza Kalalu, including The Influential Spirit. Choose an edition and buy securely.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Eryeza Kalalu" }],
  },
  twitter: { card: "summary_large_image", title: "Books · The Deep Encounter Library · Eryeza Kalalu", description: "Books and resources by Eryeza Kalalu, including The Influential Spirit. Choose an edition and buy securely.", images: ["/og.png"] },
};

/**
 * The library, on its own route.
 *
 * Built to the same standard as the home page's library block: the dark ink
 * surface, the same BookCard component, the same block-head pattern. The page
 * previously used a generic light card grid, which is what made it read as a
 * plainer cousin of the home page.
 */
export default function BooksPage() {
  return (
    <SiteShell active="/books">
      {/* ---------- LIBRARY ---------- */}
      <section className="section surface-ink library-dark">
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: 640 }}>
            <span className="eyebrow">{LIBRARY.eyebrow}</span>
            <h1 className="page-head__title">{LIBRARY.heading}</h1>
          </div>
          <div className="ornament-rule" aria-hidden="true">
            <span>§</span>
          </div>

          <div className="grid-12" style={{ gap: 24, marginTop: 24 }}>
            {LIBRARY.books.map((b) => (
              <BookCard book={b} key={b.title} anchorMode="route" headingLevel={2} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHAT COMES NEXT ---------- */}
      <section className="section surface-100">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">{WHATS_NEXT.nextEyebrow}</span>
            <h2 className="page-head__title">{WHATS_NEXT.nextHeading}</h2>
          </div>
          <div className="fact-row">
            {LIBRARY.books.map((b) => (
              <div className="fact-row__item" key={`f-${b.title}`}>
                <p className="fact-row__label">{b.status}</p>
                <p className="fact-row__body">{b.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EDITIONS ---------- */}
      <BooksEditions />

      {/* ---------- THE PODCAST, AS ON THE HOME PAGE ---------- */}
      <section className="dis-strip">
        <div className="container">
          <div className="dis-row">
            <img
              src="/brand/dis-mark.svg"
              alt="Devotion In Season seal"
              className="dis-seal"
              style={{ padding: 12 }}
            />
            <div className="stack">
              <span className="dis-eb">{PODCAST.eyebrow}</span>
              <h2 className="dis-title">{PODCAST.title}</h2>
              <p className="dis-lede">{PODCAST.lede}</p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
