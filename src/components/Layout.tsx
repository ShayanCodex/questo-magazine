import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bars3Icon, MagnifyingGlassIcon, FolderIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { SearchItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { siteConfig } from '../lib/site';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { Badge } from './ui/badge';
import { SearchModal } from './SearchModal';
import { ThemeToggle } from './ThemeToggle';
import { AnalyticsTracker } from './AnalyticsTracker';
import { CATEGORIES } from '../lib/categories';

export interface LayoutProps {
  tags?: string[];
  searchIndex?: SearchItem[];
}

export function Layout({ tags = [], searchIndex = [] }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { language, t, switchLanguagePath, localePath } = useLanguage();

  const currentPath = location.pathname;

  // Global keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-editorial-text selection:bg-editorial-text selection:text-editorial-bg">
      {/* GoatCounter SPA Analytics Tracker for Route Transitions */}
      <AnalyticsTracker />

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-editorial-text focus:text-editorial-bg focus:rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {t.skipToContent}
      </a>

      {/* Editorial Top Bar (Fyrre Magazine Style) */}
      <header className="border-b border-editorial-border py-4 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Wordmark / Publication Title */}
          <Link
            to={localePath('/')}
            className="font-display font-extrabold text-sm sm:text-base uppercase tracking-widest text-editorial-text hover:text-accent transition-colors"
          >
            {siteConfig.name} Magazine
          </Link>

          {/* Top navigation links & icons */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <nav className="hidden md:flex items-center gap-6 text-xs uppercase font-mono tracking-wider text-editorial-muted">
              <Link to={localePath('/')} className="hover:text-editorial-text transition-colors">
                {t.home}
              </Link>
              <Link to={localePath('/articles')} className="hover:text-editorial-text transition-colors">
                {t.articles}
              </Link>
              <Link to={localePath('/categories')} className="hover:text-editorial-text transition-colors">
                {t.categories || 'Categories'}
              </Link>
            </nav>

            {/* Attractive Editorial Search Capsule Bar */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group flex items-center justify-between gap-3 px-3 py-1.5 h-9 rounded-sm bg-editorial-surface border border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-all cursor-pointer shadow-2xs w-36 sm:w-56 md:w-64"
              aria-label={t.search}
            >
              <div className="flex items-center gap-2 truncate">
                <MagnifyingGlassIcon className="h-4 w-4 text-editorial-text shrink-0" />
                <span className="font-sans text-xs text-editorial-muted/80 group-hover:text-editorial-text truncate transition-colors">
                  {t.searchPlaceholder || 'Search articles...'}
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-editorial-muted bg-editorial-surface-subtle border border-editorial-border rounded-xs group-hover:border-editorial-text transition-colors shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Quick Language Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-editorial-muted border-x border-editorial-border px-4 py-1">
              <span>{language.name}</span>
            </div>

            {/* Menu Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="text-xs uppercase font-mono tracking-wider gap-2 min-h-[36px] min-w-[36px] px-3 border-editorial-border hover:border-editorial-text cursor-pointer"
              aria-label={t.menu}
            >
              <Bars3Icon className="h-4 w-4" />
              <span>{t.menu}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16 py-6 sm:py-10"
      >
        <Outlet />
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-editorial-border py-12 px-6 sm:px-10 lg:px-16 mt-auto bg-editorial-surface/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <span className="font-display font-black text-xl uppercase tracking-tighter">
              {siteConfig.name} Magazine
            </span>
            <p className="font-serif text-sm text-editorial-muted mt-2 max-w-md">
              {siteConfig.description}
            </p>
          </div>

          {/* Crawler-accessible plain language links */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted">
              {t.languages}
            </span>
            <nav
              aria-label="Footer language navigation"
              className="flex flex-wrap gap-4 text-sm font-medium"
            >
              {siteConfig.languages.map((lang) => {
                const targetPath = switchLanguagePath(lang.code, currentPath);
                const isCurrent = lang.code === language.code;

                return (
                  <Link
                    key={lang.code}
                    to={targetPath}
                    className={`transition-colors py-1 ${
                      isCurrent
                        ? 'text-accent font-semibold underline underline-offset-4'
                        : 'text-editorial-muted hover:text-editorial-text'
                    }`}
                    aria-current={isCurrent ? 'true' : undefined}
                    hrefLang={lang.code}
                  >
                    {lang.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </footer>

      {/* Drawer Navigation - Fully Responsive & Scrollable on Mobile/Desktop */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="inlineEnd"
          hideDefaultClose={true}
          className="w-full sm:max-w-md h-full flex flex-col p-0 overflow-hidden bg-editorial-surface border-editorial-border shadow-2xl"
        >
          {/* Accessible Dialog Title & Description */}
          <SheetHeader className="sr-only">
            <SheetTitle>{siteConfig.name} Magazine</SheetTitle>
            <SheetDescription>
              Main navigation, search, categories, and language selection
            </SheetDescription>
          </SheetHeader>

          {/* Sticky Responsive Drawer Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-editorial-border bg-editorial-surface/95 backdrop-blur-xs">
            <span className="font-display font-black text-xl uppercase tracking-tighter text-editorial-text">
              {siteConfig.name} Magazine
            </span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-sm p-2 text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-hover transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t.close || 'Close navigation menu'}
            >
              <XMarkIcon className="h-5 w-5 text-editorial-text" />
            </button>
          </div>

          {/* Scrollable Drawer Body with Touch Momentum & Safe Bottom Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain px-5 sm:px-6 py-5 space-y-6">
            {/* Quick Search in Drawer */}
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-sm border border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer bg-editorial-surface-subtle"
            >
              <span className="flex items-center gap-2">
                <MagnifyingGlassIcon className="h-4 w-4 text-editorial-text" />
                <span>{t.search}</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-editorial-surface border border-editorial-border rounded-sm">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle in Drawer */}
            <div className="flex items-center justify-between p-3 rounded-sm border border-editorial-border bg-editorial-surface">
              <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted">
                {t.theme || 'Theme'}
              </span>
              <ThemeToggle showLabel={true} />
            </div>

            {/* Primary Large Links (Home, Articles, Categories) */}
            <nav className="flex flex-col space-y-3 pt-2">
              <Link
                to={localePath('/')}
                onClick={() => setDrawerOpen(false)}
                className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight hover:text-accent transition-colors"
              >
                {t.home}
              </Link>
              <Link
                to={localePath('/articles')}
                onClick={() => setDrawerOpen(false)}
                className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight hover:text-accent transition-colors"
              >
                {t.articles}
              </Link>
              <Link
                to={localePath('/categories')}
                onClick={() => setDrawerOpen(false)}
                className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight hover:text-accent transition-colors"
              >
                {t.categories || 'Categories'}
              </Link>
            </nav>

            {/* Editorial Categories Directory */}
            <div className="space-y-3 pt-4 border-t border-editorial-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted flex items-center gap-1.5 font-medium">
                  <FolderIcon className="h-4 w-4 text-editorial-text" />
                  <span>{t.categories || 'Categories'}</span>
                </span>
                <Link
                  to={localePath('/categories')}
                  onClick={() => setDrawerOpen(false)}
                  className="text-[11px] font-mono uppercase tracking-wider text-accent hover:underline"
                >
                  {t.allCategoriesAtoZ || 'View A–Z'} →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={localePath(`/articles?category=${cat.id}`)}
                    onClick={() => setDrawerOpen(false)}
                    className="group flex items-center justify-between p-2.5 rounded-sm border border-editorial-border/60 hover:border-editorial-text bg-editorial-surface-subtle hover:bg-editorial-surface transition-all"
                  >
                    <span className="font-display font-bold text-sm uppercase text-editorial-text group-hover:text-accent transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-xs font-mono text-editorial-muted group-hover:text-editorial-text group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Curated Topics */}
            {tags.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-editorial-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted">
                    {t.topics}
                  </span>
                  <Link
                    to={localePath('/articles')}
                    onClick={() => setDrawerOpen(false)}
                    className="text-[10px] font-mono uppercase tracking-wider text-editorial-muted hover:text-editorial-text underline"
                  >
                    All Tags
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 5).map((tag) => (
                    <Link
                      key={tag}
                      to={localePath(`/tags/${tag}`)}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Badge variant="default" className="text-[10px] uppercase font-mono">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                  {tags.length > 5 && (
                    <Link
                      to={localePath('/articles')}
                      onClick={() => setDrawerOpen(false)}
                      className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs border border-editorial-border text-editorial-muted hover:text-editorial-text"
                    >
                      +{tags.length - 5} more
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Pinned Language List with Safe Bottom Spacing */}
            <div className="pt-4 pb-8 border-t border-editorial-border space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted block">
                {t.languages}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {siteConfig.languages.map((lang) => {
                  const targetPath = switchLanguagePath(lang.code, currentPath);
                  const isCurrent = lang.code === language.code;

                  return (
                    <Link
                      key={lang.code}
                      to={targetPath}
                      onClick={() => setDrawerOpen(false)}
                      className={`px-3 py-2 rounded-sm border transition-colors flex items-center justify-between ${
                        isCurrent
                          ? 'border-editorial-text text-editorial-text font-semibold bg-editorial-surface-hover'
                          : 'border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text'
                      }`}
                      aria-current={isCurrent ? 'true' : undefined}
                      hrefLang={lang.code}
                    >
                      <span>{lang.name}</span>
                      {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-editorial-text" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Global Advanced Search Modal */}
      <SearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        items={searchIndex}
        tags={tags}
      />
    </div>
  );
}
