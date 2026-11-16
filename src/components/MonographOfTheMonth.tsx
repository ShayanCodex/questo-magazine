import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory, getCategoryShortName, getSubcategoryName } from '../lib/categories';
import { ArticleViewCount } from './ArticleViewCount';
import { BookmarkButton } from './BookmarkButton';

export interface MonographOfTheMonthProps {
  article: ArticleData;
}

export function MonographOfTheMonth({ article }: MonographOfTheMonthProps) {
  const { t, localePath, language } = useLanguage();

  const { category, subcategory } = getArticleCategory(article);
  const formattedDate = formatDate(article.date, language.code);
  const readingTime = calculateReadingTime(article, t.minRead);
  const articleUrl = localePath(`/articles/${article.slug}`);

  const curated = {
    image: article.image || 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=2000&q=85',
    alt: article.imageAlt || article.title,
    caption: `Figure 01 // ${article.title} — Curated Essay`,
  };

  return (
    <section className="space-y-8 pt-6 sm:pt-8 border-t border-editorial-border font-sans transition-all">
      {/* 1. Refined Two-Column Editorial Header (Balanced Proportions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start border-b border-editorial-border pb-8">
        {/* Left Column (7 cols): Folio Tag & High-Contrast Serif Headline */}
        <div className="lg:col-span-7 space-y-3">
          {/* Eyebrow Folio Marker */}
          <div className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-[0.25em] text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>{t.monographOfTheMonth || 'Monograph of the Month'}</span>
            <span className="opacity-40">•</span>
            <span className="text-editorial-muted">Vol. 03</span>
          </div>

          {/* Headline: Confident Editorial Bold */}
          <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-[3.25rem] leading-[1.12] tracking-tight text-editorial-text text-balance">
            <Link
              to={articleUrl}
              className="hover:text-accent transition-colors block group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform inline-block">
                {article.title}
              </span>
            </Link>
          </h2>

          {/* Category Pill Tag */}
          <div className="pt-1 flex items-center gap-2">
            <Link
              to={localePath(`/articles?category=${category.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-editorial-surface-subtle border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text transition-all"
            >
              <span>{getCategoryShortName(category.id, language.code)}</span>
              {subcategory && (
                <>
                  <span className="opacity-40">/</span>
                  <span>{getSubcategoryName(subcategory.id, language.code)}</span>
                </>
              )}
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Literary Synopsis, Metadata & Read Action */}
        <div className="lg:col-span-5 space-y-4 lg:pt-1">
          {/* Evocative Abstract Excerpt */}
          <p className="font-serif italic text-editorial-muted text-base sm:text-lg leading-relaxed max-w-xl font-light">
            {article.excerpt}
          </p>

          {/* Editorial Metadata Ledger */}
          <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-editorial-muted">
            {article.author && (
              <>
                <span className="text-editorial-text font-semibold">
                  {t.textBy}: {article.author}
                </span>
                <span className="opacity-40">•</span>
              </>
            )}
            <span>{formattedDate}</span>
            <span className="opacity-40">•</span>
            <span>{readingTime}</span>
            <span className="opacity-40">•</span>
            <ArticleViewCount path={`/articles/${article.slug}`} slug={article.slug} compact />
          </div>

          {/* Actions: Read Full Monograph Button + Bookmark */}
          <div className="pt-3 flex items-center gap-3">
            <Link
              to={articleUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-editorial-text text-editorial-bg font-sans text-xs font-semibold hover:opacity-90 transition-all shadow-sm group/btn"
            >
              <span>{t.readMore || 'Read Full Monograph'}</span>
              <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180 transition-transform group-hover/btn:translate-x-1" />
            </Link>

            <BookmarkButton slug={article.slug} variant="card" />
          </div>
        </div>
      </div>

      {/* 2. Full-Width Grand Cinematic Editorial Photograph (Centerpiece) */}
      <div className="w-full overflow-hidden rounded-2xl border border-editorial-border/80 group relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.35/1] shadow-xl bg-neutral-950">
        <Link to={articleUrl} className="block w-full h-full relative" aria-label={article.title}>
          <img
            src={curated.image}
            alt={curated.alt}
            className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Pure photographic clarity with gentle hover accentuation */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        </Link>
      </div>
    </section>
  );
}
