-- 0004_private_storage_buckets.sql
-- Keeps the contact form's upload buckets private. Run this in the
-- Supabase SQL editor; it is safe to re-run.
--
-- `audio` and `images` hold visitor voice notes and selfies. They are
-- written only by app/api/contact through the service-role key and read
-- back through signed URLs, so no browser role needs any access, and
-- the site never serves these files publicly.

insert into storage.buckets (id, name, public)
values ('audio', 'audio', false), ('images', 'images', false)
on conflict (id) do nothing;

-- Not public, and capped to what the API route itself accepts
-- (see MAX_AUDIO_BYTES / MAX_IMAGE_BYTES and the content types it sets).
update storage.buckets
set public = false,
    file_size_limit = 12582912,
    allowed_mime_types = array['audio/webm']
where id = 'audio';

update storage.buckets
set public = false,
    file_size_limit = 3145728,
    allowed_mime_types = array['image/jpeg']
where id = 'images';

-- Drop any policy on storage.objects that grants the public, anon, or
-- authenticated roles access to these buckets (uploads, listing, or
-- reads). The service-role key bypasses RLS and needs none of them.
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and roles && array['public', 'anon', 'authenticated']::name[]
      and (
        coalesce(qual, '') ~ '''(audio|images)'''
        or coalesce(with_check, '') ~ '''(audio|images)'''
      )
  loop
    execute format('drop policy if exists %I on storage.objects', pol.policyname);
  end loop;
end $$;
