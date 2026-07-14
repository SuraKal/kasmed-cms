import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { IMAGES } from "@/lib/images";

export default function InteriorHero({
  eyebrow,
  title,
  description,
  image = IMAGES.hero,
}) {
  return (
    <section id="page-hero" className="relative flex min-h-[55vh] items-end overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/30" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mb-7 flex items-center gap-2 text-sm text-white/50">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-cyan">
            <Home className="h-4 w-4" /> Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white/75">{title}</span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{description}</p>
        )}
      </div>
    </section>
  );
}

