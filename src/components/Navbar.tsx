import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { navigate } from '@/lib/router';

type NavbarProps = {
  onSchedule: () => void;
};

const NAV_LINKS = [
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Calculadora', href: '#calculadora' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Preguntas', href: '#faq' },
  { label: 'Contacto', href: '#contacto' },
];

export function Navbar({ onSchedule }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const onHome = window.location.hash === '' || window.location.hash === '#/';
    if (!onHome) {
      navigate('/');
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.4s ease',
        background: scrolled ? 'rgba(250, 248, 245, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      }}
    >
      <nav className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        <button
          onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="mono" style={{ color: scrolled ? 'var(--ink)' : 'var(--paper)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em' }}>
            XIMNANZAS
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="nav-links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              style={{
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: scrolled ? 'var(--ink-soft)' : 'rgba(250,248,245,0.8)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onSchedule}
            className="button button-primary"
            style={{ padding: '10px 20px', fontSize: '0.82rem' }}
          >
            Agenda una cita <ArrowRight size={14} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="menu-toggle"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: scrolled ? 'var(--ink)' : 'var(--paper)' }}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu" style={{ display: 'none' }}>
          <div style={{ background: 'var(--paper)', padding: '16px 24px', borderBottom: '1px solid var(--line)' }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', fontSize: '0.9rem', fontWeight: 500, color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {link.label}
              </button>
            ))}
            <button onClick={() => { setOpen(false); onSchedule(); }} className="button button-primary" style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}>
              Agenda una cita
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
