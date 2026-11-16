export interface LocalizedPillar {
  number: string;
  title: string;
  desc: string;
}

export interface LocalizedAbout {
  breadcrumb: string;
  badge: string;
  title: string;
  subtitle: string;
  pillarsTitle: string;
  pillars: LocalizedPillar[];
  mastheadTitle: string;
  mastheadSubtitle: string;
  mastheadBadge: string;
  moreBy: string;
  ethicsTitle: string;
  ethicsDesc: string;
}

export interface LocalizedContact {
  breadcrumb: string;
  badge: string;
  title: string;
  subtitle: string;
  standardsTitle: string;
  standards: string[];
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  categoryLabel: string;
  pitchTitleLabel: string;
  pitchTitlePlaceholder: string;
  synopsisLabel: string;
  synopsisPlaceholder: string;
  submitButton: string;
  successTitle: string;
  successDesc: (name: string, title: string) => string;
  submitAnother: string;
}

export interface LocalizedLegalSection {
  title: string;
  body: string;
}

export interface LocalizedTerms {
  breadcrumb: string;
  badge: string;
  title: string;
  version: string;
  sections: LocalizedLegalSection[];
}

export interface LocalizedPrivacy {
  title: string;
  backToPub: string;
  badge: string;
  h1: string;
  subtitle: string;
  cookieTitle: string;
  cookieDesc: string;
  storageTitle: string;
  storageDesc: string;
  storageItems: { key: string; desc: string }[];
  rightsTitle: string;
  rightsDesc: string;
}

export interface LocalizedMarketsPage {
  breadcrumb: string;
  badgePlatform: string;
  badgeExchanges: string;
  badgeZeroPaywall: string;
  title: string;
  subtitle: string;
  jumpTo: string;
  sections: { id: string; label: string }[];
}

export interface LocalizedToolItem {
  id: string;
  slug: string;
  title: string;
  category: 'media' | 'audio' | 'document' | 'finance' | 'health';
  categoryLabel: string;
  description: string;
  techBadge: string;
  badge: string;
}

export interface LocalizedToolsPage {
  breadcrumb: string;
  badge: string;
  title: string;
  subtitle: string;
  badgeClient: string;
  badgeZeroUpload: string;
  badgePrivacy: string;
  filterLabel: string;
  categories: { id: string; label: string }[];
  searchPlaceholder: string;
  launchTool: string;
  tools: LocalizedToolItem[];
}

export interface LocalizedFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LocalizedDiscipline {
  number: string;
  categoryId: string;
  categoryShort: string;
  title: string;
  desc: string;
  tag: string;
  tagLabel: string;
  image: string;
  subcategories: { id: string; name: string }[];
}

export interface LocalizedSpotlight {
  badge: string;
  location: string;
  title: string;
  critiqueTag: string;
  essayTitle: string;
  essayDesc: string;
  quote: string;
  authorLabel: string;
  authorName: string;
  authorSlug: string;
  readAction: string;
}

// -------------------------------------------------------------
// 1. ABOUT PAGE TRANSLATIONS
// -------------------------------------------------------------
export const ABOUT_PAGE: Record<string, LocalizedAbout> = {
  en: {
    breadcrumb: 'About & Masthead',
    badge: 'Independent Journal of Architecture & Craft',
    title: 'The Poetics of Mass, Grid & Permanence',
    subtitle: 'Questo was established in 2024 as an antidote to ephemeral algorithmic feeds. We publish rigorous, long-form monographs investigating tactile material craft, Swiss International typography, monumental architecture, and zero-runtime digital systems.',
    pillarsTitle: 'Our Four Core Pillars',
    pillars: [
      {
        number: '01',
        title: 'Material Endurance',
        desc: 'We champion physical stone, board-marked brutalist concrete, and hand-joined timber over disposable digital ephemera.',
      },
      {
        number: '02',
        title: 'Typographic Rigor',
        desc: 'Rooted in the Basel and Zurich schools of graphic design, every layout adheres to mathematical proportions and structural clarity.',
      },
      {
        number: '03',
        title: 'Zero-Runtime Minimalism',
        desc: 'In software as in architecture, unnecessary complexity is liability. We engineer lean, statically generated publishing architectures.',
      },
      {
        number: '04',
        title: 'Global Multilingual Reach',
        desc: 'Culture is universal. Every monograph is curated and distributed across six global languages with bidirectional RTL typography.',
      },
    ],
    mastheadTitle: 'The Masthead & Contributing Critics',
    mastheadSubtitle: 'Biographies and monographs by our permanent writing desk.',
    mastheadBadge: 'Editorial Board',
    moreBy: 'More by',
    ethicsTitle: 'Editorial Independence & Standards',
    ethicsDesc: 'Questo operates with complete editorial autonomy. We accept no paid placements, sponsored reviews, or native advertising within our monograph series. All photographic essays, historical citations, and architectural analyses undergo rigorous peer review prior to publication.',
  },
  ur: {
    breadcrumb: 'ہمارے بارے میں اور ادارتی بورڈ',
    badge: 'فنِ تعمیر اور دستکاری کا آزاد بین الاقوامی جریدہ',
    title: 'مادہ، گرڈ اور پائیداری کی بصری جمالیات',
    subtitle: 'کوئسٹو کا قیام 2024 میں سستی الگورتھمک فیڈز کے متبادل کے طور پر عمل میں آیا۔ ہم ٹھوس مادی کاریگری، سوئس طباعتی نظم، یادگاری تعمیرات اور زیرو رن ٹائم ڈیجیٹل نظاموں پر گہرے تحقیقی مقالے شائع کرتے ہیں۔',
    pillarsTitle: 'ہمارے چار بنیادی ستون',
    pillars: [
      {
        number: '01',
        title: 'مادی پائیداری',
        desc: 'ہم عارضی ڈیجیٹل رجحانات کے مقابلے میں قدرتی پتھر، بروٹلسٹ کنکریٹ اور دستکار لکڑی کی پائیداری کو ترجیح دیتے ہیں۔',
      },
      {
        number: '02',
        title: 'طباعتی نظم و ضبط',
        desc: 'زیورخ اور باسل کے گرافک اسکولوں سے جڑا ہر صفحہ ریاضیاتی تناسب اور ساخت کی شفافیت کے عین مطابق تشکیل پاتا ہے۔',
      },
      {
        number: '03',
        title: 'زیرو رن ٹائم سادگی',
        desc: 'سافٹ ویئر ہو یا عمارت، غیر ضروری پیچیدگی بوجھ ہے۔ ہم ہلکی اور جامد طور پر تیار کردہ اشاعتی ٹیکنالوجی بناتے ہیں۔',
      },
      {
        number: '04',
        title: 'عالمی کثیر لسانی وسعت',
        desc: 'ثقافت آفاقی ہے۔ ہر تحقیقی مقالہ چھ عالمی زبانوں بشمول دائیں سے بائیں خطاطی کے ساتھ پیش کیا جاتا ہے۔',
      },
    ],
    mastheadTitle: 'ادارتی بورڈ اور معاون نقاد',
    mastheadSubtitle: 'ہمارے مستقل تحریری ڈیسک کے اراکین کی سوانح اور تحقیقی کام۔',
    mastheadBadge: 'ادارتی بورڈ',
    moreBy: 'مزید از',
    ethicsTitle: 'ادارتی خود مختاری اور اشاعتی معیارات',
    ethicsDesc: 'کوئسٹو مکمل ادارتی خودمختاری کے ساتھ کام کرتا ہے۔ ہم اپنی مونوگراف سیریز میں کسی قسم کے بامعاوضہ یا اسپانسرڈ مضامین قبول نہیں کرتے۔ تمام مضامین اور بصری جائزے اشاعت سے قبل کڑی جانچ اور نظر ثانی سے گزرتے ہیں۔',
  },
  ar: {
    breadcrumb: 'عن المجلة وهيئة التحرير',
    badge: 'مجلة دولية مستقلة للعمارة والحرفية',
    title: 'شعرية الكتلة والشبكة والخلود',
    subtitle: 'تأسست مجلة كويستو عام 2024 لتكون بديلاً للتدفقات الخوارزمية العابرة. ننشر دراسات متعمقة تبحث في الحرفية المادية والأنظمة المطبعية السويسرية والعمارة الخرسانية والهياكل الرقمية المستقلة.',
    pillarsTitle: 'ركائزنا الأربع الأساسية',
    pillars: [
      {
        number: '01',
        title: 'الخلود المادي',
        desc: 'ندعم الحجر الطبيعي والخرسانة البرتالية المعلمة بالخشب على حساب المواد الرقمية المؤقتة والمستهلكة.',
      },
      {
        number: '02',
        title: 'الصرامة الطباعية',
        desc: 'بالاستناد إلى مدارس بازل وزيورخ، يخضع كل تصميم لنسب رياضية دقيقة ووضوح بنيوي صارم.',
      },
      {
        number: '03',
        title: 'بساطة الأداء دون خوادم',
        desc: 'في البرمجيات كما في العمارة، التعقيد الزائد عبء. نبني منصات نشر سريعة ومجمعة مسبقاً بثبات كامل.',
      },
      {
        number: '04',
        title: 'انتشار عالمي متعدد اللغات',
        desc: 'الثقافة لغة إنسانية جامعة. تُنشر كل دراسة بست لغات عالمية مع دعم كامل للاتجاه من اليمين إلى اليسار.',
      },
    ],
    mastheadTitle: 'هيئة التحرير والكتاب المساهمون',
    mastheadSubtitle: 'سير ذاتية ودراسات معمقة بقلم فريق الكتابة الدائم لدينا.',
    mastheadBadge: 'هيئة التحرير',
    moreBy: 'المزيد من',
    ethicsTitle: 'الاستقلالية التحريرية والمعايير المهنية',
    ethicsDesc: 'تعمل كويستو باستقلالية تحريرية تامة. نحن لا نقبل أي رعاية تجارية أو مقالات مدفوعة الأجر ضمن أعدادنا، وتخضع جميع الدراسات لمراجعة نقدية صارمة قبل النشر.',
  },
  es: {
    breadcrumb: 'Acerca de y Consejo Editorial',
    badge: 'Revista Independiente de Arquitectura y Artesanía',
    title: 'La Poética de la Masa, la Cuadrícula y la Permanencia',
    subtitle: 'Questo fue fundada en 2024 como antídoto a los algoritmos efímeros. Publicamos monografías rigurosas que investigan la artesanía material, la tipografía suiza, la arquitectura brutalista y los sistemas digitales estáticos.',
    pillarsTitle: 'Nuestros Cuatro Pilares Fundamentales',
    pillars: [
      {
        number: '01',
        title: 'Resistencia Material',
        desc: 'Defendemos la piedra física, el hormigón visto y la madera trabajada a mano sobre lo digital desechable.',
      },
      {
        number: '02',
        title: 'Rigor Tipográfico',
        desc: 'Arraigado en las escuelas de Basilea y Zúrich, cada diseño obedece a proporciones matemáticas y claridad estructural.',
      },
      {
        number: '03',
        title: 'Minimalismo de Rendimiento',
        desc: 'En el software como en la arquitectura, la complejidad innecesaria es un riesgo. Diseñamos publicaciones estáticas ligeras.',
      },
      {
        number: '04',
        title: 'Alcance Global Multilingüe',
        desc: 'La cultura es universal. Cada monografía se distribuye en seis idiomas con tipografía bidireccional RTL.',
      },
    ],
    mastheadTitle: 'Consejo Editorial y Críticos Colaboradores',
    mastheadSubtitle: 'Biografías y monografías de nuestro equipo permanente.',
    mastheadBadge: 'Consejo Editorial',
    moreBy: 'Más de',
    ethicsTitle: 'Independencia y Normas Editoriales',
    ethicsDesc: 'Questo opera con total autonomía editorial. No aceptamos patrocinios ni publicidad encubierta dentro de nuestras monografías. Todos los ensayos pasan por una rigurosa revisión editorial.',
  },
  fr: {
    breadcrumb: 'À propos & Comité Éditorial',
    badge: 'Revue Indépendante d’Architecture & d’Artisanat',
    title: 'La Poétique de la Masse, de la Grille et de la Durabilité',
    subtitle: 'Questo a été fondée en 2024 comme un remède aux flux algorithmiques éphémères. Nous publions des monographies rigoureuses explorant les matériaux bruts, la typographie suisse et les architectures statiques.',
    pillarsTitle: 'Nos Quatre Piliers Fondamentaux',
    pillars: [
      {
        number: '01',
        title: 'Durabilité des Matériaux',
        desc: 'Nous célébrons la pierre brute, le béton architectural et le bois artisanal face aux formats numériques jetables.',
      },
      {
        number: '02',
        title: 'Rigueur Typographique',
        desc: 'Héritée des écoles de Bâle et de Zurich, chaque mise en page obéit à des proportions mathématiques et à une clarté pure.',
      },
      {
        number: '03',
        title: 'Minimalisme Zéro-Runtime',
        desc: 'Dans le logiciel comme dans l’architecture, la complexité est superflue. Nous concevons des architectures statiques pérennes.',
      },
      {
        number: '04',
        title: 'Rayonnement Multilingue',
        desc: 'La culture est universelle. Chaque monographie est diffusée en six langues avec une typographie RTL soignée.',
      },
    ],
    mastheadTitle: 'Comité Éditorial & Auteurs Collaborateurs',
    mastheadSubtitle: 'Biographies et essais par notre bureau de rédaction permanent.',
    mastheadBadge: 'Comité Éditorial',
    moreBy: 'Plus de',
    ethicsTitle: 'Indépendance Éditoriale & Normes de Publication',
    ethicsDesc: 'Questo opère en toute indépendance. Nous refusons les partenariats rémunérés et la publicité native. Tous les essais et reportages photographiques sont relus avec rigueur avant parution.',
  },
  de: {
    breadcrumb: 'Über uns & Redaktion',
    badge: 'Unabhängiges Journal für Architektur & Handwerk',
    title: 'Die Poetik von Masse, Raster und Beständigkeit',
    subtitle: 'Questo wurde 2024 als Gegenentwurf zu kurzlebigen Feeds gegründet. Wir veröffentlichen tiefgründige Monographien über Materialhandwerk, Schweizer Typografie, Monumentalarchitektur und statische Systeme.',
    pillarsTitle: 'Unsere Vier Grundpfeiler',
    pillars: [
      {
        number: '01',
        title: 'Materialbeständigkeit',
        desc: 'Wir setzen auf Naturstein, Sichtbeton und handgefertigtes Holz anstelle digitaler Wegwerfware.',
      },
      {
        number: '02',
        title: 'Typografische Strenge',
        desc: 'Verwurzelt in den Schulen von Basel und Zürich folgt jedes Layout mathematischen Proportionen und struktureller Klarheit.',
      },
      {
        number: '03',
        title: 'Zero-Runtime Minimalismus',
        desc: 'In der Software wie in der Architektur ist Komplexität eine Bürde. Wir entwickeln schlanke statische Architekturen.',
      },
      {
        number: '04',
        title: 'Globale Mehrsprachigkeit',
        desc: 'Kultur verbindet. Jede Monographie wird in sechs Sprachen kuratiert und mit bidirektionaler RTL-Typografie ausgeliefert.',
      },
    ],
    mastheadTitle: 'Das Impressum & Beitragende Kritiker',
    mastheadSubtitle: 'Biografien und Monographien unserer festen Redaktion.',
    mastheadBadge: 'Redaktion',
    moreBy: 'Mehr von',
    ethicsTitle: 'Redaktionelle Unabhängigkeit & Veröffentlichungsstandards',
    ethicsDesc: 'Questo arbeitet mit voller redaktioneller Autonomie. Wir akzeptieren keine bezahlten Platzierungen oder Native Advertising. Alle Monographien und historischen Zitate werden vorab streng geprüft.',
  },
};

// -------------------------------------------------------------
// 2. CONTACT & PITCH TRANSLATIONS
// -------------------------------------------------------------
export const CONTACT_PAGE: Record<string, LocalizedContact> = {
  en: {
    breadcrumb: 'Contact & Pitch',
    badge: 'Editorial Inquiries & Submissions',
    title: 'Pitch an Essay or Monograph',
    subtitle: 'Questo welcomes submissions from architects, typographers, structural historians, and systems engineers. We prioritize original photographic documentation and rigorous critical arguments.',
    standardsTitle: 'Submission Standards',
    standards: [
      'Essays typically range between 1,800 and 4,500 words with primary source citations.',
      'Photographic essays must include 300+ DPI archival imagery or original photographic proofs.',
      'We review pitches every Tuesday and respond within 5 business days.',
    ],
    nameLabel: 'Your Full Name',
    namePlaceholder: 'e.g. Liam O’Connor',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@institution.org',
    categoryLabel: 'Monograph Discipline / Pillar',
    pitchTitleLabel: 'Working Monograph Title',
    pitchTitlePlaceholder: 'e.g. Acoustic Diffusion and Schroeder Sequences',
    synopsisLabel: 'Abstract & Critical Thesis',
    synopsisPlaceholder: 'Summarize your core architectural thesis, primary sources, and spatial focus (200–500 words)...',
    submitButton: 'Submit Monograph Pitch',
    successTitle: 'Pitch Received',
    successDesc: (name, title) => `Thank you, ${name}. Your synopsis for "${title}" has been queued for review by our editorial desk.`,
    submitAnother: 'Submit Another Pitch',
  },
  ur: {
    breadcrumb: 'رابطہ اور مقالہ پیش کریں',
    badge: 'ادارتی استفسارات اور تجاویز',
    title: 'مضمون یا تحقیقی مقالہ پیش کریں',
    subtitle: 'کوئسٹو معماروں، خطاطوں، تاریخ دانوں اور انجینئروں کی آراء کا خیرمقدم کرتا ہے۔ ہم بنیادی دستاویزی شواہد اور ٹھوس تنقیدی دلائل کو اولین ترجیح دیتے ہیں۔',
    standardsTitle: 'اشاعتی معیارات و شرائط',
    standards: [
      'مضامین عموماً 1,800 سے 4,500 الفاظ پر مشتمل ہونے چاہئیں جن میں مصدقہ حوالہ جات شامل ہوں۔',
      'بصری اور تصویری مقالوں کے لیے اعلیٰ معیار (300+ DPI) کی تصاویر لازمی ہیں۔',
      'ہمارا ادارتی ڈیسک ہر منگل کو موصولہ تجاویز کا جائزہ لیتا ہے اور 5 دفتری ایام میں جواب دیتا ہے۔',
    ],
    nameLabel: 'آپ کا مکمل نام',
    namePlaceholder: 'مثلاً: لیام او کونر',
    emailLabel: 'ای میل ایڈریس',
    emailPlaceholder: 'you@institution.org',
    categoryLabel: 'مقالے کا شعبہ / صنف',
    pitchTitleLabel: 'مقالے کا مجوزہ عنوان',
    pitchTitlePlaceholder: 'مثلاً: صوتی تقسیم اور شروڈر نمبروں کے سلسلے',
    synopsisLabel: 'خلاصہ اور تنقیدی نظریہ',
    synopsisPlaceholder: 'اپنے مقالے کا بنیادی موضوع، دلائل اور ساخت کا خلاصہ تحریر کریں (200 تا 500 الفاظ)...',
    submitButton: 'مقالے کی تجویز ارسال کریں',
    successTitle: 'تجویز موصول ہو گئی',
    successDesc: (name, title) => `شکریہ، ${name}۔ آپ کا مقالہ بعنوان "${title}" ادارتی بورڈ کے جائزے کے لیے محفوظ کر لیا گیا ہے۔`,
    submitAnother: 'ایک اور مقالہ پیش کریں',
  },
  ar: {
    breadcrumb: 'التواصل وتقديم المقترحات',
    badge: 'الاستفسارات التحريرية وتقديم المقالات',
    title: 'تقديم مقترح دراسة أو مقال معماري',
    subtitle: 'ترحب كويستو بمساهمات المعماريين والمصممين ومؤرخي العمارة ومهندسي النظم. نولي الأولوية للأبحاث الموثقة فوتوغرافياً والحجج النقدية الصارمة.',
    standardsTitle: 'معايير وشروط التقديم',
    standards: [
      'تتراوح المقالات عادة بين 1800 و 4500 كلمة مع توثيق المصادر والمراجع الأولية.',
      'يجب أن تتضمن الدراسات المصورة ملفات بدقة 300+ DPI أو لقطات أرشيفية أصلية.',
      'تراجع هيئة التحرير المقترحات أسبوعياً ويتم الرد خلال 5 أيام عمل.',
    ],
    nameLabel: 'الاسم الكامل',
    namePlaceholder: 'مثال: إلينا روستوفا',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'you@institution.org',
    categoryLabel: 'تخصص الدراسة / القسم',
    pitchTitleLabel: 'عنوان المقال أو الدراسة',
    pitchTitlePlaceholder: 'مثال: التشتت الصوتي ومتسلسلات شرودر في العمارة',
    synopsisLabel: 'الملخص والأطروحة النقدية',
    synopsisPlaceholder: 'لخص أطروحتك المعمارية والمصادر الأساسية في 200 إلى 500 كلمة...',
    submitButton: 'إرسال المقترح التحريري',
    successTitle: 'تم استلام المقترح',
    successDesc: (name, title) => `شكراً لك، ${name}. تم إدراج ملخص دراستك "${title}" للمراجعة لدى هيئة التحرير.`,
    submitAnother: 'تقديم مقترح آخر',
  },
  es: {
    breadcrumb: 'Contacto y Propuestas',
    badge: 'Consultas Editoriales y Envíos',
    title: 'Proponer un Ensayo o Monografía',
    subtitle: 'Questo recibe propuestas de arquitectos, tipógrafos, historiadores e ingenieros. Priorizamos la documentación fotográfica original y el debate crítico riguroso.',
    standardsTitle: 'Normas de Envío',
    standards: [
      'Los ensayos oscilan entre 1.800 y 4.500 palabras con citas de fuentes primarias.',
      'Los ensayos fotográficos deben incluir imágenes a 300+ DPI o pruebas de archivo.',
      'Revisamos las propuestas semanalmente y respondemos en 5 días laborables.',
    ],
    nameLabel: 'Nombre Completo',
    namePlaceholder: 'ej. Mateo Silva',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'correo@institucion.org',
    categoryLabel: 'Disciplina / Pilar Monográfico',
    pitchTitleLabel: 'Título Provisional de la Monografía',
    pitchTitlePlaceholder: 'ej. Difusión Acústica y Secuencias de Schroeder',
    synopsisLabel: 'Resumen y Tesis Crítica',
    synopsisPlaceholder: 'Resume tu tesis central, fuentes primarias y enfoque espacial (200-500 palabras)...',
    submitButton: 'Enviar Propuesta Editorial',
    successTitle: 'Propuesta Recibida',
    successDesc: (name, title) => `Gracias, ${name}. Tu propuesta para "${title}" ha sido recibida por nuestro consejo editorial.`,
    submitAnother: 'Enviar Otra Propuesta',
  },
  fr: {
    breadcrumb: 'Contact & Soumissions',
    badge: 'Demandes Éditoriales & Soumissions',
    title: 'Proposer un Essai ou une Monographie',
    subtitle: 'Questo accueille les contributions d’architectes, typographes, historiens et ingénieurs. Nous privilégions la rigueur critique et les archives photographiques d’exception.',
    standardsTitle: 'Normes de Soumission',
    standards: [
      'Les textes comptent généralement entre 1 800 et 4 500 mots avec références primaires.',
      'Les essais photographiques requièrent des images de 300+ DPI ou épreuves d’archives.',
      'Nous examinons les propositions chaque semaine avec une réponse sous 5 jours ouvrés.',
    ],
    nameLabel: 'Nom Complet',
    namePlaceholder: 'ex. Claire Dupont',
    emailLabel: 'Adresse E-mail',
    emailPlaceholder: 'contact@institution.org',
    categoryLabel: 'Discipline / Section',
    pitchTitleLabel: 'Titre Provisoire de la Monographie',
    pitchTitlePlaceholder: 'ex. Diffusion Acoustique et Séquences de Schroeder',
    synopsisLabel: 'Résumé et Thèse Critique',
    synopsisPlaceholder: 'Résumez votre thèse, vos sources primaires et votre cadre spatial (200 à 500 mots)...',
    submitButton: 'Soumettre la Proposition',
    successTitle: 'Proposition Reçue',
    successDesc: (name, title) => `Merci, ${name}. Votre proposition pour "${title}" a été transmise à notre comité de rédaction.`,
    submitAnother: 'Soumettre une Autre Proposition',
  },
  de: {
    breadcrumb: 'Kontakt & Einreichungen',
    badge: 'Redaktionelle Anfragen & Einreichungen',
    title: 'Ein Essay oder eine Monographie einreichen',
    subtitle: 'Questo begrüßt Einreichungen von Architekten, Typografen, Historikern und Ingenieuren. Wir setzen auf tiefgründige Argumentation und hochwertige Fotodokumentation.',
    standardsTitle: 'Einreichungsstandards',
    standards: [
      'Essays umfassen in der Regel 1.800 bis 4.500 Wörter mit Primärquellenangaben.',
      'Foto-Essays erfordern Archivmaterial in mindestens 300 DPI.',
      'Wir prüfen Einreichungen wöchentlich und antworten innerhalb von 5 Werktagen.',
    ],
    nameLabel: 'Vollständiger Name',
    namePlaceholder: 'z.B. Hiroshi Tanaka',
    emailLabel: 'E-Mail-Adresse',
    emailPlaceholder: 'name@institution.org',
    categoryLabel: 'Disziplin / Fachbereich',
    pitchTitleLabel: 'Arbeitstitel der Monographie',
    pitchTitlePlaceholder: 'z.B. Akustische Diffusoren und Schroeder-Zahlenfolgen',
    synopsisLabel: 'Zusammenfassung & These',
    synopsisPlaceholder: 'Fassen Sie Ihre architektonische These und Quellen kurz zusammen (200 bis 500 Wörter)...',
    submitButton: 'Monographie-Vorschlag einreichen',
    successTitle: 'Vorschlag Eingegangen',
    successDesc: (name, title) => `Vielen Dank, ${name}. Ihr Konzept für "${title}" wird von unserer Redaktion geprüft.`,
    submitAnother: 'Weiteren Vorschlag einreichen',
  },
};

// -------------------------------------------------------------
// 3. TERMS OF SERVICE TRANSLATIONS
// -------------------------------------------------------------
export const TERMS_PAGE: Record<string, LocalizedTerms> = {
  en: {
    breadcrumb: 'Terms of Service',
    badge: 'Legal & Regulatory Disclosures',
    title: 'Terms of Service',
    version: 'Effective Date: November 15, 2026 • Version 2.4',
    sections: [
      {
        title: '1. Intellectual Property & Monograph Rights',
        body: 'All original photography, architectural essays, visual layouts, and typographic compositions published in Questo Magazine are protected under international copyright law. Unaltered quotation of up to 150 words is permitted for academic, critical, or non-commercial journalistic purposes, provided full attribution is given to the author and Questo Magazine with a direct hyperlink to the original monograph.',
      },
      {
        title: '2. Reader Reflections & Discussion Guidelines',
        body: 'Questo provides a 100% login-free guest commentary environment powered by our open cloud database. By submitting a reflection, you agree not to submit unlawful, defamatory, commercial solicitation, or automated spam content. Our editorial team maintains active moderation rights to prune, delete, or archive any commentary that violates professional discourse standards.',
      },
      {
        title: '3. Syndication & Republication',
        body: 'Commercial republication, translation into languages not currently supported by our static platform, or physical print reproduction requires formal written licensing from our syndicate desk. Inquiries must be submitted via our official contact desk.',
      },
      {
        title: '4. Zero Runtime Tracking Guarantee',
        body: 'Questo does not deploy cross-site advertising tracking cookies, third-party marketing beacons, or fingerprinting scripts. Technical analytics are strictly anonymized and aggregated without storing personal reader profiles.',
      },
    ],
  },
  ur: {
    breadcrumb: 'شرائط و ضوابط',
    badge: 'قانونی و ضابطہ جاتی انکشافات',
    title: 'شرائطِ سروس و اشاعتی ضوابط',
    version: 'نفاذ کی تاریخ: 15 نومبر، 2026 • ورژن 2.4',
    sections: [
      {
        title: '1. دانشورانہ ملکیت اور مقالات کے حقوق',
        body: 'کوئسٹو میگزین میں شائع ہونے والی تمام اصل تصاویر، معمارانہ مضامین، لے آؤٹس اور خطاطی کے نمونے بین الاقوامی کاپی رائٹ قوانین کے تحت محفوظ ہیں۔ تعلیمی اور غیر تجارتی مقاصد کے لیے 150 الفاظ تک کا غیر تبدیل شدہ اقتباس مصنف اور کوئسٹو کے مکمل حوالے کے ساتھ پیش کیا جا سکتا ہے۔',
      },
      {
        title: '2. قارئین کے تبصرے اور مکالمے کے اصول',
        body: 'کوئسٹو قارئین کو بغیر لاگ ان تبصرے کی کھلی سہولت فراہم کرتا ہے۔ تبصرہ ارسال کرتے ہوئے آپ غیر قانونی، تجارتی اشتہارات یا توہین آمیز مواد سے گریز کے پابند ہیں۔ ہماری ادارتی ٹیم قواعد کے خلاف تبصروں کو حذف کرنے کا مکمل اختیار رکھتی ہے۔',
      },
      {
        title: '3. دوبارہ اشاعت اور سنڈیکیشن',
        body: 'کسی بھی تجارتی استعمال، غیر تعاون شدہ زبانوں میں ترجمے یا کاغذی پرنٹ کے لیے کوئسٹو کے ادارتی سنڈیکیشن ڈیسک سے تحریری اجازت لینا لازمی ہے۔',
      },
      {
        title: '4. بغیر ٹریکنگ پرائیویسی کی ضمانت',
        body: 'کوئسٹو کسی بھی قسم کے ٹریکنگ کوکیز، اشتہاری بیکنز یا ڈیجیٹل فنگر پرنٹنگ کا استعمال نہیں کرتا۔ قارئین کا ذاتی ڈیٹا مکمل طور پر محفوظ رہتا ہے۔',
      },
    ],
  },
  ar: {
    breadcrumb: 'شروط وأحكام الخدمة',
    badge: 'الإفصاحات القانونية والتنظيمية',
    title: 'شروط الخدمة ومعايير النشر',
    version: 'تاريخ السريان: 15 نوفمبر 2026 • الإصدار 2.4',
    sections: [
      {
        title: '1. الملكية الفكرية وحقوق الدراسات',
        body: 'جميع الصور الفوتوغرافية الأصلية والمقالات المعمارية والتصميمات الطباعية المنشورة في مجلة كويستو محمية بموجب قوانين حقوق النشر الدولية. يُسمح بالاقتباس الأكاديمي أو النقدي غير التجاري بما لا يتجاوز 150 كلمة بشرط الإسناد الكامل للمؤلف والمجلة مع رابط مباشر للدراسة.',
      },
      {
        title: '2. مشاركات القراء وضوابط النقاش',
        body: 'توفر كويستو بيئة نقاش مفتوحة دون الحاجة لتسجيل دخول. بإرسال تعليقك، فإنك توافق على عدم نشر محتوى غير قانوني أو ترويجي أو مزعج. تحتفظ هيئة التحرير بحق حذف أو تعديل أي تعليق يخالف المعايير المهنية.',
      },
      {
        title: '3. النشر المشترك والترخيص',
        body: 'تتطلب إعادة النشر التجاري أو الترجمة إلى لغات غير مدعومة رسمياً موافقة خطية مسبقة من مكتب النشر المشترك والترخيص لدينا.',
      },
      {
        title: '4. ضمان الخصوصية دون أدوات تتبع',
        body: 'لا تستخدم مجلة كويستو أي ملفات تعريف ارتباط إعلانية أو أدوات تتبع سلوكية تابعة لجهات خارجية، وتتم حماية خصوصية القارئ بشكل صارم.',
      },
    ],
  },
  es: {
    breadcrumb: 'Términos de Servicio',
    badge: 'Divulgaciones Legales y Regulatorias',
    title: 'Términos de Servicio y Normas Editoriales',
    version: 'Fecha de Entrada en Vigor: 15 de Noviembre de 2026 • Versión 2.4',
    sections: [
      {
        title: '1. Propiedad Intelectual y Derechos Monográficos',
        body: 'Toda la fotografía original, ensayos de arquitectura y composiciones tipográficas publicadas en Questo Magazine están protegidos por el derecho internacional de autor. Se permite la cita de hasta 150 palabras con fines académicos o críticos con atribución directa.',
      },
      {
        title: '2. Comentarios de Lectores y Normas de Discusión',
        body: 'Questo ofrece un entorno de comentarios sin inicio de sesión. Al comentar, aceptas no publicar contenido ilegal, publicitario o spam. Nuestro equipo editorial modera activamente las intervenciones.',
      },
      {
        title: '3. Sindicación y Republicación',
        body: 'La republicación comercial o traducción requiere una licencia formal por escrito de nuestro departamento editorial.',
      },
      {
        title: '4. Garantía de Cero Rastreo en Tiempo de Ejecución',
        body: 'Questo no implementa cookies de publicidad ni rastreadores de terceros. Los datos de navegación permanecen estrictamente anónimos.',
      },
    ],
  },
  fr: {
    breadcrumb: 'Conditions d’Utilisation',
    badge: 'Mentions Légales et Réglementaires',
    title: 'Conditions d’Utilisation & Normes',
    version: 'Date d’entrée en vigueur : 15 novembre 2026 • Version 2.4',
    sections: [
      {
        title: '1. Propriété Intellectuelle & Droits des Monographies',
        body: 'Toutes les photographies, essais architecturaux et typographies publiés dans Questo Magazine sont protégés par le droit d’auteur international. Les citations de moins de 150 mots sont autorisées à des fins académiques avec mention obligatoire de la source.',
      },
      {
        title: '2. Commentaires & Charte de Discussion',
        body: 'Questo propose un espace de discussion ouvert sans connexion requise. Tout commentaire diffamatoire ou commercial sera retiré par l’équipe de modération.',
      },
      {
        title: '3. Syndication et Reproduction',
        body: 'Toute reproduction commerciale ou traduction requiert une autorisation écrite préalable de notre service de syndication.',
      },
      {
        title: '4. Garantie d’Absence de Traçage',
        body: 'Questo n’utilise aucun cookie publicitaire ni traceur comportemental tiers afin de garantir la souveraineté numérique de ses lecteurs.',
      },
    ],
  },
  de: {
    breadcrumb: 'Nutzungsbedingungen',
    badge: 'Rechtliche Hinweise & Standards',
    title: 'Nutzungsbedingungen & Publikationsstandards',
    version: 'Gültig ab: 15. November 2026 • Version 2.4',
    sections: [
      {
        title: '1. Geistiges Eigentum & Urheberrechte',
        body: 'Alle in Questo Magazine veröffentlichten Fotografien, Architektur-Essays und typografischen Layouts sind urheberrechtlich geschützt. Zitate bis zu 150 Wörtern sind zu wissenschaftlichen Zwecken mit Quellennachweis gestattet.',
      },
      {
        title: '2. Leserkommentare & Diskussionsrichtlinien',
        body: 'Questo bietet einen anmeldefreien Diskussionsbereich. Rechtswidrige oder werbliche Inhalte werden von unserer Redaktion umgehend archiviert oder gelöscht.',
      },
      {
        title: '3. Syndizierung & Nachdruck',
        body: 'Jeglicher kommerzielle Nachdruck oder Übersetzungen bedürfen einer schriftlichen Genehmigung unserer Redaktionsleitung.',
      },
      {
        title: '4. Garantie ohne Tracking',
        body: 'Questo verzichtet vollständig auf Werbe-Cookies und Drittanbieter-Tracker zum Schutz der Lesersouveränität.',
      },
    ],
  },
};

// -------------------------------------------------------------
// 4. PRIVACY POLICY TRANSLATIONS
// -------------------------------------------------------------
export const PRIVACY_PAGE: Record<string, LocalizedPrivacy> = {
  en: {
    title: 'Privacy Policy & Regulatory Disclosures',
    backToPub: 'Back to Publication',
    badge: 'Compliance & Data Ethics',
    h1: 'Privacy Policy & Data Architecture',
    subtitle: 'Questo is architected on the premise of radical privacy, zero third-party tracking, and static data sovereignty.',
    cookieTitle: '1. Zero-Cookie Architecture Guarantee',
    cookieDesc: 'Questo does not deploy, read, or monetize advertising cookies, behavioral trackers, or third-party fingerprinting scripts. We do not partner with data brokers or behavioral marketing networks.',
    storageTitle: '2. Client-Side Storage Disclosures (EU GDPR & ePrivacy Art. 5(3))',
    storageDesc: 'To provide an uninterrupted, high-performance reading experience without a server-side account, Questo strictly uses the browser’s isolated localStorage API for purely functional preferences:',
    storageItems: [
      { key: 'questo-theme', desc: 'Remembers your dark or light visual interface selection across sessions.' },
      { key: 'questo-reading-list', desc: 'Saves your offline bookmarks locally on your device without transmitting data.' },
      { key: 'questo-recent-searches', desc: 'Retains your recent search terms locally for instant autocomplete recall.' },
    ],
    rightsTitle: '3. Reader Rights & Contact',
    rightsDesc: 'Because Questo collects zero personal data or tracker cookies, there are no reader tracking profiles to export or delete. You retain 100% control of your device’s local cache.',
  },
  ur: {
    title: 'رازداری کی پالیسی اور قانونی انکشافات',
    backToPub: 'مرکزی اشاعت پر واپس جائیں',
    badge: 'قانونی ضوابط اور ڈیٹا اخلاقیات',
    h1: 'پرائیویسی پالیسی اور ڈیٹا کا نظام',
    subtitle: 'کوئسٹو مکمل رازداری، صفر فریقِ ثالث ٹریکنگ اور ڈیٹا کی خودمختاری کی بنیاد پر تشکیل دیا گیا ہے۔',
    cookieTitle: '1. زیرو کوکی آرکیٹیکچر کی ضمانت',
    cookieDesc: 'کوئسٹو اشتہاری کوکیز، رویے سے متعلق ٹریکرز یا فنگر پرنٹنگ اسکرپٹس کا استعمال یا فروخت نہیں کرتا۔ ہم کسی بھی مارکیٹنگ نیٹ ورک کے ساتھ ڈیٹا شیئر نہیں کرتے۔',
    storageTitle: '2. کلائنٹ سائڈ اسٹوریج کے انکشافات (GDPR اور رازداری کے قوانین)',
    storageDesc: 'بغیر لاگ ان تیز رفتار مطالعے کی سہولت کے لیے، کوئسٹو صرف براؤزر کے مقامی اسٹوریج (localStorage) کو بنیادی ترجیحات کے لیے استعمال کرتا ہے:',
    storageItems: [
      { key: 'questo-theme', desc: 'ڈارک یا لائٹ موڈ کے آپ کے انتخاب کو ڈیوائس پر یاد رکھتا ہے۔' },
      { key: 'questo-reading-list', desc: 'آپ کے محفوظ کردہ آف لائن مضامین کو مقامی طور پر اسٹور کرتا ہے۔' },
      { key: 'questo-recent-searches', desc: 'تیز تر تلاش کے لیے آپ کے حالیہ سرچ الفاظ کو مقامی طور پر رکھتا ہے۔' },
    ],
    rightsTitle: '3. قارئین کے حقوق اور رابطہ',
    rightsDesc: 'چونکہ کوئسٹو قارئین کا کوئی ذاتی ڈیٹا جمع نہیں کرتا، اس لیے کوئی ٹریکنگ پروفائل موجود نہیں ہے۔ آپ اپنے براؤزر کے ڈیٹا کے مکمل خود مختار ہیں۔',
  },
  ar: {
    title: 'سياسة الخصوصية والإفصاحات التنظيمية',
    backToPub: 'العودة إلى المجلة',
    badge: 'الامتثال وأخلاقيات البيانات',
    h1: 'سياسة الخصوصية وبنية البيانات',
    subtitle: 'صُممت كويستو على أسس الخصوصية التامة، وانعدام أدوات التتبع الخارجية، والسيادة الرقمية الكاملة.',
    cookieTitle: '1. ضمان خلو المنصة من ملفات تعريف الارتباط الإعلانية',
    cookieDesc: 'لا تستخدم كويستو ملفات تعريف الارتباط الإعلانية أو أدوات التتبع السلوكي أو برمجيات البصمة الرقمية، ولا نشارك البيانات مع أي وسطاء.',
    storageTitle: '2. إفصاحات التخزين المحلي للعميل (GDPR والقوانين الأوروبية)',
    storageDesc: 'لتقديم تجربة قراءة فائقة السرعة دون الحاجة إلى إنشاء حساب، نعتمد حصراً على التخزين المحلي الآمن في متصفحك (localStorage):',
    storageItems: [
      { key: 'questo-theme', desc: 'يحفظ خيارك للوضع المظلم أو الفاتح عبر جلسات التصفح.' },
      { key: 'questo-reading-list', desc: 'يحفظ مقالاتك المفضلة محلياً على جهازك للقراءة دون إنترنت.' },
      { key: 'questo-recent-searches', desc: 'يحتفظ بكلمات البحث الأخيرة محلياً لتسريع الإكمال التلقائي.' },
    ],
    rightsTitle: '3. حقوق القراء والتواصل',
    rightsDesc: 'نظراً لعدم جمع كويستو أي بيانات شخصية، لا توجد سجلات تتبع للمستخدمين لدينا، وأنت المتحكم الوحيد في بيانات جهازك.',
  },
  es: {
    title: 'Política de Privacidad y Divulgaciones',
    backToPub: 'Volver a la Publicación',
    badge: 'Cumplimiento y Ética de Datos',
    h1: 'Política de Privacidad y Arquitectura de Datos',
    subtitle: 'Questo está diseñado bajo la premisa de la privacidad radical, cero rastreo de terceros y soberanía de datos.',
    cookieTitle: '1. Garantía de Arquitectura Sin Cookies',
    cookieDesc: 'Questo no utiliza cookies publicitarias, rastreadores de comportamiento ni huellas digitales.',
    storageTitle: '2. Almacenamiento del Lado del Cliente (RGPD)',
    storageDesc: 'Para ofrecer lectura rápida sin registro, Questo utiliza exclusivamente el almacenamiento local del navegador (localStorage):',
    storageItems: [
      { key: 'questo-theme', desc: 'Recuerda tu preferencia de tema oscuro o claro.' },
      { key: 'questo-reading-list', desc: 'Guarda tus artículos favoritos sin enviar datos.' },
      { key: 'questo-recent-searches', desc: 'Conserva tus términos de búsqueda recientes localmente.' },
    ],
    rightsTitle: '3. Derechos del Lector y Contacto',
    rightsDesc: 'Al no recopilar datos personales, no existen perfiles de usuario que exportar o eliminar. Tienes el control total de tu caché.',
  },
  fr: {
    title: 'Politique de Confidentialité & Mentions',
    backToPub: 'Retour à la Publication',
    badge: 'Conformité & Éthique des Données',
    h1: 'Politique de Confidentialité & Données',
    subtitle: 'Questo repose sur les principes de confidentialité absolue, d’absence totale de traçage et de souveraineté des données.',
    cookieTitle: '1. Garantie d’Absence de Cookies Tiers',
    cookieDesc: 'Questo n’utilise aucun cookie publicitaire ni traceur comportemental tiers.',
    storageTitle: '2. Stockage Côté Client (RGPD)',
    storageDesc: 'Pour garantir une lecture fluide sans compte en ligne, Questo utilise uniquement le stockage local de votre navigateur (localStorage) :',
    storageItems: [
      { key: 'questo-theme', desc: 'Mémorise votre choix de thème sombre ou clair.' },
      { key: 'questo-reading-list', desc: 'Conserve vos articles hors-ligne sur votre appareil.' },
      { key: 'questo-recent-searches', desc: 'Retient vos recherches récentes pour l’autocomplétion.' },
    ],
    rightsTitle: '3. Droits des Lecteurs & Contact',
    rightsDesc: 'Ne collectant aucune donnée personnelle, Questo ne détient aucun profil utilisateur. Vous gardez la maîtrise de votre appareil.',
  },
  de: {
    title: 'Datenschutzerklärung & Richtlinien',
    backToPub: 'Zurück zur Publikation',
    badge: 'Konformität & Datenethik',
    h1: 'Datenschutzerklärung & Architektur',
    subtitle: 'Questo basiert auf dem Grundsatz absoluter Privatsphäre, Verzicht auf Drittanbieter-Tracking und Datensouveränität.',
    cookieTitle: '1. Garantie ohne Werbe-Cookies',
    cookieDesc: 'Questo setzt keine Werbe-Cookies, Verhaltens-Tracker oder Fingerprinting-Skripte ein.',
    storageTitle: '2. Lokale Speicherung (DSGVO-Konformität)',
    storageDesc: 'Für schnelles Lesen ohne Benutzerkonto nutzt Questo ausschließlich den lokalen Browser-Speicher (localStorage):',
    storageItems: [
      { key: 'questo-theme', desc: 'Speichert Ihre Wahl für helles oder dunkles Design.' },
      { key: 'questo-reading-list', desc: 'Sichert Ihre Leseliste offline auf Ihrem Gerät.' },
      { key: 'questo-recent-searches', desc: 'Ermöglicht schnellen Zugriff auf Ihre letzten Suchanfragen.' },
    ],
    rightsTitle: '3. Leserrechte & Kontakt',
    rightsDesc: 'Da Questo keine persönlichen Daten speichert, existieren keine Nutzerprofile. Sie behalten die volle Kontrolle über Ihren Cache.',
  },
};

// -------------------------------------------------------------
// 5. EDITORIAL DISCIPLINES TRANSLATIONS
// -------------------------------------------------------------
export const DISCIPLINES_LOCALIZED: Record<string, LocalizedDiscipline[]> = {
  en: [
    {
      number: '01',
      categoryId: 'architecture-and-space',
      categoryShort: 'Architecture',
      title: 'Architecture & Spatial Design',
      desc: 'In-depth photographic essays exploring brutalist structures, tactile materials, and spatial silence.',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
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
      categoryShort: 'Design',
      title: 'Design & Typographic Systems',
      desc: 'Rigorous investigations into Swiss International typography, modular layout staves, and kinetic letterforms.',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=800&q=80',
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
      categoryShort: 'Art & Culture',
      title: 'Art, Culture & Sculpture',
      desc: 'Classical marble endurance, museum heritage studies, and monumental public street murals.',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
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
      categoryShort: 'Tech',
      title: 'Engineering & Static Systems',
      desc: 'Architectural software essays, headless CMS philosophy, and zero-runtime static pre-rendering.',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
      tag: 'engineering',
      tagLabel: '#engineering',
      subcategories: [
        { id: 'system-architecture', name: 'System Architecture' },
        { id: 'static-performance', name: 'Static Performance' },
      ],
    },
  ],
  ur: [
    {
      number: '01',
      categoryId: 'architecture-and-space',
      categoryShort: 'فنِ تعمیر',
      title: 'فنِ تعمیر اور مکانی ڈیزائن',
      desc: 'ٹھوس کنکریٹ، پائیدار پتھر اور خاموش مادی تعمیرات پر مبنی تصویری و تحقیقی مقالات۔',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
      tag: 'architecture',
      tagLabel: 'فنِ تعمیر',
      subcategories: [
        { id: 'minimalist-design', name: 'سادہ و پرسکون ڈیزائن' },
        { id: 'monuments-and-stone', name: 'یادگاریں اور پتھر' },
      ],
    },
    {
      number: '02',
      categoryId: 'design-and-typography',
      categoryShort: 'ڈیزائن',
      title: 'ڈیزائن اور طباعتی نظام',
      desc: 'سوئس انٹرنیشنل ٹائپوگرافی، گرڈ لے آؤٹس اور جدید خطاطی کی گہری تفتیش۔',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=800&q=80',
      tag: 'design-systems',
      tagLabel: 'ڈیزائن سسٹمز',
      subcategories: [
        { id: 'editorial-systems', name: 'ادارتی سسٹمز' },
        { id: 'grid-theory', name: 'گرڈ تھیوری' },
      ],
    },
    {
      number: '03',
      categoryId: 'art-and-culture',
      categoryShort: 'فن و ثقافت',
      title: 'بصری فنون، مجسمہ سازی و ثقافت',
      desc: 'سنگِ مرمر کی پائیداری، عجائب گھروں کے نایاب فن پارے اور عوامی میورلز کا جائزہ۔',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      tag: 'art',
      tagLabel: 'فنون',
      subcategories: [
        { id: 'visual-arts', name: 'بصری فنون' },
        { id: 'sculpture', name: 'مجسمہ سازی' },
      ],
    },
    {
      number: '04',
      categoryId: 'engineering-and-technology',
      categoryShort: 'ٹیکنالوجی',
      title: 'انجینئرنگ اور جامد سسٹمز',
      desc: 'سافٹ ویئر کا فنِ تعمیر، زیرو رن ٹائم جامد ٹیکنالوجی اور اعلیٰ کارکردگی والے ماڈلز۔',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
      tag: 'engineering',
      tagLabel: 'انجینئرنگ',
      subcategories: [
        { id: 'system-architecture', name: 'نظام کا فنِ تعمیر' },
        { id: 'static-performance', name: 'جامد کارکردگی' },
      ],
    },
  ],
  ar: [
    {
      number: '01',
      categoryId: 'architecture-and-space',
      categoryShort: 'عمارة',
      title: 'العمارة الأحادية والمكان',
      desc: 'دراسات بصرية ومقالات نقدية تستكشف الهياكل الخرسانية والفراغات الصامتة.',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
      tag: 'architecture',
      tagLabel: '#عمارة',
      subcategories: [
        { id: 'minimalist-design', name: 'تصميم تبسيطي' },
        { id: 'monuments-and-stone', name: 'نصب وحجارة' },
      ],
    },
    {
      number: '02',
      categoryId: 'design-and-typography',
      categoryShort: 'تصميم',
      title: 'الحرفية الطباعية ونظم الشبكات',
      desc: 'بحث معمق في المدرسة السويسرية والخطوط والتقسيمات المعيارية الحديثة.',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=800&q=80',
      tag: 'design-systems',
      tagLabel: '#نظم_التصميم',
      subcategories: [
        { id: 'editorial-systems', name: 'نظم تحريرية' },
        { id: 'grid-theory', name: 'نظرية الشبكة' },
      ],
    },
    {
      number: '03',
      categoryId: 'art-and-culture',
      categoryShort: 'فن وثقافة',
      title: 'الفنون البصرية والنحت الكلاسيكي',
      desc: 'استكشاف بصري وفلسفي للأشكال الكلاسيكية والمنحوتات الصامدة والفن الحضري.',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      tag: 'art',
      tagLabel: '#فن',
      subcategories: [
        { id: 'visual-arts', name: 'فنون بصرية' },
        { id: 'sculpture', name: 'نحت' },
      ],
    },
    {
      number: '04',
      categoryId: 'engineering-and-technology',
      categoryShort: 'هندسة',
      title: 'العمارة الرقمية وهندسة النظم',
      desc: 'بناء مواقع عديمة الخوادم وسريعة الاستجابة بأعلى معايير الأرشفة دون مكتبات ثقيلة.',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
      tag: 'engineering',
      tagLabel: '#هندسة',
      subcategories: [
        { id: 'system-architecture', name: 'هندسة النظم' },
        { id: 'static-performance', name: 'أداء ثابت' },
      ],
    },
  ],
  es: [
    {
      number: '01',
      categoryId: 'architecture-and-space',
      categoryShort: 'Arquitectura',
      title: 'Arquitectura y Diseño Espacial',
      desc: 'Ensayos fotográficos que exploran estructuras brutalistas, materiales táctiles y silencio espacial.',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
      tag: 'architecture',
      tagLabel: '#arquitectura',
      subcategories: [
        { id: 'minimalist-design', name: 'Diseño Minimalista' },
        { id: 'monuments-and-stone', name: 'Monumentos y Piedra' },
      ],
    },
    {
      number: '02',
      categoryId: 'design-and-typography',
      categoryShort: 'Diseño',
      title: 'Diseño y Sistemas Tipográficos',
      desc: 'Investigaciones sobre la tipografía suiza, cuadrículas modulares y formas de letras cinéticas.',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=800&q=80',
      tag: 'design-systems',
      tagLabel: '#sistemas-diseño',
      subcategories: [
        { id: 'editorial-systems', name: 'Sistemas Editoriales' },
        { id: 'grid-theory', name: 'Teoría de Cuadrículas' },
      ],
    },
    {
      number: '03',
      categoryId: 'art-and-culture',
      categoryShort: 'Arte y Cultura',
      title: 'Arte, Cultura y Escultura',
      desc: 'Durabilidad del mármol clásico, patrimonio museístico y murales urbanos monumentales.',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      tag: 'art',
      tagLabel: '#arte',
      subcategories: [
        { id: 'visual-arts', name: 'Artes Visuales' },
        { id: 'sculpture', name: 'Escultura' },
      ],
    },
    {
      number: '04',
      categoryId: 'engineering-and-technology',
      categoryShort: 'Tecnología',
      title: 'Ingeniería y Sistemas Estáticos',
      desc: 'Arquitectura de software, filosofía headless CMS y renderizado estático de alto rendimiento.',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
      tag: 'engineering',
      tagLabel: '#ingeniería',
      subcategories: [
        { id: 'system-architecture', name: 'Arquitectura de Sistemas' },
        { id: 'static-performance', name: 'Rendimiento Estático' },
      ],
    },
  ],
  fr: [
    {
      number: '01',
      categoryId: 'architecture-and-space',
      categoryShort: 'Architecture',
      title: 'Architecture & Espace',
      desc: 'Essais photographiques explorant les structures brutalistes et le silence spatial.',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
      tag: 'architecture',
      tagLabel: '#architecture',
      subcategories: [
        { id: 'minimalist-design', name: 'Design Minimaliste' },
        { id: 'monuments-and-stone', name: 'Monuments et Pierre' },
      ],
    },
    {
      number: '02',
      categoryId: 'design-and-typography',
      categoryShort: 'Design',
      title: 'Design & Systèmes Typographiques',
      desc: 'Recherches sur le style typographique suisse international et la théorie des grilles.',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=800&q=80',
      tag: 'design-systems',
      tagLabel: '#systèmes-design',
      subcategories: [
        { id: 'editorial-systems', name: 'Systèmes Éditoriaux' },
        { id: 'grid-theory', name: 'Théorie des Grilles' },
      ],
    },
    {
      number: '03',
      categoryId: 'art-and-culture',
      categoryShort: 'Art & Culture',
      title: 'Art, Culture & Sculpture',
      desc: 'Études du marbre antique, préservation muséale et fresques publiques grandioses.',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      tag: 'art',
      tagLabel: '#art',
      subcategories: [
        { id: 'visual-arts', name: 'Arts Visuels' },
        { id: 'sculpture', name: 'Sculpture' },
      ],
    },
    {
      number: '04',
      categoryId: 'engineering-and-technology',
      categoryShort: 'Technologie',
      title: 'Ingénierie & Systèmes Statiques',
      desc: 'Philosophie des architectures numériques statiques et prérendues sans dépendances lourdes.',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
      tag: 'engineering',
      tagLabel: '#ingénierie',
      subcategories: [
        { id: 'system-architecture', name: 'Architecture Système' },
        { id: 'static-performance', name: 'Performance Statique' },
      ],
    },
  ],
  de: [
    {
      number: '01',
      categoryId: 'architecture-and-space',
      categoryShort: 'Architektur',
      title: 'Architektur & Raumgestaltung',
      desc: 'Fotografische Essays über brutalistische Bauwerke, Haptik und räumliche Ruhe.',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
      tag: 'architecture',
      tagLabel: '#architektur',
      subcategories: [
        { id: 'minimalist-design', name: 'Minimalistisches Design' },
        { id: 'monuments-and-stone', name: 'Monumente & Stein' },
      ],
    },
    {
      number: '02',
      categoryId: 'design-and-typography',
      categoryShort: 'Design',
      title: 'Design & Typografische Systeme',
      desc: 'Studien über Schweizer Typografie, modulare Rastersysteme und kinetische Schrift.',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=800&q=80',
      tag: 'design-systems',
      tagLabel: '#design-systeme',
      subcategories: [
        { id: 'editorial-systems', name: 'Editorische Systeme' },
        { id: 'grid-theory', name: 'Rastertheorie' },
      ],
    },
    {
      number: '03',
      categoryId: 'art-and-culture',
      categoryShort: 'Kunst & Kultur',
      title: 'Kunst, Kultur & Skulptur',
      desc: 'Klassische Marmorplastik, museale Denkmalpflege und monumentale Wandmalerei.',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
      tag: 'art',
      tagLabel: '#kunst',
      subcategories: [
        { id: 'visual-arts', name: 'Bildende Kunst' },
        { id: 'sculpture', name: 'Skulptur' },
      ],
    },
    {
      number: '04',
      categoryId: 'engineering-and-technology',
      categoryShort: 'Technologie',
      title: 'Ingenieurwesen & Statische Systeme',
      desc: 'Architektur moderner Softwaresysteme, Headless-Publishing und statische Hochleistung.',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
      tag: 'engineering',
      tagLabel: '#ingenieurwesen',
      subcategories: [
        { id: 'system-architecture', name: 'Systemarchitektur' },
        { id: 'static-performance', name: 'Statische Performance' },
      ],
    },
  ],
};

// -------------------------------------------------------------
// 6. EDITORIAL FAQ TRANSLATIONS
// -------------------------------------------------------------
export const FAQ_LOCALIZED: Record<string, LocalizedFaqItem[]> = {
  en: [
    {
      id: 'faq-1',
      question: 'What is the editorial philosophy of Questo Magazine?',
      answer: 'Questo is an intentional slow-publishing platform dedicated to spatial silence, rigorous typography, and handcrafted software. We deliberately reject infinite algorithmic feeds and bloated client-side code in favor of permanence, clarity, and deep reading.',
    },
    {
      id: 'faq-2',
      question: 'How can independent writers, architects, and photographers submit work?',
      answer: 'We welcome architectural monographs, visual studies, and independent critiques. You can submit pitches via our editorial Contact & Pitch page or collaborate on our open GitHub repository.',
    },
    {
      id: 'faq-3',
      question: 'How does Questo achieve zero-latency performance across six languages?',
      answer: 'Our articles are authored in structured content files and statically pre-rendered at build time. There are zero runtime database lookups, no third-party tracking scripts, and edge caching across global Cloudflare networks.',
    },
    {
      id: 'faq-4',
      question: 'Where can readers purchase the limited physical print edition?',
      answer: 'Issue 03 is printed in a limited run of 1,500 hand-numbered copies on 120gsm Fedrigoni Tintoretto uncoated paper, available through select architecture bookstores in Berlin, London, Tokyo, and Zurich.',
    },
    {
      id: 'faq-5',
      question: 'How are Arabic and Urdu right-to-left typographic nuances handled?',
      answer: 'Arabic and Urdu receive bespoke editorial attention with native typography, mirrored layouts, and authentic vocabulary rather than unreviewed automated translations.',
    },
  ],
  ur: [
    {
      id: 'faq-1',
        question: 'کوئسٹو میگزین کا بنیادی اشاعتی و ادارتی نظریہ کیا ہے؟',
        answer: 'کوئسٹو ایک پرسکون اور سنجیدہ اشاعتی پلیٹ فارم ہے جو مکانی خاموشی، سوئس طباعتی نظم اور پائیدار سافٹ ویئر کے فروغ کے لیے وقف ہے۔ ہم سستے الگورتھمک فیڈز کے مقابلے میں گہرے مطالعے اور مستقل قدر کو ترجیح دیتے ہیں۔',
      },
      {
        id: 'faq-2',
        question: 'آزاد مصنفین، معمار اور عکاس اپنا کام کیسے جمع کروا سکتے ہیں؟',
        answer: 'ہم فنِ تعمیر کے تحقیقی مضامین اور تنقیدی جائزوں کا خیرمقدم کرتے ہیں۔ آپ ہمارے "رابطہ اور مقالہ پیش کریں" صفحے کے ذریعے اپنی تحریر پیش کر سکتے ہیں۔',
      },
      {
        id: 'faq-3',
        question: 'کوئسٹو چھ عالمی زبانوں میں فوری اور بغیر تاخیر رفتار کیسے حاصل کرتا ہے؟',
        answer: 'ہمارے تمام مقالات جامد طور پر پہلے سے تیار (pre-rendered) کیے جاتے ہیں۔ رن ٹائم پر کسی سست ڈیٹا بیس یا بھاری اسکرپٹس کا کوئی بوجھ نہیں ہوتا۔',
      },
      {
        id: 'faq-4',
        question: 'کوئسٹو کی نایاب پرنٹ شدہ کاپی کہاں سے حاصل کی جا سکتی ہے؟',
        answer: 'شمارہ 03 خاص اطالوی کاغذ پر 1,500 دستخط شدہ نسخوں میں شائع کیا گیا ہے، جو برلن، لندن، ٹوکیو اور زیورخ کے منتخب کتب خانوں میں دستیاب ہے۔',
      },
      {
        id: 'faq-5',
        question: 'اردو اور عربی زبانوں کی دائیں سے بائیں خصوصیات کا کیسے خیال رکھا گیا ہے؟',
        answer: 'اردو اور عربی کو مکمل ادارتی درجہ دیا گیا ہے۔ خوبصورت نستعلیق و نسخ فونٹس کے ساتھ ساتھ تمام مینیوز، بٹن اور لے آؤٹس مکمل طور پر دائیں سے بائیں ترتیب پاتے ہیں۔',
      },
    ],
  ar: [
    {
      id: 'faq-1',
      question: 'ما هي الفلسفة التحريرية لمجلة Questo؟',
      answer: 'مجلة Questo هي منصة نشر بطيئة ومتأنية، تركز على العمارة والخطوط البصرية النقية والبرمجيات المصنوعة بحرفية عالية. نرفض ثقافة التغذية الخوارزمية لصالح الوضوح والهدوء والجماليات الدائمة.',
    },
    {
      id: 'faq-2',
      question: 'كيف يمكن للكتاب والمعماريين تقديم مقالاتهم وأعمالهم؟',
      answer: 'نرحب بالمقالات المعمارية والدراسات البصرية والنقدية المستقلة عبر صفحة تقديم المقترحات أو من خلال مستودع GitHub التحريري.',
    },
    {
      id: 'faq-3',
      question: 'كيف تحقق المجلة سرعة فائقة عبر ست لغات عالمية؟',
      answer: 'تُجمع مقالاتنا مسبقاً في ملفات ثابتة عند كل بناء، دون أي قواعد بيانات في وقت التشغيل أو أدوات تتبع تؤخر التصفح، مما يضمن سرعة فائقة.',
    },
    {
      id: 'faq-4',
      question: 'أين يمكن شراء النسخة الورقية المطبوعة (العدد 03)؟',
      answer: 'العدد 03 متاح في إصدار محدود من 1500 نسخة مرقمة يدوياً ومطبوعة على ورق إيطالي فاخر، ومتوفر في مكتبات العمارة ببرلين ولندن وطوكيو.',
    },
    {
      id: 'faq-5',
      question: 'كيف تراعي المجلة خصوصية الخطوط العربية والأردية واتجاه اليمين لليسار؟',
      answer: 'تحظى اللغتان العربية والأردية باهتمام تحريري كامل وليستا مجرد ترجمة آلية، مع اعتماد خطوط أصيلة وقلب كامل لتخطيط الصفحات والقوائم.',
    },
  ],
  es: [
    {
      id: 'faq-1',
      question: '¿Cuál es la filosofía editorial de Questo Magazine?',
      answer: 'Questo es una plataforma de publicación pausada dedicada al silencio espacial, la tipografía rigurosa y el software artesanal, lejos de los algoritmos efímeros.',
    },
    {
      id: 'faq-2',
      question: '¿Cómo pueden arquitectos y críticos enviar sus trabajos?',
      answer: 'Aceptamos monografías y ensayos visuales a través de nuestra página de Contacto y Propuestas o colaborando en nuestro repositorio abierto.',
    },
    {
      id: 'faq-3',
      question: '¿Cómo logra Questo un rendimiento instantáneo en seis idiomas?',
      answer: 'Nuestros artículos se generan estáticamente sin bases de datos en tiempo de ejecución ni scripts de rastreo invasivos.',
    },
    {
      id: 'faq-4',
      question: '¿Dónde se puede adquirir la edición física limitada?',
      answer: 'El Número 03 cuenta con 1.500 copias numeradas en papel Fedrigoni Tintoretto de 120 g/m² en librerías selectas de Berlín, Londres y Tokio.',
    },
    {
      id: 'faq-5',
      question: '¿Cómo se gestiona la tipografía de derecha a izquierda?',
      answer: 'El árabe y el urdu cuentan con atención tipográfica nativa con maquetación RTL completa.',
    },
  ],
  fr: [
    {
      id: 'faq-1',
      question: 'Quelle est la ligne éditoriale de Questo Magazine ?',
      answer: 'Questo est une revue de slow-publishing dédiée au silence spatial, à la typographie suisse et aux architectures logicielles pérennes.',
    },
    {
      id: 'faq-2',
      question: 'Comment proposer un article ou une série photographique ?',
      answer: 'Vous pouvez soumettre vos propositions d’articles via notre page de contact ou contribuer directement sur GitHub.',
    },
    {
      id: 'faq-3',
      question: 'Comment le site assure-t-il une vitesse instantanée ?',
      answer: 'Nos publications sont pré-générées de façon statique, sans base de données dynamique ni traceurs publicitaires.',
    },
    {
      id: 'faq-4',
      question: 'Où acheter l’édition imprimée limitée ?',
      answer: 'Le numéro 03 est tiré à 1 500 exemplaires numérotés sur papier Fedrigoni Tintoretto dans des librairies spécialisées.',
    },
    {
      id: 'faq-5',
      question: 'Comment sont prises en compte les langues RTL ?',
      answer: 'L’arabe et l’ourdou bénéficient d’une composition typographique soignée avec inversion complète de la mise en page.',
    },
  ],
  de: [
    {
      id: 'faq-1',
      question: 'Was ist die redaktionelle Philosophie von Questo?',
      answer: 'Questo ist ein reflektiertes Journal für räumliche Ruhe, strenge Typografie und handwerklich entwickelte Software ohne kurzlebige Feeds.',
    },
    {
      id: 'faq-2',
      question: 'Wie können Autoren und Architekten Beiträge einreichen?',
      answer: 'Wir begrüßen Monographien und Essays über unsere Kontaktseite oder über unser öffentliches GitHub-Repository.',
    },
    {
      id: 'faq-3',
      question: 'Wie erreicht Questo verzögerungsfreie Ladezeiten?',
      answer: 'Alle Inhalte werden statisch vorberechnet – ohne langsame Datenbankabfragen oder externe Tracker.',
    },
    {
      id: 'faq-4',
      question: 'Wo ist die limitierte Printausgabe erhältlich?',
      answer: 'Ausgabe 03 erschien in 1.500 nummerierten Exemplaren auf Fedrigoni-Papier in ausgewählten Architekturbuchhandlungen.',
    },
    {
      id: 'faq-5',
      question: 'Wie werden arabische und Urdu-Schriften unterstützt?',
      answer: 'Arabisch und Urdu erhalten native Schriftarten und eine vollständig gespiegelte RTL-Benutzeroberfläche.',
    },
  ],
};

// -------------------------------------------------------------
// 7. EDITORIAL SPOTLIGHT TRANSLATIONS
// -------------------------------------------------------------
export const SPOTLIGHT_LOCALIZED: Record<string, LocalizedSpotlight> = {
  en: {
    badge: 'Editorial Spotlight',
    location: 'Architectural Archive • Lisbon',
    title: 'Tadao Ando & The Acoustic Sanctuary of Raw Concrete',
    critiqueTag: 'Issue 03 Critique • Monograph Thesis',
    essayTitle: 'The Geometry of Silence',
    essayDesc: 'How raw unadorned concrete, geometric voids, and natural daylight create sanctuaries of contemplative silence in an age of hyper-accelerated digital distraction.',
    quote: 'In space as in software, true luxury is the radical elimination of the unnecessary.',
    authorLabel: 'Essay by',
    authorName: 'Mateo Silva',
    authorSlug: 'mateo-silva',
    readAction: 'Read Monograph',
  },
  ur: {
    badge: 'اداریاتی جھلک',
    location: 'معمارانہ آرکائیو • لزبن',
    title: 'تاداو آنڈو اور خام کنکریٹ کی صوتی پناہ گاہ',
    critiqueTag: 'شمارہ 03 تنقیدی جائزہ • مقالہ',
    essayTitle: 'خاموشی کی جیومیٹری اور ساخت',
    essayDesc: 'خام کنکریٹ، جیومیٹریکل خلا اور قدرتی روشنی کس طرح ڈیجیٹل شور کے دور میں گہرے غور و فکر کے خاموش گوشے تشکیل دیتے ہیں۔',
    quote: 'مکان ہو یا سافٹ ویئر، حقیقی نفاست غیر ضروری عناصر کے مکمل خاتمے میں ہے۔',
    authorLabel: 'مقالہ نگار',
    authorName: 'ماتییو سلوا',
    authorSlug: 'mateo-silva',
    readAction: 'مقالہ پڑھیں',
  },
  ar: {
    badge: 'إضاءة تحريرية',
    location: 'الأرشيف المعماري • لشبونة',
    title: 'تاداو أندو والملاذ الصوتي للخرسانة الخام',
    critiqueTag: 'نقد العدد 03 • أطروحة دراسية',
    essayTitle: 'هندسة الصمت والفراغ',
    essayDesc: 'كيف تصنع الخرسانة المكشوفة والفراغات الهندسية والضوء الطبيعي ملاذات للتأمل الصامت في عصر التشتت الرقمي المتسارع.',
    quote: 'في المكان كما في البرمجيات، الرفاهية الحقيقية تكمن في الاستغناء الجذري عما لا لزوم له.',
    authorLabel: 'بقلم',
    authorName: 'ماتيو سيلفا',
    authorSlug: 'mateo-silva',
    readAction: 'اقرأ الدراسة',
  },
  es: {
    badge: 'Destacado Editorial',
    location: 'Archivo Arquitectónico • Lisboa',
    title: 'Tadao Ando y el Santuario Acústico del Hormigón Visto',
    critiqueTag: 'Crítica Número 03 • Tesis Monográfica',
    essayTitle: 'La Geometría del Silencio',
    essayDesc: 'Cómo el hormigón visto, los vacíos geométricos y la luz natural crean santuarios de contemplación en la era de la distracción digital.',
    quote: 'En el espacio como en el software, el verdadero lujo es la eliminación radical de lo innecesario.',
    authorLabel: 'Ensayo por',
    authorName: 'Mateo Silva',
    authorSlug: 'mateo-silva',
    readAction: 'Leer Monografía',
  },
  fr: {
    badge: 'Focus Éditorial',
    location: 'Archives Architecturales • Lisbonne',
    title: 'Tadao Ando et le Sanctuaire Acoustique du Béton Brut',
    critiqueTag: 'Critique Numéro 03 • Thèse Monographique',
    essayTitle: 'La Géométrie du Silence',
    essayDesc: 'Comment le béton brut, les vides géométriques et la lumière du jour créent des havres de silence contemplatif face au tumulte numérique.',
    quote: 'Dans l’espace comme dans le code, le vrai luxe réside dans l’élimination radicale du superflu.',
    authorLabel: 'Essai par',
    authorName: 'Mateo Silva',
    authorSlug: 'mateo-silva',
    readAction: 'Lire la Monographie',
  },
  de: {
    badge: 'Redaktioneller Schwerpunkt',
    location: 'Architekturarchiv • Lissabon',
    title: 'Tadao Ando & Das Akustische Refugium aus Sichtbeton',
    critiqueTag: 'Kritik Ausgabe 03 • Monographische These',
    essayTitle: 'Die Geometrie der Stille',
    essayDesc: 'Wie unverzierter Sichtbeton, geometrische Hohlräume und Tageslicht Rückzugsorte für stille Reflexion schaffen.',
    quote: 'Im Raum wie in der Software ist wahrer Luxus die radikale Beseitigung des Unnötigen.',
    authorLabel: 'Essay von',
    authorName: 'Mateo Silva',
    authorSlug: 'mateo-silva',
    readAction: 'Monographie lesen',
  },
};

// -------------------------------------------------------------
// 8. EDITORIAL MARQUEE DISPATCHES
// -------------------------------------------------------------
export const MARQUEE_DISPATCHES: Record<string, { text: string; highlight: boolean }[]> = {
  en: [
    { text: 'ISSUE 03 NOW AVAILABLE IN PRINT WORLDWIDE', highlight: true },
    { text: 'LIMITED RUN OF 1,500 HAND-NUMBERED COPIES', highlight: false },
    { text: 'WEEKLY EDITORIAL MONOGRAPHS ON VISUAL CULTURE', highlight: false },
  ],
  ur: [
    { text: 'شمارہ 03 اب دنیا بھر میں پرنٹ ایڈیشن میں دستیاب ہے', highlight: true },
    { text: '1,500 دستخط شدہ نسخوں کا نایاب محدود ایڈیشن', highlight: false },
    { text: 'بصری ثقافت اور فنِ تعمیر پر ہفتہ وار تحقیقی مقالے', highlight: false },
  ],
  ar: [
    { text: 'العدد 03 متوفر الآن في إصدار ورقي حول العالم', highlight: true },
    { text: 'إصدار محدود من 1500 نسخة مرقمة يدوياً', highlight: false },
    { text: 'دراسات أسبوعية متعمقة في الفنون البصرية والعمارة', highlight: false },
  ],
  es: [
    { text: 'NÚMERO 03 YA DISPONIBLE EN PAPEL EN TODO EL MUNDO', highlight: true },
    { text: 'TIRADA LIMITADA DE 1.500 EJEMPLARES NUMERADOS A MANO', highlight: false },
    { text: 'MONOGRAFÍAS SEMANALES SOBRE CULTURA VISUAL Y ARQUITECTURA', highlight: false },
  ],
  fr: [
    { text: 'LE NUMÉRO 03 DISPONIBLE EN ÉDITION PAPIER DANS LE MONDE ENTIER', highlight: true },
    { text: 'TIRAGE LIMITÉ À 1 500 EXEMPLAIRES NUMÉROTÉS À LA MAIN', highlight: false },
    { text: 'MONOGRAPHIES ÉDITORIALES HEBDOMADAIRES SUR LA CULTURE VISUELLE', highlight: false },
  ],
  de: [
    { text: 'AUSGABE 03 AB SOFORT WELTWEIT IM DRUCK ERHÄLTLICH', highlight: true },
    { text: 'LIMITIERTE AUFLAGE VON 1.500 HANDNUMMERIERTEN EXEMPLAREN', highlight: false },
    { text: 'WÖCHENTLICHE MONOGRAPHIEN ZUR VISUELLEN KULTUR UND ARCHITEKTUR', highlight: false },
  ],
};

// -------------------------------------------------------------
// 9. SHOWCASE SLIDER ISSUE TAGS
// -------------------------------------------------------------
export const SLIDER_TAGS: Record<string, Record<string, string>> = {
  en: {
    'the-geometry-of-silence': 'CONTEMPORARY ARCHITECTURE & SPATIAL DESIGN',
    'the-death-of-the-card-grid': 'VISUAL CULTURE & DIGITAL EXPERIMENTS',
    'craft-over-convenience': 'MATERIAL CULTURE & ARTISANAL CRAFT',
    'pure-functional-simplicity': 'INDUSTRIAL DESIGN & RATIONAL SYSTEMS',
    'the-poetics-of-concrete': 'MONOGRAPH // STRUCTURAL FORM',
    'the-grid-as-an-instrument': 'EDITORIAL TYPOGRAPHY & SYSTEMS',
  },
  ur: {
    'the-geometry-of-silence': 'جدید فنِ تعمیر اور مکانی ڈیزائن',
    'the-death-of-the-card-grid': 'بصری ثقافت اور ڈیجیٹل تجربات',
    'craft-over-convenience': 'مادی ثقافت اور روایتی دستکاری',
    'pure-functional-simplicity': 'صنعتی ڈیزائن اور منطقی سسٹمز',
    'the-poetics-of-concrete': 'مقالہ // ساختی اشکال و ہیئت',
    'the-grid-as-an-instrument': 'ادارتی خطاطی اور طباعتی سسٹمز',
  },
  ar: {
    'the-geometry-of-silence': 'العمارة المعاصرة والتصميم المكاني',
    'the-death-of-the-card-grid': 'الثقافة البصرية والتجارب الرقمية',
    'craft-over-convenience': 'الثقافة المادية والحرفية اليدوية',
    'pure-functional-simplicity': 'التصميم الصناعي والنظم العقلانية',
    'the-poetics-of-concrete': 'دراسة // الشكل البنيوي والكتلة',
    'the-grid-as-an-instrument': 'الطباعة التحريرية ونظم الشبكات',
  },
  es: {
    'the-geometry-of-silence': 'ARQUITECTURA CONTEMPORÁNEA Y DISEÑO ESPACIAL',
    'the-death-of-the-card-grid': 'CULTURA VISUAL Y EXPERIMENTOS DIGITALES',
    'craft-over-convenience': 'CULTURA MATERIAL Y ARTESANÍA MANUAL',
    'pure-functional-simplicity': 'DISEÑO INDUSTRIAL Y SISTEMAS RACIONALES',
    'the-poetics-of-concrete': 'MONOGRAFÍA // FORMA ESTRUCTURAL',
    'the-grid-as-an-instrument': 'TIPOGRAFÍA EDITORIAL Y SISTEMAS',
  },
  fr: {
    'the-geometry-of-silence': 'ARCHITECTURE CONTEMPORAINE & DESIGN SPATIAL',
    'the-death-of-the-card-grid': 'CULTURE VISUELLE & EXPÉRIMENTATIONS',
    'craft-over-convenience': 'CULTURE MATÉRIELLE & ARTISANAT D’ART',
    'pure-functional-simplicity': 'DESIGN INDUSTRIEL & SYSTÈMES RATIONNELS',
    'the-poetics-of-concrete': 'MONOGRAPHIE // FORME STRUCTURELLE',
    'the-grid-as-an-instrument': 'TYPOGRAPHIE ÉDITORIALE & GRILLES',
  },
  de: {
    'the-geometry-of-silence': 'ZEITGENÖSSISCHE ARCHITEKTUR & RAUMDESIGN',
    'the-death-of-the-card-grid': 'VISUELLE KULTUR & DIGITALE EXPERIMENTE',
    'craft-over-convenience': 'MATERIALKULTUR & HANDWERKSKUNST',
    'pure-functional-simplicity': 'INDUSTRIEDESIGN & RATIONALE SYSTEME',
    'the-poetics-of-concrete': 'MONOGRAPHIE // STRUKTURELLE FORM',
    'the-grid-as-an-instrument': 'REDAKTIONELLE TYPOGRAFIE & SYSTEME',
  },
};
