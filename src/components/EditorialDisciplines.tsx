import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { ArrowUpRightIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

export function EditorialDisciplines() {
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  const disciplines = [
    {
      number: '01',
      categoryId: 'architecture-and-space',
      categoryShort: isRtl ? 'عمارة' : 'Architecture',
      title: isRtl ? 'العمارة الأحادية والمكان' : 'Architecture & Spatial Design',
      desc: isRtl
        ? 'دراسات بصرية ومقالات نقدية تستكشف الهياكل الخرسانية والفراغات الصامتة.'
        : 'In-depth photographic essays exploring brutalist structures, tactile materials, and spatial silence.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      tag: 'architecture',
      tagLabel: '#architecture',
      subcategories: [
        { id: 'minimalist-design', name: isRtl ? 'تصميم تبسيطي' : 'Minimalist Design' },
        { id: 'monuments-and-stone', name: isRtl ? 'نصب وحجارة' : 'Monuments & Stone' },
      ],
    },
    {
      number: '02',
      categoryId: 'design-and-typography',
      categoryShort: isRtl ? 'تصميم' : 'Design',
      title: isRtl ? 'الحرفية الطباعية ونظم الشبكات' : 'Design & Typographic Systems',
      desc: isRtl
        ? 'بحث معمق في المدرسة السويسرية والخطوط والتقسيمات المعيارية الحديثة.'
        : 'Rigorous investigations into Swiss International typography, modular layout staves, and kinetic letterforms.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      tag: 'design-systems',
      tagLabel: '#design-systems',
      subcategories: [
        { id: 'editorial-systems', name: isRtl ? 'نظم تحريرية' : 'Editorial Systems' },
        { id: 'grid-theory', name: isRtl ? 'نظرية الشبكة' : 'Grid Theory' },
      ],
    },
    {
      number: '03',
      categoryId: 'art-and-culture',
      categoryShort: isRtl ? 'فن وثقافة' : 'Art & Culture',
      title: isRtl ? 'الفنون البصرية والنحت الكلاسيكي' : 'Art, Culture & Sculpture',
      desc: isRtl
        ? 'استكشاف بصري وفلسفي للأشكال الكلاسيكية والمنحوتات الصامدة والفن الحضري.'
        : 'Classical marble endurance, museum heritage studies, and monumental public street murals.',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      tag: 'art',
      tagLabel: '#art',
      subcategories: [
        { id: 'visual-arts', name: isRtl ? 'فنون بصرية' : 'Visual Arts' },
        { id: 'sculpture', name: isRtl ? 'نحت' : 'Sculpture' },
      ],
    },
    {
      number: '04',
      categoryId: 'engineering-and-technology',
      categoryShort: isRtl ? 'هندسة' : 'Tech',
      title: isRtl ? 'العمارة الرقمية وهندسة النظم' : 'Engineering & Static Systems',
      desc: isRtl
        ? 'بناء مواقع عديمة الخوادم وسريعة الاستجابة بأعلى معايير الأرشفة دون مكتبات ثقيلة.'
        : 'Architectural software essays, headless CMS philosophy, and zero-runtime static pre-rendering.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      tag: 'engineering',
      tagLabel: '#engineering',
      subcategories: [
        { id: 'system-architecture', name: isRtl ? 'هندسة النظم' : 'System Architecture' },
        { id: 'static-performance', name: isRtl ? 'أداء ثابت' : 'Static Performance' },
      ],
    },
  ];

  return (
    <section id="disciplines" className="pt-12 sm:pt-16 border-t border-editorial-border space-y-8">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block mb-2">
            Categories &amp; Subcategories
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-editorial-text uppercase tracking-tight">
            {t.editorialDisciplines}
          </h2>
        </div>
        <p className="font-serif text-sm sm:text-base text-editorial-muted max-w-md">
          {t.disciplinesSubtitle}
        </p>
      </div>

      {/* Modern Responsive Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {disciplines.map((item) => (
          <div
            key={item.number}
            className="group relative bg-editorial-surface border border-editorial-border rounded-2xl overflow-hidden hover:border-editorial-text hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* 1. Visual Image Banner with Badges */}
            <Link
              to={localePath(`/articles?category=${item.categoryId}`)}
              className="block relative aspect-[16/10] overflow-hidden bg-editorial-surface-subtle"
              title={item.title}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Subtle directional gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

              {/* Number Badge (Top-Start) */}
              <div className="absolute top-3 start-3">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-xs">
                  {item.number}
                </span>
              </div>

              {/* Category Pill (Bottom-Start) */}
              <div className="absolute bottom-2.5 start-3">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-neutral-950 backdrop-blur-xs shadow-xs">
                  {item.categoryShort}
                </span>
              </div>

              {/* Interactive Arrow Icon (Top-End) */}
              <div className="absolute top-3 end-3">
                <span className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-neutral-950 transition-all shadow-xs">
                  <ArrowUpRightIcon className="h-3.5 w-3.5 rtl:rotate-90" />
                </span>
              </div>
            </Link>

            {/* 2. Card Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg sm:text-xl leading-snug text-editorial-text group-hover:text-accent transition-colors">
                  <Link to={localePath(`/articles?category=${item.categoryId}`)}>
                    {item.title}
                  </Link>
                </h3>

                <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>

              {/* Subcategories & Action Row */}
              <div className="space-y-3 pt-1">
                {/* Subcategories Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {item.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={localePath(`/articles?category=${item.categoryId}&subcategory=${sub.id}`)}
                      className="text-[11px] font-sans font-medium px-2.5 py-1 rounded-full bg-editorial-surface-subtle border border-editorial-border/70 hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>

                {/* Bottom Action Row: Clean & Professional single line */}
                <div className="pt-3 border-t border-editorial-border/60 flex items-center justify-between gap-2 text-xs font-sans">
                  <Link
                    to={localePath(`/articles?category=${item.categoryId}`)}
                    className="font-medium text-editorial-text hover:text-accent transition-colors flex items-center gap-1 group/link"
                  >
                    <span>Browse</span>
                    <ArrowRightIcon className="h-3 w-3 rtl:rotate-180 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                  <Link
                    to={localePath(`/tags/${item.tag}`)}
                    className="font-mono text-[11px] text-editorial-muted hover:text-editorial-text transition-colors"
                  >
                    {item.tagLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
