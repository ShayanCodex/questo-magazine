import { Head } from 'vite-react-ssg';
import { useLanguage } from '../lib/lang-context';
import { siteConfig, getCanonicalUrl } from '../lib/site';
import { authorNameToSlug } from '../data/authors';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BookMetadata {
  author: string;
  year?: string;
  numberOfPages?: number;
  pdfUrl?: string;
  category?: string;
  subdiscipline?: string;
}

export interface SeoProps {
  title: string;
  description: string;
  pathname: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article' | 'book' | 'collection';
  articleDate?: string;
  articleUpdated?: string;
  articleAuthor?: string;
  availableLanguages?: string[];
  noIndex?: boolean;
  breadcrumbsJsonLd?: string;
  customJsonLd?: string;
  keywords?: string[] | string;
  breadcrumbs?: BreadcrumbItem[];
  faqItems?: FaqItem[];
  bookMeta?: BookMetadata;
}

export function Seo({
  title,
  description,
  pathname,
  canonicalPath,
  image,
  type = 'website',
  articleDate,
  articleUpdated,
  articleAuthor,
  availableLanguages,
  noIndex = false,
  breadcrumbsJsonLd,
  customJsonLd,
  keywords,
  breadcrumbs,
  faqItems,
  bookMeta,
}: SeoProps) {
  const { language } = useLanguage();
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.VITE_SITE_URL || import.meta.env.SITE_URL)
    : '';
  const siteUrl = (envUrl || siteConfig.url || 'https://questo.pages.dev').replace(/\/+$/, '');
  const pageTitle = `${title} — ${siteConfig.name}`;
  const canonicalUrl = getCanonicalUrl(canonicalPath || pathname);

  const ogImage = image
    ? (image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`)
    : `${siteUrl}/logo.png`;

  // Compute hreflangs
  const langsToInclude = availableLanguages || siteConfig.languages.map((l) => l.code);
  const cleanPath = pathname.replace(/^\/+/, '');
  const pathWithoutLang = cleanPath.startsWith(language.code)
    ? cleanPath.slice(language.code.length).replace(/^\/+/, '')
    : cleanPath;

  const xDefaultUrl = pathWithoutLang
    ? `${siteUrl}/${pathWithoutLang}`
    : `${siteUrl}/`;

  const defaultKeywords = [
    'Questo Magazine',
    'editorial journalism',
    'public domain library',
    'classical monographs',
    'longevity and health',
    'macro markets',
    'systems architecture',
    siteConfig.name,
  ];

  const computedKeywords = keywords
    ? (Array.isArray(keywords) ? keywords.join(', ') : keywords)
    : defaultKeywords.join(', ');

  // 1. Build Primary JSON-LD Schema
  let mainSchema: Record<string, unknown>;

  if (type === 'article') {
    mainSchema = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description,
      image: ogImage,
      url: canonicalUrl,
      inLanguage: language.code,
      keywords: computedKeywords,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      author: {
        '@type': 'Person',
        name: articleAuthor || 'Staff Critic',
        url: articleAuthor ? `${siteUrl}/authors/${authorNameToSlug(articleAuthor)}` : siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
          width: 512,
          height: 512,
        },
      },
      datePublished: articleDate,
      dateModified: articleUpdated || articleDate,
    };
  } else if (type === 'book') {
    mainSchema = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: title,
      description,
      image: ogImage,
      url: canonicalUrl,
      inLanguage: language.code,
      bookFormat: 'https://schema.org/EBook',
      isAccessibleForFree: true,
      author: {
        '@type': 'Person',
        name: bookMeta?.author || 'Historical Author',
      },
      publisher: {
        '@type': 'Organization',
        name: `${siteConfig.name} Classical Archives`,
        url: siteUrl,
      },
      numberOfPages: bookMeta?.numberOfPages || 300,
      genre: bookMeta?.category || 'Public Domain Literature',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    };
  } else {
    mainSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteUrl,
      inLanguage: language.code,
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
          width: 512,
          height: 512,
        },
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/articles?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  // 2. Build Breadcrumbs JSON-LD
  let generatedBreadcrumbsJson: string | null = null;
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url.startsWith('/') ? crumb.url : `/${crumb.url}`}`,
      })),
    };
    generatedBreadcrumbsJson = JSON.stringify(breadcrumbList);
  }

  // 3. Build FAQ JSON-LD
  let generatedFaqJson: string | null = null;
  if (faqItems && faqItems.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
    generatedFaqJson = JSON.stringify(faqSchema);
  }

  return (
    <Head>
      <html lang={language.code} dir={language.dir} />
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={computedKeywords} />
      <meta
        name="robots"
        content={noIndex ? 'noindex, follow' : 'index, follow'}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate hreflang tags */}
      {langsToInclude.map((code) => {
        const isDefault = code === siteConfig.defaultLanguage;
        const targetPath = isDefault
          ? pathWithoutLang
          : `${code}${pathWithoutLang ? `/${pathWithoutLang}` : ''}`;
        const targetUrl = targetPath ? `${siteUrl}/${targetPath}` : `${siteUrl}/`;
        return (
          <link
            key={code}
            rel="alternate"
            hrefLang={code}
            href={targetUrl}
          />
        );
      })}
      <link rel="alternate" hrefLang="x-default" href={xDefaultUrl} />

      {/* RSS & Atom Feeds Autodiscovery */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${siteConfig.name} Magazine RSS Feed`}
        href={`${siteUrl}/feed.xml`}
      />
      <link
        rel="alternate"
        type="application/atom+xml"
        title={`${siteConfig.name} Magazine Atom Feed`}
        href={`${siteUrl}/atom.xml`}
      />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type === 'book' ? 'book' : type === 'article' ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={language.code} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuestoMagazine" />
      <meta name="twitter:creator" content="@QuestoMagazine" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Primary JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(mainSchema)}
      </script>

      {/* Breadcrumbs Schema */}
      {(generatedBreadcrumbsJson || breadcrumbsJsonLd) && (
        <script type="application/ld+json">
          {generatedBreadcrumbsJson || breadcrumbsJsonLd}
        </script>
      )}

      {/* FAQ Schema */}
      {generatedFaqJson && (
        <script type="application/ld+json">
          {generatedFaqJson}
        </script>
      )}

      {/* Custom Overrides */}
      {customJsonLd && (
        <script type="application/ld+json">
          {customJsonLd}
        </script>
      )}
    </Head>
  );
}
