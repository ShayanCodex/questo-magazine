import { useState, useEffect } from 'react';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import type { ContentBlock } from '../lib/types';
import { cn } from '../lib/utils';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ArticleTocProps {
  blocks?: ContentBlock[];
  className?: string;
}

export function ArticleToc({ blocks = [], className }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Extract TOC items from blocks
  const items: TocItem[] = [];
  if (Array.isArray(blocks)) {
    blocks.forEach((block, index) => {
      if ((block.type === 'h2' || block.type === 'h3') && block.text) {
        const id = block.text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        items.push({
          id: id || `heading-${index}`,
          text: block.text,
          level: block.type === 'h2' ? 2 : 3,
        });
      }
    });
  }

  // Track active heading with IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    // Clean up any stale hash in the URL on mount so browser reload never forces a jump down
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
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
        rootMargin: '-100px 0px -65% 0px',
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      // If user scrolls back up near the top of the article (before headings)
      if (window.scrollY < 300) {
        setActiveId('');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  if (items.length < 2) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        'w-full space-y-3 font-sans text-xs',
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-editorial-muted font-bold uppercase tracking-wider text-[11px] border-b border-editorial-border pb-2.5">
        <ListBulletIcon className="h-3.5 w-3.5 text-editorial-text" />
        <span>Table of Contents</span>
      </div>

      <ul className="space-y-1 pt-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={cn('transition-all', item.level === 3 && 'ps-3 text-[11px]')}
            >
              <button
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'text-start py-1.5 px-2.5 rounded-lg w-full transition-all cursor-pointer truncate block leading-snug',
                  isActive
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-2xs'
                    : 'text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover'
                )}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
