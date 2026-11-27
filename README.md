# Cardwise (React + Vite) on Netlify + Supabase

```
landing/
├─ src/
│  ├─ pages/Home.jsx      Coral-style landing (hero, benefits, fees, finder, FAQs)
│  ├─ pages/Apply.jsx     5-step enquiry form (cardholders only) → Supabase
│  ├─ pages/ThankYou.jsx  Confirmation page after form submit
│  ├─ pages/Admin.jsx     Admin panel: login, realtime table, Excel/PDF export
│  ├─ components/         Header (mega menu), Footer, CardVisual, Modal
│  ├─ data/cards.js       Your card catalogue (edit names, fees, features here)
│  ├─ data/banks.js       Indian banks + card variants for the form
│  └─ lib/supabase.js     Supabase client (reads Netlify env vars)
├─ public/                _headers (security), robots.txt, favicon
├─ supabase/              001_schema.sql → 002_admin.sql → 003_more_cards.sql
├─ netlify.toml           Build settings + SPA routing
└─ legacy-static/         Old plain-HTML version (not deployed)
```

## 1. Local run
```powershell
npm install
copy .env.example .env      # then put your Supabase values in .env
npm run dev                 # http://localhost:5173
```

## 2. Supabase (one time)
1. In the SQL Editor run, in order: `001_schema.sql`, `002_admin.sql`, `003_more_cards.sql`,
   **`004_funnel.sql`**, **`005_grant_select.sql`**.
   - `004_funnel.sql` is what powers the real-time section-by-section leads (in-progress rows,
     IP/device capture, conversion codes). Without it, the live admin view does not work.
   - `005_grant_select.sql` fixes the final "Submit" failing with *"We could not submit your
     application"* (and the silent auto-save failures): under RLS a website UPDATE/DELETE also
     needs `SELECT` privilege so Postgres can evaluate the policy's `using` clause. It grants
     `SELECT` to `anon` **without exposing data** (RLS stays on, no select policy exists, so
     anon still sees zero rows).
   - Already ran 001–004 earlier? Then run only `005_grant_select.sql`.
2. Authentication → Users → Add user: `admin@cardwise.local` + strong password, with **Auto Confirm User** ticked.
3. Run the `insert into public.admins …` line from the bottom of `002_admin.sql`.
4. Turn OFF "Allow new users to sign up".
5. **Forgot-password (one time):** Authentication → URL Configuration → set **Recovery** (and
   New user sign in) to `https://YOUR-SITE/admin` — that's where the "Set new password" link
   opens. Keep the **Email** provider on **Default** (so Supabase actually sends the reset email);
   if you switch it to *Custom/SES*, no reset email is sent automatically.

## 3. Netlify deploy
**GitHub (recommended):** push this folder to a GitHub repo, then in Netlify choose
"Add new site → Import from Git". Build settings come from `netlify.toml`
(`npm run build`, publish `dist`).

**CLI:**
```powershell
npm install -g netlify-cli
netlify login
netlify init                       # create/link the site
netlify deploy --build --prod
```

**Environment variables** (Netlify → Site configuration → Environment variables), then redeploy:
| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon / publishable key (never service_role) |
| `VITE_ADMIN_EMAIL` | `admin@cardwise.local` |

## 4. URLs
- `/`: Coral-style landing page (hero, benefits, fees, finder, FAQs)
- `/apply`: enquiry form (`/apply?card=rubyx` pre-selects a card)
- `/thank-you`: confirmation page shown after a successful submit
- `/admin`: admin panel. User ID **admin** + the password you set in Supabase.

## Admin credentials
- **User ID / email:** `admin@cardwise.local` (or just type `admin` in the User ID box)
- **Password:** the strong password you created in Supabase (step 2 above)


Forgot the admin password? In Supabase SQL Editor:
```sql
update auth.users set encrypted_password = extensions.crypt('NewStrongPassword', extensions.gen_salt('bf'))
where email = 'admin@cardwise.local';
```
