# Giving and routes: what shipped, what is deferred, and how to roll back

**Date:** 22 September 2026
**Live site:** <https://eryezakalalu.com>
**Worker:** `ccndaily-books` (static assets) · **Worker version at time of writing:** `b0539cbd-ddef-4fcb-b739-bda7f1321ac3`
**Event-logging Worker:** `eryeza-speaking` (also handles speaking invitations)

---

## 1. What shipped

### 1.1 The Giving button links to the hosted Flutterwave donation page

- Destination: `https://flutterwave.com/donate/h2tj4bfhltce`
- Opens in a **new tab** with `rel="noopener noreferrer external"`.
- **There is no payment code in this project.** No SDK, no checkout, no payment-initiation
  endpoint, no webhook, no secret key. The button is an ordinary external link.
- Appears in: the masthead of every page, the mobile drawer, the footer, and prominently on `/give`.

### 1.2 Real routes (the previous behaviour was broken)

Every navigation item used to be an in-page anchor, and because the Worker was set to
`not_found_handling = "single-page-application"`, **every missing path returned HTTP 200 with the
homepage**. A soft 404 that looked like success to browsers, crawlers and link checkers.

Now:

| Route | Page |
| --- | --- |
| `/` | Homepage (unchanged long-form page) |
| `/about` | About |
| `/influential-spirit` | The book |
| `/books` | Library and editions |
| `/podcast` | Devotion In Season |
| `/letter` | Letters + subscribe |
| `/speaking` | Speaking + invitation form |
| `/contact` | Contact |
| `/give` | Giving |
| anything else | A designed 404 page with a **real HTTP 404** |

### 1.3 A differentiated card system

Four deliberate tiers, defined once in `src/app/globals.css`:

| Tier | Class | Role |
| --- | --- | --- |
| Anchor | `.card--anchor` | The one card per section that earns prominence, via a single top accent rule |
| Standard | `.card--standard` | The default |
| Quiet | `.card--quiet` | Structurally present, visually receding |
| (Fact rows / FAQ) | `.faq-item` etc. | Non-card rows that should never have looked like cards |

Rule: **one emphasis device per card, never two**, and at most one anchor card per section. This
replaces the old two-tone fill alternation (`paper-50` vs `paper-100`, about six RGB points apart)
which made every card read at the same weight.

### 1.4 Giving click tracking

Each Giving click records a small, non-personal event:
`event`, `source` (masthead / drawer / footer / give-page), `page`, `campaign`, `ts`, a random `id`,
and the edge `country`. No email, no name, no card data, no cookies.

- Client: `src/lib/track.ts` — writes to `window.dataLayer`, dispatches an `ek:event` CustomEvent,
  and beacons to the logging Worker (`sendBeacon` with a `text/plain` body, so no CORS preflight).
- Server: `POST /events` on the `eryeza-speaking` Worker → D1 table `site_events` in `eryeza-speaking-db`.
- Duplicate suppression: repeats of the same event from the same source inside 1.5 s are dropped on
  the client, and the row's primary key is the event id, so a retried beacon cannot insert twice.

---

## 2. Configuration: one place, one switch

The donation URL lives in exactly one place: the `GIVING` object in **`src/lib/site-content.ts`**.

| Variable | Default | Effect |
| --- | --- | --- |
| `NEXT_PUBLIC_GIVING_URL` | `https://flutterwave.com/donate/h2tj4bfhltce` | Destination for every Giving link. Set to `off`, `none`, `disabled` or `false` to switch giving off entirely |
| `NEXT_PUBLIC_EVENTS_ENDPOINT` | the Worker's `/events` URL | Where clicks are recorded; unset means tracking is skipped silently and the link still works |
| `NEXT_PUBLIC_SPEAKING_ENDPOINT` | the Worker root | The speaking invitation form |

Set `NEXT_PUBLIC_GIVING_URL=off` and the button **degrades safely**: the prominent
button renders as a disabled control reading "Give unavailable" instead of sending anyone to a broken
destination, and the inline nav/footer links render nothing at all.

**Why a sentinel and not an empty string:** Next.js inlines `NEXT_PUBLIC_*` values at build time and
treats an empty value as "not set", so `NEXT_PUBLIC_GIVING_URL=` is indistinguishable from leaving it
unset and would silently fall back to the default. This was verified by build: an empty value produced
the default URL, while `off` produced a build with no donation URL and the disabled fallback. The
sentinel is the honest switch. (On this setup a changed `NEXT_PUBLIC_*` value also needs a clean
`.next`; the webpack cache can otherwise reuse the previous compilation.)

Because these are build-time values, changing the destination is: edit the variable, rebuild, redeploy.

---

## 3. Why the direct Flutterwave integration is deferred

The owner's decision, and the reasoning is recorded here so it is not re-litigated by accident:

1. **There is no secure file delivery system yet.** Selling directly means granting access to a paid
   ebook. Without signed, expiring download links or licence keys, the file would be reachable by URL,
   which turns every sale into a leak.
2. **Flutterwave stays the system of record.** For gifts, the hosted donation page already handles the
   transaction, the receipt and the payout. Re-implementing that on-site would add risk without adding
   capability.
3. **The payment rail question is unresolved.** Settlement currency, payout timing and whether the
   account supports recurring charges were never confirmed, so a direct integration would be built on
   unverified assumptions.

The planning pack that covers the direct option in detail is outside this repository:
`plan_direct_selling_blueprint.md`, `plan_ccndaily_repo_review.md`, `plan_payments_channel_benchmark.md`.

---

## 4. Prerequisites before a direct integration is attempted

Do these in order. Nothing below is done yet.

1. **Secure delivery first.** Decide licence keys or signed expiring links, and make sure no paid file
   is reachable at a public URL. This is the actual blocker.
2. **A server endpoint.** The site is a static export; payments need a Worker with D1 (the pattern
   already exists in `worker/`). Tables: `products`, `orders`, `entitlements` (+ `gifts` if giving
   moves on-site).
3. **Server-authoritative pricing.** The browser must never send a price. The server writes a `pending`
   order and returns a reference plus the **public** key.
4. **Webhook verification, both steps.** Verify the shared hash header *and* re-verify the transaction
   with Flutterwave's API, then compare status, reference, amount and currency. Idempotent, so retries
   cannot double-grant.
5. **Secret storage.** The secret key as a Worker secret (`wrangler secret put`), never in
   `wrangler.toml [vars]`, never in the repo, never in the client bundle.
6. **Confirm commercially:** merchant entity and KYC, USD card + UGX mobile money, settlement timing,
   recurring support, refund window.

---

## 5. Rollback

**Rollback is one commit, and the site never stops working.**

### 5.1 Fastest path: restore the previous behaviour

The Giving button is an external link, so the lowest-risk rollback is to change the destination, not
the code:

1. Set `NEXT_PUBLIC_GIVING_URL` to another URL, or to `off` to switch the button off entirely.
2. Rebuild and redeploy:
   ```
   cd <repo>
   npx next build --webpack && node scripts/postbuild.mjs && npx wrangler deploy
   ```
No code change, no revert, minutes not hours.

### 5.2 Full revert

Each deploy is a versioned Worker release. Cloudflare retains previous versions, so the whole change
set can be rolled back by redeploying the previous version or by reverting the commit(s) on `main` and
redeploying.

Previous known-good Worker versions, newest first:

| Version | What it was |
| --- | --- |
| `b0539cbd-ddef-4fcb-b739-bda7f1321ac3` | Restored build (current, donation URL live) |
| `eee535c3-a0e2-448d-b5af-87e11a781a3b` | Homepage Giving button added |
| `0ecca8df-ff31-4c2c-809e-0099ef17224d` | First deployment of routes + cards + Give |
| `85e614a8...` | Pre-change site (anchors only, soft 404s) |

### 5.3 Restoring the old button behaviour exactly

There was no Giving button before this change. To remove it again: set `NEXT_PUBLIC_GIVING_URL=""`
(the links disappear, the `/give` page shows a disabled control explaining giving is unavailable), or
revert the commit that added `src/components/site/give-button.tsx` and its call sites.

### 5.4 Partial rollback

The three parts are independent:

| To undo only | Do this |
| --- | --- |
| The Giving button | `NEXT_PUBLIC_GIVING_URL=off` |
| Click tracking | Unset `NEXT_PUBLIC_EVENTS_ENDPOINT` — the button keeps working, nothing is recorded |
| The 404 behaviour | Set `not_found_handling = "single-page-application"` in `wrangler.toml` and redeploy (restores soft 404s, which is **not** recommended) |

### 5.5 Owner

- **Rollback decision:** Eryeza Kalalu (site owner). Nothing about giving should be changed without him.
- **Technical execution:** whoever operates the Worker; the commands are in §5.1.

---

## 6. Reconciliation: tying clicks to money

The click record answers "how many people set out to give, and from where". It cannot answer "how much
was given" — only Flutterwave knows that. Reconcile the two monthly:

```bash
# clicks by day and surface (event-logging Worker's D1)
cd worker
npx wrangler d1 execute DB --remote --command \
  "SELECT substr(ts,1,10) AS day, source, COUNT(*) AS clicks
   FROM site_events WHERE event='give_click'
   GROUP BY day, source ORDER BY day DESC LIMIT 60;"
```

Then compare against the donation dashboard for the same period. Expect clicks to exceed gifts, always:
people change their mind. What matters is the **ratio** and its trend, and any day where gifts appear
with no clicks (a direct link shared elsewhere) or clicks with no gifts at all (a broken donation page,
which is the signal worth acting on).

**Privacy:** this table holds no giver identity. Keep it that way. Do not join it to any mailing list.

---

## 7. Known gaps and caveats

- **Lint:** `npm run lint` passes with 0 errors. Two warnings remain, both pre-existing: an unused
  eslint-disable directive in the unused shadcn `use-mobile.ts`, and `import/no-anonymous-default-export`
  on the Worker's default export.
- **Build:** this machine can only build with webpack (`next build --webpack`), because the native SWC
  binding for win32-x64 is unusable here and Turbopack requires native bindings. `npm run build` alone
  will fail on this machine; that is an environment limitation, not a code problem.
- **Two pre-existing shadcn files** (`carousel.tsx`, `use-mobile.ts`) carry justified
  `eslint-disable-next-line` comments. They are unused by any page.
- **Image model unavailable** during this work, so the visual verification was done structurally and
  statistically rather than by a vision model: rendered pages were captured and checked for real
  content, and layout was verified by measured DOM geometry.
