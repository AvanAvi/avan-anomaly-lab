-- 0003_lock_down_submissions.sql
-- Least-privilege access for the contact form's `submissions` table.
-- Run this in the Supabase SQL editor. Like 0002, nothing applies it
-- automatically; it is safe to re-run.
--
-- The table was created in the dashboard, so its access rules never
-- lived in the repo. It holds visitor messages, contact details, IP
-- addresses, and location data, and is only ever written through the
-- service-role key from app/api/contact (which bypasses RLS). Enabling
-- RLS with no policies means the public anon key can neither read nor
-- write it, no matter what is granted at the table level.

alter table if exists submissions enable row level security;
alter table if exists research_responses enable row level security;

-- Drop any permissive policies that may have been added in the
-- dashboard while prototyping. Policies are listed and dropped by name
-- so this works without knowing what they were called.
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('submissions', 'research_responses')
  loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

-- Belt and braces: the browser-facing roles have no reason to touch
-- these tables at all.
do $$
begin
  if to_regclass('public.submissions') is not null then
    revoke all on table public.submissions from anon, authenticated;
  end if;
  if to_regclass('public.research_responses') is not null then
    revoke all on table public.research_responses from anon, authenticated;
  end if;
end $$;
