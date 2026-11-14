import { useMemo } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { siteConfig } from '../lib/site';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory, CATEGORIES, getCategoryShortName, formatTopicName } from '../lib/categories';
import { Seo } from '../components/Seo';
import { ArticleViewCount } from '../components/ArticleViewCount';
import { FeaturedShowcaseSlider } from '../components/FeaturedShowcaseSlider';
import { MonographOfTheMonth } from '../components/MonographOfTheMonth';
import { EditorialSpotlight } from '../components/EditorialSpotlight';
import { LatestArticlesFeed } from '../components/LatestArticlesFeed';
import { EditorialMastheadStrip } from '../components/EditorialMastheadStrip';
import { ManifestoBanner } from '../components/ManifestoBanner';
import { EditorialDisciplines } from '../components/EditorialDisciplines';
import { EditorialFaq } from '../components/EditorialFaq';
import { EditorialDispatch } from '../components/EditorialDispatch';
import { EditorialMarquee } from '../components/EditorialMarquee';
import { LazyImage } from '../components/LazyImage';

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

  // Live article counts by category
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    articles.forEach((art) => {
      const { category } = getArticleCategory(art);
      map.set(category.id, (map.get(category.id) || 0) + 1);
    });
    return map;
  }, [articles]);

  return (
    <div className="space-y-12 sm:space-y-16">
      <Seo
        title={`${siteConfig.name} Magazine — Art & Life`}
        description={siteConfig.description}
        pathname={pathname}
        image={heroArticle?.image}
        type="website"
        keywords={[
          'Questo Magazine',
          'Art & Life',
          'editorial architecture',
          'minimalist design systems',
          'swiss typography',
          'monographs',
          'visual culture',
          'digital craftsmanship',
          'systems architecture',
          'print magazine',
        ]}
      />

      {/* 1. Coordinated Hero Showcase Suite (Masthead + Marquee + Slider + Thin Browse Bar) */}
      <div className="space-y-3 sm:space-y-3.5">
        {/* Top Editorial Metadata Ledger Line */}
        <div className="flex items-center justify-between py-1.5 border-b border-editorial-border text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-wider text-editorial-muted">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-editorial-text font-semibold">Issue 03 / 2026</span>
            <span className="hidden sm:inline opacity-30">•</span>
            <span className="hidden sm:inline">Autumn Print Monograph</span>
          </div>
          <div className="hidden lg:block text-editorial-muted/80 tracking-widest text-[10px]">
            International Journal of Architecture, Art &amp; Functional Design
          </div>
          <div className="flex items-center gap-2">
            <span className="text-editorial-text font-semibold">Global Edition</span>
            <span className="opacity-30">•</span>
            <span>Est. 2024</span>
          </div>
        </div>

        {/* Single-Line Proportional QUESTO Masthead Row */}
        <div className="border-b-2 border-editorial-text py-2 sm:py-2.5 flex items-baseline justify-between gap-4">
          <Link
            to={localePath('/articles?category=art-and-culture')}
            className="block group"
            title="Questo Magazine — Art & Life"
          >
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.25rem] leading-none tracking-tight text-editorial-text uppercase select-none group-hover:text-accent transition-colors">
              Questo
            </h1>
          </Link>

          <div className="text-end flex items-center gap-2 text-xs sm:text-sm font-sans text-editorial-muted font-medium">
            <span className="font-bold text-editorial-text">Art &amp; Life</span>
            <span>•</span>
            <span>Vol. 03</span>
          </div>
        </div>

        {/* 2. Refined Theme-Integrated Infinite Marquee */}
        <EditorialMarquee articles={articles} />

        {/* 3. Awwwards Featured Showcase Slider */}
        <FeaturedShowcaseSlider articles={articles} />

        {/* 3b. Simple, Clean & Thin Browse Disciplines Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-b border-editorial-border text-xs font-sans">
          <div className="flex items-center gap-1.5 text-editorial-text font-bold text-xs shrink-0 me-1">
            <span className="w-1.5 h-1.5 rounded-full bg-editorial-text" />
            <span>Browse:</span>
          </div>
          {CATEGORIES.map((cat) => {
            const count = categoryCounts.get(cat.id) || 0;
            return (
              <Link
                key={cat.id}
                to={localePath(`/articles?category=${cat.id}`)}
                className="px-3.5 py-1 rounded-full border border-editorial-border bg-editorial-surface hover:border-editorial-text hover:bg-editorial-text hover:text-editorial-bg text-editorial-text font-medium text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-2xs group/pill"
              >
                <span>{getCategoryShortName(cat.id)}</span>
                {count > 0 && (
                  <span className="text-[10px] opacity-60 group-hover/pill:opacity-90 font-sans font-medium">
                    ({count})
                  </span>
                )}
                <ArrowRightIcon className="h-2.5 w-2.5 rtl:rotate-180 opacity-50 group-hover/pill:translate-x-0.5 rtl:group-hover/pill:-translate-x-0.5 transition-transform" />
              </Link>
            );
          })}
          <Link
            to={localePath('/categories')}
            className="px-3.5 py-1 rounded-full text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover border border-editorial-border hover:border-editorial-text ms-auto shrink-0 text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap group"
          >
            <span>All Categories (A–Z)</span>
            <ArrowRightIcon className="h-3 w-3 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* 4. Monograph of the Month Editorial Feature */}
      {heroArticle && <MonographOfTheMonth article={heroArticle} />}

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
                      className="shrink-0 w-full sm:w-48 h-48 sm:h-36 overflow-hidden rounded-lg border border-editorial-border bg-editorial-surface block relative shadow-xs group/img"
                    >
                      <LazyImage
                        src={article.image}
                        alt={article.imageAlt || article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
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
                className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-accent hover:underline font-semibold group"
              >
                <span>{t.allArticles} ({articles.length})</span>
                <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
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

            {/* Stylized Magazine Cover Card - Clickable Hyperlink & Compact on Mobile */}
            <Link
              to={localePath('/articles?category=art-and-culture')}
              className="relative rounded-xl border border-editorial-border bg-neutral-950 text-white overflow-hidden p-5 sm:p-6 aspect-[16/10] sm:aspect-[4/5] flex flex-col justify-between shadow-lg group hover:border-editorial-text transition-all block cursor-pointer"
              title="Explore Questo Magazine Issue 03"
            >
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
                <span className="font-sans font-medium text-xs text-white/90 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-xs flex items-center gap-1 group-hover:bg-white group-hover:text-neutral-950 transition-all">
                  <span>Autumn 2026</span>
                  <ArrowRightIcon className="h-3 w-3 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
              </div>

              <div className="relative z-10 space-y-1 sm:space-y-1.5">
                <h4 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter leading-none text-white drop-shadow-md group-hover:text-white/95 transition-colors">
                  Questo
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-sans text-white/90 uppercase tracking-widest font-medium drop-shadow-sm">
                    Magazin • Art &amp; Life
                  </p>
                  <span className="text-[11px] font-sans font-semibold text-white/80 group-hover:text-white group-hover:underline flex items-center gap-1">
                    <span>Read Issue</span>
                    <ArrowRightIcon className="h-3 w-3 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Editorial Specifications Document Card (Word/Docs Clean Style) */}
            <div className="bg-editorial-surface border border-editorial-border rounded-xl overflow-hidden shadow-xs space-y-0">
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
                    <div key={i} className="px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3">
                      <span className="text-editorial-muted font-medium shrink-0">{label}</span>
                      <span className="text-editorial-text font-semibold text-end truncate">{value}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-editorial-surface-subtle/50 border-t border-editorial-border/60">
                <Link
                  to={localePath('/articles?category=art-and-culture')}
                  className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-full bg-editorial-surface hover:bg-editorial-text hover:text-editorial-bg text-editorial-text border border-editorial-border font-sans text-xs font-semibold transition-all shadow-xs text-center group"
                >
                  <span>Explore Art &amp; Life Articles</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="pt-2 text-xs font-sans text-editorial-muted leading-relaxed flex items-start gap-2">
              <span className="text-editorial-text font-medium leading-none">•</span>
              <span>Available globally in selected bookshops and galleries. Hand-printed on 120gsm recycled newsprint paper.</span>
            </div>
          </aside>
        </div>
      </section>

      {/* 6. Latest Chronological Articles & Dispatches */}
      <LatestArticlesFeed articles={articles} limit={4} />

      {/* 7. Curated Architectural Monograph Spotlight */}
      <EditorialSpotlight />

      {/* 8. Editorial Disciplines & Pillars */}
      <EditorialDisciplines />

      {/* 9. Contributing Critics & Typographers Masthead Strip */}
      <EditorialMastheadStrip />

      {/* 10. Editorial Manifesto Banner */}
      <ManifestoBanner />

      {/* 11. Editorial FAQ & Inquiries */}
      <EditorialFaq />

      {/* 12. The Weekly Sunday Dispatch with Editorial Background Image */}
      <EditorialDispatch />
    </div>
  );
}
