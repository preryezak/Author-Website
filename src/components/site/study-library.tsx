"use client";

/**
 * /resources/library/ list. The page passes every guide whose PDF exists at
 * build time; this hides any whose episode has not aired yet, re-checked in
 * the browser so a guide added ahead of time appears at 8 PM EAT on its Sunday
 * without a rebuild.
 */

import { useEffect, useState } from "react";
import { STUDY } from "@/lib/site-content";

export type LibraryGuide = { n: number; title: string; sunday: string; airs: number; href: string };
export type LibraryTheme = { slug: string; title: string; guides: LibraryGuide[] };

function fmtSunday(sunday: string) {
  const d = new Date(`${sunday}T12:00:00+03:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Kampala" });
}

export default function StudyLibrary({ themes, buildTime }: { themes: LibraryTheme[]; buildTime: number }) {
  const [now, setNow] = useState(buildTime);
  useEffect(() => { setNow(Date.now()); }, []);

  const visible = themes
    .map((t) => ({ ...t, guides: t.guides.filter((g) => g.airs <= now).sort((a, b) => b.n - a.n) }))
    .filter((t) => t.guides.length);

  if (!visible.length) return <p className="body body-lg">{STUDY.libraryEmpty}</p>;

  return (
    <div className="study-library">
      {visible.map((t) => (
        <section key={t.slug} aria-labelledby={`theme-${t.slug}`}>
          <h2 id={`theme-${t.slug}`} className="display study-library__theme">{t.title}</h2>
          <ol className="study-library__list">
            {t.guides.map((g) => (
              <li key={g.n}>
                <span className="study-library__num" aria-hidden="true">{String(g.n).padStart(2, "0")}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="study-library__meta">Episode {g.n} · <time dateTime={g.sunday}>{fmtSunday(g.sunday)}</time></div>
                  <h3 className="study-library__title">{g.title}</h3>
                </div>
                <a className="btn btn-accent study-library__open" href={g.href} target="_blank" rel="noopener">
                  Open guide<span className="sr-only">: {g.title} (PDF)</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
