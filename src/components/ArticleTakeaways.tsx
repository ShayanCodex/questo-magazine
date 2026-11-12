import { SparklesIcon } from '@heroicons/react/24/outline';
import type { ArticleData } from '../lib/types';
import { cn } from '../lib/utils';

export interface ArticleTakeawaysProps {
  article: ArticleData;
  className?: string;
}

export function ArticleTakeaways({ article, className }: ArticleTakeawaysProps) {
  // Extract or synthesize 3 key insights from article content
  const extractInsights = (): string[] => {
    const insights: string[] = [];

    // 1. Excerpt as core thesis
    if (article.excerpt) {
      insights.push(article.excerpt);
    }

    // 2. Quote if available
    if (Array.isArray(article.body)) {
      const quoteBlock = article.body.find((b) => b.type === 'quote');
      if (quoteBlock && quoteBlock.text) {
        insights.push(`"${quoteBlock.text}"${quoteBlock.cite ? ` — ${quoteBlock.cite}` : ''}`);
      }

      // Add other distinct paragraphs
      const pBlocks = article.body.filter((b) => b.type === 'p' && b.text);
      for (const p of pBlocks) {
        if (insights.length >= 3) break;
        if (p.text && !insights.some((i) => i.includes(p.text!.slice(0, 30)))) {
          insights.push(p.text);
        }
      }
    }

    return insights.slice(0, 3);
  };

  const insights = extractInsights();
  if (insights.length === 0) return null;

  return (
    <aside
      className={cn(
        'rounded-2xl border border-editorial-border bg-editorial-surface p-5 sm:p-7 shadow-xs my-8 space-y-5',
        className
      )}
      aria-label="Executive Key Takeaways"
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between border-b border-editorial-border/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-editorial-text text-editorial-bg flex items-center justify-center shadow-xs">
            <SparklesIcon className="h-3.5 w-3.5" />
          </span>
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-editorial-text">
              Key Takeaways &amp; Core Thesis
            </h3>
            <span className="text-[11px] font-sans text-editorial-muted block">
              Executive synthesis &amp; central arguments
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-flex text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-editorial-surface-subtle border border-editorial-border text-editorial-muted">
          3 Points
        </span>
      </div>

      {/* 3 Executive Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="group relative p-4 sm:p-5 rounded-xl bg-editorial-surface-subtle border border-editorial-border/70 hover:border-editorial-text hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold px-2 py-0.5 rounded-full bg-editorial-text text-editorial-bg shadow-2xs">
                  0{idx + 1}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-editorial-muted/40 group-hover:bg-accent transition-colors" />
              </div>

              <p className="font-sans font-medium text-xs sm:text-[13px] leading-relaxed text-editorial-text">
                {insight}
              </p>
            </div>

            <div className="pt-2 border-t border-editorial-border/40 text-[10px] font-sans font-medium uppercase tracking-wider text-editorial-muted flex items-center justify-between">
              <span>Point 0{idx + 1}</span>
              <span>Essential Thesis</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
