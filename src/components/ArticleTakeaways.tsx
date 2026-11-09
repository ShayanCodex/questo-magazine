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

    // 2. Quote if available, or first body paragraph
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
        'rounded-xl border border-editorial-border bg-editorial-surface-subtle/70 p-6 sm:p-7 shadow-xs my-8 space-y-4',
        className
      )}
      aria-label="Executive Key Takeaways"
    >
      <div className="flex items-center gap-2 border-b border-editorial-border/60 pb-3">
        <span className="p-1 rounded-full bg-editorial-text text-editorial-bg">
          <SparklesIcon className="h-3.5 w-3.5" />
        </span>
        <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-editorial-text">
          Key Takeaways &amp; Core Thesis
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {insights.map((insight, idx) => (
          <div key={idx} className="space-y-1.5 flex flex-col justify-start">
            <span className="font-mono text-xs font-bold text-editorial-muted">
              0{idx + 1}
            </span>
            <p className="font-serif text-xs sm:text-sm text-editorial-text leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
