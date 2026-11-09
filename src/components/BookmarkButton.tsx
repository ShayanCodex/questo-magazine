import { useState } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useReadingList } from '../lib/reading-list';
import { cn } from '../lib/utils';

export interface BookmarkButtonProps {
  slug: string;
  variant?: 'card' | 'pill' | 'compact';
  className?: string;
  onToggle?: (bookmarked: boolean) => void;
}

export function BookmarkButton({
  slug,
  variant = 'card',
  className,
  onToggle,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useReadingList();
  const bookmarked = isBookmarked(slug);
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleBookmark(slug);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    if (onToggle) onToggle(result);
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-sans font-medium transition-all cursor-pointer shadow-2xs select-none',
          bookmarked
            ? 'bg-editorial-text text-editorial-bg border-editorial-text'
            : 'border-editorial-border hover:border-editorial-text bg-editorial-surface text-editorial-text',
          animating && 'scale-105',
          className
        )}
        title={bookmarked ? 'Saved to Reading List' : 'Save to Reading List'}
        aria-label={bookmarked ? 'Remove from Reading List' : 'Save to Reading List'}
      >
        {bookmarked ? (
          <BookmarkSolid className="h-3.5 w-3.5 text-editorial-bg" />
        ) : (
          <BookmarkOutline className="h-3.5 w-3.5 text-editorial-muted group-hover:text-editorial-text" />
        )}
        <span>{bookmarked ? 'Saved' : 'Save'}</span>
      </button>
    );
  }

  // Card or compact icon button
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs border select-none',
        bookmarked
          ? 'bg-editorial-text text-editorial-bg border-editorial-text ring-1 ring-editorial-text/30'
          : 'bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border-white/20',
        animating && 'scale-110',
        className
      )}
      title={bookmarked ? 'Saved to Reading List' : 'Save to Reading List'}
      aria-label={bookmarked ? 'Remove from Reading List' : 'Save to Reading List'}
    >
      {bookmarked ? (
        <BookmarkSolid className="h-3.5 w-3.5 text-editorial-bg" />
      ) : (
        <BookmarkOutline className="h-3.5 w-3.5 text-current" />
      )}
    </button>
  );
}

