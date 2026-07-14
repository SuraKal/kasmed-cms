import React from "react";
import ContactSection from "@/components/kasmed/ContactSection";
import PublicPageLayout from "@/components/kasmed/PublicPageLayout";
import { usePublicContent } from "@/hooks/use-public-content";
import { IMAGES } from "@/lib/images";

export default function ContactPage() {
  const { content } = usePublicContent();
  return (
    <PublicPageLayout
      content={content}
      eyebrow="Start a Conversation"
      title="Contact KASMED"
      description="Speak with our team about equipment, supplies, technical service, partnerships, or your facility’s next healthcare project."
      image={IMAGES.team}
    >
      <ContactSection settings={content.settings} />
    </PublicPageLayout>
  );
}

