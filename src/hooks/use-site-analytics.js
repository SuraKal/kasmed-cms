import { useEffect } from "react";
import { apiRequest } from "@/lib/api";

const SESSION_KEY = "kasmed_analytics_session";

function getSessionId() {
  let sessionId = window.sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId =
      window.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function recordEvent(event) {
  void apiRequest("/api/analytics/events", {
    method: "POST",
    body: JSON.stringify({
      ...event,
      session_id: getSessionId(),
      path: window.location.pathname,
    }),
  }).catch(() => {
    // Analytics must never interrupt the public experience.
  });
}

export function useSiteAnalytics() {
  useEffect(() => {
    recordEvent({ event_type: "page_view", label: document.title });

    const viewedSections = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          if (entry.isIntersecting && sectionId && !viewedSections.has(sectionId)) {
            viewedSections.add(sectionId);
            recordEvent({
              event_type: "section_view",
              resource: sectionId,
              label: sectionId,
            });
          }
        });
      },
      { threshold: 0.35 },
    );

    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));

    const handleClick = (event) => {
      const target = event.target.closest("a, button");
      if (!target) return;
      const label =
        target.dataset.analyticsLabel ||
        target.getAttribute("aria-label") ||
        target.textContent?.replace(/\s+/g, " ").trim();
      if (!label) return;
      recordEvent({
        event_type: "click",
        resource: target.closest("section[id]")?.id || "navigation",
        label: label.slice(0, 255),
        event_data: {
          href: target.getAttribute("href") || "",
        },
      });
    };

    document.addEventListener("click", handleClick);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleClick);
    };
  }, []);
}

