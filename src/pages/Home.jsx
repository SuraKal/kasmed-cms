import React from "react";
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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <SolutionsSection />
      <ValuesSection />
      <PartnersSection />
      <GallerySection />
      <ContactSection />
      <Footer />
      <FloatingActions />
    </div>
  );
}