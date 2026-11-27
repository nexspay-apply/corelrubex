import { useEffect } from 'react';

/* Legal pages for the credit card application site.
   All values in [SQUARE BRACKETS] are placeholders — search for "[" in this
   file and replace them with your real details before going live. */

function Shell({ title, updated, id, children }) {
  useEffect(() => {
    document.title = `${title} | Credit Card Application`;
    window.scrollTo(0, 0);
  }, [title]);
  return (
    <div className="wrap legal">
      {id ? <span id={id} /> : null}
      <div className="l-doc">
        <div className="l-top">
          <h1>{title}</h1>
          <p className="l-meta">Last updated: {updated}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <Shell title="Privacy Policy" updated="[DATE, e.g. 27 November 2026]">
      <p>
        This Privacy Policy explains how <b>[COMPANY NAME]</b> (“we”, “us”, “our”) collects, uses and
        protects the information you provide when you use this website to enquire about and apply for
        credit card products. By submitting the credit card application form on this website, you
        agree to the collection and use of your information as described here.
      </p>

      <h2>1. Information we collect</h2>
      <p>When you fill in the application form, we ask for and store:</p>
      <ul>
        <li><b>Personal details:</b> full name, mobile number, email address, age group, city, PIN code, employment status and income range.</li>
        <li><b>Details of your current card:</b> issuing bank, card variant, card network, the <b>last 4 digits</b> of the card, name printed on the card, how long you have held it, approximate credit limit, and whether you have had late payments in the last 12 months.</li>
        <li><b>Your needs:</b> the card you are interested in, expected monthly spend, benefits that matter to you, preferred language and preferred call time.</li>
        <li><b>Technical data:</b> your IP address, device type, browser (user agent) and approximate country, used for security, fraud prevention and service improvement. This data is collected automatically when you visit the site.</li>
        <li><b>Campaign data:</b> if you arrived via a paid link, the source of that link (for example utm_source / utm_campaign), used to measure campaigns.</li>
        <li><b>Consent records:</b> the confirmations you tick in the form, including your consent to be contacted.</li>
      </ul>
      <p>
        <b>We never ask for your full card number, expiry date, CVV, card PIN, OTP or any password.</b>
        If anyone claiming to represent us asks for these by phone or message, it is not us — do not share them.
      </p>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To have our advisor contact you about your application and guide you to the official bank application channel.</li>
        <li>To compare your profile with card eligibility criteria so the advisor can suggest the right option.</li>
        <li>To respond to your queries and resolve complaints, including through our Grievance Redressal process (see section 9).</li>
        <li>To detect, prevent and investigate fraud, abuse or security incidents on the website.</li>
        <li>To measure and improve the website, including with advertising pixels operated by third parties (for example Meta or Google) where we enable them.</li>
      </ul>

      <h2>3. How we store your information</h2>
      <p>
        Your information is stored in a secure database (Supabase) and is protected in transit using
        TLS/HTTPS and at rest using the provider’s encryption. We do not sell or rent your personal
        information to anyone. Your details are shared with a bank only when you proceed with the
        official application on that bank’s own channel — we do not hand over your full details to
        banks automatically.
      </p>

      <h2>4. Retention</h2>
      <p>
        We keep application records for [RETENTION PERIOD, e.g. 24 months] or longer if required by
        law, after which they are deleted or anonymised.
      </p>

      <h2>5. Your choices and rights</h2>
      <ul>
        <li>You may withdraw contact consent at any time by telling us on the contact details below.</li>
        <li>You may ask us to confirm what data we hold about you, correct it, or delete it. Send the request to <b>[SUPPORT EMAIL]</b> with your application reference (for example CW-XXXXXXXX).</li>
        <li>Disabling cookies or advertising pixels on your browser may affect how the site and our tracking work for you.</li>
      </ul>

      <h2>6. Cookies and pixels</h2>
      <p>
        We may use essential cookies and session storage to keep your progress while you fill the
        form. We may also load advertising pixels (Meta, Google, LinkedIn or similar) that set
        cookies; these vendors’ own privacy policies apply to the data they collect.
      </p>

      <h2>7. Children</h2>
      <p>This service is for adults who hold a credit card in their own name. We do not knowingly collect information from children under 18.</p>

      <h2>8. Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect your data. However, no
        method of transmission over the internet is 100% secure. Please do not share your OTP, PIN,
        CVV or full card number with anyone — we will never ask for them.
      </p>

      <h2>9. Grievance redressal</h2>
      <p id="grievance">
        If you have any complaint about how we handle your information, contact our Grievance
        Officer:
      </p>
      <ul>
        <li><b>Name:</b> [GRIEVANCE OFFICER NAME]</li>
        <li><b>Email:</b> [GRIEVANCE EMAIL]</li>
        <li><b>Phone:</b> [GRIEVANCE PHONE] (weekdays [TIMING, e.g. 10 am – 6 pm])</li>
        <li><b>Address:</b> [COMPANY ADDRESS]</li>
      </ul>
      <p>We will acknowledge your grievance within [48 hours] and aim to resolve it within [30 days].</p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The updated version will be posted on this page
        with a revised “Last updated” date. Please check periodically.
      </p>

      <h2>11. Contact us</h2>
      <p>
        For any privacy question, write to <b>[SUPPORT EMAIL]</b> or call <b>[SUPPORT PHONE]</b>.
        Registered office: [COMPANY ADDRESS].
      </p>
    </Shell>
  );
}

export function Terms() {
  return (
    <Shell title="Terms &amp; Conditions" updated="[DATE, e.g. 27 November 2026]" id="terms">
      <p>
        These Terms &amp; Conditions (“Terms”) apply to your use of this website and its credit card
        application service operated by <b>[COMPANY NAME]</b>. By using this website or submitting the
        application form, you agree to these Terms. If you do not agree, do not use the service.
      </p>

      <h2>1. Nature of this service</h2>
      <ul>
        <li>This website is an <b>independent</b> credit card application assistance service. It is <b>not a bank</b> and is <b>not an official website</b> of ICICI Bank, CSB Bank, RuPay, Mastercard, Visa, American Express or Diners Club. All bank names, card names and trademarks belong to their respective owners.</li>
        <li>Submitting the form is <b>not</b> a credit card application with any bank and is <b>not</b> an approval or a promise of approval. It only lets our advisor contact you to guide you toward the official application channel of the bank you choose.</li>
        <li>Eligibility, credit limit, fees, benefits and final approval are decided <b>solely by the issuing bank</b>, at its discretion.</li>
      </ul>

      <h2>2. Indicative fees and benefits</h2>
      <p>
        Card fees, interest rates, reward points, offers and benefits shown on this website are
        indicative, drawn from issuer-published sources and may change without notice. They do not
        form part of any contract between you and us. Always confirm the current fees and terms from
        the bank’s official website before you apply.
      </p>

      <h2>3. Your responsibilities</h2>
      <ul>
        <li>Provide accurate, true and complete information. Incorrect information may delay or prevent assistance and may affect any bank’s decision.</li>
        <li>This application is for the <b>primary holder of an active credit card</b> in their own name. If you answer “No” to any eligibility question, the form closes for that session.</li>
        <li>Never share your full card number, CVV, PIN, OTP or passwords — with us, by phone, or by message. We will never ask for them.</li>
        <li>Complete the actual application only on the bank’s official channel (official app or website). No fee is payable to us for this service: [or state your fee here].</li>
      </ul>

      <h2>4. No obligation</h2>
      <p>
        We do not guarantee that any bank will approve your application, upgrade your card, or
        offer any specific benefit. Advisor calls are made during the time slot you choose, at our
        discretion.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        The content, design, layout and code of this website are owned by [COMPANY NAME] or its
        licensors and may not be copied, scraped or reused without written permission, except as
        required by law.
      </p>

      <h2>6. Acceptable use</h2>
      <ul>
        <li>You must not misuse the website, submit false information, attempt to break or overload it, or use it for any unlawful purpose.</li>
        <li>We may limit the number of applications from the same mobile number and may close access for abuse.</li>
      </ul>

      <h2>7. Third-party links</h2>
      <p>
        Where we link to a bank or partner website, we are not responsible for their content, fees,
        privacy practices or availability.
      </p>

      <h2>8. Liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for any indirect, incidental or
        consequential loss arising from your use of this service, including reliance on indicative
        card terms. Our total liability to you for any claim is limited to [LIMIT, e.g. the
        equivalent of ₹10,000 / “the value of services you received”]. This does not affect rights
        you cannot exclude under Indian law.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>We may update these Terms from time to time. The updated version will be posted on this page with a revised “Last updated” date.</p>

      <h2>10. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by the laws of India. Courts at [CITY, e.g. Bengaluru] shall have
        exclusive jurisdiction over any dispute, to the extent permitted by law.
      </p>

      <h2>11. Contact</h2>
      <p>
        <b>[COMPANY NAME]</b> · [COMPANY ADDRESS] · Email: [SUPPORT EMAIL] · Phone: [SUPPORT PHONE].
        Grievance Officer: [GRIEVANCE OFFICER NAME], [GRIEVANCE EMAIL] (details also on our Privacy Policy).
      </p>
    </Shell>
  );
}
