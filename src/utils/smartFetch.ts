// Static frontend - no API calls needed
export const smartFetch = async (url: string, options?: RequestInit) => {
  throw new Error("API calls not available in static frontend");
};