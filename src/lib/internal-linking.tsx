import React from 'react';
import { Link } from 'react-router-dom';

export interface HubTopicRule {
  keywords: string[];
  targetPath: string;
  label: string;
}

export const TOPICAL_HUB_RULES: HubTopicRule[] = [
  {
    keywords: ['artificial intelligence', 'machine learning', 'neural networks', 'deep tech'],
    targetPath: '/articles?category=ai-technology',
    label: 'Artificial Intelligence & Deep Tech',
  },
  {
    keywords: ['spatial design', 'brutalist architecture', 'modernist architecture', 'architectural theory'],
    targetPath: '/articles?category=architecture-design',
    label: 'Architecture & Spatial Design',
  },
  {
    keywords: ['macroeconomics', 'financial markets', 'sovereign debt', 'monetary policy'],
    targetPath: '/articles?category=economics-markets',
    label: 'Economics, Markets & Finance',
  },
  {
    keywords: ['stoic philosophy', 'epistemology', 'classical thought', 'moral philosophy'],
    targetPath: '/articles?category=philosophy-ethics',
    label: 'Philosophy & Classical Thought',
  },
  {
    keywords: ['culinary science', 'gastronomy', 'fermentation kinetics'],
    targetPath: '/articles?category=gastronomy-wine',
    label: 'Gastronomy & Culinary Science',
  },
  {
    keywords: ['astrophysics', 'cosmology', 'gravitational waves', 'orbital mechanics'],
    targetPath: '/articles?category=astronomy-physics',
    label: 'Astronomy, Physics & Cosmos',
  },
  {
    keywords: ['cellular longevity', 'mitochondrial efficiency', 'biomechanical resilience'],
    targetPath: '/articles?category=fitness-longevity',
    label: 'Athletics, Longevity & Biology',
  },
  {
    keywords: ['geopolitical strategy', 'global supply chains', 'international relations'],
    targetPath: '/articles?category=geopolitics-strategy',
    label: 'Geopolitics & World Affairs',
  },
  {
    keywords: ['planetary ecology', 'biodiversity loss', 'ecological biomes'],
    targetPath: '/articles?category=nature-ecology',
    label: 'Nature & Planetary Ecology',
  },
  {
    keywords: ['automotive engineering', 'electric powertrains', 'vehicle telemetry'],
    targetPath: '/articles?category=automotive-engineering',
    label: 'Automotive & Future Mobility',
  },
  {
    keywords: ['public domain', 'classical manuscripts', 'heritage digital library', 'unabridged e-books'],
    targetPath: '/ebooks',
    label: 'Public Domain Heritage Library',
  },
  {
    keywords: ['editorial standards', 'fact-checking desk', 'two-tiered review'],
    targetPath: '/editorial-policy',
    label: 'Editorial Policy & Standards',
  },
];

/**
 * Contextually transforms a single paragraph text into an element tree containing
 * at most one authoritative contextual internal link per paragraph, and at most
 * maxTotalLinks throughout the entire article body.
 */
export function linkifyParagraph(
  text: string,
  linkedTopics: Set<string>,
  localePath: (path: string) => string,
  maxTotalLinks = 3
): React.ReactNode {
  if (!text || linkedTopics.size >= maxTotalLinks) {
    return text;
  }

  // Find the earliest matching keyword in the text
  let bestMatch: { rule: HubTopicRule; matchedKeyword: string; index: number } | null = null;

  for (const rule of TOPICAL_HUB_RULES) {
    if (linkedTopics.has(rule.targetPath)) continue;

    for (const keyword of rule.keywords) {
      // Word-boundary case-insensitive search
      const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i');
      const match = regex.exec(text);
      if (match) {
        if (!bestMatch || match.index < bestMatch.index) {
          bestMatch = { rule, matchedKeyword: match[0], index: match.index };
        }
      }
    }
  }

  if (!bestMatch) {
    return text;
  }

  // Register topic as linked
  linkedTopics.add(bestMatch.rule.targetPath);

  const before = text.slice(0, bestMatch.index);
  const matchedText = bestMatch.matchedKeyword;
  const after = text.slice(bestMatch.index + matchedText.length);

  return (
    <>
      {before}
      <Link
        to={localePath(bestMatch.rule.targetPath)}
        title={`Explore more on ${bestMatch.rule.label}`}
        className="font-medium text-editorial-text underline decoration-editorial-text/30 hover:decoration-editorial-text transition-all hover:text-accent"
      >
        {matchedText}
      </Link>
      {after}
    </>
  );
}
