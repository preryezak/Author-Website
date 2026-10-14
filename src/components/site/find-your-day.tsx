"use client";

/**
 * "Find your day": the visitor writes what they are facing and sees the day of
 * the book written for it (matched by Workers AI embeddings on the server; every
 * word shown is the book's own). One box, no account, nothing stored.
 */

import { useState } from "react";
import { BuyButton } from "@/components/site/checkout";
import { track } from "@/lib/pixel";

interface Pick { day: number; title: string; ref: string; question: string }

const SAMPLES: Record<number, string> = {
  25: "/audio/day-25-past-the-wall-sample.mp3",
};

const EXAMPLES = ["I am exhausted and want to quit", "Someone at work took the credit", "Why is God taking so long?", "I feel empty in private"];

export default function FindYourDay() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [picks, setPicks] = useState<Pick[] | null>(null);
  const [crisis, setCrisis] = useState(false);
  const [err, setErr] = useState("");

  async function ask(text: string) {
    if (text.trim().length < 3) return;
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/find-day", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: text }) });
      const out = await r.json().catch(() => ({ ok: false }));
      if (!out.ok) { setErr(out.error || "Please try again."); setPicks(null); }
      else { setPicks(out.days); setCrisis(Boolean(out.crisis)); track("Search", { search_string: "find-your-day" }); }
    } catch { setErr("Please check your connection and try again."); }
    setBusy(false);
  }

  return (
    <section className="section surface-100" id="find-your-day">
      <div className="container">
        <div className="fyd mx-auto">
          <span className="eyebrow">Find your day</span>
          <h2 className="fyd-h">What are you facing right now?</h2>
          <p className="fyd-p">Write it in a few words. We will show you the day of the book written for it.</p>
          <form className="fyd-form" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
            <label className="sr-only" htmlFor="fyd-q">What are you facing?</label>
            <input id="fyd-q" value={q} onChange={(e) => setQ(e.target.value)} maxLength={300} placeholder="For example: I am tired of ministry" autoComplete="off" />
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Finding" : "Find my day"}</button>
          </form>
          <div className="fyd-examples" aria-label="Examples">
            {EXAMPLES.map((x) => <button key={x} type="button" onClick={() => { setQ(x); ask(x); }}>{x}</button>)}
          </div>
          {err ? <p className="order-note" role="alert">{err}</p> : null}
          {crisis ? (
            <p className="fyd-care" role="note">
              If you are thinking of ending your life or are in danger, please speak today to someone you trust nearby, your pastor, or a local emergency number. You matter to God and to the people around you.
            </p>
          ) : null}
          {picks ? (
            <div className="fyd-results" aria-live="polite">
              {picks.map((d) => (
                <article key={d.day} className="fyd-card">
                  <p className="fyd-day">Day {d.day} · {d.ref}</p>
                  <h3 className="fyd-title">{d.title}</h3>
                  <p className="fyd-q">&ldquo;{d.question}&rdquo;</p>
                  {SAMPLES[d.day] ? <audio controls preload="none" src={SAMPLES[d.day]} aria-label={`Listen to part of Day ${d.day}`} /> : null}
                </article>
              ))}
              <div className="flex-wrap-gap gap-4" style={{ marginTop: 6 }}>
                <BuyButton edition="formation" className="btn btn-primary">Get the book and read it tomorrow</BuyButton>
                <a className="btn btn-ghost" href="#day-one">Read Day 1 free</a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
