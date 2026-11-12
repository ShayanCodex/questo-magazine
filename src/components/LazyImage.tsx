import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  aspectRatio?: string;
}

export function LazyImage({
  src,
  alt,
  className,
  wrapperClassName,
  aspectRatio,
  onError,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // Pre-fetch 200px before scrolling into viewport
        threshold: 0.01,
      }
    );

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  if (error) {
    return (
      <div
        ref={wrapperRef}
        className={cn(
          'w-full h-full bg-editorial-surface-subtle flex items-center justify-center text-editorial-muted text-[10px] font-sans font-medium',
          wrapperClassName
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={cn('relative w-full h-full overflow-hidden bg-editorial-surface-subtle', wrapperClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton Shimmer while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-editorial-surface-hover animate-pulse z-0" />
      )}

      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            setError(true);
            if (onError) onError(e);
          }}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500 ease-out',
            loaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}

