-- 0002_research_responses.sql
-- Storage for the "Add a Perspective" research response system.
-- Run this in the Supabase SQL editor for this project. There is no
-- migration runner wired up in this repo (the existing `submissions`
-- table was created the same way), so this file is the source of
-- truth for the schema, not something applied automatically.

create table if not exists research_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Which research project this responds to. Validated server-side
  -- against lib/research.ts at write time, not trusted as-is.
  project_slug text not null,

  -- The perspective itself. Length-capped server-side before it ever
  -- reaches this insert.
  perspective text not null,

  -- Optional self-identification. Neither is required; a visitor can
  -- submit anonymously.
  respondent_name text,
  respondent_email text,

  -- Same abuse-signal shape as `submissions`, kept minimal on purpose:
  -- this table does not need the contact form's full trust-scoring.
  ip_address text,

  -- Admin triage. 'considered' marks a response that fed back into the
  -- actual research, the understated version of "this changed my mind."
  status text not null default 'unread' check (status in ('unread', 'read', 'considered', 'archived')),
  is_spam boolean not null default false
);

create index if not exists research_responses_project_slug_idx on research_responses (project_slug);
create index if not exists research_responses_ip_created_idx on research_responses (ip_address, created_at);

-- Defense in depth: this table is only ever written to via the
-- service-role key from app/api/research/respond, never from the
-- browser. RLS with no policies means the anon key (present client
-- side as NEXT_PUBLIC_SUPABASE_ANON_KEY, though unused today) cannot
-- read or write this table even if something started using it.
alter table research_responses enable row level security;
