import { FeedSettings, InsertFeedSettings } from "@shared/schema";
import { apiRequest } from "./queryClient";

export interface FeedSetupInstructions {
  cnameRecord: {
    name: string;
    value: string;
    type: string;
  };
  iframeEmbed: string;
  jsSnippet: string;
  setupSteps: string[];
}

// Get current feed settings for a tenant
export async function getFeedSettings(): Promise<FeedSettings | null> {
  const response = await apiRequest("GET", "/api/feed/settings");
  if (response.status === 404) return null;
  return response.json();
}

// Update feed settings
export async function updateFeedSettings(settings: Partial<InsertFeedSettings>): Promise<FeedSettings> {
  const response = await apiRequest("PATCH", "/api/feed/settings", settings);
  return response.json();
}

// Sync branding with feed
export async function syncBrandingWithFeed(): Promise<{ success: boolean; message: string }> {
  const response = await apiRequest("POST", "/api/feed/sync-branding");
  return response.json();
}

// Generate setup instructions for custom subdomain
export async function generateSetupInstructions(subdomain: string): Promise<FeedSetupInstructions> {
  const response = await apiRequest("POST", "/api/feed/setup-instructions", { subdomain });
  return response.json();
}

// Get public feed URL
export async function getFeedUrl(): Promise<{ url: string; isActive: boolean }> {
  const response = await apiRequest("GET", "/api/feed/url");
  return response.json();
}

// Test feed deployment status
export async function testFeedDeployment(): Promise<{ status: string; message: string; url?: string }> {
  const response = await apiRequest("GET", "/api/feed/test-deployment");
  return response.json();
}

// Get available topics for autopilot
export async function getAvailableTopics(): Promise<{ id: string; name: string; category: string }[]> {
  const response = await apiRequest("GET", "/api/feed/topics");
  return response.json();
}