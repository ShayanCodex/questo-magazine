# Questo: Static, Multilingual, GitHub-Powered Blog

Questo is a headless editorial publication platform built with **React 19**, **Vite 7**, **Tailwind CSS 4**, and **TypeScript strict mode**. Every URL is compiled into a standalone, crawlable HTML document at build time with zero runtime client-side fetching or database dependencies.

Articles are authoritatively maintained as plain JSON files in Git. Built in the spirit of Awwwards editorial sites, Questo prioritizes high typographic scale, generous negative space, intentional restraint, and bidirectional prose.

---

## Architecture Overview

```text
questo/
├── content/
│   ├── articles/<slug>.json              # Source of truth (English articles)
│   └── translations/<lang>/<slug>.json   # Generated translations (committed by CI)
├── scripts/
│   ├── lib/content.mjs                   # Shared Node helpers (content, hashing, routes)
│   ├── lib/content.d.mts                 # TypeScript declaration for .mjs imports
│   ├── validate-content.mjs              # Content validator (blocks build on bad schema)
│   ├── translate.mjs                     # Google Translation API v2 with hash caching
│   ├── postbuild.mjs                     # Generates dist/sitemap.xml & dist/robots.txt
│   ├── preview-server.mjs                # Local clean-URL preview server with headers
│   └── capture-screenshots.mjs           # Automated screenshot generation with puppeteer
├── src/
│   ├── components/
│   │   ├── ui/                           # Radix primitives (Button, Badge, Sheet, Breadcrumb)
│   │   ├── Layout.tsx                    # Header, drawer, footer, skip link
│   │   ├── Seo.tsx                       # Head, meta, canonical, hreflang, JSON-LD
│   │   ├── Breadcrumbs.tsx               # Breadcrumb navigation with RTL flip
│   │   ├── ArticleList.tsx               # Signature typographic index with dimming hover
│   │   ├── Body.tsx                      # Semantic renderer for editorial body blocks
│   │   └── LanguageRoot.tsx              # Language context & routing boundary
│   ├── pages/
│   │   ├── Home.tsx                      # Hero statement & latest index
│   │   ├── Articles.tsx                  # Complete chronological archive
│   │   ├── Article.tsx                   # Long-form article reading view
│   │   ├── Tag.tsx                       # Tag-filtered article collection
│   │   └── NotFound.tsx                  # 404 fallback page
│   ├── lib/
│   │   ├── site.ts                       # Site configuration accessors
│   │   ├── types.ts                      # Strict TypeScript interfaces
│   │   ├── lang-context.ts               # Language context & switcher helper
│   │   ├── content.ts                    # Lazy import.meta.glob loader & formatters
│   │   ├── breadcrumbs.ts                # BreadcrumbList JSON-LD generator
│   │   ├── ui-variants.ts                # CVA styling variants (fast-refresh safe)
│   │   └── utils.ts                      # Tailwind merge utility
│   ├── i18n/
│   │   └── strings.ts                    # Hand-written interface chrome (6 languages)
│   ├── routes.tsx                        # Explicit per-language route trees
│   ├── main.tsx                          # ViteReactSSG entrypoint
│   └── index.css                         # Tailwind CSS 4 theme & tokens
├── site.config.json                      # Single source of truth for site config & languages
├── netlify.toml                          # Netlify build & Cache-Control headers
├── vercel.json                           # Vercel cleanUrls & Cache-Control headers
├── oxlint.json                           # Oxlint configuration
├── eslint.config.js                      # ESLint 9+ flat configuration
└── .github/workflows/
    ├── ci.yml                            # Quality gate: lint, typecheck, validate, build
    └── translate.yml                     # Automated translation on content push
```

---

## Non-Negotiables & Rules Enforced

1. **React 19 & Vite 7 & Tailwind CSS 4**: Modern stack running with `@tailwindcss/vite` and `@vitejs/plugin-react`.
2. **Static Site Generation (`vite-react-ssg`)**: Generates 1 HTML file per URL for all languages, tags, and articles. Every page contains full raw prose, canonical link, hreflang alternates, Open Graph cards, and JSON-LD structured data.
3. **No Database or Runtime Client Fetching**: Content is loaded at build time via lazy `import.meta.glob` within route loaders and baked into the HTML.
4. **Heroicons Only**: Uses `@heroicons/react`. Lucide is strictly excluded.
5. **Shadcn-Style Primitives**: Built on Radix Dialog and Radix Slot with `class-variance-authority` and `tailwind-merge`. Small unified radius (`rounded-sm`). Zero pill badges.
6. **Strict Quality Gates**:
   - `npm run lint` executes `oxlint` followed by `eslint .`.
   - `no-console` is an error in `src/`, allowed in `scripts/`.
   - `npm run typecheck` (`tsc --noEmit`) passes with zero errors.
   - `npm run validate-content` verifies JSON structure, slugs, dates, and translation block parity.
   - All enforced in `simple-git-hooks` pre-commit, CI, and build script.

---

## Quick Start

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Static Site Build
```bash
npm run build
```
The build executes:
1. `npm run lint` (Oxlint + ESLint)
2. `npm run typecheck` (`tsc --noEmit`)
3. `npm run validate-content` (Validates all articles and translations)
4. `npm run ssg:build` (Vite React SSG compiles static HTML files for every route)
5. `npm run postbuild` (Generates `sitemap.xml` and `robots.txt`)

### Previewing the Static Build
```bash
node scripts/preview-server.mjs
```
Opens a local HTTP server at `http://localhost:4173` replicating Netlify/Vercel clean URLs and exact `Cache-Control` headers.

---

## Content Model & Publishing Flow

Articles are added directly in Git under `content/articles/<slug>.json`.

### Article JSON Template
```json
{
  "slug": "my-article-title",
  "title": "My article title",
  "excerpt": "A short summary under 160 characters describing the publication.",
  "date": "2026-11-08",
  "updated": "2026-11-09",
  "author": "Elena Vance",
  "tags": ["design-systems", "typography"],
  "body": [
    { "type": "p", "text": "This is an editorial paragraph." },
    { "type": "h2", "text": "A major section heading" },
    { "type": "quote", "text": "Whitespace is not empty space.", "cite": "Jan Tschichold" },
    { "type": "ul", "items": ["First insight", "Second insight"] },
    { "type": "ol", "items": ["Step one", "Step two"] },
    { "type": "code", "lang": "ts", "code": "console.log('Crafted');" }
  ]
}
```

### Content Validation Rules (`scripts/validate-content.mjs`)
- File name must match `slug` (`content/articles/<slug>.json`).
- `slug` and `tags` must match kebab-case: `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- Dates must match `YYYY-MM-DD`.
- Block types allowed: `p`, `h2`, `h3`, `ul`, `ol`, `quote`, `code`.
- Duplicate slugs across articles are rejected with exit code 1.
- Each translation in `content/translations/<lang>/` must have the exact same number and types of blocks as its source article.

---

## Multilingual System & Translation Workflow

Questo supports six core languages:
- **English** (`en`) — Default language, served at root (`/`)
- **Spanish** (`es`) — Served at `/es`
- **French** (`fr`) — Served at `/fr`
- **German** (`de`) — Served at `/de`
- **Arabic** (`ar`) — Served at `/ar` (Right-to-Left `dir="rtl"`)
- **Urdu** (`ur`) — Served at `/ur` (Right-to-Left `dir="rtl"`)

### Interface Chrome vs Article Prose
- **Interface Text**: All UI chrome (drawer, buttons, metadata labels, search, 404) is hand-written in `src/i18n/strings.ts`. It is never machine-translated.
- **Article Prose**: Translated by `scripts/translate.mjs` using the Google Cloud Translation API (v2 REST).
  - Batches up to 100 strings per request.
  - Translates `title`, `excerpt`, and all body `text`, `cite`, and `items`.
  - **Code blocks are never translated**.
  - Computes a SHA-1 hash (`sourceHash`) of translatable strings. Unchanged articles are skipped automatically to eliminate API costs.

### Translation Fallback
If an article has not yet been translated into a given language:
- It still renders statically at `/<lang>/articles/<slug>` so the language switcher never lands on a 404.
- An editorial notice is displayed stating the article is showing the original English version.
- Carries `<meta name="robots" content="noindex, follow" />`.
- Sets `<link rel="canonical" />` to the original English page.
- Excluded from `dist/sitemap.xml` so it never competes with the primary version in search indexes.

### Running Translations
Set your API key in the environment (never prefix with `VITE_`):
```bash
export GOOGLE_TRANSLATE_API_KEY="your-api-key"
npm run translate
```
To test without an API key using mock translations:
```bash
npm run translate -- --mock
```

---

## Design System & Editorial Philosophy

1. **Typographic Hero**:
   - Variable Display Sans: **Bricolage Grotesque** with tight tracking for headlines (`clamp(3rem, 7vw, 6rem)`).
   - Readable Serif: **Literata** for long-form reading comfort, line length under 70 characters (`max-w-[44rem]`), line height 1.8.
   - Arabic & Urdu scripts: **Noto Naskh Arabic** and **Noto Nastaliq Urdu**.
2. **Minimal Monochromatic Palette & Cadmium Vermilion Accent**:
   - Single accent: `#D83A17` in light mode, `#FF5436` in dark mode.
   - Applied strictly to hyperlinks, focus rings, and active states.
   - No gradients, no colored cards, no drop shadows except on the drawer.
3. **The Signature Interaction**:
   - The article list is a typographic ledger.
   - Hovering any row gracefully dims all non-hovered rows to `0.32` opacity.
   - The entire row acts as a primary link, with tag chips elevated above it.
4. **Bidirectional Layout (RTL)**:
   - Arabic and Urdu render with `dir="rtl"`.
   - Drawer navigation slides in from the inline end (left in RTL, right in LTR).
   - Breadcrumb chevrons invert direction automatically.

---

## Deployment & Cache-Control Headers

Deployments are automated through GitHub Actions, Netlify, or Vercel on push to `main`.

Both `netlify.toml` and `vercel.json` are pre-configured with explicit Cache-Control headers:

### Caching Policy
- **HTML pages, loader JSON, and sitemap**:
  ```http
  Cache-Control: public, max-age=0, must-revalidate
  ```
  Ensures CDN caches revalidate immediately so GitHub CMS edits go live instantly.
- **Content-Hashed Static Assets (`/assets/*`)**:
  ```http
  Cache-Control: public, max-age=31536000, immutable
  ```
- **Security Headers**:
  ```http
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  ```

### Verifying Headers Locally
```bash
curl.exe -sI http://localhost:4173/
curl.exe -sI http://localhost:4173/assets/app-DZQsam53.css
```

