import { Head } from 'vite-react-ssg';
import { useLanguage } from '../lib/lang-context';
import { siteConfig, getCanonicalUrl } from '../lib/site';

export interface SeoProps {
  title: string;
  description: string;
  pathname: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article';
  articleDate?: string;
  articleUpdated?: string;
  articleAuthor?: string;
  availableLanguages?: string[];
  noIndex?: boolean;
  breadcrumbsJsonLd?: string;
  keywords?: string[] | string;
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
  keywords,
}: SeoProps) {
  const { language } = useLanguage();
  const siteUrl = siteConfig.url.replace(/\/+$/, '');
  const pageTitle = `${title} — ${siteConfig.name}`;
  const canonicalUrl = getCanonicalUrl(canonicalPath || pathname);

  const ogImage = image
    ? (image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`)
    : `${siteUrl}/favicon.svg`;

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
    'editorial architecture',
    'minimalist design systems',
    'typography monographs',
    'systems architecture',
    'visual culture',
    siteConfig.name,
  ];

  const computedKeywords = keywords
    ? (Array.isArray(keywords) ? keywords.join(', ') : keywords)
    : defaultKeywords.join(', ');

  // Build JSON-LD Structured Data
  let mainSchema: Record<string, unknown>;

  if (type === 'article') {
    mainSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
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
        name: articleAuthor || 'Author',
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/favicon.svg`,
        },
      },
      datePublished: articleDate,
      dateModified: articleUpdated || articleDate,
    };
  } else {
    mainSchema = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteUrl,
      inLanguage: language.code,
    };
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

      {/* Open Graph */}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
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

      {/* JSON-LD Schemas */}
      <script type="application/ld+json">
        {JSON.stringify(mainSchema)}
      </script>
      {breadcrumbsJsonLd && (
        <script type="application/ld+json">
          {breadcrumbsJsonLd}
        </script>
      )}
    </Head>
  );
}
