export interface SiteLanguage {
  code: string;
  name: string;
  dir: 'ltr' | 'rtl';
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  defaultLanguage: string;
  languages: SiteLanguage[];
}

export type BlockType = 'p' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote' | 'code';

export interface ContentBlock {
  type: BlockType;
  text?: string;
  cite?: string;
  items?: string[];
  lang?: string;
  code?: string;
}

export interface ArticleData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  author: string;
  tags: string[];
  body: ContentBlock[];
  sourceHash?: string;
  isFallback?: boolean; // Set true when serving English fallback on untranslated route
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface I18nStrings {
  menu: string;
  close: string;
  home: string;
  articles: string;
  latest: string;
  allArticles: string;
  topics: string;
  languages: string;
  minRead: string;
  editOnGitHub: string;
  backToArticles: string;
  fallbackNotice: string;
  skipToContent: string;
  pageNotFound: string;
  pageNotFoundDesc: string;
  returnHome: string;
  articlesTagged: string;
  noArticlesFound: string;
}

