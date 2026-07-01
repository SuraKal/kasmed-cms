import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { IMAGES } from "@/lib/images";

const gallery = [
  {
    src: IMAGES.patientMonitoring,
    alt: "Patient Monitoring Equipment",
    span: "col-span-2 row-span-2",
  },
  { src: IMAGES.serviceEngineer, alt: "Biomedical Service Engineer", span: "" },
  { src: IMAGES.surgical, alt: "Surgical Room Setup", span: "col-span-2" },
  { src: IMAGES.installation, alt: "Equipment Installation", span: "" },
  { src: IMAGES.neonatal, alt: "Neonatal Care Unit", span: "" },
  { src: IMAGES.laboratory, alt: "Laboratory Equipment", span: "" },
  { src: IMAGES.renalCare, alt: "Renal Care Systems", span: "" },
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section
      id="gallery"
      className="py-24 lg:py-32 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              Our Work
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight">
              Gallery
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 auto-rows-[180px] lg:auto-rows-[220px]">
          {gallery.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05} className={item.span}>
              <motion.div
                whileHover={{ scale: 0.98 }}
                onClick={() => setLightbox(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer h-full"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 w-12 h-12 rounded-full glass-dark flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
