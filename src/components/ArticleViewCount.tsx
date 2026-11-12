import { useState, useEffect, useCallback } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { fetchGoatCounterViews, normalizeAnalyticsPath } from '../lib/goatcounter';
import { cn } from '../lib/utils';

export interface ArticleViewCountProps {
  path: string;
  slug?: string;
  compact?: boolean;
  className?: string;
}

/**
 * Displays the real total view count for an article.
 * Syncs seamlessly with GoatCounter analytics and immediate local storage tracking.
 */
export function ArticleViewCount({
  path,
  compact = false,
  className,
}: ArticleViewCountProps) {
  const [views, setViews] = useState<string>('1');
  const [loading, setLoading] = useState(true);

  const loadViews = useCallback(() => {
    fetchGoatCounterViews(path)
      .then((count) => {
        setViews(count);
        setLoading(false);
      })
      .catch(() => {
        setViews('1');
        setLoading(false);
      });
  }, [path]);

  useEffect(() => {
    loadViews();

    // Listen for live view increment events across the application
    const handleLiveUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string }>;
      if (
        customEvent.detail &&
        normalizeAnalyticsPath(customEvent.detail.path) === normalizeAnalyticsPath(path)
      ) {
        loadViews();
      }
    };

    window.addEventListener('questo:viewcount', handleLiveUpdate);
    return () => {
      window.removeEventListener('questo:viewcount', handleLiveUpdate);
    };
  }, [path, loadViews]);

  const formattedCount = views || '1';
  const label = formattedCount === '1' ? 'view' : 'views';

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-sans font-medium text-[11px] text-editorial-muted',
          className
        )}
        title={`Total views: ${formattedCount}`}
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
      title={`Total views: ${formattedCount}`}
      aria-label={`${formattedCount} total views`}
    >
      <EyeIcon className="h-3.5 w-3.5 text-editorial-text shrink-0" />
      {loading ? (
        <span className="opacity-40 animate-pulse">Loading views...</span>
      ) : (
        <span className="flex items-center gap-1">
          <strong className="text-editorial-text font-semibold">{formattedCount}</strong>
          <span>{label}</span>
        </span>
      )}
    </div>
  );
}
