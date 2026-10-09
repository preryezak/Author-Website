import {
  SITE, HERO, FLAGSHIP, FEATURED_BOOK, WHY_THIS_BOOK, AUTHOR_LETTER,
  DISCOVER, LIBRARY, PODCAST, NEWSLETTER, THIRTY_DAYS, DAY1_FULL, PILLARS,
  THE_DAYS, FAQ, WHATS_NEXT, ABOUT, SPEAKING,
} from "@/lib/site-content";
import { getLetters, getEpisodes } from "@/lib/rss";
import SiteShell from "@/components/site/site-shell";
import BooksEditions from "@/components/site/books-editions";
import ReviewGroups from "@/components/site/review-groups";
import SneakPeek, { FilmHero } from "@/components/site/sneak-peek";
import BookHero from "@/components/site/book-hero";
import LaunchBanner from "@/components/site/launch-banner";
import BundleMarquee from "@/components/site/bundle-marquee";
import HearSection from "@/components/site/hear-section";
import BookCard from "@/components/site/book-card";
import EngagementsGrid from "@/components/site/engagements";
import ServeIcon from "@/components/site/serve-icon";
import InvitePanel from "@/components/site/invite-panel";
import EpisodeList from "@/components/site/episode-list";
import { Price } from "@/components/site/price";
import { OrnamentRule, ArrowRight, fmtDate, renderRich, PlatformGrid } from "@/components/site/ui-bits";
import { RevealInit, DayOneEnhancer, StickyBuyBar, IheartPlayer } from "@/components/site/home-islands";

/**
 * Homepage. A server component rendered at build time (output: "export"), so
 * every section arrives as finished HTML and the Beehiiv letters and podcast
 * episodes are baked in. Only the islands in home-islands.tsx, the editions
 * picker, the episode list and the invitation form run in the browser.
 * If a feed is unreachable at build time its section shows its empty state.
 *
 * Section ids are kept (top, influential-spirit, author, thirtydays, day-one,
 * editions, reviews, questions, books, letters-preview, podcast, letter,
 * about, speaking, invite-form) so existing "/#..." links keep working.
 */
export const dynamic = "force-static";

/** "{usd}" / "{ugx}" placeholders in content become launch-or-full prices. */
function withPrices(text: string) {
  return text.split(/(\{usd\}|\{ugx\})/).map((part, i) =>
    part === "{usd}" ? <Price key={i} launch="$12" full="$15" />
      : part === "{ugx}" ? <Price key={i} launch="UGX 36,000" full="UGX 45,000" />
      : part,
  );
}

export default async function Home() {
  const [letters, episodes] = await Promise.all([getLetters(6), getEpisodes(30)]);

  return (
    <SiteShell active="/">
      <RevealInit />

      {/* ============ BOOK FIRST: hero, banner, film, bundle strip, buy ============ */}
      <div id="top" />
      <LaunchBanner variant="home" />
      <FilmHero />
      <BookHero id="influential-spirit" />
      <HearSection />
      <BundleMarquee />

      {/* ============ EDITIONS (shared with /books and /influential-spirit) ============ */}
      <BooksEditions heading={false} />

      {/* ============ REVIEWS ============ */}
      <ReviewGroups />

      {/* ============ HERO (not data-reveal: it is the first paint) ============ */}
      <section className="section surface-100" id="welcome">
        <div className="container">
          <div className="grid-12" style={{ alignItems: "center", gap: 64 }}>
            <div className="col-7 stack-lg">
              <span className="eyebrow">{HERO.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1.05, fontWeight: 400, letterSpacing: "-0.02em" }}>{HERO.headline}</h2>
              <p className="body body-lg" style={{ maxWidth: "54ch" }}>{HERO.body}</p>
              <div className="flex-wrap-gap gap-4" style={{ paddingTop: 8 }}>
                <a className="btn btn-primary" href="#about">About Eryeza<ArrowRight /></a>
                <a className="btn btn-ghost" href="#speaking">Invite him to speak</a>
              </div>
            </div>
            <div className="col-5">
              <div className="portrait-frame">
                <figure className="author-portrait--feathered">
                  <img
                    src="/images/author-640.webp"
                    srcSet="/images/author-640.webp 640w"
                    sizes="(max-width: 1024px) 88vw, 420px"
                    width={640}
                    height={960}
                    alt="Pastor Eryeza Kalalu"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="portrait-tag">
                  <div className="name">{HERO.portraitName}</div>
                  <div className="loc">{HERO.portraitLoc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY THIS BOOK ============ */}
      <section className="section surface-100" data-reveal>
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: 680 }}>
            <span className="eyebrow">{WHY_THIS_BOOK.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.015em" }}>{WHY_THIS_BOOK.heading}</h2>
          </div>
          <OrnamentRule>§</OrnamentRule>
          <div className="grid-12" style={{ gap: 24, marginTop: 16 }} data-reveal-stagger>
            {WHY_THIS_BOOK.cards.map((c, i) => (
              <article className="col-4 why-card" key={i}>
                <div className="num">{["I", "II", "III"][i]}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY I WROTE THIS BOOK ============ */}
      <section id="author" className="section surface-50" data-reveal>
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 760, textAlign: "center" }}>
            <figure className="author-portrait--rounded" style={{ margin: "0 auto 24px" }}>
              <img
                src="/images/author-640.webp"
                srcSet="/images/author-640.webp 640w"
                sizes="(max-width: 760px) 88vw, 420px"
                width={640}
                height={960}
                alt="Pastor Eryeza Kalalu"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 400, letterSpacing: "-0.015em" }}>{AUTHOR_LETTER.eyebrow}</h2>
            <OrnamentRule>§</OrnamentRule>
            <div className="prose-feature" style={{ textAlign: "left" }}>
              {AUTHOR_LETTER.paras.map((p, i) => (<p key={i} className={`reader__prose${i === 0 ? " reader__prose--lead" : ""}`}>{p}</p>))}
            </div>
            <blockquote className="standout" style={{ maxWidth: "none", marginLeft: 0, marginRight: 0, textAlign: "left" }}>{AUTHOR_LETTER.pullquote}</blockquote>
          </div>
        </div>
      </section>

      {/* ============ WHAT YOU WILL DISCOVER ============ */}
      <section className="section surface-100" data-reveal>
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <span className="eyebrow">{DISCOVER.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 46px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.015em" }}>{DISCOVER.heading}</h2>
            <OrnamentRule>§</OrnamentRule>
            <div style={{ marginTop: 8 }}>
              {DISCOVER.items.map((it, i) => (
                <div className="discover-item" key={i}>
                  <div className="mark">{["I", "II", "III", "IV", "V"][i]}</div>
                  <div><h3>{it.title}</h3><p>{it.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CHRIST FORMS THE PERSON ============ */}
      <section className="section surface-parchment" data-reveal>
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: 720, marginBottom: 40 }}>
            <span className="eyebrow">{PILLARS.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(36px, 4.6vw, 56px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.02em" }}>{PILLARS.heading}</h2>
          </div>
          <OrnamentRule>❦</OrnamentRule>
          <div className="grid-12" style={{ gap: 32, marginTop: 16 }} data-reveal-stagger>
            {PILLARS.items.map((p) => (
              <article className="col-4 pillar-plate pillar-plate--paper-50" key={p.roman}>
                <div className="roman">{p.roman}</div>
                <h3 className="display" style={{ fontSize: 24, fontWeight: 500, marginTop: 8 }}>{p.title}</h3>
                <p className="body body-sm" style={{ marginTop: 12 }}>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOLLOWING TO LEAD (Day 1 summary + reader) ============ */}
      <section id="thirtydays" className="section surface-sage" data-reveal>
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 820 }}>
            <span className="eyebrow">{THIRTY_DAYS.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(34px, 4vw, 48px)", marginTop: 12, fontWeight: 400, letterSpacing: "-0.015em" }}>{THIRTY_DAYS.heading}</h2>
            <p className="body body-sm" style={{ marginTop: 8, fontStyle: "italic", color: "var(--ink-300)" }}>{THIRTY_DAYS.intro}</p>
            <OrnamentRule>§</OrnamentRule>
            <div className="grid-12" style={{ gap: 32 }} data-reveal-stagger>
              {THIRTY_DAYS.chapters.map((c, i) => (
                <article className="col-4" key={i} style={{ margin: 0 }}>
                  <div className={`pillar-plate pillar-plate--paper-${i === 1 ? "100" : "50"}`} style={{ height: "100%" }}>
                    <div className="roman">{["I", "II", "III"][i]}</div>
                    <h3 className="display" style={{ fontSize: 24, fontWeight: 500, marginTop: 8 }}>{c.title}</h3>
                    <p className="body body-sm" style={{ marginTop: 12, color: "var(--ink-500)" }}>{c.desc}</p>
                  </div>
                </article>
              ))}
            </div>

            <div id="day-one" style={{ marginTop: 32, scrollMarginTop: 110 }}>
              <DayOneEnhancer targetId="day-one" detailsId="day-one-reader" />
              <details id="day-one-reader" className="faq-item" style={{ borderTop: "1px solid var(--border)", borderBottom: "none", background: "var(--paper-50)" }}>
                <summary style={{ fontSize: "clamp(20px, 2.2vw, 26px)", justifyContent: "space-between", padding: "20px 24px" }}>
                  <span>Read the full Day 1: Following to Lead</span>
                </summary>
                <div className="faq-body" style={{ maxWidth: "none", padding: "0 0 24px" }}>
                  <div className="reader" data-reader>
                    <div className="reader__chrome">
                      <span className="reader__book">The Influential Spirit</span>
                      <span className="reader__sep">§</span>
                      <span className="reader__where">{DAY1_FULL.day}</span>
                      <span className="reader__spacer" />
                      <span className="reader__library">{DAY1_FULL.library}</span>
                    </div>
                    <div className="reader__progress"><span className="reader__progress-fill" /></div>
                    <div className="reader__page" data-reader-page tabIndex={0} aria-label="Day 1 reading">
                      <div className="reader__page-inner">
                        <p className="reader__eyebrow">{DAY1_FULL.day}</p>
                        <h3 className="reader__title">{DAY1_FULL.title}</h3>
                        <div className="reader__scripture"><p>{DAY1_FULL.scripture}</p><cite>{DAY1_FULL.scriptureRef}</cite></div>
                        {DAY1_FULL.reading.map((p, i) => (<p key={`r${i}`} className={`reader__prose${i === 0 ? " reader__prose--lead" : ""}`}>{p}</p>))}
                        {DAY1_FULL.movements.map((mv, mi) => (
                          <div key={`m${mi}`}>
                            <h4 className="reader__subhead">{mv.title}</h4>
                            {mv.paras.map((p, pi) => (<p key={`p${pi}`} className="reader__prose">{p}</p>))}
                          </div>
                        ))}
                        <hr className="reader__rule" />
                        <h4 className="reader__subhead reader__subhead--section">Walking It Out</h4>
                        <div className="reader__callout"><div className="reader__callout-key">{DAY1_FULL.reflectionLabel}</div><p className="reader__prose" style={{ fontStyle: "italic" }}>{DAY1_FULL.reflectionQuestion}</p></div>
                        <div className="reader__callout"><div className="reader__callout-key">{DAY1_FULL.challengeLabel}</div><p className="reader__prose">{DAY1_FULL.challengeBody}</p></div>
                        <div className="reader__callout reader__callout--prayer"><div className="reader__callout-key">{DAY1_FULL.prayerLabel}</div><p className="reader__prose">{DAY1_FULL.prayerBody}</p></div>
                        <div className="reader__callout reader__callout--declaration"><div className="reader__callout-key">{DAY1_FULL.declarationLabel}</div><p className="reader__prose">{DAY1_FULL.declarationBody}</p></div>
                        <div className="reader__further"><span className="reader__further-key">{DAY1_FULL.furtherReadingLabel}</span>{DAY1_FULL.furtherReading}</div>
                        <div className="reader__end">
                          <div className="reader__end-orn"><span className="reader__end-rule" /><span className="reader__end-mark">§</span><span className="reader__end-rule" /></div>
                          <p className="reader__prose--closer">{DAY1_FULL.closer}</p>
                          <div className="flex-wrap-gap gap-4" style={{ justifyContent: "center", marginTop: 16 }}>
                            <a className="reader__end-cta" href="#editions">Get the book <ArrowRight /></a>
                            <a className="btn btn-accent btn-sm" href={SITE.excerptUrl} target="_blank" rel="noopener noreferrer">Get the full excerpt in your inbox free</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="reader__foot"><span>Scroll to keep reading ↓</span><span>{DAY1_FULL.library}</span></div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE 30 DAYS ============ */}
      <section className="section surface-100" data-reveal>
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 820 }}>
            <span className="eyebrow">{THE_DAYS.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(34px, 4vw, 48px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.015em" }}>{THE_DAYS.heading}</h2>
            <OrnamentRule>§</OrnamentRule>
            <div className="grid-12" style={{ gap: 32 }} data-reveal-stagger>
              {THE_DAYS.items.map((it, i) => (
                <article className="col-4" key={i}>
                  <div className={`pillar-plate pillar-plate--paper-${i === 1 ? "200" : "50"}`} style={{ height: "100%" }}>
                    <h3 className="display" style={{ fontSize: 24, fontWeight: 500 }}>{it.title}</h3>
                    <p className="body body-sm" style={{ marginTop: 12 }}>{it.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SNEAK PEEK + FILM ============ */}
      <SneakPeek withFilm={false} />

      {/* ============ FAQ ============ */}
      <section id="questions" className="section surface-100" data-reveal>
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <span className="eyebrow">{FAQ.eyebrow}</span>
            <OrnamentRule>§</OrnamentRule>
            {FAQ.items.map((f, i) => (<details className="faq-item" key={i}><summary>{f.q}</summary><div className="faq-body">{f.a}</div></details>))}
          </div>
        </div>
      </section>

      {/* ============ TWO WAYS + WHAT COMES NEXT ============ */}
      <section id="books" className="section surface-ink" data-reveal>
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: 640 }}>
            <span className="eyebrow">{WHATS_NEXT.twoWaysEyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 44px)", marginTop: 8, fontWeight: 400, color: "var(--paper-50)", letterSpacing: "-0.015em" }}>{WHATS_NEXT.twoWaysHeading}</h2>
          </div>
          <OrnamentRule>§</OrnamentRule>
          <div className="grid-12" style={{ gap: 24, marginTop: 24 }} data-reveal-stagger>
            {WHATS_NEXT.twoWays.map((w, i) => (
              <div className="col-6" key={i} style={{ padding: 32, border: "1px solid rgba(184,146,90,0.35)", background: "var(--ink-800)" }}>
                <h3 className="display" style={{ fontSize: 24, color: "var(--gold-200)", fontWeight: 500 }}>{w.title}</h3>
                <p className="body-sm" style={{ color: "var(--paper-200)", margin: "12px 0 20px" }}>{withPrices(w.desc)}</p>
                <a className={`btn ${(w.variant as string) === "primary" ? "btn-gold" : "btn-ghost"}`} href={w.href}>{w.cta} <ArrowRight /></a>
              </div>
            ))}
          </div>
          <div className="text-center mx-auto mt-12" style={{ maxWidth: 720 }}>
            <span className="eyebrow">{WHATS_NEXT.nextEyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(30px, 3.6vw, 40px)", marginTop: 8, fontWeight: 400, color: "var(--paper-50)", letterSpacing: "-0.015em" }}>{WHATS_NEXT.nextHeading}</h2>
          </div>
          <OrnamentRule>§</OrnamentRule>
          <div className="grid-12" style={{ gap: 24, marginTop: 24 }} data-reveal-stagger>
            {LIBRARY.books.map((b) => (<BookCard book={b} key={b.title} />))}
          </div>
        </div>
      </section>

      {/* ============ RECENT LETTERS (RSS, build time) ============ */}
      <section id="letters-preview" className="section surface-50" data-reveal>
        <div className="container">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
            <div><span className="eyebrow">The writing</span><h2 className="display" style={{ fontSize: 42, marginTop: 8, letterSpacing: "-0.01em" }}>Recent letters.</h2></div>
            <a href="#letter" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-700)", textDecoration: "underline", textDecorationColor: "var(--gold-300)", textUnderlineOffset: 4 }}>Subscribe to the letter →</a>
          </div>
          <OrnamentRule>§</OrnamentRule>
          <div id="home-letter-feed">
            {letters.length === 0 ? (
              <div><p className="body body-lg" style={{ maxWidth: "52ch", fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--ink-500)" }}>No letters yet. This is a live feed. Every letter Pastor Eryeza publishes on Beehiiv will appear here automatically.</p><p className="caption" style={{ marginTop: 16 }}><a href="#letter" style={{ color: "var(--ink-700)", textDecoration: "underline", textDecorationColor: "var(--gold-300)", textUnderlineOffset: 3 }}>Subscribe to be first to read →</a></p></div>
            ) : letters.map((it, i) => {
              const excerpt = it.description.length > 220 ? it.description.slice(0, 220).trimEnd() + "…" : it.description;
              return (
                <a className="letter-item" key={i} href={it.link} target="_blank" rel="noopener noreferrer">
                  <div><div className="date">{fmtDate(it.pubDate) || "Letter"}</div><div className="title">{it.title}</div>{excerpt ? <p className="excerpt">{excerpt}</p> : null}</div>
                  <svg className="arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ PODCAST ============ */}
      <section id="podcast" className="dis-strip" data-reveal>
        <div className="container">
          <div className="dis-row">
            <img src="/brand/dis-mark.svg" alt="Devotion In Season seal" className="dis-seal" width={160} height={160} loading="lazy" style={{ padding: 12 }} />
            <div className="stack">
              <span className="dis-eb">{PODCAST.eyebrow}</span>
              <h2 className="dis-title">{PODCAST.title}</h2>
              <p className="dis-lede">{PODCAST.lede}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
              <a className="dis-cta" href={SITE.podcastIheart} target="_blank" rel="noopener noreferrer"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>Play latest</a>
              <a className="dis-players" href="#podcast-platforms">Or on Apple, Spotify, &amp; more ↓</a>
            </div>
          </div>
          <div className="featured-episode">
            <div className="episode-chip">
              <span className="pulse-dot" aria-hidden="true" />
              <span>Latest episode · on air</span>
            </div>
            <IheartPlayer />
          </div>
          <div className="mt-12">
            <EpisodeList episodes={episodes} />
          </div>
          <div className="mt-12" id="podcast-platforms">
            <OrnamentRule>§</OrnamentRule>
            <div style={{ marginBottom: 24 }}><span className="dis-eb">{PODCAST.platformsLabel}</span><h3 className="display" style={{ fontSize: 28, fontWeight: 500, color: "var(--paper-50)", marginTop: 8 }}>{PODCAST.platformsHeading}</h3></div>
            <PlatformGrid />
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section id="letter" className="section surface-200" data-reveal>
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: 640, marginBottom: 24 }}>
            <img className="ew-seal" src="/brand/logo-ew.svg" alt="Eryeza Writes mark" width={64} height={64} loading="lazy" />
            <span className="eyebrow">{NEWSLETTER.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(34px, 3.6vw, 48px)", marginTop: 12, letterSpacing: "-0.01em", lineHeight: 1.15 }}>{NEWSLETTER.heading}</h2>
          </div>
          <div className="mx-auto letter-card letter-card--embed">
            <iframe className="beehiiv-embed" title="Subscribe to Eryeza Writes" loading="lazy" src={SITE.beehiivEmbed} />
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="section surface-parchment" data-reveal>
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: 720, marginBottom: 48 }}>
            <span className="eyebrow">{ABOUT.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 60px)", marginTop: 8, fontWeight: 400, letterSpacing: "-0.02em" }}>{ABOUT.heading}</h2>
          </div>
          <div className="about-section">
            <div className="about-section__media">
              <img className="about-logo" src={ABOUT.logo} alt="EK monogram" width={96} height={96} loading="lazy" />
              <div className="about-portrait">
                <img src={ABOUT.photo} width={640} height={960} alt="Pastor Eryeza Kalalu" loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="about-section__body">
              <p className="about-lead">{ABOUT.lead}</p>
              {ABOUT.paras.map((p, i) => (<p key={i} className="about-para">{renderRich(p)}</p>))}
              <div className="about-section__closer">{ABOUT.closer}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SPEAKING ============ */}
      <section id="speaking" className="section" style={{ background: "var(--oxblood-50)" }} data-reveal>
        <div className="container">
          <img className="speaking-seal" src="/brand/logo-es.svg" alt="Eryeza Speaks mark" width={72} height={72} loading="lazy" style={{ marginBottom: 20 }} />
          <div className="text-center" style={{ marginBottom: 24 }}>
            <span className="eyebrow">{SPEAKING.heroEyebrow}</span>
          </div>

          <div className="speaking-end-cta">
            <img className="sec-wordmark" src="/brand/logo-es.svg" alt="" width={64} height={64} loading="lazy" />
            <h3>{SPEAKING.ctaHeading}</h3>
            <p>{SPEAKING.ctaLede}</p>
            <a className="btn btn-gold" href="#invite-form">{SPEAKING.cta}<ArrowRight /></a>
          </div>

          <div className="mx-auto text-center" style={{ maxWidth: 760, marginTop: 48, marginBottom: 40 }}>
            <h2 className="display" style={{ fontSize: "clamp(34px, 4.4vw, 52px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>{SPEAKING.heroHeading}</h2>
            <p className="body body-lg" style={{ marginTop: 16, maxWidth: "60ch", marginLeft: "auto", marginRight: "auto", color: "var(--ink-500)" }}>{SPEAKING.heroLede}</p>
          </div>

          <div className="speaking-hero-cta">
            <img className="shc-wordmark" src="/brand/logo-es.svg" alt="" width={56} height={56} loading="lazy" />
            <p className="shc-words">{FEATURED_BOOK.standout}</p>
            <div className="shc-rule" />
            <div className="shc-cta-row">
              <a className="btn btn-ghost" style={{ color: "var(--paper-50)", borderColor: "rgba(184,146,90,0.5)" }} href="#invite-form">Send the invitation<ArrowRight /></a>
            </div>
          </div>

          <div className="speaking-block-head" style={{ marginBottom: 30 }}>
            <span className="eyebrow">{SPEAKING.whereEyebrow}</span>
            <h3 className="speaking-block-h">{SPEAKING.whereHeading}</h3>
            <OrnamentRule>§</OrnamentRule>
            <p className="speaking-lede">{SPEAKING.whereLede}</p>
          </div>
          <div className="serve-grid">
            {SPEAKING.whereItems.map((w, i) => (
              <article className="serve-card" key={i}>
                <span className="serve-card__icon" aria-hidden="true"><ServeIcon name={w.icon} /></span>
                <h4 className="serve-card__title">{w.title}</h4>
                <p className="serve-card__desc">{w.desc}</p>
              </article>
            ))}
          </div>

          <div className="speaking-block-head" style={{ marginBottom: 26 }}>
            <span className="eyebrow">{SPEAKING.themesEyebrow}</span>
            <h3 className="speaking-block-h">{SPEAKING.themesHeading}</h3>
            <OrnamentRule>§</OrnamentRule>
            <p className="speaking-lede">{SPEAKING.themesLede}</p>
            <div className="grid-12" style={{ gap: 24 }} data-reveal-stagger>
              {SPEAKING.themes.map((t, i) => (
                <article className="col-4 speaking-card speaking-card--c" key={i}>
                  <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 30, color: "var(--gold-400)", lineHeight: 1, marginBottom: 8 }} aria-hidden="true">{["I", "II", "III", "IV", "V", "VI"][i]}</div>
                  <h4 className="sc-title">{t.title}</h4>
                  <div className="sc-body">{t.desc}</div>
                </article>
              ))}
            </div>
          </div>

          <div className="speaking-block-head" style={{ marginBottom: 26 }}>
            <span className="eyebrow">{SPEAKING.howEyebrow}</span>
            <h3 className="speaking-block-h">{SPEAKING.howHeading}</h3>
            <OrnamentRule>§</OrnamentRule>
            <div className="speaking-card speaking-card--d" style={{ padding: 32 }}>
              <div className="prose-feature" style={{ maxWidth: "68ch" }}>
                {SPEAKING.howParas.map((p, i) => (<p key={i} className="reader__prose">{p}</p>))}
              </div>
            </div>
          </div>

          <div className="speaking-block-head" style={{ marginBottom: 26 }}>
            <span className="eyebrow">{SPEAKING.engagementsEyebrow}</span>
            <h3 className="speaking-block-h">{SPEAKING.engagementsHeading}</h3>
            <OrnamentRule>§</OrnamentRule>
            <p className="caption" style={{ margin: 0 }}>{SPEAKING.engagementsLede}</p>
            {SPEAKING.engagements.length > 0 ? <EngagementsGrid headingLevel={4} /> : null}
          </div>

          <img className="speaking-seal" src="/brand/logo-es.svg" alt="" width={72} height={72} loading="lazy" style={{ marginTop: 32, marginBottom: 32 }} />

          {/* Collapsed until asked for; every "#invite-form" link above opens it. */}
          <InvitePanel />
        </div>
      </section>

      <div className="back-to-top">
        <a href="#top">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
          Back to top
        </a>
      </div>

      <StickyBuyBar>
        <div className="meta">
          <div className="eyebrow">Out now</div>
          <div className="caption">The Influential Spirit · from <Price launch="$12" full="$15" /> / <Price launch="UGX 36,000" full="UGX 45,000" /> / <Price launch="₦14,400" full="₦18,000" /></div>
        </div>
        <a className="btn btn-gold btn-sm" href="#editions">Choose edition</a>
      </StickyBuyBar>
    </SiteShell>
  );
}
