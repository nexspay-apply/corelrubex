-- 006_repair_permissions.sql
-- Run in the Supabase SQL Editor. Safe to run any number of times.
--
-- FIXES: clicking "Continue" on step 1 of the apply form showing
--   "Could not save your progress yet — it will be saved when you submit."
--
-- Root cause: the live database still has the ORIGINAL website permissions
-- from 001_schema.sql (for example, because 001 was re-run after 004). The
-- website may not insert the "status" / IP / device columns, and the old
-- insert policy only accepts fully completed applications, so creating the
-- step-1 "in_progress" lead fails with:
--   code 42501 "permission denied for table enquiries"
--
-- This script re-applies the permission parts of 003, 004 and 005 in one go.

-- Card choices (003)
alter table public.enquiries drop constraint if exists enquiries_interested_in_check;
alter table public.enquiries add constraint enquiries_interested_in_check
  check (interested_in in ('emeralde','sapphiro','rubyx','coral','rupay','upgrade','unsure'));

-- Status values (004)
alter table public.enquiries drop constraint if exists enquiries_status_check;
alter table public.enquiries add constraint enquiries_status_check
  check (status in ('in_progress','new','contacted','applied','closed'));

-- IP / device columns (004)
alter table public.enquiries add column if not exists ip          text;
alter table public.enquiries add column if not exists device      text;
alter table public.enquiries add column if not exists user_agent  text check (char_length(user_agent) <= 400);
alter table public.enquiries add column if not exists geo_country text;

-- Later-section columns must be nullable for an in-progress row (004)
do $$
declare c text;
begin
  foreach c in array array[
    'full_name','mobile','bank','card_variant','card_network','card_last4','name_on_card',
    'card_held_since','credit_limit','late_payment_12m','email','age_group','city','pin_code',
    'employment','monthly_income','interested_in','monthly_spend','language','call_time',
    'confirm_primary_holder','consent_contact'
  ] loop
    execute format('alter table public.enquiries alter column %I drop not null', c);
  end loop;
end $$;

-- Website (anon) privileges (004 + 005)
revoke insert, update on public.enquiries from anon;
grant insert (
  ref, full_name, mobile, status,
  ip, device, user_agent, geo_country,
  utm_source, utm_campaign,
  -- also allow a complete row in one go (fallback used by the final submit)
  bank, card_variant, card_network, card_last4, name_on_card, card_held_since, credit_limit,
  late_payment_12m, email, age_group, city, pin_code, employment, monthly_income,
  interested_in, monthly_spend, benefits, language, call_time, confirm_primary_holder, consent_contact
) on public.enquiries to anon;

grant update (
  bank, card_variant, card_network, card_last4, name_on_card, card_held_since, credit_limit,
  late_payment_12m, email, age_group, city, pin_code, employment, monthly_income,
  interested_in, monthly_spend, benefits, language, call_time, confirm_primary_holder,
  consent_contact, utm_source, utm_campaign, status, ip, device, user_agent, geo_country,
  full_name, mobile
) on public.enquiries to anon;

-- Needed so Postgres can evaluate the update policy. RLS has no anon select
-- policy, so anon still reads zero rows. (005)
grant select on public.enquiries to anon;

-- Policies (004): website inserts an in-progress lead OR a completed application,
-- and may update only its own in-progress lead.
drop policy if exists "website can insert enquiries" on public.enquiries;
drop policy if exists "website can insert in-progress lead" on public.enquiries;
create policy "website can insert in-progress lead"
  on public.enquiries for insert to anon
  with check (status = 'in_progress' or (status = 'new' and confirm_primary_holder and consent_contact));

drop policy if exists "website can update in-progress lead" on public.enquiries;
create policy "website can update in-progress lead"
  on public.enquiries for update to anon
  using (status = 'in_progress')
  with check (status in ('in_progress','new'));

-- Rate limit counts only completed leads (004)
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

-- Ask PostgREST to pick up the new grants immediately
notify pgrst, 'reload schema';
