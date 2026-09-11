import { useState, useMemo } from 'react';
import { Download, Sparkles, ArrowRight } from 'lucide-react';
import {
  RISK_PROFILES,
  calculateProjection,
  formatCompact,
  type RiskProfile,
} from '@/lib/calculator';
import { generateProjectionPDF } from '@/lib/pdf';

type CalculatorProps = {
  onContact: () => void;
};

export function Calculator({ onContact }: CalculatorProps) {
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

  // Chart
  const chartW = 600;
  const chartH = 220;
  const padX = 36;
  const padY = 16;
  const maxVal = Math.max(...projection.map((p) => p.balance), 1);
  const chartWInner = chartW - padX * 2;
  const chartHInner = chartH - padY * 2;

  const points = projection.map((p, i) => {
    const x = padX + (i / Math.max(projection.length - 1, 1)) * chartWInner;
    const y = padY + chartHInner - (p.balance / maxVal) * chartHInner;
    return { x, y, ...p };
  });

  const areaPath = `M ${padX} ${padY + chartHInner} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${padX + chartWInner} ${padY + chartHInner} Z`;

  const linePath = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? 0} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(' ');

  return (
    <section id="calculadora" className="section" style={{ background: 'var(--paper-warm)' }}>
      <div className="container-wide calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'center' }}>
        {/* Left: text */}
        <div>
          <div className="section-kicker">Una primera aproximacion</div>
          <h2 className="display">Ponle una cifra<br />a tu intencion.</h2>
          <p className="lead" style={{ marginTop: '20px' }}>
            Este ejercicio es ilustrativo: una conversacion personalizada siempre sera mas precisa,
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

          <button onClick={onContact} className="button button-primary" style={{ marginTop: '28px' }} data-testid="button-calculator-contact">
            Quiero un calculo a mi medida <ArrowRight size={15} />
          </button>
        </div>

        {/* Right: calculator card */}
        <div className="calculator-card" data-testid="card-calculator">
          <div className="calculator-top">
            <span className="mono">Simulador de constancia</span>
            <Sparkles size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </div>

          <div className="calc-result">
            <small>Si apartaras cada mes</small>
            <strong>${finalBalance.toLocaleString('es-MX')}</strong>
            <span>podria ser una referencia para tu fondo en {years} años*</span>
          </div>

          {/* Chart */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: '14px',
            padding: '12px', marginBottom: '24px',
          }}>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto' }} preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0066ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0066ff" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line key={t} x1={padX} y1={padY + t * chartHInner} x2={padX + chartWInner} y2={padY + t * chartHInner} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              ))}
              <path d={areaPath} fill="url(#areaGrad)" />
              <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {points.filter((_, i) => i % Math.ceil(projection.length / 5) === 0 || i === points.length - 1).map((p) => (
                <text key={p.year} x={p.x} y={chartH - 2} textAnchor="middle" fill="rgba(255,255,255,0.3)" style={{ fontSize: '9px' }}>
                  Año {p.year}
                </text>
              ))}
            </svg>
          </div>

          {/* Sliders */}
          <label className="range-label">
            Aportacion mensual <b>${monthly.toLocaleString('es-MX')}</b>
            <input type="range" min={500} max={50000} step={500} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} data-testid="input-calculator-monthly" />
          </label>
          <label className="range-label">
            Edad actual <b>{age} años</b>
            <input type="range" min={18} max={65} value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </label>
          <label className="range-label">
            Plazo <b>{years} años</b>
            <input type="range" min={5} max={40} value={years} onChange={(e) => setYears(Number(e.target.value))} data-testid="input-calculator-years" />
          </label>

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
