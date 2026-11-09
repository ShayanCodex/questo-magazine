/**
 * GoatCounter Analytics Client & Real-time Counter API Integration
 *
 * Lightweight, privacy-friendly analytics with zero cookies and GDPR compliance.
 * Endpoint: https://muhammad-shayan-hussain.goatcounter.com
 */

export const GOATCOUNTER_SITE_URL = 'https://muhammad-shayan-hussain.goatcounter.com';
export const GOATCOUNTER_COUNT_ENDPOINT = `${GOATCOUNTER_SITE_URL}/count`;

// Memory cache for view counts to avoid redundant network requests during session
const viewCountCache = new Map<string, { count: string; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

declare global {
  interface Window {
    goatcounter?: {
      count?: (vars?: {
        path?: string;
        title?: string;
        referrer?: string;
        event?: boolean;
      }) => void;
      no_onload?: boolean;
      allow_local?: boolean;
      endpoint?: string;
    };
  }
}

/**
 * Normalizes article and page paths to ensure clean, consistent analytics tracking
 */
export function normalizeAnalyticsPath(path: string): string {
  if (!path) return '/';
  // Strip trailing slashes unless root
  const cleaned = path.replace(/\/+$/, '') || '/';
  return cleaned;
}

/**
 * Manually trigger pageview tracking with GoatCounter
 * Safely handles script latency and asynchronous loading
 */
export function trackGoatCounterPageView(path: string, title?: string): boolean {
  if (typeof window === 'undefined') return false;

  const currentPath = normalizeAnalyticsPath(path);
  const currentTitle = title || (typeof document !== 'undefined' ? document.title : '');

  if (window.goatcounter && typeof window.goatcounter.count === 'function') {
    try {
      window.goatcounter.count({
        path: currentPath,
        title: currentTitle,
        event: false,
      });
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Fetches the real total view count for a specific path from GoatCounter's official counter JSON API.
 * API Endpoint: https://[user].goatcounter.com/counter/[path].json
 *
 * Note: GoatCounter requires the "Allow using the visitor counter" checkbox to be enabled
 * in site settings for public JSON access. If 403 is returned, it falls back gracefully.
 */
export async function fetchGoatCounterViews(path: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const normalized = normalizeAnalyticsPath(path);

  // Check cache first
  const cached = viewCountCache.get(normalized);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.count;
  }

  try {
    // GoatCounter expects the path to be URL-encoded, including slashes
    const encodedPath = encodeURIComponent(normalized);
    const apiUrl = `${GOATCOUNTER_SITE_URL}/counter/${encodedPath}.json`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      // 403 happens if visitor counter setting is not yet enabled in GoatCounter dashboard
      if (response.status === 403) {
        // Return null so fallback display can be shown without breaking the app
        return null;
      }
      return null;
    }

    const data = await response.json();
    if (data && data.count !== undefined) {
      const formatted = String(data.count);
      viewCountCache.set(normalized, {
        count: formatted,
        timestamp: Date.now(),
      });
      return formatted;
    }

    return null;
  } catch {
    // Network failure, adblocker or offline
    return null;
  }
}

