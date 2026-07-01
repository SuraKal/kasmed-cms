const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (
      response.status === 401 &&
      path !== "/api/auth/login" &&
      typeof window !== "undefined"
    ) {
      window.dispatchEvent(new Event("kasmed:authentication-required"));
    }
    const error = new Error(data.error || "Request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}

export function resolveAssetUrl(path) {
  if (!path || /^(https?:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}

export async function uploadAdminImage(file, resource) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("resource", resource);
  return apiRequest("/api/admin/upload", {
    method: "POST",
    body: formData,
  });
}
