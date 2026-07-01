import React, { useEffect, useState } from "react";
import Navbar from "@/components/kasmed/Navbar";
import HeroSection from "@/components/kasmed/HeroSection";
import AboutSection from "@/components/kasmed/AboutSection";
import ServicesSection from "@/components/kasmed/ServicesSection";
import ValuesSection from "@/components/kasmed/ValuesSection";
import SolutionsSection from "@/components/kasmed/SolutionsSection";
import PartnersSection from "@/components/kasmed/PartnersSection";
import GallerySection from "@/components/kasmed/GallerySection";
import ContactSection from "@/components/kasmed/ContactSection";
import Footer from "@/components/kasmed/Footer";
import FloatingActions from "@/components/kasmed/FloatingActions";
import { apiRequest } from "@/lib/api";
import { useSiteAnalytics } from "@/hooks/use-site-analytics";

export default function Home() {
  const [content, setContent] = useState({});
  useSiteAnalytics();

  useEffect(() => {
    apiRequest("/api/content")
      .then(setContent)
      .catch(() => {
        // The existing static content remains available when the API is offline.
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar settings={content.settings} />
      <HeroSection />
      <AboutSection />
      <ServicesSection items={content.engagements} />
      <SolutionsSection items={content.solutions} />
      <ValuesSection items={content.values} />
      <PartnersSection
        suppliersData={content.suppliers}
        clientsData={content.clients}
        customersData={content.customers}
      />
      <GallerySection items={content.gallery} />
      <ContactSection settings={content.settings} />
      <Footer settings={content.settings} solutionsData={content.solutions} />
      <FloatingActions settings={content.settings} />
    </div>
  );
}
