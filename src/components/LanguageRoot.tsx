import { useLoaderData, ScrollRestoration } from 'react-router-dom';
import type { SiteLanguage } from '../lib/types';
import { LanguageContext, buildSwitchLanguagePath } from '../lib/lang-context';
import { siteConfig } from '../lib/site';
import { translations } from '../i18n/strings';
import { Layout } from './Layout';

export interface LanguageRootProps {
  language: SiteLanguage;
}

interface LanguageRootLoaderData {
  tags: string[];
}

export function LanguageRoot({ language }: LanguageRootProps) {
  const data = useLoaderData() as LanguageRootLoaderData | undefined;
  const tags = data?.tags || [];

  const t = translations[language.code] || translations.en;

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
    <LanguageContext.Provider value={contextValue}>
      <Layout tags={tags} />
      <ScrollRestoration />
    </LanguageContext.Provider>
  );
}

