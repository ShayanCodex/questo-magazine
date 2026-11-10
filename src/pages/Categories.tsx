import { useState, useMemo, useEffect } from 'react';
import { useLoaderData, useSearchParams, Link, useLocation } from 'react-router-dom';
import {
  FolderIcon,
  SparklesIcon,
  ArrowRightIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  Squares2X2Icon,
  BuildingOffice2Icon,
  PaintBrushIcon,
  SwatchIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { createBreadcrumbJsonLd } from '../lib/breadcrumbs';
import { loadAllArticles } from '../lib/content';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArticleList } from '../components/ArticleList';
import { cn } from '../lib/utils';
import {
  CATEGORIES,
  getArticleCategory,
  getCategoryById,
  type Category,
  type Subcategory,
} from '../lib/categories';

interface CategoriesLoaderData {
  articles: ArticleData[];
  pathname: string;
}

function getCategoryIcon(catId: string) {
  switch (catId) {
    case 'architecture-and-space':
      return BuildingOffice2Icon;
    case 'art-and-culture':
      return PaintBrushIcon;
    case 'design-and-typography':
      return SwatchIcon;
    case 'engineering-and-technology':
      return CpuChipIcon;
    default:
      return FolderIcon;
  }
}

export function Categories() {
  const loaderData = useLoaderData() as CategoriesLoaderData | undefined;
  const location = useLocation();
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  const [clientArticles, setClientArticles] = useState<ArticleData[]>(loaderData?.articles || []);

  useEffect(() => {
    if (!loaderData?.articles || loaderData.articles.length === 0) {
      loadAllArticles(language.code).then((loaded) => {
        setClientArticles(loaded);
      });
    } else {
      setClientArticles(loaderData.articles);
    }
  }, [loaderData, language.code]);

  const articles = loaderData?.articles || clientArticles;
  const pathname = loaderData?.pathname || location.pathname;

  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category');
  const initialSub = searchParams.get('subcategory');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCat);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(initialSub);
  const [sortOrder, setSortOrder] = useState<'az' | 'count'>('az');

  // Sync selection to URL query parameters
  const updateParams = (cat: string | null, sub: string | null) => {
    const next = new URLSearchParams();
    if (cat) next.set('category', cat);
    if (sub) next.set('subcategory', sub);
    setSearchParams(next, { replace: true });
  };

  // Compute live article counts per category and subcategory
  const counts = useMemo(() => {
    const catMap = new Map<string, number>();
    const subMap = new Map<string, number>();

    articles.forEach((art) => {
      const { category, subcategory } = getArticleCategory(art);
      catMap.set(category.id, (catMap.get(category.id) || 0) + 1);
      if (subcategory) {
        const subKey = `${category.id}:${subcategory.id}`;
        subMap.set(subKey, (subMap.get(subKey) || 0) + 1);
      }
    });

    return { catMap, subMap };
  }, [articles]);

  // Total unique subcategories count
  const totalSubcategories = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => acc + cat.subcategories.length, 0);
  }, []);

  // Sorted categories according to A-Z or Article count
  const sortedCategories = useMemo(() => {
    const list = [...CATEGORIES];
    if (sortOrder === 'az') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list.sort((a, b) => {
      const countA = counts.catMap.get(a.id) || 0;
      const countB = counts.catMap.get(b.id) || 0;
      return countB - countA;
    });
  }, [sortOrder, counts.catMap]);

  // Active Category Definition
  const activeCategory = useMemo(() => {
    return selectedCategory ? getCategoryById(selectedCategory) : null;
  }, [selectedCategory]);

  // Articles filtered by active category and subcategory
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const { category, subcategory } = getArticleCategory(art);
      if (selectedCategory && category.id !== selectedCategory) {
        return false;
      }
      if (selectedSubcategory && subcategory?.id !== selectedSubcategory) {
        return false;
      }
      return true;
    });
  }, [articles, selectedCategory, selectedSubcategory]);

  const handleSelectCategory = (catId: string) => {
    if (selectedCategory === catId) {
      // Toggle off to show all
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      updateParams(null, null);
    } else {
      setSelectedCategory(catId);
      setSelectedSubcategory(null);
      updateParams(catId, null);
    }
  };

  const handleSelectSubcategory = (subId: string) => {
    if (selectedSubcategory === subId) {
      setSelectedSubcategory(null);
      updateParams(selectedCategory, null);
    } else {
      setSelectedSubcategory(subId);
      updateParams(selectedCategory, subId);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    updateParams(null, null);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: t.categories || 'Categories' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16">
      <Seo
        title={t.categoriesArchiveTitle || 'Categories & Disciplines'}
        description={
          t.categoriesSubtitle ||
          'Comprehensive directory of publishing pillars and specialized subcategories from A to Z.'
        }
        pathname={pathname}
        breadcrumbsJsonLd={createBreadcrumbJsonLd(breadcrumbs)}
        keywords={[
          'Architecture & Space',
          'Art & Culture',
          'Design & Typography',
          'Engineering & Technology',
          'Questo categories',
          'disciplines directory',
        ]}
      />

      {/* Page Header */}
      <header className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-editorial-border pb-8">
          <div className="space-y-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted block">
              {t.allCategoriesAtoZ || 'All Categories (A to Z)'}
            </span>
            <h1 className="font-sans font-bold sm:font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-editorial-text leading-tight">
              {t.categoriesArchiveTitle || 'Categories & Disciplines'}
            </h1>
            <p className="font-serif text-base sm:text-lg text-editorial-muted max-w-2xl leading-relaxed">
              {t.categoriesSubtitle ||
                'Explore curated publishing pillars, specialized subcategories, and related monographs from A to Z.'}
            </p>
          </div>

          {/* Editorial Meta Stats Badge Capsule in Poppins */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-editorial-muted font-medium">
            <div className="px-3.5 py-1 rounded-full bg-editorial-surface border border-editorial-border shadow-2xs">
              <span className="font-bold text-editorial-text">{CATEGORIES.length}</span> Categories
            </div>
            <div className="px-3.5 py-1 rounded-full bg-editorial-surface border border-editorial-border shadow-2xs">
              <span className="font-bold text-editorial-text">{totalSubcategories}</span> Subcategories
            </div>
            <div className="px-3.5 py-1 rounded-full bg-editorial-surface border border-editorial-border shadow-2xs">
              <span className="font-bold text-editorial-text">{articles.length}</span> Articles
            </div>
          </div>
        </div>
      </header>

      {/* Categories Toolbar: Sort & Status Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <Squares2X2Icon className="h-5 w-5 text-editorial-text" />
          <h2 className="font-sans font-bold text-xl tracking-tight text-editorial-text">
            {t.categories || 'Editorial Categories'}
          </h2>
          {selectedCategory && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-sans font-medium text-editorial-muted hover:text-editorial-text underline ms-2 cursor-pointer"
            >
              {t.allCategories || 'View All Categories'}
            </button>
          )}
        </div>

        {/* Sort Controls (A-Z vs Most Articles in Poppins) */}
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="text-editorial-muted font-medium">{t.sortBy}:</span>
          <div className="inline-flex rounded-full border border-editorial-border bg-editorial-surface overflow-hidden p-0.5">
            <button
              type="button"
              onClick={() => setSortOrder('az')}
              className={cn(
                'px-3.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 font-medium',
                sortOrder === 'az'
                  ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                  : 'text-editorial-muted hover:text-editorial-text'
              )}
            >
              <BarsArrowDownIcon className="h-3.5 w-3.5" />
              <span>A–Z Alphabetical</span>
            </button>
            <button
              type="button"
              onClick={() => setSortOrder('count')}
              className={cn(
                'px-3.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 font-medium',
                sortOrder === 'count'
                  ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                  : 'text-editorial-muted hover:text-editorial-text'
              )}
            >
              <BarsArrowUpIcon className="h-3.5 w-3.5" />
              <span>By Article Count</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: All Categories Cards Grid (A to Z) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedCategories.map((cat: Category) => {
          const isSelected = selectedCategory === cat.id;
          const articleCount = counts.catMap.get(cat.id) || 0;
          const CategoryIcon = getCategoryIcon(cat.id);

          return (
            <div
              key={cat.id}
              role="button"
              tabIndex={0}
              onClick={() => handleSelectCategory(cat.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectCategory(cat.id);
                }
              }}
              className={cn(
                'group relative p-6 sm:p-8 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-6 text-start shadow-xs hover:shadow-md hover:-translate-y-0.5',
                isSelected
                  ? 'border-editorial-text bg-editorial-surface-hover ring-2 ring-editorial-text/20 shadow-md'
                  : 'border-editorial-border bg-editorial-surface hover:border-editorial-text/70'
              )}
            >
              <div className="space-y-4">
                {/* Top Action Row: Distinctive Category Icon on left, Badges & Explore on right */}
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-2xs shrink-0',
                      isSelected
                        ? 'bg-editorial-text text-editorial-bg shadow-sm scale-105'
                        : 'bg-editorial-surface-subtle text-editorial-text border border-editorial-border group-hover:border-editorial-text group-hover:bg-editorial-text group-hover:text-editorial-bg'
                    )}
                  >
                    <CategoryIcon className="h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans text-editorial-muted font-medium px-3 py-1 rounded-full bg-editorial-surface-subtle border border-editorial-border/80 shadow-2xs">
                      {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-sans font-semibold px-3.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1 shadow-2xs',
                        isSelected
                          ? 'bg-editorial-text text-editorial-bg font-bold shadow-xs'
                          : 'border border-editorial-border text-editorial-muted group-hover:border-editorial-text group-hover:text-editorial-text group-hover:bg-editorial-surface-hover'
                      )}
                    >
                      <span>{isSelected ? 'Active' : 'Explore'}</span>
                      <ArrowRightIcon
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-200',
                          isRtl ? 'rotate-180' : '',
                          isSelected ? '' : 'group-hover:translate-x-0.5'
                        )}
                      />
                    </span>
                  </div>
                </div>

                {/* Category Title & Description - Full Width */}
                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-2xl sm:text-[1.65rem] tracking-tight text-editorial-text group-hover:text-accent transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <p className="font-serif text-editorial-muted text-sm sm:text-base leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Subcategories quick badges (Rounded Full + Poppins) */}
                <div className="pt-1">
                  <span className="text-xs font-sans text-editorial-muted/80 block mb-2 font-medium">
                    {t.subcategories || 'Subcategories'}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((sub: Subcategory) => {
                      const isSubSelected = selectedSubcategory === sub.id && isSelected;
                      return (
                        <span
                          key={sub.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(cat.id);
                            handleSelectSubcategory(sub.id);
                          }}
                          className={cn(
                            'text-xs font-sans font-medium px-3.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs',
                            isSubSelected
                              ? 'bg-editorial-text text-editorial-bg font-bold'
                              : 'bg-editorial-surface-subtle border border-editorial-border/80 hover:border-editorial-text text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover'
                          )}
                        >
                          {sub.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action row at bottom of card */}
              <div className="pt-4 border-t border-editorial-border/60 flex items-center justify-between text-xs font-sans font-medium">
                <span className="text-editorial-muted group-hover:text-editorial-text transition-colors">
                  {isSelected ? 'Click to deselect category' : 'Click to show subcategories & articles'}
                </span>
                <ArrowRightIcon
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isRtl ? 'rotate-180' : '',
                    isSelected ? 'translate-x-1 text-editorial-text' : 'group-hover:translate-x-1 text-editorial-muted group-hover:text-editorial-text'
                  )}
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* Section 2: Subcategories Cards (Revealed when a category is selected) */}
      {activeCategory && (
        <section className="space-y-6 pt-6 border-t border-editorial-border animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted block">
                Category Drilldown
              </span>
              <h3 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-editorial-text flex items-center gap-2">
                <span>{activeCategory.name}</span>
                <span className="text-editorial-muted font-normal text-lg">
                  ({activeCategory.subcategories.length} Subcategories)
                </span>
              </h3>
            </div>

            {selectedSubcategory && (
              <button
                type="button"
                onClick={() => handleSelectSubcategory(selectedSubcategory)}
                className="text-xs font-sans font-medium text-editorial-muted hover:text-editorial-text underline cursor-pointer self-start sm:self-auto"
              >
                Show All {activeCategory.name} Subcategories
              </button>
            )}
          </div>

          {/* Subcategories Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCategory.subcategories.map((sub: Subcategory) => {
              const subKey = `${activeCategory.id}:${sub.id}`;
              const count = counts.subMap.get(subKey) || 0;
              const isSubSelected = selectedSubcategory === sub.id;

              return (
                <div
                  key={sub.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectSubcategory(sub.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectSubcategory(sub.id);
                    }
                  }}
                  className={cn(
                    'p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 text-start shadow-xs hover:shadow-md hover:-translate-y-0.5',
                    isSubSelected
                      ? 'border-editorial-text bg-editorial-surface-hover ring-2 ring-editorial-text/20 shadow-xs'
                      : 'border-editorial-border bg-editorial-surface hover:border-editorial-text/70'
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-sans text-editorial-muted font-medium">
                        Subcategory
                      </span>
                      <span
                        className={cn(
                          'text-xs font-sans px-2.5 py-0.5 rounded-full font-medium',
                          isSubSelected
                            ? 'bg-editorial-text text-editorial-bg font-semibold'
                            : 'bg-editorial-surface-subtle text-editorial-muted'
                        )}
                      >
                        {count} {count === 1 ? 'article' : 'articles'}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-lg tracking-tight text-editorial-text">
                      {sub.name}
                    </h4>

                    <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-editorial-border/60 flex items-center justify-between text-xs font-sans font-medium">
                    <span className={isSubSelected ? 'text-editorial-text font-semibold' : 'text-editorial-muted'}>
                      {isSubSelected ? 'Selected' : 'View Articles'}
                    </span>
                    <ArrowRightIcon
                      className={cn(
                        'h-3.5 w-3.5',
                        isRtl ? 'rotate-180' : '',
                        isSubSelected ? 'text-editorial-text' : 'text-editorial-muted'
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 3: Related Articles Cards Stream */}
      <section className="space-y-6 pt-8 border-t border-editorial-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-editorial-text flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-editorial-text" />
              <span>
                {selectedCategory
                  ? `${activeCategory?.name} ${selectedSubcategory ? `› ${activeCategory?.subcategories.find((s) => s.id === selectedSubcategory)?.name}` : ''}`
                  : (t.allArticles || 'All Editorial Articles')}
              </span>
            </h3>
            <p className="font-sans text-xs text-editorial-muted font-medium mt-1">
              {filteredArticles.length} {t.articlesFound}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={localePath(
                selectedCategory
                  ? `/articles?category=${selectedCategory}${selectedSubcategory ? `&subcategory=${selectedSubcategory}` : ''}`
                  : '/articles'
              )}
              className="text-xs font-sans uppercase tracking-wider text-accent hover:underline flex items-center gap-1.5 font-semibold group"
            >
              <span>View in Full Archive</span>
              <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Article Cards with Right-Side Images, Reading Time, and Real-Time View Count */}
        <ArticleList
          articles={filteredArticles}
          emptyMessage="No monographs or articles found for this category selection."
        />
      </section>
    </div>
  );
}
