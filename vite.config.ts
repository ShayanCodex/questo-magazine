import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { getIncludedRoutes } from './scripts/lib/content.mjs';

const ARTICLE_ISSUE_MAP: Record<string, number> = {
  'the-geometry-of-silence': 1,
  'the-grid-as-an-instrument': 2,
  'the-poetics-of-concrete': 3,
  'building-static-multilingual-publishing': 4,
  'the-death-of-the-card-grid': 5,
  'pure-functional-simplicity': 6,
  'craft-over-convenience': 7,
};

function commentsDevApiPlugin(env: Record<string, string>): Plugin {
  const token = env.VITE_GITHUB_TOKEN || env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || '';
  const repo = env.VITE_GITHUB_REPO || 'ShayanCodex/questo-magazine';

  return {
    name: 'comments-dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/comments', async (req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end('');
          return;
        }

        const url = new URL(req.url || '', 'http://localhost:5173');
        const slug = url.searchParams.get('slug');

        // GET comments for slug
        if (req.method === 'GET') {
          if (!slug) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing slug' }));
            return;
          }

          const issueNumber = ARTICLE_ISSUE_MAP[slug];
          if (!issueNumber) {
            res.statusCode = 200;
            res.end(JSON.stringify({ comments: [] }));
            return;
          }

          try {
            const ghHeaders: Record<string, string> = {
              'User-Agent': 'Questo-Dev-Bot',
              Accept: 'application/vnd.github.v3+json',
            };
            if (token) {
              ghHeaders.Authorization = `Bearer ${token}`;
            }

            const ghRes = await fetch(
              `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments?per_page=100`,
              { headers: ghHeaders }
            );

            if (!ghRes.ok) {
              res.statusCode = 200;
              res.end(JSON.stringify({ comments: [] }));
              return;
            }

            const ghComments = await ghRes.json();
            const parsed = (ghComments as Record<string, unknown>[]).map((c) => {
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
                  // Ignore JSON parse error
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
                content,
                createdAt,
                likes: reactions?.['+1'] || 1,
                isGuest,
              };
            });

            res.statusCode = 200;
            res.end(JSON.stringify({ comments: parsed }));
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            res.statusCode = 500;
            res.end(JSON.stringify({ error: message, comments: [] }));
          }
          return;
        }

        // POST comment
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: Buffer | string) => {
            bodyStr += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const targetSlug = body.slug;
              const author = (body.author && String(body.author).trim()) || 'Guest Reader';
              const content = (body.content && String(body.content).trim()) || '';

              if (!targetSlug || !content) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid payload' }));
                return;
              }

              const issueNumber = ARTICLE_ISSUE_MAP[targetSlug] || 1;
              const createdAt = new Date().toISOString();
              const meta = JSON.stringify({ author, createdAt, isGuest: true, replyTo: body.replyTo });
              const markdownBody = `<!-- questo-comment: ${meta} -->\n**${author}** *(Guest Reader)*:\n\n${content}`;

              const ghRes = await fetch(
                `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'User-Agent': 'Questo-Dev-Bot',
                    Accept: 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ body: markdownBody }),
                }
              );

              const ghData = (await ghRes.json()) as Record<string, unknown>;
              res.statusCode = 201;
              res.end(
                JSON.stringify({
                  success: true,
                  comment: {
                    id: `gh_${ghData.id}`,
                    slug: targetSlug,
                    author,
                    content,
                    createdAt,
                    likes: 1,
                    isGuest: true,
                  },
                })
              );
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Unknown error';
              res.statusCode = 500;
              res.end(JSON.stringify({ error: message }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      tailwindcss(),
      react(),
      commentsDevApiPlugin(env),
    ],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/')
            ) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/@heroicons/') || id.includes('node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
          },
        },
      },
    },
    ssgOptions: {
      formatting: 'none',
      includedRoutes() {
        return getIncludedRoutes();
      },
    },
  };
});
