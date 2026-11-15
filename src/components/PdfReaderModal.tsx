import { useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  LinkIcon,
  CheckIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import type { EBook } from '../lib/types';
import { cn } from '../lib/utils';

export interface PdfReaderModalProps {
  ebook: EBook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PdfReaderModal({ ebook, open, onOpenChange }: PdfReaderModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readerMode, setReaderMode] = useState<'text' | 'document'>('text');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>('dark');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    setReaderMode('text');
  }, [ebook?.slug]);

  if (!ebook) return null;

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(ebook.pdfUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Google Docs viewer acts as a reliable CDN proxy avoiding Archive.org 503 CORS errors
  const proxyViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(ebook.pdfUrl)}&embedded=true`;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md transition-opacity duration-200" />
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 bg-editorial-surface border border-editorial-border shadow-2xl flex flex-col text-editorial-text transition-all duration-300 focus:outline-none overflow-hidden',
            isFullscreen
              ? 'inset-0 w-screen h-screen rounded-none'
              : 'start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-5xl h-[92vh] rounded-xl'
          )}
        >
          {/* Reader Top Command Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-editorial-border bg-editorial-bg/95 backdrop-blur-xs shrink-0 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-editorial-surface-subtle border border-editorial-border flex items-center justify-center shrink-0">
                <BookOpenIcon className="h-4 w-4 text-editorial-text" />
              </div>
              <div className="min-w-0">
                <DialogPrimitive.Title className="font-display font-bold text-sm sm:text-base text-editorial-text truncate">
                  {ebook.title}
                </DialogPrimitive.Title>
                <div className="flex items-center gap-2 text-[11px] font-sans text-editorial-muted truncate">
                  <span>{ebook.author}</span>
                  <span>•</span>
                  <span>{ebook.year}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-500 font-medium">
                    <ShieldCheckIcon className="h-3 w-3" />
                    <span>Public Domain</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="hidden sm:flex items-center bg-editorial-surface-subtle p-0.5 rounded-lg border border-editorial-border text-xs font-sans">
              <button
                type="button"
                onClick={() => setReaderMode('text')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                  readerMode === 'text'
                    ? 'bg-editorial-text text-editorial-bg shadow-2xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                <BookOpenIcon className="h-3.5 w-3.5" />
                <span>Questo Reader Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setReaderMode('document')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                  readerMode === 'document'
                    ? 'bg-editorial-text text-editorial-bg shadow-2xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                <DocumentTextIcon className="h-3.5 w-3.5" />
                <span>PDF Document</span>
              </button>
            </div>

            {/* Actions Suite */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Copy Direct URL */}
              <button
                type="button"
                onClick={handleCopyUrl}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-sans font-medium transition-colors cursor-pointer',
                  copied
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface'
                )}
                title="Copy Direct PDF Link"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Copy Link</span>
                  </>
                )}
              </button>

              {/* Download PDF */}
              <a
                href={ebook.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-editorial-border hover:border-editorial-text text-xs font-sans font-medium text-editorial-text hover:bg-editorial-surface transition-colors"
                title="Download original PDF"
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg border border-editorial-border text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="h-4 w-4" />
                ) : (
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                )}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-1.5 rounded-lg border border-editorial-border text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface transition-colors cursor-pointer"
                title="Close reader"
                aria-label="Close"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Reader Body */}
          <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
            {readerMode === 'text' ? (
              /* Native Questo In-Browser Reader */
              <div
                className={cn(
                  'w-full h-full overflow-y-auto flex flex-col transition-colors',
                  theme === 'dark' && 'bg-editorial-bg text-editorial-text',
                  theme === 'sepia' && 'bg-[#f4ecd8] text-[#3c2f1f]',
                  theme === 'light' && 'bg-white text-neutral-900'
                )}
              >
                {/* Reader Formatting Controls Sub-bar */}
                <div className="sticky top-0 z-10 px-6 py-2 border-b border-editorial-border/60 bg-editorial-surface/80 backdrop-blur-xs flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-editorial-muted uppercase tracking-wider text-[10px] font-semibold">
                      Typography:
                    </span>
                    <button
                      type="button"
                      onClick={() => setFontSize('sm')}
                      className={cn('px-2 py-0.5 rounded cursor-pointer', fontSize === 'sm' ? 'bg-editorial-text text-editorial-bg font-bold' : 'hover:bg-editorial-surface-subtle text-editorial-muted')}
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('base')}
                      className={cn('px-2 py-0.5 rounded cursor-pointer', fontSize === 'base' ? 'bg-editorial-text text-editorial-bg font-bold' : 'hover:bg-editorial-surface-subtle text-editorial-muted')}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('lg')}
                      className={cn('px-2 py-0.5 rounded cursor-pointer', fontSize === 'lg' ? 'bg-editorial-text text-editorial-bg font-bold' : 'hover:bg-editorial-surface-subtle text-editorial-muted')}
                    >
                      A+
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-editorial-muted uppercase tracking-wider text-[10px] font-semibold">
                      Palette:
                    </span>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={cn('w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700 cursor-pointer', theme === 'dark' && 'ring-2 ring-accent')}
                      title="Obsidian Dark"
                    />
                    <button
                      type="button"
                      onClick={() => setTheme('sepia')}
                      className={cn('w-4 h-4 rounded-full bg-[#f4ecd8] border border-[#d8c8a8] cursor-pointer', theme === 'sepia' && 'ring-2 ring-amber-700')}
                      title="Sepia Parchment"
                    />
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={cn('w-4 h-4 rounded-full bg-white border border-neutral-300 cursor-pointer', theme === 'light' && 'ring-2 ring-neutral-900')}
                      title="Clean Light"
                    />
                  </div>
                </div>

                {/* Reader Content Body */}
                <div className="max-w-3xl mx-auto px-6 sm:px-12 py-10 space-y-8">
                  {/* Monograph Header */}
                  <div className="border-b border-editorial-border/60 pb-8 text-center space-y-3">
                    <span className="text-xs font-sans uppercase tracking-widest text-accent font-semibold">
                      {ebook.category} • {ebook.subdiscipline}
                    </span>
                    <h1 className="font-display font-bold text-2xl sm:text-4xl">
                      {ebook.title}
                    </h1>
                    <p className="font-sans text-sm text-editorial-muted">
                      Original Composition by <strong>{ebook.author}</strong> ({ebook.year})
                    </p>
                  </div>

                  {/* Curated Historical Context & Thesis */}
                  <div className="space-y-4">
                    <h2 className="font-display font-semibold text-lg uppercase tracking-tight">
                      I. Historical Context & Structural Significance
                    </h2>
                    <p
                      className={cn(
                        'font-serif leading-relaxed',
                        fontSize === 'sm' && 'text-sm sm:text-base',
                        fontSize === 'base' && 'text-base sm:text-lg',
                        fontSize === 'lg' && 'text-lg sm:text-xl'
                      )}
                    >
                      {ebook.curatedContext}
                    </p>
                  </div>

                  {/* Core Conceptual Pillars */}
                  <div className="space-y-4 pt-4 border-t border-editorial-border/40">
                    <h2 className="font-display font-semibold text-lg uppercase tracking-tight">
                      II. Core Pillars & Conceptual Foundations
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ebook.keyThemes.map((themeItem, idx) => (
                        <div
                          key={themeItem}
                          className="p-3.5 rounded-xl border border-editorial-border/60 bg-editorial-surface/40 flex items-start gap-3"
                        >
                          <span className="font-mono text-xs text-accent font-bold">
                            0{idx + 1}
                          </span>
                          <span className="font-sans text-xs sm:text-sm font-semibold">
                            {themeItem}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Original Author Monograph */}
                  <div className="p-6 rounded-2xl border border-editorial-border/60 bg-editorial-surface-subtle/50 space-y-2 mt-6">
                    <h3 className="font-display font-bold text-xs uppercase tracking-widest text-editorial-muted">
                      About the Author: {ebook.author}
                    </h3>
                    <p
                      className={cn(
                        'font-serif leading-relaxed text-editorial-muted',
                        fontSize === 'sm' && 'text-xs',
                        fontSize === 'base' && 'text-sm',
                        fontSize === 'lg' && 'text-base'
                      )}
                    >
                      {ebook.authorBio}
                    </p>
                  </div>

                  {/* Direct Document Access Notice */}
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheckIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div className="text-xs font-sans">
                        <strong className="text-emerald-400 block">Verified Public Domain Edition</strong>
                        <span className="text-editorial-muted">Available for unlimited personal research, translation, and open archival study.</span>
                      </div>
                    </div>
                    <a
                      href={ebook.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold shrink-0 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Open Full PDF</span>
                      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Embedded Document Viewer via Secure Google Proxy (No Archive 503) */
              <div className="w-full h-full flex flex-col bg-neutral-900">
                <iframe
                  src={proxyViewerUrl}
                  title={`${ebook.title} Scanned Edition`}
                  className="w-full h-full border-0"
                  allow="fullscreen"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
