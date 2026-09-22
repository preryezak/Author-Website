import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { PODCAST } from "@/lib/site-content";
import { getEpisodes } from "@/lib/rss";

export const metadata: Metadata = {
  title: "Devotion In Season · The Podcast",
  description:
    "Short episodes on faith, formation and the practical realities of walking with God, with Eryeza Kalalu.",
  alternates: { canonical: "/podcast" },
};

export const dynamic = "force-static";

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export default async function PodcastPage() {
  const episodes = await getEpisodes(7);

  return (
    <SiteShell active="/podcast">
      <section className="section surface-100 page-hero">
        <div className="container">
          <span className="eyebrow">{PODCAST.eyebrow}</span>
          <h1 className="display page-hero__title">{PODCAST.title}</h1>
          <p className="body page-hero__lede">{PODCAST.lede}</p>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <div className="episode-list">
            {episodes.length === 0 ? (
              <p className="card__meta">The episode list is unavailable right now. Please check back shortly.</p>
            ) : (
              episodes.map((ep, i) => (
                <article className={i === 0 ? "episode card card--anchor" : "episode card card--quiet"} key={i}>
                  <p className="card__meta">{fmtDate(ep.pubDate) || "Episode"}</p>
                  <h2 className="card__title">{ep.title}</h2>
                  {ep.audioUrl ? (
                    <audio className="episode__audio" controls preload="none" src={ep.audioUrl} />
                  ) : null}
                  <a className="card__cta" href={ep.link} target="_blank" rel="noopener noreferrer external">
                    Open episode
                  </a>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section surface-100">
        <div className="container">
          <span className="eyebrow">{PODCAST.platformsLabel}</span>
          <h2 className="display" style={{ fontSize: "clamp(26px, 3.2vw, 38px)", marginTop: 10, fontWeight: 400 }}>
            {PODCAST.platformsHeading}
          </h2>
          <ul className="platform-grid">
            {PODCAST.platforms.map((p) => (
              <li key={p.name}>
                <a href={p.url} target="_blank" rel="noopener noreferrer external">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
