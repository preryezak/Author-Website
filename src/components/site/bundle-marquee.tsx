/**
 * A slow, endless strip of the three editions laid out flat. Pure CSS (no JavaScript):
 * it drifts left, pauses when hovered or focused, and becomes a swipeable row for visitors
 * who prefer reduced motion.
 */
const SLIDES = [
  { src: "/images/bundles/reader-800.webp", w: 800, h: 450, name: "Reader Edition", alt: "Reader Edition: the book, tablet and phone laid out together" },
  { src: "/images/bundles/reader-inside-640.webp", w: 640, h: 800, name: "Inside the Reader Edition", alt: "What is inside the Reader Edition" },
  { src: "/images/bundles/formation-800.webp", w: 800, h: 450, name: "Formation Bundle", alt: "Formation Bundle: the book, audiobook, study guide and reading plan" },
  { src: "/images/bundles/formation-inside-640.webp", w: 640, h: 800, name: "Inside the Formation Bundle", alt: "What is inside the Formation Bundle" },
  { src: "/images/bundles/complete-800.webp", w: 800, h: 450, name: "Complete Formation Edition", alt: "Complete Formation Edition: everything, with the journal and declarations" },
  { src: "/images/bundles/complete-inside-640.webp", w: 640, h: 800, name: "Inside the Complete Formation Edition", alt: "What is inside the Complete Formation Edition" },
];

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="marquee__track" aria-hidden={hidden || undefined}>
      {SLIDES.map((s) => (
        <li className="marquee__item" key={s.src}>
          <figure>
            <img src={s.src} width={s.w} height={s.h} alt={hidden ? "" : s.alt} loading="lazy" decoding="async" />
            <figcaption>{s.name}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export default function BundleMarquee() {
  return (
    <section id="inside-strip" className="section surface-parchment marquee-section" aria-label="What each edition includes">
      <div className="container">
        <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 28 }}>
          <span className="eyebrow">Inside every edition</span>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", marginTop: 8, letterSpacing: "-0.01em" }}>Pages you can hold on any screen.</h2>
        </div>
      </div>
      <div className="marquee" tabIndex={0} aria-label="Scrolling preview of the three editions. Hover to pause.">
        <div className="marquee__rail">
          <Track />
          <Track hidden />
        </div>
      </div>
    </section>
  );
}
