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
    setDismissed(true);
  };

  if (dismissed) return null;
  return (
    <div className="cookie-banner is-visible" role="region" aria-label="Cookie preferences">
      <p className="cookie-banner__text">This site uses only essential cookies and those required by the newsletter, podcast, and payment services. No advertising cookies are used. See the <a href="/privacy">privacy page</a> for details.</p>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__btn cookie-banner__btn--decline" onClick={() => choose(false)}>Decline non-essential</button>
        <button type="button" className="cookie-banner__btn cookie-banner__btn--accept" onClick={() => choose(true)}>Accept</button>
      </div>
    </div>
  );
}
