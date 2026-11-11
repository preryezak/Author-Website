/**
 * The three editions of The Influential Spirit: what each includes, its price,
 * and the Selar checkout link each buy button opens. Buying, payment and
 * delivery all happen on Selar, and every file downloads to keep.
 *
 * Prices (from 11 Nov 2026) are set in US dollars, $9.99 / $19.99 / $29.99, and every
 * other currency is converted from the dollar at the day's Wise rate and rounded down to a
 * clean step (1,000 for UGX and NGN; KES to the nearest 100), so no one pays above the dollar price.
 * The site shows UGX in Uganda, KES in Kenya, NGN in Nigeria and USD elsewhere, and the
 * buy buttons open Selar in that same currency, so mobile money is offered at checkout.
 * The launch pricing ended on 31 Oct 2026 (LAUNCH_ENDS is kept for the date logic).
 */

export const LAUNCH_ENDS = "2026-11-01T00:00:00+03:00";

export type EditionId = "reader" | "formation" | "complete";
export type Currency = "USD" | "UGX" | "KES" | "NGN";

export const PRICES: Record<EditionId, Record<Currency, number>> = {
  reader: { USD: 9.99, UGX: 40000, KES: 1300, NGN: 13000 },
  formation: { USD: 19.99, UGX: 81000, KES: 2600, NGN: 27000 },
  complete: { USD: 29.99, UGX: 122000, KES: 3900, NGN: 41000 },
};

/**
 * Selar checkout link per edition. All three editions are tiers of one Selar
 * product, so the buyer compares them on one page and picks once.
 */
export const SELAR_URL: Record<EditionId, string> = {
  reader: "https://selar.com/8818840887",
  formation: "https://selar.com/8818840887",
  complete: "https://selar.com/8818840887",
};

export const EDITIONS: Record<EditionId, { name: string; short: string; includes: string[] }> = {
  reader: {
    name: "Reader Edition",
    short: "The complete 30-day devotional",
    includes: ["The complete devotional in PDF and EPUB", "Start Here guide", "Using it with your church or team"],
  },
  formation: {
    name: "Formation Bundle",
    short: "Read it, hear it, study it with others",
    includes: [
      "Everything in the Reader Edition",
      "The full audiobook, narrated by Eryeza Kalalu (download)",
      "Six-session Group Study Guide",
      "30-Day Reading Plan and Challenge",
    ],
  },
  complete: {
    name: "Complete Formation Edition",
    short: "The full formation library",
    includes: [
      "Everything in the Formation Bundle",
      "Companion Journal",
      "Declarations and Prayers (booklet and audio)",
    ],
  },
};

/** What the buyer is told about paying (the checkout service is never named). */
export const PAY_NOTE = "Pay by mobile money or card. Every file downloads to keep.";

export function currencyForCountry(country: string | null | undefined): Currency {
  return country === "UG" ? "UGX" : country === "KE" ? "KES" : country === "NG" ? "NGN" : "USD";
}

export function isLaunch(now = Date.now()): boolean {
  return now < Date.parse(LAUNCH_ENDS);
}

export function priceOf(edition: EditionId, currency: Currency): number {
  return PRICES[edition][currency];
}

export function formatMoney(amount: number, currency: Currency): string {
  if (currency === "USD") return `$${amount % 1 ? amount.toFixed(2) : amount}`;
  const n = amount.toLocaleString("en-GB");
  return currency === "KES" ? `KSh ${n}` : currency === "NGN" ? `₦${n}` : `UGX ${n}`;
}

/**
 * Day 1 email sign-up and its letters. Off until the Day 1 PDF is uploaded and
 * the letters are approved; the server checks LEADS_LIVE too.
 */
export const LEADS_LIVE = true;
