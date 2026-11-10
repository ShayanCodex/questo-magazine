import { useState, useMemo, useRef, useCallback } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  FolderIcon,
  TagIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
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
  getCategoryShortName,
  formatTopicName,
  getStructuredSearchSuggestions,
  type SearchSuggestion,
} from '../lib/categories';

interface ArticlesLoaderData {
  articles: ArticleData[];
  pathname: string;
}

const ARTICLES_PER_PAGE = 4;

export function Articles() {
  const loaderData = (useLoaderData() as ArticlesLoaderData) || {};
  const articles = loaderData.articles || [];
  const pathname = loaderData.pathname || '/articles';
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter values from URL query parameters for shareability & direct linking
  const initialCategory = searchParams.get('category');
  const initialSubcategory = searchParams.get('subcategory');
  const initialTag = searchParams.get('tag');
  const initialQuery = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(initialSubcategory);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    isNaN(initialPage) || initialPage < 1 ? 1 : initialPage
  );

  const articleSectionRef = useRef<HTMLElement>(null);

  // Sync state to URL search parameters
  const syncParams = useCallback(
    (cat: string | null, sub: string | null, tag: string | null, q: string, page = 1) => {
      const next = new URLSearchParams();
      if (cat) next.set('category', cat);
      if (sub) next.set('subcategory', sub);
      if (tag) next.set('tag', tag);
      if (q.trim()) next.set('q', q.trim());
      if (page > 1) next.set('page', String(page));
      setSearchParams(next, { replace: true });
    },
    [setSearchParams]
  );

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: t.articles },
  ];

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

  // Structured Live auto-complete and search suggestions (Categories, Subcategories, Topics, Articles)
  const structuredSuggestions = useMemo(() => {
    return getStructuredSearchSuggestions(searchQuery, articles);
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

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedArticles = useMemo(() => {
    const start = (safeCurrentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [filteredArticles, safeCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    syncParams(selectedCategory, selectedSubcategory, selectedTag, searchQuery, newPage);
    articleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
    setCurrentPage(1);
    syncParams(null, null, null, '', 1);
  };

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(null);
    setCurrentPage(1);
    syncParams(catId, null, selectedTag, searchQuery, 1);
  };

  const handleSelectSubcategory = (subId: string | null) => {
    const nextSub = selectedSubcategory === subId ? null : subId;
    setSelectedSubcategory(nextSub);
    setCurrentPage(1);
    syncParams(selectedCategory, nextSub, selectedTag, searchQuery, 1);
  };

  const handleSelectTag = (tag: string | null) => {
    const nextTag = selectedTag === tag ? null : tag;
    setSelectedTag(nextTag);
    setCurrentPage(1);
    syncParams(selectedCategory, selectedSubcategory, nextTag, searchQuery, 1);
  };

  const handleApplySuggestion = (sug: SearchSuggestion) => {
    if (sug.type === 'category' && sug.categoryId) {
      handleSelectCategory(sug.categoryId);
      setSearchQuery('');
    } else if (sug.type === 'subcategory' && sug.categoryId && sug.subcategoryId) {
      setSelectedCategory(sug.categoryId);
      setSelectedSubcategory(sug.subcategoryId);
      setSearchQuery('');
      setCurrentPage(1);
      syncParams(sug.categoryId, sug.subcategoryId, selectedTag, '', 1);
    } else if (sug.type === 'topic') {
      handleSelectTag(sug.value);
      setSearchQuery('');
    } else {
      setSearchQuery(sug.value);
      setCurrentPage(1);
      syncParams(selectedCategory, selectedSubcategory, selectedTag, sug.value, 1);
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
        keywords={[
          'Questo articles',
          'editorial archive',
          'architecture essays',
          'design theory',
          'functional programming',
          'minimalism',
          'visual culture',
        ]}
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

      {/* Sleek Awwwards-Level Search & Filter Section */}
      <section className="space-y-4">
        {/* Row 1: Compact Search Input + Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Real-Time Live Search Input with Dynamic Suggestions Dropdown */}
          <div className="group relative flex-1">
            <div className="flex items-center bg-editorial-surface border border-editorial-border focus-within:border-editorial-text focus-within:ring-1 focus-within:ring-editorial-text/20 rounded-sm transition-all h-11">
              <MagnifyingGlassIcon className="h-4.5 w-4.5 text-editorial-muted group-focus-within:text-editorial-text transition-colors absolute start-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  setCurrentPage(1);
                  syncParams(selectedCategory, selectedSubcategory, selectedTag, e.target.value, 1);
                }}
                placeholder={t.searchPlaceholder || 'Search articles, topics, or categories...'}
                className="w-full bg-transparent ps-11 pe-10 py-2.5 font-sans text-sm sm:text-base text-editorial-text placeholder:text-editorial-muted/70 focus:outline-none"
                aria-label={t.search}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                    syncParams(selectedCategory, selectedSubcategory, selectedTag, '', 1);
                  }}
                  className="absolute end-3 p-1 text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer"
                  aria-label={t.clearSearch}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Smart Search Suggestions Dropdown: Only shown when user has typed */}
            {showSuggestions && searchQuery.trim().length >= 1 && structuredSuggestions.total > 0 && (
              <div
                className="absolute top-full start-0 end-0 mt-1.5 z-40 bg-editorial-surface border border-editorial-border rounded-lg shadow-2xl p-3.5 space-y-3 max-h-80 overflow-y-auto custom-scrollbar font-sans"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-editorial-border text-xs text-editorial-muted font-medium">
                  <span className="flex items-center gap-1.5">
                    <SparklesIcon className="h-3.5 w-3.5 text-editorial-text" />
                    <span>Suggestions</span>
                  </span>
                  <span className="text-[11px] opacity-75">Click to filter</span>
                </div>

                {/* Section A: Categories Suggestions */}
                {structuredSuggestions.categories.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-xs text-editorial-muted font-semibold">
                      <FolderIcon className="h-3.5 w-3.5 text-editorial-text" />
                      <span>{t.categories || 'Categories'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {structuredSuggestions.categories.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleApplySuggestion(sug)}
                          className="px-3 py-1 text-xs rounded-full border border-editorial-border hover:border-editorial-text bg-editorial-surface-subtle hover:bg-editorial-surface text-editorial-text transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                        >
                          <FolderIcon className="h-3 w-3 text-editorial-muted" />
                          <span>{sug.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section B: Subcategories Suggestions */}
                {structuredSuggestions.subcategories.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-editorial-border/50">
                    <div className="flex items-center gap-1 text-xs text-editorial-muted font-semibold">
                      <span>{t.subcategories || 'Subcategories'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {structuredSuggestions.subcategories.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleApplySuggestion(sug)}
                          className="px-3 py-1 text-xs rounded-full border border-editorial-border hover:border-editorial-text bg-editorial-surface-subtle hover:bg-editorial-surface text-editorial-text transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                        >
                          <span>{sug.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section C: Topics Suggestions */}
                {structuredSuggestions.topics.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-editorial-border/50">
                    <div className="flex items-center gap-1 text-xs text-editorial-muted font-semibold">
                      <TagIcon className="h-3.5 w-3.5 text-editorial-text" />
                      <span>{t.topics || 'Topics'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {structuredSuggestions.topics.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleApplySuggestion(sug)}
                          className="px-3 py-1 text-xs rounded-full border border-editorial-border hover:border-editorial-text bg-editorial-surface-subtle hover:bg-editorial-surface text-editorial-text transition-colors cursor-pointer flex items-center gap-1 font-medium"
                        >
                          <span>{sug.label}</span>
                          {sug.count && <span className="opacity-60 text-[10px]">({sug.count})</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section D: Direct Article Matches */}
                {structuredSuggestions.queries.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-editorial-border/50">
                    <div className="flex items-center gap-1 text-xs text-editorial-muted font-semibold">
                      <DocumentTextIcon className="h-3.5 w-3.5 text-editorial-text" />
                      <span>Articles</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {structuredSuggestions.queries.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleApplySuggestion(sug)}
                          className="text-start px-2.5 py-1.5 rounded-md hover:bg-editorial-surface-hover text-editorial-text transition-colors cursor-pointer text-xs truncate flex items-center gap-2 font-medium"
                        >
                          <ArrowRightIcon className="h-3 w-3 text-editorial-muted rtl:rotate-180" />
                          <span>"{sug.label}"</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sort Selector: Newest | Oldest */}
          <div className="flex items-center gap-2 text-xs shrink-0 self-end sm:self-center font-sans">
            <span className="text-editorial-muted flex items-center gap-1.5 font-medium">
              <AdjustmentsHorizontalIcon className="h-4 w-4 text-editorial-text" />
              <span>{t.sortBy}:</span>
            </span>
            <div className="inline-flex rounded-full border border-editorial-border bg-editorial-surface-subtle overflow-hidden p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setSortBy('newest');
                  setCurrentPage(1);
                }}
                className={cn(
                  'px-3 py-1 text-xs rounded-full cursor-pointer transition-all font-medium',
                  sortBy === 'newest'
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                {t.newest}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortBy('oldest');
                  setCurrentPage(1);
                }}
                className={cn(
                  'px-3 py-1 text-xs rounded-full cursor-pointer transition-all font-medium',
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

        {/* Clean Single-Line Horizontal Category Filter Bar in Poppins */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2.5 border-y border-editorial-border font-sans">
          <button
            type="button"
            onClick={() => handleSelectCategory(null)}
            className={cn(
              'px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
              selectedCategory === null
                ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                : 'text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover border border-editorial-border/60'
            )}
          >
            <span>{t.allCategories || 'All Categories'}</span>
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
                  'px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer shrink-0 flex items-center gap-1.5',
                  isSelected
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover border border-editorial-border/60'
                )}
              >
                <span>{getCategoryShortName(cat.id)}</span>
                {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Dynamic Subcategories (Revealed ONLY when a category is selected) */}
        {activeCategoryDef && (
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 font-sans">
            <span className="text-xs font-semibold text-editorial-text shrink-0 flex items-center gap-1">
              <span>{getCategoryShortName(activeCategoryDef.id)}:</span>
            </span>
            <button
              type="button"
              onClick={() => handleSelectSubcategory(null)}
              className={cn(
                'px-3 py-1 text-xs rounded-full transition-all cursor-pointer shrink-0 font-medium',
                selectedSubcategory === null
                  ? 'bg-editorial-text text-editorial-bg font-semibold'
                  : 'text-editorial-muted hover:text-editorial-text border border-editorial-border/60'
              )}
            >
              All
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
                    'px-3 py-1 text-xs rounded-full transition-all cursor-pointer shrink-0 flex items-center gap-1 font-medium',
                    isSelected
                      ? 'bg-editorial-text text-editorial-bg font-semibold'
                      : 'text-editorial-muted hover:text-editorial-text border border-editorial-border/60'
                  )}
                >
                  <span>{sub.name}</span>
                  {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Active Filters Removable Chips & 1-Click Clear (Shown ONLY when filters are active) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-sans">
            <span className="text-editorial-muted font-medium">
              {t.activeFilters || 'Active'}:
            </span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-editorial-surface-subtle border border-editorial-border text-editorial-text font-medium">
                <span>Category: {getCategoryShortName(selectedCategory)}</span>
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
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-editorial-surface-subtle border border-editorial-border text-editorial-text font-medium">
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
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-editorial-surface-subtle border border-editorial-border text-editorial-text font-medium">
                <span>Topic: {formatTopicName(selectedTag)}</span>
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
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-editorial-surface-subtle border border-editorial-border text-editorial-text font-medium">
                <span>"{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                    syncParams(selectedCategory, selectedSubcategory, selectedTag, '', 1);
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
              className="text-editorial-muted hover:text-editorial-text underline cursor-pointer text-xs font-medium ms-auto"
            >
              {t.clearAllFilters || 'Clear all'}
            </button>
          </div>
        )}
      </section>

      {/* Main Articles Stream with Pagination */}
      <section ref={articleSectionRef} className="space-y-8">
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
          <>
            <ArticleList articles={paginatedArticles} />

            {/* Click Next Page / Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-editorial-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted">
                  Showing {(safeCurrentPage - 1) * ARTICLES_PER_PAGE + 1}–
                  {Math.min(safeCurrentPage * ARTICLES_PER_PAGE, filteredArticles.length)} of{' '}
                  {filteredArticles.length} {t.articlesFound} (Page {safeCurrentPage} of {totalPages})
                </span>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {/* Previous Page Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="px-4 py-1.5 rounded-full border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1.5 font-sans text-xs font-medium"
                  >
                    <ArrowLeftIcon className="h-3.5 w-3.5 rtl:rotate-180" />
                    <span>{t.prevPage || (isRtl ? 'التالي' : 'Previous')}</span>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        'w-8 h-8 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer flex items-center justify-center',
                        pageNum === safeCurrentPage
                          ? 'bg-editorial-text text-editorial-bg font-bold shadow-xs'
                          : 'border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text bg-editorial-surface'
                      )}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Page Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    className="px-4 py-1.5 rounded-full border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1.5 font-sans text-xs font-medium"
                  >
                    <span>{t.nextPage || (isRtl ? 'السابق' : 'Next')}</span>
                    <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
