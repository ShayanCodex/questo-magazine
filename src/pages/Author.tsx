import { useLoaderData, Link } from 'react-router-dom';
import {
  MapPinIcon,
  DocumentTextIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LazyImage } from '../components/LazyImage';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory, getCategoryShortName } from '../lib/categories';
import { type Author } from '../data/authors';

interface AuthorLoaderData {
  author: Author;
  articles: ArticleData[];
  pathname: string;
}

export function Author() {
  const { author, articles, pathname } = useLoaderData() as AuthorLoaderData;
  const { t, localePath, language } = useLanguage();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: 'Authors', href: localePath('/about#masthead') },
    { label: author.name },
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <Seo
        title={`${author.name} — Contributing Author & Critic`}
        description={author.bio}
        pathname={pathname}
        image={author.avatar}
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Author Hero Profile Header */}
      <header className="p-6 sm:p-10 rounded-2xl border border-editorial-border bg-editorial-surface shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-editorial-border shadow-md"
          />
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-accent">
              <span>Questo Editorial Contributor</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPinIcon className="h-3.5 w-3.5" />
                {author.location}
              </span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-editorial-text uppercase tracking-tight">
              {author.name}
            </h1>
            <p className="font-sans font-medium text-sm sm:text-base text-editorial-muted">
              {author.role}
            </p>
            <p className="font-serif text-sm sm:text-base text-editorial-text/90 leading-relaxed max-w-2xl pt-1">
              {author.bio}
            </p>
          </div>
        </div>

        {/* Social Links & Byline Counts */}
        <div className="pt-6 border-t border-editorial-border/60 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2 text-editorial-muted">
            <DocumentTextIcon className="h-4 w-4 text-editorial-text" />
            <span className="font-semibold text-editorial-text">{articles.length}</span>
            <span>published monographs & essays</span>
          </div>

          <div className="flex items-center gap-3">
            {author.socials.twitter && (
              <a
                href={author.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-colors font-medium"
              >
                Twitter / X
              </a>
            )}
            {author.socials.github && (
              <a
                href={author.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-colors font-medium"
              >
                GitHub
              </a>
            )}
            {author.socials.linkedin && (
              <a
                href={author.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-colors font-medium"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Authored Articles Stream */}
      <section className="space-y-6">
        <div className="border-b border-editorial-border pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-editorial-muted block">
              Curated Portfolio
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-editorial-text uppercase tracking-tight">
              Essays by {author.name}
            </h2>
          </div>
          <Link
            to={localePath('/articles')}
            className="text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted hover:text-editorial-text underline flex items-center gap-1"
          >
            <span>All Articles</span>
            <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => {
            const { category } = getArticleCategory(art);
            const dateStr = formatDate(art.date, language.code);
            const readingTime = calculateReadingTime(art, t.minRead);
            const artUrl = localePath(`/articles/${art.slug}`);

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
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 start-3">
                        <span className="px-2.5 py-0.5 text-[11px] font-sans font-medium bg-black/75 backdrop-blur-xs text-white rounded-full border border-white/15">
                          {getCategoryShortName(category.id)}
                        </span>
                      </div>
                    </Link>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>{readingTime}</span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-editorial-text group-hover:text-accent transition-colors leading-snug">
                      <Link to={artUrl}>{art.title}</Link>
                    </h3>

                    <p className="font-serif text-sm text-editorial-muted leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={artUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-editorial-text group-hover:text-accent transition-colors"
                  >
                    <span>Read Monograph</span>
                    <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
