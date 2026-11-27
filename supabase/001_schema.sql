-- Cardwise enquiries table
-- Supabase Dashboard -> SQL Editor -> New query -> poora paste karein -> Run

create table if not exists public.enquiries (
  id                     bigint generated always as identity primary key,
  created_at             timestamptz not null default now(),
  ref                    text not null unique check (ref ~ '^CW-[A-Z0-9]{8}$'),

  -- current card
  bank                   text not null check (char_length(bank) between 2 and 120),
  card_variant           text not null check (char_length(card_variant) between 2 and 160),
  card_network           text not null check (card_network in ('Visa','Mastercard','RuPay','American Express','Diners Club','Not sure')),
  card_last4             text not null check (card_last4 ~ '^[0-9]{4}$'),
  name_on_card           text not null check (char_length(name_on_card) between 2 and 120),
  card_held_since        text not null check (char_length(card_held_since) <= 40),
  credit_limit           text not null check (char_length(credit_limit) <= 40),
  late_payment_12m       boolean not null,

  -- applicant
  full_name              text not null check (char_length(full_name) between 2 and 120),
  mobile                 text not null check (mobile ~ '^[6-9][0-9]{9}$'),
  email                  text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' and char_length(email) <= 254),
  age_group              text not null check (char_length(age_group) <= 20),
  city                   text not null check (char_length(city) between 2 and 80),
  pin_code               text not null check (pin_code ~ '^[1-9][0-9]{5}$'),
  employment             text not null check (char_length(employment) <= 60),
  monthly_income         text not null check (char_length(monthly_income) <= 40),

  -- needs
  interested_in          text not null check (interested_in in ('rubyx','coral','rupay','upgrade','unsure')),
  monthly_spend          text not null check (char_length(monthly_spend) <= 40),
  benefits               text[] not null default '{}' check (cardinality(benefits) <= 10),
  language               text not null check (char_length(language) <= 30),
  call_time              text not null check (char_length(call_time) <= 40),

  -- consent (must be true)
  confirm_primary_holder boolean not null check (confirm_primary_holder),
  consent_contact        boolean not null check (consent_contact),

  -- campaign tracking (optional)
  utm_source             text check (char_length(utm_source) <= 100),
  utm_campaign           text check (char_length(utm_campaign) <= 100),

  -- for your team
  status                 text not null default 'new' check (status in ('new','contacted','applied','closed'))
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_mobile_idx on public.enquiries (mobile);

-- Security: the website (anon role) can ONLY insert new rows. It cannot read, edit or delete.
alter table public.enquiries enable row level security;

revoke all on public.enquiries from anon, authenticated;
grant insert (
  ref, bank, card_variant, card_network, card_last4, name_on_card, card_held_since, credit_limit,
  late_payment_12m, full_name, mobile, email, age_group, city, pin_code, employment, monthly_income,
  interested_in, monthly_spend, benefits, language, call_time, confirm_primary_holder, consent_contact,
  utm_source, utm_campaign
) on public.enquiries to anon;

drop policy if exists "website can insert enquiries" on public.enquiries;
create policy "website can insert enquiries"
  on public.enquiries for insert to anon
  with check (confirm_primary_holder and consent_contact);

-- Simple flood protection: same mobile number max 3 enquiries per 24 hours.
create or replace function public.enquiries_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.enquiries
      where mobile = new.mobile and created_at > now() - interval '24 hours') >= 3 then
    raise exception 'Too many enquiries for this mobile number. Please try again later.';
  end if;
  return new;
end $$;

drop trigger if exists enquiries_rate_limit on public.enquiries;
create trigger enquiries_rate_limit before insert on public.enquiries
  for each row execute function public.enquiries_rate_limit();

-- Data dekhne ke liye: Supabase Dashboard -> Table Editor -> enquiries
-- (Dashboard admin access se dikhta hai; website se koi bhi data padh nahi sakta.)
