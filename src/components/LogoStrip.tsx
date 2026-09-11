import { motion } from "framer-motion";

const LOGOS = [
  {
    src: "/ALLIANZ.png",
    alt: "Allianz - Distribuidor Autorizado",
    id: "logo-allianz",
    h: "max-h-10",
  },
  {
    src: "/amib.png",
    alt: "AMIB - Asociación Mexicana de Instituciones Bursátiles",
    id: "logo-amib",
    h: "max-h-12",
  },
  {
    src: "/CNS.png",
    alt: "CNSF - Comisión Nacional de Seguros y Fianzas",
    id: "logo-cnsf",
    h: "max-h-12",
  },
  {
    src: "/XIMNANZAS.png",
    alt: "Ximnanzas - Asesor Patrimonial",
    id: "logo-ximnanzas",
    h: "max-h-10",
  },
];

export function LogoStrip() {
  return (
    <section
      data-testid="logo-strip"
      className="border-t border-black/10 bg-white px-6 py-14"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-6xl"
      >
        <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
          Distribuidor autorizado · Instituciones que nos respaldan
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {LOGOS.map((logo) => (
            <div
              key={logo.id}
              className="flex h-16 items-center justify-center px-4"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`${logo.h} w-auto object-contain`}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
