import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Send, Clock, Building2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { SITE_CONFIG } from "@/lib/site-config";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#081830]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan/3 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-block text-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Contact Us
            </h2>
            <p className="text-white/40 mt-4 text-lg max-w-2xl mx-auto">
              Ready to elevate your healthcare facility? Let's discuss how
              KASMED can support your needs.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form */}
          <ScrollReveal direction="left" className="lg:col-span-3">
            <div className="glass-dark rounded-2xl p-6 sm:p-8 lg:p-10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-cyan" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-white/50">
                    We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white/60 text-sm font-medium mb-2 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm font-medium mb-2 block">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-white/60 text-sm font-medium mb-2 block">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
                        placeholder="+251..."
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm font-medium mb-2 block">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm font-medium mb-2 block">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-cyan text-white px-8 py-4 rounded-xl font-semibold hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25 hover:shadow-cyan/35 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* Contact info */}
          <ScrollReveal
            direction="right"
            delay={0.15}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {[
                {
                  icon: Building2,
                  title: "Head Office",
                  lines: SITE_CONFIG.addressLines,
                },
                {
                  icon: Phone,
                  title: "Phone",
                  lines: [SITE_CONFIG.phone],
                  href: `tel:${SITE_CONFIG.phone.replace(/\s+/g, "")}`,
                },
                {
                  icon: Mail,
                  title: "Email",
                  lines: [SITE_CONFIG.email],
                  href: `mailto:${SITE_CONFIG.email}`,
                },
                {
                  icon: Clock,
                  title: "Business Hours",
                  lines: [
                    "Mon – Fri: 8:30 AM – 5:30 PM",
                    "Sat: 9:00 AM – 1:00 PM",
                  ],
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 4 }}
                  className="glass-dark rounded-2xl p-6 flex gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-cyan/15 flex items-center justify-center shrink-0 group-hover:bg-cyan/25 transition-colors">
                    <item.icon className="w-5 h-5 text-cyan" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      {item.title}
                    </h4>
                    {item.lines.map((line) =>
                      item.href ? (
                        <a
                          key={line}
                          href={item.href}
                          className="text-white/50 text-sm hover:text-cyan transition-colors block"
                        >
                          {line}
                        </a>
                      ) : (
                        <p key={line} className="text-white/50 text-sm">
                          {line}
                        </p>
                      ),
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-white/10 h-48">
                <iframe
                  title="KASMED Location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=38.72%2C9.00%2C38.76%2C9.03&layer=mapnik&marker=9.015%2C38.74"
                  className="w-full h-full border-0 grayscale contrast-125 opacity-70"
                  loading="lazy"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
