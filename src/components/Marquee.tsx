import { motion } from 'framer-motion';

const PHRASES = [
  'Deduccion fiscal hasta el 100%',
  'Interes compuesto trabajando por ti',
  'Proteccion ante lo imprevisto',
  'Libertad financiera a tu alcance',
  'Familias protegidas, futuros construidos',
  'Asesoria sin costo, decisiones con proposito',
];

export function Marquee() {
  return (
    <section
      style={{
        background: 'var(--ink)',
        padding: '28px 0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
      data-testid="marquee"
      aria-label="Mensajes de marca"
    >
      <div style={{ position: 'relative', display: 'flex', overflow: 'hidden' }}>
        <motion.div
          style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: '48px', paddingRight: '48px' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...PHRASES, ...PHRASES].map((phrase, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
              <span className="serif" style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 'clamp(2rem, 3vw, 3.5rem)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.82)',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
                lineHeight: 1.1,
              }}>
                {phrase}
              </span>
              <span style={{ color: 'var(--amber)', fontSize: '1.3rem' }}>✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
