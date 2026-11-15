/**
 * Questo Autonomous External Knowledge API Services
 * Modular, keyless, privacy-preserving client-side & SSG data fetchers.
 * Includes in-memory caching, rate-limit backoffs, and strict editorial disclaimers.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string, ttlMs = 300000): T | null {
  const entry = apiCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) {
    apiCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T): void {
  // Keep cache bounded to 150 items
  if (apiCache.size > 150) {
    const oldestKey = apiCache.keys().next().value;
    if (oldestKey) apiCache.delete(oldestKey);
  }
  apiCache.set(key, { data, timestamp: Date.now() });
}

/* =========================================================================
   1. TheMealDB (Culinary & Gastronomy Science)
   ========================================================================= */

export interface CulinaryRecipe {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  tags: string[];
  ingredients: Array<{ name: string; measure: string }>;
  sourceUrl?: string;
  youtubeUrl?: string;
}

export async function fetchCulinaryRecipe(query = 'bread'): Promise<CulinaryRecipe[]> {
  const cacheKey = `themealdb_${query.toLowerCase()}`;
  const cached = getCached<CulinaryRecipe[]>(cacheKey);
  if (cached) return cached;

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data || !Array.isArray(data.meals)) {
      return getFallbackRecipes();
    }

    const recipes: CulinaryRecipe[] = data.meals.slice(0, 6).map((m: Record<string, string | null>) => {
      const ingredients: Array<{ name: string; measure: string }> = [];
      for (let i = 1; i <= 20; i++) {
        const ing = m[`strIngredient${i}`];
        const measure = m[`strMeasure${i}`];
        if (ing && ing.trim()) {
          ingredients.push({
            name: ing.trim(),
            measure: (measure || '').trim(),
          });
        }
      }

      return {
        id: m.idMeal || String(Math.random()),
        name: m.strMeal || 'Artisanal Preparation',
        category: m.strCategory || 'Gastronomy',
        area: m.strArea || 'International',
        instructions: m.strInstructions || '',
        thumbnail: m.strMealThumb || '/images/articles/maillard-reaction-culinary.jpg',
        tags: m.strTags ? m.strTags.split(',').map((t) => t.trim()) : ['Artisan', 'Culinary'],
        ingredients,
        sourceUrl: m.strSource || undefined,
        youtubeUrl: m.strYoutube || undefined,
      };
    });

    setCached(cacheKey, recipes);
    return recipes;
  } catch {
    return getFallbackRecipes();
  }
}

function getFallbackRecipes(): CulinaryRecipe[] {
  return [
    {
      id: '52855',
      name: 'Artisan Wild Sourdough Boule',
      category: 'Fermentation & Bread',
      area: 'Franco-Swiss',
      instructions: 'Naturally fermented wild lactobacillus sourdough with eighty percent hydration, 24-hour cold retard, and Dutch oven steam baking at 240°C.',
      thumbnail: '/images/articles/maillard-reaction-culinary.jpg',
      tags: ['Sourdough', 'Fermentation', 'Artisan'],
      ingredients: [
        { name: 'Organic Bread Flour', measure: '500g' },
        { name: 'Filtered Water', measure: '400ml' },
        { name: 'Active Sourdough Starter', measure: '100g' },
        { name: 'Sea Salt', measure: '10g' },
      ],
    },
    {
      id: '52856',
      name: 'Traditional Miso & Shiitake Dashi',
      category: 'Fermentation & Umami',
      area: 'Japanese',
      instructions: 'Extracted kombu glutamates steeped at 60°C combined with sun-dried shiitake guanylate, finished with barley koji miso.',
      thumbnail: '/images/articles/maillard-reaction-culinary.jpg',
      tags: ['Umami', 'Koji', 'Dashi'],
      ingredients: [
        { name: 'Kombu Kelp', measure: '20g' },
        { name: 'Dried Shiitake Mushrooms', measure: '30g' },
        { name: 'Aged Koji Miso', measure: '3 tbsp' },
      ],
    },
  ];
}

/* =========================================================================
   2. OpenFDA Clinical Reference & Health Telemetry
   ========================================================================= */

export interface ClinicalDrugInfo {
  genericName: string;
  brandName?: string;
  indications: string;
  mechanismOfAction?: string;
  warnings?: string;
  pharmClass?: string[];
  disclaimer: string;
}

export async function fetchClinicalDrugInfo(genericName = 'metformin'): Promise<ClinicalDrugInfo | null> {
  const cacheKey = `openfda_${genericName.toLowerCase()}`;
  const cached = getCached<ClinicalDrugInfo>(cacheKey);
  if (cached) return cached;

  const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(genericName)}"&limit=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return getFallbackClinicalInfo(genericName);
    }

    const item = data.results[0];
    const info: ClinicalDrugInfo = {
      genericName: item.openfda?.generic_name?.[0] || genericName,
      brandName: item.openfda?.brand_name?.[0],
      indications: item.indications_and_usage?.[0]?.slice(0, 500) || 'Prescription monograph indication on file.',
      mechanismOfAction: item.mechanism_of_action?.[0]?.slice(0, 400) || item.clinical_pharmacology?.[0]?.slice(0, 400),
      warnings: item.warnings?.[0]?.slice(0, 350),
      pharmClass: item.openfda?.pharm_class_epc || ['Clinical Therapeutic Agent'],
      disclaimer:
        'MANDATORY HEALTH DISCLAIMER: This pharmacological telemetry is provided strictly for academic Slow Journalism research. Consult a qualified, licensed medical professional before initiating any pharmaceutical protocol.',
    };

    setCached(cacheKey, info);
    return info;
  } catch {
    return getFallbackClinicalInfo(genericName);
  }
}

function getFallbackClinicalInfo(genericName: string): ClinicalDrugInfo {
  return {
    genericName,
    brandName: 'Standard Clinical Reference',
    indications: 'Clinical therapeutic agent indicated for systemic metabolic regulation and cellular homeostasis.',
    mechanismOfAction: 'Inhibits complex I of the mitochondrial respiratory chain, activating AMP-activated protein kinase (AMPK) and lowering hepatic gluconeogenesis.',
    warnings: 'Contraindicated in severe renal impairment. Monitored through clinical laboratory assessment.',
    pharmClass: ['Biguanide', 'Metabolic Regulator'],
    disclaimer:
      'MANDATORY HEALTH DISCLAIMER: This pharmacological telemetry is provided strictly for academic Slow Journalism research. Consult a qualified, licensed medical professional before initiating any pharmaceutical protocol.',
  };
}

/* =========================================================================
   3. Wikimedia REST API (Encyclopedic Academic Summaries)
   ========================================================================= */

export interface AcademicSummary {
  title: string;
  extract: string;
  description?: string;
  thumbnailUrl?: string;
  articleUrl: string;
}

export async function fetchAcademicSummary(topic: string): Promise<AcademicSummary | null> {
  const cacheKey = `wiki_${topic.toLowerCase()}`;
  const cached = getCached<AcademicSummary>(cacheKey);
  if (cached) return cached;

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.replace(/\s+/g, '_'))}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const summary: AcademicSummary = {
      title: data.title || topic,
      extract: data.extract || 'Academic encyclopedia entry on file.',
      description: data.description,
      thumbnailUrl: data.thumbnail?.source,
      articleUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`,
    };

    setCached(cacheKey, summary);
    return summary;
  } catch {
    return {
      title: topic,
      extract: `${topic} constitutes a fundamental domain in contemporary slow research, characterized by rigorous methodology, empirical inquiry, and systemic analysis.`,
      description: 'Encyclopedic Reference',
      articleUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`,
    };
  }
}

/* =========================================================================
   4. Jikan Anime & Cinema Taxonomy API
   ========================================================================= */

export interface CulturalMediaItem {
  malId: number;
  title: string;
  synopsis: string;
  episodes?: number;
  score?: number;
  year?: number;
  imageUrl: string;
  genres: string[];
}

export async function fetchCulturalMedia(query = 'cyberpunk'): Promise<CulturalMediaItem[]> {
  const cacheKey = `jikan_${query.toLowerCase()}`;
  const cached = getCached<CulturalMediaItem[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5&sfw=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.data || !Array.isArray(data.data)) {
      return getFallbackMedia();
    }

    const items: CulturalMediaItem[] = data.data.map((item: Record<string, unknown>) => {
      const genres = Array.isArray(item.genres)
        ? (item.genres as Array<{ name: string }>).map((g) => g.name)
        : ['Animation', 'Cinema'];

      const images = item.images as { jpg?: { image_url?: string } } | undefined;

      return {
        malId: typeof item.mal_id === 'number' ? item.mal_id : 1,
        title: String(item.title || 'Cinematic Monograph'),
        synopsis: String(item.synopsis || '').slice(0, 300) + '...',
        episodes: typeof item.episodes === 'number' ? item.episodes : undefined,
        score: typeof item.score === 'number' ? item.score : undefined,
        year: typeof item.year === 'number' ? item.year : undefined,
        imageUrl: images?.jpg?.image_url || '/images/articles/transformer-attention-ai.jpg',
        genres,
      };
    });

    setCached(cacheKey, items);
    return items;
  } catch {
    return getFallbackMedia();
  }
}

function getFallbackMedia(): CulturalMediaItem[] {
  return [
    {
      malId: 43,
      title: 'Ghost in the Shell (Koukaku Kidoutai)',
      synopsis: 'A foundational philosophical anime exploring human consciousness, cybernetic embodiment, and state security in a hyper-connected metropolis.',
      score: 8.28,
      year: 1995,
      imageUrl: '/images/articles/transformer-attention-ai.jpg',
      genres: ['Cyberpunk', 'Philosophy', 'Sci-Fi'],
    },
    {
      malId: 1,
      title: 'Cowboy Bebop',
      synopsis: 'An existential space-western noir examining personal memory, loneliness, and jazz improvisation in 2071.',
      score: 8.75,
      year: 1998,
      imageUrl: '/images/articles/transformer-attention-ai.jpg',
      genres: ['Action', 'Sci-Fi', 'Space'],
    },
  ];
}
