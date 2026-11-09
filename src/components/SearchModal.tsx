import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
  ClockIcon,
  SparklesIcon,
  TagIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import type { SearchItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';
import {
  CATEGORIES,
  getArticleCategory,
  getStructuredSearchSuggestions,
  type SearchSuggestion,
} from '../lib/categories';

const RECENT_SEARCHES_KEY = 'questo-recent-searches';

export interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchItem[];
  tags?: string[];
}

/**
 * Pure client-side search keyword highlighter.
 * Highlights matching substrings in titles or excerpts with zero external dependencies.
 */
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  if (parts.length <= 1) return text;

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-editorial-text/15 text-editorial-text font-bold rounded-2xs px-0.5 not-italic"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function SearchModal({
  open,
  onOpenChange,
  items,
  tags = [],
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navigate = useNavigate();
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  // Smart live structured suggestions (Categories, Subcategories, Topics, Queries)
  const liveStructured = useMemo(() => {
    return getStructuredSearchSuggestions(query, items);
  }, [query, items]);

  // Load recent searches from localStorage on mount & open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored).slice(0, 5));
        }
      } catch {
        // Storage unavailable in private browsing
      }
    }
  }, [open]);

  const saveRecentSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean || clean.length < 2) return;
    try {
      const existing: string[] = JSON.parse(
        localStorage.getItem(RECENT_SEARCHES_KEY) || '[]'
      );
      const updated = [
        clean,
        ...existing.filter((s) => s.toLowerCase() !== clean.toLowerCase()),
      ].slice(0, 5);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch {
      // Ignore storage errors
    }
  };

  const checkSliderScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
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
    checkSliderScroll();
    const el = sliderRef.current;
    if (el) {
      el.addEventListener('scroll', checkSliderScroll);
      window.addEventListener('resize', checkSliderScroll);
      return () => {
        el.removeEventListener('scroll', checkSliderScroll);
        window.removeEventListener('resize', checkSliderScroll);
      };
    }
  }, [tags, open]);

  const slide = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 160;
    const multiplier = direction === 'left' ? -1 : 1;
    const delta = isRtl ? -multiplier * scrollAmount : multiplier * scrollAmount;
    sliderRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(checkSliderScroll, 200);
  };

  // Fast client-side multi-field matching with category & subcategory support
  const filtered = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const { category, subcategory } = getArticleCategory(item);
      if (selectedCategory && category.id !== selectedCategory) return false;
      if (selectedSubcategory && subcategory?.id !== selectedSubcategory) return false;
      const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;
      if (!matchesTag) return false;
      if (!cleanQuery) return true;

      const titleMatch = item.title.toLowerCase().includes(cleanQuery);
      const excerptMatch = item.excerpt.toLowerCase().includes(cleanQuery);
      const authorMatch = item.author.toLowerCase().includes(cleanQuery);
      const tagsMatch = item.tags?.some((tg) => tg.toLowerCase().includes(cleanQuery));
      const categoryMatch = category.name.toLowerCase().includes(cleanQuery);
      const subcategoryMatch = subcategory?.name.toLowerCase().includes(cleanQuery);

      return titleMatch || excerptMatch || authorMatch || tagsMatch || categoryMatch || subcategoryMatch;
    });
  }, [items, query, selectedTag, selectedCategory, selectedSubcategory]);

  const handleApplySuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category' && suggestion.categoryId) {
      setSelectedCategory(suggestion.categoryId);
      setSelectedSubcategory(null);
      setQuery('');
    } else if (
      suggestion.type === 'subcategory' &&
      suggestion.categoryId &&
      suggestion.subcategoryId
    ) {
      setSelectedCategory(suggestion.categoryId);
      setSelectedSubcategory(suggestion.subcategoryId);
      setQuery('');
    } else if (suggestion.type === 'topic') {
      setSelectedTag(suggestion.value);
      setQuery('');
    } else {
      setQuery(suggestion.value);
    }
  };

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedTag(null);
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        if (query.trim()) {
          saveRecentSearch(query);
        }
        handleSelect(filtered[selectedIndex].slug);
      }
    }
  };

  const handleSelect = (slug: string) => {
    if (query.trim()) {
      saveRecentSearch(query);
    }
    onOpenChange(false);
    navigate(localePath(`/articles/${slug}`));
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
        <DialogPrimitive.Content
          onKeyDown={handleKeyDown}
          className="fixed start-1/2 top-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 bg-editorial-surface border border-editorial-border shadow-2xl rounded-sm overflow-hidden text-editorial-text focus:outline-none"
        >
          {/* Accessible Dialog Title & Description */}
          <DialogPrimitive.Title className="sr-only">
            {t.search}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {t.searchPlaceholder}
          </DialogPrimitive.Description>

          {/* Compact, Focused Search Input Bar */}
          <div className="group relative flex items-center border-b border-editorial-border bg-editorial-surface px-4 py-3 sm:px-5 focus-within:bg-editorial-surface-subtle transition-colors">
            <MagnifyingGlassIcon className="h-4.5 w-4.5 text-editorial-text group-focus-within:text-editorial-text shrink-0 me-3 transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent font-sans text-sm sm:text-base text-editorial-text placeholder:text-editorial-muted/70 focus:outline-none"
              aria-label={t.search}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-sm text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer me-1.5"
                aria-label={t.clearSearch}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase text-editorial-muted border border-editorial-border rounded-xs bg-editorial-surface-subtle">
              ESC
            </kbd>
          </div>

          {/* Smart Live Suggestions Strip with Sections: Categories, Subcategories, Topics & #Tags */}
          {liveStructured.total > 0 && (
            <div className="px-3.5 py-2 border-b border-editorial-border/60 bg-editorial-surface-subtle flex flex-col gap-1.5 text-xs font-mono">
              {/* Category Suggestions */}
              {liveStructured.categories.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-editorial-muted flex items-center gap-1 shrink-0">
                    <FolderIcon className="h-3 w-3 text-editorial-text" />
                    <span>Categories:</span>
                  </span>
                  {liveStructured.categories.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplySuggestion(sug)}
                      className={cn(
                        'font-mono text-[11px] px-2 py-0.5 rounded-xs border transition-colors cursor-pointer shrink-0 flex items-center gap-1',
                        selectedCategory === sug.categoryId
                          ? 'bg-editorial-text text-editorial-bg font-semibold'
                          : 'bg-editorial-surface border-editorial-border hover:border-editorial-text text-editorial-text'
                      )}
                    >
                      <FolderIcon className="h-3 w-3 text-editorial-muted" />
                      <span>{sug.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Topics & #Tags Suggestions */}
              {liveStructured.topics.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-editorial-muted flex items-center gap-1 shrink-0">
                    <TagIcon className="h-3 w-3 text-editorial-text" />
                    <span>Topics:</span>
                  </span>
                  {liveStructured.topics.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplySuggestion(sug)}
                      className={cn(
                        'font-mono text-[11px] px-2 py-0.5 rounded-xs border transition-colors cursor-pointer shrink-0 flex items-center gap-1',
                        selectedTag === sug.value
                          ? 'bg-editorial-text text-editorial-bg font-semibold'
                          : 'bg-editorial-surface border-editorial-border hover:border-editorial-text text-editorial-text'
                      )}
                    >
                      <span>{sug.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Categories Filter Strip */}
          <div className="px-3 py-1.5 border-b border-editorial-border/60 bg-editorial-surface flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-editorial-muted shrink-0 me-1">
              Category:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              className={cn(
                'px-2 py-0.5 text-[11px] rounded-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0',
                selectedCategory === null && selectedSubcategory === null
                  ? 'bg-editorial-text text-editorial-bg font-semibold'
                  : 'text-editorial-muted hover:text-editorial-text border border-editorial-border bg-editorial-surface-subtle'
              )}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                  setSelectedSubcategory(null);
                }}
                className={cn(
                  'px-2 py-0.5 text-[11px] rounded-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0',
                  selectedCategory === cat.id
                    ? 'bg-editorial-text text-editorial-bg font-semibold'
                    : 'text-editorial-muted hover:text-editorial-text border border-editorial-border bg-editorial-surface-subtle'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Compact Topic Filter Slider */}
          {tags.length > 0 && (
            <div className="relative flex items-center border-b border-editorial-border/60 bg-editorial-surface-subtle px-2 sm:px-3 py-1.5">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => slide('left')}
                disabled={!canScrollLeft}
                className={cn(
                  'shrink-0 p-1 rounded-sm bg-editorial-surface border border-editorial-border transition-all cursor-pointer me-1',
                  canScrollLeft
                    ? 'text-editorial-text hover:border-editorial-text opacity-100 shadow-2xs'
                    : 'text-editorial-muted opacity-25 cursor-not-allowed border-transparent bg-transparent'
                )}
                aria-label="Slide topics left"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              </button>

              {/* Scrollable Track */}
              <div
                ref={sliderRef}
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5 text-xs font-mono"
              >
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] rounded-sm transition-colors cursor-pointer shrink-0 uppercase tracking-wider',
                    selectedTag === null
                      ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                      : 'text-editorial-muted hover:text-editorial-text border border-editorial-border bg-editorial-surface'
                  )}
                >
                  {t.allTopics}
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={cn(
                      'px-2.5 py-1 text-[11px] rounded-sm transition-colors cursor-pointer shrink-0 uppercase tracking-wider',
                      selectedTag === tag
                        ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                        : 'text-editorial-muted hover:text-editorial-text border border-editorial-border bg-editorial-surface'
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => slide('right')}
                disabled={!canScrollRight}
                className={cn(
                  'shrink-0 p-1 rounded-sm bg-editorial-surface border border-editorial-border transition-all cursor-pointer ms-1',
                  canScrollRight
                    ? 'text-editorial-text hover:border-editorial-text opacity-100 shadow-2xs'
                    : 'text-editorial-muted opacity-25 cursor-not-allowed border-transparent bg-transparent'
                )}
                aria-label="Slide topics right"
              >
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Professional Blogger Feature: Recent Searches Bar (Zero Backend / Pure Client-Side) */}
          {!query && recentSearches.length > 0 && (
            <div className="px-4 py-2 border-b border-editorial-border/60 bg-editorial-surface flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 pe-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-editorial-muted flex items-center gap-1 shrink-0">
                  <ClockIcon className="h-3.5 w-3.5 text-editorial-muted" />
                  <span>Recent:</span>
                </span>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="font-mono text-[11px] px-2 py-0.5 rounded-xs bg-editorial-surface-subtle border border-editorial-border hover:border-editorial-text text-editorial-text transition-colors cursor-pointer shrink-0"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="font-mono text-[10px] uppercase tracking-wider text-editorial-muted hover:text-editorial-text cursor-pointer shrink-0"
              >
                Clear
              </button>
            </div>
          )}

          {/* Results List: Balanced, Normal-Sized, Clean Cards with Match Highlighting & ZERO Hover Borders */}
          <div
            ref={resultsContainerRef}
            className="max-h-72 sm:max-h-84 overflow-y-auto custom-scrollbar p-3 pb-6 space-y-2"
          >
            {filtered.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-3">
                <p className="font-serif text-sm text-editorial-muted">
                  {t.noSearchResults}
                </p>
                {/* Helpful Suggestions */}
                <div className="pt-2 flex flex-col items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-editorial-muted flex items-center gap-1.5">
                    <SparklesIcon className="h-3.5 w-3.5" />
                    <span>Popular editorial topics:</span>
                  </span>
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-sm">
                    {tags.slice(0, 5).map((tg) => (
                      <button
                        key={tg}
                        type="button"
                        onClick={() => {
                          setSelectedTag(tg);
                          setQuery('');
                        }}
                        className="px-2 py-0.5 font-mono text-[11px] rounded-xs border border-editorial-border hover:border-editorial-text bg-editorial-surface text-editorial-text transition-colors cursor-pointer"
                      >
                        #{tg}
                      </button>
                    ))}
                  </div>
                </div>

                {(query || selectedTag) && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setSelectedTag(null);
                      }}
                      className="inline-block text-xs uppercase font-mono tracking-wider text-editorial-text hover:underline cursor-pointer"
                    >
                      {t.resetFilters}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filtered.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.slug}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(item.slug)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(item.slug);
                      }
                    }}
                    className={cn(
                      'group px-3.5 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center justify-between gap-3 text-start border-0 outline-none focus:outline-none ring-0 focus:ring-0',
                      isSelected
                        ? 'bg-editorial-surface-hover'
                        : 'hover:bg-editorial-surface-hover/80'
                    )}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      {/* Compact Meta & Category Taxonomy Row */}
                      {(() => {
                        const { category, subcategory } = getArticleCategory(item);
                        return (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-editorial-muted">
                            <span className="text-editorial-text font-bold">{category.name}</span>
                            {subcategory && (
                              <>
                                <span className="opacity-40">/</span>
                                <span className="opacity-80">{subcategory.name}</span>
                              </>
                            )}
                            <span className="opacity-40">•</span>
                            <span>{item.date}</span>
                            <span className="opacity-40">•</span>
                            <span>{highlightMatch(item.author, query)}</span>
                          </div>
                        );
                      })()}

                      {/* Clean Single-Line Title with Match Highlighting */}
                      <h4 className="font-display font-bold text-sm sm:text-[15px] text-editorial-text leading-tight line-clamp-1">
                        {highlightMatch(item.title, query)}
                      </h4>

                      {/* Single-Line Excerpt with Match Highlighting */}
                      <p className="font-serif text-xs text-editorial-muted line-clamp-1 leading-normal">
                        {highlightMatch(item.excerpt, query)}
                      </p>

                      {/* Subtle Mini Tag Chips */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {item.tags.slice(0, 3).map((tg) => (
                            <Badge
                              key={tg}
                              variant="default"
                              className="text-[9px] py-0 px-1 font-mono uppercase border-editorial-border/70 bg-editorial-surface-subtle"
                            >
                              #{highlightMatch(tg, query)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Smooth Arrow Indicator */}
                    <ArrowRightIcon
                      className={cn(
                        'h-3.5 w-3.5 shrink-0 transition-transform duration-150',
                        isSelected
                          ? 'text-editorial-text opacity-100'
                          : 'text-editorial-muted opacity-40 group-hover:opacity-100 group-hover:text-editorial-text',
                        isRtl
                          ? 'rotate-180 -translate-x-0.5 group-hover:-translate-x-1.5'
                          : 'translate-x-0 group-hover:translate-x-1'
                      )}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Compact Accessible Footer */}
          <div className="border-t border-editorial-border px-3.5 py-2 bg-editorial-surface-subtle flex items-center justify-between text-[10px] font-mono text-editorial-muted uppercase tracking-wider">
            <span>
              {filtered.length} {t.articlesFound}
            </span>
            <div className="hidden sm:flex items-center gap-3">
              <span>↑↓ {isRtl ? 'للتنقل' : 'navigate'}</span>
              <span>↵ {isRtl ? 'للاختيار' : 'select'}</span>
              <span>ESC {isRtl ? 'للإغلاق' : 'close'}</span>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
