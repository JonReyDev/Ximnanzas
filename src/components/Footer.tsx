import { CalendarCheck, MessageCircle, Instagram } from 'lucide-react';
import { navigate } from '@/lib/router';
import { whatsappLink } from '@/lib/whatsapp';
import { SERVICES } from '@/lib/services';

type FooterProps = {
  onSchedule: () => void;
};

export function Footer({ onSchedule }: FooterProps) {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div className="container-wide" style={{ padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px' }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em' }}>XIMNANZAS</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.65, maxWidth: '400px', marginBottom: '24px' }}>
              Asesoria financiera integral en Mexico. Te ayudamos a proteger lo que mas amas
              y a construir un futuro con tranquilidad. Mas de 15 años transformando vidas.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', opacity: 0.5 }}>
              <img src="/amib.png" alt="AMIB" style={{ height: '24px', objectFit: 'contain',}} />
              <img src="/CNS.png" alt="CNS" style={{ height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              <img src="/ALLIANZ.png" alt="Allianz" style={{ height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              <img src="/XIMNANZAS.png" alt="Fianzas" style={{ height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mono" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>Servicios</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <button
                    onClick={() => navigate(`/servicios/${s.slug}`)}
                    style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mono" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>Contacto</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>

            </ul>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button onClick={onSchedule} className="button" style={{ padding: '8px 16px', fontSize: '0.78rem', background: 'var(--blue)', color: 'white' }}>
                <CalendarCheck size={14} /> Agendar
              </button>
              <a href={whatsappLink('Hola, me gustaria mas informacion sobre sus servicios.')} target="_blank" rel="noreferrer" className="button" style={{ padding: '8px 16px', fontSize: '0.78rem', background: '#059669', color: 'white' }}>
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a href="https://www.instagram.com/ximnanzas/" target="_blank" rel="noreferrer" className="button" style={{ padding: '8px 16px', fontSize: '0.78rem', background: '#c13584', color: 'white' }}>
                <Instagram size={14} /> Instagram
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
          <p>© {new Date().getFullYear()} XIMNANZAS. Todos los derechos reservados.</p>
          <p>Aviso de privacidad · Terminos y condiciones</p>
        </div>
      </div>
    </footer>
  );
}
