/**
 * Utility functions for image optimization
 */

interface CloudinaryTransformationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif';
  crop?: 'fill' | 'crop' | 'scale' | 'fit' | 'pad' | 'limit';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest';
  effect?: string;
  background?: string;
}

/**
 * Check if a URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};

/**
 * Optimize Cloudinary URLs with transformations
 */
export const optimizeCloudinaryUrl = (
  url: string, 
  options: CloudinaryTransformationOptions = {}
): string => {
  if (!isCloudinaryUrl(url)) return url;

  // Parse URL to separate base from transformations/path
  const [baseUrl, imagePath] = url.split('/upload/');
  
  if (!baseUrl || !imagePath) return url;

  // Build transformation string
  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);
  if (options.effect) transformations.push(`e_${options.effect}`);
  if (options.background) transformations.push(`b_${options.background}`);

  // If no transformations provided, use sensible defaults
  if (transformations.length === 0) {
    transformations.push('q_auto', 'f_auto');
  }

  // Join transformations with commas
  const transformationString = transformations.join(',');

  // Return transformed URL
  return `${baseUrl}/upload/${transformationString}/${imagePath}`;
};

/**
 * Generate responsive image sources for different viewport sizes
 */
export const generateResponsiveSources = (
  src: string,
  breakpoints: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  } = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  }
): { [key: string]: string } => {
  if (!isCloudinaryUrl(src)) {
    // For non-Cloudinary images, we just return the original
    return { sm: src, md: src, lg: src, xl: src };
  }

  return {
    sm: optimizeCloudinaryUrl(src, { width: breakpoints.sm, quality: 70 }),
    md: optimizeCloudinaryUrl(src, { width: breakpoints.md, quality: 75 }),
    lg: optimizeCloudinaryUrl(src, { width: breakpoints.lg, quality: 80 }),
    xl: optimizeCloudinaryUrl(src, { width: breakpoints.xl, quality: 85 }),
  };
};

/**
 * Generate a placeholder/blur image URL
 */
export const generatePlaceholderUrl = (src: string): string => {
  if (!isCloudinaryUrl(src)) return src;
  
  return optimizeCloudinaryUrl(src, {
    width: 20,
    quality: 20,
    effect: 'blur:1000'
  });
};

/**
 * Calculate aspect ratio as a percentage for responsive containers
 */
export const calculateAspectRatioPercentage = (width: number, height: number): number => {
  return (height / width) * 100;
};

/**
 * Parse aspect ratio string (e.g., "16/9") into a number
 */
export const parseAspectRatio = (aspectRatio: string): number | null => {
  if (!aspectRatio.includes('/')) return null;
  
  const [width, height] = aspectRatio.split('/').map(Number);
  if (isNaN(width) || isNaN(height) || height === 0) return null;
  
  return width / height;
};