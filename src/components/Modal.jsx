import { useEffect, useRef } from 'react';

export default function Modal({ title, onClose, children, footer, width }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined} tabIndex={-1} ref={ref} style={width ? { width: `min(${width}px,100%)` } : undefined}>
        <div className="modal-h"><h3>{title}</h3><button type="button" onClick={onClose} aria-label="Close">✕</button></div>
        <div className="modal-b">{children}</div>
        {footer && <div className="actions" style={{ margin: 0, padding: '14px 24px' }}>{footer}</div>}
      </div>
    </div>
  );
}
