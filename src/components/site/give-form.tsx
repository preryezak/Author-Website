"use client";

/**
 * On-site giving: once or monthly, in the giver's currency, with suggested
 * amounts or their own. Monthly gifts renew on a card; one-off gifts can use
 * mobile money. The server sets and checks every amount (worker/checkout.ts).
 */

import { useEffect, useState } from "react";
import { useCurrency } from "@/components/site/checkout";
import { CURRENCIES, CURRENCY_LABEL, PAY_LABEL, formatMoney, type Currency } from "@/lib/editions";
import { FEE_COVER_RATE, GIFT_MIN, GIFT_PRESETS, roundGift } from "@/lib/giving";
import { metaIds, source, track } from "@/lib/pixel";

type FlwConfig = Record<string, unknown> & { callback?: (d: { transaction_id?: number | string }) => void; onclose?: () => void };

function loadFlutterwave(): Promise<(c: FlwConfig) => { close?: () => void }> {
  const w = window as unknown as { FlutterwaveCheckout?: (c: FlwConfig) => { close?: () => void } };
  if (w.FlutterwaveCheckout) return Promise.resolve(w.FlutterwaveCheckout);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.flutterwave.com/v3.js";
    s.async = true;
    s.onload = () => (w.FlutterwaveCheckout ? resolve(w.FlutterwaveCheckout) : reject(new Error("load")));
    s.onerror = () => reject(new Error("load"));
    document.head.appendChild(s);
  });
}

export default function GiveForm() {
  const [currency, setCurrency] = useCurrency();
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [preset, setPreset] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [cover, setCover] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const presets = GIFT_PRESETS[currency];
  useEffect(() => { setPreset(presets[1]); setCustom(""); }, [currency]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ek-buyer") || "{}") as { name?: string; email?: string; phone?: string };
      if (saved.name) setName(saved.name);
      if (saved.email) setEmail(saved.email);
      if (saved.phone) setPhone(saved.phone);
    } catch { /* ignore */ }
  }, []);

  const base = custom ? Math.floor(Number(custom.replace(/[^\d]/g, ""))) : preset ?? 0;
  const total = cover ? roundGift(base * (1 + FEE_COVER_RATE), currency) : base;
  const tooSmall = base > 0 && base < GIFT_MIN[currency];

  async function give(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!base || tooSmall) { setError(`Please choose an amount of at least ${formatMoney(GIFT_MIN[currency], currency)}.`); return; }
    setError("");
    setBusy(true);
    try { localStorage.setItem("ek-buyer", JSON.stringify({ name, email, phone })); } catch { /* ignore */ }
    try {
      const res = await fetch("/api/give/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: base, currency, frequency, coverFee: cover, name, email, phone, ...metaIds(), source: source() }),
      });
      const out = await res.json().catch(() => ({ ok: false }));
      if (!out.ok) { setError(out.error || "We could not start the payment. Please try again."); setBusy(false); return; }
      const { gift, flutterwave } = out as { gift: { id: string; token: string; amount: number; currency: string }; flutterwave: FlwConfig };
      track("InitiateCheckout", { value: gift.amount, currency: gift.currency, content_type: "donation" }, `ic-${gift.id}`);
      const thanks = () => { window.location.href = `/give/thanks/?t=${encodeURIComponent(gift.token)}`; };
      let finished = false;
      const FlutterwaveCheckout = await loadFlutterwave();
      const modal = FlutterwaveCheckout({
        ...flutterwave,
        callback: (d) => {
          finished = true;
          fetch("/api/give/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ t: gift.token, transaction_id: d.transaction_id }) })
            .catch(() => {}).finally(() => { try { modal?.close?.(); } catch { /* ignore */ } thanks(); });
        },
        onclose: () => { if (!finished) thanks(); },
      });
      setBusy(false);
    } catch {
      setBusy(false);
      setError("The payment window could not load. Check your connection and try again.");
    }
  }

  return (
    <form className="give-form" onSubmit={give}>
      <div className="give-freq" role="radiogroup" aria-label="How often">
        {(["once", "monthly"] as const).map((f) => (
          <button key={f} type="button" role="radio" aria-checked={frequency === f} className={frequency === f ? "is-on" : ""} onClick={() => setFrequency(f)}>
            {f === "once" ? "Give once" : "Give monthly"}
          </button>
        ))}
      </div>

      <label className="co-field">
        <span>Currency</span>
        <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
          {CURRENCIES.map((c) => <option key={c} value={c}>{CURRENCY_LABEL[c]}</option>)}
        </select>
        <small>{frequency === "monthly" ? "Monthly gifts renew on a debit or credit card. For mobile money, give once each month." : PAY_LABEL[currency]}</small>
      </label>

      <div className="give-amounts" role="radiogroup" aria-label="Amount">
        {presets.map((a) => (
          <button key={a} type="button" role="radio" aria-checked={!custom && preset === a} className={!custom && preset === a ? "is-on" : ""} onClick={() => { setPreset(a); setCustom(""); }}>
            {formatMoney(a, currency)}
          </button>
        ))}
      </div>
      <label className="co-field">
        <span>Or enter your own amount</span>
        <input inputMode="numeric" placeholder={`${currency} amount`} value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d,]/g, ""))} />
        {tooSmall ? <small>The smallest gift online is {formatMoney(GIFT_MIN[currency], currency)}.</small> : null}
      </label>

      <label className="co-check">
        <input type="checkbox" checked={cover} onChange={(e) => setCover(e.target.checked)} />
        <span>Add a little so the full gift reaches the ministry after payment fees.</span>
      </label>

      <label className="co-field"><span>Your name</span><input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></label>
      <label className="co-field"><span>Email (for your receipt)</span><input required type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} /></label>
      <label className="co-field"><span>Phone (for mobile money)</span><input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={24} /></label>

      {error ? <p className="co-error" role="alert">{error}</p> : null}

      <button type="submit" className="btn btn-primary co-pay" disabled={busy || !base}>
        {busy ? "Opening secure payment" : `Give ${base ? formatMoney(total, currency) : ""}${frequency === "monthly" ? " monthly" : ""}`}
      </button>
      <p className="co-fine">Every giver joins our partners list and receives early access and special offers on new books and resources. You can leave the list at any time.</p>
    </form>
  );
}
