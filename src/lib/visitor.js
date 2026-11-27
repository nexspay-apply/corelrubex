// Visitor context + conversion-code injection for the landing funnel.
// Runs in the browser; no backend required.

import { publicClient, configured, CONVERSION_TABLE } from './supabase.js';

export const VISITOR_KEY = 'cw_visitor';

/* Which browser-side signals mark this session as "from Google CPC"? */
function cpcHit() {
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get('utm_source') === 'Google_Web') return true;
    const src = (q.get('utm_source') || '').toLowerCase();
    if (/google|gclid|cpc|adwords/.test(src)) return true;
    return Boolean(q.get('gclid'));
  } catch { return false; }
}

/* Persisted per-visitor context. Written once at page load; the apply form
   uses it to key an in-progress enquiry row, and the admin panel sees it. */
export function visitorContext() {
  let ctx;
  try { ctx = JSON.parse(localStorage.getItem(VISITOR_KEY) || 'null'); } catch { ctx = null; }
  if (!ctx || !/^\S+-[A-Z0-9]{8}$/.test(ctx.ref || '')) {
    const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const b = new Uint8Array(8);
    crypto.getRandomValues(b);
    ctx = { rid: Math.random().toString(36).slice(2, 10), ref: 'CW-' + [...b].map(x => a[x % a.length]).join(''), cpc: cpcHit() };
    try { localStorage.setItem(VISITOR_KEY, JSON.stringify(ctx)); } catch { /* private mode */ }
  }
  return ctx;
}

/* Browser device profile. `navigator.userAgentData` where available, else UA parsing. */
export function deviceInfo() {
  const ua = navigator.userAgent || 'unknown';
  const brand = ((navigator.userAgentData?.brands || [])[0]?.brand) || '';
  let platform = (navigator.userAgentData?.platform) || ua;
  if (ua.includes('Windows')) platform = 'Windows';
  else if (ua.includes('Android')) platform = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('Mac')) platform = 'iOS';
  else if (ua.includes('Linux')) platform = 'Linux';
  else if (ua.includes('CrOS')) platform = 'ChromeOS';
  const mobile = /Mobi|Android|iP(hone|ad|od)/i.test(ua) || (navigator.userAgentData?.mobile || false);
  const device = mobile ? 'Mobile' : 'Desktop';
  return { user_agent: ua.slice(0, 400), brand, platform, device };
}

/* Visitor IP + country via public lookups; falls back gracefully. */
async function lookupIp() {
  const endpoints = [
    () => fetch('https://api.ipify.org?format=json').then(r => r.json()).then(j => j.ip),
    () => fetch('https://ipapi.co/json/').then(r => r.json()).then(j => j.ip).catch(() => fetch('https://api.ipify.org?format=json').then(r => r.json()).then(j => j.ip)),
  ];
  let ip = null, country = null;
  for (const ep of endpoints) {
    try {
      const j = await ep();
      ip = j.ip || null;
      country = j.country_name || null;
      if (ip) break;
    } catch { /* next endpoint */ }
  }
  return { ip: ip || 'unknown', geo_country: country || 'unknown' };
}

export async function collectVisitorMeta() {
  const dev = deviceInfo();
  const ip = await lookupIp();
  return { ip: ip.ip, geo_country: ip.geo_country, device: dev.device, user_agent: dev.user_agent };
}

/* Inject admin-managed conversion codes for the given page into <head>.
   Safe to call on every page; dedupes by a data marker. */
export function injectConversionCodes(page) {
  if (!configured) return;
  const marker = 'data-cw-conversion';
  document.head.querySelectorAll(`[${marker}]`).forEach(n => n.remove());
  publicClient
    .from(CONVERSION_TABLE)
    .select('page, code, enabled')
    .eq('enabled', true)
    .in('page', [page, 'all'])
    .then(({ data }) => {
      const codes = (data || []).map(r => r.code).filter(Boolean);
      codes.forEach((code, i) => {
        const el = document.createElement('script');
        el.setAttribute(marker, `${page}:${i}`);
        el.textContent = code; // trusted admin input
        document.head.appendChild(el);
      });
    })
    .catch(() => { /* offline / not configured: skip silently */ });
}
