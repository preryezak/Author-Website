"use client";

import { useCallback, useRef, useState } from "react";
import { GIVING } from "@/lib/site-content";
import { trackEvent } from "@/lib/track";

/**
 * The Giving button.
 *
 * Links out to the hosted Flutterwave donation page. There is no checkout in
 * this application and no payment code: the button is an ordinary external link
 * with the correct rel attributes, plus a click record.
 *
 * Two behaviours worth knowing:
 *
 * - If GIVING.url is empty (see NEXT_PUBLIC_GIVING_URL), the button is not
 *   rendered as a link at all. For a primary button we render a disabled
 *   control with a plain explanation instead of sending anyone to a broken
 *   destination; for an inline link we render nothing.
 * - A second click inside the same moment does not create a second record
 *   (guarded here, and again in trackEvent).
 */

type Variant = "link" | "button" | "footer" | "inline";

export default function GiveButton({
  source,
  variant = "link",
  className,
  label,
}: {
  /** Where this instance lives: "masthead", "nav", "footer", "give-page". */
  source: string;
  variant?: Variant;
  className?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const url = GIVING.url.trim();
  const text = label ?? GIVING.label;

  const handleClick = useCallback(() => {
    if (busy) return;
    setBusy(true);
    trackEvent({ event: "give_click", source, campaign: GIVING.campaign });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBusy(false), 1200);
  }, [busy, source]);

  // Graceful degradation when the destination is not configured.
  if (!url) {
    if (variant === "link" || variant === "inline" || variant === "footer") return null;
    return (
      <span
        className={className ?? "btn btn-gold"}
        role="link"
        aria-disabled="true"
        style={{ opacity: 0.6, cursor: "not-allowed" }}
      >
        {text} unavailable
      </span>
    );
  }

  const shortLabel = url.replace(/^https?:\/\//, "").slice(0, 40);

  if (variant === "button") {
    return (
      <a
        className={className ?? "btn btn-gold btn-sm"}
        href={url}
        target="_blank"
        rel="noopener noreferrer external"
        onClick={handleClick}
        aria-busy={busy || undefined}
        aria-label={`${text}. Opens the secure giving page at ${shortLabel} in a new tab.`}
        data-give-source={source}
      >
        {text}
      </a>
    );
  }

  if (variant === "footer") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer external"
        onClick={handleClick}
        aria-busy={busy || undefined}
        aria-label={`${text}. Opens the secure giving page in a new tab.`}
        data-give-source={source}
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 14,
          color: "var(--paper-100)",
          textDecoration: "none",
        }}
      >
        {text}
      </a>
    );
  }

  // "link" and "inline": the nav is styled by the existing masthead CSS.
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer external"
      onClick={handleClick}
      aria-busy={busy || undefined}
      aria-label={`${text}. Opens the secure giving page in a new tab.`}
      data-give-source={source}
      className={className}
    >
      {text}
    </a>
  );
}
