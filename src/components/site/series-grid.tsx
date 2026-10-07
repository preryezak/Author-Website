"use client";

/** The eight Sundays: which guides are open, which open next. Re-checked in the browser so it is right on the day. */
import { useEffect, useState } from "react";
import { CURRENT_THEME, airsAt } from "@/lib/site-content";

const fmt = (sunday: string) =>
  new Date(`${sunday}T12:00:00+03:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Africa/Kampala" });

export default function SeriesGrid({ buildTime }: { buildTime: number }) {
  const [now, setNow] = useState(buildTime);
  useEffect(() => { setNow(Date.now()); }, []);
  return (
    <ol className="series-grid">
      {CURRENT_THEME.episodes.map((e) => {
        const open = airsAt(e) <= now;
        return (
          <li key={e.n} className={open ? "is-open" : ""}>
            <span className="series-grid__n" aria-hidden="true">{e.n}</span>
            <div>
              <h3 className="series-grid__title">{e.title}</h3>
              <p className="series-grid__when">{open ? "Open now" : `Opens ${fmt(e.sunday)}, 8 PM EAT`}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
