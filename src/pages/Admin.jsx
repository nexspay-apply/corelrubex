import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { adminClient, configured, ADMIN_EMAIL, TABLE, CONVERSION_TABLE } from '../lib/supabase.js';
import { interestLabel, INTEREST_OPTIONS } from '../data/cards.js';
import Modal from '../components/Modal.jsx';

const STATUS = ['in_progress', 'new', 'contacted', 'applied', 'closed'];
const STATUS_LABEL = { in_progress: 'In progress' };
const cap = s => STATUS_LABEL[s] || (s ? s[0].toUpperCase() + s.slice(1) : '');
const fmt = d => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const dayKey = d => new Date(d).toLocaleDateString('en-CA');
const stamp = () => new Date().toLocaleDateString('en-CA');
const CC_PAGES = [
  ['home', 'Home (/)'], ['apply', 'Apply (/apply)'], ['thank_you', 'Thank you (/thank-you)'], ['all', 'All pages (site-wide)']
];

const FIELDS = [
  ['ref', 'Reference'], ['created_at', 'Received'], ['status', 'Status'], ['full_name', 'Full name'], ['mobile', 'Mobile'], ['email', 'Email'],
  ['ip', 'IP address'], ['device', 'Device'], ['geo_country', 'Country'],
  ['age_group', 'Age'], ['city', 'City'], ['pin_code', 'PIN code'], ['employment', 'Employment'], ['monthly_income', 'Monthly income'],
  ['bank', 'Bank'], ['card_variant', 'Card variant'], ['card_network', 'Network'], ['card_last4', 'Last 4 digits'], ['name_on_card', 'Name on card'],
  ['card_held_since', 'Card held since'], ['credit_limit', 'Credit limit'], ['late_payment_12m', 'Late payment (12 mo)'],
  ['interested_in', 'Interested in'], ['monthly_spend', 'Monthly spend'], ['benefits', 'Benefits'], ['language', 'Language'], ['call_time', 'Best time to call'],
  ['confirm_primary_holder', 'Primary holder confirmed'], ['consent_contact', 'Consent to contact'],
  ['utm_source', 'UTM source'], ['utm_campaign', 'UTM campaign'], ['user_agent', 'User agent'], ['notes', 'Notes']
];
function val(r, k) {
  const v = r[k];
  if (k === 'created_at') return fmt(v);
  if (k === 'interested_in') return interestLabel(v);
  if (k === 'status') return cap(v || '');
  if (k === 'benefits') return (v || []).join(', ');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return v ?? '';
}

export default function Admin() {
  const sb = useMemo(() => adminClient(), []);
  const [phase, setPhase] = useState('checking'); // checking | login | setpw | app
  const [who, setWho] = useState('');
  const [lerr, setLerr] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  /* forgot-password flow */
  const [fpMode, setFpMode] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpBusy, setFpBusy] = useState(false);
  const [fpMsg, setFpMsg] = useState('');
  const [npw, setNpw] = useState('');
  const [npw2, setNpw2] = useState('');
  const [pwErr, setPwErr] = useState('');
  // Did this page load arrive via a clicked "set new password" email link?
  // Captured synchronously at first render — the Supabase client's implicit-flow
  // auto-detect clears the ?type=recovery&… params shortly after, so we must
  // read the URL before that happens or we'd miss the recovery link.
  const [wasRecovery] = useState(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('type');
      const h = window.location.hash.startsWith('#')
        ? new URLSearchParams(window.location.hash.slice(1)).get('type') : null;
      return q === 'recovery' || h === 'recovery';
    } catch { return false; }
  });
  const [rows, setRows] = useState([]);
  const [sel, setSel] = useState(() => new Set());
  const [f, setF] = useState({ q: '', status: '', want: '', from: '', to: '' });
  const [live, setLive] = useState('Connecting…');
  const [sync, setSync] = useState('');
  const [flash, setFlash] = useState(null);
  const [toast, setToast] = useState('');
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState('');
  const chan = useRef(null);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 3200); return () => clearTimeout(t); } }, [toast]);

  const load = useCallback(async () => {
    setSync('Loading…');
    const all = [], size = 1000;
    for (let from = 0; ; from += size) {
      const { data, error } = await sb.from(TABLE).select('*').order('created_at', { ascending: false }).range(from, from + size - 1);
      if (error) { setSync('Load failed: ' + error.message); return; }
      all.push(...data);
      if (data.length < size) break;
    }
    setRows(all);
    setSync('Synced ' + new Date().toLocaleTimeString('en-IN'));
  }, [sb]);

  const subscribe = useCallback(() => {
    if (chan.current) sb.removeChannel(chan.current);
    chan.current = sb.channel('enquiries-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, ({ eventType, new: n, old: o }) => {
        if (eventType === 'INSERT') {
          setRows(r => r.some(x => x.id === n.id) ? r : [n, ...r]);
          setFlash(n.id); setToast(`New enquiry: ${n.full_name} (${n.ref})`);
        } else if (eventType === 'UPDATE') {
          setRows(r => r.map(x => x.id === n.id ? n : x));
        } else if (eventType === 'DELETE') {
          setRows(r => r.filter(x => x.id !== o.id));
          setSel(s => { const c = new Set(s); c.delete(o.id); return c; });
        }
        setSync('Live update ' + new Date().toLocaleTimeString('en-IN'));
      })
      .subscribe(status => setLive(status === 'SUBSCRIBED' ? 'Live' : status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' ? 'Reconnecting…' : 'Connecting…'));
  }, [sb]);

  const leave = useCallback(msg => {
    if (chan.current) { sb.removeChannel(chan.current); chan.current = null; }
    setRows([]); setSel(new Set()); setPhase('login'); setLerr(msg || '');
  }, [sb]);

  const enter = useCallback(async () => {
    const { data: ok, error } = await sb.rpc('is_admin');
    if (error || !ok) {
      await sb.auth.signOut();
      return leave(error ? 'Could not verify admin access. Run the SQL files in /supabase first.' : 'This account is not an admin.');
    }
    const { data: { user } } = await sb.auth.getUser();
    setWho(user?.email || ''); setPhase('app'); setNote('');
    await load(); subscribe();
  }, [sb, load, subscribe, leave]);

  useEffect(() => {
    if (!sb) return;
    let alive = true;
    // Two entry paths, one getSession() call covers both:
    // - plain load: returns the persisted session (or none → login screen).
    // - arriving via a clicked "set new password" email link: the recovery
    //   tokens ride the URL hash (?type=recovery&access_token=…). The client's
    //   built-in URL auto-detection saves that session and fires a
    //   PASSWORD_RECOVERY event, which shows the set-password screen — so when
    //   the URL says "recovery" we must NOT call enter() (avoids a race where
    //   the dashboard would flash up for a moment).
    sb.auth.getSession().then(({ data }) => {
      if (!alive) return;
      // wasRecovery was captured synchronously at first render (before the
      // client's implicit-flow auto-detect could clear the ?type=recovery&…
      // params from the URL), so a clicked reset link is still detected here;
      // if not a recovery link, a live session goes straight into the dashboard.
      if (wasRecovery) setPhase('setpw');
      else data.session ? enter() : setPhase('login');
    }).catch(() => setPhase('login'));
    const { data: { subscription } } = sb.auth.onAuthStateChange((ev, session) => {
      if (ev === 'PASSWORD_RECOVERY') {
        try { sessionStorage.setItem('cw_admin_recovery_email', session?.user?.email || ADMIN_EMAIL); } catch { /* private mode */ }
        setNpw(''); setNpw2(''); setPwErr(''); setLerr(''); setNote('');
        setPhase('setpw');
      } else if (ev === 'SIGNED_IN') enter();
      else if (ev === 'SIGNED_OUT') leave();
    });
    return () => { alive = false; subscription.unsubscribe(); if (chan.current) sb.removeChannel(chan.current); };
  }, [sb, enter, leave, wasRecovery]);

  async function login(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const u = String(fd.get('user')).trim(), p = String(fd.get('pass'));
    const email = u.includes('@') ? u.toLowerCase() : u.toLowerCase() === 'admin' ? ADMIN_EMAIL : u.toLowerCase();
    setBusy(true); setLerr('');
    const { error } = await sb.auth.signInWithPassword({ email, password: p });
    setBusy(false);
    if (error) return setLerr('Wrong user ID or password.');
    // enter() runs from the SIGNED_IN auth event
  }

  /* Forgot password: send a secure link to the admin's email. The recipient
     opens the link on /admin (SPA routes there), the PASSWORD_RECOVERY event
     fires, and the "Set a new password" screen appears. */
  async function fpRequest(e) {
    e.preventDefault();
    const em = fpEmail.trim().toLowerCase();
    if (!em) return;
    setFpBusy(true); setLerr(''); setFpMsg('');
    try { sessionStorage.setItem('cw_admin_recovery_email', em); } catch { /* private mode */ }
    // The link opens https://<site>/admin — the admin panel itself — where the
    // recovery tokens in the URL are picked up and the set-password screen shows.
    // Method name follows the installed supabase-js 2.45 (auth-js 2.65):
    // resetPasswordForEmail (not the newer resetPasswordEmail).
    const { error } = await sb.auth.resetPasswordForEmail(em, {
      redirectTo: window.location.origin + '/admin',
    });
    setFpBusy(false);
    if (error) return setLerr(/not found|invalid login credentials/i.test(error.message) ? 'No admin account found for that email.' : 'Could not send the reset link. Check your connection and try again.');
    setFpMsg(`Reset link sent to ${em}. Check your inbox (and spam) — it expires soon. Open it to set a new password.`);
  }

  /* After the recovery link: set the new password, then sign the account in. */
  async function setPw(e) {
    e.preventDefault();
    if (npw.length < 8) return setPwErr('Password must be at least 8 characters.');
    if (npw !== npw2) return setPwErr('Passwords do not match.');
    setBusy(true); setPwErr('');
    const { error } = await sb.auth.updateUser({ password: npw });
    setBusy(false);
    if (error) {
      setPwErr(error.message === 'Invalid login credentials'
        ? 'The recovery link has expired or was already used. Click "Back to sign in" and request a new one.'
        : 'Could not update the password: ' + error.message);
      return;
    }
    // resolve the account email from the recovery markers, then clean them up
    const em = (() => { try { return sessionStorage.getItem('cw_admin_recovery_email') || ADMIN_EMAIL; } catch { return ADMIN_EMAIL; } })();
    try { sessionStorage.removeItem('cw_admin_recovery'); sessionStorage.removeItem('cw_admin_recovery_email'); } catch { /* private mode */ }
    const { error: se } = await sb.auth.signInWithPassword({ email: em, password: npw });
    if (se) { setNote('Password updated. Now sign in below with it.'); setPhase('login'); setFpMode(false); setNpw(''); setNpw2(''); return; }
    // success: the SIGNED_IN auth event drives enter() automatically
  }

  /* derived */
  const view = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    return rows.filter(r => {
      if (f.status && r.status !== f.status) return false;
      if (f.want && r.interested_in !== f.want) return false;
      const d = dayKey(r.created_at);
      if (f.from && d < f.from) return false;
      if (f.to && d > f.to) return false;
      if (q && ![r.full_name, r.mobile, r.email, r.ref, r.bank, r.card_variant, r.city, r.pin_code, r.name_on_card, r.ip, r.device].join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, f]);
  const stats = useMemo(() => {
    const today = dayKey(new Date()), week = Date.now() - 7 * 864e5;
    return { total: rows.length, today: rows.filter(r => dayKey(r.created_at) === today).length, fresh: rows.filter(r => r.status === 'new').length, inprog: rows.filter(r => r.status === 'in_progress').length, week: rows.filter(r => new Date(r.created_at) >= week).length };
  }, [rows]);
  const visSel = view.filter(r => sel.has(r.id)).length;
  const allRef = useRef();
  useEffect(() => { if (allRef.current) allRef.current.indeterminate = visSel > 0 && visSel < view.length; }, [visSel, view.length]);

  const toggle = id => setSel(s => { const c = new Set(s); c.has(id) ? c.delete(id) : c.add(id); return c; });
  const toggleAll = on => setSel(s => { const c = new Set(s); view.forEach(r => on ? c.add(r.id) : c.delete(r.id)); return c; });

  async function setStatus(id, status) {
    setRows(r => r.map(x => x.id === id ? { ...x, status } : x));
    const { error } = await sb.from(TABLE).update({ status }).eq('id', id);
    if (error) { setToast('Status not saved: ' + error.message); load(); } else setToast('Status updated');
  }
  async function saveNotes() {
    const n = notes.trim();
    const { error } = await sb.from(TABLE).update({ notes: n }).eq('id', open.id);
    if (error) return setToast('Notes not saved: ' + error.message);
    setRows(r => r.map(x => x.id === open.id ? { ...x, notes: n } : x)); setOpen(null); setToast('Notes saved');
  }
  async function del() {
    const ids = [...sel];
    if (!ids.length || !window.confirm(`Permanently delete ${ids.length} enquir${ids.length > 1 ? 'ies' : 'y'}? This cannot be undone.`)) return;
    const { error } = await sb.from(TABLE).delete().in('id', ids);
    if (error) return setToast('Delete failed: ' + error.message);
    setRows(r => r.filter(x => !sel.has(x.id))); setSel(new Set()); setToast('Deleted');
  }

  const exportRows = () => sel.size ? rows.filter(r => sel.has(r.id)) : view;
  async function toExcel() {
    const data = exportRows(); if (!data.length) return setToast('Nothing to export');
    const XLSX = await import('xlsx');
    const cols = FIELDS.filter(([k]) => !['confirm_primary_holder', 'consent_contact'].includes(k));
    const ws = XLSX.utils.json_to_sheet(data.map(r => Object.fromEntries(cols.map(([k, l]) => [l, val(r, k)]))));
    ws['!cols'] = cols.map(([, l]) => ({ wch: Math.max(12, l.length + 2) }));
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Enquiries');
    XLSX.writeFile(wb, `coral-enquiries-${stamp()}.xlsx`);
    setToast(`Excel exported (${data.length} rows)`);
  }
  async function toPdf() {
    const data = exportRows(); if (!data.length) return setToast('Nothing to export');
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const cols = [['created_at', 'Received'], ['ref', 'Ref'], ['full_name', 'Name'], ['mobile', 'Mobile'], ['email', 'Email'], ['ip', 'IP'], ['device', 'Device'], ['city', 'City'], ['bank', 'Bank'], ['card_variant', 'Card'], ['card_last4', 'Last 4'], ['interested_in', 'Interest'], ['monthly_income', 'Income'], ['call_time', 'Call time'], ['status', 'Status']];
    const txt = s => String(s).replace(/₹/g, 'Rs.').replace(/[–—]/g, '-').replace(/[^\x20-\x7E]/g, ''); // built-in PDF fonts are Latin-only
    doc.setFontSize(16); doc.text('Coral Credit Card - Enquiries', 40, 40);
    doc.setFontSize(9); doc.setTextColor(100); doc.text(`Exported ${new Date().toLocaleString('en-IN')} | ${data.length} rows`, 40, 56);
    autoTable(doc, {
      startY: 70, head: [cols.map(c => c[1])], body: data.map(r => cols.map(([k]) => txt(val(r, k)))),
      styles: { fontSize: 7.5, cellPadding: 4, overflow: 'linebreak' },
      headStyles: { fillColor: [11, 27, 47], textColor: [241, 211, 152] },
      alternateRowStyles: { fillColor: [246, 248, 251] }, margin: { left: 30, right: 30 }
    });
    doc.save(`coral-enquiries-${stamp()}.pdf`);
    setToast(`PDF exported (${data.length} rows)`);
  }

  const closeOpen = useCallback(() => setOpen(null), []);
  const logo = <span className="logo"><i>C</i><small style={{ display: 'block', fontSize: 10.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9fb0c6' }}>Admin</small></span>;

  /* ── conversion codes manager ── */
  const [tab, setTab] = useState('leads');
  const [cc, setCc] = useState([]);
  const [ccBusy, setCcBusy] = useState('');
  const loadCC = useCallback(async () => {
    const { data, error } = await sb.from(CONVERSION_TABLE).select('*').order('page');
    if (error) { setToast('Could not load conversion codes: ' + error.message); return; }
    const base = CC_PAGES.map(([p]) => p).map(p => ({ page: p, code: '', enabled: true, updated_at: null }));
    setCc(base.map(b => data.find(r => r.page === b.page) || b));
  }, [sb]);
  useEffect(() => { if (phase === 'app') loadCC(); }, [phase, loadCC]);
  async function saveCC(page) {
    const row = cc.find(r => r.page === page);
    setCcBusy(page);
    const { error } = await sb.from(CONVERSION_TABLE).upsert({ page, code: row.code, enabled: row.enabled, updated_at: new Date().toISOString() });
    setCcBusy('');
    if (error) { setToast('Code not saved: ' + error.message); return; }
    setCc(l => l.map(r => r.page === page ? { ...r, updated_at: new Date().toISOString() } : r));
    setToast(`Code for ${page === 'all' ? 'all pages' : page} updated`);
  }

  if (!configured) return (
    <div className="setup"><h2>Connect Supabase first</h2><p>Add <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code> and <code>VITE_ADMIN_EMAIL</code> in Netlify → Site configuration → Environment variables (or a local <code>.env</code> file), then redeploy. See README.md.</p></div>
  );
  if (phase === 'checking') return <div className="adm-login"><p style={{ color: '#9fb0c6' }}>Loading…</p></div>;

  if (phase === 'login') return (
    <section className="adm-login">
      <form className="lbox" onSubmit={fpMode ? fpRequest : login}>
        {logo}
        {fpMode ? (
          <>
            <h1>Recover <span className="serif">password</span></h1>
            <p>Enter your admin email and we will send a secure link to set a new password.</p>
            <div className="fg" style={{ gridTemplateColumns: '1fr' }}>
              <label className="f">Admin email<input type="email" value={fpEmail} onChange={e => setFpEmail(e.target.value)}
                placeholder={ADMIN_EMAIL} autoComplete="email" required /></label>
            </div>
            <button className="btn btn-primary" type="submit" disabled={fpBusy || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fpEmail.trim())}>
              {fpBusy ? 'Sending link…' : 'Send reset link'}
            </button>
            {fpMsg ? <p className="fm ok" role="status">{fpMsg}</p> : <p className="fm" role="alert">{lerr}</p>}
            <a className="lback" href="javascript:void 0" onClick={() => { setFpMode(false); setFpMsg(''); setLerr(''); }}>← Back to sign in</a>
          </>
        ) : (
          <>
            <h1>Admin <span className="serif">sign in</span></h1>
            <p>Enquiries dashboard. Authorised staff only.</p>
            <div className="fg" style={{ gridTemplateColumns: '1fr' }}>
              <label className="f">User ID<input name="user" defaultValue="Admin" autoComplete="username" required placeholder="Admin" /></label>
              <label className="f">Password<input name="pass" type="password" autoComplete="current-password" required placeholder="••••••••" /></label>
            </div>
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
            {note && <p className="fm ok" role="status">{note}</p>}
            <div className="lrow">
              <a className="lback" href="javascript:void 0" onClick={() => { setFpMode(true); setLerr(''); }}>Forgot password?</a>
              <span style={{ fontSize: 12.5, color: 'var(--mute)' }}>User ID: Admin</span>
            </div>
            <p className="fm" role="alert">{lerr}</p>
          </>
        )}
      </form>
    </section>
  );

  if (phase === 'setpw') {
    return (
      <section className="adm-login">
        <form className="lbox" onSubmit={setPw}>
          {logo}
          <h1>Set a new <span className="serif">password</span></h1>
          <p>Signed in as <b>{sessionStorage.getItem('cw_admin_recovery_email') || who || ADMIN_EMAIL}</b>. Choose a new password for the admin account.</p>
          <div className="fg" style={{ gridTemplateColumns: '1fr' }}>
            <label className="f">New password<input type="password" value={npw} onChange={e => setNpw(e.target.value)}
              autoComplete="new-password" placeholder="At least 8 characters" required minLength={8} /></label>
            <label className="f">Confirm new password<input type="password" value={npw2} onChange={e => setNpw2(e.target.value)}
              autoComplete="new-password" placeholder="Repeat it" required /></label>
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy || npw.length < 8 || npw !== npw2}>
            {busy ? 'Updating…' : 'Set new password & sign in'}
          </button>
          {pwErr ? <p className="fm" role="alert">{pwErr}</p> : null}
          <a className="lback" href="javascript:void 0" onClick={async () => { try { sessionStorage.removeItem('cw_admin_recovery'); sessionStorage.removeItem('cw_admin_recovery_email'); } catch {} setPhase('login'); }}>← Back to sign in</a>
        </form>
      </section>
    );
  }

  return (
    <>
      <header className="adm-top"><div className="in">
        {logo}
        <span className={`live${live === 'Live' ? ' on' : ''}`}><i />{live}</span>
        <span className="who">{who}</span>
        <button className="btn btn-ghost-light btn-sm" type="button" onClick={() => sb.auth.signOut()}>Sign out</button>
      </div></header>

      <main className="adm">
        <div className="stats">
          <div className="stat"><span>Total enquiries</span><b>{stats.total}</b></div>
          <div className="stat"><span>Today</span><b>{stats.today}</b></div>
          <div className="stat"><span>In progress (live)</span><b>{stats.inprog}</b></div>
          <div className="stat"><span>New (not contacted)</span><b>{stats.fresh}</b></div>
          <div className="stat"><span>Last 7 days</span><b>{stats.week}</b></div>
        </div>

        <div className="bar" style={{ marginBottom: 14 }}>
          <button className={`btn btn-sm ${tab === 'leads' ? 'btn-primary' : 'btn-line'}`} type="button" onClick={() => setTab('leads')}>Enquiries</button>
          <button className={`btn btn-sm ${tab === 'codes' ? 'btn-primary' : 'btn-line'}`} type="button" onClick={() => setTab('codes')}>Conversion codes</button>
          <span className="sp" />
          <span className="selinfo">Section data saves automatically while visitors fill the form — in-progress rows appear here in real time.</span>
        </div>

        {tab === 'codes' ? (
          <div className="panel">
            <div className="bar"><span style={{ fontWeight: 600 }}>Per-page conversion codes</span></div>
            <p className="hint" style={{ padding: '0 14px 12px' }}>Paste a conversion code (Meta pixel, Google Ads tag, etc.). Pick the page it runs on — or “All pages” for the whole site. Codes are picked up by live visitors without a redeploy. <b style={{ color: 'var(--bad)' }}><i dangerouslySetInnerHTML={{ __html: '&lt;script&gt;' }} /></b>-based tags are loaded via <code>&lt;script&gt;</code> injection; <code>src</code>-style pixel tags are not supported.</p>
            <div style={{ padding: '0 14px 14px', display: 'grid', gap: 14 }}>
              {cc.map(r => {
                const [page, label] = CC_PAGES.find(([p]) => p === r.page) || [r.page, r.page];
                return (
                  <div key={page} className="f" style={{ display: 'grid', gap: 6, border: '1px solid #e3e8f0', borderRadius: 10, padding: 12, background: '#fbfcfe' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      {label}
                      <label className="chk" style={{ marginLeft: 'auto' }}><input type="checkbox" checked={!!r.enabled} onChange={e => setCc(l => l.map(x => x.page === page ? { ...x, enabled: e.target.checked } : x))} />Enabled</label>
                      {r.updated_at && <small style={{ color: '#8a94a6', fontWeight: 400 }}>updated {new Date(r.updated_at).toLocaleString('en-IN')}</small>}
                    </div>
                    <textarea value={r.code} rows={3} spellCheck={false} style={{ fontFamily: 'monospace', fontSize: 12.5 }}
                      placeholder={"// e.g. gtag('config', 'AW-XXXX'); or a full <script> body"}
                      onChange={e => setCc(l => l.map(x => x.page === page ? { ...x, code: e.target.value } : x))} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="btn btn-primary btn-sm" disabled={ccBusy === page} onClick={() => saveCC(page)}>{ccBusy === page ? 'Saving…' : 'Save code'}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (

        <div className="panel">
          <div className="bar">
            <input type="search" placeholder="Search name, mobile, email, ref, bank, city…" value={f.q} onChange={e => setF({ ...f, q: e.target.value })} aria-label="Search" />
            <select value={f.status} onChange={e => setF({ ...f, status: e.target.value })} aria-label="Status"><option value="">All status</option>{STATUS.map(s => <option key={s} value={s}>{cap(s)}</option>)}</select>
            <select value={f.want} onChange={e => setF({ ...f, want: e.target.value })} aria-label="Interest"><option value="">All interests</option>{INTEREST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label.replace('ICICI Bank ', '')}</option>)}</select>
            <input type="date" value={f.from} onChange={e => setF({ ...f, from: e.target.value })} aria-label="From date" />
            <input type="date" value={f.to} onChange={e => setF({ ...f, to: e.target.value })} aria-label="To date" />
            <span className="sp" />
            {sel.size > 0 && <span className="selinfo">{sel.size} selected</span>}
            <button className="btn btn-line btn-sm" type="button" onClick={toExcel} title={sel.size ? 'Export selected rows' : 'Export all filtered rows'}>⬇ Excel</button>
            <button className="btn btn-line btn-sm" type="button" onClick={toPdf} title={sel.size ? 'Export selected rows' : 'Export all filtered rows'}>⬇ PDF</button>
            <button className="btn btn-red btn-sm" type="button" disabled={!sel.size} onClick={del}>Delete</button>
          </div>
          <div className="tw">
            <table className="dt">
              <thead><tr>
                <th><input ref={allRef} type="checkbox" aria-label="Select all" checked={view.length > 0 && visSel === view.length} onChange={e => toggleAll(e.target.checked)} /></th>
                <th>Received</th><th>Ref</th><th>Applicant</th><th>Mobile</th><th>City</th><th>Current card</th><th>Last 4</th><th>Interest</th><th>Income</th><th>Call time</th><th>Device · IP</th><th>Status</th><th />
              </tr></thead>
              <tbody>
                {view.map(r => (
                  <tr key={r.id} className={`${sel.has(r.id) ? 'sel' : ''} ${flash === r.id ? 'flash' : ''}`}>
                    <td><input type="checkbox" checked={sel.has(r.id)} onChange={() => toggle(r.id)} aria-label={`Select ${r.ref}`} /></td>
                    <td>{fmt(r.created_at)}</td>
                    <td style={{ fontWeight: 700, letterSpacing: '.04em' }}>{r.ref}</td>
                    <td>{r.full_name}<small>{r.email}</small></td>
                    <td>{r.mobile}</td>
                    <td>{r.city}<small>{r.pin_code}</small></td>
                    <td>{r.card_variant}<small>{r.bank} · {r.card_network}</small></td>
                    <td>•••• {r.card_last4}</td>
                    <td>{interestLabel(r.interested_in).replace('ICICI Bank ', '')}</td>
                    <td>{r.monthly_income}</td>
                    <td>{r.call_time}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 11.5 }}>{r.ip || '—'}</span>{r.device && <small>{r.device}{r.geo_country ? ' · ' + r.geo_country : ''}</small>}</td>
                    <td><select className={`st ${r.status}`} value={r.status} onChange={e => setStatus(r.id, e.target.value)} aria-label="Status">{STATUS.map(s => <option key={s} value={s}>{cap(s)}</option>)}</select></td>
                    <td><button className="link" type="button" onClick={() => { setOpen(r); setNotes(r.notes || ''); }}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!view.length && <div className="empty">{rows.length ? 'No enquiries match these filters.' : 'No enquiries yet. New submissions will appear here instantly.'}</div>}
          </div>
          <div className="pfoot"><span>Showing {view.length} of {rows.length}</span><span>{sync}</span></div>
        </div>
        )}
      </main>

      {open && (
        <Modal title={open.full_name} onClose={closeOpen} width={760}
          footer={<><button className="btn btn-line" type="button" onClick={closeOpen}>Close</button><button className="btn btn-primary" type="button" onClick={saveNotes}>Save notes</button></>}>
          <dl className="ddl">{FIELDS.filter(([k]) => k !== 'notes').map(([k, l]) => <div key={k}><dt>{l}</dt><dd>{String(val(open, k)) || '—'}</dd></div>)}</dl>
          <label className="f full">Admin notes<textarea value={notes} maxLength={2000} onChange={e => setNotes(e.target.value)} placeholder="Call notes, follow-up date…" /></label>
        </Modal>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
