"use client";

/**
 * Buy buttons and local prices. Each edition's button opens its own Selar
 * checkout in the same tab (in-app browsers lose new tabs). Prices show in UGX
 * for visitors in Africa and USD elsewhere; Selar converts at checkout.
 */

import { useEffect, useState } from "react";
import { PRICES, SELAR_URL, currencyForContinent, formatMoney, type Currency, type EditionId } from "@/lib/editions";
import { source, trackCustom } from "@/lib/pixel";

import { geo } from "@/lib/geo";

/** UGX in Africa, USD elsewhere (USD until the visitor's region is known). */
export function useCurrency(): Currency {
  const [cur, setCur] = useState<Currency>("USD");
  useEffect(() => { geo().then((g) => setCur(currencyForContinent(g?.continent))); }, []);
  return cur;
}

/** Selar link with campaign tags carried over, so Selar's reports show which page and ad sold. */
function selarHref(edition: EditionId): string {
  const url = new URL(SELAR_URL[edition]);
  try {
    const q = new URLSearchParams(location.search);
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      const v = q.get(k);
      if (v) url.searchParams.set(k, v);
    }
    if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", "website");
    url.searchParams.set("utm_term", location.pathname.replace(/\//g, "") || "home");
  } catch { /* plain link */ }
  return url.toString();
}

export function BuyButton({ edition, children, className = "btn btn-primary" }: { edition: EditionId; children: React.ReactNode; className?: string }) {
  return (
    <a
      className={className}
      href={SELAR_URL[edition]}
      data-edition={edition}
      onClick={(e) => {
        e.preventDefault();
        source();
        trackCustom("ClickToSelar", { content_ids: [edition], content_type: "product" });
        window.location.href = selarHref(edition);
      }}
    >
      {children}
    </a>
  );
}

/** Launch and full price in the visitor's currency; layout.tsx switches launch/full on 1 Nov. */
export function LocalPrice({ edition = "reader", was = true }: { edition?: EditionId; was?: boolean }) {
  const currency = useCurrency();
  const p = PRICES[edition][currency];
  return (
    <>
      <span className="price-launch">{formatMoney(p.launch, currency)}{was ? <> <s>{formatMoney(p.full, currency)}</s></> : null}</span>
      <span className="price-full">{formatMoney(p.full, currency)}</span>
    </>
  );
}
