import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import SiteShell from "@/components/site/site-shell";
import StudyLibrary, { type LibraryTheme } from "@/components/site/study-library";
import { STUDY, STUDY_THEMES, airsAt, guidePath } from "@/lib/site-content";

export const dynamic = "force-static";

// Reached from the Kit confirmation email ("After confirming redirect to").
// Unlisted: not in the menu or sitemap, noindex here and in public/_headers.
export const metadata: Metadata = {
  title: STUDY.libraryHeading,
  description: STUDY.libraryLede,
  alternates: { canonical: "/resources/library/" },
  robots: { index: false, follow: false },
};

export default function StudyLibraryPage() {
  // Every guide whose PDF is in public/, newest theme first. Unaired ones are
  // hidden in the browser until 8 PM EAT on their Sunday.
  const themes: LibraryTheme[] = [...STUDY_THEMES].reverse().map((t) => ({
    slug: t.slug,
    title: t.title,
    guides: t.episodes
      .map((ep) => ({ n: ep.n, title: ep.title, sunday: ep.sunday, airs: airsAt(ep), href: guidePath(t, ep) }))
      .filter((g) => existsSync(join(process.cwd(), "public", g.href))),
  }));
  return (
    <SiteShell active="/resources">
      <section className="section study-hero" style={{ paddingBottom: 56 }}>
        <div className="container">
          <div className="lib-hero">
            <div>
              <span className="eyebrow">{STUDY.eyebrow}</span>
              <h1 className="study-hero__title">{STUDY.libraryHeading}</h1>
              <p className="study-hero__lede">{STUDY.libraryLede}</p>
            </div>
            <img className="lib-hero__cover" src="/images/study/cover-600.webp" alt="" width={600} height={800} decoding="async" />
          </div>
        </div>
      </section>
      <section className="section surface-100 loose" style={{ paddingTop: 48 }}>
        <div className="container">
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <StudyLibrary themes={themes} buildTime={Date.now()} />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
