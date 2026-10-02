import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import SiteShell from "@/components/site/site-shell";
import StudySignup from "@/components/site/study-signup";
import { STUDY, STUDY_COVER, CURRENT_THEME, currentEpisode } from "@/lib/site-content";

export const dynamic = "force-static";

const TITLE = "Free study guides";
const DESCRIPTION = STUDY.lede;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/resources" },
  openGraph: {
    type: "website",
    url: "/resources",
    title: `${TITLE} · Devotion in Season`,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Eryeza Kalalu" }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} · Devotion in Season`, description: DESCRIPTION, images: ["/og.png"] },
};

export default function StudyPage() {
  // The general guide cover (FROM-COWORK). Until it exists the card shows a seal panel.
  const hasCover = existsSync(join(process.cwd(), "public", STUDY_COVER));
  return (
    <SiteShell active="/resources">
      <section className="section surface-100 loose">
        <div className="container">
          <div style={{ maxWidth: 720 }}>
            <span className="eyebrow">{STUDY.eyebrow}</span>
            <h1 className="display" style={{ fontSize: "clamp(36px, 5vw, 60px)", lineHeight: 1.08, fontWeight: 400, letterSpacing: "-0.02em", marginTop: 12 }}>{STUDY.heading}</h1>
            <p className="body body-lg" style={{ marginTop: 20, maxWidth: "60ch" }}>{STUDY.lede}</p>
          </div>
          <div style={{ marginTop: 48 }}>
            <StudySignup themeTitle={CURRENT_THEME.title} initialEpisode={currentEpisode()} hasCover={hasCover} />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
