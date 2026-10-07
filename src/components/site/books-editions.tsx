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
              <div className="mini-device">
                <img
                  src="/images/cover-640.webp"
                  srcSet="/images/cover-640.webp 640w"
                  sizes="(max-width: 1024px) 50vw, 260px"
                  width={640}
                  height={960}
                  alt="The Influential Spirit cover on a tablet screen"
                  loading="lazy"
                  decoding="async"
                />
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
          <figure>
            <img
              src="/images/mockups/book-audiogram-640.webp"
              srcSet="/images/mockups/book-audiogram-640.webp 640w"
              sizes="(max-width: 1024px) 88vw, 520px"
              width={640}
              height={640}
              alt="Author-narrated audiobook with headphones"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <strong>Author-narrated audiobook</strong>
              Included in the Formation Bundle
            </figcaption>
          </figure>
        </div>

        <EditionsTiers />
      </div>
    </section>
  );
}
