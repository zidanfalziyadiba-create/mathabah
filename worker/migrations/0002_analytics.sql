CREATE TABLE IF NOT EXISTS analytics_daily (
  day TEXT PRIMARY KEY,
  page_views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS analytics_daily_visitors (
  day TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  PRIMARY KEY (day, visitor_hash)
);

CREATE TABLE IF NOT EXISTS analytics_live_sessions (
  visitor_hash TEXT PRIMARY KEY,
  last_seen_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_live_seen
  ON analytics_live_sessions(last_seen_at);
