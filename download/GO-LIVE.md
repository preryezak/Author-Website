# Go Live: eryezakalalu.com (Cloudflare Pages + Worker)

The site is hosted on **Cloudflare Pages** (connected to the GitHub repo `preryzakak/Author-Website`), and the speaking-form email is handled by a **Cloudflare Worker** that calls the Resend API. This guide reflects that architecture.

**File in this folder:** `eryezakalalu-site.tar.gz` (2.8 MB) — the deploy-ready Next.js 16 project (all 13 rounds of refinements).

The sandbox cannot push to GitHub for you (no git credentials here). So: **you download the bundle, push to GitHub, Cloudflare Pages auto-deploys, the Worker handles the form.** Four steps, ~15 minutes.

---

## Step 1 — Download + push to GitHub

1. Download `eryezakalalu-site.tar.gz` from this folder.
2. On your machine:
   ```bash
   mkdir eryezakalalu-site && cd eryezakalalu-site
   tar -xzf /path/to/eryezakalalu-site.tar.gz
   git init
   git remote add origin https://github.com/preryezak/Author-Website.git
   git add -A
   git commit -m "Relaunch eryezakalalu.com as Next.js 16 — Neo-Monastic Editorial, conversion-first"
   git push -u origin main --force   # replaces the old Vite project
   ```

## Step 2 — Cloudflare Pages build

Cloudflare Pages is already connected to your repo. On push, it rebuilds. For Next.js on Cloudflare Pages, the build uses `@cloudflare/next-on-pages`:

1. **Cloudflare Dashboard → Pages → your project → Settings → Build & deployments:**
   - Build command: `npx @cloudflare/next-on-pages@latest`
   - Build output directory: `.vercel/output/static`
   - (If Cloudflare auto-detects Next.js, it may set these for you.)
2. **Environment variables** (Settings → Environment variables):
   - `NEXT_PUBLIC_SPEAKING_ENDPOINT` = the URL of your Cloudflare Worker (e.g. `https://speaking-worker.your-subdomain.workers.dev`, or a custom route like `https://eryezakalalu.com/worker/speaking` once you wire the route). **If you leave this unset, the form falls back to `/api/speaking` (the Next.js route), which won't persist on the edge — so set the Worker URL.**
3. Push (or trigger a redeploy) → Cloudflare builds + deploys to `*.pages.dev` + your custom domain.

> **`next.config.ts` note:** the project ships with `output: "standalone"`. Cloudflare's `@cloudflare/next-on-pages` adapter overrides the output, so this is harmless. If the build complains, change `output` to `null` or remove the line — but it usually just works.

## Step 3 — The Cloudflare Worker (speaking form → Resend)

The full Worker code is in the **`worker/`** folder of the bundle (`speaking.ts` + `wrangler.toml` + `schema.sql` + `README.md`). It's a single-file Worker with zero npm dependencies — it calls Resend via `fetch`, so it runs on the standard Cloudflare Workers runtime (no `nodejs_compat` needed).

**Deploy the Worker (3 commands):**
```bash
cd worker
wrangler login
wrangler secret put RESEND_API_KEY   # paste your free key from resend.com/api-keys
wrangler deploy
```
`wrangler deploy` prints the Worker URL (e.g. `https://eryeza-speaking.<your-subdomain>.workers.dev`).

**Optional D1 storage** (so submissions persist in a database, not just email):
```bash
wrangler d1 create eryeza-speaking-db
# copy the printed database_id into wrangler.toml (uncomment the [[d1_databases]] block)
wrangler d1 execute eryeza-speaking-db --file=schema.sql --remote
wrangler deploy
```

**What the Worker does:**
- Accepts the form POST (the 8 sections' fields: name, email, phone, organisation, role, country, city, eventName, gatheringType, eventDate, altDate, location, format, attendance, sessions, duration, speakAbout, contribute, audience, leaveWith, themeOutcome, honorarium, budget, travel, accommodation, logistics, recorded, photosVideo, contentUse, booksInterest, booksInfo, anythingElse, howFound, referrer).
- Validates `name` + `email` + `eventName` + `speakAbout`.
- Calls Resend (`POST https://api.resend.com/emails` with `Authorization: Bearer <RESEND_API_KEY>`) to send a branded HTML notification to `speaking@eryezakalalu.com` with `replyTo` = the submitter's email. The email is organized under the same 8 headings.
- (Optional) Stores the submission in Cloudflare D1.
- Returns `{ ok: true, emailed: boolean }`.
- Sets CORS (`Access-Control-Allow-Origin: https://eryezakalalu.com`) so the browser fetch works cross-origin.

**Worker env** (set in `wrangler.toml` `[vars]` or the dashboard):
- `RESEND_API_KEY` (secret, via `wrangler secret put`)
- `SPEAKING_EMAIL` = `speaking@eryezakalalu.com`
- `RESEND_FROM` = `onboarding@resend.dev` (until you verify eryezakalalu.com on Resend, then `speaking@eryezakalalu.com`)
- `ALLOWED_ORIGIN` = `https://eryezakalalu.com`

Full details in `worker/README.md`.

## Step 4 — Point eryezakalalu.com at Cloudflare Pages

1. Cloudflare Dashboard → your domain → **DNS**: ensure the Pages project is the apex (`eryezakalalu.com`) + `www`. Cloudflare auto-adds a `CNAME` to `*.pages.dev` when you connect the custom domain in Pages → Custom domains.
2. SSL is automatic (Cloudflare issues it).
3. If you have the old `books.theccndaily.com` subdomain, add a redirect rule (Cloudflare → Rules → Redirect Rules) to `https://eryezakalalu.com`.

---

## Why the Next.js `/api/speaking` route is the sandbox fallback

The Next.js `/api/speaking` route (in `src/app/api/speaking/`) uses Prisma + SQLite + the `resend` npm package. This works in the sandbox (Node + a local SQLite file). On Cloudflare Pages edge, SQLite file storage won't persist and the `resend` Node package may need `nodejs_compat`. That's why you're using a dedicated Worker for production — the Worker is the right place for Resend + D1 storage. The Next.js route is there for local dev / the sandbox preview; in production the form posts to the Worker (`NEXT_PUBLIC_SPEAKING_ENDPOINT`).

If you'd rather keep everything in the Next.js route on Cloudflare (no separate Worker), you can: set `nodejs_compat = true` in the Pages project, swap Prisma SQLite for Cloudflare D1 (via `@prisma/adapter-d1`), and call Resend via `fetch` (not the npm package). The Worker approach you've chosen is simpler.

---

## Post-launch checklist

- [ ] `https://eryezakalalu.com/` loads the hero with your portrait + name tag
- [ ] Masthead nav smooth-scrolls (The Influential Spirit, Speaking, Letter, Books, About)
- [ ] Featured Book shows the real cover in the device frame + the standout callout
- [ ] Day 1 collapsible reader opens + scrolls (Mark 1:17, prayer, declaration)
- [ ] Editions accordion: USD (Payhip) + UGX (Selar) tiers toggle
- [ ] Speaking section: ES wordmark → gradient Invite card → quote → presentation → subtle Invite → 8-step form
- [ ] Submit a test speaking form → check it lands in the Worker → email arrives at speaking@eryezakalalu.com
- [ ] Newsletter Beehiiv iframe loads (Eryeza Writes, with the EW monogram)
- [ ] Podcast iHeart player + 6 platform cards
- [ ] Privacy modal opens from the footer Privacy button
- [ ] Cookie banner appears once, dismissible, remembers the choice
- [ ] Footer: gold EK monogram visible on dark, columns, emails, Privacy button
- [ ] Mobile (<1024px): burger drawer opens, footer collapses, no horizontal overflow
- [ ] `curl -sI https://eryezakalalu.com/ | grep content-security-policy` returns the CSP header

## To edit copy after launch

Almost all text lives in `src/lib/site-content.ts`. Change a string, push to GitHub, Cloudflare Pages redeploys automatically. The Featured Book is data-driven (`FEATURED_BOOK`) so swapping in your next book later is a one-object change.
