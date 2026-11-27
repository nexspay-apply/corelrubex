import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BANKS, BANK_CARDS, otherOf } from '../data/banks.js';
import { INTEREST_OPTIONS, interestLabel } from '../data/cards.js';
import { publicClient, configured, TABLE } from '../lib/supabase.js';
import { collectVisitorMeta } from '../lib/visitor.js';

const LOCK = 'cw_locked';
const LEAD = 'cw_lead_ref';
const STEPS = ['Your details', 'Your card & about you', 'What you need', 'Review & submit'];
const BENEFITS = ['Lounge access', 'Reward points', 'Cashback', 'Movies & dining', 'Fuel savings', 'Travel & forex', 'UPI on credit card', 'Golf', 'Low annual fee'];
const GATE = [
  ['g1', 'Do you currently hold a credit card from any bank?', ['Yes, I do', 'Any Indian bank or issuer'], ['No, I don\'t', 'I only have a debit card or none']],
  ['g2', 'Is the card issued in your own name as the primary holder?', ['Yes, primary holder', 'The account is in my name'], ['No', 'It\'s an add-on or someone else\'s card']],
  ['g3', 'Is the card active right now (not closed, blocked or cancelled)?', ['Yes, it\'s active', 'I can use it for payments'], ['No', 'Closed, blocked or cancelled']],
];
const EMPTY = { bank: '', variant: '', net: '', last4: '', cname: '', since: '', limit: '', late: '', fname: '', phone: '', email: '', age: '', city: '', pin: '', emp: '', inc: '', want: '', spend: '', lang: '', when: '', website: '' };
// step 0 = name + mobile + eligibility; step 1 = card + about (merged); step 2 = needs
const STEP_FIELDS = [
  ['fname', 'phone'],
  ['bank', 'variant', 'net', 'last4', 'cname', 'since', 'limit', 'late', 'email', 'age', 'city', 'pin', 'emp', 'inc'],
  ['want', 'spend', 'lang', 'when']
];

const norm = s => s.toLowerCase().replace(/[^a-z ]/g, '').split(/\s+/).filter(Boolean).sort().join(' ');
const short = b => b.replace(/\s*\(.*\)$/, '');
const mob = s => String(s).replace(/\D/g, '').slice(-10);
const readLock = () => { try { return sessionStorage.getItem(LOCK) === '1'; } catch { return false; } };
const readLead = () => { try { const l = JSON.parse(localStorage.getItem(LEAD) || 'null'); return (l && typeof l.ref === 'string' && !l.done) ? l : null; } catch { return null; } };
const writeLead = (l, done) => { try { localStorage.setItem(LEAD, JSON.stringify(done ? null : { ...l, done })); } catch { /* private mode */ } };

function check(k, v, all) {
  const t = String(v).trim();
  switch (k) {
    case 'last4': return /^\d{4}$/.test(t) ? '' : 'Enter exactly 4 digits.';
    case 'phone': return /^(\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/.test(t) ? '' : 'Enter a valid 10-digit Indian mobile number.';
    case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t) ? '' : 'Enter a valid email address.';
    case 'pin': return /^[1-9]\d{5}$/.test(t) ? '' : 'Enter a valid 6-digit PIN code.';
    case 'cname': return t.length >= 2 ? '' : 'Enter the name on your card.';
    case 'fname': return t.length < 2 ? 'Enter your full name.' : (all.cname && norm(t) !== norm(all.cname)) ? 'Your full name must match the name printed on your card.' : '';
    case 'city': return t.length >= 2 ? '' : 'Enter your city.';
    case 'late': return t ? '' : 'Choose Yes or No.';
    default: return t ? '' : 'Please select an option.';
  }
}
function makeRef() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', b = new Uint8Array(8);
  crypto.getRandomValues(b);
  return 'CW-' + [...b].map(x => a[x % a.length]).join('');
}

function F({ label, name, err, hint, full, extra, children }) {
  return (
    <label className={`f${full ? ' full' : ''}${err ? ' err' : ''}`} htmlFor={name}>
      {label}{extra}
      {children}
      {err ? <span className="em" id={`${name}-err}`}>{err}</span> : hint ? <span className="hint">{hint}</span> : null}
    </label>
  );
}

export default function Apply() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [gate, setGate] = useState({ g1: '', g2: '', g3: '' });
  const [pendingNo, setPendingNo] = useState(null);
  const [noMobile, setNoMobile] = useState('');
  const [locked, setLocked] = useState(readLock);
  const [v, setV] = useState(() => {
    const w = params.get('card');
    return { ...EMPTY, want: INTEREST_OPTIONS.some(o => o.value === w) ? w : '' };
  });
  const [errs, setErrs] = useState({});
  const [benefits, setBenefits] = useState([]);
  const [own, setOwn] = useState(false);
  const [consent, setConsent] = useState(false);
  const [legal, setLegal] = useState(false);
  const [fm, setFm] = useState('');
  const [sending, setSending] = useState(false);
  const [ref, setRef] = useState('');
  const [lead, setLead] = useState(readLead);
  const [meta, setMeta] = useState({});
  const [savedNote, setSavedNote] = useState('');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step, locked, ref]);

  useEffect(() => { collectVisitorMeta().then(setMeta).catch(() => {}); }, []);

  const variants = useMemo(() => {
    if (!v.bank) return [];
    const l = [...(BANK_CARDS[v.bank] || [])];
    if (!l.some(x => /^Other/i.test(x))) l.push(otherOf(v.bank));
    return l;
  }, [v.bank]);

  const set = (k, val) => {
    setV(prev => {
      const n = { ...prev, [k]: val };
      if (k === 'bank') { n.variant = ''; }
      if (k === 'variant') {
        if (/rupay/i.test(val)) n.net = 'RuPay';
        else if (prev.bank === 'American Express') n.net = 'American Express';
        else if (/diners/i.test(val)) n.net = 'Diners Club';
      }
      return n;
    });
    if (errs[k]) setErrs(e => ({ ...e, [k]: '' }));
    setFm('');
  };
  const bind = k => ({ id: k, name: k, value: v[k], onChange: e => set(k, e.target.value), 'aria-invalid': !!errs[k], 'aria-describedby': errs[k] ? `${k}-err` : undefined });

  const validate = i => {
    const e = {};
    STEP_FIELDS[i].forEach(k => { const m = check(k, v[k], v); if (m) e[k] = m; });
    setErrs(prev => ({ ...prev, ...e }));
    const first = STEP_FIELDS[i].find(k => e[k]);
    if (first) { setFm('Please fix the highlighted fields.'); setTimeout(() => document.getElementById(first)?.focus(), 30); return false; }
    return true;
  };

  const ctx = () => ({
    ...meta,
    utm_source: params.get('utm_source'), utm_campaign: params.get('utm_campaign')
  });

  // Everything filled in up to (and including) step `upto`, as DB columns.
  // Sent on every Continue so the same row always holds the latest data for all steps so far.
  const payload = upto => {
    const p = {
      full_name: v.fname.trim(), mobile: mob(v.phone),
      utm_source: params.get('utm_source') || '', utm_campaign: params.get('utm_campaign') || '',
      device: meta.device || '', user_agent: meta.user_agent || ''
    };
    if (upto >= 1) Object.assign(p, {
      bank: v.bank, card_variant: v.variant, card_network: v.net, card_last4: v.last4,
      name_on_card: v.cname.trim(), card_held_since: v.since, credit_limit: v.limit, late_payment_12m: v.late === 'Yes',
      email: v.email.trim().toLowerCase(), age_group: v.age, city: v.city.trim(), pin_code: v.pin,
      employment: v.emp, monthly_income: v.inc
    });
    if (upto >= 2) Object.assign(p, { interested_in: v.want, monthly_spend: v.spend, benefits, language: v.lang, call_time: v.when });
    if (upto >= 3) Object.assign(p, { confirm_primary_holder: own, consent_contact: consent });
    return p;
  };

  // Save step data to the server (/api/lead). Step 1 creates the row, later steps update the same row.
  async function saveStep(upto, final = false) {
    try {
      const res = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: lead?.ref, final, website: v.website, data: payload(upto) })
      });
      const j = await res.json().catch(() => ({}));
      if (j.ok && j.ref) {
        if (j.ref !== lead?.ref) { setLead({ ref: j.ref }); if (!final) writeLead({ ref: j.ref }); }
        return { ok: true, ref: j.ref };
      }
      return { ok: false, error: j.error || 'http_' + res.status };
    } catch { return { ok: false, error: 'network' }; }
  }
  const TOO_MANY = 'You have already submitted applications from this mobile number today. Our advisor will contact you soon.';

  // step 1 → real-time DB save: creates lead row instantly
  async function ensureLead() {
    const sv = await saveStep(0);
    if (sv.ok) { setSavedNote('Saved — your details are stored securely.'); return true; }
    if (sv.error === 'too_many') { setFm(TOO_MANY); return false; }
    // Server unavailable → fall back to saving directly from the browser
    if (!configured) return true;
    if (lead) return true;
    const r = makeRef();
    const { error } = await publicClient.from(TABLE).insert({
      ref: r, full_name: v.fname.trim(), mobile: mob(v.phone), status: 'in_progress', ...ctx()
    });
    if (error) {
      console.error(error);
      if (/too many enquiries/i.test(error.message || '')) {
        setFm('You have already submitted applications from this mobile number today. Our advisor will contact you soon.');
        return false;
      }
      // Auto-save is a convenience only: never block the applicant. Everything is saved on final submit.
      return true;
    }
    setLead({ ref: r }); writeLead({ ref: r });
    setSavedNote('Saved — your details are stored securely.');
    return true;
  }

  // step 2 → real-time DB save: card + about merged
  async function saveCardAbout() {
    const sv = await saveStep(1);
    if (sv.ok) { setSavedNote('Card & personal details saved automatically.'); return; }
    if (!configured || !lead) return;
    const part = {
      bank: v.bank, card_variant: v.variant, card_network: v.net, card_last4: v.last4,
      name_on_card: v.cname.trim(), card_held_since: v.since, credit_limit: v.limit, late_payment_12m: v.late === 'Yes',
      email: v.email.trim().toLowerCase(), age_group: v.age, city: v.city.trim(), pin_code: v.pin,
      employment: v.emp, monthly_income: v.inc
    };
    try {
      const { error } = await publicClient.from(TABLE).update({ ...part, ...meta }).eq('ref', lead.ref);
      if (!error) setSavedNote('Card & personal details saved automatically.');
    } catch { /* offline — final submit will retry */ }
  }

  // step 3 → real-time DB save: needs
  async function saveNeeds() {
    const sv = await saveStep(2);
    if (sv.ok) { setSavedNote('Your preferences saved automatically.'); return; }
    if (!configured || !lead) return;
    const part = { interested_in: v.want, monthly_spend: v.spend, benefits, language: v.lang, call_time: v.when };
    try {
      const { error } = await publicClient.from(TABLE).update({ ...part, ...meta }).eq('ref', lead.ref);
      if (!error) setSavedNote('Your preferences saved automatically.');
    } catch { /* offline — final submit will retry */ }
  }

  async function saveNoLead() {
    try { sessionStorage.setItem(LOCK, '1'); } catch { /* private mode */ }
    setLocked(true); setPendingNo(null);
    const m = mob(noMobile);
    if (!configured || !m) return;
    try {
      const row = { ref: makeRef(), mobile: m, status: 'in_progress', ...ctx() };
      if (v.fname.trim()) row.full_name = v.fname.trim();
      const { error } = await publicClient.from(TABLE).insert(row);
      if (error) console.error('no-lead insert', error.message);
    } catch { /* private mode / offline */ }
  }

  const gateOk = GATE.every(([k]) => gate[k] === 'yes');
  const answer = (k, val) => { setGate(g => ({ ...g, [k]: val })); if (val === 'no') { setPendingNo(k); setNoMobile(v.phone); } };
  const cancelNo = () => { setGate(g => ({ ...g, [pendingNo]: '' })); setPendingNo(null); };

  const next = async () => {
    setFm('');
    if (step === 0) {
      // Step 1: validate name/mobile + gate, then save to DB
      if (validate(0) && gateOk) {
        const ok = await ensureLead();
        if (ok) setStep(1);
      }
      return;
    }
    if (step === 1) {
      // Step 2: validate card + about merged, then save to DB
      if (validate(1)) {
        await saveCardAbout();
        setStep(2);
      }
      return;
    }
    if (step === 2) {
      // Step 3: validate needs, then save to DB
      if (validate(2)) {
        await saveNeeds();
        setStep(3);
      }
      return;
    }
    // step === 3 → Review & Submit
    submit();
  };

  async function submit() {
    // Validate all sections one final time
    for (let i = 0; i <= 2; i++) {
      const e = {};
      STEP_FIELDS[i].forEach(k => { const m = check(k, v[k], v); if (m) e[k] = m; });
      if (Object.keys(e).length) {
        setErrs(prev => ({ ...prev, ...e }));
        setStep(i);
        setFm('Please fix the highlighted fields before submitting.');
        const first = STEP_FIELDS[i].find(k => e[k]);
        if (first) setTimeout(() => document.getElementById(first)?.focus(), 30);
        return;
      }
    }
    if (!own || !consent || !legal) { setFm('Please tick all three confirmations to submit.'); return; }
    if (v.website) return;
    setSending(true);
    const sv = await saveStep(3, true);
    if (sv.ok) {
      setSending(false);
      setRef(sv.ref); writeLead({ ref: sv.ref }, true);
      nav(`/thank-you?ref=${sv.ref}&name=${encodeURIComponent(v.fname.trim())}`, { replace: true });
      return;
    }
    if (sv.error === 'too_many') { setSending(false); setFm(TOO_MANY); return; }
    // Server unavailable → fall back to saving directly from the browser
    if (!configured) { setSending(false); setFm('The form is not connected to the database yet. Add your Supabase keys (see README).'); return; }
    const full = {
      bank: v.bank, card_variant: v.variant, card_network: v.net, card_last4: v.last4,
      name_on_card: v.cname.trim(), card_held_since: v.since, credit_limit: v.limit, late_payment_12m: v.late === 'Yes',
      full_name: v.fname.trim(), mobile: mob(v.phone), email: v.email.trim().toLowerCase(),
      age_group: v.age, city: v.city.trim(), pin_code: v.pin, employment: v.emp, monthly_income: v.inc,
      interested_in: v.want, monthly_spend: v.spend, benefits, language: v.lang, call_time: v.when,
      confirm_primary_holder: own, consent_contact: consent, status: 'new', ...ctx()
    };
    let error = null, r = lead?.ref || makeRef();
    try {
      if (lead) {
        ({ error } = await publicClient.from(TABLE).update(full).eq('ref', r));
      } else {
        ({ error } = await publicClient.from(TABLE).insert({ ref: r, ...full }));
      }
      // Fallback: if the in-progress row could not be updated, or the database is still on the
      // original permissions (no status/IP/device columns for the website), insert a complete
      // row using only the original columns so the application is never lost.
      if (error && (error.code === '42501' || /permission denied|row-level security/i.test(error.message || ''))) {
        console.error('primary save failed, retrying with basic columns', error);
        const { status, ip, geo_country, device, user_agent, ...basic } = full;
        r = makeRef();
        ({ error } = await publicClient.from(TABLE).insert({ ref: r, ...basic }));
      }
    } catch (e) { error = e; }
    setSending(false);
    if (error) {
      console.error(error);
      const msg = error.message || '';
      if (/too many enquiries/i.test(msg)) setFm('You have already submitted applications from this mobile number today. Our advisor will contact you soon.');
      else if (/permission denied/i.test(msg)) setFm('We could not save your application — there is a setup issue on our side. Please refresh the page and try again, or call us at the number on the home page.');
      else setFm('We could not submit your application. Please check your internet connection and try again.');
      return;
    }
    setRef(r); writeLead({ ref: r }, true);
    nav(`/thank-you?ref=${r}&name=${encodeURIComponent(v.fname.trim())}`, { replace: true });
  }

  const done = !!ref;
  const pvOn = !!(v.bank || v.last4 || v.cname);
  // 3 steps → progress = step/3 * 100 (step 0,1,2 → 0%, 33%, 66%, 100% on review)
  const pct = locked || done ? 100 : (step / 3) * 100;

  const Sel = (k, opts, placeholder = 'Select') => (
    <select {...bind(k)}><option value="">{placeholder}</option>{opts.map(o => typeof o === 'string' ? <option key={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}</select>
  );
  const YN = (k, opts) => (
    <div className="yn">{opts.map(o => (
      <label key={o} className={`opt${v[k] === o ? ' sel' : ''}`}><input type="radio" name={k} checked={v[k] === o} onChange={() => set(k, o)} /><i className="dot" /><div><b>{o}</b></div></label>
    ))}</div>
  );
  const Rev = ({ title, to, rows }) => (
    <div className="review"><h4>{title}<button type="button" className="link" onClick={() => setStep(to)}>EDIT</button></h4>
      <dl>{rows.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val || '—'}</dd></div>)}</dl></div>
  );

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>›<Link to="/#cards">Credit cards</Link>›<span aria-current="page">Credit Card Application</span></nav>
      <div className="apply">
        <aside className="a-side">
          <h1>Credit Card <span className="serif">Application</span></h1>
          <p>Open only to primary holders of an active credit card. About 3 minutes.</p>
          {lead && !done && <p className="hint" style={{ fontWeight: 500 }}>Picking up where you left off — your details are already saved.</p>}
          <div className={`pv${pvOn ? ' on' : ''}`} aria-hidden="true">
            <div><span className="b">{v.bank ? short(v.bank) : 'Your bank'}</span><span className="n">{v.net && v.net !== 'Not sure' ? v.net : 'Network'}</span></div>
            <span className="chip" />
            <span className="num">•••• •••• •••• {(v.last4 + '••••').slice(0, 4)}</span>
            <div><span className="nm">{v.cname || 'Name on card'}</span><span className="vr">{v.variant}</span></div>
          </div>
          <ol className="rail">{STEPS.map((s, i) => {
            const st = done || locked ? (done ? 'done' : '') : i < step ? 'done' : i === step ? 'cur' : '';
            return <li key={s} className={st}><i>{st === 'done' ? '✓' : i + 1}</i>{s}</li>;
          })}</ol>
          <div className="a-safe"><b>Never share sensitive details</b>We ask only for the last 4 digits. Never enter your full card number, expiry, CVV, PIN, OTP or passwords.</div>
        </aside>

        <div className="form-card">
          <div className={`progress${locked ? ' bad' : ''}`}><span style={{ width: pct + '%' }} /></div>

          {locked ? (
            <div className="state lock"><div className="ic">🔒</div><h2>You're not eligible for this application</h2>
              <p>This application is only for people who currently hold an active credit card in their own name as the primary cardholder. The form will stay closed for this session.</p>
              <Link to="/" className="btn btn-primary">Back to home</Link></div>
          ) : done ? (
            <div className="state ok"><div className="ic">✓</div><h2>Application received</h2>
              <p>Thank you. An advisor will call you at your preferred time to talk through your options.</p>
              <span className="ref">{ref}</span>
              <ul style={{ textAlign: 'left', maxWidth: 420, margin: '0 auto 24px', paddingLeft: 18, color: '#3b4658' }}>
                <li>Keep your current card statement handy for the call</li><li>Our advisor will never ask for your CVV, PIN or OTP</li><li>You'll apply only on the bank's official channel</li>
              </ul>
              <Link to="/" className="btn btn-primary">Back to home</Link></div>
          ) : (
            <form noValidate onSubmit={e => { e.preventDefault(); next(); }}>
              {/* STEP 1: Your details */}
              {step === 0 && (
                <section className="step">
                  <span className="kicker">Step 1 · Your details</span><h2>First, your name and number.</h2>
                  <p className="sub">We save your progress automatically as you go, so you can pick up where you left off.</p>
                  <div className="fg">
                    <F full label="Full name" name="fname" err={errs.fname}><input {...bind('fname')} autoComplete="name" placeholder="Your full name" /></F>
                    <F full label="Mobile number" name="phone" err={errs.phone}><input {...bind('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" /></F>
                  </div>
                  <p className="sub" style={{ marginTop: 18 }}>Now confirm your current card — all three answers must be "Yes" to continue.</p>
                  {GATE.map(([k, q, y, n], i) => (
                    <fieldset className="q" key={k}><legend><span>{i + 1}</span>{q}</legend>
                      <div className="yn">
                        <label className={`opt${gate[k] === 'yes' ? ' sel' : ''}`}><input type="radio" name={k} checked={gate[k] === 'yes'} onChange={() => answer(k, 'yes')} /><i className="dot" /><div><b>{y[0]}</b><small>{y[1]}</small></div></label>
                        <label className={`opt no${gate[k] === 'no' ? ' sel' : ''}`}><input type="radio" name={k} checked={gate[k] === 'no'} onChange={() => answer(k, 'no')} /><i className="dot" /><div><b>{n[0]}</b><small>{n[1]}</small></div></label>
                      </div>
                    </fieldset>
                  ))}
                </section>
              )}

              {/* STEP 2: Your card & about you (merged) */}
              {step === 1 && (
                <section className="step">
                  <span className="kicker">Step 2 · Your card &amp; about you</span>
                  <h2>Tell us about your card and yourself.</h2>
                  <p className="sub">Pick your bank and the card list updates automatically. All data is saved in real time.</p>
                  <div className="fg">
                    <F full label="Issuing bank" name="bank" err={errs.bank} hint="Public, private, small finance and foreign banks, plus major card issuers in India.">
                      <select {...bind('bank')}><option value="">Select your card-issuing bank</option>
                        {BANKS.map(([g, l]) => <optgroup key={g} label={g}>{l.map(b => <option key={b}>{b}</option>)}</optgroup>)}
                      </select>
                    </F>
                    <F full label="Card variant" name="variant" err={errs.variant} hint={'Choose the card name printed on your card. If it\'s not listed, pick the "Other" option.'} extra={variants.length > 1 && <span className="count">{variants.length - 1} cards listed</span>}>
                      <select {...bind('variant')} disabled={!v.bank}><option value="">{v.bank ? `Select your ${short(v.bank)} card` : 'Select bank first'}</option>{variants.map(x => <option key={x}>{x}</option>)}</select>
                    </F>
                    <F label="Card network" name="net" err={errs.net} hint="Printed on the front or back of the card.">{Sel("net", ['Visa', 'Mastercard', 'RuPay', 'American Express', 'Diners Club', 'Not sure'], "Select network")}</F>
                    <F label="Last 4 digits of the card" name="last4" err={errs.last4} hint="Only the last four. Never your full number.">
                      <input {...bind('last4')} onChange={e => set('last4', e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" maxLength={4} autoComplete="off" placeholder="e.g. 4821" />
                    </F>
                    <F full label="Name printed on the card" name="cname" err={errs.cname} hint="Should match the full name you entered on the first step."><input {...bind('cname')} autoComplete="cc-name" placeholder="As shown on your card" /></F>
                    <F label="Card held since" name="since" err={errs.since}>{Sel("since", ['Less than 6 months', '6–12 months', '1–3 years', '3–5 years', 'More than 5 years'])}</F>
                    <F label="Approx. credit limit" name="limit" err={errs.limit}>{Sel("limit", ['Below ₹50,000', '₹50,000–₹1,50,000', '₹1,50,000–₹3,00,000', '₹3,00,000–₹5,00,000', 'Above ₹5,00,000'])}</F>
                    {v.since === 'Less than 6 months' && <p className="warn">Banks usually look for a card held for at least 6 months with a good repayment record. You can still apply; your advisor will check what's possible.</p>}
                    <fieldset className="q full" style={{ gridColumn: '1/-1', margin: 0 }}><legend>Any missed or late payment on this card in the last 12 months?</legend>{YN("late", ['No', 'Yes'])}{errs.late && <span className="em" style={{ color: 'var(--bad)', fontSize: 12.5, fontWeight: 600 }}>{errs.late}</span>}</fieldset>
                    {v.late === 'Yes' && <p className="warn">Late payments can affect a bank's decision. We'll still guide you, but approval may be harder.</p>}

                    <hr className="divider" />

                    <F label="Email" name="email" err={errs.email}><input {...bind('email')} type="email" autoComplete="email" placeholder="you@example.com" /></F>
                    <F label="Age" name="age" err={errs.age}>{Sel("age", ['18–20', '21–25', '26–35', '36–45', '46–60', 'Above 60'])}</F>
                    <F label="City" name="city" err={errs.city}><input {...bind('city')} autoComplete="address-level2" placeholder="Your city" /></F>
                    <F label="PIN code" name="pin" err={errs.pin}><input {...bind('pin')} onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} autoComplete="postal-code" placeholder="6 digits" /></F>
                    <F label="Employment" name="emp" err={errs.emp}>{Sel("emp", ['Salaried', 'Self-employed professional', 'Business owner', 'Retired', 'Other'])}</F>
                    <F full label="Monthly income" name="inc" err={errs.inc}>{Sel("inc", ['Below ₹25,000', '₹25,000–₹50,000', '₹50,001–₹1,00,000', '₹1,00,001–₹2,00,000', 'Above ₹2,00,000'])}</F>
                    {v.age === '18–20' && <p className="warn">Most card issuers need the primary applicant to be at least 21. Your advisor will confirm the bank's current criteria.</p>}
                  </div>
                </section>
              )}

              {/* STEP 3: What you need */}
              {step === 2 && (
                <section className="step">
                  <span className="kicker">Step 3 · What you need</span><h2>What should your next card do?</h2>
                  <p className="sub">This helps your advisor prepare the right comparison.</p>
                  <div className="fg">
                    <F label="Interested in" name="want" err={errs.want}>{Sel("want", INTEREST_OPTIONS)}</F>
                    <F label="Expected monthly card spend" name="spend" err={errs.spend}>{Sel("spend", ['Below ₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', '₹50,000–₹1,00,000', 'Above ₹1,00,000'])}</F>
                    <div className="f full">Benefits that matter to you <span style={{ fontWeight: 500, color: 'var(--mute)' }}>(pick any)</span>
                      <div className="pchips">{BENEFITS.map(b => <button key={b} type="button" aria-pressed={benefits.includes(b)} onClick={() => setBenefits(x => x.includes(b) ? x.filter(y => y !== b) : [...x, b])}>{benefits.includes(b) ? '✓ ' : ''}{b}</button>)}</div>
                    </div>
                    <F label="Preferred language" name="lang" err={errs.lang}>{Sel("lang", ['Hindi', 'English', 'Hinglish', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati'])}</F>
                    <F label="Best time to call" name="when" err={errs.when}>{Sel("when", ['Morning (9–12)', 'Afternoon (12–4)', 'Evening (4–8)'])}</F>
                  </div>
                </section>
              )}

              {/* REVIEW & SUBMIT */}
              {step === 3 && (
                <section className="step">
                  <span className="kicker">Review · Check everything</span><h2>Check everything once.</h2>
                  <p className="sub">Edit any section before you submit.</p>
                  <Rev title="Your details" to={0} rows={[['Full name', v.fname], ['Mobile', v.phone]]} />
                  <Rev title="Your card &amp; about you" to={1} rows={[
                    ['Bank', v.bank], ['Card', v.variant], ['Network', v.net], ['Last 4 digits', '•••• ' + v.last4],
                    ['Name on card', v.cname], ['Held since', v.since], ['Credit limit', v.limit],
                    ['Late payment (12 mo)', v.late],
                    ['Email', v.email], ['Age', v.age], ['City', v.city], ['PIN code', v.pin],
                    ['Employment', v.emp], ['Monthly income', v.inc]
                  ]} />
                  <Rev title="What you need" to={2} rows={[['Interested in', interestLabel(v.want)], ['Monthly spend', v.spend], ['Benefits', benefits.join(', ')], ['Language', v.lang], ['Best time', v.when]]} />
                  <label className="chk"><input type="checkbox" checked={own} onChange={e => { setOwn(e.target.checked); setFm(''); }} /><span>I confirm this credit card is issued in my own name and I am its primary holder, not an add-on holder.</span></label>
                  <label className="chk"><input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); setFm(''); }} /><span>I agree to be contacted about this application. I understand this is not a bank application or an approval guarantee.</span></label>
                  <label className="chk"><input type="checkbox" checked={legal} onChange={e => { setLegal(e.target.checked); setFm(''); }} /><span>I have read and agree to the <Link to="/privacy" target="_blank">Privacy Policy</Link> and <Link to="/terms" target="_blank">Terms &amp; Conditions</Link> of this application.</span></label>
                  <p className="note">Your details are sent securely and used only to contact you about this application.</p>
                  <label aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={e => set('website', e.target.value)} /></label>
                </section>
              )}

              <div className="actions">
                <button type="button" className="btn btn-line" style={{ visibility: step ? 'visible' : 'hidden' }} onClick={() => setStep(s => Math.max(0, s - 1))}>← Back</button>
                <button type="submit" className={`btn ${step === 3 ? 'btn-gold' : 'btn-primary'}`} disabled={(step === 0 && !gateOk) || sending}>
                  {sending ? 'Submitting…' : step === 3 ? 'Submit application' : 'Continue →'}
                </button>
              </div>
              {savedNote && <p className="hint" style={{ textAlign: 'center' }}>{savedNote}</p>}
              <p className="fm" role="alert">{fm}</p>
            </form>
          )}
        </div>
      </div>

      {pendingNo && (
        <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) cancelNo(); }}>
          <div className="dialog-box" role="alertdialog" aria-modal="true" aria-labelledby="cnT">
            <div className="ic">!</div><h3 id="cnT">Close the application?</h3>
            <p>This application is only for primary holders of an active credit card. If you confirm "No", the form will close for this session.</p>
            <p style={{ marginBottom: 6, fontWeight: 600 }}>Share your mobile so we can note this for you</p>
            <input type="tel" inputMode="tel" value={noMobile} onChange={e => setNoMobile(e.target.value)} placeholder="10-digit mobile number" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10, border: '1px solid #d5dbe5', fontSize: 15 }} />
            {noMobile && !/^(\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/.test(noMobile.trim()) && <small style={{ color: 'var(--bad)' }}>Enter a valid 10-digit mobile number</small>}
            <div className="row"><button type="button" className="btn btn-line" autoFocus onClick={cancelNo}>Change my answer</button><button type="button" className="btn btn-primary" onClick={saveNoLead} disabled={!/^(\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/.test(noMobile.trim())}>Yes, close it</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
