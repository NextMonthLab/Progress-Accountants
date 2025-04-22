// Advanced Page Builder - Types and Interfaces
import { PageMetadata, PageSeoMetadata, ComplexityLevel } from './page_metadata';

// Define component types available in the page builder
export type ComponentType = 
  // Content components
  | 'heading' 
  | 'paragraph' 
  | 'rich-text'
  | 'image' 
  | 'video' 
  | 'gallery'
  | 'quote'
  | 'list'
  
  // Layout components
  | 'section' 
  | 'container'
  | 'columns' 
  | 'card' 
  | 'tabs'
  | 'accordion'
  
  // Interactive components
  | 'button' 
  | 'form' 
  | 'cta'
  | 'map'
  | 'testimonial'
  | 'pricing-table'
  
  // Business-specific components
  | 'team-member'
  | 'service-card'
  | 'faq-item'
  | 'contact-info'
  | 'social-links'
  | 'progress-bar'
  | 'calculator'
  | 'custom-tool';

// Context-awareness classification
export type ComponentContext = 
  | 'universal' // Works everywhere
  | 'industry-specific' // Only appropriate for specific industries
  | 'brand-sensitive' // Requires brand customization
  | 'data-driven'; // Requires business data

// SEO impact classification
export type SeoImpactLevel = 'high' | 'medium' | 'low' | 'none';

// Component base properties
export interface ComponentBase {
  id: string;
  type: ComponentType;
  label?: string;
  context: ComponentContext;
  hidden?: boolean;
  seoImpact: SeoImpactLevel;
  settings: Record<string, any>;
  analytics?: {
    impressions?: number;
    clicks?: number;
    conversionRate?: number;
  };
}

// Content component specific properties
export interface ContentComponent extends ComponentBase {
  content: any;
  metadata?: {
    alt?: string;
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// Container component that can hold other components
export interface ContainerComponent extends ComponentBase {
  children: PageBuilderComponent[];
  layout?: 'vertical' | 'horizontal' | 'grid' | 'custom';
  columns?: number;
  gap?: number;
}

// Union type of all component types
export type PageBuilderComponent = ContentComponent | ContainerComponent;

// Page section (top-level organization)
export interface PageSection {
  id: string;
  name: string;
  description?: string;
  components: PageBuilderComponent[];
  order: number;
  settings: {
    background?: {
      color?: string;
      image?: string;
      overlay?: string;
    };
    padding?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    fullWidth?: boolean;
    minHeight?: number;
  };
  seoWeight: number; // How important this section is for SEO (1-10)
}

// Page template definition
export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  industry?: string[];
  purpose?: string;
  defaultSections: PageSection[];
  seoRecommendations: {
    title?: string;
    description?: string;
    headings?: string[];
    keywords?: string[];
    suggestedComponents?: ComponentType[];
  };
  complexity: ComplexityLevel;
}

// Complete page definition
export interface PageBuilderDefinition {
  id: string;
  name: string;
  slug: string;
  template?: string; // Reference to a template ID if used
  sections: PageSection[];
  metadata: PageMetadata;
  seo: PageSeoMetadata & {
    performance: {
      score?: number;
      suggestions?: string[];
      keywordDensity?: Record<string, number>;
      readabilityScore?: number;
      mobileOptimized?: boolean;
    };
  };
  businessContext: {
    industry: string;
    targetAudience: string[];
    purpose: string;
    conversionGoals?: string[];
  };
  analytics?: {
    views: number;
    averageTimeOnPage: number;
    bounceRate: number;
    conversionRate: number;
  };
  version: number;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  createdBy: number;
}

// Current state of the builder (for editing)
export interface PageBuilderState {
  page: PageBuilderDefinition;
  selectedComponentId?: string;
  selectedSectionId?: string;
  undoStack: PageBuilderDefinition[];
  redoStack: PageBuilderDefinition[];
  savedState?: PageBuilderDefinition;
  previewMode: boolean;
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  notifications: {
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    dismissed: boolean;
  }[];
  aiSuggestions?: {
    seo: string[];
    content: string[];
    structure: string[];
    components: string[];
  };
}

// Recommendation from AI for improving the page
export interface PageBuilderRecommendation {
  id: string;
  type: 'seo' | 'content' | 'structure' | 'performance';
  severity: 'suggestion' | 'recommendation' | 'critical';
  message: string;
  details?: string;
  affectedComponents?: string[];
  improvement?: string;
  autoFixAvailable: boolean;
}

// Types for the import/export functionality
export interface PageBuilderExport {
  version: string;
  pages: PageBuilderDefinition[];
  templates: PageTemplate[];
  components: ComponentBase[];
  exportedAt: Date;
  exportedBy: number;
}

// Interface for component library item
export interface ComponentLibraryItem {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  thumbnail?: string;
  defaultSettings: Record<string, any>;
  seoImpact: SeoImpactLevel;
  context: ComponentContext[];
  recommended: boolean;
  premium: boolean;
  complexity: ComplexityLevel;
}