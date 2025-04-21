import React from 'react';
import { Helmet } from 'react-helmet';
import { useBusinessIdentity } from '@/hooks/use-business-identity';
import { useQuery } from '@tanstack/react-query';

interface SEOHeadersProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  path?: string;
}

export function SEOHeaders({ 
  title, 
  description, 
  canonicalUrl,
  path
}: SEOHeadersProps) {
  const { businessIdentity } = useBusinessIdentity();
  const businessName = businessIdentity?.core?.businessName || 'Progress Accountants';
  
  // Try to fetch SEO config for this path if provided
  const { data: seoConfig } = useQuery({
    queryKey: ['/api/seo/configs/path', path],
    enabled: !!path,
  });

  // Use SEO config data or fallback to props
  const pageTitle = seoConfig?.title || title || businessName;
  const pageDescription = seoConfig?.description || description || `${businessName} - Professional Accounting Services`;
  const pageCanonical = seoConfig?.canonical || canonicalUrl || window.location.href;
  const keywords = seoConfig?.keywords || '';

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={pageCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageCanonical} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={businessIdentity?.branding?.logoUrl || ''} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageCanonical} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={businessIdentity?.branding?.logoUrl || ''} />
    </Helmet>
  );
}

export default SEOHeaders;