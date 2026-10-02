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
      <section className="section surface-100 loose">
        <div className="container">
          <div style={{ maxWidth: 720 }}>
            <span className="eyebrow">{STUDY.eyebrow}</span>
            <h1 className="display" style={{ fontSize: "clamp(36px, 5vw, 60px)", lineHeight: 1.08, fontWeight: 400, letterSpacing: "-0.02em", marginTop: 12 }}>{STUDY.libraryHeading}</h1>
            <p className="body body-lg" style={{ marginTop: 20, maxWidth: "60ch" }}>{STUDY.libraryLede}</p>
          </div>
          <div style={{ marginTop: 48, maxWidth: 820 }}>
            <StudyLibrary themes={themes} buildTime={Date.now()} />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
