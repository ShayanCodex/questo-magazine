import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory, getCategoryShortName } from '../lib/categories';
import { ArticleViewCount } from './ArticleViewCount';
import { BookmarkButton } from './BookmarkButton';

export interface MonographOfTheMonthProps {
  article: ArticleData;
}

// Curated high-resolution museum & contemporary fine-art photography catalog
// Selected to communicate authentic editorial storytelling, fine art, and contemporary culture
const CURATED_MONOGRAPH_IMAGES: Record<
  string,
  { image: string; alt: string; caption: string }
> = {
  'the-death-of-the-card-grid': {
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=2000&q=85',
    alt: 'Contemporary fine art museum gallery exhibition with monumental abstract canvas',
    caption: 'Figure 01 // Monumental fine art canvas in contemporary gallery space',
  },
  'the-geometry-of-silence': {
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
    alt: 'Contemplative architectural monolith with quiet natural light study',
    caption: 'Figure 01 // Sculptural brutalist void and quiet contemplation',
  },
  'craft-over-convenience': {
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=2000&q=85',
    alt: 'Tactile artisanal sculpture and sculptural materiality in soft gallery light',
    caption: 'Figure 01 // Artisanal sculptural form and tactile material study',
  },
  'pure-functional-simplicity': {
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=2000&q=85',
    alt: 'Industrial minimalist form and modern acoustic design',
    caption: 'Figure 01 // Minimalist industrial form and rational systems architecture',
  },
  'the-poetics-of-concrete': {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85',
    alt: 'Brutalist concrete architectural abstraction against sky',
    caption: 'Figure 01 // Monolithic concrete geometry rising into overcast sky',
  },
  'the-grid-as-an-instrument': {
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=2000&q=85',
    alt: 'Swiss graphic design system and modern typographic composition',
    caption: 'Figure 01 // Swiss typographic grid as structural architecture',
  },
};

export function MonographOfTheMonth({ article }: MonographOfTheMonthProps) {
  const { t, localePath, language } = useLanguage();

  const { category, subcategory } = getArticleCategory(article);
  const formattedDate = formatDate(article.date, language.code);
  const readingTime = calculateReadingTime(article, t.minRead);
  const articleUrl = localePath(`/articles/${article.slug}`);

  // Curated imagery with storytelling connection
  const curated = CURATED_MONOGRAPH_IMAGES[article.slug] || {
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
            <span>Monograph of the Month</span>
            <span className="opacity-40">•</span>
            <span className="text-editorial-muted">Vol. 03</span>
          </div>

          {/* Headline: Elegant Editorial Serif (Human Scale & Confident) */}
          <h2 className="font-serif font-light text-3xl sm:text-4xl lg:text-[3.25rem] leading-[1.12] tracking-tight text-editorial-text text-balance">
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
              <span>{getCategoryShortName(category.id)}</span>
              {subcategory && (
                <>
                  <span className="opacity-40">/</span>
                  <span>{subcategory.name}</span>
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
                  Text by {article.author}
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
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Subtle directional vignette: 80%+ natural photographic clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Museum-Grade Figure Caption Stamp */}
          <div className="absolute bottom-4 start-4 sm:bottom-6 sm:start-6 z-10 pointer-events-none">
            <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] shadow-md flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span>{curated.caption}</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
