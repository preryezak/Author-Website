import type { Metadata } from "next";
import SiteShell from "@/components/site/site-shell";
import { NAV } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page could not be found.",
  robots: { index: false, follow: true },
};

/**
 * 404 page.
 *
 * With `output: "export"` this becomes `404.html` in the exported site, which is
 * what the Worker serves once `not_found_handling` is set to `404-page`. Before
 * that change the Worker returned the homepage with HTTP 200 for every missing
 * path, which is why this page exists.
 */
export default function NotFound() {
  return (
    <SiteShell>
      <section className="section surface-100 page-hero">
        <div className="container">
          <span className="eyebrow">404</span>
          <h1 className="display page-hero__title">That page is not here.</h1>
          <p className="body page-hero__lede" style={{ maxWidth: "56ch" }}>
            The address may have changed, or it may never have existed. Here is the way back.
          </p>
          <nav aria-label="Site sections" className="notfound-links">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </section>
    </SiteShell>
  );
}
