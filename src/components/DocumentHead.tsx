import { Helmet } from 'react-helmet';

interface DocumentHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  indexable?: boolean;
  keywords?: string[];
}

export function DocumentHead({
  title = "Progress Accountants - Forward-thinking Accountants for UK Businesses",
  description = "Expert accounting services for growing UK businesses. Specialists in digital, construction, film & music industries with tech-driven solutions.",
  canonical,
  image,
  indexable = true,
  keywords
}: DocumentHeadProps) {
  const siteName = "Progress Accountants";
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* SEO */}
      {!indexable && <meta name="robots" content="noindex, nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Helmet>
  );
}