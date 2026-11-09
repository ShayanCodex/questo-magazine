import { useLoaderData, Link } from 'react-router-dom';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { formatDate, calculateReadingTime } from '../lib/content';
import { createBreadcrumbJsonLd } from '../lib/breadcrumbs';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Body } from '../components/Body';
import { Badge } from '../components/ui/badge';

interface ArticleLoaderData {
  article: ArticleData;
  availableLanguages: string[];
  pathname: string;
}

export function Article() {
  const { article, availableLanguages, pathname } = useLoaderData() as ArticleLoaderData;
  const { language, t, localePath } = useLanguage();

  const formattedDate = formatDate(article.date, language.code);
  const formattedUpdated = article.updated
    ? formatDate(article.updated, language.code)
    : undefined;
  const readingTime = calculateReadingTime(article, t.minRead);

  // GitHub Edit Link
  const githubRepo = import.meta.env.VITE_GITHUB_REPO;
  const githubBranch = import.meta.env.VITE_GITHUB_BRANCH || 'main';
  const githubEditUrl = githubRepo
    ? `https://github.com/${githubRepo}/edit/${githubBranch}/content/articles/${article.slug}.json`
    : null;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: t.articles, href: localePath('/articles') },
    { label: article.title },
  ];

  // Canonical is English version if this is a translation fallback page
  const canonicalPath = article.isFallback ? `/articles/${article.slug}` : pathname;

  return (
    <article className="space-y-10 sm:space-y-12 max-w-4xl mx-auto">
      <Seo
        title={article.title}
        description={article.excerpt}
        pathname={pathname}
        canonicalPath={canonicalPath}
        image={article.image}
        type="article"
        articleDate={article.date}
        articleUpdated={article.updated}
        articleAuthor={article.author}
        availableLanguages={availableLanguages}
        noIndex={article.isFallback}
        breadcrumbsJsonLd={createBreadcrumbJsonLd(breadcrumbs)}
      />

      <header className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        {/* Fallback Notice for untranslated articles */}
        {article.isFallback && (
          <div
            role="status"
            className="p-4 rounded-sm border border-editorial-border bg-editorial-surface-subtle text-editorial-text text-sm font-sans"
          >
            <p className="font-semibold text-editorial-text mb-0.5">Translation Notice</p>
            <p className="text-editorial-muted">{t.fallbackNotice}</p>
          </div>
        )}

        <h1 className="font-display font-black text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight text-editorial-text text-start uppercase">
          {article.title}
        </h1>

        <p className="font-serif text-lg sm:text-xl text-editorial-muted leading-relaxed max-w-2xl">
          {article.excerpt}
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono uppercase tracking-wider text-editorial-muted pt-2 border-b border-editorial-border pb-6">
          <span>
            <strong className="text-editorial-text font-semibold">{t.textBy}:</strong> {article.author}
          </span>
          <span>•</span>
          <time dateTime={article.date}>{formattedDate}</time>
          {formattedUpdated && (
            <span className="opacity-80">
              (updated {formattedUpdated})
            </span>
          )}
          <span>•</span>
          <span>{readingTime}</span>
        </div>
      </header>

      {/* Feature Hero Image */}
      {article.image && (
        <div className="w-full overflow-hidden rounded-sm border border-editorial-border my-8 aspect-[16/9] sm:aspect-[21/9]">
          <img
            src={article.image}
            alt={article.imageAlt || article.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* Main Prose Content with Images and Videos */}
      <div className="pt-2">
        <Body blocks={article.body} />
      </div>

      {/* Article Footer */}
      <footer className="pt-12 mt-16 border-t border-editorial-border space-y-8">
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted ltr:mr-2 rtl:ml-2">
              {t.topics}:
            </span>
            {article.tags.map((tag) => (
              <Link key={tag} to={localePath(`/tags/${tag}`)}>
                <Badge variant="default">#{tag}</Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 text-sm">
          <Link
            to={localePath('/articles')}
            className="inline-flex items-center gap-2 text-editorial-text hover:text-accent font-medium transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 rtl:rotate-180" />
            <span>{t.backToArticles}</span>
          </Link>

          {githubEditUrl && (
            <a
              href={githubEditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-editorial-muted hover:text-accent transition-colors"
            >
              <PencilSquareIcon className="h-4 w-4" />
              <span>{t.editOnGitHub}</span>
            </a>
          )}
        </div>
      </footer>
    </article>
  );
}
