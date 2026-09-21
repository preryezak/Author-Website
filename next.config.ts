import type { NextConfig } from "next";

/**
 * eryezakalalu.com — static export build.
 *
 * The site ships as a fully static export so it can be served by the EXISTING
 * Cloudflare Pages project, which is configured with the build command
 * `npm run build` and the build output directory `dist` (inherited from the old
 * Vite site). `scripts/postbuild.mjs` mirrors Next's `out/` into `dist/`, so no
 * Cloudflare dashboard change is required.
 *
 * Security headers (CSP, HSTS, X-Frame-Options, ...) live in `public/_headers`
 * because `headers()` in next.config.ts is not applied in static-export mode;
 * Cloudflare Pages reads `_headers` at deploy time.
 *
 * CSP allows exactly the third-party origins the site actually uses:
 *  - Google Fonts (Newsreader, Source Serif 4, DM Sans)
 *  - Beehiiv (attribution.js + the embedded subscribe iframe)
 *  - iHeart (the Devotion In Season podcast iframe player)
 * Commerce links (Payhip, Selar, Audible, Spotify, Apple, Amazon, Castbox) open
 * in new tabs via <a target="_blank" rel="noopener noreferrer"> - these are
 * top-level navigations, not resource loads, so CSP does not need to list them.
 */
const nextConfig: NextConfig = {
  output: "export",
  // next/image optimisation requires a server; static export needs this off.
  images: { unoptimized: true },
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: false },
  // Emit directory-style URLs (/about/index.html) which is what Pages serves.
  trailingSlash: true,
};

export default nextConfig;
