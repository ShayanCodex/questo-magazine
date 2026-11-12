/* global process, fetch */
// Netlify Serverless Function for 100% Login-Free Global Comments
// Stores & retrieves reader comments from GitHub Issues on ShayanCodex/questo-magazine

const GITHUB_REPO = process.env.VITE_GITHUB_REPO || 'ShayanCodex/questo-magazine';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;

const ARTICLE_ISSUE_MAP = {
  'the-geometry-of-silence': 1,
  'the-grid-as-an-instrument': 2,
  'the-poetics-of-concrete': 3,
  'building-static-multilingual-publishing': 4,
  'the-death-of-the-card-grid': 5,
  'pure-functional-simplicity': 6,
  'craft-over-convenience': 7,
};

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { slug } = event.queryStringParameters || {};

  // GET: Fetch all comments for an article
  if (event.httpMethod === 'GET') {
    if (!slug) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing slug parameter' }) };
    }

    const issueNumber = ARTICLE_ISSUE_MAP[slug];
    if (!issueNumber) {
      return { statusCode: 200, headers, body: JSON.stringify({ comments: [] }) };
    }

    try {
      const ghHeaders = {
        'User-Agent': 'Questo-Comments-Bot',
        Accept: 'application/vnd.github.v3+json',
      };
      if (GITHUB_TOKEN) {
        ghHeaders.Authorization = `Bearer ${GITHUB_TOKEN}`;
      }

      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/issues/${issueNumber}/comments?per_page=100`,
        { headers: ghHeaders }
      );

      if (!res.ok) {
        return { statusCode: 200, headers, body: JSON.stringify({ comments: [] }) };
      }

      const ghComments = await res.json();
      const parsed = ghComments.map((c) => {
        const metaMatch = c.body.match(/<!--\s*questo-comment:\s*({.*?})\s*-->/s);
        let author = c.user?.login || 'Community Reader';
        let createdAt = c.created_at;
        let isGuest = true;
        let content = c.body;

        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            if (meta.author) author = meta.author;
            if (meta.createdAt) createdAt = meta.createdAt;
            if (meta.isGuest !== undefined) isGuest = meta.isGuest;
          } catch {
            // Ignore metadata parse error
          }
          content = c.body.replace(/<!--\s*questo-comment:\s*{.*?}\s*-->/s, '').replace(/^\s*\*\*.*?\*\*.*?:?\s*\n\n?/s, '').trim();
        }

        return {
          id: `gh_${c.id}`,
          slug,
          author,
          content,
          createdAt,
          likes: c.reactions?.['+1'] || 1,
          isGuest,
        };
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ comments: parsed }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message, comments: [] }),
      };
    }
  }

  // POST: Add a new comment (Zero login needed from visitor)
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const targetSlug = body.slug;
      const author = (body.author && body.author.trim()) || 'Guest Reader';
      const content = (body.content && body.content.trim()) || '';

      if (!targetSlug || !content || content.length < 2) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid comment payload' }) };
      }

      const issueNumber = ARTICLE_ISSUE_MAP[targetSlug] || 1;
      const createdAt = new Date().toISOString();
      const meta = JSON.stringify({ author, createdAt, isGuest: true, replyTo: body.replyTo });
      const markdownBody = `<!-- questo-comment: ${meta} -->\n**${author}** *(Guest Reader)*:\n\n${content}`;

      if (!GITHUB_TOKEN) {
        // Fallback response if token not yet provided in Netlify dashboard
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            storedLocally: true,
            comment: {
              id: `local_${Date.now()}`,
              slug: targetSlug,
              author,
              content,
              createdAt,
              likes: 1,
              isGuest: true,
            },
          }),
        };
      }

      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/issues/${issueNumber}/comments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            'User-Agent': 'Questo-Comments-Bot',
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: markdownBody }),
        }
      );

      const ghData = await res.json();
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
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
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
}
