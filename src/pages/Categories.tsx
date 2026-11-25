import { useState, useMemo, useEffect } from 'react';
import { useLoaderData, useSearchParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FolderIcon,
  SparklesIcon,
  ArrowRightIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  Squares2X2Icon,
  BuildingOffice2Icon,
  PaintBrushIcon,
  SwatchIcon,
  CpuChipIcon,
  CommandLineIcon,
  BanknotesIcon,
  BriefcaseIcon,
  QrCodeIcon,
  TrophyIcon,
  HeartIcon,
  BeakerIcon,
  FilmIcon,
  FireIcon,
  CakeIcon,
  GlobeAmericasIcon,
  NewspaperIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { ArticleData, BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { createBreadcrumbJsonLd } from '../lib/breadcrumbs';
import { loadArticleCards } from '../lib/content';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArticleList } from '../components/ArticleList';
import { cn } from '../lib/utils';
import {
  CATEGORIES,
  getArticleCategory,
  getCategoryName,
  getSubcategoryName,
  type Category,
  type Subcategory,
} from '../lib/categories';

interface CategoriesLoaderData {
  articles: ArticleData[];
  pathname: string;
}

function getCategoryIcon(catId: string) {
  switch (catId) {
    case 'architecture-and-space':
      return BuildingOffice2Icon;
    case 'art-and-culture':
      return PaintBrushIcon;
    case 'design-and-typography':
      return SwatchIcon;
    case 'engineering-and-technology':
      return CpuChipIcon;
    case 'technology':
      return CpuChipIcon;
    case 'software':
      return CommandLineIcon;
    case 'finance':
      return BanknotesIcon;
    case 'business':
      return BriefcaseIcon;
    case 'crypto':
      return QrCodeIcon;
    case 'sports':
      return TrophyIcon;
    case 'health':
      return HeartIcon;
    case 'science':
      return BeakerIcon;
    case 'entertainment':
      return FilmIcon;
    case 'lifestyle':
      return SparklesIcon;
    case 'fitness':
      return FireIcon;
    case 'food':
      return CakeIcon;
    case 'travel':
      return GlobeAmericasIcon;
    case 'news':
      return NewspaperIcon;
    default:
      return FolderIcon;
  }
}

export function Categories() {
  const loaderData = useLoaderData() as CategoriesLoaderData | undefined;
  const location = useLocation();
  const navigate = useNavigate();
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  const [clientArticles, setClientArticles] = useState<ArticleData[]>(loaderData?.articles || []);

  useEffect(() => {
    let active = true;
    loadArticleCards(language.code).then((loaded) => {
      if (active && loaded.length > 0) {
        setClientArticles(loaded);
      }
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, [language.code]);

  const articles = clientArticles.length > 0 ? clientArticles : (loaderData?.articles || []);
  const pathname = loaderData?.pathname || location.pathname;

  const [searchParams] = useSearchParams();

  // Backward compatibility: If an old URL has ?category=slug, redirect cleanly to dedicated page
  useEffect(() => {
    const legacyCat = searchParams.get('category');
    if (legacyCat) {
      const sub = searchParams.get('subcategory');
      navigate(localePath(`/categories/${legacyCat}${sub ? `?subcategory=${sub}` : ''}`), { replace: true });
    }
  }, [searchParams, navigate, localePath]);

  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'az' | 'count'>('az');

  // Compute live article counts per category and subcategory
  const counts = useMemo(() => {
    const catMap = new Map<string, number>();
    const subMap = new Map<string, number>();

    articles.forEach((art) => {
      const { category, subcategory } = getArticleCategory(art);
      catMap.set(category.id, (catMap.get(category.id) || 0) + 1);
      if (subcategory) {
        const subKey = `${category.id}:${subcategory.id}`;
        subMap.set(subKey, (subMap.get(subKey) || 0) + 1);
      }
    });

    return { catMap, subMap };
  }, [articles]);

  // Map distinct, relatable cover images to every category and subcategory
  const mediaMaps = useMemo(() => {
    const catImages = new Map<string, string>();
    const subImages = new Map<string, string>();
    const usedUrls = new Set<string>();

    for (const art of articles) {
      if (!art.image) continue;
      const { category, subcategory } = getArticleCategory(art);
      if (!catImages.has(category.id) && !usedUrls.has(art.image)) {
        catImages.set(category.id, art.image);
        usedUrls.add(art.image);
      }
      if (subcategory) {
        const subKey = `${category.id}:${subcategory.id}`;
        if (!subImages.has(subKey) && !usedUrls.has(art.image)) {
          subImages.set(subKey, art.image);
          usedUrls.add(art.image);
        }
      }
    }

    // Fallback pass if any subcategory had no unused image
    for (const art of articles) {
      if (!art.image) continue;
      const { category, subcategory } = getArticleCategory(art);
      if (!catImages.has(category.id)) catImages.set(category.id, art.image);
      if (subcategory) {
        const subKey = `${category.id}:${subcategory.id}`;
        if (!subImages.has(subKey)) subImages.set(subKey, art.image);
      }
    }

    return { catImages, subImages };
  }, [articles]);

  // Total unique subcategories count
  const totalSubcategories = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => acc + cat.subcategories.length, 0);
  }, []);

  // Sorted categories according to A-Z or Article count
  const sortedCategories = useMemo(() => {
    const list = [...CATEGORIES];
    if (sortOrder === 'az') {
      return list.sort((a, b) => {
        const nameA = getCategoryName(a.id, language.code);
        const nameB = getCategoryName(b.id, language.code);
        return nameA.localeCompare(nameB);
      });
    }
    return list.sort((a, b) => {
      const countA = counts.catMap.get(a.id) || 0;
      const countB = counts.catMap.get(b.id) || 0;
      return countB - countA;
    });
  }, [sortOrder, counts.catMap, language.code]);

  // Real-time filtered categories based on instant search bar
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return sortedCategories;
    const q = categorySearchQuery.toLowerCase().trim();
    return sortedCategories.filter((cat) => {
      const name = getCategoryName(cat.id, language.code).toLowerCase();
      const desc = cat.description.toLowerCase();
      const hasSubMatch = cat.subcategories.some((sub) => {
        const subName = getSubcategoryName(sub.id, language.code).toLowerCase();
        return subName.includes(q) || sub.description.toLowerCase().includes(q);
      });
      return name.includes(q) || desc.includes(q) || hasSubMatch;
    });
  }, [sortedCategories, categorySearchQuery, language.code]);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: t.categories || 'Categories' },
  ];

  const searchPlaceholder = useMemo(() => {
    switch (language.code) {
      case 'ur':
        return 'تمام 18 زمرہ جات اور 50+ ذیلی شعبوں میں تلاش کریں (مثلاً سائنس، کھیل، ٹیکنالوجی)...';
      case 'ar':
        return 'ابحث في كافة التصنيفات والنيشات الـ 18 (مثل الرياضة، العلوم، التكنولوجيا)...';
      case 'es':
        return 'Buscar en las 18 categorías y más de 50 nichos (ej. deportes, ciencia, tecnología)...';
      case 'fr':
        return 'Rechercher parmi les 18 catégories et 50+ créneaux (ex. sport, science, technologie)...';
      case 'de':
        return 'In 18 Kategorien und 50+ Nischen suchen (z. B. Sport, Wissenschaft, Technologie)...';
      default:
        return 'Search 18 editorial disciplines and 50+ niches (e.g. Sports, Science, Technology)...';
    }
  }, [language.code]);

  return (
    <div className="space-y-12 sm:space-y-16">
      <Seo
        title={t.categoriesArchiveTitle || 'Categories & Disciplines'}
        description={
          t.categoriesSubtitle ||
          'Comprehensive directory of publishing pillars and specialized subcategories from A to Z.'
        }
        pathname={pathname}
        breadcrumbsJsonLd={createBreadcrumbJsonLd(breadcrumbs)}
        keywords={[
          'Architecture & Space',
          'Art & Culture',
          'Design & Typography',
          'Engineering & Technology',
          'Sports & Athletics',
          'Science & Education',
          'Questo categories',
          'disciplines directory',
        ]}
      />

      {/* Page Header */}
      <header className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-editorial-border pb-8">
          <div className="space-y-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted block">
              {t.allCategoriesAtoZ || 'All Categories (A to Z)'}
            </span>
            <h1 className="font-sans font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-editorial-text leading-tight">
              {t.categoriesArchiveTitle || 'Categories & Disciplines'}
            </h1>
            <p className="font-serif text-base sm:text-lg text-editorial-muted max-w-2xl leading-relaxed">
              {t.categoriesSubtitle ||
                'Explore curated publishing pillars, specialized subcategories, and related monographs from A to Z.'}
            </p>
          </div>

          {/* Meta Stats Badge Capsule */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-editorial-muted font-medium">
            <div className="px-3.5 py-1 rounded-full bg-editorial-surface border border-editorial-border shadow-2xs">
              <span className="font-bold text-editorial-text">{CATEGORIES.length}</span> {t.categories || 'Categories'}
            </div>
            <div className="px-3.5 py-1 rounded-full bg-editorial-surface border border-editorial-border shadow-2xs">
              <span className="font-bold text-editorial-text">{totalSubcategories}</span> {t.subcategories || 'Subcategories'}
            </div>
            <div className="px-3.5 py-1 rounded-full bg-editorial-surface border border-editorial-border shadow-2xs">
              <span className="font-bold text-editorial-text">{articles.length}</span> {t.articles || 'Articles'}
            </div>
          </div>
        </div>
      </header>

      {/* Categories Search & Interactive Toolbar */}
      <div className="space-y-4">
        {/* Instant Category & Niche Search Bar */}
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="h-4.5 w-4.5 text-editorial-muted absolute start-3.5 pointer-events-none" />
          <input
            type="text"
            value={categorySearchQuery}
            onChange={(e) => setCategorySearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setCategorySearchQuery('');
              }
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-editorial-surface border border-editorial-border focus:border-editorial-text focus:ring-1 focus:ring-editorial-text/20 rounded-xl ps-10 pe-10 py-3 font-sans text-sm text-editorial-text placeholder:text-editorial-muted/70 transition-all outline-none shadow-2xs"
            aria-label={t.search}
          />
          {categorySearchQuery && (
            <button
              type="button"
              onClick={() => setCategorySearchQuery('')}
              className="absolute end-3 p-1 text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer"
              aria-label={t.clearSearch || 'Clear search'}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Toolbar: Category Count Feedback & Sorting Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="h-5 w-5 text-editorial-text" />
            <h2 className="font-sans font-bold text-lg sm:text-xl tracking-tight text-editorial-text">
              {t.categories || 'Editorial Disciplines'}
            </h2>
            <span className="text-xs font-sans text-editorial-muted font-medium">
              ({filteredCategories.length} of {CATEGORIES.length})
            </span>
          </div>

          {/* Sort Controls (A-Z vs Most Articles) */}
          <div className="flex items-center gap-2 text-xs font-sans">
            <span className="text-editorial-muted font-medium">{t.sortBy}:</span>
            <div className="inline-flex rounded-full border border-editorial-border bg-editorial-surface overflow-hidden p-0.5">
              <button
                type="button"
                onClick={() => setSortOrder('az')}
                className={cn(
                  'px-3.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 font-medium',
                  sortOrder === 'az'
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                <BarsArrowDownIcon className="h-3.5 w-3.5" />
                <span>{t.alphabetical || 'A–Z Alphabetical'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSortOrder('count')}
                className={cn(
                  'px-3.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 font-medium',
                  sortOrder === 'count'
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                <BarsArrowUpIcon className="h-3.5 w-3.5" />
                <span>{t.byArticleCount || 'By Article Count'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: All Categories Cards Grid (Opens dedicated category page on click) */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-editorial-border rounded-2xl bg-editorial-surface/40 space-y-4 animate-fade-in">
          <MagnifyingGlassIcon className="h-10 w-10 text-editorial-muted mx-auto stroke-1" />
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-lg text-editorial-text">
              {language.code === 'ur'
                ? 'کوئی زمرہ نہیں ملا'
                : language.code === 'ar'
                ? 'لم يتم العثور على تصنيفات'
                : 'No categories found'}
            </h3>
            <p className="font-serif text-sm text-editorial-muted max-w-md mx-auto leading-relaxed">
              {language.code === 'ur'
                ? `"${categorySearchQuery}" سے مطابقت رکھنے والا کوئی زمرہ یا ذیلی شعبہ نہیں ملا۔`
                : language.code === 'ar'
                ? `لم يتم العثور على تصنيف يطابق "${categorySearchQuery}".`
                : `No editorial categories or niches match "${categorySearchQuery}". Try a different keyword.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCategorySearchQuery('')}
            className="px-5 py-2 rounded-full border border-editorial-border hover:border-editorial-text bg-editorial-surface text-editorial-text font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs hover:shadow-xs"
          >
            {t.resetFilters || 'Reset Search'}
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((cat: Category) => {
            const articleCount = counts.catMap.get(cat.id) || 0;
            const CategoryIcon = getCategoryIcon(cat.id);
            const categoryHref = localePath(`/categories/${cat.id}`);
            const catImage = mediaMaps.catImages.get(cat.id);

            return (
              <Link
                key={cat.id}
                to={categoryHref}
                className="group relative p-5 sm:p-6 rounded-2xl border border-editorial-border bg-editorial-surface hover:border-editorial-text/70 transition-all duration-300 flex flex-col justify-between gap-5 text-start shadow-xs hover:shadow-md hover:-translate-y-0.5 block focus:outline-none focus:ring-2 focus:ring-editorial-text/20"
              >
                <div className="space-y-4">
                  {/* Relatable Category Cover Image */}
                  {catImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-editorial-border/60 bg-editorial-surface-subtle">
                      <img
                        src={catImage}
                        alt={getCategoryName(cat.id, language.code)}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <div className="absolute top-3 start-3 w-9 h-9 rounded-lg flex items-center justify-center bg-editorial-bg/90 text-editorial-text border border-editorial-border/70 backdrop-blur-xs shadow-xs">
                        <CategoryIcon className="h-4.5 w-4.5" />
                      </div>
                      <span className="absolute bottom-3 end-3 text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-xs">
                        {articleCount} {t.articles || 'articles'}
                      </span>
                    </div>
                  )}

                  {/* Top Action Row */}
                  <div className="flex items-center justify-between gap-3">
                    {!catImage && (
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-2xs shrink-0 bg-editorial-surface-subtle text-editorial-text border border-editorial-border group-hover:border-editorial-text group-hover:bg-editorial-text group-hover:text-editorial-bg">
                        <CategoryIcon className="h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 ms-auto">
                      {!catImage && (
                        <span className="text-xs font-sans text-editorial-muted font-medium px-3 py-1 rounded-full bg-editorial-surface-subtle border border-editorial-border/80 shadow-2xs">
                          {articleCount} {t.articles || 'articles'}
                        </span>
                      )}
                      <span className="text-xs font-sans font-semibold px-3.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1 shadow-2xs border border-editorial-border text-editorial-muted group-hover:border-editorial-text group-hover:text-editorial-text group-hover:bg-editorial-surface-hover">
                        <span>{t.explore || 'Explore'}</span>
                        <ArrowRightIcon
                          className={cn(
                            'h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5',
                            isRtl ? 'rotate-180 group-hover:-translate-x-0.5' : ''
                          )}
                        />
                      </span>
                    </div>
                  </div>

                  {/* Category Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-sans font-bold text-2xl sm:text-[1.65rem] tracking-tight text-editorial-text group-hover:text-accent transition-colors leading-tight">
                      {getCategoryName(cat.id, language.code)}
                    </h3>
                    <p className="font-serif text-editorial-muted text-sm sm:text-base leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  {/* Subcategories quick badges (Clicking a subcategory opens that niche directly) */}
                  <div className="pt-1">
                    <span className="text-xs font-sans text-editorial-muted/80 block mb-2 font-medium">
                      {t.subcategories || 'Subcategories'}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub: Subcategory) => {
                        return (
                          <span
                            key={sub.id}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(localePath(`/categories/${cat.id}?subcategory=${sub.id}`));
                            }}
                            className="text-xs font-sans font-medium px-3.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs bg-editorial-surface-subtle border border-editorial-border/80 hover:border-editorial-text text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover"
                            title={`Filter by ${getSubcategoryName(sub.id, language.code)}`}
                          >
                            {getSubcategoryName(sub.id, language.code)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action row at bottom of card */}
                <div className="pt-4 border-t border-editorial-border/60 flex items-center justify-between text-xs font-sans font-medium">
                  <span className="text-editorial-muted group-hover:text-editorial-text transition-colors">
                    {language.code === 'ur'
                      ? 'اس زمرے کے تمام مضامین اور ذیلی شعبے دیکھیں'
                      : language.code === 'ar'
                      ? 'عرض كافة مقالات وتصنيفات هذا التخصص'
                      : language.code === 'es'
                      ? 'Ver todas las monografías y nichos'
                      : language.code === 'fr'
                      ? 'Voir toutes les monographies et créneaux'
                      : language.code === 'de'
                      ? 'Alle Monographien und Nischen ansehen'
                      : 'View all category monographs & niches'}
                  </span>
                  <ArrowRightIcon
                    className={cn(
                      'h-4 w-4 transition-transform duration-200 text-editorial-muted group-hover:text-editorial-text group-hover:translate-x-1',
                      isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''
                    )}
                  />
                </div>
              </Link>
            );
          })}
        </section>
      )}

      {/* Section 1B: Clickable Subcategory Cards Grid with Relatable Images */}
      {filteredCategories.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-editorial-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-editorial-text">
                {t.subcategories || 'Subcategory Niches'}
              </h2>
              <p className="font-serif text-sm text-editorial-muted mt-1">
                {totalSubcategories} specialized subtopics across {CATEGORIES.length} disciplines. Click any card to open filtered monographs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.flatMap((cat) =>
              cat.subcategories.map((sub) => {
                const subKey = `${cat.id}:${sub.id}`;
                const subCount = counts.subMap.get(subKey) || 0;
                const subImg = mediaMaps.subImages.get(subKey) || mediaMaps.catImages.get(cat.id);
                return (
                  <Link
                    key={subKey}
                    to={localePath(`/categories/${cat.id}?subcategory=${sub.id}`)}
                    className="group rounded-xl border border-editorial-border bg-editorial-surface hover:border-editorial-text/70 overflow-hidden transition-all duration-200 shadow-2xs hover:shadow-sm flex flex-col"
                  >
                    {subImg && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-editorial-surface-subtle">
                        <img
                          src={subImg}
                          alt={getSubcategoryName(sub.id, language.code)}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className="absolute bottom-2.5 start-3 text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/65 text-white">
                          {getCategoryName(cat.id, language.code)}
                        </span>
                      </div>
                    )}
                    <div className="p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-sans font-bold text-sm text-editorial-text group-hover:text-accent transition-colors truncate">
                          {getSubcategoryName(sub.id, language.code)}
                        </h3>
                        <p className="font-sans text-xs text-editorial-muted mt-0.5">
                          {subCount} {t.articles || 'articles'}
                        </p>
                      </div>
                      <ArrowRightIcon
                        className={cn(
                          'h-4 w-4 text-editorial-muted group-hover:text-editorial-text shrink-0 transition-transform group-hover:translate-x-0.5',
                          isRtl ? 'rotate-180 group-hover:-translate-x-0.5' : ''
                        )}
                      />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Section 2: Recent Monographs Across All Disciplines */}
      <section className="space-y-6 pt-8 border-t border-editorial-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-editorial-text flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-editorial-text" />
              <span>{t.allArticles || 'Recent Editorial Monographs'}</span>
            </h3>
            <p className="font-sans text-xs text-editorial-muted font-medium mt-1">
              {articles.length} {t.articlesFound || 'monographs published across disciplines'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={localePath('/articles')}
              className="text-xs font-sans uppercase tracking-wider text-accent hover:underline flex items-center gap-1.5 font-semibold group"
            >
              <span>
                {language.code === 'ur'
                  ? 'مکمل آرکائیو میں دیکھیں'
                  : language.code === 'ar'
                  ? 'عرض في الأرشيف الكامل'
                  : language.code === 'es'
                  ? 'Ver en Archivo Completo'
                  : language.code === 'fr'
                  ? 'Voir dans l’Archive Complète'
                  : language.code === 'de'
                  ? 'Im vollständigen Archiv ansehen'
                  : 'View in Full Archive'}
              </span>
              <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Article Cards */}
        <ArticleList
          articles={articles.slice(0, 10)}
          emptyMessage={t.noArticlesFound}
        />
      </section>
    </div>
  );
}
