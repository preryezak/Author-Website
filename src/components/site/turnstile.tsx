"use client";

import { useEffect, useRef } from "react";

/** Public site key of the "Eryeza Kalalu forms" Turnstile widget (safe to ship). */
export const TURNSTILE_SITEKEY = "0x4AAAAAAFQdMrjUNJYDRNwh";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window { turnstile?: TurnstileApi; __tsLoading?: Promise<void> }
}

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (window.__tsLoading) return window.__tsLoading;
  window.__tsLoading = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { window.__tsLoading = undefined; reject(new Error("turnstile script")); };
    document.head.appendChild(s);
  });
  return window.__tsLoading;
}

/**
 * Cloudflare Turnstile (free). Renders invisibly for most visitors and shows a
 * challenge only when needed. `size: flexible` lets it fit any width from 300px
 * phones up. Tokens are single-use: bump `resetKey` after every submit attempt.
 */
export default function Turnstile({ onToken, onFail, resetKey = 0 }: { onToken: (token: string) => void; onFail?: () => void; resetKey?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const id = useRef<string | undefined>(undefined);
  const cb = useRef(onToken);
  cb.current = onToken;
  const fail = useRef(onFail);
  fail.current = onFail;

  useEffect(() => {
    let cancelled = false;
    loadScript().then(() => {
      if (cancelled || !box.current || !window.turnstile) return;
      id.current = window.turnstile.render(box.current, {
        sitekey: TURNSTILE_SITEKEY,
        size: "flexible",
        theme: "auto",
        appearance: "interaction-only",
        callback: (t: string) => cb.current(t),
        "expired-callback": () => cb.current(""),
        "error-callback": () => { cb.current(""); fail.current?.(); return true; },
      });
    }).catch(() => { cb.current(""); fail.current?.(); });
    return () => { cancelled = true; if (id.current && window.turnstile) window.turnstile.remove(id.current); id.current = undefined; };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && id.current && window.turnstile) { cb.current(""); window.turnstile.reset(id.current); }
  }, [resetKey]);

  return <div ref={box} className="turnstile-box" style={{ marginTop: 16, maxWidth: "100%" }} />;
}
