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
const CACHE_TTL_MS = 30 * 1000; // 30 seconds cache

const LOCAL_VIEW_KEY_PREFIX = 'questo_views_';

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
  const cleaned = path.replace(/\/+$/, '') || '/';
  return cleaned;
}

/**
 * Get client-side local view count from localStorage
 */
export function getLocalViewCount(path: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const key = LOCAL_VIEW_KEY_PREFIX + normalizeAnalyticsPath(path);
    const val = localStorage.getItem(key);
    return val ? Math.max(0, parseInt(val, 10) || 0) : 0;
  } catch {
    return 0;
  }
}

/**
 * Increment client-side local view count for a path
 */
export function incrementLocalViewCount(path: string): number {
  if (typeof window === 'undefined') return 1;
  try {
    const key = LOCAL_VIEW_KEY_PREFIX + normalizeAnalyticsPath(path);
    const current = getLocalViewCount(path);
    // Baseline minimum of 1 view for any visited article
    const next = current + 1;
    localStorage.setItem(key, String(next));
    return next;
  } catch {
    return 1;
  }
}

/**
 * Manually trigger pageview tracking with GoatCounter
 * Automatically increments local views and notifies GoatCounter
 */
export function trackGoatCounterPageView(path: string, title?: string): boolean {
  if (typeof window === 'undefined') return false;

  const currentPath = normalizeAnalyticsPath(path);
  const currentTitle = title || (typeof document !== 'undefined' ? document.title : '');

  // 1. Immediately record and increment view count in localStorage
  incrementLocalViewCount(currentPath);

  // 2. Dispatch a custom window event so all view count badges update in real-time
  try {
    window.dispatchEvent(new CustomEvent('questo:viewcount', { detail: { path: currentPath } }));
  } catch {
    // Ignore event errors in older environments
  }

  // 3. Send beacon to GoatCounter official tracker
  // In localhost or test environments, avoid remote beacons to prevent 429 rate-limiting and stats pollution
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local'));

  if (!isLocalhost && window.goatcounter && typeof window.goatcounter.count === 'function') {
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
 * Fetches the real total view count for a specific path.
 * Combines GoatCounter's official counter API with real-time local storage synchronization
 * to guarantee that view counts increment instantly and never get stuck at 0.
 */
export async function fetchGoatCounterViews(path: string): Promise<string> {
  if (typeof window === 'undefined') return '1';

  const normalized = normalizeAnalyticsPath(path);
  const localCount = getLocalViewCount(normalized);

  // Check memory cache first
  const cached = viewCountCache.get(normalized);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    const numericCached = parseInt(cached.count, 10) || 0;
    return String(Math.max(numericCached, localCount, 1));
  }

  // Avoid cross-origin fetch noise or polluting production counts during local dev/audits
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local'));

  if (isLocalhost) {
    const fallback = String(Math.max(localCount, 1));
    viewCountCache.set(normalized, {
      count: fallback,
      timestamp: Date.now(),
    });
    return fallback;
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

    if (response.ok) {
      const data = await response.json();
      if (data && data.count !== undefined) {
        const remoteCount = parseInt(String(data.count), 10) || 0;
        const total = Math.max(remoteCount, localCount, 1);
        const formatted = String(total);
        viewCountCache.set(normalized, {
          count: formatted,
          timestamp: Date.now(),
        });
        return formatted;
      }
    }
  } catch {
    // Fallback gracefully to local count
  }

  // Return local view count with baseline 1
  const fallback = String(Math.max(localCount, 1));
  viewCountCache.set(normalized, {
    count: fallback,
    timestamp: Date.now(),
  });
  return fallback;
}
