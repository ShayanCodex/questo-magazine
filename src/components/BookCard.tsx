import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  ArrowDownTrayIcon,
  LinkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { EBook } from '../lib/types';
import { LazyImage } from './LazyImage';
import { cn } from '../lib/utils';

export interface BookCardProps {
  book: EBook;
  detailUrl: string;
  onReadOnline: (book: EBook) => void;
}

// Curated palette of luxury cloth binding gradients for instant fallback
const BINDING_PALETTES = [
  'from-slate-900 via-neutral-900 to-zinc-900',
  'from-blue-950 via-slate-900 to-indigo-950',
  'from-emerald-950 via-neutral-900 to-teal-950',
  'from-rose-950 via-neutral-900 to-stone-900',
  'from-amber-950 via-neutral-900 to-yellow-950',
  'from-violet-950 via-slate-900 to-purple-950',
];

export function BookCard({ book, detailUrl, onReadOnline }: BookCardProps) {
  const [copied, setCopied] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Hash-based deterministic palette for consistent book spine styling
  const paletteIndex = Math.abs(
    book.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % BINDING_PALETTES.length;
  const gradientClass = BINDING_PALETTES[paletteIndex];

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(book.pdfUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <article className="group rounded-xl border border-editorial-border bg-editorial-surface hover:border-editorial-text/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1">
      <div>
        {/* Compact Book Cover Frame */}
        <Link to={detailUrl} className="block aspect-[2/3] bg-neutral-950 overflow-hidden relative border-b border-editorial-border group/cover">
          {!imgFailed ? (
            <LazyImage
              src={book.coverUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
              onError={() => setImgFailed(true)}
            />
          ) : (
            /* Bespoke Hardcover Typographic Binding Fallback */
            <div className={cn('w-full h-full p-4 flex flex-col justify-between text-center bg-gradient-to-b border-2 border-amber-500/20', gradientClass)}>
              <div className="pt-2">
                <span className="text-[9px] uppercase tracking-widest text-amber-400/70 font-sans font-semibold">Questo Classics</span>
              </div>
              <div className="my-auto px-1 space-y-1.5">
                <h4 className="font-display font-bold text-sm text-neutral-100 leading-snug line-clamp-3">
                  {book.title}
                </h4>
                <div className="w-8 h-px bg-amber-500/40 mx-auto" />
                <p className="text-[10px] font-sans font-medium text-neutral-300 uppercase tracking-wider truncate">
                  {book.author}
                </p>
              </div>
              <div className="pb-1 text-[8px] uppercase tracking-widest text-neutral-400">
                Public Domain
              </div>
            </div>
          )}

          {/* Discipline Chip */}
          <div className="absolute top-2 start-2 pointer-events-none">
            <span className="px-2 py-0.5 text-[9px] font-sans font-semibold uppercase tracking-wider bg-black/85 backdrop-blur-xs text-white rounded-full border border-white/15">
              {book.subdiscipline || book.category}
            </span>
          </div>
        </Link>

        {/* Crisp Information Block */}
        <div className="p-3.5 space-y-1.5">
          <p className="text-[10px] font-sans font-medium uppercase tracking-wider text-editorial-muted truncate">
            {book.author}
          </p>

          <h3 className="font-display font-bold text-sm text-editorial-text group-hover:text-accent transition-colors line-clamp-1 leading-snug">
            <Link to={detailUrl} title={book.title}>
              {book.title}
            </Link>
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] font-sans text-editorial-muted">
            <span>{book.year}</span>
            <span>•</span>
            <span>{book.pageCount}p</span>
          </div>
        </div>
      </div>

      {/* Sleek Compact Action Suite */}
      <div className="p-3.5 pt-0">
        <div className="flex items-center gap-1.5">
          {/* Direct Read Button */}
          <button
            type="button"
            onClick={() => onReadOnline(book)}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-editorial-text text-editorial-bg text-xs font-sans font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title="Read online in Questo reader"
          >
            <BookOpenIcon className="h-3.5 w-3.5 shrink-0" />
            <span>Read</span>
          </button>

          {/* Direct Download Button */}
          <a
            href={book.pdfUrl}
            download
            className="py-1.5 px-2 rounded-lg border border-editorial-border hover:border-editorial-text text-editorial-text hover:bg-editorial-surface-subtle text-xs font-sans font-semibold transition-colors flex items-center justify-center gap-1"
            title="Download direct PDF"
          >
            <ArrowDownTrayIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline text-[11px]">PDF</span>
          </a>

          {/* Direct Link Copy Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              'p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-center shrink-0',
              copied
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-subtle'
            )}
            title={copied ? 'Link Copied!' : 'Copy direct PDF URL'}
            aria-label="Copy direct PDF URL"
          >
            {copied ? (
              <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <LinkIcon className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
