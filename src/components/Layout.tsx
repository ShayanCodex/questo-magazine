import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
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

export interface LayoutProps {
  tags?: string[];
}

export function Layout({ tags = [] }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { language, t, switchLanguagePath, localePath } = useLanguage();

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-editorial-text">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-editorial-text focus:text-editorial-bg focus:rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {t.skipToContent}
      </a>

      {/* Editorial Header */}
      <header className="border-b border-editorial-border py-6 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to={localePath('/')}
            className="font-display font-extrabold text-2xl tracking-tighter hover:text-accent transition-colors"
          >
            {siteConfig.name}
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="text-xs uppercase font-mono tracking-wider gap-2 min-h-[44px] min-w-[44px] px-3.5"
            aria-label={t.menu}
          >
            <Bars3Icon className="h-4 w-4" />
            <span>{t.menu}</span>
          </Button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main
        id="main-content"
        className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16"
      >
        <Outlet />
      </main>

      {/* Editorial Footer with Plain Language Links for Crawlers */}
      <footer className="border-t border-editorial-border py-12 px-6 sm:px-10 lg:px-16 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <span className="font-display font-bold text-lg tracking-tight">
              {siteConfig.name}
            </span>
            <p className="font-serif text-sm text-editorial-muted mt-1 max-w-md">
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

      {/* Drawer Navigation (Radix Dialog / Shadcn Sheet) */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="inlineEnd" className="flex flex-col justify-between">
          <div className="space-y-8">
            <SheetHeader>
              <SheetTitle>{siteConfig.name}</SheetTitle>
              <SheetDescription className="sr-only">
                Main navigation and language selection
              </SheetDescription>
            </SheetHeader>

            {/* Primary Large Links */}
            <nav className="flex flex-col space-y-4 pt-4">
              <Link
                to={localePath('/')}
                onClick={() => setDrawerOpen(false)}
                className="font-display text-3xl font-semibold tracking-tight hover:text-accent transition-colors"
              >
                {t.home}
              </Link>
              <Link
                to={localePath('/articles')}
                onClick={() => setDrawerOpen(false)}
                className="font-display text-3xl font-semibold tracking-tight hover:text-accent transition-colors"
              >
                {t.articles}
              </Link>
            </nav>

            {/* Topics / Tag Chips */}
            {tags.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-editorial-border">
                <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted block">
                  {t.topics}
                </span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      to={localePath(`/tags/${tag}`)}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Badge variant="default">#{tag}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pinned Language List at Bottom */}
          <div className="pt-6 border-t border-editorial-border">
            <span className="text-xs font-mono uppercase tracking-wider text-editorial-muted block mb-3">
              {t.languages}
            </span>
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
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
                        ? 'border-accent text-accent font-semibold bg-accent/5'
                        : 'border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text'
                    }`}
                    aria-current={isCurrent ? 'true' : undefined}
                    hrefLang={lang.code}
                  >
                    <span>{lang.name}</span>
                    {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

