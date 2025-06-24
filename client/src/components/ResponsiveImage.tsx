import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "scale-down" | "none";
  aspectRatio?: "auto" | "square" | "video" | "portrait" | "landscape";
  sizes?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  onLoad?: () => void;
  onError?: () => void;
}

const aspectRatioClasses = {
  auto: "",
  square: "aspect-square",
  video: "aspect-video", 
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

const objectFitClasses = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  "scale-down": "object-scale-down",
  none: "object-none",
};

export const ResponsiveImage = ({
  src,
  alt,
  className,
  objectFit = "cover",
  aspectRatio = "auto",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  placeholder = "empty",
  onLoad,
  onError,
}: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className={cn(
      "relative overflow-hidden",
      aspectRatioClasses[aspectRatio],
      className
    )}>
      {/* Placeholder */}
      {!isLoaded && !hasError && placeholder === "blur" && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-slate-400 text-sm">Image unavailable</div>
        </div>
      )}

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity duration-300 max-w-full",
          objectFitClasses[objectFit],
          !isLoaded && "opacity-0",
          isLoaded && "opacity-100",
          "object-center" // Ensure proper centering
        )}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default ResponsiveImage;