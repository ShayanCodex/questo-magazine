import { useLanguage } from '../lib/lang-context';

export function ManifestoBanner() {
  const { t } = useLanguage();

  return (
    <section className="pt-10 sm:pt-14 border-t border-editorial-border">
      <div className="py-12 sm:py-16 px-6 sm:px-12 bg-editorial-text text-editorial-bg rounded-sm space-y-6 text-center sm:text-start relative overflow-hidden">
        <span className="font-sans text-xs uppercase tracking-widest text-editorial-bg/80 font-semibold block">
          Editorial Manifesto
        </span>

        <blockquote className="font-serif italic text-2xl sm:text-3xl lg:text-4xl leading-tight max-w-4xl opacity-95 text-editorial-bg">
          “{t.manifestoText}”
        </blockquote>

        <cite className="font-sans text-xs uppercase tracking-wider block text-editorial-bg/70 not-italic font-medium">
          — {t.manifestoAuthor}
        </cite>
      </div>
    </section>
  );
}

