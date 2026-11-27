import { Link, useSearchParams } from 'react-router-dom';

export default function ThankYou() {
  const [params] = useSearchParams();
  const ref = params.get('ref');
  const name = params.get('name');

  return (
    <div className="wrap">
      <div className="ty" style={{ textAlign: 'center', padding: '72px 0 88px' }}>
        <div className="ty-ic" aria-hidden="true">✓</div>
        <span className="eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>Application received</span>
        <h1 style={{ fontSize: 'clamp(30px,4vw,46px)', margin: '14px 0 10px' }}>
          Thank you{name ? `, ${name.split(' ')[0]}` : ''}!
        </h1>
        <p style={{ maxWidth: 460, margin: '0 auto 8px', color: 'var(--mute)', fontSize: 16 }}>
          Your credit card application has been submitted successfully. An advisor will reach out at your
          preferred time to walk you through the bank’s official application.
        </p>

        {ref && (
          <div className="ty-ref">
            <span>Your reference</span>
            <b>{ref}</b>
            <small>Save this for your records. Our team uses it to track your application.</small>
          </div>
        )}

        <ul className="ty-next">
          <li><b>Keep your card statement handy</b> for the call.</li>
          <li><b>We never ask</b> for your CVV, PIN or OTP.</li>
          <li>You’ll apply only on the <b>bank’s official channel</b>.</li>
        </ul>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
          <Link to="/" className="btn btn-primary">← Back to home</Link>
          <Link to="/#coral-faqs" className="btn btn-line">Read the FAQs</Link>
        </div>
      </div>
    </div>
  );
}
