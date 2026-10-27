/**
 * Unscripted Christmas: the three editions, prices and the Selar checkout.
 * One Selar product holds all three tiers (selar.com/izxm12og2p); the buyer picks
 * the edition there. Pre-order prices are the full prices less 20% until release.
 * Full prices match The Influential Spirit's full prices.
 */

import type { Currency } from "@/lib/editions";

export const XMAS_SELAR_URL = "https://selar.com/izxm12og2p";

/** Release day: files arrive in buyers' Selar libraries; pre-order prices end. */
export const XMAS_RELEASE = "2026-11-16T00:00:00+03:00";

export type XmasEditionId = "book" | "companion" | "complete";

export interface XmasPrice { preorder: number; full: number }

export const XMAS_PRICES: Record<XmasEditionId, Record<Currency, XmasPrice>> = {
  book: { UGX: { preorder: 36000, full: 45000 }, USD: { preorder: 8, full: 10 } },
  companion: { UGX: { preorder: 72000, full: 90000 }, USD: { preorder: 16, full: 21 } },
  complete: { UGX: { preorder: 120000, full: 150000 }, USD: { preorder: 27, full: 34 } },
};

export const XMAS_EDITIONS: Record<XmasEditionId, { name: string; short: string; includes: string[] }> = {
  book: {
    name: "The Book",
    short: "The 24-day devotional",
    includes: ["The devotional in PDF and EPUB", "Twenty-four readings, 1 to 24 December, and a Christmas Day reading"],
  },
  companion: {
    name: "The Advent Companion",
    short: "Read it, hear it, write in it",
    includes: [
      "Everything in The Book",
      "The audiobook",
      "A printable Advent journal, one page for each day's Heart Check",
      "The 24 Permission for Today cards, for print and phone wallpaper",
    ],
  },
  complete: {
    name: "The Complete Christmas Edition",
    short: "For your family, group or church",
    includes: [
      "Everything in The Advent Companion",
      "A four-session group guide for the Sundays of Advent, with leader notes",
      "The prayers, read by the author",
      "The Gift a Gentler Christmas card page",
    ],
  },
};

export function isPreorder(now = Date.now()): boolean {
  return now < Date.parse(XMAS_RELEASE);
}

export function xmasMoney(amount: number, currency: Currency): string {
  if (currency === "USD") return `$${amount % 1 ? amount.toFixed(2) : amount}`;
  return `UGX ${amount.toLocaleString("en-GB")}`;
}
