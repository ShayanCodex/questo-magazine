export interface CommentItem {
  id: string;
  slug: string;
  author: string;
  avatarColor: string;
  content: string;
  createdAt: string; // ISO date string
  likes: number;
  isGuest?: boolean;
  replyTo?: string;
  isUserOwned?: boolean;
}

const AVATAR_PALETTE = [
  'bg-emerald-600 text-white',
  'bg-sky-600 text-white',
  'bg-violet-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-indigo-600 text-white',
  'bg-teal-600 text-white',
  'bg-neutral-800 text-neutral-100',
];

export function getAvatarColor(name: string): string {
  if (!name) return AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

// Curated authentic editorial starter comments for each monograph
const SEED_COMMENTS: Record<string, Omit<CommentItem, 'slug'>[]> = {
  'the-geometry-of-silence': [
    {
      id: 'seed-geo-1',
      author: 'Elena Vance',
      avatarColor: 'bg-emerald-600 text-white',
      content:
        'The juxtaposition between void and mass is reminiscent of Tadao Ando’s Church of Light. The restraint in material selection allows natural light to become the primary architectural finish.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
      likes: 9,
      isGuest: false,
    },
    {
      id: 'seed-geo-2',
      author: 'Julian Thorne',
      avatarColor: 'bg-sky-600 text-white',
      content:
        'The monochrome photography of the brutalist facade captures the texture of raw poured concrete exceptionally well. In an era of sensory overload, silence in space is indeed luxury.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14 hours ago
      likes: 5,
      isGuest: true,
    },
  ],
  'the-grid-as-an-instrument': [
    {
      id: 'seed-grid-1',
      author: 'Lukas Weber',
      avatarColor: 'bg-violet-600 text-white',
      content:
        'Josef Müller-Brockmann’s 12-column grid still remains the single most resilient system for responsive typographic hierarchy. Brilliant synthesis on modular layout staves.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      likes: 12,
      isGuest: false,
    },
    {
      id: 'seed-grid-2',
      author: 'Sarah Chen',
      avatarColor: 'bg-amber-600 text-white',
      content:
        'Particularly enjoyed the critique of arbitrary breakpoints. The mathematical proportional ratio approach feels much more natural across dynamic viewport widths.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      likes: 7,
      isGuest: true,
    },
  ],
  'the-poetics-of-concrete': [
    {
      id: 'seed-concrete-1',
      author: 'Marcus Holloway',
      avatarColor: 'bg-rose-600 text-white',
      content:
        'Tactile permanence vs digital ephemerality. This contrast defines our generation’s design dilemma. There is something profoundly grounding about brutalist endurance.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      likes: 8,
      isGuest: false,
    },
  ],
  'building-static-multilingual-publishing': [
    {
      id: 'seed-ssg-1',
      author: 'Alexandre Dumas',
      avatarColor: 'bg-indigo-600 text-white',
      content:
        'Zero runtime overhead and pure static pre-rendering with Edge CDN is the gold standard for global digital publications. Sub-50ms TTFB worldwide is unmatched.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      likes: 11,
      isGuest: false,
    },
  ],
  'the-death-of-the-card-grid': [
    {
      id: 'seed-card-1',
      author: 'Klara Lindqvist',
      avatarColor: 'bg-teal-600 text-white',
      content:
        'Thank you for addressing the homogenisation of card layouts! Editorial pacing requires asymmetry, typographic hierarchy, and varied reading rhythms.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      likes: 15,
      isGuest: false,
    },
  ],
  'pure-functional-simplicity': [
    {
      id: 'seed-func-1',
      author: 'Mateo Rossi',
      avatarColor: 'bg-neutral-800 text-neutral-100',
      content:
        '“Simplicity is prerequisite for reliability.” Dijkstra’s words remain as urgent today as they were forty years ago. Every abstraction added to a project is future liability.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      likes: 10,
      isGuest: false,
    },
  ],
  'craft-over-convenience': [
    {
      id: 'seed-craft-1',
      author: 'Hassan Raza',
      avatarColor: 'bg-emerald-600 text-white',
      content:
        'Hand-crafted typography and thoughtful editorial curation will always outlive algorithmic clickbait feeds. Quality over quantity every single time.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      likes: 13,
      isGuest: false,
    },
  ],
};

const STORAGE_KEY_PREFIX = 'questo_article_comments_v1_';
const LIKES_STORAGE_KEY = 'questo_user_liked_comments_v1';
const USER_NAME_KEY = 'questo_commenter_name_v1';

export function getSavedCommenterName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(USER_NAME_KEY) || '';
}

export function saveCommenterName(name: string): void {
  if (typeof window === 'undefined') return;
  if (name.trim()) {
    localStorage.setItem(USER_NAME_KEY, name.trim());
  }
}

export function getArticleComments(slug: string): CommentItem[] {
  if (typeof window === 'undefined') {
    const seeds = SEED_COMMENTS[slug] || [];
    return seeds.map((s) => ({ ...s, slug }));
  }

  // Load user-submitted comments stored in localStorage
  let userComments: CommentItem[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + slug);
    if (raw) {
      userComments = JSON.parse(raw);
    }
  } catch {
    userComments = [];
  }

  // Load seeds for this slug
  const seeds: CommentItem[] = (SEED_COMMENTS[slug] || []).map((s) => ({
    ...s,
    slug,
  }));

  // Combine user comments (newest first) + seeds
  const combined = [...userComments, ...seeds];

  // Attach liked state for this device
  const likedIds = getLikedCommentIds();
  return combined.map((c) => ({
    ...c,
    isUserOwned: userComments.some((uc) => uc.id === c.id),
    likes: c.likes + (likedIds.has(c.id) && !c.isUserOwned ? 1 : 0),
  }));
}

export function addArticleComment(
  slug: string,
  data: { author?: string; content: string; replyTo?: string }
): CommentItem {
  const authorName = (data.author && data.author.trim()) || 'Guest Reader';
  const newComment: CommentItem = {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    slug,
    author: authorName,
    avatarColor: getAvatarColor(authorName),
    content: data.content.trim(),
    createdAt: new Date().toISOString(),
    likes: 1, // Author starts with 1 initial appreciation
    isGuest: !data.author || data.author.trim().toLowerCase().includes('guest'),
    replyTo: data.replyTo,
    isUserOwned: true,
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PREFIX + slug);
      const list: CommentItem[] = raw ? JSON.parse(raw) : [];
      list.unshift(newComment); // Prepend so new comment appears at top
      localStorage.setItem(STORAGE_KEY_PREFIX + slug, JSON.stringify(list));
      saveCommenterName(authorName);
    } catch {
      // Storage quota or disabled fallback
    }
  }

  return newComment;
}

export function deleteArticleComment(slug: string, commentId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + slug);
    if (!raw) return false;
    const list: CommentItem[] = JSON.parse(raw);
    const updated = list.filter((c) => c.id !== commentId);
    localStorage.setItem(STORAGE_KEY_PREFIX + slug, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export function getLikedCommentIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(LIKES_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function toggleCommentLike(commentId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const liked = getLikedCommentIds();
    let hasLikedNow = false;
    if (liked.has(commentId)) {
      liked.delete(commentId);
      hasLikedNow = false;
    } else {
      liked.add(commentId);
      hasLikedNow = true;
    }
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(liked)));
    return hasLikedNow;
  } catch {
    return false;
  }
}

// Format relative date nicely: "Just now", "5 minutes ago", "2 hours ago", "Yesterday", "Nov 12, 2026"
export function formatCommentTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 45) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}
