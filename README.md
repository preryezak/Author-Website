# Eryeza Kalalu — Official Author Website

Official website for **Eryeza Kalalu** (Pastor, Author, Speaker & Bible Teacher), featuring
*The Influential Spirit*, the *Devotion In Season* podcast, the *Eryeza Writes* letter, and speaking
engagement requests.

**Live:** <https://eryezakalalu.com>
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · fully **static export** on
**Cloudflare Workers with Static Assets**. Design language: *Neo-Monastic Editorial*.

---

## How it is built and deployed

The site is a **static export**. `next build` writes `out/`, and `scripts/postbuild.mjs` mirrors that
into **`dist/public`** — the asset directory the live Worker serves. There is no Node/Edge server at
runtime, so anything that used to be an API route now happens either at build time or in a separate
Worker (see *Speaking form* below).

| | |
| --- | --- |
| Worker (production) | **`ccndaily-books`** — holds the custom domains `eryezakalalu.com` and `www.eryezakalalu.com` |
| Asset directory | `./dist/public` |
| 404 handling | `single-page-application` (`not_found_handling` in `wrangler.toml`) |
| Account | Cloudflare account `735fd2efdcd4e3e8eb9d14485540d8b7` |

> A `git push` on its own does **not** deploy this site. Deployment is `wrangler deploy`.

### Deploy

```bash
npm install
npm run build          # next build && node scripts/postbuild.mjs  -> out/, dist/, dist/public/
npx wrangler deploy    # uploads assets to the `ccndaily-books` Worker
```

`wrangler deploy` prints a Version ID; the custom domains update within seconds. Verify with:

```bash
curl -s https://eryezakalalu.com/ | grep -c '_next/static'   # expect ~51
```

### Local development

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build + postbuild mirror
npm run lint
```

---

## Where to change things

Almost every edit is one file. Nothing here needs a component rewrite.

| To change… | Edit |
| --- | --- |
| **Almost all copy** — hero, book pitch, bio letter, FAQ, reviews, editions, podcast links, nav labels | `src/lib/site-content.ts` |
| **The 30-day reader (Day 1)** | `DAY1_FULL` in `src/lib/site-content.ts` |
| **Page structure / sections / components** | `src/components/site/site-page.tsx` |
| **Speaking invitation form fields** | `src/components/site/speaking-invite-form.tsx` (and the matching `SECTIONS` list in `worker/speaking.ts`) |
| **Colours, type scale, spacing, focus ring** | CSS custom properties at the top of `src/app/globals.css` (`--paper-*`, `--ink-*`, `--gold-*`, `--oxblood-*`, `--forest-*`) |
| **Brand marks / logos** | `public/brand/*.svg` |
| **Photographs and book imagery** | `public/images/` — see *Images* below |
| **Favicon / home-screen / social card** | `public/favicon.ico`, `public/apple-touch-icon.png`, `public/og.png` |
| **Page title, description, Open Graph, Twitter, keywords** | `metadata` export in `src/app/layout.tsx` |
| **Structured data (Person, Book, PodcastSeries, WebSite)** | `jsonLd` in `src/app/layout.tsx` |
| **Security headers & caching rules** | `public/_headers` |
| **Crawler rules (search + AI bots)** | `src/app/robots.ts` |
| **Sitemap** | `src/app/sitemap.ts` |
| **AI/LLM summary for assistants** | `public/llms.txt` |
| **Deploy target, Worker name, 404 behaviour** | `wrangler.toml` |
| **Web app manifest** | `public/manifest.webmanifest` |

Then rebuild and deploy (`npm run build && npx wrangler deploy`).

### Images

Keep them small — they are the single biggest factor in how fast the page feels.

- Prefer **WebP** at the largest width actually displayed. The site currently ships
  `author-640.webp`, `cover-640.webp`, `cover-1200.webp`, `mockups/book-audiogram-640.webp`.
- When adding an image, set an explicit `width`/`height` (prevents layout shift), use `srcSet`/`sizes`
  for anything responsive, `loading="lazy"` for below-the-fold, and `fetchPriority="high"` only for
  the one hero image.
- Regenerate variants with `sharp` (already a dependency):
  ```bash
  node -e "require('sharp')('public/images/cover.jpg').resize({width:1200}).webp({quality:82}).toFile('public/images/cover-1200.webp')"
  ```

### Speaking form

The form is the only dynamic feature. It posts to a dedicated Cloudflare Worker
(`NEXT_PUBLIC_SPEAKING_ENDPOINT`), which validates the submission, stores it in D1 and emails
`speaking@eryezakalalu.com`.

- Worker source: `worker/speaking.ts` · config: `worker/wrangler.toml` · schema: `worker/schema.sql`
- Full setup, the native-vs-Resend email options and limits: **`worker/README.md`**
- Set the endpoint in the Cloudflare Pages/Worker environment as `NEXT_PUBLIC_SPEAKING_ENDPOINT`
  (see `.env.example`). If it is unset the form falls back to `/api/speaking`, which does not exist in
  a static export — so set it.

---

## Quality notes

Covered and verified on the live site:

- **Responsive** — one long page from 320 px up; burger drawer below 1024 px; `srcSet`/`sizes` on
  content images; no fixed-width elements that overflow.
- **States** — the letters and podcast lists have explicit loading, empty and populated states (the
  feeds are fetched at build time and degrade to an empty state if a feed is unreachable).
- **Accessibility** — every brand colour pairing passes WCAG AA (body 15.24:1, muted 11.07:1,
  eyebrow 5.80:1, gold-on-dark 8.25:1); focus indicators use a **two-tone ring** that clears 3:1 on
  both light and dark sections; `prefers-reduced-motion` disables the reveal animation; 16 images
  carry `alt` text; 18 `aria-*` attributes.
- **Performance** — hashed `/_next/static/*` assets are cached `immutable` for a year; `/images/*` and
  `/brand/*` for 30 days; third-party iframes (iHeart, Beehiiv) are `loading="lazy"`.
- **Security** — CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`,
  `X-Permitted-Cross-Domain-Policies` and `X-Robots-Tag` are set in `public/_headers`.
- **SEO / AI discoverability** — canonical, Open Graph and Twitter cards, `robots.txt` with explicit
  allowances for search *and* AI/LLM crawlers, `sitemap.xml`, a JSON-LD graph, and `llms.txt`.

---

## Gotchas

- **Do not add a `_redirects` file with `/*  /index.html  200`.** Cloudflare rejects it as an
  infinite-loop redirect (error `100324`) while `not_found_handling = "single-page-application"` is
  set — and that setting already provides the SPA fallback.
- **A missing file returns HTTP 200 with the homepage HTML**, because of the SPA fallback. When
  checking whether an asset exists, look at `Content-Type`, not the status code.
- **React renders `srcSet` as camelCase `srcSet=`** in the HTML output. HTML parsers lowercase
  attribute names so browsers honour it, but a lowercase `srcset=` search returns 0.
- The old Vite site is preserved on the branch `archive/old-vite-site`. `books.theccndaily.com` is the
  previous domain and is no longer the canonical host.

---

## License

© 2026 Eryeza Kalalu. All rights reserved.
