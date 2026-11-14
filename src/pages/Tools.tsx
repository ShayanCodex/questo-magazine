import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PhotoIcon,
  MusicalNoteIcon,
  DocumentTextIcon,
  BanknotesIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useLanguage } from '../lib/lang-context';

interface ToolItem {
  id: string;
  slug: string;
  title: string;
  category: 'media' | 'audio' | 'document' | 'finance' | 'health';
  categoryLabel: string;
  description: string;
  techBadge: string;
  icon: typeof PhotoIcon;
  badge: string;
}

const TOOLS_CATALOG: ToolItem[] = [
  {
    id: 'image-converter',
    slug: '/tools/image-converter',
    title: 'Image Converter & Optimization Engine',
    category: 'media',
    categoryLabel: 'Media & Imaging',
    description:
      'Client-side image conversion, compression, and dimension resizing between WebP, PNG, and JPEG using HTML5 Canvas & Blob APIs. Zero file uploads, 100% private.',
    techBadge: 'HTML5 Canvas • Blob API',
    icon: PhotoIcon,
    badge: 'Zero Upload',
  },
  {
    id: 'audio-extractor',
    slug: '/tools/audio-extractor',
    title: 'Browser Video-to-Audio Extractor',
    category: 'audio',
    categoryLabel: 'Audio & Speech',
    description:
      'Extract and isolate high-fidelity audio soundtracks from MP4, WebM, and MOV video files directly in your browser using the native Web Audio API and MediaRecorder.',
    techBadge: 'Web Audio API • Stream Capture',
    icon: MusicalNoteIcon,
    badge: 'Web Audio',
  },
  {
    id: 'pdf-tools',
    slug: '/tools/pdf-tools',
    title: 'Client-Side PDF Document Suite',
    category: 'document',
    categoryLabel: 'Document Architecture',
    description:
      'Format, generate, inspect metadata, and print publication-grade PDF documents using CSS paged media and local client file readers. Zero remote server dependency.',
    techBadge: 'CSS Paged Media • Local FileReader',
    icon: DocumentTextIcon,
    badge: 'CSS Paged',
  },
  {
    id: 'financial-calculator',
    slug: '/tools/financial-calculator',
    title: 'Financial Intelligence & Wealth Calculator',
    category: 'finance',
    categoryLabel: 'Financial Markets',
    description:
      'Model compound interest wealth trajectories with interactive SVG curves, mortgage amortization breakdowns, and long-term inflation purchasing power erosion.',
    techBadge: 'SVG Charting • Amortization Formulas',
    icon: BanknotesIcon,
    badge: 'SVG Graph',
  },
  {
    id: 'health-calculator',
    slug: '/tools/health-calculator',
    title: 'Metabolic & Health Architecture Calculator',
    category: 'health',
    categoryLabel: 'Health & Physiology',
    description:
      'Clinical Mifflin-St Jeor formulations to calculate BMI, BMR, total daily energy expenditure (TDEE), and precision macro-nutrient allocations without data transmission.',
    techBadge: 'Mifflin-St Jeor • Macro Partitioning',
    icon: HeartIcon,
    badge: 'Clinical Math',
  },
];

export function Tools() {
  const { t, localePath } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: 'Interactive Utilities' },
  ];

  const filteredTools = useMemo(() => {
    return TOOLS_CATALOG.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      <Seo
        title="Zero-Server Interactive Utilities Suite — 100% In-Browser Tools | Questo Magazine"
        description="A curated suite of zero-server-cost, open-source JavaScript utilities including image converters, video-to-audio extractors, PDF tools, and financial/health calculators."
        pathname="/tools"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Section */}
      <div className="space-y-4 border-b border-editorial-border pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-editorial-surface border border-editorial-border text-editorial-text">
          <CpuChipIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero Server Cost • 100% Browser Execution • Absolute Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-sans tracking-tight text-editorial-text">
          Interactive Utility Suite
        </h1>
        <p className="font-serif text-editorial-muted text-base sm:text-lg leading-relaxed max-w-3xl">
          High-performance, open-source client utilities executing directly inside your browser runtime. Powered by HTML5 Canvas, Web Audio API, and CSS Paged Media. No file uploads, no tracking, and zero remote latency.
        </p>

        {/* Search & Category Filter */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Horizontal Category Nav */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none font-sans text-xs">
            {[
              { id: 'all', label: 'All Utilities' },
              { id: 'media', label: 'Image & Media' },
              { id: 'audio', label: 'Audio & Speech' },
              { id: 'document', label: 'PDF & Documents' },
              { id: 'finance', label: 'Financial' },
              { id: 'health', label: 'Health & Bio' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap border transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-editorial-text text-editorial-bg border-editorial-text font-bold'
                    : 'bg-editorial-surface text-editorial-muted border-editorial-border hover:text-editorial-text hover:border-editorial-text'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <MagnifyingGlassIcon className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-editorial-muted" />
            <input
              type="text"
              placeholder="Filter utilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-editorial-surface border border-editorial-border rounded-full ps-9 pe-3 py-1.5 text-xs font-sans text-editorial-text focus:outline-hidden focus:border-editorial-text"
            />
          </div>
        </div>
      </div>

      {/* Utilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={localePath(tool.slug)}
              className="group flex flex-col justify-between p-6 rounded-xl bg-editorial-surface border border-editorial-border hover:border-editorial-text/70 transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-editorial-bg border border-editorial-border flex items-center justify-center text-editorial-text group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-editorial-bg border border-editorial-border text-editorial-muted">
                    {tool.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 font-semibold block">
                    {tool.categoryLabel}
                  </span>
                  <h3 className="text-base font-bold font-sans text-editorial-text group-hover:text-accent transition-colors leading-snug">
                    {tool.title}
                  </h3>
                  <p className="text-xs font-serif text-editorial-muted leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-editorial-border flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-editorial-muted truncate max-w-[200px]">
                  {tool.techBadge}
                </span>
                <span className="inline-flex items-center gap-1 font-sans font-semibold text-editorial-text group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  Launch
                  <ArrowRightIcon className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="py-16 text-center text-editorial-muted">
          <p className="font-serif text-lg">No interactive utilities matched your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-mono text-emerald-500 underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Performance & E-E-A-T Architecture Notes */}
      <div className="pt-8 border-t border-editorial-border grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs text-editorial-muted">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-editorial-text font-semibold uppercase tracking-wider">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
            <span>Zero Server Costs</span>
          </div>
          <p className="font-serif text-sm leading-relaxed">
            Every computation and transformation runs inside your browser using V8 / SpiderMonkey client threads. No cloud computing overhead or hosting charges.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-editorial-text font-semibold uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4 text-emerald-500" />
            <span>Absolute Data Privacy</span>
          </div>
          <p className="font-serif text-sm leading-relaxed">
            Because media, PDFs, and biometric metrics never leave your device, your sensitive assets remain completely confidential and offline-capable.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-editorial-text font-semibold uppercase tracking-wider">
            <CpuChipIcon className="w-4 h-4 text-emerald-500" />
            <span>Instantaneous Execution</span>
          </div>
          <p className="font-serif text-sm leading-relaxed">
            Eliminates round-trip HTTP requests and network congestion bottlenecks, guaranteeing sub-50ms instantaneous UI feedback.
          </p>
        </div>
      </div>
    </div>
  );
}
