import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Compass,
  Users,
  Calendar,
  MapPin,
  Package,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { IMAGES } from "@/lib/images";

function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { icon: Calendar, value: 2019, label: "Established", suffix: "" },
  { icon: Users, value: 30, label: "Expert Professionals", suffix: "+" },
  { icon: MapPin, value: 5, label: "Countries Reached", suffix: "+" },
  { icon: Package, value: 10, label: "Solution Categories", suffix: "+" },
];

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To provide reliable and cost-effective products and solutions in the healthcare industry that support quality patient care.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To become East Africa's company of choice for healthcare products and solutions.",
  },
  {
    icon: Compass,
    title: "Our Goal",
    text: "To expand the accessibility of reliable medical products across East Africa, establishing sustainable healthcare partnerships that elevate the standard of patient care.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 lg:py-32 bg-white relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight">
              Transforming Healthcare
              <br className="hidden sm:block" />
              Delivery in East Africa
            </h2>
          </div>
        </ScrollReveal>

        {/* Story layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 lg:mb-28">
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-navy/10">
                <img
                  src={IMAGES.about}
                  alt="KASMED biomedical engineer at work"
                  className="w-full h-80 lg:h-[450px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-5 shadow-xl max-w-[200px] hidden sm:block">
                <div className="text-3xl font-extrabold text-navy">
                  <AnimatedCounter end={30} suffix="+" />
                </div>
                <div className="text-navy/60 text-sm font-medium">
                  Healthcare Professionals
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.15}>
            <div>
              <p className="text-navy/70 text-lg leading-relaxed mb-6">
                KASMED Trading PLC is a leading importer, distributor, and
                commission agent for medical devices and healthcare products
                across East Africa. Established in September 2019 with just two
                staff members, we have grown into a team of 30+ dedicated
                professionals.
              </p>
              <p className="text-navy/70 text-lg leading-relaxed mb-8">
                We provide timely biomedical equipment maintenance through
                well-trained service engineers, and represent four global
                leading brands of clinical and diagnostic products across the
                East Africa region.
              </p>

              {/* Coverage map */}
              <div className="rounded-2xl overflow-hidden border border-cyan/10">
                <img
                  src={IMAGES.coverageMap}
                  alt="KASMED East Africa coverage network"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20 lg:mb-28">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="bg-surgical rounded-2xl p-6 lg:p-8 text-center group hover:shadow-lg transition-all duration-300"
              >
                <stat.icon className="w-6 h-6 text-cyan mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl lg:text-4xl font-extrabold text-navy mb-1 font-mono tracking-tight">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-navy/50 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Mission / Vision / Goal */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group bg-white rounded-2xl p-8 border border-navy/5 hover:border-cyan/20 hover:shadow-xl hover:shadow-cyan/5 transition-all duration-500 h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-5 group-hover:bg-cyan/20 transition-colors">
                  <pillar.icon className="w-6 h-6 text-cyan" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">
                  {pillar.title}
                </h3>
                <p className="text-navy/60 leading-relaxed">{pillar.text}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
