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
        'rounded-xl border border-editorial-border bg-editorial-surface-subtle/60 p-6 sm:p-7 my-8 font-sans transition-colors',
        className
      )}
      aria-label="Key Takeaways"
    >
      {/* Clean Minimalist Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-editorial-border/60">
        <SparklesIcon className="h-4 w-4 text-editorial-muted" />
        <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-editorial-text">
          Key Takeaways
        </h3>
      </div>

      {/* Clean 3-Column Insights (Simple, modern, no nested boxes or clutter) */}
      <div
        className={cn(
          'grid gap-6 sm:gap-8 pt-5',
          insights.length === 1 && 'grid-cols-1',
          insights.length === 2 && 'grid-cols-1 md:grid-cols-2',
          insights.length >= 3 && 'grid-cols-1 md:grid-cols-3'
        )}
      >
        {insights.map((insight, idx) => (
          <div key={idx} className="space-y-2">
            <span className="font-mono text-xs font-bold text-editorial-muted tracking-wider block">
              0{idx + 1}
            </span>
            <p className="font-sans text-xs sm:text-sm text-editorial-text leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
