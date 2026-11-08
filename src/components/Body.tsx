import type { ContentBlock } from '../lib/types';

export interface BodyProps {
  blocks: ContentBlock[];
}

export function Body({ blocks }: BodyProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="article-body font-serif text-editorial-text text-lg sm:text-[1.1875rem] leading-[1.8] max-w-[44rem] space-y-7 sm:space-y-8">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={index} className="text-editorial-text/95">
                {block.text}
              </p>
            );

          case 'h2':
            return (
              <h2
                key={index}
                className="font-display font-bold text-2xl sm:text-3xl text-editorial-text tracking-tight pt-6 sm:pt-8"
              >
                {block.text}
              </h2>
            );

          case 'h3':
            return (
              <h3
                key={index}
                className="font-display font-semibold text-xl sm:text-2xl text-editorial-text tracking-tight pt-4 sm:pt-6"
              >
                {block.text}
              </h3>
            );

          case 'ul':
            return (
              <ul
                key={index}
                className="list-disc list-outside ltr:pl-6 rtl:pr-6 space-y-2.5 text-editorial-text/90"
              >
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol
                key={index}
                className="list-decimal list-outside ltr:pl-6 rtl:pr-6 space-y-2.5 text-editorial-text/90"
              >
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ol>
            );

          case 'quote':
            return (
              <blockquote
                key={index}
                className="my-8 ltr:border-l-2 rtl:border-r-2 border-accent ltr:pl-6 rtl:pr-6 py-1 italic text-xl sm:text-2xl text-editorial-text/90 font-serif leading-relaxed"
              >
                <p>"{block.text}"</p>
                {block.cite && (
                  <cite className="block not-italic text-sm font-sans tracking-normal text-editorial-muted mt-3">
                    — {block.cite}
                  </cite>
                )}
              </blockquote>
            );

          case 'code':
            return (
              <div
                key={index}
                className="my-6 rounded-sm border border-editorial-border bg-editorial-surface overflow-x-auto text-sm font-mono"
              >
                {block.lang && (
                  <div className="px-4 py-1.5 border-b border-editorial-border text-xs uppercase tracking-wider text-editorial-muted/80 bg-editorial-border/20 flex justify-between items-center">
                    <span>{block.lang}</span>
                  </div>
                )}
                <pre className="p-4 sm:p-5 overflow-x-auto text-editorial-text leading-relaxed">
                  <code>{block.code}</code>
                </pre>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

