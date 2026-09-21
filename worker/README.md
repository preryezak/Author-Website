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
