import { useState } from 'react';
import { cn } from '../lib/utils';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide' | 'auto';
  className?: string;
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  priority = false,
  aspectRatio = 'auto',
  className,
  containerClassName,
  ...rest
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const aspectClass = {
    video: 'aspect-[16/9]',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[16/10]',
    auto: '',
  }[aspectRatio];

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-neutral-900/60 transition-colors',
        aspectClass,
        containerClassName
      )}
    >
      {/* Low-contrast ambient blur placeholder during initial load */}
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-900/80 animate-pulse pointer-events-none" />
      )}

      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-500 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...rest}
      />
    </div>
  );
}

export default OptimizedImage;
