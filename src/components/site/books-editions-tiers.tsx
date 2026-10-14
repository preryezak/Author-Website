"use client";

import { BuyButton, useCurrency } from "@/components/site/checkout";
import {
  CURRENCIES, CURRENCY_LABEL, EDITIONS, PAY_LABEL, PRICES, formatMoney,
  type EditionId,
} from "@/lib/editions";
import { Price } from "@/components/site/price";

const ORDER: EditionId[] = ["reader", "formation", "complete"];
const CTA: Record<EditionId, string> = {
  reader: "Get the Reader Edition",
  formation: "Get the Formation Bundle",
  complete: "Get the Complete Edition",
};

/**
 * The three editions in the visitor's currency (from their country, or their
 * own choice), each opening the on-site checkout for exactly that edition.
 * Launch and full prices are both in the HTML; layout.tsx flips them on 1 Nov.
 */
export default function EditionsTiers() {
  const [currency, setCurrency] = useCurrency();
  return (
    <div className="editions-tiers">
      <div className="tiers-currency">
        <label>
          <span className="sr-only">Show prices for</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as typeof currency)} aria-label="Show prices for">
            {CURRENCIES.map((c) => <option key={c} value={c}>{CURRENCY_LABEL[c]}</option>)}
          </select>
        </label>
        <span className="tiers-pay">{PAY_LABEL[currency]}. Instant delivery.</span>
      </div>
      <div className="grid-12" style={{ gap: 24, marginTop: 20 }}>
        {ORDER.map((id) => {
          const p = PRICES[id][currency];
          const popular = id === "formation";
          return (
            <div className={`col-4 tier-card${popular ? " popular" : ""}`} key={id}>
              {popular ? <span className="tier-flag">Recommended</span> : null}
              <span className="tier-name">{EDITIONS[id].name}</span>
              <div className="price">
                <Price launch={formatMoney(p.launch, currency)} was={formatMoney(p.full, currency)} full={formatMoney(p.full, currency)} />
              </div>
              <ul className="tier-includes">
                {EDITIONS[id].includes.map((i) => <li key={i}>{i}</li>)}
              </ul>
              <BuyButton edition={id} className={`btn ${popular ? "btn-primary" : "btn-ghost"} tier-buy`}>{CTA[id]}</BuyButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
