import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface RouteMetadata {
  title: string;
  description: string;
}

const routes: Record<string, RouteMetadata> = {
  '/': {
    title: 'Accountants in Banbury | Progress Accountants – Real Tools for Business Growth',
    description: 'Looking for an accountant in Banbury? Progress Accountants offers expert bookkeeping, tax returns, and a custom dashboard to grow your business. Book your free call today.'
  },
  '/studio-banbury': {
    title: 'Podcast & Video Studio Hire in Banbury, Oxfordshire | Progress Accountants',
    description: 'Hire a professional podcast and video studio in Banbury. Two-camera setup, pro audio, 4K TV, and tech support. Free for Progress clients. Book now.'
  }
};

export default function DocumentHead() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Get metadata for current route, or fallback to homepage metadata
    const metadata = routes[location] || routes['/'];
    
    // Update document title
    document.title = metadata.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metadata.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', metadata.description);
      document.head.appendChild(metaDescription);
    }
  }, [location]);
  
  return null; // This component doesn't render anything visually
}