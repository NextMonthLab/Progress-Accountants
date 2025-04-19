import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { fetchSeoConfigByPath } from '@/lib/api';

type SEOConfig = {
  title: string;
  description: string;
  canonical: string | null;
  image: string | null;
  indexable: boolean;
  keywords: string[] | null;
};

interface DocumentHeadProps {
  route?: string;
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  indexable?: boolean;
  keywords?: string[];
}

export function DocumentHead({
  route,
  title,
  description,
  canonical,
  image,
  indexable = true,
  keywords,
}: DocumentHeadProps) {
  const [location] = useLocation();
  const currentRoute = route || location;
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Skip the fetch if we're providing all props manually
    if (title && description) {
      return;
    }

    const fetchSEO = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSeoConfigByPath(currentRoute);
        if (data) {
          setSeoConfig(data);
        }
      } catch (error) {
        console.error('Error fetching SEO config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSEO();
  }, [currentRoute, title, description]);

  // Use props or fallback to seoConfig, then to defaults
  const pageTitle = title || seoConfig?.title || 'Progress Accountants';
  const pageDescription = description || seoConfig?.description || 'Professional accounting services for modern businesses.';
  const pageCanonical = canonical || seoConfig?.canonical || `${window.location.origin}${currentRoute}`;
  const pageImage = image || seoConfig?.image || `${window.location.origin}/logo.png`;
  const pageIndexable = indexable && (seoConfig?.indexable ?? true);
  const pageKeywords = keywords || seoConfig?.keywords || ['accounting', 'business', 'finance', 'tax'];

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords.join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageCanonical} />
      
      {/* Robots directives */}
      {!pageIndexable && <meta name="robots" content="noindex, nofollow" />}
      
      {/* OpenGraph tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageCanonical} />
      <meta property="og:type" content="website" />
      {pageImage && <meta property="og:image" content={pageImage} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {pageImage && <meta name="twitter:image" content={pageImage} />}
    </Helmet>
  );
}