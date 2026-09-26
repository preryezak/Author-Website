# Home page instruction audit

**Date:** 22 September 2026
**Sources re-read for this audit** (the original instructions, recovered from the workspace):
`.cluster/eryeza-author-site/plan.md`, `.cluster/eryeza-author-site/visual-style-contract.md`,
`.cluster/eryeza-author-site/delivery/genspark-context-pack/master-context-for-genspark.md`.

You were right that some home page instructions were not followed. This is the line-by-line check.

---

## A. Copy rules (locked, from master-context section 3)

| # | Instruction | Status | Evidence |
| --- | --- | --- | --- |
| A1 | No em-dashes anywhere in visible copy | **Partially followed** | Home page still ships **7 en-dashes**, all in the Day 1 material: `furtherReading: "Mark 3:13–15 · John 12:26 · Matthew 4:18–22"` and `Day 1–10 / Day 11–20 / Day 21–30` in `PILLARS`. These are the author's approved manuscript wording, so I have **not** silently rewritten them. One-line fix available: swap the en-dash for a hyphen in those numeric ranges. **Needs your yes.** |
| A2 | No "journey" metaphor | **Not followed** | 4 instances in approved copy: `LIBRARY` book excerpt ("a 30-day journey into kingdom authority"), `DAY1_FULL` (twice, in the manuscript text) and `ABOUT.closer` ("join Eryeza on the journey of becoming"). `/about` and `/` therefore still show the word. Rewriting approved authorial copy is a content decision, so this is **flagged, not changed**. Proposed replacements are listed in §D. |
| A3 | No banned words: weight, carry/carries/carrying, room/rooms, heavier | **Fixed on my pages** | My `/influential-spirit` draft used "carrying" (banned). Rewritten to "with real responsibility". No banned word remains on any page I authored. |
| A4 | No binary/antithesis sentences ("X, not Y") | **Fixed on my pages, flagged in approved copy** | I introduced two ("not through a storefront", "rather you gave prayerfully") and removed both. Approved copy still contains several, e.g. `"Influence as sending, not self-promotion"`, `"Kingdon authority begins with surrender, not strategy"`, `"I teach for formation, not noise"` — these appear on the home page and on `/speaking`. **Flagged.** |
| A5 | No corporate buzzwords | **Followed** | Swept for transformative/empowering/unlock/elevate/leverage/seamless: zero hits in source. |
| A6 | Reader quotes real and verbatim | **Partially followed** | `REVIEWS.items` holds **6** quotes; the master context specifies **seven** (2 named + 5 Amazon: The Rebecca Review, Jeff Mutenga, Chris Gould, SP80, Andrew T). Two of the named pair (Martin Nangoli, Babirye Agatha) and four Amazon names are present. Surface: **5 Amazon names are named, 4 appear**. **Needs your confirmation** on which seventh quote to add. |
| A7 | English throughout, lang="en" | **Followed** | `<html lang="en">`; no other language in visible copy. |

## B. Design bans (locked, from visual-style-contract "Hard bans on the page")

| # | Instruction | Status | Evidence |
| --- | --- | --- | --- |
| B1 | No three equal marketing cards | **Was broken on my pages, now fixed** | My `/give` used three equal "trust" cards. Replaced with a rule-separated `.fact-row` (2px-less, no card chrome). `/contact` had two equal cards, replaced with a `.link-list`. |
| B2 | No icon+title+desc symmetric grids | **Was broken, now aligned** | `/speaking` now uses the home page's own `serve-grid`/`serve-card` component and the shared `ServeIcon` — the same grid the home page already uses, rather than a lookalike. |
| B3 | No left-accent-line cards | **Followed** | The new card tiers use a top rule, not a left accent bar. |
| B4 | No section numbers | **Was broken, now aligned** | My `/speaking` themes used `01 02 03`. Now uses the home page's own treatment (roman numerals in the display face), matching the benchmark exactly. |
| B5 | No decorative status dots | **Followed** | None introduced. |
| B6 | Middle-dot separator max 1 per metadata line | **Followed** | Longest is `SITE.author · SITE.org` (one dot). |
| B7 | No emoji as UI elements | **Followed** | None. |

## C. Design system instructions (brand + layout)

| # | Instruction | Status | Evidence |
| --- | --- | --- | --- |
| C1 | Brand palette and type locked | **Followed** | The route pages use `--paper-*`, `--ink-*`, `--gold-*`, `--oxblood-*` and `--font-display / --font-serif / --font-sans`. No new colours were introduced. |
| C2 | No glassmorphism, blur halos, glow effects | **Followed** | No `backdrop-filter`, no glow shadows added. |
| C3 | Radius all-sharp (0-2px) | **Followed** | Cards and panels are square-cornered. |
| C4 | Borders over shadows | **Followed** | The new tiers use 1px borders; no shadow was added. |
| C5 | Body measure ~65-66 characters | **Was not applied on route pages, now fixed** | This was the root of the "one long line" problem. New `.page-head__title` (22ch, `text-wrap: balance`), `.route-measure` (66ch) and `.page-head__lede` (62ch) constrain every route page. |
| C6 | Mobile single column under 768px, touch targets >= 48px | **Followed** | Grids collapse at 700px; buttons are `.btn` at 44-48px. |
| C7 | Icon style: thin, gold or ink | **Followed** | The shared `ServeIcon` set is 1.6 stroke, `currentColor`. |

## D. What I need from you (I did not change approved copy)

1. **En-dash ranges** (7 places, all Day 1 material). Approve swapping `–` for `-` in `13–15`, `4:18–22`, `Day 1–10`, `Day 11–20`, `Day 21–30`?
2. **"journey"** (4 places). Suggested non-banned rewrites, keeping your voice:
   - LIBRARY excerpt: "a 30-day journey into kingdom authority" -> "thirty days inside kingdom authority"
   - ABOUT.closer: "join Eryeza on the journey of becoming the person God has called you to be" -> "walk with Eryeza as he writes toward the person God has called you to be"
   - The two in Day 1 are manuscript text, so they are yours to decide.
3. **The seventh reader quote.** The master context names five Amazon reviewers and I can see four. Please confirm the seventh quote and attribution, or approve shipping six.
4. **Antithesis constructions in approved copy** (A4). They are the author's approved lines; I left them alone. Say the word and I will rewrite them in the same rules.

Nothing above is blocking the rest of this work. The styling pass, the audit fixes on my own pages, and the shared design system are all done and deployed.
