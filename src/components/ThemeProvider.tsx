import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import {
  ThemeContext,
  STORAGE_KEY,
  type Theme,
} from '../lib/theme-context';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [fallbackOverlay, setFallbackOverlay] = useState<'light' | 'dark' | null>(null);
  const mountedRef = useRef(false);
  const isTransitioningRef = useRef(false);

  // On client mount, read current active theme from document or localStorage
  useEffect(() => {
    mountedRef.current = true;
    if (typeof document !== 'undefined') {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        setThemeState('dark');
      } else {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (stored === 'dark') {
          setThemeState('dark');
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      }
    }
  }, []);

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    if (!mountedRef.current) return;
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Storage may be disabled in private browsing
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    if (isTransitioningRef.current) return;
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';

    // 1. Native View Transitions API (Chrome, Edge, Safari 18+) with circular reveal from left top corner (0% 0%)
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      isTransitioningRef.current = true;
      const transitionDoc = document as Document & {
        startViewTransition: (callback: () => void) => { finished: Promise<void> };
      };

      const transition = transitionDoc.startViewTransition(() => {
        flushSync(() => {
          setThemeState(nextTheme);
          const root = document.documentElement;
          if (nextTheme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
          } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
          }
        });
      });

      transition.finished.finally(() => {
        isTransitioningRef.current = false;
      });
      return;
    }

    // 2. Circular Grow Fallback for browsers without View Transitions API
    if (
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      isTransitioningRef.current = true;
      setFallbackOverlay(nextTheme);

      setTimeout(() => {
        setThemeState(nextTheme);
      }, 350);

      setTimeout(() => {
        setFallbackOverlay(null);
        isTransitioningRef.current = false;
      }, 700);

      return;
    }

    // 3. Fallback for reduced motion or SSR
    setThemeState(nextTheme);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {fallbackOverlay && (
        <div
          aria-hidden="true"
          className={
            fallbackOverlay === 'dark' ? 'darkCircle grow' : 'lightCircle grow'
          }
        />
      )}
    </ThemeContext.Provider>
  );
}
