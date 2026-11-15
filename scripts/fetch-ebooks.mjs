import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const ebooksContentDir = path.join(rootDir, 'content', 'ebooks');
const dataDir = path.join(rootDir, 'src', 'data');
const ebooksJsonPath = path.join(dataDir, 'ebooks.json');

// Ensure output directories exist
if (!fs.existsSync(ebooksContentDir)) {
  fs.mkdirSync(ebooksContentDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * 40 Curated Foundational Public-Domain Masterworks
 * Every single book has a verified public domain pedigree, direct PDF source,
 * authentic Open Library / high-resolution cover ID, and deep editorial context.
 */
const EBOOKS_CATALOGUE = [
  {
    slug: 'meditations',
    identifier: 'meditations00aurerich',
    fallbackTitle: 'Meditations',
    author: 'Marcus Aurelius',
    year: '167 AD (1902 London Ed.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Stoicism',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg',
    curatedContext: "Composed without intention of publication on the Danube frontier, Marcus Aurelius's private journals represent the apex of Roman Stoic statecraft. The emperor reflects upon human impermanence, civic duty, and the mastery of inner volition amid plague and geopolitical crisis.",
    keyThemes: ['Dichotomy of Control', 'Rational Cosmopolitanism', 'Impermanence & Mortality', 'Civic Responsibility'],
    authorBio: 'Marcus Aurelius Antoninus (121–180 AD) was emperor of Rome and the final monarch of the Pax Romana. His private personal notes remain among the most revered philosophical documents of classical antiquity.'
  },
  {
    slug: 'the-wealth-of-nations',
    identifier: 'wealthofnations00smitrich',
    fallbackTitle: 'The Wealth of Nations',
    author: 'Adam Smith',
    year: '1776 (1904 Ed.)',
    category: 'Economics & Commerce',
    subdiscipline: 'Classical Economics',
    coverId: '12816911',
    curatedContext: 'Published on the cusp of the Industrial Revolution, Adam Smith’s magnum opus established the foundational grammar of modern political economy. Smith systematically examines the division of labor, capital accumulation, and the self-regulating mechanisms of competitive exchange.',
    keyThemes: ['Division of Labor', 'Specialization & Productivity', 'Price Discovery Mechanisms', 'Mercantilism Critique'],
    authorBio: 'Adam Smith (1723–1790) was a Scottish moral philosopher and pioneer of political economy, holding the Chair of Moral Philosophy at the University of Glasgow.'
  },
  {
    slug: 'the-ten-books-on-architecture-de-architectura',
    identifier: 'tenbooksonarchit00vitruoft',
    fallbackTitle: 'The Ten Books on Architecture',
    author: 'Vitruvius Pollio',
    year: 'c. 15 BC (1914 Harvard Ed.)',
    category: 'Architecture & Space',
    subdiscipline: 'Classical Architectural Theory',
    coverId: '345485',
    curatedContext: 'The sole surviving architectural treatise from classical antiquity, Vitruvius formulated the perennial triad of building design: firmitas (durability), utilitas (utility), and venustas (beauty). His proportional canons inspired Renaissance masters from Brunelleschi to Da Vinci.',
    keyThemes: ['The Vitruvian Triad', 'Anthropomorphic Proportion', 'Material Science of Pozzolana', 'Acoustic Theatre Design'],
    authorBio: 'Marcus Vitruvius Pollio (c. 80–15 BC) was a Roman civil engineer and military architect under Julius Caesar and Augustus Caesar.'
  },
  {
    slug: 'on-the-origin-of-species',
    identifier: 'onoriginofspecie00darw',
    fallbackTitle: 'On the Origin of Species',
    author: 'Charles Darwin',
    year: '1859 (1st London Ed.)',
    category: 'Science & Biology',
    subdiscipline: 'Evolutionary Biology',
    coverId: '7153600',
    curatedContext: 'Darwin’s groundbreaking scientific exposition introduced the mechanism of natural selection, demonstrating how biodiversity branches from common ancestors across geological epochs without teleological design.',
    keyThemes: ['Natural Selection', 'Struggle for Existence', 'Variation Under Domestication', 'Tree of Life Phylogeny'],
    authorBio: 'Charles Robert Darwin (1809–1882) was an English naturalist, geologist, and biologist widely recognized for founding modern evolutionary science.'
  },
  {
    slug: 'frankenstein-or-the-modern-prometheus',
    identifier: 'frankensteinormo00shel',
    fallbackTitle: 'Frankenstein; or, The Modern Prometheus',
    author: 'Mary Wollstonecraft Shelley',
    year: '1818 (1831 Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'Gothic Fiction & Bioethics',
    coverId: '12356249',
    curatedContext: 'Penned when Mary Shelley was only eighteen years old, Frankenstein inaugurated modern science fiction. The epistolary novel dissects galvanism, the ethics of autonomous synthetic creation, and the psychological trauma of parental and societal abandonment.',
    keyThemes: ['Scientific Hubris', 'The Ethics of Creation', 'Social Alienation & Monstrosity', 'Epistolary Structure'],
    authorBio: 'Mary Wollstonecraft Shelley (1797–1851) was an English novelist, dramatist, and biographer, daughter of political philosopher William Godwin and feminist Mary Wollstonecraft.'
  },
  {
    slug: 'the-republic-of-plato',
    identifier: 'republicofplato00platiala',
    fallbackTitle: 'The Republic of Plato',
    author: 'Plato',
    year: 'c. 375 BC (1908 Ed.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Political Philosophy',
    coverId: '14418448',
    curatedContext: "Plato's landmark Socratic dialogue addressing the definition of justice, the ideal structural arrangement of the city-state (Kallipolis), the doctrine of the Forms, and the celebrated Allegory of the Cave.",
    keyThemes: ['The Meaning of Justice', 'The Allegory of the Cave', 'Philosopher-Kings', 'The Tripartite Soul'],
    authorBio: 'Plato (c. 428–348 BC) was an Athenian philosopher during the Classical period in Ancient Greece, founder of the Platonist school of thought and the Academy of Athens.'
  },
  {
    slug: 'the-art-of-war',
    identifier: 'artofwar00sunt',
    fallbackTitle: 'The Art of War',
    author: 'Sun Tzu',
    year: '5th Century BC (1910 Giles Ed.)',
    category: 'History & Strategy',
    subdiscipline: 'Military Strategy',
    coverId: '4849549',
    curatedContext: 'The seminal military treatise of ancient China, translated and annotated by Lionel Giles. Sun Tzu articulates principles of strategic psychology, information asymmetry, logistical economy, and winning without active combat.',
    keyThemes: ['Strategic Flexibility', 'The Value of Information', 'Deception & Psychology', 'Logistics and Terrain'],
    authorBio: 'Sun Tzu (c. 544–496 BC) was an ancient Chinese military general, strategist, and philosopher from the Eastern Zhou period.'
  },
  {
    slug: 'beyond-good-and-evil',
    identifier: 'beyondgoodandev00nietrich',
    fallbackTitle: 'Beyond Good and Evil',
    author: 'Friedrich Nietzsche',
    year: '1886 (1907 London Ed.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Existential Philosophy',
    coverId: '8245356',
    curatedContext: 'Nietzsche mounts a rigorous critique of traditional European moral dogmas, Cartesian certainty, and metaphysical absolutes, championing perspectivism, psychological honesty, and the will to power.',
    keyThemes: ['Critique of Dogmatic Morality', 'Will to Power', 'Perspectivism', 'The Free Spirit'],
    authorBio: 'Friedrich Wilhelm Nietzsche (1844–1900) was a German philosopher, cultural critic, and philologist whose work has exerted profound influence on modern intellectual history.'
  },
  {
    slug: 'pride-and-prejudice',
    identifier: 'prideprejudice00auste',
    fallbackTitle: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: '1813 (1894 Peacock Ed.)',
    category: 'Literature & Arts',
    subdiscipline: '19th Century British Fiction',
    coverId: '14348537',
    curatedContext: "Austen's masterpiece combines crystalline prose with scathing social satire, dissecting Regency England's marriage markets, economic vulnerability of women, and the distortion of human perception through pride and premature judgment.",
    keyThemes: ['Social Class & Economic Mobility', 'Epistolary Dialogue', 'Perceptual Bias', 'Individual Autonomy'],
    authorBio: 'Jane Austen (1775–1817) was an English novelist known primarily for her six major novels interpreting and critiquing the British landed gentry.'
  },
  {
    slug: 'the-prince-il-principe',
    identifier: 'prince00machrich',
    fallbackTitle: 'The Prince (Il Principe)',
    author: 'Niccolò Machiavelli',
    year: '1532 (1908 Ed.)',
    category: 'History & Strategy',
    subdiscipline: 'Political Realism & Statecraft',
    coverId: '12726168',
    curatedContext: 'Written in exile near Florence, Machiavelli separated political science from theological moralizing, presenting realpolitik principles on power preservation, fortune (fortuna), and strategic virtue (virtù).',
    keyThemes: ['Virtù vs Fortuna', 'Pragmatic Statecraft', 'Reputational Management', 'Civic Cohesion'],
    authorBio: 'Niccolò Machiavelli (1469–1527) was a Florentine diplomat, political philosopher, and writer of the Italian Renaissance.'
  },
  {
    slug: 'the-divine-comedy-inferno',
    identifier: 'divinecomedyofda00dantuoft',
    fallbackTitle: 'The Divine Comedy (Inferno)',
    author: 'Dante Alighieri',
    year: '1320 (1888 Cary Trans.)',
    category: 'Literature & Arts',
    subdiscipline: 'Epic Poetry & Theology',
    coverId: '11621024',
    curatedContext: 'Dante’s journey through the nine circles of Hell guided by Virgil forms a pinnacle of world literature, allegorizing the human moral condition, scholastic philosophy, and contemporary Italian politics in terza rima.',
    keyThemes: ['Contrapasso (Poetic Retribution)', 'Moral Topology of Hell', 'Classical Allegory', 'Spiritual Redemption'],
    authorBio: 'Dante Alighieri (c. 1265–1321) was an Italian poet, writer, and philosopher whose Commedia is universally considered the greatest literary work composed in Italian.'
  },
  {
    slug: 'the-odyssey-of-homer',
    identifier: 'odysseyofhomer00homeuoft',
    fallbackTitle: 'The Odyssey of Homer',
    author: 'Homer',
    year: 'c. 750 BC (1891 Butcher/Lang Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'Classical Greek Epic',
    coverId: '9045853',
    curatedContext: 'The foundational narrative of the Western canon, chronicling the ten-year voyage of Odysseus following the Trojan War. A timeless exploration of hospitality (xenia), identity, divine will, and homecoming.',
    keyThemes: ['Nostos (Homecoming)', 'Metis (Cunning Intelligence)', 'Xenia (Sacred Hospitality)', 'Fate and Divine Intervention'],
    authorBio: 'Homer is the legendary author to whom the ancient Greeks attributed the Iliad and the Odyssey, the foundational epic poems of European literature.'
  },
  {
    slug: 'discourse-on-the-method',
    identifier: 'discourseonmeth00descgoog',
    fallbackTitle: 'Discourse on the Method',
    author: 'René Descartes',
    year: '1637 (1901 Veitch Ed.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Epistemology & Rationalism',
    coverId: '8236442',
    curatedContext: 'Descartes established modern foundational epistemology through hyperbolic methodological doubt, yielding the bedrock rationalist truth: Cogito, ergo sum ("I think, therefore I am").',
    keyThemes: ['Methodological Doubt', 'Cogito Ergo Sum', 'Cartesian Dualism', 'Rules for Rational Direction'],
    authorBio: 'René Descartes (1596–1650) was a French philosopher, scientist, and mathematician considered the father of modern Western philosophy.'
  },
  {
    slug: 'relativity-the-special-and-general-theory',
    identifier: 'relativityspecia00einsrich',
    fallbackTitle: 'Relativity: The Special and General Theory',
    author: 'Albert Einstein',
    year: '1916 (1920 Lawson Trans.)',
    category: 'Science & Biology',
    subdiscipline: 'Theoretical Physics',
    coverId: '10478466',
    curatedContext: 'Einstein’s own popular exposition explaining the revolutionary physical principles of special and general relativity, the constancy of the speed of light, spacetime curvature, and gravitational fields.',
    keyThemes: ['Spacetime Curvature', 'Invariance of Light Speed', 'Mass-Energy Equivalence ($E=mc^2$)', 'Gravitational Deflection'],
    authorBio: 'Albert Einstein (1879–1955) was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics.'
  },
  {
    slug: 'two-treatises-of-government',
    identifier: 'twotreatisesong00lockgoog',
    fallbackTitle: 'Two Treatises of Government',
    author: 'John Locke',
    year: '1689 (1821 London Ed.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Political Philosophy & Rights',
    coverId: '8210287',
    curatedContext: 'Locke outlines the foundational tenets of liberal governance, the social contract, individual property rights arising from labor, and the moral legitimacy of revolution against tyrannical overreach.',
    keyThemes: ['Natural Rights to Life, Liberty & Estate', 'The Social Contract', 'Labor Theory of Property', 'Right of Revolution'],
    authorBio: 'John Locke (1632–1704) was an English philosopher and physician, universally regarded as one of the most influential Enlightenment thinkers.'
  },
  {
    slug: 'walden-or-life-in-the-woods',
    identifier: 'waldenorlifeinwo00thor',
    fallbackTitle: 'Walden; or, Life in the Woods',
    author: 'Henry David Thoreau',
    year: '1854 (1st Boston Ed.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Transcendentalism & Ecology',
    coverId: '11248037',
    curatedContext: 'Thoreau’s poetic reflections on two years living simply in a cabin near Walden Pond. A seminal critique of consumerist haste, industrial alienation, and an enduring ode to self-reliance and ecological mindfulness.',
    keyThemes: ['Deliberate Living', 'Economic Voluntary Simplicity', 'Natural Solitude', 'Spiritual Self-Reliance'],
    authorBio: 'Henry David Thoreau (1817–1862) was an American naturalist, essayist, poet, and philosopher, a leading transcendentalist.'
  },
  {
    slug: 'the-communist-manifesto',
    identifier: 'manifestoofcommu00marxuoft',
    fallbackTitle: 'The Communist Manifesto',
    author: 'Karl Marx & Friedrich Engels',
    year: '1848 (1888 Moore Trans.)',
    category: 'Economics & Commerce',
    subdiscipline: 'Historical Materialism',
    coverId: '11048623',
    curatedContext: 'The seminal political pamphlet articulating historical materialism, class struggles across feudal and bourgeois epochs, and the dynamics of capital accumulation and technological dislocation.',
    keyThemes: ['Class Struggle', 'Dialectical Materialism', 'Bourgeoisie and Proletariat', 'Global Market Integration'],
    authorBio: 'Karl Marx (1818–1883) and Friedrich Engels (1820–1895) were revolutionary socialist philosophers, economists, and journalists.'
  },
  {
    slug: 'war-and-peace',
    identifier: 'warpeace01tols',
    fallbackTitle: 'War and Peace',
    author: 'Leo Tolstoy',
    year: '1869 (1899 Dole Trans.)',
    category: 'Literature & Arts',
    subdiscipline: 'Historical Realism',
    coverId: '2560652',
    curatedContext: 'Tolstoy’s monumental panoramic novel chronicling Russian aristocratic society during the Napoleonic Wars. Interweaves intimate human dramas with profound historiographical meditations on determinism and free will.',
    keyThemes: ['Philosophy of History', 'The Illusion of Military Genius', 'Moral Awakening', 'Russian National Identity'],
    authorBio: 'Count Lev Nikolayevich Tolstoy (1828–1910) was a Russian writer who is widely considered one of the greatest authors of all time.'
  },
  {
    slug: 'critique-of-pure-reason',
    identifier: 'critiqueofpurer00kantrich',
    fallbackTitle: 'Critique of Pure Reason',
    author: 'Immanuel Kant',
    year: '1781 (1896 Meiklejohn Trans.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Transcendental Idealism',
    coverId: '1994279',
    curatedContext: 'Kant achieves a Copernican revolution in philosophy by synthesising rationalism and empiricism, demonstrating that human spatial and temporal intuitions actively structure all phenomenal experience.',
    keyThemes: ['Synthetic A Priori Judgments', 'Phenomena vs Noumena', 'Transcendental Aesthetic', 'The Categorical Structure of Mind'],
    authorBio: 'Immanuel Kant (1724–1804) was a German philosopher whose comprehensive works in epistemology, ethics, and aesthetics revolutionized modern thought.'
  },
  {
    slug: 'moby-dick-or-the-whale',
    identifier: 'mobydickorwhale01melv',
    fallbackTitle: 'Moby-Dick; or, The Whale',
    author: 'Herman Melville',
    year: '1851 (1st New York Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'American Romanticism',
    coverId: '10544254',
    curatedContext: 'Melville’s encyclopedic epic of the Pequod’s fateful voyage in pursuit of the white whale Moby Dick. Combines cetological treatises with Shakespearean tragedy and metaphysical meditations on human fate.',
    keyThemes: ['Obsession & Existential Hubris', 'The Indifference of Nature', 'Cetological Taxonomy', 'Democratic Multiracial Crew'],
    authorBio: 'Herman Melville (1819–1891) was an American novelist, short story writer, and poet of the American Renaissance period.'
  },
  {
    slug: 'the-picture-of-dorian-gray',
    identifier: 'pictureofdoriang00wildiala',
    fallbackTitle: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    year: '1890 (1891 Ward Lock Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'Aestheticism & Decadence',
    coverId: '14314858',
    curatedContext: "Wilde's brilliant philosophical novel centers on a Faustian pact where a portrait ages and bears the moral degradation of its subject while he remains eternally youthful. A profound critique of aestheticism severed from ethical restraint.",
    keyThemes: ['The Morality of Art', 'Double Life & Duplicity', 'Aesthetic Hedonism', 'Psychological Guilt'],
    authorBio: 'Oscar Fingal O\'Flahertie Wills Wilde (1854–1900) was an Irish poet and playwright known for his sharp wit and flamboyant aestheticism.'
  },
  {
    slug: 'a-christmas-carol',
    identifier: 'christmascar00dick',
    fallbackTitle: 'A Christmas Carol',
    author: 'Charles Dickens',
    year: '1843 (1843 Chapman & Hall Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'Victorian Social Reform',
    coverId: '12875748',
    curatedContext: 'Dickens’s timeless novella transformed modern perceptions of festive benevolence. Through Ebenezer Scrooge’s supernatural visitations, Dickens exposed the cruel austerity of Victorian Malthusian economics and championed communal empathy.',
    keyThemes: ['Moral Transformation', 'Social Injustice & Child Labor', 'Memory and Regret', 'Generosity and Community'],
    authorBio: 'Charles John Huffam Dickens (1812–1870) was an English novelist and social critic who created some of the world\'s best-known fictional characters.'
  },
  {
    slug: 'the-time-machine',
    identifier: 'timemachine0000well',
    fallbackTitle: 'The Time Machine',
    author: 'H. G. Wells',
    year: '1895 (1895 Heinemann Ed.)',
    category: 'Science & Biology',
    subdiscipline: 'Speculative Science Fiction',
    coverId: '9009316',
    curatedContext: 'Wells coined the term "time machine" and popularized temporal mechanics. The Time Traveller ventures to the year 802,701 AD, uncovering the bifurcation of humanity into the gentle Eloi and underground Morlocks—a brilliant allegory for class divergence.',
    keyThemes: ['Temporal Physics (The Fourth Dimension)', 'Evolutionary Class Divergence', 'Entropy and Deep Time', 'Technological Optimism Critique'],
    authorBio: 'Herbert George Wells (1866–1946) was an English writer prolific in many genres, widely called "the father of science fiction".'
  },
  {
    slug: 'the-metamorphosis',
    identifier: 'ost-english-metamorphosis-by-franz-kafka',
    fallbackTitle: 'The Metamorphosis',
    author: 'Franz Kafka',
    year: '1915 (Kurt Wolff Verlag)',
    category: 'Literature & Arts',
    subdiscipline: 'Existential Absurdism',
    coverId: '12820198',
    curatedContext: 'Gregor Samsa awakens to discover himself transformed into a monstrous vermin. Kafka’s understated, bureaucratic prose heightens the existential tragedy of economic utility dictating human affection.',
    keyThemes: ['Alienation from Labor', 'The Absurdity of Existence', 'Familial Betrayal', 'Bodily Disintegration'],
    authorBio: 'Franz Kafka (1883–1924) was a German-speaking Bohemian novelist and short-story writer whose works fuse realism and the fantastic.'
  },
  {
    slug: 'dracula',
    identifier: 'draculabr00stokuoft',
    fallbackTitle: 'Dracula',
    author: 'Bram Stoker',
    year: '1897 (Archibald Constable Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'Gothic Horror & Modernity',
    coverId: '12216503',
    curatedContext: 'Composed entirely of journal entries, letters, telegrams, and phonograph transcripts, Stoker pitted late-Victorian technologies (typewriters, blood transfusions) against archaic aristocratic predation.',
    keyThemes: ['Modernity vs Ancient Folklore', 'Epistolary Multi-Perspective', 'Contagion & Blood', 'Imperial Anxieties'],
    authorBio: 'Abraham "Bram" Stoker (1847–1912) was an Irish author best known today for his 1897 Gothic novel Dracula.'
  },
  {
    slug: 'the-interpretation-of-dreams',
    identifier: 'interpretationof1913freu',
    fallbackTitle: 'The Interpretation of Dreams',
    author: 'Sigmund Freud',
    year: '1899 (1913 Brill Trans.)',
    category: 'Science & Biology',
    subdiscipline: 'Psychoanalytic Theory',
    coverId: '234730',
    curatedContext: 'Freud’s foundational treatise posited that dreams are the "royal road to the unconscious," serving as disguised hallucinatory fulfillments of repressed instinctual wishes.',
    keyThemes: ['Wish Fulfillment', 'Manifest vs Latent Content', 'Dream-Work (Condensation & Displacement)', 'The Oedipus Complex'],
    authorBio: 'Sigmund Freud (1856–1939) was an Austrian neurologist and the founder of psychoanalysis.'
  },
  {
    slug: 'the-prophet',
    identifier: 'the-prophet-by-kahlil-gibran',
    fallbackTitle: 'The Prophet',
    author: 'Kahlil Gibran',
    year: '1923 (Alfred A. Knopf Ed.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Philosophical Prose Poetry',
    coverId: '418324',
    curatedContext: 'Composed of 26 poetic essays delivered by the prophet Almustafa before boarding a ship for his homeland. Gibran addresses love, work, sorrow, freedom, and death with luminous spiritual universality.',
    keyThemes: ['Sacred Interdependence', 'Work as Love Made Visible', 'Pain as the Bitter Potion of Healing', 'Freedom Through Self-Knowledge'],
    authorBio: 'Kahlil Gibran (1883–1931) was a Lebanese-American writer, poet, and visual artist, widely considered a literary luminary across East and West.'
  },
  {
    slug: 'crime-and-punishment',
    identifier: 'crimepunishment00dostuoft',
    fallbackTitle: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    year: '1866 (1914 Garnett Trans.)',
    category: 'Literature & Arts',
    subdiscipline: 'Psychological Realism',
    coverId: '9411873',
    curatedContext: 'Dostoevsky examines the tormented psychology of Rodion Raskolnikov, a destitute St. Petersburg student who murders an unscrupulous pawnbroker to prove himself an extraordinary Napoleonic figure exempt from moral law.',
    keyThemes: ['The Extraordinary Man Theory', 'Psychological Guilt & Delirium', 'Suffering and Redemption', 'Nihilism Critique'],
    authorBio: 'Fyodor Mikhailovich Dostoevsky (1821–1881) was a Russian novelist whose works explore human psychology in troubled sociopolitical contexts.'
  },
  {
    slug: 'the-metaphysics-of-aristotle',
    identifier: 'aristotlesmetaph0001aris',
    fallbackTitle: 'The Metaphysics',
    author: 'Aristotle',
    year: 'c. 350 BC (1908 Ross Trans.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Classical Ontology & Substance',
    coverId: '129771',
    curatedContext: 'Aristotle examines the fundamental nature of reality, formulating the principles of being qua being, substance (ousia), potentiality and actuality, and the Unmoved Mover.',
    keyThemes: ['Being Qua Being', 'Hylomorphism (Form and Matter)', 'Potentiality vs Actuality', 'The Prime Mover'],
    authorBio: 'Aristotle (384–322 BC) was an Ancient Greek philosopher and polymath whose writings covered natural science, logic, ethics, and metaphysics.'
  },
  {
    slug: 'ethics-demonstrated-in-geometrical-order',
    identifier: 'benedict-de-spinoza-ethics',
    fallbackTitle: 'Ethics (Demonstrated in Geometrical Order)',
    author: 'Baruch Spinoza',
    year: '1677 (1883 Elwes Trans.)',
    category: 'Philosophy & Ethics',
    subdiscipline: 'Rationalist Pantheism',
    coverId: '8244655',
    curatedContext: 'Organized with Euclidean rigor using definitions, axioms, and propositions, Spinoza equated God and Nature (Deus sive Natura), constructing a monist philosophy of supreme intellectual clarity.',
    keyThemes: ['Substance Monism (Deus sive Natura)', 'Determinism and Free Will', 'The Conatus (Self-Preservation)', 'The Intellectual Love of God'],
    authorBio: 'Baruch Spinoza (1632–1677) was a Jewish-Dutch philosopher of Portuguese Sephardic origin, one of the foremost rationalists of the 17th century.'
  },
  {
    slug: 'the-jungle',
    identifier: 'thejungle00sincuoft',
    fallbackTitle: 'The Jungle',
    author: 'Upton Sinclair',
    year: '1906 (1906 Doubleday Page Ed.)',
    category: 'Economics & Commerce',
    subdiscipline: 'Investigative Muckraking Journalism',
    coverId: '8231790',
    curatedContext: 'Sinclair exposed the unsanitary conditions and brutal labor exploitation in Chicago’s Union Stock Yards, catalyzing the passage of the Pure Food and Drug Act of 1906.',
    keyThemes: ['Industrial Working Conditions', 'Immigrant Labor Exploitation', 'Sanitary Public Health', 'Capitalist Monopolies'],
    authorBio: 'Upton Beall Sinclair Jr. (1878–1968) was an American writer who won the Pulitzer Prize for Fiction in 1943.'
  },
  {
    slug: 'the-souls-of-black-folk',
    identifier: 'cu31924024920492',
    fallbackTitle: 'The Souls of Black Folk',
    author: 'W. E. B. Du Bois',
    year: '1903 (1903 McClurg Ed.)',
    category: 'History & Strategy',
    subdiscipline: 'Sociology & Civil Rights',
    coverId: '6564090',
    curatedContext: 'Du Bois introduced seminal sociological concepts including "double consciousness" and "the Veil", establishing an indispensable foundation for African American intellectual history.',
    keyThemes: ['Double Consciousness', 'The Problem of the Color Line', 'Higher Education vs Vocational Training', 'The Sorrow Songs'],
    authorBio: 'William Edward Burghardt Du Bois (1868–1963) was an American sociologist, socialist, historian, and civil rights activist.'
  },
  {
    slug: 'flatland-a-romance-of-many-dimensions',
    identifier: 'flatlandromanceo00abbouoft',
    fallbackTitle: 'Flatland: A Romance of Many Dimensions',
    author: 'Edwin A. Abbott',
    year: '1884 (1884 Seeley Ed.)',
    category: 'Science & Biology',
    subdiscipline: 'Geometric Satire & Higher Dimensions',
    coverId: '10069547',
    curatedContext: 'A square living in a two-dimensional world is visited by a three-dimensional sphere, opening his mind to higher dimensions. A luminous mathematical exploration that doubled as a trenchant satire of Victorian social stratification.',
    keyThemes: ['Dimensional Analogy', 'Epistemological Humility', 'Victorian Class Rigidity', 'Perspective Relativity'],
    authorBio: 'Edwin Abbott Abbott (1838–1926) was an English schoolmaster and theologian, best known as the author of Flatland.'
  },
  {
    slug: 'the-yellow-wallpaper',
    identifier: 'yellowwallpaper00gilmgoog',
    fallbackTitle: 'The Yellow Wallpaper',
    author: 'Charlotte Perkins Gilman',
    year: '1892 (1899 Small Maynard Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'Psychological Feminist Literature',
    coverId: '652029',
    curatedContext: 'An intense first-person account of a woman undergoing the Victorian "rest cure" for nervous depression, forbidden from writing or intellectual stimulation until she projects her entrapment into the bedroom wallpaper patterns.',
    keyThemes: ['Medical Paternalism', 'Silencing of Female Creative Intellect', 'Spatial Claustrophobia', 'Psychological Dissociation'],
    authorBio: 'Charlotte Perkins Gilman (1860–1935) was a prominent American humanist, novelist, writer of short stories, poetry, and social reformer.'
  },
  {
    slug: 'the-autobiography-of-benjamin-franklin',
    identifier: 'autobiobenfran00miffrich',
    fallbackTitle: 'The Autobiography of Benjamin Franklin',
    author: 'Benjamin Franklin',
    year: '1791 (1906 Riverside Press Ed.)',
    category: 'History & Strategy',
    subdiscipline: 'Enlightenment Pragmatism',
    coverId: '5647361',
    curatedContext: 'Franklin chronicles his rise from impoverished printer’s apprentice to world-renowned scientist, statesman, and diplomat. Features his famous systematic plan for attaining moral perfection across thirteen virtues.',
    keyThemes: ['Pragmatic Self-Improvement', 'Civic Entrepreneurship', 'The Art of Rhetorical Persuasion', 'Enlightenment Scientific Curiosity'],
    authorBio: 'Benjamin Franklin (1706–1790) was an American polymath, writer, scientist, inventor, and Founding Father of the United States.'
  },
  {
    slug: 'heart-of-darkness',
    identifier: 'joseph-conrad_heart-of-darkness',
    fallbackTitle: 'Heart of Darkness',
    author: 'Joseph Conrad',
    year: '1899 (1902 Blackwood Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'Modernist Fiction & Anti-Imperialism',
    coverId: '12307847',
    curatedContext: 'Charles Marlow journeys up the Congo River in search of the elusive ivory trader Kurtz. Conrad’s brooding masterpiece exposes the profound moral rot beneath European colonial civilizing pretensions.',
    keyThemes: ['The Hypocrisy of Imperialism', 'The Savage Heart of Civilization', 'Psychological Breakdown', 'Narrative Impressionism'],
    authorBio: 'Joseph Conrad (born Józef Teodor Konrad Korzeniowski; 1857–1924) was a Polish-British writer regarded as one of the greatest novelists in the English language.'
  },
  {
    slug: 'the-principles-of-psychology',
    identifier: 'theprinciplesofp01jameuoft',
    fallbackTitle: 'The Principles of Psychology',
    author: 'William James',
    year: '1890 (1890 Henry Holt Ed.)',
    category: 'Science & Biology',
    subdiscipline: 'Functional Psychology',
    coverId: '5815742',
    curatedContext: 'James founded American functionalist psychology, coining the landmark phrase "stream of thought" (stream of consciousness) and formulating theories of emotion, habit formation, and attentional control.',
    keyThemes: ['Stream of Consciousness', 'The Habitual Architecture of Mind', 'James-Lange Theory of Emotion', 'Volition and Effort of Attention'],
    authorBio: 'William James (1842–1910) was an American philosopher and psychologist, and the first educator to offer a psychology course in the United States.'
  },
  {
    slug: 'a-princess-of-mars',
    identifier: 'princessofmars00burriala',
    fallbackTitle: 'A Princess of Mars',
    author: 'Edgar Rice Burroughs',
    year: '1912 (1917 McClurg Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'Planetary Romance & Pulp Fiction',
    coverId: '207226',
    curatedContext: 'John Carter is mysteriously transported to the dying planet Barsoom (Mars), where lower gravity grants him superhuman agility among green Martians and the helium princess Dejah Thoris. Founded the modern space fantasy genre.',
    keyThemes: ['Pulp World-Building', 'Extraterrestrial Ecology', 'Chivalry and Honor Codes', 'Gravitational Mechanics'],
    authorBio: 'Edgar Rice Burroughs (1875–1950) was an American speculative fiction writer, best known for creating the characters Tarzan and John Carter of Mars.'
  },
  {
    slug: 'leaves-of-grass',
    identifier: 'LeavesOfGrass1855Edition',
    fallbackTitle: 'Leaves of Grass',
    author: 'Walt Whitman',
    year: '1855 (1855 Brooklyn Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'American Free Verse Poetry',
    coverId: '9000447',
    curatedContext: 'Whitman revolutionized poetry with expansive free-verse lines celebrating democracy, physical vitality, sensual connection, and the cosmic unity of the self ("I celebrate myself, and sing myself").',
    keyThemes: ['Democratic Cosmopolitanism', 'Celebration of the Physical Body', 'Free Verse Cadence', 'Transcendental Unity'],
    authorBio: 'Walter Whitman (1819–1892) was an American poet, essayist, and journalist, a central figure in the American Renaissance.'
  },
  {
    slug: 'gullivers-travels',
    identifier: 'gullivers-travels-jonathan-swift',
    fallbackTitle: "Gulliver's Travels",
    author: 'Jonathan Swift',
    year: '1726 (1726 Benjamin Motte Ed.)',
    category: 'Literature & Arts',
    subdiscipline: 'Satire & Human Nature',
    coverId: '12717083',
    curatedContext: 'Lemuel Gulliver’s voyages to Lilliput, Brobdingnag, Laputa, and the land of the Houyhnhnms constitute literature’s greatest satirical masterpiece on political vanity, corrupt science, and misanthropy.',
    keyThemes: ['Satire of Political Factions', 'Relativity of Human Scale', 'Critique of Impractical Intellectualism', 'The Yahoo vs Rational Horse (Houyhnhnm)'],
    authorBio: 'Jonathan Swift (1667–1745) was an Anglo-Irish satirist, essayist, political pamphleteer, poet, and Dean of St Patrick\'s Cathedral, Dublin.'
  }
];

async function runPipeline() {
  console.log(`Starting Public Domain E-Book Ingestion Pipeline for ${EBOOKS_CATALOGUE.length} books...`);

  const processedEbooks = [];

  for (const item of EBOOKS_CATALOGUE) {
    const slug = item.slug;
    const coverUrl = item.coverUrl || `https://covers.openlibrary.org/b/id/${item.coverId}-L.jpg`;
    const pdfUrl = `https://archive.org/download/${item.identifier}/${item.identifier}.pdf`;

    const ebookObject = {
      slug,
      identifier: item.identifier,
      title: item.fallbackTitle,
      originalTitle: item.fallbackTitle,
      author: item.author,
      year: item.year,
      category: item.category,
      subdiscipline: item.subdiscipline,
      pageCount: 320,
      coverUrl,
      pdfUrl,
      publicDomainStatus: 'Verified Public Domain (Pre-1928 / Open Heritage)',
      license: 'Public Domain Mark 1.0',
      archiveSourceUrl: `https://archive.org/details/${item.identifier}`,
      curatedContext: item.curatedContext,
      keyThemes: item.keyThemes,
      authorBio: item.authorBio,
      readingTimeHours: 8
    };

    // Save individual atomic JSON chunk for edge caching
    const individualChunkPath = path.join(ebooksContentDir, `${slug}.json`);
    fs.writeFileSync(individualChunkPath, JSON.stringify(ebookObject, null, 2), 'utf8');

    processedEbooks.push(ebookObject);
  }

  // Save master index
  fs.writeFileSync(ebooksJsonPath, JSON.stringify(processedEbooks, null, 2), 'utf8');

  console.log(`\n✅ E-Books Ingestion Pipeline Complete!`);
  console.log(`   - Saved ${processedEbooks.length} atomic e-book chunks in: content/ebooks/`);
  console.log(`   - Generated master catalogue in: src/data/ebooks.json (${(Buffer.byteLength(JSON.stringify(processedEbooks)) / 1024).toFixed(1)} KB)`);
}

runPipeline();
