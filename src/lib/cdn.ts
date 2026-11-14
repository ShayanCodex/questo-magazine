/**
 * jsDelivr CDN and External GitHub Asset Acceleration Engine
 * 
 * Routes static assets, article imagery, and heavy media payloads through
 * GitHub repositories paired with the global jsDelivr multi-CDN network.
 * Provides instant sub-second edge caching via Cloudflare, Fastly, and Quantil.
 */

const GITHUB_REPO_OWNER = 'ShayanCodex';
const GITHUB_REPO_NAME = 'questo-magazine';
const GITHUB_BRANCH = 'main';

// Base jsDelivr GitHub CDN URL
export const JSDELIVR_BASE = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}@${GITHUB_BRANCH}`;

/**
 * Resolves a local or relative asset path to its jsDelivr CDN equivalent.
 * If the path is an external URL (http/https), data URI, or already a CDN URL,
 * it returns the original URL unchanged.
 */
export function getJsdelivrUrl(relativePath: string): string {
  if (!relativePath) return '';

  // Already an absolute URL, data URI, or external CDN
  if (
    relativePath.startsWith('http://') ||
    relativePath.startsWith('https://') ||
    relativePath.startsWith('data:') ||
    relativePath.startsWith('blob:')
  ) {
    return relativePath;
  }

  // Clean leading slashes
  const cleanPath = relativePath.replace(/^\/+/, '');

  // In production builds where external CDN is preferred:
  // Can be toggled via VITE_USE_JSDELIVR_CDN=true
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_JSDELIVR_CDN === 'true') {
    return `${JSDELIVR_BASE}/public/${cleanPath}`;
  }

  // Default to relative public path with zero external network dependency
  return `/${cleanPath}`;
}

/**
 * Generates an optimized responsive srcset for an image hosted on jsDelivr/GitHub
 */
export function getCdnSrcSet(relativePath: string): string {
  const url = getJsdelivrUrl(relativePath);
  return `${url} 1x, ${url} 2x`;
}
