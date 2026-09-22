# Eryeza Kalalu — Author Website: Final Report

**Engagement:** resume Antigravity session `95a292f8`, restore the z.ai/Genspark build to the live site,
then harden, optimise and improve discoverability.
**Dates:** 21–22 September 2026 · **Prepared by:** AutoClaw · **For:** Eryeza Kalalu

---

## 1. Outcome

`eryezakalalu.com` now serves the new Genspark build, hardened and optimised. Everything below was
executed against the live site and verified by reading the deployed responses back.

| | Before | After |
| --- | --- | --- |
| Homepage served | old Vite build, 373,743 B | **Next.js static export, ~87.5 KB** |
| `_next/static` references | 0 | **51** |
| Hashed asset caching | `max-age=0, must-revalidate` | **`max-age=31556952, immutable`** |
| Image transfer, mobile visit | 2,001,206 B | **174,664 B (−91.3 %)** |
| AI/LLM crawler rules | none | **18 agents explicitly allowed** |
| `llms.txt`, manifest, favicon, OG card | absent | **present and serving correct MIME types** |
| Focus indicator contrast | 1.41:1 (fail) | **7.14:1 / 15.24:1 (pass)** |

Deployed Worker: **`ccndaily-books`**, latest Version ID **`f03f6abb-2a21-4a76-b381-350b249a969c`**.
Repository `main`: **`e112776`**.

---

## 2. Why the site had not been updating

The Antigravity session had pushed the site content to GitHub on 19 September and then died on an API
quota error (HTTP 429), leaving the deployment unfinished. Two things were wrong, and neither was
visible from the handover document:

1. **The live site is not a Cloudflare Pages project.** The only Pages project in the account is
   `project-phoenix-ccn-daily` (theccndaily.com). `eryezakalalu.com` is a **Worker custom domain**:
   `GET /accounts/<id>/workers/domains` returns `eryezakalalu.com` and `www.eryezakalalu.com` bound to
   service **`ccndaily-books`**. That Worker publishes its assets from **`dist/public`** (the superseded
   Vite project carried `wrangler.toml` with `[assets] directory = "./dist/public"`), while the new
   Next.js build produced `.next/`.
2. **A `git push` does not deploy this site.** No GitHub Actions workflow exists; deployment is a
   `wrangler deploy`. This is why the earlier pushes never reached production.

A useful signal that confirmed the diagnosis: the live `robots.txt` still matched the old branch's
`client/public/robots.txt` byte for byte (including leftover Manus artefacts `Disallow: /__manus__/`
and a sitemap pointing at `books.theccndaily.com`), proving the deployed bytes came from that repository.

---

## 3. What was delivered

### 3.1 The build (static export)

`next build` with `output: "export"`; `scripts/postbuild.mjs` mirrors `out/` into **both** `dist/` and
`dist/public/`, so the Worker (which expects `dist/public`) and a Pages-style project (which expects
`dist`) both work. Result: 5 static routes, `dist/` 148 files, `dist/public/` 74 files.

Because a static export has no server, the two runtime API routes were replaced with **build-time**
RSS fetching (`src/lib/rss.ts`, `src/app/page.tsx`) that degrades to an empty state if a feed is
unreachable; the speaking form posts to its own Worker instead.

### 3.2 Security

- CSP tightened — the Google Fonts origins were removed because `next/font` self-hosts the woff2 files
  (verified: **0** runtime references to `fonts.googleapis.com` / `fonts.gstatic.com`).
- Added `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`,
  `X-Permitted-Cross-Domain-Policies: none`, `X-Robots-Tag`, and a wider `Permissions-Policy`.
- Confirmed live: CSP, HSTS (`includeSubDomains; preload`), `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`.

### 3.3 Performance

- **Caching.** `/_next/static/*` (content-hashed) → `public, max-age=31556952, immutable`;
  `/images/*`, `/brand/*`, `/logo.svg` → 30 days + `stale-while-revalidate`. `Cache-Control` is set
  only in path-specific rules because Cloudflare **joins duplicate header names with a comma**.
- **Images.** Regenerated with `sharp` and wired in with `srcSet`/`sizes`, explicit `width`/`height`
  and appropriate loading priorities:

  | Asset | Before | After | Saving |
  | --- | --- | --- | --- |
  | `author.jpg` 843×1264 | 587,179 B | `author-640.webp` 29,318 B | 95.0 % |
  | `cover.jpg` 1400×2100 | 743,321 B | `cover-640.webp` 101,574 B | 86.3 % |
  | | | `cover-1200.webp` 315,864 B | 57.5 % |
  | `book-audiogram.png` 1024² | 670,706 B | `book-audiogram-640.webp` 43,772 B | 93.5 % |

  Mobile image transfer falls from 2,001,206 B to 174,664 B (**−91.3 %**); desktop to 388,954 B
  (−80.6 %). Timing samples improved from 587/302/311 ms to 247/341/188 ms.
- Third-party iframes (iHeart, Beehiiv) were already `loading="lazy"`; `preconnect`/`dns-prefetch`
  hints added for them.

### 3.4 Accessibility

A measured audit, not an opinion:

- **Contrast passes everywhere.** Every brand pairing clears WCAG AA — body 15.24:1, muted 11.07:1,
  eyebrow 5.80:1, gold-on-dark 8.25:1, oxblood 9.30:1, forest 10.85:1.
- **Focus indicator failed and was fixed.** `--focus-ring` was oxblood at 22 % opacity, compositing to
  `#DAC9BF` — a measured **1.41:1**, below the 3:1 WCAG SC 1.4.11 requires. Raising the alpha alone was
  insufficient (oxblood on the dark sections is 2.13:1 even at full opacity), so it was replaced with a
  two-tone ring — `0 0 0 2px var(--paper-50), 0 0 0 4px #7B3F2E` — giving **7.14:1** on light pages and
  **15.24:1** on dark sections.
- Already sound and left alone: `prefers-reduced-motion` honoured by the reveal animation, 18 `aria-*`
  attributes, `alt` text on all 16 images.

### 3.5 SEO and AI/LLM discoverability

The Genspark build already shipped strong metadata and a JSON-LD graph; this round refined it:

- **`llms.txt`** added (author, books, podcast, citation guidance).
- **`robots.txt`** now explicitly allows the mainstream search and AI/LLM crawlers — Googlebot,
  Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot/-User/-SearchBot, anthropic-ai,
  PerplexityBot/-User, Google-Extended, Applebot(-Extended), Amazonbot, CCBot, meta-externalagent,
  Bytespider, DuckAssistBot, MistralAI-User, cohere-ai.
- **JSON-LD** gained a `WebSite` node and an `@id` plus platform `sameAs` links on `PodcastSeries`;
  the dead `webFeed` (`anchor.fm/s/103e4e254/podcast/rss`, which returns **404**) was removed so
  crawlers are not handed a broken feed URL.
- **Social/icon assets** created and wired: `og.png` (1200×630) for Open Graph and Twitter (replacing
  the 743 KB portrait cover), `apple-touch-icon.png` (180×180), `favicon.ico` (16/32/48),
  `manifest.webmanifest`.

### 3.6 Documentation

`README.md` was rewritten from scratch — the previous version documented API routes, a `download/`
folder and a `next-on-pages` deploy path, none of which exist. It now covers the real deploy
(`npm run build && npx wrangler deploy`), a table of exactly which file to edit for copy, colours,
images, nav, metadata, headers and deploy parameters, the image workflow, the speaking-form setup, the
quality notes and the platform gotchas.

---

## 4. Verification evidence

All of the following were read back from the live site after deploying:

- Homepage: 87,539 B, `Cache-Control: public, max-age=0, must-revalidate`, 51 `_next/static` refs,
  8 `srcSet` declarations, 7 `loading="lazy"`, 2 `fetchPriority="high"`, 6 `width="640"`.
- Assets: `author-640.webp` 29,318 B, `cover-640.webp` 101,574 B, `cover-1200.webp` 315,864 B,
  `book-audiogram-640.webp` 43,772 B — all `image/webp` with RIFF magic bytes, all
  `max-age=2592000, stale-while-revalidate=604800`.
- Discovery files: `llms.txt` 2,547 B (`text/plain`), `manifest.webmanifest` 651 B
  (`application/manifest+json`), `og.png` 49,247 B (`image/png`), `favicon.ico` 4,792 B
  (`image/vnd.microsoft.icon`, ICO magic bytes), `robots.txt` 783 B, `sitemap.xml` 259 B.
- Focus ring: new value present in the built CSS; the old faint value is gone.
- Repository: `git ls-remote` returns `e112776` for `refs/heads/main`.

---

## 5. Open items

| Item | Owner | Note |
| --- | --- | --- |
| Google Search Console: add property, verify, submit sitemap | Eryeza | Site side is ready. Verification by **DNS TXT** (DNS is in Cloudflare) or by HTML file — the file can be dropped into `public/` and deployed on request. |
| Bing Webmaster Tools | Eryeza | Fastest route is *Import from Google Search Console* once Google is verified. |
| Google **Change of Address** `books.theccndaily.com` → `eryezakalalu.com` | Eryeza | Requires Search Console ownership of **both** properties; owner-only, cannot be automated. |
| Podcast RSS replacement | Eryeza | The Anchor feed is dead (404). Confirm the iHeart or Spotify-for-Podcasters feed URL and it can be re-added to `PodcastSeries.webFeed`. |
| `book-audiogram.png` (670 KB) now unreferenced | — | Storage only, not visitor transfer. Removing it needs an explicit delete approval. |
| Resend / Email Service wiring for the speaking form | Eryeza | Worker code is ready (`worker/speaking.ts`, prefers Cloudflare's native `send_email` binding, Resend fallback, D1-first storage). Needs the domain onboarded for Email Service and the Worker deployed. |

### Rollback

- **Site:** redeploy any earlier Worker version, or `git revert` the offending commit. The last
  pre-change states are `2394008` (before any of this work) and `ab83844` (the first successful new-site
  deploy, before hardening). The original Vite site survives intact on branch `archive/old-vite-site`.
- **Headers/caching only:** `git revert` the commit touching `public/_headers` and redeploy.

### How to review

Highlights worth reading first: `public/_headers` (security + caching), `wrangler.toml` (deploy
target), `scripts/postbuild.mjs` (the `dist`/`dist/public` mirror), `src/lib/rss.ts` (build-time data),
and the `--focus-ring` token at the top of `src/app/globals.css`.

---

## 6. Sources

- Cloudflare — Workers Static Assets: headers & `_headers` behaviour —
  <https://developers.cloudflare.com/workers/static-assets/headers/>
- Cloudflare — Email Service, Workers API (`send_email`, `EmailMessageBuilder`) —
  <https://developers.cloudflare.com/email-service/api/send-emails/workers-api/>
- Cloudflare — Email Service pricing (free to verified destination addresses) —
  <https://developers.cloudflare.com/email-service/platform/pricing/>
- Cloudflare — Pages build configuration —
  <https://developers.cloudflare.com/pages/configuration/build-configuration/>
- Repository — <https://github.com/preryezak/Author-Website>
- Live site — <https://eryezakalalu.com>
