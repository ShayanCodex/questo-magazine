import { useState } from 'react';
import { useLanguage } from '../lib/lang-context';
import { CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export function EditorialDispatch() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="pt-12 sm:pt-16 border-t border-editorial-border">
      <div className="p-8 sm:p-12 bg-editorial-surface border border-editorial-border rounded-sm relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute end-0 bottom-0 text-[10rem] font-display font-black text-editorial-border/30 select-none pointer-events-none leading-none -mb-8 -me-8">
          03
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-text font-semibold flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4" />
              <span>Weekly Editorial Journal</span>
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-editorial-text uppercase tracking-tight">
              {t.newsletterTitle}
            </h2>
            <p className="font-serif text-sm sm:text-base text-editorial-muted leading-relaxed">
              {t.newsletterSubtitle}
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-sm font-medium">
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
              <span>{t.newsletterSuccess}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletterPlaceholder}
                required
                className="flex-1 bg-editorial-bg border border-editorial-border rounded-sm px-4 py-3 font-serif text-base text-editorial-text placeholder:text-editorial-muted/70 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-editorial-text text-editorial-bg font-mono text-xs uppercase tracking-wider font-semibold rounded-sm hover:opacity-90 transition-opacity cursor-pointer shrink-0 shadow-xs"
              >
                {t.newsletterButton}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

