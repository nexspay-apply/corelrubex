/* Cardwise admin panel: Supabase Auth + RLS, realtime, Excel/PDF export */
const CFG = window.CARDWISE_CONFIG || {};
const T = CFG.TABLE || 'enquiries';
const $ = id => document.getElementById(id);
const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);

let rows = [];            // all enquiries (newest first)
let view = [];            // after filters
const selected = new Set();
let channel = null;
let openId = null;

const WANT = { rubyx: 'Rubyx', coral: 'Coral', rupay: 'RuPay variant', upgrade: 'Upgrade current card', unsure: 'Not sure' };
const STATUS = ['new', 'contacted', 'applied', 'closed'];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = d => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const dayKey = d => new Date(d).toLocaleDateString('en-CA'); // YYYY-MM-DD local

function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 3200);
}

/* ---------------- auth ---------------- */
$('lform').addEventListener('submit', async e => {
  e.preventDefault();
  const u = $('luser').value.trim(), p = $('lpass').value;
  const email = u.includes('@') ? u : (u.toLowerCase() === 'admin' ? CFG.ADMIN_EMAIL : u);
  $('lerr').textContent = ''; $('lbtn').disabled = true; $('lbtn').textContent = 'Signing in…';
  const { error } = await sb.auth.signInWithPassword({ email, password: p });
  $('lbtn').disabled = false; $('lbtn').textContent = 'Sign in';
  if (error) { $('lerr').textContent = 'Wrong user ID or password.'; return; }
  $('lpass').value = '';
  enter();
});
$('logout').onclick = async () => { await sb.auth.signOut(); leave(); };

async function enter() {
  const { data: ok, error } = await sb.rpc('is_admin');
  if (error || !ok) {
    await sb.auth.signOut();
    $('lerr').textContent = error ? 'Could not verify admin access. Run supabase/admin.sql first.' : 'This account is not an admin.';
    return leave(true);
  }
  const { data: { user } } = await sb.auth.getUser();
  $('who').textContent = user?.email || '';
  $('login').classList.add('hide'); $('app').classList.remove('hide');
  await load();
  subscribe();
}
function leave(keepMsg) {
  if (channel) { sb.removeChannel(channel); channel = null; }
  rows = []; view = []; selected.clear();
  $('app').classList.add('hide'); $('login').classList.remove('hide');
  if (!keepMsg) $('lerr').textContent = '';
}
sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') leave(true); });

/* ---------------- data ---------------- */
async function load() {
  $('sync').textContent = 'Loading…';
  const all = [], size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await sb.from(T).select('*').order('created_at', { ascending: false }).range(from, from + size - 1);
    if (error) { $('sync').textContent = 'Load failed: ' + error.message; return; }
    all.push(...data);
    if (data.length < size) break;
  }
  rows = all;
  $('sync').textContent = 'Synced ' + new Date().toLocaleTimeString('en-IN');
  render();
}

function subscribe() {
  if (channel) sb.removeChannel(channel);
  channel = sb.channel('enquiries-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: T }, ({ eventType, new: n, old: o }) => {
      if (eventType === 'INSERT') {
        if (!rows.some(r => r.id === n.id)) rows.unshift(n);
        render(n.id);
        toast(`New enquiry: ${n.full_name} (${n.ref})`);
      } else if (eventType === 'UPDATE') {
        const i = rows.findIndex(r => r.id === n.id); if (i > -1) rows[i] = n; render();
      } else if (eventType === 'DELETE') {
        rows = rows.filter(r => r.id !== o.id); selected.delete(o.id); render();
      }
      $('sync').textContent = 'Live update ' + new Date().toLocaleTimeString('en-IN');
    })
    .subscribe(status => {
      const on = status === 'SUBSCRIBED';
      $('live').classList.toggle('on', on);
      $('liveTxt').textContent = on ? 'Live' : status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' ? 'Reconnecting…' : 'Connecting…';
    });
}

/* ---------------- filters + table ---------------- */
function applyFilters() {
  const q = $('q').value.trim().toLowerCase(), st = $('fStatus').value, w = $('fWant').value, f = $('fFrom').value, t = $('fTo').value;
  view = rows.filter(r => {
    if (st && r.status !== st) return false;
    if (w && r.interested_in !== w) return false;
    const d = dayKey(r.created_at);
    if (f && d < f) return false;
    if (t && d > t) return false;
    if (q) {
      const hay = [r.full_name, r.mobile, r.email, r.ref, r.bank, r.card_variant, r.city, r.pin_code, r.name_on_card].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function render(flashId) {
  applyFilters();
  const today = dayKey(new Date()), week = Date.now() - 7 * 864e5;
  $('sTotal').textContent = rows.length;
  $('sToday').textContent = rows.filter(r => dayKey(r.created_at) === today).length;
  $('sNew').textContent = rows.filter(r => r.status === 'new').length;
  $('sWeek').textContent = rows.filter(r => new Date(r.created_at) >= week).length;

  $('tb').innerHTML = view.map(r => `
    <tr data-id="${r.id}" class="${selected.has(r.id) ? 'sel' : ''} ${r.id === flashId ? 'flash' : ''}">
      <td><input type="checkbox" class="pick" ${selected.has(r.id) ? 'checked' : ''} aria-label="Select ${esc(r.ref)}"></td>
      <td>${esc(fmt(r.created_at))}</td>
      <td class="ref">${esc(r.ref)}</td>
      <td>${esc(r.full_name)}<small>${esc(r.email)}</small></td>
      <td>${esc(r.mobile)}</td>
      <td>${esc(r.city)}<small>${esc(r.pin_code)}</small></td>
      <td>${esc(r.card_variant)}<small>${esc(r.bank)} · ${esc(r.card_network)}</small></td>
      <td>•••• ${esc(r.card_last4)}</td>
      <td>${esc(WANT[r.interested_in] || r.interested_in)}</td>
      <td>${esc(r.monthly_income)}</td>
      <td>${esc(r.call_time)}</td>
      <td><select class="st ${esc(r.status)}" aria-label="Status">${STATUS.map(s => `<option value="${s}" ${s === r.status ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select></td>
      <td><button class="link view" type="button">View</button></td>
    </tr>`).join('');
  $('empty').classList.toggle('hide', view.length > 0);
  $('count').textContent = `Showing ${view.length} of ${rows.length}`;
  syncSelection();
}

function syncSelection() {
  // drop selections that no longer exist
  for (const id of selected) if (!rows.some(r => r.id === id)) selected.delete(id);
  const visibleSel = view.filter(r => selected.has(r.id)).length;
  $('all').checked = view.length > 0 && visibleSel === view.length;
  $('all').indeterminate = visibleSel > 0 && visibleSel < view.length;
  $('selInfo').textContent = selected.size ? `${selected.size} selected` : '';
  $('del').disabled = !selected.size;
  $('xls').title = $('pdf').title = selected.size ? 'Export selected rows' : 'Export all filtered rows';
}

['q', 'fStatus', 'fWant', 'fFrom', 'fTo'].forEach(id => $(id).addEventListener('input', () => render()));
$('all').addEventListener('change', e => { view.forEach(r => e.target.checked ? selected.add(r.id) : selected.delete(r.id)); render(); });

$('tb').addEventListener('change', async e => {
  const tr = e.target.closest('tr'); if (!tr) return;
  const id = +tr.dataset.id;
  if (e.target.classList.contains('pick')) {
    e.target.checked ? selected.add(id) : selected.delete(id);
    tr.classList.toggle('sel', e.target.checked); syncSelection(); return;
  }
  if (e.target.classList.contains('st')) {
    const status = e.target.value;
    e.target.className = 'st ' + status;
    const { error } = await sb.from(T).update({ status }).eq('id', id);
    if (error) { toast('Status not saved: ' + error.message); load(); }
    else { const r = rows.find(x => x.id === id); if (r) r.status = status; render(); toast('Status updated'); }
  }
});
$('tb').addEventListener('click', e => { if (e.target.classList.contains('view')) openDetail(+e.target.closest('tr').dataset.id); });

/* ---------------- detail ---------------- */
const FIELDS = [
  ['ref', 'Reference'], ['created_at', 'Received'], ['status', 'Status'], ['full_name', 'Full name'], ['mobile', 'Mobile'], ['email', 'Email'],
  ['age_group', 'Age'], ['city', 'City'], ['pin_code', 'PIN code'], ['employment', 'Employment'], ['monthly_income', 'Monthly income'],
  ['bank', 'Bank'], ['card_variant', 'Card variant'], ['card_network', 'Network'], ['card_last4', 'Last 4 digits'], ['name_on_card', 'Name on card'],
  ['card_held_since', 'Card held since'], ['credit_limit', 'Credit limit'], ['late_payment_12m', 'Late payment (12 mo)'],
  ['interested_in', 'Interested in'], ['monthly_spend', 'Monthly spend'], ['benefits', 'Benefits'], ['language', 'Language'], ['call_time', 'Best time to call'],
  ['confirm_primary_holder', 'Primary holder confirmed'], ['consent_contact', 'Consent to contact'], ['utm_source', 'UTM source'], ['utm_campaign', 'UTM campaign']
];
function val(r, k) {
  const v = r[k];
  if (k === 'created_at') return fmt(v);
  if (k === 'interested_in') return WANT[v] || v;
  if (k === 'benefits') return (v || []).join(', ') || '—';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return v ?? '—';
}
function openDetail(id) {
  const r = rows.find(x => x.id === id); if (!r) return;
  openId = id;
  $('dT').textContent = r.full_name; $('dSub').textContent = `${r.ref} · ${fmt(r.created_at)}`;
  $('dBody').innerHTML = '<dl>' + FIELDS.map(([k, l]) => `<div><dt>${l}</dt><dd>${esc(val(r, k))}</dd></div>`).join('') + '</dl>';
  $('dNotes').value = r.notes || '';
  $('dlg').showModal();
}
$('dX').onclick = $('dCancel').onclick = () => $('dlg').close();
$('dSave').onclick = async () => {
  const notes = $('dNotes').value.trim();
  const { error } = await sb.from(T).update({ notes }).eq('id', openId);
  if (error) return toast('Notes not saved: ' + error.message);
  const r = rows.find(x => x.id === openId); if (r) r.notes = notes;
  $('dlg').close(); toast('Notes saved');
};

/* ---------------- delete ---------------- */
$('del').onclick = async () => {
  const ids = [...selected];
  if (!ids.length || !confirm(`Permanently delete ${ids.length} enquir${ids.length > 1 ? 'ies' : 'y'}? This cannot be undone.`)) return;
  const { error } = await sb.from(T).delete().in('id', ids);
  if (error) return toast('Delete failed: ' + error.message);
  rows = rows.filter(r => !selected.has(r.id)); selected.clear(); render(); toast('Deleted');
};

/* ---------------- export ---------------- */
const EXPORT = [
  ['created_at', 'Received'], ['ref', 'Reference'], ['status', 'Status'], ['full_name', 'Full name'], ['mobile', 'Mobile'], ['email', 'Email'],
  ['age_group', 'Age'], ['city', 'City'], ['pin_code', 'PIN'], ['employment', 'Employment'], ['monthly_income', 'Monthly income'],
  ['bank', 'Bank'], ['card_variant', 'Card'], ['card_network', 'Network'], ['card_last4', 'Last 4'], ['name_on_card', 'Name on card'],
  ['card_held_since', 'Held since'], ['credit_limit', 'Credit limit'], ['late_payment_12m', 'Late payment'], ['interested_in', 'Interest'],
  ['monthly_spend', 'Monthly spend'], ['benefits', 'Benefits'], ['language', 'Language'], ['call_time', 'Call time'], ['notes', 'Notes']
];
const exportRows = () => selected.size ? rows.filter(r => selected.has(r.id)) : view;
const stamp = () => new Date().toLocaleDateString('en-CA');

$('xls').onclick = () => {
  const data = exportRows(); if (!data.length) return toast('Nothing to export');
  const sheet = XLSX.utils.json_to_sheet(data.map(r => Object.fromEntries(EXPORT.map(([k, l]) => [l, val(r, k)]))));
  sheet['!cols'] = EXPORT.map(([, l]) => ({ wch: Math.max(12, l.length + 2) }));
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, sheet, 'Enquiries');
  XLSX.writeFile(wb, `cardwise-enquiries-${stamp()}.xlsx`);
  toast(`Excel exported (${data.length} rows)`);
};

$('pdf').onclick = () => {
  const data = exportRows(); if (!data.length) return toast('Nothing to export');
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const cols = [['created_at', 'Received'], ['ref', 'Ref'], ['full_name', 'Name'], ['mobile', 'Mobile'], ['email', 'Email'], ['city', 'City'],
    ['bank', 'Bank'], ['card_variant', 'Card'], ['card_last4', 'Last 4'], ['interested_in', 'Interest'], ['monthly_income', 'Income'], ['call_time', 'Call time'], ['status', 'Status']];
  const pdfText = s => String(s).replace(/₹/g, 'Rs.').replace(/[–—]/g, '-').replace(/[^\x20-\x7E]/g, ''); // built-in PDF fonts are Latin-only
  doc.setFontSize(16); doc.text('Cardwise - Enquiries', 40, 40);
  doc.setFontSize(9); doc.setTextColor(100); doc.text(`Exported ${new Date().toLocaleString('en-IN')} · ${data.length} rows`.replace('·', '|'), 40, 56);
  doc.autoTable({
    startY: 70, head: [cols.map(c => c[1])],
    body: data.map(r => cols.map(([k]) => pdfText(val(r, k)))),
    styles: { fontSize: 7.5, cellPadding: 4, overflow: 'linebreak' },
    headStyles: { fillColor: [10, 18, 32], textColor: [241, 211, 152] },
    alternateRowStyles: { fillColor: [247, 246, 242] },
    margin: { left: 30, right: 30 }
  });
  doc.save(`cardwise-enquiries-${stamp()}.pdf`);
  toast(`PDF exported (${data.length} rows)`);
};

/* ---------------- start ---------------- */
(async () => {
  if (/YOUR-/.test(CFG.SUPABASE_URL + CFG.SUPABASE_ANON_KEY)) { $('lerr').textContent = 'Add your Supabase URL and key in js/config.js first.'; $('lbtn').disabled = true; return; }
  const { data: { session } } = await sb.auth.getSession();
  if (session) enter();
})();
