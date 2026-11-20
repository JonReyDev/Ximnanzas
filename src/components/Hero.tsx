import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

type HeroProps = {
  onSchedule: () => void;
};

const HERO_IMG = '/assets/hero-retiro.jpg';

const scrollToSection = (hash: string) => {
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
};

const MaskedLine = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '4px' }}>
    <motion.span
      style={{ display: 'block', willChange: 'transform' }}
      initial={{ y: '115%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export function Hero({ onSchedule }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="inicio"
      ref={ref}
      data-testid="hero-section"
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--ink)' }}
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[10%] h-[120%]">
        <img src={HERO_IMG} alt="" data-testid="hero-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </motion.div>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--ink), rgba(10,22,40,0.7) 40%, rgba(10,22,40,0.4))' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,22,40,0.8), transparent)' }} />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-end px-6 pb-16 pt-32 lg:px-16"
      >
        <div className="grid w-full items-end gap-16 lg:grid-cols-12">
          {/* Texto */}
          <div className="max-w-2xl lg:col-span-10">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8 block"
              style={{ fontFamily: 'DM Mono, Menlo, monospace', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--amber-soft)' }}
              data-testid="hero-overline"
            >
              Plan Personal de Retiro Allianz · Asesoria XIMNANZAS
            </motion.span>

            <h1
              className="font-serif text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl"
              data-testid="hero-heading"
            >
              <MaskedLine delay={0.35}>Tu retiro</MaskedLine>
              <MaskedLine delay={0.5}>
                <em className="font-serif italic" style={{ color: 'var(--amber-soft)' }}>empieza</em>
              </MaskedLine>
              <MaskedLine delay={0.65}>hoy.</MaskedLine>
            </h1>

            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 block max-w-xl text-base font-light leading-relaxed md:text-lg"
              style={{ color: 'rgba(232,213,160,0.85)' }}
            >
              Un Plan Personal de Retiro que crece con interes compuesto, deduce impuestos
              desde el primer dia y te da la libertad de vivir manana como lo sueñas hoy.
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                data-testid="hero-cta-Simulador"
                onClick={() => scrollToSection('#simulador')}
                className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold tracking-wide text-white transition-colors duration-300"
                style={{ background: 'var(--amber)' }}
              >
                Calcula tu retiro
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                data-testid="hero-cta-advisor"
                onClick={onSchedule}
                className="inline-flex items-center gap-2 border border-white/40 px-8 py-4 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:border-white/70 hover:bg-white/10"
              >
                Hablar con un asesor
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-16 flex flex-wrap gap-x-12 gap-y-6 text-white"
              data-testid="hero-stats"
            >
              {[
                ['+130', 'años de respaldo global'],
                ['Art. 151', 'deducible ante el SAT'],
                ['100%', 'a tu nombre, siempre'],
              ].map(([big, small]) => (
                <div key={small} className="border-l border-white/20 pl-4">
                  <p className="font-serif text-3xl font-bold">{big}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em]" style={{ color: 'rgba(232,213,160,0.7)' }}>{small}</p>
                </div>
              ))}
            </motion.div>
          </div>


        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 lg:right-10"
        style={{ color: 'rgba(232,213,160,0.6)' }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
          <ArrowRight className="h-5 w-5 rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  );
}
