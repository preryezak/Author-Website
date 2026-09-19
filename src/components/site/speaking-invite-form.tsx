"use client";

import { useState } from "react";
import { SPEAKING } from "@/lib/site-content";

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
  // text / email / tel / date / country
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
  const next = () => { if (stepValid()) setStep((s) => Math.min(total - 1, s + 1)); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting"); setError("");
    try {
      // In production on Cloudflare Pages, this posts to the Cloudflare Worker (NEXT_PUBLIC_SPEAKING_ENDPOINT).
      // In the sandbox, it falls back to the local /api/speaking route.
      const endpoint = process.env.NEXT_PUBLIC_SPEAKING_ENDPOINT || "/api/speaking";
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const r = await res.json();
      if (res.ok && r.ok) setStatus("success");
      else { setError(r.error || "Something went wrong. Please try again."); setStatus("error"); }
    } catch {
      setError("Network error. Please try again."); setStatus("error");
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
