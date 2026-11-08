import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import type { SearchItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';

export interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchItem[];
  tags?: string[];
}

export function SearchModal({
  open,
  onOpenChange,
  items,
  tags = [],
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  // Filter items based on query and selected tag
  const filtered = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;
      if (!matchesTag) return false;
      if (!cleanQuery) return true;

      const titleMatch = item.title.toLowerCase().includes(cleanQuery);
      const excerptMatch = item.excerpt.toLowerCase().includes(cleanQuery);
      const authorMatch = item.author.toLowerCase().includes(cleanQuery);
      const tagsMatch = item.tags?.some((tag) => tag.toLowerCase().includes(cleanQuery));

      return titleMatch || excerptMatch || authorMatch || tagsMatch;
    });
  }, [items, query, selectedTag]);

  // Reset selected index when filtered results change
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

  // Handle keyboard navigation (Arrow keys + Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].slug);
    }
  };

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    navigate(localePath(`/articles/${slug}`));
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
        <DialogPrimitive.Content
          onKeyDown={handleKeyDown}
          className="fixed start-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-editorial-surface border border-editorial-border shadow-2xl rounded-sm overflow-hidden text-editorial-text focus:outline-none"
        >
          {/* Accessible Dialog Title & Description */}
          <DialogPrimitive.Title className="sr-only">
            {t.search}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {t.searchPlaceholder}
          </DialogPrimitive.Description>

          {/* Search Input Bar with Theme Styling */}
          <div className="group relative flex items-center border-b border-editorial-border bg-editorial-surface px-4 py-3.5 sm:px-6 focus-within:bg-editorial-bg/60 transition-colors">
            <MagnifyingGlassIcon className="h-5 w-5 text-editorial-muted group-focus-within:text-accent shrink-0 me-3 transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent font-serif text-base sm:text-lg text-editorial-text placeholder:text-editorial-muted/70 focus:outline-none"
              aria-label={t.search}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-sm text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer"
                aria-label={t.clearSearch}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block ms-3 px-1.5 py-0.5 text-[10px] font-mono uppercase text-editorial-muted border border-editorial-border rounded-sm">
              ESC
            </kbd>
          </div>

          {/* Topic Filters Row (No landscape scrollbar) */}
          {tags.length > 0 && (
            <div className="flex items-center gap-1.5 px-4 py-2.5 sm:px-6 border-b border-editorial-border/60 bg-editorial-bg/50 overflow-x-auto no-scrollbar text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={cn(
                  'px-2.5 py-1 rounded-sm transition-colors cursor-pointer shrink-0 uppercase tracking-wider',
                  selectedTag === null
                    ? 'bg-accent text-white font-semibold shadow-xs'
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
                    'px-2.5 py-1 rounded-sm transition-colors cursor-pointer shrink-0 uppercase tracking-wider',
                    selectedTag === tag
                      ? 'bg-accent text-white font-semibold shadow-xs'
                      : 'text-editorial-muted hover:text-editorial-text border border-editorial-border bg-editorial-surface'
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Results List with Clean Custom Scrollbar */}
          <div className="max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar divide-y divide-editorial-border/40 p-2 sm:p-3">
            {filtered.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="font-serif text-sm text-editorial-muted">
                  {t.noSearchResults}
                </p>
                {(query || selectedTag) && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSelectedTag(null);
                    }}
                    className="inline-block text-xs uppercase font-mono tracking-wider text-accent hover:underline cursor-pointer"
                  >
                    {t.resetFilters}
                  </button>
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
                      'group p-3 sm:p-4 rounded-sm transition-colors cursor-pointer flex items-center justify-between gap-4 text-start',
                      isSelected
                        ? 'bg-editorial-bg border border-editorial-border'
                        : 'hover:bg-editorial-bg/60'
                    )}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-editorial-muted">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.author}</span>
                      </div>
                      <h4 className="font-display font-bold text-base sm:text-lg text-editorial-text group-hover:text-accent transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="font-serif text-xs text-editorial-muted line-clamp-1">
                        {item.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags?.map((tg) => (
                          <Badge key={tg} variant="default" className="text-[10px] py-0 px-1.5 font-mono uppercase">
                            #{tg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ArrowRightIcon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform duration-150',
                        isSelected ? 'text-accent opacity-100' : 'text-editorial-muted opacity-40 group-hover:opacity-100',
                        isRtl ? 'rotate-180 -translate-x-1 group-hover:-translate-x-2' : 'translate-x-0 group-hover:translate-x-1'
                      )}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Accessible Footer Bar with Hotkey Hints */}
          <div className="border-t border-editorial-border px-4 py-2.5 sm:px-6 bg-editorial-bg/60 flex items-center justify-between text-[11px] font-mono text-editorial-muted uppercase tracking-wider">
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
