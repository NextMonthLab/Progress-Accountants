export async function smartFetch(path: string, options: RequestInit = {}) {
  const tenantId = "progress-accountants-uk";
  // @ts-ignore - Vite environment variable handling
  const baseUrl = import.meta.env.VITE_ADMIN_API || "http://localhost:5000";
  const fullUrl = `${baseUrl}${path.replace(":tenantId", tenantId)}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText, fullUrl);
      
      // If external SmartSite Admin Panel is unreachable, try local fallback
      if (baseUrl.includes('smartsite-admin.repl.co')) {
        console.log("Trying local fallback for:", path);
        const localUrl = `http://localhost:5000${path.replace(":tenantId", tenantId)}`;
        const localRes = await fetch(localUrl, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
        });
        
        if (localRes.ok) {
          return localRes.json();
        }
      }
      
      throw new Error(`HTTP ${res.status}: ${res.statusText} - ${fullUrl}`);
    }

    return res.json();
  } catch (error) {
    console.error("SmartFetch error:", error);
    console.error("Failed URL:", fullUrl);
    throw error;
  }
}