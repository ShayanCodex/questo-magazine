import { fileURLToPath } from 'node:url';

const BANNED_WORDS = [
  'delve',
  'tapestry',
  'testament',
  'realm',
  'unlock',
  'in conclusion',
  'moreover'
];

/**
 * Audit article payload against strict quality & SEO standards
 */
export function auditArticleQuality(payload) {
  const issues = [];
  const textContent = (payload.contentHtml || '').replace(/<[^>]*>/g, ' ');
  const words = textContent.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Word Count Check
  if (wordCount < 800) {
    issues.push(`Word count too low: ${wordCount} words (Target: 850+)`);
  }

  // 2. Banned Words Check
  const lowerText = textContent.toLowerCase();
  for (const banned of BANNED_WORDS) {
    if (new RegExp(`\\b${banned}\\b`, 'i').test(lowerText)) {
      issues.push(`Found banned AI buzzword: "${banned}"`);
    }
  }

  // 3. Structural Heading Audit
  const hasH2 = /<h2[\s>]/i.test(payload.contentHtml) || (payload.body || []).some(b => b.type === 'h2');
  if (!hasH2) {
    issues.push('Missing H2 structural headings');
  }

  // 4. Media Audit
  if (!payload.featuredImage?.url) {
    issues.push('Missing featured image URL');
  }
  if (!payload.featuredVideo?.embedUrl) {
    issues.push('Missing featured video embed URL');
  }

  // 5. Schema Validation
  if (!payload.title || payload.title.length > 70) {
    issues.push(`Title length sub-optimal: ${payload.title?.length || 0} chars (Target: <65)`);
  }
  if (!payload.metaDescription || payload.metaDescription.length > 165) {
    issues.push(`Meta description length sub-optimal: ${payload.metaDescription?.length || 0} chars (Target: <160)`);
  }

  return {
    passed: issues.length === 0,
    score: Math.max(0, 100 - issues.length * 15),
    wordCount,
    issues
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const sample = {
    title: 'Geopolitics of Minerals',
    metaDescription: 'Comprehensive analysis of critical minerals.',
    contentHtml: '<p>Paragraph 1</p><h2>Section 1</h2>' + 'word '.repeat(900),
    featuredImage: { url: 'https://example.com/img.jpg' },
    featuredVideo: { embedUrl: 'https://youtube-nocookie.com/embed/xyz' }
  };
  console.log('Sample audit:', auditArticleQuality(sample));
}
