"use client";

import { useEffect, useRef, useState } from "react";
import SpeakingInviteForm from "@/components/site/speaking-invite-form";
import { SPEAKING } from "@/lib/site-content";

/**
 * The invitation panel.
 *
 * The form is collapsed on load and only expands when the button is clicked, so
 * a long eight-section form no longer pushes the page open before the reader has
 * decided to use it. It collapses again from the control at the foot of the
 * form.
 *
 * Accessibility: the button carries `aria-expanded` and `aria-controls`, and the
 * panel is removed from the tree (`hidden`) while closed, so assistive
 * technology is never handed a form that is not on screen.
 *
 * Deep links still work: anything linking to `#invite-form` (the hero button
 * does) opens the panel, on load or on a later hash change.
 */
export default function InvitePanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#invite-form") setOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const toggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next) {
        requestAnimationFrame(() => {
          panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      return next;
    });
  };

  return (
    <div id="invite-form" style={{ scrollMarginTop: 110 }}>
      <div className="text-center">
        <button
          type="button"
          className="invite-toggle"
          aria-expanded={open}
          aria-controls="invite-form-body"
          onClick={toggle}
        >
          {open ? "Close the invitation form" : "Invite Eryeza to Speak"}
          <svg
            className="invite-toggle__chev"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div
        id="invite-form-body"
        className="invite-panel__body"
        ref={panelRef}
        hidden={!open}
        aria-hidden={!open}
      >
        <div className="invite-panel">
          <span className="eyebrow">{SPEAKING.invite.eyebrow}</span>
          <h3 className="display" style={{ fontSize: "clamp(26px, 3.2vw, 38px)", marginTop: 8, fontWeight: 400 }}>
            {SPEAKING.invite.heading}
          </h3>
          <p className="body" style={{ marginTop: 12, color: "var(--ink-500)", maxWidth: "62ch" }}>
            {SPEAKING.invite.intro}
          </p>
          <SpeakingInviteForm />
          <button type="button" className="invite-collapse" onClick={toggle}>
            Close the form
          </button>
        </div>
      </div>
    </div>
  );
}
