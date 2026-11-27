import { Link } from 'react-router-dom';
import { CARDS } from '../data/cards.js';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="f-top">
          <div><p style={{ maxWidth: '36ch' }}><b>ICICI Bank Coral Credit Card</b> — independent credit card application service for existing cardholders in India.</p></div>
          <div><h4>Cards</h4><ul>{CARDS.map(c => <li key={c.id}><Link to={`/?card=${c.id}#cards`}>{c.name}</Link></li>)}</ul></div>
          <div><h4>Explore</h4><ul><li><Link to="/#finder">Card finder</Link></li><li><Link to="/#cards">All cards</Link></li><li><Link to="/#fees">Fees &amp; charges</Link></li><li><Link to="/apply">Apply now</Link></li></ul></div>
          <div><h4>Legal</h4><ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            <li><Link to="/privacy#grievance">Grievance contact</Link></li>
          </ul></div>
        </div>
        <div className="f-legal">
          <p>© {new Date().getFullYear()} [Your Company Name]. An independent credit card application and assistance service — <b>not a bank</b> and not an official ICICI Bank website. Bank names, card names and trademarks belong to their owners. Card availability, fees, benefits, eligibility and approval are decided solely by the issuing bank and may change. We never ask for your full card number, CVV, PIN, OTP or passwords. Read our <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms">Terms &amp; Conditions</Link> before applying. Grievance Officer: [Name] · [Email] · [Phone] · [Address]</p>
        </div>
      </div>
    </footer>
  );
}
