export async function smartFetch(path: string, options: RequestInit = {}) {
  const tenantId = "progress-accountants-uk";
  // @ts-ignore - Vite environment variable handling
  const baseUrl = import.meta.env.VITE_ADMIN_API || "http://localhost:5000";
  const fullUrl = `${baseUrl}${path.replace(":tenantId", tenantId)}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    console.error("Fetch failed:", res.status, fullUrl);
  }

  return res.json();
}