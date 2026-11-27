// Step-by-step application saving.
// Every "Continue" on the apply form POSTs the data collected so far to /api/lead.
// Step 1 creates ONE row in Supabase `enquiries` (status "in_progress"); every later step
// and the final submit update that SAME row (matched by its ref). Final submit sets status "new".
// Runs with the Supabase service-role key so it does not depend on the website's anon permissions.

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = 'enquiries';
const REF_RE = /^CW-[A-Z0-9]{8}$/;

const TEXT = {
  full_name: 120, mobile: 10, bank: 120, card_variant: 160, card_network: 40, card_last4: 4,
  name_on_card: 120, card_held_since: 40, credit_limit: 40, email: 254, age_group: 20, city: 80,
  pin_code: 6, employment: 60, monthly_income: 40, interested_in: 20, monthly_spend: 40,
  language: 30, call_time: 40, utm_source: 100, utm_campaign: 100, device: 20, user_agent: 400
};
const BOOL = ['late_payment_12m', 'confirm_primary_holder', 'consent_contact'];

const json = (body, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

function makeRef() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', b = new Uint8Array(8);
  crypto.getRandomValues(b);
  return 'CW-' + [...b].map(x => a[x % a.length]).join('');
}

// Keep only known columns, with sane types and lengths. Empty values are skipped so a
// later step never wipes data saved by an earlier one.
function clean(data) {
  const out = {};
  if (!data || typeof data !== 'object') return out;
  for (const [k, max] of Object.entries(TEXT)) {
    const val = data[k];
    if (typeof val === 'string' && val.trim()) out[k] = val.trim().slice(0, max);
  }
  for (const k of BOOL) if (typeof data[k] === 'boolean') out[k] = data[k];
  if (Array.isArray(data.benefits)) out.benefits = data.benefits.filter(x => typeof x === 'string').slice(0, 10).map(x => x.slice(0, 60));
  if (out.email) out.email = out.email.toLowerCase();
  if (out.mobile && !/^[6-9]\d{9}$/.test(out.mobile)) delete out.mobile;
  return out;
}

async function rest(method, query, body, prefer) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}${query}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      authorization: `Bearer ${SERVICE_KEY}`,
      'content-type': 'application/json',
      prefer: prefer || 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let parsed = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }
  return { ok: res.ok, status: res.status, data: parsed };
}

function fail(r) {
  const msg = (r.data && r.data.message) || '';
  if (/too many enquiries/i.test(msg)) return json({ ok: false, error: 'too_many' }, 429);
  console.error('supabase error', r.status, msg);
  return json({ ok: false, error: 'db_error', message: msg.slice(0, 200) }, 502);
}

async function handleLead(req, context) {
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ ok: false, error: 'not_configured' }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  if (body.website) return json({ ok: true, ref: makeRef() }); // honeypot

  const final = body.final === true;
  const row = clean(body.data);
  if (context?.ip) row.ip = String(context.ip).slice(0, 64);
  const country = context?.geo?.country?.name;
  if (country) row.geo_country = String(country).slice(0, 80);

  if (final) {
    if (!row.confirm_primary_holder || !row.consent_contact) return json({ ok: false, error: 'consent_required' }, 400);
    row.status = 'new';
  }

  // Update the existing in-progress row (same row for every step)
  const ref = typeof body.ref === 'string' && REF_RE.test(body.ref) ? body.ref : null;
  if (ref) {
    const r = await rest('PATCH', `?ref=eq.${ref}&status=eq.in_progress&select=ref`, row);
    if (!r.ok) return fail(r);
    if (Array.isArray(r.data) && r.data.length) return json({ ok: true, ref });
    // Row missing or already submitted → start a fresh row below
  }

  if (!row.full_name || !row.mobile) return json({ ok: false, error: 'name_mobile_required' }, 400);
  const newRef = makeRef();
  const r = await rest('POST', '?select=ref', { ...row, ref: newRef, status: final ? 'new' : 'in_progress' });
  if (!r.ok) return fail(r);
  return json({ ok: true, ref: newRef });
}

export default async (req, context) => {
  const { pathname } = new URL(req.url);
  if (pathname === '/api/lead') {
    try { return await handleLead(req, context); }
    catch (e) { console.error(e); return json({ ok: false, error: 'server_error' }, 500); }
  }
  return json({ ok: false, error: 'not_found' }, 404);
};

export const config = { path: '/api/*' };
