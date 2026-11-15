import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
  SparklesIcon,
  AcademicCapIcon,
  BeakerIcon,
  FilmIcon,
} from '@heroicons/react/24/outline';
import type { EBook } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PdfReaderModal } from '../components/PdfReaderModal';
import { LazyImage } from '../components/LazyImage';
import { cn } from '../lib/utils';
import ebooksMasterData from '../data/ebooks.json';
import {
  fetchCulinaryRecipe,
  fetchClinicalDrugInfo,
  fetchAcademicSummary,
  fetchCulturalMedia,
  type CulinaryRecipe,
  type ClinicalDrugInfo,
  type AcademicSummary,
  type CulturalMediaItem,
} from '../services/externalApis';

const EBOOKS_LIST = ebooksMasterData as EBook[];

const CATEGORIES = [
  'All',
  'Philosophy & Ethics',
  'Economics & Commerce',
  'Architecture & Space',
  'Science & Biology',
  'Literature & Arts',
  'History & Strategy',
];

export function EBooks() {
  const { pathname } = useLocation();
  const { t, localePath } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePdfBook, setActivePdfBook] = useState<EBook | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);

  // Live Knowledge Hubs State
  const [hubTab, setHubTab] = useState<'gastronomy' | 'clinical' | 'encyclopedic' | 'cinema'>('gastronomy');
  const [recipes, setRecipes] = useState<CulinaryRecipe[]>([]);
  const [clinicalInfo, setClinicalInfo] = useState<ClinicalDrugInfo | null>(null);
  const [academicSummary, setAcademicSummary] = useState<AcademicSummary | null>(null);
  const [mediaItems, setMediaItems] = useState<CulturalMediaItem[]>([]);

  useEffect(() => {
    fetchCulinaryRecipe('bread').then(setRecipes).catch(() => {});
    fetchClinicalDrugInfo('metformin').then(setClinicalInfo).catch(() => {});
    fetchAcademicSummary('Stoicism').then(setAcademicSummary).catch(() => {});
    fetchCulturalMedia('cyberpunk').then(setMediaItems).catch(() => {});
  }, []);

  const filteredEbooks = useMemo(() => {
    let list = EBOOKS_LIST;

    if (selectedCategory !== 'All') {
      list = list.filter((b) => b.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.subdiscipline.toLowerCase().includes(q) ||
          b.keyThemes.some((th) => th.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  const handleOpenReader = (book: EBook) => {
    setActivePdfBook(book);
    setReaderOpen(true);
  };

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: t.ebooks || 'Public Domain E-Books' },
  ];

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${t.ebooks || 'Public Domain E-Books'} — Questo Open Heritage Library`,
    description: 'Verified public-domain foundation monographs with direct in-browser reading.',
    url: `https://questo-magazine.org${pathname}`,
    hasPart: filteredEbooks.map((b) => ({
      '@type': 'Book',
      name: b.title,
      author: {
        '@type': 'Person',
        name: b.author,
      },
      url: `https://questo-magazine.org${localePath(`/ebooks/${b.slug}`)}`,
      bookFormat: 'https://schema.org/EBook',
      isAccessibleForFree: true,
    })),
  };

  return (
    <>
      <Seo
        title={`${t.ebooks || 'Public Domain E-Books'} — Open Heritage Library`}
        description="Curated digital library of verified public-domain foundation texts in philosophy, architecture, science, economics, and literature with direct PDF reading."
        pathname={pathname}
        customJsonLd={JSON.stringify(collectionJsonLd)}
      />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header & Taxonomy Navigation */}
        <header className="space-y-6">
          <Breadcrumbs items={breadcrumbs} />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-editorial-border">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-widest bg-editorial-surface-subtle border border-editorial-border text-editorial-muted">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                <span>Zero Paywalls • Verified Public Domain • Free Direct PDF</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-editorial-text">
                {t.ebooks || 'Public Domain E-Books'}
              </h1>
              <p className="font-serif text-base sm:text-lg text-editorial-muted leading-relaxed">
                An open repository of foundational intellectual masterworks preserved in the public domain. Read online in our minimalist reader or download original scanned editions with zero telemetry and zero server paywalls.
              </p>
            </div>

            <div className="text-start md:text-end shrink-0">
              <span className="font-display font-bold text-2xl sm:text-3xl text-editorial-text block tabular-nums">
                {filteredEbooks.length} / {EBOOKS_LIST.length}
              </span>
              <span className="text-xs font-sans uppercase tracking-widest text-editorial-muted">
                Monographs Ingested
              </span>
            </div>
          </div>

          {/* Search Bar & Category Filter Carousel */}
          <div className="space-y-4 pt-2">
            {/* Search Input */}
            <div className="relative max-w-xl">
              <MagnifyingGlassIcon className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-editorial-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, original author, Stoicism, or key theme..."
                className="w-full bg-editorial-surface border border-editorial-border rounded-full py-2.5 ps-10 pe-4 text-xs sm:text-sm font-sans text-editorial-text placeholder:text-editorial-muted/70 focus:outline-none focus:border-editorial-text transition-colors shadow-2xs"
              />
            </div>

            {/* Category Pills Slider */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all cursor-pointer border select-none',
                      isSelected
                        ? 'bg-editorial-text text-editorial-bg border-editorial-text shadow-xs'
                        : 'bg-editorial-surface border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text'
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* E-Books Grid */}
        <section className="space-y-6">
          {filteredEbooks.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-editorial-border rounded-lg space-y-3">
              <p className="font-serif text-lg text-editorial-muted">
                No public-domain works match your filter query.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-full border border-editorial-border text-xs font-sans font-medium text-editorial-text hover:bg-editorial-surface cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredEbooks.map((book) => {
                const detailUrl = localePath(`/ebooks/${book.slug}`);

                return (
                  <article
                    key={book.slug}
                    className="group rounded-xl border border-editorial-border bg-editorial-surface hover:border-editorial-text transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md"
                  >
                    <div>
                      {/* Book Cover Frame */}
                      <div className="aspect-[3/4] bg-neutral-900 overflow-hidden relative border-b border-editorial-border group-hover:opacity-95 transition-opacity">
                        <LazyImage
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute top-2.5 start-2.5">
                          <span className="px-2.5 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-wider bg-black/80 backdrop-blur-xs text-white rounded-full border border-white/15">
                            {book.subdiscipline}
                          </span>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-wider text-editorial-muted">
                          <span className="text-editorial-text font-bold truncate">{book.author}</span>
                          <span>•</span>
                          <span>{book.year}</span>
                        </div>

                        <h3 className="font-display font-bold text-lg text-editorial-text group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                          <Link to={detailUrl}>{book.title}</Link>
                        </h3>

                        <p className="font-serif text-xs text-editorial-muted line-clamp-3 leading-relaxed">
                          {book.curatedContext}
                        </p>

                        {/* Key Theme Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {book.keyThemes.slice(0, 2).map((theme) => (
                            <span
                              key={theme}
                              className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-editorial-surface-subtle border border-editorial-border text-editorial-muted"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-5 pt-0 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenReader(book)}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-editorial-text text-editorial-bg text-xs font-sans font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                          title="Read PDF in browser modal"
                        >
                          <BookOpenIcon className="h-3.5 w-3.5" />
                          <span>Read Online</span>
                        </button>

                        <a
                          href={book.pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-editorial-border hover:border-editorial-text text-editorial-text text-xs font-sans font-medium hover:bg-editorial-surface transition-colors"
                          title="Download original PDF"
                        >
                          <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                          <span>PDF ({book.pageCount}p)</span>
                        </a>
                      </div>

                      <div className="text-center pt-1">
                        <Link
                          to={detailUrl}
                          className="text-[11px] font-sans font-medium text-editorial-muted hover:text-editorial-text underline inline-flex items-center gap-1"
                        >
                          <span>Critical Commentary & Historical Context</span>
                          <ArrowRightIcon className="h-2.5 w-2.5 rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Live Academic & Public Knowledge Hubs Section */}
        <section className="pt-12 border-t border-editorial-border space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-widest text-editorial-muted">
              <SparklesIcon className="h-3.5 w-3.5 text-editorial-text" />
              <span>Free Public APIs • Dynamic Edge Telemetry</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
              Real-Time Academic & Cultural Knowledge Hubs
            </h2>
            <p className="font-serif text-sm sm:text-base text-editorial-muted max-w-3xl">
              Live telemetry aggregated from keyless public APIs (TheMealDB, OpenFDA, Wikimedia, and Jikan), pairing verified classical heritage with modern computational research.
            </p>
          </div>

          {/* Hub Tab Switcher */}
          <div className="inline-flex rounded-full border border-editorial-border bg-editorial-surface p-1 shadow-2xs text-xs font-sans">
            <button
              type="button"
              onClick={() => setHubTab('gastronomy')}
              className={cn(
                'px-4 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1.5',
                hubTab === 'gastronomy'
                  ? 'bg-editorial-text text-editorial-bg shadow-xs'
                  : 'text-editorial-muted hover:text-editorial-text'
              )}
            >
              <BeakerIcon className="h-3.5 w-3.5" />
              <span>Gastronomy (TheMealDB)</span>
            </button>
            <button
              type="button"
              onClick={() => setHubTab('clinical')}
              className={cn(
                'px-4 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1.5',
                hubTab === 'clinical'
                  ? 'bg-editorial-text text-editorial-bg shadow-xs'
                  : 'text-editorial-muted hover:text-editorial-text'
              )}
            >
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              <span>Clinical Data (OpenFDA)</span>
            </button>
            <button
              type="button"
              onClick={() => setHubTab('encyclopedic')}
              className={cn(
                'px-4 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1.5',
                hubTab === 'encyclopedic'
                  ? 'bg-editorial-text text-editorial-bg shadow-xs'
                  : 'text-editorial-muted hover:text-editorial-text'
              )}
            >
              <AcademicCapIcon className="h-3.5 w-3.5" />
              <span>Academic Reference (Wikimedia)</span>
            </button>
            <button
              type="button"
              onClick={() => setHubTab('cinema')}
              className={cn(
                'px-4 py-1.5 rounded-full transition-all cursor-pointer font-medium flex items-center gap-1.5',
                hubTab === 'cinema'
                  ? 'bg-editorial-text text-editorial-bg shadow-xs'
                  : 'text-editorial-muted hover:text-editorial-text'
              )}
            >
              <FilmIcon className="h-3.5 w-3.5" />
              <span>Cinema & Media (Jikan)</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="rounded-xl border border-editorial-border bg-editorial-surface p-6 sm:p-8">
            {hubTab === 'gastronomy' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-sans uppercase tracking-widest text-editorial-muted">
                    Living Culinary Biochemistry
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-editorial-text">
                    Fermentation & Heritage Baking Protocols
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recipes.slice(0, 2).map((recipe) => (
                    <div
                      key={recipe.id}
                      className="p-5 rounded-lg border border-editorial-border/60 bg-editorial-surface-subtle space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-sans text-editorial-muted">
                        <span className="font-semibold text-editorial-text">{recipe.category}</span>
                        <span>{recipe.area}</span>
                      </div>
                      <h4 className="font-display font-bold text-lg text-editorial-text">{recipe.name}</h4>
                      <p className="font-serif text-xs text-editorial-muted line-clamp-3 leading-relaxed">
                        {recipe.instructions}
                      </p>
                      <div className="pt-2 border-t border-editorial-border/40">
                        <span className="text-[11px] font-sans font-semibold text-editorial-text block mb-1">
                          Key Ingredients:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {recipe.ingredients.slice(0, 4).map((ing, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-sans bg-editorial-surface px-2 py-0.5 rounded border border-editorial-border text-editorial-muted"
                            >
                              {ing.measure} {ing.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hubTab === 'clinical' && clinicalInfo && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-sans uppercase tracking-widest text-emerald-500 font-semibold">
                    FDA Drug Labeling Reference
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-editorial-text">
                    Pharmacological Monograph: {clinicalInfo.genericName.toUpperCase()}
                  </h3>
                </div>
                <div className="p-4 rounded-lg bg-editorial-surface-subtle border border-editorial-border/60 space-y-3">
                  <div>
                    <strong className="text-xs font-sans font-semibold text-editorial-text block">
                      Mechanism of Action & Clinical Indications:
                    </strong>
                    <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed mt-1">
                      {clinicalInfo.mechanismOfAction || clinicalInfo.indications}
                    </p>
                  </div>
                  <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-sans">
                    {clinicalInfo.disclaimer}
                  </div>
                </div>
              </div>
            )}

            {hubTab === 'encyclopedic' && academicSummary && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-sans uppercase tracking-widest text-editorial-muted">
                    Wikimedia Encyclopedic Corpus
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-editorial-text">
                    Historical Discipline: {academicSummary.title}
                  </h3>
                </div>
                <p className="font-serif text-sm sm:text-base text-editorial-muted leading-relaxed">
                  {academicSummary.extract}
                </p>
                <a
                  href={academicSummary.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-sans font-semibold uppercase tracking-wider text-accent underline inline-flex items-center gap-1"
                >
                  <span>Read full encyclopedic monograph on Wikipedia</span>
                  <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
                </a>
              </div>
            )}

            {hubTab === 'cinema' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-sans uppercase tracking-widest text-editorial-muted">
                    Jikan Open Media Telemetry
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-editorial-text">
                    Existential Cinema & Cybernetic Narrative Works
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mediaItems.slice(0, 2).map((item) => (
                    <div
                      key={item.malId}
                      className="p-5 rounded-lg border border-editorial-border/60 bg-editorial-surface-subtle space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-sans text-editorial-muted">
                        <span className="font-semibold text-editorial-text">{item.genres.join(' • ')}</span>
                        {item.score && <span>★ {item.score} / 10</span>}
                      </div>
                      <h4 className="font-display font-bold text-lg text-editorial-text">{item.title}</h4>
                      <p className="font-serif text-xs text-editorial-muted leading-relaxed">
                        {item.synopsis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Direct In-App PDF Reader Modal */}
      <PdfReaderModal
        ebook={activePdfBook}
        open={readerOpen}
        onOpenChange={setReaderOpen}
      />
    </>
  );
}
