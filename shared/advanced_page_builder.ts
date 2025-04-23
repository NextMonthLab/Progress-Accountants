// Advanced Page Builder Interfaces

export interface PageBuilderComponent {
  id: number;
  name: string;
  type: string;
  sectionId: number;
  order: number;
  content: Record<string, any>;
  style?: Record<string, any>;
  customCSS?: string;
  customId?: string;
  customClass?: string;
  hidden?: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Allow string indexing
}

export interface PageBuilderSection {
  id: number;
  pageId: number;
  name: string;
  type: string;
  order: number;
  components: PageBuilderComponent[];
  style?: Record<string, any>;
  customCSS?: string;
  customId?: string;
  customClass?: string;
  hidden?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageBuilderPage {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sections: PageBuilderSection[];
  isPublished: boolean;
  publishedAt?: string;
  seoMetadata?: PageSeoMetadata;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
}

export interface PageSeoMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

export interface PageBuilderTemplate {
  id: number;
  name: string;
  description: string;
  thumbnail?: string;
  category: string;
  sections: PageBuilderSection[];
  isDefault?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageBuilderRecommendation {
  id: number;
  pageType: string;
  businessType: string;
  recommendations: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PageVersionHistory {
  id: number;
  pageId: number;
  version: number;
  snapshot: PageBuilderPage;
  changes: string[];
  userId: number;
  username: string;
  createdAt: string;
}