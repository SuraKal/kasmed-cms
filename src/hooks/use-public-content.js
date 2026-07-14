import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export const EMPTY_PUBLIC_CONTENT = {
  engagements: [],
  solutions: [],
  values: [],
  suppliers: [],
  clients: [],
  customers: [],
  gallery: [],
  settings: null,
};

export function usePublicContent() {
  const [content, setContent] = useState(EMPTY_PUBLIC_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/api/content")
      .then(setContent)
      .catch(() => setContent(EMPTY_PUBLIC_CONTENT))
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}
