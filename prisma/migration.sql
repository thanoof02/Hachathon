-- PREPARED ONLY. Review and explicitly authorize before applying to Neon.
CREATE TABLE records (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX records_owner_kind_created_idx ON records(owner_id, kind, created_at DESC);

