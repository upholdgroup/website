-- Uphold Group — schema for the Supabase driver.
--
-- Run once in the Supabase SQL editor. The app talks to these tables with the
-- service-role key from server code only, so RLS is enabled with no policies:
-- the service role bypasses it, and anon/authenticated get nothing. That is
-- deliberate — no browser ever queries these directly.

create table if not exists jobs (
  id              text primary key,
  slug            text not null unique,
  title           text not null,
  positions       integer not null default 1 check (positions between 1 and 200),
  suburb          text not null,
  region          text not null,
  trade           text not null,
  employment_type text not null check (employment_type in ('Casual', 'Contract', 'Permanent')),
  duration        text not null,
  note            text not null,
  posted          date not null default current_date,
  valid_through   date not null,
  summary         text not null,
  requirements    text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- The board and every region/trade page filter on this.
create index if not exists jobs_valid_through_idx on jobs (valid_through desc);

create table if not exists enquiries (
  id          bigint generated always as identity primary key,
  reference   text not null unique,
  kind        text not null check (kind in ('host-request', 'worker-registration')),
  received_at timestamptz not null default now(),
  fields      jsonb not null,
  attachments text[] not null default '{}',
  status      text not null default 'new' check (status in ('new', 'assigned', 'closed')),
  assigned_to text
);

-- Archiving, not deleting. See the note at the foot of this file.
alter table enquiries add column if not exists deleted_at timestamptz;

create index if not exists enquiries_received_at_idx on enquiries (received_at desc);
create index if not exists enquiries_status_idx on enquiries (status);
create index if not exists enquiries_deleted_at_idx on enquiries (deleted_at);

-- Hire desk accounts. Passwords are scrypt hashes and recovery codes are
-- hashed the same way, so this table holds no recoverable secret except the
-- TOTP seed, which is why it is never exposed outside server code.
create table if not exists admin_users (
  email           text primary key,
  -- admin can do anything, including managing people and deleting records.
  -- manager is the recruiter seat: roles and enquiries, nothing destructive.
  role            text not null default 'manager' check (role in ('admin', 'manager')),
  -- Set when an admin creates the account with a temporary password.
  must_change_password boolean not null default false,
  password_hash   text not null,
  totp_secret     text,
  totp_enabled    boolean not null default false,
  recovery_codes  text[] not null default '{}',
  failed_attempts integer not null default 0,
  locked_until    timestamptz,
  created_at      timestamptz not null default now(),
  last_login_at   timestamptz
);

alter table jobs        enable row level security;
alter table enquiries   enable row level security;
alter table admin_users enable row level security;

-- Keep updated_at honest.
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists jobs_updated_at on jobs;
create trigger jobs_updated_at before update on jobs
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Retention and recovery.
--
-- Nothing in the application ever deletes an enquiry. "Delete" in the admin
-- sets deleted_at, the row stays, and it can be restored. That is deliberate:
-- these rows are the only record of a labour request or a worker
-- registration, a mis-click is unrecoverable on a plan without
-- point-in-time recovery, and it has already happened once on this project.
--
-- Two obligations pull in opposite directions and both have to be met.
--
--   Privacy Act 1988 (Cth), APP 11.2 — personal information must be destroyed
--   or de-identified once it is no longer needed for any purpose for which it
--   may be used or disclosed. Keeping everything forever is not compliant.
--
--   Fair Work Act 2009 (Cth), s535 and reg 3.31-3.44 — employee records must
--   be kept for seven years. A worker you have PLACED is an employee, and
--   their records are not yours to delete on a 12-month cycle.
--
-- So the purge below covers only the rows that are neither: enquiries that
-- were archived in the admin, or closed and never became a placement. Run it
-- deliberately, not on a trigger, and take a backup first (npm run db:backup).
--
--   -- 1. Archived in the admin more than 90 days ago.
--   delete from enquiries
--   where deleted_at is not null
--     and deleted_at < now() - interval '90 days';
--
--   -- 2. Closed enquiries older than 12 months that never led to a placement.
--   --    Check this list before running it: anyone who was placed is an
--   --    employee and their records are covered by the seven-year rule.
--   select reference, kind, received_at, fields->>'name' as name
--   from enquiries
--   where status = 'closed' and received_at < now() - interval '12 months';
-- ---------------------------------------------------------------------------
