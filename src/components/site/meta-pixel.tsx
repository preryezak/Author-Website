"use client";

/**
 * Loads the Meta Pixel after the page is interactive, never before content.
 *
 * Consent: a visitor who chose "Decline non-essential" never loads it. In Europe
 * and the UK (where consent must come first) it loads only after "Accept".
 * Elsewhere it loads unless declined. The cookie banner explains this.
 */

import { useEffect } from "react";
import { META_PIXEL_ID, source } from "@/lib/pixel";

declare global { interface Window { fbq?: (...a: unknown[]) => void; _fbq?: unknown } }

function load(id: string) {
  if (window.fbq) return;
  // Private pages: the partner page never loads the Pixel, and no page loads it while a token is in the address.
  if (location.pathname.startsWith("/give/manage") || /[?&]t=/.test(location.search)) return;
  /* Meta's standard base code, unrolled. */
  const q: unknown[] = [];
  const f = function (...args: unknown[]) {
    const self = f as unknown as { callMethod?: (...a: unknown[]) => void };
    if (self.callMethod) self.callMethod(...args); else q.push(args);
  } as unknown as Window["fbq"] & { queue: unknown[]; loaded: boolean; version: string; push: unknown };
  f.queue = q; f.loaded = true; f.version = "2.0"; f.push = f;
  window.fbq = f; window._fbq = f;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq!("init", id);
  window.fbq!("track", "PageView");
  if (/^\/influential-spirit|^\/desk|^\/signs|^\/hear/.test(location.pathname)) {
    window.fbq!("track", "ViewContent", { content_ids: ["influential-spirit"], content_type: "product" });
  }
}

export default function MetaPixel() {
  useEffect(() => {
    source(); // remember utm_* from the landing URL for the order record
    if (!META_PIXEL_ID) return;
    let choice: string | null = null;
    try { choice = localStorage.getItem("ek-cookie-choice"); } catch { /* blocked */ }
    if (choice === "declined") return;
    const start = () => {
      if (choice === "accepted") { load(META_PIXEL_ID); return; }
      fetch("/api/geo", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((g: { continent?: string } | null) => { if (g && g.continent !== "EU") load(META_PIXEL_ID); })
        .catch(() => {});
    };
    const onChoice = (e: Event) => { if ((e as CustomEvent<string>).detail === "accepted") load(META_PIXEL_ID); };
    window.addEventListener("ek:cookie", onChoice);
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
    if (idle) idle(start); else setTimeout(start, 1500);
    return () => window.removeEventListener("ek:cookie", onChoice);
  }, []);
  return null;
}
