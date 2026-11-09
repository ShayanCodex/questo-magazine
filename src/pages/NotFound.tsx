import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Button } from '../components/ui/button';

export function NotFound() {
  const { t, localePath } = useLanguage();
  const location = useLocation();

  return (
    <div className="py-20 sm:py-32 flex flex-col items-start max-w-2xl space-y-8">
      <Seo
        title={t.pageNotFound}
        description={t.pageNotFoundDesc}
        pathname={location.pathname}
        noIndex={true}
      />

      <span className="font-mono text-sm uppercase tracking-widest text-editorial-text font-semibold">
        404
      </span>

      <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-editorial-text leading-tight">
        {t.pageNotFound}
      </h1>

      <p className="font-serif text-lg sm:text-xl text-editorial-muted leading-relaxed">
        {t.pageNotFoundDesc}
      </p>

      <div className="pt-4">
        <Button variant="outline" asChild>
          <Link to={localePath('/')}>{t.returnHome}</Link>
        </Button>
      </div>
    </div>
  );
}

