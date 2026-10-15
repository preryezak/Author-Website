"use client";

/**
 * On-site checkout. One sheet for the whole site, opened by any <BuyButton/>.
 *
 *  1. The visitor confirms the edition, sees the price in their currency
 *     (picked from their country, changeable), and gives name, email and phone.
 *  2. POST /api/checkout/start: the SERVER fixes the amount and creates the order.
 *  3. The payment window opens over the page (mobile money or card).
 *  4. On success the server checks the payment itself (/api/order/confirm) and
 *     the visitor lands on /order/?t=... with their books.
 *
 * Nothing about price is decided in the browser. The window script is only
 * loaded when the visitor presses Pay, so it costs nothing on page load.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ADDONS, CURRENCIES, CURRENCY_LABEL, EDITIONS, PAY_LABEL, PRICES,
  FALLBACK_URL, currencyFor, formatMoney, isLaunch, onSite, priceOf,
  type Currency, type EditionId,
} from "@/lib/editions";
import { metaIds, source, track } from "@/lib/pixel";

const OPEN_EVENT = "ek:checkout";
const CURRENCY_KEY = "ek-currency";

export function openCheckout(edition: EditionId) {
  if (!onSite()) { window.location.href = FALLBACK_URL[edition]; return; }
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { edition } }));
}

let geoOnce: Promise<{ country?: string } | null> | null = null;
function geo() {
  geoOnce ??= fetch("/api/geo", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return geoOnce;
}

/** Shared visitor currency: stored choice, else the country Cloudflare reports, else USD. */
export function useCurrency(): [Currency, (c: Currency) => void] {
  const [cur, setCur] = useState<Currency>("USD");
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(CURRENCY_KEY); } catch { /* private mode */ }
    if (saved && (CURRENCIES as string[]).includes(saved)) setCur(saved as Currency);
    else {
      geo().then((g) => { if (g?.country) setCur(currencyFor(g.country)); });
    }
    const on = (e: Event) => setCur((e as CustomEvent<Currency>).detail);
    window.addEventListener("ek:currency", on);
    return () => window.removeEventListener("ek:currency", on);
  }, []);
  const set = useCallback((c: Currency) => {
    setCur(c);
    try { localStorage.setItem(CURRENCY_KEY, c); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("ek:currency", { detail: c }));
  }, []);
  return [cur, set];
}

export function BuyButton({ edition, children, className = "btn btn-primary" }: { edition: EditionId; children: React.ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => openCheckout(edition)} data-edition={edition}>
      {children}
    </button>
  );
}

type FlwData = { status?: string; transaction_id?: number | string; tx_ref?: string };
type FlwConfig = Record<string, unknown> & { callback?: (d: FlwData) => void; onclose?: (incomplete?: boolean) => void };

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

const PHONE_HINT: Partial<Record<Currency, string>> = {
  UGX: "+256 7XX XXX XXX", KES: "+254 7XX XXX XXX", TZS: "+255 7XX XXX XXX", GHS: "+233 XX XXX XXXX", NGN: "+234 XXX XXX XXXX",
  RWF: "+250 7XX XXX XXX", ZMW: "+260 9XX XXX XXX", XOF: "+225 XX XX XX XX XX", XAF: "+237 6XX XXX XXX",
};

export default function CheckoutSheet() {
  const [open, setOpen] = useState(false);
  const [edition, setEdition] = useState<EditionId>("formation");
  const [currency, setCurrency] = useCurrency();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [letter, setLetter] = useState(true);
  const [christmas, setChristmas] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const ed = (e as CustomEvent<{ edition: EditionId }>).detail?.edition;
      if (ed && ed in EDITIONS) setEdition(ed);
      setError("");
      lastFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
      track("AddToCart", { content_ids: [ed], content_type: "product" });
    };
    window.addEventListener(OPEN_EVENT, on);
    try {
      const saved = JSON.parse(localStorage.getItem("ek-buyer") || "{}") as { name?: string; email?: string; phone?: string };
      if (saved.name) setName(saved.name);
      if (saved.email) setEmail(saved.email);
      if (saved.phone) setPhone(saved.phone);
    } catch { /* ignore */ }
    return () => window.removeEventListener(OPEN_EVENT, on);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) { d.close(); lastFocus.current?.focus?.(); }
  }, [open]);

  const mobileMoney = currency !== "USD" && currency !== "ZAR";
  const addon = ADDONS.christmas;
  const total = priceOf(edition, currency) + (addon.enabled && christmas ? addon.price[currency] : 0);
  const full = PRICES[edition][currency].full;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try { localStorage.setItem("ek-buyer", JSON.stringify({ name, email, phone })); } catch { /* ignore */ }
    try {
      const res = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edition, currency, name, email, phone, letterOptIn: letter,
          addons: christmas && addon.enabled ? ["christmas"] : [], ...metaIds(), source: source(),
        }),
      });
      const out = await res.json().catch(() => ({ ok: false }));
      if (!out.ok) { setError(out.error || "We could not start the payment. Please try again."); setBusy(false); return; }
      const { order, flutterwave } = out as { order: { id: string; token: string; amount: number; currency: string }; flutterwave: FlwConfig };
      track("InitiateCheckout", { value: order.amount, currency: order.currency, content_ids: [edition], content_type: "product" }, `ic-${order.id}`);
      const goToOrder = () => { window.location.href = `/order/?t=${encodeURIComponent(order.token)}`; };
      let finished = false;
      const FlutterwaveCheckout = await loadFlutterwave();
      setOpen(false);
      const modal = FlutterwaveCheckout({
        ...flutterwave,
        callback: (d: FlwData) => {
          finished = true;
          // Ask our server to check the payment with Flutterwave, then show the books.
          fetch("/api/order/confirm", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ t: order.token, transaction_id: d.transaction_id }),
          }).catch(() => {}).finally(() => { try { modal?.close?.(); } catch { /* ignore */ } goToOrder(); });
        },
        onclose: () => {
          // Mobile money can complete after the window closes; the order page keeps checking.
          if (!finished) goToOrder();
        },
      });
      setBusy(false);
    } catch {
      setBusy(false);
      setError("The payment window could not load. Check your connection and try again.");
    }
  }

  return (
    <dialog ref={dialogRef} className="co-sheet" aria-labelledby="co-title" onCancel={(e) => { e.preventDefault(); setOpen(false); }} onClick={(e) => { if (e.target === dialogRef.current) setOpen(false); }}>
      <form className="co-inner" onSubmit={pay} noValidate={false}>
        <div className="co-head">
          <p className="co-eyebrow">The Influential Spirit</p>
          <h2 id="co-title" className="co-title">{EDITIONS[edition].name}</h2>
          <button type="button" className="co-close" aria-label="Close" onClick={() => setOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <fieldset className="co-editions">
          <legend className="sr-only">Edition</legend>
          {(Object.keys(EDITIONS) as EditionId[]).map((id) => (
            <label key={id} className={`co-ed${edition === id ? " is-on" : ""}`}>
              <input type="radio" name="edition" value={id} checked={edition === id} onChange={() => setEdition(id)} />
              <span className="co-ed-name">{EDITIONS[id].name}{id === "formation" ? <em className="co-tag">Recommended</em> : null}</span>
              <span className="co-ed-price">{formatMoney(priceOf(id, currency), currency)}</span>
            </label>
          ))}
        </fieldset>

        <ul className="co-includes">
          {EDITIONS[edition].includes.map((i) => <li key={i}>{i}</li>)}
        </ul>

        <label className="co-field">
          <span>Where are you paying from?</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{CURRENCY_LABEL[c]}</option>)}
          </select>
          <small>{PAY_LABEL[currency]}</small>
        </label>

        <label className="co-field">
          <span>Your name</span>
          <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
        </label>
        <label className="co-field">
          <span>Email (your books are sent here)</span>
          <input required type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} />
        </label>
        <label className="co-field">
          <span>Phone {mobileMoney ? "(for mobile money)" : "(optional)"}</span>
          <input type="tel" inputMode="tel" autoComplete="tel" required={mobileMoney} placeholder={PHONE_HINT[currency] || "+1 555 000 0000"} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={24} />
        </label>

        {addon.enabled ? (
          <label className="co-check">
            <input type="checkbox" checked={christmas} onChange={(e) => setChristmas(e.target.checked)} />
            <span>Add <strong>{addon.name}</strong> for {formatMoney(addon.price[currency], currency)}. {addon.desc}</span>
          </label>
        ) : null}

        <label className="co-check">
          <input type="checkbox" checked={letter} onChange={(e) => setLetter(e.target.checked)} />
          <span>Send me Eryeza&rsquo;s letter: new books, resources and reflections. You can leave at any time.</span>
        </label>

        {error ? <p className="co-error" role="alert">{error}</p> : null}

        <button type="submit" className="btn btn-primary co-pay" disabled={busy}>
          {busy ? "Opening secure payment" : `Pay ${formatMoney(total, currency)}`}
        </button>
        <p className="co-fine">
          {isLaunch() ? <>Launch price until 31 October, then {formatMoney(full, currency)}. </> : null}
          Secure payment. Your books open on the next page and arrive by email.
        </p>
      </form>
    </dialog>
  );
}

/** "From" price in the visitor's currency. The static HTML shows USD until the page knows the visitor's country. */
export function LocalPrice({ edition = "reader", was = true }: { edition?: EditionId; was?: boolean }) {
  const [currency] = useCurrency();
  const p = PRICES[edition][currency];
  return (
    <>
      <span className="price-launch">{formatMoney(p.launch, currency)}{was ? <> <s>{formatMoney(p.full, currency)}</s></> : null}</span>
      <span className="price-full">{formatMoney(p.full, currency)}</span>
    </>
  );
}
