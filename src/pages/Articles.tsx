import { useLoaderData } from 'react-router-dom';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { createBreadcrumbJsonLd } from '../lib/breadcrumbs';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArticleList } from '../components/ArticleList';

interface ArticlesLoaderData {
  articles: ArticleData[];
  pathname: string;
}

export function Articles() {
  const { articles, pathname } = useLoaderData() as ArticlesLoaderData;
  const { t, localePath } = useLanguage();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: t.articles },
  ];

  return (
    <div className="space-y-12">
      <Seo
        title={t.articles}
        description={`Explore all published articles and editorial thoughts in ${t.articles.toLowerCase()}.`}
        pathname={pathname}
        breadcrumbsJsonLd={createBreadcrumbJsonLd(breadcrumbs)}
      />

      <header className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="font-display font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight text-editorial-text">
          {t.allArticles}
        </h1>
        <p className="font-serif text-lg text-editorial-muted max-w-2xl">
          Complete archive of technical essays, architecture deep-dives, and design notes.
        </p>
      </header>

      <section className="pt-4">
        <ArticleList articles={articles} />
      </section>
    </div>
  );
}

