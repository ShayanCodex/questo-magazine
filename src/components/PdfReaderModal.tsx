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
  const [activeTab, setActiveTab] = useState<'document' | 'guide'>('document');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Reset tab on ebook change
  useEffect(() => {
    setActiveTab('document');
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

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md transition-opacity duration-200" />
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 bg-editorial-surface border border-editorial-border shadow-2xl flex flex-col text-editorial-text transition-all duration-300 focus:outline-none overflow-hidden',
            isFullscreen
              ? 'inset-0 w-screen h-screen rounded-none'
              : 'start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-6xl h-[92vh] rounded-xl'
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

            {/* View Mode Toggle (Document vs Study Guide) */}
            <div className="hidden md:flex items-center bg-editorial-surface-subtle p-0.5 rounded-lg border border-editorial-border text-xs font-sans">
              <button
                type="button"
                onClick={() => setActiveTab('document')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                  activeTab === 'document'
                    ? 'bg-editorial-text text-editorial-bg shadow-2xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                <BookOpenIcon className="h-3.5 w-3.5" />
                <span>Document Reader</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                  activeTab === 'guide'
                    ? 'bg-editorial-text text-editorial-bg shadow-2xs'
                    : 'text-editorial-muted hover:text-editorial-text'
                )}
              >
                <DocumentTextIcon className="h-3.5 w-3.5" />
                <span>Historical Context</span>
              </button>
            </div>

            {/* Action Suite */}
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
                title="Copy direct PDF URL"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Copy URL</span>
                  </>
                )}
              </button>

              {/* Download PDF */}
              <a
                href={ebook.pdfUrl}
                download
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-editorial-border hover:border-editorial-text text-xs font-sans font-medium text-editorial-text hover:bg-editorial-surface transition-colors"
                title="Download original PDF document"
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </a>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg border border-editorial-border text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
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
                aria-label="Close reader"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interactive Document Viewer Frame */}
          <div className="flex-1 w-full h-full bg-neutral-950 relative overflow-hidden flex flex-col">
            {activeTab === 'document' ? (
              /* Direct In-Website Native Document Reader - Zero Third-Party Chrome */
              <div className="w-full h-full flex flex-col">
                <iframe
                  src={`${ebook.pdfUrl}#toolbar=1&navpanes=1`}
                  title={`${ebook.title} Original Scanned Edition`}
                  className="w-full h-full border-0 bg-neutral-900"
                  allow="fullscreen"
                  loading="lazy"
                />
              </div>
            ) : (
              /* High-Trust Editorial Study Guide & Philosophical Treatise */
              <div className="w-full h-full overflow-y-auto p-6 sm:p-10 max-w-4xl mx-auto space-y-8 bg-editorial-bg text-editorial-text">
                <div className="space-y-3 border-b border-editorial-border pb-6">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-accent">
                    {ebook.category} • {ebook.subdiscipline}
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-editorial-text">
                    {ebook.title}
                  </h2>
                  <p className="text-sm font-sans text-editorial-muted">
                    Authored by <strong className="text-editorial-text">{ebook.author}</strong> ({ebook.year})
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-lg text-editorial-text">
                    Historical Context & Significance
                  </h3>
                  <p className="font-serif text-base text-editorial-text/90 leading-relaxed">
                    {ebook.curatedContext}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-lg text-editorial-text">
                    Central Pillars & Concepts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ebook.keyThemes.map((theme, idx) => (
                      <div
                        key={theme}
                        className="p-3.5 rounded-lg border border-editorial-border bg-editorial-surface text-sm font-sans flex items-start gap-2.5"
                      >
                        <span className="font-mono text-xs text-editorial-muted">
                          0{idx + 1}
                        </span>
                        <span className="font-medium text-editorial-text">{theme}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-editorial-border bg-editorial-surface-subtle space-y-2">
                  <h4 className="font-display font-bold text-sm uppercase tracking-wider text-editorial-muted">
                    About the Original Author: {ebook.author}
                  </h4>
                  <p className="font-serif text-sm text-editorial-text leading-relaxed">
                    {ebook.authorBio}
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('document')}
                    className="px-4 py-2 rounded-lg bg-editorial-text text-editorial-bg text-xs font-sans font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    <span>Return to Document Reader</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
