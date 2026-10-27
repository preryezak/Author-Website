"use client";

import { useEffect, useState } from "react";
import { LAUNCH_PRICE_ENDS } from "@/lib/site-content";

/**
 * Live "days, hours and minutes" left at the launch price. Rendered after mount so the
 * static HTML never carries a stale number; updates every 30 s (no seconds, so it stays
 * light); it sits inside <LaunchOnly>, which the page hides from 1 Nov 2026 (see price.tsx).
 */
function left(): string {
  const ms = Date.parse(LAUNCH_PRICE_ENDS) - Date.now();
  if (ms <= 0) return "";
  const m = Math.floor(ms / 60_000);
  const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), min = m % 60;
  const part = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const bits = d > 0 ? [part(d, "day"), part(h, "hour"), part(min, "minute")] : [part(h, "hour"), part(min, "minute")];
  return `Launch pricing ends in ${bits.slice(0, -1).join(", ")} and ${bits[bits.length - 1]}.`;
}

export default function LaunchCountdown() {
  const [text, setText] = useState("");
  useEffect(() => {
    setText(left());
    const t = window.setInterval(() => setText(left()), 30_000);
    return () => window.clearInterval(t);
  }, []);
  return text ? <strong className="launch-countdown" style={{ fontVariantNumeric: "tabular-nums" }}>{text} </strong> : null;
}
