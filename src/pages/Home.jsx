import { useEffect, useRef, useState } from 'react';
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
<div className="page-template page-edge-plus-upi-rupay-credit-card font-sans text-black80 text-base">

    <svg xmlns="http://www.w3.org/2000/svg" style={{display: 'none'}} aria-hidden="true">

  {/* ==================== GROUP 1: SOCIAL SHARE ICONS ==================== */}

  <symbol id="icon-facebook" viewBox="0 0 32 32">
    <path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 23.9859 5.85094 30.6053 13.5 31.8056V20.625H9.4375V16H13.5V12.475C13.5 8.465 15.8888 6.25 19.5434 6.25C21.2934 6.25 23.125 6.5625 23.125 6.5625V10.5H21.1075C19.12 10.5 18.5 11.7334 18.5 13V16H22.9375L22.2281 20.625H18.5V31.8056C26.1491 30.6053 32 23.9859 32 16Z" fill="#1877F2"/>
    <path d="M22.2281 20.625L22.9375 16H18.5V13C18.5 11.7347 19.12 10.5 21.1075 10.5H23.125V6.5625C23.125 6.5625 21.2941 6.25 19.5434 6.25C15.8888 6.25 13.5 8.465 13.5 12.475V16H9.4375V20.625H13.5V31.8056C15.1566 32.0648 16.8434 32.0648 18.5 31.8056V20.625H22.2281Z" fill="white"/>
  </symbol>

  <symbol id="icon-facebook-mono" viewBox="0 0 32 32">
    <path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 23.9859 5.85094 30.6053 13.5 31.8056V20.625H9.4375V16H13.5V12.475C13.5 8.465 15.8888 6.25 19.5434 6.25C21.2934 6.25 23.125 6.5625 23.125 6.5625V10.5H21.1075C19.12 10.5 18.5 11.7334 18.5 13V16H22.9375L22.2281 20.625H18.5V31.8056C26.1491 30.6053 32 23.9859 32 16Z" fill="#FC7A69"/>
    <path d="M22.2281 20.625L22.9375 16H18.5V13C18.5 11.7347 19.12 10.5 21.1075 10.5H23.125V6.5625C23.125 6.5625 21.2941 6.25 19.5434 6.25C15.8888 6.25 13.5 8.465 13.5 12.475V16H9.4375V20.625H13.5V31.8056C15.1566 32.0648 16.8434 32.0648 18.5 31.8056V20.625H22.2281Z" fill="white"/>
  </symbol>

  <symbol id="icon-twitter" viewBox="0 0 32 32">
    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#1D9BF0"/>
    <path d="M13.073 24.4391C20.1674 24.4391 24.0474 18.5615 24.0474 13.4647C24.0474 13.2983 24.0436 13.1322 24.0362 12.9663C24.791 12.4191 25.4425 11.7419 25.9602 10.9663C25.2561 11.2779 24.5095 11.4826 23.745 11.5735C24.55 11.0914 25.1525 10.3332 25.4402 9.43994C24.6831 9.88908 23.855 10.2056 22.9914 10.3759C22.4102 9.75603 21.6406 9.34527 20.8022 9.20739C19.9637 9.06952 19.1031 9.21224 18.354 9.6134C17.6049 10.0146 17.0092 10.6518 16.6592 11.4261C16.3093 12.2004 16.2247 13.0686 16.4186 13.8959C14.8849 13.8194 13.3845 13.421 12.0147 12.7268C10.645 12.0326 9.43668 11.058 8.46816 9.86634C7.9749 10.7154 7.82376 11.7205 8.04551 12.6771C8.26726 13.6336 8.84523 14.4697 9.66176 15.0151C9.0493 14.9975 8.45006 14.8329 7.91456 14.5351C7.91456 14.5511 7.91456 14.5671 7.91456 14.5847C7.91502 15.4753 8.22347 16.3383 8.7876 17.0274C9.35174 17.7165 10.1368 18.1892 11.0098 18.3655C10.4417 18.5207 9.84558 18.5435 9.26736 18.4319C9.51375 19.1978 9.99308 19.8676 10.6385 20.3479C11.2838 20.8282 12.063 21.095 12.8674 21.1111C11.5016 22.1819 9.81562 22.7626 8.08016 22.7599C7.77273 22.7602 7.46554 22.7425 7.16016 22.7071C8.92404 23.8399 10.9767 24.4412 13.073 24.4391" fill="white"/>
  </symbol>

  <symbol id="icon-twitter-mono" viewBox="0 0 32 32">
    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#FC7A69"/>
    <path d="M13.073 24.4391C20.1674 24.4391 24.0474 18.5615 24.0474 13.4647C24.0474 13.2983 24.0436 13.1322 24.0362 12.9663C24.791 12.4191 25.4425 11.7419 25.9602 10.9663C25.2561 11.2779 24.5095 11.4826 23.745 11.5735C24.55 11.0914 25.1525 10.3332 25.4402 9.43994C24.6831 9.88908 23.855 10.2056 22.9914 10.3759C22.4102 9.75603 21.6406 9.34527 20.8022 9.20739C19.9637 9.06952 19.1031 9.21224 18.354 9.6134C17.6049 10.0146 17.0092 10.6518 16.6592 11.4261C16.3093 12.2004 16.2247 13.0686 16.4186 13.8959C14.8849 13.8194 13.3845 13.421 12.0147 12.7268C10.645 12.0326 9.43668 11.058 8.46816 9.86634C7.9749 10.7154 7.82376 11.7205 8.04551 12.6771C8.26726 13.6336 8.84523 14.4697 9.66176 15.0151C9.0493 14.9975 8.45006 14.8329 7.91456 14.5351C7.91456 14.5511 7.91456 14.5671 7.91456 14.5847C7.91502 15.4753 8.22347 16.3383 8.7876 17.0274C9.35174 17.7165 10.1368 18.1892 11.0098 18.3655C10.4417 18.5207 9.84558 18.5435 9.26736 18.4319C9.51375 19.1978 9.99308 19.8676 10.6385 20.3479C11.2838 20.8282 12.063 21.095 12.8674 21.1111C11.5016 22.1819 9.81562 22.7626 8.08016 22.7599C7.77273 22.7602 7.46554 22.7425 7.16016 22.7071C8.92404 23.8399 10.9767 24.4412 13.073 24.4391Z" fill="white"/>
  </symbol>

  <symbol id="icon-telegram" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="telegram-gradient" x1="15.9993" y1="-0.000206763" x2="15.9993" y2="31.8835" gradientUnits="userSpaceOnUse">
        <stop stopColor="#42BDE9"/>
        <stop offset="1" stopColor="#23A8DD"/>
      </linearGradient>
    </defs>
    <path d="M27.3132 27.3137C33.5616 21.0653 33.5616 10.9347 27.3132 4.68629C21.0648 -1.56211 10.9342 -1.56211 4.68578 4.68629C-1.56261 10.9347 -1.56261 21.0653 4.68578 27.3137C10.9342 33.5621 21.0648 33.5621 27.3132 27.3137Z" fill="url(#telegram-gradient)"/>
    <path d="M23.7855 9.20546L20.9276 23.6137C20.9276 23.6137 20.5283 24.6131 19.4288 24.1335L12.8341 19.0778L10.436 17.9183L6.39943 16.5598C6.39943 16.5598 5.78012 16.3398 5.72017 15.8601C5.66022 15.3805 6.41921 15.1209 6.41921 15.1209L22.4666 8.82597C22.4666 8.82597 23.7855 8.24623 23.7855 9.20546Z" fill="white"/>
    <path d="M12.3275 23.4513C12.3275 23.4513 12.1351 23.4327 11.8953 22.6719C11.6555 21.9111 10.436 17.9153 10.436 17.9153L20.1285 11.7624C20.1285 11.7624 20.6878 11.4225 20.668 11.7624C20.668 11.7624 20.7682 11.8224 20.4684 12.1017C20.1686 12.3811 12.8545 18.9567 12.8545 18.9567" fill="#D3E6F2"/>
    <path d="M15.3625 21.0146L12.754 23.3929C12.754 23.3929 12.5502 23.5476 12.3271 23.4529L12.8295 19.0332" fill="#B6D0E5"/>
  </symbol>

  <symbol id="icon-telegram-mono" viewBox="0 0 32 32">
    <path d="M27.3132 27.3137C33.5616 21.0653 33.5616 10.9347 27.3132 4.68629C21.0648 -1.56211 10.9342 -1.56211 4.68578 4.68629C-1.56261 10.9347 -1.56261 21.0653 4.68578 27.3137C10.9342 33.5621 21.0648 33.5621 27.3132 27.3137Z" fill="#FC7A69"/>
    <path d="M23.7855 9.20546L20.9276 23.6137C20.9276 23.6137 20.5283 24.6131 19.4288 24.1335L12.8341 19.0778L10.436 17.9183L6.39943 16.5598C6.39943 16.5598 5.78012 16.3398 5.72017 15.8601C5.66022 15.3805 6.41921 15.1209 6.41921 15.1209L22.4666 8.82597C22.4666 8.82597 23.7855 8.24623 23.7855 9.20546Z" fill="white"/>
    <path d="M12.3275 23.4513C12.3275 23.4513 12.1351 23.4327 11.8953 22.6719C11.6555 21.9111 10.436 17.9153 10.436 17.9153L20.1285 11.7624C20.1285 11.7624 20.6878 11.4225 20.668 11.7624C20.668 11.7624 20.7682 11.8224 20.4684 12.1017C20.1686 12.3811 12.8545 18.9567 12.8545 18.9567" fill="#FFE4DE"/>
    <path d="M15.3625 21.0146L12.754 23.3929C12.754 23.3929 12.5502 23.5476 12.3271 23.4529L12.8295 19.0332" fill="#F4B2A9"/>
  </symbol>

  <symbol id="icon-share" viewBox="0 0 32 32">
    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#ED5C49"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M20.3833 8.29102C19.136 8.29102 18.1249 9.30211 18.1249 10.5493C18.1249 11.7966 19.136 12.8077 20.3833 12.8077C21.6305 12.8077 22.6416 11.7966 22.6416 10.5493C22.6416 9.30211 21.6305 8.29102 20.3833 8.29102ZM16.8749 10.5493C16.8749 8.61175 18.4457 7.04102 20.3833 7.04102C22.3209 7.04102 23.8916 8.61175 23.8916 10.5493C23.8916 12.4869 22.3209 14.0577 20.3833 14.0577C19.1663 14.0577 18.094 13.438 17.4648 12.497L12.9201 14.9879C13.0101 15.2984 13.0583 15.6266 13.0583 15.966C13.0583 16.3161 13.007 16.6543 12.9115 16.9733L17.6023 19.2436C18.2437 18.4109 19.2508 17.8743 20.3833 17.8743C22.3209 17.8743 23.8916 19.4451 23.8916 21.3827C23.8916 23.3203 22.3209 24.891 20.3833 24.891C18.4457 24.891 16.8749 23.3203 16.8749 21.3827C16.8749 21.0248 16.9285 20.6795 17.0281 20.3543L12.3444 18.0875C11.7036 18.9302 10.6903 19.4743 9.54993 19.4743C7.61234 19.4743 6.0416 17.9036 6.0416 15.966C6.0416 14.0284 7.61234 12.4577 9.54993 12.4577C10.7013 12.4577 11.7231 13.0123 12.3628 13.8689L16.9658 11.3461C16.9064 11.0901 16.8749 10.8234 16.8749 10.5493ZM11.8083 15.966C11.8083 15.6616 11.748 15.3713 11.6389 15.1063C11.6107 15.0715 11.5858 15.0332 11.565 14.9915C11.5422 14.9461 11.5256 14.8991 11.5147 14.8517C11.1263 14.1685 10.3919 13.7077 9.54993 13.7077C8.30269 13.7077 7.2916 14.7188 7.2916 15.966C7.2916 17.2133 8.30269 18.2243 9.54993 18.2243C10.7972 18.2243 11.8083 17.2133 11.8083 15.966ZM20.3833 19.1243C19.136 19.1243 18.1249 20.1354 18.1249 21.3827C18.1249 22.6299 19.136 23.641 20.3833 23.641C21.6305 23.641 22.6416 22.6299 22.6416 21.3827C22.6416 20.1354 21.6305 19.1243 20.3833 19.1243Z" fill="white"/>
  </symbol>

  <symbol id="icon-share-mono" viewBox="0 0 32 32">
    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#FC7A69"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M20.3833 8.29102C19.136 8.29102 18.1249 9.30211 18.1249 10.5493C18.1249 11.7966 19.136 12.8077 20.3833 12.8077C21.6305 12.8077 22.6416 11.7966 22.6416 10.5493C22.6416 9.30211 21.6305 8.29102 20.3833 8.29102ZM16.8749 10.5493C16.8749 8.61175 18.4457 7.04102 20.3833 7.04102C22.3209 7.04102 23.8916 8.61175 23.8916 10.5493C23.8916 12.4869 22.3209 14.0577 20.3833 14.0577C19.1663 14.0577 18.094 13.438 17.4648 12.497L12.9201 14.9879C13.0101 15.2984 13.0583 15.6266 13.0583 15.966C13.0583 16.3161 13.007 16.6543 12.9115 16.9733L17.6023 19.2436C18.2437 18.4109 19.2508 17.8743 20.3833 17.8743C22.3209 17.8743 23.8916 19.4451 23.8916 21.3827C23.8916 23.3203 22.3209 24.891 20.3833 24.891C18.4457 24.891 16.8749 23.3203 16.8749 21.3827C16.8749 21.0248 16.9285 20.6795 17.0281 20.3543L12.3444 18.0875C11.7036 18.9302 10.6903 19.4743 9.54993 19.4743C7.61234 19.4743 6.0416 17.9036 6.0416 15.966C6.0416 14.0284 7.61234 12.4577 9.54993 12.4577C10.7013 12.4577 11.7231 13.0123 12.3628 13.8689L16.9658 11.3461C16.9064 11.0901 16.8749 10.8234 16.8749 10.5493ZM11.8083 15.966C11.8083 15.6616 11.748 15.3713 11.6389 15.1063C11.6107 15.0715 11.5858 15.0332 11.565 14.9915C11.5422 14.9461 11.5256 14.8991 11.5147 14.8517C11.1263 14.1685 10.3919 13.7077 9.54993 13.7077C8.30269 13.7077 7.2916 14.7188 7.2916 15.966C7.2916 17.2133 8.30269 18.2243 9.54993 18.2243C10.7972 18.2243 11.8083 17.2133 11.8083 15.966ZM20.3833 19.1243C19.136 19.1243 18.1249 20.1354 18.1249 21.3827C18.1249 22.6299 19.136 23.641 20.3833 23.641C21.6305 23.641 22.6416 22.6299 22.6416 21.3827C22.6416 20.1354 21.6305 19.1243 20.3833 19.1243Z" fill="white"/>
  </symbol>

  <symbol id="icon-youtube" viewBox="0 0 26 26">
    <path d="M-0.000488281 13.3977C-0.000488281 6.43736 5.64195 0.794922 12.6023 0.794922C19.5626 0.794922 25.205 6.43736 25.205 13.3977C25.205 20.358 19.5626 26.0004 12.6023 26.0004C5.64195 26.0004 -0.000488281 20.358 -0.000488281 13.3977Z" fill="#FF0000"/>
    <path d="M19.0433 10.2854C18.8887 9.69147 18.4332 9.2238 17.8548 9.06507C16.8065 8.77661 12.6028 8.77661 12.6028 8.77661C12.6028 8.77661 8.39907 8.77661 7.35075 9.06507C6.77232 9.2238 6.31679 9.69147 6.1622 10.2854C5.88135 11.3618 5.88135 13.6077 5.88135 13.6077C5.88135 13.6077 5.88135 15.8535 6.1622 16.9299C6.31679 17.5238 6.77232 17.9915 7.35075 18.1503C8.39907 18.4387 12.6028 18.4387 12.6028 18.4387C12.6028 18.4387 16.8065 18.4387 17.8548 18.1503C18.4332 17.9915 18.8887 17.5238 19.0433 16.9299C19.3243 15.8535 19.3243 13.6077 19.3243 13.6077C19.3243 13.6077 19.3243 11.3618 19.0433 10.2854Z" fill="white"/>
    <path d="M11.3423 15.9183V11.7174L14.703 13.8179L11.3423 15.9183Z" fill="#FF0000"/>
  </symbol>

  <symbol id="icon-linkedin" viewBox="0 0 26 26">
    <path d="M0.00195312 13.3977C0.00195312 6.43736 5.64439 0.794922 12.6047 0.794922C19.565 0.794922 25.2074 6.43736 25.2074 13.3977C25.2074 20.358 19.565 26.0004 12.6047 26.0004C5.64439 26.0004 0.00195312 20.358 0.00195312 13.3977Z" fill="#0077B5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.09684 8.57855C9.09684 9.40251 8.47662 10.0618 7.48076 10.0618H7.46251C6.50366 10.0618 5.88379 9.40251 5.88379 8.57855C5.88379 7.73716 6.52254 7.09631 7.49958 7.09631C8.47662 7.09631 9.0783 7.73716 9.09684 8.57855ZM8.90859 11.2331V19.8143H6.05253V11.2331H8.90859ZM19.2086 19.8143L19.2087 14.8941C19.2087 12.2583 17.7998 11.0316 15.9203 11.0316C14.404 11.0316 13.7251 11.8645 13.346 12.4488V11.2333H10.4896C10.5272 12.0385 10.4896 19.8146 10.4896 19.8146H13.346V15.0221C13.346 14.7656 13.3645 14.5098 13.4401 14.3262C13.6465 13.8138 14.1164 13.2833 14.9055 13.2833C15.9394 13.2833 16.3527 14.0702 16.3527 15.2234V19.8143H19.2086Z" fill="white"/>
  </symbol>

  <symbol id="icon-mail" viewBox="0 0 26 26">
    <path d="M12.6027 26.0004C19.563 26.0004 25.2055 20.358 25.2055 13.3977C25.2055 6.43736 19.563 0.794922 12.6027 0.794922C5.64244 0.794922 0 6.43736 0 13.3977C0 20.358 5.64244 26.0004 12.6027 26.0004Z" fill="#0971BD"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M6.72119 9.81407C6.72119 9.81407 11.7935 12.6905 12.7781 12.6905C13.81 12.6905 18.8274 9.86902 18.8274 9.86902L18.8354 9.36491C18.8354 8.80837 18.3838 8.35669 17.8257 8.35669H7.73042C7.17287 8.35669 6.72119 8.80837 6.72119 9.36491V9.81407ZM18.8274 11.3814C18.8274 11.3814 13.8574 14.0768 12.7781 14.0768C11.7935 14.0768 6.72875 11.3814 6.72926 11.3814L6.72119 17.4307C6.72119 17.9872 7.17338 18.4389 7.73042 18.4389H17.8257C18.3838 18.4389 18.8354 17.9872 18.8354 17.4307L18.8274 11.3814Z" fill="white"/>
  </symbol>

  {/* ==================== GROUP 2: UI ICONS ==================== */}

  <symbol id="icon-arrow-left" viewBox="0 0 6 12">
    <path d="M1.6817 5.77772L1.50128 5.99999L1.6817 6.22225L5.51486 10.9446L4.90855 11.4897L0.686062 6.2867L0.685847 6.28643L0.453847 5.99999L0.685847 5.71356L0.68606 5.71329L4.90855 0.510299L5.51486 1.05544L1.6817 5.77772Z" fill="#FC7A69" stroke="#FC7A69" strokeWidth="0.705355"/>
  </symbol>

  <symbol id="icon-arrow-right" viewBox="0 0 24 24">
    <path d="M3.75 12H20.25" stroke="#626160" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 5.25L20.25 12L13.5 18.75" stroke="#626160" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </symbol>

  <symbol id="icon-arrow-right-white" viewBox="0 0 24 24">
    <path d="M3.75 12H20.25" stroke="#F5F6F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 5.25L20.25 12L13.5 18.75" stroke="#F5F6F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </symbol>

  <symbol id="icon-info-circle" viewBox="0 0 11 12">
    <path fillRule="evenodd" clipRule="evenodd" d="M5.5 0.625C4.07446 0.625 2.70731 1.19129 1.6993 2.1993C0.691293 3.20731 0.125 4.57446 0.125 6C0.125 7.42554 0.691293 8.79269 1.6993 9.8007C2.70731 10.8087 4.07446 11.375 5.5 11.375C6.92554 11.375 8.29269 10.8087 9.3007 9.8007C10.3087 8.79269 10.875 7.42554 10.875 6C10.875 4.57446 10.3087 3.20731 9.3007 2.1993C8.29269 1.19129 6.92554 0.625 5.5 0.625ZM2.22963 2.72963C3.09699 1.86228 4.27337 1.375 5.5 1.375C6.72663 1.375 7.90301 1.86228 8.77037 2.72963C9.63772 3.59699 10.125 4.77337 10.125 6C10.125 7.22663 9.63772 8.40301 8.77037 9.27037C7.90301 10.1377 6.72663 10.625 5.5 10.625C4.27337 10.625 3.09699 10.1377 2.22963 9.27037C1.36228 8.40301 0.875 7.22663 0.875 6C0.875 4.77337 1.36228 3.59699 2.22963 2.72963ZM5.3125 3.3125C5.21361 3.3125 5.11694 3.34182 5.03471 3.39677C4.95249 3.45171 4.8884 3.5298 4.85056 3.62116C4.81272 3.71252 4.80281 3.81305 4.82211 3.91004C4.8414 4.00704 4.88902 4.09613 4.95895 4.16605C5.02887 4.23598 5.11796 4.2836 5.21495 4.30289C5.31194 4.32219 5.41248 4.31228 5.50384 4.27444C5.5952 4.2366 5.67329 4.17251 5.72823 4.09028C5.78318 4.00806 5.8125 3.91139 5.8125 3.8125C5.8125 3.67989 5.75982 3.55272 5.66605 3.45895C5.57229 3.36518 5.44511 3.3125 5.3125 3.3125ZM4.45837 5.33331C4.45837 5.12621 4.62627 4.95831 4.83337 4.95831H5.16671C5.35457 4.95831 5.53474 5.03294 5.66757 5.16578C5.80041 5.29862 5.87504 5.47878 5.87504 5.66665V7.33331C5.87504 7.41067 5.90577 7.48485 5.96047 7.53955C6.01517 7.59425 6.08935 7.62498 6.16671 7.62498H6.50004C6.70715 7.62498 6.87504 7.79287 6.87504 7.99998C6.87504 8.20709 6.70715 8.37498 6.50004 8.37498H6.16671C5.89044 8.37498 5.62549 8.26523 5.43014 8.06988C5.23479 7.87453 5.12504 7.60958 5.12504 7.33331V5.70831H4.83337C4.62627 5.70831 4.45837 5.54042 4.45837 5.33331Z" fill="#656565"/>
  </symbol>

  <symbol id="icon-chevron-right" viewBox="0 0 24 24">
    <path d="M7.53 3.49L17.12 12L7.53 20.51" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
  </symbol>

  <symbol id="icon-chevron-down" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.17818 9.00435C6.42225 8.76027 6.81798 8.76027 7.06206 9.00435L11.9671 13.9094C11.9833 13.9256 11.9975 13.9284 12.0054 13.9284C12.0098 13.9284 12.0126 13.9275 12.0143 13.9268C12.0155 13.9263 12.0177 13.9253 12.0213 13.9215L12.0271 13.9154L16.9381 9.00435C17.1822 8.76027 17.5779 8.76027 17.822 9.00435C18.0661 9.24843 18.0661 9.64415 17.822 9.88823L12.922 14.7883C12.4133 15.3174 11.5876 15.2977 11.0832 14.7933L6.17818 9.88823C5.9341 9.64415 5.9341 9.24843 6.17818 9.00435Z" fill="currentColor"/>
  </symbol>

  <symbol id="icon-circular-arrow" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="20" fill="#2E2D33"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M15.5844 11.3813C15.9261 11.0396 16.4801 11.0396 16.8218 11.3813L24.1085 18.668C24.8728 19.4024 24.8452 20.5953 24.1157 21.3249L16.8218 28.6187C16.4801 28.9604 15.9261 28.9604 15.5844 28.6187C15.2427 28.277 15.2427 27.723 15.5844 27.3813L22.8782 20.0875C22.9126 20.053 22.9223 20.0181 22.9223 19.9921C22.9223 19.9669 22.914 19.9468 22.8952 19.929L22.8866 19.9209L15.5844 12.6187C15.2427 12.277 15.2427 11.723 15.5844 11.3813Z" fill="white"/>
  </symbol>

  <symbol id="icon-right-chevron" viewBox="0 0 13 19">
    <path fillRule="evenodd" clipRule="evenodd" d="M1.37175 17.6753C1.86741 18.1082 2.67105 18.1082 3.16671 17.6753L11.6283 10.284C12.1239 9.85099 12.1239 9.14901 11.6283 8.71603L3.16671 1.32473C2.67105 0.89176 1.86741 0.89176 1.37175 1.32473C0.876082 1.7577 0.876082 2.45969 1.37175 2.89266L8.93581 9.5L1.37175 16.1073C0.876083 16.5403 0.876084 17.2423 1.37175 17.6753Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </symbol>

</svg>
    {/* Google Tag Manager (noscript) */}
    
    {/* End Google Tag Manager (noscript) */}
    {/* KwikPass Integration */}
    
    {/* End KwikPass Integration */}
    <main id="main-content">
    <section className="relative overflow-hidden cc-revamp-hero-bg">

        <div className="lg:hidden relative">
            <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/hero-pattern-top-mobile.svg" className="absolute top-0 left-0 w-full h-[217px] object-cover pointer-events-none" alt="" aria-hidden="true" decoding="async" />
            <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/hero-pattern-bottom-mobile.svg" className="absolute top-[609px] left-0 w-full h-[217px] object-cover pointer-events-none" alt="" aria-hidden="true" decoding="async" />

            <div className="relative mx-auto max-w-[360px] pt-11">
                <div className="relative px-[37px]">
                    <div className="inline-flex h-8 items-center px-2 rounded bg-[rgba(170,170,170,0.24)]">
                        <p className="font-manrope font-medium text-[16px] leading-5 tracking-[-0.16px] text-[rgba(38,38,38,0.72)]">Credit Card</p>
                    </div>
                    <h1 className="relative mt-[13.65px] font-ppfragment font-normal text-beige100 text-[25px] leading-[30px] tracking-[0.48px]">
                        ICICI Bank Coral Credit Card.<br/>Everyday benefits<br/>for your lifestyle
                        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/hero-underline-mobile.svg" width="107" height="9" className="absolute left-[2.5px] top-[89.5px] w-[107px] h-[9px]" alt="" aria-hidden="true" />
                    </h1>
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/hero-sparkle-mobile.svg" width="33" height="62" className="absolute right-[41px] top-[143px] w-[33px] h-[62px]" alt="" aria-hidden="true" />
                </div>

                <div className="relative mt-[27px] h-[257px]">
                    <div className="absolute left-[106px] top-[93px] w-[153px] h-[257px] bg-[rgba(255,255,255,0.19)] blur-[49px]" aria-hidden="true"></div>
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/hero-cards-mobile.png" width="360" height="304" className="absolute top-0 left-0 w-[360px] max-w-none h-[304px] [mask-image:linear-gradient(to_right,transparent_0%,#000_4%,#000_96%,transparent_100%)]" loading="eager" fetchpriority="high" decoding="async" alt="ICICI Bank Coral RuPay RuPay and Mastercard credit cards with partner brand icons" />
                </div>

                <div className="relative flex items-start justify-center gap-[6px] px-[18px]">
                        <div className="flex flex-col items-center text-center w-[73px]">
        <p className="font-ppfragment cc-revamp-teal-text leading-none text-[36.4px] tracking-[-1.09px] leading-[44px]">50%</p>
        <p className="font-manrope font-medium text-lightConentSecondary opacity-80 text-[12.1px] leading-[18px]">Reward Points on</p>
        <p className="font-manrope font-semibold text-beige100 text-[14.1px] leading-[17px] tracking-[-0.14px]">eligible retail spends</p>
    </div>
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/star-4pt.svg" width="10" height="10" className="w-[10px] h-[10px] mt-[19px] shrink-0" alt="" aria-hidden="true" />
                        <div className="flex flex-col items-center text-center w-[98px]">
        <p className="font-ppfragment cc-revamp-teal-text leading-none text-[36.4px] tracking-[-1.09px] leading-[44px]">25%</p>
        <p className="font-manrope font-medium text-lightConentSecondary opacity-80 text-[12.1px] leading-[18px]">Reward Points on</p>
        <p className="font-manrope font-semibold text-beige100 text-[14.1px] leading-[17px] tracking-[-0.14px]">eligible travel bookings</p>
    </div>
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/star-4pt.svg" width="10" height="10" className="w-[10px] h-[10px] mt-[19px] shrink-0" alt="" aria-hidden="true" />
                        <div className="flex flex-col items-center text-center w-[100px]">
        <p className="font-ppfragment cc-revamp-teal-text leading-none text-[36.4px] tracking-[-1.09px] leading-[44px]">5%</p>
        <p className="font-manrope font-medium text-lightConentSecondary opacity-80 text-[12.1px] leading-[18px]">Reward Points on</p>
        <p className="font-manrope font-semibold text-beige100 text-[14.1px] leading-[17px] tracking-[-0.14px]">eligible spends</p>
    </div>
                </div>

                <div className="relative mt-[28px] flex flex-col items-center gap-1">
                    <p className="font-manrope font-medium text-beige100 text-[10px] leading-[22px] tracking-[3.4px] uppercase">Limited period offer</p>
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/star-divider-mobile.svg" width="360" height="8" className="w-[360px] max-w-none h-2" alt="" aria-hidden="true" />
                    <p className="font-ppfragment font-light text-[#444] text-[26.5px] leading-[33px] tracking-[-0.74px]">Lifetime free</p>
                    <p className="font-ppfragment whitespace-nowrap">
                        <span className="line-through text-[18.7px] text-[rgba(227,110,100,0.44)]">₹999</span>
                        <span className="text-[35px] tracking-[-1.75px] text-lightBgAccentTertiary">₹0</span>
                        <span className="text-[25px] text-lightBgAccentTertiary">joining fee</span>
                    </p>
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/star-divider-mobile.svg" width="360" height="8" className="w-[360px] max-w-none h-2" alt="" aria-hidden="true" />
                </div>

                <div className="relative mt-[19px] flex justify-center">
                    <a href={applyHref} className="flex items-center justify-center w-[200px] h-9 rounded bg-lightBgAccentAltPrimary">
                        <span className="font-manrope font-semibold text-lightConentInverseInteractive text-[12px] leading-[15px] tracking-[-0.14px]">Apply now</span>
                    </a>
                </div>
                <p className="relative mx-auto mt-[14px] w-[288px] pb-[31px] text-center font-manrope text-[8px] leading-[14.6px] text-beige100">T&amp;C apply. Reward Points and card benefits are subject to eligible spends, card variant and ICICI Bank terms.</p>
            </div>

            <div className="relative flex h-9 items-center justify-center gap-[6px] bg-lightBgAccentTertiary px-2 backdrop-blur-[2px]">
                <div className="flex items-center gap-[2.6px]">
                    <span className="font-manrope text-[8px] leading-3 text-[#d7d7d7] whitespace-nowrap">Crafted for</span>
                    <img src="/assets/images/edge-website/icons/upi.svg" width="35" height="9" className="h-[9px] w-auto" alt="UPI" />
                </div>
                <span className="w-px h-2.5 lg:h-4 bg-white opacity-30" aria-hidden="true"></span>
                <div className="flex items-center gap-[2.6px]">
                    <span className="font-manrope text-[8px] leading-3 text-[#d7d7d7] whitespace-nowrap">Powered by</span>
                    <img src="/assets/images/edge-website/rupay-logo.png" width="45" height="12" className="h-3 w-auto" alt="RuPay" />
                    <span className="font-manrope text-[8px] leading-3 text-[#d7d7d7]">&amp;</span>
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/logo-mastercard.svg" width="19" height="11" className="h-[11px] w-auto" alt="Mastercard" />
                </div>
                <span className="w-px h-2.5 lg:h-4 bg-white opacity-30" aria-hidden="true"></span>
                <div className="flex items-center gap-1">
                    <span className="font-manrope text-[8px] leading-3 text-[#d7d7d7] whitespace-nowrap">Issued By</span>
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/logo-csb.png" width="42" height="14" className="h-[14px] w-auto" alt="CSB Bank" />
                </div>
            </div>
        </div>

        <div className="hidden lg:block relative h-[790px]">
            <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/hero-glow.svg" width="739" height="790" className="absolute left-[calc(50%-19px)] top-0 w-[739px] h-[790px] max-w-none pointer-events-none" alt="" aria-hidden="true" />
            <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/hero-cards.png" width="1001" height="504" className="absolute left-[calc(50%-281px)] top-[165px] w-[1001px] h-[504px] max-w-none [mask-image:linear-gradient(to_right,transparent_0%,#000_30%)]" loading="eager" fetchpriority="high" decoding="async" alt="ICICI Bank Coral RuPay RuPay and Mastercard credit cards with partner brand icons" />

            <div className="absolute left-[calc(50%+142px)] top-[602px] w-[486px] flex flex-col items-center">
                <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/star-divider.svg" width="486" height="13" className="w-[486px] h-[13px]" alt="" aria-hidden="true" />
                <p className="mt-[17px] font-ppfragment font-light text-[35.7px] leading-[35.6px] tracking-[-0.8px] text-[#408d7f]">Lifetime free</p>
                <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/star-divider.svg" width="486" height="13" className="mt-[9px] w-[486px] h-[13px]" alt="" aria-hidden="true" />
            </div>

            <div className="relative mx-auto max-w-[1024px] px-8 xl:px-0 pt-11">
                <div className="flex flex-col gap-6 w-[544px]">
                    <div className="inline-flex self-start h-8 items-center px-2 rounded bg-[rgba(170,170,170,0.24)]">
                        <p className="font-manrope font-medium text-[16px] leading-5 tracking-[-0.16px] text-[rgba(38,38,38,0.72)]">Credit Card</p>
                    </div>
                    <p className="w-[731px] font-ppfragment font-normal text-beige100 text-[44px] leading-[58px] tracking-[0.48px]">ICICI Bank Coral Credit Card.<br/>Everyday privileges, made simple..</p>

                    <div className="flex flex-col gap-[42px]">
                        <div className="flex items-start gap-[14px]">
                                <div className="flex flex-col items-center text-center w-[122px]">
        <p className="font-ppfragment cc-revamp-teal-text leading-none text-[60.8px] tracking-[-1.82px] leading-[86px]">50%</p>
        <p className="font-manrope font-medium text-lightConentSecondary opacity-80 text-[20.2px] leading-[30px]">Reward Points on</p>
        <p className="font-manrope font-semibold text-beige100 text-[23.6px] leading-[28px] tracking-[-0.24px]">eligible retail spends</p>
    </div>
                            <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/star-4pt.svg" width="18" height="18" className="w-[18px] h-[18px] mt-[34px] shrink-0" alt="" aria-hidden="true" />
                                <div className="flex flex-col items-center text-center w-[177px]">
        <p className="font-ppfragment cc-revamp-teal-text leading-none text-[60.8px] tracking-[-1.82px] leading-[86px]">25%</p>
        <p className="font-manrope font-medium text-lightConentSecondary opacity-80 text-[20.2px] leading-[30px]">Reward Points on</p>
        <p className="font-manrope font-semibold text-beige100 text-[23.6px] leading-[28px] tracking-[-0.24px]">Travel benefits</p>
    </div>
                            <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/star-4pt.svg" width="18" height="18" className="w-[18px] h-[18px] mt-[34px] shrink-0" alt="" aria-hidden="true" />
                                <div className="flex flex-col items-center text-center w-[184px]">
        <p className="font-ppfragment cc-revamp-teal-text leading-none text-[60.8px] tracking-[-1.82px] leading-[86px]">5%</p>
        <p className="font-manrope font-medium text-lightConentSecondary opacity-80 text-[20.2px] leading-[30px]">Reward Points on</p>
        <p className="font-manrope font-semibold text-beige100 text-[23.6px] leading-[28px] tracking-[-0.24px]">eligible spends</p>
    </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-manrope font-medium text-beige100 text-[16px] leading-[35px] tracking-[5.5px] uppercase">Limited period offer</p>
                            <p className="font-ppfragment whitespace-nowrap">
                                <span className="line-through text-[23px] leading-[38px] text-[rgba(227,110,100,0.44)]">₹999</span>
                                <span className="text-[43px] leading-[47.6px] tracking-[-2.15px] text-lightBgAccentTertiary">₹0</span>
                                <span className="text-[30.7px] leading-[38px] text-lightBgAccentTertiary">joining fee</span>
                            </p>
                        </div>
                    </div>

                    <a href={applyHref} className="flex items-center justify-center w-[200px] h-12 rounded bg-lightBgAccentAltPrimary">
                        <span className="font-manrope font-semibold text-white text-[16px] leading-5 tracking-[-0.16px]">Apply Now</span>
                    </a>
                </div>

                <div className="mt-[44px] flex items-center gap-[25px]">
                    <div className="flex items-center gap-[5px]">
                        <span className="font-manrope text-[10px] leading-[14.6px] text-beige100 whitespace-nowrap">Issued By</span>
                        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/logo-csb.png" width="63" height="21" className="w-[63px] h-[21px]" alt="CSB Bank" />
                    </div>
                    <p className="font-manrope text-[8px] leading-[14.6px] text-beige100">T&amp;C apply. Reward Points and card benefits are subject to eligible spends, card variant and ICICI Bank terms.</p>
                </div>
            </div>

            <div className="absolute left-0 right-0 top-[750px] h-10 flex items-center justify-center gap-[9px] bg-lightBgAccentTertiary backdrop-blur-[2px]">
                <div className="flex items-center gap-[4px]">
                    <span className="font-manrope text-[11.7px] leading-[17.5px] text-white whitespace-nowrap">Crafted for</span>
                    <img src="/assets/images/edge-website/icons/upi.svg" width="51" height="13" className="h-[13px] w-auto" alt="UPI" />
                </div>
                <span className="w-px h-2.5 lg:h-4 bg-white opacity-30" aria-hidden="true"></span>
                <div className="flex items-center gap-[4px]">
                    <span className="font-manrope text-[11.7px] leading-[17.5px] text-white whitespace-nowrap">Powered by</span>
                    <img src="/assets/images/edge-website/rupay-logo.png" width="67" height="18" className="h-[18px] w-auto" alt="RuPay" />
                    <span className="font-manrope text-[11.7px] leading-[17.5px] text-white">&amp;</span>
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/logo-mastercard.svg" width="28" height="17" className="h-[17px] w-auto" alt="Mastercard" />
                </div>
            </div>
        </div>
    </section>


    <section className="bg-bgSecondaryA">
        <div className="max-w-7xl mx-auto pt-14 pb-12 px-4 md:px-8">

            <div className="w-full h-auto px-5 flex md:justify-center">
  <div className="flex flex-col md:items-center">
    <h2
      className="relative w-fit font-ppfragment font-normal text-lightConentInverseInteractive md:text-center
        headingM md:headingL mb-5"
    >
      <p><span className="text-lightBgAccentTertiary">Everyday benefits.</span><br/><span
                    className="text-beige100">For your everyday spending.</span></p>
    </h2>



  </div>
</div>
            <div ref={carRef}
        className="flex flex-col md:flex-row items-center w-full transform ease duration-500 md:overflow-x-auto mt-4 md:mt-8 gap-4 px-5"
        onMouseDown={carPause} onMouseOver={carPause} onMouseUp={carResume} onMouseLeave={carResume}
        onTouchStart={carPause} onTouchEnd={carResume} onTouchCancel={carResume}
               
               >
                <div className="flex-shrink-0 w-[312px] md:flex-1">
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/reward-shopping.png" width="312" height="462"
                        loading="lazy" decoding="async" alt="Earn 2 Reward Points per ₹100 on eligible retail spends" className="w-full h-auto rounded-lg" />
                </div>
                <div className="flex-shrink-0 w-[312px] md:flex-1">
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/reward-travel.png" width="312" height="462"
                        loading="lazy" decoding="async" alt="Movie offers, eligible lounge access and milestone rewards"
                        className="w-full h-auto rounded-lg" />
                </div>
                <div className="flex-shrink-0 w-[312px] md:flex-1">
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/reward-upi.png" width="312" height="462"
                        loading="lazy" decoding="async" alt="Earn 1 Reward Point per ₹100 on eligible utility and insurance spends"
                        className="w-full h-auto rounded-lg" />
                </div>
            </div>

            <div className="mt-9">
                <p className="font-ppfragment font-normal text-beige100 headingM mb-6 md:text-center">+ More Benefits</p>
                <div
                    className="flex overflow-x-auto gap-4 md:flex-wrap md:justify-center md:items-stretch snap-x snap-mandatory md:overflow-visible pb-2 md:pb-0 no-scrollbar">
                    <div
                        className="w-[220px] h-[250px] flex-shrink-0 snap-start rounded-xl p-5 flex flex-col items-center gap-3 bg-white shadow-[0_0_7.2px_rgba(0,0,0,0.15)] hover:bg-lightBgAccentTertiary group transition-colors duration-300">
                        <p className="font-manrope font-bold text-gunMetal100 bodyL group-hover:text-white">Flexible payment options
                            EMI</p>
                        <p
                            className="font-manrope font-normal text-lightConentSecondary bodySm text-center group-hover:text-white/80">
                            Convert eligible purchases into EMIs at applicable interest rates and charges.</p>
                        <img src="/assets/images/website-v2/l1-pages/credit-card/pay-later-with-emi.svg"
                            className="w-[88px] h-[88px] mt-auto" loading="lazy" decoding="async" alt="Pay later with EMI icon" />
                    </div>
                    <div
                        className="w-[220px] h-[250px] flex-shrink-0 snap-start rounded-xl p-5 flex flex-col items-center gap-3 bg-white shadow-[0_0_7.2px_rgba(0,0,0,0.15)] hover:bg-lightBgAccentTertiary group transition-colors duration-300">
                        <p className="font-manrope font-bold text-gunMetal100 bodyL group-hover:text-white">Credit Limit
                            Limit</p>
                        <p
                            className="font-manrope font-normal text-lightConentSecondary bodySm text-center group-hover:text-white/80">
                            Credit limit as approved by ICICI Bank.</p>
                        <img src="/assets/images/website-v2/l1-pages/credit-card/credit-limit.png"
                            className="w-[88px] h-[88px] mt-auto" loading="lazy" decoding="async" alt="ICICI Bank Coral Credit Card" />
                    </div>
                    <div
                        className="w-[220px] h-[250px] flex-shrink-0 snap-start rounded-xl p-5 flex flex-col items-center gap-3 bg-white shadow-[0_0_7.2px_rgba(0,0,0,0.15)] hover:bg-lightBgAccentTertiary group transition-colors duration-300">
                        <p className="font-manrope font-bold text-gunMetal100 bodyL group-hover:text-white">Spend Tracking
                            insights</p>
                        <p
                            className="font-manrope font-normal text-lightConentSecondary bodySm text-center group-hover:text-white/80">
                            Track all your spends and get reminders so you never miss a bill payment</p>
                        <img src="/assets/images/website-v2/l1-pages/credit-card/insights.svg"
                            className="w-[88px] h-[88px] mt-auto" loading="lazy" decoding="async" alt="Spending insights icon" />
                    </div>
                    <div
                        className="w-[220px] h-[250px] flex-shrink-0 snap-start rounded-xl p-5 flex flex-col items-center gap-3 bg-white shadow-[0_0_7.2px_rgba(0,0,0,0.15)] hover:bg-lightBgAccentTertiary group transition-colors duration-300">
                        <p className="font-manrope font-bold text-gunMetal100 bodyL group-hover:text-white">Fuel Benefits</p>
                        <p
                            className="font-manrope font-normal text-lightConentSecondary bodySm text-center group-hover:text-white/80">
                            Get 1% fuel surcharge waiver on eligible HPCL fuel transactions of ₹400–₹4,000.</p>
                        <img src="/assets/images/website-v2/l1-pages/credit-card/save-on-fuel.svg"
                            className="w-[88px] h-[88px] mt-auto" loading="lazy" decoding="async" alt="Save on fuel icon" />
                    </div>
                    <div
                        className="w-[220px] h-[250px] flex-shrink-0 snap-start rounded-xl p-5 flex flex-col items-center gap-3 bg-white shadow-[0_0_7.2px_rgba(0,0,0,0.15)] hover:bg-lightBgAccentTertiary group transition-colors duration-300">
                        <p className="font-manrope font-bold text-gunMetal100 bodyL group-hover:text-white">Reward Points
                        </p>
                        <p
                            className="font-manrope font-normal text-lightConentSecondary bodySm text-center group-hover:text-white/80">
                            Redeem Reward Points for eligible catalogue items as per the Bank’s terms.</p>
                        <img src="/assets/images/website-v2/l1-pages/credit-card/jewels-icon.svg"
                            className="w-[88px] h-[88px] mt-auto" loading="lazy" decoding="async" alt="Reward Points icon" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="relative overflow-hidden cc-revamp-mc-bg">
        <div className="hidden lg:block pointer-events-none" aria-hidden="true">
            <span className="cc-revamp-diamond left-[-46px] top-[73px]"></span>
            <span className="cc-revamp-diamond left-[-19px] top-[133px]"></span>
            <span className="cc-revamp-diamond left-[-62px] top-[177px]"></span>
            <span className="cc-revamp-diamond left-[-89px] top-[117px]"></span>
            <span className="cc-revamp-diamond right-[-55px] bottom-[90px]"></span>
            <span className="cc-revamp-diamond right-[-82px] bottom-[30px]"></span>
            <span className="cc-revamp-diamond right-[-38px] bottom-[-14px]"></span>
            <span className="cc-revamp-diamond right-[-11px] bottom-[47px]"></span>
        </div>

        <div className="lg:hidden relative mx-auto max-w-[361px] px-7 pt-10 pb-10 flex flex-col items-center">
            <h2 className="w-[305px] text-center font-ppfragment font-normal text-lightConentInverseInteractive text-[27px] leading-[30px] tracking-[0.48px]">
                Explore the ICICI Bank RuPay credit card range <span className="text-[#2ecd7b]">ICICI Bank Coral Credit Card</span>
            </h2>
            <div className="mt-[6px] w-[305px] h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0)_100%)]" aria-hidden="true"></div>
            <p className="mt-[20px] w-[331px] text-center font-manrope text-white text-[16px] leading-[26px]">
                Get a <span className="font-semibold cc-revamp-gold-text">free add-on card</span> to get extraordinary travel rewards and benefits
            </p>
            <div className="mt-[18px]">
                    <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>
            <span className="font-manrope text-white whitespace-nowrap text-[12px] leading-4 tracking-[-0.12px]">RuPay network acceptance</span>
        </div>
        <span className="w-1 h-1 rounded-full bg-[#2ecd7b]" aria-hidden="true"></span>
        <div className="flex items-center gap-1">
            <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/icon-no-paperwork.svg" width="24" height="24" className="w-4 h-4" alt="" aria-hidden="true" />
            <span className="font-manrope text-white whitespace-nowrap text-[12px] leading-4 tracking-[-0.12px]">Subject to credit assessment</span>
        </div>
    </div>
            </div>
            <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-card-mobile.png" width="284" height="310" className="mt-6 w-[284px] h-[310px]" loading="lazy" decoding="async" alt="ICICI Bank Coral RuPay Mastercard credit card" />
            <div className="mt-[60px] flex flex-col items-center gap-[22px]">
                    <div className="flex flex-col items-center gap-[17px] w-[154px]">
        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-jewels.png" width="130" height="130" className="w-[130px] h-[130px]" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <p className="font-manrope font-semibold text-white text-center text-[21.7px] leading-[29px] tracking-[-0.16px]">2 Reward Points per ₹100 on eligible retail spends</p>
    </div>
                    <div className="flex flex-col items-center gap-[17px] w-[154px]">
        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-flight-cover.png" width="130" height="130" className="w-[130px] h-[130px]" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <p className="font-manrope font-semibold text-white text-center text-[21.7px] leading-[29px] tracking-[-0.16px]">Personal accident cover on RuPay variant</p>
    </div>
                    <div className="flex flex-col items-center gap-[17px] w-[154px]">
        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-airport.png" width="130" height="130" className="w-[130px] h-[130px]" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <p className="font-manrope font-semibold text-white text-center text-[21.7px] leading-[29px] tracking-[-0.16px]">Eligible lounge access</p>
    </div>
                    <div className="flex flex-col items-center gap-[17px] w-[154px]">
        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-forex.png" width="130" height="130" className="w-[130px] h-[130px]" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <p className="font-manrope font-semibold text-white text-center text-[21.7px] leading-[29px] tracking-[-0.16px]">Forex markup: 3.5%</p>
    </div>
            </div>
        </div>

        <div className="hidden lg:flex relative mx-auto max-w-[1240px] px-8 xl:px-0 pt-11 pb-[84px] flex-col items-center gap-[65px]">
            <div className="flex items-end gap-[38px] w-full justify-center">
                <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-card.png" width="483" height="610" className="w-[483px] h-auto shrink-0" loading="lazy" decoding="async" alt="ICICI Bank Coral RuPay Mastercard credit card" />
                <div className="w-[718px] flex flex-col items-center gap-8">
                    <div className="flex flex-col items-center gap-[62px]">
                        <div className="w-[626px] flex flex-col items-center gap-[42px]">
                            <div className="flex flex-col items-center gap-[7px]">
                                <h2 className="w-[626px] text-center font-ppfragment font-normal text-lightConentInverseInteractive text-[53px] leading-[62px] tracking-[0.48px]">
                                    Explore the ICICI Bank RuPay credit card range <span className="text-[#2ecd7b]">ICICI Bank Coral Credit Card</span>
                                </h2>
                                <div className="w-[500px] h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0)_100%)]" aria-hidden="true"></div>
                            </div>
                            <p className="w-[500px] text-center font-manrope text-white text-[26px] leading-[1.38]">
                                Get a <span className="font-semibold cc-revamp-gold-text">free add-on card</span> to get extraordinary travel rewards and benefits
                            </p>
                        </div>
                        <div className="flex items-start gap-[34px]">
                                <div className="flex flex-col items-center gap-[17px] w-[154px]">
        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-jewels.png" width="130" height="130" className="w-[130px] h-[130px]" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <p className="font-manrope font-semibold text-white text-center text-[21.7px] leading-[29px] tracking-[-0.16px]">2 Reward Points per ₹100 on eligible retail spends</p>
    </div>
                                <div className="flex flex-col items-center gap-[17px] w-[154px]">
        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-flight-cover.webp" width="130" height="130" className="w-[130px] h-[130px]" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <p className="font-manrope font-semibold text-white text-center text-[21.7px] leading-[29px] tracking-[-0.16px]">Personal accident cover on RuPay variant</p>
    </div>
                                <div className="flex flex-col items-center gap-[17px] w-[154px]">
        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-airport.webp" width="130" height="130" className="w-[130px] h-[130px]" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <p className="font-manrope font-semibold text-white text-center text-[21.7px] leading-[29px] tracking-[-0.16px]">Eligible lounge access</p>
    </div>
                                <div className="flex flex-col items-center gap-[17px] w-[154px]">
        <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/mc-forex.webp" width="130" height="130" className="w-[130px] h-[130px]" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <p className="font-manrope font-semibold text-white text-center text-[21.7px] leading-[29px] tracking-[-0.16px]">Forex markup: 3.5%</p>
    </div>
                        </div>
                    </div>
                        <div className="flex items-center justify-center gap-[12.5px]">
        <div className="flex items-center gap-[6px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" className="w-6 h-6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>
            <span className="font-manrope text-white whitespace-nowrap text-[18.75px] leading-[25px] tracking-[-0.19px]">RuPay network acceptance</span>
        </div>
        <span className="w-[6px] h-[6px] rounded-full bg-[#2ecd7b]" aria-hidden="true"></span>
        <div className="flex items-center gap-[6px]">
            <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/icon-no-paperwork.svg" width="24" height="24" className="w-6 h-6" alt="" aria-hidden="true" />
            <span className="font-manrope text-white whitespace-nowrap text-[18.75px] leading-[25px] tracking-[-0.19px]">Subject to credit assessment</span>
        </div>
    </div>
                </div>
            </div>
        </div>
    </section>


    <section className="bg-white py-12 md:py-20">
        <div className="md:max-w-7xl max-w-md mx-auto px-4 md:px-8">
            <h2
                className="font-ppfragment font-normal text-4xl md:text-5xl mb-10 md:mb-14 text-left md:text-center leading-tight">
                <span className="text-[#404247]">Apply online,</span><br/><span className="text-[#357065]">Start using your
                    card instantly.</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-5 md:gap-6 mb-8 md:mb-12">
                <div className="flex-1 flex flex-col gap-4 p-6 border border-[#D4CEBD] rounded-xl bg-white">
                    <p
                        className="font-ppfragment font-normal text-[#357065] text-[32px] md:text-[40px] leading-tight text-center">
                        Eligibility</p>
                    <p className="font-manrope font-normal text-[#404247] text-sm md:text-base text-center">Basic eligibility includes Indian citizenship, age and income criteria. Final approval is at the Bank’s discretion.</p>
                    <hr className="border-t border-[#D4CEBD] -mx-6" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4 pb-4">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                <img src="/assets/images/personal-loan/pl-elig-nationality.svg" width="24" height="24"
                                    decoding="async" alt="Pl Elig Nationality icon" />
                            </div>
                            <p className="font-manrope font-normal text-[#626160] text-base">Indian citizen, generally 21–65 years of age.</p>
                        </div>
                        <hr className="border-t border-[#D4CEBD]" />
                        <div className="flex items-center gap-4 py-4">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                <img src="/assets/images/personal-loan/pl-elig-age.svg" width="24" height="24"
                                    decoding="async" alt="Pl Elig Age icon" />
                            </div>
                            <p className="font-manrope font-normal text-[#626160] text-base">Salaried applicants: monthly income of ₹20,000 (indicative).</p>
                        </div>
                        <hr className="border-t border-[#D4CEBD]" />
                        <div className="flex items-center gap-4 pt-4">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                <img src="/assets/images/personal-loan/pl-elig-employment.svg" width="24" height="24"
                                    decoding="async" alt="Pl Elig Employment icon" />
                            </div>
                            <p className="font-manrope font-normal text-[#626160] text-base">Self-employed applicants: annual income of ₹2,40,000 (indicative); credit assessment applies.</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-4 p-6 border border-[#D4CEBD] rounded-xl bg-white">
                    <p
                        className="font-ppfragment font-normal text-[#357065] text-[32px] md:text-[40px] leading-tight text-center">
                        Documents</p>
                    <p className="font-manrope font-normal text-[#404247] text-sm md:text-base text-center">All you need is
                        your phone and basic identification—no physical paperwork required.</p>
                    <hr className="border-t border-[#D4CEBD] -mx-6" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4 pb-4">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                <img src="/assets/images/personal-loan/pl-doc-pan.svg" width="24" height="24"
                                    decoding="async" alt="Pl Doc Pan icon" />
                            </div>
                            <p className="font-manrope font-normal text-[#626160] text-base">Identity/Address: PAN or
                                Aadhaar Card</p>
                        </div>
                        <hr className="border-t border-[#D4CEBD]" />
                        <div className="flex items-center gap-4 py-4">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                <img src="/assets/images/personal-loan/pl-doc-income.svg" width="24" height="24"
                                    decoding="async" alt="Pl Doc Income icon" />
                            </div>
                            <p className="font-manrope font-normal text-[#626160] text-base">Income: Digital salary slips or
                                bank statements.</p>
                        </div>
                        <hr className="border-t border-[#D4CEBD]" />
                        <div className="flex items-center gap-4 pt-4">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                <img src="/assets/images/personal-loan/pl-doc-selfie.svg" width="24" height="24"
                                    decoding="async" alt="Pl Doc Selfie icon" />
                            </div>
                            <p className="font-manrope font-normal text-[#626160] text-base">Verification: One quick digital
                                selfie.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <a href={applyHref}
                    target="_blank">
                    <div className="px-4 py-3 bg-[#e26d63] rounded font-manrope font-bold text-base w-max text-white">Apply
                        Now</div>
                </a>
            </div>
        </div>
    </section>

    <section className="bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto py-14 md:py-[86px] px-4 md:px-8">

            <h2
                className="font-ppfragment font-normal text-center mb-10 md:mb-12 text-[28px] md:text-[48px] leading-tight md:leading-[1.2] tracking-[-0.48px]">
                <span className="block text-[#357065]">Fees and charges.</span>
                <span className="block text-[#404247]">Review the applicable fees before applying.</span>
            </h2>

            <div className="bg-white rounded-[13px] border border-[#ccc2ae] overflow-hidden mx-auto max-w-[1003px]">

                <div className="flex items-end px-6 md:px-8 pt-6 md:pt-9 pb-3 md:pb-5 border-b border-[#E5E3DE]">
                    <p className="font-ppfragment font-normal text-[#404247] text-[18px] md:text-[32px] w-[45%]">Fee type
                    </p>
                    <div className="hidden md:block w-[120px]"></div>
                    <p className="font-ppfragment font-normal text-[#357065] text-[18px] md:text-[32px] flex-1">Your charge
                    </p>
                </div>

                <div className="flex flex-col divide-y divide-[#E5E3DE] px-6 md:px-8">

                    <div className="flex items-center py-5 md:py-7">
                        <div className="flex items-center gap-3 md:gap-5 w-[45%]">
                            <img src="/assets/images/website-v2/l1-pages/credit-card/fee-icon-joining.svg"
                                className="w-10 h-10 md:w-12 md:h-12 shrink-0" loading="lazy" decoding="async" alt="Joining fee icon" />
                            <p className="font-manrope font-light text-[#313130] text-[13px] md:text-[20px]">Joining Fee</p>
                        </div>
                        <div className="flex items-center gap-0 w-[40px] md:w-[120px] justify-center">
                            <svg width="42" height="28" viewBox="0 0 42 28" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2l10 12L2 26" stroke="#e36e64" strokeOpacity="0.25" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 2l10 12-10 12" stroke="#e36e64" strokeOpacity="0.6" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M26 2l10 12-10 12" stroke="#e36e64" strokeOpacity="1" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-1 flex items-baseline gap-2 flex-wrap">
                            <span className="font-manrope font-semibold text-[#313130] text-[15px] md:text-[22px]">₹0</span>
                            <span className="font-manrope font-normal text-[#888] text-[11px] md:text-[14px]">(Limited
                                Period Offer; regular ₹999)</span>
                        </div>
                    </div>

                    <div className="flex items-center py-5 md:py-7">
                        <div className="flex items-center gap-3 md:gap-5 w-[45%]">
                            <img src="/assets/images/website-v2/l1-pages/credit-card/fee-icon-annual.svg"
                                className="w-10 h-10 md:w-12 md:h-12 shrink-0" loading="lazy" decoding="async" alt="Annual fee icon" />
                            <p className="font-manrope font-light text-[#313130] text-[13px] md:text-[20px]">Annual Fee</p>
                        </div>
                        <div className="flex items-center gap-0 w-[40px] md:w-[120px] justify-center">
                            <svg width="42" height="28" viewBox="0 0 42 28" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2l10 12L2 26" stroke="#e36e64" strokeOpacity="0.25" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 2l10 12-10 12" stroke="#e36e64" strokeOpacity="0.6" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M26 2l10 12-10 12" stroke="#e36e64" strokeOpacity="1" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-manrope font-semibold text-[18px] md:text-[28px]"
                                style={{background: 'linear-gradient(135deg, #f0786c, #bf4a3e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                                Lifetime Free</p>
                        </div>
                    </div>

                    <div className="flex items-center py-5 md:py-7">
                        <div className="flex items-center gap-3 md:gap-5 w-[45%]">
                            <svg className="w-10 h-10 md:w-12 md:h-12 shrink-0" viewBox="0 0 48 48" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="24" cy="24" r="16" stroke="#505b65" strokeWidth="1.5" />
                                <path d="M24 14v2M24 32v2M14 24h2M32 24h2" stroke="#505b65" strokeWidth="1.5"
                                    strokeLinecap="round" />
                                <path d="M17 17l1.5 1.5M29.5 29.5l1.5 1.5M17 31l1.5-1.5M29.5 18.5l1.5-1.5"
                                    stroke="#505b65" strokeWidth="1.3" strokeLinecap="round" />
                                <circle cx="24" cy="24" r="4" stroke="#505b65" strokeWidth="1.4" />
                                <path d="M21 30l6-12" stroke="#e36e64" strokeWidth="1.4" strokeLinecap="round" />
                                <circle cx="20" cy="30" r="1.5" fill="#e36e64" />
                                <circle cx="28" cy="18" r="1.5" fill="#e36e64" />
                            </svg>
                            <p className="font-manrope font-light text-[#313130] text-[13px] md:text-[18px]">Interest Rate
                                (EMI)</p>
                        </div>
                        <div className="flex items-center gap-0 w-[40px] md:w-[120px] justify-center">
                            <svg width="42" height="28" viewBox="0 0 42 28" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2l10 12L2 26" stroke="#e36e64" strokeOpacity="0.25" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 2l10 12-10 12" stroke="#e36e64" strokeOpacity="0.6" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M26 2l10 12-10 12" stroke="#e36e64" strokeOpacity="1" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-1 flex items-baseline flex-wrap gap-1">
                            <span className="font-manrope font-normal text-[#313130] text-[13px] md:text-[18px]">Starts
                                at</span>
                            <span
                                className="font-manrope font-semibold text-[#e36e64] text-[15px] md:text-[22px]">1.33%</span>
                            <span className="font-manrope font-normal text-[#313130] text-[13px] md:text-[18px]">per
                                month</span>
                        </div>
                    </div>

                    <div className="flex items-center py-5 md:py-7">
                        <div className="flex items-center gap-3 md:gap-5 w-[45%]">
                            <svg className="w-10 h-10 md:w-12 md:h-12 shrink-0" viewBox="0 0 48 48" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <rect x="8" y="10" width="18" height="28" rx="3" stroke="#505b65" strokeWidth="1.5" />
                                <path d="M8 20h18" stroke="#505b65" strokeWidth="1.4" />
                                <path d="M26 16h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" stroke="#505b65" strokeWidth="1.4"
                                    strokeLinecap="round" />
                                <path d="M30 20v4" stroke="#505b65" strokeWidth="1.4" strokeLinecap="round" />
                                <path d="M26 30l4 6" stroke="#e36e64" strokeWidth="1.4" strokeLinecap="round" />
                                <circle cx="30" cy="37" r="2" stroke="#e36e64" strokeWidth="1.3" />
                                <path d="M13 25h8M13 30h5" stroke="#505b65" strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                            <p className="font-manrope font-light text-[#313130] text-[13px] md:text-[18px]">Fuel Surcharge
                            </p>
                        </div>
                        <div className="flex items-center gap-0 w-[40px] md:w-[120px] justify-center">
                            <svg width="42" height="28" viewBox="0 0 42 28" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2l10 12L2 26" stroke="#e36e64" strokeOpacity="0.25" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 2l10 12-10 12" stroke="#e36e64" strokeOpacity="0.6" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M26 2l10 12-10 12" stroke="#e36e64" strokeOpacity="1" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-manrope font-semibold text-[18px] md:text-[28px]"
                                style={{background: 'linear-gradient(135deg, #f0786c, #bf4a3e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                                1% Waiver on spends above ₹400</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <section className="bg-[#357065] py-12 md:py-20 relative overflow-hidden">
  <div
    className="absolute -top-4 -left-8 md:-top-5 md:-left-16 w-20 h-20 md:w-40 md:h-40 opacity-100 pointer-events-none z-0"
    aria-hidden="true">
    <img src="/assets/images/website-v2/jewel/decorative-shape.png" width="128" height="128" loading="lazy"
      decoding="async" alt="Decorative Shape" className="w-full h-full object-contain rotate-180" />
  </div>
  <div
    className="absolute -bottom-4 -right-8 md:-bottom-8 md:-right-16 w-20 h-20 md:w-40 md:h-40 opacity-100 pointer-events-none z-0"
    aria-hidden="true">
    <img src="/assets/images/website-v2/jewel/decorative-shape.png" width="128" height="128" loading="lazy"
      decoding="async" alt="Decorative Shape" className="w-full h-full object-contain" />
  </div>

  <div className="md:max-w-7xl max-w-md mx-auto px-4 md:px-8 relative z-10">

    <h2
      className="font-ppfragment font-normal text-white text-[32px] md:text-5xl text-left md:text-center w-full mb-3 md:mb-4">
      <span className="block md:inline leading-tight">Why Coral is a practical choice for</span>
      <span className="block md:inline leading-tight">everyday spends and privileges</span>
    </h2>
    <p className="font-manrope font-normal text-white text-base md:text-xl text-left md:text-center w-full mb-8 md:mb-10">
      The ICICI Bank Coral Credit Card is designed for everyday use, with Reward Points on eligible retail, utility and insurance spends, movie ticket offers, a fuel surcharge waiver and eligible lounge privileges. Earn 2 Reward Points per ₹100 on retail spends and 1 Reward Point per ₹100 on utility and insurance spends. Redemption is subject to the Bank’s catalogue and terms.
    </p>

    <div className="bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-3xl p-6 md:p-10">
      <p className="font-manrope font-semibold text-white text-lg md:text-2xl text-center mb-5 md:mb-6">
        Reward Points redemption
      </p>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8 mb-5 md:mb-6">

        <div className="md:hidden flex flex-row justify-start gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src="/assets/images/website-v2/jewel/flights.svg" width="16" height="16" loading="lazy"
                decoding="async" alt="Flights icon" className="flex-shrink-0" />
              <p className="font-manrope font-normal text-white text-base">Flights</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/images/website-v2/jewel/miles.svg" width="16" height="16" loading="lazy"
                decoding="async" alt="Miles icon" className="flex-shrink-0" />
              <p className="font-manrope font-normal text-white text-base">Miles</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/images/website-v2/jewel/insurance.svg" width="16" height="16" loading="lazy"
                decoding="async" alt="Insurance icon" className="flex-shrink-0" />
              <p className="font-manrope font-normal text-white text-base">Insurance</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src="/assets/images/website-v2/jewel/vouchers.svg" width="16" height="16" loading="lazy"
                decoding="async" alt="Vouchers icon" className="flex-shrink-0" />
              <p className="font-manrope font-normal text-white text-base">Vouchers</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/images/website-v2/jewel/digital-gold.svg" width="16" height="16" loading="lazy"
                decoding="async" alt="Digital gold icon" className="flex-shrink-0" />
              <p className="font-manrope font-normal text-white text-base">Digital Gold</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/images/website-v2/jewel/emi-store.svg" width="16" height="16" loading="lazy"
                decoding="async" alt="EMI store icon" className="flex-shrink-0" />
              <p className="font-manrope font-normal text-white text-base">Emi Store</p>
            </div>
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-8">
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/flights.svg" width="24" height="24" loading="lazy"
              decoding="async" alt="Flights icon" className="flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-2xl">Flights</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/miles.svg" width="24" height="24" loading="lazy" decoding="async"
              alt="Miles icon" className="flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-2xl">Miles</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/vouchers.svg" width="24" height="24" loading="lazy"
              decoding="async" alt="Vouchers icon" className="flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-2xl">Vouchers</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/digital-gold.svg" width="24" height="24" loading="lazy"
              decoding="async" alt="Digital gold icon" className="flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-2xl">Digital Gold</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/insurance.svg" width="24" height="24" loading="lazy"
              decoding="async" alt="Insurance icon" className="flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-2xl">Insurance</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/emi-store.svg" width="24" height="24" loading="lazy"
              decoding="async" alt="EMI store icon" className="flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-2xl">Emi Store</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 md:gap-2 md:shrink-0 flex-nowrap">
          <span className="font-ppfragment font-normal text-white text-[40px] md:text-[60px] leading-none">100</span>
          <img src="/assets/images/website-v2/jewel/jewel-gem.png" width="54" height="54" loading="lazy"
            decoding="async" alt="Jewel gem icon" className="w-9 h-9 md:w-[54px] md:h-[54px] flex-shrink-0 align-middle -mt-2" />
          <span className="font-manrope font-normal text-white/50 text-[34px] md:text-[50px] leading-none mx-1">=</span>
          <span className="font-ppfragment font-normal text-white text-[40px] md:text-[60px] leading-none">₹20</span>
        </div>
      </div>

      <div className="w-full h-px bg-white/30 mb-5 md:mb-6" aria-hidden="true"></div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">

        <div className="md:hidden grid grid-cols-2 gap-x-6 gap-y-3 justify-start">
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/bill-discounts.svg" width="16" height="16" loading="lazy"
              decoding="async" alt="Bill discounts icon" className="flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-base">Bill Discounts</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/cash.svg" width="16" height="16" loading="lazy" decoding="async"
              alt="Cash icon" className="flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-base">Cash</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/credit-card.svg" width="16" height="16" loading="lazy"
              decoding="async" alt="Credit card icon" className="flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-base">Credit Card Bills</p>
          </div>
        </div>

        <div className="hidden md:flex md:flex-row md:items-center md:justify-start md:gap-6">
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/bill-discounts.svg" width="24" height="24" loading="lazy"
              decoding="async" alt="Bill discounts icon" className="w-6 h-6 flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-2xl">Bill Discounts</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/cash.svg" width="24" height="24" loading="lazy" decoding="async"
              alt="Cash icon" className="w-6 h-6 flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-2xl">Cash</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/website-v2/jewel/credit-card.svg" width="24" height="24" loading="lazy"
              decoding="async" alt="Credit card icon" className="w-6 h-6 flex-shrink-0" />
            <p className="font-manrope font-normal text-white text-2xl">Credit Card Bills</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 md:gap-2 md:shrink-0 flex-nowrap">
          <span className="font-ppfragment font-normal text-white text-[40px] md:text-[60px] leading-none">100</span>
          <img src="/assets/images/website-v2/jewel/jewel-gem.png" width="54" height="54" loading="lazy"
            decoding="async" alt="Jewel gem icon" className="w-9 h-9 md:w-[54px] md:h-[54px] flex-shrink-0 align-middle -mt-2" />
          <span className="font-manrope font-normal text-white/50 text-[34px] md:text-[50px] leading-none mx-1">=</span>
          <span className="font-ppfragment font-normal text-white text-[40px] md:text-[60px] leading-none">₹14</span>
        </div>
      </div>
    </div>

    <p className="mt-5 text-center"
      style={{color: 'rgba(255,255,255,0.80)', fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 400, lineHeight: '32.5px', letterSpacing: '-0.449px'}}>
      Redeem through ICICI Bank’s available reward channels
    </p>

  </div>
</section>
    <section className="bg-white">
        <div className="max-w-7xl mx-auto py-14 md:py-20 px-4 md:px-8">

            <h2 className="font-ppfragment font-normal text-darkBgSecondaryB headingM md:headingXl md:leading-[57.6px] mb-10 text-left md:text-center">
                Joined by over<br/><span className="text-lightBgAccentTertiary md:text-darkBgSecondaryB">30 Lakh+ Indians</span>
            </h2>

            <div className="w-full mt-6 overflow-x-auto flex gap-8 px-5 md:justify-center">
    <div className="relative">
      <div className="relative relative h-[250px] flex-shrink-0 w-max">

        <div className="absolute top-0 left-0 w-full h-full relative z-[1] h-[250px]">
          <img
            src="/assets/images/website-v2/testimonial-bg.svg"
            width="262"
            height="250"
            loading="lazy"
            decoding="async" alt="Testimonial Bg icon" />
        </div>

        <div className="w-full h-auto rounded-2xl card-slide absolute top-0 left-0 z-10 p-6">

          <div className="flex justify-between items-center mb-9">

            <div>
              <img
                src="/assets/images/website-v2/qoute-white.svg"
                className="mb-6"
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
                alt="qoute-icon"
              />
              <p className="w-full font-manrope font-bold text-white bodyM">
                “The Coral card brings useful movie and fuel benefits together for my everyday spending.”
              </p>

            </div>

          </div>

        </div>

      </div>
      <div className="flex items-center absolute bottom-0">
        <img
          src="/assets/images/website-v2/testimonial-user-1.svg"
          className="mr-4"
          width="35"
          height="35"
          loading="lazy"
          decoding="async" alt="Testimonial User 1 icon" />
        <div>
          <p className="w-full font-manrope font-normal text-black bodySm">Sakshi Mehta</p>
          <p className="w-full font-manrope font-normal text-black bodyXs">Engineer</p>
        </div>
      </div>
    </div>
    <div className="relative">
      <div className="relative relative h-[250px] flex-shrink-0 w-max">

        <div className="absolute top-0 left-0 w-full h-full relative z-[1] h-[250px]">
          <img
            src="/assets/images/website-v2/testimonial-bg.svg"
            width="262"
            height="250"
            loading="lazy"
            decoding="async" alt="Testimonial Bg icon" />
        </div>

        <div className="w-full h-auto rounded-2xl card-slide absolute top-0 left-0 z-10 p-6">

          <div className="flex justify-between items-center mb-9">

            <div>
              <img
                src="/assets/images/website-v2/qoute-white.svg"
                className="mb-6"
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
                alt="qoute-icon"
              />
              <p className="w-full font-manrope font-bold text-white bodyM">
                “I like having reward points and eligible lounge access on one card.”
              </p>

            </div>

          </div>

        </div>

      </div>
      <div className="flex items-center absolute bottom-0">
        <img
          src="/assets/images/website-v2/testimonial-user-2.svg"
          className="mr-4"
          width="35"
          height="35"
          loading="lazy"
          decoding="async" alt="Testimonial User 2 icon" />
        <div>
          <p className="w-full font-manrope font-normal text-black bodySm">Siddharth Jain</p>
          <p className="w-full font-manrope font-normal text-black bodyXs">Architect</p>
        </div>
      </div>
    </div>
    <div className="relative">
      <div className="relative relative h-[250px] flex-shrink-0 w-max">

        <div className="absolute top-0 left-0 w-full h-full relative z-[1] h-[250px]">
          <img
            src="/assets/images/website-v2/testimonial-bg.svg"
            width="262"
            height="250"
            loading="lazy"
            decoding="async" alt="Testimonial Bg icon" />
        </div>

        <div className="w-full h-auto rounded-2xl card-slide absolute top-0 left-0 z-10 p-6">

          <div className="flex justify-between items-center mb-9">

            <div>
              <img
                src="/assets/images/website-v2/qoute-white.svg"
                className="mb-6"
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
                alt="qoute-icon"
              />
              <p className="w-full font-manrope font-bold text-white bodyM">
                “The movie offers and fuel surcharge waiver are useful for my regular expenses.”
              </p>

            </div>

          </div>

        </div>

      </div>
      <div className="flex items-center absolute bottom-0">
        <img
          src="/assets/images/website-v2/testimonial-user-3.svg"
          className="mr-4"
          width="35"
          height="35"
          loading="lazy"
          decoding="async" alt="Testimonial User 3 icon" />
        <div>
          <p className="w-full font-manrope font-normal text-black bodySm">Nikhil Chopra</p>
          <p className="w-full font-manrope font-normal text-black bodyXs">Consultant</p>
        </div>
      </div>
    </div>
</div>
        </div>
    </section>


    <section className="bg-lightBgPrimaryA">
        <div className="max-w-7xl mx-auto py-14 md:py-20 px-4 md:px-8">
            <div className="flex flex-col items-start md:items-center text-left md:text-center gap-4 mb-8 md:mb-16">
                <h2 className="font-ppfragment font-normal text-gunMetal80 headingM md:headingXl leading-tight">
                    Get your ICICI Bank Coral Credit Card. <span className="text-lightBgAccentTertiary">Apply online.</span>
                </h2>
            </div>

            <div className="flex overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory md:justify-center gap-4 -mx-4 px-4 md:mx-0 md:px-0 mb-10 md:mb-14">
                <div className="relative w-[312px] h-[486px] rounded-2xl overflow-hidden flex-shrink-0 snap-start">
                    <img src="/assets/images/website-v2/l1-pages/credit-card/apply-phone-download.png"
                        className="w-full h-full object-cover" loading="lazy" decoding="async"
                        alt="Visit ICICI Bank" />
                </div>
                <div className="relative w-[312px] h-[486px] rounded-2xl overflow-hidden flex-shrink-0 snap-start">
                    <img src="/assets/images/website-v2/l1-pages/credit-card/revamp/step-apply.webp"
                        className="w-full h-full object-cover" loading="lazy" decoding="async"
                        alt="Apply for credit card" />
                </div>
                <div className="relative w-[312px] h-[486px] rounded-2xl overflow-hidden flex-shrink-0 snap-start">
                    <img src="/assets/images/website-v2/l1-pages/credit-card/apply-phone-kyc.png"
                        className="w-full h-full object-cover" loading="lazy" decoding="async" alt="Complete KYC" />
                </div>
            </div>

            <div className="flex justify-center">
                <a
                    href={applyHref}>
                    <div className="px-6 py-3.5 bg-lightBgAccentAltPrimary rounded w-max">
                        <p className="text-white font-manrope font-bold bodyM tracking-[-0.16px]">Apply Now</p>
                    </div>
                </a>
            </div>
        </div>
    </section>


    <section className="bg-lightBgPrimaryB mt-10 mb-10">
  <div className="md:max-w-7xl max-w-md mx-auto px-4 md:px-8">

    <h2 className="font-ppfragment font-normal text-3xl md:text-[40px] text-[#30302f] mb-8 md:mb-12 text-center">
      Latest from  <span className="text-[#357065]">the blog</span>
    </h2>

    <div className="w-full mt-6 overflow-x-auto flex gap-6 px-5 md:justify-center md:overflow-visible">

        <a href={applyHref} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer">
          <div className="border border-[#0000002E] rounded-lg overflow-hidden h-[320px] flex flex-col bg-white hover:shadow-lg transition-shadow duration-300">

            <div className="p-4 flex-1 flex flex-col">
                <span className="inline-block self-start font-manrope font-semibold text-[12px] text-[#357065] bg-[#EAF1F0] rounded px-3 py-1 mb-4 text-center">
                  Credit Card
                </span>

              <div className="flex-1">
                <h3 className="font-manrope font-medium text-[18px] leading-[24px] text-[#30302f] line-clamp-2 min-h-[48px]">
                  8 Best RuPay Fuel Credit Cards in India 2026
                </h3>
                  <p className="font-manrope font-normal text-[14px] leading-[20px] text-[#61605f] mt-3 line-clamp-2 min-h-[40px]">
                    Are you tired of the hassle of carrying cash or juggling multiple cards...
                  </p>
              </div>

                <div className="flex items-center pt-4 mt-auto">
                  <img src="/assets/images/website-v2/blog/blog-logo.svg" width="20" height="20" alt="Blog publication logo" className="w-5 h-5 mr-2" loading="lazy" decoding="async" />
                  <p className="font-manrope font-medium text-xs text-[#30302f]">
                    Priyanka Rao
                  </p>
                </div>
            </div>

          </div>
        </a>

        <a href={applyHref} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer">
          <div className="border border-[#0000002E] rounded-lg overflow-hidden h-[320px] flex flex-col bg-white hover:shadow-lg transition-shadow duration-300">

            <div className="p-4 flex-1 flex flex-col">
                <span className="inline-block self-start font-manrope font-semibold text-[12px] text-[#357065] bg-[#EAF1F0] rounded px-3 py-1 mb-4 text-center">
                  Credit Card
                </span>

              <div className="flex-1">
                <h3 className="font-manrope font-medium text-[18px] leading-[24px] text-[#30302f] line-clamp-2 min-h-[48px]">
                  15 Best Airport Lounge Access Credit Cards in India
                </h3>
                  <p className="font-manrope font-normal text-[14px] leading-[20px] text-[#61605f] mt-3 line-clamp-2 min-h-[40px]">
                    Credit cards provide various advantages that can make...
                  </p>
              </div>

                <div className="flex items-center pt-4 mt-auto">
                  <img src="/assets/images/website-v2/blog/blog-logo.svg" width="20" height="20" alt="Blog publication logo" className="w-5 h-5 mr-2" loading="lazy" decoding="async" />
                  <p className="font-manrope font-medium text-xs text-[#30302f]">
                    Priyanka Rao
                  </p>
                </div>
            </div>

          </div>
        </a>

        <a href={applyHref} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer">
          <div className="border border-[#0000002E] rounded-lg overflow-hidden h-[320px] flex flex-col bg-white hover:shadow-lg transition-shadow duration-300">

            <div className="p-4 flex-1 flex flex-col">
                <span className="inline-block self-start font-manrope font-semibold text-[12px] text-[#357065] bg-[#EAF1F0] rounded px-3 py-1 mb-4 text-center">
                  Credit Card
                </span>

              <div className="flex-1">
                <h3 className="font-manrope font-medium text-[18px] leading-[24px] text-[#30302f] line-clamp-2 min-h-[48px]">
                  How to Get Credit Card Without CIBIL Score?
                </h3>
                  <p className="font-manrope font-normal text-[14px] leading-[20px] text-[#61605f] mt-3 line-clamp-2 min-h-[40px]">
                    No CIBIL score? No problem! You might think that securing a credit card is impossible...
                  </p>
              </div>

                <div className="flex items-center pt-4 mt-auto">
                  <img src="/assets/images/website-v2/blog/blog-logo.svg" width="20" height="20" alt="Blog publication logo" className="w-5 h-5 mr-2" loading="lazy" decoding="async" />
                  <p className="font-manrope font-medium text-xs text-[#30302f]">
                    Priyanka Rao
                  </p>
                </div>
            </div>

          </div>
        </a>

    </div>

      <div className="flex w-full md:w-[1200px] h-12 md:px-[500px] justify-center items-start flex-shrink-0 mt-10 mx-auto">
        <a href={applyHref} target="_blank" rel="noopener noreferrer">
          <div className="px-8 py-3 bg-[#e36e64] rounded-lg font-manrope font-semibold text-white text-base">
            Read more
          </div>
        </a>
      </div>

  </div>
</section>


    <section className="bg-gunMetal80">
  <div className="md:max-w-7xl max-w-md mx-auto py-6 md:py-12">
    <div className="px-5 md:px-0">
      <div className="flex justify-between md:justify-center md:gap-32 mb-2">
        <div className="md:mr-32">
          <p className="font-ppfragment text-lightConentInverseInteractive headingM mb-4">
            Got
            <br />
            questions?

          </p>

          <p className="font-manrope font-extralight text-lightConentInverseInteractive bodySm mb-4">
            Our dedicated support team is available on <br /> 9 AM to 7 PM from Monday to Friday and 10 AM to 7 PM on weekends to help.
          </p>
          <a href={applyHref}>
            <div
              className="w-full hidden md:block px-4 py-2 ml-0 bg-[#f5f6f5] text-grey90 rounded font-manrope font-semibold bodyM text-center"
            >
              Contact us
            </div>
          </a>
        </div>
        <div>
         <img
            src="/assets/images/website-v2/help-vector.svg"
            width="128"
            height="128"
            loading="lazy"
            decoding="async"
            alt="help-vector"
          />
        </div>

      </div>
      <a href={applyHref}>
        <div
          className="md:hidden w-full px-4 py-2 ml-0 bg-[#f5f6f5] text-grey90 rounded font-manrope font-semibold bodyM text-center"
        >
          Contact us
        </div>
      </a>
    </div>
  </div>
</section>
    <section className="bg-white">
        <div className="max-w-7xl mx-auto py-14 md:py-20 px-4 md:px-8">
            <div className="px-4 md:px-0">
  <h2 className="w-full font-manrope font-semibold text-beige100 headingXs mb-6">
    Frequently Asked Questions
  </h2>
  <div className="border border-[#2B2D331F] rounded">

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f0' ? setOpenFaq(null) : setOpenFaq('f0')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">What benefits are available on the ICICI Bank Coral Credit Card?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f0' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f0' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">The Coral Credit Card offers Reward Points on eligible spends, BookMyShow and INOX movie offers, a fuel surcharge waiver at eligible HPCL pumps, milestone rewards and eligible lounge access. Benefits are subject to spend criteria, card variant and terms and conditions.</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f1' ? setOpenFaq(null) : setOpenFaq('f1')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">What are the joining and annual fees for the Coral Credit Card?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f1' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f1' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">The joining fee is ₹500 + GST and the annual fee is ₹500 + GST. Spend more than ₹1.5 lakh in the applicable year to qualify for an annual fee waiver for the next year, as per the Bank’s terms.</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f2' ? setOpenFaq(null) : setOpenFaq('f2')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">How many Reward Points can I earn on purchases?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f2' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f2' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">Earn 2 Reward Points for every ₹100 spent on eligible retail transactions and 1 Reward Point for every ₹100 spent on eligible utility and insurance transactions. Eligible categories and exclusions are governed by the Bank’s terms and conditions.</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f3' ? setOpenFaq(null) : setOpenFaq('f3')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">What are the key Coral Credit Card benefits?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f3' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f3' ? '' : ' hidden')}>
          <ul className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM list-disc pl-5 space-y-2">
          <li><span className="font-semibold">RuPay:</span> Earn 2 Reward Points per ₹100 on eligible retail spends and 1 Reward Point per ₹100 on eligible utility and insurance spends. Movie, lounge and milestone offers have separate eligibility criteria.</li>
          <li><span className="font-semibold">Mastercard:</span> 25% Reward Points on flights and hotels booked via the app, and 5% Reward Points on every other eligible spend.</li>
          </ul>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM mt-2">Other benefits include 25% off up to ₹100 on eligible INOX movie tickets twice a month, 1% fuel surcharge waiver on eligible HPCL transactions of ₹400–₹4,000, and milestone Reward Points. Refer to the official offer terms for current eligibility and caps.</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f4' ? setOpenFaq(null) : setOpenFaq('f4')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">What are the fees and finance charges?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f4' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f4' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">The Coral card has a 3.5% forex markup. Finance charges and cash advance interest are listed at 3.75% per month on the product page; late payment charges range from ₹100 to ₹1,300. Other fees and exclusions are detailed in the Most Important Terms and Conditions (MITC).</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f5' ? setOpenFaq(null) : setOpenFaq('f5')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">How can I apply for the ICICI Bank Coral Credit Card?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f5' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f5' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">Visit ICICI Bank to check your eligibility instantly. The application is 100% digital and requires no physical paperwork.</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f6' ? setOpenFaq(null) : setOpenFaq('f6')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">What are the Coral Credit Card milestone benefits?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f6' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f6' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">You can earn 25% Reward Points on eligible travel bookings and 5% Reward Points on eligible spends. For accelerated categories, you can earn up to ₹2,000 monthly on shopping (10% rate), ₹1,000 on travel (5% rate).</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f7' ? setOpenFaq(null) : setOpenFaq('f7')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">How are Reward Points earned and redeemed?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f7' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f7' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">Reward Points are credited to your ICICI Bank Credit Card account as per the applicable reward programme. Redeem points through the Bank’s available reward channels, subject to terms.</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f8' ? setOpenFaq(null) : setOpenFaq('f8')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">Which ICICI Bank cards are available on the RuPay network?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f8' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f8' ? '' : ' hidden')}>
          <ul className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM list-disc pl-5">
          <li><span className="font-semibold">ICICI Bank RuPay credit cards:</span> Coral, Rubyx, Sapphiro, HPCL Super Saver and MakeMyTrip variants (features vary by card)</li>
          <li><span className="font-semibold">Coral benefits:</span> movie offers, eligible lounge access, fuel surcharge waiver and milestone rewards</li>
          <li><span className="font-semibold">Other RuPay variants:</span> Rubyx, Sapphiro, HPCL Super Saver and MakeMyTrip offer different lifestyle, travel or fuel-related features.</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f9' ? setOpenFaq(null) : setOpenFaq('f9')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">Is the Coral Credit Card lifetime free?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f9' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f9' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">No. The Coral Credit Card has a joining fee of ₹500 + GST and an annual fee of ₹500 + GST. The annual fee may be waived on eligible annual spends above ₹1.5 lakh.</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f10' ? setOpenFaq(null) : setOpenFaq('f10')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">Can I get an add-on card for a family member?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f10' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f10' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">Visit ICICI Bank to check your eligibility. The application is 100% digital and needs no physical paperwork. The ICICI Bank Coral Credit Card is an add-on for existing RuPay cardholders, and there’s no separate application or credit check. It has its own card number but shares your RuPay card’s credit limit, a single bill and a single statement.</p>
        </div>
      </div>
    </div>

    <div className="faq-item border-b border-[#2B2D331F]">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f11' ? setOpenFaq(null) : setOpenFaq('f11')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">What travel benefits does the ICICI Bank Coral Credit Card offer?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f11' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f11' ? '' : ' hidden')}>
          <ul className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM list-disc pl-5">
          <li>The Coral card has 3.5% forex markup on applicable international transactions.</li>
          <li>Personal accident cover on RuPay variant on domestic and international flights</li>
          <li>Railway lounge access: complimentary visits are available as per the card’s current quarterly entitlement and lounge terms.</li>
          <li>25% Reward Points on flights and hotels booked via the app</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="faq-item">
      <div className="p-4 md:p-6">
        <div onClick={() => openFaq === 'f12' ? setOpenFaq(null) : setOpenFaq('f12')} className="faq-header flex justify-between cursor-pointer">
          <span className="w-full font-manrope font-semibold text-beige100 bodySm md:bodyM">Can I use my Coral RuPay Credit Card for UPI payments?</span>
          <img src="/assets/images/website-v2/down-chevron-black.svg" className={"faq-chevron w-[24px] h-[24px]" + (openFaq === 'f12' ? ' rotate-180' : '')} alt="Toggle FAQ" />
        </div>
        <div className={"faq-answer mt-2" + (openFaq === 'f12' ? '' : ' hidden')}>
          <p className="w-full font-manrope font-normal text-beige80 bodyXs md:bodyM">Yes. Both cards draw on the same credit limit and are billed together. Use RuPay for UPI payments and get 50% Reward Points on our shopping partner brands, and Mastercard for international spends and travel bookings. If you close your RuPay card, your Mastercard add-on closes with it.</p>
        </div>
      </div>
    </div>

  </div>
</div>
        </div>
    </section>


    <div id="footer">
  <footer>

    <div className="container pt-4 flex justify-center px-5">
      <div className="w-full bg-[#E36E64] rounded-md px-4 py-6 md:p-16 relative z-10 flex flex-col items-center">
        <div className="w-full text-center font-ppfragment font-normal text-lightConentInverseInteractive headingM mb-4">
          Money app
          <br className="md:hidden" />
          for the life
          <br className="md:hidden" />
          you're building.
        </div>

        <p className="relative text-center font-thin text-lightConentInverseInteractive bodySm mb-6">
          Visit ICICI Bank on iOS or Android.
          <br />
          Join 30 Lakh+ Indians managing their money
          <br className="md:hidden" />
          better everyday.
        </p>
        <a href={applyHref} target="_blank" className="w-max">
          <div
            className="w-max ml-0 px-4 py-3 bg-[#101112] text-lightConentInverseInteractive rounded font-manrope font-semibold bodySm mb-8">
            ICICI Bank
          </div>
        </a>
        <div className="flex justify-between">
          <div className="bg-[#FFFFFF1A] rounded py-5 md:px-5 flex w-full md:w-max">
            <div className="border-r border-[#F5F6F53D] text-center md:pr-5 w-1/2 md:w-max">
              <p className="text-white text-3xl tracking-[-6%]">4.7
                <span className="text-white text-lg">/</span>
                <span className="text-white text-xl tracking-[-6%]">5</span>
              </p>
              <div className="flex flex-col items-center">
                <img src="/assets/images/website-v2/app-store-rating.svg" className="mb-4 mt-2" width="70" height="15"
                  loading="lazy" decoding="async" alt="ratings-stars" />
                <p className="bodySm text-lightConentInverseInteractive font-thin">On the App
                  <br />
                  Store
                </p>
              </div>
            </div>
            <div className="text-center md:pl-5 w-1/2 md:w-max">
              <p className="text-white text-3xl tracking-[-6%]">4.4
                <span className="text-white text-lg">/</span>
                <span className="text-white text-xl tracking-[-6%]">5</span>
              </p>
              <div className="flex flex-col items-center">
                <img src="/assets/images/website-v2/play-store-rating.svg" className="mb-4 mt-2" width="69" height="15"
                  loading="lazy" decoding="async" alt="ratings-stars" />
                <p className="bodySm text-lightConentInverseInteractive font-thin">On the Play
                  <br />
                  Store
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#FFFFFF1A] rounded py-5 px-5 w-max hidden md:flex items-center">
            <img src="/assets/images/website-v2/download-qr-code.svg" width="109" height="110" loading="lazy"
              decoding="async" alt="qr-code" />
            <p className="bodyL text-white ml-4">Scan to <br /> download</p>
          </div>
        </div>
      </div>
    </div>

   
  </footer>
</div>

   </main>



    

    {/* Facebook Pixel Code */}
    
    
    {/* End Facebook Pixel Code */}
    {/* LinkedIn Pixel Code (deferred until after page load) */}
    
    
    {/* End LinkedIn Pixel Code */}
    {/* Google Tag Manager */}
    
    {/* End Google Tag Manager */}
    
  
</div>
  );
}
