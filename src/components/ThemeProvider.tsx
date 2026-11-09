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

  const activeTransitionRef = useRef<{ skipTransition?: () => void } | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTheme = () => {
    // 1. If any transition is currently animating, cancel/skip it immediately so rapid clicks respond instantly
    if (activeTransitionRef.current?.skipTransition) {
      try {
        activeTransitionRef.current.skipTransition();
      } catch {
        // already settled
      }
      activeTransitionRef.current = null;
    }

    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
      setFallbackOverlay(null);
    }

    // 2. Read live DOM state to guarantee 100% accuracy on instant repeated clicks
    const isCurrentlyDark =
      typeof document !== 'undefined'
        ? document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark'
        : theme === 'dark';

    const nextTheme: Theme = isCurrentlyDark ? 'light' : 'dark';

    // 3. Native View Transitions API (Chrome, Edge, Safari 18+) with circular reveal from left top corner (0% 0%)
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const transitionDoc = document as Document & {
        startViewTransition: (callback: () => void) => {
          finished: Promise<void>;
          skipTransition: () => void;
        };
      };

      try {
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

        activeTransitionRef.current = transition;

        transition.finished.finally(() => {
          if (activeTransitionRef.current === transition) {
            activeTransitionRef.current = null;
          }
        });
        return;
      } catch {
        // In case startViewTransition throws, proceed to direct state update
      }
    }

    // 4. Circular Grow Fallback for browsers without View Transitions API
    if (
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setFallbackOverlay(nextTheme);
      setThemeState(nextTheme);

      fallbackTimerRef.current = setTimeout(() => {
        setFallbackOverlay(null);
        fallbackTimerRef.current = null;
      }, 450);

      return;
    }

    // 5. Fallback for reduced motion or SSR
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
