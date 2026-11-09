import { useEffect } from 'react';
import { useLoaderData, ScrollRestoration } from 'react-router-dom';
import type { SiteLanguage, SearchItem } from '../lib/types';
import { LanguageContext, buildSwitchLanguagePath } from '../lib/lang-context';
import { ThemeProvider } from './ThemeProvider';
import { siteConfig } from '../lib/site';
import { translations } from '../i18n/strings';
import { Layout } from './Layout';

export interface LanguageRootProps {
  language: SiteLanguage;
}

interface LanguageRootLoaderData {
  tags: string[];
  searchIndex?: SearchItem[];
}

export function LanguageRoot({ language }: LanguageRootProps) {
  const data = useLoaderData() as LanguageRootLoaderData | undefined;
  const tags = data?.tags || [];
  const searchIndex = data?.searchIndex || [];

  const t = translations[language.code] || translations.en;

  // Dynamically synchronize document element lang and dir attributes in the browser
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language.code;
      document.documentElement.dir = language.dir;
    }
  }, [language]);

  const contextValue = {
    language,
    t,
    switchLanguagePath: (newLangCode: string, currentPathname: string) =>
      buildSwitchLanguagePath(currentPathname, newLangCode, language.code),
    localePath: (path: string) => {
      const clean = path.startsWith('/') ? path : `/${path}`;
      if (language.code === siteConfig.defaultLanguage) {
        return clean;
      }
      return `/${language.code}${clean === '/' ? '' : clean}`;
    },
  };

  return (
    <ThemeProvider>
      <LanguageContext.Provider value={contextValue}>
        <Layout tags={tags} searchIndex={searchIndex} />
        <ScrollRestoration />
      </LanguageContext.Provider>
    </ThemeProvider>
  );
}

