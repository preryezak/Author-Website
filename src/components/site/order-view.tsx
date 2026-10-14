"use client";

/**
 * The buyer's own page: /order/?t=TOKEN (the link is also in their receipt email).
 *
 * While the payment is being confirmed (mobile money can take a minute) it keeps
 * asking our server, which asks Flutterwave. Once paid it shows every file, an
 * audio player that remembers where the listener stopped, and help options.
 */

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/pixel";

interface Chapter { name: string; title: string; url: string; size: number }
interface AudioColl { id: string; label: string; chapters: Chapter[]; zipUrl: string }
interface OrderData {
  id: string; status: string; edition: string; editionName: string; amount: number; currency: string; display: string;
  name: string; email: string; paidAt: string | null; refundable: boolean;
  files?: { id: string; label: string; type: string; url: string }[];
  audio?: AudioColl[];
}

const mb = (n: number) => `${(n / 1048576).toFixed(n > 10485760 ? 0 : 1)} MB`;

export default function OrderView() {
  const [tok, setTok] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [err, setErr] = useState("");
  const [waited, setWaited] = useState(0);
  const purchaseSent = useRef(false);

  useEffect(() => {
    // The token is a key to this order: keep it in this tab only and remove it from the address bar
    // (so it is not shared with analytics or in a screenshot of the URL).
    let t = new URLSearchParams(location.search).get("t") || "";
    try {
      if (t) { sessionStorage.setItem("ek-order", t); history.replaceState(null, "", location.pathname); }
      else t = sessionStorage.getItem("ek-order") || "";
    } catch { /* storage blocked */ }
    setTok(t);
    if (!t) { setErr("missing"); return; }
    let stop = false;
    let n = 0;
    const load = async () => {
      try {
        const r = await fetch(`/api/order?t=${encodeURIComponent(t)}`, { cache: "no-store" });
        const out = await r.json();
        if (stop) return;
        if (!out.ok) { setErr(out.error || "notfound"); return; }
        setOrder(out.order);
        if (out.order.status === "pending" && n < 60) { n++; setWaited(n); setTimeout(load, n < 20 ? 3000 : 10000); }
      } catch {
        if (!stop && n < 60) { n++; setTimeout(load, 5000); }
      }
    };
    load();
    return () => { stop = true; };
  }, []);

  useEffect(() => {
    if (!order || order.status !== "paid" || purchaseSent.current) return;
    purchaseSent.current = true;
    const key = `ek-px-${order.id}`;
    try { if (localStorage.getItem(key)) return; localStorage.setItem(key, "1"); } catch { /* ignore */ }
    track("Purchase", { value: order.amount, currency: order.currency, content_ids: [order.edition], content_type: "product" }, order.id);
  }, [order]);

  if (err) return <Missing reason={err} />;
  if (!order) return <p className="order-wait">Opening your order.</p>;

  if (order.status === "pending") {
    return (
      <div className="order-card">
        <h1 className="order-title">Confirming your payment</h1>
        <p>If you paid by mobile money, please approve the prompt on your phone. This page updates by itself.</p>
        <div className="order-spinner" aria-hidden="true" />
        {waited > 20 ? (
          <p className="order-note">We are still waiting for confirmation. If money left your account, it is safe: we check again every half hour and email your books as soon as the payment is confirmed. You can also write to <a href="mailto:books@eryezakalalu.com">books@eryezakalalu.com</a> with order {order.id}.</p>
        ) : null}
        {waited > 20 ? <p><a className="btn btn-ghost" href="/influential-spirit/#editions">Try paying again</a></p> : null}
      </div>
    );
  }

  if (order.status === "refunded" || order.status === "refund_manual") {
    return <div className="order-card"><h1 className="order-title">This order was refunded</h1><p>The download links are closed. Thank you for reading.</p></div>;
  }

  return (
    <div className="order-wrap">
      <header className="order-head">
        <p className="eyebrow">Order {order.id}</p>
        <h1 className="order-title">{order.name ? `${order.name}, your books are ready.` : "Your books are ready."}</h1>
        <p className="order-lede">{order.editionName}. A copy of this page is in your email at {order.email}. Begin with Start Here, then read Day 1 tomorrow morning.</p>
      </header>

      <section className="order-section" aria-labelledby="files-h">
        <h2 id="files-h">Read</h2>
        <ul className="order-files">
          {order.files?.map((f) => (
            <li key={f.id}>
              <a className="order-file" href={f.url} download>
                <span className="order-file-type">{f.type.toUpperCase()}</span>
                <span className="order-file-name">{f.label}</span>
                <span className="order-file-go" aria-hidden="true">Download</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="order-note">Your PDFs carry your name and email as your personal copy. The EPUB opens in Apple Books, Google Play Books and most e-readers.</p>
      </section>

      {order.audio?.map((c) => <AudioPlayer key={c.id} coll={c} orderId={order.id} />)}

      <Help order={order} token={tok} />
    </div>
  );
}

function AudioPlayer({ coll, orderId }: { coll: AudioColl; orderId: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const key = `ek-pos-${orderId}-${coll.id}`;
  const [i, setI] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(key) || "null") as { i: number; t: number } | null;
      if (s && s.i < coll.chapters.length) { setI(s.i); setTimeout(() => { if (ref.current) ref.current.currentTime = s.t; }, 300); }
    } catch { /* ignore */ }
  }, [key, coll.chapters.length]);

  useEffect(() => { if (ref.current) ref.current.playbackRate = rate; }, [rate, i]);

  if (!coll.chapters.length) return null;
  const ch = coll.chapters[i];
  const total = coll.chapters.reduce((a, c) => a + c.size, 0);

  return (
    <section className="order-section" aria-label={coll.label}>
      <h2>Listen: {coll.label}</h2>
      <div className="order-player">
        <p className="order-now"><span className="eyebrow">Now playing</span> {ch.title}</p>
        <audio
          ref={ref}
          controls
          preload="none"
          src={ch.url}
          onTimeUpdate={(e) => { try { localStorage.setItem(key, JSON.stringify({ i, t: Math.floor(e.currentTarget.currentTime) })); } catch { /* ignore */ } }}
          onEnded={() => { if (i + 1 < coll.chapters.length) { setI(i + 1); setTimeout(() => ref.current?.play().catch(() => {}), 100); } }}
        />
        <div className="order-player-row">
          <button type="button" className="btn btn-ghost btn-sm" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</button>
          <button type="button" className="btn btn-ghost btn-sm" disabled={i + 1 >= coll.chapters.length} onClick={() => setI(i + 1)}>Next</button>
          <label className="order-rate">Speed
            <select value={rate} onChange={(e) => setRate(Number(e.target.value))}>
              {[0.8, 1, 1.15, 1.25, 1.5].map((r) => <option key={r} value={r}>{r}x</option>)}
            </select>
          </label>
        </div>
      </div>
      <details className="order-chapters">
        <summary>All {coll.chapters.length} chapters</summary>
        <ol>
          {coll.chapters.map((c, n) => (
            <li key={c.name} className={n === i ? "is-on" : ""}>
              <button type="button" onClick={() => { setI(n); setTimeout(() => ref.current?.play().catch(() => {}), 100); }}>{c.title}</button>
              <a href={c.url} download aria-label={`Download ${c.title}`}>{mb(c.size)}</a>
            </li>
          ))}
        </ol>
      </details>
      <p className="order-note">Streaming uses about 4 MB a day of the book. To listen offline, <a href={coll.zipUrl}>download everything at once</a> (about {mb(total)}), best on Wi-Fi.</p>
    </section>
  );
}

function Help({ order, token }: { order: OrderData; token: string }) {
  const [msg, setMsg] = useState("");
  const [showRefund, setShowRefund] = useState(false);
  const [reason, setReason] = useState("");
  async function refund(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/order/refund", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ t: token, reason }) });
    const out = await r.json().catch(() => ({}));
    setMsg(out.message || out.error || "Please write to books@eryezakalalu.com.");
    setShowRefund(false);
  }
  return (
    <section className="order-section order-help" aria-labelledby="help-h">
      <h2 id="help-h">Help</h2>
      <p>Lost this page later? Use the link in your email, or ask for it again at <a href="/order/">eryezakalalu.com/order</a>. Questions: <a href="mailto:books@eryezakalalu.com">books@eryezakalalu.com</a>.</p>
      {order.status === "refund_requested" ? <p className="order-note">Your refund request is with us. You will hear from us within two working days.</p> : null}
      {order.refundable && !showRefund ? <p><button type="button" className="linkish" onClick={() => setShowRefund(true)}>Ask for a refund</button></p> : null}
      {showRefund ? (
        <form onSubmit={refund} className="order-refund">
          <label className="co-field"><span>What did not help? (optional, it helps us improve)</span>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} rows={3} />
          </label>
          <button className="btn btn-ghost" type="submit">Send refund request</button>
        </form>
      ) : null}
      {msg ? <p className="order-note" role="status">{msg}</p> : null}
    </section>
  );
}

function Missing({ reason }: { reason: string }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  async function send(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/order/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const out = await r.json().catch(() => ({}));
    setMsg(out.message || out.error || "Please try again.");
  }
  return (
    <div className="order-card">
      <h1 className="order-title">{reason === "missing" ? "Find your books" : "We could not open this order"}</h1>
      <p>Enter the email you used when you paid and we will send your order link again.</p>
      <form onSubmit={send} className="order-resend">
        <label className="co-field"><span>Email</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <button className="btn btn-primary" type="submit">Send my link</button>
      </form>
      {msg ? <p className="order-note" role="status">{msg}</p> : null}
    </div>
  );
}
