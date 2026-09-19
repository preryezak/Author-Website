# Eryeza Kalalu Author Website — Go-Live Migration Guide

This guide takes the rebuilt, hardened new version of eryezakalalu.com from this sandbox to live on your domain. You (the repo owner) run the git + hosting steps — this sandbox cannot push to GitHub as you, so the final commands are yours to run.

---

## What was built

Two deployable artifacts live in `/home/z/my-project/handoff/`:

1. **`static-site/`** — the *fastest path to live*. A cleaned, path-fixed, security-hardened copy of the Genspark "almost-ready" version. Plain HTML + CSS + JS + real assets (cover.jpg, author.jpg, the EK monogram, the DIS seal). Deploy on any static host. No build step, no framework, no node_modules.

2. **The Next.js 16 project** (in `/home/z/my-project/src/`, `public/`, `next.config.ts`, etc.) — a faithful, modernized reproduction of the same site with server-side RSS proxying, JSON-LD, sitemap.ts/robots.ts, and a single-route App Router build. Currently running in the sandbox Preview Panel.

Both are faithful to the Genspark "almost-ready" version: identical copy, identical Neo-Monastic Editorial design system (paper #F5F0E8 / ink #1E1A16 / gold #B8925A / oxblood #7B3F2E / forest #3A4A3F), identical Newsreader + Source Serif 4 + DM Sans typography, identical content (hero, flagship book, author letter, library, letters feed, podcast strip, reader responses, the 30-day deep-dive, 6 editions, excerpt, 6 reviews, 9 FAQ, what-comes-next, newsletter).

---

## Path A — Fastest: deploy the static bundle (recommended)

The `handoff/static-site/` folder is a complete, deployable static site. Pick one host:

### A1. Vercel (recommended — free, fastest, best for the domain)

```bash
# 1. From your machine, push the static bundle to your GitHub repo
cd /tmp
git clone https://github.com/preryezak/Author-Website.git
cd Author-Website

# 2. Replace the repo contents with the static bundle
#    (copy the contents of handoff/static-site/ from this sandbox into the repo root)
#    Easiest: zip this sandbox's handoff/static-site/ folder, download it, unzip over the repo.
rm -rf client server shared scripts tools patches *.json *.md *.yaml 2>/dev/null
# ...then drop in the static-site files so the repo root IS the site root
git add -A
git commit -m "Launch the Neo-Monastic Editorial author site (Genspark v2, hardened)"
git push origin main

# 3. On vercel.com: New Project → import preryezak/Author-Website → Framework: Other → Output: . → Deploy
#    Vercel reads vercel.json (already in the repo) for clean URLs + security headers.

# 4. Settings → Domains → add eryezakalalu.com + www.eryezakalalu.com
#    Vercel gives you DNS records. Point your registrar's DNS at Vercel:
#      - A  @  → 76.76.21.21  (Vercel's anycast)
#      - CNAME www → cname.vercel-dns.com
#    SSL is automatic.
```

### A2. Netlify

```bash
# Same repo as above. On netlify.com: Add new site → import from Git → pick preryezak/Author-Website
# Build command: (leave empty)   Publish directory: .
# Netlify reads _headers + _redirects (already in the repo) for security + clean URLs.
# Domains → add eryezakalalu.com → follow Netlify's DNS instructions.
```

### A3. Cloudflare Pages

```bash
# Same repo. On pages.cloudflare.com: Create project → connect preryezak/Author-Website
# Build command: (empty)   Output directory: /
# Add the security headers under Pages → Settings → Headers (or via a _headers file — same Netlify format works).
# Custom domain → add eryezakalalu.com (if the domain is already on Cloudflare, it's one click).
```

**Path A is live in under 15 minutes.** The Genspark version is already complete; this bundle just cleans and hardens it.

---

## Path B — Modernized: deploy the Next.js 16 project

If you'd rather ship the modernized Next.js version (server-side RSS, JSON-LD, typed, App Router):

```bash
# 1. From this sandbox, the project is at /home/z/my-project/
#    Zip everything EXCEPT node_modules/ and .next/ and .git/, download, unzip locally.

# 2. Replace the Author-Website repo with this Next.js project:
cd Author-Website
rm -rf client server shared scripts tools patches *.json *.md *.yaml 2>/dev/null
# drop the Next.js files in so package.json, next.config.ts, src/, public/, prisma/ are at repo root
git add -A
git commit -m "Relaunch as Next.js 16 App Router — Neo-Monastic Editorial, hardened"
git push origin main

# 3. On vercel.com: import preryezak/Author-Website → Framework auto-detected as Next.js → Deploy
#    Build command: next build   Output: .next   (auto)
# 4. Add eryezakalalu.com under Settings → Domains.
```

> The Next.js version is what's running in the sandbox Preview Panel right now. It is the more maintainable long-term home (typed, componentized, server-proxied RSS that won't break when CORS proxies rate-limit).

---

## DNS / domain checklist (whichever path)

At your domain registrar (or Cloudflare, if eryezakalalu.com is managed there):

- [ ] Point `eryezakalalu.com` (apex) at your host (Vercel A record, Netlify/Cloudflare CNAME, etc.)
- [ ] Point `www.eryezakalalu.com` at the host, redirect to the apex
- [ ] Confirm HTTPS issues automatically (all three hosts do this free)
- [ ] Set the old `books.theccndaily.com` subdomain to redirect to eryezakalalu.com (preserve SEO + any inbound links)

---

## Post-launch verification (run this checklist live)

- [ ] `https://eryezakalalu.com/` loads the hero with the author portrait
- [ ] Masthead nav "The Book" scrolls to the book deep-dive
- [ ] The 6 edition cards link to Payhip (USD) + Selar (UGX) correctly
- [ ] "Read Day 1 free" links to the Payhip excerpt product
- [ ] The Beehiiv subscribe iframe loads (the § Eryeza's Letter section)
- [ ] The iHeart podcast player embed loads (the forest-green Devotion In Season strip)
- [ ] The 6 podcast platform cards each open the right platform in a new tab
- [ ] Footer shows `© 2026 Eryeza Kalalu · § Written with care.` + "Grace and peace to you."
- [ ] On mobile (<1024px) the burger menu opens the drawer
- [ ] Run `curl -sI https://eryezakalalu.com/ | grep -i 'content-security-policy'` — should return the CSP header
- [ ] Google's PageSpeed Insights / Rich Results Test on the homepage — the JSON-LD (Person + Book + PodcastSeries) should validate

---

## Content notes that need your eye

A few items in the source that you'll want to confirm or refresh once live (documented in `AUDIT.md` too):

1. **Podcast RSS feed is dead.** The source's `https://anchor.fm/s/103e4e254/podcast/rss` returns 404 (Anchor was rebranded to Spotify for Podcasters). The live iHeart player + 6 platform links still work, but the "Recent episodes" list falls back to a static link. If you have a current podcast RSS (Spotify for Podcasters → Settings → RSS feed URL), drop it into `shared-scripts.js` → `window.EK.PODCAST_RSS` (static bundle) or `src/lib/site-content.ts` → `SITE.podcastRss` (Next.js). Then the episode list populates automatically.

2. **The newsletter feed is empty by design.** The Beehiiv "Eryeza Writes" publication (`m7Wi8T8MXS.xml`) currently has 0 published letters — so "Recent letters" shows the graceful "No letters yet" state. The moment you publish your first letter on Beehiiv, the feed populates automatically (no code change).

3. **"Seven reader responses" vs 6.** The home page copy says "Read all seven reader responses on the book landing page" but the landing page has 6. Either add the 7th review or change "seven" to "six" in `src/lib/site-content.ts` (Next.js) or the home `index.html` (static).

4. **Email.** The source used Cloudflare email obfuscation (a broken `/cdn-cgi/l/email-protection` link). I replaced it with a real `mailto:hello@eryezakalalu.com`. If that address is wrong, update it in `src/lib/site-content.ts` → `SITE.email` (Next.js) or the footer of both HTML pages (static).
