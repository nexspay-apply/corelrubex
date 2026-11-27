-- Run once AFTER 001_schema.sql and 002_admin.sql.
-- Allows the new card choices (Emeralde, Sapphiro) in the "interested_in" column.
alter table public.enquiries drop constraint if exists enquiries_interested_in_check;
alter table public.enquiries add constraint enquiries_interested_in_check
  check (interested_in in ('emeralde','sapphiro','rubyx','coral','rupay','upgrade','unsure'));
