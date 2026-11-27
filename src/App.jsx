import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Apply from './pages/Apply.jsx';
import ThankYou from './pages/ThankYou.jsx';
import { Privacy, Terms } from './pages/Legal.jsx';
import { injectConversionCodes } from './lib/visitor.js';

const Admin = lazy(() => import('./pages/Admin.jsx'));

function Site({ children }) {
  return (<><a className="skip" href="#main">Skip to main content</a><main id="main">{children}</main><Footer /></>);
}
function Bare({ children }) {
  return (<><a className="skip" href="#main">Skip to main content</a><main id="main">{children}</main></>);
}

// legal pages (/privacy, /terms) run no conversion codes by design
const PAGE_OF = { '/': 'home', '/apply': 'apply', '/thank-you': 'thank_you' };

export default function App() {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const t = setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' }), 60);
    return () => clearTimeout(t);
  }, [pathname, hash, search]);
  useEffect(() => {
    document.title = pathname.startsWith('/apply') ? 'Credit Card Application | Coral Credit Card'
      : pathname.startsWith('/admin') ? 'Admin | Coral Credit Card'
      : pathname.startsWith('/thank-you') ? 'Thank You | Coral Credit Card'
      : pathname.startsWith('/privacy') ? 'Privacy Policy | Coral Credit Card'
      : pathname.startsWith('/terms') ? 'Terms & Conditions | Coral Credit Card'
      : 'Coral Credit Card | ICICI Bank – Everyday Benefits';
  }, [pathname]);
  // admin-managed conversion codes: load + inject on the public funnel pages only
  useEffect(() => {
    if (PAGE_OF[pathname]) injectConversionCodes(PAGE_OF[pathname]);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Site><Home /></Site>} />
      <Route path="/apply" element={<Site><Apply /></Site>} />
      <Route path="/privacy" element={<Bare><Privacy /></Bare>} />
      <Route path="/terms" element={<Bare><Terms /></Bare>} />
      <Route path="/thank-you" element={<Bare><ThankYou /></Bare>} />
      <Route path="/admin" element={<Suspense fallback={<div className="empty">Loading…</div>}><Admin /></Suspense>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
