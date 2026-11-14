import type { RouteRecord } from 'vite-react-ssg';
import { siteConfig } from './lib/site';
import {
  loadAllArticles,
  loadArticle,
  loadAllTags,
  getAvailableRealLanguages,
} from './lib/content';
import { getArticleCategory, getCategoryById } from './lib/categories';
import { getAuthorBySlug } from './data/authors';
import { LanguageRoot } from './components/LanguageRoot';
import { Home } from './pages/Home';
import { Articles } from './pages/Articles';
import { Markets } from './pages/Markets';
import { MarketDetail } from './pages/MarketDetail';
import { Categories } from './pages/Categories';
import { CategoryDetail } from './pages/CategoryDetail';
import { Article } from './pages/Article';
import { Author } from './pages/Author';
import { Tag } from './pages/Tag';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
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
        path: 'markets',
        element: <Markets />,
      },
      {
        path: 'markets/:slug',
        element: <MarketDetail />,
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
        path: 'categories/:slug',
        element: <CategoryDetail />,
        loader: async ({ params, request }) => {
          const slug = params.slug;
          if (!slug) {
            throw new Response('Not Found', { status: 404 });
          }
          const category = getCategoryById(slug);
          if (!category) {
            throw new Response('Not Found', { status: 404 });
          }
          const allArticles = await loadAllArticles(lang.code);
          const filtered = allArticles.filter(
            (a) => getArticleCategory(a).category.id === slug
          );
          const url = new URL(request.url);
          return {
            category,
            articles: filtered,
            pathname: url.pathname,
          };
        },
        errorElement: <NotFound />,
      },
      {
        path: 'authors/:slug',
        element: <Author />,
        loader: async ({ params, request }) => {
          const slug = params.slug;
          if (!slug) {
            throw new Response('Not Found', { status: 404 });
          }
          const author = getAuthorBySlug(slug);
          if (!author) {
            throw new Response('Not Found', { status: 404 });
          }
          const allArticles = await loadAllArticles(lang.code);
          const filtered = allArticles.filter(
            (a) => a.author.toLowerCase() === author.name.toLowerCase()
          );
          const url = new URL(request.url);
          return {
            author,
            articles: filtered,
            pathname: url.pathname,
          };
        },
        errorElement: <NotFound />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'terms',
        element: <Terms />,
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
          const allArticles = await loadAllArticles(lang.code);
          const articleCatId = getArticleCategory(article).category.id;
          const relatedArticles = allArticles
            .filter((a) => a.slug !== slug)
            .sort((a, b) => {
              const aSameCat = getArticleCategory(a).category.id === articleCatId;
              const bSameCat = getArticleCategory(b).category.id === articleCatId;
              if (aSameCat && !bSameCat) return -1;
              if (!aSameCat && bSameCat) return 1;
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .slice(0, 3);

          const url = new URL(request.url);
          return {
            article,
            relatedArticles,
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
        path: 'privacy',
        element: <Privacy />,
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

