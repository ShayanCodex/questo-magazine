import { useState, useEffect } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { fetchGoatCounterViews } from '../lib/goatcounter';
import { cn } from '../lib/utils';

export interface ArticleViewCountProps {
  path: string;
  slug?: string;
  compact?: boolean;
  className?: string;
}

/**
 * Displays the real total view count for an article fetched directly from GoatCounter API.
 * Gracefully handles loading, offline, adblockers, and zero-views states.
 */
export function ArticleViewCount({
  path,
  compact = false,
  className,
}: ArticleViewCountProps) {
  const [views, setViews] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchGoatCounterViews(path)
      .then((count) => {
        if (isMounted) {
          setViews(count);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setViews(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [path]);

  // Format label: e.g. "1 view" vs "12 views"
  const formattedCount = views ? views : '0';
  const label = formattedCount === '1' ? 'view' : 'views';

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-mono text-[11px] text-editorial-muted',
          className
        )}
        title={`Total views tracked by GoatCounter: ${formattedCount}`}
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
        'inline-flex items-center gap-1.5 font-mono text-xs text-editorial-muted',
        className
      )}
      title={`Total views tracked by GoatCounter: ${formattedCount}`}
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

