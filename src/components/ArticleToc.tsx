import { useState, useEffect } from 'react';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import type { ContentBlock } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { slugifyHeading } from '../lib/content';
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
  const { t } = useLanguage();

  // Extract TOC items from blocks using the exact same slugifyHeading helper as Body.tsx
  const items: TocItem[] = [];
  if (Array.isArray(blocks)) {
    blocks.forEach((block, index) => {
      if ((block.type === 'h2' || block.type === 'h3') && block.text) {
        items.push({
          id: slugifyHeading(block.text, index),
          text: block.text,
          level: block.type === 'h2' ? 2 : 3,
        });
      }
    });
  }

  // Track active heading with IntersectionObserver and robust scroll fallback
  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    // Clean up any stale hash in the URL on mount so browser reload never forces a jump down
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    // Clean single-element intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          // Sort by proximity to ideal reading top margin (~120px)
          const best = intersecting.sort((a, b) => {
            return Math.abs(a.boundingClientRect.top - 120) - Math.abs(b.boundingClientRect.top - 120);
          })[0];
          if (best?.target?.id) {
            setActiveId(best.target.id);
          }
        }
      },
      {
        rootMargin: '-80px 0px -65% 0px',
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    // Fallback scroll listener so scrolling past fast or up resets correctly
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 260) {
        setActiveId('');
        return;
      }

      // Linear check: the active heading is the latest heading whose top is <= 200px
      let currentId = '';
      for (const el of headingElements) {
        const top = el.getBoundingClientRect().top;
        if (top <= 200) {
          currentId = el.id;
        } else {
          break;
        }
      }
      if (currentId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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
      aria-label={t.tableOfContents || 'Table of Contents'}
      className={cn('w-full space-y-3 font-sans text-xs', className)}
    >
      <div className="flex items-center gap-1.5 text-editorial-muted font-bold uppercase tracking-wider text-[11px] border-b border-editorial-border pb-2.5">
        <ListBulletIcon className="h-3.5 w-3.5 text-editorial-text" />
        <span>{t.tableOfContents || 'Table of Contents'}</span>
      </div>

      <ul className="space-y-1 pt-1">
        {items.map((item) => {
          // Strictly require non-empty activeId and equality to avoid highlighting everything simultaneously
          const isActive = Boolean(activeId) && activeId === item.id;
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
