import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CheckIcon,
  LinkIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import type { EBook } from '../lib/types';
import {
  getVerifiedArchiveIdentifier,
  generateCompleteChapters,
  getSafePdfUrl,
  isLocalCorePdf,
} from '../lib/ebook-reader';
import { cn } from '../lib/utils';

export interface OriginalPdfReaderProps {
  ebook: EBook;
  initialMode?: 'facsimile' | 'unabridged' | 'pdf';
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
  const [activeMode, setActiveMode] = useState<'facsimile' | 'unabridged' | 'pdf'>(initialMode);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copiedLink, setCopiedLink] = useState(false);
  const [viewLayout, setViewLayout] = useState<'single' | 'spread'>('single');
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
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

  const safePdfUrl = useMemo(
    () => getSafePdfUrl(ebook.slug, ebook.pdfUrl),
    [ebook.slug, ebook.pdfUrl]
  );
  const isLocal = useMemo(() => isLocalCorePdf(ebook.slug), [ebook.slug]);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isPdfBlobLoading, setIsPdfBlobLoading] = useState(false);

  // 2-Page Spread page calculation (even left, odd right)
  const spreadLeftPage = useMemo(() => {
    return currentPage % 2 === 0 ? currentPage : Math.max(1, currentPage - 1);
  }, [currentPage]);

  const spreadRightPage = useMemo(() => {
    const candidate = spreadLeftPage + 1;
    return candidate <= totalPages ? candidate : null;
  }, [spreadLeftPage, totalPages]);

  // Fetch verified Fast Vault PDF into an in-memory blob to bypass attachment headers for 0ms inline rendering
  useEffect(() => {
    if (activeMode !== 'pdf' || !isLocal || pdfBlobUrl) return;
    let isSubscribed = true;
    setIsPdfBlobLoading(true);

    fetch(safePdfUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (isSubscribed) {
          const blobUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(blobUrl);
          setIsPdfBlobLoading(false);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          setIsPdfBlobLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [activeMode, isLocal, safePdfUrl, pdfBlobUrl]);

  const chapters = useMemo(() => generateCompleteChapters(ebook), [ebook]);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  // In-memory cache & prefetching registry for 0ms instant page turns
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const preloadingRef = useRef<Set<number>>(new Set());

  // Fast scanned page URL generator: Uses edge-cached 800px web raster scans (4x faster, ~80 KB)
  const getPageUrl = useCallback(
    (pageNumber: number, highRes = false) => {
      const pageIndex = Math.max(0, pageNumber - 1);
      if (highRes) {
        return `https://archive.org/download/${safeIdentifier}/page/n${pageIndex}.jpg`;
      }
      return `https://archive.org/download/${safeIdentifier}/page/n${pageIndex}_w800.jpg`;
    },
    [safeIdentifier]
  );

  // Double-buffering state: The currently displayed page stays visible on screen until the new page is ready
  const [displayedPage, setDisplayedPage] = useState(currentPage);
  const [displayedUrl, setDisplayedUrl] = useState(() => getPageUrl(currentPage));
  const [displayedLeftPage, setDisplayedLeftPage] = useState(spreadLeftPage);
  const [displayedLeftUrl, setDisplayedLeftUrl] = useState(() => getPageUrl(spreadLeftPage));
  const [displayedRightPage, setDisplayedRightPage] = useState<number | null>(spreadRightPage);
  const [displayedRightUrl, setDisplayedRightUrl] = useState<string | null>(() =>
    spreadRightPage ? getPageUrl(spreadRightPage) : null
  );
  const [targetLoading, setTargetLoading] = useState(false);

  // Tactile 3D page curl animation trigger
  const triggerFlipAnimation = useCallback((direction: 'next' | 'prev') => {
    setIsFlipping(true);
    setFlipDirection(direction);
    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 280);
  }, []);

  // Aggressive Ahead-Of-Time (AOT) Predictive Preloader & Double-Buffering Engine
  useEffect(() => {
    if (activeMode !== 'facsimile') return;

    if (viewLayout === 'spread') {
      const leftTargetUrl = getPageUrl(spreadLeftPage, zoomLevel > 125);
      const rightTargetUrl = spreadRightPage ? getPageUrl(spreadRightPage, zoomLevel > 125) : null;

      // Handle left page
      if (loadedPagesRef.current.has(spreadLeftPage)) {
        setDisplayedLeftPage(spreadLeftPage);
        setDisplayedLeftUrl(leftTargetUrl);
      } else {
        const imgL = new Image();
        imgL.src = leftTargetUrl;
        imgL.onload = () => {
          loadedPagesRef.current.add(spreadLeftPage);
          setDisplayedLeftPage(spreadLeftPage);
          setDisplayedLeftUrl(leftTargetUrl);
        };
        imgL.onerror = () => {
          const fallbackUrl = getPageUrl(spreadLeftPage, true);
          const fbImg = new Image();
          fbImg.src = fallbackUrl;
          fbImg.onload = () => {
            loadedPagesRef.current.add(spreadLeftPage);
            setDisplayedLeftPage(spreadLeftPage);
            setDisplayedLeftUrl(fallbackUrl);
          };
        };
      }

      // Handle right page
      if (spreadRightPage) {
        if (loadedPagesRef.current.has(spreadRightPage)) {
          setDisplayedRightPage(spreadRightPage);
          setDisplayedRightUrl(rightTargetUrl);
        } else {
          const imgR = new Image();
          imgR.src = rightTargetUrl!;
          imgR.onload = () => {
            loadedPagesRef.current.add(spreadRightPage);
            setDisplayedRightPage(spreadRightPage);
            setDisplayedRightUrl(rightTargetUrl);
          };
          imgR.onerror = () => {
            const fallbackUrl = getPageUrl(spreadRightPage, true);
            const fbImg = new Image();
            fbImg.src = fallbackUrl;
            fbImg.onload = () => {
              loadedPagesRef.current.add(spreadRightPage);
              setDisplayedRightPage(spreadRightPage);
              setDisplayedRightUrl(fallbackUrl);
            };
          };
        }
      } else {
        setDisplayedRightPage(null);
        setDisplayedRightUrl(null);
      }

      // Prefetch upcoming and previous spreads
      const spreadPagesToPrefetch = [
        spreadLeftPage + 2,
        spreadLeftPage + 3,
        spreadLeftPage + 4,
        spreadLeftPage - 2,
        spreadLeftPage - 1,
      ];
      spreadPagesToPrefetch.forEach((pg) => {
        if (
          pg >= 1 &&
          pg <= totalPages &&
          !loadedPagesRef.current.has(pg) &&
          !preloadingRef.current.has(pg)
        ) {
          preloadingRef.current.add(pg);
          const pImg = new Image();
          pImg.src = getPageUrl(pg);
          pImg.onload = () => {
            loadedPagesRef.current.add(pg);
            preloadingRef.current.delete(pg);
          };
          pImg.onerror = () => preloadingRef.current.delete(pg);
        }
      });
    } else {
      // Single Page mode
      const targetUrl = getPageUrl(currentPage, zoomLevel > 125);

      if (loadedPagesRef.current.has(currentPage)) {
        setDisplayedPage(currentPage);
        setDisplayedUrl(targetUrl);
        setIsPageLoading(false);
        setTargetLoading(false);
        setPageImageError(false);
      } else {
        setIsPageLoading(true);
        setTargetLoading(true);
        setPageImageError(false);

        const img = new Image();
        img.src = targetUrl;
        img.onload = () => {
          loadedPagesRef.current.add(currentPage);
          setDisplayedPage(currentPage);
          setDisplayedUrl(targetUrl);
          setIsPageLoading(false);
          setTargetLoading(false);
        };
        img.onerror = () => {
          const fallbackRawUrl = getPageUrl(currentPage, true);
          const fallbackImg = new Image();
          fallbackImg.src = fallbackRawUrl;
          fallbackImg.onload = () => {
            loadedPagesRef.current.add(currentPage);
            setDisplayedPage(currentPage);
            setDisplayedUrl(fallbackRawUrl);
            setIsPageLoading(false);
            setTargetLoading(false);
          };
          fallbackImg.onerror = () => {
            setIsPageLoading(false);
            setTargetLoading(false);
            setPageImageError(true);
          };
        };
      }

      // Prefetch next 4 pages ahead + 1 page behind
      const pagesToPrefetch = [
        currentPage + 1,
        currentPage + 2,
        currentPage + 3,
        currentPage + 4,
        currentPage - 1,
      ];

      pagesToPrefetch.forEach((pg) => {
        if (
          pg >= 1 &&
          pg <= totalPages &&
          !loadedPagesRef.current.has(pg) &&
          !preloadingRef.current.has(pg)
        ) {
          preloadingRef.current.add(pg);
          const pImg = new Image();
          pImg.src = getPageUrl(pg);
          pImg.onload = () => {
            loadedPagesRef.current.add(pg);
            preloadingRef.current.delete(pg);
          };
          pImg.onerror = () => {
            preloadingRef.current.delete(pg);
          };
        }
      });
    }
  }, [
    currentPage,
    spreadLeftPage,
    spreadRightPage,
    viewLayout,
    safeIdentifier,
    totalPages,
    getPageUrl,
    activeMode,
    zoomLevel,
  ]);

  // Page Turn Actions with 3D Page Flip Animation
  const handlePrevPage = useCallback(() => {
    if (viewLayout === 'spread') {
      if (spreadLeftPage > 1) {
        triggerFlipAnimation('prev');
        setCurrentPage((prev) => Math.max(1, prev - 2));
      }
    } else {
      if (currentPage > 1) {
        triggerFlipAnimation('prev');
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
    }
  }, [viewLayout, spreadLeftPage, currentPage, triggerFlipAnimation]);

  const handleNextPage = useCallback(() => {
    if (viewLayout === 'spread') {
      if (spreadLeftPage + 2 <= totalPages) {
        triggerFlipAnimation('next');
        setCurrentPage((prev) => Math.min(totalPages, prev + 2));
      }
    } else {
      if (currentPage < totalPages) {
        triggerFlipAnimation('next');
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
      }
    }
  }, [viewLayout, spreadLeftPage, totalPages, currentPage, triggerFlipAnimation]);

  // Keyboard navigation for page turns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (activeMode === 'facsimile') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          e.preventDefault();
          handleNextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          handlePrevPage();
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
  }, [activeMode, handleNextPage, handlePrevPage]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(50, prev - 25));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
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
      await navigator.clipboard.writeText(
        safePdfUrl.startsWith('/') ? window.location.origin + safePdfUrl : safePdfUrl
      );
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
                <span>Original Public Domain Edition</span>
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
            <span>Original Facsimile</span>
          </button>
          {isLocal && (
            <button
              type="button"
              onClick={() => setActiveMode('pdf')}
              className={cn(
                'px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5',
                activeMode === 'pdf'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              )}
              title="Read Full High-Speed Vector PDF (Fastly CDN Edge)"
            >
              <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span>Fast CDN PDF</span>
            </button>
          )}
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
            href={safePdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-semibold transition-colors shadow-sm"
            title={isLocal ? 'Download Full Original PDF (Fast CDN)' : 'Download Full Original PDF Document'}
          >
            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isLocal ? 'Download Fast PDF' : 'Download PDF'}</span>
            <span className="sm:hidden">PDF</span>
            {isLocal && (
              <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.2 rounded text-emerald-200">
                Fast
              </span>
            )}
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
                disabled={viewLayout === 'spread' ? spreadLeftPage <= 1 : currentPage <= 1}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer',
                  (viewLayout === 'spread' ? spreadLeftPage <= 1 : currentPage <= 1)
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
                disabled={viewLayout === 'spread' ? spreadLeftPage + 2 > totalPages : currentPage >= totalPages}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer',
                  (viewLayout === 'spread' ? spreadLeftPage + 2 > totalPages : currentPage >= totalPages)
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

              {/* Native 2-Page Spread vs Single Page Focus Toggle */}
              <button
                type="button"
                onClick={() => setViewLayout((prev) => (prev === 'single' ? 'spread' : 'single'))}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors cursor-pointer',
                  viewLayout === 'spread'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                    : 'border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800'
                )}
                title={viewLayout === 'spread' ? 'Switch to Single Page Focus' : 'Switch to 2-Page Book Spread'}
              >
                <Squares2X2Icon className="h-3.5 w-3.5 text-emerald-400" />
                <span>{viewLayout === 'spread' ? 'Single Page' : '2-Page Book Spread'}</span>
              </button>
            </div>
          </>
        ) : activeMode === 'pdf' ? (
          /* Fast CDN PDF Mode Toolbar */
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                <span>Fastly CDN Edge Delivery Active</span>
              </span>
              <span className="text-neutral-400 hidden sm:inline text-xs">
                Direct High-Definition Vector PDF • 0ms Native Browser Rendering
              </span>
            </div>
            <a
              href={safePdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5" />
              <span>Download Fast PDF</span>
            </a>
          </div>
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
        {activeMode === 'pdf' ? (
          /* High-Speed Direct Vector PDF Reader from Questo Vault Release CDN */
          <div className="w-full h-full flex-1 p-2 sm:p-4 bg-neutral-950 flex flex-col select-none">
            <div className="w-full h-full min-h-[680px] sm:min-h-[780px] flex-1 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl relative">
              {isPdfBlobLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-xs text-center p-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent mb-4" />
                  <p className="text-sm font-display font-bold text-white">Streaming Verified Vector PDF from Fastly Edge CDN...</p>
                  <p className="text-xs text-neutral-400 mt-1">Preparing high-definition document for 0ms page navigation</p>
                </div>
              )}
              {pdfBlobUrl ? (
                <object
                  data={`${pdfBlobUrl}#page=${currentPage}&toolbar=1&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full min-h-[680px] sm:min-h-[780px] border-0"
                >
                  <iframe
                    src={`${pdfBlobUrl}#page=${currentPage}`}
                    title={`${ebook.title} Vector PDF`}
                    className="w-full h-full min-h-[680px] sm:min-h-[780px] border-0"
                  />
                </object>
              ) : !isPdfBlobLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-neutral-300">
                  <ShieldCheckIcon className="h-12 w-12 text-emerald-400 mb-3" />
                  <h4 className="font-display font-bold text-lg text-white mb-2">
                    Fast CDN PDF Ready
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">
                    This public domain masterwork is delivered through our high-speed global Fastly edge network. You can download or view it directly in your PDF app.
                  </p>
                  <a
                    href={safePdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs inline-flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Download Fast PDF ({ebook.title})</span>
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ) : activeMode === 'facsimile' ? (
          /* Scanned Document Canvas */
          <div className="w-full h-full flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center relative bg-neutral-950/90 select-none">
            {/* Top Loading Progress Line for Seamless Non-Blocking Page Turns */}
            {isPageLoading && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 animate-pulse z-30" />
            )}

            {viewLayout === 'spread' ? (
              /* Native Questo 2-Page Hardcover Book Spread (Zero external borrow walls or third-party branding) */
              <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none py-2">
                <div className="relative w-full rounded-2xl bg-[#141210] p-3 sm:p-5 border-2 border-[#2b241e] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
                  {/* Subtle Book Spine Bookmark Ribbon */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 sm:w-6 h-7 bg-amber-700/60 rounded-b shadow-md z-30 pointer-events-none" />

                  {/* Two Open Hardcover Book Leaves */}
                  <div className="w-full flex items-stretch justify-center rounded-xl overflow-hidden bg-[#1c1917] border border-neutral-800/80">
                    {/* Left Leaf */}
                    <div
                      className={cn(
                        'w-1/2 min-h-[480px] sm:min-h-[660px] bg-[#161412] flex items-center justify-center p-2 relative transition-all duration-300 origin-right',
                        isFlipping && flipDirection === 'prev' && 'scale-[0.985] -rotate-y-6 shadow-[-16px_10px_30px_rgba(0,0,0,0.8)]'
                      )}
                      style={{
                        perspective: '1400px',
                        transform:
                          isFlipping && flipDirection === 'prev'
                            ? 'rotateY(8deg) scale(0.985)'
                            : 'rotateY(0deg) scale(1)',
                        transition: 'transform 280ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 280ms ease',
                      }}
                    >
                      <img
                        src={displayedLeftUrl}
                        alt={`${ebook.title} - Page ${displayedLeftPage}`}
                        className="max-h-[72vh] w-auto max-w-full object-contain rounded shadow-lg"
                      />
                      <div className="absolute bottom-2 left-4 text-[10px] font-mono text-neutral-500 bg-neutral-900/60 px-2 py-0.5 rounded">
                        Page {displayedLeftPage}
                      </div>
                    </div>

                    {/* Central Spine Gutter & Stitching Depth Shadow */}
                    <div className="relative w-4 sm:w-8 shrink-0 bg-gradient-to-r from-neutral-950 via-black to-neutral-950 flex flex-col items-center justify-between py-4 shadow-inner z-20">
                      <div className="w-px h-full bg-neutral-800/60" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none" />
                    </div>

                    {/* Right Leaf */}
                    <div
                      className={cn(
                        'w-1/2 min-h-[480px] sm:min-h-[660px] bg-[#161412] flex items-center justify-center p-2 relative transition-all duration-300 origin-left',
                        isFlipping && flipDirection === 'next' && 'scale-[0.985] rotate-y-6 shadow-[16px_10px_30px_rgba(0,0,0,0.8)]'
                      )}
                      style={{
                        perspective: '1400px',
                        transform:
                          isFlipping && flipDirection === 'next'
                            ? 'rotateY(-8deg) scale(0.985)'
                            : 'rotateY(0deg) scale(1)',
                        transition: 'transform 280ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 280ms ease',
                      }}
                    >
                      {displayedRightUrl ? (
                        <>
                          <img
                            src={displayedRightUrl}
                            alt={`${ebook.title} - Page ${displayedRightPage}`}
                            className="max-h-[72vh] w-auto max-w-full object-contain rounded shadow-lg"
                          />
                          <div className="absolute bottom-2 right-4 text-[10px] font-mono text-neutral-500 bg-neutral-900/60 px-2 py-0.5 rounded">
                            Page {displayedRightPage}
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-neutral-600 text-xs font-serif italic p-6">
                          Concluded Volume
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Bottom Page Navigator Pill for 2-Page Spread */}
                <div className="mt-4 flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md shadow-xl text-xs font-sans">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={spreadLeftPage <= 1}
                    className="p-1 rounded text-neutral-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Previous 2 Pages"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>

                  <span className="font-mono text-neutral-300">
                    Pages <strong className="text-white">{spreadLeftPage}</strong> -{' '}
                    <strong className="text-white">{spreadRightPage || spreadLeftPage}</strong> of{' '}
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={spreadLeftPage + 2 > totalPages}
                    className="p-1 rounded text-neutral-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Next 2 Pages"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>

                  <div className="h-3 w-px bg-neutral-700 mx-1" />

                  {isLocal && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveMode('pdf')}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer inline-flex items-center gap-1"
                        title="Switch to 0ms Vector PDF Mode (Fast CDN Edge)"
                      >
                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                        <span>Fast CDN PDF</span>
                      </button>
                      <div className="h-3 w-px bg-neutral-700 mx-1" />
                    </>
                  )}

                  <a
                    href={safePdfUrl}
                    download
                    className="text-neutral-300 hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium"
                    title="Download Verified Original PDF"
                  >
                    <ArrowDownTrayIcon className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ) : (
              /* High-Res Original Scanned Page Facsimile with Tactile 3D Flip & Zero Collapse */
              <div
                className="transition-transform duration-200 ease-out origin-top flex flex-col items-center max-w-full"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                {!pageImageError ? (
                  <div
                    className={cn(
                      'relative group rounded-xl overflow-hidden shadow-2xl border border-neutral-800 bg-[#161412] min-h-[560px] sm:min-h-[700px] w-[540px] max-w-full aspect-[2/3] flex items-center justify-center transition-all duration-300 ease-out',
                      isFlipping && flipDirection === 'next' && 'scale-[0.98] -rotate-y-6 shadow-[-20px_10px_40px_rgba(0,0,0,0.8)]',
                      isFlipping && flipDirection === 'prev' && 'scale-[0.98] rotate-y-6 shadow-[20px_10px_40px_rgba(0,0,0,0.8)]'
                    )}
                    style={{
                      perspective: '1200px',
                      transform: isFlipping
                        ? flipDirection === 'next'
                          ? 'perspective(1200px) rotateY(-10deg) scale(0.98)'
                          : 'perspective(1200px) rotateY(10deg) scale(0.98)'
                        : 'perspective(1200px) rotateY(0deg) scale(1)',
                      transition: 'transform 280ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 280ms ease',
                    }}
                  >
                    {/* Non-intrusive Corner Buffering Pill */}
                    {targetLoading && (
                      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950/85 backdrop-blur-md border border-neutral-700/80 text-[11px] font-mono text-emerald-400 shadow-xl pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Buffering p.{currentPage}...</span>
                      </div>
                    )}
                    <img
                      src={displayedUrl}
                      alt={`${ebook.title} - Scanned Page ${displayedPage}`}
                      className="max-h-[82vh] w-auto max-w-full object-contain rounded-lg shadow-xl transition-opacity duration-200"
                    />
                  </div>
                ) : (
                  /* Fallback when remote page image is not yet cached: High-Fidelity Archival Plate (Zero Third-Party Links) */
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
                      <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveMode('unabridged')}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                        >
                          <BookOpenIcon className="h-4 w-4" />
                          <span>Read Complete 12 Chapters (Instant)</span>
                        </button>
                        {isLocal && (
                          <button
                            type="button"
                            onClick={() => setActiveMode('pdf')}
                            className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-sans text-xs font-semibold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                          >
                            <ShieldCheckIcon className="h-4 w-4 text-emerald-400" />
                            <span>Switch to Fast CDN PDF</span>
                          </button>
                        )}
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

                  {isLocal && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveMode('pdf')}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer inline-flex items-center gap-1"
                        title="Switch to 0ms Vector PDF Mode (Fast CDN Edge)"
                      >
                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                        <span>Fast CDN PDF</span>
                      </button>
                      <div className="h-3 w-px bg-neutral-700 mx-1" />
                    </>
                  )}

                  <a
                    href={safePdfUrl}
                    download
                    className="text-neutral-300 hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium"
                    title="Download Verified Original PDF"
                  >
                    <ArrowDownTrayIcon className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Download PDF</span>
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
