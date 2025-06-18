import { useState, useEffect } from 'react';
import {
  HeroSkeleton,
  FeaturesSkeleton,
  TestimonialsSkeleton,
  CtaSkeleton,
  TeamMemberSkeleton,
  ContactFormSkeleton,
  CardSkeleton,
  PageHeaderSkeleton,
  ServicesSkeleton,
  DashboardSkeleton,
  BlogPostSkeleton,
  StatsSkeleton,
  NavigationSkeleton
} from '@/components/ui/skeletons';

export type SkeletonType = 
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'cta'
  | 'team'
  | 'contact'
  | 'cards'
  | 'header'
  | 'services'
  | 'dashboard'
  | 'blog'
  | 'stats'
  | 'navigation';

interface UseLoadingSkeletonProps {
  type: SkeletonType;
  isLoading?: boolean;
  count?: number;
  minLoadTime?: number; // Minimum time to show skeleton (in ms)
}

export function useLoadingSkeleton({
  type,
  isLoading = false,
  count,
  minLoadTime = 800
}: UseLoadingSkeletonProps) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isLoading) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);
      
      setTimeout(() => {
        setShowSkeleton(false);
      }, remaining);
    }
  }, [isLoading, startTime, minLoadTime]);

  const SkeletonComponent = () => {
    if (!showSkeleton && !isLoading) return null;

    switch (type) {
      case 'hero':
        return <HeroSkeleton />;
      case 'features':
        return <FeaturesSkeleton count={count} />;
      case 'testimonials':
        return <TestimonialsSkeleton count={count} />;
      case 'cta':
        return <CtaSkeleton />;
      case 'team':
        return <TeamMemberSkeleton count={count} />;
      case 'contact':
        return <ContactFormSkeleton />;
      case 'cards':
        return <CardSkeleton count={count} />;
      case 'header':
        return <PageHeaderSkeleton />;
      case 'services':
        return <ServicesSkeleton count={count} />;
      case 'dashboard':
        return <DashboardSkeleton />;
      case 'blog':
        return <BlogPostSkeleton count={count} />;
      case 'stats':
        return <StatsSkeleton count={count} />;
      case 'navigation':
        return <NavigationSkeleton />;
      default:
        return <div className="animate-pulse bg-muted h-32 w-full rounded-lg" />;
    }
  };

  return {
    showSkeleton: showSkeleton || isLoading,
    SkeletonComponent
  };
}

// Enhanced page-level loading hook
export function usePageLoadingSkeleton(pageType: 'home' | 'about' | 'services' | 'team' | 'contact' | 'admin') {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate realistic page load time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const getPageSkeletons = () => {
    switch (pageType) {
      case 'home':
        return [
          { type: 'hero' as SkeletonType },
          { type: 'services' as SkeletonType, count: 6 },
          { type: 'stats' as SkeletonType },
          { type: 'testimonials' as SkeletonType, count: 3 },
          { type: 'cta' as SkeletonType }
        ];
      case 'about':
        return [
          { type: 'header' as SkeletonType },
          { type: 'team' as SkeletonType, count: 5 },
          { type: 'stats' as SkeletonType },
          { type: 'cta' as SkeletonType }
        ];
      case 'services':
        return [
          { type: 'header' as SkeletonType },
          { type: 'services' as SkeletonType, count: 8 },
          { type: 'features' as SkeletonType, count: 3 }
        ];
      case 'team':
        return [
          { type: 'header' as SkeletonType },
          { type: 'team' as SkeletonType, count: 5 }
        ];
      case 'contact':
        return [
          { type: 'header' as SkeletonType },
          { type: 'contact' as SkeletonType }
        ];
      case 'admin':
        return [
          { type: 'dashboard' as SkeletonType }
        ];
      default:
        return [{ type: 'cards' as SkeletonType, count: 3 }];
    }
  };

  return {
    isLoading,
    skeletons: getPageSkeletons()
  };
}