"use client";

/**
 * Podcast episode list with in-page audio. The feed is read at build time
 * (src/lib/rss.ts); this island only handles "All N episodes" in place.
 * Used on the home page and on /podcast/, so both lists behave the same.
 */
import { useState } from "react";
import type { EpisodeItem } from "@/lib/rss";
import { fmtDate } from "@/components/site/ui-bits";

const EPISODE_PREVIEW = 3;

export default function EpisodeList({ episodes, listId = "podcast-episodes", labelAs = "span" }: { episodes: EpisodeItem[]; listId?: string; /** "h2" where the list sits directly under the page h1. */ labelAs?: "span" | "h2" }) {
  const [open, setOpen] = useState(false);
  const H = "h3";
  const Label = labelAs;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <Label className="eyebrow" style={{ color: "var(--gold-100)" }}>Recent episodes</Label>
        {episodes.length > EPISODE_PREVIEW ? (
          <button type="button" className="episode-more" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((v) => !v)}>
            {open ? "Show fewer" : `All ${episodes.length} episodes`}
          </button>
        ) : null}
      </div>
      <ul id={listId} className="episode-list">
        {episodes.length === 0 ? (
          <li>
            <div>
              <div className="meta">Devotion In Season</div>
              <H className="title">The episode list is unavailable right now. Please check back shortly.</H>
            </div>
          </li>
        ) : (
          (open ? episodes : episodes.slice(0, EPISODE_PREVIEW)).map((it, i) => (
            <li key={i}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="meta">{fmtDate(it.pubDate) || "Episode"}</div>
                <H className="title">{it.title}</H>
                {it.audioUrl ? (
                  <audio className="episode-audio" controls preload="none" src={it.audioUrl} style={{ colorScheme: "dark" }} aria-label={`Play: ${it.title}`}>
                    Your browser does not support the audio element.
                  </audio>
                ) : null}
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
