import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import {
  fetchGoatCounterViews,
  getSynchronousViewCount,
  extractCanonicalSlug,
  normalizeAnalyticsPath,
  formatViewCount,
} from '../lib/goatcounter';
import { cn } from '../lib/utils';

export interface ArticleViewCountProps {
  path: string;
  slug?: string;
  compact?: boolean;
  className?: string;
}

/**
 * Custom hook for smooth, lightweight 60fps counter animation
 * Interpolates smoothly from previous value to target value using an ease-out cubic curve.
 * Zero external libraries, zero jitter, perfectly tabular, clean and simple.
 */
function useAnimatedNumber(
  target: number,
  options: { duration?: number; animateOnMount?: boolean } = {}
): number {
  const { duration = 750, animateOnMount = true } = options;
  const isSsr = typeof window === 'undefined';
  const initialMountRef = useRef(true);

  // On client, start slightly below target on mount for smooth entrance animation
  const [displayValue, setDisplayValue] = useState<number>(() => {
    if (isSsr || !animateOnMount || target <= 2) return target;
    const offset = Math.min(18, Math.max(2, Math.floor(target * 0.015)));
    return Math.max(1, target - offset);
  });

  const currentValRef = useRef(displayValue);
  currentValRef.current = displayValue;

  useEffect(() => {
    if (isSsr) return;

    // Check if value actually changed
    if (target === currentValRef.current && !initialMountRef.current) return;

    const startValue = currentValRef.current;
    const diff = target - startValue;
    if (diff === 0) return;

    const startTime = performance.now();
    const animDuration = initialMountRef.current ? duration : Math.min(duration, 500);
    initialMountRef.current = false;

    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / animDuration);
      // easeOutCubic curve for smooth decelerating deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(startValue + diff * ease);

      setDisplayValue(nextVal);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(target);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, isSsr]);

  return displayValue;
}

/**
 * Displays the real total view count for an article with smooth, clean counter animation.
 * Features:
 *  - Clean, minimal aesthetic matching editorial typography (no green flash, no ping dot)
 *  - Tabular numeric alignment (zero pixel shifting or glitch)
 *  - Smooth 60fps ease-out numeric ticker animation on page open & increment
 *  - Live periodic background cloud polling (syncs multi-user views while reading)
 */
export function ArticleViewCount({
  path,
  slug,
  compact = false,
  className,
}: ArticleViewCountProps) {
  // Determine canonical slug or identifier
  const targetSlug = useMemo(() => {
    return slug || extractCanonicalSlug(path) || path;
  }, [slug, path]);

  // Immediately initialize with synchronous count (0ms paint, zero flicker)
  const [views, setViews] = useState<number>(() => getSynchronousViewCount(targetSlug));

  const loadViews = useCallback(() => {
    fetchGoatCounterViews(targetSlug)
      .then((countStr) => {
        const num = parseInt(countStr, 10);
        if (!isNaN(num) && num > 0) {
          setViews((prev) => Math.max(prev, num));
        }
      })
      .catch(() => {
        // Fallback gracefully
      });
  }, [targetSlug]);

  useEffect(() => {
    loadViews();

    // 1. Listen for live view increment events across the application
    const handleLiveUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string; path?: string; count?: number }>;
      if (customEvent.detail) {
        const matchesSlug = customEvent.detail.slug && customEvent.detail.slug === targetSlug;
        const matchesPath =
          customEvent.detail.path &&
          normalizeAnalyticsPath(customEvent.detail.path) === normalizeAnalyticsPath(path);

        if (matchesSlug || matchesPath) {
          if (typeof customEvent.detail.count === 'number' && customEvent.detail.count > 0) {
            setViews(customEvent.detail.count);
          } else {
            loadViews();
          }
        }
      }
    };

    // 2. Listen for cross-tab storage changes
    const handleStorageUpdate = (e: StorageEvent) => {
      if (
        e.key &&
        (e.key.includes(targetSlug) || (path && e.key.includes(normalizeAnalyticsPath(path))))
      ) {
        loadViews();
      }
    };

    window.addEventListener('questo:viewcount', handleLiveUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    // 3. YouTube-style live reader polling (every 20s while article is open & visible)
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    if (!compact && typeof window !== 'undefined') {
      pollInterval = setInterval(() => {
        if (!document.hidden) {
          fetchGoatCounterViews(targetSlug)
            .then((countStr) => {
              const num = parseInt(countStr, 10);
              if (!isNaN(num) && num > 0) {
                setViews((prev) => Math.max(prev, num));
              }
            })
            .catch(() => {});
        }
      }, 20000);
    }

    return () => {
      window.removeEventListener('questo:viewcount', handleLiveUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [targetSlug, path, compact, loadViews]);

  // Smooth numeric counter animation hook (clean, simple)
  const displayValue = useAnimatedNumber(views, {
    duration: compact ? 450 : 750,
    animateOnMount: true,
  });

  const formattedCount = formatViewCount(displayValue, compact);
  const label = displayValue === 1 ? 'view' : 'views';

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-sans font-medium text-[11px] text-editorial-muted',
          className
        )}
        title={`Total views: ${formatViewCount(views, false)}`}
        aria-label={`${formattedCount} total views`}
      >
        <EyeIcon className="h-3 w-3 shrink-0 text-editorial-muted" />
        <span className="tabular-nums">
          {formattedCount}
        </span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 font-sans font-medium text-xs text-editorial-muted',
        className
      )}
      title={`Total views: ${formatViewCount(views, false)}`}
      aria-label={`${formattedCount} total views`}
    >
      <EyeIcon className="h-3.5 w-3.5 shrink-0 text-editorial-text" />
      <span className="flex items-center gap-1">
        <strong className="tabular-nums font-semibold text-editorial-text">
          {formattedCount}
        </strong>
        <span className="text-editorial-muted">{label}</span>
      </span>
    </div>
  );
}
