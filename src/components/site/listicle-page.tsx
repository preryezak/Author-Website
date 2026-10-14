import Link from "next/link";
import CookieBanner from "@/components/site/cookie-banner";
import BooksEditions from "@/components/site/books-editions";
import DayOneReader from "@/components/site/day-one-reader";
import BookStage from "@/components/site/book-stage";
import { StickyBuyBar } from "@/components/site/home-islands";
import { BuyButton, LocalPrice } from "@/components/site/checkout";
import { LaunchOnly } from "@/components/site/price";
import LaunchCountdown from "@/components/site/launch-countdown";
import type { Listicle } from "@/lib/listicles";

/**
 * Ad landing page (listicle). No site menu: the only ways forward are the
 * book, Day 1, and the checkout. Headings in Newsreader; body in DM Sans at
 * 18px with a 64-character measure, so it reads fast on a phone.
 */
export default function ListiclePage({ l }: { l: Listicle }) {
  return (
    <div className="lp">
      <header className="lp-top">
        <div className="lp-wrap lp-top__row">
          <Link prefetch={false} href="/" className="lp-brand">Eryeza Kalalu</Link>
          <BuyButton edition="formation" className="btn btn-primary btn-sm">Get the book</BuyButton>
        </div>
      </header>

      <main>
        <section className="lp-hero">
          <div className="lp-wrap">
            <p className="lp-kicker">{l.kicker}</p>
            <h1 className="lp-h1">{l.headline}</h1>
            <p className="lp-sub">{l.subhead}</p>
            <p className="lp-by">By Pastor Eryeza Kalalu · Kawuku, Uganda</p>
            <div className="lp-hero-cta">
              <BuyButton edition="formation" className="btn btn-primary">Get the Formation Bundle</BuyButton>
              <a className="btn btn-ghost" href="#day-one">Read Day 1 free</a>
            </div>
          </div>
        </section>

        <section className="lp-reasons">
          <div className="lp-wrap">
            <ol className="lp-list">
              {l.reasons.map((r, i) => (
                <li key={i} className="lp-item">
                  <span className="lp-num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h2 className="lp-h2">{r.title}</h2>
                    <p className="lp-p">{r.body}</p>
                    {r.quote ? <blockquote className="lp-quote">&ldquo;{r.quote.text}&rdquo;<cite>{r.quote.who}</cite></blockquote> : null}
                    {r.audio ? (
                      <div className="lp-audio">
                        <span>Hear Pastor Eryeza read from Day 25</span>
                        <audio controls preload="none" src={r.audio} />
                      </div>
                    ) : null}
                    {l.ctaAfter.includes(i + 1) ? (
                      <div className="lp-mid-cta">
                        <BuyButton edition="formation" className="btn btn-primary">Get the Formation Bundle</BuyButton>
                        <span className="lp-from">From <LocalPrice edition="reader" was={false} /> · Pay by mobile money or card</span>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="lp-book">
          <div className="lp-wrap lp-book__grid">
            <BookStage className="lp-stage" />
            <div>
              <h2 className="lp-h2">The Influential Spirit</h2>
              <p className="lp-p">{l.closing}</p>
              <p className="lp-p lp-small"><LaunchOnly><LaunchCountdown /></LaunchOnly> Your books open straight away and arrive by email.</p>
            </div>
          </div>
        </section>

        <BooksEditions heading />

        <section className="section surface-100">
          <div className="container">
            <div className="mx-auto" style={{ maxWidth: 820 }}>
              <span className="eyebrow">Read before you buy</span>
              <DayOneReader />
            </div>
          </div>
        </section>

        <section className="lp-faq">
          <div className="lp-wrap">
            <h2 className="lp-h2">Questions</h2>
            {l.faq.map((f, i) => (
              <details className="faq-item" key={i}>
                <summary>{f.q}</summary>
                <div className="faq-body">{f.a}</div>
              </details>
            ))}
            <div className="lp-hero-cta" style={{ marginTop: 28 }}>
              <BuyButton edition="formation" className="btn btn-primary">Get the Formation Bundle</BuyButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-foot">
        <div className="lp-wrap">
          <p>© Eryeza Kalalu · <a href="/privacy/">Privacy</a> · <a href="mailto:books@eryezakalalu.com">books@eryezakalalu.com</a></p>
        </div>
      </footer>

      <StickyBuyBar>
        <div className="meta">
          <div className="eyebrow">The Influential Spirit</div>
          <div className="caption">From <LocalPrice edition="reader" was={false} /></div>
        </div>
        <BuyButton edition="formation" className="btn btn-gold btn-sm">Get the book</BuyButton>
      </StickyBuyBar>
      <CookieBanner />
    </div>
  );
}
