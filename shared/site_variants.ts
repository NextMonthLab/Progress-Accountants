/**
 * Site Variants Configuration
 * 
 * This file defines the different site variants available when cloning a NextMonth template.
 * Each variant has specific features enabled or disabled based on the user's selection.
 */

// Website Usage Types
export enum WebsiteUsageType {
  FULL_BUILDER = 'full_builder',       // Full Website Builder
  TOOLS_ONLY = 'tools_only'            // Content Tools Only (No Website Builder)
}

// User Types
export enum UserType {
  SOLO_ENTREPRENEUR = 'solo_entrepreneur', // Solo Entrepreneur
  TEAM = 'team'                            // Team
}

// Site Variant Configuration
export interface SiteVariantConfig {
  id: string;
  name: string;
  description: string;
  websiteUsageType: WebsiteUsageType;
  userType: UserType;
  features: {
    websiteBuilder: boolean;
    pageCreator: boolean;
    foundationSetup: boolean;
    blogGenerator: boolean;
    contentGenerator: boolean;
    cms: boolean;
    teamCollaboration: boolean;
    entrepreneurSupport: boolean;
    // Add other features as needed
  };
}

// Predefined Site Variants
export const SITE_VARIANTS: SiteVariantConfig[] = [
  {
    id: 'full-builder-solo',
    name: 'Full Website Builder - Solo Entrepreneur',
    description: 'Complete website building tools optimized for solo entrepreneurs.',
    websiteUsageType: WebsiteUsageType.FULL_BUILDER,
    userType: UserType.SOLO_ENTREPRENEUR,
    features: {
      websiteBuilder: true,
      pageCreator: true,
      foundationSetup: true,
      blogGenerator: true,
      contentGenerator: true,
      cms: true,
      teamCollaboration: false,
      entrepreneurSupport: true
    }
  },
  {
    id: 'full-builder-team',
    name: 'Full Website Builder - Team',
    description: 'Complete website building tools with team collaboration features.',
    websiteUsageType: WebsiteUsageType.FULL_BUILDER,
    userType: UserType.TEAM,
    features: {
      websiteBuilder: true,
      pageCreator: true,
      foundationSetup: true,
      blogGenerator: true,
      contentGenerator: true,
      cms: true,
      teamCollaboration: true,
      entrepreneurSupport: false
    }
  },
  {
    id: 'tools-only-solo',
    name: 'Content Tools Only - Solo Entrepreneur',
    description: 'Content generation tools without website building, optimized for solo entrepreneurs.',
    websiteUsageType: WebsiteUsageType.TOOLS_ONLY,
    userType: UserType.SOLO_ENTREPRENEUR,
    features: {
      websiteBuilder: false,
      pageCreator: false,
      foundationSetup: false,
      blogGenerator: true,
      contentGenerator: true,
      cms: true,
      teamCollaboration: false,
      entrepreneurSupport: true
    }
  },
  {
    id: 'tools-only-team',
    name: 'Content Tools Only - Team',
    description: 'Content generation tools without website building, with team collaboration features.',
    websiteUsageType: WebsiteUsageType.TOOLS_ONLY,
    userType: UserType.TEAM,
    features: {
      websiteBuilder: false,
      pageCreator: false,
      foundationSetup: false,
      blogGenerator: true,
      contentGenerator: true,
      cms: true,
      teamCollaboration: true,
      entrepreneurSupport: false
    }
  }
];

// Helper function to get a variant by its ID
export function getVariantById(id: string): SiteVariantConfig | undefined {
  return SITE_VARIANTS.find(variant => variant.id === id);
}

// Helper function to get a variant by usage type and user type
export function getVariantByTypes(websiteUsageType: WebsiteUsageType, userType: UserType): SiteVariantConfig | undefined {
  return SITE_VARIANTS.find(
    variant => variant.websiteUsageType === websiteUsageType && variant.userType === userType
  );
}