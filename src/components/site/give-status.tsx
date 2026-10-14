"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/pixel";

interface GiftView { id: string; status: string; amount: number; currency: string; display: string; frequency: string; name: string }

/** /give/thanks/?t=TOKEN: waits for the payment check, then thanks the giver. */
export function GiveThanks() {
  const [gift, setGift] = useState<GiftView | null>(null);
  const [missing, setMissing] = useState(false);
  const [waited, setWaited] = useState(0);
  const sent = useRef(false);

  useEffect(() => {
    const t = new URLSearchParams(location.search).get("t") || "";
    if (!t) { setMissing(true); return; }
    let n = 0;
    let stop = false;
    const load = async () => {
      try {
        const r = await fetch(`/api/give?t=${encodeURIComponent(t)}`, { cache: "no-store" });
        const out = await r.json();
        if (stop) return;
        if (!out.ok) { setMissing(true); return; }
        setGift(out.gift);
        if (out.gift.status === "pending" && n < 60) { n++; setWaited(n); setTimeout(load, n < 20 ? 3000 : 10000); }
      } catch { if (!stop && n < 60) { n++; setTimeout(load, 5000); } }
    };
    load();
    return () => { stop = true; };
  }, []);

  useEffect(() => {
    if (gift?.status !== "paid" || sent.current) return;
    sent.current = true;
    try { if (localStorage.getItem(`ek-px-${gift.id}`)) return; localStorage.setItem(`ek-px-${gift.id}`, "1"); } catch { /* ignore */ }
    track("Donate", { value: gift.amount, currency: gift.currency }, gift.id);
  }, [gift]);

  if (missing) return <div className="order-card"><h1 className="order-title">Thank you</h1><p>If you gave, your receipt is on its way by email. Questions: <a href="mailto:hello@eryezakalalu.com">hello@eryezakalalu.com</a>.</p></div>;
  if (!gift) return <p className="order-wait">Opening your gift.</p>;
  if (gift.status === "pending") {
    return (
      <div className="order-card">
        <h1 className="order-title">Confirming your gift</h1>
        <p>If you paid by mobile money, please approve the prompt on your phone. This page updates by itself.</p>
        <div className="order-spinner" aria-hidden="true" />
        {waited > 20 ? <p className="order-note">We are still waiting for confirmation. If money left your account, it is safe, and your receipt will come by email as soon as it is confirmed.</p> : null}
      </div>
    );
  }
  return (
    <div className="order-card">
      <p className="eyebrow">Receipt {gift.id}</p>
      <h1 className="order-title">{gift.name ? `Thank you, ${gift.name}.` : "Thank you."}</h1>
      <p className="order-lede">Your {gift.frequency === "monthly" ? "monthly " : ""}gift of {gift.display} has been received. A receipt is in your email.</p>
      <p className="order-note">You are now one of our ministry partners. Partners receive early access and special offers on new books and resources, beginning with Unedited Christmas.</p>
      <p style={{ marginTop: 20 }}><a className="btn btn-ghost" href="/influential-spirit/">Read The Influential Spirit</a></p>
    </div>
  );
}

/** /give/manage/?t=PARTNER_TOKEN: a partner sees their monthly gift and can stop it. */
export function GiveManage() {
  const [tok, setTok] = useState("");
  const [state, setState] = useState<{ name: string; monthly: boolean; gifts: number; since: string } | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function call(action?: "cancel", t = tok) {
    const r = await fetch("/api/give/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ t, action }) });
    return r.json().catch(() => ({ ok: false }));
  }
  useEffect(() => {
    const t = new URLSearchParams(location.search).get("t") || "";
    setTok(t);
    if (!t) { setMsg("This link is missing its code. Please use the link in your receipt email."); return; }
    call(undefined, t).then((out) => (out.ok ? setState(out) : setMsg(out.error || "This link is not valid.")));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function stop() {
    if (!confirm("Stop your monthly gift? You can start again at any time.")) return;
    setBusy(true);
    const out = await call("cancel");
    setBusy(false);
    setMsg(out.message || out.error || "Please write to hello@eryezakalalu.com.");
    if (out.ok) setState((s) => (s ? { ...s, monthly: false } : s));
  }

  return (
    <div className="order-card">
      <h1 className="order-title">{state ? `${state.name}, thank you for your partnership.` : "Your giving"}</h1>
      {state ? (
        <>
          <p className="order-lede">You have given {state.gifts} {state.gifts === 1 ? "time" : "times"} since {state.since}.</p>
          {state.monthly ? (
            <p style={{ marginTop: 18 }}><button type="button" className="btn btn-ghost" onClick={stop} disabled={busy}>{busy ? "Stopping" : "Stop my monthly gift"}</button></p>
          ) : (
            <p className="order-note">You have no monthly gift running. <a href="/give/">Give again or start a monthly gift</a>.</p>
          )}
          <p className="order-note">To change the amount, stop this gift and start a new one on the giving page, or write to <a href="mailto:hello@eryezakalalu.com">hello@eryezakalalu.com</a>.</p>
        </>
      ) : null}
      {msg ? <p className="order-note" role="status">{msg}</p> : null}
    </div>
  );
}
