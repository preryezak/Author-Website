/**
 * The single source of truth for what is sold, at what price, in which
 * currency, and which files each edition delivers.
 *
 * Read by BOTH the static site (to show prices) and the checkout Worker
 * (worker/checkout.ts), which sets the amount on the server. The amount a
 * buyer pays is never taken from the browser.
 *
 * Prices are whole units of each currency (no cents). Launch prices apply
 * until LAUNCH_ENDS; full prices after.
 */

export const LAUNCH_ENDS = "2026-11-01T00:00:00+03:00";

export type EditionId = "reader" | "formation" | "complete";
export type Currency = "UGX" | "KES" | "TZS" | "RWF" | "ZMW" | "GHS" | "NGN" | "XOF" | "XAF" | "ZAR" | "USD";

export interface Price { launch: number; full: number }

/**
 * UGX, NGN and USD are the prices already on the site and on Selar/Payhip.
 * KES, TZS, RWF, ZMW, GHS, XOF, XAF and ZAR are PROPOSED (set near the UGX level, about $10 / $19 / $32
 * at launch) and must be confirmed by Eryeza before going live.
 */
export const PRICES: Record<EditionId, Record<Currency, Price>> = {
  reader: {
    UGX: { launch: 36000, full: 45000 },
    KES: { launch: 1250, full: 1550 },
    TZS: { launch: 25000, full: 31000 },
    RWF: { launch: 14000, full: 17500 },
    ZMW: { launch: 250, full: 310 },
    XOF: { launch: 6000, full: 7500 },
    XAF: { launch: 6000, full: 7500 },
    NGN: { launch: 14400, full: 18000 },
    GHS: { launch: 110, full: 140 },
    ZAR: { launch: 175, full: 220 },
    USD: { launch: 12, full: 15 },
  },
  formation: {
    UGX: { launch: 72000, full: 90000 },
    KES: { launch: 2500, full: 3100 },
    TZS: { launch: 50000, full: 62000 },
    RWF: { launch: 27000, full: 34000 },
    ZMW: { launch: 480, full: 600 },
    XOF: { launch: 11500, full: 14500 },
    XAF: { launch: 11500, full: 14500 },
    NGN: { launch: 28800, full: 36000 },
    GHS: { launch: 220, full: 275 },
    ZAR: { launch: 350, full: 440 },
    USD: { launch: 23, full: 29 },
  },
  complete: {
    UGX: { launch: 120000, full: 150000 },
    KES: { launch: 4200, full: 5200 },
    TZS: { launch: 85000, full: 105000 },
    RWF: { launch: 46000, full: 57000 },
    ZMW: { launch: 800, full: 1000 },
    XOF: { launch: 19000, full: 24000 },
    XAF: { launch: 19000, full: 24000 },
    NGN: { launch: 48000, full: 60000 },
    GHS: { launch: 360, full: 450 },
    ZAR: { launch: 580, full: 720 },
    USD: { launch: 39, full: 49 },
  },
};

export const EDITIONS: Record<EditionId, { name: string; short: string; includes: string[] }> = {
  reader: {
    name: "Reader Edition",
    short: "The complete 30-day devotional",
    includes: ["The complete devotional (PDF and EPUB)", "Start Here guide", "Using it with your church or team"],
  },
  formation: {
    name: "Formation Bundle",
    short: "Read it, hear it, study it with others",
    includes: [
      "Everything in the Reader Edition",
      "The full audiobook, narrated by Eryeza Kalalu",
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

/** Optional add-on offered at checkout. Disabled until a price is set. */
export const ADDONS = {
  christmas: {
    name: "Unedited Christmas (pre-order)",
    desc: "Delivered to your email on release day, 15 November 2026.",
    enabled: false,
    price: { UGX: 0, KES: 0, TZS: 0, RWF: 0, ZMW: 0, GHS: 0, NGN: 0, XOF: 0, XAF: 0, ZAR: 0, USD: 0 } as Record<Currency, number>,
  },
} as const;

/** Flutterwave payment methods per currency. Methods that do not match the currency are hidden by Flutterwave. */
export const PAYMENT_OPTIONS: Record<Currency, string> = {
  UGX: "mobilemoneyuganda,card",
  KES: "mpesa,card",
  TZS: "mobilemoneytanzania,card",
  RWF: "mobilemoneyrwanda,card",
  ZMW: "mobilemoneyzambia,card",
  GHS: "mobilemoneyghana,card",
  XOF: "mobilemoneyfranco,card",
  XAF: "mobilemoneyfranco,card",
  NGN: "card,banktransfer,ussd",
  ZAR: "card",
  USD: "card",
};

/** What the buyer is told they can pay with, per currency (the checkout service is never named). */
export const PAY_LABEL: Record<Currency, string> = {
  UGX: "MTN or Airtel Mobile Money, or card",
  KES: "M-Pesa or card",
  TZS: "Airtel, Tigo, Halopesa or Vodacom mobile money, or card",
  RWF: "MTN or Airtel mobile money, or card",
  ZMW: "Airtel, MTN or Zamtel mobile money, or card",
  GHS: "MTN, Telecel or AirtelTigo mobile money, or card",
  XOF: "Orange, MTN, Moov, Wave or Free mobile money, or card",
  XAF: "MTN or Orange mobile money, or card",
  NGN: "Bank transfer, USSD or card",
  ZAR: "Card",
  USD: "Card, from anywhere in the world",
};

export const CURRENCY_LABEL: Record<Currency, string> = {
  UGX: "Uganda (UGX)",
  KES: "Kenya (KES)",
  TZS: "Tanzania (TZS)",
  RWF: "Rwanda (RWF)",
  ZMW: "Zambia (ZMW)",
  GHS: "Ghana (GHS)",
  NGN: "Nigeria (NGN)",
  XOF: "Côte d'Ivoire, Senegal, Burkina Faso (XOF)",
  XAF: "Cameroon, Gabon, Congo, CAR, Eq. Guinea (XAF)",
  ZAR: "South Africa (ZAR)",
  USD: "Rest of the world (USD)",
};

/** Visitor country (Cloudflare cf.country) to the currency shown first. */
export const COUNTRY_CURRENCY: Record<string, Currency> = {
  UG: "UGX", KE: "KES", TZ: "TZS", RW: "RWF", ZM: "ZMW", GH: "GHS", NG: "NGN", ZA: "ZAR",
  CI: "XOF", SN: "XOF", BF: "XOF", ML: "XOF", BJ: "XOF", TG: "XOF", NE: "XOF", GW: "XOF",
  CM: "XAF", GA: "XAF", CG: "XAF", CF: "XAF", GQ: "XAF", TD: "XAF",
};

export const CURRENCIES = Object.keys(CURRENCY_LABEL) as Currency[];

export function currencyFor(country: string | null | undefined): Currency {
  return (country && COUNTRY_CURRENCY[country.toUpperCase()]) || "USD";
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
  if (currency === "USD") return `$${n}`;
  if (currency === "NGN") return `₦${n}`;
  if (currency === "ZAR") return `R${n}`;
  return `${currency} ${n}`;
}

/**
 * Files per edition. `key` is the object name in the private R2 bucket.
 * `stamp: true` PDFs are personalised per order before download.
 * Audio is listed separately so the order page can offer streaming per chapter.
 */
export interface BookFile { id: string; label: string; key: string; type: "pdf" | "epub" | "zip" | "mp3"; stamp?: boolean }

const F = {
  book: { id: "book-pdf", label: "The Influential Spirit (PDF)", key: "is/The_Influential_Spirit.pdf", type: "pdf", stamp: true },
  epub: { id: "book-epub", label: "The Influential Spirit (EPUB, for phones and e-readers)", key: "is/The_Influential_Spirit.epub", type: "epub" },
  startR: { id: "start", label: "Start Here", key: "is/Start_Here_Reader.pdf", type: "pdf" },
  startF: { id: "start", label: "Start Here", key: "is/Start_Here_Formation.pdf", type: "pdf" },
  startC: { id: "start", label: "Start Here", key: "is/Start_Here_Complete.pdf", type: "pdf" },
  church: { id: "church", label: "Using it with your church or team", key: "is/Use_it_with_your_church_or_team.pdf", type: "pdf" },
  study: { id: "study", label: "Group Study Guide", key: "is/Group_Study_Guide.pdf", type: "pdf", stamp: true },
  plan: { id: "plan", label: "30-Day Reading Plan and Challenge", key: "is/Reading_Plan_and_Challenge.pdf", type: "pdf" },
  notionF: { id: "notion", label: "Notion templates", key: "is/Notion_Formation.zip", type: "zip" },
  journal: { id: "journal", label: "Companion Journal", key: "is/Companion_Journal.pdf", type: "pdf", stamp: true },
  decl: { id: "declarations", label: "Declarations and Prayers (PDF)", key: "is/Declarations_and_Prayers.pdf", type: "pdf" },
  notionC: { id: "notion", label: "Complete Notion workspace", key: "is/Notion_Complete.zip", type: "zip" },
} satisfies Record<string, BookFile>;

export const FILES: Record<EditionId, BookFile[]> = {
  reader: [F.startR, F.book, F.epub, F.church],
  formation: [F.startF, F.book, F.epub, F.church, F.study, F.plan, F.notionF],
  complete: [F.startC, F.book, F.epub, F.church, F.study, F.plan, F.journal, F.decl, F.notionC],
};

/** Audio collections (R2 prefix + manifest object listing the chapters). */
export const AUDIO: Record<EditionId, { id: string; label: string; prefix: string }[]> = {
  reader: [],
  formation: [{ id: "audiobook", label: "The audiobook", prefix: "is/audio/book/" }],
  complete: [
    { id: "audiobook", label: "The audiobook", prefix: "is/audio/book/" },
    { id: "prayers", label: "Declarations and Prayers (audio)", prefix: "is/audio/prayers/" },
  ],
};

/**
 * Launch switch. While false, only a browser that opened the owner's private
 * tester link (cookie ek_t=1) uses the on-site checkout, Day 1 sign-up and giving;
 * everyone else is sent to FALLBACK_URL (the existing Selar page) to buy.
 * Set to true (and deploy) once the test payments have passed.
 */
export const CHECKOUT_LIVE = false;
export const FALLBACK_URL: Record<EditionId, string> = {
  reader: "https://selar.com/8818840887",
  formation: "https://selar.com/8818840887",
  complete: "https://selar.com/8818840887",
};
export const FALLBACK_GIVE_URL = "https://flutterwave.com/donate/h2tj4bfhltce";

/** True when this browser should use the on-site checkout (always after launch). */
export function onSite(): boolean {
  if (CHECKOUT_LIVE) return true;
  try { return /(?:^|; )ek_t=1(?:;|$)/.test(document.cookie); } catch { return false; }
}
