import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  itemsLabel?: string;
  isRtl?: boolean;
  className?: string;
}

type PageItem = number | { type: 'ellipsis'; key: string };

function getPaginationItems(current: number, total: number, isMobile: boolean): PageItem[] {
  if (total <= 1) return [1];

  if (isMobile) {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    // Mobile: 1 2 3 ... last when near start
    if (current <= 3) {
      return [1, 2, 3, { type: 'ellipsis', key: 'mob-ellipsis-end' }, total];
    }
    // Mobile: 1 ... (last 3) when near end
    if (current >= total - 2) {
      return [
        1,
        { type: 'ellipsis', key: 'mob-ellipsis-start' },
        total - 2,
        total - 1,
        total,
      ];
    }
    // Mobile: 1 ... current ... last in middle
    return [
      1,
      { type: 'ellipsis', key: 'mob-ellipsis-start' },
      current,
      { type: 'ellipsis', key: 'mob-ellipsis-end' },
      total,
    ];
  }

  // Desktop
  if (total <= 10) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Desktop: 1 2 3 4 5 6 7 8 ... last when near start
  if (current <= 7) {
    return [1, 2, 3, 4, 5, 6, 7, 8, { type: 'ellipsis', key: 'desk-ellipsis-end' }, total];
  }

  // Desktop: 1 ... (last 8 pages) when near end
  if (current >= total - 6) {
    const startPage = total - 7;
    const endPages: PageItem[] = [1, { type: 'ellipsis', key: 'desk-ellipsis-start' }];
    for (let p = startPage; p <= total; p++) {
      endPages.push(p);
    }
    return endPages;
  }

  // Desktop: 1 ... current-2, current-1, current, current+1, current+2 ... last in middle
  return [
    1,
    { type: 'ellipsis', key: 'desk-ellipsis-start' },
    current - 2,
    current - 1,
    current,
    current + 1,
    current + 2,
    { type: 'ellipsis', key: 'desk-ellipsis-end' },
    total,
  ];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  itemsLabel = 'articles found',
  isRtl = false,
  className,
}) => {
  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const desktopItems = getPaginationItems(safePage, totalPages, false);
  const mobileItems = getPaginationItems(safePage, totalPages, true);

  return (
    <div
      className={cn(
        'pt-8 border-t border-editorial-border flex flex-col sm:flex-row items-center justify-between gap-4 select-none',
        className
      )}
    >
      {/* Informational counter */}
      {totalItems !== undefined && pageSize !== undefined && (
        <span className="text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted text-center sm:text-start">
          Showing {(safePage - 1) * pageSize + 1}–
          {Math.min(safePage * pageSize, totalItems)} of {totalItems} {itemsLabel} (Page {safePage} of {totalPages})
        </span>
      )}

      {/* Pagination control group */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-sans">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage === 1}
          className="px-3 sm:px-4 py-1.5 rounded-full border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 font-sans text-xs font-medium"
          aria-label="Previous page"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 rtl:rotate-180" />
          <span>{isRtl ? 'السابق' : 'Back'}</span>
        </button>

        {/* Desktop Page Numbers: 1 2 3 4 5 6 7 8 ... last */}
        <div className="hidden sm:flex items-center gap-1.5">
          {desktopItems.map((item) =>
            typeof item === 'number' ? (
              <button
                key={`desk-page-${item}`}
                type="button"
                onClick={() => onPageChange(item)}
                className={cn(
                  'w-8 h-8 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer flex items-center justify-center',
                  item === safePage
                    ? 'bg-editorial-text text-editorial-bg font-bold shadow-xs'
                    : 'border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text bg-editorial-surface'
                )}
                aria-current={item === safePage ? 'page' : undefined}
              >
                {item}
              </button>
            ) : (
              <span
                key={item.key}
                className="w-8 h-8 flex items-center justify-center text-xs font-sans text-editorial-muted tracking-widest select-none"
              >
                …
              </span>
            )
          )}
        </div>

        {/* Mobile Page Numbers: 1 2 3 ... last */}
        <div className="flex sm:hidden items-center gap-1">
          {mobileItems.map((item) =>
            typeof item === 'number' ? (
              <button
                key={`mob-page-${item}`}
                type="button"
                onClick={() => onPageChange(item)}
                className={cn(
                  'w-7 h-7 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer flex items-center justify-center',
                  item === safePage
                    ? 'bg-editorial-text text-editorial-bg font-bold shadow-xs'
                    : 'border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text bg-editorial-surface'
                )}
                aria-current={item === safePage ? 'page' : undefined}
              >
                {item}
              </button>
            ) : (
              <span
                key={item.key}
                className="w-5 h-7 flex items-center justify-center text-xs font-sans text-editorial-muted tracking-widest select-none"
              >
                …
              </span>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage === totalPages}
          className="px-3 sm:px-4 py-1.5 rounded-full border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 font-sans text-xs font-medium"
          aria-label="Next page"
        >
          <span>{isRtl ? 'التالي' : 'Next'}</span>
          <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
