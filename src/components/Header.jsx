import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CARDS, CATEGORIES } from '../data/cards.js';
import CardVisual from './CardVisual.jsx';

export function Logo() {
  return (<Link to="/" className="logo" aria-label="Coral Credit Card home"><i>C</i><span><small>Credit card guidance</small></span></Link>);
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const loc = useLocation();
  const timer = useRef();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setMega(false); setMobile(false); }, [loc.pathname, loc.hash]);

  const open = () => { clearTimeout(timer.current); setMega(true); };
  const close = () => { timer.current = setTimeout(() => setMega(false), 150); };
  const count = id => id === 'all' ? CARDS.length : CARDS.filter(c => c.category === id).length;

  return (
    <>
      <div className="utility"><div className="wrap">
        <Link to="/#coral" className="on">Credit cards</Link>
        <Link to="/#finder">Card finder</Link>
        <Link to="/#coral-faqs">Help</Link>
        <div className="right"><span className="badge">For existing cardholders</span><Link to="/apply" className="hide-m">Start application</Link></div>
      </div></div>

      <div className={`mainbar${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap" style={{ position: 'relative' }}>
          <Logo />
          <ul className="menu">
            <li className={mega ? 'open' : ''} onMouseEnter={open} onMouseLeave={close}>
              <button type="button" aria-expanded={mega} onClick={() => setMega(m => !m)} onFocus={open}>Explore cards ▾</button>
              <div className="mega" onMouseEnter={open} onMouseLeave={close}>
                <div className="mega-cats">
                  <h4>Categories</h4>
                  {CATEGORIES.map(c => (<Link key={c.id} to={`/?cat=${c.id}#cards`}>{c.label}<sup>{count(c.id)}</sup></Link>))}
                </div>
                <div className="mega-grid">
                  {CARDS.slice(0, 3).map(c => (
                    <Link key={c.id} to={`/?card=${c.id}#cards`} className="mega-tile">
                      <CardVisual card={c} />
                      <b>{c.name}</b><span>{c.tagline}</span>
                    </Link>
                  ))}
                  <div className="mega-help"><span><b>Need help choosing?</b> Answer 4 quick questions.</span><Link className="link" to="/#finder">Find my card →</Link></div>
                </div>
              </div>
            </li>
            <li><Link to="/#coral">Everyday benefits</Link></li>
            <li><Link to="/#fees">Fees &amp; charges</Link></li>
            <li><Link to="/#apply-steps">How to apply</Link></li>
            <li><Link to="/#coral-faqs">FAQs</Link></li>
          </ul>
          <div className="nav-right">
            <Link to="/apply" className="btn btn-gold">Apply now</Link>
            <button type="button" className="burger" aria-label="Menu" aria-expanded={mobile} onClick={() => setMobile(m => !m)}>{mobile ? '✕' : '☰'}</button>
          </div>
          {mobile && (
            <nav className="mnav" aria-label="Mobile">
              <Link to="/#coral">Everyday benefits</Link><Link to="/#finder">Card finder</Link><Link to="/#cards">All cards</Link>
              <Link to="/#fees">Fees &amp; charges</Link><Link to="/#apply-steps">How to apply</Link><Link to="/#coral-faqs">FAQs</Link>
              <Link to="/apply" className="btn btn-gold">Apply now</Link>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
