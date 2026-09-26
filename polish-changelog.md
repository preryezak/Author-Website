# Polish pass — changelog and rollback

**Deployed:** site Worker `ccndaily-books`, version `8bd8a955-941a-464a-9976-d98d838acbbb` (2026-09-23 09:58 UTC)
**Live:** <https://eryezakalalu.com>
**Scope:** the five polish items you raised, plus two build-hygiene fixes found on the way. No copy was rewritten and no page was restructured beyond the items below.

---

## 1. Newsletter subscription card

**Problem.** On `/letter` the subscribe box was a bare iframe with an inline `height: 220px`, so the email field sat below the visible area (you had to scroll inside the frame) and the placeholder read as clipped. The home page never did this: it sizes the same embed with CSS only, which is why its card looks right.

**Fix.** `/letter` now uses the home page's own markup and classes, with no inline sizing:

```tsx
<div className="mx-auto letter-card letter-card--embed">
  <iframe className="beehiiv-embed" title="Subscribe to Eryeza Writes" loading="lazy" src={SITE.beehiivEmbed} />
</div>
```

Sizing comes from `.letter-card--embed` / `.beehiiv-embed` in `globals.css` (`width/min-width 440px`, `height 520px`, `zoom 0.74/0.66`), so the responsive behaviour is the same on both pages.

**Files:** `src/app/letter/page.tsx`
**Verified:** live iframe renders `class="beehiiv-embed"`, no inline `height` attribute remains, wrapper is `.letter-card--embed`. Evidence: `evidence/polish/letter-card-{desktop,tablet,mobile}.png`.

> Note: the placeholder text itself lives inside Beehiiv's own cross-origin frame, so the wording cannot be styled from this site. The clipping was caused by our frame being too short; that is what changed.

## 2. Footer spacing on every page

**Problem.** `.site-footer` had a background and colours but **no padding at all**, so the monogram and "Eryeza Kalalu" sat directly against whatever section preceded it.

**Fix.** One rule in `globals.css`, which every page inherits because every page renders the same footer:

```css
.site-footer { padding-top: clamp(64px, 8vw, 104px); padding-bottom: clamp(24px, 3vw, 36px); }
.site-footer .container > .grid-12 { padding-bottom: clamp(16px, 2.5vw, 28px); }
```

**Files:** `src/app/globals.css` (applies to all 9 routes: `/`, `/about`, `/books`, `/contact`, `/give`, `/influential-spirit`, `/letter`, `/podcast`, `/speaking`)
**Verified:** rule present in the live stylesheet; sweep shows `site-footer` on 9/9 routes. Evidence: `evidence/polish/footer-spacing-{desktop,tablet,mobile}.png`.

## 3. Influential Spirit opening

**Problem.** The page opened with a plain bordered cover image (the old presentation), while the home page opens the book inside a framed "device" with a stamp.

**Fix.** The opening is now the home page's `featured-book` block, copied exactly: `.featured-book` grid, `.device` frame with `.device__bezel-mark` / `.device__screen` / `.device__chrome`, the `.cover-stamp` with the ornament and stamp text, and the same type hierarchy (`featured-book__title / __subtitle / __headline / __audience`). Home-page anchors in the content file (`#editions`, `#books`) are resolved to real routes on this page.

**Files:** `src/app/influential-spirit/page.tsx`
**Verified:** live page has `featured-book` ×12, `device__screen`, `device__chrome`, `cover-stamp`; the old `.book-cover-frame` is gone (0 occurrences). Evidence: `evidence/polish/book-opening-{desktop,tablet,mobile}.png`.

## 4. The speaking form opens only when asked

**Problem.** The eight-section invitation form rendered open on load, pushing the page down before the reader had decided anything.

**Fix.** New client component `InvitePanel` wraps the form:

- Collapsed on load: the panel renders with `hidden` and `aria-hidden="true"`.
- The button `Invite Eryeza to Speak` carries `aria-expanded` and `aria-controls="invite-form-body"`, and toggles the panel (native `<button>`, so it is keyboard operable and announces its state).
- A `Close the form` control at the foot collapses it again.
- Deep links still work: anything pointing at `#invite-form` (both hero buttons do) opens the panel, on load or on a later hash change.

**Files:** `src/components/site/invite-panel.tsx` (new), `src/app/speaking/page.tsx`
**Verified:** live markup is `<button … class="invite-toggle" aria-expanded="false" aria-controls="invite-form-body">` and `<div id="invite-form-body" class="invite-panel__body" hidden="" aria-hidden="true">`. Evidence: `evidence/polish/speaking-collapsed-*.png`.

## 5. Selected Engagements: alternation instead of three identical blocks

**Problem.** All three cards were `speaking-card--a`, so they read as one flat block. (The home page had the same three identical cards; the treatment now applies to both.)

**Fix.** New shared component `EngagementsGrid` renders one card per engagement with a deliberate progression, and both the home page and `/speaking` use it:

| Card | Class | Device |
| --- | --- | --- |
| 1 | `engagement-card--lead` | top rule in oxblood, heavier title (22px), most padding |
| 2 | `engagement-card--mid` | mid tint, gold left rule |
| 3 | `engagement-card--deep` | deepest tint, forest left rule |

One emphasis device per card, no decorative numbering, and the section stays readable when it collapses to one column under 900px.

**Files:** `src/components/site/engagements.tsx` (new), `src/app/globals.css`, `src/components/site/site-page.tsx` (home page now uses the shared grid)
**Verified:** live `/speaking` and `/` each contain `engagement-card--lead/mid/deep` once; the old `speaking-card--a` count on `/speaking` is 0. Evidence: `evidence/polish/engagements-*.png`, `evidence/polish/home-engagements-*.png`.

## Build hygiene, found on the way

- **`dist/**` was missing from the eslint ignores**, so `npm run lint` was reading the minified build output and reporting 22 errors / 5,854 warnings. Fixed in `eslint.config.mjs`; lint is now **0 errors**.
- The unused eslint-disable directive in `src/hooks/use-mobile.ts` was removed.

---

## Verification summary

| Check | Result |
| --- | --- |
| All routes reachable | **9/9 HTTP 200** |
| Missing path | **HTTP 404** with the designed page (not a soft 200) |
| Newsletter card | `letter-card--embed` + `beehiiv-embed`, no inline height |
| Footer rule live | `.site-footer{padding-top:clamp(64px,8vw,104px)…}` present in the served CSS |
| Influential Spirit opening | home page's `featured-book` treatment; old cover frame gone |
| Speaking form | collapsed and `aria-hidden` on load, `aria-expanded="false"` on the control |
| Engagements | alternating on both `/speaking` and the home page |
| Speaking submission | POST returned **201 `stored: true`**; D1 row `createdAt 2026-09-26T16:06:24.343Z`, `name "Polish Test Submitter"`, `status "new"` |
| Screenshots | 18 captures, 6 views × 3 widths, in `evidence/polish/` |
| Lint | 0 errors |

**Caveat, stated plainly:** the speaking form's click-to-expand was verified from the shipped markup and bundle wiring, not by driving a real browser click (no browser automation available in this environment). Everything else above was checked against the live site.

---

## Rollback

Three levels, cheapest first.

**1. Revert one fix's styling (seconds).** All five fixes are in three files: `src/app/globals.css` (footer rule, engagement cards, invite toggle), the route pages, and two new components. Revert the commit and redeploy.

**2. Roll the Worker back to the previous version (minutes).** Cloudflare keeps every version. The polish pass is `8bd8a955`; the version before it is `0c5fe003`.

| Version | What it was |
| --- | --- |
| `8bd8a955-941a-464a-9976-d98d838acbbb` | **current** — polish pass (this document) |
| `0c5fe003-5d2c-4114-9cf3-8db35bb85258` | craft pass: styled route pages, dark library, page-head system |
| `736537bc-e40c-4bb2-8eff-879a6a39c5e9` | real routes, cards, Give, click tracking |
| `2c3ab592-cf8c-4d3e-a230-3176f96ef96f` | EK monogram favicon, Subscribe as the primary masthead action |

**3. Rebuild and redeploy from source.**

```
cd <repo>
npx next build --webpack && node scripts/postbuild.mjs && npx wrangler deploy
```

`next build --webpack` is required on this machine: only the WASM SWC bindings are usable here, and Turbopack refuses without native bindings. A changed `NEXT_PUBLIC_*` value also needs a clean `.next`, or the webpack cache reuses the previous compilation.

**Owner of the rollback decision:** Eryeza Kalalu. Nothing about the site's public behaviour changes again without him.
