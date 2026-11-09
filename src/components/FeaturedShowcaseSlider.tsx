import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  ClockIcon,
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

export function FeaturedShowcaseSlider({
  articles,
  autoplayIntervalMs = 6000,
}: FeaturedShowcaseSliderProps) {
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  // Choose the best articles with images for the showcase slider
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

  // Autoplay and Progress Bar Timer
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const intervalStep = 50; // update every 50ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (intervalStep / autoplayIntervalMs) * 100;
        if (next >= 100) {
          nextSlide();
          return 0;
        }
        return next;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides, autoplayIntervalMs, nextSlide]);

  if (showcaseArticles.length === 0) return null;

  const currentArticle = showcaseArticles[currentIndex];
  const { category, subcategory } = getArticleCategory(currentArticle);
  const formattedDate = formatDate(currentArticle.date, language.code);
  const readingTime = calculateReadingTime(currentArticle, t.minRead);
  const articleUrl = localePath(`/articles/${currentArticle.slug}`);

  // Handle touch swipe on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
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
      className="relative rounded-xl border border-editorial-border overflow-hidden bg-neutral-950 text-white shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured Articles Showcase"
    >
      {/* Background Images with Crossfade & Slow Zoom */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] w-full overflow-hidden">
        {showcaseArticles.map((article, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={article.slug}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              )}
            >
              <img
                src={article.image}
                alt={article.imageAlt || article.title}
                className={cn(
                  'w-full h-full object-cover object-center transition-transform duration-7000 ease-out',
                  isActive ? 'scale-105' : 'scale-100'
                )}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              {/* Focused directional gradients: Leaves the upper 65%+ in 100% full vibrant color and brightness */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
            </div>
          );
        })}

        {/* Top Control Bar: Slide Index Counter & Live Badge (Rounded Full + Poppins) */}
        <div className="absolute top-6 start-6 end-6 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs font-medium bg-black/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15 text-white flex items-center gap-1.5 shadow-sm">
              <SparklesIcon className="h-3.5 w-3.5 text-white" />
              <span>Featured Monograph</span>
            </span>
            <Link
              to={localePath(`/articles?category=${category.id}`)}
              className="hidden sm:inline-flex font-sans text-xs font-medium bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-white/90 border border-white/10 hover:bg-white hover:text-neutral-950 transition-all cursor-pointer pointer-events-auto shadow-sm"
              title={`View ${category.name} collection`}
            >
              {getCategoryShortName(category.id)} →
            </Link>
          </div>

          {/* Slide Numeric Counter (e.g. 01 / 04) & Bookmark Button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <BookmarkButton slug={currentArticle.slug} variant="card" />
            <div className="font-sans text-xs font-medium bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-white shadow-sm flex items-center gap-2">
              <span className="font-bold text-white">0{currentIndex + 1}</span>
              <span className="opacity-40">/</span>
              <span className="opacity-70">0{totalSlides}</span>
            </div>
          </div>
        </div>

        {/* Foreground Content Card: Oversized Editorial Type */}
        <div className="absolute bottom-14 sm:bottom-16 start-6 sm:start-12 end-6 sm:end-12 z-20 space-y-4 max-w-3xl">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-wider text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
            <Link
              to={localePath(`/articles?category=${category.id}`)}
              className="text-white font-bold hover:underline transition-colors pointer-events-auto"
            >
              {getCategoryShortName(category.id)}
            </Link>
            {subcategory && (
              <>
                <span className="opacity-50">/</span>
                <Link
                  to={localePath(`/articles?category=${category.id}&subcategory=${subcategory.id}`)}
                  className="hover:underline transition-colors pointer-events-auto"
                >
                  {subcategory.name}
                </Link>
              </>
            )}
            <span className="opacity-50">•</span>
            <span>{formattedDate}</span>
            <span className="opacity-50">•</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span>{readingTime}</span>
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] leading-[1.05]">
            <Link
              to={articleUrl}
              className="hover:text-neutral-200 transition-colors focus-visible:outline-none"
            >
              {currentArticle.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="font-serif text-sm sm:text-base lg:text-lg text-white/95 line-clamp-2 leading-relaxed max-w-2xl drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
            {currentArticle.excerpt}
          </p>

          {/* Read Monograph Link Button */}
          <div className="pt-2 flex items-center gap-4">
            <Link
              to={articleUrl}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-neutral-950 font-sans text-xs font-semibold rounded-full hover:bg-neutral-100 transition-all shadow-md group/btn"
            >
              <span>{t.readMore || 'Read Monograph'}</span>
              <span className="transition-transform group-hover/btn:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Progress Bar & Navigation Controls */}
        <div className="absolute bottom-0 start-0 end-0 z-20 flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-md border-t border-white/10">
          {/* Animated Progress Line */}
          <div className="flex-1 me-6 h-1 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Navigation Arrows & Dot Indicators */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Dots */}
            <div className="hidden sm:flex items-center gap-1.5 me-2">
              {showcaseArticles.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(i);
                    setProgress(0);
                  }}
                  className={cn(
                    'h-1.5 rounded-full transition-all cursor-pointer',
                    i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev Button */}
            <button
              type="button"
              onClick={prevSlide}
              className="p-2 rounded-full border border-white/20 bg-black/40 hover:bg-white hover:text-neutral-950 text-white transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Previous featured article"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextSlide}
              className="p-2 rounded-full border border-white/20 bg-black/40 hover:bg-white hover:text-neutral-950 text-white transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Next featured article"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

