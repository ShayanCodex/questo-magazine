import type { ArticleData } from '../lib/types';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/lang-context';

export interface ArticleTakeawaysProps {
  article: ArticleData;
  className?: string;
}

const keyPointsTitles: Record<string, string> = {
  en: 'Key Points',
  es: 'Puntos Clave',
  fr: 'Points Clés',
  de: 'Wichtige Punkte',
  ar: 'نقاط رئيسية',
  ur: 'اہم نکات',
};

export function ArticleTakeaways({ article, className }: ArticleTakeawaysProps) {
  const { language } = useLanguage();
  const headingText = keyPointsTitles[language?.code || 'en'] || 'Key Points';

  // Extract or synthesize key insights from article content
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

      // 3. Add other distinct paragraphs
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
    <section
      className={cn('my-8 sm:my-10 space-y-4', className)}
      aria-label={headingText}
    >
      {/* Normal Heading of Key Points */}
      <div className="pb-3 border-b border-editorial-border/60">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-editorial-text tracking-tight">
          {headingText}
        </h2>
      </div>

      {/* Bullet Points List for Paragraphs */}
      <ul className="list-disc list-outside ltr:pl-5 rtl:pr-5 space-y-3.5 sm:space-y-4 text-editorial-text marker:text-editorial-text/70">
        {insights.map((insight, idx) => (
          <li
            key={idx}
            className="font-serif text-sm sm:text-base text-editorial-text/90 leading-relaxed pl-1"
          >
            {insight}
          </li>
        ))}
      </ul>
    </section>
  );
}
