import React, { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const clientFallbacks = [
  { name: "USAID", fallbackSrc: "/clients/usaid.png" },
  { name: "CDC", fallbackSrc: "/clients/cdc.png" },
  { name: "FAO", fallbackSrc: "/clients/fao.png" },
  { name: "FDRE Defence Force", fallbackSrc: "/clients/FDRE Defence Force.png" },
  { name: "Lancet", fallbackSrc: "/clients/Lancet.png" },
  { name: "Nordic Medical Centre", fallbackSrc: "/clients/NMC.png" },
  { name: "Selale", fallbackSrc: "/clients/selale.png" },
  { name: "Teklehaimanot", fallbackSrc: "/clients/Teklehaimanot.png" },
  { name: "UNOPS", fallbackSrc: "/clients/unops.png" },
  { name: "Werabe", fallbackSrc: "/clients/werabe.png" },
];

const suppliers = Array.from({ length: 17 }, (_, index) => ({
  name: `Supplier ${String(index + 1).padStart(2, "0")}`,
  shortLabel: String(index + 1).padStart(2, "0"),
  src: `/images/suppliers/${index + 1}.png`,
}));

const clients = clientFallbacks.map((item, index) => ({
  ...item,
  shortLabel: String(index + 1).padStart(2, "0"),
  src: `/images/clients/${index + 1}.png`,
}));

const satisfiedCustomers = Array.from({ length: 14 }, (_, index) => ({
  name: `Customer ${String(index + 1).padStart(2, "0")}`,
  shortLabel: String(index + 1).padStart(2, "0"),
  src: `/images/customers/${index + 1}.png`,
}));

function LogoCard({ item, dark = false }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.04 }}
      className={`group flex-shrink-0 flex flex-col items-center justify-center rounded-2xl px-4 py-4 w-[150px] transition-all duration-300 cursor-default ${
        dark
          ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan/30"
          : "bg-white border border-navy/5 hover:shadow-xl hover:shadow-navy/5 hover:border-cyan/20"
      }`}
    >
      <div
        className={`flex min-h-14 w-full items-center justify-center rounded-2xl border px-3 py-2 transition-colors ${
          dark
            ? "bg-white/95 border-white/10"
            : "bg-slate-50 border-slate-100"
        }`}
      >
        {!imageFailed ? (
          <img
            src={item.src}
            alt={item.name}
            onError={(event) => {
              if (item.fallbackSrc && event.currentTarget.src !== item.fallbackSrc) {
                event.currentTarget.src = item.fallbackSrc;
                return;
              }
              setImageFailed(true);
            }}
            className="h-auto max-h-18 w-auto max-w-full object-contain"
          />
        ) : (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold tracking-widest hidden ${
              dark ? "bg-navy text-white/80" : "bg-cyan/10 text-navy"
            }`}
          >
            {item.shortLabel}
          </div>
        )}
      </div>
      <span
        className={`mt-2 text-[11px] font-medium text-center leading-snug transition-colors hidden ${
          dark
            ? "text-white/45 group-hover:text-white/80"
            : "text-navy/45 group-hover:text-navy/80"
        }`}
      >
        {item.name}
      </span>
    </motion.div>
  );
}

function LogoStrip({ items, dark = false, reverse = false, speed = 30 }) {
  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex w-max flex-nowrap gap-3"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {doubled.map((item, index) => (
          <LogoCard key={`${item.name}-${index}`} item={item} dark={dark} />
        ))}
      </motion.div>
    </div>
  );
}

function LogoSection({
  id,
  bg,
  dark = false,
  eyebrow,
  title,
  subtitle,
  badgeText,
  items,
  reverse = false,
  speed = 28,
}) {
  return (
    <section
      id={id}
      className={`py-20 lg:py-28 relative overflow-hidden ${bg}`}
    >
      {dark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/5 blur-3xl" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-cyan">
              {eyebrow}
            </span>
            <h2
              className={`text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${
                dark ? "text-white" : "text-navy"
              }`}
            >
              {title}
            </h2>
            <p
              className={`mx-auto mt-4 max-w-2xl text-lg ${
                dark ? "text-white/40" : "text-navy/50"
              }`}
            >
              {subtitle}
            </p>
            <div
              className={`mt-6 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${
                dark ? "bg-white/10 text-white/70" : "bg-cyan/10 text-cyan"
              }`}
            >
              {badgeText}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <LogoStrip
            items={items}
            dark={dark}
            reverse={reverse}
            speed={speed}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function PartnersSection() {
  return (
    <>
      <LogoSection
        id="partners"
        bg="bg-surgical"
        dark={false}
        eyebrow="Global Network"
        title="Our Global Suppliers"
        subtitle="Partnered with world-renowned manufacturers to bring proven, reliable technology to East Africa."
        badgeText="17 Global Suppliers"
        items={suppliers}
        reverse={false}
        speed={25}
      />

      <LogoSection
        id="clients"
        bg="bg-navy"
        dark={true}
        eyebrow="Trust & Credibility"
        title="Our Valued Clients"
        subtitle="Trusted by international organizations, government agencies, and leading healthcare institutions."
        badgeText="10 Valued Clients"
        items={clients}
        reverse={true}
        speed={30}
      />

      <LogoSection
        id="customers"
        bg="bg-white"
        dark={false}
        eyebrow="Customer Impact"
        title="Our Satisfied Customers"
        subtitle="Organizations across East Africa that rely on KASMED for quality healthcare solutions and ongoing partnership."
        badgeText="14 Satisfied Customers"
        items={satisfiedCustomers}
        reverse={false}
        speed={27}
      />
    </>
  );
}
