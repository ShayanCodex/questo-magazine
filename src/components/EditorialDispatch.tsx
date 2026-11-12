import { useState } from 'react';
import { useLanguage } from '../lib/lang-context';
import { CheckCircleIcon, EnvelopeIcon, SparklesIcon } from '@heroicons/react/24/outline';

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
      <div className="relative rounded-2xl border border-editorial-border overflow-hidden p-8 sm:p-14 lg:p-16 shadow-2xl group">
        {/* Awwwards Editorial Background Photography - Full color, crisp, and vibrant */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"
            alt="Editorial Dispatch architectural monograph background"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            loading="lazy"
          />
          {/* Directional gradient: High readability on text side, crystal-clear full color on the remaining 65%+ of the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 pointer-events-none rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Subtle decorative watermark */}
        <div className="absolute end-0 bottom-0 text-[10rem] sm:text-[14rem] font-display font-black text-white/10 select-none pointer-events-none leading-none -mb-10 -me-10 z-0">
          DISPATCH
        </div>

        <div className="relative z-10 max-w-2xl space-y-6 text-white">
          <div className="space-y-3">
            <span className="text-xs font-sans text-white/90 font-medium flex items-center gap-2 drop-shadow-sm">
              <span className="p-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                <EnvelopeIcon className="h-3.5 w-3.5 text-white" />
              </span>
              <span>Weekly Editorial Journal</span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 text-white font-medium">
                <SparklesIcon className="h-3 w-3" />
                <span>Zero Spam</span>
              </span>
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] leading-tight">
              {t.newsletterTitle}
            </h2>

            <p className="font-serif text-sm sm:text-base text-white/95 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] max-w-xl">
              {t.newsletterSubtitle}
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-500/30 backdrop-blur-md border border-emerald-400/50 rounded-xl text-emerald-100 flex items-center gap-3 text-sm font-medium shadow-lg">
              <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-300" />
              <span>{t.newsletterSuccess}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.newsletterPlaceholder}
                  required
                  className="w-full bg-black/60 backdrop-blur-md border border-white/35 rounded-full px-5 py-3 font-serif text-sm sm:text-base text-white placeholder:text-white/70 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/40 transition-all shadow-md"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3 bg-white text-neutral-950 font-sans text-xs font-semibold rounded-full hover:bg-neutral-100 hover:shadow-xl transition-all cursor-pointer shrink-0 shadow-md"
              >
                {t.newsletterButton}
              </button>
            </form>
          )}

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-sans font-medium uppercase tracking-wider text-white/80 pt-2 drop-shadow-sm">
            <span>• Delivered every Sunday</span>
            <span>• Unsubscribe anytime</span>
            <span>• 1,500+ Curated Readers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
