import { BuyButton, LocalPrice } from "@/components/site/checkout";
import BookStage from "@/components/site/book-stage";
import { ArrowRight } from "@/components/site/ui-bits";
import { LaunchOnly } from "@/components/site/price";
import LaunchCountdown from "@/components/site/launch-countdown";
import { FEATURED_BOOK } from "@/lib/site-content";

/**
 * First screen for the book: what it is, what it costs, one clear button, and the
 * whole edition fanned out beside it.
 *
 * variant "home": the home page presentation (editions further down the page).
 * variant "book": /influential-spirit and the ad pages. Leads with the book's
 * question, and the main button opens the checkout for the Formation Bundle
 * straight away, so a phone visitor can buy from the first screen.
 */
export default function BookHero({
  asH1 = true, id, dayOneHref = "#day-one", variant = "home",
}: { asH1?: boolean; id?: string; dayOneHref?: string; variant?: "home" | "book" }) {
  const Title = asH1 ? "h1" : "h2";
  const book = variant === "book";
  return (
    <section className={`section surface-200 lhero${book ? " lhero--book" : ""}`} id={id}>
      <div className="container">
        <div className="lhero__grid">
          <div className="lhero__copy">
            <span className="eyebrow">{book ? "A 30-day devotional by Pastor Eryeza Kalalu" : "Out now · Volume I · The Deep Encounter Library"}</span>
            <Title className="lhero__title">The Influential Spirit</Title>
            {book ? (
              <>
                <p className="lhero__headline">Who are you becoming while you become visible?</p>
                <p className="body body-lg lhero__lede">
                  Thirty mornings of Scripture, prayer and one practical step, ten to fifteen minutes each, for Christians whose influence is growing at work, at home and in church.
                </p>
              </>
            ) : (
              <>
                <p className="lhero__subtitle">{FEATURED_BOOK.subtitle}</p>
                <p className="lhero__headline">{FEATURED_BOOK.headline}</p>
                <p className="body body-lg lhero__lede">{FEATURED_BOOK.paras[0]}</p>
              </>
            )}
            <div className="lhero__buy">
              <div className="lhero__price" aria-label="Price">
                <span className="lhero__from">{book ? "Formation Bundle with audiobook" : "From"}</span>
                <LocalPrice edition={book ? "formation" : "reader"} />
              </div>
              <div className="flex-wrap-gap gap-4">
                {book ? (
                  <>
                    <BuyButton edition="formation" className="btn btn-primary">Get the Formation Bundle<ArrowRight /></BuyButton>
                    <a className="btn btn-ghost" href="#editions">See all editions</a>
                    <a className="btn btn-link" href={dayOneHref}>Read Day 1 free</a>
                  </>
                ) : (
                  <>
                    <a className="btn btn-primary" href="#editions">Get the book<ArrowRight /></a>
                    <a className="btn btn-ghost" href="#hear">A taste of The Influential Spirit</a>
                    <a className="btn btn-link" href={dayOneHref}>Read Day 1 free</a>
                  </>
                )}
              </div>
              <p className="lhero__note">
                <LaunchOnly><LaunchCountdown /></LaunchOnly>
                {book
                  ? "Pay by mobile money or card. Your books open straight away and arrive by email."
                  : "Instant digital delivery: PDF + EPUB, with audiobook and study editions."}
              </p>
            </div>
          </div>
          <BookStage className="lhero__stage" />
        </div>
      </div>
    </section>
  );
}
