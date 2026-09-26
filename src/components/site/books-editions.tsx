"use client";

import { useState } from "react";
import { EDITIONS, DAY1_FULL } from "@/lib/site-content";

/**
 * Editions, on their own route.
 *
 * Same class vocabulary and same structure as the home page's #editions block,
 * so the two read as one design. The only addition is that on a standalone page
 * the region panels start open for the reader's own region when one is known;
 * both can still be collapsed.
 *
 * The style contract is explicit that editions must not be three equal
 * marketing cards, so the bundle band carries the emphasis and the tiers sit
 * inside a disclosure beneath it.
 */
export default function BooksEditions() {
  const [region, setRegion] = useState<"usd" | "ugx" | null>("usd");

  const usd = EDITIONS.tiers.filter((t) => t.region === "usd");
  const ugx = EDITIONS.tiers.filter((t) => t.region === "ugx");

  const groups = [
    { key: "usd" as const, label: EDITIONS.regionUSD, sub: EDITIONS.regionUSDSub, list: usd, via: "Payhip", paper: false },
    { key: "ugx" as const, label: EDITIONS.regionUGX, sub: EDITIONS.regionUGXSub, list: ugx, via: "Selar", paper: true },
  ];

  return (
    <section className="section surface-200" id="editions">
      <div className="container">
        <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: 32 }}>
          <span className="eyebrow">{EDITIONS.eyebrow}</span>
          <h2 className="display" style={{ fontSize: "clamp(30px, 3.6vw, 44px)", marginTop: 10, fontWeight: 400 }}>
            Choose an edition.
          </h2>
          <div className="ornament-rule" aria-hidden="true">
            <span>§</span>
          </div>
          <p className="caption" style={{ marginTop: 8 }}>{EDITIONS.note}</p>
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
              <div className="bundle-meta">
                Day 1 in full, plus the 30-day reading plan inside every edition.
              </div>
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

        <div className="editions-accordion">
          {groups.map((g) => (
            <div key={g.key}>
              <button
                type="button"
                className={`editions-accordion__head ${region === g.key ? "is-open" : ""}`}
                aria-expanded={region === g.key}
                onClick={() => setRegion((r) => (r === g.key ? null : g.key))}
              >
                <span className="ea-region">{g.label}</span>
                <span className="ea-sub">{g.sub}</span>
                <svg
                  className="ea-chev"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={region === g.key ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
                </svg>
              </button>
              {region === g.key && (
                <div className="editions-accordion__panel">
                  <div className="grid-12" style={{ gap: 24, marginTop: 20 }}>
                    {g.list.map((t, i) => (
                      <a
                        className={`col-4 tier-card${g.paper ? " on-paper" : ""}`}
                        key={`${g.key}-${i}`}
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer external"
                      >
                        <span className="tier-name">{t.name}</span>
                        <div className="price">
                          {t.price} <s>{t.was}</s>
                        </div>
                        <p className="tier-desc">{t.desc}</p>
                        <span className="tier-cta">Pre-order via {g.via} →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
