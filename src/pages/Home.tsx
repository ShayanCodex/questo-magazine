import { useLoaderData, Link } from 'react-router-dom';
import type { ArticleData } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { siteConfig } from '../lib/site';
import { Seo } from '../components/Seo';
import { ArticleList } from '../components/ArticleList';
import { Button } from '../components/ui/button';

interface HomeLoaderData {
  articles: ArticleData[];
  pathname: string;
}

export function Home() {
  const { articles, pathname } = useLoaderData() as HomeLoaderData;
  const { t, localePath } = useLanguage();

  const latestArticles = articles.slice(0, 5);

  return (
    <div className="space-y-16 sm:space-y-24">
      <Seo
        title={siteConfig.name}
        description={siteConfig.description}
        pathname={pathname}
        type="website"
      />

      {/* Huge Intro Statement */}
      <section className="pt-4 sm:pt-12 max-w-4xl">
        <h1 className="font-display font-extrabold text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] tracking-tight text-editorial-text">
          A static, multilingual publication on software craft and typographic restraint.
        </h1>
      </section>

      {/* Latest Section */}
      <section className="space-y-8">
        <div className="flex items-baseline justify-between border-b border-editorial-border pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-editorial-muted">
            {t.latest}
          </span>
          <Link
            to={localePath('/articles')}
            className="text-xs font-mono uppercase tracking-wider text-accent hover:underline"
          >
            {t.allArticles}
          </Link>
        </div>

        <ArticleList articles={latestArticles} />

        {articles.length > 5 && (
          <div className="pt-6 text-start">
            <Button variant="outline" asChild>
              <Link to={localePath('/articles')}>{t.allArticles}</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

