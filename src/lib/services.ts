export type ServiceSlug = 'seguro-de-vida' | 'inversion-inteligente' | 'gastos-medicos-mayores' | 'auto-y-hogar';

export type Service = {
  slug: ServiceSlug;
  chapter: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  accent: string;
  benefits: { title: string; description: string; icon: string }[];
  highlights: string[];
};

export const SERVICES: Service[] = [
  {
    slug: 'seguro-de-vida',
    chapter: '01',
    title: 'Seguro de Vida',
    tagline: 'Protege lo que más amas',
    description:
      'Asegura el bienestar financiero de tu familia ante cualquier eventualidad. Un seguro de vida es un acto de amor que garantiza que los tuyos estén cubiertos sin importar qué pase.',
    icon: 'HeartPulse',
    image: 'https://images.pexels.com/photos/4975543/pexels-photo-4975543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'rose',
    benefits: [
      { title: 'Pago inmediato', description: 'El beneficio se entrega a tus beneficiarios sin trámites largos.', icon: 'Wallet' },
      { title: 'Deducible de impuestos', description: 'Tu prima es deducible hasta el 100% en tu declaración anual.', icon: 'ReceiptText' },
      { title: 'Fondo de retiro', description: 'Si no usas el seguro, acumulas un ahorro para tu retiro.', icon: 'PiggyBank' },
      { title: 'Cobertura flexible', description: 'Elige el monto y plazo que se adapte a tu familia.', icon: 'SlidersHorizontal' },
    ],
    highlights: ['Cobertura desde $500,000 MXN', 'Sin examen médico en algunos planes', 'Beneficiarios múltiples'],
  },
  {
    slug: 'inversion-inteligente',
    chapter: '02',
    title: 'Inversión Inteligente',
    tagline: 'Haz crecer tu dinero con propósito',
    description:
      'Construye tu patrimonio con estrategias de inversión diseñadas para tus objetivos. Ya sea para tu retiro, la educación de tus hijos o tu libertad financiera, te acompañamos paso a paso.',
    icon: 'TrendingUp',
    image: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'emerald',
    benefits: [
      { title: 'Interés compuesto', description: 'Tu dinero crece exponencialmente año con año.', icon: 'ChartCandlestick' },
      { title: 'Diversificación', description: 'Repartimos el riesgo entre varios instrumentos.', icon: 'Layers' },
      { title: 'Tres perfiles', description: 'Conservador, Balanceado o Dinámico según tu perfil.', icon: 'Gauge' },
      { title: 'Retiros flexibles', description: 'Accede a tu dinero cuando lo necesites.', icon: 'Banknote' },
    ],
    highlights: ['Rendimiento proyectado 6-10% anual', 'Desde $1,000 MXN al mes', 'Sin comisiones ocultas'],
  },
  {
    slug: 'gastos-medicos-mayores',
    chapter: '03',
    title: 'Gastos Médicos Mayores',
    tagline: 'Tu salud, sin sorpresas',
    description:
      'Protege tu patrimonio ante enfermedades graves o accidentes. Un solo incidente médico puede destruir años de ahorro. Con nosotros, tú y tu familia están cubiertos en los mejores hospitales.',
    icon: 'Stethoscope',
    image: 'https://images.pexels.com/photos/19563295/pexels-photo-19563295.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'sky',
    benefits: [
      { title: 'Cobertura nacional', description: 'Acceso a más de 200 hospitales en todo el país.', icon: 'Building2' },
      { title: 'Sin límite de suma', description: 'Cobertura hasta el 100% de tus gastos médicos.', icon: 'ShieldCheck' },
      { title: 'Protección familiar', description: 'Incluye cónyuge e hijos en una sola póliza.', icon: 'Users' },
      { title: 'Chequeos preventivos', description: 'Incluye estudios y consultas de prevención.', icon: 'Activity' },
    ],
    highlights: ['Cobertura hasta $5M MXN', 'Sin carencias en emergencias', 'Red de hospitales de lujo'],
  },
  {
    slug: 'auto-y-hogar',
    chapter: '04',
    title: 'Auto y Hogar',
    tagline: 'Tus bienes, siempre protegidos',
    description:
      'Tu auto y tu casa representan años de esfuerzo. Protégelos contra robos, accidentes, desastres naturales y responsabilidad civil. Duerme tranquilo sabiendo que lo tuyo está blindado.',
    icon: 'ShieldCheck',
    image: 'https://images.pexels.com/photos/7736029/pexels-photo-7736029.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'amber',
    benefits: [
      { title: 'Robo total y parcial', description: 'Cobertura completa ante cualquier hurto.', icon: 'Lock' },
      { title: 'Daños materiales', description: 'Cubre accidentes, incendios y desastres naturales.', icon: 'House' },
      { title: 'Responsabilidad civil', description: 'Protege tu patrimonio ante daños a terceros.', icon: 'Scale' },
      { title: 'Asistencia 24/7', description: 'Grúa, cerrajero y apoyo vial cuando lo necesites.', icon: 'LifeBuoy' },
    ],
    highlights: ['Cobertura amplia y limitada', 'Asistencia vial 24/7', 'Reparación en agencia'],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
