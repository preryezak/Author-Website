# Eryeza Kalalu — Speaking Form Worker (Cloudflare)

A single-file Cloudflare Worker that receives the 8-section speaking invitation from the Next.js site, validates it, emails `speaking@eryezakalalu.com` via Resend, and optionally stores the submission in Cloudflare D1.

## What it does

1. **CORS** — allows `POST` + `OPTIONS` from `https://eryezakalalu.com` (configurable via `ALLOWED_ORIGIN`).
2. **Validates** — requires `name`, a valid `email`, `eventName`, and `speakAbout` (≥10 chars). Returns a 422 with a clear message otherwise.
3. **Stores** (optional) — if a D1 binding (`DB`) is configured, inserts the full submission as JSON into `speaking_requests`.
4. **Emails** — if `RESEND_API_KEY` is set, calls `https://api.resend.com/emails` to send a branded HTML notification to `speaking@eryezakalalu.com` (reply-to = the submitter's email, so you can hit Reply).
5. **Returns** `{ ok: true, emailed: boolean, message }` so the form shows the success state.

## Deploy (3 commands)

```bash
cd worker

# 1. Install wrangler if you don't have it
npm install -g wrangler   # or: npx wrangler

# 2. Log in to Cloudflare
wrangler login

# 3. Set the Resend API key as a secret (get a free key at resend.com/api-keys)
wrangler secret put RESEND_API_KEY
# paste the key when prompted

# 4. (Optional) Create the D1 database for storage
wrangler d1 create eryeza-speaking-db
# copy the database_id it prints into wrangler.toml (uncomment the [[d1_databases]] block)
wrangler d1 execute eryeza-speaking-db --file=schema.sql --remote

# 5. Deploy
wrangler deploy
```

`wrangler deploy` prints the Worker URL (e.g. `https://eryeza-speaking.<your-subdomain>.workers.dev`).

## Connect the Next.js site to the Worker

In **Cloudflare Pages → your site → Settings → Environment variables**, add:

```
NEXT_PUBLIC_SPEAKING_ENDPOINT = https://eryeza-speaking.<your-subdomain>.workers.dev
```

(Or, if you wire a custom route in the Cloudflare dashboard — `eryezakalalu.com/worker/speaking*` → this Worker — use that same-origin URL instead, which avoids CORS entirely.)

Redeploy the Pages site. The speaking form now posts to the Worker → Resend → your inbox.

## Env reference

| Var | Where | Default | Purpose |
|---|---|---|---|
| `RESEND_API_KEY` | `wrangler secret put` (secret) | — | Resend API key (enables email) |
| `SPEAKING_EMAIL` | `wrangler.toml` `[vars]` | `speaking@eryezakalalu.com` | Inbox that receives invitations |
| `RESEND_FROM` | `wrangler.toml` `[vars]` | `onboarding@resend.dev` | Sender address (set to `speaking@eryezakalalu.com` after you verify the domain on Resend) |
| `ALLOWED_ORIGIN` | `wrangler.toml` `[vars]` | `https://eryezakalalu.com` | CORS origin (the Pages site origin) |
| `DB` | `wrangler.toml` `[[d1_databases]]` | — (optional) | D1 binding for storage |

## The 8 sections the Worker expects

The form posts a JSON object with these keys (all optional except the 4 validated ones):

- **Your Details:** `name`*, `email`*, `phone`, `organisation`, `role`, `country`, `city`
- **Your Gathering:** `eventName`*, `gatheringType`, `eventDate`, `altDate`, `location`, `format`, `attendance`, `sessions`, `duration`
- **Reason for Invitation:** `speakAbout`*, `contribute`, `audience`, `leaveWith`, `themeOutcome`
- **Practical Arrangements:** `honorarium`, `budget`, `travel`, `accommodation`, `logistics`
- **Recording & Media:** `recorded`, `photosVideo`, `contentUse`
- **Books & Resources:** `booksInterest`, `booksInfo`
- **Anything Else:** `anythingElse`
- **How You Found Eryeza:** `howFound`, `referrer`

(* = required)

The email notification is organized under the same 8 headings, so you see the full invitation at a glance.

## Testing

After deploy, test with curl:

```bash
curl -X POST https://eryeza-speaking.<your-subdomain>.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://eryezakalalu.com" \
  -d '{"name":"Test Host","email":"you@example.com","organisation":"Test Church","eventName":"Sunday Service","speakAbout":"Formation and influence for our congregation."}'
```

Expect `{"ok":true,"emailed":true,"message":"Thank you. Your speaking invitation has been received."}` + an email at `speaking@eryezakalalu.com`.

## Notes

- The Worker is a single file (`speaking.ts`) with zero npm dependencies. It calls Resend via `fetch`, so it runs on the standard Cloudflare Workers runtime (no `nodejs_compat` needed).
- If `RESEND_API_KEY` is unset, the Worker still validates + stores (D1) but skips email. If D1 is unset, it still emails. Either can stand alone.
- The `speaking@eryezakalalu.com` mailbox must exist at your email host (Google Workspace, Zoho, or Cloudflare Email Routing — which can forward to any inbox for free) to *receive* the Resend notifications. Resend only *sends*.
