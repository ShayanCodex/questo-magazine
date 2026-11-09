import { Link } from 'react-router-dom';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { getArticleCategory, getCategoryShortName } from '../lib/categories';
import { cn } from '../lib/utils';

interface EditorialMarqueeProps {
  articles: ArticleData[];
  className?: string;
}

export function EditorialMarquee({ articles, className }: EditorialMarqueeProps) {
  const { localePath, t, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  // Build the list of ticker items from live articles
  const tickerItems = articles.slice(0, 6).map((article) => {
    const { category } = getArticleCategory(article);
    return {
      slug: article.slug,
      title: article.title,
      author: article.author,
      categoryShort: getCategoryShortName(category.id),
    };
  });

  const editorialDispatches = [
    { text: 'ISSUE 03 NOW AVAILABLE IN PRINT WORLDWIDE', highlight: true },
    { text: 'LIMITED RUN OF 1,500 HAND-NUMBERED COPIES', highlight: false },
    { text: 'WEEKLY EDITORIAL MONOGRAPHS ON VISUAL CULTURE', highlight: false },
  ];

  // Helper to render one full marquee sequence
  const renderSequence = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center shrink-0">
      {tickerItems.map((item, idx) => (
        <span key={`${keyPrefix}-art-${item.slug}-${idx}`} className="inline-flex items-center">
          <span className="text-editorial-muted/30 px-3 select-none text-[10px]">✦</span>
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-editorial-surface-subtle border border-editorial-border text-editorial-muted me-2 shadow-2xs">
            {item.categoryShort}
          </span>
          <Link
            to={localePath(`/articles/${item.slug}`)}
            className="hover:text-accent hover:underline underline-offset-4 font-sans font-medium text-xs tracking-tight text-editorial-text transition-colors"
          >
            {item.title}
          </Link>
          <span className="text-editorial-muted text-[11px] font-serif ms-1.5 italic">
            by {item.author}
          </span>
        </span>
      ))}

      {editorialDispatches.map((dispatch, idx) => (
        <span key={`${keyPrefix}-disp-${idx}`} className="inline-flex items-center">
          <span className="text-editorial-muted/30 px-3 select-none text-[10px]">✦</span>
          <span
            className={cn(
              'font-sans text-xs tracking-wider uppercase',
              dispatch.highlight
                ? 'font-bold text-editorial-text'
                : 'font-normal text-editorial-muted'
            )}
          >
            {dispatch.text}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        'relative bg-editorial-surface border-y border-editorial-border overflow-hidden flex items-center select-none group text-editorial-text shadow-2xs py-1.5',
        className
      )}
      role="region"
      aria-label="Editorial News Ticker"
    >
      {/* Refined Live Ticker Badge on Start */}
      <div className="relative z-20 shrink-0 flex items-center gap-2 ps-4 pe-3.5 py-1 bg-editorial-surface border-e border-editorial-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-editorial-text whitespace-nowrap">
          {t.newsTicker || 'Dispatch'}
        </span>
      </div>

      {/* Smooth Edge Gradient Mask Overlays */}
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 start-[100px] w-8 z-10',
          isRtl
            ? 'bg-gradient-to-l from-editorial-surface to-transparent'
            : 'bg-gradient-to-r from-editorial-surface to-transparent'
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 end-0 w-12 z-10',
          isRtl
            ? 'bg-gradient-to-r from-editorial-surface to-transparent'
            : 'bg-gradient-to-l from-editorial-surface to-transparent'
        )}
      />

      {/* Infinite Scrolling Track */}
      <div className="overflow-hidden w-full py-0.5">
        <div className="animate-marquee flex items-center whitespace-nowrap text-xs font-sans">
          {renderSequence('seq1')}
          {renderSequence('seq2')}
        </div>
      </div>
    </div>
  );
}
