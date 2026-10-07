import { EDITIONS, DAY1_FULL } from "@/lib/site-content";
import { OrnamentRule } from "@/components/site/ui-bits";
import { LaunchOnly } from "@/components/site/price";
import LaunchCountdown from "@/components/site/launch-countdown";
import EditionsTiers from "@/components/site/books-editions-tiers";

/**
 * Editions block, shared by the home page, /books and /influential-spirit so
 * the three cannot drift.
 *
 * Server-rendered: only the USD / UGX region picker (EditionsTiers) is a client
 * island. The style contract rules out three equal marketing cards, so the
 * bundle band carries the emphasis and the tiers sit in a disclosure beneath it.
 *
 * `heading` adds the "Choose an edition." title used on the standalone routes;
 * the home page keeps its eyebrow-only head.
 */
export default function BooksEditions({ heading = true }: { heading?: boolean }) {
  return (
    <section className="section surface-200" id="editions">
      <div className="container">
        <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 32 }}>
          <span className="eyebrow">{EDITIONS.eyebrow}</span>
          {heading ? (
            <h2 className="display" style={{ fontSize: "clamp(30px, 3.6vw, 44px)", marginTop: 10, fontWeight: 400 }}>
              Choose an edition.
            </h2>
          ) : null}
          <OrnamentRule>§</OrnamentRule>
          <p className="caption" style={{ marginTop: 8 }}>
            <LaunchOnly><LaunchCountdown />{EDITIONS.launchLine} </LaunchOnly>
            {EDITIONS.note}
          </p>
        </div>

        <div className="bundle-band">
          <div className="bundle-digital">
            <div className="bundle-digital__device">
              <div className="bundle-pair">
                <img className="bundle-pair__page" src="/images/stage/reader.webp" width={560} height={840} alt="A page from the Reader Edition" loading="lazy" decoding="async" />
                <img className="bundle-pair__tablet" src="/images/stage/epub.webp" width={600} height={914} alt="The EPUB edition open on a tablet" loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="bundle-digital__text">
              <span className="bundle-label">Digital edition</span>
              <div className="bundle-title">PDF + EPUB, read on any device</div>
              <div className="bundle-scripture">
                {DAY1_FULL.scripture}
                <cite>{DAY1_FULL.scriptureRef}</cite>
              </div>
              <div className="bundle-meta">Day 1 in full, plus the 30-day reading plan inside every edition.</div>
            </div>
          </div>
          <figure className="bundle-audio">
            <div className="bundle-audio__stack">
              <img className="bundle-audio__back bundle-audio__back--l" src="/images/stage/group.webp" width={520} height={924} alt="" loading="lazy" decoding="async" />
              <img className="bundle-audio__back bundle-audio__back--r" src="/images/stage/decl.webp" width={520} height={924} alt="" loading="lazy" decoding="async" />
              <img className="bundle-audio__card" src="/images/stage/audio.webp" width={560} height={560} alt="Author-narrated audiobook" loading="lazy" decoding="async" />
            </div>
            <figcaption>
              <strong>Author-narrated audiobook</strong>
              Included in the Formation Bundle, with the Group Study Guide and Declarations
            </figcaption>
          </figure>
        </div>

        <EditionsTiers />
      </div>
    </section>
  );
}
