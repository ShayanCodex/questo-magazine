import { useState } from 'react';
import { useLanguage } from '../lib/lang-context';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '../lib/utils';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function EditorialFaq() {
  const { t, language } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const isRtl = language.dir === 'rtl';

  const faqItems: FaqItem[] = isRtl
    ? [
        {
          id: 'faq-1',
          question: 'ما هي الفلسفة التحريرية لمجلة Questo؟',
          answer:
            'مجلة Questo هي منصة نشر بطيئة ومتأنية، تركز على العمارة والخطوط البصرية النقية والبرمجيات المصنوعة بحرفية عالية. نرفض ثقافة التغذية الخوارزمية الفوضوية والبرمجيات المتضخمة لصالح الوضوح والهدوء والجماليات الدائمة.',
        },
        {
          id: 'faq-2',
          question: 'كيف يمكن للكتاب والمعماريين تقديم مقالاتهم وأعمالهم؟',
          answer:
            'نرحب بالمقالات المعمارية والدراسات البصرية والنقدية المستقلة. يمكنك تقديم مقترحاتك عبر آلية Pull Request التحريرية في مستودع GitHub الخاص بنا أو التواصل مع هيئة التحرير عبر البريد.',
        },
        {
          id: 'faq-3',
          question: 'كيف تحقق المجلة سرعة فائقة عبر ست لغات عالمية؟',
          answer:
            'تُكتب مقالاتنا بملفات JSON وتُجمع مسبقاً في ملفات HTML ثابتة عند كل بناء، دون أي قواعد بيانات في وقت التشغيل أو طلبات عميل تؤخر التحميل، مما يضمن أرشفة محركات البحث الفورية وسرعة تصفح فائقة.',
        },
        {
          id: 'faq-4',
          question: 'أين يمكن شراء النسخة الورقية المطبوعة (العدد 03)؟',
          answer:
            'العدد 03 متاح في إصدار محدود من 1500 نسخة مرقمة يدوياً ومطبوعة على ورق إيطالي غير مصقول. تتوفر النسخ في مكتبات العمارة المختارة في برلين ولندن وطوكيو وموزعة للمشتركين.',
        },
        {
          id: 'faq-5',
          question: 'كيف تراعي المجلة خصوصية الخطوط العربية والأردية واتجاه اليمين لليسار؟',
          answer:
            'اللغتان العربية والأردية تحظيان باهتمام تحريري كامل وليستا مجرد ترجمة آلية. تعتمد المنصة خطوط Noto Naskh و Noto Nastaliq مع قلب كامل لتخطيط الصفحات والقوائم والأيقونات بما يناسب ثقافة القارئ.',
        },
      ]
    : [
        {
          id: 'faq-1',
          question: 'What is the editorial philosophy of Questo Magazine?',
          answer:
            'Questo is an intentional slow-publishing platform dedicated to spatial silence, rigorous typography, and handcrafted software. We deliberately reject infinite algorithmic feeds and bloated client-side code in favor of permanence, clarity, and deep reading.',
        },
        {
          id: 'faq-2',
          question: 'How can independent writers, architects, and photographers submit work?',
          answer:
            'We welcome unsolicited architectural monographs, visual culture essays, and critical studies. Submissions must adhere to our zero-filler editorial standard. You may submit proposals directly via our GitHub CMS pull-request workflow or through our editorial desk.',
        },
        {
          id: 'faq-3',
          question: 'How does Questo achieve zero-runtime latency across 6 languages?',
          answer:
            'Articles are authored in clean JSON and pre-rendered into static standalone HTML at build time using vite-react-ssg. There are zero runtime database queries, no client-side fetching waterfalls, and no hydration delays. Clean URLs are distributed globally via Cloudflare edge caches.',
        },
        {
          id: 'faq-4',
          question: 'Where can I purchase the physical print edition (Issue 03 / 2026)?',
          answer:
            'Issue 03 ("Art & Life") is produced in a limited edition of 1,500 hand-numbered copies on 120gsm Fedrigoni Tintoretto uncoated paper. Available in selected design bookshops across Berlin, London, Tokyo, and via our direct subscriber quarterly dispatch.',
        },
        {
          id: 'faq-5',
          question: 'How do the Arabic and Urdu editions maintain bidirectional typographic integrity?',
          answer:
            'Arabic and Urdu are first-class publications with dedicated typographic hierarchy. The platform dynamically renders native right-to-left layout (dir="rtl"), mirrored typographic staves, flipped navigation drawers, and custom webfonts (Noto Naskh Arabic & Noto Nastaliq Urdu).',
        },
      ];

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="pt-12 sm:pt-16 border-t border-editorial-border space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block mb-2">
            Inquiries &amp; Standards
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-editorial-text uppercase tracking-tight">
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

