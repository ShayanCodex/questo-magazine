import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory, getCategoryShortName, getCategoryName } from '../lib/categories';
import { authorNameToSlug, getAuthorByName } from '../data/authors';
import { LazyImage } from './LazyImage';
import {
  ArrowRightIcon,
  GlobeAltIcon,
  CpuChipIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  BeakerIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export interface MultiCategoryShowcaseProps {
  articles: ArticleData[];
}

interface CategoryPillar {
  id: string;
  label: string;
  icon: typeof GlobeAltIcon;
  badgeBg: string;
}

const FEATURED_PILLARS: CategoryPillar[] = [
  { id: 'news', label: 'Global Affairs', icon: GlobeAltIcon, badgeBg: 'bg-blue-900/60 text-blue-200 border-blue-700/50' },
  { id: 'technology', label: 'Technology & AI', icon: CpuChipIcon, badgeBg: 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50' },
  { id: 'finance', label: 'Finance & Markets', icon: ChartBarIcon, badgeBg: 'bg-amber-900/60 text-amber-200 border-amber-700/50' },
  { id: 'architecture-and-space', label: 'Architecture & Space', icon: BuildingLibraryIcon, badgeBg: 'bg-purple-900/60 text-purple-200 border-purple-700/50' },
  { id: 'science', label: 'Science & Research', icon: BeakerIcon, badgeBg: 'bg-cyan-900/60 text-cyan-200 border-cyan-700/50' },
  { id: 'food', label: 'Gastronomy & Culture', icon: SparklesIcon, badgeBg: 'bg-rose-900/60 text-rose-200 border-rose-700/50' },
];

export function MultiCategoryShowcase({ articles }: MultiCategoryShowcaseProps) {
  const { t, localePath, language } = useLanguage();
  const [selectedPillar, setSelectedPillar] = useState<string>('all');

  // Group articles by normalized category
  const articlesByCategory = useMemo(() => {
    const map = new Map<string, ArticleData[]>();
    for (const art of articles) {
      const { category } = getArticleCategory(art);
      const list = map.get(category.id) || [];
      list.push(art);
      map.set(category.id, list);
    }
    // Sort each category by date descending
    for (const list of map.values()) {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return map;
  }, [articles]);

  return (
    <section className="pt-12 sm:pt-16 border-t border-editorial-border space-y-8 font-sans">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-1">
            {language.code === 'ur'
              ? 'موضوعاتی آرکائیو اور زمرہ بندی'
              : language.code === 'ar'
              ? 'الأرشيف الموضوعي والأقسام التحريرية'
              : language.code === 'es'
              ? 'Archivo Temático y Disciplinas'
              : language.code === 'fr'
              ? 'Archives Thématiques et Disciplines'
              : language.code === 'de'
              ? 'Thematisches Archiv & Disziplinen'
              : 'Thematic Archives & Multi-Category Explorer'}
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-editorial-text uppercase tracking-tight">
            {language.code === 'ur'
              ? 'منتخب مضامین بلحاظ شعبہ جات'
              : language.code === 'ar'
              ? 'مقالات مختارة حسب الأقسام'
              : language.code === 'es'
              ? 'Artículos Seleccionados por Disciplina'
              : language.code === 'fr'
              ? 'Monographies Sélectionnées par Discipline'
              : language.code === 'de'
              ? 'Kuratierte Artikel nach Ressorts'
              : 'Curated Articles by Category'}
          </h2>
        </div>

        <Link
          to={localePath('/categories')}
          className="text-xs font-semibold uppercase tracking-wider text-editorial-muted hover:text-editorial-text underline flex items-center gap-1.5"
        >
          <span>
            {language.code === 'ur'
              ? 'تمام زمرہ جات دیکھیں'
              : language.code === 'ar'
              ? 'استكشف كافة التصنيفات'
              : language.code === 'es'
              ? 'Ver Todas las Categorías'
              : 'View All 18 Disciplines'}
          </span>
          <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 text-xs">
        <button
          type="button"
          onClick={() => setSelectedPillar('all')}
          className={`px-4 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer border ${
            selectedPillar === 'all'
              ? 'bg-editorial-text text-editorial-bg border-editorial-text shadow-xs'
              : 'bg-editorial-surface border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text'
          }`}
        >
          {language.code === 'ur' ? 'تمام اہم شعبہ جات' : language.code === 'ar' ? 'كافة الأقسام' : 'All Disciplines'}
        </button>

        {FEATURED_PILLARS.map((pillar) => {
          const count = articlesByCategory.get(pillar.id)?.length || 0;
          const isActive = selectedPillar === pillar.id;
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setSelectedPillar(pillar.id)}
              className={`px-4 py-1.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                isActive
                  ? 'bg-editorial-text text-editorial-bg border-editorial-text shadow-xs'
                  : 'bg-editorial-surface border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text'
              }`}
            >
              <span>{getCategoryShortName(pillar.id, language.code)}</span>
              {count > 0 && <span className="text-[10px] opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* View Mode 1: All Disciplines Matrix (Side-by-Side 3 Columns) */}
      {selectedPillar === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURED_PILLARS.map((pillar) => {
            const pillarArticles = articlesByCategory.get(pillar.id) || [];
            const leadArticle = pillarArticles[0];
            const companionArticles = pillarArticles.slice(1, 4);
            const Icon = pillar.icon;

            if (!leadArticle) return null;

            const leadUrl = localePath(`/articles/${leadArticle.slug}`);
            const dateStr = formatDate(leadArticle.date, language.code);
            const readingTime = calculateReadingTime(leadArticle, t.minRead);
            const authorData = getAuthorByName(leadArticle.author);

            return (
              <div
                key={pillar.id}
                className="rounded-2xl border border-editorial-border bg-editorial-surface p-5 sm:p-6 flex flex-col justify-between space-y-5 hover:border-editorial-text/70 transition-all shadow-2xs"
              >
                <div className="space-y-4">
                  {/* Pillar Column Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-editorial-border">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border text-editorial-text">
                        <Icon className="h-4 w-4 text-accent" />
                      </div>
                      <h3 className="font-display font-bold text-base text-editorial-text uppercase tracking-tight">
                        {getCategoryName(pillar.id, language.code)}
                      </h3>
                    </div>
                    <Link
                      to={localePath(`/categories/${pillar.id}`)}
                      className="text-[11px] font-semibold uppercase tracking-wider text-accent hover:underline flex items-center gap-1"
                    >
                      <span>{pillarArticles.length}</span>
                      <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
                    </Link>
                  </div>

                  {/* Lead Featured Card for this Category */}
                  <div className="group space-y-3">
                    {leadArticle.image && (
                      <Link
                        to={leadUrl}
                        className="block aspect-[16/10] overflow-hidden rounded-xl border border-editorial-border bg-neutral-900 relative shadow-xs"
                      >
                        <LazyImage
                          src={leadArticle.image}
                          alt={leadArticle.imageAlt || leadArticle.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                        />
                        <span className="absolute top-2.5 start-2.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-black/80 backdrop-blur-xs text-white rounded-full border border-white/20">
                          {getCategoryShortName(pillar.id, language.code)}
                        </span>
                      </Link>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-editorial-muted">
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>{readingTime}</span>
                      </div>
                      <h4 className="font-display font-bold text-lg text-editorial-text group-hover:text-accent transition-colors leading-snug">
                        <Link to={leadUrl}>{leadArticle.title}</Link>
                      </h4>
                      <p className="font-serif text-xs text-editorial-muted leading-relaxed line-clamp-2">
                        {leadArticle.excerpt}
                      </p>
                    </div>

                    {/* Author Byline */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-editorial-muted">
                      {authorData?.avatar && (
                        <img
                          src={authorData.avatar}
                          alt={leadArticle.author}
                          className="w-4 h-4 rounded-full object-cover border border-editorial-border"
                        />
                      )}
                      <span className="font-medium text-editorial-text">{leadArticle.author}</span>
                    </div>
                  </div>

                  {/* Companion Secondary Headlines */}
                  {companionArticles.length > 0 && (
                    <div className="pt-3 border-t border-editorial-border/60 divide-y divide-editorial-border/40">
                      {companionArticles.map((comp) => {
                        const compUrl = localePath(`/articles/${comp.slug}`);
                        return (
                          <div key={comp.slug} className="py-2.5 group/item">
                            <h5 className="font-display font-medium text-xs sm:text-sm text-editorial-text group-hover/item:text-accent transition-colors leading-snug line-clamp-2">
                              <Link to={compUrl}>{comp.title}</Link>
                            </h5>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-editorial-muted">
                              <span>{formatDate(comp.date, language.code)}</span>
                              <span>•</span>
                              <span>{calculateReadingTime(comp, t.minRead)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer Link */}
                <div className="pt-3 border-t border-editorial-border/60">
                  <Link
                    to={localePath(`/categories/${pillar.id}`)}
                    className="w-full py-2 px-3 rounded-xl bg-editorial-surface-subtle hover:bg-editorial-text hover:text-editorial-bg border border-editorial-border text-editorial-text text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <span>
                      {language.code === 'ur'
                        ? `${getCategoryShortName(pillar.id, language.code)} کے تمام مضامین`
                        : `Explore All ${getCategoryShortName(pillar.id, language.code)}`}
                    </span>
                    <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: Single Selected Discipline Detailed Grid */}
      {selectedPillar !== 'all' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(articlesByCategory.get(selectedPillar) || []).slice(0, 8).map((art) => {
              const artUrl = localePath(`/articles/${art.slug}`);
              const dateStr = formatDate(art.date, language.code);
              const readingTime = calculateReadingTime(art, t.minRead);
              const authorSlug = authorNameToSlug(art.author);
              const authorData = getAuthorByName(art.author);

              return (
                <article
                  key={art.slug}
                  className="group rounded-2xl border border-editorial-border bg-editorial-surface hover:border-editorial-text transition-all overflow-hidden flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    {art.image && (
                      <Link to={artUrl} className="block aspect-[16/10] overflow-hidden bg-neutral-900 relative">
                        <LazyImage
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute top-3 start-3">
                          <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-black/80 backdrop-blur-xs text-white rounded-full border border-white/20">
                            {getCategoryShortName(selectedPillar, language.code)}
                          </span>
                        </div>
                      </Link>
                    )}

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-editorial-muted">
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>{readingTime}</span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-editorial-text group-hover:text-accent transition-colors leading-snug">
                        <Link to={artUrl}>{art.title}</Link>
                      </h3>
                      <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-editorial-border/40 mt-3 pt-3 flex items-center justify-between">
                    <Link to={localePath(`/authors/${authorSlug}`)} className="flex items-center gap-2 group/author">
                      {authorData?.avatar && (
                        <img
                          src={authorData.avatar}
                          alt={art.author}
                          className="w-5 h-5 rounded-full object-cover border border-editorial-border"
                        />
                      )}
                      <span className="text-[11px] font-sans font-semibold text-editorial-muted group-hover/author:text-editorial-text transition-colors">
                        {art.author}
                      </span>
                    </Link>
                    <Link
                      to={artUrl}
                      className="text-editorial-muted group-hover:text-accent transition-colors p-1"
                      aria-label={`Read ${art.title}`}
                    >
                      <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              to={localePath(`/categories/${selectedPillar}`)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-editorial-surface border border-editorial-border hover:border-editorial-text text-editorial-text font-semibold text-xs uppercase tracking-wider transition-all shadow-xs"
            >
              <span>{language.code === 'ur' ? 'اس زمرے کے مزید تمام آرٹیکلز دیکھیں' : `Explore Full ${getCategoryShortName(selectedPillar, language.code)} Archive`}</span>
              <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
