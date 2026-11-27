-- 004_funnel.sql
-- Real-time section-by-section leads + per-page conversion codes + IP/device capture.
-- Run in the Supabase SQL Editor AFTER 001_schema.sql, 002_admin.sql and 003_more_cards.sql.

-- ─────────────────────────────────────────────────────────────────────
-- 1) Status: allow "in_progress" (a lead that has started but not finished)
-- ─────────────────────────────────────────────────────────────────────
alter table public.enquiries drop constraint if exists enquiries_status_check;
alter table public.enquiries add constraint enquiries_status_check
  check (status in ('in_progress','new','contacted','applied','closed'));

-- ─────────────────────────────────────────────────────────────────────
-- 2) IP / device capture (collected client-side on the visitor's browser)
-- ─────────────────────────────────────────────────────────────────────
alter table public.enquiries add column if not exists ip           text;
alter table public.enquiries add column if not exists device       text;
alter table public.enquiries add column if not exists user_agent   text check (char_length(user_agent) <= 400);
alter table public.enquiries add column if not exists geo_country  text;

-- ─────────────────────────────────────────────────────────────────────
-- 3) Make the "later section" columns nullable so an in-progress row can
--    exist with only  ref + full_name + mobile + status='in_progress'.
--    (full_name and mobile are captured on page 1, so they stay required.)
-- ─────────────────────────────────────────────────────────────────────
alter table public.enquiries alter column full_name drop not null;
alter table public.enquiries alter column mobile drop not null;
alter table public.enquiries alter column bank drop not null;
alter table public.enquiries alter column card_variant drop not null;
alter table public.enquiries alter column card_network drop not null;
alter table public.enquiries alter column card_last4 drop not null;
alter table public.enquiries alter column name_on_card drop not null;
alter table public.enquiries alter column card_held_since drop not null;
alter table public.enquiries alter column credit_limit drop not null;
alter table public.enquiries alter column late_payment_12m drop not null;
alter table public.enquiries alter column email drop not null;
alter table public.enquiries alter column age_group drop not null;
alter table public.enquiries alter column city drop not null;
alter table public.enquiries alter column pin_code drop not null;
alter table public.enquiries alter column employment drop not null;
alter table public.enquiries alter column monthly_income drop not null;
alter table public.enquiries alter column interested_in drop not null;
alter table public.enquiries alter column monthly_spend drop not null;
alter table public.enquiries alter column language drop not null;
alter table public.enquiries alter column call_time drop not null;
alter table public.enquiries alter column confirm_primary_holder drop not null;
alter table public.enquiries alter column consent_contact drop not null;

-- ─────────────────────────────────────────────────────────────────────
-- 4) anon (the website) now INSERTs an in-progress lead and UPDATEs its
--    own in-progress lead section by section. It cannot read, delete, or
--    touch a lead that is no longer in_progress.
-- ─────────────────────────────────────────────────────────────────────
revoke insert on public.enquiries from anon;
grant insert (
  ref, full_name, mobile, status,
  ip, device, user_agent, geo_country,
  utm_source, utm_campaign
) on public.enquiries to anon;

revoke update on public.enquiries from anon;
grant update (
  bank, card_variant, card_network, card_last4, name_on_card, card_held_since, credit_limit,
  late_payment_12m, email, age_group, city, pin_code, employment, monthly_income,
  interested_in, monthly_spend, benefits, language, call_time, confirm_primary_holder,
  consent_contact, utm_source, utm_campaign, status, ip, device, user_agent, geo_country,
  full_name, mobile
) on public.enquiries to anon;

drop policy if exists "website can insert enquiries" on public.enquiries;
create policy "website can insert in-progress lead"
  on public.enquiries for insert to anon
  with check (status = 'in_progress');

drop policy if exists "website can update in-progress lead" on public.enquiries;
create policy "website can update in-progress lead"
  on public.enquiries for update to anon
  using (status = 'in_progress')
  with check (status in ('in_progress','new'));

-- ─────────────────────────────────────────────────────────────────────
-- 5) Per-page conversion codes. Admin pastes a code for a page (or "all");
--    the public site loads it and injects it live. The code is a public ad
--    pixel, so anon may read it; only an admin may write it.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.conversion_codes (
  page      text primary key check (page in ('home','apply','thank_you','all')),
  code      text not null default '',
  enabled   boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.conversion_codes enable row level security;
grant select on public.conversion_codes to anon, authenticated;
grant insert, update, delete on public.conversion_codes to authenticated;

drop policy if exists "cc anon read" on public.conversion_codes;
create policy "cc anon read" on public.conversion_codes for select to anon using (true);

drop policy if exists "cc admin read" on public.conversion_codes;
create policy "cc admin read" on public.conversion_codes for select to authenticated using (public.is_admin());

drop policy if exists "cc admin write" on public.conversion_codes;
create policy "cc admin write" on public.conversion_codes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────
-- 6) Flood protection now counts only COMPLETED leads: abandoned in-progress
--    rows (reloads, drop-offs) must not burn the 3-per-24h mobile budget.
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.enquiries_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.enquiries
      where mobile = new.mobile
        and status <> 'in_progress'
        and created_at > now() - interval '24 hours') >= 3 then
    raise exception 'Too many enquiries for this mobile number. Please try again later.';
  end if;
  return new;
end $$;

drop trigger if exists enquiries_rate_limit on public.enquiries;
create trigger enquiries_rate_limit before insert on public.enquiries
  for each row execute function public.enquiries_rate_limit();

-- ─────────────────────────────────────────────────────────────────────
-- 7) Keep the conversion_codes table in sync for the admin dashboard
-- ─────────────────────────────────────────────────────────────────────
do $$ begin
  alter publication supabase_realtime add table public.conversion_codes;
exception when duplicate_object then null; end $$;
