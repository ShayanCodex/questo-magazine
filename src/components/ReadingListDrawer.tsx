import { Link } from 'react-router-dom';
import {
  BookmarkIcon,
  XMarkIcon,
  TrashIcon,
  ArrowRightIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { useReadingList } from '../lib/reading-list';
import { useLanguage } from '../lib/lang-context';
import type { SearchItem } from '../lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { formatTopicName } from '../lib/categories';

export interface ReadingListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchIndex?: SearchItem[];
}

export function ReadingListDrawer({
  open,
  onOpenChange,
  searchIndex = [],
}: ReadingListDrawerProps) {
  const { list, count, removeBookmark, clearReadingList } = useReadingList();
  const { localePath, t } = useLanguage();

  // Map slugs to full article search items
  const savedArticles = list
    .map((slug) => searchIndex.find((item) => item.slug === slug))
    .filter((item): item is SearchItem => Boolean(item));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="inlineEnd"
        className="w-full sm:max-w-md p-0 flex flex-col bg-editorial-surface border-editorial-border text-editorial-text"
      >
        <SheetHeader className="p-6 border-b border-editorial-border flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-full bg-editorial-surface-subtle border border-editorial-border text-editorial-text">
              <BookmarkIcon className="h-4 w-4" />
            </span>
            <div>
              <SheetTitle className="font-display font-black text-xl uppercase tracking-tight text-editorial-text">
                Reading List
              </SheetTitle>
              <SheetDescription className="text-xs font-sans text-editorial-muted">
                {count} {count === 1 ? 'saved monograph' : 'saved monographs'} stored locally
              </SheetDescription>
            </div>
          </div>

          {count > 0 && (
            <button
              type="button"
              onClick={clearReadingList}
              className="text-xs font-sans text-editorial-muted hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear all saved articles"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </SheetHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-editorial-surface-subtle border border-editorial-border mx-auto flex items-center justify-center text-editorial-muted">
                <BookOpenIcon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-display font-bold text-base text-editorial-text">
                  Your reading list is empty
                </p>
                <p className="font-serif text-xs text-editorial-muted max-w-xs mx-auto leading-relaxed">
                  Click the bookmark icon on any article or monograph to save it here for offline reading.
                </p>
              </div>
              <Link
                to={localePath('/articles')}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-editorial-text text-editorial-bg font-sans text-xs font-semibold shadow-xs hover:opacity-90 transition-all cursor-pointer"
              >
                <span>Browse Articles</span>
                <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-editorial-border/60">
              {savedArticles.map((article) => {
                const articleUrl = localePath(`/articles/${article.slug}`);

                return (
                  <div
                    key={article.slug}
                    className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-3 group"
                  >
                    <div className="flex-1 space-y-1.5 min-w-0">
                      {article.category && (
                        <span className="text-[10px] font-sans uppercase font-semibold text-editorial-muted tracking-wider block">
                          {formatTopicName(article.category)}
                        </span>
                      )}

                      <h4 className="font-display font-bold text-sm text-editorial-text group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                        <Link
                          to={articleUrl}
                          onClick={() => onOpenChange(false)}
                          className="focus-visible:outline-none"
                        >
                          {article.title}
                        </Link>
                      </h4>

                      <p className="font-serif text-xs text-editorial-muted line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="pt-1 flex items-center gap-2 text-[11px] font-sans font-medium text-editorial-muted">
                        <Link
                          to={articleUrl}
                          onClick={() => onOpenChange(false)}
                          className="text-editorial-text hover:underline font-semibold flex items-center gap-1"
                        >
                          <span>{t.readMore || 'Read'}</span>
                          <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeBookmark(article.slug)}
                      className="p-1.5 text-editorial-muted hover:text-red-500 rounded-full hover:bg-editorial-surface-subtle transition-colors shrink-0 cursor-pointer"
                      title="Remove from Reading List"
                      aria-label={`Remove ${article.title} from reading list`}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
