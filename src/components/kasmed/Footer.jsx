import React from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

const LOGO_LIGHT = "/images/logo/logo_light.png";

const quickLinks = [
  { label: "About Us", href: "#about" },
  { label: "Solutions", href: "#solutions" },
  { label: "Services", href: "#services" },
  { label: "Core Values", href: "#values" },
  { label: "Suppliers", href: "#partners" },
  { label: "Clients", href: "#clients" },
  { label: "Customers", href: "#customers" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const solutions = [
  "Patient Monitoring",
  "Renal Care",
  "Neonatal Care",
  "Surgical Room",
  "Laboratory",
  "Orthopedics",
];

export default function Footer({ settings, solutionsData = [] }) {
  const companyName = settings?.company_name || SITE_CONFIG.name;
  const phone = settings?.phone_primary || SITE_CONFIG.phone;
  const email = settings?.email_primary || SITE_CONFIG.email;
  const addressLines =
    settings?.address_text?.split("\n").filter(Boolean) || SITE_CONFIG.addressLines;
  const displayedSolutions = solutionsData.length
    ? solutionsData.slice(0, 6).map((item) => item.name)
    : solutions;
  const socialIcons = {
    facebook: Facebook,
    linkedin: Linkedin,
    instagram: Instagram,
    x: Twitter,
  };
  const socialLinks = Object.entries(settings?.social_links || {}).filter(
    ([, url]) => url,
  );

  return (
    <footer className="bg-[#060E20] text-white/60 pt-16 lg:pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={LOGO_LIGHT}
                alt={companyName}
                className="block h-11 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              {settings?.footer_description ||
                "Advancing healthcare across East Africa through world-class medical devices, innovative solutions, and dedicated service."}
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 text-sm hover:text-cyan transition-colors"
              >
                <Phone className="w-4 h-4" /> {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm hover:text-cyan transition-colors"
              >
                <Mail className="w-4 h-4" /> {email}
              </a>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{addressLines.join(", ")}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-cyan transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Solutions
            </h4>
            <ul className="space-y-3">
              {displayedSolutions.map((solution) => (
                <li key={solution}>
                  <a
                    href="#solutions"
                    className="text-sm hover:text-cyan transition-colors"
                  >
                    {solution}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Stay Connected
            </h4>
            <p className="text-sm mb-4">
              Get the latest updates on our healthcare solutions and products.
            </p>
            <a
              href="#contact"
              className="inline-block bg-cyan text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-cyan/90 transition-all"
            >
              Contact Us
            </a>
            {socialLinks.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socialLinks.map(([network, url]) => {
                  const Icon = socialIcons[network];
                  return Icon ? (
                    <a
                      key={network}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={network}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-cyan hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} {companyName}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#about"
              className="text-xs hover:text-cyan transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#about"
              className="text-xs hover:text-cyan transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
