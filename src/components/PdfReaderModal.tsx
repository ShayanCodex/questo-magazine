import { useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  BookOpenIcon,
  ShieldCheckIcon,
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!ebook) return null;

  // Use archive.org standard book reader or direct PDF URL
  // Archive.org has an interactive book reader embed: https://archive.org/embed/{identifier}
  // And direct PDF: {ebook.pdfUrl}
  const readerUrl = `https://archive.org/details/${ebook.identifier}?ui=embed`;

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
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
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-editorial-border bg-editorial-bg/95 backdrop-blur-xs shrink-0 gap-3">
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

            {/* Action Suite */}
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={ebook.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-editorial-border hover:border-editorial-text text-xs font-sans font-medium text-editorial-text hover:bg-editorial-surface transition-colors"
                title="Download original PDF"
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                <span>PDF ({ebook.pageCount}p)</span>
              </a>

              <a
                href={ebook.archiveSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-editorial-border hover:border-editorial-text text-xs font-sans font-medium text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface transition-colors"
                title="View on Internet Archive source"
              >
                <span>Archive Source</span>
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </a>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-full border border-editorial-border text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="h-4 w-4" />
                ) : (
                  <ArrowsPointingOutIcon className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-1.5 rounded-full border border-editorial-border text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface transition-colors cursor-pointer"
                title="Close reader"
                aria-label="Close reader"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interactive Document Viewer Frame */}
          <div className="flex-1 w-full h-full bg-neutral-950 relative overflow-hidden">
            <iframe
              src={readerUrl}
              title={`${ebook.title} Interactive Reader`}
              className="w-full h-full border-0"
              allow="fullscreen"
              loading="lazy"
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
