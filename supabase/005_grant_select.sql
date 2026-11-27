-- 005_grant_select.sql
-- Run in the Supabase SQL Editor AFTER 001–004.
--
-- FIXES: "We could not submit your application. Please check your internet
-- connection and try again." on the final Submit step, and the silent
-- failure of every section auto-save.
--
-- Root cause: with row-level security enabled, an UPDATE/DELETE also needs
-- SELECT privilege on the table so Postgres can evaluate the policy's
-- "using" clause. 004_funnel.sql granted anon UPDATE but never SELECT, so
-- every section update (PATCH) and the final submit failed with:
--   code 42501 "permission denied for table enquiries"
--   hint: GRANT SELECT ON public.enquiries TO anon
--
-- SAFETY: this grant does NOT expose any data. RLS is enabled on
-- public.enquiries and there is NO select policy for the anon role, so
-- anon still sees zero rows. The grant only lets Postgres evaluate the
-- "website can update in-progress lead" policy when the site PATCHes its
-- own in-progress row.

grant select on public.enquiries to anon;

-- verify (should return true):
--   select has_table_grant('anon', 'public.enquiries', 'select');
-- verify anon still sees nothing (should return []):
--   (from the site) GET /rest/v1/enquiries?select=ref with the anon key
