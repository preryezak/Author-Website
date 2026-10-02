import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import SiteShell from "@/components/site/site-shell";
import StudySignup from "@/components/site/study-signup";
import { STUDY, STUDY_WEEKS, currentStudyWeek } from "@/lib/site-content";

export const dynamic = "force-static";

const TITLE = "Free weekly study guide";
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
  // Which guide covers actually exist in public/ (FROM-COWORK). Missing ones
  // render a seal panel instead of a broken image.
  const coversPresent = STUDY_WEEKS.map((w) => w.cover).filter((c) => c && existsSync(join(process.cwd(), "public", c)));
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
            <StudySignup initialWeek={currentStudyWeek()} coversPresent={coversPresent} />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
