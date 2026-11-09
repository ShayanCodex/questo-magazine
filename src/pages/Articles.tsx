import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  FolderIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { createBreadcrumbJsonLd } from '../lib/breadcrumbs';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArticleList } from '../components/ArticleList';
import { cn } from '../lib/utils';
import {
  CATEGORIES,
  getArticleCategory,
  getCategoryById,
  getSearchSuggestions,
  type SearchSuggestion,
} from '../lib/categories';

interface ArticlesLoaderData {
  articles: ArticleData[];
  pathname: string;
}

export function Articles() {
  const { articles, pathname } = useLoaderData() as ArticlesLoaderData;
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter values from URL query parameters for shareability & direct linking
  const initialCategory = searchParams.get('category');
  const initialSubcategory = searchParams.get('subcategory');
  const initialTag = searchParams.get('tag');
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(initialSubcategory);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const topicSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Sync state to URL search parameters
  const syncParams = useCallback(
    (cat: string | null, sub: string | null, tag: string | null, q: string) => {
      const next = new URLSearchParams();
      if (cat) next.set('category', cat);
      if (sub) next.set('subcategory', sub);
      if (tag) next.set('tag', tag);
      if (q.trim()) next.set('q', q.trim());
      setSearchParams(next, { replace: true });
    },
    [setSearchParams]
  );

  const checkTopicScroll = () => {
    if (!topicSliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = topicSliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const current = Math.abs(scrollLeft);
    setCanScrollLeft(current > 4);
    setCanScrollRight(current < maxScroll - 4);
  };

  useEffect(() => {
    checkTopicScroll();
    const el = topicSliderRef.current;
    if (el) {
      el.addEventListener('scroll', checkTopicScroll);
      window.addEventListener('resize', checkTopicScroll);
      return () => {
        el.removeEventListener('scroll', checkTopicScroll);
        window.removeEventListener('resize', checkTopicScroll);
      };
    }
  }, [articles]);

  const slideTopics = (direction: 'left' | 'right') => {
    if (!topicSliderRef.current) return;
    const scrollAmount = 200;
    const multiplier = direction === 'left' ? -1 : 1;
    const delta = isRtl ? -multiplier * scrollAmount : multiplier * scrollAmount;
    topicSliderRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(checkTopicScroll, 250);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: t.articles },
  ];

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((a) => {
      a.tags?.forEach((tItem) => tagSet.add(tItem));
    });
    return Array.from(tagSet).sort();
  }, [articles]);

  // Compute live article counts per category and subcategory
  const categoryCounts = useMemo(() => {
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

  const activeCategoryDef = useMemo(() => {
    return selectedCategory ? getCategoryById(selectedCategory) : null;
  }, [selectedCategory]);

  // Live auto-complete and search suggestions
  const inPageSuggestions = useMemo(() => {
    return getSearchSuggestions(searchQuery, articles);
  }, [searchQuery, articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    const filtered = articles.filter((article) => {
      const { category, subcategory } = getArticleCategory(article);

      if (selectedCategory && category.id !== selectedCategory) {
        return false;
      }
      if (selectedSubcategory && subcategory?.id !== selectedSubcategory) {
        return false;
      }
      if (selectedTag && !article.tags?.includes(selectedTag)) {
        return false;
      }

      if (!cleanQuery) return true;

      const titleMatch = article.title.toLowerCase().includes(cleanQuery);
      const excerptMatch = article.excerpt.toLowerCase().includes(cleanQuery);
      const authorMatch = article.author.toLowerCase().includes(cleanQuery);
      const tagsMatch = article.tags?.some((tg) => tg.toLowerCase().includes(cleanQuery));
      const catMatch = category.name.toLowerCase().includes(cleanQuery);
      const subMatch = subcategory?.name.toLowerCase().includes(cleanQuery);

      return titleMatch || excerptMatch || authorMatch || tagsMatch || catMatch || subMatch;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [articles, searchQuery, selectedTag, selectedCategory, selectedSubcategory, sortBy]);

  const hasActiveFilters =
    searchQuery.length > 0 ||
    selectedTag !== null ||
    selectedCategory !== null ||
    selectedSubcategory !== null;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSortBy('newest');
    syncParams(null, null, null, '');
  };

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(null);
    syncParams(catId, null, selectedTag, searchQuery);
  };

  const handleSelectSubcategory = (subId: string | null) => {
    const nextSub = selectedSubcategory === subId ? null : subId;
    setSelectedSubcategory(nextSub);
    syncParams(selectedCategory, nextSub, selectedTag, searchQuery);
  };

  const handleSelectTag = (tag: string | null) => {
    const nextTag = selectedTag === tag ? null : tag;
    setSelectedTag(nextTag);
    syncParams(selectedCategory, selectedSubcategory, nextTag, searchQuery);
  };

  const handleApplySuggestion = (sug: SearchSuggestion) => {
    if (sug.type === 'category' && sug.categoryId) {
      handleSelectCategory(sug.categoryId);
      setSearchQuery('');
    } else if (sug.type === 'subcategory' && sug.categoryId && sug.subcategoryId) {
      setSelectedCategory(sug.categoryId);
      setSelectedSubcategory(sug.subcategoryId);
      setSearchQuery('');
      syncParams(sug.categoryId, sug.subcategoryId, selectedTag, '');
    } else if (sug.type === 'topic') {
      handleSelectTag(sug.value);
      setSearchQuery('');
    } else {
      setSearchQuery(sug.value);
      syncParams(selectedCategory, selectedSubcategory, selectedTag, sug.value);
    }
    setShowSuggestions(false);
  };

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

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-editorial-border pb-8">
          <div>
            <h1 className="font-display font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-tight text-editorial-text uppercase">
              {t.allArticles}
            </h1>
            <p className="font-serif text-lg text-editorial-muted max-w-2xl mt-4">
              Complete archive of technical essays, visual culture commentaries, and architectural design deep-dives.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-editorial-muted">
            <span>
              {filteredArticles.length} / {articles.length} {t.articlesFound}
            </span>
          </div>
        </div>
      </header>

      {/* Advanced In-Page Search, Categories & Subcategories Filter Toolbar */}
      <section className="space-y-4 bg-editorial-surface border border-editorial-border p-4 sm:p-5 rounded-sm shadow-xs">
        {/* Row 1: Primary Categories Strip */}
        <div className="space-y-2 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted flex items-center gap-1.5 font-medium">
              <FolderIcon className="h-4 w-4 text-editorial-text" />
              <span>Categories:</span>
            </span>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => handleSelectCategory(null)}
                className="text-[11px] font-mono uppercase tracking-wider text-editorial-muted hover:text-editorial-text cursor-pointer underline"
              >
                View all categories
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => handleSelectCategory(null)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
                selectedCategory === null
                  ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                  : 'border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text bg-editorial-surface'
              )}
            >
              <span>All Categories</span>
              <span className="opacity-70 text-[10px]">({articles.length})</span>
            </button>
            {CATEGORIES.map((cat) => {
              const count = categoryCounts.catMap.get(cat.id) || 0;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(isSelected ? null : cat.id)}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
                    isSelected
                      ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                      : 'border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text bg-editorial-surface'
                  )}
                >
                  <span>{cat.name}</span>
                  {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Subcategories Filter (Revealed when a category is selected) */}
        {activeCategoryDef && (
          <div className="pt-3 border-t border-editorial-border/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-editorial-muted">
              <span>{activeCategoryDef.name} Subcategories:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => handleSelectSubcategory(null)}
                className={cn(
                  'px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer shrink-0',
                  selectedSubcategory === null
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'text-editorial-muted hover:text-editorial-text border border-editorial-border bg-editorial-surface-subtle'
                )}
              >
                All {activeCategoryDef.name}
              </button>
              {activeCategoryDef.subcategories.map((sub) => {
                const count = categoryCounts.subMap.get(`${activeCategoryDef.id}:${sub.id}`) || 0;
                const isSelected = selectedSubcategory === sub.id;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSelectSubcategory(sub.id)}
                    className={cn(
                      'px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-xs transition-all cursor-pointer shrink-0 flex items-center gap-1',
                      isSelected
                        ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                        : 'text-editorial-muted hover:text-editorial-text border border-editorial-border bg-editorial-surface'
                    )}
                  >
                    <span>{sub.name}</span>
                    {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Row 3: Search Input + Live Auto-complete Suggestions + Sort Selector */}
        <div className="pt-3 border-t border-editorial-border/60 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Live Search Input with Suggestions Dropdown */}
          <div className="group relative flex-1">
            <div className="flex items-center bg-editorial-surface border border-editorial-border focus-within:border-editorial-text focus-within:ring-1 focus-within:ring-editorial-text/20 rounded-sm transition-all">
              <MagnifyingGlassIcon className="h-4.5 w-4.5 text-editorial-muted group-focus-within:text-editorial-text transition-colors absolute start-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  syncParams(selectedCategory, selectedSubcategory, selectedTag, e.target.value);
                }}
                placeholder="Search articles, categories, or keywords..."
                className="w-full bg-transparent ps-10 pe-10 py-2.5 font-sans text-sm sm:text-base text-editorial-text placeholder:text-editorial-muted/70 focus:outline-none"
                aria-label={t.search}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    syncParams(selectedCategory, selectedSubcategory, selectedTag, '');
                  }}
                  className="absolute end-2.5 p-1 text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer"
                  aria-label={t.clearSearch}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Smart Search Suggestions Dropdown */}
            {showSuggestions && inPageSuggestions.length > 0 && (
              <div
                className="absolute top-full start-0 end-0 mt-1 z-30 bg-editorial-surface border border-editorial-border rounded-sm shadow-xl p-2.5 space-y-2"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex items-center justify-between pb-1 border-b border-editorial-border/60 text-[10px] font-mono uppercase tracking-wider text-editorial-muted">
                  <span className="flex items-center gap-1">
                    <SparklesIcon className="h-3 w-3 text-editorial-text" />
                    <span>Search Suggestions</span>
                  </span>
                  <span>Click to apply</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {inPageSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplySuggestion(sug)}
                      className="px-2.5 py-1 text-xs font-mono rounded-xs border border-editorial-border hover:border-editorial-text bg-editorial-surface-subtle hover:bg-editorial-surface text-editorial-text transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {sug.type === 'category' && <FolderIcon className="h-3 w-3 text-editorial-muted" />}
                      {sug.type === 'topic' && <TagIcon className="h-3 w-3 text-editorial-muted" />}
                      <span>{sug.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort Selector using Theme Colors */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider shrink-0">
            <span className="text-editorial-muted flex items-center gap-1.5 font-medium">
              <AdjustmentsHorizontalIcon className="h-4 w-4 text-editorial-text" />
              <span>{t.sortBy}:</span>
            </span>
            <div className="inline-flex rounded-sm border border-editorial-border bg-editorial-surface-subtle overflow-hidden p-0.5">
              <button
                type="button"
                onClick={() => setSortBy('newest')}
                className={cn(
                  'px-3 py-1.5 rounded-xs cursor-pointer transition-all',
                  sortBy === 'newest'
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                {t.newest}
              </button>
              <button
                type="button"
                onClick={() => setSortBy('oldest')}
                className={cn(
                  'px-3 py-1.5 rounded-xs cursor-pointer transition-all',
                  sortBy === 'oldest'
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                {t.oldest}
              </button>
            </div>
          </div>
        </div>

        {/* Row 4: Topic / Tag Filter Pills with Click-to-Slide Arrows */}
        {allTags.length > 0 && (
          <div className="relative flex items-center pt-3 border-t border-editorial-border/60 gap-1.5">
            {/* Left Slide Arrow */}
            <button
              type="button"
              onClick={() => slideTopics('left')}
              disabled={!canScrollLeft}
              className={cn(
                'shrink-0 p-1.5 rounded-sm bg-editorial-surface border border-editorial-border transition-all cursor-pointer me-1',
                canScrollLeft
                  ? 'text-editorial-text hover:border-editorial-text hover:text-editorial-text shadow-2xs opacity-100'
                  : 'text-editorial-muted opacity-25 cursor-not-allowed border-transparent bg-transparent'
              )}
              aria-label="Slide topics left"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {/* Scrollable Track */}
            <div
              ref={topicSliderRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
            >
              <button
                type="button"
                onClick={() => handleSelectTag(null)}
                className={cn(
                  'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer shrink-0',
                  selectedTag === null
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text bg-editorial-surface'
                )}
              >
                {t.allTopics} ({articles.length})
              </button>
              {allTags.map((tag) => {
                const count = articles.filter((a) => a.tags?.includes(tag)).length;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer shrink-0',
                      selectedTag === tag
                        ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                        : 'border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text bg-editorial-surface'
                    )}
                  >
                    #{tag} ({count})
                  </button>
                );
              })}
            </div>

            {/* Right Slide Arrow */}
            <button
              type="button"
              onClick={() => slideTopics('right')}
              disabled={!canScrollRight}
              className={cn(
                'shrink-0 p-1.5 rounded-sm bg-editorial-surface border border-editorial-border transition-all cursor-pointer ms-1',
                canScrollRight
                  ? 'text-editorial-text hover:border-editorial-text hover:text-editorial-text shadow-2xs opacity-100'
                  : 'text-editorial-muted opacity-25 cursor-not-allowed border-transparent bg-transparent'
              )}
              aria-label="Slide topics right"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Row 5: Active Filters Removable Chips & 1-Click Clear */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-editorial-border/60 text-xs font-mono">
            <span className="text-editorial-muted text-[11px] uppercase tracking-wider">
              Active Filters:
            </span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-editorial-surface-subtle border border-editorial-border text-editorial-text">
                <span>Category: {getCategoryById(selectedCategory)?.name}</span>
                <button
                  type="button"
                  onClick={() => handleSelectCategory(null)}
                  className="hover:text-accent font-bold cursor-pointer text-editorial-muted hover:text-editorial-text"
                  aria-label="Remove category filter"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedSubcategory && selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-editorial-surface-subtle border border-editorial-border text-editorial-text">
                <span>
                  Subcategory:{' '}
                  {activeCategoryDef?.subcategories.find((s) => s.id === selectedSubcategory)?.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectSubcategory(null)}
                  className="hover:text-accent font-bold cursor-pointer text-editorial-muted hover:text-editorial-text"
                  aria-label="Remove subcategory filter"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-editorial-surface-subtle border border-editorial-border text-editorial-text">
                <span>#{selectedTag}</span>
                <button
                  type="button"
                  onClick={() => handleSelectTag(null)}
                  className="hover:text-accent font-bold cursor-pointer text-editorial-muted hover:text-editorial-text"
                  aria-label="Remove tag filter"
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-editorial-surface-subtle border border-editorial-border text-editorial-text">
                <span>"{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    syncParams(selectedCategory, selectedSubcategory, selectedTag, '');
                  }}
                  className="hover:text-accent font-bold cursor-pointer text-editorial-muted hover:text-editorial-text"
                  aria-label="Remove search filter"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-editorial-muted hover:text-editorial-text underline cursor-pointer text-[11px] uppercase tracking-wider ms-auto"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Main Articles Stream or Empty Search Fallback */}
      <section>
        {filteredArticles.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-dashed border-editorial-border rounded-sm p-8 bg-editorial-surface/40">
            <h3 className="font-display font-bold text-2xl text-editorial-text">
              {t.noSearchResults}
            </h3>
            <p className="font-serif text-editorial-muted max-w-md mx-auto">
              We couldn't find any articles matching your active categories, subcategories, or search query.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-block px-5 py-2.5 bg-editorial-text text-editorial-bg rounded-sm text-xs uppercase font-mono tracking-wider font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <ArticleList articles={filteredArticles} />
        )}
      </section>
    </div>
  );
}
