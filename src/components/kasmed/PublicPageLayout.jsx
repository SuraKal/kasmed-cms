import React from "react";
import Navbar from "@/components/kasmed/Navbar";
import InteriorHero from "@/components/kasmed/InteriorHero";
import Footer from "@/components/kasmed/Footer";
import FloatingActions from "@/components/kasmed/FloatingActions";
import { useSiteAnalytics } from "@/hooks/use-site-analytics";

export default function PublicPageLayout({
  content,
  eyebrow,
  title,
  description,
  image,
  children,
}) {
  useSiteAnalytics();

  return (
    <div className="min-h-screen bg-white">
      <Navbar settings={content.settings} />
      <InteriorHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        image={image}
      />
      <main>{children}</main>
      <Footer settings={content.settings} solutionsData={content.solutions} />
      <FloatingActions settings={content.settings} />
    </div>
  );
}
