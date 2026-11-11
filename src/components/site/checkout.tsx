"use client";

/**
 * Buy buttons and local prices. Each edition's button opens its own Selar
 * checkout in the same tab (in-app browsers lose new tabs). Prices show in UGX,
 * KES or NGN for visitors in Uganda, Kenya or Nigeria and USD elsewhere, and the
 * button opens Selar in that currency so mobile money is offered.
 */

import { useEffect, useState } from "react";
import { PRICES, SELAR_URL, currencyForCountry, formatMoney, type Currency, type EditionId } from "@/lib/editions";
import { source, trackCustom } from "@/lib/pixel";

import { geo } from "@/lib/geo";

/** The visitor's local currency in Uganda, Kenya and Nigeria, USD elsewhere (USD until the country is known). */
export function useCurrency(): Currency {
  const [cur, setCur] = useState<Currency>("USD");
  useEffect(() => { geo().then((g) => setCur(currencyForCountry(g?.country))); }, []);
  return cur;
}

/** Selar link with campaign tags carried over, so Selar's reports show which page and ad sold. */
function selarHref(edition: EditionId, currency: Currency): string {
  const url = new URL(SELAR_URL[edition]);
  url.searchParams.set("currency", currency);
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
  const currency = useCurrency();
  return (
    <a
      className={className}
      href={SELAR_URL[edition]}
      data-edition={edition}
      onClick={(e) => {
        e.preventDefault();
        source();
        trackCustom("ClickToSelar", { content_ids: [edition], content_type: "product" });
        window.location.href = selarHref(edition, currency);
      }}
    >
      {children}
    </a>
  );
}

/** The edition's price in the visitor's currency. */
export function LocalPrice({ edition = "reader" }: { edition?: EditionId; was?: boolean }) {
  const currency = useCurrency();
  return <span>{formatMoney(PRICES[edition][currency], currency)}</span>;
}
