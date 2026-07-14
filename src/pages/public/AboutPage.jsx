import React from "react";
import AboutSection from "@/components/kasmed/AboutSection";
import PublicPageLayout from "@/components/kasmed/PublicPageLayout";
import { usePublicContent } from "@/hooks/use-public-content";
import { IMAGES } from "@/lib/images";

export default function AboutPage() {
  const { content } = usePublicContent();
  return (
    <PublicPageLayout
      content={content}
      eyebrow="Who We Are"
      title="About KASMED"
      description="A trusted East African healthcare partner connecting facilities with dependable medical technologies, service, and expertise."
      image={IMAGES.about}
    >
      <AboutSection />
    </PublicPageLayout>
  );
}

