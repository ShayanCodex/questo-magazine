import { useLoaderData, Link } from 'react-router-dom';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { siteConfig } from '../lib/site';
import { formatDate, calculateReadingTime } from '../lib/content';
import { getArticleCategory } from '../lib/categories';
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
  const { articles, pathname } = useLoaderData() as HomeLoaderData;
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

      {/* 1. Giant Masthead: ART & LIFE */}
      <section className="pt-2">
        <div className="border-y-2 border-editorial-text py-2 sm:py-4">
          <h1 className="font-display font-black text-[clamp(3.5rem,14vw,10.5rem)] leading-[0.88] tracking-[-0.05em] text-editorial-text uppercase text-center sm:text-start select-none">
            Art &amp; Life
          </h1>
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
                      <span className="absolute top-2 start-2 z-10 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-black/75 backdrop-blur-xs text-white rounded-xs border border-white/10 shadow-xs">
                        {category.name}
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

                    <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono uppercase tracking-wider text-editorial-muted">
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
                            <Badge variant="default" className="text-[10px] uppercase">
                              #{article.tags[0]}
                            </Badge>
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
              <span className="text-xs font-mono uppercase tracking-widest text-editorial-muted block">
                {t.printMagazine}
              </span>
              <div className="font-display font-black text-3xl sm:text-4xl text-editorial-text tracking-tight">
                {t.issueNumber}
              </div>
            </div>

            {/* Stylized Magazine Cover Card */}
            <div className="relative rounded-sm border border-editorial-border bg-neutral-950 text-white overflow-hidden p-6 aspect-[4/5] flex flex-col justify-between shadow-lg group">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85"
                  alt="Questo Magazine Issue 03 Cover Art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/30 pointer-events-none" />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <span className="font-mono text-xs uppercase tracking-widest bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xs border border-white/10 text-white">
                  Issue 03
                </span>
                <span className="font-mono text-xs uppercase text-white/90 tracking-wider bg-black/40 px-2 py-0.5 rounded-xs backdrop-blur-xs">
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

            {/* Technical Specifications Table */}
            <div className="p-4 bg-editorial-surface border border-editorial-border rounded-sm space-y-2 text-xs font-mono">
              <div className="text-editorial-text font-bold uppercase tracking-wider mb-2">
                {t.printSpecsTitle}
              </div>
              <div className="text-editorial-muted">{t.printSpecsFormat}</div>
              <div className="text-editorial-muted">{t.printSpecsPaper}</div>
              <div className="text-editorial-muted">{t.printSpecsBinding}</div>
              <div className="text-editorial-text font-semibold">{t.printSpecsCopies}</div>
            </div>

            <div className="pt-2 text-xs font-serif text-editorial-muted leading-relaxed">
              Available globally in selected bookshops and galleries. Hand-printed on 120gsm recycled newsprint paper.
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
