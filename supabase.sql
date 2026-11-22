-- Run once in Supabase → SQL Editor
create table if not exists public.attempts (
  id         bigint generated always as identity primary key,
  device_id  text        not null check (device_id ~ '^[a-z0-9]{8,32}$'),
  quiz_set   int         not null check (quiz_set between 1 and 3),
  taken_at   timestamptz not null,
  score      int         not null,
  total      int         not null check (total > 0),
  wrong      int[]       not null default '{}',
  unique (device_id, taken_at)
);
create index if not exists attempts_device_idx on public.attempts (device_id, taken_at);
-- Lock the table: the browser can't touch it; only the server key used by /api can.
alter table public.attempts enable row level security;
