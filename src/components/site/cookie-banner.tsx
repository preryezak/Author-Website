"use client";

import { useState } from "react";

/**
 * Cookie notice on every page.
 *
 * It is in the server HTML from the first paint (it used to appear 900 ms in,
 * which made it the page's Largest Contentful Paint on short pages). A one-line
 * script in layout.tsx adds `ek-cookie-set` to <html> before paint when a
 * choice is already stored, and CSS hides the banner, so returning visitors
 * never see it flash.
 */
export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);

  const choose = (ok: boolean) => {
    try { localStorage.setItem("ek-cookie-choice", ok ? "accepted" : "declined"); } catch { /* storage blocked */ }
    document.documentElement.classList.add("ek-cookie-set");
    window.dispatchEvent(new CustomEvent("ek:cookie", { detail: ok ? "accepted" : "declined" }));
    setDismissed(true);
  };

  if (dismissed) return null;
  return (
    <div className="cookie-banner is-visible" role="region" aria-label="Cookie preferences">
      <p className="cookie-banner__text">This site uses essential cookies, those needed by the newsletter, podcast and payment services, and Meta&rsquo;s measurement pixel, which tells us which posts and adverts help readers find the book. Decline and the pixel stays off. See the <a href="/privacy">privacy page</a> for details.</p>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__btn cookie-banner__btn--decline" onClick={() => choose(false)}>Decline non-essential</button>
        <button type="button" className="cookie-banner__btn cookie-banner__btn--accept" onClick={() => choose(true)}>Accept</button>
      </div>
    </div>
  );
}
