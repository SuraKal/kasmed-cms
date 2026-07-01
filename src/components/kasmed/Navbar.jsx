import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

const LOGO_LIGHT = "/images/logo/logo_light.png";
const LOGO_DARK = "/images/logo/logo_dark.png";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Solutions", href: "#solutions" },
  { label: "Services", href: "#services" },
  { label: "Suppliers", href: "#partners" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-lg shadow-navy/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 group">
            <img
              src={scrolled ? LOGO_DARK : LOGO_LIGHT}
              alt={SITE_CONFIG.name}
              className={`block w-auto object-contain transition-all duration-300 ${
                scrolled ? "h-11" : "h-12"
              }`}
            />
            
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-cyan/10 ${
                  scrolled
                    ? "text-navy/80 hover:text-navy"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, "")}`}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                scrolled ? "text-navy/70" : "text-white/70"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">{SITE_CONFIG.phone}</span>
            </a>
            <a
              href="#contact"
              className="bg-cyan text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/20 hover:shadow-cyan/30 hover:-translate-y-0.5"
            >
              Get in Touch
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-navy" : "text-white"}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-navy/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                    <img
                      src={LOGO_DARK}
                      alt={SITE_CONFIG.name}
                      className="block h-10 w-auto object-contain"
                    />
                    
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-surgical text-navy"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-navy/80 font-medium rounded-lg hover:bg-surgical hover:text-navy transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-surgical">
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-2 text-navy/70 mb-4 px-4"
                  >
                    <Phone className="w-4 h-4" />
                    {SITE_CONFIG.phone}
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setMobileOpen(false)}
                    className="block bg-cyan text-white text-center px-5 py-3 rounded-lg font-semibold"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
