import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  BedDouble,
  HeartPulse,
  Droplets,
  Baby,
  Scissors,
  Microscope,
  TestTube2,
  Bone,
  Trash2,
  ArrowRight,
  X,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { IMAGES } from "@/lib/images";
import { resolveAssetUrl } from "@/lib/api";

const fallbackSolutions = [
  {
    icon: Monitor,
    title: "Patient Monitoring & Critical Care",
    short:
      "State-of-the-art monitoring systems enabling specialists to track vital signs with precision.",
    full: "Through our partnership with industry-leading suppliers, we offer state-of-the-art patient monitoring and critical care solutions. These systems enable specialists to monitor patient vital signs accurately and consistently — including Patient Monitors, Pulse Oximeters, and Blood Pressure Machines.",
    image: IMAGES.patientMonitoring,
    products: ["Patient Monitors", "Pulse Oximeters", "BP Machines"],
  },
  {
    icon: BedDouble,
    title: "Hospital Room Solutions",
    short:
      "Premium hospital furniture that enhances patient experience and healthcare worker efficiency.",
    full: "Hospital furniture in the healthcare environment plays a significant role in facilitating great patient experience and an easy working environment for healthcare workers. We provide solutions which enhance ambience within hospitals, providing utmost care and comfort to patients and staff.",
    image: IMAGES.hospitalRoom,
    products: ["Hospital Beds", "Bedside Tables", "Medical Curtains"],
  },
  {
    icon: HeartPulse,
    title: "Renal Care Systems",
    short:
      "Complete integrated solutions for chronic kidney and end-stage renal disease treatment.",
    full: "We offer one-stop solutions for healthcare providers with complete, integrated systems for the treatment of chronic kidney disease (CKD) and end-stage renal disease (ESRD). Our offerings range from advanced hemodialysis machines to high-quality consumables, designed to enhance treatment efficiency and patient comfort.",
    image: IMAGES.renalCare,
    products: ["Hemodialysis Machines", "Consumables", "Disposables"],
  },
  {
    icon: Droplets,
    title: "RO Water Treatment",
    short:
      "Medical-grade water purification meeting AAMI and ISO 13959 standards.",
    full: "Recognizing that water quality is the cornerstone of safe and effective dialysis, we provide state-of-the-art RO water treatment systems engineered for hemodialysis and laboratory applications, meeting strict AAMI and ISO 13959 water quality standards.",
    image: IMAGES.roWater,
    products: ["Hemodialysis RO", "Lab Purification", "Ultrapure Water"],
  },
  {
    icon: Baby,
    title: "Neonatal Care",
    short:
      "Life-sustaining neonatal technology empowering caregivers for newborn care.",
    full: "We provide neonatal care technology that empowers caregivers to deliver non-invasive, life-sustaining care to babies while allowing them to function efficiently and effectively, providing maximum comfort to infants.",
    image: IMAGES.neonatal,
    products: ["Incubators", "Warmers", "Phototherapy"],
  },
  {
    icon: Scissors,
    title: "Surgical Room",
    short:
      "Comprehensive operating room equipment portfolio for modern surgical environments.",
    full: "We supply a comprehensive portfolio of operating room equipment including operating tables, surgical lights, anesthesia machines and other life-support equipment to enable world-class surgical procedures.",
    image: IMAGES.surgical,
    products: ["Operating Tables", "Surgical Lights", "Anesthesia Machines"],
  },
  {
    icon: Microscope,
    title: "Laboratory Solutions",
    short:
      "Advanced diagnostic laboratory equipment for precise clinical analysis.",
    full: "We supply and provide various laboratory equipment including hematology analyzers, clinical chemistry systems, immunoassay equipment, centrifuges, deep freezers, and biosafety equipment for modern diagnostic laboratories.",
    image: IMAGES.laboratory,
    products: [
      "Hematology Analyzers",
      "Chemistry Systems",
      "Biosafety Equipment",
    ],
  },
  {
    icon: TestTube2,
    title: "Clinical & Diagnostic Supplies",
    short:
      "Essential consumables and diagnostic products for clinical examination and testing.",
    full: "Clinical and diagnostic consumable products are one-time or limited-use items used during testing or clinical examination. We provide a wide variety of products including powdered and non-powdered gloves, pipettes, gowns, surgical masks, and more.",
    image: IMAGES.clinicalSupplies,
    products: ["Gloves", "Pipettes", "Surgical Masks"],
  },
  {
    icon: Bone,
    title: "Orthopedic Instruments & Implants",
    short:
      "Comprehensive orthopedic solutions spanning trauma, reconstruction, and sports medicine.",
    full: "We specialize in the supply and distribution of comprehensive orthopedic solutions across key specialties including Trauma & Extremities, Joint Reconstruction, Spine solutions, Sports Medicine, and precision Surgical Instruments.",
    image: IMAGES.orthopedic,
    products: ["Trauma Systems", "Joint Implants", "Spine Solutions"],
  },
  {
    icon: Trash2,
    title: "Hospital Waste Management",
    short:
      "Integrated on-site treatment systems for safe medical waste disposal.",
    full: "Through strategic partnerships with Celitron (Hungary) and MACS Solutions (Germany), we offer advanced technologies that transform hazardous waste into safe, non-infectious material while significantly reducing volume and operational costs.",
    image: IMAGES.wasteManagement,
    products: ["Autoclave Systems", "Liquid Waste", "Solid Waste Treatment"],
  },
];

function SolutionCard({ solution, index, onSelect }) {
  const isLarge = index === 0 || index === 4 || index === 8;

  return (
    <ScrollReveal
      delay={Math.min(index * 0.06, 0.3)}
      className={isLarge ? "md:col-span-2 lg:col-span-2" : ""}
    >
      <motion.div
        whileHover={{ y: -5 }}
        onClick={() => onSelect(solution)}
        className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-navy/5 hover:shadow-2xl hover:shadow-cyan/8 transition-all duration-500 h-full"
      >
        <div
          className={`relative overflow-hidden ${isLarge ? "h-56 sm:h-64" : "h-48"}`}
        >
          <img
            src={solution.image}
            alt={solution.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="glass rounded-lg p-1.5">
                    <solution.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  {solution.title}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-cyan transition-all shrink-0">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-navy/60 text-sm leading-relaxed mb-3">
            {solution.short}
          </p>
          <div className="flex flex-wrap gap-2">
            {solution.products.map((p) => (
              <span
                key={p}
                className="text-xs bg-surgical text-navy/60 px-2.5 py-1 rounded-full font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

function SolutionModal({ solution, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64">
          <img
            src={solution.image}
            alt={solution.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <X className="w-5 h-5 text-navy" />
          </button>
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan flex items-center justify-center">
              <solution.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{solution.title}</h3>
          </div>
        </div>
        <div className="p-8">
          <p className="text-navy/70 leading-relaxed text-base mb-6">
            {solution.full}
          </p>
          <div>
            <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-3">
              Key Products
            </h4>
            <div className="flex flex-wrap gap-2">
              {solution.products.map((p) => (
                <span
                  key={p}
                  className="bg-surgical text-navy px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-surgical">
            <div className="flex flex-wrap gap-3">
              <a
                href={`/solutions/${solution.slug}`}
                className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy/90 transition-all"
              >
                View Full Page
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/contact"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-cyan text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/20"
              >
                Request Information
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SolutionsSection({ items = [] }) {
  const [selected, setSelected] = useState(null);
  const solutionIcons = [
    Monitor,
    BedDouble,
    HeartPulse,
    Droplets,
    Baby,
    Scissors,
    Microscope,
    TestTube2,
    Bone,
    Trash2,
  ];
  const solutions =
    items.length > 0
      ? items.map((item, index) => ({
          icon: solutionIcons[index % solutionIcons.length],
          slug: item.slug,
          title: item.name,
          short: item.short_description,
          full: item.description || item.short_description,
          image:
            resolveAssetUrl(item.thumbnail) ||
            fallbackSolutions[index % fallbackSolutions.length].image,
          products: item.tags || [],
        }))
      : fallbackSolutions.map((item) => ({
          ...item,
          slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        }));

  return (
    <section
      id="solutions"
      className="py-24 lg:py-32 bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={IMAGES.patientMonitoring}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.08] blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-cyan/5" />
      </div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan/3 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              Our Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight">
              Solutions & Products
            </h2>
            <p className="text-navy/50 mt-4 text-lg max-w-2xl mx-auto">
              Comprehensive medical solutions spanning critical care,
              diagnostics, surgery, and infrastructure — trusted by healthcare
              facilities across East Africa.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((sol, i) => (
            <SolutionCard
              key={sol.title}
              solution={sol}
              index={i}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <SolutionModal
            solution={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
