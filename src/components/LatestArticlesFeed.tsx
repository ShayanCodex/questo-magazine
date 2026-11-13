import { Link } from 'react-router-dom';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory, getCategoryShortName } from '../lib/categories';
import { authorNameToSlug, getAuthorByName } from '../data/authors';
import { LazyImage } from './LazyImage';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export interface LatestArticlesFeedProps {
  articles: ArticleData[];
  limit?: number;
}

export function LatestArticlesFeed({ articles, limit = 4 }: LatestArticlesFeedProps) {
  const { t, localePath, language } = useLanguage();

  const sorted = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <section className="pt-12 sm:pt-16 border-t border-editorial-border space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-1">
            Chronological Publishing
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-editorial-text uppercase tracking-tight">
            Latest Monographs &amp; Dispatches
          </h2>
        </div>
        <Link
          to={localePath('/articles')}
          className="text-xs font-semibold uppercase tracking-wider text-editorial-muted hover:text-editorial-text underline flex items-center gap-1.5"
        >
          <span>Explore All Articles</span>
          <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sorted.map((art) => {
          const { category } = getArticleCategory(art);
          const dateStr = formatDate(art.date, language.code);
          const readingTime = calculateReadingTime(art, t.minRead);
          const artUrl = localePath(`/articles/${art.slug}`);
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
                      <Link
                        to={localePath(`/categories/${category.id}`)}
                        className="px-2.5 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-wider bg-black/80 backdrop-blur-xs text-white rounded-full border border-white/20 hover:bg-black transition-colors"
                      >
                        {getCategoryShortName(category.id)}
                      </Link>
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

              {/* Card Footer Byline */}
              <div className="p-5 pt-0 border-t border-editorial-border/40 mt-3 pt-3 flex items-center justify-between">
                <Link
                  to={localePath(`/authors/${authorSlug}`)}
                  className="flex items-center gap-2 group/author"
                >
                  {authorData && (
                    <img
                      src={authorData.avatar}
                      alt={art.author}
                      className="w-6 h-6 rounded-full object-cover border border-editorial-border"
                    />
                  )}
                  <span className="text-xs font-semibold text-editorial-text group-hover/author:underline">
                    {art.author}
                  </span>
                </Link>

                <Link
                  to={artUrl}
                  className="text-editorial-muted group-hover:text-editorial-text group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
                  aria-label={`Read ${art.title}`}
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

