import { useEffect, useState } from 'react';
import { CalendarDays, Menu, X } from 'lucide-react';
import { navigate } from '@/lib/router';

type NavbarProps = {
  onSchedule: () => void;
  dark?: boolean;
};

const NAV_LINKS = [
  { label: 'Simulador', href: '#calculadora', testId: 'nav-simulator-link' },
  { label: 'La idea', href: '#beneficios', testId: 'nav-benefits-link' },
  { label: 'Testimonios', href: '#testimonios', testId: 'nav-testimonials-link' },
  { label: 'Ideas', href: '#ideas', testId: 'nav-ideas-link' },
  { label: 'Servicios', href: '#servicios', testId: 'nav-services-link' },
  { label: 'Preguntas', href: '#faq', testId: 'nav-faq-link' },
  { label: 'Contacto', href: '#contacto', testId: 'nav-contact-link' },
];

export function Navbar({ onSchedule, dark = false }: NavbarProps) {
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

  const solid = scrolled || !dark;

  return (
    <header
      data-testid="site-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.4s ease',
        borderRadius: '8px',
        background: solid ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(16px)',
        borderBottom: solid ? '1px solid var(--line)' : '1px solid rgba(255,255,255,0.2)',
        color: solid ? 'var(--ink)' : 'var(--paper)',
      }}
    >
      <nav className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '72px' }}>
        <button
          data-testid="header-logo-link"
          onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ padding: '4px 8px'}}>
            <img
              src="/XIMNANZAS.png"
              alt="XIMNANZAS, asesor patrimonial"
              data-testid="header-brand-logo"
              style={{ display: 'block', width: '68px', height: '48px', objectFit: 'contain' }}
            />
          </span>
          <span className="nav-brand-copy">
            <strong style={{ display: 'block', color: solid ? 'hsl(var(--secondary))' : 'var(--paper)', fontSize: '0.9rem', letterSpacing: '0.08em' }}>XIMNANZAS</strong>
            <small style={{ display: 'block', marginTop: '4px', color: solid ? 'var(--muted)' : 'rgba(250,248,245,0.7)', fontSize: '0.56rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Planeación que sí se cumple</small>
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="nav-links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              data-testid={link.testId}
              onClick={() => handleNav(link.href)}
              style={{
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: solid ? 'var(--ink-soft)' : 'rgba(250,248,245,0.8)',
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
            data-testid="header-agenda-button"
            onClick={onSchedule}
            className="button header-schedule-button"
            style={{ padding: '12px 20px', fontSize: '0.68rem', borderRadius: 0, background: solid ? 'hsl(var(--secondary))' : 'var(--paper)', color: solid ? 'hsl(var(--secondary-foreground))' : 'hsl(var(--secondary))', textTransform: 'uppercase', letterSpacing: '0.16em' }}
          >
            Agenda una charla <CalendarDays size={15} />
          </button>
          <button
            data-testid="header-menu-button"
            onClick={() => setOpen(!open)}
            className="menu-toggle"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: solid ? 'var(--ink)' : 'var(--paper)' }}
            aria-label="Abrir menú"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu" style={{ display: 'block' }}>
          <div style={{ background: 'var(--paper)', padding: '16px 24px', borderBottom: '1px solid var(--line)' }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                data-testid={`${link.testId}-mobile`}
                onClick={() => handleNav(link.href)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', fontSize: '0.9rem', fontWeight: 500, color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {link.label}
              </button>
            ))}
            <button data-testid="header-agenda-button-mobile" onClick={() => { setOpen(false); onSchedule(); }} className="button button-primary" style={{ marginTop: '12px', width: '100%', justifyContent: 'center', borderRadius: 0 }}>
              Quiero empezar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
