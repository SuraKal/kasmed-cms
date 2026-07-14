import React from "react";
import SolutionsSection from "@/components/kasmed/SolutionsSection";
import PublicPageLayout from "@/components/kasmed/PublicPageLayout";
import { usePublicContent } from "@/hooks/use-public-content";
import { IMAGES } from "@/lib/images";

export default function SolutionsPage() {
  const { content } = usePublicContent();
  return (
    <PublicPageLayout
      content={content}
      eyebrow="Our Portfolio"
      title="Solutions & Products"
      description="Explore integrated medical technologies and supplies designed for modern healthcare facilities across East Africa."
      image={IMAGES.patientMonitoring}
    >
      <SolutionsSection items={content.solutions} />
    </PublicPageLayout>
  );
}

