import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../lib/theme-context';
import { useLanguage } from '../lib/lang-context';
import { cn } from '../lib/utils';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const label = isDark
    ? t.lightMode || 'Light theme'
    : t.darkMode || 'Dark theme';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-sm bg-editorial-surface border border-editorial-border hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer min-h-[36px] min-w-[36px] justify-center shadow-2xs',
        className
      )}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <SunIcon className="h-4 w-4 text-editorial-text transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <MoonIcon className="h-4 w-4 text-editorial-text transition-transform duration-300 group-hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-mono uppercase tracking-wider font-medium text-editorial-text">
          {label}
        </span>
      )}
    </button>
  );
}

