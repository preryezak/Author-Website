/**
 * Site event tracking.
 *
 * One small, dependency-free layer so the Giving button (and anything added
 * later) records a click wherever the site can. It writes to three places, in
 * order of reliability:
 *
 *   1. `window.dataLayer` - the conventional hand-off point for any tag manager
 *      added later. Costs nothing when no tag manager is present.
 *   2. A DOM CustomEvent `ek:event` - lets any listener in the page react.
 *   3. The site logging store, via NEXT_PUBLIC_EVENTS_ENDPOINT - best effort,
 *      never blocking navigation. This is the store queried for reconciliation
 *      against the Flutterwave donation dashboard.
 *
 * No personal data is sent: no email, no name, no card details, no cookies.
 * Only the event name, the surface it came from, the page path, the campaign
 * label, a timestamp and a random event id.
 *
 * Duplicate-click guard: repeats of the same event from the same source inside
 * DEDUP_MS are dropped, so a double tap cannot create two records.
 */

import { ENDPOINTS } from "@/lib/site-content";

export type SiteEventPayload = {
  event: string;
  source: string;
  page: string;
  campaign: string;
  ts: string;
  id: string;
};

/** Kept in sync with `site_events.event` in the logging Worker (D1). */
export type SiteEventName = "give_click";

// Default lives in site-content ENDPOINTS so the build never depends on the shell.
const ENDPOINT = ENDPOINTS.events;

/** Rapid repeats of the same event/source inside this window are ignored. */
const DEDUP_MS = 1500;

const lastFired = new Map<string, number>();

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function makeId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* fall through to the simple id below */
  }
  return `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function trackEvent(input: {
  event: SiteEventName | string;
  source: string;
  campaign?: string;
}): boolean {
  if (typeof window === "undefined") return false;

  const key = `${input.event}:${input.source}`;
  const now = Date.now();
  const previous = lastFired.get(key);
  if (previous !== undefined && now - previous < DEDUP_MS) {
    return false; // duplicate: a double click, not a second intention
  }
  lastFired.set(key, now);

  const payload: SiteEventPayload = {
    event: input.event,
    source: input.source,
    page: window.location.pathname || "/",
    campaign: input.campaign ?? "",
    ts: new Date().toISOString(),
    id: makeId(),
  };

  // 1. Tag-manager hand-off.
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ...payload });
  } catch {
    /* never let tracking break the page */
  }

  // 2. In-page event.
  try {
    window.dispatchEvent(new CustomEvent("ek:event", { detail: payload }));
  } catch {
    /* ignore */
  }

  // 3. Logging store. sendBeacon survives the navigation that follows a click.
  if (ENDPOINT) {
    try {
      const body = JSON.stringify(payload);
      // text/plain is a CORS-safelisted type, so the beacon needs no preflight.
      // sendBeacon cannot follow a preflight response reliably, so this matters.
      const sent =
        typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function"
          ? navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain;charset=UTF-8" }))
          : false;
      if (!sent) {
        void fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
          mode: "cors",
        }).catch(() => undefined);
      }
    } catch {
      /* best effort only */
    }
  }

  return true;
}

/** True when a logging endpoint is configured. Used by the handoff notes. */
export const TRACKING_ENDPOINT_CONFIGURED = ENDPOINT.length > 0;
