import React from "react";
import { motion } from "framer-motion";
import { Heart, Handshake, Award, ShieldCheck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { IMAGES } from "@/lib/images";

const fallbackValues = [
  {
    icon: Heart,
    title: "Humanity",
    description:
      "We operate in an industry where human lives are paramount. Every product we deliver and every service we provide is guided by our deep respect for human life, regardless of status or identity.",
  },
  {
    icon: Handshake,
    title: "Commitment",
    description:
      "We are dedicated to protecting public health through timely delivery of services and products. Our commitment endures until we achieve our goals — as a company and as individuals.",
  },
  {
    icon: Award,
    title: "Customer Satisfaction",
    description:
      "Our success is measured by our clients' success. We remain honest, respectful, and committed to meeting every customer's needs with excellence.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "Trust is non-negotiable. We are transparent, honest, and ethical in delivering quality products and services to healthcare facilities across the country.",
  },
];

const valueIcons = { Heart, Handshake, Award, ShieldCheck };

export default function ValuesSection({ items = [] }) {
  const values =
    items.length > 0
      ? items.map((item, index) => ({
          icon:
            valueIcons[item.icon] ||
            fallbackValues[index % fallbackValues.length].icon,
          title: item.name,
          description: item.description,
        }))
      : fallbackValues;

  return (
    <section id="values" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.valuesBackground}
          alt="Medical technology background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              What Drives Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Our Core Values
            </h2>
            <p className="text-white/50 mt-4 text-lg max-w-2xl mx-auto">
              In a sector where human life is central, quality, reliability, and
              respect guide every stage of our service delivery.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {values.map((value, i) => (
            <ScrollReveal key={value.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group glass-dark rounded-2xl overflow-hidden hover:border-cyan/30 transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden hidden lg:block">
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/40 hidden sm:block" />
                  </div>
                  <div className="sm:w-3/5 p-6 lg:p-8 flex flex-col justify-center">
                    <div className="w-11 h-11 rounded-xl bg-cyan/15 flex items-center justify-center mb-4 group-hover:bg-cyan/25 transition-colors">
                      <value.icon className="w-5 h-5 text-cyan" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-white/55 leading-relaxed text-sm">
                      {value.description}
                    </p>
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
