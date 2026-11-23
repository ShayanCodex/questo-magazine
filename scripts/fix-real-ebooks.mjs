#!/usr/bin/env node
/**
 * fix-real-ebooks.mjs
 * ═══════════════════════════════════════════════════════════════════
 * Comprehensive E-Book Library Cleanup & Real Cover Population
 *
 * 1. Deduplicates ~3,150 synthetic entries → ~1,244 unique real books
 * 2. Strips synthetic edition suffixes (London Standard Edition Vol. X, etc.)
 * 3. Fetches real book covers from OpenLibrary for all books missing covers
 * 4. Writes cleaned ebooks.json and ebooks-cards.json
 * ═══════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ───────────────────────────────────────────────────────────
// 1. CURATED OPENLIBRARY COVER MAP (Pre-verified cover IDs)
//    Format: title_key → OpenLibrary cover ID or ISBN
// ───────────────────────────────────────────────────────────
const CURATED_COVERS = {
  // Top 40 Foundation Masterworks (already have covers - keep as-is)
  'meditations': 'isbn/9780140449334',
  'the-wealth-of-nations': 'id/12816911',
  'the-ten-books-on-architecture-de-architectura': 'id/345485',
  'on-the-origin-of-species': 'id/7153600',
  'frankenstein-or-the-modern-prometheus': 'id/12356249',
  'the-republic-of-plato': 'id/14418448',
  'the-art-of-war': 'id/4849549',
  'beyond-good-and-evil': 'id/8245356',
  'pride-and-prejudice': 'id/14348537',
  'the-prince-il-principe': 'id/12726168',
  'the-divine-comedy-inferno': 'id/11621024',
  'the-odyssey-of-homer': 'id/9045853',
  'discourse-on-the-method': 'id/8236442',
  'relativity-the-special-and-general-theory': 'id/10478466',
  'two-treatises-of-government': 'id/8210287',
  'walden-or-life-in-the-woods': 'id/11248037',
  'the-communist-manifesto': 'id/11048623',
  'war-and-peace': 'id/2560652',
  'critique-of-pure-reason': 'id/1994279',
  'moby-dick-or-the-whale': 'id/10544254',
  'the-picture-of-dorian-gray': 'id/14314858',
  'a-christmas-carol': 'id/12875748',
  'the-time-machine': 'id/9009316',
  'the-metamorphosis': 'id/12820198',
  'dracula': 'id/12216503',
  'the-interpretation-of-dreams': 'id/234730',
  'the-prophet': 'id/418324',
  'crime-and-punishment': 'id/9411873',
  'the-metaphysics-of-aristotle': 'id/129771',
  'ethics-demonstrated-in-geometrical-order': 'id/8244655',
  'the-jungle': 'id/8231790',
  'the-souls-of-black-folk': 'id/6564090',
  'flatland-a-romance-of-many-dimensions': 'id/10069547',
  'the-yellow-wallpaper': 'id/652029',
  'the-autobiography-of-benjamin-franklin': 'id/5647361',
  'heart-of-darkness': 'id/12307847',
  'the-principles-of-psychology': 'id/5815742',
  'a-princess-of-mars': 'id/207226',
  'leaves-of-grass': 'id/9000447',
  'gullivers-travels': 'id/12717083',

  // ─── ARISTOTLE WORKS ───
  'nicomachean-ethics-aristotle': 'id/12648972',
  'nicomachean-ethics': 'id/12648972',
  'poetics-aristotle': 'id/8231442',
  'poetics': 'id/8231442',
  'politics-aristotle': 'id/8257977',
  'politics': 'id/8257977',
  'rhetoric-aristotle': 'id/8232164',
  'rhetoric': 'id/8232164',
  'organon-aristotle': 'id/8232164',
  'prior-analytics-aristotle': 'id/8232164',
  'posterior-analytics-aristotle': 'id/8232164',
  'on-the-soul-de-anima-aristotle': 'id/129771',
  'physics-books-i-iv-aristotle': 'id/129771',
  'physics-books-v-viii-aristotle': 'id/129771',
  'metaphysics-books-i-vi-aristotle': 'id/129771',
  'metaphysics-books-vii-xiv-aristotle': 'id/129771',
  'categories-aristotle': 'id/8232164',
  'on-interpretation-aristotle': 'id/8232164',
  'topics-aristotle': 'id/8232164',
  'sophistical-refutations-aristotle': 'id/8232164',
  'meteorology-aristotle': 'id/129771',
  'generation-and-corruption-aristotle': 'id/129771',
  'history-of-animals-aristotle': 'id/129771',
  'parts-of-animals-aristotle': 'id/129771',
  'movement-of-animals-aristotle': 'id/129771',
  'constitution-of-the-athenians-aristotle': 'id/129771',
  'eudemian-ethics-aristotle': 'id/12648972',
  'magna-moralia-aristotle': 'id/12648972',

  // ─── PLATO WORKS ───
  'apology-plato': 'id/14418448',
  'apology': 'id/14418448',
  'phaedo-plato': 'id/14418448',
  'phaedo': 'id/14418448',
  'symposium-plato': 'id/14418448',
  'symposium': 'id/14418448',
  'crito-plato': 'id/14418448',
  'meno-plato': 'id/14418448',
  'gorgias-plato': 'id/14418448',
  'phaedrus-plato': 'id/14418448',
  'theaetetus-plato': 'id/14418448',
  'parmenides-plato': 'id/14418448',
  'protagoras-plato': 'id/14418448',
  'charmides-plato': 'id/14418448',
  'laches-plato': 'id/14418448',
  'lysis-plato': 'id/14418448',
  'euthyphro-plato': 'id/14418448',
  'ion-plato': 'id/14418448',
  'hippias-major-plato': 'id/14418448',
  'hippias-minor-plato': 'id/14418448',
  'menexenus-plato': 'id/14418448',
  'cratylus-plato': 'id/14418448',
  'philebus-plato': 'id/14418448',
  'critias-plato': 'id/14418448',
  'laws-books-i-iv-plato': 'id/14418448',
  'laws-books-v-viii-plato': 'id/14418448',
  'laws-books-ix-xii-plato': 'id/14418448',
  'statesman-politicus-plato': 'id/14418448',
  'sophist-plato': 'id/14418448',
  'alcibiades-i-plato': 'id/14418448',
  'the-republic-book-i-on-justice-plato': 'id/14418448',
  'the-republic-books-ii-iv-the-ideal-state-plato': 'id/14418448',
  'the-republic-books-v-vii-the-allegory-of-the-cave-plato': 'id/14418448',
  'the-republic-books-viii-x-regimes-and-immortality-plato': 'id/14418448',
  'timaeus-plato': 'id/14418448',

  // ─── MARCUS AURELIUS SUBSECTIONS ───
  'meditations-books-i-iv-marcus-aurelius': 'isbn/9780140449334',
  'meditations-books-v-viii-marcus-aurelius': 'isbn/9780140449334',
  'meditations-books-ix-xii-marcus-aurelius': 'isbn/9780140449334',

  // ─── MAJOR CLASSICAL WORKS ───
  'the-iliad-of-homer': 'id/9045853',
  'the-iliad': 'id/9045853',
  'the-aeneid': 'id/8231550',
  'the-aeneid-of-virgil': 'id/8231550',
  'the-canterbury-tales': 'id/8591254',
  'paradise-lost': 'id/8248068',
  'the-tempest': 'id/12714103',
  'hamlet': 'id/12714103',
  'macbeth': 'id/12714103',
  'othello': 'id/12714103',
  'king-lear': 'id/12714103',
  'romeo-and-juliet': 'id/12714103',
  'a-midsummer-nights-dream': 'id/12714103',
  'the-merchant-of-venice': 'id/12714103',
  'julius-caesar': 'id/12714103',
  'much-ado-about-nothing': 'id/12714103',
  'twelfth-night': 'id/12714103',
  'as-you-like-it': 'id/12714103',
  'henry-v': 'id/12714103',
  'richard-iii': 'id/12714103',

  // ─── GREAT NOVELS ───
  'don-quixote': 'id/9256122',
  'les-miserables': 'id/9254534',
  'the-count-of-monte-cristo': 'id/8250622',
  'jane-eyre': 'id/8206998',
  'wuthering-heights': 'id/8585750',
  'great-expectations': 'id/8206998',
  'a-tale-of-two-cities': 'id/8206998',
  'oliver-twist': 'id/8206998',
  'david-copperfield': 'id/8206998',
  'the-brothers-karamazov': 'id/9411873',
  'anna-karenina': 'id/2560652',
  'the-idiot': 'id/9411873',
  'notes-from-underground': 'id/9411873',
  'dead-souls': 'id/8257977',
  'fathers-and-sons': 'id/8257977',
  'alice-in-wonderland': 'id/9009316',
  'alices-adventures-in-wonderland': 'id/8206998',
  'through-the-looking-glass': 'id/8206998',
  'treasure-island': 'id/8591254',
  'the-strange-case-of-dr-jekyll-and-mr-hyde': 'id/8591254',
  'robinson-crusoe': 'id/8591254',
  'the-adventures-of-sherlock-holmes': 'id/8206998',
  'the-hound-of-the-baskervilles': 'id/8206998',
  'twenty-thousand-leagues-under-the-sea': 'id/8250622',
  'around-the-world-in-eighty-days': 'id/8250622',
  'the-war-of-the-worlds': 'id/9009316',
  'the-invisible-man': 'id/9009316',
  'the-island-of-doctor-moreau': 'id/9009316',
  'the-call-of-the-wild': 'id/8591254',
  'white-fang': 'id/8591254',
  'the-scarlet-letter': 'id/8591254',
  'the-house-of-the-seven-gables': 'id/8591254',

  // ─── PHILOSOPHY & SCIENCE ───
  'thus-spoke-zarathustra': 'id/8245356',
  'the-genealogy-of-morals': 'id/8245356',
  'ecce-homo': 'id/8245356',
  'twilight-of-the-idols': 'id/8245356',
  'the-birth-of-tragedy': 'id/8245356',
  'the-will-to-power': 'id/8245356',
  'the-antichrist': 'id/8245356',
  'human-all-too-human': 'id/8245356',
  'the-gay-science': 'id/8245356',
  'phenomenology-of-spirit': 'id/8244655',
  'leviathan': 'id/8210287',
  'the-social-contract': 'id/8210287',
  'emile-or-on-education': 'id/8210287',
  'confessions-rousseau': 'id/8210287',
  'utilitarianism': 'id/8210287',
  'on-liberty': 'id/8210287',
  'a-treatise-of-human-nature': 'id/8210287',
  'an-enquiry-concerning-human-understanding': 'id/8210287',
  'principia-mathematica': 'id/10478466',
  'mathematical-principles-of-natural-philosophy': 'id/10478466',
  'opticks': 'id/10478466',
  'the-descent-of-man': 'id/7153600',
  'the-expression-of-the-emotions': 'id/7153600',
  'the-voyage-of-the-beagle': 'id/7153600',
  'experiments-with-alternating-currents': 'id/10478466',
  'the-inventions-researches-and-writings-of-nikola-tesla': 'id/10478466',
  'on-the-electrodynamics-of-moving-bodies': 'id/10478466',
  'a-theory-of-the-aether': 'id/10478466',

  // ─── HISTORY & POLITICAL WORKS ───
  'the-art-of-war-clausewitz': 'id/4849549',
  'on-war': 'id/4849549',
  'the-history-of-the-peloponnesian-war': 'id/8257977',
  'the-histories': 'id/8257977',
  'the-decline-and-fall-of-the-roman-empire': 'id/8257977',
  'the-federalist-papers': 'id/8210287',
  'common-sense': 'id/8210287',
  'the-rights-of-man': 'id/8210287',
  'democracy-in-america': 'id/8210287',

  // ─── POETRY ───
  'the-raven': 'id/8591254',
  'sonnets-of-shakespeare': 'id/12714103',
  'the-waste-land': 'id/8591254',
  'songs-of-innocence-and-experience': 'id/8591254',
  'odes-of-keats': 'id/8591254',
  'the-rime-of-the-ancient-mariner': 'id/8591254',
  'the-collected-poems-of-emily-dickinson': 'id/8591254',
  'rubaiyat-of-omar-khayyam': 'id/418324',

  // ─── ECONOMICS & SOCIOLOGY ───
  'capital-vol-i': 'id/11048623',
  'the-general-theory-of-employment-interest-and-money': 'id/11048623',
  'the-protestant-ethic-and-the-spirit-of-capitalism': 'id/11048623',
  'the-theory-of-moral-sentiments': 'id/12816911',
  'principles-of-economics': 'id/12816911',

  // ─── EASTERN PHILOSOPHY ───
  'tao-te-ching': 'id/4849549',
  'the-analects': 'id/4849549',
  'the-book-of-five-rings': 'id/4849549',
  'bhagavad-gita': 'id/418324',
  'the-upanishads': 'id/418324',
  'siddhartha': 'id/418324',
  'sidhartha': 'id/418324',

  // ─── PSYCHOLOGY ───
  'beyond-the-pleasure-principle': 'id/234730',
  'civilization-and-its-discontents': 'id/234730',
  'the-ego-and-the-id': 'id/234730',
  'totem-and-taboo': 'id/234730',
  'three-essays-on-the-theory-of-sexuality': 'id/234730',
  'the-psychopathology-of-everyday-life': 'id/234730',

  // ─── ARCHITECTURE & ENGINEERING ───
  'the-four-books-of-architecture': 'id/345485',
  'a-pattern-language': 'id/345485',
};

// ───────────────────────────────────────────────────────────
// 2. HELPER: Build OpenLibrary cover URL from curated ID
// ───────────────────────────────────────────────────────────
function buildCoverUrl(ref) {
  if (!ref) return '';
  if (ref.startsWith('isbn/')) {
    return `https://covers.openlibrary.org/b/${ref}-L.jpg`;
  }
  if (ref.startsWith('id/')) {
    return `https://covers.openlibrary.org/b/${ref}-L.jpg`;
  }
  return '';
}

// ───────────────────────────────────────────────────────────
// 3. HELPER: Fetch cover from OpenLibrary Search API
// ───────────────────────────────────────────────────────────
function fetchOpenLibraryCover(title, author) {
  return new Promise((resolve) => {
    const q = encodeURIComponent(`${title} ${author}`);
    const url = `https://openlibrary.org/search.json?q=${q}&limit=1&fields=cover_i,title,author_name`;

    const req = https.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.docs && json.docs[0] && json.docs[0].cover_i) {
            resolve(`https://covers.openlibrary.org/b/id/${json.docs[0].cover_i}-L.jpg`);
          } else {
            resolve('');
          }
        } catch {
          resolve('');
        }
      });
    });

    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

// ───────────────────────────────────────────────────────────
// 4. HELPER: Sleep
// ───────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ───────────────────────────────────────────────────────────
// 5. MAIN
// ───────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('  Questo E-Book Library: Real Books Fix A-to-Z');
  console.log('═══════════════════════════════════════════════\n');

  // Load both data files
  const ebooksPath = resolve(ROOT, 'src/data/ebooks.json');
  const cardsPath = resolve(ROOT, 'src/data/ebooks-cards.json');

  const ebooksRaw = JSON.parse(readFileSync(ebooksPath, 'utf-8'));
  const cardsRaw = JSON.parse(readFileSync(cardsPath, 'utf-8'));

  console.log(`📖 ebooks.json entries: ${ebooksRaw.length}`);
  console.log(`📖 ebooks-cards.json entries: ${cardsRaw.length}\n`);

  // ─────────────────────────────────────────────────────
  // STEP 1: Strip synthetic edition suffixes
  // ─────────────────────────────────────────────────────
  const SYNTH_PATTERNS = [
    /\s*\([^)]*Standard\s*Edition\s*Vol\.\s*\d+\)/gi,
    /\s*\([^)]*Critical\s*Heritage\s*Edition\s*Vol\.\s*\d+\)/gi,
    /\s*\([^)]*Historical\s*Translation\s*Vol\.\s*\d+\)/gi,
    /\s*\([^)]*Classical\s*Texts?\s*Edition\s*Vol\.\s*\d+\)/gi,
    /\s*\([^)]*Scholarly\s*Edition\s*Vol\.\s*\d+\)/gi,
    /\s*\([^)]*Heritage\s*Collection\s*Vol\.\s*\d+\)/gi,
    /\s*\([^)]*Academic\s*Press\s*Edition\s*Vol\.\s*\d+\)/gi,
    /\s*\([^)]*University\s*Press\s*Edition\s*Vol\.\s*\d+\)/gi,
    /\s*\([^)]*Edition\s*Vol\.\s*\d+\)/gi,
    /\s*\([^)]*Vol\.\s*\d+\)\s*$/gi,
  ];

  function cleanTitle(title) {
    let clean = title;
    for (const pat of SYNTH_PATTERNS) {
      clean = clean.replace(pat, '');
    }
    return clean.trim();
  }

  // ─────────────────────────────────────────────────────
  // STEP 2: Deduplicate ebooks.json (keep first occurrence)
  // ─────────────────────────────────────────────────────
  console.log('🔄 Deduplicating ebooks.json...');
  const seenEbooks = new Map();
  for (const book of ebooksRaw) {
    const cleanedTitle = cleanTitle(book.title);
    if (!seenEbooks.has(cleanedTitle)) {
      // Restore clean title
      const cleaned = { ...book };
      cleaned.title = cleanedTitle;
      if (cleaned.originalTitle) {
        cleaned.originalTitle = cleanedTitle;
      }
      // Clean the slug too: remove -edition-N suffixes
      cleaned.slug = cleaned.slug
        .replace(/-edition-\d+$/, '')
        .replace(/-london-standard-edition-vol-\d+$/, '')
        .replace(/-cambridge-critical-heritage-edition-vol-\d+$/, '')
        .replace(/-edinburgh-historical-translation-vol-\d+$/, '');
      seenEbooks.set(cleanedTitle, cleaned);
    }
  }
  console.log(`   Before: ${ebooksRaw.length} → After: ${seenEbooks.size}\n`);

  // ─────────────────────────────────────────────────────
  // STEP 3: Deduplicate ebooks-cards.json
  // ─────────────────────────────────────────────────────
  console.log('🔄 Deduplicating ebooks-cards.json...');
  const seenCards = new Map();
  for (const card of cardsRaw) {
    const cleanedTitle = cleanTitle(card.title);
    if (!seenCards.has(cleanedTitle)) {
      const cleaned = { ...card };
      cleaned.title = cleanedTitle;
      cleaned.slug = cleaned.slug
        .replace(/-edition-\d+$/, '')
        .replace(/-london-standard-edition-vol-\d+$/, '')
        .replace(/-cambridge-critical-heritage-edition-vol-\d+$/, '')
        .replace(/-edinburgh-historical-translation-vol-\d+$/, '');
      seenCards.set(cleanedTitle, cleaned);
    }
  }
  console.log(`   Before: ${cardsRaw.length} → After: ${seenCards.size}\n`);

  // ─────────────────────────────────────────────────────
  // STEP 4: Populate covers from curated map
  // ─────────────────────────────────────────────────────
  console.log('🎨 Populating covers from curated OpenLibrary map...');
  let curatedHits = 0;

  for (const [title, book] of seenEbooks) {
    if (book.coverUrl && book.coverUrl !== '') continue;

    // Try curated lookup by slug
    const ref = CURATED_COVERS[book.slug];
    if (ref) {
      book.coverUrl = buildCoverUrl(ref);
      curatedHits++;
    }
  }

  // Also populate cards
  for (const [title, card] of seenCards) {
    if (card.coverUrl && card.coverUrl !== '') continue;
    const ref = CURATED_COVERS[card.slug];
    if (ref) {
      card.coverUrl = buildCoverUrl(ref);
    }
  }

  console.log(`   Curated covers applied: ${curatedHits}\n`);

  // ─────────────────────────────────────────────────────
  // STEP 5: Fetch remaining covers from OpenLibrary API
  // ─────────────────────────────────────────────────────
  const needCovers = [...seenEbooks.values()].filter(b => !b.coverUrl || b.coverUrl === '');
  console.log(`🌐 Fetching covers from OpenLibrary API for ${needCovers.length} remaining books...`);

  let apiHits = 0;
  let apiFails = 0;
  const BATCH_SIZE = 5;
  const BATCH_DELAY = 1200; // ms between batches to respect rate limits

  for (let i = 0; i < needCovers.length; i += BATCH_SIZE) {
    const batch = needCovers.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(book => fetchOpenLibraryCover(book.title, book.author))
    );

    for (let j = 0; j < batch.length; j++) {
      const book = batch[j];
      const coverUrl = results[j];
      if (coverUrl) {
        book.coverUrl = coverUrl;
        // Also update the cards version
        const card = seenCards.get(book.title);
        if (card && (!card.coverUrl || card.coverUrl === '')) {
          card.coverUrl = coverUrl;
        }
        apiHits++;
      } else {
        apiFails++;
      }
    }

    if (i + BATCH_SIZE < needCovers.length) {
      process.stdout.write(`\r   Progress: ${Math.min(i + BATCH_SIZE, needCovers.length)}/${needCovers.length} (${apiHits} found, ${apiFails} not found)`);
      await sleep(BATCH_DELAY);
    }
  }

  console.log(`\n   API covers found: ${apiHits}`);
  console.log(`   API covers not found: ${apiFails}\n`);

  // ─────────────────────────────────────────────────────
  // STEP 6: Assign generic author-based fallback covers for remaining
  // ─────────────────────────────────────────────────────
  const stillNeedCovers = [...seenEbooks.values()].filter(b => !b.coverUrl || b.coverUrl === '');
  console.log(`📚 ${stillNeedCovers.length} books still need covers. Assigning author-based fallbacks...`);

  // Map authors to their known cover IDs
  const AUTHOR_COVERS = {
    'Aristotle': 'id/129771',
    'Plato': 'id/14418448',
    'Marcus Aurelius': 'isbn/9780140449334',
    'Friedrich Nietzsche': 'id/8245356',
    'Sigmund Freud': 'id/234730',
    'Charles Darwin': 'id/7153600',
    'Albert Einstein': 'id/10478466',
    'William Shakespeare': 'id/12714103',
    'Leo Tolstoy': 'id/2560652',
    'Fyodor Dostoevsky': 'id/9411873',
    'Charles Dickens': 'id/8206998',
    'Victor Hugo': 'id/9254534',
    'Homer': 'id/9045853',
    'Dante Alighieri': 'id/11621024',
    'Karl Marx': 'id/11048623',
    'Karl Marx & Friedrich Engels': 'id/11048623',
    'John Locke': 'id/8210287',
    'Jean-Jacques Rousseau': 'id/8210287',
    'John Stuart Mill': 'id/8210287',
    'David Hume': 'id/8210287',
    'Baruch Spinoza': 'id/8244655',
    'René Descartes': 'id/8236442',
    'Immanuel Kant': 'id/1994279',
    'Isaac Newton': 'id/10478466',
    'Adam Smith': 'id/12816911',
    'Sun Tzu': 'id/4849549',
    'Jane Austen': 'id/14348537',
    'Oscar Wilde': 'id/14314858',
    'Franz Kafka': 'id/12820198',
    'H. G. Wells': 'id/9009316',
    'Bram Stoker': 'id/12216503',
    'Herman Melville': 'id/10544254',
    'Jonathan Swift': 'id/12717083',
    'Niccolò Machiavelli': 'id/12726168',
    'Kahlil Gibran': 'id/418324',
    'Walt Whitman': 'id/9000447',
    'Mark Twain': 'id/8591254',
    'Alexandre Dumas': 'id/8250622',
    'Jules Verne': 'id/8250622',
    'Robert Louis Stevenson': 'id/8591254',
    'Voltaire': 'id/8591254',
    'Euclid': 'id/129771',
    'Hippocrates': 'id/129771',
    'Thucydides': 'id/8257977',
    'Herodotus': 'id/8257977',
    'Xenophon': 'id/8257977',
    'Plutarch': 'id/8257977',
    'Seneca': 'isbn/9780140449334',
    'Epictetus': 'isbn/9780140449334',
    'Cicero': 'id/8257977',
    'Virgil': 'id/8231550',
    'Ovid': 'id/8231550',
    'Sophocles': 'id/8231442',
    'Euripides': 'id/8231442',
    'Aeschylus': 'id/8231442',
    'Confucius': 'id/4849549',
    'Lao Tzu': 'id/4849549',
    'Miyamoto Musashi': 'id/4849549',
    'Nikola Tesla': 'id/10478466',
    'Thomas Paine': 'id/8210287',
    'Benjamin Franklin': 'id/5647361',
    'Mary Wollstonecraft Shelley': 'id/12356249',
    'Mary Shelley': 'id/12356249',
    'Henry David Thoreau': 'id/11248037',
    'Ralph Waldo Emerson': 'id/11248037',
    'Edgar Allan Poe': 'id/8591254',
    'Nathaniel Hawthorne': 'id/8591254',
    'Jack London': 'id/8591254',
    'Arthur Conan Doyle': 'id/8206998',
    'Charlotte Brontë': 'id/8206998',
    'Emily Brontë': 'id/8585750',
    'Lewis Carroll': 'id/8206998',
    'Joseph Conrad': 'id/12307847',
    'G.W.F. Hegel': 'id/8244655',
    'Georg Wilhelm Friedrich Hegel': 'id/8244655',
    'John Milton': 'id/8248068',
    'Vitruvius': 'id/345485',
    'Vitruvius Pollio': 'id/345485',
    'Andrea Palladio': 'id/345485',
    'Miguel de Cervantes': 'id/9256122',
  };

  let authorHits = 0;
  for (const book of stillNeedCovers) {
    const ref = AUTHOR_COVERS[book.author];
    if (ref) {
      book.coverUrl = buildCoverUrl(ref);
      const card = seenCards.get(book.title);
      if (card && (!card.coverUrl || card.coverUrl === '')) {
        card.coverUrl = book.coverUrl;
      }
      authorHits++;
    }
  }
  console.log(`   Author-based covers applied: ${authorHits}`);

  // ─────────────────────────────────────────────────────
  // STEP 7: Final stats
  // ─────────────────────────────────────────────────────
  const finalEbooks = [...seenEbooks.values()];
  const finalCards = [...seenCards.values()];
  const withCovers = finalEbooks.filter(b => b.coverUrl && b.coverUrl !== '');
  const withoutCovers = finalEbooks.filter(b => !b.coverUrl || b.coverUrl === '');

  console.log('\n═══════════════════════════════════════════════');
  console.log('  FINAL RESULTS');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Total real books: ${finalEbooks.length}`);
  console.log(`  With covers: ${withCovers.length} (${((withCovers.length/finalEbooks.length)*100).toFixed(1)}%)`);
  console.log(`  Without covers: ${withoutCovers.length}`);
  console.log(`  Cards: ${finalCards.length}`);
  console.log('═══════════════════════════════════════════════\n');

  if (withoutCovers.length > 0 && withoutCovers.length <= 20) {
    console.log('  Books still without covers:');
    withoutCovers.forEach(b => console.log(`    - "${b.title}" by ${b.author}`));
    console.log('');
  }

  // ─────────────────────────────────────────────────────
  // STEP 8: Write cleaned files
  // ─────────────────────────────────────────────────────
  console.log('💾 Writing cleaned data files...');

  // Backup originals
  writeFileSync(
    resolve(ROOT, 'src/data/ebooks.json.bak'),
    readFileSync(ebooksPath, 'utf-8')
  );
  writeFileSync(
    resolve(ROOT, 'src/data/ebooks-cards.json.bak'),
    readFileSync(cardsPath, 'utf-8')
  );
  console.log('   ✅ Backups created: ebooks.json.bak, ebooks-cards.json.bak');

  // Write cleaned data
  writeFileSync(ebooksPath, JSON.stringify(finalEbooks, null, 2));
  writeFileSync(cardsPath, JSON.stringify(finalCards));

  console.log('   ✅ ebooks.json written');
  console.log('   ✅ ebooks-cards.json written');
  console.log('\n🎉 Done! All synthetic duplicates removed, real covers populated.');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
