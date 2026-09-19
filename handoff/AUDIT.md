# Security & Loose-Ends Audit

What I tightened, what I closed, what remains for you. Honest accounting — including the things I deliberately left because they're faithful to the source intent.

---

## Security gaps closed

### 1. Content-Security-Policy (was: none → now: strict, scoped)
The live eryezakalalu.com (and the Genspark source) ship with **no CSP** — any injected script could run. The rebuild adds a scoped CSP that allows exactly the third-party origins the site actually uses:

- `script-src 'self' 'unsafe-inline' https://subscribe-forms.beehiiv.com` — own bundle + Beehiiv attribution. (`'unsafe-inline'` is needed for Next.js hydration scripts and the JSON-LD block; a nonce-based CSP is the strict upgrade — see "Future hardening" below.)
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` — own CSS + Google Fonts import + inline component styles.
- `font-src 'self' https://fonts.gstatic.com data:` — Newsreader/Source Serif 4/DM Sans.
- `frame-src 'self' https://subscribe-forms.beehiiv.com https://www.iheart.com` — the newsletter iframe + the iHeart player. Nothing else can be framed in.
- `connect-src 'self'` (Next.js) — the RSS is fetched server-side, so the browser only talks to its own origin. The static bundle additionally lists the RSS/CORS-proxy origins because it fetches client-side.
- `object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests` — clickjacking protection, form hijack protection, HTTPS enforcement.

Configured in `next.config.ts` (Next.js) and `vercel.json` / `_headers` (static bundle).

### 2. Standard security headers (were: none)
Added `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-DNS-Prefetch-Control: off`.

### 3. Email de-obfuscation (was: broken Cloudflare link → now: real mailto)
The source's footer used Cloudflare's email-obfuscation (`/cdn-cgi/l/email-protection#...` + a `__cf_email__` span + an `email-decode.min.js` script). On any host that isn't behind Cloudflare's proxy, this renders as a broken link with no visible address. I replaced it with a plain `mailto:hello@eryezakalalu.com` and stripped the dead email-decode script. Trade-off: the address is now visible to harvesters. If spam becomes an issue, switch to a contact form (a small Next.js API route that forwards to your inbox, never exposing the address).

### 4. Server-side RSS proxying (Next.js — fixes a real fragility)
The source fetches the Beehiiv + podcast RSS **client-side** via `api.allorigins.win` and `api.rss2json.com` as CORS proxies. These are public, unauthenticated, rate-limited, and occasionally down — when they fail, the feeds silently break. The Next.js rebuild moves RSS fetching server-side: `/api/letters` and `/api/episodes` fetch the RSS directly from Next's edge runtime (no CORS, no third-party dependency, proper caching headers). The browser now only talks to its own origin.

### 5. External link safety
Every external link (`target="_blank"`) carries `rel="noopener noreferrer"` — prevents reverse tabnabbing and referrer leakage. This was already correct in the source; preserved.

### 6. No secrets in the repo
The repo contains no API keys, tokens, or credentials. The Beehiiv embed ID, Payhip/Selar product URLs, podcast show IDs, and RSS feed URLs are all **public identifiers** (not secrets) — they're meant to be embedded in client-facing HTML. No `.env` values are committed beyond the sandbox's own (which contains nothing sensitive).

### 7. Dependency hygiene
The Next.js project uses the sandbox's locked, audited dependency set (Next 16, React 19, Tailwind 4, shadcn/ui). The static bundle uses **zero** npm dependencies — it's plain HTML/CSS/JS, so it has no supply-chain surface at all.

---

## Loose ends tightened

### A. Dead references removed
The Genspark source references several files that don't exist on the server:
- `assets/bg.png`, `sub-brands/eryeza-writes/assets/bg.png`, `sub-brands/eryeza-speaks/assets/bg.png` → 404 JSON. Removed from the cleaned static bundle (they were never loaded; the pages use inline CSS backgrounds).
- `/hyperframes/runtime.iife.js` → 404. This was Genspark's editor runtime, not needed in production. Removed.
- The Cloudflare email-decode script → removed (see #3 above).
- `data-om-*` and `data-src-ver` Genspark editor attributes → stripped from the static bundle (170 in Home, 393 in the landing page). The Next.js version never had them.

### B. "Almost ready" → production-readied
- The Genspark version's masthead nav linked "The Book" to `The Influential Spirit — landing page.html` (a filename with an em-dash + spaces — fragile on case-sensitive hosts and URL-encodes ugly). The static bundle renames it to `the-influential-spirit.html` with a clean-URL redirect in `vercel.json`/`_redirects`. The Next.js version uses a single `/` route with `#thebook` anchor (no second file at all).
- Added `canonical`, `sitemap.xml`, `robots.txt`, JSON-LD (Person + Book + PodcastSeries structured data) — none of which existed in the source. This materially helps eryezakalalu.com's SEO and rich-result eligibility.
- Added `theme-color`, proper `openGraph` + `twitter` card meta with the cover image, so link previews render the book cover.

### C. Accessibility
- All interactive elements have `aria-label` / `aria-expanded` / `aria-controls` / `aria-current`.
- The mobile drawer toggles `hidden` + `aria-expanded` correctly (verified via agent-browser).
- `prefers-reduced-motion` is respected — the reveal engine, cover-breathing animation, stamp arrival, and pulse dot all suppress under reduced-motion.
- `scroll-margin-top: 96px` on `section[id]` so anchor jumps don't hide headings under the sticky masthead.
- Color contrast: the source's own design-system doc notes the oxblood-400 eyebrow is WCAG-AA-safe on every paper surface; preserved.

### D. Responsive + sticky footer
- Mobile-first; the grid collapses to single column under 900px, the masthead nav collapses to a burger under 1024px (verified the drawer opens with 6 links).
- Root wrapper is `min-h-screen flex flex-col` with `flex-1` on `<main>` — the footer sticks to the viewport bottom on short pages and is pushed down naturally on long pages (verified: footer bottom = 3997px on the full long page, no floating gap).

---

## What remains (needs your action — can't be done from this sandbox)

1. **Push to GitHub.** No git credentials, no `gh` CLI, no deploy token in this sandbox. The migration guide gives you the exact `git clone → replace → commit → push` commands. (~5 minutes of your time.)

2. **Point eryezakalalu.com DNS at the host.** Sandbox has no access to your registrar/Cloudflare. One A record + one CNAME. (Documented in MIGRATION.md.)

3. **Podcast RSS feed is dead.** `https://anchor.fm/s/103e4e254/podcast/rss` returns 404 (Anchor → Spotify for Podcasters rebrand). The live iHeart player + 6 platform links still work; only the "Recent episodes" list falls back. Get your current RSS URL from Spotify for Podcasters → Settings, drop it in one line.

4. **"Seven" reviews vs 6.** Copy says seven; only 6 exist on the landing page. Add the 7th or change "seven" → "six" in one line.

5. **Email address.** I set `hello@eryezakalalu.com` as a reasonable default. Confirm or correct it.

---

## Future hardening (optional, not blocking launch)

- **Nonce-based CSP.** Replace `'unsafe-inline'` in `script-src` with a per-request nonce. Next.js 16 supports this via the `nonce` option in middleware. Removes the last inline-script attack surface. (~1 hour; only worth it once traffic warrants.)
- **Subresource Integrity** for the Beehiiv attribution.js (it's third-party; SRI would detect tampering). Beehiiv doesn't currently publish an integrity hash, so this is blocked on them.
- **A real contact form** instead of a `mailto:` if email scraping becomes a problem.
- **Image optimization.** The cover.jpg is 743KB. Next.js `<Image>` with AVIF/WebP would cut that to ~120KB. The static bundle could use a pre-optimized AVIF. (The Next.js version uses plain `<img>` for fidelity; swap to `<Image>` for the optimization.)

---

## What I deliberately kept (faithful to source, not a defect)

- The **dark Subscribe button** in the masthead (`btn-primary`, ink-700 background) — this is the source's own `.cta` design, not a bug.
- The **gold-400 bronze** "PASTOR · AUTHOR" label — the source explicitly sets `.role { color: var(--gold-400) }` (the darker gold step, which reads as bronze on parchment). Correct per spec.
- The **two empty live feeds** (newsletter + podcast episodes) — both fall back gracefully and honestly. They'll populate the moment you publish a Beehiiv letter / supply a live podcast RSS.
- The **iHeart iframe filter** (`hue-rotate(-8deg) saturate(0.85)`) — the source applies this to make the iHeart player's default green match the forest palette. Preserved.
