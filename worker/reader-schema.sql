-- D1 schema for the reader Worker (database eryeza-orders).
--   npx wrangler d1 execute eryeza-orders --remote --file=worker/reader-schema.sql -c worker/reader.wrangler.toml

-- Day 1 sign-ups and the follow-up letters (worker/sequence.ts).
CREATE TABLE IF NOT EXISTS leads (
  email       TEXT PRIMARY KEY,
  firstName   TEXT NOT NULL DEFAULT '',
  token       TEXT NOT NULL UNIQUE,          -- for the unsubscribe link
  createdAt   TEXT NOT NULL,
  step        INTEGER NOT NULL DEFAULT 0,    -- index of the next letter to send
  status      TEXT NOT NULL DEFAULT 'active', -- active | unsubscribed
  letterOptIn INTEGER NOT NULL DEFAULT 0,
  source      TEXT NOT NULL DEFAULT '',
  ipHash      TEXT NOT NULL DEFAULT '',
  lastSentAt  TEXT,
  nextDueAt   TEXT,
  note        TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_leads_due ON leads(status, nextDueAt);

-- Rate limit per salted IP hash per UTC hour.
CREATE TABLE IF NOT EXISTS checkout_rate (
  ipHash TEXT NOT NULL,
  hour   TEXT NOT NULL,
  kind   TEXT NOT NULL,
  count  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ipHash, hour, kind)
);

-- Buyers, read from the Kit tags Selar adds (worker/kit.ts), and their letters (worker/buyer-sequence.ts).
CREATE TABLE IF NOT EXISTS buyers (
  email      TEXT PRIMARY KEY,
  firstName  TEXT NOT NULL DEFAULT '',
  edition    TEXT NOT NULL,                   -- reader | formation | complete | christmas
  token      TEXT NOT NULL UNIQUE,            -- for the unsubscribe link
  boughtAt   TEXT NOT NULL,
  step       INTEGER NOT NULL DEFAULT 0,      -- index of the next letter to send
  status     TEXT NOT NULL DEFAULT 'active',  -- active | past | unsubscribed
  lastSentAt TEXT,
  note       TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_buyers_due ON buyers(status, step);

-- Small key/value store (last Kit sync time).
CREATE TABLE IF NOT EXISTS kv (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
