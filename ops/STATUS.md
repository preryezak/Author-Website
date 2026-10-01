# Phase 0 status

Branch `launch/phase-0` · base `main` @ `619b23e` · last updated 2026-10-01 (EAT)
**Not live yet.** Nothing has been merged, pushed or deployed; that waits for Eryeza's go-ahead.

## Still missing

### NEEDS-OWNER (Eryeza)
- [ ] **`KIT_API_KEY`**: Eryeza enters it himself with `npx wrangler secret put KIT_API_KEY -c worker/study.wrangler.toml`. Claude Code does not handle API keys.
- [ ] **`KIT_FORM_ID`**: Eryeza asked for it to be created; the Kit API cannot create forms. Create it in the Kit dashboard (Grow → Landing Pages & Forms → New form, incentive email linking the week PDF), then put its id in `[vars]`.
- [ ] **Beehiiv**: Eryeza confirmed (1 Oct) the plan includes API access, so the API path applies. Still needed: `BEEHIIV_PUB_ID` (starts `pub_`) in `[vars]`, and Eryeza runs `npx wrangler secret put BEEHIIV_API_KEY -c worker/study.wrangler.toml`.
- [x] **Payhip / Selar URLs**: Eryeza confirmed (1 Oct) both point at the live products. Unchanged.
- [ ] **Go-ahead** to create D1 `eryeza-study-db`, deploy `eryeza-study` (adds the route `eryezakalalu.com/api/study*`), merge to `main`, push, and deploy `ccndaily-books`.

### FROM-COWORK
- [ ] `public/study/covers/week-1.webp` (3:4 WebP). Until it exists, the card shows a forest panel with the DIS seal.
- [ ] Week 1 guide PDF at an unguessable path, e.g. `public/study/week-1-the-reversal-7f3k.pdf`. Set `pdfPath` in `STUDY_WEEKS`. Kit's email links to it.
- [ ] Week 1 `episodeTitle` (currently the series title "The Reversal").
- [ ] `LATEST_EPISODE_YT_ID` after each upload. While empty, `/podcast/` shows the iHeart player.
- [ ] `SERIES_WEEKS[].theme` lines (empty lines are not rendered).
- [ ] Review the short UI labels Claude Code wrote (listed under Decisions) against the house rules.

## Tasks

- [x] P0-1 `/give/`: commit `8d57749`. Not live. Copy as specified; `GIVE_URL` is in `site-content.ts`; "Give" link added to the footer (Listen column). Files: `src/app/give/page.tsx`, `src/lib/site-content.ts`, `src/components/site/site-chrome.tsx`.
- [x] P0-2 `/study/` + Worker `eryeza-study`: commit `8d57749`. Not live; **blocked** on NEEDS-OWNER (Kit key and form id, D1 creation, deploy go-ahead). Page: `src/app/study/page.tsx`, `src/components/site/study-signup.tsx`. Worker: `worker/study.ts`, `worker/study.wrangler.toml`, `worker/study-schema.sql`, `worker/README.md`. Same-origin route `eryezakalalu.com/api/study*` (and `www.`), so no CORS and no `connect-src` change. Beehiiv path: **not decided yet** (see NEEDS-OWNER). The code supports both paths.
- [x] P0-3 `/podcast/`: commit `8d57749`. Not live. YouTube facade on `youtube-nocookie.com` (the iframe loads only on press); RSS episode list with in-page audio; `SERIES_WEEKS` run; study-guide block; platforms. Podcast is in the nav between Books and About, and every nav anchor is now `/#...` so it works from any route. Files: `src/app/podcast/page.tsx`, `src/components/site/podcast-parts.tsx`, `public/_headers`.
- [x] P0-4 Editions: commit `8d57749`. Not live. Reader Edition, "Instant digital delivery.", "Launch price until 31 October.", library card "Out now / Volume I". The launch line, tier prices, the two-ways card and the sticky bar switch to full prices at 2026-11-01 00:00 EAT via an inline date check (`<html data-price-phase="full">`). Verified locally by forcing the phase. `grep -rniE "pre-order|30 sept" src` returns nothing.
- [x] P0-5 Small fixes: commit `8d57749`. Not live. Sitemap (4 URLs), `llms.txt` (new routes and pricing, stale `#book` / `#excerpt` anchors fixed), per-route canonical, OG and Twitter metadata, JSON-LD `PodcastSeries.webFeed` and a `DonateAction` on the Person node, Book offers set to InStock with `priceValidUntil` 2026-10-31.

## Phase 0 acceptance

- [ ] `/give/`, `/study/`, `/podcast/` return their own pages **on the live site**. Locally (`wrangler dev` on `dist/public`) each returns its own title and canonical.
- [ ] Study form end to end (D1 row, Kit subscriber and tags, Beehiiv path). Blocked on NEEDS-OWNER. Locally the error state was checked (no Worker behind `/api/study`).
- [ ] No CSP errors. Locally: none on `/give/` or `/study/`. `/podcast/` and the home page had **media-src errors that are also on the live site today** (episode audio blocked); fixed, audio now loads. Re-check on live.
- [ ] Lighthouse mobile ≥ 90 performance and ≥ 95 accessibility: see below.
- [x] No "Pre-order" or "30 September" in `src`.
- [ ] Worker Version IDs: pending deploy.

### Lighthouse (local, mobile emulation)
Lighthouse numbers are not final. Local runs are inflated: Lighthouse warns this machine's CPU is slower than it expects, and the first run hit a trace error. Mobile, before the fixes below: give 62 / a11y 96, study 63 / 96, podcast 60 / 95 / best-practices 79 (iHeart third-party cookies). Fixed after that run: masthead "Pastor · Author" contrast (gold-400 3.73:1 → gold-500 5.80:1) and a logo link label mismatch. Both were live on the home page too. A same-machine baseline against the live home page is still running; re-measure on the live URLs with PageSpeed Insights after deploy. Open item on /podcast/: heading-order.

## Decisions made by Claude Code

- **Same-origin `/api/study` via a Worker route** on `eryeza-study`, not a change to `ccndaily-books`. Cloudflare runs route Workers before custom-domain Workers, so the live site Worker stays assets-only.
- **Masthead, footer and episode list extracted** to `src/components/site/site-chrome.tsx`, so `/give/`, `/study/` and `/podcast/` share them with the home page.
- **`/#privacy` opens the privacy modal.** There was no privacy section, and the cookie-banner link pointed nowhere. The footer, the cookie banner and the `/study/` privacy line all use it.
- **CSP `media-src` += `https://anchor.fm https://*.cloudfront.net`.** RSS enclosures 302 from anchor.fm to CloudFront, and the live site was blocking every in-page player.
- **YouTube as a click-to-load facade** (poster from `i.ytimg.com`, already covered by `img-src https:`), to keep mobile performance above 90.
- **Gutters stay at the site's existing 24 px** on mobile (wider than the 16 px minimum), for consistency with the home page.
- **Study week and series "released" state are re-checked in the browser**, so week links appear at 8 PM EAT on each Sunday without a rebuild, provided the `STUDY_WEEKS` entry was in the last build.
- **Kit tags `week-N` are find-or-create by name** (Kit v4 returns the existing tag). `KIT_TAG_STUDY` and `KIT_TAG_LETTER` are optional overrides.
- **Worker answers `{ ok: true }` once the D1 row is stored** and finishes the Kit and Beehiiv calls in `waitUntil`, so a slow provider never stalls the reader. Statuses are written back to the row.
- **Rate limit counts per salted IP hash** (`study_rate` table); raw IPs are never stored.
- **Commits:** one commit covers all of P0-1 to P0-5 because the tasks share `site-content.ts`, `globals.css` and `layout.tsx`.
- **UI labels written by Claude Code** (not in the handoff; please review): footer "Study guide" and "Give"; study form error "That did not go through. Please try again in a moment." and the validation messages in `worker/study.ts`; study success card CTA "Get the book"; `/podcast/` headings "The current series", "The Influential Spirit, in eight weeks", "This week's study guide", button "Get the free guide", chip "Latest episode", link "Study guide for week N"; editions CTAs "Buy via Payhip →" and "Buy via Selar →"; sticky bar eyebrow "Out now"; Day 1 reader CTA "Get the book".
- **Existing home-page copy left as is** although it breaks house rules (weekday-as-work "Monday" in `THIRTY_DAYS`, `THE_DAYS`, `FAQ` and `SPEAKING.howParas`; "Sit with" in `THIRTY_DAYS.eyebrow`; figurative "carry" in `SPEAKING.howParas`). This is P1-3, where Cowork supplies the replacement diff.
