# Phase 0 status

Branch `launch/phase-0` · base **`abab44c`** (the live code, see below) · last updated 2026-10-02 (EAT)
**Not live yet.** Nothing has been merged, pushed or deployed; that waits for Eryeza's go-ahead.

## Read this first: the live site was not in GitHub

`main` on GitHub (`619b23e`) is **not** what eryezakalalu.com serves. AutoClaw built three more commits on
22–23 Sep and deployed them (`ccndaily-books` version `8bd8a955`, 2026-09-23 09:58 UTC) without pushing:
`2161382` (real routes, Give button, click tracking), `f97e881` (polish pass), `abab44c` (speaking-form
native email). Source found at `C:\Users\user\.openclaw-autoclaw\workspace\.cluster\pickup-95a292f8\Author-Website`.
Phase 0 is built **on top of those commits**, so deploying it keeps everything live today. Merging to `main`
will publish those three commits to GitHub for the first time.

A first attempt built on `619b23e` is kept locally as branch `launch/phase-0-v1-on-619b23e` (not for use).

## Still missing

### NEEDS-OWNER (Eryeza)
- [x] **Kit plan**: free (Newsletter) plan (Eryeza, 2 Oct). It has no API and no automations, so there is **no `KIT_API_KEY`**. The Worker submits to the form's public subscribe address instead (what Kit's embed code does); the form's confirmation email delivers the guide; the weekly guide goes out as a Kit broadcast to that form's subscribers. Tags (`study-guide`, `week-N`, `letter-optin`) are API-only and are not used on this plan; D1 holds week and opt-in per sign-up.
- [ ] **`KIT_FORM_ID`**: Eryeza creates the form in Kit (steps given in the session on 2 Oct) and sends the number from its address. Until then sign-ups are stored in D1 but no guide email goes out.
- [x] **Beehiiv**: plan includes API access (Eryeza, 1 Oct). `BEEHIIV_PUB_ID = pub_c9f06833-61ef-4c33-a6ef-b571a5fd3304` is set in `worker/study.wrangler.toml` (an id, not a secret).
- [ ] **`BEEHIIV_API_KEY`**: Eryeza runs `npx wrangler secret put BEEHIIV_API_KEY -c worker/study.wrangler.toml` (Beehiiv → Settings → API). Without it, opt-ins are kept in D1 (`letterOptIn = 1`) for a manual import.
- [x] **Payhip / Selar URLs**: confirmed live (Eryeza, 1 Oct). Unchanged.
- [ ] **Go-ahead** to: create D1 `eryeza-study-db`; deploy `eryeza-study` (adds route `eryezakalalu.com/api/study*`); merge `launch/phase-0` to `main` and push; deploy `ccndaily-books`.
- [x] **Privacy notice**: Eryeza approved (2 Oct) adding the study-guide sign-up; done (Kit, optional Beehiiv, hashed address for abuse limits, unsubscribe from any email). Commit `cb038a0`.
- [x] **`/study` renamed `/resources`** at Eryeza's request (2 Oct), with a menu item between Podcast and About. `/study`, `/study/` and `/study/*` redirect (301) to `/resources/`, so links that already say eryezakalalu.com/study keep working. Cowork: use eryezakalalu.com/resources in new copy (the house rules section 6 still says /study).

### FROM-COWORK
- [ ] `public/resources/covers/week-1.webp` (3:4 WebP). Until it exists the card shows the DIS seal panel.
- [ ] Week 1 guide PDF at an unguessable path, e.g. `public/resources/week-1-the-reversal-7f3k.pdf`; set `pdfPath` in `STUDY_WEEKS`. The Kit form's confirmation email links to it (update that link each Sunday).
- [ ] Week 1 `episodeTitle` (currently the series title).
- [ ] `LATEST_EPISODE_YT_ID` after each upload (until then `/podcast/` offers the iHeart player).
- [ ] `SERIES_WEEKS[].theme` lines.
- [ ] Review the UI labels Claude Code wrote (Decisions, below).
- [ ] P1-3 copy: existing copy that breaks the house rules is listed under Decisions.

## Tasks

- [x] P0-1 `/give/` — commit `9eba33c` — not live. Handoff copy exactly (`GIVING` in `site-content.ts`, `GIVE_URL` alias). The button is AutoClaw's `GiveButton`, so give clicks are still recorded. Give is in the menu, footer and contact page.
- [x] P0-2 `/resources/` (was `/study/`) + Worker `eryeza-study` — commits `9eba33c`, `cb038a0` — not live, **blocked** on the Kit form id and deploy go-ahead. Same-origin route, so no CORS or CSP change. Beehiiv path: **API** (pub id set; key pending). Worker tested locally: origin check, honeypot, validation, 6th post in an hour blocked, D1 row written before provider calls, statuses written back.
- [x] P0-3 `/podcast/` — commit `9eba33c` — not live. Handoff copy; latest episode loads on press (YouTube when `LATEST_EPISODE_YT_ID` is set, iHeart until then); RSS list with in-page audio; 8-week run (study link appears per week at 8 PM EAT Sunday, no rebuild); study block; platforms. **Podcast is in the menu between Books and About.**
- [x] P0-4 Editions — commit `9eba33c` — not live. Reader Edition; "Instant digital delivery."; "Launch price until 31 October."; library card "Out now / Volume I"; "Buy via Payhip/Selar". Full prices appear automatically from 2026-11-01 00:00 EAT (inline check sets `<html data-price-phase="full">`), verified locally by forcing the phase. `grep -rniE "pre-order|30 sept" src` → nothing.
- [x] P0-5 — commit `9eba33c` — not live. Sitemap lists all 11 routes; `llms.txt` rewritten for real routes and current pricing; canonical/OG on new routes; JSON-LD `PodcastSeries.webFeed` and `DonateAction`; Book offers `InStock` with `priceValidUntil`.

### Also delivered (Eryeza's 1 Oct requests)
- **Every menu item is its own page**: Home `/`, `/influential-spirit/`, `/speaking/`, `/letter/`, `/books/`, `/podcast/`, `/about/`, `/give/` (plus `/study/`, `/contact/`, `/privacy/`; unknown paths get a real 404). Kept AutoClaw's live URLs (`/influential-spirit/`, not `/the-influential-spirit/`) so existing links keep working.
- **Home page performance** (target 100): see Lighthouse below.

## Phase 0 acceptance

- [ ] Routes on the **live** site. Locally all 11 return their own title; `/nope/` returns 404.
- [ ] Study form end to end on live (needs Kit key/form id).
- [ ] No CSP errors on live. Locally none; the in-page audio CSP block that is live today is fixed.
- [ ] Lighthouse mobile ≥ 90 / ≥ 95 on live URLs (PageSpeed Insights after deploy).
- [x] No "Pre-order" or "30 September" in `src`.
- [ ] Worker Version IDs: pending deploy.

### Lighthouse

Reference, **PageSpeed Insights on the live home page today** (Google hardware, mobile, 2 Oct 02:36 EAT):
Performance **86**, Accessibility **95**, Best Practices **92**, SEO **100**; FCP 2.6 s, LCP 3.6 s, TBT 0 ms, CLS 0.016.
PSI's top item: render-blocking requests (est. 2.17 s).

This machine's CPU benchmarks at ~600 (Lighthouse expects much faster), so local blocking-time numbers are
inflated several-fold (the same live page scored 29–50 locally against 86 on PSI). Local runs below use
Lighthouse's calibrated 2× CPU setting; read FCP/LCP and the non-performance categories, not TBT.

New build, local, mobile, 2× (2 Oct): **home** A11y 100 · BP 100 · SEO 100 · FCP 1.5 s · LCP 1.9 s (live: 2.6 s / 3.6 s on PSI).
All 11 pages: Accessibility 100, SEO 100; Best Practices 100 except `/letter/` (79: the Beehiiv form iframe sets
third-party cookies; the form is that page's purpose, so it stays).

What changed for speed: home rebuilt as server-rendered sections (was one 950-line client component); fonts 22 → 5
files with no preloads; Tailwind scans only `src/app`, `src/components/site`, `src/lib` (CSS 175 KB → 97 KB);
unused Toaster removed; iHeart player loads on press; no preconnects; cookie notice painted with the page; the
"on air" pulse animates on the compositor. Tried and reverted: `content-visibility` (no gain, broke contrast
measurement) and inlined CSS (doubled the HTML).

## Decisions made by Claude Code

- **Built on AutoClaw's unpushed live commits** rather than `619b23e`, so the deploy cannot roll back live features.
- **Kept `/influential-spirit/`** (live URL) instead of P1-1's `/the-influential-spirit/`.
- **Same-origin `/api/study` via a Worker route** on `eryeza-study`; `ccndaily-books` stays assets-only.
- **Worker URLs as code defaults** (`ENDPOINTS` in `site-content.ts`); the live build had them only from the shell, so a plain rebuild would have broken the speaking form and give tracking.
- **`/privacy/` is a real page**; the cookie notice (now on every page) links to it.
- **CSP**: `media-src` += `https://anchor.fm https://*.cloudfront.net` (episode audio was blocked live); `frame-src` += `https://www.youtube-nocookie.com`; `connect-src` keeps the speaking Worker.
- **Kit tags `week-N`** are find-or-create by name; the Worker replies once the D1 row is stored and finishes Kit/Beehiiv in `waitUntil`; rate limit uses a salted IP hash.
- **Kit for the guide, Beehiiv only for opt-ins.** Beehiiv can deliver files (lead-magnet automation), but everyone it delivers to becomes a subscriber of the letter; using it for the guide would break the unticked opt-in.
- **Live bugs fixed on the way**: `/influential-spirit/` buttons linked to `/editions` and `/thirtydays` (404s); doubled title on that page; contrast failures (masthead role 3.73:1, episode dates 4.49:1, fact-row labels 2.53:1); logo link name mismatch; pale Give link on `/contact/`; heading order on `/books/` and `/podcast/`.
- **House-rule copy fixes on AutoClaw text**: removed "uncomfortable" and "quietly" from the `/influential-spirit/` intro; the old `/give/` copy (with "quietly") is replaced by the handoff copy.
- **Gutters stay at the site's 24 px** on mobile.
- **UI labels written by Claude Code** (please review): footer "Resources", "Privacy"; menu "Resources"; `/resources/` error "That did not go through. Please try again in a moment." and the Worker's validation messages; success CTA "Get the book"; `/podcast/` "The current series", "The Influential Spirit, in eight weeks", "This week's study guide", "Get the free guide", "Latest episode", "Study guide for week N"; player button "Load the player" / "Plays the latest episode here, via iHeart"; "Buy via Payhip/Selar →"; sticky bar "Out now"; Day 1 CTA "Get the book".
- **Existing copy left for P1-3** although it breaks house rules: weekday-as-work "Monday" (`THIRTY_DAYS`, `THE_DAYS`, `FAQ`, `SPEAKING.howParas`); "Sit with" (`THIRTY_DAYS.eyebrow`); figurative "carry" (`SPEAKING.howParas`); fragment "No schedule, no noise." (`/letter/`).
