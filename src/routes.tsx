import type { RouteRecord } from 'vite-react-ssg';
import { siteConfig } from './lib/site';
import {
  loadAllArticles,
  loadArticle,
  loadAllTags,
  getAvailableRealLanguages,
} from './lib/content';
import { LanguageRoot } from './components/LanguageRoot';
import { Home } from './pages/Home';
import { Articles } from './pages/Articles';
import { Categories } from './pages/Categories';
import { Article } from './pages/Article';
import { Tag } from './pages/Tag';
import { NotFound } from './pages/NotFound';

const defaultLangObj =
  siteConfig.languages.find((l) => l.code === siteConfig.defaultLanguage) ||
  siteConfig.languages[0];

function createLanguageSubtree(lang: typeof defaultLangObj): RouteRecord {
  const isDefault = lang.code === siteConfig.defaultLanguage;
  const path = isDefault ? '/' : lang.code;

  return {
    path,
    element: <LanguageRoot language={lang} />,
    loader: async () => {
      const tags = await loadAllTags();
      const allArticles = await loadAllArticles(lang.code);
      const searchIndex = allArticles.map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        date: a.date,
        tags: a.tags,
        author: a.author,
      }));
      return { tags, searchIndex };
    },
    children: [
      {
        index: true,
        element: <Home />,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const articles = await loadAllArticles(lang.code);
          return { articles, pathname: url.pathname };
        },
      },
      {
        path: 'articles',
        element: <Articles />,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const articles = await loadAllArticles(lang.code);
          return { articles, pathname: url.pathname };
        },
      },
      {
        path: 'categories',
        element: <Categories />,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const articles = await loadAllArticles(lang.code);
          return { articles, pathname: url.pathname };
        },
      },
      {
        path: 'articles/:slug',
        element: <Article />,
        loader: async ({ params, request }) => {
          const slug = params.slug;
          if (!slug) {
            throw new Response('Not Found', { status: 404 });
          }
          const article = await loadArticle(slug, lang.code);
          if (!article) {
            throw new Response('Not Found', { status: 404 });
          }
          const url = new URL(request.url);
          return {
            article,
            availableLanguages: getAvailableRealLanguages(slug),
            pathname: url.pathname,
          };
        },
        errorElement: <NotFound />,
      },
      {
        path: 'tags/:tag',
        element: <Tag />,
        loader: async ({ params, request }) => {
          const tag = params.tag;
          if (!tag) {
            throw new Response('Not Found', { status: 404 });
          }
          const all = await loadAllArticles(lang.code);
          const filtered = all.filter((a) => a.tags?.includes(tag));
          const url = new URL(request.url);
          return {
            tag,
            articles: filtered,
            pathname: url.pathname,
          };
        },
        errorElement: <NotFound />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  };
}

export const routes: RouteRecord[] = [
  ...siteConfig.languages.map((lang) => createLanguageSubtree(lang)),
  {
    path: '*',
    element: <LanguageRoot language={defaultLangObj} />,
    children: [
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

