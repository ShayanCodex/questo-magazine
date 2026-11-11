import { useEffect, useRef, useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../lib/lang-context';

export interface ArticleCommentsProps {
  slug: string;
  title: string;
}

export function ArticleComments({ slug, title }: ArticleCommentsProps) {
  const { language } = useLanguage();
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Environment-configurable repo and proxy settings
  const repo = (import.meta.env.VITE_GISCUS_REPO as string) || 'sunmeltx/questo-magazine';
  const repoId = (import.meta.env.VITE_GISCUS_REPO_ID as string) || 'R_kgDONabcdefg';
  const category = (import.meta.env.VITE_GISCUS_CATEGORY as string) || 'Announcements';
  const categoryId = (import.meta.env.VITE_GISCUS_CATEGORY_ID as string) || 'DIC_kwDONabcdefg';
  // Configurable edge caching proxy (defaults to official Giscus edge app or Cloudflare Pages proxy)
  const proxyHost = (import.meta.env.VITE_GISCUS_PROXY as string) || 'https://giscus.app';

  // Determine active theme
  const getTheme = () => {
    if (typeof document === 'undefined') return 'light';
    const isDark =
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? 'dark_dimmed' : 'light';
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mount Giscus script
  useEffect(() => {
    if (!mounted || !commentsContainerRef.current) return;

    // Clear previous instance
    commentsContainerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = `${proxyHost.replace(/\/+$/, '')}/client.js`;
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', getTheme());
    script.setAttribute('data-lang', language.code === 'ur' ? 'en' : language.code);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    commentsContainerRef.current.appendChild(script);

    // Watch for document theme changes (dark/light toggle)
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            giscus: {
              setConfig: {
                theme: getTheme(),
              },
            },
          },
          proxyHost
        );
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, [mounted, slug, language.code, proxyHost, repo, repoId, category, categoryId]);

  return (
    <section
      aria-label="Discussion and Comments"
      className="mt-12 sm:mt-16 pt-10 border-t border-editorial-border space-y-6"
    >
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-editorial-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-editorial-text" />
            <h3 className="font-display font-bold text-xl sm:text-2xl text-editorial-text tracking-tight uppercase">
              Community Discourse
            </h3>
          </div>
          <p className="font-sans text-xs text-editorial-muted">
            Open editorial discussion powered by GitHub Discussions &amp; Edge Caching Proxy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-medium bg-editorial-surface-subtle border border-editorial-border text-editorial-muted">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
            <span>Zero Tracking • Edge Cached</span>
          </span>

          <a
            href={`https://github.com/${repo}/discussions`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-sans text-editorial-muted hover:text-editorial-text transition-colors group"
            title="Open Discussions on GitHub"
          >
            <span>GitHub</span>
            <ArrowTopRightOnSquareIcon className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Giscus Container with Accessible Loading State */}
      <div className="min-h-[220px] rounded-xl bg-editorial-surface/30 p-2 sm:p-4 border border-editorial-border/40">
        <div ref={commentsContainerRef} className="giscus w-full">
          <div className="py-8 text-center text-xs font-sans text-editorial-muted animate-pulse">
            Connecting to discussion stream for &ldquo;{title}&rdquo;...
          </div>
        </div>
      </div>
    </section>
  );
}

