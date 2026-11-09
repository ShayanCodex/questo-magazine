import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  caption?: string;
  onClose: () => void;
}

export function ImageLightbox({
  src,
  alt = '',
  caption,
  onClose,
}: ImageLightboxProps) {
  useEffect(() => {
    if (!src) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image fullscreen viewer"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 end-4 sm:top-6 sm:end-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg z-10"
        title="Close image (Esc)"
        aria-label="Close image"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
        />

        {(caption || alt) && (
          <div className="pt-3 text-center max-w-xl">
            <p className="font-serif text-xs sm:text-sm text-white/80 leading-relaxed drop-shadow-sm">
              {caption || alt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
