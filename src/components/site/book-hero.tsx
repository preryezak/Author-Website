import BookStage from "@/components/site/book-stage";
import { ArrowRight } from "@/components/site/ui-bits";
import { Price, LaunchOnly } from "@/components/site/price";
import LaunchCountdown from "@/components/site/launch-countdown";
import { FEATURED_BOOK } from "@/lib/site-content";

/**
 * First screen for the book: what it is, what it costs, one clear button, and the
 * whole edition fanned out beside it. Used by the home page and /influential-spirit.
 */
export default function BookHero({ asH1 = true, id, dayOneHref = "#day-one" }: { asH1?: boolean; id?: string; dayOneHref?: string }) {
  const Title = asH1 ? "h1" : "h2";
  return (
    <section className="section surface-200 lhero" id={id}>
      <div className="container">
        <div className="lhero__grid">
          <div className="lhero__copy">
            <span className="eyebrow">Out now · Volume I · The Deep Encounter Library</span>
            <Title className="lhero__title">The Influential Spirit</Title>
            <p className="lhero__subtitle">{FEATURED_BOOK.subtitle}</p>
            <p className="lhero__headline">{FEATURED_BOOK.headline}</p>
            <p className="body body-lg lhero__lede">{FEATURED_BOOK.paras[0]}</p>
            <div className="lhero__buy">
              <div className="lhero__price" aria-label="Price">
                <span className="lhero__from">From</span>
                <Price launch="$12" was="$15" full="$15" />
                <span className="lhero__or">or</span>
                <Price launch="UGX 36,000" was="45,000" full="UGX 45,000" />
                <span className="book-hero__or">or</span>
                <Price launch="₦14,400" was="18,000" full="₦18,000" />
              </div>
              <div className="flex-wrap-gap gap-4">
                <a className="btn btn-primary" href="#editions">Get the book<ArrowRight /></a>
                <a className="btn btn-ghost" href="#hear">A taste of The Influential Spirit</a>
                <a className="btn btn-link" href={dayOneHref}>Read Day 1 free</a>
              </div>
              <p className="lhero__note">
                <LaunchOnly><LaunchCountdown /></LaunchOnly>
                Instant digital delivery: PDF + EPUB, with audiobook and study editions.
              </p>
            </div>
          </div>
          <BookStage className="lhero__stage" />
        </div>
      </div>
    </section>
  );
}
