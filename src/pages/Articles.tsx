import { useState, useMemo, useRef, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { createBreadcrumbJsonLd } from '../lib/breadcrumbs';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArticleList } from '../components/ArticleList';
import { cn } from '../lib/utils';

interface ArticlesLoaderData {
  articles: ArticleData[];
  pathname: string;
}

export function Articles() {
  const { articles, pathname } = useLoaderData() as ArticlesLoaderData;
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const topicSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    const filtered = articles.filter((article) => {
      const matchesTag = selectedTag ? article.tags?.includes(selectedTag) : true;
      if (!matchesTag) return false;
      if (!cleanQuery) return true;

      const titleMatch = article.title.toLowerCase().includes(cleanQuery);
      const excerptMatch = article.excerpt.toLowerCase().includes(cleanQuery);
      const authorMatch = article.author.toLowerCase().includes(cleanQuery);
      const tagsMatch = article.tags?.some((tg) => tg.toLowerCase().includes(cleanQuery));

      return titleMatch || excerptMatch || authorMatch || tagsMatch;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [articles, searchQuery, selectedTag, sortBy]);

  const hasActiveFilters = searchQuery.length > 0 || selectedTag !== null;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
    setSortBy('newest');
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

      {/* Advanced In-Page Search & Filter Toolbar with Adaptive Theme Styling */}
      <section className="space-y-6 bg-editorial-surface border border-editorial-border p-5 sm:p-7 rounded-sm shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Live Search Input */}
          <div className="group relative flex-1 flex items-center bg-editorial-surface border border-editorial-border focus-within:border-editorial-text focus-within:ring-2 focus-within:ring-editorial-text/10 rounded-sm transition-all">
            <MagnifyingGlassIcon className="h-5 w-5 text-editorial-muted group-focus-within:text-editorial-text transition-colors absolute start-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent ps-11 pe-11 py-3 font-serif text-base text-editorial-text placeholder:text-editorial-muted/70 focus:outline-none"
              aria-label={t.search}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-3 p-1.5 text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer"
                aria-label={t.clearSearch}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
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
                  'px-3.5 py-1.5 rounded-xs cursor-pointer transition-all',
                  sortBy === 'newest'
                    ? 'bg-editorial-text text-editorial-inverted font-semibold shadow-xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                {t.newest}
              </button>
              <button
                type="button"
                onClick={() => setSortBy('oldest')}
                className={cn(
                  'px-3.5 py-1.5 rounded-xs cursor-pointer transition-all',
                  sortBy === 'oldest'
                    ? 'bg-editorial-text text-editorial-inverted font-semibold shadow-xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                {t.oldest}
              </button>
            </div>
          </div>
        </div>

        {/* Topic Filter Pills with Click-to-Slide Arrows */}
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
                onClick={() => setSelectedTag(null)}
                className={cn(
                  'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer shrink-0',
                  selectedTag === null
                    ? 'bg-editorial-text text-editorial-inverted font-semibold shadow-xs'
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
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer shrink-0',
                      selectedTag === tag
                        ? 'bg-editorial-text text-editorial-inverted font-semibold shadow-xs'
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
      </section>

      {/* Articles Ledger List or Empty State */}
      <section className="pt-2">
        {filteredArticles.length > 0 ? (
          <ArticleList articles={filteredArticles} />
        ) : (
          <div className="py-20 text-center space-y-4 border border-dashed border-editorial-border rounded-sm">
            <p className="font-serif text-lg text-editorial-muted">
              {t.noSearchResults}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-block px-4 py-2 border border-editorial-border rounded-sm text-xs uppercase font-mono tracking-wider hover:border-editorial-text transition-colors cursor-pointer"
              >
                {t.resetFilters}
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
