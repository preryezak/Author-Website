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

/**
 * The podcast, on its own route.
 *
 * Opens with the home page's own `dis-strip` band rather than a generic page
 * header, then lists episodes in the same markup the home page uses, with the
 * platform row beneath.
 */
export default async function PodcastPage() {
  const episodes = await getEpisodes(7);

  return (
    <SiteShell active="/podcast">
      {/* ---------- STRIP, exactly as the home page carries it ---------- */}
      <section className="dis-strip">
        <div className="container">
          <div className="dis-row">
            <img
              src="/brand/dis-mark.svg"
              alt="Devotion In Season seal"
              className="dis-seal"
              style={{ padding: 12 }}
            />
            <div className="stack">
              <span className="dis-eb">{PODCAST.eyebrow}</span>
              <h1 className="dis-title">{PODCAST.title}</h1>
              <p className="dis-lede">{PODCAST.lede}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- EPISODES ---------- */}
      <section className="section surface-100" id="podcast-episodes">
        <div className="container">
          <div className="page-head page-head--left">
            <span className="eyebrow">Episodes</span>
            <h2 className="page-head__title">Listen here, or in your own player.</h2>
          </div>

          {episodes.length === 0 ? (
            <div className="letter-item">
              <div>
                <div className="date">&nbsp;</div>
                <div className="title">The episode list is unavailable right now. Please check back shortly.</div>
              </div>
            </div>
          ) : (
            <ul className="episode-list">
              {episodes.map((it, i) => (
                <li key={i} className={i === 0 ? "episode episode--lead" : "episode"}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="meta">{fmtDate(it.pubDate) || "Episode"}</div>
                    <h3 className="title">{it.title}</h3>
                    {it.audioUrl ? <audio className="episode__audio" controls preload="none" src={it.audioUrl} /> : null}
                    <div className="card-cta" style={{ marginTop: 10 }}>
                      <a className="btn btn-ghost btn-sm" href={it.link} target="_blank" rel="noopener noreferrer external">
                        Open episode
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---------- PLATFORMS ---------- */}
      <section className="section surface-50" id="podcast-platforms">
        <div className="container">
          <div className="page-head page-head--left">
            <span className="eyebrow">{PODCAST.platformsLabel}</span>
            <h2 className="page-head__title">{PODCAST.platformsHeading}</h2>
          </div>
          <ul className="link-list">
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
