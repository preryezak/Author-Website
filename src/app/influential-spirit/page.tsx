import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import BooksEditions from "@/components/site/books-editions";
import ReviewGroups from "@/components/site/review-groups";
import SneakPeek from "@/components/site/sneak-peek";
import BookHero from "@/components/site/book-hero";
import BundleMarquee from "@/components/site/bundle-marquee";
import HearSection from "@/components/site/hear-section";
import { LIBRARY, FAQ } from "@/lib/site-content";
import DayOneReader from "@/components/site/day-one-reader";
import FindYourDay from "@/components/site/find-your-day";
import { StickyBuyBar } from "@/components/site/home-islands";
import { BuyButton, LocalPrice } from "@/components/site/checkout";

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
      {/* 1. The promise, the price and the buy button, on the first screen of a phone. */}
      <BookHero variant="book" dayOneHref="#day-one" />

      {/* 2. Hear the author before buying (audio loads only on tap). */}
      <HearSection />

      {/* 3. The visitor's own situation, matched to a day of the book (Workers AI). */}
      <FindYourDay />

      {/* 4. Who it is for. */}
      <section className="section surface-50 ask-band" id="for-you">
        <div className="container">
          <div className="ask-band__inner">
            <span className="eyebrow">Who it is for</span>
            <p className="ask-band__quote">Your pulpit may be a desk.</p>
            <div className="ask-band__cols">
              <p>
                The Influential Spirit is written for the believer whose field is a ward, a classroom, a shop, an office,
                a church or a kitchen table. God formed Joseph in Pharaoh&rsquo;s house and Daniel in Babylon&rsquo;s
                administration, and He forms His people where they work today.
              </p>
              <p>
                Each morning you meet Christ in one passage of Scripture, answer one honest question and take one
                named step you can practise at work that day, such as the Ten-Second Pause or the Coffee Invite. The
                Holy Spirit does the forming. Thirty days is long enough to stop performing and start listening.
              </p>
            </div>
            <div className="flex-wrap-gap gap-4" style={{ justifyContent: "center", marginTop: 28 }}>
              <BuyButton edition="formation" className="btn btn-primary">Get the Formation Bundle</BuyButton>
              <a className="btn btn-ghost" href="#day-one">Read Day 1 free</a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Editions in the visitor's currency, buying on the page. */}
      <BooksEditions />

      {/* 6. Day 1 in full, then a free sign-up for those not ready to buy. */}
      <section className="section surface-100" id="day-one-section">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 820 }}>
            <span className="eyebrow">Read before you buy</span>
            <DayOneReader />
          </div>
        </div>
      </section>

      {/* 7. What readers said. */}
      <ReviewGroups invite={false} verifiedFirst />

      {/* 8. Inside each edition. */}
      <BundleMarquee />
      <SneakPeek withFilm={false} />

      {/* 9. Questions. */}
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

      <StickyBuyBar>
        <div className="meta">
          <div className="eyebrow">The Influential Spirit</div>
          <div className="caption">From <LocalPrice edition="reader" was={false} /></div>
        </div>
        <BuyButton edition="formation" className="btn btn-gold btn-sm">Get the book</BuyButton>
      </StickyBuyBar>
    </SiteShell>
  );
}
