/**
 * Site Branding Interface
 * 
 * Defines the structure for site-wide branding settings
 * that can be customized by administrators
 */

// Site branding interface
export interface SiteBranding {
  logo: {
    imageUrl: string | null;
    altText: string;
    text: string;  // Used when imageUrl is not available
  };
  favicon: {
    url: string | null;
  };
  meta: {
    siteTitle: string;
    titleSeparator: string;
    defaultDescription: string;
    socialImage: string | null;
  };
  colors: {
    primary: string;
    secondary: string;
  };
}

// Default site branding settings
export const defaultSiteBranding: SiteBranding = {
  logo: {
    imageUrl: null,
    altText: "Progress Accountants Logo",
    text: "Progress Accountants",
  },
  favicon: {
    url: null,
  },
  meta: {
    siteTitle: "Progress Accountants",
    titleSeparator: " | ",
    defaultDescription: "Professional accounting services for modern businesses.",
    socialImage: null,
  },
  colors: {
    primary: "#0e2d52", // Navy
    secondary: "#f47e3e", // Burnt Orange
  }
};