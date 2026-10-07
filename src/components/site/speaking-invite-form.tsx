"use client";

import { useEffect, useRef, useState } from "react";
import { SPEAKING, ENDPOINTS } from "@/lib/site-content";
import Turnstile from "@/components/site/turnstile";
import { COUNTRIES, dialFor } from "@/lib/countries";

type FieldType = "text" | "email" | "tel" | "date" | "country" | "select" | "radio" | "textarea";
interface Field {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  help?: string;
  options?: readonly string[];
  showIf?: { field: string; anyOf: readonly string[] };
}
interface Section {
  id: string;
  title: string;
  intro?: string;
  fields: readonly Field[];
}

/** Phone / WhatsApp with a country-code picker, pre-selected from the visitor's location. Stores "+<code><number>". */
function PhoneField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const id = `if-${field.key}`;
  const [iso, setIso] = useState("");
  const [digits, setDigits] = useState(() => (value.startsWith("+") ? "" : value));
  useEffect(() => {
    let live = true;
    const fromLang = () => (navigator.language.split("-")[1] || "").toUpperCase();
    fetch("/api/geo", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((g) => { if (live) setIso((cur) => cur || (g?.country && dialFor(g.country) ? g.country : dialFor(fromLang()) ? fromLang() : "")); })
      .catch(() => { if (live) setIso((cur) => cur || (dialFor(fromLang()) ? fromLang() : "")); });
    return () => { live = false; };
  }, []);
  useEffect(() => {
    const d = digits.replace(/[^0-9]/g, "").replace(/^0+/, "");
    onChange(d && iso ? `+${dialFor(iso)}${d}` : d ? d : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso, digits]);
  return (
    <div className="invite-field">
      <label className="invite-field__label" htmlFor={id}>{field.label}{field.required ? <span className="req">*</span> : null}</label>
      <div className="sg-phone">
        <select aria-label="Country code" value={iso} onChange={(e) => setIso(e.target.value)} autoComplete="tel-country-code">
          <option value="">Code</option>
          {COUNTRIES.map((c) => <option key={c.iso} value={c.iso}>{c.iso} +{c.dial} {c.name}</option>)}
        </select>
        <input id={id} name={field.key} type="tel" inputMode="tel" autoComplete="tel-national" value={digits} placeholder="700 000 000" maxLength={20} onChange={(e) => setDigits(e.target.value)} />
      </div>
      <p className="sg-note">Used only so Eryeza's team can reach you about this invitation. We will never spam you or share your number.</p>
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const id = `if-${field.key}`;
  const label = (
    <label className="invite-field__label" htmlFor={id}>
      {field.label}{field.required ? <span className="req">*</span> : null}
    </label>
  );
  if (field.type === "textarea") {
    return (
      <div className="invite-field">
        {label}
        <textarea id={id} name={field.key} value={value} placeholder={field.placeholder} required={field.required} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div className="invite-field">
        {label}
        <select id={id} name={field.key} value={value} required={field.required} defaultValue="" onChange={(e) => onChange(e.target.value)}>
          <option value="" disabled>Select one</option>
          {field.options?.map((o) => (<option key={o} value={o}>{o}</option>))}
        </select>
      </div>
    );
  }
  if (field.type === "radio") {
    return (
      <div className="invite-field">
        <span className="invite-field__label">{field.label}{field.required ? <span className="req">*</span> : null}</span>
        <div className="invite-radio">
          {field.options?.map((o) => (
            <label key={o} className="invite-radio__option">
              <input type="radio" name={field.key} value={o} checked={value === o} required={field.required} onChange={() => onChange(o)} />
              {o}
            </label>
          ))}
        </div>
      </div>
    );
  }
  if (field.type === "tel") return <PhoneField field={field} value={value} onChange={onChange} />;
  // text / email / date / country
  const inputType = field.type === "country" ? "text" : field.type;
  const autoComplete =
    field.key === "name" ? "name" :
    field.key === "email" ? "email" :
    field.key === "phone" ? "tel" :
    field.key === "country" ? "country-name" : undefined;
  return (
    <div className="invite-field">
      {label}
      <input id={id} name={field.key} type={inputType} value={value} placeholder={field.placeholder} required={field.required} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function SpeakingInviteForm() {
  const sections = SPEAKING.invite.sections as readonly Section[];
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const current = sections[step];
  const total = sections.length;
  const isLast = step === total - 1;

  const setField = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));
  const visible = (f: Field) => (f.showIf ? f.showIf.anyOf.includes(data[f.showIf.field] || "") : true);
  const stepValid = () => current.fields.filter((f) => f.required && visible(f)).every((f) => (data[f.key] || "").trim().length > 0);
  // Clicking Next with a required field empty used to do nothing at all, with no
  // explanation. Now it names what is missing so the visitor is never stuck.
  const next = () => {
    if (stepValid()) { setError(""); setStatus("idle"); setStep((s) => Math.min(total - 1, s + 1)); return; }
    const missing = current.fields
      .filter((f) => f.required && visible(f) && !(data[f.key] || "").trim())
      .map((f) => f.label);
    setError(missing.length ? `Please complete: ${missing.join(", ")}.` : "Please complete this step before continuing.");
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const hpRef = useRef<HTMLInputElement>(null);
  const [tsToken, setTsToken] = useState("");
  const [tsReset, setTsReset] = useState(0);

  // The server needs a little more than "not empty". Check everything here and jump to the step that needs fixing,
  // so a problem on an earlier step is never reported on the last one.
  const MIN: Record<string, number> = { name: 2, eventName: 2, speakAbout: 10 };
  const findProblem = (): { step: number; msg: string } | null => {
    for (let i = 0; i < sections.length; i++) {
      for (const f of sections[i].fields) {
        if (!visible(f)) continue;
        const v = (data[f.key] || "").trim();
        if (f.required && !v) return { step: i, msg: `Please complete: ${f.label}.` };
        if (MIN[f.key] && v && v.length < MIN[f.key]) return { step: i, msg: `${f.label}: please write a little more (at least ${MIN[f.key]} characters).` };
        if (f.key === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { step: i, msg: "Please check your email address, so we can reply." };
      }
    }
    return null;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const problem = findProblem();
    if (problem) { setStep(problem.step); setError(problem.msg); setStatus("error"); return; }
    if (!tsToken) { setError("One moment while the security check finishes, then send again."); setStatus("error"); return; }
    setStatus("submitting"); setError("");
    try {
      // Posts to the eryeza-speaking Worker (ENDPOINTS.speaking in site-content.ts;
      // NEXT_PUBLIC_SPEAKING_ENDPOINT overrides it at build time).
      const endpoint = ENDPOINTS.speaking;
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, website: hpRef.current?.value || "", turnstileToken: tsToken }) });
      const r = await res.json();
      if (res.ok && r.ok) setStatus("success");
      else { setError(r.error || "Something went wrong. Please try again."); setStatus("error"); }
    } catch {
      setError("Network error. Please try again."); setStatus("error");
    } finally {
      setTsReset((n) => n + 1);
    }
  };

  if (status === "success") {
    return (
      <div className="invite-success">
        <h3 className="invite-success__title">Invitation received</h3>
        <p className="invite-success__body">{SPEAKING.invite.success}</p>
      </div>
    );
  }

  return (
    <form className="speaking-form" onSubmit={submit} style={{ gap: 0 }}>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="speaking-website">Website</label>
        <input id="speaking-website" ref={hpRef} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {/* Progress */}
      <div className="invite-progress">
        <span className="invite-progress__label">Step {step + 1} of {total}</span>
        <span className="invite-progress__track"><span className="invite-progress__fill" style={{ width: `${((step + 1) / total) * 100}%` }} /></span>
      </div>

      <h3 className="invite-step__title">{current.title}</h3>
      {current.intro ? <p className="invite-step__intro">{current.intro}</p> : null}

      <div className="invite-fields">
        {current.fields.filter(visible).map((f) => (
          <FieldInput key={f.key} field={f} value={data[f.key] || ""} onChange={(v) => setField(f.key, v)} />
        ))}
        {current.fields.some((f) => f.help && visible(f)) ? null : null}
      </div>

      {error ? <div className="form-error" style={{ marginTop: 16 }}>{error}</div> : null}

      <Turnstile onToken={setTsToken} onFail={() => { setError("The security check could not run in this browser. Try another browser or turn off content blockers for this site, or write to speaking@eryezakalalu.com instead."); setStatus("error"); }} resetKey={tsReset} />
      {isLast ? <p className="invite-submit-note">{SPEAKING.invite.preSubmit}</p> : null}

      <div className="invite-nav">
        <button type="button" className="btn btn-ghost btn-sm" onClick={back} disabled={step === 0}>Back</button>
        <span className="invite-nav__hint">{stepValid() ? "" : "Complete the required fields to continue"}</span>
        {isLast ? (
          <button type="submit" className="btn btn-primary btn-sm" disabled={status === "submitting" || !stepValid()}>{status === "submitting" ? "Sending…" : SPEAKING.invite.submitCta}</button>
        ) : (
          <button type="button" className="btn btn-primary btn-sm" onClick={next} disabled={!stepValid()}>Continue</button>
        )}
      </div>
    </form>
  );
}
