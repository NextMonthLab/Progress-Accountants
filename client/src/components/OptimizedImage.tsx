import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { isCloudinaryUrl, optimizeCloudinaryUrl } from '@/lib/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  onLoad?: () => void;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  sizes = '100vw',
  priority = false,
  objectFit = 'cover',
  quality = 80,
  onLoad,
  fallbackSrc,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // Function to handle image loading completion
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  // Function to handle image loading error
  const handleError = () => {
    setError(true);
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  // Compute optimized URL with quality parameter
  const optimizedSrc = optimizeCloudinaryUrl(imgSrc, { quality });

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        objectFit === 'cover' && 'w-full h-full',
        className
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    >
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          !isLoaded && 'opacity-0',
          isLoaded && 'opacity-100',
          objectFit === 'cover' && 'object-cover w-full h-full',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
        )}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%',
          }}
        />
      )}

      {/* Error state */}
      {error && !fallbackSrc && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%',
          }}
        >
          <span>Image not available</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;