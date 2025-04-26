import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import OptimizedImage from './OptimizedImage';
import { generateResponsiveSources } from '@/lib/imageUtils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  breakpoints?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  breakpoints = {},
  aspectRatio = '16/9',
  objectFit = 'cover',
  priority = false,
  fallbackSrc,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculate image sources for different breakpoints, using our utility if no custom breakpoints provided
  const sources = Object.keys(breakpoints).length === 0 
    ? generateResponsiveSources(src)
    : breakpoints;

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <div 
      className={cn(
        'relative w-full overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      <picture>
        {/* Different source formats and breakpoints */}
        {'sm' in sources && sources.sm !== src && <source media="(max-width: 640px)" srcSet={sources.sm} />}
        {'md' in sources && sources.md !== src && <source media="(min-width: 641px) and (max-width: 768px)" srcSet={sources.md} />}
        {'lg' in sources && sources.lg !== src && <source media="(min-width: 769px) and (max-width: 1024px)" srcSet={sources.lg} />}
        {'xl' in sources && sources.xl !== src && <source media="(min-width: 1025px)" srcSet={sources.xl} />}
        
        {/* Fallback image */}
        <OptimizedImage
          src={src}
          alt={alt}
          objectFit={objectFit}
          priority={priority}
          fallbackSrc={fallbackSrc}
          onLoad={handleImageLoad}
          className="w-full h-full"
        />
      </picture>
    </div>
  );
};

export default ResponsiveImage;