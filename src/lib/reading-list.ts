import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'questo_reading_list';
const EVENT_NAME = 'questo:reading-list-updated';

/**
 * Get all bookmarked slugs from localStorage (safe for SSR)
 */
export function getReadingList(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Check if a specific slug is bookmarked
 */
export function isBookmarked(slug: string): boolean {
  if (!slug) return false;
  return getReadingList().includes(slug);
}

/**
 * Toggle bookmark for a slug
 */
export function toggleBookmark(slug: string): boolean {
  if (typeof window === 'undefined' || !slug) return false;
  try {
    const list = getReadingList();
    const index = list.indexOf(slug);
    let nextList: string[];
    let added: boolean;

    if (index >= 0) {
      nextList = list.filter((s) => s !== slug);
      added = false;
    } else {
      nextList = [slug, ...list];
      added = true;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { slug, added } }));
    return added;
  } catch {
    return false;
  }
}

/**
 * Remove bookmark
 */
export function removeBookmark(slug: string): void {
  if (typeof window === 'undefined' || !slug) return;
  try {
    const list = getReadingList();
    const nextList = list.filter((s) => s !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { slug, added: false } }));
  } catch {
    // Ignore error
  }
}

/**
 * Clear entire reading list
 */
export function clearReadingList(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { cleared: true } }));
  } catch {
    // Ignore error
  }
}

/**
 * React hook to reactively track and modify the reading list
 */
export function useReadingList() {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    setList(getReadingList());

    const handleUpdate = () => {
      setList(getReadingList());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    return toggleBookmark(slug);
  }, []);

  const remove = useCallback((slug: string) => {
    removeBookmark(slug);
  }, []);

  const clear = useCallback(() => {
    clearReadingList();
  }, []);

  const check = useCallback(
    (slug: string) => {
      return list.includes(slug);
    },
    [list]
  );

  return {
    list,
    count: list.length,
    isBookmarked: check,
    toggleBookmark: toggle,
    removeBookmark: remove,
    clearReadingList: clear,
  };
}

