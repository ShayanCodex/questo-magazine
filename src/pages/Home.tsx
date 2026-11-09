import { useLoaderData, Link } from 'react-router-dom';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { siteConfig } from '../lib/site';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory, CATEGORIES, getCategoryShortName, formatTopicName } from '../lib/categories';
import { Seo } from '../components/Seo';
import { Badge } from '../components/ui/badge';
import { ArticleViewCount } from '../components/ArticleViewCount';
import { FeaturedShowcaseSlider } from '../components/FeaturedShowcaseSlider';
import { CinematicScrollVideo } from '../components/CinematicScrollVideo';
import { ManifestoBanner } from '../components/ManifestoBanner';
import { EditorialDisciplines } from '../components/EditorialDisciplines';
import { EditorialFaq } from '../components/EditorialFaq';
import { EditorialDispatch } from '../components/EditorialDispatch';

interface HomeLoaderData {
  articles: ArticleData[];
  pathname: string;
}

export function Home() {
  const loaderData = (useLoaderData() as HomeLoaderData) || {};
  const articles = loaderData.articles || [];
  const pathname = loaderData.pathname || '/';
  const { language, t, localePath } = useLanguage();

  // Primary feature story (featured or first)
  const heroArticle = articles.find((a) => a.featured) || articles[0];
  const secondaryArticles = articles.filter((a) => a.slug !== heroArticle?.slug);

  const heroDate = heroArticle ? formatDate(heroArticle.date, language.code) : '';
  const heroReadingTime = heroArticle ? calculateReadingTime(heroArticle, t.minRead) : '';

  return (
    <div className="space-y-12 sm:space-y-16">
      <Seo
        title={`${siteConfig.name} Magazine — Art & Life`}
        description={siteConfig.description}
        pathname={pathname}
        image={heroArticle?.image}
        type="website"
      />

      {/* 1. Giant Masthead: ART & LIFE (Click to browse Art & Life) */}
      <section className="pt-2">
        <div className="border-y-2 border-editorial-text py-2 sm:py-4">
          <Link
            to={localePath('/articles?category=art-and-culture')}
            className="block group"
            title="Browse Art & Life Collection"
          >
            <h1 className="font-display font-black text-[clamp(3.5rem,14vw,10.5rem)] leading-[0.88] tracking-[-0.05em] text-editorial-text uppercase text-center sm:text-start select-none group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors cursor-pointer">
              Art &amp; Life
            </h1>
          </Link>
        </div>

        {/* 2. High-Contrast News Ticker Strip */}
        <div className="bg-editorial-text text-editorial-bg px-4 py-2 flex items-center gap-4 text-xs font-mono uppercase tracking-wider overflow-hidden">
          <span className="font-bold text-editorial-bg shrink-0">
            {t.newsTicker}
          </span>
          <div className="truncate whitespace-nowrap opacity-90 text-editorial-bg">
            {t.tickerHeadline}
          </div>
        </div>

        {/* 2b. Clean Single-Line Category Quick-Nav (Short Names - Click to Go) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 border-b border-editorial-border text-xs font-sans">
          <span className="text-editorial-muted text-[11px] font-mono uppercase tracking-wider shrink-0 me-1">
            Browse:
          </span>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={localePath(`/articles?category=${cat.id}`)}
              className="px-3 py-1 rounded-sm border border-editorial-border bg-editorial-surface hover:border-editorial-text hover:bg-editorial-surface-hover text-editorial-text font-semibold uppercase tracking-wider text-[11px] transition-all shrink-0 flex items-center gap-1 shadow-2xs"
            >
              <span>{getCategoryShortName(cat.id)}</span>
              <span className="opacity-40 text-[10px]">→</span>
            </Link>
          ))}
          <Link
            to={localePath('/categories')}
            className="px-2.5 py-1 text-editorial-muted hover:text-editorial-text underline ms-auto shrink-0 text-[11px] font-mono uppercase tracking-wider"
          >
            All A–Z →
          </Link>
        </div>
      </section>

      {/* 3. Awwwards Featured Showcase Slider (Latest Blogs & Breaking News) */}
      <FeaturedShowcaseSlider articles={articles} />

      {/* 4. Lead Hero Feature Story */}
      {heroArticle && (
        <section className="space-y-6 pt-4 border-t border-editorial-border">
          {/* Two-Column Lead Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start border-b border-editorial-border pb-8">
            <div className="lg:col-span-6">
              <span className="text-xs font-mono uppercase tracking-widest text-editorial-muted block mb-2 font-medium">
                Monograph of the Month
              </span>
              <h2 className="font-display font-black text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.98] tracking-tight uppercase text-editorial-text">
                <Link
                  to={localePath(`/articles/${heroArticle.slug}`)}
                  className="hover:text-accent transition-colors"
                >
                  {heroArticle.title}
                </Link>
              </h2>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <p className="font-serif text-editorial-muted text-base sm:text-lg leading-relaxed max-w-xl">
                {heroArticle.excerpt}
              </p>

              {/* Editorial Meta Row */}
              <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono uppercase tracking-wider text-editorial-muted">
                <span>
                  <strong className="text-editorial-text font-semibold">{t.textBy}:</strong> {heroArticle.author}
                </span>
                <span>•</span>
                <span>{heroDate}</span>
                <span>•</span>
                <span>{heroReadingTime}</span>
                <span>•</span>
                <ArticleViewCount path={`/articles/${heroArticle.slug}`} slug={heroArticle.slug} compact />
                {heroArticle.tags && heroArticle.tags.length > 0 && (
                  <span className="ltr:ml-auto rtl:mr-auto">
                    <Link to={localePath(`/tags/${heroArticle.tags[0]}`)}>
                      <Badge variant="default" className="text-[11px] uppercase tracking-wider">
                        {heroArticle.tags[0]}
                      </Badge>
                    </Link>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Full-Width Feature Hero Image */}
          {heroArticle.image && (
            <div className="w-full overflow-hidden rounded-sm border border-editorial-border group relative aspect-[16/9] sm:aspect-[21/9] shadow-lg">
              <Link to={localePath(`/articles/${heroArticle.slug}`)} className="block w-full h-full">
                <img
                  src={heroArticle.image}
                  alt={heroArticle.imageAlt || heroArticle.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* 5. Secondary Multi-Column Editorial Section */}
      <section className="pt-6 border-t border-editorial-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Column: Secondary Stories with artwork thumbnails */}
          <div className="lg:col-span-8 divide-y divide-editorial-border">
            {secondaryArticles.slice(0, 4).map((article) => {
              const formattedDate = formatDate(article.date, language.code);
              const readingTime = calculateReadingTime(article, t.minRead);
              const { category } = getArticleCategory(article);

              return (
                <article
                  key={article.slug}
                  className="py-6 sm:py-8 group flex flex-col sm:flex-row gap-6 items-start"
                >
                  {/* Thumbnail Artwork with Badges */}
                  {article.image && (
                    <Link
                      to={localePath(`/articles/${article.slug}`)}
                      className="shrink-0 w-full sm:w-48 h-48 sm:h-36 overflow-hidden rounded-sm border border-editorial-border bg-editorial-surface block relative shadow-xs group/img"
                    >
                      <img
                        src={article.image}
                        alt={article.imageAlt || article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      {/* Floating Category Tag */}
                      <span className="absolute top-2 start-2 z-10 px-2.5 py-0.5 text-[10px] font-sans font-medium bg-black/80 backdrop-blur-md text-white rounded-full border border-white/20 shadow-xs">
                        {getCategoryShortName(category.id)}
                      </span>
                    </Link>
                  )}

                  {/* Article Details */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-editorial-text group-hover:text-accent transition-colors tracking-tight">
                      <Link to={localePath(`/articles/${article.slug}`)}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="font-serif text-editorial-muted text-sm sm:text-base leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-sans text-editorial-muted">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-editorial-surface-subtle border border-editorial-border flex items-center justify-center text-[9px] font-bold text-editorial-text shrink-0">
                          {article.author.charAt(0)}
                        </div>
                        <span className="text-editorial-text font-medium">{article.author}</span>
                      </div>
                      <span>•</span>
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <span>{readingTime}</span>
                      <span>•</span>
                      <ArticleViewCount path={`/articles/${article.slug}`} slug={article.slug} compact />
                      {article.tags && article.tags.length > 0 && (
                        <span className="ltr:ml-auto rtl:mr-auto">
                          <Link to={localePath(`/tags/${article.tags[0]}`)}>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium bg-editorial-surface-subtle border border-editorial-border/70 text-editorial-text/80 hover:text-editorial-text hover:border-editorial-text transition-all">
                              {formatTopicName(article.tags[0])}
                            </span>
                          </Link>
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {/* View All Articles Link */}
            <div className="pt-6">
              <Link
                to={localePath('/articles')}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent hover:underline font-semibold"
              >
                <span>{t.allArticles} ({articles.length})</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Side Column: Print Magazine Issue Box */}
          <aside className="lg:col-span-4 border-t lg:border-t-0 ltr:lg:border-l rtl:lg:border-r border-editorial-border pt-6 lg:pt-0 ltr:lg:pl-8 rtl:lg:pr-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-sans uppercase tracking-widest text-editorial-muted block font-medium">
                {t.printMagazine}
              </span>
              <div className="font-display font-black text-3xl sm:text-4xl text-editorial-text tracking-tight">
                {t.issueNumber}
              </div>
            </div>

            {/* Stylized Magazine Cover Card - Bright High-Contrast Editorial Monograph */}
            <div className="relative rounded-lg border border-editorial-border bg-neutral-950 text-white overflow-hidden p-6 aspect-[4/5] flex flex-col justify-between shadow-lg group">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=85"
                  alt="Questo Magazine Issue 03 Cover Art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <span className="font-sans font-medium text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white shadow-xs">
                  Issue 03
                </span>
                <span className="font-sans font-medium text-xs text-white/90 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-xs">
                  Autumn 2026
                </span>
              </div>

              <div className="relative z-10 space-y-1.5">
                <h4 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tighter leading-none text-white drop-shadow-md">
                  Questo
                </h4>
                <p className="text-xs font-sans text-white/90 uppercase tracking-widest font-medium drop-shadow-sm">
                  Magazin • Art &amp; Life
                </p>
              </div>
            </div>

            {/* Editorial Specifications Document Card (Word/Docs Clean Style) */}
            <div className="bg-editorial-surface border border-editorial-border rounded-lg overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-editorial-surface-subtle border-b border-editorial-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-4 w-4 text-editorial-text" />
                  <span className="font-sans font-semibold text-xs text-editorial-text tracking-wide">
                    {t.printSpecsTitle}
                  </span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-editorial-text/10 text-editorial-text border border-editorial-border/60">
                  Limited Run
                </span>
              </div>

              <div className="divide-y divide-editorial-border/60 text-xs font-sans">
                {[
                  t.printSpecsFormat,
                  t.printSpecsPaper,
                  t.printSpecsBinding,
                  t.printSpecsCopies,
                ].map((raw, i) => {
                  const splitIdx = raw.indexOf(':');
                  const label = splitIdx !== -1 ? raw.slice(0, splitIdx).trim() : '';
                  const value = splitIdx !== -1 ? raw.slice(splitIdx + 1).trim() : raw;
                  return (
                    <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-3">
                      <span className="text-editorial-muted font-medium shrink-0">{label}</span>
                      <span className="text-editorial-text font-semibold text-end truncate">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 text-xs font-sans text-editorial-muted leading-relaxed flex items-start gap-2">
              <span className="text-editorial-text font-medium leading-none">•</span>
              <span>Available globally in selected bookshops and galleries. Hand-printed on 120gsm recycled newsprint paper.</span>
            </div>
          </aside>
        </div>
      </section>

      {/* 6. Signature Awwwards Scroll-Driven Expanding Video Animation */}
      <CinematicScrollVideo />

      {/* 7. Editorial Disciplines & Pillars */}
      <EditorialDisciplines />

      {/* 8. Editorial Manifesto Banner */}
      <ManifestoBanner />

      {/* 9. Editorial FAQ & Inquiries */}
      <EditorialFaq />

      {/* 10. The Weekly Sunday Dispatch with Editorial Background Image */}
      <EditorialDispatch />
    </div>
  );
}
