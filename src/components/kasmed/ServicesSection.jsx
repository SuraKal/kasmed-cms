import React from "react";
import { motion } from "framer-motion";
import {
  Truck,
  HeartPulse,
  Wrench,
  FlaskConical,
  ArrowUpRight,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { IMAGES } from "@/lib/images";
import { resolveAssetUrl } from "@/lib/api";

const fallbackServices = [
  {
    icon: Truck,
    title: "Import & Distribution",
    description:
      "Sourcing and delivering world-class medical devices from global manufacturers directly to healthcare facilities across East Africa.",
    image: IMAGES.distribution,
  },
  {
    icon: HeartPulse,
    title: "Medical Supplies",
    description:
      "Comprehensive wholesale of clinical consumables, diagnostic products, and essential medical supplies for hospitals and clinics.",
    image: IMAGES.clinicalSupplies,
  },
  {
    icon: Wrench,
    title: "After Sales Service",
    description:
      "Dedicated biomedical engineering team providing on-time equipment maintenance, calibration, and technical support.",
    image: IMAGES.serviceEngineer,
  },
  {
    icon: FlaskConical,
    title: "Research & Development",
    description:
      "Continuously evaluating and introducing innovative healthcare technologies that address the evolving needs of East African healthcare.",
    image: IMAGES.laboratory,
  },
];

export default function ServicesSection({ items = [] }) {
  const serviceIcons = [Truck, HeartPulse, Wrench, FlaskConical];
  const services =
    items.length > 0
      ? items.map((item, index) => ({
          icon: serviceIcons[index % serviceIcons.length],
          title: item.name,
          description: item.description,
          image:
            resolveAssetUrl(item.thumbnail) ||
            fallbackServices[index % fallbackServices.length].image,
        }))
      : fallbackServices;

  return (
    <section
      id="services"
      className="py-24 lg:py-32 bg-surgical relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={IMAGES.distribution}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.14] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-surgical via-surgical/95 to-white/80" />
      </div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight">
              Areas of Engagement
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group bg-white rounded-2xl overflow-hidden border border-navy/5 hover:shadow-2xl hover:shadow-navy/8 transition-all duration-500 h-full"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="glass rounded-xl p-2.5 inline-flex">
                      <service.icon className="w-5 h-5 text-navy" />
                    </div>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-cyan transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-navy/60 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surgical flex items-center justify-center shrink-0 group-hover:bg-cyan group-hover:text-white transition-all mt-1">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
