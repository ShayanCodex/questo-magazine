import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  HeartIcon as HeartIconOutline,
  ArrowUturnLeftIcon,
  TrashIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  UserCircleIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  GlobeAmericasIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import {
  type CommentItem,
  getLocalArticleComments,
  fetchCloudComments,
  postCloudComment,
  saveLocalComment,
  deleteArticleComment,
  toggleCommentLike,
  getLikedCommentIds,
  getSavedCommenterName,
  formatCommentTime,
} from '../lib/comments';
import { cn } from '../lib/utils';

export interface ArticleCommentsProps {
  slug: string;
  title: string;
}

export function ArticleComments({ slug, title }: ArticleCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<CommentItem | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCloud, setIsLoadingCloud] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const repo = import.meta.env.VITE_GITHUB_REPO as string | undefined;

  // Merge cloud comments with local optimistic comments
  const loadAllComments = useCallback(async () => {
    // 1. Initial 0ms render from local cache
    const local = getLocalArticleComments(slug);
    setComments(local);
    setIsLoadingCloud(true);

    try {
      // 2. Fetch worldwide cloud comments from GitHub / Netlify API
      const cloud = await fetchCloudComments(slug);

      // Merge & deduplicate
      const seen = new Set<string>();
      const merged: CommentItem[] = [];

      // Local optimistic comments first
      for (const c of local) {
        const key = `${c.author.toLowerCase()}_${c.content.trim().slice(0, 40)}`;
        seen.add(key);
        merged.push(c);
      }

      // Add cloud comments not already present locally
      for (const c of cloud) {
        const key = `${c.author.toLowerCase()}_${c.content.trim().slice(0, 40)}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(c);
        }
      }

      setComments(merged);
    } catch {
      // Offline fallback: local comments remain visible
    } finally {
      setIsLoadingCloud(false);
    }
  }, [slug]);

  useEffect(() => {
    setAuthor(getSavedCommenterName());
    setLikedIds(getLikedCommentIds());
    setReplyTo(null);
    setContent('');
    loadAllComments();
  }, [slug, loadAllComments]);

  // Handle comment submission (100% login-free, saves to global cloud backend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanContent = content.trim();
    if (!cleanContent || cleanContent.length < 2) return;

    setIsSubmitting(true);

    try {
      // 1. Save optimistic local copy for 0ms instant display
      const localComment = saveLocalComment(slug, {
        author: author.trim() || undefined,
        content: cleanContent,
        replyTo: replyTo?.author,
      });

      setComments((prev) => [localComment, ...prev]);
      setContent('');
      setReplyTo(null);
      setJustSubmitted(true);
      setTimeout(() => setJustSubmitted(false), 3500);

      // 2. Send to global cloud backend (GitHub Issues on ShayanCodex/questo-magazine)
      // So readers across the entire world see this comment!
      postCloudComment(slug, {
        author: localComment.author,
        content: cleanContent,
        replyTo: localComment.replyTo,
      }).then(() => {
        // Refresh cloud comments silently in background
        loadAllComments();
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Like on a comment
  const handleLike = (commentId: string) => {
    const hasLikedNow = toggleCommentLike(commentId);
    setLikedIds(getLikedCommentIds());

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: Math.max(0, c.likes + (hasLikedNow ? 1 : -1)),
          };
        }
        return c;
      })
    );
  };

  // Delete own comment
  const handleDelete = (commentId: string) => {
    if (window.confirm('Delete this comment?')) {
      const ok = deleteArticleComment(slug, commentId);
      if (ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    }
  };

  // Click Reply button
  const handleReplyClick = (target: CommentItem) => {
    setReplyTo(target);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Sorted list of comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section
      aria-label="Discussion and Comments"
      className="mt-12 sm:mt-16 pt-10 border-t border-editorial-border space-y-8 font-sans"
    >
      {/* 1. Community Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-editorial-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-editorial-text" />
            <h3 className="font-display font-bold text-xl sm:text-2xl text-editorial-text tracking-tight uppercase">
              Community Discourse
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-editorial-text text-editorial-bg shadow-2xs">
              {comments.length}
            </span>
          </div>
          <p className="text-xs text-editorial-muted">
            Open editorial discussion for &ldquo;{title}&rdquo; &bull;{' '}
            <strong className="text-editorial-text font-semibold">No login required</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-editorial-surface-subtle border border-editorial-border text-editorial-muted shadow-2xs">
            <GlobeAmericasIcon className="h-3.5 w-3.5 text-sky-500" />
            <span>Worldwide Cloud Sync</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-editorial-surface-subtle border border-editorial-border text-editorial-muted shadow-2xs">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
            <span>Instant Guest Posting</span>
          </span>

          {repo && (
            <a
              href={`https://github.com/${repo}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-editorial-muted hover:text-editorial-text transition-colors group px-2 py-1"
              title="Open GitHub Cloud Discussion Hub"
            >
              <span>GitHub Cloud</span>
              <ArrowTopRightOnSquareIcon className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>

      {/* 2. Login-Free Editorial Comment Submission Box */}
      <div className="p-4 sm:p-6 rounded-2xl border border-editorial-border bg-editorial-surface shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-editorial-border/50 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-editorial-text uppercase tracking-wider">
            <SparklesIcon className="h-4 w-4 text-accent" />
            <span>Join the Discussion</span>
          </div>

          <span className="text-[11px] text-editorial-muted">
            Visible to readers worldwide &bull; Instant publication
          </span>
        </div>

        {/* Replying Banner */}
        {replyTo && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border text-xs">
            <div className="flex items-center gap-1.5 text-editorial-text truncate">
              <ArrowUturnLeftIcon className="h-3.5 w-3.5 text-editorial-muted shrink-0" />
              <span>
                Replying to <strong className="font-semibold">@{replyTo.author}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="p-1 text-editorial-muted hover:text-editorial-text cursor-pointer"
              title="Cancel reply"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name Field (Optional / Defaults to Guest Reader) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-editorial-muted">
                <UserCircleIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                maxLength={40}
                placeholder="Your Name (or leave blank to post as Guest)"
                className="w-full ps-9 pe-3 py-2 text-xs rounded-lg border border-editorial-border bg-editorial-surface-subtle text-editorial-text placeholder:text-editorial-muted/70 focus:outline-none focus:ring-2 focus:ring-editorial-text/20 focus:border-editorial-text transition-all"
              />
            </div>
            <span className="hidden sm:inline text-[11px] text-editorial-muted">
              (Publicly visible on your comment)
            </span>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              maxLength={1000}
              placeholder={
                replyTo
                  ? `Write your response to @${replyTo.author}...`
                  : 'Share your thoughts, architectural perspectives, or questions on this monograph...'
              }
              className="w-full p-3 sm:p-3.5 text-xs sm:text-[13px] rounded-xl border border-editorial-border bg-editorial-surface-subtle text-editorial-text placeholder:text-editorial-muted/70 focus:outline-none focus:ring-2 focus:ring-editorial-text/20 focus:border-editorial-text transition-all resize-y leading-relaxed"
            />

            <div className="flex items-center justify-between text-[11px] text-editorial-muted px-1">
              <span>Public discussion &bull; Synced globally to Questo Cloud</span>
              <span>{content.length} / 1000</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <div>
              {justSubmitted && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Comment posted &amp; synced worldwide!</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || content.trim().length < 2}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs',
                content.trim().length >= 2
                  ? 'bg-editorial-text text-editorial-bg hover:opacity-90 active:scale-98'
                  : 'bg-editorial-surface-subtle text-editorial-muted border border-editorial-border cursor-not-allowed opacity-60'
              )}
            >
              <PaperAirplaneIcon className="h-3.5 w-3.5 rtl:rotate-180" />
              <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Filter & Sort Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-editorial-muted">
            Showing {sortedComments.length} {sortedComments.length === 1 ? 'comment' : 'comments'}
          </span>
          {isLoadingCloud && (
            <span className="text-[10px] text-editorial-muted/60 animate-pulse">
              (syncing...)
            </span>
          )}
        </div>

        <div className="inline-flex rounded-full border border-editorial-border bg-editorial-surface-subtle p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setSortBy('newest')}
            className={cn(
              'px-3 py-1 rounded-full font-medium transition-all cursor-pointer',
              sortBy === 'newest'
                ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                : 'text-editorial-muted hover:text-editorial-text'
            )}
          >
            Newest
          </button>
          <button
            type="button"
            onClick={() => setSortBy('popular')}
            className={cn(
              'px-3 py-1 rounded-full font-medium transition-all cursor-pointer',
              sortBy === 'popular'
                ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                : 'text-editorial-muted hover:text-editorial-text'
            )}
          >
            Most Appreciated
          </button>
        </div>
      </div>

      {/* 4. Comments Stream List */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="py-12 px-4 rounded-xl border border-dashed border-editorial-border text-center space-y-2">
            <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto text-editorial-muted/50" />
            <p className="text-sm font-semibold text-editorial-text">
              No comments yet on this monograph.
            </p>
            <p className="text-xs text-editorial-muted max-w-sm mx-auto">
              Be the first to start the conversation! No login or account required.
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => {
            const hasLiked = likedIds.has(comment.id);
            const initialLetter = (comment.author || 'G').charAt(0).toUpperCase();

            return (
              <article
                key={comment.id}
                className={cn(
                  'p-4 sm:p-5 rounded-2xl border transition-all space-y-3',
                  comment.isUserOwned
                    ? 'border-editorial-text/40 bg-editorial-surface-subtle/80 shadow-xs'
                    : 'border-editorial-border bg-editorial-surface hover:border-editorial-border/90'
                )}
              >
                {/* Header: Avatar, Name, Badge, Date */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs select-none',
                        comment.avatarColor
                      )}
                    >
                      {initialLetter}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs sm:text-[13px] text-editorial-text truncate">
                          {comment.author}
                        </span>

                        {comment.isUserOwned ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-editorial-text text-editorial-bg shadow-2xs">
                            You
                          </span>
                        ) : comment.isGuest ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-editorial-surface-subtle border border-editorial-border text-editorial-muted">
                            Guest
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent">
                            Community
                          </span>
                        )}
                      </div>

                      <time
                        dateTime={comment.createdAt}
                        className="text-[11px] text-editorial-muted block"
                      >
                        {formatCommentTime(comment.createdAt)}
                      </time>
                    </div>
                  </div>

                  {/* Actions: Delete if user owned */}
                  {comment.isUserOwned && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="p-1.5 rounded-full text-editorial-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete your comment"
                      aria-label="Delete comment"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Reply Indicator if this was a reply */}
                {comment.replyTo && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-editorial-surface-subtle text-editorial-muted">
                    <ArrowUturnLeftIcon className="h-3 w-3" />
                    <span>In reply to @{comment.replyTo}</span>
                  </div>
                )}

                {/* Comment Content */}
                <p className="text-xs sm:text-sm text-editorial-text leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>

                {/* Footer: Like & Reply */}
                <div className="pt-2 border-t border-editorial-border/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {/* Like / Appreciate Button */}
                    <button
                      type="button"
                      onClick={() => handleLike(comment.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer',
                        hasLiked
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold'
                          : 'text-editorial-muted hover:text-editorial-text hover:bg-editorial-surface-subtle'
                      )}
                      title={hasLiked ? 'Unlike' : 'Appreciate this comment'}
                    >
                      {hasLiked ? (
                        <HeartIconSolid className="h-3.5 w-3.5 text-rose-500" />
                      ) : (
                        <HeartIconOutline className="h-3.5 w-3.5" />
                      )}
                      <span>{comment.likes}</span>
                    </button>

                    {/* Reply Button */}
                    <button
                      type="button"
                      onClick={() => handleReplyClick(comment)}
                      className="inline-flex items-center gap-1 text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer px-2 py-1 rounded-full hover:bg-editorial-surface-subtle"
                    >
                      <ArrowUturnLeftIcon className="h-3.5 w-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
