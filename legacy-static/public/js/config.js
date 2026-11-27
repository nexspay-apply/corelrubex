// Supabase connection settings.
// Supabase Dashboard -> Project Settings -> API (or "API Keys") se copy karein.
// Yahan SIRF public "anon" / "publishable" key daalein. "service_role" / "secret" key KABHI nahi.
window.CARDWISE_CONFIG = {
  SUPABASE_URL: 'https://YOUR-PROJECT-REF.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR-ANON-OR-PUBLISHABLE-KEY',
  TABLE: 'enquiries',
  // Admin login par User ID "admin" likhne se is email se login hota hai.
  // Supabase -> Authentication -> Users mein isi email ka user banayein.
  ADMIN_EMAIL: 'admin@cardwise.local'
};
