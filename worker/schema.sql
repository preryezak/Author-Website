-- Cloudflare D1 schema for the speaking-form submissions.
-- Run after creating the D1 database:
--   wrangler d1 execute eryeza-speaking-db --file=schema.sql --remote
-- (also run with --local for local dev)

CREATE TABLE IF NOT EXISTS speaking_requests (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  data       TEXT NOT NULL,           -- the full 8-section submission as JSON
  status     TEXT DEFAULT 'new',      -- new | reviewed | responded | declined
  createdAt  TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_speaking_status ON speaking_requests(status);
CREATE INDEX IF NOT EXISTS idx_speaking_createdAt ON speaking_requests(createdAt DESC);
