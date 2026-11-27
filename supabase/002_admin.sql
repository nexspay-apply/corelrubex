-- Cardwise admin access + realtime
-- 001_schema.sql run karne ke BAAD ise SQL Editor mein run karein.

-- Admin notes column
alter table public.enquiries add column if not exists notes text check (char_length(notes) <= 2000);

-- Admins list: sirf jo user yahan hai wahi data dekh sakta hai
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Logged-in admin: read, change status/notes, delete
grant select, delete on public.enquiries to authenticated;
grant update (status, notes) on public.enquiries to authenticated;

drop policy if exists "admins read enquiries"   on public.enquiries;
drop policy if exists "admins update enquiries" on public.enquiries;
drop policy if exists "admins delete enquiries" on public.enquiries;
create policy "admins read enquiries"   on public.enquiries for select to authenticated using (public.is_admin());
create policy "admins update enquiries" on public.enquiries for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete enquiries" on public.enquiries for delete to authenticated using (public.is_admin());

-- Realtime: naye enquiries admin panel mein turant dikhenge (RLS ke saath, sirf admin ko)
do $$ begin
  alter publication supabase_realtime add table public.enquiries;
exception when duplicate_object then null; end $$;

-- ───────────────────────────────────────────────────────────────
-- ADMIN USER BANANA (one time):
-- 1. Dashboard -> Authentication -> Users -> "Add user" -> "Create new user"
--    Email: admin@cardwise.local   (ya apni real email; config.js mein ADMIN_EMAIL wahi rakhein)
--    Password: strong password (min 8+ characters)   ✔ "Auto Confirm User" tick karein
-- 2. Phir ye line run karein (email apni wali likhein):
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'admin@cardwise.local'
-- on conflict do nothing;
--
-- 3. Authentication -> Sign In / Providers -> "Allow new users to sign up" OFF kar dein.
-- ───────────────────────────────────────────────────────────────
