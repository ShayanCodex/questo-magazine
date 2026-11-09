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

  // Build the list of ticker items
  const tickerItems = articles.slice(0, 6).map((article) => {
    const { category } = getArticleCategory(article);
    return {
      type: 'article' as const,
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
          <span className="opacity-40 px-3.5 select-none text-[11px] font-mono">✦</span>
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-editorial-bg/15 text-editorial-bg me-1.5">
            {item.categoryShort}
          </span>
          <Link
            to={localePath(`/articles/${item.slug}`)}
            className="hover:underline underline-offset-4 font-sans font-semibold tracking-tight transition-opacity hover:opacity-80"
          >
            {item.title}
          </Link>
          <span className="opacity-60 text-[11px] font-serif ms-1.5 italic">
            by {item.author}
          </span>
        </span>
      ))}

      {editorialDispatches.map((dispatch, idx) => (
        <span key={`${keyPrefix}-disp-${idx}`} className="inline-flex items-center">
          <span className="opacity-40 px-3.5 select-none text-[11px] font-mono">✦</span>
          <span
            className={cn(
              'font-sans text-xs tracking-wider uppercase',
              dispatch.highlight
                ? 'font-bold text-editorial-bg underline decoration-1 underline-offset-2'
                : 'font-medium opacity-85'
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
        'relative bg-editorial-text text-editorial-bg overflow-hidden flex items-center select-none group border-y border-editorial-text shadow-sm',
        className
      )}
      role="region"
      aria-label="Editorial News Ticker"
    >
      {/* Fixed Live Ticker Capsule on Start */}
      <div className="relative z-20 shrink-0 flex items-center gap-2 ps-3.5 pe-4 py-2 bg-editorial-text border-e border-editorial-bg/20 shadow-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-editorial-bg whitespace-nowrap">
          {t.newsTicker || 'Live Ticker'}
        </span>
      </div>

      {/* Edge Gradient Mask Overlays */}
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 start-[105px] w-8 z-10',
          isRtl
            ? 'bg-gradient-to-l from-editorial-text to-transparent'
            : 'bg-gradient-to-r from-editorial-text to-transparent'
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 end-0 w-12 z-10',
          isRtl
            ? 'bg-gradient-to-r from-editorial-text to-transparent'
            : 'bg-gradient-to-l from-editorial-text to-transparent'
        )}
      />

      {/* Infinite Scrolling Track */}
      <div className="overflow-hidden w-full py-2">
        <div className="animate-marquee flex items-center whitespace-nowrap text-xs font-sans">
          {renderSequence('seq1')}
          {renderSequence('seq2')}
        </div>
      </div>
    </div>
  );
}
