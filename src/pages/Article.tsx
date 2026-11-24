import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  ShareIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory, getCategoryShortName, getCategoryName, getSubcategoryName, formatTopicName } from '../lib/categories';
import { getAuthorByName, authorNameToSlug } from '../data/authors';
import { createBreadcrumbJsonLd } from '../lib/breadcrumbs';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Body } from '../components/Body';
import { ArticleViewCount } from '../components/ArticleViewCount';
import { BookmarkButton } from '../components/BookmarkButton';
import { ArticleAudioPlayer } from '../components/ArticleAudioPlayer';
import { ArticleTakeaways } from '../components/ArticleTakeaways';
import { QuoteSelectionPopup } from '../components/QuoteSelectionPopup';
import { ImageLightbox } from '../components/ImageLightbox';
import { ArticleToc } from '../components/ArticleToc';
import { ArticleComments } from '../components/ArticleComments';
import { LazyImage } from '../components/LazyImage';
import { AdSlot } from '../components/ads/AdSlot';
import { cn } from '../lib/utils';

interface ArticleLoaderData {
  article: ArticleData;
  relatedArticles?: ArticleData[];
  availableLanguages: string[];
  pathname: string;
}

export function Article() {
  const { article, relatedArticles = [], availableLanguages, pathname } = useLoaderData() as ArticleLoaderData;
  const { language, t, localePath } = useLanguage();

  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt?: string } | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Track document scroll progress for sticky reading indicator
  useEffect(() => {
    let animationFrameId: number;
    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
          setScrollProgress(progress);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
      }
    }
  };

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

  const { category, subcategory } = getArticleCategory(article);
  const authorSlug = authorNameToSlug(article.author);
  const authorProfile = getAuthorByName(article.author);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: getCategoryName(category.id, language.code), href: localePath(`/categories/${category.id}`) },
    { label: article.title },
  ];

  const canonicalPath = article.isFallback ? `/articles/${article.slug}` : pathname;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://questo-blog.netlify.app/articles/${article.slug}`;
  const shareTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`;
  const shareLinkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  const shareWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${currentUrl}`)}`;

  const hasToc =
    Array.isArray(article.body) &&
    article.body.filter((b) => (b.type === 'h2' || b.type === 'h3') && b.text).length >= 2;

  return (
    <>
      {/* Sticky Top Reading Progress Bar */}
      <div className="fixed top-0 start-0 end-0 z-50 h-1 bg-editorial-border/30 pointer-events-none">
        <div
          className="h-full bg-editorial-text transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Outer Layout: Main Article Column + Desktop Right-Side Sticky Table of Contents */}
      <div className="relative max-w-7xl mx-auto flex justify-center gap-10 xl:gap-14 items-start">
        {/* Main Article Reading Column (Matches full Key Takeaways width!) */}
        <article className="w-full max-w-4xl min-w-0 space-y-10 sm:space-y-12">
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
            keywords={article.tags}
          />

          <header className="space-y-6">
            <Breadcrumbs items={breadcrumbs} />

            {/* Fallback Notice for untranslated articles */}
            {article.isFallback && (
              <div
                role="status"
                className="p-4 rounded-sm border border-editorial-border bg-editorial-surface-subtle text-editorial-text text-sm font-sans"
              >
                <p className="font-semibold text-editorial-text mb-0.5">
                  {language.code === 'ur' ? 'ترجمے کا نوٹ' : language.code === 'ar' ? 'إشعار الترجمة' : 'Translation Notice'}
                </p>
                <p className="text-editorial-muted">{t.fallbackNotice}</p>
              </div>
            )}

            {/* Category & Subcategory Taxonomy Badges (Click to Go) */}
            <div className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider">
              <Link
                to={localePath(`/categories/${category.id}`)}
                className="text-editorial-text font-bold hover:text-accent transition-colors"
              >
                {getCategoryShortName(category.id, language.code)}
              </Link>
              {subcategory && (
                <>
                  <span className="text-editorial-muted">/</span>
                  <Link
                    to={localePath(`/categories/${category.id}?subcategory=${subcategory.id}`)}
                    className="text-editorial-muted hover:text-editorial-text transition-colors"
                  >
                    {getSubcategoryName(subcategory.id, language.code)}
                  </Link>
                </>
              )}
            </div>

            <h1 className="font-display font-bold text-[clamp(1.75rem,3.8vw,3rem)] leading-[1.12] tracking-tight text-editorial-text text-start">
              {article.title}
            </h1>

            <p className="font-serif text-lg sm:text-xl text-editorial-muted leading-relaxed max-w-2xl">
              {article.excerpt}
            </p>

            {/* Article Meta Bar with Clickable Author and In-Page Jump Links */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted pt-2 border-b border-editorial-border pb-4">
              <span>
                <strong className="text-editorial-text font-semibold">{t.textBy}:</strong>{' '}
                <Link
                  to={localePath(`/authors/${authorSlug}`)}
                  className="text-editorial-text font-bold hover:underline transition-colors"
                >
                  {article.author}
                </Link>
              </span>
              <span>•</span>
              <time dateTime={article.date}>{formattedDate}</time>
              {formattedUpdated && (
                <span className="opacity-80">
                  {language.code === 'ur' ? `(تجدید شدہ ${formattedUpdated})` : language.code === 'ar' ? `(تم التحديث ${formattedUpdated})` : `(updated ${formattedUpdated})`}
                </span>
              )}
              <span>•</span>
              <span>{readingTime}</span>
              <span>•</span>
              <ArticleViewCount path={`/articles/${article.slug}`} slug={article.slug} />
              <span>•</span>
              <a
                href="#comments"
                className="text-editorial-muted hover:text-editorial-text underline underline-offset-2 transition-colors"
              >
                {t.discussion || 'Discussion'}
              </a>
            </div>

            {/* Reading Assistance Toolbar: Audio Player, Font Size Controls, Bookmark & Social Share Suite */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-editorial-border/60 text-xs font-sans">
              <div className="flex flex-wrap items-center gap-3">
                {/* Native Speech Audio Player */}
                <ArticleAudioPlayer article={article} langCode={language.code} />

                {/* Text Size Controls */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-sans text-editorial-muted font-medium">{t.textSize || 'Text size'}:</span>
                  <div className="inline-flex rounded-full border border-editorial-border overflow-hidden p-0.5 bg-editorial-surface-subtle">
                    <button
                      type="button"
                      onClick={() => setFontSize('sm')}
                      className={cn(
                        'px-3 py-1 text-xs font-sans font-medium rounded-full cursor-pointer transition-all',
                        fontSize === 'sm'
                          ? 'bg-editorial-text text-editorial-bg shadow-xs'
                          : 'text-editorial-muted hover:text-editorial-text'
                      )}
                      title="Small text"
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('base')}
                      className={cn(
                        'px-3 py-1 text-xs font-sans font-medium rounded-full cursor-pointer transition-all',
                        fontSize === 'base'
                          ? 'bg-editorial-text text-editorial-bg shadow-xs'
                          : 'text-editorial-muted hover:text-editorial-text'
                      )}
                      title="Default text"
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('lg')}
                      className={cn(
                        'px-3 py-1 text-xs font-sans font-medium rounded-full cursor-pointer transition-all',
                        fontSize === 'lg'
                          ? 'bg-editorial-text text-editorial-bg shadow-xs'
                          : 'text-editorial-muted hover:text-editorial-text'
                      )}
                      title="Large text"
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Bookmark Button */}
                <BookmarkButton slug={article.slug} variant="pill" />

                {/* Social Share Suite */}
                <div className="inline-flex items-center gap-1 rounded-full border border-editorial-border bg-editorial-surface p-1 shadow-2xs">
                  <a
                    href={shareTwitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-xs font-sans font-medium text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover rounded-full transition-colors"
                    title="Share on Twitter / X"
                  >
                    X
                  </a>
                  <a
                    href={shareLinkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-xs font-sans font-medium text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover rounded-full transition-colors"
                    title="Share on LinkedIn"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={shareWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-xs font-sans font-medium text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover rounded-full transition-colors"
                    title="Share on WhatsApp"
                  >
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-editorial-surface-subtle text-editorial-text hover:bg-editorial-surface-hover text-xs font-sans font-medium transition-all cursor-pointer"
                    title="Copy permanent article link"
                  >
                    {copied ? (
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <ShareIcon className="h-3.5 w-3.5 text-editorial-muted" />
                    )}
                    <span>{copied ? (t.copied || 'Copied') : (t.copy || 'Copy')}</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Feature Hero Image with Click-to-Zoom Lightbox and Active Spinning Loader */}
          {article.image && (
            <div
              onClick={() => setLightboxImg({ src: article.image!, alt: article.imageAlt || article.title })}
              className="w-full overflow-hidden rounded-xl border border-editorial-border my-8 aspect-[16/9] sm:aspect-[21/9] cursor-zoom-in group/img relative shadow-md bg-editorial-surface-subtle"
              title="Click to expand high-resolution photograph"
            >
              {!heroLoaded && (
                <div className="absolute inset-0 bg-editorial-surface-hover/80 backdrop-blur-2xs z-10 flex flex-col items-center justify-center p-3 select-none">
                  <svg
                    className="animate-spin text-editorial-text/70 w-8 h-8"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-label="Loading article hero image"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              )}
              <img
                src={article.image}
                alt={article.imageAlt || article.title}
                onLoad={() => setHeroLoaded(true)}
                className={cn(
                  'w-full h-full object-cover group-hover/img:scale-102 transition-opacity duration-500 ease-out',
                  heroLoaded ? 'opacity-100' : 'opacity-0'
                )}
                loading="eager"
              />
              <div className="absolute bottom-3 end-3 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/75 backdrop-blur-md text-white text-[11px] font-sans font-medium px-3 py-1 rounded-full border border-white/20 shadow-md flex items-center gap-1.5 pointer-events-none z-10">
                <span>{t.zoomArtwork || 'Zoom Artwork'}</span>
                <span>⤢</span>
              </div>
            </div>
          )}

          {/* Top Leaderboard Ad Slot (Zero CLS) */}
          <AdSlot slotType="above-fold" />

          {/* Executive Summary / Key Takeaways Box */}
          <ArticleTakeaways article={article} />

          {/* Main Prose Content with Dynamic Font Sizing (Full width matching Key Takeaways section!) */}
          <div
            className={cn(
              'pt-2 transition-all w-full',
              fontSize === 'sm' && 'text-sm [&_p]:text-sm [&_p]:leading-relaxed',
              fontSize === 'base' && 'text-base sm:text-lg [&_p]:text-base sm:[&_p]:text-lg [&_p]:leading-relaxed',
              fontSize === 'lg' && 'text-lg sm:text-xl [&_p]:text-lg sm:[&_p]:text-xl [&_p]:leading-relaxed'
            )}
          >
            <Body blocks={article.body} />
          </div>

          {/* In-Content Native Feature Ad Slot (Zero CLS) */}
          <AdSlot slotType="in-content" />

          {/* Article Footer */}
          <footer className="pt-8 border-t border-editorial-border space-y-8">
            {/* Tags / Topics (Clean Poppins pills without '#' symbol) */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-sans font-medium text-editorial-muted ltr:mr-2 rtl:ml-2">
                  {t.topics}:
                </span>
                {article.tags.map((tag) => (
                  <Link key={tag} to={localePath(`/tags/${tag}`)}>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium bg-editorial-surface-subtle border border-editorial-border hover:border-editorial-text text-editorial-text transition-colors">
                      {formatTopicName(tag)}
                    </span>
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

          {/* Author Profile Bio Card */}
          {authorProfile && (
            <section
              data-testid="author-bio"
              aria-label="Author biography"
              className="p-6 sm:p-8 rounded-2xl border border-editorial-border bg-editorial-surface shadow-xs space-y-4 my-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <Link to={localePath(`/authors/${authorProfile.slug}`)} className="shrink-0">
                  <img
                    src={authorProfile.avatar}
                    alt={authorProfile.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-editorial-border hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-accent block">
                        {t.writtenByEditor || 'Written by Contributing Editor'}
                      </span>
                      <Link
                        to={localePath(`/authors/${authorProfile.slug}`)}
                        className="font-display font-bold text-xl text-editorial-text hover:text-accent transition-colors"
                      >
                        {authorProfile.name}
                      </Link>
                    </div>
                    <Link
                      to={localePath(`/authors/${authorProfile.slug}`)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-editorial-border hover:border-editorial-text text-editorial-text font-sans text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                    >
                      <span>{t.moreBy || 'More by'} {authorProfile.name.split(' ')[0]}</span>
                      <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
                    </Link>
                  </div>
                  <p className="text-xs font-sans text-editorial-muted font-medium">
                    {authorProfile.role} • {authorProfile.location}
                  </p>
                  <p className="font-serif text-sm text-editorial-text/90 leading-relaxed pt-1">
                    {authorProfile.bio}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Client-Side Community Comments Powered by Giscus with Edge Caching Proxy */}
          <ArticleComments slug={article.slug} title={article.title} />

          {/* Related Articles Section: Keeps readers engaged with high-contrast monographs */}
          {relatedArticles.length > 0 && (
            <section className="pt-12 mt-12 border-t border-editorial-border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-sans font-semibold uppercase tracking-widest text-editorial-muted block">
                    {t.recommendedReading || 'Recommended Reading'}
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
                    {t.relatedMonographs || 'Related Monographs & Essays'}
                  </h3>
                </div>
                <Link
                  to={localePath('/articles')}
                  className="text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted hover:text-editorial-text underline flex items-center gap-1"
                >
                  <span>{t.allArticles || 'All Articles'}</span>
                  <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => {
                  const { category: relCat } = getArticleCategory(rel);
                  const relUrl = localePath(`/articles/${rel.slug}`);
                  const relDate = formatDate(rel.date, language.code);
                  const relReading = calculateReadingTime(rel, t.minRead);

                  return (
                    <article
                      key={rel.slug}
                      className="group rounded-sm border border-editorial-border bg-editorial-surface hover:border-editorial-text transition-all overflow-hidden flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        {rel.image && (
                          <Link
                            to={relUrl}
                            tabIndex={-1}
                            aria-hidden="true"
                            className="block aspect-[16/10] overflow-hidden bg-neutral-900 relative"
                          >
                            <LazyImage
                              src={rel.image}
                              alt={rel.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                            <div className="absolute top-2.5 start-2.5">
                              <span className="px-2.5 py-0.5 text-[10px] font-sans font-medium bg-black/75 backdrop-blur-xs text-white rounded-full border border-white/15 shadow-xs">
                                {getCategoryShortName(relCat.id, language.code)}
                              </span>
                            </div>
                          </Link>
                        )}

                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-sans font-medium uppercase tracking-wider text-editorial-muted">
                            <span>{relDate}</span>
                            <span>•</span>
                            <span>{relReading}</span>
                          </div>
                          <h4 className="font-display font-bold text-base sm:text-lg text-editorial-text group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                            <Link to={relUrl}>{rel.title}</Link>
                          </h4>
                          <p className="font-serif text-xs text-editorial-muted line-clamp-2 leading-relaxed">
                            {rel.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-editorial-border/50 text-xs font-sans">
                        <Link
                          to={relUrl}
                          className="text-accent hover:underline flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wider"
                        >
                          <span>{t.readArticle || 'Read'}</span>
                          <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
                        </Link>
                        <ArticleViewCount path={`/articles/${rel.slug}`} slug={rel.slug} compact />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* Interactive Text Selection Quote Sharer */}
          <QuoteSelectionPopup author={article.author} articleTitle={article.title} />

          {/* High-Resolution Architectural Image Lightbox Modal */}
          <ImageLightbox
            src={lightboxImg?.src || null}
            alt={lightboxImg?.alt}
            onClose={() => setLightboxImg(null)}
          />
        </article>

        {/* Right-Side Sticky Table of Contents (Desktop Only: xl:block - Completely Hidden on Mobile/Tablet) */}
        {hasToc && (
          <aside
            aria-label="Table of contents"
            className="hidden xl:block w-60 xl:w-64 shrink-0 sticky top-28 self-start pt-2"
          >
            <ArticleToc blocks={article.body} />
          </aside>
        )}
      </div>
    </>
  );
}
