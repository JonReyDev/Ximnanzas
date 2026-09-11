import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase, type Lead } from '@/lib/supabase';
import { notifySubmission } from '@/lib/supabase';
import { whatsappLink } from '@/lib/whatsapp';

type HeroProps = {
  onSchedule: () => void;
};

const HERO_IMG =
  'https://images.pexels.com/photos/36729964/pexels-photo-36729964.jpeg?auto=compress&cs=tinysrgb&w=1920';

const INTERESTS = [
  'Plan Personal de Retiro',
  'Ahorro para el retiro',
  'Deduccion de impuestos',
  'Proteccion financiera',
  'Otro',
];
const WHATSAPP_NUMBER = '525951069096';

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

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    interest: INTERESTS[0],
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError('Completa los campos obligatorios.');
      return;
    }
    setLoading(true);
    setError('');
    const lead: Omit<Lead, 'id'> = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: `${form.interest}${form.message ? ' — ' + form.message : ''}`,
    };
    const { error: dbError } = await supabase.from('leads').insert([lead]);
    if (dbError) {
      setError('No pudimos enviar tu solicitud. Intenta de nuevo.');
      setLoading(false);
      return;
    }
    await notifySubmission('lead', lead);
    const waMessage = `Hola, quiero informacion sobre un Plan Personal de Retiro.\n\nNombre: ${form.name}\nEmail: ${form.email}\nTelefono: ${form.phone}\nInteres: ${form.interest}\nMensaje: ${form.message || 'Sin mensaje adicional'}`;
    window.open(whatsappLink(waMessage, WHATSAPP_NUMBER), '_blank');
    setSubmitted(true);
    setForm({ name: '', phone: '', email: '', interest: INTERESTS[0], message: '' });
    setLoading(false);
    setTimeout(() => setSubmitted(false), 6000);
  };

  const inputCls = 'w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/50';

  return (
    <section
      id="inicio"
      ref={ref}
      data-testid="hero-section"
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--ink)' }}
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[10%] h-[120%]">
        <img src={HERO_IMG} alt="Pareja planeando su futuro financiero" data-testid="hero-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </motion.div>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--ink), rgba(10,22,40,0.7) 40%, rgba(10,22,40,0.4))' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,22,40,0.8), transparent)' }} />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-end px-6 pb-16 pt-32 lg:px-16"
      >
        <div className="grid w-full items-end gap-16 lg:grid-cols-12">
          {/* Texto */}
          <div className="max-w-2xl lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8 block"
              style={{ fontFamily: 'Barlow Semi Condensed, sans-serif', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--amber-soft)' }}
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
                onClick={() => scrollToSection('#calculadora')}
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

          {/* Formulario */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            onSubmit={submit}
            data-testid="lead-form"
            className="rounded-2xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl lg:col-span-5"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 size={48} style={{ color: '#4ade80' }} />
                <p className="mt-4 font-serif text-xl">¡Recibido!</p>
                <p className="mt-2 text-sm text-white/60">Un asesor te contactara muy pronto.</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--amber)' }}>
                    Da el primer paso
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-thin leading-tight text-white sm:text-3xl">
                    Construye el retiro que imaginas.
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    Dejanos tus datos y un asesor te contactara para conocer tus objetivos.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="lead-name" className="text-xs font-medium text-white/70">Nombre completo</label>
                    <input id="lead-name" data-testid="lead-name-input" value={form.name} onChange={set('name')} placeholder="Tu nombre" className={inputCls} required />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="lead-phone" className="text-xs font-medium text-white/70">Telefono</label>
                    <input id="lead-phone" data-testid="lead-phone-input" value={form.phone} onChange={set('phone')} placeholder="55 1234 5678" className={inputCls} required />
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  <label htmlFor="lead-email" className="text-xs font-medium text-white/70">Email</label>
                  <input id="lead-email" type="email" data-testid="lead-email-input" value={form.email} onChange={set('email')} placeholder="tu@email.com" className={inputCls} required />
                </div>

                <div className="mt-5 grid gap-2">
                  <label htmlFor="lead-interest" className="text-xs font-medium text-white/70">Me interesa</label>
                  <select id="lead-interest" data-testid="lead-interest-select" value={form.interest} onChange={set('interest')} className={inputCls}>
                    {INTERESTS.map((i) => <option key={i} value={i} className="text-black">{i}</option>)}
                  </select>
                </div>

                <div className="mt-5 grid gap-2">
                  <label htmlFor="lead-message" className="text-xs font-medium text-white/70">Mensaje (opcional)</label>
                  <textarea id="lead-message" data-testid="lead-message-input" value={form.message} onChange={set('message')} placeholder="Cuentame tu situacion o tus dudas…" className={`${inputCls} min-h-28 resize-none`} />
                </div>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                <button
                  data-testid="lead-submit-button"
                  type="submit"
                  disabled={loading}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors disabled:opacity-50"
                  style={{ background: 'var(--blue)' }}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? 'Enviando...' : 'Quiero que me contacten'}
                </button>
              </>
            )}
          </motion.form>
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
