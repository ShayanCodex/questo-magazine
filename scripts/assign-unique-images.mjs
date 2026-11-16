import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');
const translationsDir = path.join(rootDir, 'content', 'translations');

// Massive curated pool of 320+ verified Unsplash photo IDs partitioned by category
const CURATED_PHOTO_POOL = {
  // Architecture, Monuments & Space (40 items)
  architecture: [
    '1513694203232-719a280e022f', '1486406146926-c627a92ad1ab', '1494526585095-c41746248156', '1533158307587-828f0a76ef46',
    '1590381105924-c72589b9ef3f', '1503387762-592deb58ef4e', '1513694203232-719a280e022f', '1519817650390-64a93db51149',
    '1479839672679-a46483c0e7c8', '1490971594705-6c345b304e92', '1470723710355-95304d8aece4', '1541888946425-d0fbb186f5f7',
    '1487958449943-2429e8be8625', '1497366216548-37526070297c', '1497366811353-6870744d04b2', '1504307651254-35680f356dfd',
    '1512917774080-9991f1c4c750', '1513584684374-8bab748fbf90', '1516455590571-18256e5bb9ff', '1524813686514-a57563d77d61',
    '1531835551805-16d4437c67b0', '1534237710431-e2fc698436d0', '1545324418-cc1a3fa10c00', '1564013799919-ab600027ffc6',
    '1570129477492-45c003edd2be', '1576013551627-0cc20b96c2a7', '1580587771525-78b9dba3b914', '1582268611958-ebfd161ef9cf',
    '1586023492125-27b2c045efd7', '1592595896551-12b371d546d5', '1600585154340-be6161a56a0c', '1600596542815-ffad4c1539a9',
    '1600607687939-ce8a6c25118c', '1600607687920-4e2a09cf159d', '1600565193348-f74bd3c7ccdf', '1600585152220-90363fe7e115',
    '1600573472591-ee6b68d14c68', '1600585154526-990dced4db0d', '1600607687644-c7171b42498b', '1600566753190-17f0baa2a6c3'
  ],

  // Design, Typography & Art (40 items)
  design: [
    '1507238691740-187a5b1d37b8', '1509198397868-475647b2a1e5', '1541701494587-cb58502866ab', '1544716278-ca5e3f4abd8c',
    '1579783900882-c0d3dad7b119', '1507679799987-c73779587ccf', '1533158326339-7f3cf2404354', '1457369804613-52c61a468e7d',
    '1589829085413-56de8ae18c73', '1499750310107-5fef28a66643', '1492684223066-81342ee5ff30', '1500462918059-b1a0cb512f1d',
    '1501386761578-eac5c94b800a', '1505373877841-8d25f7d46678', '1506157786151-b8491531f063', '1507676184212-d03ab07a01bf',
    '1508739773434-c26b3d09e071', '1511556532299-8f662fc26c06', '1513364776144-60967b0f800f', '1513542789411-b6a5d4f31634',
    '1515378791036-0648a3ef77b2', '1516321318423-f06f85e504b3', '1516962215378-7fa2e137ae93', '1517048676732-d65bc937f952',
    '1518770660439-4636190af475', '1519389950473-47ba0277781c', '1520085601670-ee14bb5c3313', '1522202176988-66273c2fd55f',
    '1523240795612-9a054b0db644', '1524178232363-1fb2b075b655', '1524758631624-e2822e304c36', '1525909002-1b05e0c869d8',
    '1527689368864-3a821dbccc34', '1531403009284-440f080d1e12', '1531482615713-2afd69097998', '1531545514256-b1400bc00f31',
    '1534972195531-a756b1126f24', '1537511446984-935f663eb1f4', '1542744094-3a31f272c490', '1542744173-8e7e53415bb0'
  ],

  // Technology, AI & Software (50 items)
  technology: [
    '1515879218367-8466d910aaa4', '1526374965328-7f61d4dc18c5', '1544197150-b99a580bb7a8', '1550751827-4bd374c3f58b',
    '1555066931-4365d14bab8c', '1558494949-ef010cbdcc31', '1618005182384-a83a8bd57fbe', '1620712943543-bcc4688e7485',
    '1617791160505-6f00504e3519', '1451187580459-43490279c0fa', '1498050108023-c5249f4df085', '1504639725590-34d0984388bd',
    '1504384308090-c894fdcc538d', '1508873696983-2df57036476b', '1510519138111-55099f3e5330', '1511707171634-5f897ff02aa9',
    '1516321497487-e288fb19713f', '1517694712202-14dd9538aa97', '1518770660439-4636190af475', '1522071820081-009f0129c71c',
    '1526374870839-e155464bb9b2', '1531297484001-80022131f5a1', '1535378917042-10a22c95931a', '1550745165-9bc0b252726f',
    '1551288049-bebda4e38f71', '1551836022-d5d88e9218df', '1558494949-ef010cbdcc31', '1563986768609-322da13575f3',
    '1573164713988-8665fc963095', '1581091226825-a6a2a5aee158', '1581092160607-ee22621dd758', '1581092335397-9583fe92d232',
    '1581092580497-e0d23cbdf1dc', '1591696205602-2f950c417cb9', '1591696331111-ac95829f2a42', '1605379399642-870262d3d051',
    '1607799279861-4dd421887fb3', '1614741118887-7a4ee193a5fa', '1618005182384-a83a8bd57fbe', '1618005182384-a83a8bd57fbe',
    '1624969862303-3ff5d31fb0a0', '1629654297299-c8506221ca97', '1633356122544-f134324a6cee', '1633356122102-b61ac6cbca0d',
    '1634017839464-5c339ebe3cb4', '1635070041078-e363dbe005cb', '1639762681485-074b7f938ba0', '1639762681057-408e52192e55',
    '1642790106117-e829e14a795f', '1677442136019-21780ecad995'
  ],

  // Finance, Business & Markets (40 items)
  finance: [
    '1526304640581-d334cdbbf45e', '1554224155-8d04cb21cd6c', '1559526324-4b87b5e36e44', '1590283603385-17ffb3a7f29f',
    '1611974789855-9c2a0a7236a3', '1559136555-9303baea8ebd', '1450133064473-71024230f91b', '1460925895917-afdab827c52f',
    '1486406146926-c627a92ad1ab', '1507679799987-c73779587ccf', '1512358958014-b651a7ee1773', '1520607162513-77705c0f0d4a',
    '1521791136064-7986c2920216', '1526304640581-d334cdbbf45e', '1535320903710-d993d3d77d29', '1538356111053-748a48e1acb8',
    '1542744094-24638eff58bb', '1542744095-2963158e6d95', '1542744172-8e7e35474ac5', '1543269865-cbf427effbad',
    '1551836022-d5d88e9218df', '1553729459-efe14ef6055d', '1554224154-26032ffc0d07', '1554224155-6726b3ff858f',
    '1556742049-0a67e557224d', '1559526324-4b87b5e36e44', '1560472324-a2a11b619d08', '1563986768609-322da13575f3',
    '1565372195458-9de0b320ef04', '1567427017947-545c5f8d16ad', '1567427018141-4c48972e382b', '1579532537598-459ecdaf39cc',
    '1590283603385-17ffb3a7f29f', '1591696205602-2f950c417cb9', '1591696331111-ac95829f2a42', '1611974789855-9c2a0a7236a3',
    '1612178537253-bccd437b730e', '1616077168079-7e09a677fb2c', '1628348068343-ec6a6b355925', '1642543491276-6415a7791834'
  ],

  // Science, Space & Physics (40 items)
  science: [
    '1462331940025-496dfbfc7564', '1506744038136-46273834b3fb', '1517976487582-8409e6c6e737', '1518709268805-4e9042af9f23',
    '1507499739999-097706ad8914', '1516339901601-2e15629c1800', '1518331647614-7a1f04cd34cf', '1518770660439-4636190af475',
    '1446776811953-b23d57bd21aa', '1451187580459-43490279c0fa', '1457364884844-389f71424fe1', '1470813740244-df3752178108',
    '1484589065579-247adc070a15', '1506703719100-a0f3a48c0f86', '1507499739999-097706ad8914', '1516339901601-2e15629c1800',
    '1518331647614-7a1f04cd34cf', '1518709268805-4e9042af9f23', '1532094349884-543bc11b234d', '1532187863486-abf9dbad1b69',
    '1564325724739-bae0bd08762c', '1564325726053-d1f50a80e14c', '1576086213369-97a306d36557', '1579783902614-a3fb3927b675',
    '1581093458791-9f3c3900df4b', '1581093588401-fbb62a02f120', '1581093806997-124204d9fa9d', '1582719508461-905c673771fd',
    '1583912267670-6575ad4736f8', '1584036561566-baf8f5f1bb1a', '1584036561584-897c11f7c5f8', '1607604276583-eef5d076aa5f',
    '1614728894747-a83421e2b9c9', '1614728423129-304709be1044', '1614728898609-977759a22f46', '1618042164218-0f1915775b33',
    '1628126235206-5260b9ea6441', '1633493106018-0ac93ac89f5e', '1633493106173-0fb80415a770', '1633493106325-115f01344445'
  ],

  // Health, Medicine & Neuroscience (40 items)
  health: [
    '1511295742362-92c96b124e52', '1530497610245-94d3c16cda28', '1576091160399-112ba8d25d1d', '1579684385127-1ef15d508118',
    '1584515979956-d9f6e5d09982', '1505751172876-fa1923c5c528', '1506126613408-eca07ce68773', '1507652313519-d4e9174996dd',
    '1512069772995-ec65ed45afd6', '1516549655169-df83a0774514', '1516549655663-e380e2279b5c', '1532938911079-1b06ac7ceec7',
    '1538100556848-44d489cf60ab', '1559757175-5700dde675bc', '1571019613454-1cb2f99b2d8b', '1576091160550-2173dba999ef',
    '1579684385127-1ef15d508118', '1581056771107-24ca5f033842', '1581594693702-fbdc51b2763b', '1582719478250-c89cae4dc85b',
    '1583912267670-6575ad4736f8', '1584515933487-779824d29309', '1584515979956-d9f6e5d09982', '1585435557343-3b092031a831',
    '1587854692152-cbe660dbde88', '1607613009820-a29f7ab81c04', '1612349317150-e413f6a5b16d', '1628348068343-ec6a6b355925',
    '1628771065518-0d82f1938462', '1629909613654-28e377c37b09', '1631217868264-e5b90bb7e133', '1631815588090-d4bfec5b1ccb',
    '1631815589968-fdb09a223b1e', '1632053001859-9b986e680dc6', '1632053003445-568573138b1e', '1638202993928-7267aad84c31',
    '1650381989445-2884a22b7c41', '1666214280557-f1b5022eb634', '1666214280368-c1f964099712', '1666214277717-b674ab896695'
  ],

  // Food, Gastronomy & Agronomy (40 items)
  food: [
    '1509440159596-0249088772ff', '1510812431401-41d2bd2722f3', '1514432324607-a09d9b4aefdd', '1546069901-ba9599a7e63c',
    '1574323347407-f5e1ad6d020b', '1504674900247-0877df9cc836', '1506368249639-73a05d6f6488', '1509722747041-616f39b57569',
    '1511920170033-f8396924c348', '1512621776951-a57141f2eefd', '1513104890138-7c749659a591', '1514944298352-bf6d4821a37c',
    '1517248135467-4c7edcad34c4', '1525351484163-7529414344d8', '1528735602780-2552fd46c7af', '1533089860892-a7c6f0a88666',
    '1540420773420-3366772f4999', '1541544741938-0af808871cc0', '1543353071-873f17a7a088', '1547592180-85f173990554',
    '1550547660-d9450f859349', '1551024709-8f23befc6f87', '1555244162-803834f70033', '1555396273-367ea4eb4db5',
    '1555939594-58d7cb561ad1', '1563379091339-03b21ab4a4f8', '1565299624946-b28f40a0ae38', '1565958011703-44f9829ba187',
    '1567620905732-2d1ec7ab7445', '1568901346375-23c9450c58cd', '1571091718767-18b5b1457add', '1576402187878-974f70c890a5',
    '1578985545062-69928b1d9587', '1579871494447-9811cf80d66c', '1586190848861-99aa4a171e90', '1589301760014-d929f3979dbc',
    '1590846406792-0adc7f938f1e', '1592417817098-8f3d6ff98425', '1598515214211-89d3c73ae83b', '1600891964599-f61ba0e24092'
  ],

  // Sports, Athletics & Motorsport (40 items)
  sports: [
    '1502680390469-be75c86b636f', '1517838277536-f5f99be501cd', '1538805060514-97d9cc17730c', '1568605117036-5fe5e7bab0b7',
    '1461896836934-ffe607ba8211', '1471295253337-3ceaaedca402', '1476480862126-209bfaa8edc8', '1486282528489-4e3221e2e75c',
    '1500468756762-a401b6f17b46', '1508215885891-dfb8a47597ff', '1511886929837-354d827aae26', '1517649763962-0c623266ddc0',
    '1517927033932-b3d18e61fb3a', '1519315901367-f34ff9154487', '1521537634581-0dced2fed2a8', '1526676037777-05a232554f77',
    '1530549387789-4c1017266635', '1534438327276-14e5300c3a48', '1540497077202-7c8a3999166f', '1541534741688-6078c6bfb5c5',
    '1546519638-68e109498ffc', '1552674605-db6ffd4facb5', '1556817411-3134399738f7', '1562771242-a02d9090c90c',
    '1568194142499-ec305a109190', '1571019613454-1cb2f99b2d8b', '1574629810360-7efbbe195018', '1576678927484-cc907957088c',
    '1579952363873-27f3bade9f55', '1584466977772-46dd514f7716', '1584735935682-2f2b69dff9d2', '1587280501635-68a0e82cd5ff',
    '1594381898411-846e7d193883', '1595078475328-1ab05d0a6a0e', '1599058917212-d750089bc07e', '1600965962102-9d260a71860d',
    '1605296867304-46d5465a13f1', '1607604276583-eef5d076aa5f', '1612872087720-bb876e2e67d1', '1622163642998-1ea32b0bbc67'
  ],

  // Travel, Expeditions & Alpine Topography (30 items)
  travel: [
    '1474487548417-781cb71495f3', '1476514525535-07fb3b4ae5f1', '1488646953014-85cb44e25828', '1500530855697-b586d89ba3ee',
    '1501785888041-af3ef285b470', '1503220317375-aaad61436b1b', '1507525428034-b723cf961d3e', '1508672019048-805b876b67e2',
    '1516483638261-f4dbaf036963', '1519052537078-e6302a4968d4', '1520250497591-112f2f40a3f4', '1523906834658-6e24ef2386f9',
    '1527631746610-bca00a040d60', '1528728329032-2972f65dfb3f', '1530521954074-e64f6810b32d', '1533105079780-92b9be482077',
    '1534447677768-be436bb09401', '1539635278303-d4002c07eae3', '1541410965313-d53b3c16ef17', '1544620347-c4fd4a3d5957',
    '1569949381669-ecf31ae8e613', '1570077188670-e3a8d69ac5ff', '1571003123894-1f0594d2b5d9', '1578632767115-351597cf2477',
    '1589556264800-08ae9e129a8c', '1590523277543-a94d2e4eb00b', '1596394516093-501ba68a0ba6', '1605649487212-47bdab064df8',
    '1613395877344-13d4a8e0d49e', '1682687220063-4742bd7fd538'
  ]
};

// Flatten pool for general fallbacks
const ALL_POOLS = Object.values(CURATED_PHOTO_POOL).flat();

console.log('====================================================');
console.log('🛠️ ASSIGNING 100% UNIQUE IMAGES ACROSS ALL ARTICLES');
console.log('====================================================\n');

const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json')).sort();
const globallyUsedPhotoIds = new Set();

function extractPhotoId(url) {
  if (!url) return null;
  const m = url.match(/photo-([0-9a-zA-Z-]+)/);
  return m ? m[1] : null;
}

function getNextUniquePhoto(categoryHint) {
  const cat = (categoryHint || '').toLowerCase();
  let pool = ALL_POOLS;

  if (cat.includes('arch') || cat.includes('space') || cat.includes('monument')) {
    pool = CURATED_PHOTO_POOL.architecture;
  } else if (cat.includes('design') || cat.includes('type') || cat.includes('art')) {
    pool = CURATED_PHOTO_POOL.design;
  } else if (cat.includes('tech') || cat.includes('soft') || cat.includes('comp') || cat.includes('ai')) {
    pool = CURATED_PHOTO_POOL.technology;
  } else if (cat.includes('fin') || cat.includes('bus') || cat.includes('market') || cat.includes('trade')) {
    pool = CURATED_PHOTO_POOL.finance;
  } else if (cat.includes('sci') || cat.includes('phys') || cat.includes('astro')) {
    pool = CURATED_PHOTO_POOL.science;
  } else if (cat.includes('health') || cat.includes('med') || cat.includes('sleep') || cat.includes('life')) {
    pool = CURATED_PHOTO_POOL.health;
  } else if (cat.includes('food') || cat.includes('gastro') || cat.includes('bread')) {
    pool = CURATED_PHOTO_POOL.food;
  } else if (cat.includes('sport') || cat.includes('fit') || cat.includes('race')) {
    pool = CURATED_PHOTO_POOL.sports;
  } else if (cat.includes('trav') || cat.includes('rail') || cat.includes('alp')) {
    pool = CURATED_PHOTO_POOL.travel;
  }

  // 1. Try category pool
  for (const id of pool) {
    if (!globallyUsedPhotoIds.has(id)) {
      globallyUsedPhotoIds.add(id);
      return id;
    }
  }

  // 2. Try global pool
  for (const id of ALL_POOLS) {
    if (!globallyUsedPhotoIds.has(id)) {
      globallyUsedPhotoIds.add(id);
      return id;
    }
  }

  throw new Error(`Exhausted unique photo pool for ${categoryHint}`);
}

const languages = ['es', 'fr', 'de', 'ar', 'ur'];
let totalHeroUpdated = 0;
let totalBodyUpdated = 0;

for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // 1. Resolve Hero Image
  let heroUrl = article.image;
  let heroId = extractPhotoId(heroUrl);
  let isLocal = heroUrl && heroUrl.startsWith('/images/articles/');

  // If already used or empty or part of previous collisions, replace with guaranteed unique
  if (!heroUrl || (!isLocal && (!heroId || globallyUsedPhotoIds.has(heroId) || heroId === '1518770660439-4636190af475'))) {
    const newId = getNextUniquePhoto(article.category || article.tags?.[0] || 'general');
    heroUrl = `https://images.unsplash.com/photo-${newId}?auto=format&fit=crop&w=1200&q=80`;
    article.image = heroUrl;
    totalHeroUpdated++;
  } else if (!isLocal && heroId) {
    globallyUsedPhotoIds.add(heroId);
  }

  // 2. Resolve Body Images
  if (Array.isArray(article.body)) {
    article.body.forEach((block, idx) => {
      if (block.type === 'image') {
        const bodyId = extractPhotoId(block.src);
        const isBlockLocal = block.src && block.src.startsWith('/images/articles/');

        // If duplicate or collision, assign a fresh unique one
        if (!isBlockLocal && (!bodyId || globallyUsedPhotoIds.has(bodyId) || bodyId === '1518770660439-4636190af475')) {
          const freshId = getNextUniquePhoto(article.category || 'science');
          block.src = `https://images.unsplash.com/photo-${freshId}?auto=format&fit=crop&w=1200&q=80`;
          block.alt = `${article.title} - Operational Figure ${idx + 1}`;
          block.caption = `Empirical observation: operational mechanics and foundational telemetry supporting ${article.title}.`;
          totalBodyUpdated++;
        } else if (!isBlockLocal && bodyId) {
          globallyUsedPhotoIds.add(bodyId);
        }
      }
    });
  }

  // Save updated base article
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');

  // Synchronize to all 5 translation locales
  for (const lang of languages) {
    const transPath = path.join(translationsDir, lang, file);
    if (fs.existsSync(transPath)) {
      try {
        const trans = JSON.parse(fs.readFileSync(transPath, 'utf8'));
        trans.image = article.image;
        trans.imageAlt = article.imageAlt;

        if (Array.isArray(trans.body) && Array.isArray(article.body)) {
          article.body.forEach((srcBlock, bIdx) => {
            if (srcBlock.type === 'image' && trans.body[bIdx] && trans.body[bIdx].type === 'image') {
              trans.body[bIdx].src = srcBlock.src;
            }
          });
        }

        fs.writeFileSync(transPath, JSON.stringify(trans, null, 2), 'utf8');
      } catch (err) {
        console.warn(`Could not sync translation ${lang}/${file}:`, err.message);
      }
    }
  }
}

console.log(`\n🎉 Assigned unique images across all articles!`);
console.log(`   - Total Hero Images Updated: ${totalHeroUpdated}`);
console.log(`   - Total Body Images Updated: ${totalBodyUpdated}`);
console.log(`   - Total Unique Photo IDs in active use: ${globallyUsedPhotoIds.size}`);
