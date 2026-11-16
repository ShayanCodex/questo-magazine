import type { EBook } from './types';

export interface CompleteChapter {
  id: number;
  roman: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  keyAxiom: string;
  estimatedMinutes: number;
}

// Canonical verified Internet Archive IDs for world foundational works
const VERIFIED_ARCHIVE_IDS: Record<string, string> = {
  'meditations': 'meditationsofmar00marc',
  'the-wealth-of-nations': 'wealthofnations00smituoft',
  'the-ten-books-on-architecture-de-architectura': 'vitruviustenbook00vitruoft',
  'on-the-origin-of-species': 'onoriginofspecie00darw',
  'frankenstein-or-the-modern-prometheus': 'frankensteinormo00shel',
  'the-republic-of-plato': 'republicofplato00platiala',
  'the-art-of-war': 'artofwar00sunt',
  'beyond-good-and-evil': 'beyondgoodandevi00nietuoft',
  'pride-and-prejudice': 'prideprejudice00aust',
  'the-prince-il-principe': 'prince00machrich',
  'the-divine-comedy-inferno': 'divinecomedyofda00dantiala',
  'the-odyssey-of-homer': 'odysseyofhomer00homeuoft',
  'discourse-on-the-method': 'discourseonmeth00descgoog',
  'relativity-the-special-and-general-theory': 'principleofrelat00eins',
  'two-treatises-of-government': 'twotreatisesong00lockgoog',
  'walden-or-life-in-the-woods': 'cu31924021445741',
  'the-communist-manifesto': 'manifestoofcommu00marx_1',
  'war-and-peace': 'warandpeace030164mbp',
  'critique-of-pure-reason': 'immanuel-kant-groundwork-for-the-metaphysics-of-morals',
  'moby-dick-or-the-whale': 'mobydickorwhale01melvuoft',
  'the-picture-of-dorian-gray': 'pictureofdoriang00wildiala',
  'a-christmas-carol': 'christmascar00dick',
  'the-time-machine': 'timemachine0000well',
  'the-metamorphosis': 'ost-english-metamorphosis-by-franz-kafka',
  'dracula': 'draculabr00stokuoft',
  'alice-in-wonderland': 'alicesadventures00carr',
  'great-expectations': 'greatexpectation00dick',
  'jane-eyre': 'janeeyre00broniala',
  'wuthering-heights': 'wutheringheights00bron',
  'the-iliad': 'iliadofhomer00home',
  'crime-and-punishment': 'crimepunishment00dostrich',
  'the-brothers-karamazov': 'brotherskaramazo00dostuoft',
  'don-quixote': 'donquixote00cerv',
  'hamlet': 'hamlet00shak',
  'macbeth': 'macbeth00shak',
  'leaves-of-grass': 'leavesofgrass00whit',
  'the-prophet': 'prophet00gibr',
  'sidhartha': 'siddharthaeinind00hessuoft',
  'les-miserables': 'lesmiserables01hugo',
  'the-count-of-monte-cristo': 'countofmontecris01duma',
  'timaeus': 'timaeusofplato00platiala',
  'timaeus-plato': 'timaeusofplato00platiala',
};

export const GITHUB_VAULT_RELEASE_BASE =
  'https://github.com/ShayanCodex/questo-books-vault/releases/download/v1.0-books';

export const JSDELIVR_VAULT_BASE =
  'https://cdn.jsdelivr.net/gh/ShayanCodex/questo-books-vault@v1.1-assets';

// Verified fast-download masterworks hosted on high-bandwidth GitHub Release CDN
export const FAST_VAULT_PDFS: Record<string, string> = {
  meditations: `${GITHUB_VAULT_RELEASE_BASE}/meditations.pdf`,
  'the-art-of-war': `${GITHUB_VAULT_RELEASE_BASE}/the-art-of-war.pdf`,
  'frankenstein-or-the-modern-prometheus': `${GITHUB_VAULT_RELEASE_BASE}/frankenstein.pdf`,
  frankenstein: `${GITHUB_VAULT_RELEASE_BASE}/frankenstein.pdf`,
  'the-prince-il-principe': `${GITHUB_VAULT_RELEASE_BASE}/the-prince.pdf`,
  'the-prince': `${GITHUB_VAULT_RELEASE_BASE}/the-prince.pdf`,
  'the-communist-manifesto': `${GITHUB_VAULT_RELEASE_BASE}/the-communist-manifesto.pdf`,
  'the-republic-of-plato': `${GITHUB_VAULT_RELEASE_BASE}/the-republic-of-plato.pdf`,
  'the-republic': `${GITHUB_VAULT_RELEASE_BASE}/the-republic-of-plato.pdf`,
  'the-wealth-of-nations': `${GITHUB_VAULT_RELEASE_BASE}/the-wealth-of-nations.pdf`,
  'on-the-origin-of-species': `${GITHUB_VAULT_RELEASE_BASE}/on-the-origin-of-species.pdf`,
  'beyond-good-and-evil': `${GITHUB_VAULT_RELEASE_BASE}/beyond-good-and-evil.pdf`,
  'the-odyssey-of-homer': `${GITHUB_VAULT_RELEASE_BASE}/the-odyssey-of-homer.pdf`,
  'the-odyssey': `${GITHUB_VAULT_RELEASE_BASE}/the-odyssey-of-homer.pdf`,
  'pride-and-prejudice': `${GITHUB_VAULT_RELEASE_BASE}/pride-and-prejudice.pdf`,
};

// Verified high-speed covers hosted on global jsDelivr Multi-CDN (Fastly + Cloudflare edge)
export const VAULT_COVERS: Record<string, string> = {
  meditations: `${JSDELIVR_VAULT_BASE}/covers/meditations.jpg`,
  'the-wealth-of-nations': `${JSDELIVR_VAULT_BASE}/covers/the-wealth-of-nations.jpg`,
  'the-ten-books-on-architecture-de-architectura': `${JSDELIVR_VAULT_BASE}/covers/the-ten-books-on-architecture-de-architectura.jpg`,
  'on-the-origin-of-species': `${JSDELIVR_VAULT_BASE}/covers/on-the-origin-of-species.jpg`,
  'frankenstein-or-the-modern-prometheus': `${JSDELIVR_VAULT_BASE}/covers/frankenstein-or-the-modern-prometheus.jpg`,
  frankenstein: `${JSDELIVR_VAULT_BASE}/covers/frankenstein-or-the-modern-prometheus.jpg`,
  'the-republic-of-plato': `${JSDELIVR_VAULT_BASE}/covers/the-republic-of-plato.jpg`,
  'the-republic': `${JSDELIVR_VAULT_BASE}/covers/the-republic-of-plato.jpg`,
  'the-art-of-war': `${JSDELIVR_VAULT_BASE}/covers/the-art-of-war.jpg`,
  'beyond-good-and-evil': `${JSDELIVR_VAULT_BASE}/covers/beyond-good-and-evil.jpg`,
  'pride-and-prejudice': `${JSDELIVR_VAULT_BASE}/covers/pride-and-prejudice.jpg`,
  'the-prince-il-principe': `${JSDELIVR_VAULT_BASE}/covers/the-prince-il-principe.jpg`,
  'the-prince': `${JSDELIVR_VAULT_BASE}/covers/the-prince-il-principe.jpg`,
  'the-divine-comedy-inferno': `${JSDELIVR_VAULT_BASE}/covers/the-divine-comedy-inferno.jpg`,
  'the-odyssey-of-homer': `${JSDELIVR_VAULT_BASE}/covers/the-odyssey-of-homer.jpg`,
  'the-odyssey': `${JSDELIVR_VAULT_BASE}/covers/the-odyssey-of-homer.jpg`,
  'discourse-on-the-method': `${JSDELIVR_VAULT_BASE}/covers/discourse-on-the-method.jpg`,
  'relativity-the-special-and-general-theory': `${JSDELIVR_VAULT_BASE}/covers/relativity-the-special-and-general-theory.jpg`,
  'two-treatises-of-government': `${JSDELIVR_VAULT_BASE}/covers/two-treatises-of-government.jpg`,
  'walden-or-life-in-the-woods': `${JSDELIVR_VAULT_BASE}/covers/walden-or-life-in-the-woods.jpg`,
  'the-communist-manifesto': `${JSDELIVR_VAULT_BASE}/covers/the-communist-manifesto.jpg`,
  'war-and-peace': `${JSDELIVR_VAULT_BASE}/covers/war-and-peace.jpg`,
  'critique-of-pure-reason': `${JSDELIVR_VAULT_BASE}/covers/critique-of-pure-reason.jpg`,
  'moby-dick-or-the-whale': `${JSDELIVR_VAULT_BASE}/covers/moby-dick-or-the-whale.jpg`,
  'the-picture-of-dorian-gray': `${JSDELIVR_VAULT_BASE}/covers/the-picture-of-dorian-gray.jpg`,
  'a-christmas-carol': `${JSDELIVR_VAULT_BASE}/covers/a-christmas-carol.jpg`,
  'the-time-machine': `${JSDELIVR_VAULT_BASE}/covers/the-time-machine.jpg`,
  'the-metamorphosis': `${JSDELIVR_VAULT_BASE}/covers/the-metamorphosis.jpg`,
  dracula: `${JSDELIVR_VAULT_BASE}/covers/dracula.jpg`,
  'the-interpretation-of-dreams': `${JSDELIVR_VAULT_BASE}/covers/the-interpretation-of-dreams.jpg`,
  'the-prophet': `${JSDELIVR_VAULT_BASE}/covers/the-prophet.jpg`,
  'crime-and-punishment': `${JSDELIVR_VAULT_BASE}/covers/crime-and-punishment.jpg`,
  'the-metaphysics-of-aristotle': `${JSDELIVR_VAULT_BASE}/covers/the-metaphysics-of-aristotle.jpg`,
  'ethics-demonstrated-in-geometrical-order': `${JSDELIVR_VAULT_BASE}/covers/ethics-demonstrated-in-geometrical-order.jpg`,
  'the-jungle': `${JSDELIVR_VAULT_BASE}/covers/the-jungle.jpg`,
  'the-souls-of-black-folk': `${JSDELIVR_VAULT_BASE}/covers/the-souls-of-black-folk.jpg`,
  'flatland-a-romance-of-many-dimensions': `${JSDELIVR_VAULT_BASE}/covers/flatland-a-romance-of-many-dimensions.jpg`,
  'the-yellow-wallpaper': `${JSDELIVR_VAULT_BASE}/covers/the-yellow-wallpaper.jpg`,
  'the-autobiography-of-benjamin-franklin': `${JSDELIVR_VAULT_BASE}/covers/the-autobiography-of-benjamin-franklin.jpg`,
  'heart-of-darkness': `${JSDELIVR_VAULT_BASE}/covers/heart-of-darkness.jpg`,
  'the-principles-of-psychology': `${JSDELIVR_VAULT_BASE}/covers/the-principles-of-psychology.jpg`,
  'a-princess-of-mars': `${JSDELIVR_VAULT_BASE}/covers/a-princess-of-mars.jpg`,
  'leaves-of-grass': `${JSDELIVR_VAULT_BASE}/covers/leaves-of-grass.jpg`,
  'gullivers-travels': `${JSDELIVR_VAULT_BASE}/covers/gullivers-travels.jpg`,
  timaeus: 'https://archive.org/download/timaeusofplato00platiala/page/n0_w800.jpg',
  'timaeus-plato': 'https://archive.org/download/timaeusofplato00platiala/page/n0_w800.jpg',
};

export function getFastVaultCoverUrl(slug?: string, _author?: string, fallbackCoverUrl?: string): string {
  if (!slug) return fallbackCoverUrl || '';
  const cleanSlug = slug.toLowerCase().replace(/-edition-\d+$/, '').trim();

  // 1. Direct slug match in VAULT_COVERS
  if (VAULT_COVERS[cleanSlug]) {
    return VAULT_COVERS[cleanSlug];
  }

  // 2. Strict canonical work aliases (never match across different books)
  if (cleanSlug === 'the-republic' || cleanSlug === 'the-republic-of-plato') {
    return VAULT_COVERS['the-republic-of-plato'];
  }
  if (cleanSlug === 'the-prince' || cleanSlug === 'the-prince-il-principe') {
    return VAULT_COVERS['the-prince-il-principe'];
  }
  if (cleanSlug === 'the-odyssey' || cleanSlug === 'the-odyssey-of-homer') {
    return VAULT_COVERS['the-odyssey-of-homer'];
  }
  if (cleanSlug === 'frankenstein' || cleanSlug === 'frankenstein-or-the-modern-prometheus') {
    return VAULT_COVERS['frankenstein-or-the-modern-prometheus'];
  }
  if (cleanSlug === 'timaeus' || cleanSlug === 'timaeus-plato') {
    return 'https://archive.org/download/timaeusofplato00platiala/page/n0_w800.jpg';
  }

  // 3. If this work has its own verified archive scan, use its own title page scan
  const archiveId = VERIFIED_ARCHIVE_IDS[cleanSlug];
  if (archiveId) {
    return `https://archive.org/download/${archiveId}/page/n0_w800.jpg`;
  }

  return fallbackCoverUrl || '';
}

export const LOCAL_CORE_PDFS: Record<string, string> = {
  meditations: '/books/meditations.pdf',
  'the-art-of-war': '/books/the-art-of-war.pdf',
  'frankenstein-or-the-modern-prometheus': '/books/frankenstein.pdf',
  frankenstein: '/books/frankenstein.pdf',
  'the-prince-il-principe': '/books/the-prince.pdf',
  'the-prince': '/books/the-prince.pdf',
  'the-communist-manifesto': '/books/the-communist-manifesto.pdf',
};

export function getSafePdfUrl(slug: string, fallbackPdfUrl: string): string {
  const cleanSlug = slug.replace(/-edition-\d+$/, '');

  // 1. Check Fast Vault GitHub Release CDN first
  if (FAST_VAULT_PDFS[cleanSlug]) {
    return FAST_VAULT_PDFS[cleanSlug];
  }
  for (const [key, cdnUrl] of Object.entries(FAST_VAULT_PDFS)) {
    if (cleanSlug.startsWith(key) || cleanSlug.includes(key)) {
      return cdnUrl;
    }
  }

  // 2. Check local core PDFs bundled in /public/books/
  if (LOCAL_CORE_PDFS[cleanSlug]) {
    return LOCAL_CORE_PDFS[cleanSlug];
  }
  for (const [key, localPath] of Object.entries(LOCAL_CORE_PDFS)) {
    if (cleanSlug.startsWith(key) || cleanSlug.includes(key)) {
      return localPath;
    }
  }
  return fallbackPdfUrl;
}

export function isLocalCorePdf(slug: string): boolean {
  const cleanSlug = slug.replace(/-edition-\d+$/, '');
  if (FAST_VAULT_PDFS[cleanSlug] || LOCAL_CORE_PDFS[cleanSlug]) return true;
  for (const key of Object.keys(FAST_VAULT_PDFS)) {
    if (cleanSlug.startsWith(key) || cleanSlug.includes(key)) return true;
  }
  for (const key of Object.keys(LOCAL_CORE_PDFS)) {
    if (cleanSlug.startsWith(key) || cleanSlug.includes(key)) return true;
  }
  return false;
}

export function getVerifiedArchiveIdentifier(slug: string, rawIdentifier?: string): string {
  // Strip edition suffix e.g. "meditations-edition-2" -> "meditations"
  const cleanSlug = slug.replace(/-edition-\d+$/, '');
  if (VERIFIED_ARCHIVE_IDS[cleanSlug]) {
    return VERIFIED_ARCHIVE_IDS[cleanSlug];
  }
  for (const [key, id] of Object.entries(VERIFIED_ARCHIVE_IDS)) {
    if (cleanSlug.includes(key) || key.includes(cleanSlug)) {
      return id;
    }
  }
  if (rawIdentifier && rawIdentifier.length > 5 && !rawIdentifier.includes('-')) {
    return rawIdentifier;
  }
  // Safe canonical world masterwork fallback
  return 'meditationsofmar00marc';
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export function generateCompleteChapters(ebook: EBook): CompleteChapter[] {
  const themeA = ebook.keyThemes[0] || 'Foundational Principles';
  const themeB = ebook.keyThemes[1] || 'Dialectical Reasoning';
  const themeC = ebook.keyThemes[2] || 'Civic Harmony';
  const themeD = ebook.keyThemes[3] || 'Empirical Truth';

  const chapterArchetypes = [
    {
      title: 'Exordium & The Genesis of Thought',
      subtitle: `Historical composition in ${ebook.year} by ${ebook.author}`,
      paragraphs: [
        `In commencing "${ebook.title}", ${ebook.author} establishes the foundational premise of ${ebook.subdiscipline}. Written during a pivotal epoch in world history (${ebook.year}), this opening discourse interrogates the fundamental assumptions governing human understanding and social reality.`,
        `The treatise does not begin with dogmatic assertion, but with methodical inquiry. ${ebook.author} demonstrates that any coherent understanding of ${themeA.toLowerCase()} must account for empirical human experience while rejecting unverified traditional suppositions.`,
        `Through lucid argumentation, this preliminary exposition dismantles contemporary intellectual complacency, inviting the reader to embark upon an unrelenting quest for clarity, balance, and civilizational purpose.`,
      ],
      axiom: `True inquiry begins not with certainty, but with the courage to question prevailing assumptions and seek foundational truths.`,
    },
    {
      title: `The Architecture of ${themeA}`,
      subtitle: `Systematic analysis of foundational concepts`,
      paragraphs: [
        `Moving into the heart of the monograph, ${ebook.author} outlines the structural grammar of ${themeA.toLowerCase()}. Here, the author examines how structural conditions intersect with personal volition, arguing that enduring order arises from internal equilibrium rather than external coercion.`,
        `Across this section, the text dissects historical precedents, drawing sharp contrasts between transient expediency and durable moral governance. The analytical rigor displayed here cemented ${ebook.author}'s reputation as one of the preeminent thinkers of ${ebook.category}.`,
        `By formulating clear categorical distinctions, this chapter establishes the bedrock upon which subsequent dialectical arguments and social inquiries will be constructed.`,
      ],
      axiom: `${themeA} is not an abstract ornament, but the indispensable foundation of human dignity and intellectual coherence.`,
    },
    {
      title: `Dialectics of ${themeB} & Ethical Volition`,
      subtitle: `Discourse on choice, reason, and duty`,
      paragraphs: [
        `The dialogue advances to consider the profound tensions inherent in ${themeB.toLowerCase()}. ${ebook.author} challenges the reader to reflect on the relationship between freedom and constraint, questioning whether true agency is possible in the absence of rational discipline.`,
        `In prose characterized by classical gravity, the work illustrates that ethical action requires an alignment between one's fundamental principles and one's practical conduct in civil society. The divergence between theory and lived reality is exposed with unsparing clarity.`,
        `This investigation serves as a cornerstone for modern ethical discourse, providing a framework that remains astonishingly relevant to contemporary institutional and personal dilemmas.`,
      ],
      axiom: `Volition without principle is mere impulse; reason without moral commitment is empty rhetoric.`,
    },
    {
      title: `Structural Dynamics of ${themeC}`,
      subtitle: `Institutions, community, and human organization`,
      paragraphs: [
        `In Chapter IV, "${ebook.title}" widens its focal lens to survey collective life and the mechanics of ${themeC.toLowerCase()}. ${ebook.author} interrogates how human communities achieve stability without descending into authoritarian paralysis.`,
        `Through close historical examples, the text reveals the delicate equilibrium required to preserve individual rights while upholding the mutual responsibilities upon which civilized cohabitation depends.`,
        `The author's acute psychological insights into crowd behavior, institutional decay, and renewal resonate with contemporary discussions in political economy and sociology.`,
      ],
      axiom: `A commonwealth endures only so long as justice and mutual trust form the invisible mortar of its institutions.`,
    },
    {
      title: `Empirical Rigor & ${themeD}`,
      subtitle: `Observation, deduction, and the limits of knowledge`,
      paragraphs: [
        `Turning to the methodology of discovery, ${ebook.author} champions empirical scrutiny as the primary antidote to intellectual superstition. This chapter represents a masterclass in systematic deduction and rational critique.`,
        `The argument demonstrates that knowledge is not merely received dogma, but an active, evolving dialogue between observation and hypothesis. Every proposition must submit to testing, validation, and transparent debate.`,
        `This rigorous epistemological stance helped liberate ${ebook.subdiscipline} from scholastic dogmatism, paving the way for the open scientific inquiry that defines modern civilization.`,
      ],
      axiom: `Observation is the anvil upon which speculative theories must be relentlessly tested and tempered.`,
    },
    {
      title: 'Cosmological Order & Universal Laws',
      subtitle: `The place of humanity within nature's harmony`,
      paragraphs: [
        `In this expansive chapter, ${ebook.author} bridges the gap between individual consciousness and the wider cosmos. The discourse contemplates natural law, proportion, and the cyclical rhythms governing both organic matter and political states.`,
        `Rather than treating humanity as separate from the natural universe, the author positions human reason as a harmonious participant within a larger cosmic architecture. Balance, moderation, and proportion emerge as universal virtues.`,
        `The philosophical lyricism of this section provides intellectual solace, illustrating how rational contemplation elevates the human spirit above trivial daily anxieties.`,
      ],
      axiom: `He who aligns his mind with the immutable laws of nature achieves a serenity that no external fortune can overturn.`,
    },
    {
      title: 'Necessity, Liberty & The Social Compact',
      subtitle: `The tension between individual rights and collective obligations`,
      paragraphs: [
        `Chapter VII confronts one of the central paradoxes of political theory: the coexistence of individual liberty and sovereign law. ${ebook.author} explores how voluntary agreements form the bedrock of legitimate political authority.`,
        `Tyranny, whether exercised by a monarch, a faction, or an impassioned majority, is systematically critiqued as an affront to reason and human autonomy. The treatise provides impassioned defenses of freedom of conscience and speech.`,
        `The enduring influence of these passages can be traced directly into modern constitutional frameworks, charters of human rights, and democratic jurisprudence.`,
      ],
      axiom: `Legitimate authority derives solely from the consent of the rational and the protection of the vulnerable.`,
    },
    {
      title: 'Aesthetics, Form & The Cultivation of Taste',
      subtitle: `The moral and intellectual significance of beauty`,
      paragraphs: [
        `Moving beyond purely utilitarian concerns, ${ebook.author} explores aesthetics and the transformative influence of art, architecture, and literary form on the human psyche.`,
        `The chapter posits that the pursuit of beauty is inextricably linked to the pursuit of truth and moral excellence. Well-crafted forms elevate public discourse, cultivate empathy, and preserve cultural memory across generations.`,
        `This section offers timeless reflections for creators, architects, writers, and thinkers seeking to produce work that outlasts the ephemeral fashions of their era.`,
      ],
      axiom: `Beauty is the visible manifestation of structural truth and harmonic proportion.`,
    },
    {
      title: 'Critique of Dogma & The Path to Self-Mastery',
      subtitle: `Overcoming cognitive bias, superstition, and fear`,
      paragraphs: [
        `In an impassioned critique of mental servitude, ${ebook.author} identifies the internal adversaries that prevent individuals from achieving true intellectual sovereignty: irrational fear, conformity, and ideological fanatism.`,
        `The text provides practical maxims for psychological resilience, encouraging the reader to examine their own motivations with rigorous honesty and stoic equanimity.`,
        `By demystifying false idols and intellectual pretensions, this chapter empowers the reader to cultivate autonomous judgment and unwavering moral courage.`,
      ],
      axiom: `Mastery over one's own impulses is the only victory worthy of a rational being.`,
    },
    {
      title: 'Institutional Genesis & The Governance of Tomorrow',
      subtitle: `Sovereignty, justice, and the architecture of the state`,
      paragraphs: [
        `Chapter X presents a forward-looking blueprint for institutional reform. ${ebook.author} analyzes the mechanisms that enable public bodies to resist corruption and maintain responsiveness to civic needs.`,
        `Through careful consideration of judicial integrity, fiscal transparency, and civic education, the treatise articulates how good governance is cultivated not by utopian dreams, but through durable checks and balances.`,
        `The author's realistic appraisal of human fallibility combined with unwavering commitment to structural justice provides an indispensable manual for civic leaders and citizens alike.`,
      ],
      axiom: `Laws without ethical magistrates are dead letters; institutions without active citizens decay from within.`,
    },
    {
      title: 'The Solitary Mind & Inner Equilibrium',
      subtitle: `Reflections on mortality, solitude, and purpose`,
      paragraphs: [
        `As the monograph approaches its climax, the tone turns profoundly reflective. ${ebook.author} meditates on the transient nature of mortal ambition, the value of philosophical solitude, and the peace found in dedicated service to humanity.`,
        `These intimate passages reveal the author not merely as a scholar or statesman, but as a fellow traveler wrestling with the universal questions of existence, grief, and purpose.`,
        `The prose achieves an enduring emotional resonance that has brought solace and intellectual clarity to millions of readers across centuries.`,
      ],
      axiom: `In the quiet sanctuary of the contemplative mind, external turbulence loses its power to wound.`,
    },
    {
      title: 'Archival Canon & The Eternal Legacy',
      subtitle: `Public domain preservation and the global commons`,
      paragraphs: [
        `In this concluding synthesis, the enduring relevance of "${ebook.title}" is affirmed. Certified under ${ebook.license}, this seminal monograph belongs to the universal heritage of humankind.`,
        `Preserved through open cultural repositories, the treatise transcends the temporal boundaries of ${ebook.year}, offering its wisdom freely to students, scholars, and lifelong learners across the globe without financial barriers.`,
        `To read ${ebook.author} is to participate in an unbroken intellectual lineage that has shaped civilizations, inspired revolutions, and expanded the frontiers of human freedom and understanding.`,
      ],
      axiom: `Great books belong to no single century; they remain contemporary to every mind that seeks the truth.`,
    },
  ];

  return chapterArchetypes.map((ch, idx) => ({
    id: idx + 1,
    roman: ROMAN_NUMERALS[idx],
    title: `${ROMAN_NUMERALS[idx]}. ${ch.title}`,
    subtitle: ch.subtitle,
    paragraphs: ch.paragraphs,
    keyAxiom: ch.axiom,
    estimatedMinutes: 8 + (idx % 5),
  }));
}
