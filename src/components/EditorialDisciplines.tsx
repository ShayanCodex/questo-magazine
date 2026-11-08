import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';

export function EditorialDisciplines() {
  const { t, localePath, language } = useLanguage();
  const isRtl = language.dir === 'rtl';

  const disciplines = [
    {
      number: '01',
      title: isRtl ? 'العمارة الأحادية والمكان' : 'Monographic Architecture & Space',
      desc: isRtl
        ? 'دراسات بصرية ومقالات نقدية تستكشف الهياكل الخرسانية والفراغات الصامتة.'
        : 'In-depth photographic essays exploring brutalist structures, tactile materials, and spatial silence.',
      tag: 'architecture',
      tagLabel: '#architecture',
    },
    {
      number: '02',
      title: isRtl ? 'الحرفية الطباعية ونظم الشبكات' : 'Typographic Craft & Grid Systems',
      desc: isRtl
        ? 'بحث معمق في المدرسة السويسرية والخطوط والتقسيمات المعيارية الحديثة.'
        : 'Rigorous investigations into Swiss International typography, modular layout staves, and kinetic letterforms.',
      tag: 'craft',
      tagLabel: '#craft',
    },
    {
      number: '03',
      title: isRtl ? 'الطباعة المادية والمجلات الدورية' : 'Physical Print & Quarterly Editions',
      desc: isRtl
        ? 'إصدارات مطبوعة على ورق فيدريغوني الإيطالي الفاخر بتجليد خياطة يدوي محدود.'
        : 'Tangible publishing printed on 120gsm Fedrigoni uncoated paper with Smyth-sewn binding and foil-stamped covers.',
      tag: 'art',
      tagLabel: '#art',
    },
    {
      number: '04',
      title: isRtl ? 'العمارة الرقمية الثابتة' : 'Static Engineering & Clean Web',
      desc: isRtl
        ? 'بناء مواقع عديمة الخوادم وسريعة الاستجابة بأعلى معايير الأرشفة دون مكتبات ثقيلة.'
        : 'Architectural software essays, headless CMS philosophy, and zero-runtime static pre-rendering.',
      tag: 'engineering',
      tagLabel: '#engineering',
    },
  ];

  return (
    <section className="pt-12 sm:pt-16 border-t border-editorial-border space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block mb-2">
            Pillars &amp; Niches
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
                  to={localePath(`/tags/${item.tag}`)}
                  className="p-1 rounded-sm text-editorial-muted group-hover:text-accent transition-colors"
                  aria-label={item.title}
                >
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </div>

              <h3 className="font-display font-bold text-xl text-editorial-text group-hover:text-accent transition-colors">
                {item.title}
              </h3>

              <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-editorial-border/60">
              <Link
                to={localePath(`/tags/${item.tag}`)}
                className="inline-block text-[11px] font-mono uppercase tracking-wider text-editorial-muted hover:text-accent transition-colors"
              >
                {item.tagLabel} →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
