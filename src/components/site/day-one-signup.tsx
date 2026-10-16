"use client";

/** Under Day 1: get it as a PDF by email, with a few short letters from Eryeza. */

import { useEffect, useState } from "react";
import { LEADS_LIVE } from "@/lib/editions";
import { metaIds, source, track } from "@/lib/pixel";

export default function DayOneSignup({ heading = "Keep Day 1 with you" }: { heading?: string }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [letter, setLetter] = useState(true);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(LEADS_LIVE || /(?:^|; )ek_t=1(?:;|$)/.test(document.cookie)), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, letterOptIn: letter, website: (e.currentTarget as HTMLFormElement).website?.value || "", ...metaIds(), source: source() }),
      });
      const out = await r.json().catch(() => ({ ok: false }));
      if (!out.ok) { setState("error"); setMsg(out.error || "Please try again."); return; }
      track("Lead", { content_name: "day1" }, out.eventId || undefined);
      setState("done");
    } catch {
      setState("error");
      setMsg("Please check your connection and try again.");
    }
  }

  if (!enabled) return null;
  if (state === "done") {
    return (
      <div className="d1-signup is-done" role="status">
        <p className="d1-h">Day 1 is on its way to {email}.</p>
        <p className="d1-p">If you do not see it in a few minutes, check your spam or promotions folder.</p>
      </div>
    );
  }
  return (
    <form className="d1-signup" onSubmit={submit}>
      <p className="d1-h">{heading}</p>
      <p className="d1-p">Get Day 1 as a PDF in your inbox, with a few short letters from Eryeza over the next two weeks. Free.</p>
      <div className="d1-row">
        <label className="co-field"><span>First name</span><input autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={60} /></label>
        <label className="co-field"><span>Email</span><input required type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} /></label>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <label className="co-check">
        <input type="checkbox" checked={letter} onChange={(e) => setLetter(e.target.checked)} />
        <span>Also send me Eryeza&rsquo;s letter (new books and resources).</span>
      </label>
      {state === "error" ? <p className="co-error" role="alert">{msg}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={state === "busy"}>{state === "busy" ? "Sending" : "Send me Day 1"}</button>
    </form>
  );
}
