import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackGoatCounterPageView, normalizeAnalyticsPath } from '../lib/goatcounter';

/**
 * GoatCounter SPA Analytics Tracker
 *
 * Automatically tracks pageviews for all routes, articles, and pages.
 * Specifically handles:
 *  - React Router client-side transitions (no page reloads)
 *  - React StrictMode deduplication (prevents double-counting in development)
 *  - Async script load retries if count.js is still pending
 */
export function AnalyticsTracker() {
  const location = useLocation();
  const lastTrackedPathRef = useRef<string | null>(null);
  const lastTrackedTimeRef = useRef<number>(0);

  useEffect(() => {
    const currentPath = normalizeAnalyticsPath(location.pathname + location.search);

    // Prevent duplicate tracking from React 18/19 StrictMode double-execution
    const now = Date.now();
    if (
      lastTrackedPathRef.current === currentPath &&
      now - lastTrackedTimeRef.current < 1500
    ) {
      return;
    }

    lastTrackedPathRef.current = currentPath;
    lastTrackedTimeRef.current = now;

    // Small delay to allow document.title and SEO tags to update before tracking
    const timer = setTimeout(() => {
      const tracked = trackGoatCounterPageView(currentPath, document.title);

      // If count.js has not finished loading async yet, retry briefly
      if (!tracked && typeof window !== 'undefined') {
        let attempts = 0;
        const retryInterval = setInterval(() => {
          attempts += 1;
          if (trackGoatCounterPageView(currentPath, document.title) || attempts > 20) {
            clearInterval(retryInterval);
          }
        }, 150);

        return () => clearInterval(retryInterval);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}

