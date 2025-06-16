export async function smartFetch(path: string, options: RequestInit = {}) {
  const tenantId = "progress-accountants-uk";
  
  // Use local endpoints directly since external SmartSite Admin Panel requires proper credentials
  const baseUrl = "http://localhost:5000";
  const fullUrl = `${baseUrl}${path.replace(":tenantId", tenantId)}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText} - ${fullUrl}`);
  }

  return res.json();
}