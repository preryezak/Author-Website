import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import EpisodeList from "@/components/site/episode-list";
import { YouTubeFacade, SeriesRun } from "@/components/site/podcast-parts";
import { IheartPlayer } from "@/components/site/home-islands";
import { OrnamentRule, PlatformGrid, ArrowRight } from "@/components/site/ui-bits";
import { getEpisodes } from "@/lib/rss";
import { PODCAST, PODCAST_PAGE, LATEST_EPISODE_YT_ID, STUDY, currentStudyWeek } from "@/lib/site-content";

/**
 * /podcast/ (handoff P0-3), on the forest Devotion in Season surface.
 *
 * Rendered at build time: the RSS episode list is baked in, so new episodes
 * appear after the next build + deploy (see P1-6). The latest-episode player
 * loads only when pressed (YouTube when LATEST_EPISODE_YT_ID is set, iHeart
 * until then), so neither player's scripts or cookies load with the page.
 */
export const dynamic = "force-static";

const TITLE = "Devotion in Season · The Podcast";
const DESCRIPTION = PODCAST_PAGE.lede;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/podcast" },
  openGraph: {
    type: "website",
    url: "/podcast",
    title: `${TITLE} · Eryeza Kalalu`,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Eryeza Kalalu" }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} · Eryeza Kalalu`, description: DESCRIPTION, images: ["/og.png"] },
};

export default async function PodcastPage() {
  const episodes = await getEpisodes(30);
  const studyWeek = currentStudyWeek();
  return (
    <SiteShell active="/podcast">
      <section className="dis-strip">
        <div className="container">
          <div className="dis-row">
            <img src="/brand/dis-mark.svg" alt="Devotion in Season seal" className="dis-seal" width={160} height={160} style={{ padding: 12 }} />
            <div className="stack">
              <span className="dis-eb">{PODCAST.eyebrow}</span>
              <h1 className="dis-title">{PODCAST_PAGE.heading}</h1>
              <p className="dis-lede">{PODCAST_PAGE.lede}</p>
            </div>
          </div>

          {/* Latest episode */}
          <div className="featured-episode">
            <div className="episode-chip">
              <span className="pulse-dot" aria-hidden="true" />
              <span>Latest episode</span>
            </div>
            {LATEST_EPISODE_YT_ID ? (
              <YouTubeFacade id={LATEST_EPISODE_YT_ID} title="Devotion in Season, latest episode" />
            ) : (
              // FROM-COWORK: LATEST_EPISODE_YT_ID after each upload. Until then, the iHeart player.
              <IheartPlayer />
            )}
          </div>

          <div className="mt-12">
            <EpisodeList episodes={episodes} labelAs="h2" />
          </div>

          {/* Series run */}
          <div className="mt-12">
            <OrnamentRule>§</OrnamentRule>
            <span className="dis-eb">The current series</span>
            <h2 className="display" style={{ fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 500, color: "var(--paper-50)", marginTop: 8, marginBottom: 24 }}>The Influential Spirit, in eight weeks</h2>
            <SeriesRun buildTime={Date.now()} />
          </div>

          {/* This week's study guide */}
          <div className="mt-12 podcast-study">
            <div>
              <span className="dis-eb">{STUDY.eyebrow}</span>
              <h2 className="display" style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 500, color: "var(--paper-50)", marginTop: 8 }}>This week&apos;s study guide</h2>
              <p className="dis-lede" style={{ marginTop: 8 }}>Week {studyWeek.week}: {studyWeek.title}</p>
            </div>
            <a className="dis-cta" href="/study">Get the free guide<ArrowRight /></a>
          </div>

          {/* Listen on */}
          <div className="mt-12" id="podcast-platforms">
            <OrnamentRule>§</OrnamentRule>
            <div style={{ marginBottom: 24 }}><span className="dis-eb">{PODCAST.platformsLabel}</span><h2 className="display" style={{ fontSize: 28, fontWeight: 500, color: "var(--paper-50)", marginTop: 8 }}>{PODCAST.platformsHeading}</h2></div>
            <PlatformGrid />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
