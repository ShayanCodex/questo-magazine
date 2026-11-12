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

const ARTICLE_ISSUE_MAP: Record<string, number> = {
  'the-geometry-of-silence': 1,
  'the-grid-as-an-instrument': 2,
  'the-poetics-of-concrete': 3,
  'building-static-multilingual-publishing': 4,
  'the-death-of-the-card-grid': 5,
  'pure-functional-simplicity': 6,
  'craft-over-convenience': 7,
};

const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'ShayanCodex/questo-magazine';
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

// 1. Get initial comments from local cache (0ms instant render)
export function getLocalArticleComments(slug: string): CommentItem[] {
  if (typeof window === 'undefined') return [];

  let userComments: CommentItem[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + slug);
    if (raw) {
      userComments = JSON.parse(raw);
    }
  } catch {
    userComments = [];
  }

  const likedIds = getLikedCommentIds();
  return userComments.map((c) => ({
    ...c,
    avatarColor: getAvatarColor(c.author),
    isUserOwned: true,
    likes: c.likes + (likedIds.has(c.id) ? 1 : 0),
  }));
}

// 2. Fetch global comments from Cloud (GitHub Issues / Netlify API) visible to worldwide readers
export async function fetchCloudComments(slug: string): Promise<CommentItem[]> {
  if (typeof window === 'undefined') return [];

  // Try local/Netlify serverless endpoint first
  try {
    const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.comments)) {
        return (data.comments as CommentItem[]).map((c) => ({
          ...c,
          avatarColor: getAvatarColor(c.author),
        }));
      }
    }
  } catch {
    // Netlify function or proxy not responding, fallback to direct GitHub public API
  }

  // Direct public GitHub API fallback (Zero authentication needed, public GitHub CDN)
  const issueNumber = ARTICLE_ISSUE_MAP[slug];
  if (!issueNumber) return [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/issues/${issueNumber}/comments?per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    if (!res.ok) return [];

    const ghComments = await res.json();
    if (!Array.isArray(ghComments)) return [];

    return ghComments.map((c: Record<string, unknown>) => {
      const bodyStr = String(c.body || '');
      const metaMatch = bodyStr.match(/<!--\s*questo-comment:\s*({.*?})\s*-->/s);
      const userObj = c.user as Record<string, unknown> | undefined;
      let author = (userObj?.login as string) || 'Community Reader';
      let createdAt = (c.created_at as string) || new Date().toISOString();
      let isGuest = true;
      let content = bodyStr;

      if (metaMatch) {
        try {
          const meta = JSON.parse(metaMatch[1]);
          if (meta.author) author = meta.author;
          if (meta.createdAt) createdAt = meta.createdAt;
          if (meta.isGuest !== undefined) isGuest = meta.isGuest;
        } catch {
          // Ignore JSON parse failure
        }
        content = bodyStr
          .replace(/<!--\s*questo-comment:\s*{.*?}\s*-->/s, '')
          .replace(/^\s*\*\*.*?\*\*.*?:?\s*\n\n?/s, '')
          .trim();
      }

      const reactions = c.reactions as Record<string, number> | undefined;
      return {
        id: `gh_${c.id}`,
        slug,
        author,
        avatarColor: getAvatarColor(author),
        content,
        createdAt,
        likes: reactions?.['+1'] || 1,
        isGuest,
      };
    });
  } catch {
    return [];
  }
}

// 3. Post a comment to the global cloud database (Zero login required for visitor)
export async function postCloudComment(
  slug: string,
  comment: { author: string; content: string; replyTo?: string }
): Promise<CommentItem | null> {
  if (typeof window === 'undefined') return null;

  try {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
        author: comment.author,
        content: comment.content,
        replyTo: comment.replyTo,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.comment) {
        return {
          ...data.comment,
          avatarColor: getAvatarColor(data.comment.author),
        };
      }
    }
  } catch {
    // If offline or network glitch, graceful fallback
  }

  return null;
}

// Save local optimistic copy
export function saveLocalComment(
  slug: string,
  data: { author?: string; content: string; replyTo?: string }
): CommentItem {
  const authorName = (data.author && data.author.trim()) || 'Guest Reader';
  const newComment: CommentItem = {
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    slug,
    author: authorName,
    avatarColor: getAvatarColor(authorName),
    content: data.content.trim(),
    createdAt: new Date().toISOString(),
    likes: 1,
    isGuest: !data.author || data.author.trim().toLowerCase().includes('guest'),
    replyTo: data.replyTo,
    isUserOwned: true,
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PREFIX + slug);
      const list: CommentItem[] = raw ? JSON.parse(raw) : [];
      list.unshift(newComment);
      localStorage.setItem(STORAGE_KEY_PREFIX + slug, JSON.stringify(list));
      saveCommenterName(authorName);
    } catch {
      // Storage quota fallback
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
