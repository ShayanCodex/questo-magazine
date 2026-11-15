import { useState } from 'react';
import { useLanguage } from '../lib/lang-context';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '../lib/utils';
import { FAQ_LOCALIZED } from '../lib/page-translations';

export function EditorialFaq() {
  const { t, language } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqItems = FAQ_LOCALIZED[language.code] || FAQ_LOCALIZED.en;

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="pt-12 sm:pt-16 border-t border-editorial-border space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-accent block mb-2">
            {t.inquiriesAndStandards || 'Inquiries & Standards'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-editorial-text uppercase tracking-tight">
            {t.faqTitle}
          </h2>
        </div>
        <p className="font-serif text-sm sm:text-base text-editorial-muted max-w-md">
          {t.faqSubtitle}
        </p>
      </div>

      <div className="divide-y divide-editorial-border border-y border-editorial-border bg-editorial-surface/40 rounded-sm">
        {faqItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="transition-colors">
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
                className="w-full py-5 sm:py-6 px-4 sm:px-6 flex items-center justify-between text-start gap-4 hover:bg-editorial-surface/80 transition-colors cursor-pointer group"
              >
                <span className="font-display font-bold text-lg sm:text-xl text-editorial-text group-hover:text-accent transition-colors">
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={cn(
                    'h-5 w-5 text-editorial-muted shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180 text-accent'
                  )}
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${item.id}`}
                  className="px-4 sm:px-6 pb-6 pt-1 text-editorial-muted font-serif text-sm sm:text-base leading-relaxed border-t border-editorial-border/40"
                >
                  <p className="max-w-3xl">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

