import { useState, useMemo, useEffect } from 'react';
import { useLoaderData, useSearchParams, Link } from 'react-router-dom';
import {
  RssIcon,
  ArrowRightIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { loadAllArticles } from '../lib/content';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArticleList } from '../components/ArticleList';
import { cn } from '../lib/utils';
import {
  type Category,
  getArticleCategory,
  getCategoryName,
  getSubcategoryName,
} from '../lib/categories';

interface CategoryDetailLoaderData {
  category: Category;
  articles: ArticleData[];
  pathname: string;
}

export function CategoryDetail() {
  const loaderData = useLoaderData() as CategoryDetailLoaderData | undefined;
  const { t, localePath, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [clientArticles, setClientArticles] = useState<ArticleData[]>(loaderData?.articles || []);

  const category = loaderData?.category;

  // Hydration & language switch fallback to ensure fresh localized articles
  useEffect(() => {
    if (!loaderData?.articles || loaderData.articles.length === 0) {
      if (category?.id) {
        loadAllArticles(language.code).then((all) => {
          const filtered = all.filter((a) => getArticleCategory(a).category.id === category.id);
          setClientArticles(filtered);
        });
      }
    } else {
      setClientArticles(loaderData.articles);
    }
  }, [loaderData, language.code, category?.id]);

  const articles = loaderData?.articles && loaderData.articles.length > 0 ? loaderData.articles : clientArticles;
  const pathname = loaderData?.pathname || `/categories/${category?.id || ''}`;

  const activeSubcategory = searchParams.get('subcategory');
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Sync state with URL params
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const next = new URLSearchParams(searchParams);
    if (query.trim()) {
      next.set('q', query.trim());
    } else {
      next.delete('q');
    }
    setSearchParams(next, { replace: true });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const handleSubcategoryClick = (subId: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!subId || subId === activeSubcategory) {
      next.delete('subcategory');
    } else {
      next.set('subcategory', subId);
    }
    setSearchParams(next, { replace: true });
  };

  const handleResetAllFilters = () => {
    setSearchQuery('');
    const next = new URLSearchParams();
    setSearchParams(next, { replace: true });
  };

  const localizedCategoryName = category ? getCategoryName(category.id, language.code) : '';

  // Filter articles by active subcategory and real-time search query
  const filteredArticles = useMemo(() => {
    let list = articles;
    if (activeSubcategory) {
      list = list.filter((art) => {
        const { subcategory } = getArticleCategory(art);
        return subcategory?.id === activeSubcategory;
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((art) => {
        const titleMatch = art.title?.toLowerCase().includes(q);
        const excerptMatch = art.excerpt?.toLowerCase().includes(q);
        const authorMatch = art.author?.toLowerCase().includes(q);
        const tagMatch = art.tags?.some((t) => t.toLowerCase().includes(q));
        const subcat = getArticleCategory(art).subcategory;
        const subcatMatch = subcat
          ? getSubcategoryName(subcat.id, language.code).toLowerCase().includes(q) ||
            subcat.name.toLowerCase().includes(q)
          : false;
        return titleMatch || excerptMatch || authorMatch || tagMatch || subcatMatch;
      });
    }
    return list;
  }, [articles, activeSubcategory, searchQuery, language.code]);

  const searchPlaceholder = useMemo(() => {
    switch (language.code) {
      case 'ur':
        return `${localizedCategoryName} میں مضامین، مصنفین یا موضوعات تلاش کریں...`;
      case 'ar':
        return `ابحث في مقالات ${localizedCategoryName} أو المؤلفين أو الموضوعات...`;
      case 'es':
        return `Buscar monografías, autores o temas en ${localizedCategoryName}...`;
      case 'fr':
        return `Rechercher des monographies, auteurs ou sujets dans ${localizedCategoryName}...`;
      case 'de':
        return `Monographien, Autoren oder Themen in ${localizedCategoryName} suchen...`;
      default:
        return `Search ${localizedCategoryName} monographs, topics, or authors...`;
    }
  }, [localizedCategoryName, language.code]);

  const publishedLabel = useMemo(() => {
    switch (language.code) {
      case 'ur':
        return `شائع شدہ مضامین (${filteredArticles.length})`;
      case 'ar':
        return `المقالات المنشورة (${filteredArticles.length})`;
      case 'es':
        return `Monografías Publicadas (${filteredArticles.length})`;
      case 'fr':
        return `Monographies Publiées (${filteredArticles.length})`;
      case 'de':
        return `Veröffentlichte Monographien (${filteredArticles.length})`;
      default:
        return `Published Monographs (${filteredArticles.length})`;
    }
  }, [language.code, filteredArticles.length]);

  if (!category) {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: t.categories || 'Categories', href: localePath('/categories') },
    { label: localizedCategoryName },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <Seo
        title={`${localizedCategoryName} — Editorial Monographs & Essays`}
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
              {t.disciplines || 'Editorial Discipline'}
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-editorial-text uppercase tracking-tight">
              {localizedCategoryName}
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
            title={`Subscribe to ${localizedCategoryName} RSS feed`}
          >
            <RssIcon className="h-4 w-4 text-amber-500" />
            <span>{t.categoryRss || 'Category RSS Feed'}</span>
          </a>
        </div>

        {/* Subcategory Filter Pills */}
        <div className="pt-6 border-t border-editorial-border/60 flex flex-wrap items-center gap-2">
          <span className="text-xs font-sans font-medium text-editorial-muted flex items-center gap-1.5 me-2">
            <AdjustmentsHorizontalIcon className="h-4 w-4 text-editorial-text" />
            <span>{t.filterNiche || 'Filter Niche'}:</span>
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
            {t.allNiches || 'All Niches'} ({articles.length})
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
                {getSubcategoryName(sub.id, language.code)} ({subCount})
              </button>
            );
          })}
        </div>
      </header>

      {/* Articles Feed with Live Search Bar */}
      <section className="space-y-6">
        {/* Search Bar & Feed Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-editorial-border pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-editorial-muted">
                {publishedLabel}
              </span>
              {(activeSubcategory || searchQuery) && (
                <span className="text-[11px] font-sans text-accent font-medium px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                  {articles.length - filteredArticles.length > 0
                    ? `(${articles.length - filteredArticles.length} filtered)`
                    : 'all match'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {(activeSubcategory || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="text-xs font-sans font-medium text-editorial-muted hover:text-editorial-text underline cursor-pointer"
                >
                  {t.resetFilters || 'Reset Filters'}
                </button>
              )}
              <Link
                to={localePath('/categories')}
                className="text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted hover:text-editorial-text underline flex items-center gap-1"
              >
                <span>{t.allCategories || 'All Categories'}</span>
                <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Interactive In-Category Real-Time Search Bar */}
          <div className="relative flex items-center">
            <MagnifyingGlassIcon className="h-4.5 w-4.5 text-editorial-muted absolute start-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleClearSearch();
                }
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-editorial-surface border border-editorial-border focus:border-editorial-text focus:ring-1 focus:ring-editorial-text/20 rounded-xl ps-10 pe-10 py-3 font-sans text-sm text-editorial-text placeholder:text-editorial-muted/70 transition-all outline-none shadow-2xs"
              aria-label={t.search}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute end-3 p-1 text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer"
                title={t.clearSearch || 'Clear search'}
                aria-label={t.clearSearch || 'Clear search'}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Zero Results State or Published Monographs List */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-editorial-border rounded-2xl bg-editorial-surface/40 space-y-4 animate-fade-in">
            <MagnifyingGlassIcon className="h-10 w-10 text-editorial-muted mx-auto stroke-1" />
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-lg text-editorial-text">
                {language.code === 'ur'
                  ? 'کوئی مقالہ نہیں ملا'
                  : language.code === 'ar'
                  ? 'لم يتم العثور على مقالات'
                  : 'No monographs found'}
              </h3>
              <p className="font-serif text-sm text-editorial-muted max-w-md mx-auto leading-relaxed">
                {searchQuery
                  ? language.code === 'ur'
                    ? `"${searchQuery}" سے مطابقت رکھنے والا کوئی مضمون نہیں ملا۔ تلاش کے الفاظ تبدیل کریں یا فلٹر صاف کریں۔`
                    : language.code === 'ar'
                    ? `لم يتم العثور على مقالات تطابق "${searchQuery}". حاول تغيير كلمات البحث.`
                    : `No monographs match "${searchQuery}". Try adjusting your search query or removing filters.`
                  : language.code === 'ur'
                  ? 'اس فلٹر کے تحت کوئی مقالہ دستیاب نہیں ہے۔'
                  : language.code === 'ar'
                  ? 'لا توجد مقالات تحت هذا التصنيف الفرعي.'
                  : 'No monographs are available under the active niche filter.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="px-5 py-2 rounded-full border border-editorial-border hover:border-editorial-text bg-editorial-surface text-editorial-text font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs hover:shadow-xs"
            >
              {t.resetFilters || 'Reset Filters'}
            </button>
          </div>
        ) : (
          <ArticleList articles={filteredArticles} />
        )}
      </section>
    </div>
  );
}
