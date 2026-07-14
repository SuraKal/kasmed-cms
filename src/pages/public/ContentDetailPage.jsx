import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PublicPageLayout from "@/components/kasmed/PublicPageLayout";
import { apiRequest, resolveAssetUrl } from "@/lib/api";
import { usePublicContent } from "@/hooks/use-public-content";
import { IMAGES } from "@/lib/images";

const TYPE_CONFIG = {
  engagements: {
    eyebrow: "Area of Engagement",
    backLabel: "All Areas of Engagement",
    backPath: "/engagements",
    fallbackImage: IMAGES.distribution,
  },
  solutions: {
    eyebrow: "Solution & Product",
    backLabel: "All Solutions & Products",
    backPath: "/solutions",
    fallbackImage: IMAGES.patientMonitoring,
  },
};

export default function ContentDetailPage({ type }) {
  const { slug } = useParams();
  const { content } = usePublicContent();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const config = TYPE_CONFIG[type];

  useEffect(() => {
    setItem(null);
    setNotFound(false);
    apiRequest(`/api/content/${type}/${slug}`)
      .then(setItem)
      .catch(() => setNotFound(true));
  }, [slug, type]);

  const title = item?.name || (notFound ? "Content Not Found" : "Loading…");
  const description =
    item?.short_description ||
    item?.description ||
    "Loading the requested KASMED content.";
  const image =
    resolveAssetUrl(item?.thumbnail) || config.fallbackImage;

  return (
    <PublicPageLayout
      content={content}
      eyebrow={config.eyebrow}
      title={title}
      description={description}
      image={image}
    >
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {notFound ? (
            <div className="rounded-3xl bg-surgical p-10 text-center">
              <h2 className="text-2xl font-bold text-navy">
                This content is unavailable.
              </h2>
              <Link
                to={config.backPath}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-3 font-semibold text-white"
              >
                <ArrowLeft className="h-4 w-4" /> {config.backLabel}
              </Link>
            </div>
          ) : item ? (
            <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
              <article>
                <Link
                  to={config.backPath}
                  className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:text-navy"
                >
                  <ArrowLeft className="h-4 w-4" /> {config.backLabel}
                </Link>
                <h2 className="text-3xl font-extrabold tracking-tight text-navy">
                  {item.name}
                </h2>
                <div className="mt-7 space-y-5 text-lg leading-8 text-navy/65">
                  <p>{item.description || item.short_description}</p>
                </div>
                {item.tags?.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-navy">
                      Key Products
                    </h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {item.tags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-3 rounded-xl bg-surgical px-4 py-3 text-sm font-medium text-navy"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan" />
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
              <aside>
                <div className="sticky top-28 overflow-hidden rounded-3xl bg-navy p-7 text-white shadow-xl">
                  <p className="text-sm font-semibold uppercase tracking-widest text-cyan">
                    Need More Information?
                  </p>
                  <h3 className="mt-4 text-2xl font-bold">
                    Let’s discuss your requirements.
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-white/55">
                    Our team can help with product selection, supply, installation,
                    training, and technical support.
                  </p>
                  <Link
                    to="/contact"
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan px-5 py-3 font-semibold text-white"
                  >
                    Contact Our Team <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </aside>
            </div>
          ) : (
            <div className="rounded-3xl bg-surgical p-10 text-center text-navy/50">
              Loading content…
            </div>
          )}
        </div>
      </section>
    </PublicPageLayout>
  );
}
