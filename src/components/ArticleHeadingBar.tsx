import { useState, useEffect, useRef } from 'react';
import {
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';
import type { ContentBlock } from '../lib/types';
import { cn } from '../lib/utils';

export interface HeadingItem {
  id: string;
  text: string;
  level: 2 | 3;
  index: number;
}

export interface ArticleHeadingBarProps {
  blocks?: ContentBlock[];
  className?: string;
}

export function ArticleHeadingBar({ blocks = [], className }: ArticleHeadingBarProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const railRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Extract headings from content blocks
  const headings: HeadingItem[] = [];
  if (Array.isArray(blocks)) {
    let count = 0;
    blocks.forEach((block, idx) => {
      if ((block.type === 'h2' || block.type === 'h3') && block.text) {
        count += 1;
        const id = block.text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        headings.push({
          id: id || `heading-${idx}`,
          text: block.text,
          level: block.type === 'h2' ? 2 : 3,
          index: count,
        });
      }
    });
  }

  // Update scroll arrow indicators
  const checkOverflow = () => {
    const el = railRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [headings.length]);

  // Track active heading with IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined' || headings.length === 0) return;

    if (!activeId && headings[0]) {
      setActiveId(headings[0].id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -55% 0px',
        threshold: 0.1,
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Keep active pill centered in the horizontal rail
  useEffect(() => {
    if (!activeId) return;
    const btn = buttonRefs.current[activeId];
    if (btn && railRef.current) {
      btn.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeId]);

  if (headings.length < 2) {
    return null;
  }

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  const handleScrollRail = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    const offset = direction === 'left' ? -220 : 220;
    railRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkOverflow, 250);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Article section jump bar"
      className={cn(
        'sticky top-14 sm:top-16 z-30 my-6 sm:my-8 transition-all',
        className
      )}
    >
      <div className="bg-editorial-bg/95 backdrop-blur-md border border-editorial-border rounded-xl shadow-xs py-2 px-2.5 sm:px-3.5 flex items-center gap-2 sm:gap-3 transition-colors">
        {/* Leading Jump Label with Badge */}
        <div className="flex items-center gap-1.5 shrink-0 pe-2 border-e border-editorial-border/70 text-editorial-text select-none">
          <ListBulletIcon className="h-4 w-4 text-editorial-text" />
          <span className="hidden sm:inline font-sans text-xs font-semibold uppercase tracking-wider">
            Jump to
          </span>
          <span className="inline-flex items-center justify-center font-mono text-[10px] h-4 min-w-[1rem] px-1 rounded-full bg-editorial-text/10 text-editorial-text font-bold">
            {headings.length}
          </span>
        </div>

        {/* Left Arrow Button for Horizontal Scroll on Overflow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScrollRail('left')}
            className="p-1 rounded-full border border-editorial-border bg-editorial-surface hover:bg-editorial-text hover:text-editorial-bg text-editorial-muted transition-colors shrink-0 shadow-2xs cursor-pointer"
            aria-label="Scroll headings left"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Scrollable Headings Rail */}
        <div
          ref={railRef}
          onScroll={checkOverflow}
          className="flex-1 overflow-x-auto flex items-center gap-1.5 sm:gap-2 no-scrollbar scroll-smooth py-0.5"
        >
          {headings.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  buttonRefs.current[item.id] = el;
                }}
                type="button"
                onClick={() => handleScrollTo(item.id)}
                className={cn(
                  'group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all shrink-0 cursor-pointer text-start whitespace-nowrap',
                  isActive
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'bg-editorial-surface hover:bg-editorial-surface-hover text-editorial-muted hover:text-editorial-text border border-editorial-border font-medium'
                )}
                title={item.text}
              >
                {item.level === 3 ? (
                  <HashtagIcon
                    className={cn(
                      'h-3 w-3 shrink-0 opacity-60',
                      isActive ? 'text-editorial-bg' : 'text-editorial-muted'
                    )}
                  />
                ) : (
                  <span
                    className={cn(
                      'font-mono text-[10px] shrink-0 font-bold',
                      isActive ? 'opacity-90' : 'opacity-50'
                    )}
                  >
                    {String(item.index).padStart(2, '0')}
                  </span>
                )}
                <span className="truncate max-w-[150px] sm:max-w-[220px] md:max-w-[280px]">
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button for Horizontal Scroll on Overflow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScrollRail('right')}
            className="p-1 rounded-full border border-editorial-border bg-editorial-surface hover:bg-editorial-text hover:text-editorial-bg text-editorial-muted transition-colors shrink-0 shadow-2xs cursor-pointer"
            aria-label="Scroll headings right"
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Back to Top Quick Jump Button */}
        <button
          type="button"
          onClick={handleScrollToTop}
          className="p-1.5 rounded-full border border-editorial-border bg-editorial-surface hover:border-editorial-text hover:bg-editorial-text hover:text-editorial-bg text-editorial-muted transition-all shrink-0 shadow-2xs cursor-pointer"
          title="Scroll to top of article"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </nav>
  );
}

