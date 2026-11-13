import { useState } from 'react';
import {
  PaperAirplaneIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function Contact() {
  const { t, localePath } = useLanguage();

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'architecture-and-space',
    pitchTitle: '',
    synopsis: '',
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: 'Contact & Pitch' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.pitchTitle && formData.synopsis) {
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-12 max-w-3xl mx-auto font-sans">
      <Seo
        title="Contact & Pitch Monograph — Questo Magazine"
        description="Submit an editorial pitch, photographic study, or architectural monograph to Questo Magazine editors."
        pathname="/contact"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <header className="space-y-4 border-b border-editorial-border pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent block">
          Editorial Inquiries &amp; Submissions
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-editorial-text uppercase tracking-tight">
          Pitch an Essay or Monograph
        </h1>
        <p className="font-serif text-base sm:text-lg text-editorial-muted leading-relaxed">
          Questo welcomes submissions from architects, typographers, structural historians, and systems engineers. We prioritize original photographic documentation and rigorous critical arguments.
        </p>
      </header>

      {/* Pitch Guidelines */}
      <section className="p-6 rounded-2xl border border-editorial-border bg-editorial-surface-subtle space-y-3">
        <h2 className="font-display font-bold text-base uppercase tracking-tight text-editorial-text flex items-center gap-2">
          <InformationCircleIcon className="h-4 w-4 text-accent" />
          <span>Submission Standards</span>
        </h2>
        <ul className="text-xs font-serif text-editorial-muted space-y-1.5 list-disc list-inside">
          <li>Essays typically range between 1,800 and 4,500 words with primary source citations.</li>
          <li>Photographic essays must include 300+ DPI archival imagery or original photographic proofs.</li>
          <li>We review pitches every Tuesday and respond within 5 business days.</li>
        </ul>
      </section>

      {/* Interactive Form */}
      {submitted ? (
        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-center space-y-4">
          <CheckCircleIcon className="h-12 w-12 text-emerald-500 mx-auto" />
          <h3 className="font-display font-black text-2xl uppercase tracking-tight text-editorial-text">
            Pitch Received
          </h3>
          <p className="font-serif text-sm text-editorial-muted max-w-md mx-auto">
            Thank you, <strong className="text-editorial-text">{formData.name}</strong>. Your synopsis for <em>&ldquo;{formData.pitchTitle}&rdquo;</em> has been queued for review by our editorial desk.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', category: 'architecture-and-space', pitchTitle: '', synopsis: '' });
            }}
            className="px-5 py-2 text-xs font-sans font-semibold uppercase tracking-wider rounded-full border border-editorial-border hover:border-editorial-text transition-colors cursor-pointer"
          >
            Submit Another Pitch
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl border border-editorial-border bg-editorial-surface shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-editorial-text">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Marcus Thorne"
                className="w-full px-4 py-2.5 rounded-lg border border-editorial-border bg-editorial-bg text-editorial-text text-sm focus:outline-hidden focus:border-editorial-text transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-editorial-text">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="marcus@studio.com"
                className="w-full px-4 py-2.5 rounded-lg border border-editorial-border bg-editorial-bg text-editorial-text text-sm focus:outline-hidden focus:border-editorial-text transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-editorial-text">
              Target Discipline <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-editorial-border bg-editorial-bg text-editorial-text text-sm focus:outline-hidden focus:border-editorial-text transition-colors cursor-pointer"
            >
              <option value="architecture-and-space">Architecture &amp; Spatial Design</option>
              <option value="design-and-typography">Design &amp; Typographic Systems</option>
              <option value="art-and-culture">Art, Culture &amp; Sculpture</option>
              <option value="engineering-and-technology">Engineering &amp; Static Systems</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="pitchTitle" className="block text-xs font-semibold uppercase tracking-wider text-editorial-text">
              Working Working Monograph Title <span className="text-red-500">*</span>
            </label>
            <input
              id="pitchTitle"
              type="text"
              required
              value={formData.pitchTitle}
              onChange={(e) => setFormData({ ...formData, pitchTitle: e.target.value })}
              placeholder="e.g. Acoustic Reverberation in Romanesque Vaults"
              className="w-full px-4 py-2.5 rounded-lg border border-editorial-border bg-editorial-bg text-editorial-text text-sm focus:outline-hidden focus:border-editorial-text transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="synopsis" className="block text-xs font-semibold uppercase tracking-wider text-editorial-text">
              Synopsis &amp; Primary Thesis <span className="text-red-500">*</span>
            </label>
            <textarea
              id="synopsis"
              required
              rows={5}
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              placeholder="Outline the core architectural thesis, material documentation, and why this piece belongs in Questo..."
              className="w-full px-4 py-2.5 rounded-lg border border-editorial-border bg-editorial-bg text-editorial-text text-sm focus:outline-hidden focus:border-editorial-text transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-editorial-text text-editorial-bg hover:opacity-90 font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            <span>Transmit Editorial Pitch</span>
          </button>
        </form>
      )}

      {/* Direct Inquiries */}
      <footer className="pt-8 border-t border-editorial-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-editorial-muted">
        <div>
          <span className="font-semibold text-editorial-text block">Direct Editorial Desk</span>
          <span>editor@questo-magazine.org</span>
        </div>
        <div>
          <span className="font-semibold text-editorial-text block">Press &amp; Syndication</span>
          <span>syndicate@questo-magazine.org</span>
        </div>
      </footer>
    </div>
  );
}
