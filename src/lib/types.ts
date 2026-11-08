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

export type BlockType = 'p' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote' | 'code' | 'image' | 'video';

export interface ContentBlock {
  type: BlockType;
  text?: string;
  cite?: string;
  items?: string[];
  lang?: string;
  code?: string;
  src?: string;
  alt?: string;
  caption?: string;
  title?: string;
  poster?: string;
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
  image?: string;
  imageAlt?: string;
  featured?: boolean;
  sourceHash?: string;
  isFallback?: boolean; // Set true when serving English fallback on untranslated route
}

export interface SearchItem {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  author: string;
  minRead?: number;
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
  newsTicker: string;
  tickerHeadline: string;
  printMagazine: string;
  issueNumber: string;
  textBy: string;
  search: string;
  searchPlaceholder: string;
  searchShortcut: string;
  allTopics: string;
  sortBy: string;
  newest: string;
  oldest: string;
  articlesFound: string;
  resetFilters: string;
  noSearchResults: string;
  quickSearch: string;
  clearSearch: string;
  editorialDisciplines: string;
  disciplinesSubtitle: string;
  faqTitle: string;
  faqSubtitle: string;
  manifestoText: string;
  manifestoAuthor: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterPlaceholder: string;
  newsletterButton: string;
  newsletterSuccess: string;
  printSpecsTitle: string;
  printSpecsFormat: string;
  printSpecsPaper: string;
  printSpecsBinding: string;
  printSpecsCopies: string;
  orderPrintCopy: string;
  readMore: string;
}
