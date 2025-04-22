// Page metadata types for classification and SEO

export type PageAccessType = 'internal' | 'external';
export type PageType = 'core' | 'custom' | 'automation';

export interface PageSeoMetadata {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  primaryKeyword?: string;
  seoGoal?: 'local' | 'industry' | 'conversion' | 'technical';
}

export interface PageMetadata {
  path: string;
  title: string;
  access: PageAccessType;
  seo: PageSeoMetadata;
  page_type: PageType;
  order?: number; // For navigation ordering
  parent?: string; // For hierarchical navigation
  icon?: string; // For navigation icons
  showInNav?: boolean; // Whether to show in navigation
  authentication?: boolean; // Whether authentication is required
}

// Define the complexity levels for page triage
export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'wishlist';

// Interface for page complexity assessment
export interface PageComplexityAssessment {
  visualComplexity: number; // 1-10 score
  logicComplexity: number; // 1-10 score
  dataComplexity: number; // 1-10 score
  estimatedHours: number;
  complexityLevel: ComplexityLevel;
  aiAssessment: string; // Detailed AI analysis
  triageTimestamp: Date;
}