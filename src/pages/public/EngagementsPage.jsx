import React from "react";
import ServicesSection from "@/components/kasmed/ServicesSection";
import PublicPageLayout from "@/components/kasmed/PublicPageLayout";
import { usePublicContent } from "@/hooks/use-public-content";
import { IMAGES } from "@/lib/images";

export default function EngagementsPage() {
  const { content } = usePublicContent();
  return (
    <PublicPageLayout
      content={content}
      eyebrow="What We Do"
      title="Areas of Engagement"
      description="From international sourcing to after-sales engineering, KASMED supports the complete lifecycle of healthcare technology."
      image={IMAGES.distribution}
    >
      <ServicesSection items={content.engagements} />
    </PublicPageLayout>
  );
}

