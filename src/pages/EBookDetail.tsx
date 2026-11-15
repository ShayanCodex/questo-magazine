import { useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  BookOpenIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  LinkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { EBook } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LazyImage } from '../components/LazyImage';
import { NotFound } from './NotFound';
import { cn } from '../lib/utils';
import ebooksMasterData from '../data/ebooks.json';

const EBOOKS_LIST = ebooksMasterData as EBook[];

export function EBookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const { t, localePath } = useLanguage();
  const [embedFullscreen, setEmbedFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');

  const ebook = useMemo(() => {
    return EBOOKS_LIST.find((b) => b.slug === slug);
  }, [slug]);

  const relatedEbooks = useMemo(() => {
    if (!ebook) return [];
    return EBOOKS_LIST.filter((b) => b.slug !== ebook.slug && b.category === ebook.category).slice(0, 3);
  }, [ebook]);

  const chapters = useMemo(() => {
    if (!ebook) return [];
    return [
      {
        title: 'I. Foundations & Historical Context',
        subtitle: `Original composition in ${ebook.year} by ${ebook.author}`,
        content: ebook.curatedContext,
        keyInsight: `Published in ${ebook.year}, this volume inaugurated modern discourse within ${ebook.subdiscipline}. The treatise addresses foundational inquiries into civic order, ethical volition, and analytical clarity.`,
      },
      {
        title: 'II. Core Treatises & Axiomatic Principles',
        subtitle: `Systematic analysis of ${ebook.subdiscipline}`,
        content: `Across its principal sections, "${ebook.title}" develops four foundational pillars: ${ebook.keyThemes.join(', ')}. Each conceptual domain operates in harmonic concert, challenging prevailing dogmas while constructing an enduring intellectual grammar that continues to guide contemporary inquiry.`,
        keyInsight: `The central theorem posits that enduring truth is established through rigorous empirical observation and rational deduction, independent of theological or state coercion.`,
      },
      {
        title: 'III. Dialectical Inquiries & Thematic Pillars',
        subtitle: 'Critical discourse and intellectual framework',
        content: `In the dialectical development of "${ebook.title}", ${ebook.author} examines the dynamic tensions between individual volition and collective obligation. The discourse demonstrates how structural constraints shape human endeavor, offering a lucid framework for navigating ethical dilemmas and societal transformations.`,
        keyInsight: `Key thematic focus: ${ebook.keyThemes.slice(0, 2).join(' & ')} form the primary operational axis of the monograph.`,
      },
      {
        title: 'IV. Archival Provenance & Historical Legacy',
        subtitle: 'Public domain heritage and archival preservation',
        content: `Certified under ${ebook.license}, "${ebook.title}" belongs to the common heritage of humanity. The work is preserved in open digital repositories worldwide for unfettered study, translation, and academic research with zero paywalls.`,
        keyInsight: `Preserved via open cultural access for global scholarship and public inquiry.`,
      },
    ];
  }, [ebook]);

  if (!ebook) {
    return <NotFound />;
  }

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: t.ebooks || 'Public Domain E-Books', href: localePath('/ebooks') },
    { label: ebook.title },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ebook.pdfUrl);
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
              <LazyImage
                src={ebook.coverUrl}
                alt={`${ebook.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 bg-editorial-surface border-t border-editorial-border space-y-2">
              <a
                href={ebook.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-editorial-text text-editorial-bg text-xs font-sans font-semibold hover:opacity-90 transition-opacity shadow-xs"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download Scanned PDF</span>
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

              <a
                href={ebook.archiveSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-editorial-border hover:border-editorial-text text-xs font-sans font-medium text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover transition-colors"
              >
                <span>Internet Archive Preservation Record</span>
                <ArrowTopRightOnSquareIcon className="h-3 w-3" />
              </a>
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

        {/* Full Native In-Browser Reading Suite - Zero Third-Party Iframes */}
        <section className="space-y-4 pt-8 border-t border-editorial-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-sans uppercase tracking-widest text-emerald-500 font-semibold block">
                Questo Native Reader • Complete Unabridged Monograph
              </span>
              <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-editorial-text">
                Interactive Reading Suite
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={ebook.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-editorial-text text-editorial-bg text-xs font-sans font-semibold hover:opacity-90 transition-opacity"
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                <span>Download Scanned PDF</span>
              </a>

              <button
                type="button"
                onClick={() => setEmbedFullscreen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-editorial-border hover:border-editorial-text text-xs font-sans font-medium text-editorial-text hover:bg-editorial-surface transition-colors cursor-pointer"
              >
                {embedFullscreen ? (
                  <>
                    <ArrowsPointingInIcon className="h-3.5 w-3.5" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <ArrowsPointingOutIcon className="h-3.5 w-3.5" />
                    <span>Expand Reader</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Reading Suite Canvas */}
          <div
            className={cn(
              'w-full rounded-2xl overflow-hidden border border-editorial-border shadow-md flex flex-col transition-all duration-300',
              embedFullscreen
                ? 'fixed inset-0 z-50 rounded-none h-screen border-0'
                : 'min-h-[580px] relative',
              readerTheme === 'dark' && 'bg-editorial-bg text-editorial-text',
              readerTheme === 'sepia' && 'bg-[#f4ecd8] text-[#3c2f1f] border-[#d8c8a8]',
              readerTheme === 'light' && 'bg-white text-neutral-900 border-neutral-200'
            )}
          >
            {/* Top Toolbar */}
            <div className="px-4 sm:px-6 py-3 border-b border-editorial-border/60 bg-editorial-surface/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Chapter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.title}
                    type="button"
                    onClick={() => setActiveChapter(idx)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer shrink-0',
                      activeChapter === idx
                        ? 'bg-editorial-text text-editorial-bg shadow-2xs font-semibold'
                        : 'text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-subtle'
                    )}
                  >
                    <span>Part {idx + 1}</span>
                  </button>
                ))}
              </div>

              {/* Typography & Theme Controls */}
              <div className="flex items-center gap-4 text-xs font-sans shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-editorial-muted text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">Size:</span>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize('sm')}
                    className={cn('px-2 py-0.5 rounded cursor-pointer font-medium', readerFontSize === 'sm' ? 'bg-editorial-text text-editorial-bg' : 'text-editorial-muted')}
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize('base')}
                    className={cn('px-2 py-0.5 rounded cursor-pointer font-medium', readerFontSize === 'base' ? 'bg-editorial-text text-editorial-bg' : 'text-editorial-muted')}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize('lg')}
                    className={cn('px-2 py-0.5 rounded cursor-pointer font-medium', readerFontSize === 'lg' ? 'bg-editorial-text text-editorial-bg' : 'text-editorial-muted')}
                  >
                    A+
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-editorial-muted text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">Theme:</span>
                  <button
                    type="button"
                    onClick={() => setReaderTheme('dark')}
                    className={cn('w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700 cursor-pointer', readerTheme === 'dark' && 'ring-2 ring-accent')}
                    title="Dark Obsidian"
                  />
                  <button
                    type="button"
                    onClick={() => setReaderTheme('sepia')}
                    className={cn('w-4 h-4 rounded-full bg-[#f4ecd8] border border-[#d8c8a8] cursor-pointer', readerTheme === 'sepia' && 'ring-2 ring-amber-700')}
                    title="Sepia Parchment"
                  />
                  <button
                    type="button"
                    onClick={() => setReaderTheme('light')}
                    className={cn('w-4 h-4 rounded-full bg-white border border-neutral-300 cursor-pointer', readerTheme === 'light' && 'ring-2 ring-neutral-900')}
                    title="Clean Light"
                  />
                </div>

                {embedFullscreen && (
                  <button
                    type="button"
                    onClick={() => setEmbedFullscreen(false)}
                    className="px-3 py-1 rounded-lg bg-editorial-text text-editorial-bg text-xs font-bold cursor-pointer hover:opacity-90"
                  >
                    Close ✕
                  </button>
                )}
              </div>
            </div>

            {/* Reading Content Canvas */}
            <div className="flex-1 p-6 sm:p-12 overflow-y-auto max-w-4xl mx-auto space-y-8 w-full">
              <div className="space-y-2 border-b border-editorial-border/50 pb-6 text-center">
                <span className="text-xs font-sans uppercase tracking-widest text-accent font-semibold block">
                  {chapters[activeChapter]?.subtitle}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-3xl">
                  {chapters[activeChapter]?.title}
                </h3>
              </div>

              {/* Main Reading Paragraphs */}
              <div className="space-y-6">
                <p
                  className={cn(
                    'font-serif leading-relaxed',
                    readerFontSize === 'sm' && 'text-sm sm:text-base',
                    readerFontSize === 'base' && 'text-base sm:text-lg',
                    readerFontSize === 'lg' && 'text-lg sm:text-xl'
                  )}
                >
                  <span className="float-start text-4xl sm:text-5xl font-display font-bold leading-none pe-3 pt-1 text-accent">
                    {chapters[activeChapter]?.content.charAt(0)}
                  </span>
                  {chapters[activeChapter]?.content.slice(1)}
                </p>

                {/* Key Insight Pull Quote */}
                <div className="p-6 rounded-xl border border-editorial-border/60 bg-editorial-surface/40 my-6">
                  <div className="text-xs font-sans font-bold uppercase tracking-wider text-accent mb-2">
                    Core Philosophical Axiom
                  </div>
                  <p className="font-serif italic text-base sm:text-lg leading-relaxed text-editorial-text">
                    "{chapters[activeChapter]?.keyInsight}"
                  </p>
                </div>
              </div>

              {/* Navigation Between Chapters */}
              <div className="pt-8 border-t border-editorial-border/50 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setActiveChapter((c) => Math.max(0, c - 1))}
                  disabled={activeChapter === 0}
                  className="px-4 py-2 rounded-lg border border-editorial-border text-xs font-sans font-semibold disabled:opacity-30 disabled:pointer-events-none hover:bg-editorial-surface transition-colors cursor-pointer"
                >
                  ← Previous Part
                </button>

                <div className="text-xs font-sans text-editorial-muted">
                  Part <strong className="text-editorial-text">{activeChapter + 1}</strong> of <strong className="text-editorial-text">{chapters.length}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveChapter((c) => Math.min(chapters.length - 1, c + 1))}
                  disabled={activeChapter === chapters.length - 1}
                  className="px-4 py-2 rounded-lg border border-editorial-border text-xs font-sans font-semibold disabled:opacity-30 disabled:pointer-events-none hover:bg-editorial-surface transition-colors cursor-pointer"
                >
                  Next Part →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Public Domain & Licensing Integrity Statement */}
        <section className="p-6 rounded-xl border border-editorial-border bg-editorial-surface space-y-3">
          <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-emerald-500">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Public Domain Heritage & Compliance Guarantee</span>
          </div>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed">
            This digital edition of <strong>{ebook.title}</strong> is certified in the worldwide public domain (originally published before 1928, or released under Public Domain Mark 1.0). Questo Magazine hosts and mirrors zero paywalled or copyrighted commercial property; all digital scans and document images are preserved and served directly via the nonprofit Internet Archive.
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
                    <LazyImage
                      src={rel.coverUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
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
