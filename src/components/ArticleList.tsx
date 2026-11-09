import { Link } from 'react-router-dom';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory } from '../lib/categories';
import { Badge } from './ui/badge';
import { ArticleViewCount } from './ArticleViewCount';
import { cn } from '../lib/utils';

export interface ArticleListProps {
  articles: ArticleData[];
  emptyMessage?: string;
  className?: string;
}

export function ArticleList({ articles, emptyMessage, className }: ArticleListProps) {
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
    <div
      className={cn(
        'article-index divide-y divide-editorial-border border-y border-editorial-border',
        className
      )}
    >
      {articles.map((article) => {
        const articlePath = localePath(`/articles/${article.slug}`);
        const formattedDate = formatDate(article.date, language.code);
        const readingTime = calculateReadingTime(article, t.minRead);
        const { category, subcategory } = getArticleCategory(article);
        const hasImage = Boolean(article.image);

        return (
          <article
            key={article.slug}
            className="article-row group/row relative py-8 sm:py-10 transition-opacity"
          >
            {/* The primary link covering the whole row for accessibility & 1-click navigate */}
            <Link
              to={articlePath}
              className="absolute inset-0 z-0 focus:outline-none"
              aria-label={article.title}
              tabIndex={-1}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start pointer-events-none">
              {/* Meta column: Author avatar, date, and real-time GoatCounter views */}
              <div className="md:col-span-3 text-xs font-mono uppercase tracking-wider text-editorial-muted flex flex-row md:flex-col justify-between md:justify-start gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-editorial-surface-subtle border border-editorial-border flex items-center justify-center text-[10px] font-bold text-editorial-text shrink-0">
                    {article.author.charAt(0)}
                  </div>
                  <span className="truncate text-editorial-text font-medium">{article.author}</span>
                </div>
                <time dateTime={article.date}>{formattedDate}</time>
                <ArticleViewCount path={`/articles/${article.slug}`} slug={article.slug} compact />
              </div>

              {/* Content column: Category breadcrumb, title, excerpt, and tags */}
              <div
                className={cn(
                  'space-y-3',
                  hasImage ? 'md:col-span-5 lg:col-span-6' : 'md:col-span-9'
                )}
              >
                {/* Category & Subcategory Taxonomy Breadcrumb */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider pointer-events-auto relative z-10">
                  <Link
                    to={localePath(`/articles?category=${category.id}`)}
                    className="text-editorial-text font-bold hover:text-accent transition-colors"
                  >
                    {category.name}
                  </Link>
                  {subcategory && (
                    <>
                      <span className="text-editorial-muted/60">/</span>
                      <Link
                        to={localePath(`/articles?category=${category.id}&subcategory=${subcategory.id}`)}
                        className="text-editorial-muted hover:text-editorial-text transition-colors"
                      >
                        {subcategory.name}
                      </Link>
                    </>
                  )}
                </div>

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

              {/* Responsive Right-Side Image Column with floating badges & Awwwards zoom */}
              {article.image && (
                <div className="md:col-span-4 lg:col-span-3 w-full order-first md:order-last pointer-events-auto relative z-10">
                  <Link
                    to={articlePath}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block relative aspect-[16/10] sm:aspect-[4/3] rounded-sm overflow-hidden border border-editorial-border bg-editorial-surface shadow-xs group/img transition-all hover:border-editorial-text"
                  >
                    <img
                      src={article.image}
                      alt={article.imageAlt || article.title}
                      className="w-full h-full object-cover group-hover/row:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />

                    {/* Floating Category Badge over Artwork */}
                    <div className="absolute top-2.5 start-2.5 z-10">
                      <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-black/75 backdrop-blur-xs text-white rounded-xs border border-white/10 shadow-xs">
                        {category.name}
                      </span>
                    </div>

                    {/* Floating Reading Time Badge */}
                    <div className="absolute bottom-2.5 end-2.5 z-10">
                      <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-black/65 backdrop-blur-xs text-white/90 rounded-xs">
                        {readingTime}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Link>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
