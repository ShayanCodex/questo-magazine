import { useState, useEffect, useRef } from 'react';
import {
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../lib/utils';

export interface QuoteSelectionPopupProps {
  author?: string;
  articleTitle?: string;
}

export function QuoteSelectionPopup({
  author = 'Questo Magazine',
  articleTitle = '',
}: QuoteSelectionPopupProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (typeof window === 'undefined') return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setPosition(null);
        setSelectedText('');
        setCopied(false);
        return;
      }

      const text = selection.toString().trim();
      // Only trigger on meaningful selections (> 12 characters, < 300 characters)
      if (text.length < 12 || text.length > 300) {
        setPosition(null);
        setSelectedText('');
        return;
      }

      // Check if selection is within the article content
      const range = selection.getRangeAt(0);
      const commonAncestor = range.commonAncestorContainer;
      const element =
        commonAncestor.nodeType === Node.ELEMENT_NODE
          ? (commonAncestor as HTMLElement)
          : commonAncestor.parentElement;

      if (!element || !element.closest('article')) {
        setPosition(null);
        setSelectedText('');
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSelectedText(text);
        setPosition({
          top: rect.top + window.scrollY - 44, // position 44px above selection
          left: rect.left + window.scrollX + rect.width / 2, // horizontally centered
        });
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, []);

  const handleCopyQuote = async () => {
    if (!selectedText || typeof window === 'undefined') return;

    const citation = `"${selectedText}"\n— ${author}, ${articleTitle ? `"${articleTitle}"` : 'Questo Magazine'}\n${window.location.href}`;
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setPosition(null);
      }, 1500);
    } catch {
      // Ignore copy error
    }
  };

  const handleShareTwitter = () => {
    if (!selectedText || typeof window === 'undefined') return;
    const tweetText = `"${selectedText.slice(0, 180)}..." via @QuestoMag`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setPosition(null);
  };

  if (!position) return null;

  return (
    <div
      ref={popupRef}
      className={cn(
        'fixed z-50 -translate-x-1/2 flex items-center gap-1 p-1 rounded-full bg-neutral-950 text-white border border-white/20 shadow-2xl backdrop-blur-md text-xs font-sans font-medium transition-all animate-in fade-in zoom-in-95 duration-150 select-none'
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button
        type="button"
        onClick={handleCopyQuote}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
        title="Copy Quote with Citation"
      >
        {copied ? (
          <ClipboardDocumentCheckIcon className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <DocumentDuplicateIcon className="h-3.5 w-3.5 text-white/80" />
        )}
        <span>{copied ? 'Copied Quote!' : 'Copy Quote'}</span>
      </button>

      <div className="w-px h-3 bg-white/20" />

      <button
        type="button"
        onClick={handleShareTwitter}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white/90 hover:text-white"
        title="Share quote to X"
        aria-label="Share quote on X"
      >
        <span className="font-bold text-xs">𝕏</span>
        <span>Share</span>
      </button>
    </div>
  );
}
