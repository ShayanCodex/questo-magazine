import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import {
  ThemeContext,
  STORAGE_KEY,
  type Theme,
} from '../lib/theme-context';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
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

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
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

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
