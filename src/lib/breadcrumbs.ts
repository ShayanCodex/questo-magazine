import type { BreadcrumbItem } from './types';
import { siteConfig } from './site';

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]): string {
  const baseUrl = siteConfig.url.replace(/\/+$/, '');

  const itemListElement = items.map((item, index) => {
    const fullUrl = item.href
      ? (item.href.startsWith('http') ? item.href : `${baseUrl}${item.href.startsWith('/') ? item.href : `/${item.href}`}`)
      : undefined;

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(fullUrl ? { item: fullUrl } : {}),
    };
  });

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

