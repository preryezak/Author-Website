"use client";

/**
 * Unscripted Christmas editions in UGX (Africa) or USD (elsewhere). Every button
 * opens the one Selar product (the buyer picks the tier there), with campaign
 * tags passed on. Before 16 Nov the pre-order price shows with the full price
 * struck through; from release the full price shows. The switch is client-side,
 * so no rebuild is needed.
 */

import { useEffect, useState } from "react";
import { useCurrency } from "@/components/site/checkout";
import { source, trackCustom } from "@/lib/pixel";
import { XMAS_EDITIONS, XMAS_PRICES, XMAS_SELAR_URL, isPreorder, xmasMoney, type XmasEditionId } from "@/lib/christmas";

const ORDER: XmasEditionId[] = ["book", "companion", "complete"];

function href(edition: XmasEditionId): string {
  const url = new URL(XMAS_SELAR_URL);
  try {
    const q = new URLSearchParams(location.search);
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      const v = q.get(k);
      if (v) url.searchParams.set(k, v);
    }
    if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", "website");
    url.searchParams.set("utm_term", `christmas-${edition}`);
  } catch { /* plain link */ }
  return url.toString();
}

export function XmasBuyButton({ edition, children, className = "btn btn-primary" }: { edition: XmasEditionId; children: React.ReactNode; className?: string }) {
  return (
    <a
      className={className}
      href={XMAS_SELAR_URL}
      onClick={(e) => {
        e.preventDefault();
        source();
        trackCustom("ClickToSelar", { content_ids: [`christmas-${edition}`], content_type: "product", content_name: "Unscripted Christmas" });
        window.location.href = href(edition);
      }}
    >
      {children}
    </a>
  );
}

function usePreorder(): boolean {
  const [pre, setPre] = useState(true);
  useEffect(() => { setPre(isPreorder()); }, []);
  return pre;
}

/** "From $8 (pre-order)" line for the hero. */
export function XmasFromPrice() {
  const currency = useCurrency();
  const pre = usePreorder();
  const p = XMAS_PRICES.book[currency];
  return pre
    ? <span>From {xmasMoney(p.preorder, currency)} <s>{xmasMoney(p.full, currency)}</s>, 20% off until 16 November</span>
    : <span>From {xmasMoney(p.full, currency)}</span>;
}

export default function ChristmasEditions() {
  const currency = useCurrency();
  const pre = usePreorder();
  return (
    <div className="editions-tiers">
      <p className="tiers-pay" style={{ textAlign: "center", marginTop: 8 }}>
        Pay by mobile money or card. {pre ? "You receive your pre-order confirmation at once, and your edition arrives on 16 November." : "Every file downloads to keep."} Prices convert to your currency at checkout.
      </p>
      <div className="grid-12" style={{ gap: 24, marginTop: 20 }}>
        {ORDER.map((id) => {
          const p = XMAS_PRICES[id][currency];
          const popular = id === "companion";
          return (
            <div className={`col-4 tier-card${popular ? " popular" : ""}`} key={id}>
              {popular ? <span className="tier-flag">Recommended</span> : null}
              <span className="tier-name">{XMAS_EDITIONS[id].name}</span>
              <div className="price">
                {pre ? <span>{xmasMoney(p.preorder, currency)} <s>{xmasMoney(p.full, currency)}</s></span> : <span>{xmasMoney(p.full, currency)}</span>}
              </div>
              <ul className="tier-includes">
                {XMAS_EDITIONS[id].includes.map((i) => <li key={i}>{i}</li>)}
              </ul>
              <XmasBuyButton edition={id} className={`btn ${popular ? "btn-primary" : "btn-ghost"} tier-buy`}>
                {pre ? `Pre-order ${XMAS_EDITIONS[id].name}` : `Get ${XMAS_EDITIONS[id].name}`}
              </XmasBuyButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
