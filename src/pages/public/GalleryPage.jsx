import React from "react";
import GallerySection from "@/components/kasmed/GallerySection";
import PublicPageLayout from "@/components/kasmed/PublicPageLayout";
import { usePublicContent } from "@/hooks/use-public-content";
import { IMAGES } from "@/lib/images";

export default function GalleryPage() {
  const { content } = usePublicContent();
  return (
    <PublicPageLayout
      content={content}
      eyebrow="Our Work"
      title="KASMED Gallery"
      description="A closer look at the technologies, installations, clinical environments, and partnerships behind our work."
      image={IMAGES.installation}
    >
      <GallerySection items={content.gallery} />
    </PublicPageLayout>
  );
}

