/**
 * Meta Pixel helpers. The Pixel is loaded by <MetaPixel/> (layout) only when
 * META_PIXEL_ID is set and, for visitors in Europe and the UK, only after they
 * accept cookies. Every call here is a no-op when the Pixel is not loaded.
 *
 * Purchases happen on Selar, which sends Purchase to Meta itself (Selar >
 * Integrations > Facebook Pixel + Conversions API, same Pixel id).
 */

/** Public Pixel id (not a secret). Empty = Pixel off everywhere. */
export const META_PIXEL_ID = "28698939883079618";

type Fbq = (...args: unknown[]) => void;

export function track(event: string, params: Record<string, unknown> = {}, eventID?: string): void {
  try {
    const fbq = (window as unknown as { fbq?: Fbq }).fbq;
    if (!fbq) return;
    if (eventID) fbq("track", event, params, { eventID });
    else fbq("track", event, params);
  } catch { /* tracking must never break the page */ }
}

function cookie(name: string): string {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

/** _fbp and _fbc, passed to the server so the Conversions API event matches the browser. */
export function metaIds(): { fbp: string; fbc: string } {
  try {
    let fbc = cookie("_fbc");
    const click = new URLSearchParams(location.search).get("fbclid");
    if (!fbc && click) fbc = `fb.1.${Date.now()}.${click}`;
    return { fbp: cookie("_fbp"), fbc };
  } catch {
    return { fbp: "", fbc: "" };
  }
}

/** utm_* and the landing path, remembered for the session so the order records which ad sold it. */
export function source(): string {
  try {
    const key = "ek-src";
    const q = new URLSearchParams(location.search);
    const utm = ["utm_source", "utm_campaign", "utm_content"].map((k) => q.get(k)).filter(Boolean).join("/");
    if (utm) sessionStorage.setItem(key, `${utm} @${location.pathname}`);
    return sessionStorage.getItem(key) || `direct @${location.pathname}`;
  } catch {
    return "";
  }
}
