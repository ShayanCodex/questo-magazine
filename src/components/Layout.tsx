import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  FolderIcon,
  XMarkIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  CheckIcon,
  BookmarkIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import type { SearchItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { useReadingList } from '../lib/reading-list';
import { siteConfig } from '../lib/site';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { SearchModal } from './SearchModal';
import { ThemeToggle } from './ThemeToggle';
import { ReadingListDrawer } from './ReadingListDrawer';
import { AnalyticsTracker } from './AnalyticsTracker';
import { CATEGORIES, getCategoryShortName, formatTopicName } from '../lib/categories';
import { cn } from '../lib/utils';

export interface LayoutProps {
  tags?: string[];
  searchIndex?: SearchItem[];
}

export function Layout({ tags = [], searchIndex = [] }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [readingListOpen, setReadingListOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { count: readingListCount } = useReadingList();

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

  // Smart Auto-Hiding Navbar on scroll down / Reveal on minor scroll up
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // At the top of the page, navbar is always visible
          if (currentScrollY <= 20) {
            setNavVisible(true);
            setIsScrolled(false);
          } else {
            setIsScrolled(true);
            const delta = currentScrollY - lastScrollY.current;

            // Scroll down: hide navbar when scrolling down past initial threshold
            if (delta > 8 && currentScrollY > 70) {
              setNavVisible(false);
              setLangDropdownOpen(false);
            }
            // Scroll up: reveal navbar immediately on minor upward scroll (delta < -5)
            else if (delta < -5) {
              setNavVisible(true);
            }
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown on outside click or route change
  useEffect(() => {
    setLangDropdownOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [langDropdownOpen]);

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

      {/* Editorial Top Bar with Smart Auto-Hide on Scroll Down & Reveal on Minor Scroll Up */}
      <header
        className={cn(
          'fixed top-0 start-0 end-0 z-40 py-3 sm:py-3.5 px-4 sm:px-6 lg:px-12 transition-all duration-300 ease-in-out border-b',
          navVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none',
          isScrolled
            ? 'bg-editorial-bg/95 backdrop-blur-md border-editorial-border shadow-xs'
            : 'bg-editorial-bg border-editorial-border'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          {/* Brand Wordmark / Publication Title */}
          <Link
            to={localePath('/')}
            className="font-display font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-widest text-editorial-text hover:text-accent transition-colors shrink-0 me-2 sm:me-4 truncate max-w-[150px] sm:max-w-none"
          >
            {siteConfig.name} Magazine
          </Link>

          {/* Top navigation links & icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
            {/* Desktop Navigation Links - hidden on < xl to avoid overflowing screen */}
            <nav className="hidden xl:flex items-center gap-6 text-xs uppercase font-sans font-medium tracking-wider text-editorial-muted me-3">
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

            {/* Compact Editorial Search Capsule Button (icon-only on small, compact on medium, full on desktop) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group flex items-center justify-center sm:justify-between gap-2 px-2.5 sm:px-3.5 h-9 rounded-full bg-editorial-surface border border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-all cursor-pointer shadow-2xs w-9 sm:w-36 md:w-44 lg:w-56 shrink-0"
              aria-label={t.search}
              title={t.searchPlaceholder || 'Search articles...'}
            >
              <div className="flex items-center gap-2 truncate">
                <MagnifyingGlassIcon className="h-4 w-4 text-editorial-text shrink-0" />
                <span className="hidden sm:inline font-sans text-xs text-editorial-muted/80 group-hover:text-editorial-text truncate transition-colors">
                  {t.searchPlaceholder || 'Search...'}
                </span>
              </div>
              <kbd className="hidden md:inline-flex items-center px-2 py-0.5 text-[10px] font-sans font-medium text-editorial-muted bg-editorial-surface-subtle border border-editorial-border rounded-full group-hover:border-editorial-text transition-colors shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Reading List Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => setReadingListOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-full bg-editorial-surface border border-editorial-border hover:border-editorial-text text-editorial-text transition-all cursor-pointer shadow-2xs shrink-0 font-sans text-xs font-medium"
              title="Saved Reading List"
              aria-label="Open reading list"
            >
              <BookmarkIcon className="h-4 w-4 text-editorial-muted group-hover:text-editorial-text" />
              <span className="hidden lg:inline">Saved</span>
              {readingListCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-editorial-text text-editorial-bg text-[10px] font-bold flex items-center justify-center">
                  {readingListCount}
                </span>
              )}
            </button>

            {/* Interactive 1-Click Language Switcher Dropdown */}
            <div className="relative shrink-0" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 h-9 rounded-full border transition-all text-xs font-sans font-medium cursor-pointer shadow-2xs',
                  langDropdownOpen
                    ? 'border-editorial-text bg-editorial-surface-hover text-editorial-text ring-1 ring-editorial-text/20'
                    : 'border-editorial-border bg-editorial-surface hover:bg-editorial-surface-hover hover:border-editorial-text text-editorial-text'
                )}
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
                aria-label={`${t.languages}: ${language.name}`}
                title="Change language / زبان تبدیل کریں"
              >
                <GlobeAltIcon className="h-4 w-4 text-editorial-muted group-hover:text-editorial-text shrink-0" />
                <span className="hidden sm:inline font-medium">{language.name}</span>
                <span className="sm:hidden font-sans font-semibold uppercase text-[11px]">{language.code}</span>
                <ChevronDownIcon
                  className={cn(
                    'h-3.5 w-3.5 text-editorial-muted transition-transform duration-200 shrink-0',
                    langDropdownOpen && 'rotate-180 text-editorial-text'
                  )}
                />
              </button>

              {/* Language Dropdown Menu */}
              {langDropdownOpen && (
                <div
                  className="absolute end-0 top-full mt-2 z-50 w-44 rounded-md border border-editorial-border bg-editorial-surface shadow-2xl p-1.5 space-y-0.5 font-sans"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="px-2 py-1 text-[11px] font-semibold text-editorial-muted uppercase tracking-wider border-b border-editorial-border/60 mb-1 flex items-center justify-between">
                    <span>{t.languages}</span>
                    <span className="text-[10px] font-sans font-medium opacity-60">6 locales</span>
                  </div>
                  {siteConfig.languages.map((lang) => {
                    const isCurrent = lang.code === language.code;
                    const targetPath = switchLanguagePath(lang.code, currentPath);

                    return (
                      <Link
                        key={lang.code}
                        to={targetPath}
                        onClick={() => setLangDropdownOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-2.5 py-1.5 rounded-xs text-xs transition-colors cursor-pointer font-medium',
                          isCurrent
                            ? 'bg-editorial-text text-editorial-bg font-semibold shadow-2xs'
                            : 'text-editorial-text hover:bg-editorial-surface-hover'
                        )}
                        role="menuitem"
                        hrefLang={lang.code}
                      >
                        <span>{lang.name}</span>
                        {isCurrent && <CheckIcon className="h-3.5 w-3.5" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Menu Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="text-xs font-sans font-medium gap-1.5 sm:gap-2 h-9 min-w-[36px] px-3.5 rounded-full border-editorial-border hover:border-editorial-text cursor-pointer shrink-0"
              aria-label={t.menu}
            >
              <Bars3Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.menu}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport with top padding for fixed navbar */}
      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 pb-6 sm:pb-10"
      >
        <Outlet />
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-editorial-border py-12 px-6 sm:px-10 lg:px-16 mt-auto bg-editorial-surface/40">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
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
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-editorial-muted">
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

          {/* Bottom Legal & Regulatory Compliance Row */}
          <div className="pt-6 border-t border-editorial-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-editorial-muted">
            <div className="flex flex-wrap items-center gap-4">
              <span>&copy; 2026 {siteConfig.name} Publishing Group. All rights reserved.</span>
              <span>•</span>
              <Link
                to={localePath('/privacy')}
                className="hover:text-editorial-text underline underline-offset-2 transition-colors"
              >
                Privacy &amp; Regulatory Disclosures
              </Link>
              <span>•</span>
              <a
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-editorial-text underline underline-offset-2 transition-colors"
              >
                RSS Feed
              </a>
              <span>•</span>
              <a
                href="/atom.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-editorial-text underline underline-offset-2 transition-colors"
              >
                Atom Feed
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Edge Verified • Cloudflare Pages</span>
            </div>
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
              className="w-full flex items-center justify-between p-3 rounded-sm border border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-colors text-xs font-sans font-medium uppercase tracking-wider cursor-pointer bg-editorial-surface-subtle"
            >
              <span className="flex items-center gap-2">
                <MagnifyingGlassIcon className="h-4 w-4 text-editorial-text" />
                <span>{t.search}</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-sans font-medium bg-editorial-surface border border-editorial-border rounded-sm">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle in Drawer */}
            <div className="flex items-center justify-between p-3 rounded-sm border border-editorial-border bg-editorial-surface">
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-editorial-muted">
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
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setReadingListOpen(true);
                }}
                className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight hover:text-accent transition-colors text-start flex items-center justify-between cursor-pointer"
              >
                <span>Reading List</span>
                {readingListCount > 0 && (
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-editorial-text text-editorial-bg font-bold">
                    {readingListCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Editorial Categories Directory */}
            <div className="space-y-3 pt-4 border-t border-editorial-border font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-editorial-muted flex items-center gap-1.5">
                  <FolderIcon className="h-4 w-4 text-editorial-text" />
                  <span>{t.categories || 'Categories'}</span>
                </span>
                <Link
                  to={localePath('/categories')}
                  onClick={() => setDrawerOpen(false)}
                  className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
                >
                  <span>{t.allCategoriesAtoZ || 'View A–Z'}</span>
                  <ArrowRightIcon className="h-3 w-3 rtl:rotate-180" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3 rounded-lg border border-editorial-border/70 bg-editorial-surface-subtle space-y-2"
                  >
                    <Link
                      to={localePath(`/articles?category=${cat.id}`)}
                      onClick={() => setDrawerOpen(false)}
                      className="group flex items-center justify-between transition-colors"
                    >
                      <span className="font-sans font-bold text-sm text-editorial-text group-hover:text-accent transition-colors">
                        {getCategoryShortName(cat.id)}
                      </span>
                      <ArrowRightIcon className="h-3.5 w-3.5 text-editorial-muted group-hover:text-editorial-text group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                    </Link>

                    {/* Subcategories as clean pills */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={localePath(`/articles?category=${cat.id}&subcategory=${sub.id}`)}
                          onClick={() => setDrawerOpen(false)}
                          className="px-2.5 py-0.5 text-[11px] rounded-full bg-editorial-surface border border-editorial-border/60 text-editorial-muted hover:text-editorial-text hover:border-editorial-text transition-colors font-medium"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Topics */}
            {tags.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-editorial-border font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-editorial-muted">
                    {t.topics}
                  </span>
                  <Link
                    to={localePath('/articles')}
                    onClick={() => setDrawerOpen(false)}
                    className="text-xs font-medium text-editorial-muted hover:text-editorial-text underline"
                  >
                    All Tags
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      to={localePath(`/tags/${tag}`)}
                      onClick={() => setDrawerOpen(false)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-editorial-surface border border-editorial-border/70 hover:border-editorial-text text-editorial-text transition-colors"
                    >
                      {formatTopicName(tag)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Pinned Language List with Safe Bottom Spacing */}
            <div className="pt-4 pb-8 border-t border-editorial-border space-y-3 font-sans">
              <span className="text-xs font-semibold text-editorial-muted block">
                {t.languages}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {siteConfig.languages.map((lang) => {
                  const targetPath = switchLanguagePath(lang.code, currentPath);
                  const isCurrent = lang.code === language.code;

                  return (
                    <Link
                      key={lang.code}
                      to={targetPath}
                      onClick={() => setDrawerOpen(false)}
                      className={`px-3 py-2 rounded-lg border transition-colors flex items-center justify-between font-medium ${
                        isCurrent
                          ? 'border-editorial-text text-editorial-text font-semibold bg-editorial-surface-hover shadow-xs'
                          : 'border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text bg-editorial-surface-subtle'
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

      {/* Global Offline Reading List Drawer */}
      <ReadingListDrawer
        open={readingListOpen}
        onOpenChange={setReadingListOpen}
        searchIndex={searchIndex}
      />
    </div>
  );
}
