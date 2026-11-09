import { useLoaderData } from 'react-router-dom';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { createBreadcrumbJsonLd } from '../lib/breadcrumbs';
import { formatTopicName } from '../lib/categories';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArticleList } from '../components/ArticleList';

interface TagLoaderData {
  tag: string;
  articles: ArticleData[];
  pathname: string;
}

export function Tag() {
  const { tag, articles, pathname } = useLoaderData() as TagLoaderData;
  const { t, localePath } = useLanguage();

  const formattedTagName = formatTopicName(tag);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: t.articles, href: localePath('/articles') },
    { label: formattedTagName },
  ];

  return (
    <div className="space-y-12">
      <Seo
        title={`${t.articlesTagged} #${tag}`}
        description={`Articles, essays, and notes tagged with #${tag}.`}
        pathname={pathname}
        breadcrumbsJsonLd={createBreadcrumbJsonLd(breadcrumbs)}
      />

      <header className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-muted">
            {t.topics}
          </span>
          <h1 className="font-display font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight text-editorial-text">
            {formattedTagName}
          </h1>
        </div>
      </header>

      <section className="pt-4">
        <ArticleList articles={articles} />
      </section>
    </div>
  );
}

