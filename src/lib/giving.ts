/**
 * Giving: amounts per currency, shared by the /give page and the checkout Worker.
 * The Worker re-checks every amount against MIN and MAX; the browser cannot go lower or higher.
 */
import type { Currency } from "./editions";

/** Suggested amounts (whole units). The second one is pre-selected. */
export const GIFT_PRESETS: Record<Currency, number[]> = {
  UGX: [20000, 50000, 100000, 250000],
  KES: [700, 1500, 3500, 7500],
  TZS: [15000, 35000, 70000, 170000],
  RWF: [7500, 18000, 36000, 90000],
  ZMW: [130, 330, 650, 1600],
  GHS: [70, 160, 320, 800],
  NGN: [8000, 20000, 40000, 100000],
  XOF: [3000, 7500, 15000, 37500],
  XAF: [3000, 7500, 15000, 37500],
  ZAR: [100, 250, 500, 1200],
  USD: [10, 25, 50, 100],
};

export const GIFT_MIN: Record<Currency, number> = {
  UGX: 5000, KES: 150, TZS: 3000, RWF: 1500, ZMW: 30, GHS: 15, NGN: 2000, XOF: 700, XAF: 700, ZAR: 20, USD: 2,
};

export const GIFT_MAX: Record<Currency, number> = {
  UGX: 20000000, KES: 700000, TZS: 13000000, RWF: 7000000, ZMW: 130000, GHS: 60000, NGN: 8000000, XOF: 3000000, XAF: 3000000, ZAR: 100000, USD: 5000,
};

/** Monthly gifts renew automatically on a card. Mobile money cannot be charged again without the giver. */
export const MONTHLY_PAYMENT_OPTIONS = "card";

/** Optional share added so the full gift reaches the ministry (payment fees are about 3 to 4.8%). */
export const FEE_COVER_RATE = 0.05;

const STEP: Record<Currency, number> = { UGX: 500, TZS: 500, NGN: 100, RWF: 100, XOF: 100, XAF: 100, KES: 10, ZMW: 1, GHS: 1, ZAR: 1, USD: 1 };

/** Rounds UP to a tidy figure, so covering the fee never falls short. */
export function roundGift(amount: number, currency: Currency): number {
  const step = STEP[currency];
  return Math.ceil(amount / step) * step;
}
