import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { NEWSLETTER, SITE } from "@/lib/site-content";
import { getLetters } from "@/lib/rss";

export const metadata: Metadata = {
  title: "Letters · Eryeza Writes",
  description: "Personal letters and updates from Pastor Eryeza Kalalu.",
  alternates: { canonical: "/letter" },
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

export default async function LetterPage() {
  const letters = await getLetters(8);

  return (
    <SiteShell active="/letter">
      <section className="section surface-100 page-hero">
        <div className="container">
          <span className="eyebrow">{NEWSLETTER.eyebrow}</span>
          <h1 className="display page-hero__title">{NEWSLETTER.heading}</h1>
          <p className="body page-hero__lede" style={{ maxWidth: "62ch" }}>
            Short, personal letters on faith, formation and the work. No schedule, no noise. Subscribe and read
            them in your inbox or here on the site.
          </p>
        </div>
      </section>

      <section className="section surface-50">
        <div className="container">
          <div className="card-grid card-grid--letters">
            {letters.length === 0 ? (
              <p className="card__meta">The letter archive is unavailable right now. Please check back shortly.</p>
            ) : (
              letters.map((l, i) => (
                <article className={i === 0 ? "card card--anchor" : "card card--quiet"} key={i}>
                  <p className="card__meta">{fmtDate(l.pubDate) || "Letter"}</p>
                  <h2 className="card__title">{l.title}</h2>
                  {l.description ? <p className="card__desc">{l.description.slice(0, 220)}</p> : null}
                  <a className="card__cta" href={l.link} target="_blank" rel="noopener noreferrer external">
                    Read the letter
                  </a>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section surface-100">
        <div className="container">
          <h2 className="display" style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 400 }}>
            Subscribe
          </h2>
          <p className="caption" style={{ marginTop: 8, color: "var(--ink-400)" }}>
            Letters are sent through Beehiiv. You can unsubscribe at any time.
          </p>
          <div className="letter-embed" style={{ marginTop: 20 }}>
            <iframe
              src={SITE.beehiivEmbed}
              title="Subscribe to letters from Eryeza Kalalu"
              style={{ width: "100%", maxWidth: 440, height: 220, border: "1px solid var(--border)" }}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
