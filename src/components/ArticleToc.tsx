import { useState, useEffect } from 'react';
import {
  ListBulletIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
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
  const [mobileOpen, setMobileOpen] = useState(false);

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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sticky Table of Contents Widget */}
      <nav
        aria-label="Table of contents"
        className={cn(
          'hidden xl:block w-64 shrink-0 sticky top-28 self-start space-y-3 font-sans text-xs',
          className
        )}
      >
        <div className="flex items-center gap-1.5 text-editorial-muted font-bold uppercase tracking-wider text-[11px] border-b border-editorial-border pb-2">
          <ListBulletIcon className="h-3.5 w-3.5 text-editorial-text" />
          <span>Table of Contents</span>
        </div>

        <ul className="space-y-1.5 pt-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={item.id}
                className={cn('transition-all', item.level === 3 && 'ps-3')}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'text-start py-1 px-2 rounded-md w-full transition-all cursor-pointer truncate block',
                    isActive
                      ? 'bg-editorial-text text-editorial-bg font-semibold shadow-2xs'
                      : 'text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-subtle'
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

      {/* Mobile Floating Trigger Pill & Drawer */}
      <div className="xl:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 end-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-editorial-text text-editorial-bg shadow-xl border border-editorial-border font-sans text-xs font-semibold cursor-pointer hover:opacity-95 transition-all"
          aria-label="Open Table of Contents"
        >
          <ListBulletIcon className="h-4 w-4" />
          <span>Contents ({items.length})</span>
        </button>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="bg-editorial-surface border border-editorial-border rounded-t-2xl sm:rounded-2xl max-w-md w-full p-6 space-y-4 max-h-[70vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-editorial-border pb-3">
                <div className="flex items-center gap-2">
                  <ListBulletIcon className="h-4 w-4 text-editorial-text" />
                  <h4 className="font-display font-bold text-base uppercase text-editorial-text">
                    Article Contents
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-full text-editorial-muted hover:text-editorial-text cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <ul className="space-y-1 divide-y divide-editorial-border/40 text-xs font-sans">
                {items.map((item) => (
                  <li key={item.id} className="pt-2 first:pt-0">
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        'w-full text-start py-2 px-2.5 rounded-lg transition-colors cursor-pointer',
                        activeId === item.id
                          ? 'bg-editorial-text text-editorial-bg font-semibold'
                          : 'text-editorial-text hover:bg-editorial-surface-subtle',
                        item.level === 3 && 'ps-6 text-editorial-muted'
                      )}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
