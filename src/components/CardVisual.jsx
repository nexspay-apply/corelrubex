export default function CardVisual({ card, last4 = '••••', style }) {
  return (
    <div className={`cv${card.metal ? ' metal' : ''}`} style={{ background: card.look, ...style }} aria-hidden="true">
      <div className="r"><span className="brand">CORAL CARD</span><span className="tier">{card.tier}</span></div>
      <span className="chip" />
      <div className="r" style={{ alignItems: 'flex-end' }}>
        <div><div className="nm">{card.name}</div><div className="num">•••• {last4}</div></div>
        <span className="net">{card.network.split(' ')[0]}</span>
      </div>
    </div>
  );
}
