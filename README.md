# Eryeza Kalalu — Official Author Website

Official website for **Eryeza Kalalu** (Pastor, Author, Speaker & Bible Teacher), featuring *The Influential Spirit* (30 Days to a Life of Kingdom Authority, Character, and Marketplace Impact), the Devotion In Season podcast, Eryeza Writes letters, and speaking engagement requests.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and designed with the **Neo-Monastic Editorial** design system.

---

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   # or npm install
   ```

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   # or npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

4. **Build for production:**
   ```bash
   pnpm build
   ```

---

## 📁 Project Structure

- `src/app/` — Next.js 16 App Router pages, layout, and API routes:
  - `src/app/page.tsx` — Main single-page editorial experience
  - `src/app/api/speaking/route.ts` — Speaking invitation request handler
  - `src/app/api/letters/route.ts` — Server-proxied Beehiiv RSS feed
  - `src/app/api/episodes/route.ts` — Server-proxied Podcast RSS feed
- `src/components/site/` — Core editorial components:
  - `site-page.tsx` — Main interactive page with reveal-on-scroll, Day 1 reader, editions accordion
  - `speaking-invite-form.tsx` — 8-stage speaking invitation multi-step form
- `src/lib/site-content.ts` — Centralized content source of truth (books, copy, editions, podcast links, FAQ, reviews)
- `public/` — Brand assets, SVGs (EK gold monogram, EW, ES, DIS marks), real book cover, and mockups
- `worker/` — Standalone Cloudflare Worker for speaking form submission handling with Resend email delivery & Cloudflare D1 database support
- `download/GO-LIVE.md` — Detailed go-live instructions for Cloudflare Pages + Worker deployment
- `handoff/` — Migration guide (`MIGRATION.md`), security audit (`AUDIT.md`), and standalone static site bundle (`static-site/`)

---

## 🌐 Deploying to Cloudflare Pages or Vercel

### Cloudflare Pages
- **Build command:** `npx @cloudflare/next-on-pages@latest`
- **Output directory:** `.vercel/output/static`
- For full details, see [`download/GO-LIVE.md`](./download/GO-LIVE.md).

### Vercel
- Import repository into Vercel (Next.js is automatically detected).
- Add custom domains (`eryezakalalu.com` and `www.eryezakalalu.com`).

---

## 📄 License
© 2026 Eryeza Kalalu. All rights reserved.
