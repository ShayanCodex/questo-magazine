import { useMemo } from 'react';
import { useLoaderData, useSearchParams, Link } from 'react-router-dom';
import {
  RssIcon,
  ArrowRightIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArticleList } from '../components/ArticleList';
import { cn } from '../lib/utils';
import {
  type Category,
  getArticleCategory,
} from '../lib/categories';

interface CategoryDetailLoaderData {
  category: Category;
  articles: ArticleData[];
  pathname: string;
}

export function CategoryDetail() {
  const { category, articles, pathname } = useLoaderData() as CategoryDetailLoaderData;
  const { t, localePath } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSubcategory = searchParams.get('subcategory');

  const filteredArticles = useMemo(() => {
    if (!activeSubcategory) return articles;
    return articles.filter((art) => {
      const { subcategory } = getArticleCategory(art);
      return subcategory?.id === activeSubcategory;
    });
  }, [articles, activeSubcategory]);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: t.categories || 'Categories', href: localePath('/categories') },
    { label: category.name },
  ];

  const handleSubcategoryClick = (subId: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!subId || subId === activeSubcategory) {
      next.delete('subcategory');
    } else {
      next.set('subcategory', subId);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <Seo
        title={`${category.name} — Editorial Monographs & Essays`}
        description={category.description}
        pathname={pathname}
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Category Editorial Hero */}
      <header className="p-8 sm:p-12 rounded-2xl border border-editorial-border bg-editorial-surface shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-accent block">
              Editorial Discipline
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-editorial-text uppercase tracking-tight">
              {category.name}
            </h1>
            <p className="font-serif text-base sm:text-lg text-editorial-muted leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Granular Category RSS Link */}
          <a
            href={`/feeds/${category.id}.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-editorial-border hover:border-editorial-text bg-editorial-surface-subtle text-editorial-text font-sans text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-2xs"
            title={`Subscribe to ${category.name} RSS feed`}
          >
            <RssIcon className="h-4 w-4 text-amber-500" />
            <span>Category RSS Feed</span>
          </a>
        </div>

        {/* Subcategory Pills */}
        <div className="pt-6 border-t border-editorial-border/60 flex flex-wrap items-center gap-2">
          <span className="text-xs font-sans font-medium text-editorial-muted flex items-center gap-1.5 me-2">
            <AdjustmentsHorizontalIcon className="h-4 w-4 text-editorial-text" />
            <span>Filter Niche:</span>
          </span>

          <button
            type="button"
            onClick={() => handleSubcategoryClick(null)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border transition-colors cursor-pointer',
              !activeSubcategory
                ? 'bg-editorial-text text-editorial-bg border-editorial-text shadow-xs'
                : 'bg-editorial-surface border-editorial-border text-editorial-muted hover:text-editorial-text'
            )}
          >
            All Niches ({articles.length})
          </button>

          {category.subcategories.map((sub) => {
            const isSelected = activeSubcategory === sub.id;
            const subCount = articles.filter(
              (a) => getArticleCategory(a).subcategory?.id === sub.id
            ).length;

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubcategoryClick(sub.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-editorial-text text-editorial-bg border-editorial-text shadow-xs'
                    : 'bg-editorial-surface border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text'
                )}
              >
                {sub.name} ({subCount})
              </button>
            );
          })}
        </div>
      </header>

      {/* Articles Feed */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-editorial-border pb-3">
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-editorial-muted">
            Published Monographs ({filteredArticles.length})
          </span>
          <Link
            to={localePath('/categories')}
            className="text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted hover:text-editorial-text underline flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </div>

        <ArticleList articles={filteredArticles} />
      </section>
    </div>
  );
}
