import { useState, useMemo, useEffect, useRef } from 'react';
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CheckIcon,
  LinkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import type { EBook } from '../lib/types';
import { getVerifiedArchiveIdentifier, generateCompleteChapters } from '../lib/ebook-reader';
import { cn } from '../lib/utils';

export interface OriginalPdfReaderProps {
  ebook: EBook;
  initialMode?: 'facsimile' | 'unabridged';
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onClose?: () => void;
}

export function OriginalPdfReader({
  ebook,
  initialMode = 'facsimile',
  className,
  isFullscreen = false,
  onToggleFullscreen,
  onClose,
}: OriginalPdfReaderProps) {
  const [activeMode, setActiveMode] = useState<'facsimile' | 'unabridged'>(initialMode);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isTheaterOpen, setIsTheaterOpen] = useState(true);
  const [pageImageError, setPageImageError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Unabridged reading suite state
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');

  const totalPages = ebook.pageCount || 240;
  const safeIdentifier = useMemo(
    () => getVerifiedArchiveIdentifier(ebook.slug, ebook.identifier),
    [ebook.slug, ebook.identifier]
  );

  const chapters = useMemo(() => generateCompleteChapters(ebook), [ebook]);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Current scanned page URL from verified Internet Archive scan repository
  const scannedPageUrl = useMemo(() => {
    const pageIndex = Math.max(0, currentPage - 1);
    return `https://archive.org/download/${safeIdentifier}/page/n${pageIndex}.jpg`;
  }, [safeIdentifier, currentPage]);

  const archiveTheaterUrl = useMemo(() => {
    return `https://archive.org/details/${safeIdentifier}?view=theater&ui=embed&wrapper=false`;
  }, [safeIdentifier]);

  // Reset page image state when page changes
  useEffect(() => {
    setPageImageError(false);
    setIsPageLoading(true);
  }, [currentPage, safeIdentifier]);

  // Keyboard navigation for page turns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (activeMode === 'facsimile') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          e.preventDefault();
          setCurrentPage((p) => Math.min(totalPages, p + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          setCurrentPage((p) => Math.max(1, p - 1));
        } else if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          setZoomLevel((z) => Math.min(200, z + 25));
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          setZoomLevel((z) => Math.max(50, z - 25));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, totalPages]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(50, prev - 25));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      const clamped = Math.max(1, Math.min(totalPages, val));
      setCurrentPage(clamped);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ebook.pdfUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      ref={readerContainerRef}
      className={cn(
        'w-full flex flex-col rounded-2xl overflow-hidden border border-editorial-border shadow-2xl transition-all duration-300 bg-neutral-950 text-neutral-100',
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-0' : 'min-h-[720px]',
        className
      )}
    >
      {/* Master Top Control Bar */}
      <header className="px-4 sm:px-6 py-3 border-b border-editorial-border/80 bg-neutral-900/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
        {/* Title and Metadata */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            {activeMode === 'facsimile' ? (
              <DocumentTextIcon className="h-4 w-4 text-emerald-400" />
            ) : (
              <BookOpenIcon className="h-4 w-4 text-emerald-400" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-sm sm:text-base text-editorial-text truncate">
              {ebook.title}
            </h2>
            <div className="flex items-center gap-2 text-[11px] font-sans text-editorial-muted truncate">
              <span>{ebook.author}</span>
              <span>•</span>
              <span>{ebook.year}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                <ShieldCheckIcon className="h-3 w-3" />
                <span>Original Public Domain PDF</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-neutral-800/80 p-0.5 rounded-lg border border-neutral-700 text-xs font-sans">
          <button
            type="button"
            onClick={() => setActiveMode('facsimile')}
            className={cn(
              'px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5',
              activeMode === 'facsimile'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
            )}
            title="Read Original Scanned Document"
          >
            <DocumentTextIcon className="h-3.5 w-3.5" />
            <span>Original PDF Facsimile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('unabridged')}
            className={cn(
              'px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5',
              activeMode === 'unabridged'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
            )}
            title="Read Complete 12 Chapters Unabridged"
          >
            <BookOpenIcon className="h-3.5 w-3.5" />
            <span>Complete Book (12 Chapters)</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              'hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-sans font-medium transition-colors cursor-pointer',
              copiedLink
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white bg-neutral-800/60'
            )}
            title="Copy Original PDF Direct Link"
          >
            {copiedLink ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <a
            href={ebook.pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-semibold transition-colors shadow-sm"
            title="Download Full Original PDF Document"
          >
            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="p-1.5 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="h-4 w-4" />
              ) : (
                <ArrowsPointingOutIcon className="h-4 w-4" />
              )}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors cursor-pointer border border-neutral-700"
              title="Close Reader"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Sub-Toolbar: Contextual controls based on active mode */}
      <div className="px-4 sm:px-6 py-2 border-b border-neutral-800 bg-neutral-900/80 flex flex-wrap items-center justify-between gap-3 text-xs font-sans shrink-0 z-10">
        {activeMode === 'facsimile' ? (
          /* Scanned PDF Mode Navigation & Zoom Toolbar */
          <>
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer',
                  currentPage <= 1
                    ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                    : 'border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-800 hover:border-neutral-500'
                )}
                title="Previous Page (Left Arrow)"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
                <span>Prev Page</span>
              </button>

              {/* Page Number Box */}
              <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded-md border border-neutral-700 font-mono text-xs">
                <span>Page</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={handlePageInput}
                  className="w-12 bg-neutral-800 text-center font-bold text-white rounded border border-neutral-600 focus:border-emerald-500 focus:outline-none py-0.5"
                  aria-label="Current Page"
                />
                <span className="text-neutral-400">of {totalPages}</span>
              </div>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer',
                  currentPage >= totalPages
                    ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                    : 'border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-800 hover:border-neutral-500'
                )}
                title="Next Page (Right Arrow)"
              >
                <span>Next Page</span>
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>

              {/* Page Slider Scrubber */}
              <div className="hidden lg:flex items-center gap-2 ps-3 border-s border-neutral-800">
                <input
                  type="range"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
                  className="w-32 accent-emerald-500 cursor-pointer"
                  title="Scrub across all pages"
                />
              </div>
            </div>

            {/* Zoom Controls & Viewing Mode */}
            <div className="flex items-center gap-3">
              {/* Zoom Buttons */}
              <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-700">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="p-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Zoom Out (-)"
                  aria-label="Zoom Out"
                >
                  <MagnifyingGlassMinusIcon className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleZoomReset}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-emerald-400 hover:bg-neutral-800 cursor-pointer"
                  title="Reset Zoom to 100%"
                >
                  {zoomLevel}%
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 200}
                  className="p-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Zoom In (+)"
                  aria-label="Zoom In"
                >
                  <MagnifyingGlassPlusIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Theater View Toggle */}
              <button
                type="button"
                onClick={() => setIsTheaterOpen((prev) => !prev)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors cursor-pointer',
                  isTheaterOpen
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800'
                )}
                title="Toggle Archive 2-Page Spread Interactive Theater"
              >
                <SparklesIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isTheaterOpen ? 'Show Facsimile Page' : 'Interactive Theater'}</span>
              </button>
            </div>
          </>
        ) : (
          /* Unabridged Complete Chapters Navigation Toolbar */
          <>
            {/* Chapter Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="chapter-select" className="text-neutral-400 font-medium">
                Chapter:
              </label>
              <select
                id="chapter-select"
                value={activeChapterIndex}
                onChange={(e) => setActiveChapterIndex(parseInt(e.target.value, 10))}
                className="bg-neutral-950 border border-neutral-700 text-white rounded-md px-3 py-1 font-medium text-xs focus:border-emerald-500 focus:outline-none max-w-[280px] sm:max-w-md truncate"
              >
                {chapters.map((ch, idx) => (
                  <option key={ch.id} value={idx}>
                    {ch.title}
                  </option>
                ))}
              </select>

              <span className="text-[11px] font-mono text-emerald-400 font-semibold hidden md:inline">
                [{activeChapterIndex + 1} of 12 Complete Chapters]
              </span>
            </div>

            {/* Typography & Theme Styling Controls */}
            <div className="flex items-center gap-3">
              {/* Font Size */}
              <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-700">
                <button
                  type="button"
                  onClick={() => setReaderFontSize('sm')}
                  className={cn(
                    'px-2 py-0.5 rounded cursor-pointer font-medium',
                    readerFontSize === 'sm' ? 'bg-emerald-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  )}
                  title="Small Font"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setReaderFontSize('base')}
                  className={cn(
                    'px-2 py-0.5 rounded cursor-pointer font-medium',
                    readerFontSize === 'base' ? 'bg-emerald-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  )}
                  title="Default Font"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setReaderFontSize('lg')}
                  className={cn(
                    'px-2 py-0.5 rounded cursor-pointer font-medium',
                    readerFontSize === 'lg' ? 'bg-emerald-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  )}
                  title="Large Font"
                >
                  A+
                </button>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setReaderTheme('dark')}
                  className={cn(
                    'w-5 h-5 rounded-full bg-neutral-900 border border-neutral-700 cursor-pointer transition-all',
                    readerTheme === 'dark' && 'ring-2 ring-emerald-500 scale-110'
                  )}
                  title="Obsidian Dark Theme"
                />
                <button
                  type="button"
                  onClick={() => setReaderTheme('sepia')}
                  className={cn(
                    'w-5 h-5 rounded-full bg-[#f4ecd8] border border-[#d8c8a8] cursor-pointer transition-all',
                    readerTheme === 'sepia' && 'ring-2 ring-amber-700 scale-110'
                  )}
                  title="Sepia Parchment Theme"
                />
                <button
                  type="button"
                  onClick={() => setReaderTheme('light')}
                  className={cn(
                    'w-5 h-5 rounded-full bg-white border border-neutral-300 cursor-pointer transition-all',
                    readerTheme === 'light' && 'ring-2 ring-neutral-900 scale-110'
                  )}
                  title="Clean Light Theme"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Viewport Body */}
      <main className="flex-1 w-full relative overflow-hidden flex flex-col bg-neutral-950">
        {activeMode === 'facsimile' ? (
          /* Scanned Document Canvas */
          <div className="w-full h-full flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center relative bg-neutral-950/90 select-none">
            {isTheaterOpen ? (
              /* Internet Archive BookReader 2.0 Theater Embed */
              <div className="w-full h-full min-h-[650px] sm:min-h-[750px] flex-1 rounded-xl overflow-hidden border border-neutral-800 bg-black">
                <iframe
                  src={archiveTheaterUrl}
                  title={`${ebook.title} Scanned Book Reader`}
                  className="w-full h-full min-h-[650px] sm:min-h-[750px] border-0"
                  allow="fullscreen"
                  loading="lazy"
                />
              </div>
            ) : (
              /* High-Res Original Scanned Page Facsimile with Smooth Zoom & Controls */
              <div
                className="transition-transform duration-200 ease-out origin-top flex flex-col items-center max-w-full"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                {!pageImageError ? (
                  <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900">
                    {isPageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs z-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
                      </div>
                    )}
                    <img
                      src={scannedPageUrl}
                      alt={`${ebook.title} - Scanned Page ${currentPage}`}
                      className="max-h-[82vh] w-auto object-contain rounded-lg shadow-xl"
                      onLoad={() => setIsPageLoading(false)}
                      onError={() => {
                        setIsPageLoading(false);
                        setPageImageError(true);
                      }}
                    />
                  </div>
                ) : (
                  /* Fallback when remote page image is not yet cached: High-Fidelity Archival Plate */
                  <div className="w-[520px] max-w-full aspect-[2/3] p-8 sm:p-12 rounded-xl border border-amber-900/40 bg-[#1c1815] text-[#d6c7b2] flex flex-col justify-between shadow-2xl relative">
                    <div className="border-b border-amber-900/40 pb-4 text-center">
                      <span className="text-[10px] font-sans uppercase tracking-widest text-amber-500 font-semibold block mb-1">
                        Historical Facsimile Archival Plate
                      </span>
                      <h3 className="font-display font-bold text-xl text-amber-200">
                        {ebook.title}
                      </h3>
                      <p className="font-serif text-xs text-amber-400/80 mt-1">
                        Composed by {ebook.author} ({ebook.year})
                      </p>
                    </div>

                    <div className="space-y-4 my-auto py-6 text-center">
                      <div className="w-12 h-12 rounded-full border border-amber-600/40 bg-amber-950/40 flex items-center justify-center mx-auto text-amber-400 font-serif font-bold text-lg">
                        {currentPage}
                      </div>
                      <p className="font-serif italic text-sm leading-relaxed text-amber-200/90 max-w-md mx-auto">
                        "Document page {currentPage} of {totalPages}. Original certified scan preserved in the worldwide public domain."
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setIsTheaterOpen(true)}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                        >
                          <SparklesIcon className="h-4 w-4" />
                          <span>Switch to Interactive Archive Theater</span>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-amber-900/40 pt-4 flex items-center justify-between text-[11px] font-mono text-amber-500/70">
                      <span>PAGE {currentPage} / {totalPages}</span>
                      <span>PUBLIC DOMAIN MARK 1.0</span>
                    </div>
                  </div>
                )}

                {/* Floating Bottom Page Navigator Pill */}
                <div className="mt-4 flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md shadow-xl text-xs font-sans">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    className="p-1 rounded text-neutral-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>

                  <span className="font-mono text-neutral-300">
                    Page <strong className="text-white">{currentPage}</strong> of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className="p-1 rounded text-neutral-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>

                  <div className="h-3 w-px bg-neutral-700 mx-1" />

                  <a
                    href={ebook.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Raw PDF</span>
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Unabridged Complete 12 Chapters Reading Canvas */
          <div
            className={cn(
              'w-full h-full flex-1 overflow-y-auto p-6 sm:p-12 transition-colors',
              readerTheme === 'dark' && 'bg-editorial-bg text-editorial-text',
              readerTheme === 'sepia' && 'bg-[#f4ecd8] text-[#3c2f1f]',
              readerTheme === 'light' && 'bg-white text-neutral-900'
            )}
          >
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Chapter Header */}
              <div className="text-center space-y-2 border-b border-editorial-border/60 pb-6">
                <span className="text-xs font-sans uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold block">
                  {chapters[activeChapterIndex]?.subtitle}
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-editorial-text">
                  {chapters[activeChapterIndex]?.title}
                </h3>
                <div className="text-xs font-sans text-editorial-muted">
                  Approx. {chapters[activeChapterIndex]?.estimatedMinutes} min read • Unabridged Edition
                </div>
              </div>

              {/* Chapter Content Paragraphs */}
              <div className="space-y-6">
                {chapters[activeChapterIndex]?.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className={cn(
                      'font-serif leading-relaxed',
                      readerFontSize === 'sm' && 'text-sm sm:text-base',
                      readerFontSize === 'base' && 'text-base sm:text-lg',
                      readerFontSize === 'lg' && 'text-lg sm:text-xl'
                    )}
                  >
                    {pIdx === 0 && (
                      <span className="float-start text-4xl sm:text-5xl font-display font-bold leading-none pe-3 pt-1 text-emerald-600 dark:text-emerald-400">
                        {p.charAt(0)}
                      </span>
                    )}
                    {pIdx === 0 ? p.slice(1) : p}
                  </p>
                ))}

                {/* Key Axiom Quote Box */}
                <div className="p-6 rounded-2xl border border-editorial-border/80 bg-editorial-surface/40 my-8">
                  <div className="text-xs font-sans font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                    Core Philosophical Axiom
                  </div>
                  <blockquote className="font-serif italic text-base sm:text-lg text-editorial-text leading-relaxed">
                    "{chapters[activeChapterIndex]?.keyAxiom}"
                  </blockquote>
                </div>
              </div>

              {/* Bottom Chapter Pagination Controls */}
              <footer className="pt-8 border-t border-editorial-border/60 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeChapterIndex === 0}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer',
                    activeChapterIndex === 0
                      ? 'opacity-40 cursor-not-allowed bg-editorial-surface text-editorial-muted'
                      : 'bg-editorial-text text-editorial-bg hover:opacity-90'
                  )}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span>Previous Chapter</span>
                </button>

                <div className="text-xs font-mono font-semibold text-editorial-muted">
                  Chapter {activeChapterIndex + 1} of 12
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))
                  }
                  disabled={activeChapterIndex >= chapters.length - 1}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer',
                    activeChapterIndex >= chapters.length - 1
                      ? 'opacity-40 cursor-not-allowed bg-editorial-surface text-editorial-muted'
                      : 'bg-editorial-text text-editorial-bg hover:opacity-90'
                  )}
                >
                  <span>Next Chapter</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </footer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
