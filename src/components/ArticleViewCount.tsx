import { useState, useEffect, useCallback, useMemo } from 'react';
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
 * Displays the real total view count for an article.
 * Syncs seamlessly with Cloud Edge analytics, instant local storage, and cross-tab events.
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
  const [loading, setLoading] = useState<boolean>(false);

  const loadViews = useCallback(() => {
    fetchGoatCounterViews(targetSlug)
      .then((countStr) => {
        const num = parseInt(countStr, 10);
        if (!isNaN(num) && num > 0) {
          setViews(num);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
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

    return () => {
      window.removeEventListener('questo:viewcount', handleLiveUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [targetSlug, path, loadViews]);

  const formattedCount = formatViewCount(views, compact);
  const label = views === 1 ? 'view' : 'views';

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
        <EyeIcon className="h-3 w-3 text-editorial-muted shrink-0" />
        {loading ? (
          <span className="opacity-40 animate-pulse">...</span>
        ) : (
          <span>{formattedCount}</span>
        )}
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
      <EyeIcon className="h-3.5 w-3.5 text-editorial-text shrink-0" />
      <span className="flex items-center gap-1">
        <strong className="text-editorial-text font-semibold">{formattedCount}</strong>
        <span>{label}</span>
      </span>
    </div>
  );
}
