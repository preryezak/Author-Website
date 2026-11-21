"use client";

import { BuyButton, useCurrency } from "@/components/site/checkout";
import { EDITIONS, PAY_NOTE, PRICES, formatMoney, type EditionId } from "@/lib/editions";

const ORDER: EditionId[] = ["reader", "formation", "complete"];
const CTA: Record<EditionId, string> = {
  reader: "Get the Reader Edition",
  formation: "Get the Formation Bundle",
  complete: "Get the Complete Edition",
};

/**
 * Selar opens every link on its default tier (the Formation Bundle) and has no link
 * setting that picks another tier (checked 21 Nov 2026), so each card says what to tap.
 */
const NEXT_STEP: Record<EditionId, string> = {
  reader: "On the next page, tap Reader Edition before you pay.",
  formation: "The Formation Bundle is already selected on the next page.",
  complete: "On the next page, tap Complete Formation Edition before you pay.",
};

/**
 * The three editions in the visitor's currency (UGX, KES, NGN or USD); each button
 * opens Selar in that currency.
 */
export default function EditionsTiers() {
  const currency = useCurrency();
  return (
    <div className="editions-tiers">
      <p className="tiers-pay" style={{ textAlign: "center", marginTop: 8 }}>{PAY_NOTE} Prices show in your currency.</p>
      <div className="grid-12" style={{ gap: 24, marginTop: 20 }}>
        {ORDER.map((id) => {
          const p = PRICES[id][currency];
          const popular = id === "formation";
          return (
            <div className={`col-4 tier-card${popular ? " popular" : ""}`} key={id}>
              {popular ? <span className="tier-flag">Recommended</span> : null}
              <span className="tier-name">{EDITIONS[id].name}</span>
              <div className="price">
                {formatMoney(p, currency)}
              </div>
              <ul className="tier-includes">
                {EDITIONS[id].includes.map((i) => <li key={i}>{i}</li>)}
              </ul>
              <BuyButton edition={id} className={`btn ${popular ? "btn-primary" : "btn-ghost"} tier-buy`}>{CTA[id]}</BuyButton>
              <p className="tier-next">{NEXT_STEP[id]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
