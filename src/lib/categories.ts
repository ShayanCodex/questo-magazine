export interface Subcategory {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'art-and-culture',
    name: 'Art & Culture',
    description: 'Classical aesthetics, monumental sculpture, and visual expressions.',
    subcategories: [
      { id: 'visual-arts', name: 'Visual Arts', description: 'Visual rhythm, compositions, and masterworks.' },
      { id: 'sculpture', name: 'Sculpture', description: 'Carved stone, physical endurance, and classical form.' },
      { id: 'street-art', name: 'Street Art', description: 'Urban murals, raw public expressions, and public art.' },
    ],
  },
  {
    id: 'architecture-and-space',
    name: 'Architecture & Space',
    description: 'Monolithic structures, raw concrete, and contemplative void space.',
    subcategories: [
      { id: 'minimalist-design', name: 'Minimalist Design', description: 'Unadorned stone, silent geometries, and void.' },
      { id: 'monuments-and-stone', name: 'Monuments & Stone', description: 'Enduring architectural forms and raw masonry.' },
      { id: 'spatial-theory', name: 'Spatial Theory', description: 'Sanctuaries of contemplation and structural pauses.' },
    ],
  },
  {
    id: 'design-and-typography',
    name: 'Design & Typography',
    description: 'Swiss grid theory, mathematical rigor, and monumental editorial type.',
    subcategories: [
      { id: 'editorial-systems', name: 'Editorial Systems', description: 'Mid-century editorial design and page layouts.' },
      { id: 'grid-theory', name: 'Grid Theory', description: 'Mathematical discipline, margins, and typographic rules.' },
      { id: 'typography', name: 'Typography', description: 'Display letterforms, legibility, and font pairing.' },
    ],
  },
  {
    id: 'engineering-and-technology',
    name: 'Engineering & Technology',
    description: 'Lean systems architecture, static publishing, and pure functional code.',
    subcategories: [
      { id: 'system-architecture', name: 'System Architecture', description: 'Rejecting bloated runtime layers and unnecessary abstractions.' },
      { id: 'static-performance', name: 'Static Performance', description: 'High-speed SSG pipelines and zero runtime client fetching.' },
      { id: 'functional-craft', name: 'Functional Craft', description: 'Disciplined code design and robust static delivery.' },
    ],
  },
];

/**
 * Reliable fallback mapping for baseline articles by slug
 */
const ARTICLE_SLUG_CATEGORY_MAP: Record<string, { categoryId: string; subcategoryId: string }> = {
  'the-death-of-the-card-grid': { categoryId: 'art-and-culture', subcategoryId: 'street-art' },
  'craft-over-convenience': { categoryId: 'art-and-culture', subcategoryId: 'sculpture' },
  'the-geometry-of-silence': { categoryId: 'architecture-and-space', subcategoryId: 'minimalist-design' },
  'the-grid-as-an-instrument': { categoryId: 'design-and-typography', subcategoryId: 'editorial-systems' },
  'pure-functional-simplicity': { categoryId: 'engineering-and-technology', subcategoryId: 'system-architecture' },
  'building-static-multilingual-publishing': { categoryId: 'engineering-and-technology', subcategoryId: 'static-performance' },
};

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): Subcategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find((sub) => sub.id === subcategoryId);
}

export function getArticleCategory(article: { slug?: string; category?: string; subcategory?: string }): {
  category: Category;
  subcategory?: Subcategory;
} {
  const fallback = article.slug ? ARTICLE_SLUG_CATEGORY_MAP[article.slug] : undefined;
  const categoryId = article.category || fallback?.categoryId || 'art-and-culture';
  const subcategoryId = article.subcategory || fallback?.subcategoryId;

  const category = getCategoryById(categoryId) || CATEGORIES[0];
  const subcategory = subcategoryId ? getSubcategoryById(category.id, subcategoryId) : undefined;

  return { category, subcategory };
}

export interface SearchSuggestion {
  type: 'category' | 'subcategory' | 'topic' | 'query';
  label: string;
  value: string;
  categoryId?: string;
  subcategoryId?: string;
  count?: number;
}

/**
 * Generates smart suggestions for search inputs based on current query and articles
 */
export interface StructuredSearchSuggestions {
  categories: SearchSuggestion[];
  subcategories: SearchSuggestion[];
  topics: SearchSuggestion[];
  queries: SearchSuggestion[];
  total: number;
}

export function getStructuredSearchSuggestions(
  rawQuery: string,
  articles: Array<{ title: string; tags: string[]; slug: string; category?: string; subcategory?: string }> = []
): StructuredSearchSuggestions {
  const q = rawQuery.trim().toLowerCase();
  const categories: SearchSuggestion[] = [];
  const subcategories: SearchSuggestion[] = [];
  const topics: SearchSuggestion[] = [];
  const queries: SearchSuggestion[] = [];

  // When query is empty, surface all categories, top subcategories, and popular tags
  if (!q) {
    CATEGORIES.forEach((cat) => {
      categories.push({
        type: 'category',
        label: cat.name,
        value: cat.name,
        categoryId: cat.id,
      });
      cat.subcategories.slice(0, 2).forEach((sub) => {
        subcategories.push({
          type: 'subcategory',
          label: sub.name,
          value: sub.name,
          categoryId: cat.id,
          subcategoryId: sub.id,
        });
      });
    });

    const popularTags = ['architecture', 'art', 'craft', 'design-systems', 'engineering', 'sculpture', 'minimalism'];
    popularTags.forEach((tg) => {
      topics.push({
        type: 'topic',
        label: `#${tg}`,
        value: tg,
      });
    });

    return {
      categories,
      subcategories,
      topics,
      queries,
      total: categories.length + subcategories.length + topics.length,
    };
  }

  // Filter Categories
  for (const cat of CATEGORIES) {
    if (cat.name.toLowerCase().includes(q) || cat.id.includes(q)) {
      categories.push({
        type: 'category',
        label: cat.name,
        value: cat.name,
        categoryId: cat.id,
      });
    }

    // Filter Subcategories
    for (const sub of cat.subcategories) {
      if (sub.name.toLowerCase().includes(q) || sub.id.includes(q)) {
        subcategories.push({
          type: 'subcategory',
          label: `${cat.name} › ${sub.name}`,
          value: sub.name,
          categoryId: cat.id,
          subcategoryId: sub.id,
        });
      }
    }
  }

  // Filter Tags / Topics across articles
  const tagCounts = new Map<string, number>();
  articles.forEach((art) => {
    (art.tags || []).forEach((t) => {
      const lower = t.toLowerCase();
      tagCounts.set(lower, (tagCounts.get(lower) || 0) + 1);
    });
  });

  for (const [tag, count] of tagCounts.entries()) {
    if (tag.includes(q)) {
      topics.push({
        type: 'topic',
        label: `#${tag}`,
        value: tag,
        count,
      });
    }
  }

  // Matching Article Titles
  for (const art of articles) {
    if (art.title.toLowerCase().includes(q)) {
      queries.push({
        type: 'query',
        label: art.title,
        value: art.title,
      });
    }
  }

  return {
    categories: categories.slice(0, 6),
    subcategories: subcategories.slice(0, 6),
    topics: topics.slice(0, 8),
    queries: queries.slice(0, 5),
    total: categories.length + subcategories.length + topics.length + queries.length,
  };
}

export function getSearchSuggestions(
  rawQuery: string,
  articles: Array<{ title: string; tags: string[]; slug: string; category?: string; subcategory?: string }> = []
): SearchSuggestion[] {
  const structured = getStructuredSearchSuggestions(rawQuery, articles);
  return [
    ...structured.categories,
    ...structured.subcategories,
    ...structured.topics,
    ...structured.queries,
  ];
}

