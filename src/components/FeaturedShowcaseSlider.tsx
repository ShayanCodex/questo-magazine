import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory, getCategoryShortName } from '../lib/categories';
import { BookmarkButton } from './BookmarkButton';
import { cn } from '../lib/utils';

export interface FeaturedShowcaseSliderProps {
  articles: ArticleData[];
  autoplayIntervalMs?: number;
}

// Curated high-resolution museum & luxury editorial photography catalog
// Selected to communicate contemporary art, spatial architecture, avant-garde design & craftsmanship
const CURATED_EDITORIAL_HERO_IMAGES: Record<
  string,
  { image: string; alt: string; issueTag: string }
> = {
  'the-geometry-of-silence': {
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
    alt: 'Contemplative architectural monolith with quiet light study',
    issueTag: 'CONTEMPORARY ARCHITECTURE & SPATIAL DESIGN',
  },
  'the-death-of-the-card-grid': {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=85',
    alt: 'Contemporary avant-garde museum gallery installation',
    issueTag: 'VISUAL CULTURE & DIGITAL EXPERIMENTS',
  },
  'craft-over-convenience': {
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=2000&q=85',
    alt: 'Tactile artisanal sculpture and sculptural materiality in soft gallery light',
    issueTag: 'MATERIAL CULTURE & ARTISANAL CRAFT',
  },
  'pure-functional-simplicity': {
    image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=2000&q=85',
    alt: 'Industrial minimalist form and modern acoustic design',
    issueTag: 'INDUSTRIAL DESIGN & RATIONAL SYSTEMS',
  },
  'the-poetics-of-concrete': {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85',
    alt: 'Brutalist concrete architectural abstraction against sky',
    issueTag: 'MONOGRAPH // STRUCTURAL FORM',
  },
  'the-grid-as-an-instrument': {
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=2000&q=85',
    alt: 'Swiss graphic design system and modern typographic composition',
    issueTag: 'EDITORIAL TYPOGRAPHY & SYSTEMS',
  },
};

export function FeaturedShowcaseSlider({
  articles,
  autoplayIntervalMs = 6500,
}: FeaturedShowcaseSliderProps) {
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  // Select 4 primary editorial articles for the showcase carousel
  const showcaseArticles = articles.filter((a) => Boolean(a.image)).slice(0, 4);
  const totalSlides = showcaseArticles.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (totalSlides > 0 ? (prev + 1) % totalSlides : 0));
    setProgress(0);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (totalSlides > 0 ? (prev - 1 + totalSlides) % totalSlides : 0));
    setProgress(0);
  }, [totalSlides]);

  const goToSlide = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  }, []);

  // Smooth progress bar increment & autoplay
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const intervalStep = 50; // update every 50ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextVal = prev + (intervalStep / autoplayIntervalMs) * 100;
        if (nextVal >= 100) {
          nextSlide();
          return 0;
        }
        return nextVal;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides, autoplayIntervalMs, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (isRtl) prevSlide();
        else nextSlide();
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) nextSlide();
        else prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRtl, nextSlide, prevSlide]);

  if (showcaseArticles.length === 0) return null;

  const currentArticle = showcaseArticles[currentIndex];
  const { category } = getArticleCategory(currentArticle);
  const formattedDate = formatDate(currentArticle.date, language.code);
  const readingTime = calculateReadingTime(currentArticle, t.minRead);
  const articleUrl = localePath(`/articles/${currentArticle.slug}`);

  // Fetch curated photography or fallback
  const curatedMeta = CURATED_EDITORIAL_HERO_IMAGES[currentArticle.slug] || {
    image: currentArticle.image,
    alt: currentArticle.imageAlt || currentArticle.title,
    issueTag: `${category.name.toUpperCase()} // EDITORIAL`,
  };

  // Handle touch swipe on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        if (isRtl) prevSlide();
        else nextSlide();
      } else {
        if (isRtl) nextSlide();
        else prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      className="relative rounded-2xl border border-editorial-border/80 bg-neutral-950 text-white overflow-hidden shadow-2xl group select-none transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured Editorial Monograph"
    >
      {/* 1. Cinematic Full-Bleed Editorial Stage */}
      <div className="relative h-[480px] sm:h-[520px] lg:h-[560px] w-full overflow-hidden">
        {showcaseArticles.map((article, idx) => {
          const isActive = idx === currentIndex;
          const articleCurated = CURATED_EDITORIAL_HERO_IMAGES[article.slug] || {
            image: article.image,
            alt: article.imageAlt || article.title,
            issueTag: '',
          };

          return (
            <div
              key={article.slug}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              )}
            >
              <img
                src={articleCurated.image}
                alt={articleCurated.alt}
                className={cn(
                  'w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-out',
                  isActive ? 'scale-[1.035]' : 'scale-100'
                )}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />

              {/* Natural localized vignette: 75%+ of the image is left in pure, vivid natural light */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-45% to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 start-0 w-2/3 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none hidden md:block" />
            </div>
          );
        })}

        {/* 2. Top Editorial Folio Strip (Minimal & Elegant) */}
        <div className="absolute top-5 sm:top-7 start-6 sm:start-10 end-6 sm:end-10 z-20 flex items-center justify-between pointer-events-none">
          {/* Left: Issue Discipline Tag */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/90 drop-shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Issue 03 // Curated Monograph</span>
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <Link
              to={localePath(`/articles?category=${category.id}`)}
              className="hidden sm:inline-block font-mono text-[10px] sm:text-xs tracking-wider uppercase text-white/70 hover:text-white transition-colors pointer-events-auto underline-offset-4 hover:underline"
            >
              {getCategoryShortName(category.id)}
            </Link>
          </div>

          {/* Right: Folio Stamp & Bookmark Action */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-white/80">
              <span>Collection Folio</span>
            </div>
            <BookmarkButton slug={currentArticle.slug} variant="card" />
          </div>
        </div>

        {/* 3. Primary Editorial Typography Suite (Lower-Third Golden Ratio Placement) */}
        <div className="absolute bottom-8 sm:bottom-12 start-5 sm:start-12 end-28 sm:end-44 z-20 space-y-2.5 sm:space-y-3.5 max-w-2xl">
          {/* Refined Category & Discipline Eyebrow */}
          <div className="flex items-center gap-2 font-mono text-[9px] sm:text-xs font-semibold tracking-[0.24em] text-accent uppercase drop-shadow-sm">
            <span>{curatedMeta.issueTag}</span>
          </div>

          {/* Majestic Editorial Headline: Serif, Elegant Leading, Human Scale */}
          <h2 className="font-serif font-light text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] text-balance">
            <Link
              to={articleUrl}
              className="hover:text-neutral-200 transition-colors focus-visible:outline-none"
            >
              {currentArticle.title}
            </Link>
          </h2>

          {/* Evocative 2-Line Editorial Synopsis */}
          <p className="font-serif italic text-xs sm:text-base text-white/85 line-clamp-2 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] max-w-xl font-light">
            {currentArticle.excerpt}
          </p>

          {/* Metadata Ledger & Bespoke "Read Story" Action */}
          <div className="pt-1.5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 font-mono text-[10.5px] sm:text-[11px] text-white/70">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span>{formattedDate}</span>
              <span className="opacity-40">•</span>
              <span>{readingTime}</span>
              {currentArticle.author && (
                <>
                  <span className="opacity-40 hidden sm:inline">•</span>
                  <span className="text-white/90 font-medium hidden sm:inline">By {currentArticle.author}</span>
                </>
              )}
            </div>

            {/* Read Story Action with Animated Hairline Arrow */}
            <Link
              to={articleUrl}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white text-neutral-950 font-sans text-xs font-semibold hover:bg-neutral-100 transition-all shadow-md group/btn w-fit"
            >
              <span>{t.readMore || 'Read Story'}</span>
              <ArrowRightIcon className="h-3 w-3 rtl:rotate-180 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 4. Integrated Editorial Carousel Controls (Bottom Right) */}
        <div className="absolute bottom-8 sm:bottom-12 end-4 sm:end-10 z-20 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto">
          {/* Numbered Pagination (e.g. 01 / 04) */}
          <div className="flex items-baseline gap-1 text-white font-mono select-none drop-shadow-md">
            <span className="font-display font-light text-2xl sm:text-3xl tracking-tight text-white">
              0{currentIndex + 1}
            </span>
            <span className="text-xs text-white/40">/</span>
            <span className="text-xs text-white/50">0{totalSlides}</span>
          </div>

          {/* Circular Hairline Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black/40 hover:bg-white hover:text-neutral-950 text-white backdrop-blur-md transition-all cursor-pointer flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
              aria-label="Previous story"
            >
              <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black/40 hover:bg-white hover:text-neutral-950 text-white backdrop-blur-md transition-all cursor-pointer flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
              aria-label="Next story"
            >
              <ChevronRightIcon className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* 5. Minimalist Direct Slide Jump Indicators (Bottom Center/Left) */}
        <div className="absolute bottom-3 start-6 sm:start-12 z-20 flex items-center gap-1.5 pointer-events-auto">
          {showcaseArticles.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={cn(
                'h-1 rounded-full transition-all duration-300 cursor-pointer',
                idx === currentIndex
                  ? 'w-7 sm:w-9 bg-white shadow-sm'
                  : 'w-2 sm:w-3 bg-white/30 hover:bg-white/60'
              )}
              aria-label={`Jump to slide 0${idx + 1}`}
            />
          ))}
        </div>

        {/* 6. Precision Autoplay Progress Line (Running Along Entire Bottom Border) */}
        <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-white/10 z-30 pointer-events-none">
          <div
            className="h-full bg-accent transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
