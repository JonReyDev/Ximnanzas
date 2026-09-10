import { motion } from "framer-motion";

const LOGOS = [
  {
    src: "/logos/allianz.png",
    alt: "Allianz — Distribuidor Autorizado",
    id: "logo-allianz",
    h: "max-h-10",
  },
  {
    src: "/logos/amib.png",
    alt: "AMIB — Asociación Mexicana de Instituciones Bursátiles",
    id: "logo-amib",
    h: "max-h-12",
  },
  {
    src: "/logos/cnsf.png",
    alt: "CNSF — Comisión Nacional de Seguros y Fianzas",
    id: "logo-cnsf",
    h: "max-h-12",
  },
];

export const LogoStrip = () => (
  <section
    data-testid="logo-strip"
    className="border-t border-black/10 bg-white px-6 py-14"
  >
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
    >
      <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
        Distribuidor autorizado · Instituciones que nos respaldan
      </p>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-14 gap-y-8">
        {LOGOS.map((l) => (
          <div
            key={l.id}
            className="flex h-14 min-w-[150px] items-center justify-center"
          >
            <img
              src={l.src}
              alt={l.alt}
              data-testid={l.id}
              className={`${l.h} w-auto object-contain opacity-80 transition-[opacity,transform] duration-300 hover:scale-105 hover:opacity-100`}
            />
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);
