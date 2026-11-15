import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  ArrowDownTrayIcon,
  LinkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { EBook } from '../lib/types';
import { BookCover } from './BookCover';
import { cn } from '../lib/utils';

export interface BookCardProps {
  book: EBook;
  detailUrl: string;
  onReadOnline: (book: EBook) => void;
}

export function BookCard({ book, detailUrl, onReadOnline }: BookCardProps) {
  const [copied, setCopied] = useState(false);

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
    <article className="group rounded-xl border border-editorial-border bg-editorial-surface hover:border-editorial-text/40 transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 flex flex-row items-stretch p-3 sm:p-3.5 gap-3.5 sm:gap-4 min-h-[148px]">
      {/* Left: Compact Book Cover Thumbnail */}
      <Link
        to={detailUrl}
        className="w-22 sm:w-26 shrink-0 aspect-[2/3] bg-neutral-950 rounded-lg overflow-hidden relative border border-editorial-border group/cover shadow-xs self-start"
      >
        <BookCover
          coverUrl={book.coverUrl}
          title={book.title}
          author={book.author}
          year={book.year}
          category={book.category}
          subdiscipline={book.subdiscipline}
          slug={book.slug}
          size="sm"
          className="w-full h-full group-hover/cover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute bottom-1 end-1 pointer-events-none z-10">
          <span className="px-1.5 py-0.5 text-[8px] font-sans font-bold bg-black/80 backdrop-blur-xs text-white rounded">
            PDF
          </span>
        </div>
      </Link>

      {/* Right: Wide Information & Action Suite */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="space-y-1">
          {/* Metadata Row */}
          <div className="flex items-center justify-between gap-2 text-[10px] font-sans">
            <span className="px-2 py-0.5 rounded-full bg-editorial-surface-subtle border border-editorial-border font-semibold uppercase tracking-wider text-editorial-muted truncate">
              {book.subdiscipline || book.category}
            </span>
            <span className="text-editorial-muted shrink-0">
              {book.year}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-sm sm:text-base text-editorial-text group-hover:text-accent transition-colors line-clamp-1 leading-snug pt-0.5">
            <Link to={detailUrl} title={book.title}>
              {book.title}
            </Link>
          </h3>

          {/* Author */}
          <p className="text-[11px] font-sans font-medium text-editorial-muted uppercase tracking-wider truncate">
            {book.author}
          </p>

          {/* Curated Context (1-line concise snippet) */}
          <p className="font-serif text-[11px] text-editorial-muted/90 line-clamp-2 leading-relaxed pt-0.5 hidden xs:block">
            {book.curatedContext}
          </p>
        </div>

        {/* Bottom Actions Suite */}
        <div className="flex items-center gap-1.5 pt-2">
          {/* Read Online Button */}
          <button
            type="button"
            onClick={() => onReadOnline(book)}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-editorial-text text-editorial-bg text-xs font-sans font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title="Read in Questo Reader"
          >
            <BookOpenIcon className="h-3.5 w-3.5 shrink-0" />
            <span>Read</span>
          </button>

          {/* Direct Download Button */}
          <a
            href={book.pdfUrl}
            download
            className="py-1.5 px-2.5 rounded-lg border border-editorial-border hover:border-editorial-text text-editorial-text hover:bg-editorial-surface-subtle text-xs font-sans font-semibold transition-colors flex items-center justify-center gap-1 shrink-0"
            title="Download direct PDF"
          >
            <ArrowDownTrayIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[11px]">PDF</span>
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
