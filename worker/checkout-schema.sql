-- Cloudflare D1 schema for book orders (Worker `eryeza-checkout`).
-- Run after creating the database:
--   npx wrangler d1 execute eryeza-orders --file=worker/checkout-schema.sql --remote -c worker/checkout.wrangler.toml

CREATE TABLE IF NOT EXISTS orders (
  id            TEXT PRIMARY KEY,            -- also the Flutterwave tx_ref, e.g. IS-K7Q2M9XA
  token         TEXT NOT NULL UNIQUE,        -- secret for the buyer's order page and downloads
  createdAt     TEXT NOT NULL,
  edition       TEXT NOT NULL,               -- reader | formation | complete
  addons        TEXT NOT NULL DEFAULT '',    -- comma list, e.g. christmas
  currency      TEXT NOT NULL,
  amount        INTEGER NOT NULL,            -- expected total, whole currency units, set by the server
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL DEFAULT '',
  country       TEXT NOT NULL DEFAULT '',    -- Cloudflare country of the visitor
  letterOptIn   INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending | paid | refund_requested | refunded | refund_manual | failed
  flwTxId       TEXT,
  paidAt        TEXT,
  paidAmount    REAL,
  paidCurrency  TEXT,
  channel       TEXT,                        -- Flutterwave payment_type: card, mobilemoneyug, mpesa, ...
  emailStatus   TEXT NOT NULL DEFAULT '',
  capiStatus    TEXT NOT NULL DEFAULT '',
  listStatus    TEXT NOT NULL DEFAULT '',
  notifyStatus  TEXT NOT NULL DEFAULT '',
  fbp           TEXT NOT NULL DEFAULT '',
  fbc           TEXT NOT NULL DEFAULT '',
  userAgent     TEXT NOT NULL DEFAULT '',
  ipHash        TEXT NOT NULL DEFAULT '',
  source        TEXT NOT NULL DEFAULT '',    -- utm_source/utm_campaign/utm_content and the page path
  downloads     INTEGER NOT NULL DEFAULT 0,
  refundReason  TEXT NOT NULL DEFAULT '',
  refundAt      TEXT,
  note          TEXT NOT NULL DEFAULT ''     -- last provider error, never shown to buyers
);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Every download, for support and to spot a link being shared.
CREATE TABLE IF NOT EXISTS downloads (
  orderId   TEXT NOT NULL,
  fileId    TEXT NOT NULL,
  at        TEXT NOT NULL,
  ipHash    TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_downloads_order ON downloads(orderId, fileId);

-- Rate limit for checkout starts and "resend my link" requests, per salted IP hash per UTC hour.
CREATE TABLE IF NOT EXISTS checkout_rate (
  ipHash TEXT NOT NULL,
  hour   TEXT NOT NULL,
  kind   TEXT NOT NULL,
  count  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ipHash, hour, kind)
);

-- Giving (on-site, once or monthly). Same Worker, same payment check.
CREATE TABLE IF NOT EXISTS gifts (
  id            TEXT PRIMARY KEY,            -- Flutterwave tx_ref, GV-XXXXXXXX (renewals: the Flutterwave tx_ref)
  token         TEXT NOT NULL UNIQUE,
  createdAt     TEXT NOT NULL,
  kind          TEXT NOT NULL DEFAULT 'first',   -- first | renewal
  frequency     TEXT NOT NULL,               -- once | monthly
  currency      TEXT NOT NULL,
  amount        INTEGER NOT NULL,            -- total charged, set by the server
  coverFee      INTEGER NOT NULL DEFAULT 0,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL DEFAULT '',
  country       TEXT NOT NULL DEFAULT '',
  note          TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed
  planId        TEXT,
  flwTxId       TEXT,
  paidAt        TEXT,
  channel       TEXT,
  emailStatus   TEXT NOT NULL DEFAULT '',
  listStatus    TEXT NOT NULL DEFAULT '',
  notifyStatus  TEXT NOT NULL DEFAULT '',
  capiStatus    TEXT NOT NULL DEFAULT '',
  fbp           TEXT NOT NULL DEFAULT '',
  fbc           TEXT NOT NULL DEFAULT '',
  userAgent     TEXT NOT NULL DEFAULT '',
  ipHash        TEXT NOT NULL DEFAULT '',
  source        TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_gifts_email ON gifts(email);
CREATE INDEX IF NOT EXISTS idx_gifts_created ON gifts(createdAt DESC);

-- Partners: everyone who has given. Exported by the owner; also synced to the letter list.
CREATE TABLE IF NOT EXISTS partners (
  email         TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL DEFAULT '',
  country       TEXT NOT NULL DEFAULT '',
  firstGiftAt   TEXT NOT NULL,
  lastGiftAt    TEXT NOT NULL,
  gifts         INTEGER NOT NULL DEFAULT 0,
  monthly       INTEGER NOT NULL DEFAULT 0,  -- 1 while a monthly gift is active
  manageToken   TEXT NOT NULL,
  listStatus    TEXT NOT NULL DEFAULT ''
);

-- Flutterwave monthly payment plans, one per currency and amount, created on first use.
CREATE TABLE IF NOT EXISTS plans (
  k         TEXT PRIMARY KEY,                -- e.g. USD:25
  planId    TEXT NOT NULL,
  createdAt TEXT NOT NULL
);
