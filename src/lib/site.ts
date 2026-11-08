import rawSiteConfig from '../../site.config.json';
import type { SiteConfig, SiteLanguage } from './types';

export const siteConfig: SiteConfig = rawSiteConfig as SiteConfig;

export const languages: SiteLanguage[] = siteConfig.languages;

export const defaultLanguage: string = siteConfig.defaultLanguage;

export function getLanguageByCode(code?: string): SiteLanguage {
  if (!code) {
    return languages.find((l) => l.code === defaultLanguage) || languages[0];
  }
  const match = languages.find((l) => l.code === code);
  return match || languages.find((l) => l.code === defaultLanguage) || languages[0];
}

export function getLanguagePrefix(langCode: string): string {
  return langCode === defaultLanguage ? '' : `/${langCode}`;
}

export function getCanonicalUrl(pathname: string): string {
  const baseUrl = siteConfig.url.replace(/\/+$/, '');
  const cleanPath = pathname.replace(/^\/+/, '');
  return cleanPath ? `${baseUrl}/${cleanPath}` : `${baseUrl}/`;
}

