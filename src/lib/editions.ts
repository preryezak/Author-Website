/**
 * The three editions of The Influential Spirit: what each includes, its price,
 * and the Selar checkout link each buy button opens. Buying, payment and
 * delivery all happen on Selar (the book reads online in the Selar app; audio
 * and study files download).
 *
 * Prices shown on the site: UGX for visitors in Africa, USD elsewhere. Selar
 * shows the buyer's own currency at checkout.
 * Launch prices apply until LAUNCH_ENDS; full prices after.
 */

export const LAUNCH_ENDS = "2026-11-01T00:00:00+03:00";

export type EditionId = "reader" | "formation" | "complete";
export type Currency = "UGX" | "USD";

export interface Price { launch: number; full: number }

export const PRICES: Record<EditionId, Record<Currency, Price>> = {
  reader: { UGX: { launch: 36000, full: 45000 }, USD: { launch: 12, full: 15 } },
  formation: { UGX: { launch: 72000, full: 90000 }, USD: { launch: 23, full: 29 } },
  complete: { UGX: { launch: 120000, full: 150000 }, USD: { launch: 39, full: 49 } },
};

/**
 * Selar checkout link per edition. Replace with each product's own link once
 * the separate Selar products exist (until then all three open the current page).
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
    includes: ["The complete devotional, read online on any device", "Start Here guide", "Using it with your church or team"],
  },
  formation: {
    name: "Formation Bundle",
    short: "Read it, hear it, study it with others",
    includes: [
      "Everything in the Reader Edition",
      "The full audiobook, narrated by Eryeza Kalalu (download)",
      "Six-session Group Study Guide",
      "30-Day Reading Plan and Challenge",
      "Notion templates",
    ],
  },
  complete: {
    name: "Complete Formation Edition",
    short: "The full formation library",
    includes: [
      "Everything in the Formation Bundle",
      "Companion Journal",
      "Declarations and Prayers (PDF and audio)",
      "Complete Notion workspace",
    ],
  },
};

/** What the buyer is told about paying (the checkout service is never named). */
export const PAY_NOTE = "Pay by mobile money or card. Instant delivery.";

export function currencyForContinent(continent: string | null | undefined): Currency {
  return continent === "AF" ? "UGX" : "USD";
}

export function isLaunch(now = Date.now()): boolean {
  return now < Date.parse(LAUNCH_ENDS);
}

export function priceOf(edition: EditionId, currency: Currency, now = Date.now()): number {
  const p = PRICES[edition][currency];
  return isLaunch(now) ? p.launch : p.full;
}

export function formatMoney(amount: number, currency: Currency): string {
  const n = amount.toLocaleString("en-GB");
  return currency === "USD" ? `$${n}` : `UGX ${n}`;
}

/**
 * Day 1 email sign-up and its letters. Off until the Day 1 PDF is uploaded and
 * the letters are approved; the server checks LEADS_LIVE too.
 */
export const LEADS_LIVE = false;
