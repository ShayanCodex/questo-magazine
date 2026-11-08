import { createContext, useContext } from 'react';
import type { SiteLanguage, I18nStrings } from './types';
import { getLanguageByCode, siteConfig } from './site';
import { translations } from '../i18n/strings';

export interface LanguageContextValue {
  language: SiteLanguage;
  t: I18nStrings;
  switchLanguagePath: (newLangCode: string, currentPathname: string) => string;
  localePath: (path: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: getLanguageByCode(siteConfig.defaultLanguage),
  t: translations[siteConfig.defaultLanguage] || translations.en,
  switchLanguagePath: (_newLang, currentPath) => currentPath,
  localePath: (p) => p,
});

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

/**
 * Switch language while preserving current page path.
 * Strips current language prefix, then adds the new one.
 */
export function buildSwitchLanguagePath(
  currentPathname: string,
  newLangCode: string,
  currentLangCode: string
): string {
  // Normalize leading slash
  let pathWithoutLang = currentPathname.startsWith('/')
    ? currentPathname
    : `/${currentPathname}`;

  // If current lang is not default, strip its prefix: e.g. /es/articles -> /articles
  if (currentLangCode !== siteConfig.defaultLanguage) {
    const prefix = `/${currentLangCode}`;
    if (pathWithoutLang === prefix) {
      pathWithoutLang = '/';
    } else if (pathWithoutLang.startsWith(`${prefix}/`)) {
      pathWithoutLang = pathWithoutLang.slice(prefix.length);
    }
  }

  // If new lang is default lang, return stripped path
  if (newLangCode === siteConfig.defaultLanguage) {
    return pathWithoutLang || '/';
  }

  // Otherwise, prepend new language prefix
  const cleanPath = pathWithoutLang.replace(/^\/+/, '');
  return cleanPath ? `/${newLangCode}/${cleanPath}` : `/${newLangCode}`;
}

