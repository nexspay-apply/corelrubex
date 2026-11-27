// Cardwise card catalogue (ICICI Bank premium range).
// Fees are indicative, from issuer-published pages when prepared (Nov 2026). Verify before going live.
export const PRIVILEGES = [
  { id: 'travel', label: 'Travel', icon: '✈' },
  { id: 'lounge', label: 'Lounges', icon: '🛋' },
  { id: 'dining', label: 'Dining', icon: '🍽' },
  { id: 'entertainment', label: 'Movies', icon: '🎬' },
  { id: 'fuel', label: 'Fuel', icon: '⛽' },
  { id: 'golf', label: 'Golf', icon: '⛳' },
  { id: 'upi', label: 'UPI', icon: '⚡' },
  { id: 'rewards', label: 'Rewards', icon: '★' }
];

export const CATEGORIES = [
  { id: 'all', label: 'All cards' },
  { id: 'super-premium', label: 'Super premium' },
  { id: 'premium', label: 'Premium' },
  { id: 'everyday', label: 'Everyday' },
  { id: 'rupay', label: 'RuPay · UPI' }
];

export const CARDS = [
  {
    id: 'emeralde', name: 'Emeralde Private Metal', category: 'super-premium', tier: 'Super premium',
    tagline: 'A metal card for frequent international travellers.',
    look: 'linear-gradient(135deg,#0c3a33 0%,#1d6b5c 45%,#0a2a25 100%)', metal: true, network: 'Visa',
    features: ['Airport lounge access in India and abroad, as per programme terms', 'Golf privileges at partner courses', 'Lower foreign currency markup than standard cards', 'Dedicated concierge assistance'],
    privileges: ['travel', 'lounge', 'golf', 'rewards', 'dining'],
    joining: '₹12,499 + GST', annual: '₹12,499 + GST', spend: 4
  },
  {
    id: 'sapphiro', name: 'Sapphiro', category: 'super-premium', tier: 'Super premium',
    tagline: 'Travel and lifestyle privileges with dual-network convenience.',
    look: 'linear-gradient(135deg,#0f1f4a 0%,#2b4a9a 50%,#0b1636 100%)', network: 'Mastercard + Amex',
    features: ['Welcome benefits from partner brands', 'Domestic and international lounge access on eligible spends', 'Complimentary golf rounds every month on eligible spends', 'Reward points on domestic and international spends'],
    privileges: ['travel', 'lounge', 'golf', 'entertainment', 'rewards'],
    joining: '₹6,500 + GST', annual: '₹3,500 + GST', spend: 3
  },
  {
    id: 'rubyx', name: 'Rubyx', category: 'premium', tier: 'Premium',
    tagline: 'Lifestyle privileges for higher everyday spenders.',
    look: 'linear-gradient(135deg,#3a0f1d 0%,#8a2240 50%,#2a0912 100%)', network: 'Mastercard + Amex',
    features: ['Welcome vouchers from select partner brands', 'Domestic airport and railway lounge access on eligible spends', 'Golf, movie offers and concierge support', 'Reward points on domestic and international spends'],
    privileges: ['lounge', 'entertainment', 'golf', 'rewards', 'dining'],
    joining: '₹3,000 + GST', annual: '₹2,000 + GST', spend: 2
  },
  {
    id: 'coral', name: 'Coral', category: 'everyday', tier: 'Everyday',
    tagline: 'Rewards on daily, dining and entertainment spends.',
    look: 'linear-gradient(135deg,#7a2e1c 0%,#d9663f 50%,#5a1f12 100%)', network: 'Visa / Mastercard',
    features: ['Movie ticket offers with partner platforms', 'Domestic airport lounge access after eligible quarterly spends', 'Fuel surcharge waiver on eligible transactions', 'Points on retail, utility and insurance spends'],
    privileges: ['entertainment', 'fuel', 'rewards', 'dining', 'lounge'],
    joining: '₹500 + GST', annual: '₹500 + GST', spend: 1
  },
  {
    id: 'rupay', name: 'Coral RuPay', category: 'rupay', tier: 'RuPay · UPI',
    tagline: 'Everyday rewards, plus UPI payments on your credit card.',
    look: 'linear-gradient(135deg,#14161c 0%,#3a3f4b 50%,#0c0d11 100%)', network: 'RuPay',
    features: ['Link to supported UPI apps and pay at UPI QR codes', 'Benefits follow the Coral card variant', 'Fuel surcharge waiver on eligible transactions', 'Merchant acceptance and UPI rules apply'],
    privileges: ['upi', 'fuel', 'entertainment', 'rewards'],
    joining: '₹500 + GST', annual: '₹500 + GST', spend: 1
  }
];

export const INTEREST_OPTIONS = [
  ...CARDS.map(c => ({ value: c.id, label: `ICICI Bank ${c.name}` })),
  { value: 'upgrade', label: 'Upgrade my current card' },
  { value: 'unsure', label: 'Not sure, need guidance' }
];
export const interestLabel = v => (v == null ? '' : INTEREST_OPTIONS.find(o => o.value === v)?.label || v);
