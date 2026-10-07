"use client";

import { useEffect, useState } from "react";
import { LAUNCH_PRICE_ENDS } from "@/lib/site-content";

/**
 * "N days left" for the launch price. Rendered after mount so the static HTML
 * never carries a stale number; it sits inside <LaunchOnly>, which the page
 * already hides from 1 Nov 2026 (see price.tsx).
 */
export default function LaunchCountdown() {
  const [text, setText] = useState("");
  useEffect(() => {
    const ms = Date.parse(LAUNCH_PRICE_ENDS) - Date.now();
    if (ms <= 0) return;
    const days = Math.ceil(ms / 86_400_000);
    setText(days <= 1 ? "Last day of launch pricing." : `${days} days of launch pricing left.`);
  }, []);
  return text ? <strong className="launch-countdown">{text} </strong> : null;
}
