-- 001 — archive enquiries instead of deleting them.
--
-- Run this in the Supabase SQL editor BEFORE deploying the release that
-- introduces the archive. The application filters on `deleted_at`, so without
-- this column the admin enquiries list fails with
-- "column enquiries.deleted_at does not exist".
--
-- Safe to run more than once. Adds a nullable column and an index; touches no
-- existing data; every current row keeps deleted_at = null, which means "in the
-- inbox", which is what they all are.
--
-- Why it exists: these rows are the only record that a builder asked for a crew
-- or a worker registered. Postgres deletes have no undo, and Supabase's free
-- plan has no point-in-time recovery. Take a backup first anyway:
--
--   npm run db:backup

alter table enquiries add column if not exists deleted_at timestamptz;

create index if not exists enquiries_deleted_at_idx on enquiries (deleted_at);
