import { useState, useMemo, useEffect, useRef } from 'react';
import { Download, Sparkles, ArrowRight } from 'lucide-react';
import {
  RISK_PROFILES,
  calculateProjection,
  formatCompact,
  type RiskProfile,
} from '@/lib/simulador';
import { generateProjectionPDF } from '@/lib/pdf';

type SimuladorProps = {
  onContact: () => void;
};

export function Simulador({ onContact }: SimuladorProps) {
  const [age, setAge] = useState(30);
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(30);
  const [profile, setProfile] = useState<RiskProfile>(RISK_PROFILES[1]);

  const projection = useMemo(
    () => calculateProjection(age, monthly, years, profile.rate),
    [age, monthly, years, profile],
  );

  const finalBalance = projection.length > 0 ? projection[projection.length - 1].balance : 0;
  const totalContributed = projection.length > 0 ? projection[projection.length - 1].totalContributed : 0;
  const totalInterest = finalBalance - totalContributed;
  const balanceRef = useRef<HTMLElement | null>(null);
  const currentBalanceRef = useRef(0);
  const milestones = projection.filter((_, index) => index % Math.ceil(projection.length / 5) === 0 || index === projection.length - 1);
  useEffect(() => {
    let cancelled = false;
    let stopAnimation = () => {};
    const element = balanceRef.current;
    if (!element) return undefined;

    const formatBalance = (value: number) => `$${Math.round(value).toLocaleString('es-MX')}`;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.textContent = formatBalance(finalBalance);
      currentBalanceRef.current = finalBalance;
      return undefined;
    }

    const animatedValue = { value: currentBalanceRef.current };
    element.textContent = formatBalance(animatedValue.value);

    void import('animejs').then(({ animate }) => {
      if (cancelled) return;
      const animation = animate(animatedValue, {
        value: finalBalance,
        duration: 700,
        ease: 'out(3)',
        onUpdate: () => {
          currentBalanceRef.current = animatedValue.value;
          element.textContent = formatBalance(animatedValue.value);
        },
      });
      stopAnimation = () => {
        animation.revert();
      };
    });

    return () => {
      cancelled = true;
      stopAnimation();
    };
  }, [finalBalance]);

  return (
    <section id="simulador" className="section" style={{ background: 'var(--paper-warm)' }}>

      <div className="container-wide Simulador-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'center' }}>
        {/* Left: text */}
        <div> 
          <img className="simulador-retrato" src="/assets/servicio-retiro.jpg" alt="Pareja mayor paseando en un parque" loading="lazy" />
          <div className="section-kicker">Simulador de retiro</div>
        <div className="shell"><div className="simulator"><div className="simulator-copy"><hr className="gold-rule" /></div></div></div>
          <h2 className="display">Ponle una cifra<br />a tu intencion.</h2>
             <p className="lead" style={{ marginTop: '20px' }}>Construye una proyección sencilla para conversar sobre tu horizonte. Ajusta tus datos y observa cómo cambia el escenario.</p>
          <p className="lead" style={{ marginTop: '20px' }}>
            Este ejercicio es ilustrativo: una conversación personalizada siempre será más precisa,
            porque tu vida no cabe en una formula.
          </p>

          {/* Risk profiles */}
          <div style={{ marginTop: '32px' }}>
            <span className="mono" style={{ color: 'var(--muted)', marginBottom: '12px', display: 'block' }}>Perfil de riesgo</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {RISK_PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfile(p)}
                  style={{
                    padding: '14px 12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: profile.id === p.id ? '2px solid var(--blue)' : '1px solid var(--line)',
                    background: profile.id === p.id ? 'white' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)' }}>{p.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px' }}>{(p.rate * 100).toFixed(0)}% anual</div>
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '10px' }}>{profile.description}</p>
          </div>

          <button onClick={onContact} className="button button-primary" style={{ marginTop: '28px' }} data-testid="button-Simulador-contact">
            Quiero un calculo a mi medida <ArrowRight size={15} />
          </button>
        </div>

        {/* Right: Simulador card */}
        <div className="Simulador-card" data-testid="card-Simulador">
          <div className="Simulador-top">
            <span className="mono">Simulador de retiro</span>
            <Sparkles size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </div>

          <div className="calc-result">
            <small>Si apartaras cada mes</small>
            <strong ref={balanceRef}>$0</strong>
            <span>podria ser una referencia para tu fondo en {years} años*</span>
          </div>

          {/* Sliders */}
          <div className="projection-controls">
          <label className="range-label">
            Aportacion mensual <b>${monthly.toLocaleString('es-MX')}</b>
            <input type="range" min={500} max={50000} step={500} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} data-testid="input-Simulador-monthly" />
          </label>
          <label className="range-label">
            Edad actual <b>{age} años</b>
            <input type="range" min={18} max={65} value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </label>
          <label className="range-label">
            Plazo <b>{years} años</b>
            <input type="range" min={5} max={40} value={years} onChange={(e) => setYears(Number(e.target.value))} data-testid="input-Simulador-years" />
          </label>
          </div>
          <figure aria-label="Crecimiento proyectado">
            <div className="particle-chart-bars" style={{ gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` }}>
              {milestones.map((point) => <div key={point.year} className="text-center">
                <div className="particle-chart-tube"><div className="particle-chart-fill" style={{ height: `${point.balance / Math.max(finalBalance, 1) * 100}%` }} /></div>
                <small>{age + point.year} años</small>
              </div>)}
            </div>
          </figure>
          <table className="projection-summary">
            <caption>Proyección por edad · MXN</caption>
            <thead><tr><th scope="col">Edad</th><th scope="col">Aportado</th><th scope="col">Saldo</th></tr></thead>
            <tbody>{milestones.map((point) => <tr key={point.year}><th scope="row">{age + point.year}</th><td>{formatCompact(point.totalContributed)}</td><td>{formatCompact(point.balance)}</td></tr>)}</tbody>
          </table>


          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Total aportado</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{formatCompact(totalContributed)}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Interes ganado</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#4ade80' }}>{formatCompact(totalInterest)}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Edad final</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{age + years} años</div>
            </div>
          </div>

          <button
            onClick={() => generateProjectionPDF(projection, { age, monthly, years, profile: profile.name, rate: profile.rate })}
            className="button"
            style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', marginTop: '20px' }}
          >
            <Download size={15} />
            Descargar mi proyeccion
          </button>

          <small className="calc-disclaimer">
            *Estimacion simple, no representa rendimiento garantizado ni una oferta de inversion.
          </small>
        </div>
      </div>
    </section>
  );
}
