"use client";

/**
 * "Hear it": the sample film (real audiobook clips with the words in time with the voice) and three listen-only
 * tracks. One shared audio element, so starting a track stops the previous one. Works from 320px up.
 */
import { useEffect, useRef, useState } from "react";

type Track = { id: string; title: string; sub: string; src: string; length: string };

const TRACKS: Track[] = [
  { id: "day25", title: "Day 25: Past the Wall", sub: "From Part III, The Crucible. Read by the author.", src: "/audio/day-25-past-the-wall-sample.mp3", length: "2:05" },
  { id: "part3", title: "Part III: The Crucible", sub: "Tested in the fire. Days 16 to 20.", src: "/audio/part-3-the-crucible-sample.mp3", length: "0:36" },
  { id: "decl", title: "Declarations and Prayers", sub: "The audio companion. Thirty declarations, thirty prayers.", src: "/audio/declarations-and-prayers-sample.mp3", length: "0:24" },
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function AudioSamples() {
  const ref = useRef<HTMLAudioElement>(null);
  const [cur, setCur] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setT(a.currentTime);
    const onMeta = () => setDur(a.duration || 0);
    const onEnd = () => { setPlaying(false); setT(0); };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("pause", () => setPlaying(false));
    a.addEventListener("play", () => setPlaying(true));
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("loadedmetadata", onMeta); a.removeEventListener("ended", onEnd); };
  }, []);

  const toggle = (tr: Track) => {
    const a = ref.current;
    if (!a) return;
    if (cur === tr.id) { if (a.paused) a.play().catch(() => {}); else a.pause(); return; }
    setCur(tr.id); setT(0); setDur(0);
    a.src = tr.src; a.load(); a.play().catch(() => {});
  };
  const seek = (v: number) => { const a = ref.current; if (a && dur) { a.currentTime = v; setT(v); } };

  return (
    <div className="hear">
      <audio ref={ref} preload="none" />
      <ul className="hear__list">
        {TRACKS.map((tr) => {
          const on = cur === tr.id;
          return (
            <li key={tr.id} className={on ? "is-on" : ""}>
              <button type="button" className="hear__btn" onClick={() => toggle(tr)} aria-label={`${on && playing ? "Pause" : "Play"}: ${tr.title}`} aria-pressed={on && playing}>
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  {on && playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /> : <path d="M8 5.5v13l11-6.5z" fill="currentColor" />}
                </svg>
              </button>
              <div className="hear__text">
                <div className="hear__title">{tr.title}</div>
                <div className="hear__sub">{tr.sub}</div>
                {on ? (
                  <div className="hear__bar">
                    <input type="range" min={0} max={dur || 1} step={0.1} value={t} onChange={(e) => seek(Number(e.target.value))} aria-label={`Seek in ${tr.title}`} />
                    <span>{fmt(t)} / {dur ? fmt(dur) : tr.length}</span>
                  </div>
                ) : null}
              </div>
              {!on ? <span className="hear__len">{tr.length}</span> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
