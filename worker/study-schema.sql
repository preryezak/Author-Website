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
  guideStatus   TEXT NOT NULL DEFAULT 'pending',  -- beehiiv:ok (study publication) | beehiiv:error:<status> | Kit fallback: form:ok | ok | partial:... | skipped:...
  beehiivStatus TEXT NOT NULL DEFAULT 'pending',  -- the LETTER (Eryeza Writes): ok | n/a (box not ticked) | skipped:manual-import | error:<status>
  ipHash        TEXT,                           -- salted SHA-256, never the raw IP
  phone         TEXT DEFAULT '',                -- optional, E.164 (+256...). Owner use only, never shared
  phoneCountry  TEXT DEFAULT ''
);
-- Existing databases: ALTER TABLE study_signups ADD COLUMN phone TEXT DEFAULT ''; ALTER TABLE study_signups ADD COLUMN phoneCountry TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_study_createdAt ON study_signups(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_study_email ON study_signups(email);

-- Rate limit: posts per salted IP hash per UTC hour (the Worker allows 5).
CREATE TABLE IF NOT EXISTS study_rate (
  ipHash TEXT NOT NULL,
  hour   TEXT NOT NULL,      -- YYYY-MM-DDTHH (UTC)
  count  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ipHash, hour)
);
