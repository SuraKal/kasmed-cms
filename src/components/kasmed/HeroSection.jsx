import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Activity,
  Shield,
  Stethoscope,
} from "lucide-react";
import { IMAGES } from "@/lib/images";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Modern ICU with advanced patient monitoring"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-navy/30" />
      </div>

      {/* Animated floating elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[15%] hidden lg:block"
      >
        <div className="glass-dark rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">
              Real-time Monitoring
            </div>
            <div className="text-white/50 text-xs">24/7 Critical Care</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [10, -15, 10] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/3 right-[8%] hidden lg:block"
      >
        <div className="glass-dark rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">
              ISO Certified
            </div>
            <div className="text-white/50 text-xs">Global Standards</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [-8, 12, -8], x: [0, -5, 0] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[45%] left-[5%] hidden xl:block"
      >
        <div className="glass-dark rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">East Africa</div>
            <div className="text-white/50 text-xs">Regional Coverage</div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-4xl lg:max-w-5xl lg:pr-16 xl:pr-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/10"
          >
            <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-white/80 text-sm font-medium">
              Trusted Healthcare Partner Since 2019
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.02] tracking-tight mb-6"
          >
            Advancing <span className="text-cyan">Healthcare</span>
            <br />
            Across East Africa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl"
          >
            Importing, distributing, and servicing world-class medical devices
            and healthcare solutions — empowering clinicians and improving
            patient outcomes region-wide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#solutions"
              className="group bg-cyan text-white px-7 py-4 rounded-xl text-base font-semibold inline-flex items-center justify-center gap-2 hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/25 hover:shadow-cyan/35 hover:-translate-y-0.5"
            >
              Explore Solutions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="border border-white/30 text-white px-7 py-4 rounded-xl text-base font-semibold inline-flex items-center justify-center gap-2 hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              Contact Us
            </a>
          </motion.div>

          {/* Trust badges */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
              Trusted by leading organizations
            </p>
            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              {["USAID", "CDC", "UNOPS", "EPSA"].map((name) => (
                <span
                  key={name}
                  className="text-white/50 font-semibold text-sm tracking-wide"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div> */}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs uppercase tracking-widest">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
