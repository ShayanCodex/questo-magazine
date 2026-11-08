# Questo Design Note: Editorial Restraint & Typographic Craft

## 1. Editorial Reference Review
- **stripe.press**: Confident, hero-scale typography that commands attention with architectural whitespace. *Avoided: heavy per-book bespoke art direction.*
- **linear.app**: Disciplined monochromatic palette, tight mathematical baseline grid, sharp details. *Avoided: dark gradient hero splashes and neon glows.*
- **joshwcomeau.com**: Exceptional measure, comfortable line length (<70ch), rhythmic body spacing (1.8 line-height). *Avoided: dense playful illustrations and animated distractions.*
- **rauno.me**: Micro-interaction mastery—instant, precise focus states, dimming peer items on hover, razor-thin hairline dividers. *Avoided: experimental navigations that obscure content.*
- **maggieappleton.com**: Purposeful editorial curation and clear topic hierarchy. *Avoided: decorative visual whimsy.*
- **vercel.com/blog**: Clean metadata, snappy load speeds, structured index. *Avoided: heavy card grids with repetitive thumbnail images.*
- **awwwards.com editorial**: High-contrast, expressive variable typography with deliberate editorial pacing. *Avoided: scroll jank, parallax lag, and accessibility blockers.*

---

## 2. Design System Tokens

### Palette
A high-contrast, paper-and-ink scale with **exactly one** high-chroma editorial accent:
- **Light mode**:
  - Background: `#FBFBFA` (warm editorial newsprint white)
  - Surface / Drawer: `#FFFFFF`
  - Text Primary: `#111110` (deep ink black)
  - Text Muted: `#6E6D6A` (refined stone gray)
  - Border Hairline: `#E4E4E0` (subtle 1px divider)
  - Accent: `#D83A17` (International Vermilion / Cadmium Red)
- **Dark mode** (`prefers-color-scheme: dark` via CSS variables):
  - Background: `#0D0D0C` (rich obsidian black)
  - Surface / Drawer: `#141413`
  - Text Primary: `#EDEDEB` (off-white newsprint)
  - Text Muted: `#94938F` (weathered slate)
  - Border Hairline: `#262624`
  - Accent: `#FF5436` (high-visibility radiant vermilion)
- **Accent rule**: Used strictly for hyperlinks, active states, focus rings, and selection. Absolutely no color gradients, no colored card backgrounds, no multi-color tags.

### Typography
Two distinct, purpose-driven type families:
1. **Display Sans — Bricolage Grotesque**: Variable optical size, tight tracking (`tracking-tight` / `tracking-tighter`), expressive editorial personality.
   - Home hero: `clamp(3rem, 7vw, 6rem)` (sentence case).
   - Article title: `clamp(2.5rem, 5vw, 3.75rem)` (sentence case).
2. **Body Serif — Literata**: Designed for long-form reading comfort.
   - Line length capped at `68ch` (`max-w-[68ch]`).
   - Line height set to `1.8` for generous vertical rhythm.
   - Subtitle & excerpts rendered in muted Literata italics/roman.

### Geometry & Spatial Tokens
- **Border Radius**: Small, unified token (`2px` / `rounded-xs` / `rounded-sm`). Strictly no pill badges or rounded-2xl blobs.
- **Spacing**: Expansive whitespace (`py-16`, `py-24`, `gap-12`) replaces decorative box containers and borders.

---

## 3. Layout Idea: The Typographic Index
Instead of generic cards with thumbnails:
- **Header**: Quiet editorial wordmark (`Questo`) and an inline `[Menu]` toggle button.
- **Hero**: Massive, left-aligned declarative statement in display sans.
- **Index**: Chronological editorial ledger. Two-column desktop alignment:
  - Meta column (inline start): publication date (`YYYY-MM-DD` localized via `Intl.DateTimeFormat` UTC) and reading time.
  - Content column: large display headline, muted serif excerpt, minimal inline tag tokens.
- **RTL Integrity**: Full bi-directional layout support (`dir="rtl"`) for Arabic (`ar`) and Urdu (`ur`), flipping drawer slide direction, breadcrumb separators, and alignment seamlessly.

---

## 4. One Signature Interaction: Editorial Index Dimming
- When the cursor hovers over any row in the article index, all non-hovered rows gracefully reduce opacity to `0.3`, drawing crisp optical focus exclusively to the selected story.
- The entire row acts as a primary link to the article, with nested tag chips elevated above the link layer for independent filtering.
- Supported with `prefers-reduced-motion: reduce` override (instant transition when active).

---

## 5. Rejected Default Choices
To ensure Questo is never mistaken for a cookie-cutter SaaS template:
1. **REJECTED**: Card grids with stock Unsplash thumbnail cards.
2. **REJECTED**: Generic indigo/blue (`#3b82f6`) or neon cyberpunk accents.
3. **REJECTED**: Warm cream backgrounds paired with terracotta accents or purple washes.
4. **REJECTED**: Pill-shaped badges, rounded-full chips, and floating drop shadows.
5. **REJECTED**: All-caps micro-eyebrow labels (`UPDATES // BLOG`) above headings.
6. **REJECTED**: Single-word colored highlights in headlines.
7. **REJECTED**: Trailing decorative arrows (`→`) on every single link.
8. **REJECTED**: Heavy scroll-driven animations, parallax jank, or artificial fade-in staggers.

