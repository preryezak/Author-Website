/**
 * Small presentational pieces shared by the home page and the route pages.
 *
 * No "use client": these render on the server and ship no JavaScript, which is
 * what keeps the pages fast. Interactive pieces live in their own client files
 * (episode-list.tsx, home-islands.tsx, books-editions-tiers.tsx, ...).
 */
import type { SVGProps } from "react";
import { PODCAST } from "@/lib/site-content";

export function OrnamentRule({ children }: { children?: React.ReactNode }) {
  return (<div className="ornament-rule" aria-hidden="true"><span>{children ?? "§"}</span></div>);
}

export function ArrowRight() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--gold-200)" }} aria-hidden="true"><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>);
}

export function fmtDate(iso: string) {
  try { const d = new Date(iso); if (isNaN(d.getTime())) return ""; return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); } catch { return ""; }
}

/** Render **bold** and *italic* markers from the content file. */
export function renderRich(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  text.split("**").forEach((bp, bi) => {
    if (bi % 2 === 1) { out.push(<strong key={`b${bi}`}>{bp}</strong>); return; }
    bp.split("*").forEach((ip, ii) => {
      if (ii % 2 === 1) out.push(<em key={`i${bi}-${ii}`}>{ip}</em>);
      else if (ip) out.push(<span key={`t${bi}-${ii}`}>{ip}</span>);
    });
  });
  return out;
}

export function PlatformIcon({ name }: { name: string }) {
  const c: SVGProps<SVGSVGElement> = { viewBox: "0 0 24 24", "aria-hidden": true };
  switch (name) {
    case "Spotify": return (<svg {...c} fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.65 14.52a.62.62 0 0 1-.86.21c-2.36-1.44-5.32-1.77-8.82-1a.62.62 0 1 1-.28-1.22c3.82-.87 7.09-.49 9.71 1.11a.62.62 0 0 1 .25.9Zm1.24-2.77a.78.78 0 0 1-1.07.26c-2.7-1.66-6.82-2.14-10.02-1.17a.78.78 0 1 1-.45-1.5c3.65-1.1 8.19-.57 11.25 1.34a.78.78 0 0 1 .29 1.07Zm.11-2.88c-3.24-1.93-8.6-2.11-11.7-1.17a.94.94 0 1 1-.55-1.8c3.55-1.08 9.47-.87 13.19 1.34a.94.94 0 0 1-.94 1.63Z" /></svg>);
    case "Apple Podcasts": return (<svg {...c} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="2.2" fill="currentColor" stroke="none" /><path d="M9.2 14.4c.8-.5 1.7-.7 2.8-.7s2 .2 2.8.7l-1 5c-.1.5-.6.9-1.1.9h-1.4c-.5 0-1-.4-1.1-.9l-1-5Z" fill="currentColor" stroke="none" /><path d="M7.4 12.4a5 5 0 1 1 9.2 0" /><path d="M5.6 12.4a7 7 0 1 1 12.8 0" /></svg>);
    case "iHeart": return (<svg {...c} fill="currentColor"><path d="M12 21s-7.5-4.5-9.5-9.4A5.5 5.5 0 0 1 12 6.5a5.5 5.5 0 0 1 9.5 5.1C19.5 16.5 12 21 12 21Z" /></svg>);
    case "Castbox": return (<svg {...c} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="6" width="17" height="13" rx="1.2" /><path d="M3.5 9.5h17" /><path d="M8 3.5l4 3 4-3" /></svg>);
    case "Amazon Music": return (<svg {...c} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><path d="M12 4v6" /><path d="M4 18c2.5 1.5 5 2 8 2s5.5-.5 8-2" /></svg>);
    case "Audible": return (<svg {...c} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M6 12l6-4 6 4" fill="currentColor" stroke="none" /><path d="M4.5 15h15" /></svg>);
    default: return null;
  }
}

export function PlatformGrid() {
  return (
    <ul className="platform-grid">
      {PODCAST.platforms.map((p) => (<li key={p.name}><a className="platform-card" href={p.url} target="_blank" rel="noopener noreferrer"><div style={{ display: "flex", justifyContent: "space-between" }}><span className="mark"><PlatformIcon name={p.name} /></span></div><div><div className="name">{p.name}</div></div></a></li>))}
    </ul>
  );
}
