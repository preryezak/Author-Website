"use client";

import { useEffect, useState } from "react";
import { EDITIONS } from "@/lib/site-content";
import { Price } from "@/components/site/price";

/**
 * USD / UGX region disclosure for the editions block. Both regions can be
 * collapsed (null), and USD starts open. Prices render both launch and full
 * values; layout.tsx flips which one shows on 1 Nov 2026 (see price.tsx).
 */
export default function EditionsTiers() {
  const [region, setRegion] = useState<"usd" | "ugx" | null>("usd");

  // Open the visitor's own currency first (UGX in Africa, USD elsewhere). A choice
  // the visitor has already made is never overridden; failures keep USD.
  useEffect(() => {
    let touched = false;
    const mark = () => { touched = true; };
    const el = document.getElementById("editions");
    el?.addEventListener("click", mark, { once: true });
    fetch("/api/geo", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((g) => { if (!touched && g && g.region === "ugx") setRegion("ugx"); })
      .catch(() => {});
    return () => el?.removeEventListener("click", mark);
  }, []);

  const groups = [
    { key: "usd" as const, label: EDITIONS.regionUSD, sub: EDITIONS.regionUSDSub, via: "Payhip", paper: false },
    { key: "ugx" as const, label: EDITIONS.regionUGX, sub: EDITIONS.regionUGXSub, via: "Selar", paper: true },
  ];

  return (
    <div className="editions-accordion">
      {groups.map((g) => {
        const open = region === g.key;
        const panelId = `editions-${g.key}`;
        return (
          <div key={g.key}>
            <button
              type="button"
              className={`editions-accordion__head ${open ? "is-open" : ""}`}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setRegion((r) => (r === g.key ? null : g.key))}
            >
              <span className="ea-region">{g.label}</span>
              <span className="ea-sub">{g.sub}</span>
              <svg className="ea-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="editions-accordion__panel" id={panelId} hidden={!open}>
              <div className="grid-12" style={{ gap: 24, marginTop: 20 }}>
                {EDITIONS.tiers.filter((t) => t.region === g.key).map((t, i) => (
                  <a className={`col-4 tier-card${g.paper ? " on-paper" : ""}${t.popular ? " popular" : ""}`} key={`${g.key}-${i}`} href={t.href} target="_blank" rel="noopener noreferrer external">
                    <span className="tier-name">{t.name}</span>
                    <div className="price"><Price launch={t.price} was={t.was} full={t.full} /></div>
                    {"ngn" in t ? <div className="price price--alt" aria-label="Price in Nigerian naira"><Price launch={t.ngn as string} was={t.ngnWas as string} full={t.ngnFull as string} /></div> : null}
                    <p className="tier-desc">{t.desc}</p>
                    <span className="tier-cta">Buy via {g.via} →</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
