import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { OrnamentRule } from "@/components/site/ui-bits";
import ChristmasEditions, { XmasBuyButton, XmasFromPrice } from "@/components/site/christmas-editions";
import { XMAS_PRICES, XMAS_SELAR_URL } from "@/lib/christmas";

/**
 * Unscripted Christmas landing page: pre-order until 16 November, then the book
 * page. Problem first (the four December worries), then what each day gives,
 * then the three editions with buy buttons to the one Selar product.
 */

const TITLE = "Unscripted Christmas";
const DESC = "A 24-day Advent devotional for grief, money stress, family tension and loneliness at Christmas. Pre-order now at 20% off; it arrives on 16 November.";

export const metadata: Metadata = {
  title: "Unscripted Christmas: an Advent devotional",
  description: DESC,
  alternates: { canonical: "/christmas" },
  openGraph: { type: "website", url: "/christmas", title: "Unscripted Christmas · Eryeza Kalalu", description: DESC, images: [{ url: "/images/og-unscripted-christmas.png", width: 1200, height: 630, alt: "Unscripted Christmas book cover" }] },
  twitter: { card: "summary_large_image", title: "Unscripted Christmas · Eryeza Kalalu", description: DESC, images: ["/images/og-unscripted-christmas.png"] },
};

const WORRIES = [
  { title: "The empty chair", body: "Someone you love will not be at the table this year, and the songs about joy are hard to sing." },
  { title: "The money that will not stretch", body: "The salary has to cover the gifts, the travel and the school fees that come in January." },
  { title: "The old family script", body: "You are going home to the same arguments and the same expectations, and you are already tired." },
  { title: "Alone in a full room", body: "The house is busy and the church is full, and you still feel that nobody really sees you." },
];

const DAILY = [
  "One verse from the New King James Version.",
  "A short reading that names the struggle before the answer.",
  "One practice for that day.",
  "A prayer and a Heart Check.",
  "A Permission for Today, a few lines that give you leave to rest in Christ.",
];

const MOVEMENTS = [
  { title: "Afraid to Hope", body: "Days 1 to 6 meet you in fear, shame and the waiting." },
  { title: "The Christmas You Are Actually Having", body: "Days 7 to 15 meet you in grief, loneliness, money and family." },
  { title: "Making Room for Christ", body: "Days 16 to 24 turn to rest, presence and the need to be noticed." },
  { title: "Christmas Day and After", body: "Christ is still with us after the wrapping paper, on Christmas Day and the day after." },
];

const FAQS = [
  { q: "When will I receive the book?", a: "On 16 November 2026. Your pre-order confirmation arrives the moment you pay, and Selar emails you when your edition is ready in your library." },
  { q: "Can I read it on my phone?", a: "Yes. Every file downloads to keep, so you can read and listen on your phone, tablet or computer, with or without data." },
  { q: "How do I pay?", a: "By mobile money or card. Prices show in Ugandan shillings or US dollars here and convert to your own currency at checkout." },
  { q: "Can my small group or church use it?", a: "Yes. The Complete Christmas Edition includes a four-session group guide for the Sundays of Advent: 29 November and 6, 13 and 20 December. For copies for a whole church, write to hello@eryezakalalu.com." },
  { q: "When does the pre-order price end?", a: "On 16 November, when the book is released. Until then every edition is 20% off." },
];

export default function ChristmasPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: TITLE,
    alternativeHeadline: "24 Days with Christ for the Christmas You Are Actually Having",
    author: { "@type": "Person", name: "Eryeza Kalalu", url: "https://eryezakalalu.com/about/" },
    bookFormat: "https://schema.org/EBook",
    inLanguage: "en-GB",
    datePublished: "2026-11-16",
    image: "https://eryezakalalu.com/images/unscripted-christmas-640.webp",
    description: DESC,
    offers: (["book", "companion", "complete"] as const).flatMap((id) => [
      { "@type": "Offer", name: id, price: XMAS_PRICES[id].USD.preorder, priceCurrency: "USD", availability: "https://schema.org/PreOrder", url: XMAS_SELAR_URL, priceValidUntil: "2026-11-15" },
      { "@type": "Offer", name: id, price: XMAS_PRICES[id].UGX.preorder, priceCurrency: "UGX", availability: "https://schema.org/PreOrder", url: XMAS_SELAR_URL, priceValidUntil: "2026-11-15" },
    ]),
  };

  return (
    <SiteShell active="/books">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />

      {/* 1. The promise, the price and the button on the first screen of a phone. */}
      <section className="section surface-100">
        <div className="container">
          <div className="grid-12" style={{ gap: 32, alignItems: "center" }}>
            <div className="col-5" style={{ textAlign: "center" }}>
              <img
                src="/images/unscripted-christmas-640.webp"
                srcSet="/images/unscripted-christmas-400.webp 400w, /images/unscripted-christmas-640.webp 640w"
                sizes="(max-width: 1024px) 60vw, 360px"
                width={640}
                height={1024}
                alt="Unscripted Christmas book cover by Eryeza Kalalu"
                style={{ width: "min(320px, 70vw)", height: "auto", boxShadow: "0 18px 40px rgba(30,26,22,0.22)" }}
              />
            </div>
            <div className="col-7">
              <span className="eyebrow">Pre-order now · Advent 2026</span>
              <h1 className="page-head__title" style={{ marginTop: 8 }}>Unscripted Christmas</h1>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.3, margin: "4px 0 16px" }}>
                24 Days with Christ for the Christmas You Are Actually Having
              </p>
              <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: "60ch" }}>
                Christmas cards promise a perfect season. Most of us are living a different one. This Advent devotional walks
                with you from 1 December to Christmas Day, through grief, money, family and loneliness, and keeps bringing you
                back to the Child in the manger who came for exactly this.
              </p>
              <p className="caption" style={{ margin: "12px 0 20px" }}><XmasFromPrice /></p>
              <div className="flex-wrap-gap gap-4">
                <a className="btn btn-primary" href="#editions">Choose your edition</a>
                <XmasBuyButton edition="book" className="btn btn-ghost">Pre-order The Book</XmasBuyButton>
              </div>
              <p className="caption" style={{ marginTop: 14, color: "var(--ink-300)" }}>
                Released on 16 November, two weeks before the first Sunday of Advent. By Pastor Eryeza Kalalu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The reader's December, in the reader's words. */}
      <section className="section surface-50">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 760, textAlign: "center" }}>
            <span className="eyebrow">The Christmas you are actually having</span>
            <h2 className="page-head__title" style={{ fontSize: 34 }}>Four things people dread about December.</h2>
            <p>
              In a national poll before last Christmas, the top holiday worries were grief, affording gifts, difficult family
              relationships and loneliness. A South African survey last December found the same pattern. Every pastor knows
              these four conversations.
            </p>
          </div>
          <div className="grid-12" style={{ gap: 20, marginTop: 28 }}>
            {WORRIES.map((w) => (
              <article className="col-3 tier-card" key={w.title} style={{ textAlign: "left" }}>
                <span className="tier-name">{w.title}</span>
                <p style={{ marginTop: 8 }}>{w.body}</p>
              </article>
            ))}
          </div>
          <p className="caption" style={{ textAlign: "center", marginTop: 16, color: "var(--ink-300)" }}>
            Sources: American Psychiatric Association Healthy Minds poll, November 2025; South African Depression and Anxiety Group festive survey, December 2025.
          </p>
        </div>
      </section>

      {/* 3. What each morning gives. */}
      <section className="section surface-100">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 720 }}>
            <span className="eyebrow">Ten minutes each morning</span>
            <h2 className="page-head__title" style={{ fontSize: 34 }}>Every day gives you</h2>
            <ul style={{ fontSize: 18, lineHeight: 1.7, paddingLeft: 20 }}>
              {DAILY.map((d) => <li key={d}>{d}</li>)}
            </ul>
            <OrnamentRule>§</OrnamentRule>
            <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.45, textAlign: "center" }}>
              &ldquo;Do not be afraid, for behold, I bring you good tidings of great joy which will be to all people.&rdquo;
            </p>
            <p className="caption" style={{ textAlign: "center", letterSpacing: "0.16em" }}>LUKE 2:10 · NKJV</p>
          </div>
          <div className="grid-12" style={{ gap: 20, marginTop: 32 }}>
            {MOVEMENTS.map((m, i) => (
              <article className="col-3" key={m.title}>
                <span className="eyebrow">Movement {["I", "II", "III", "IV"][i]}</span>
                <h3 className="display" style={{ fontSize: 20, fontWeight: 500, margin: "6px 0" }}>{m.title}</h3>
                <p>{m.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The three editions, each opening the Selar checkout. */}
      <section className="section surface-50" id="editions">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 760, textAlign: "center" }}>
            <span className="eyebrow">Choose your edition</span>
            <h2 className="page-head__title" style={{ fontSize: 34 }}>Pre-order at 20% off until 16 November.</h2>
          </div>
          <ChristmasEditions />
        </div>
      </section>

      {/* 5. For groups and churches. */}
      <section className="section surface-100">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 720 }}>
            <span className="eyebrow">For families, groups and churches</span>
            <h2 className="page-head__title" style={{ fontSize: 30 }}>Read it together through Advent.</h2>
            <p>
              Advent is read best in company. The Complete Christmas Edition has a four-session group guide that follows the
              Sundays of Advent, 29 November and 6, 13 and 20 December, with notes for the person leading. For copies for a
              whole church or staff team, write to hello@eryezakalalu.com.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Questions. */}
      <section className="section surface-50">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 720 }}>
            <span className="eyebrow">Questions</span>
            {FAQS.map((f) => (
              <details key={f.q} style={{ borderBottom: "1px solid var(--paper-300, #E1D6C1)", padding: "14px 0" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>{f.q}</summary>
                <p style={{ marginTop: 8 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. The author's other book. */}
      <section className="section surface-100">
        <div className="container">
          <div className="mx-auto" style={{ maxWidth: 720, textAlign: "center" }}>
            <span className="eyebrow">Also by Eryeza Kalalu</span>
            <h2 className="page-head__title" style={{ fontSize: 28 }}>The Influential Spirit</h2>
            <p>Thirty mornings on the person Christ is forming in you, for believers whose influence is growing at work, at home and in church. Start it in January, when Advent ends.</p>
            <a className="btn btn-ghost" href="/influential-spirit/">See The Influential Spirit</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
