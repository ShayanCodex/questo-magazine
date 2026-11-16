import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  UserIcon,
  GlobeAltIcon,
  SparklesIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import type { SearchItem, EBook } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { cn } from '../lib/utils';
import {
  CATEGORIES,
  getArticleCategory,
  getCategoryShortName,
} from '../lib/categories';
import { AUTHORS } from '../data/authors';
import ebooksCardsData from '../data/ebooks-cards.json';
import {
  INITIAL_GLOBAL_INDICES,
  INITIAL_COMMODITIES,
  INITIAL_CRYPTO_ASSETS,
  INITIAL_FOREX_PAIRS,
} from '../lib/markets';

const RECENT_SEARCHES_KEY = 'questo-recent-searches';

export type UniversalResultType = 'article' | 'market' | 'tool' | 'category' | 'author' | 'page' | 'ebook';

export interface UniversalSearchResult {
  id: string;
  type: UniversalResultType;
  title: string;
  subtitle: string;
  badge: string;
  url: string;
  meta?: string;
  keywords: string[];
}

const CLIENT_TOOLS: UniversalSearchResult[] = [
  {
    id: 'tool-image-converter',
    type: 'tool',
    title: 'Image Converter & Compressor',
    subtitle: 'Zero-upload client-side WebP, PNG, and JPEG compression suite',
    badge: 'UTILITY',
    url: '/tools/image-converter',
    meta: 'Media Suite',
    keywords: ['image', 'photo', 'webp', 'png', 'jpg', 'compress', 'convert', 'resize', 'tools', 'tool'],
  },
  {
    id: 'tool-audio-extractor',
    type: 'tool',
    title: 'Browser Video-to-Audio Extractor',
    subtitle: 'Extract high-fidelity MP3/WAV audio directly inside the client browser',
    badge: 'UTILITY',
    url: '/tools/audio-extractor',
    meta: 'Web Audio API',
    keywords: ['audio', 'video', 'extract', 'sound', 'mp3', 'wav', 'mp4', 'speech', 'tools', 'tool'],
  },
  {
    id: 'tool-pdf-tools',
    type: 'tool',
    title: 'Client-Side PDF Document Suite',
    subtitle: 'Inspect, merge, and optimize PDF documents with zero server uploads',
    badge: 'UTILITY',
    url: '/tools/pdf-tools',
    meta: 'Document Architecture',
    keywords: ['pdf', 'document', 'print', 'inspect', 'page', 'tools', 'tool'],
  },
  {
    id: 'tool-financial-calculator',
    type: 'tool',
    title: 'Financial Intelligence Calculator',
    subtitle: 'Compound interest, inflation discounting, and wealth modeling engine',
    badge: 'UTILITY',
    url: '/tools/financial-calculator',
    meta: 'Wealth Modeling',
    keywords: ['finance', 'compound', 'interest', 'money', 'loan', 'mortgage', 'inflation', 'calculator', 'tools'],
  },
  {
    id: 'tool-health-calculator',
    type: 'tool',
    title: 'Metabolic & Health Calculator',
    subtitle: 'TDEE, BMR, glycemic energy expenditure, and macronutrient calculator',
    badge: 'UTILITY',
    url: '/tools/health-calculator',
    meta: 'Clinical Physiology',
    keywords: ['health', 'bmi', 'bmr', 'tdee', 'calorie', 'calories', 'weight', 'macro', 'nutrition', 'calculator', 'tools'],
  },
];

const CORE_PAGES: UniversalSearchResult[] = [
  {
    id: 'page-articles',
    type: 'page',
    title: 'Articles Directory',
    subtitle: 'Full editorial archive of research monographs, critical essays, and journals',
    badge: 'DIRECTORY',
    url: '/articles',
    meta: 'Catalog',
    keywords: ['articles', 'essays', 'blog', 'read', 'library', 'all', 'monographs'],
  },
  {
    id: 'page-markets',
    type: 'page',
    title: 'Global Market Intelligence',
    subtitle: 'Real-time indices, foreign exchange rates, crypto telemetry, and commodities',
    badge: 'FINANCE',
    url: '/markets',
    meta: 'Intelligence Desk',
    keywords: ['markets', 'stocks', 'forex', 'crypto', 'commodities', 'trading', 'finance', 'investing'],
  },
  {
    id: 'page-categories',
    type: 'page',
    title: 'Taxonomy of Disciplines',
    subtitle: 'Explore all 14 editorial categories and specialized academic fields',
    badge: 'TAXONOMY',
    url: '/categories',
    meta: 'Disciplines',
    keywords: ['categories', 'disciplines', 'topics', 'sections', 'taxonomy'],
  },
  {
    id: 'page-tools',
    type: 'page',
    title: 'Interactive Utilities Suite',
    subtitle: 'Browser-native, privacy-preserving multimedia and computing tools',
    badge: 'UTILITIES',
    url: '/tools',
    meta: 'Suite',
    keywords: ['tools', 'utilities', 'calculator', 'converter', 'pdf', 'audio'],
  },
  {
    id: 'page-about',
    type: 'page',
    title: 'About & Editorial Manifesto',
    subtitle: 'Questo architectural philosophy, Swiss typography, and slow journalism principles',
    badge: 'MANIFESTO',
    url: '/about',
    meta: 'Philosophy',
    keywords: ['about', 'manifesto', 'mission', 'principles', 'questo', 'editorial'],
  },
  {
    id: 'page-contact',
    type: 'page',
    title: 'Editorial Submissions & Contact',
    subtitle: 'Submit research monographs, pitch critical commentaries, or contact editors',
    badge: 'CONTACT',
    url: '/contact',
    meta: 'Communication',
    keywords: ['contact', 'email', 'touch', 'support', 'pitch', 'submit'],
  },
  {
    id: 'page-admin',
    type: 'page',
    title: 'Editorial CMS Dashboard',
    subtitle: 'Publishing workflow, multilingual status, and database controls',
    badge: 'ADMIN',
    url: '/admin',
    meta: 'Management',
    keywords: ['admin', 'dashboard', 'cms', 'editor', 'publish'],
  },
];

export interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchItem[];
  tags?: string[];
}

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

function getResultIcon(type: UniversalResultType) {
  switch (type) {
    case 'article':
      return DocumentTextIcon;
    case 'market':
      return ChartBarIcon;
    case 'tool':
      return WrenchScrewdriverIcon;
    case 'category':
      return FolderIcon;
    case 'author':
      return UserIcon;
    case 'ebook':
      return BookOpenIcon;
    case 'page':
    default:
      return GlobeAltIcon;
  }
}

function getBadgeColor(type: UniversalResultType) {
  switch (type) {
    case 'article':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'market':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'tool':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'category':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'author':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'ebook':
      return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    case 'page':
    default:
      return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }
}

export function SearchModal({
  open,
  onOpenChange,
  items,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  // Build Comprehensive Universal Search Index (Only computed when modal is open)
  const universalIndex = useMemo<UniversalSearchResult[]>(() => {
    if (!open) return [];
    const list: UniversalSearchResult[] = [];

    // 1. Articles
    items.forEach((item) => {
      const { category, subcategory } = getArticleCategory(item);
      list.push({
        id: `article-${item.slug}`,
        type: 'article',
        title: item.title,
        subtitle: item.excerpt,
        badge: getCategoryShortName(category.id, language.code).toUpperCase(),
        url: `/articles/${item.slug}`,
        meta: `${item.author} • ${item.date}${subcategory ? ` • ${subcategory.name}` : ''}`,
        keywords: [
          item.title,
          item.excerpt,
          item.author,
          category.name,
          getCategoryShortName(category.id, language.code),
          ...(item.tags || []),
          subcategory?.name || '',
        ],
      });
    });

    // 2. Categories
    CATEGORIES.forEach((cat) => {
      const shortName = getCategoryShortName(cat.id, language.code);
      list.push({
        id: `cat-${cat.id}`,
        type: 'category',
        title: cat.name,
        subtitle: cat.description,
        badge: (t.categories || 'CATEGORY').toUpperCase(),
        url: `/categories/${cat.id}`,
        meta: `${cat.subcategories.length} Specialized Subfields`,
        keywords: [
          cat.name,
          shortName,
          cat.id,
          cat.description,
          ...cat.subcategories.map((s) => s.name),
        ],
      });
    });

    // 3. Markets (Indices, Crypto, Commodities, Forex)
    INITIAL_GLOBAL_INDICES.forEach((idx) => {
      list.push({
        id: `mkt-index-${idx.id}`,
        type: 'market',
        title: `${idx.name} (${idx.symbol})`,
        subtitle: `${idx.exchange} • ${idx.country} benchmark index`,
        badge: 'MARKET',
        url: '/markets',
        meta: `Price: ${idx.price} ${idx.currency}`,
        keywords: [idx.name, idx.symbol, idx.country, idx.exchange, 'index', 'stocks', 'market', 'finance'],
      });
    });

    INITIAL_CRYPTO_ASSETS.forEach((crypto) => {
      list.push({
        id: `mkt-crypto-${crypto.id}`,
        type: 'market',
        title: `${crypto.name} (${crypto.symbol})`,
        subtitle: `Decentralized digital asset benchmark • Rank #${crypto.rank || 1}`,
        badge: 'CRYPTO',
        url: `/markets/${crypto.id}`,
        meta: `Price: $${crypto.priceUsd.toLocaleString()} • 24h: ${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h}%`,
        keywords: [crypto.name, crypto.symbol, 'crypto', 'cryptocurrency', 'bitcoin', 'blockchain', 'market'],
      });
    });

    INITIAL_COMMODITIES.forEach((comm) => {
      list.push({
        id: `mkt-comm-${comm.id}`,
        type: 'market',
        title: `${comm.name} (${comm.symbol})`,
        subtitle: `${comm.category} commodity contract • ${comm.contract}`,
        badge: 'COMMODITY',
        url: `/markets/${comm.id}`,
        meta: `Unit: ${comm.unit} • Price: $${comm.price}`,
        keywords: [comm.name, comm.symbol, comm.category, comm.contract, 'commodity', 'gold', 'oil', 'gas', 'silver'],
      });
    });

    INITIAL_FOREX_PAIRS.forEach((fx) => {
      list.push({
        id: `mkt-fx-${fx.id}`,
        type: 'market',
        title: `${fx.pair} Foreign Exchange`,
        subtitle: `Global currency liquidity corridor (${fx.base} to ${fx.quote})`,
        badge: 'FOREX',
        url: `/markets/${fx.id}`,
        meta: `Rate: ${fx.rate} • 24h: ${fx.changePercent24h >= 0 ? '+' : ''}${fx.changePercent24h.toFixed(2)}%`,
        keywords: [fx.pair, fx.base, fx.quote, 'forex', 'currency', 'exchange', 'usd', 'eur', 'gbp'],
      });
    });

    // 4. Client Tools
    list.push(...CLIENT_TOOLS);

    // 5. Authors
    Object.values(AUTHORS).forEach((author) => {
      list.push({
        id: `author-${author.slug}`,
        type: 'author',
        title: author.name,
        subtitle: author.bio,
        badge: (t.authors || 'AUTHOR').toUpperCase(),
        url: `/authors/${author.slug}`,
        meta: `${author.role} • ${author.location}`,
        keywords: [author.name, author.role, author.location, author.bio, author.slug],
      });
    });

    // 6. Core Pages
    list.push(...CORE_PAGES);

    // 7. Public Domain E-Books
    (ebooksCardsData as unknown as EBook[]).forEach((book) => {
      list.push({
        id: `ebook-${book.slug}`,
        type: 'ebook',
        title: book.title,
        subtitle: `${book.author} (${book.year}) — ${book.curatedContext}`,
        badge: 'E-BOOK',
        url: `/ebooks/${book.slug}`,
        meta: `${book.category} • Direct PDF (${book.pageCount}p)`,
        keywords: [
          book.title,
          book.author,
          book.category,
          book.subdiscipline,
          'pdf',
          'book',
          'ebook',
          'read',
          'archive',
        ],
      });
    });

    return list;
  }, [open, items, language.code, t.categories]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored).slice(0, 5));
        }
      } catch {
        // Storage unavailable
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
      // Ignore
    }
  }, []);

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch {
      // Ignore
    }
  };

  // Universal multi-type search ranking
  const filteredResults = useMemo<UniversalSearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Return curated cross-section when search box is empty
      const topArticles = universalIndex.filter((it) => it.type === 'article').slice(0, 4);
      const topMarkets = universalIndex.filter((it) => it.type === 'market').slice(0, 2);
      const topTools = universalIndex.filter((it) => it.type === 'tool').slice(0, 2);
      const topCats = universalIndex.filter((it) => it.type === 'category').slice(0, 2);
      return [...topArticles, ...topMarkets, ...topTools, ...topCats];
    }

    const scored = universalIndex
      .map((item) => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const subtitleLower = item.subtitle.toLowerCase();

        if (titleLower === q) score += 100;
        else if (titleLower.startsWith(q)) score += 60;
        else if (titleLower.includes(q)) score += 40;

        if (subtitleLower.includes(q)) score += 20;

        const kwMatch = item.keywords.some((k) => k.toLowerCase().includes(q));
        if (kwMatch) score += 15;

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    return scored.slice(0, 25);
  }, [universalIndex, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [open]);

  const handleSelect = (result: UniversalSearchResult) => {
    if (query.trim()) {
      saveRecentSearch(query);
    }
    onOpenChange(false);
    navigate(localePath(result.url));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length > 0 ? (prev + 1) % filteredResults.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length > 0 ? (prev - 1 + filteredResults.length) % filteredResults.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
        <DialogPrimitive.Content
          onKeyDown={handleKeyDown}
          className="fixed start-1/2 top-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-editorial-surface border border-editorial-border shadow-2xl rounded-sm overflow-hidden text-editorial-text focus:outline-none"
        >
          <DialogPrimitive.Title className="sr-only">
            {t.search}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Universal search across articles, market tickers, tools, categories, and authors
          </DialogPrimitive.Description>

          {/* Focused Universal Search Bar */}
          <div className="group relative flex items-center border-b border-editorial-border bg-editorial-surface px-4 py-3.5 sm:px-5 focus-within:bg-editorial-surface-subtle transition-colors">
            <MagnifyingGlassIcon className="h-5 w-5 text-editorial-text group-focus-within:text-editorial-text shrink-0 me-3 transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder || 'Search articles, markets, tools, categories, authors...'}
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
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-sans font-medium uppercase text-editorial-muted border border-editorial-border rounded-xs bg-editorial-surface-subtle">
              ESC
            </kbd>
          </div>

          {/* Recent Searches Bar (Pure Client-Side) */}
          {!query && recentSearches.length > 0 && (
            <div className="px-4 py-2 border-b border-editorial-border/60 bg-editorial-surface-subtle flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 pe-2">
                <span className="font-sans text-xs font-medium text-editorial-muted flex items-center gap-1 shrink-0">
                  <ClockIcon className="h-3.5 w-3.5 text-editorial-muted" />
                  <span>{t.recent || 'Recent'}:</span>
                </span>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="font-sans text-xs font-medium px-3 py-1 rounded-full bg-editorial-surface border border-editorial-border hover:border-editorial-text text-editorial-text transition-colors cursor-pointer shrink-0"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="font-sans text-xs font-medium text-editorial-muted hover:text-editorial-text cursor-pointer shrink-0"
              >
                {t.clear || 'Clear'}
              </button>
            </div>
          )}

          {/* Empty Query Header */}
          {!query && (
            <div className="px-4 py-2 bg-editorial-surface/50 border-b border-editorial-border/40 flex items-center gap-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-editorial-muted">
              <SparklesIcon className="h-3.5 w-3.5 text-editorial-text" />
              <span>{t.recommendedAcrossQuesto || 'Recommended Across Questo'}</span>
            </div>
          )}

          {/* Universal Results List */}
          <div
            ref={resultsContainerRef}
            className="max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar p-3 space-y-1.5"
          >
            {filteredResults.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-2">
                <p className="font-serif text-sm text-editorial-muted">
                  {t.noMatchingResults || 'No matching results found for'} &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-editorial-muted/70">
                  {t.trySearchingKeywords || 'Try searching for keywords like "AI", "Bitcoin", "Architecture", or "Calculator".'}
                </p>
              </div>
            ) : (
              filteredResults.map((result, index) => {
                const isSelected = index === selectedIndex;
                const IconComponent = getResultIcon(result.type);
                const badgeColor = getBadgeColor(result.type);

                return (
                  <div
                    key={result.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(result);
                      }
                    }}
                    className={cn(
                      'group px-3 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center justify-between gap-3 text-start border-0 outline-none',
                      isSelected
                        ? 'bg-editorial-surface-hover'
                        : 'hover:bg-editorial-surface-hover/70'
                    )}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Type Icon */}
                      <div className="p-1.5 rounded-xs bg-editorial-surface-subtle text-editorial-muted group-hover:text-editorial-text shrink-0 mt-0.5 border border-editorial-border/40">
                        <IconComponent className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        {/* Type Badge & Meta Row */}
                        <div className="flex items-center gap-1.5 text-[10px] font-sans font-medium uppercase tracking-wider">
                          <span
                            className={cn(
                              'px-1.5 py-0.5 rounded-2xs border font-semibold text-[9px]',
                              badgeColor
                            )}
                          >
                            {result.badge}
                          </span>
                          {result.meta && (
                            <>
                              <span className="opacity-40 text-editorial-muted">•</span>
                              <span className="text-editorial-muted truncate max-w-xs">{result.meta}</span>
                            </>
                          )}
                        </div>

                        {/* Title with Match Highlighting */}
                        <h4 className="font-display font-semibold text-sm sm:text-[15px] text-editorial-text leading-tight truncate">
                          {highlightMatch(result.title, query)}
                        </h4>

                        {/* Subtitle with Match Highlighting */}
                        <p className="font-serif text-xs text-editorial-muted line-clamp-1 leading-normal">
                          {highlightMatch(result.subtitle, query)}
                        </p>
                      </div>
                    </div>

                    {/* Arrow Indicator */}
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
          <div className="border-t border-editorial-border px-4 py-2 bg-editorial-surface-subtle flex items-center justify-between text-[10px] font-sans font-medium text-editorial-muted uppercase tracking-wider">
            <span>
              {filteredResults.length} {t.resultsAcrossQuesto || 'results across Questo'}
            </span>
            <div className="hidden sm:flex items-center gap-3">
              <span>↑↓ {t.navigateKey || (isRtl ? 'للتنقل' : 'navigate')}</span>
              <span>↵ {t.selectKey || (isRtl ? 'اختيار' : 'select')}</span>
              <span>ESC {t.closeKey || (isRtl ? 'إغلاق' : 'close')}</span>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
