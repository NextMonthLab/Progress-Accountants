export async function smartFetch(path: string, options: RequestInit = {}) {
  const tenantId = "progress-accountants-uk";
  
  // Use local endpoints directly since external SmartSite Admin Panel requires proper credentials
  const baseUrl = "http://localhost:5000";
  const fullUrl = `${baseUrl}${path.replace(":tenantId", tenantId)}`;

  console.log('SmartFetch attempting:', fullUrl);
  console.log('SmartFetch options:', options);

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    console.log('SmartFetch response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('SmartFetch error response:', errorText);
      throw new Error(`HTTP ${res.status}: ${res.statusText} - ${fullUrl}`);
    }

    const result = await res.json();
    console.log('SmartFetch success result:', result);
    return result;
  } catch (error) {
    console.error('SmartFetch caught error:', error);
    throw error;
  }
}