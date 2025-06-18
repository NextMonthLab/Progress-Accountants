import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderClassName?: string;
  priority?: boolean;
}

/**
 * OptimizedImage - A component that handles lazy loading and progressive enhancement
 * 
 * Features:
 * - Prevents layout shifts with proper width/height
 * - Implements lazy loading for off-screen images
 * - Shows a placeholder during loading
 * - Supports priority loading for above-the-fold content
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  placeholderClassName,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // For priority images, preload them
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = src;
    }
  }, [priority, src]);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        placeholderClassName
      )}
      style={{
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {/* Placeholder/skeleton */}
      {!loaded && !error && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse rounded-md"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%',
          }}
        />
      )}
      
      {/* Actual image with lazy loading for non-priority images */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={cn(
          "transition-opacity duration-0",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
      
      {/* Error state */}
      {error && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-muted/20 text-muted-foreground text-sm"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%',
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
}