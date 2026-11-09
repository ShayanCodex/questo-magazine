import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';

export function EditorialDisciplines() {
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  const disciplines = [
    {
      number: '01',
      categoryId: 'architecture-and-space',
      title: isRtl ? 'العمارة الأحادية والمكان' : 'Architecture & Spatial Design',
      desc: isRtl
        ? 'دراسات بصرية ومقالات نقدية تستكشف الهياكل الخرسانية والفراغات الصامتة.'
        : 'In-depth photographic essays exploring brutalist structures, tactile materials, and spatial silence.',
      tag: 'architecture',
      tagLabel: '#architecture',
      subcategories: [
        { id: 'minimalist-design', name: 'Minimalist Design' },
        { id: 'monuments-and-stone', name: 'Monuments & Stone' },
      ],
    },
    {
      number: '02',
      categoryId: 'design-and-typography',
      title: isRtl ? 'الحرفية الطباعية ونظم الشبكات' : 'Design & Typographic Systems',
      desc: isRtl
        ? 'بحث معمق في المدرسة السويسرية والخطوط والتقسيمات المعيارية الحديثة.'
        : 'Rigorous investigations into Swiss International typography, modular layout staves, and kinetic letterforms.',
      tag: 'design-systems',
      tagLabel: '#design-systems',
      subcategories: [
        { id: 'editorial-systems', name: 'Editorial Systems' },
        { id: 'grid-theory', name: 'Grid Theory' },
      ],
    },
    {
      number: '03',
      categoryId: 'art-and-culture',
      title: isRtl ? 'الفنون البصرية والنحت الكلاسيكي' : 'Art, Culture & Sculpture',
      desc: isRtl
        ? 'استكشاف بصري وفلسفي للأشكال الكلاسيكية والمنحوتات الصامدة والفن الحضري.'
        : 'Classical marble endurance, museum heritage studies, and monumental public street murals.',
      tag: 'art',
      tagLabel: '#art',
      subcategories: [
        { id: 'visual-arts', name: 'Visual Arts' },
        { id: 'sculpture', name: 'Sculpture' },
      ],
    },
    {
      number: '04',
      categoryId: 'engineering-and-technology',
      title: isRtl ? 'العمارة الرقمية وهندسة النظم' : 'Engineering & Static Systems',
      desc: isRtl
        ? 'بناء مواقع عديمة الخوادم وسريعة الاستجابة بأعلى معايير الأرشفة دون مكتبات ثقيلة.'
        : 'Architectural software essays, headless CMS philosophy, and zero-runtime static pre-rendering.',
      tag: 'engineering',
      tagLabel: '#engineering',
      subcategories: [
        { id: 'system-architecture', name: 'System Architecture' },
        { id: 'static-performance', name: 'Static Performance' },
      ],
    },
  ];

  return (
    <section className="pt-12 sm:pt-16 border-t border-editorial-border space-y-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {disciplines.map((item) => (
          <div
            key={item.number}
            className="group relative p-6 bg-editorial-surface border border-editorial-border rounded-sm hover:border-accent transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-editorial-muted/50 group-hover:text-accent transition-colors">
                  {item.number}
                </span>
                <Link
                  to={localePath(`/articles?category=${item.categoryId}`)}
                  className="p-1 rounded-sm text-editorial-muted group-hover:text-accent transition-colors"
                  aria-label={item.title}
                >
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </div>

              <h3 className="font-display font-bold text-xl text-editorial-text group-hover:text-accent transition-colors">
                <Link to={localePath(`/articles?category=${item.categoryId}`)}>
                  {item.title}
                </Link>
              </h3>

              <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed">
                {item.desc}
              </p>

              {/* Subcategories quick pills */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {item.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={localePath(`/articles?category=${item.categoryId}&subcategory=${sub.id}`)}
                    className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs bg-editorial-surface-subtle border border-editorial-border/60 hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-editorial-border/60 flex items-center justify-between">
              <Link
                to={localePath(`/articles?category=${item.categoryId}`)}
                className="inline-block text-[11px] font-mono uppercase tracking-wider text-editorial-text font-bold hover:text-accent transition-colors"
              >
                Browse Category →
              </Link>
              <Link
                to={localePath(`/tags/${item.tag}`)}
                className="text-[10px] font-mono uppercase tracking-wider text-editorial-muted hover:text-editorial-text transition-colors"
              >
                {item.tagLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

