-- Cloudflare D1 schema for the study-guide sign-ups (Worker `eryeza-study`).
-- Run after creating the database:
--   npx wrangler d1 execute eryeza-study-db --file=worker/study-schema.sql --remote -c worker/study.wrangler.toml

CREATE TABLE IF NOT EXISTS study_signups (
  id            TEXT PRIMARY KEY,
  createdAt     TEXT NOT NULL,
  email         TEXT NOT NULL,
  firstName     TEXT NOT NULL,
  week          INTEGER NOT NULL,
  letterOptIn   INTEGER NOT NULL DEFAULT 0,   -- 1 = ticked "Also send me Eryeza's letter"
  kitStatus     TEXT NOT NULL DEFAULT 'pending',  -- form:ok (Kit free plan) | ok | partial:<steps> (Kit API) | error:... | skipped:no-kit
  beehiivStatus TEXT NOT NULL DEFAULT 'pending',  -- ok | n/a | skipped:manual-import | error:<status>
  ipHash        TEXT                            -- salted SHA-256, never the raw IP
);

CREATE INDEX IF NOT EXISTS idx_study_createdAt ON study_signups(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_study_email ON study_signups(email);

-- Rate limit: posts per salted IP hash per UTC hour (the Worker allows 5).
CREATE TABLE IF NOT EXISTS study_rate (
  ipHash TEXT NOT NULL,
  hour   TEXT NOT NULL,      -- YYYY-MM-DDTHH (UTC)
  count  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ipHash, hour)
);
