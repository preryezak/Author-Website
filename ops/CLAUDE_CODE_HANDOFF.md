# Claude Code Handoff: eryezakalalu.com, Phase 0 and Phase 1

**From:** Claude (Cowork), who runs point on the Devotion in Season / The Influential Spirit launch
**To:** Claude Code, working in the local clone of `github.com/preryezak/Author-Website`
**Owner:** Eryeza Kalalu. Every push and deploy needs his explicit go-ahead in the session.
**Date:** 1 Oct 2026 · **Deadline for Phase 0:** live before **Sun 4 Oct 2026, 8:00 PM EAT** (17:00 UTC), when Week 1 of the podcast airs and starts sending listeners to these pages.

---

## How to use this file (for Eryeza)

1. Open a terminal in your local `Author-Website` folder and start Claude Code.
2. Paste the prompt below. It tells Claude Code to read this file from the repo root, so save the file there first as `ops/CLAUDE_CODE_HANDOFF.md`.
3. Approve pushes and deploys when Claude Code asks.

```
Read ops/CLAUDE_CODE_HANDOFF.md and ops/HOUSE_RULES.md completely before doing anything.
Work through Phase 0 in order. After each task, update ops/STATUS.md (create it if missing)
with: task id, what changed, files touched, commit SHA, and anything blocked.
Commit to a branch named launch/phase-0, show me a local preview (npm run build, then
serve dist/public), and only after I approve, merge to main, push, and run
npx wrangler deploy. Record the Worker Version ID in ops/STATUS.md and push that too.
Ask me for any value marked NEEDS-OWNER. Never commit secrets.
```

---

## 0. Ground truth about this repo (verified 1 Oct 2026 from `main` @ 619b23e)

- **Stack:** Next.js static export (`output: "export"`, `trailingSlash: true`). `npm run build` runs `next build && node scripts/postbuild.mjs`, which mirrors `out/` to `dist/` and `dist/public/`.
- **Deploy:** `npx wrangler deploy` from the repo root. Worker name `ccndaily-books` serves `dist/public` and holds the custom domains `eryezakalalu.com` and `www.eryezakalalu.com`. **A git push does not deploy**; there is no CI.
- **Routing:** `not_found_handling = "single-page-application"`, so any unknown path (e.g. `/give/`) currently serves the **home page**. New routes must be real `src/app/<route>/page.tsx` folders.
- **Content source:** almost all copy lives in `src/lib/site-content.ts`. The page is `src/components/site/site-page.tsx` (single long page; section ids: `top`, `influential-spirit`, `author`, `thirtydays`, `day-one`, `editions`, `reviews`, `questions`, `books`, `letters-preview`, `podcast`, `letter`, `about`, `speaking`, `invite-form`).
- **Feeds:** `src/lib/rss.ts` reads at build time. Letters come from `https://rss.beehiiv.com/feeds/m7Wi8T8MXS.xml`; episodes from `https://anchor.fm/s/f7311ecc/podcast/rss` (working). **Episodes only update on rebuild.** See task P1-6.
- **Headers/CSP:** `public/_headers`. CSP currently allows Beehiiv and iHeart only, and `form-action 'self'`. Any new third-party origin (YouTube embed, Kit, Cloudflare Analytics) must be added there.
- **Existing Worker pattern:** `worker/` (`eryeza-speaking`, D1-backed, `ALLOWED_ORIGIN` check). Copy this pattern for the study-guide Worker.
- **Design tokens:** `src/app/globals.css` (Kalalu system: paper ramp, ink #1E1A16, oxblood #7B3F2E, forest #3A4A3F, gold #B8925A; Newsreader, Source Serif 4, DM Sans via `next/font`). The podcast surface uses the **forest** accent (DIS seal: `public/brand/dis-mark.svg`).
- **Prior docs:** `README.md` (operations guide) and `HANDOFF.md` (21–22 Sep hardening report). Read both.

## 1. Rules for every change

- Follow `ops/HOUSE_RULES.md` for **all copy** (supplied separately). No em-dashes, no "not X, it's Y" lines, no banned words, and no weekday names used to mean work.
- **Don't invent copy.** Use the copy in this file. Where copy is marked `NEEDS-OWNER` or `FROM-COWORK`, put in a clearly marked placeholder and log it in STATUS.md.
- Keep the accessibility standards from `HANDOFF.md`: contrast AA, the two-tone focus ring, `prefers-reduced-motion`, alt text, and labelled form fields.
- Keep performance: no new client JS libraries for these pages; images as WebP with width and height set.
- Mobile first: 375 px width, 16 px gutters, no horizontal scroll.
- **Never commit secrets.** API keys go in `wrangler secret put`.
- Update `public/sitemap` / `src/app/sitemap.ts` and `public/llms.txt` for every new route.

---

## PHASE 0: must be live before Sun 4 Oct, 8 PM EAT

### P0-1 · `/give/` page
- **Route:** `src/app/give/page.tsx`, using the site's existing layout, masthead and footer.
- **Copy** (use exactly):
  - Eyebrow: `Support the ministry`
  - H1: `Help this teaching reach one more person`
  - Body: `Devotion in Season and the daily devotionals are free to everyone who listens. Your gift covers recording, editing, hosting and the hours of study behind every episode, and helps these messages reach working believers in Uganda and around the world.`
  - Primary button: `Give through Flutterwave`, linking to **`GIVE_URL` = `https://flutterwave.com/donate/h2tj4bfhltce`** (Eryeza's Flutterwave donation page, supplied 1 Oct 2026). Opens in a new tab with `rel="noopener noreferrer"`.
  - Small print: `Payments are processed securely by Flutterwave. You'll receive a receipt by email.`
  - Secondary block: `Prefer to support by reading?` + button `Get The Influential Spirit` → `/#editions`
- Put `GIVE_URL` in `site-content.ts` as one constant so scripts and pages share it.
- `flutterwave.com` is a top-level navigation (new tab), so no CSP change is needed.
- Add `/give/` to the footer.

### P0-2 · `/study/` page + study-guide Worker
**Purpose:** the free weekly study guide that every episode points to. It builds the email list in **Kit**, with an optional, unticked opt-in to the **Beehiiv** letter (letter.eryezakalalu.com).

**Page (`src/app/study/page.tsx`):**
- Eyebrow: `Free weekly study guide`
- H1: `Take this week's episode deeper`
- Lede: `Each Sunday's episode of Devotion in Season comes with a short guide: the passages, five questions for personal or group study, one practice for the week, and a prayer. Free, every week of the series.`
- "This week" card: the guide cover image `public/study/covers/week-N.webp` (FROM-COWORK), the week title and episode title. Drive it from a `STUDY_WEEKS` array in `site-content.ts` (fields: `week`, `title`, `episodeTitle`, `releaseDate` (ISO), `pdfPath`, `cover`). The card shows the latest entry whose `releaseDate` ≤ today, with a build-time fallback to week 1.
- Form fields: First name (required), Email (required), checkbox **unticked by default**: `Also send me Eryeza's letter: personal updates and new writing.` Button: `Send me the guide`.
- Success state (no page reload): `Check your inbox. This week's guide is on its way.`, then a book card: `The whole argument of this series is in The Influential Spirit.` → `/#editions`.
- Privacy line under the form: `One email a week with the guide. Unsubscribe any time.`, linking to the existing privacy section.

**Worker `worker/study.ts` (new, name `eryeza-study`, same pattern as `speaking.ts`):**
- `POST /` JSON `{ firstName, email, letterOptIn: boolean, week: number, website: "" }`. `website` is a honeypot: reject if it's filled.
- Validate the email format. Check the `Origin` matches `ALLOWED_ORIGIN`. Allow at most 5 posts per IP per hour (a D1 or KV counter).
- **Kit API v4:** upsert the subscriber (`POST https://api.kit.com/v4/subscribers`, header `X-Kit-Api-Key`), then add them to form **`KIT_FORM_ID` (NEEDS-OWNER)** so Kit's incentive/automation sends the guide, and tag them `study-guide` and `week-{N}`. If `letterOptIn`, also tag `letter-optin`.
- **Beehiiv (only if `letterOptIn`):** `POST https://api.beehiiv.com/v2/publications/{BEEHIIV_PUB_ID}/subscriptions` with `{ email, reactivate_existing: false, send_welcome_email: true, utm_source: "study-guide" }`, `Authorization: Bearer BEEHIIV_API_KEY`. **Check first** that Eryeza's Beehiiv plan includes API access. If it doesn't, skip this call; Cowork will export the `letter-optin` tag weekly for a manual import instead. Log which path applies in STATUS.md.
- Store every submission in D1 (`study_signups`: createdAt, email, firstName, week, letterOptIn, kitStatus, beehiivStatus) **before** calling the APIs, so nothing is lost.
- Return `{ ok: true }` or `{ ok: false, error }`. Never leak API errors to the client.
- Secrets via `wrangler secret put`: `KIT_API_KEY`, `BEEHIIV_API_KEY` (if used). Vars: `KIT_FORM_ID`, `KIT_TAG_STUDY`, `KIT_TAG_LETTER`, `BEEHIIV_PUB_ID`, `ALLOWED_ORIGIN`.
- The site posts to `NEXT_PUBLIC_STUDY_ENDPOINT`. Prefer a same-origin route `eryezakalalu.com/api/study` bound to this Worker, which removes the need for CORS and a CSP change; otherwise add the workers.dev URL to `connect-src`.
- **Guide PDFs** live in `public/study/` with unguessable names, e.g. `week-1-the-reversal-7f3k.pdf` (FROM-COWORK). Kit's delivery email links to them.

### P0-3 · `/podcast/` page
- **Route:** `src/app/podcast/page.tsx`, in the forest/DIS podcast surface already used by `#podcast`.
- H1: `Devotion in Season`
- Lede: `A weekly conversation for believers at work and in business, every Sunday at 8 PM East Africa Time, and a short daily devotional every weekday morning at 6 AM. The current series walks through the themes of The Influential Spirit.`
- **Latest episode:** a YouTube embed (`youtube-nocookie.com`). The video ID comes from the constant `LATEST_EPISODE_YT_ID` (FROM-COWORK after each upload). Add `https://www.youtube-nocookie.com` to `frame-src` in `_headers`. Below it, reuse the existing RSS episode list and the in-page audio player from the home page.
- **Series run:** a list of 8 weeks from `SERIES_WEEKS` in `site-content.ts` (title, Sunday date, theme line, study-guide link once released). Copy is FROM-COWORK; the structure comes now, with the 8 titles below.
- **This week's study guide** block → `/study/`.
- **Listen on:** reuse `podcastPlatforms` from `site-content.ts`.
- Add **Podcast** to the main navigation between `Books` and `About`. Nav items are currently anchors; make Podcast a route link and keep the anchors working from other pages (`/#about`, etc.).

Series titles for `SERIES_WEEKS` (Sunday dates, EAT):
| Week | Sunday | Title |
| --- | --- | --- |
| 1 | 2026-10-04 | The Reversal |
| 2 | 2026-10-11 | Pressure and Shortcuts |
| 3 | 2026-10-18 | Your Work Is the Sermon |
| 4 | 2026-10-25 | Would Outsiders Vouch for You? |
| 5 | 2026-11-01 | Visibility Is Not Credibility |
| 6 | 2026-11-08 | The Message and the Messenger |
| 7 | 2026-11-15 | The Grace That Doesn't Excuse |
| 8 | 2026-11-22 | Restoration Without Amnesia |

### P0-4 · Editions block: book is out now, launch price until 31 Oct
In `site-content.ts` (`editions` and related):
- Rename `Digital Pre-order Edition` → `Reader Edition`.
- Remove every "Pre-order", "PDF and EPUB delivered 30 September" and "Digital delivery 30 September 2026". Replace them with `Instant digital delivery.`
- Keep launch prices **$12 / $23 / $39** and **UGX 36,000 / 72,000 / 120,000** with the struck-through full prices, and add a line: `Launch price until 31 October.`
- **Automatic switch:** from **2026-11-01 00:00 EAT**, show full prices **$15 / $29 / $49** and **UGX 45,000 / 90,000 / 150,000** and hide the launch line. Do this with a tiny client-side date check over both price sets rendered in the HTML, so the switch doesn't depend on a rebuild. Server-render the launch prices until then.
- Library card: change `status: "Pre-order", caption: "30 Sept 2026"` to `status: "Out now", caption: "Volume I"`.
- **Leave the Payhip and Selar URLs as they are.** NEEDS-OWNER: confirm they point at the live, non-pre-order products.

### P0-5 · Small fixes
- Add `/give/`, `/study/` and `/podcast/` to the sitemap and `llms.txt`.
- JSON-LD: add `PodcastSeries.webFeed = https://anchor.fm/s/f7311ecc/podcast/rss` (verified working) and a `DonateAction` pointing at `/give/`.
- OG metadata for each new route (title, description, the existing `og.png`).

**Phase 0 acceptance (Claude Code checks each, logs in STATUS.md):**
- [ ] `/give/`, `/study/` and `/podcast/` return their own pages (not the home page) on the live site
- [ ] The study form submits end to end: the D1 row exists, the Kit subscriber exists with its tags, and the Beehiiv path behaves as logged
- [ ] No CSP errors in the browser console on any page
- [ ] Lighthouse on mobile: Performance ≥ 90, Accessibility ≥ 95 on all three new pages
- [ ] No "Pre-order" or "30 September" left anywhere (`grep -ri "pre-order\|30 sept" src`)
- [ ] The Worker Version ID is recorded in STATUS.md

---

## PHASE 1: next two weeks (start after Phase 0 is live)

- **P1-1 · `/the-influential-spirit/` landing page** in the **book's** brand (Deepest Navy #111828, Charcoal #1E293B, Kingdom Gold #C5A059, Parchment #F7F4EF; Playfair Display, EB Garamond, Inter), scoped so it doesn't leak into the author site. Port the structure from the GenSpark export: `site-build/repo-files/client/src/pages/InfluentialSpiritPage.tsx` in the zip Eryeza has (ask him to drop it at `ops/genspark/`). Its sections move here from the home page (why, what you'll discover, the 30 days, Day 1, editions, FAQ). The home page keeps a short feature card that links here. Final copy is FROM-COWORK.
- **P1-2 · Episode pages** `/podcast/week-N/`: generated from `SERIES_WEEKS` plus `content/episodes/week-N.md` (FROM-COWORK: show notes, chapters, full transcript, sources). Add `PodcastEpisode` JSON-LD and link each page to its study guide.
- **P1-3 · Copy clean-up.** Cowork supplies a reviewed replacement `site-content.ts` diff that removes the AI-sounding lines. Apply it as given.
- **P1-4 · Measurement:** Cloudflare Web Analytics (the beacon needs a CSP update), plus UTM-friendly outbound links. Don't strip query strings.
- **P1-5 · Port the remaining GenSpark pages** (Books, Letter, Speaking, About) as real routes, keeping home-page anchors working.
- **P1-6 · Fresh episodes without a manual rebuild:** a Cloudflare Cron Trigger or GitHub Action that rebuilds and deploys every Sunday at 17:30 UTC and every weekday at 03:30 UTC (30 minutes after release). Needs a deploy token. Discuss it with Eryeza before setting it up.
- **P1-7 · Search Console:** add the DNS TXT or HTML verification file when Eryeza provides it.

---

## Hand-back protocol (so Cowork can verify without asking you)

- Keep **`ops/STATUS.md`** updated and pushed. Cowork reads the public repo after every push.
- Format per task: `- [x] P0-1 /give/ — commit abc1234 — live 2026-10-03 14:10 EAT — notes`
- List **NEEDS-OWNER** values still missing at the top of STATUS.md.
- Anything you decide that this file doesn't cover goes under `## Decisions made by Claude Code`, with a one-line reason.
