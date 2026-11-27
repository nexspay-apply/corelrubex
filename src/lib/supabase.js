import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@cardwise.local';
export const TABLE = 'enquiries';
export const CONVERSION_TABLE = 'conversion_codes';
export const configured = Boolean(url && key && !/YOUR-/.test(url + key));

// Public site: no session needed. Admin: separate client that keeps the login session.
export const publicClient = configured
  ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

let admin = null;
export function adminClient() {
  if (!configured) return null;
  if (!admin) admin = createClient(url, key, { auth: { storageKey: 'cardwise-admin' } });
  return admin;
}
