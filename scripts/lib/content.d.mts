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

export interface ContentBlock {
  type: 'p' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote' | 'code';
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
}

export declare function getSiteConfig(): SiteConfig;
export declare function getArticleFiles(): string[];
export declare function getAllArticles(): ArticleData[];
export declare function getAllTags(): string[];
export declare function extractTranslatableStrings(article: ArticleData): string[];
export declare function computeSourceHash(article: ArticleData): string;
export declare function getIncludedRoutes(): string[];

