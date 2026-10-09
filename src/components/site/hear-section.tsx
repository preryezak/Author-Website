import AudioSamples from "@/components/site/audio-samples";
import { OrnamentRule } from "@/components/site/ui-bits";

/** The sample film plus listen-only clips. Audio is real audiobook footage, read by the author. */
export default function HearSection() {
  return (
    <section id="hear" className="section surface-parchment hear-section">
      <div className="container">
        <div className="text-center mx-auto" style={{ maxWidth: 680 }}>
          <span className="eyebrow">Hear it before you buy it</span>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", marginTop: 8, letterSpacing: "-0.01em" }}>A taste of The Influential Spirit.</h2>
          <p className="caption" style={{ marginTop: 12 }}>Clips from the author-narrated audiobook in the Formation Bundle, with the words on screen in time with the voice.</p>
        </div>
        <OrnamentRule>&sect;</OrnamentRule>
        <div className="hear-grid">
          <figure className="hear-film">
            <video controls playsInline preload="none" poster="/images/film/sample-poster.webp" aria-label="A taste of The Influential Spirit: audiobook clips with the words on screen">
              <source src="/video/influential-spirit-audio-sample.mp4" type="video/mp4" />
            </video>
            <figcaption>Watch with sound on. About two and a half minutes.</figcaption>
          </figure>
          <AudioSamples />
        </div>
      </div>
    </section>
  );
}
