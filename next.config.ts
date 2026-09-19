import type { NextConfig } from "next";

/**
 * Security headers for eryezakalalu.com.
 *
 * CSP allows exactly the third-party origins the site actually uses:
 *  - Google Fonts (Newsreader, Source Serif 4, DM Sans)
 *  - Beehiiv (attribution.js + the embedded subscribe iframe)
 *  - iHeart (the Devotion In Season podcast iframe player)
 * Commerce links (Payhip, Selar, Audible, Spotify, Apple, Amazon, Castbox)
 * open in new tabs via <a target="_blank" rel="noopener noreferrer"> — these are
 * top-level navigations, not resource loads, so CSP does not need to list them.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://subscribe-forms.beehiiv.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  "frame-src 'self' https://subscribe-forms.beehiiv.com https://www.iheart.com",
  "connect-src 'self'",
  "media-src 'self' https://*.iheart.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
