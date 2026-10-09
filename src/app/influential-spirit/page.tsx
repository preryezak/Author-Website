import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import BooksEditions from "@/components/site/books-editions";
import ReviewGroups from "@/components/site/review-groups";
import SneakPeek, { FilmHero } from "@/components/site/sneak-peek";
import BookHero from "@/components/site/book-hero";
import LaunchBanner from "@/components/site/launch-banner";
import BundleMarquee from "@/components/site/bundle-marquee";
import HearSection from "@/components/site/hear-section";
import { LIBRARY, FAQ } from "@/lib/site-content";

const BOOK = LIBRARY.books[0];

export const metadata: Metadata = {
  title: "The Influential Spirit",
  description:
    "The Influential Spirit is a thirty-day devotional about the person behind the influence: character, formation and the life Christ is forming in us.",
  alternates: { canonical: "/influential-spirit" },
  openGraph: { type: "website", url: "/influential-spirit", title: "The Influential Spirit · Eryeza Kalalu", images: [{ url: "/og.png", width: 1200, height: 630, alt: "The Influential Spirit" }] },
};


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
      {/* ---------- FIRST SCREEN: the book and everything that comes with it ---------- */}
      <LaunchBanner />
      <FilmHero />
      <BookHero dayOneHref="/#day-one" />
      <HearSection />
      <BundleMarquee />

      {/* ---------- WHAT THE BOOK ASKS ---------- */}
      <section className="section surface-50 ask-band">
        <div className="container">
          <div className="ask-band__inner">
            <span className="eyebrow">The question underneath</span>
            <p className="ask-band__quote">Who are you becoming while you become visible?</p>
            <div className="ask-band__cols">
              <p>
                Influence, platform and visibility follow from the answer, and the answer is formed in the presence of
                God and in ordinary life.
              </p>
              <p>
                Thirty days, each with Scripture, a short reflection and a prayer. Written for people with real
                responsibility at home, at work, in church and in public life.
              </p>
            </div>
            <div className="flex-wrap-gap gap-4" style={{ justifyContent: "center", marginTop: 28 }}>
              <a className="btn btn-primary" href="#editions">Get the book</a>
              <a className="btn btn-ghost" href="/#day-one">Read Day 1 free</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- EDITIONS (shared with /books) ---------- */}
      <BooksEditions />

      {/* ---------- PRAISE ---------- */}
      <ReviewGroups />

      {/* ---------- INSIDE EACH EDITION ---------- */}
      <SneakPeek withFilm={false} />

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
