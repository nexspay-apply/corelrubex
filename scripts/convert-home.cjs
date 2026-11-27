// HTML -> JSX converter for the "index page" design (ICICI Bank Coral landing).
// Reads  index page/home page.html  ->  Writes src/pages/Home.jsx
//
// Pipeline:
//   1. string pre-passes on the raw <body>: drop scripts, drop the baked-in
//      header/nav/logo block (the funnel has no navigation), redirect every
//      remaining external href to the /apply funnel, strip "Jupiter" text,
//      normalise asset paths, and inject the interactive wiring (apply CTAs,
//      FAQ accordion, benefits carousel) that survives the nav removal.
//   2. html-to-jsx (installed) does the mechanical HTML->JSX pass:
//      class->className, for->htmlFor, <!-- --> -> {/* */, void self-close,
//      common-attr camelCasing, and inline style="..." -> style={{...}}.
//   3. post-pass: camelCase the SVG kebab attributes html-to-jsx leaves alone.
//
// The original Stimulus controllers are re-implemented with React state in the
// component skeleton below.
const fs = require('fs');
const path = require('path');
const convert = require('html-to-jsx');

const root = path.join(__dirname, '..');
const full = fs.readFileSync(path.join(root, 'index page', 'home page.html'), 'utf8');

const bStart = full.indexOf('<body');
const bEnd = full.indexOf('</body>', bStart);
let body = full.slice(full.indexOf('>', bStart) + 1, bEnd);

// ---- strip all script blocks (GTM/pixels/carousel JS; React re-implements behaviour)
body = body.replace(/<script[\s\S]*?<\/script>/g, '');

// ---- redirect EVERY external href to the /apply funnel.
//      Only the href VALUE is rewritten, so a sibling target="_blank" (where
//      the design had one, e.g. the app-store links) stays untouched.
//      applyHref = '/apply' + search, so the page's campaign/attribution
//      params are forwarded (the original forwardCardAttribution behaviour).
body = body.replace(/href="(https?:\/\/[^"]*)"/g, 'href={applyHref}');
// the redirect above also rewrote the href VALUE inside data-blog-href attrs;
// drop those now-orphaned attributes (their values were the real blog URLs)
body = body.replace(/\sdata-blog-href=(\{applyHref\}|"[^"]*")/g, '');

// ---- strip Stimulus/framework attributes (they no longer apply under React).
//      MUST run before the <img> self-close pass below: data-action values
//      contain "click->", and the ">", if left in place, breaks that pass.
body = body.replace(/\sdata-(controller|action|desktop-navbar-target|mobile-navbar-target|faq-toggle-target|carousel-target|blog-href|headertype|turbo)="[^"]*"/g, '');
body = body.replace(/\sdata-headertype=light/g, '');

// ---- normalise asset paths to root-absolute (public/ mirrors the design layout)
body = body.replace(/\ssrc=(\/assets\/[A-Za-z0-9_\-\/.]+)/g, ' src="$1"');
body = body.replace(/\ssrc=(assets\/[A-Za-z0-9_\-\/.]+)/g, ' src="$1"');
body = body.replace(/src="assets\//g, 'src="/assets/');

// ---- quote unquoted class values (e.g. <span class=text-beige100>)
body = body.replace(/\sclass=([A-Za-z0-9_\-]+)/g, ' class="$1"');

// ---- self-close <img> that are not already (html-to-jsx misses these when the
//      src contains a "/"); React accepts either form but keep the output uniform
body = body.replace(/<img([^>]*[^/])>/g, '<img$1/>');

// helper: sequential replace with a counter
const seq = (str, re, fn) => { let i = 0; return str.replace(re, () => fn(i++)); };

// ============ STAGE 1: interactive wiring (attribute-level injection) ============

// --- strip "Jupiter" text that survives the nav removal (icons, FAQ copy).
//      (asset FILENAMES containing "jupiter-" are left intact — the files in
//      public/assets keep their original names)
body = body
  .replace(/alt="Jupiter logo"/g, 'alt=""')
  .replace(/alt="Jupiter"/g, 'alt=""')
  .replace(/alt="jupiter-wallet-icon"/g, 'alt=""')
  .replace(/alt="jupiter-blog-icon"/g, 'alt=""')
  .replace(/booked on Jupiter/g, 'booked via the app')
  .replace(/\bJupiter\b/g, 'the app');

// ---- drop the baked-in Jupiter header + desktop nav + mobile nav/logo.
//      The funnel has no navigation; every CTA points at /apply.
body = body.replace(
  /<div id="header"[\s\S]*?<section class="relative overflow-hidden cc-revamp-hero-bg">/,
  '<section class="relative overflow-hidden cc-revamp-hero-bg">'
);
// compensate for the removed fixed header in the hero top padding.
// (pt-11 = 44px; the compiled design CSS only ships classes that were in the
//  original markup, so use a scale step that exists — not an arbitrary value.)
body = body.replace(/class="relative mx-auto max-w-\[360px\] pt-\[109px\]"/, 'class="relative mx-auto max-w-[360px] pt-11"');
body = body.replace(/class="relative mx-auto max-w-\[1024px\] px-8 xl:px-0 pt-\[108px\]/, 'class="relative mx-auto max-w-[1024px] px-8 xl:px-0 pt-11"');
body = body.replace(/class="hidden lg:flex relative mx-auto max-w-\[1240px\] px-8 xl:px-0 pt-\[86px\] pb-\[84px\]/, 'class="hidden lg:flex relative mx-auto max-w-[1240px] px-8 xl:px-0 pt-11 pb-[84px]"');

// --- FAQ accordion (13 items) ---
body = seq(
  body,
  /class="faq-header flex justify-between cursor-pointer"/g,
  i => `onClick={() => openFaq === 'f${i}' ? setOpenFaq(null) : setOpenFaq('f${i}')} class="faq-header flex justify-between cursor-pointer"`
);
body = seq(
  body,
  /class="faq-answer hidden mt-2"/g,
  i => `className={"faq-answer mt-2" + (openFaq === 'f${i}' ? '' : ' hidden')}`
);
body = seq(
  body,
  /class="faq-chevron w-\[24px\] h-\[24px\]"/g,
  i => `className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f${i}' ? ' rotate-180' : '')}`
);

// --- benefits carousel container ---
body = body.replace(
  'class="flex flex-col md:flex-row items-center w-full transform ease duration-500 md:overflow-x-auto mt-4 md:mt-8 gap-4 px-5"',
  'ref={carRef}\n        className="flex flex-col md:flex-row items-center w-full transform ease duration-500 md:overflow-x-auto mt-4 md:mt-8 gap-4 px-5"\n        onMouseDown={carPause} onMouseOver={carPause} onMouseUp={carResume} onMouseLeave={carResume}\n        onTouchStart={carPause} onTouchEnd={carResume} onTouchCancel={carResume}'
);

// ---- framework data-* attributes were stripped earlier, before the <img>
//      self-close pass (their values contain "click->" which would corrupt it)

// ============ STAGE 2: mechanical HTML -> JSX via html-to-jsx ============
// wrap in the design's page root so convert() sees a single root (no extra <div>)
const ROOT = '<div class="page-template page-edge-plus-upi-rupay-credit-card font-sans text-black80 text-base">';
let jsx = convert(ROOT + '\n' + body + '\n</div>');

// ============ STAGE 3: camelCase the SVG kebab attributes html-to-jsx leaves ============
const svgRenames = {
  'stop-color': 'stopColor', 'stop-opacity': 'stopOpacity',
  'fill-rule': 'fillRule', 'clip-rule': 'clipRule',
  'stroke-width': 'strokeWidth', 'stroke-opacity': 'strokeOpacity',
  'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
};
for (const [kebab, camel] of Object.entries(svgRenames)) {
  jsx = jsx.replace(new RegExp('\\s' + kebab + '="', 'g'), ' ' + camel + '="');
}

// ============ wrap into the component ============
const pre = `import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/* ICICI Bank Coral landing page, converted to React. Markup and class names
   are the original home page.html (nav/logo stripped, external links routed to
   the apply funnel). Stimulus controllers are re-implemented with React state
   below. Admin-managed conversion codes are injected site-wide in App.jsx. */

export default function Home() {
  const { search } = useLocation();
  const [openFaq, setOpenFaq] = useState(null);   // open FAQ item (f0..f12)
  const carRef = useRef(null);
  const carPaused = useRef(false);
  const carIdx = useRef(0);
  const carTimer = useRef(null);

  const carPause = () => { carPaused.current = true; };
  const carResume = () => { carPaused.current = false; };

  // every external link in the page routes to the apply funnel, forwarding the
  // page's campaign/attribution params (the original forwardCardAttribution did
  // the same for the external apply link).
  const applyHref = '/apply' + search;

  // page title (the baked-in <title> was dropped with the <head>)
  useEffect(() => { document.title = 'ICICI Bank Coral Credit Card – Benefits, Fees and Rewards'; }, []);

  // benefits carousel: auto-advance every 3s, paused on interaction (original)
  useEffect(() => {
    const advance = () => {
      if (carPaused.current || !carRef.current) return;
      const items = [...carRef.current.children];
      if (items.length < 2) return;
      carIdx.current = (carIdx.current + 1) % items.length;
      carRef.current.scrollTo({ left: items[carIdx.current].offsetLeft - 20, behavior: 'smooth' });
    };
    const timer = setInterval(advance, 3000);
    carTimer.current = timer;
    return () => clearInterval(timer);
  }, []);

  return (
`;
const post = `\n  );\n}\n`;

let out = pre + jsx + post;
fs.writeFileSync(path.join(root, 'src', 'pages', 'Home.jsx'), out);
console.log('written', out.length, 'bytes,', out.split('\n').length, 'lines');

// ============ self-checks (verify the real markers in the output) ============
const rep = {
  'apply redirects': (out.match(/href=\{applyHref\}/g) || []).length,
  'external http hrefs left': (out.match(/href="https?:\/\//g) || []).length,
  'jupiter text left': (out.match(/[Jj]upiter/g) || []).length,
  'jupiter-logo left': (out.match(/jupiter-logo/g) || []).length,
  'nav id="header" left': (out.match(/id="header"/g) || []).length,
  'faq toggles': (out.match(/openFaq === 'f\d+/g) || []).length,
  'carRef': (out.match(/ref=\{carRef\}/g) || []).length,
  'hero pt-11': (out.match(/pt-11/g) || []).length,
  'raw html comments left': (out.match(/<!--/g) || []).length,
  'triple-brace style left': (out.match(/style=\{\{\{/g) || []).length,
  'kebab svg attrs left': (out.match(/\s(stop-color|stop-opacity|fill-rule|clip-rule|stroke-width|stroke-opacity|stroke-linecap|stroke-linejoin|stroke-dasharray)="/g) || []).length,
  'leftover class="': (out.match(/ class="/g) || []).length,
  'leftover style="': (out.match(/ style="/g) || []).length,
  'leftover data-controller': (out.match(/data-controller/g) || []).length,
  'raw script tags': (out.match(/<script/g) || []).length,
};
console.log(JSON.stringify(rep, null, 2));
