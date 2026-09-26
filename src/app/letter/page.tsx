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

/**
 * The letter, on its own route.
 *
 * Uses the home page's `letter-item` markup for the archive so the two lists
 * read identically, with the subscribe embed beneath.
 */
export default async function LetterPage() {
  const letters = await getLetters(8);

  return (
    <SiteShell active="/letter">
      <section className="section surface-200">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">{NEWSLETTER.eyebrow}</span>
            <h1 className="page-head__title">{NEWSLETTER.heading}</h1>
            <p className="page-head__lede">
              Short, personal letters on faith, formation and the work. No schedule, no noise. Read them here or
              have them sent to you.
            </p>
          </div>

          <div className="mx-auto" style={{ maxWidth: 760 }}>
            {letters.length === 0 ? (
              <div className="letter-item">
                <div>
                  <div className="date">&nbsp;</div>
                  <div className="title">The archive is unavailable right now. Please check back shortly.</div>
                </div>
              </div>
            ) : (
              letters.map((l, i) => (
                <a className="letter-item" key={i} href={l.link} target="_blank" rel="noopener noreferrer external">
                  <div>
                    <div className="date">{fmtDate(l.pubDate) || "Letter"}</div>
                    <div className="title">{l.title}</div>
                    {l.description ? <div className="excerpt">{l.description.slice(0, 220)}</div> : null}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section surface-100">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">Subscribe</span>
            <h2 className="page-head__title">Have the next one sent to you.</h2>
            <p className="page-head__lede">
              Letters are sent through Beehiiv. You can unsubscribe at any time.
            </p>
          </div>
          {/* Sizing lives in globals.css (.letter-card--embed / .beehiiv-embed),
              exactly as on the home page. No inline height or width: an inline
              value would override the responsive rules and clip the email field,
              which is what pushed the input below the fold before. */}
          <div className="mx-auto letter-card letter-card--embed">
            <iframe
              className="beehiiv-embed"
              title="Subscribe to Eryeza Writes"
              loading="lazy"
              src={SITE.beehiivEmbed}
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
