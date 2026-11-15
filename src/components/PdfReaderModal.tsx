import { useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { EBook } from '../lib/types';
import { OriginalPdfReader } from './OriginalPdfReader';
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
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onOpenChange(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onOpenChange]);

  if (!ebook) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md transition-opacity duration-200" />
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col text-neutral-100 transition-all duration-300 focus:outline-none overflow-hidden',
            isFullscreen
              ? 'inset-0 w-screen h-screen rounded-none'
              : 'start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-6xl h-[94vh] rounded-2xl'
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {ebook.title} - Reader
          </DialogPrimitive.Title>
          <OriginalPdfReader
            ebook={ebook}
            initialMode="facsimile"
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
            onClose={() => onOpenChange(false)}
            className="h-full border-0 rounded-none"
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
