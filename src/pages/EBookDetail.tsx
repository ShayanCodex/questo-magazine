import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  BookOpenIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  LinkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { EBook } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookCover } from '../components/BookCover';
import { NotFound } from './NotFound';
import { OriginalPdfReader } from '../components/OriginalPdfReader';
import { AdSlot } from '../components/ads/AdSlot';
import { getSafePdfUrl, isLocalCorePdf } from '../lib/ebook-reader';
import { cn } from '../lib/utils';
import { loadJsonAsset } from '../lib/content';

export function EBookDetail() {
  const [ebooksList, setEbooksList] = useState<EBook[]>([]);
  const [ebooksLoaded, setEbooksLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    loadJsonAsset<EBook[]>('ebooks.json').then((list) => {
      if (active) {
        setEbooksList(list);
        setEbooksLoaded(true);
      }
    }).catch(() => {
      if (active) setEbooksLoaded(true);
    });
    return () => { active = false; };
  }, []);
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const { t, localePath } = useLanguage();
  const [embedFullscreen, setEmbedFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const ebook = useMemo(() => {
    if (!slug) return undefined;
    return (
      ebooksList.find((b) => b.slug === slug) ||
      ebooksList.find((b) => b.slug === `${slug}-plato`) ||
      ebooksList.find((b) => b.slug.startsWith(`${slug}-`)) ||
      ebooksList.find((b) => b.identifier === slug)
    );
  }, [slug, ebooksList]);

  const relatedEbooks = useMemo(() => {
    if (!ebook) return [];
    // Normalize current title and slug to prevent recommending alternate editions of the same work
    const currentBaseTitle = ebook.title.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
    const currentBaseSlug = ebook.slug.replace(/-edition-\d+$/, '').replace(/-london-.*$/, '').trim();
    const currentAuthorKey = (ebook.author || '').toLowerCase().trim();

    const seenTitles = new Set<string>([currentBaseTitle]);
    const seenAuthors = new Set<string>([currentAuthorKey]);
    const results: EBook[] = [];

    // Filter candidate books in the same category
    const candidates = ebooksList.filter((b) => {
      if (b.slug === ebook.slug) return false;
      if (b.category !== ebook.category) return false;
      const bBaseSlug = b.slug.replace(/-edition-\d+$/, '').replace(/-london-.*$/, '').trim();
      if (bBaseSlug === currentBaseSlug) return false;
      const bBaseTitle = b.title.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
      if (bBaseTitle === currentBaseTitle) return false;
      return true;
    });

    // Pass 1: Select distinct authors and distinct titles
    for (const b of candidates) {
      const bBaseTitle = b.title.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
      const authorKey = (b.author || '').toLowerCase().trim();
      if (!seenTitles.has(bBaseTitle) && !seenAuthors.has(authorKey)) {
        seenTitles.add(bBaseTitle);
        seenAuthors.add(authorKey);
        results.push(b);
        if (results.length >= 3) break;
      }
    }

    // Pass 2: If we still need more to reach 3, fill with remaining distinct titles
    if (results.length < 3) {
      for (const b of candidates) {
        const bBaseTitle = b.title.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
        if (!seenTitles.has(bBaseTitle)) {
          seenTitles.add(bBaseTitle);
          results.push(b);
          if (results.length >= 3) break;
        }
      }
    }

    return results;
  }, [ebook, ebooksList]);

  if (!ebooksLoaded && !ebook) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-sm font-sans text-editorial-muted">
        Loading monograph...
      </div>
    );
  }

  if (!ebook) {
    return <NotFound />;
  }

  const safePdf = getSafePdfUrl(ebook.slug, ebook.pdfUrl);
  const isLocal = isLocalCorePdf(ebook.slug);

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: t.ebooks || 'Public Domain E-Books', href: localePath('/ebooks') },
    { label: ebook.title },
  ];

  const handleCopyLink = async () => {
    try {
      const urlToCopy = safePdf.startsWith('/') ? window.location.origin + safePdf : safePdf;
      await navigator.clipboard.writeText(urlToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  // AdSense-compliant JSON-LD Book Schema
  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: ebook.title,
    author: {
      '@type': 'Person',
      name: ebook.author,
      description: ebook.authorBio,
    },
    datePublished: ebook.year,
    numberOfPages: ebook.pageCount,
    bookFormat: 'https://schema.org/EBook',
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'Questo Open Heritage Digital Library',
      url: 'https://questo-magazine.org',
    },
    license: 'https://creativecommons.org/publicdomain/mark/1.0/',
    description: ebook.curatedContext,
    isAccessibleForFree: true,
    url: `https://questo-magazine.org${pathname}`,
  };

  return (
    <>
      <Seo
        title={`${ebook.title} by ${ebook.author} — Free Public Domain PDF`}
        description={ebook.curatedContext}
        pathname={pathname}
        image={ebook.coverUrl}
        type="book"
        bookMeta={{
          author: ebook.author,
          year: ebook.year,
          numberOfPages: ebook.pageCount,
          category: ebook.category,
          subdiscipline: ebook.subdiscipline,
          pdfUrl: safePdf,
        }}
        breadcrumbs={breadcrumbs.map((b) => ({ name: b.label, url: b.href || pathname }))}
        customJsonLd={JSON.stringify(bookJsonLd)}
      />

      <article className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
        {/* Navigation & Header */}
        <header className="space-y-6">
          <Breadcrumbs items={breadcrumbs} />

          {/* Discipline Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider">
            <span className="text-editorial-text font-bold">{ebook.category}</span>
            <span className="text-editorial-muted">/</span>
            <span className="text-editorial-muted">{ebook.subdiscipline}</span>
            <span className="text-editorial-muted">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold lowercase">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              <span>public domain</span>
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-editorial-text leading-[1.1]">
            {ebook.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted pt-2 border-b border-editorial-border pb-4">
            <span className="flex items-center gap-1">
              <UserIcon className="h-3.5 w-3.5 text-editorial-text" />
              <strong className="text-editorial-text font-semibold">{ebook.author}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{ebook.year}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpenIcon className="h-3.5 w-3.5" />
              <span>{ebook.pageCount} Pages</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>~{ebook.readingTimeHours}h Reading Time</span>
            </span>
          </div>
        </header>

        {/* Hero Presentation Split (Cover + Executive Summary) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Book Cover Container */}
          <div className="md:col-span-4 rounded-xl overflow-hidden border border-editorial-border bg-neutral-950 shadow-md">
            <div className="aspect-[3/4] relative">
              <BookCover
                coverUrl={ebook.coverUrl}
                title={ebook.title}
                author={ebook.author}
                year={ebook.year}
                category={ebook.category}
                subdiscipline={ebook.subdiscipline}
                slug={ebook.slug}
                size="lg"
                priority
                className="w-full h-full"
              />
            </div>
            <div className="p-4 bg-editorial-surface border-t border-editorial-border space-y-2">
              <a
                href={safePdf}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-semibold transition-colors shadow-xs"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>{isLocal ? 'Download Fast PDF (Verified)' : 'Download Scanned PDF'}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-sans font-medium transition-colors cursor-pointer',
                  copiedLink
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover'
                )}
              >
                {copiedLink ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Direct PDF URL Copied!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3.5 w-3.5" />
                    <span>Copy Direct PDF Link</span>
                  </>
                )}
              </button>

              <div className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs font-sans font-medium text-emerald-400">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                <span>Certified Public Domain Edition</span>
              </div>
            </div>
          </div>

          {/* Critical Context & Key Themes */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-3">
              <h2 className="font-display font-bold text-xl uppercase tracking-tight text-editorial-text">
                Historical Context & Structural Significance
              </h2>
              <p className="font-serif text-base sm:text-lg text-editorial-muted leading-relaxed">
                {ebook.curatedContext}
              </p>
            </div>

            {/* Key Themes List */}
            <div className="space-y-3 pt-3 border-t border-editorial-border">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-editorial-text">
                Central Philosophical & Conceptual Themes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ebook.keyThemes.map((theme, i) => (
                  <div
                    key={theme}
                    className="p-3 rounded-lg bg-editorial-surface border border-editorial-border flex items-start gap-2.5"
                  >
                    <span className="font-display font-bold text-xs text-editorial-muted tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="font-sans text-xs font-medium text-editorial-text">{theme}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Profile */}
            <div className="p-5 rounded-xl border border-editorial-border bg-editorial-surface-subtle space-y-2">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-editorial-text flex items-center gap-1.5">
                <UserIcon className="h-4 w-4 text-editorial-text" />
                <span>About the Original Author: {ebook.author}</span>
              </h3>
              <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed">
                {ebook.authorBio}
              </p>
            </div>
          </div>
        </div>

        {/* Full Interactive PDF & Complete Unabridged Reader Suite */}
        <section className="space-y-4 pt-8 border-t border-editorial-border">
          <OriginalPdfReader
            ebook={ebook}
            isFullscreen={embedFullscreen}
            onToggleFullscreen={() => setEmbedFullscreen((prev) => !prev)}
          />
        </section>

        {/* AdSense In-Content Placement (Zero-CLS) */}
        <AdSlot slotType="in-content" />

        {/* Public Domain & Licensing Integrity Statement */}
        <section className="p-6 rounded-xl border border-editorial-border bg-editorial-surface space-y-3">
          <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-emerald-500">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Public Domain Heritage & Compliance Guarantee</span>
          </div>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed">
            This digital edition of <strong>{ebook.title}</strong> is certified in the worldwide public domain (originally published before 1928, or released under Public Domain Mark 1.0). Questo Magazine hosts and mirrors zero paywalled or copyrighted commercial property; all digital editions are preserved and delivered directly via the Questo Digital Heritage Vault on our high-speed global CDN.
          </p>
        </section>

        {/* Related Public Domain Monographs */}
        {relatedEbooks.length > 0 && (
          <section className="pt-10 border-t border-editorial-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-editorial-text">
                More in {ebook.category}
              </h3>
              <Link
                to={localePath('/ebooks')}
                className="text-xs font-sans font-semibold uppercase tracking-wider text-accent underline"
              >
                View All E-Books →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedEbooks.map((rel) => (
                <Link
                  key={rel.slug}
                  to={localePath(`/ebooks/${rel.slug}`)}
                  className="group block p-4 rounded-xl border border-editorial-border bg-editorial-surface hover:border-editorial-text transition-all shadow-2xs"
                >
                  <div className="aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden mb-3">
                    <BookCover
                      coverUrl={rel.coverUrl}
                      title={rel.title}
                      author={rel.author}
                      year={rel.year}
                      category={rel.category}
                      subdiscipline={rel.subdiscipline}
                      slug={rel.slug}
                      size="md"
                      className="w-full h-full group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-editorial-muted block">
                    {rel.author} • {rel.year}
                  </span>
                  <h4 className="font-display font-bold text-base text-editorial-text group-hover:text-accent transition-colors mt-1 line-clamp-1">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
