interface CardMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  author: string;
  category?: string;
  image?: string;
}

interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const onRequestGet = async (context: {
  request: Request;
  env: Env;
  params: { slug: string };
  waitUntil?: (promise: Promise<unknown>) => void;
}) => {
  const { request, env, params, waitUntil } = context;
  const slug = params.slug;

  // 0. Serve from Cloudflare edge cache if already computed
  const cacheStorage = (caches as unknown as { default?: Cache }).default;
  if (cacheStorage) {
    const cached = await cacheStorage.match(request);
    if (cached) {
      return cached;
    }
  }

  // 1. If pre-rendered static HTML exists in dist/, serve it directly at 0ms edge latency
  const assetRes = await env.ASSETS.fetch(request);
  if (assetRes.ok && assetRes.headers.get('content-type')?.includes('text/html')) {
    const bodyText = await assetRes.clone().text();
    if (bodyText.includes(`"${slug}"`) || bodyText.includes(`/articles/${slug}`)) {
      return assetRes;
    }
  }

  // 2. Otherwise load the SPA shell + gzipped cards-index.en.json.gz and inject full SEO + BlogPosting JSON-LD
  const origin = new URL(request.url).origin;
  const [shellRes, indexRes] = await Promise.all([
    env.ASSETS.fetch(new Request(`${origin}/index.html`)),
    env.ASSETS.fetch(new Request(`${origin}/data/cards-index.en.json.gz`)),
  ]);

  if (!shellRes.ok) {
    return assetRes;
  }

  let html = await shellRes.text();
  if (indexRes.ok) {
    try {
      const bytes = new Uint8Array(await indexRes.arrayBuffer());
      const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
      const cards = isGzip
        ? ((await new Response(
            new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
          ).json()) as CardMeta[])
        : (JSON.parse(new TextDecoder().decode(bytes)) as CardMeta[]);
      const article = cards.find((c) => c.slug === slug);
      if (article) {
        const canonical = `${origin}/articles/${article.slug}`;
        const safeTitle = escapeHtml(`${article.title} — Questo`);
        const safeDesc = escapeHtml(article.excerpt);
        const safeImg = escapeHtml(article.image || `${origin}/og-default.jpg`);
        const jsonLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          dateModified: article.updated || article.date,
          author: { '@type': 'Person', name: article.author },
          image: article.image ? [article.image] : undefined,
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        });

        const metaInjection = `
          <title>${safeTitle}</title>
          <meta name="description" content="${safeDesc}" />
          <link rel="canonical" href="${canonical}" />
          <meta property="og:title" content="${safeTitle}" />
          <meta property="og:description" content="${safeDesc}" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content="${canonical}" />
          <meta property="og:image" content="${safeImg}" />
          <script type="application/ld+json">${jsonLd}</script>
        `;

        html = html.replace(/<title>.*?<\/title>/i, metaInjection);
      }
    } catch {
      // Fallback cleanly to SPA shell
    }
  }

  const response = new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=604800',
    },
  });

  if (cacheStorage && waitUntil) {
    waitUntil(cacheStorage.put(request, response.clone()));
  }

  return response;
};
