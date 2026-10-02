# `eryeza-speaking` — Cloudflare Worker for the speaking-invitation form

Receives the 8-section speaking invitation from eryezakalalu.com, validates it, stores it
in Cloudflare D1, and emails `speaking@eryezakalalu.com` with `reply-to` set to the
submitter.

**Answer to "does Cloudflare have Workers that can fetch the form and email it?" — Yes.**
Two supported routes, and the Worker ships with both:

| Path | How | Account needed | Cost |
| --- | --- | --- | --- |
| **Native (preferred)** | Email Service `send_email` binding → `env.EMAIL.send({...})` | None (Cloudflare only) | Free for verified destination addresses on all plans; Workers Paid for arbitrary recipients (3,000/month included, then $0.35/1,000) |
| **Fallback** | `fetch("https://api.resend.com/emails")` with `RESEND_API_KEY` | Resend account | Free tier of Resend |

The Worker prefers the native binding whenever `env.EMAIL` exists and falls back to Resend
automatically. `GET /` on the Worker reports which path is live:

```json
{ "ok": true, "service": "speaking", "nativeEmailBinding": true, "resendConfigured": false, "storageConfigured": true }
```

## Deploy

### 1. (Preferred) Native email — no third-party account

1. Cloudflare dashboard → **Compute → Email Service** → onboard `eryezakalalu.com`
   (adds the required DNS records). Sends to a *verified destination address* are free.
2. Add at least one verified destination address: `speaking@eryezakalalu.com`.
3. `wrangler.toml` already contains:
   ```toml
   [[send_email]]
   name = "EMAIL"
   ```
4. `wrangler deploy`

### 2. (Fallback) Resend

```bash
wrangler secret put RESEND_API_KEY   # paste from resend.com/api-keys
wrangler deploy
```

Verify `eryezakalalu.com` in Resend, then set `RESEND_FROM = "speaking@eryezakalalu.com"`
in `[vars]` (until then it stays `onboarding@resend.dev`).

### 3. D1 storage (recommended — submissions survive mail failures)

```bash
wrangler d1 create eryeza-speaking-db
# paste the printed database_id into [[d1_databases]] in wrangler.toml and uncomment it
wrangler d1 execute eryeza-speaking-db --file=schema.sql --remote
wrangler deploy
```

Query submissions:
```bash
wrangler d1 execute eryeza-speaking-db --remote \
  --command "SELECT createdAt, name, email, json_extract(data,'$.eventName') AS event FROM speaking_requests ORDER BY createdAt DESC LIMIT 20"
```

### 4. Point the site at the Worker

In the **Pages** project → Settings → Environment variables:
```
NEXT_PUBLIC_SPEAKING_ENDPOINT = https://<worker>.<subdomain>.workers.dev
```
Optional same-origin alternative: add a Worker route `eryezakalalu.com/worker/speaking*`
and use `https://eryezakalalu.com/worker/speaking` instead (removes CORS entirely).

## Behaviour and failure modes

- **Validation**: requires `name` (≥2), a valid `email`, `eventName` (≥2), `speakAbout` (≥10);
  violations return HTTP 422 with a human-readable message the form displays.
- **Storage before send**: the D1 insert happens first, so a mail outage never loses a
  submission. The site still reports success so the visitor is not asked to resubmit.
- **CORS**: allow-list is `ALLOWED_ORIGIN` (default `https://eryezakalalu.com`);
  `POST, OPTIONS` only.
- **Headers**: live path is returned as `via` (`cloudflare-email` | `resend` | `none`) and
  failures as `sendError`, so problems are diagnosable from the browser network tab.
- **Limits**: ≤50 recipients per send; custom headers ≤16 KB; the native binding can be
  locked down with `allowed_sender_addresses` / `allowed_destination_addresses`.
- **No `nodejs_compat` needed**: the Resend path uses `fetch`; the native path uses a binding.

## Files
- `speaking.ts` — the Worker (single file, zero npm dependencies)
- `wrangler.toml` — bindings, vars, commented D1 block
- `schema.sql` — D1 table + indexes

---

## Email delivery is ON (enabled 2026-09-27)

The native Cloudflare Email Service binding is now active, so an invitation
posted to this Worker sends a real email as well as writing the D1 row. No
dashboard step was required: `eryezakalalu.com` already runs on Cloudflare Email
Routing, which is what the binding needs.

Verified state of the domain (checked through the Cloudflare API on 2026-09-27):

| Item | Value |
| --- | --- |
| Email Routing | enabled, status `ready` |
| MX | `route1/2/3.mx.cloudflare.net` |
| SPF | `v=spf1 include:_spf.mx.cloudflare.net ~all` |
| DKIM | published at `cf2024-1._domainkey.eryezakalalu.com` |
| Forwarding rules | `speaking@`, `media@`, `books@`, `hello@` -> `pastor.eryeza@gmail.com` |
| Verified destination address | `pastor.eryeza@gmail.com` |

Bindings and vars that make it work (see `wrangler.toml`):

```toml
[[send_email]]
name = "EMAIL"
allowed_sender_addresses = ["speaking@eryezakalalu.com"]
allowed_destination_addresses = ["pastor.eryeza@gmail.com"]

[vars]
EMAIL_FROM   = "speaking@eryezakalalu.com"   # what the recipient sees
NOTIFY_EMAIL = "pastor.eryeza@gmail.com"     # where it is delivered
```

**The one rule that bites:** a `send_email` binding only accepts a **verified
destination address**. `speaking@eryezakalalu.com` is a forwarding rule on the
domain, not a destination, so sending to it is refused with
`email to speaking@eryezakalalu.com not allowed`. That is why the Worker resolves
`NOTIFY_EMAIL` first and sends the message there, while `EMAIL_FROM` keeps the
public-facing sender.

Test, end to end (2026-09-27):

```
POST https://eryeza-speaking.preryezakalalu.workers.dev
-> HTTP 201 {"ok":true,"emailed":true,"stored":true,"via":"cloudflare-email"}
```

**To change the destination later:** add and verify the new address in
Cloudflare (Email Routing -> Destination addresses), then update `NOTIFY_EMAIL`
in `wrangler.toml` and redeploy. Sending to a verified destination is free on
every plan, including Workers Free; sending to arbitrary recipients needs
Workers Paid.

**Fallback:** the Resend path is still in the code and still unconfigured. If the
native binding is ever removed, set the `RESEND_API_KEY` secret
(`wrangler secret put RESEND_API_KEY`) to restore sending. The Resend sender is
`onboarding@resend.dev` until `eryezakalalu.com` is verified on Resend.
---

# `eryeza-study` — study-guide sign-up Worker

`study.ts` · config `study.wrangler.toml` · schema `study-schema.sql`. Served same-origin at
`https://eryezakalalu.com/api/study` via a Worker **route**, which runs in front of the
`ccndaily-books` custom-domain site, so the `/resources/` page needs no CORS and no CSP change.

Flow per sign-up: honeypot + Origin + email checks → 5 posts per IP per hour (D1 counter on a
salted IP hash) → **row stored in D1 first** → Kit → Beehiiv subscription when ticked *and*
`BEEHIIV_API_KEY` + `BEEHIIV_PUB_ID` are set → `kitStatus` / `beehiivStatus` written back to the
row. The visitor gets `{ ok: true }` once the row is stored; provider errors stay in D1.

Kit has two modes:

- **Free plan (current, no `KIT_API_KEY`)**: the Worker submits `email_address` and
  `fields[first_name]` to the form's public subscribe address (`https://app.kit.com/forms/<KIT_FORM_ID>/subscriptions`),
  the same request Kit's own embed code makes. Kit treats it as a form sign-up and sends the form's
  confirmation (incentive) email, which carries the week's guide. `kitStatus = form:ok`.
- **Paid plan (`KIT_API_KEY` set)**: Kit v4 API: upsert subscriber, add to `KIT_FORM_ID`, tag
  `study-guide`, `week-N`, and `letter-optin` when ticked.

## Deploy (from the repo root)

```bash
npx wrangler d1 create eryeza-study-db          # paste database_id into study.wrangler.toml
npx wrangler d1 execute eryeza-study-db --remote -c worker/study.wrangler.toml --file=worker/study-schema.sql
npx wrangler secret put BEEHIIV_API_KEY -c worker/study.wrangler.toml
# only on a paid Kit plan:
# npx wrangler secret put KIT_API_KEY -c worker/study.wrangler.toml
# set KIT_FORM_ID in [vars], then:
npx wrangler deploy -c worker/study.wrangler.toml
```

Check: `curl https://eryezakalalu.com/api/study` returns the health JSON (which paths are
configured, never the values).

## Read sign-ups

```bash
npx wrangler d1 execute eryeza-study-db --remote -c worker/study.wrangler.toml \
  --command "SELECT createdAt, email, firstName, week, letterOptIn, kitStatus, beehiivStatus FROM study_signups ORDER BY createdAt DESC LIMIT 20"
```

Manual Beehiiv import (when there is no API access): export the `letter-optin` tag from Kit, or
`SELECT email, firstName FROM study_signups WHERE letterOptIn = 1`.
