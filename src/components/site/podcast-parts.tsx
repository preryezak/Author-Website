"use client";

/**
 * Client pieces of /podcast/:
 *  - YouTubeFacade: a poster + play button that swaps in the
 *    youtube-nocookie.com iframe only when pressed, so the ~1 MB YouTube
 *    player never loads for visitors who do not watch (keeps Lighthouse
 *    performance up). No library.
 *  - SeriesRun: the current theme's episodes. Which have aired (and so get a
 *    study-guide link) is re-checked in the browser, so it advances on each
 *    Sunday without a rebuild.
 */

import { useEffect, useState } from "react";
import { CURRENT_THEME, airsAt } from "@/lib/site-content";

export function YouTubeFacade({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="yt-facade">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" className="yt-facade__btn" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`} alt="" width={480} height={360} loading="lazy" decoding="async" />
          <span className="yt-facade__play" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}

function fmtSunday(sunday: string) {
  const d = new Date(`${sunday}T12:00:00+03:00`);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Kampala" });
}

/** `guides`: episode numbers whose guide PDF exists (checked at build time by the page). */
export function SeriesRun({ buildTime, guides }: { buildTime: number; guides: number[] }) {
  const [now, setNow] = useState(buildTime);
  useEffect(() => { setNow(Date.now()); }, []);
  return (
    <ol className="series-run">
      {CURRENT_THEME.episodes.map((ep) => {
        const aired = airsAt(ep) <= now;
        const guide = aired && guides.includes(ep.n);
        return (
          <li key={ep.n} className={aired ? "is-aired" : undefined}>
            <span className="series-run__num" aria-hidden="true">{ep.n}</span>
            <div style={{ minWidth: 0 }}>
              <div className="series-run__meta">Episode {ep.n} · <time dateTime={ep.sunday}>{fmtSunday(ep.sunday)}</time></div>
              <h3 className="series-run__title">{ep.title}</h3>
              {ep.line ? <p className="series-run__theme">{ep.line}</p> : null}
              {guide ? <a className="series-run__guide" href="/resources/">Study guide for episode {ep.n}</a> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
