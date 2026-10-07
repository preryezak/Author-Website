import { SNEAK_PEEK } from "@/lib/site-content";
import { OrnamentRule } from "@/components/site/ui-bits";
import { Parallax, BrandFilm } from "@/components/site/parallax";

/** Sneak peek into each edition, with a gentle parallax on the product scenes. Mostly server-rendered. */
export default function SneakPeek({ withFilm = true, editionsHref = "#editions" }: { withFilm?: boolean; editionsHref?: string }) {
  return (
    <>
      {withFilm && (
        <section id="film" className="section surface-ink" data-reveal>
          <div className="container">
            <div className="mx-auto text-center" style={{ maxWidth: 640 }}>
              <span className="eyebrow">Formation before platform</span>
              <h2 className="display" style={{ fontSize: "clamp(30px, 3.8vw, 44px)", marginTop: 8, fontWeight: 400, color: "var(--paper-50)", letterSpacing: "-0.015em" }}>Thirty days, in under a minute.</h2>
            </div>
            <OrnamentRule>§</OrnamentRule>
            <div className="mx-auto" style={{ maxWidth: 960, marginTop: 28 }}>
              <BrandFilm src="/video/influential-spirit-film.mp4" poster="/images/film/poster.webp" />
            </div>
          </div>
        </section>
      )}
      <section id="inside" className="section surface-100 sneak" data-reveal>
        <div className="container">
          <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 40 }}>
            <span className="eyebrow">{SNEAK_PEEK.eyebrow}</span>
            <h2 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 8, letterSpacing: "-0.01em" }}>{SNEAK_PEEK.heading}</h2>
            <p className="caption mt-3">{SNEAK_PEEK.subhead}</p>
          </div>
          {SNEAK_PEEK.bundles.map((b, i) => (
            <div className={`sneak-row${i % 2 ? " sneak-row--flip" : ""}`} key={b.key}>
              <Parallax className="sneak-media" distance={36}>
                <picture>
                  <source type="image/webp" srcSet={`/images/bundles/${b.key}-800.webp 800w, /images/bundles/${b.key}-1400.webp 1400w`} sizes="(max-width: 900px) 92vw, 640px" />
                  <img src={`/images/bundles/${b.key}-1400.webp`} width={1400} height={788} loading="lazy" decoding="async" alt={`${b.name}: the book, tablet and phone pages laid out together`} />
                </picture>
              </Parallax>
              <div className="sneak-copy">
                <span className="eyebrow">{b.name}</span>
                <h3 className="display">{b.line}</h3>
                <ul>
                  {b.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <a className="btn btn-ghost" href={editionsHref}>Choose your edition</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
