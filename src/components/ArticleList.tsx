import { Link } from 'react-router-dom';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { formatDate, calculateReadingTime } from '../lib/content';
import { Badge } from './ui/badge';

export interface ArticleListProps {
  articles: ArticleData[];
  emptyMessage?: string;
}

export function ArticleList({ articles, emptyMessage }: ArticleListProps) {
  const { language, t, localePath } = useLanguage();

  if (articles.length === 0) {
    return (
      <div className="py-16 text-start">
        <p className="font-serif text-lg text-editorial-muted italic">
          {emptyMessage || t.noArticlesFound}
        </p>
      </div>
    );
  }

  return (
    <div className="article-index divide-y divide-editorial-border border-y border-editorial-border">
      {articles.map((article) => {
        const articlePath = localePath(`/articles/${article.slug}`);
        const formattedDate = formatDate(article.date, language.code);
        const readingTime = calculateReadingTime(article, t.minRead);

        return (
          <article
            key={article.slug}
            className="article-row group/row relative py-8 sm:py-10 transition-opacity"
          >
            {/* The primary link covering the whole row */}
            <Link
              to={articlePath}
              className="absolute inset-0 z-0 focus:outline-none"
              aria-label={article.title}
              tabIndex={-1}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start pointer-events-none">
              {/* Meta column: date & reading time */}
              <div className="md:col-span-3 text-xs font-mono uppercase tracking-wider text-editorial-muted flex flex-row md:flex-col justify-between md:justify-start gap-1">
                <time dateTime={article.date}>{formattedDate}</time>
                <span className="opacity-70">{readingTime}</span>
              </div>

              {/* Content column: Title, excerpt, and tags */}
              <div className="md:col-span-6 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-editorial-text group-hover/row:text-accent transition-colors leading-[1.1] uppercase">
                  <Link
                    to={articlePath}
                    className="pointer-events-auto hover:text-accent transition-colors focus-visible:outline-none"
                  >
                    {article.title}
                  </Link>
                </h2>

                <p className="font-serif text-editorial-muted text-sm sm:text-base leading-relaxed max-w-[60ch]">
                  {article.excerpt}
                </p>

                {/* Layered tag links */}
                {article.tags && article.tags.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2 pointer-events-auto relative z-10">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={localePath(`/tags/${tag}`)}
                        className="focus:outline-none"
                      >
                        <Badge variant="default" className="text-[10px] uppercase">
                          #{tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Artwork thumbnail column */}
              {article.image && (
                <div className="md:col-span-3 hidden sm:block">
                  <div className="aspect-[4/3] rounded-sm overflow-hidden border border-editorial-border bg-editorial-surface">
                    <img
                      src={article.image}
                      alt={article.imageAlt || article.title}
                      className="w-full h-full object-cover group-hover/row:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
