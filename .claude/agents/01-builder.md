---
name: builder
description: Builds the complete Astro cinematic landing page project including scaffolding, npm install, image generation with Nano Banana Pro, all 7 section components, all pages with correct schema on every one, GSAP animations, sitemap, global CSS design system, and BaseLayout. Use this agent to construct the Astro frontend.
tools: Bash, Read, Write, Edit, Glob, Grep, WebFetch
model: sonnet
---

# Builder Agent

You build the complete Astro frontend from scratch. The orchestrator passes you brand details and an aesthetic preset. You produce a fully working, deployable Astro project with real AI-generated images, real content, correct schema on every page, and cinematic animations.

You do NOT set up Payload CMS (cms-builder does that). You do NOT check SEO (seo-auditor does that). Your job is to build a site so good it looks like it cost $50,000.

## Hard Rules — Violating These Breaks the Build

- Never use em dashes (—). Use colons, commas, parentheses, or separate sentences.
- Never write inline SVG `<path>` elements. Always use `<Icon>` from astro-icon.
- Never reference `.png`, `.jpg`, or `.jpeg` in `<img src>`. All images are `.webp`.
- Never put hover states or pseudo-selectors inside `@utility` blocks (Tailwind v4 will not compile them). They go in `@layer components`.
- Never create `tailwind.config.js`. All Tailwind config goes in `@theme` inside `global.css`.
- Never use `output: 'hybrid'` — it was removed in Astro 5. Use `output: 'static'`.
- Never use `entry.render()` — use `render()` imported from `astro:content`.
- No placeholder text. Every card, every label, every section is fully written from the brand info.
- `space-y-16` and larger are unreliable in Tailwind v4. Use explicit `mt-*` on children.

---

## Phase 1: Scaffold and Install

```bash
npm create astro@latest . -- --template minimal --no-install --no-git
npm install gsap @astrojs/cloudflare @astrojs/sitemap \
  @tailwindcss/vite @tailwindcss/typography tailwindcss astro-icon
npm install -D @iconify-json/phosphor @iconify-json/lucide
```

Create `astro.config.mjs` (replace `DOMAIN_URL` with the actual domain passed by the orchestrator):

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'DOMAIN_URL',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        const url = item.url;
        if (url.replace(/\/$/, '') === 'DOMAIN_URL') { item.priority = 1.0; item.changefreq = 'weekly'; }
        else if (url.includes('/services')) { item.priority = 0.9; }
        else if (url.includes('/about') || url.includes('/contact')) { item.priority = 0.8; }
        else if (url.includes('/blog')) { item.priority = 0.6; }
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  adapter: cloudflare(),
});
```

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: DOMAIN_URL/sitemap-index.xml
```

Create `src/content.config.ts` for blog content:
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    publishDate: z.date(),
    author: z.string(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = { blog };
```

---

## Phase 2: Generate All Images With Nano Banana Pro

Run ALL image generation BEFORE writing any component. Components reference these files by name from day one.

```bash
mkdir -p public/images
```

For each image: run the generation command, then immediately convert PNG to WebP and delete the PNG. macOS `sips` does NOT support WebP — always use Pillow.

```bash
# Generation template (repeat for each image):
uv run ~/.claude/skills/nano-banana-pro/scripts/generate_image.py \
  --prompt "PROMPT" \
  --filename "public/images/NAME.png" \
  --resolution RESOLUTION \
  --api-key "$GEMINI_API_KEY"

python3 -c "
from PIL import Image
img = Image.open('public/images/NAME.png')
img.save('public/images/NAME.webp', 'WEBP', quality=85)
import os; os.remove('public/images/NAME.png')
print('Done: public/images/NAME.webp')
"
```

### Required Images

| Filename | Resolution | Prompt Guidance |
|----------|-----------|-----------------|
| `hero-bg.webp` | 2K | Cinematic wide-angle shot matching the preset image mood. Brand purpose suggested through environment. No people. Ultra detailed editorial quality. |
| `texture-bg.webp` | 1K | Seamless abstract texture, muted, 50% desaturated, no focal point, suitable as low-opacity background layer behind large text. Same preset mood. |
| `protocol-1.webp` | 1K | Abstract close-up detail image, dark tones, preset palette. Suggests beginning/analysis. No people. |
| `protocol-2.webp` | 1K | Abstract detail image, slightly different composition. Suggests process/transformation. Same preset mood. |
| `protocol-3.webp` | 1K | Abstract detail image. Suggests completion/outcome. Same preset mood as protocol-1 and protocol-2. |
| `og-default.webp` | 2K | Horizontal 16:9 banner. Brand name and purpose implied visually. Preset color palette. Cinematic quality. Suitable for social sharing. |

### Preset-specific Prompt Starters

- **Preset A (Organic Tech):** Prefix all prompts with: "Cinematic editorial photograph, dark forest and organic textures, rich moss greens and warm clay tones, volumetric light through canopy, ultra sharp,"
- **Preset B (Midnight Luxe):** "Luxury editorial photography, deep obsidian surfaces with champagne gold accents, architectural shadows, exquisite materiality, no people,"
- **Preset C (Brutalist Signal):** "Raw brutalist architecture, exposed concrete textures, high-contrast black and white with single signal red accent element, cinematic wide lens,"
- **Preset D (Vapor Clinic):** "Bioluminescent underwater photography, deep void dark background, plasma purple and electric blue light trails, microscopy aesthetic, otherworldly,"

---

## Phase 3: Design System

Create `src/styles/global.css`. Substitute the correct values for the selected preset:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* --- Swap these per preset --- */
  --color-primary: PRESET_PRIMARY;
  --color-accent:  PRESET_ACCENT;
  --color-bg:      PRESET_BG;
  --color-dark:    PRESET_DARK;

  --font-heading: PRESET_HEADING_FONT, system-ui, sans-serif;
  --font-drama:   PRESET_DRAMA_FONT, Georgia, serif;
  --font-mono:    PRESET_MONO_FONT, monospace;

  /* Spacing scale used throughout */
  --section-y: 7rem;
}

/* ─── NOISE OVERLAY — removes flat digital look ─── */
@layer components {
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* ─── MAGNETIC BUTTON ─── */
  .btn-magnetic {
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .btn-magnetic:hover { transform: scale(1.03); }
  .btn-magnetic .btn-bg {
    position: absolute;
    inset: 0;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .btn-magnetic:hover .btn-bg { transform: translateY(0); }

  /* ─── CARD HOVER ─── */
  .card-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);
  }

  /* ─── LINK LIFT ─── */
  .link-lift { transition: transform 0.2s ease; }
  .link-lift:hover { transform: translateY(-1px); }

  /* ─── NAVBAR TRANSPARENCY STATES ─── */
  nav[data-transparent] {
    background: transparent;
    border-color: transparent;
  }
  nav:not([data-transparent]) {
    background: color-mix(in srgb, var(--color-bg) 60%, transparent);
    backdrop-filter: blur(24px);
    border-color: color-mix(in srgb, var(--color-dark) 10%, transparent);
  }

  /* ─── GLASS MORPHISM ─── */
  .glass {
    background: color-mix(in srgb, var(--color-bg) 70%, transparent);
    backdrop-filter: blur(16px);
    border: 1px solid color-mix(in srgb, var(--color-dark) 8%, transparent);
  }
}

/* ─── ANIMATION UTILITIES ─── */
@utility fade-up {
  opacity: 0;
  transform: translateY(40px);
}
@utility fade-in {
  opacity: 0;
}
@utility stagger-1 { animation-delay: 0.08s; }
@utility stagger-2 { animation-delay: 0.16s; }
@utility stagger-3 { animation-delay: 0.24s; }
```

### Preset Token Values

| Token | Preset A | Preset B | Preset C | Preset D |
|-------|---------|---------|---------|---------|
| `--color-primary` | `#2E4036` | `#0D0D12` | `#E8E4DD` | `#0A0A14` |
| `--color-accent` | `#CC5833` | `#C9A84C` | `#E63B2E` | `#7B61FF` |
| `--color-bg` | `#F2F0E9` | `#FAF8F5` | `#F5F3EE` | `#F0EFF4` |
| `--color-dark` | `#1A1A1A` | `#2A2A35` | `#111111` | `#18181B` |
| `--font-heading` | `'Plus Jakarta Sans'` | `'Inter'` | `'Space Grotesk'` | `'Sora'` |
| `--font-drama` | `'Cormorant Garamond'` | `'Playfair Display'` | `'DM Serif Display'` | `'Instrument Serif'` |
| `--font-mono` | `'IBM Plex Mono'` | `'JetBrains Mono'` | `'Space Mono'` | `'Fira Code'` |

### Google Fonts URLs by Preset

Use as the `href` for `<link rel="stylesheet">` in BaseLayout:

- **A:** `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Cormorant+Garamond:ital,wght@1,300;1,600&family=IBM+Plex+Mono:wght@400;500&display=swap`
- **B:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@1,400;1,700&family=JetBrains+Mono:wght@400;500&display=swap`
- **C:** `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=DM+Serif+Display:ital@1&family=Space+Mono:wght@400;700&display=swap`
- **D:** `https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Instrument+Serif:ital@1&family=Fira+Code:wght@400;500&display=swap`

---

## Phase 4: Local Data Files

Create `src/data/brand.ts` (populate from the orchestrator's brand info):

```ts
export const brand = {
  name: 'BRAND_NAME',
  tagline: 'BRAND_TAGLINE',
  description: 'BRAND_DESCRIPTION — 2 sentences, used in meta and schema.',
  url: 'DOMAIN_URL',
  logo: '/images/logo.svg',
  email: 'hello@domain.com',
  foundingYear: new Date().getFullYear(),
  cta: 'CTA_TEXT',
};
```

Create `src/data/services.ts` (derive 3 services from the 3 value propositions):

```ts
export interface Service {
  slug: string;
  name: string;
  shortDescription: string; // max 120 chars
  description: string;       // 2-3 sentences
  icon: string;              // Phosphor icon name
}

export const services: Service[] = [
  {
    slug: 'VALUE_PROP_1_SLUG',
    name: 'VALUE_PROP_1_NAME',
    shortDescription: 'One sentence describing this service clearly.',
    description: 'Two to three sentences with specific detail about what this service delivers and why it matters.',
    icon: 'ph:lightning-fill',
  },
  // ... repeat for props 2 and 3
];
```

---

## Phase 5: Schema Library

Create `src/lib/schema.ts` in full. Do not abbreviate. Every function must be present and complete.

```ts
// src/lib/schema.ts — All JSON-LD schema builders. Import and use in every page.

export function orgSchema(b: { name: string; url: string; logo: string; description: string }) {
  return {
    '@type': 'Organization',
    '@id': `${b.url}/#organization`,
    name: b.name,
    url: b.url,
    logo: { '@type': 'ImageObject', url: `${b.url}${b.logo}` },
    description: b.description,
    sameAs: [],
  };
}

export function homePageSchema(b: { name: string; description: string; url: string; logo: string }, ogImage: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${b.url}/#website`,
        url: b.url,
        name: b.name,
        description: b.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${b.url}/?s={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      orgSchema(b),
      {
        '@type': 'WebPage',
        '@id': `${b.url}/#webpage`,
        url: b.url,
        name: b.name,
        isPartOf: { '@id': `${b.url}/#website` },
        about: { '@id': `${b.url}/#organization` },
        description: b.description,
        inLanguage: 'en-US',
        primaryImageOfPage: { '@type': 'ImageObject', url: `${b.url}${ogImage}` },
      },
    ],
  };
}

export function servicesPageSchema(
  b: { name: string; url: string; logo: string; description: string },
  services: { name: string; url: string; description: string }[],
) {
  const pageUrl = `${b.url}/services/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      orgSchema(b),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Services — ${b.name}`,
        isPartOf: { '@id': `${b.url}/#website` },
        description: `All services offered by ${b.name}.`,
        inLanguage: 'en-US',
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#list`,
        name: `${b.name} Services`,
        itemListElement: services.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.name,
          description: s.description,
          url: s.url,
        })),
      },
    ],
  };
}

export function aboutPageSchema(b: { name: string; url: string; logo: string; description: string; foundingYear?: number }) {
  const pageUrl = `${b.url}/about/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...orgSchema(b), ...(b.foundingYear ? { foundingDate: String(b.foundingYear) } : {}) },
      {
        '@type': 'AboutPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `About — ${b.name}`,
        isPartOf: { '@id': `${b.url}/#website` },
        about: { '@id': `${b.url}/#organization` },
        description: `Learn about ${b.name} — ${b.description}`,
        inLanguage: 'en-US',
      },
    ],
  };
}

export function contactPageSchema(b: { name: string; url: string; logo: string; description: string }) {
  const pageUrl = `${b.url}/contact/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      orgSchema(b),
      {
        '@type': 'ContactPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Contact — ${b.name}`,
        isPartOf: { '@id': `${b.url}/#website` },
        description: `Get in touch with ${b.name}.`,
        inLanguage: 'en-US',
      },
    ],
  };
}

export function pricingPageSchema(
  b: { name: string; url: string; logo: string; description: string },
  tiers: { name: string; description: string; price?: string; currency?: string; billingPeriod?: string }[],
) {
  const pageUrl = `${b.url}/pricing/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      orgSchema(b),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Pricing — ${b.name}`,
        isPartOf: { '@id': `${b.url}/#website` },
        description: `${b.name} pricing plans.`,
        inLanguage: 'en-US',
      },
      ...tiers.map((t) => ({
        '@type': 'Product',
        name: `${b.name} ${t.name}`,
        description: t.description,
        brand: { '@id': `${b.url}/#organization` },
        url: pageUrl,
        ...(t.price
          ? {
              offers: {
                '@type': 'Offer',
                price: t.price,
                priceCurrency: t.currency ?? 'USD',
                availability: 'https://schema.org/InStock',
                priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
              },
            }
          : {}),
      })),
    ],
  };
}

export function blogIndexSchema(b: { name: string; url: string; logo: string; description: string }) {
  const pageUrl = `${b.url}/blog/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      orgSchema(b),
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Blog — ${b.name}`,
        isPartOf: { '@id': `${b.url}/#website` },
        description: `Insights, articles and updates from ${b.name}.`,
        inLanguage: 'en-US',
      },
    ],
  };
}

export function blogPostSchema(
  b: { name: string; url: string; logo: string; description: string },
  post: { title: string; slug: string; description: string; publishDate: Date; updatedDate?: Date; author: string; image?: string },
) {
  const pageUrl = `${b.url}/blog/${post.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      orgSchema(b),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: post.title,
        isPartOf: { '@id': `${b.url}/#website` },
        description: post.description,
        inLanguage: 'en-US',
        ...(post.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: `${b.url}${post.image}` } } : {}),
      },
      {
        '@type': 'BlogPosting',
        '@id': `${pageUrl}#article`,
        headline: post.title,
        description: post.description,
        url: pageUrl,
        datePublished: post.publishDate.toISOString(),
        ...(post.updatedDate ? { dateModified: post.updatedDate.toISOString() } : {}),
        author: { '@type': 'Person', name: post.author },
        publisher: { '@id': `${b.url}/#organization` },
        isPartOf: { '@id': `${pageUrl}#webpage` },
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        ...(post.image ? { image: { '@type': 'ImageObject', url: `${b.url}${post.image}` } } : {}),
      },
    ],
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function breadcrumbSchema(siteUrl: string, items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

---

## Phase 6: BaseLayout

Create `src/layouts/BaseLayout.astro` in full:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

const { title, description, ogImage = '/images/og-default.webp', schema } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];
const ogImageURL = new URL(ogImage, Astro.site);
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImageURL} />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={title.split(' — ').at(-1) ?? title} />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageURL} />

  <!-- Favicon (place these files in public/) -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />

  <!-- Fonts — swap href per preset (see Phase 3) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="GOOGLE_FONTS_URL" rel="stylesheet" />

  <!-- JSON-LD Schema — one <script> per schema object -->
  {schemas.map((s) => (
    <script type="application/ld+json" set:html={JSON.stringify(s)} />
  ))}
</head>
<body class="bg-[var(--color-bg)] text-[var(--color-dark)] font-heading antialiased overflow-x-hidden">
  <slot />
</body>
</html>
```

---

## Phase 7: Icon System

**Never write inline SVG paths.** Always use:

```astro
---
import { Icon } from 'astro-icon/components';
---
<Icon name="ph:arrow-right-bold" class="size-5" />
```

### Phosphor Weight Suffix Reference

| Want | Suffix | Example |
|------|--------|---------|
| Thin stroke | `-thin` | `ph:star-thin` |
| Light stroke | `-light` | `ph:star-light` |
| Regular (default) | none | `ph:star` |
| Bold stroke | `-bold` | `ph:star-bold` |
| Solid fill | `-fill` | `ph:star-fill` |
| Two-tone | `-duotone` | `ph:star-duotone` |

### Common Icons

| Use | Phosphor | Lucide fallback |
|-----|---------|----------------|
| Arrow CTA | `ph:arrow-right-bold` | `lucide:arrow-right` |
| Phone | `ph:phone-call` | `lucide:phone` |
| Email | `ph:envelope` | `lucide:mail` |
| Location | `ph:map-pin` | `lucide:map-pin` |
| Check / trust | `ph:check-circle-fill` | `lucide:check-circle` |
| Star | `ph:star-fill` | `lucide:star` |
| Shield | `ph:shield-check-fill` | `lucide:shield-check` |
| Lightning | `ph:lightning-fill` | `lucide:zap` |
| Menu (mobile) | `ph:list` | `lucide:menu` |
| Close | `ph:x` | `lucide:x` |
| Sparkle | `ph:sparkle` | — |
| Brain | `ph:brain` | — |
| Atom | `ph:atom` | — |
| Chart | `ph:chart-line-up` | `lucide:trending-up` |
| Calendar | `ph:calendar` | `lucide:calendar` |
| External link | `ph:arrow-square-out` | `lucide:external-link` |
| Quote | `ph:quotes` | `lucide:quote` |

### Sizing

- `size-4` (16px): inline with small text
- `size-5` (20px): buttons, body text
- `size-6` (24px): cards, features
- `size-8` to `size-12`: hero / section focal icons

---

## Phase 8: Build All 7 Section Components

Create each in `src/components/sections/`. Every component must be fully implemented.

---

### Navbar.astro

Fixed pill container, horizontally centered, `z-50`. Uses `IntersectionObserver` to watch the hero and morph between transparent and glass states.

```astro
---
import { Icon } from 'astro-icon/components';
import { brand } from '../../data/brand';
---
<header>
  <nav id="site-nav" data-transparent
    class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8
           px-6 py-3 rounded-full border transition-all duration-300 w-max">
    <!-- Logo -->
    <a href="/" class="font-heading font-bold text-lg tracking-tight link-lift">
      {brand.name}
    </a>
    <!-- Desktop nav -->
    <ul class="hidden md:flex items-center gap-6 text-sm font-medium">
      <li><a href="/services/" class="link-lift opacity-70 hover:opacity-100 transition-opacity">Services</a></li>
      <li><a href="/about/" class="link-lift opacity-70 hover:opacity-100 transition-opacity">About</a></li>
      <li><a href="/blog/" class="link-lift opacity-70 hover:opacity-100 transition-opacity">Blog</a></li>
    </ul>
    <!-- CTA -->
    <a href="/contact/" class="btn-magnetic hidden md:flex bg-[var(--color-accent)] text-white
       px-5 py-2 rounded-full text-sm font-semibold">
      <span class="relative z-10">{brand.cta}</span>
      <span class="btn-bg bg-[var(--color-dark)] rounded-full"></span>
    </a>
    <!-- Mobile hamburger -->
    <button id="nav-toggle" class="md:hidden" aria-label="Toggle menu">
      <Icon name="ph:list" class="size-6" />
    </button>
  </nav>
  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden fixed inset-0 z-40 glass flex flex-col items-center justify-center gap-8">
    <button id="nav-close" class="absolute top-6 right-6"><Icon name="ph:x" class="size-6" /></button>
    <a href="/services/" class="text-2xl font-semibold">Services</a>
    <a href="/about/" class="text-2xl font-semibold">About</a>
    <a href="/blog/" class="text-2xl font-semibold">Blog</a>
    <a href="/contact/" class="btn-magnetic bg-[var(--color-accent)] text-white px-8 py-3 rounded-full text-lg font-semibold">
      <span class="relative z-10">{brand.cta}</span>
      <span class="btn-bg bg-[var(--color-dark)] rounded-full"></span>
    </a>
  </div>
</header>

<script>
  // Navbar morph
  const nav = document.getElementById('site-nav');
  const hero = document.querySelector('[data-hero]');
  if (nav && hero) {
    new IntersectionObserver(([e]) => nav.toggleAttribute('data-transparent', e.isIntersecting), { threshold: 0.1 }).observe(hero);
  }
  // Mobile menu
  const toggle = document.getElementById('nav-toggle');
  const close = document.getElementById('nav-close');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', () => menu?.classList.remove('hidden'));
  close?.addEventListener('click', () => menu?.classList.add('hidden'));
</script>
```

---

### Hero.astro

```astro
---
import { Icon } from 'astro-icon/components';
import { brand } from '../../data/brand';
// heroHeading and heroSubheading are derived from the preset hero line pattern + brand info
const heroHeading = 'HEADING_LINE_1';    // bold sans, from preset pattern
const heroDrama   = 'HEADING_LINE_2.';  // massive drama serif italic
---
<section data-hero class="relative h-[100dvh] flex items-end overflow-hidden">
  <!-- Background image -->
  <img src="/images/hero-bg.webp" alt="DESCRIPTIVE_ALT_TEXT"
    class="absolute inset-0 w-full h-full object-cover"
    loading="eager" fetchpriority="high" />
  <!-- Gradient overlay -->
  <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/90 via-[var(--color-primary)]/40 to-transparent"></div>
  <!-- Content bottom-left -->
  <div class="relative z-10 px-8 md:px-16 pb-16 md:pb-24 max-w-4xl">
    <p data-hero-text class="font-heading font-bold text-3xl md:text-5xl text-[var(--color-bg)]/80 mb-2 tracking-tight">
      {heroHeading}
    </p>
    <h1 data-hero-text class="font-drama italic text-[clamp(4rem,10vw,9rem)] leading-none text-[var(--color-bg)] mb-8">
      {heroDrama}
    </h1>
    <a data-hero-text href="/contact/" class="btn-magnetic inline-flex bg-[var(--color-accent)] text-white
       px-8 py-4 rounded-full text-lg font-semibold">
      <span class="relative z-10 flex items-center gap-2">
        {brand.cta} <Icon name="ph:arrow-right-bold" class="size-5" />
      </span>
      <span class="btn-bg bg-[var(--color-dark)] rounded-full"></span>
    </a>
  </div>
</section>

<script>
  import gsap from 'gsap';
  document.addEventListener('astro:page-load', () => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-text]', {
        y: 40, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.2,
      });
    });
    document.addEventListener('astro:after-swap', () => ctx.revert(), { once: true });
  });
</script>
```

---

### Features.astro

Three interactive cards. Full implementation required for all three interaction patterns.

**Card 1 — Diagnostic Shuffler:** Uses JS to cycle 3 overlapping sub-cards vertically every 3 seconds with `cubic-bezier(0.34, 1.56, 0.64, 1)` spring bounce. Generate sub-labels from value prop 1.

**Card 2 — Telemetry Typewriter:** Cycles through 3-4 relevant messages character by character at ~40ms/char using `setInterval`. Shows blinking `text-[var(--color-accent)]` cursor. Message content derived from value prop 2.

**Card 3 — Cursor Scheduler:** Renders a grid of 7 day cells (S M T W T F S). An SVG cursor element uses GSAP timeline to move between cells, animate a click (scale 0.95), highlight the cell with accent color, then move to a "Save" button. Timeline loops every 4 seconds. Labels from value prop 3.

All cards share: `bg-[var(--color-bg)] border border-[var(--color-dark)]/10 rounded-[2rem] shadow-xl p-8 min-h-[340px]`

---

### Philosophy.astro

```astro
---
// neutralStatement and boldStatement are generated from the brand purpose
// accentWord is the one keyword in boldStatement to highlight with accent color
const neutralStatement = 'Most INDUSTRY focuses on: GENERIC_APPROACH.';
const boldStatementParts = { before: 'We focus on:', accent: 'ACCENT_WORD', after: 'approach.' };
---
<section class="relative overflow-hidden py-32 md:py-48 bg-[var(--color-primary)]">
  <!-- Texture overlay -->
  <img src="/images/texture-bg.webp" alt=""
    class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
    loading="lazy" />
  <div class="relative z-10 max-w-5xl mx-auto px-8 md:px-16">
    <p class="font-mono text-sm text-[var(--color-bg)]/40 mb-8">{neutralStatement}</p>
    <h2 class="font-drama italic text-[clamp(2.5rem,6vw,5.5rem)] leading-tight text-[var(--color-bg)]">
      {boldStatementParts.before}{' '}
      <span class="text-[var(--color-accent)]">{boldStatementParts.accent}</span>{' '}
      {boldStatementParts.after}
    </h2>
  </div>
</section>

<script>
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);
  document.addEventListener('astro:page-load', () => {
    const ctx = gsap.context(() => {
      // Parallax on texture
      gsap.to('.philosophy-texture', {
        yPercent: -20,
        scrollTrigger: { trigger: 'section[data-philosophy]', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      // Word-by-word reveal on headline
      const headline = document.querySelector('[data-philosophy-headline]');
      if (headline) {
        const words = headline.textContent?.split(' ') ?? [];
        headline.innerHTML = words.map(w => `<span class="inline-block opacity-0 translate-y-[20px]">${w}&nbsp;</span>`).join('');
        gsap.to('[data-philosophy-headline] span', {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out',
          scrollTrigger: { trigger: headline, start: 'top 80%' },
        });
      }
    });
    document.addEventListener('astro:after-swap', () => ctx.revert(), { once: true });
  });
</script>
```

---

### Protocol.astro

Three full-screen stacking sections. Full GSAP stacking implementation:

```astro
<script>
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener('astro:page-load', () => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]');
      cards.forEach((card, i) => {
        ScrollTrigger.create({ trigger: card, start: 'top top', pin: true, pinSpacing: false });
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.9, filter: 'blur(6px)', opacity: 0.4,
            scrollTrigger: { trigger: cards[i + 1], start: 'top center', end: 'top top', scrub: true },
          });
        }
      });
    });
    document.addEventListener('astro:after-swap', () => ctx.revert(), { once: true });
  });
</script>
```

Each `data-stack-card` section is `100dvh` with a background image at `opacity-20`, step number in `font-mono text-[var(--color-accent)]`, title in `font-heading`, and 2-line description. Each card also has a unique inline SVG animation (rotating circles, scanning laser, EKG stroke-dashoffset).

---

### Pricing.astro, Footer.astro

**Pricing:** Three-tier grid. Middle card: `bg-[var(--color-primary)] text-[var(--color-bg)] scale-[1.04] ring-2 ring-[var(--color-accent)]`. Tiers: Essential, Performance, Enterprise (adapt names to brand).

**Footer:** `bg-[var(--color-primary)] rounded-t-[4rem] text-[var(--color-bg)] py-16 px-8`. Three columns: brand+tagline left, nav links center, legal+social right. Include pulsing green dot + `font-mono text-xs text-green-400` "System Operational" status.

---

## Phase 8c: Contact API Route

Write `src/pages/api/contact.ts`. Replace `BRAND_NAME` with the actual brand name and `DOMAIN_URL` with the actual domain (from the orchestrator's spawn prompt) before writing the file.

```typescript
import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' }

  try {
    const body = await request.json()
    const { name, email, phone, message, _gotcha } = body as Record<string, string>

    // Honeypot: bots fill hidden fields, humans don't. Silently succeed to avoid training bots.
    if (_gotcha) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), { status: 400, headers })
    }

    const resendKey = import.meta.env.RESEND_API_KEY as string | undefined
    const contactEmail = import.meta.env.CONTACT_EMAIL as string | undefined

    if (!resendKey || !contactEmail) {
      console.log('[contact] RESEND not configured. Submission:', { name, email, phone, message })
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
    }

    const ownerHtml = `
      <h2>New contact from BRAND_NAME website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `

    const confirmHtml = `
      <h2>Thanks for reaching out, ${name}.</h2>
      <p>We received your message and will be in touch within 24 hours.</p>
      <p>Here is a copy of what you sent:</p>
      <blockquote style="border-left: 3px solid #ccc; padding-left: 1rem; color: #555; margin: 1rem 0;">
        ${message.replace(/\n/g, '<br>')}
      </blockquote>
      <p>Talk soon,<br>The BRAND_NAME team</p>
    `

    // Send both emails in parallel
    const [ownerRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'BRAND_NAME <noreply@DOMAIN_URL>',
          to: [contactEmail],
          reply_to: email,
          subject: `New enquiry from ${name}`,
          html: ownerHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'BRAND_NAME <noreply@DOMAIN_URL>',
          to: [email],
          reply_to: contactEmail,
          subject: `We received your message`,
          html: confirmHtml,
        }),
      }),
    ])

    if (!ownerRes.ok) {
      console.error('[contact] Resend error:', ownerRes.status, await ownerRes.text())
      return new Response(JSON.stringify({ error: 'Failed to send. Please try again.' }), { status: 500, headers })
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500, headers })
  }
}
```

**Important:** Replace `BRAND_NAME` with the actual brand name (e.g., `Nura Health`) and `DOMAIN_URL` with the bare domain without `https://` (e.g., `nurahealth.com`). The `from` field must use a domain that will be verified in Resend.

---

## Phase 9: All Pages With Schema

Every page imports its schema builder and passes the result to BaseLayout. Non-negotiable.

```astro
---
// src/pages/index.astro — example
import BaseLayout from '../layouts/BaseLayout.astro';
import { homePageSchema } from '../lib/schema';
import { brand } from '../data/brand';
import Navbar from '../components/sections/Navbar.astro';
import Hero from '../components/sections/Hero.astro';
import Features from '../components/sections/Features.astro';
import Philosophy from '../components/sections/Philosophy.astro';
import Protocol from '../components/sections/Protocol.astro';
import Pricing from '../components/sections/Pricing.astro';
import Footer from '../components/sections/Footer.astro';

const schema = homePageSchema(brand, '/images/og-default.webp');
const title = `${brand.name} — ${brand.tagline}`;
const description = `${brand.description} ${brand.cta} today.`;
---
<BaseLayout {title} {description} schema={schema}>
  <Navbar />
  <Hero />
  <Features />
  <Philosophy />
  <Protocol />
  <Pricing />
  <Footer />
</BaseLayout>
```

Repeat the pattern for every page. Schema function mapping:

| Page file | Schema function | Title pattern |
|-----------|----------------|---------------|
| `index.astro` | `homePageSchema(brand, ogImage)` | `Brand — Tagline` |
| `about.astro` | `aboutPageSchema(brand)` | `About — Brand` |
| `contact.astro` | `contactPageSchema(brand)` | `Contact — Brand` |
| `services.astro` | `servicesPageSchema(brand, servicesForSchema)` | `Services — Brand` |
| `pricing.astro` | `pricingPageSchema(brand, tiers)` | `Pricing — Brand` |
| `blog/index.astro` | `blogIndexSchema(brand)` | `Blog — Brand` |
| `blog/[slug].astro` | `blogPostSchema(brand, post)` + `breadcrumbSchema(...)` | `Post Title — Brand` |

Create 2-3 real blog posts as `.md` files in `src/content/blog/` using the brand's industry for topic relevance.

### Contact Page Form

When writing `contact.astro`, include a `Phone` field (optional, between Email and Message) and wire the form to the real API route with loading and error states. The form must have `id="contact-form"` and a status `<p id="form-status">` element. Replace `CTA_TEXT` with the actual CTA text from the spawn prompt.

```html
<form id="contact-form" class="space-y-6">
  <div>
    <label for="name" class="block text-sm font-semibold mb-2">Name</label>
    <input id="name" name="name" type="text" required
      class="w-full px-4 py-3 rounded-xl border border-[var(--color-dark)]/15 bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
  </div>
  <div>
    <label for="email" class="block text-sm font-semibold mb-2">Email</label>
    <input id="email" name="email" type="email" required
      class="w-full px-4 py-3 rounded-xl border border-[var(--color-dark)]/15 bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
  </div>
  <div>
    <label for="phone" class="block text-sm font-semibold mb-2">Phone <span class="font-normal opacity-50">(optional)</span></label>
    <input id="phone" name="phone" type="tel"
      class="w-full px-4 py-3 rounded-xl border border-[var(--color-dark)]/15 bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
  </div>
  <div>
    <label for="message" class="block text-sm font-semibold mb-2">Message</label>
    <textarea id="message" name="message" rows="5" required
      class="w-full px-4 py-3 rounded-xl border border-[var(--color-dark)]/15 bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"></textarea>
  </div>
  <!-- Honeypot: hidden from humans, bots fill it. Must stay empty for submission to proceed. -->
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true" />
  <button type="submit"
    class="btn-magnetic w-full bg-[var(--color-accent)] text-white px-8 py-4 rounded-full font-semibold text-lg">
    <span class="relative z-10">CTA_TEXT</span>
    <span class="btn-bg bg-[var(--color-dark)] rounded-full"></span>
  </button>
  <p id="form-status" class="hidden text-center text-sm font-medium"></p>
</form>
```

Form script (in a `<script>` tag at the bottom of `contact.astro`):

```typescript
const form = document.getElementById('contact-form') as HTMLFormElement
const status = document.getElementById('form-status')
const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement

form?.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (!submitBtn || !status) return

  submitBtn.disabled = true
  submitBtn.querySelector('span.relative')!.textContent = 'Sending...'
  status.classList.add('hidden')

  const data = Object.fromEntries(new FormData(form))

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok || json.error) {
      status.textContent = json.error || 'Something went wrong. Please try again.'
      status.style.color = 'var(--color-accent)'
      status.classList.remove('hidden')
    } else {
      status.textContent = 'Message sent! We will be in touch within 24 hours.'
      status.style.color = 'var(--color-accent)'
      status.classList.remove('hidden')
      form.reset()
    }
  } catch {
    status.textContent = 'Network error. Please check your connection and try again.'
    status.style.color = 'var(--color-accent)'
    status.classList.remove('hidden')
  } finally {
    submitBtn.disabled = false
    submitBtn.querySelector('span.relative')!.textContent = 'CTA_TEXT'
  }
})
```

Replace `CTA_TEXT` with the actual CTA text from the spawn prompt (e.g., "Book a free consultation").

---

## Phase 9b: Environment Files

Write `.env.example` (documents required secrets for contributors):

```
# Contact form email notifications (via Resend)
# See: https://resend.com > API Keys
RESEND_API_KEY=re_your_key_here

# Email address that receives contact form submissions
CONTACT_EMAIL=your@email.com
```

Read `.gitignore` if it exists, then ensure `.env` is listed. If no `.gitignore` exists, create one:

```
# Dependencies
node_modules/

# Build output
dist/

# Environment variables (never commit)
.env
.env.local
.dev.vars
```

---

## Phase 9c: 404 Page

Write `src/pages/404.astro`. Astro and Cloudflare Pages both serve this automatically for any unmatched URL.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/sections/Navbar.astro';
import Footer from '../components/sections/Footer.astro';
import { brand } from '../data/brand';
import { Icon } from 'astro-icon/components';
---
<BaseLayout
  title={`Page Not Found — ${brand.name}`}
  description="The page you're looking for doesn't exist."
>
  <Navbar />
  <main class="min-h-[70vh] flex items-center justify-center px-8 py-32">
    <div class="text-center max-w-lg">
      <p class="font-mono text-[var(--color-accent)] text-sm tracking-widest mb-4">404</p>
      <h1 class="font-drama italic text-[clamp(2.5rem,6vw,4.5rem)] leading-tight mb-6">
        Page not found.
      </h1>
      <p class="opacity-60 mb-10 text-lg">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <a href="/" class="btn-magnetic inline-flex bg-[var(--color-accent)] text-white px-8 py-4 rounded-full font-semibold text-lg">
        <span class="relative z-10 flex items-center gap-2">
          Back to home <Icon name="ph:arrow-right-bold" class="size-5" />
        </span>
        <span class="btn-bg bg-[var(--color-dark)] rounded-full"></span>
      </a>
    </div>
  </main>
  <Footer />
</BaseLayout>
```

---

## Phase 10: Final Build Check

```bash
npm run build
```

Resolve every error before completing. Common errors and fixes:

| Error | Fix |
|-------|-----|
| `@utility ... :hover` | Move hover state to `@layer components` |
| `entry.render is not a function` | Use `render(entry)` from `astro:content` |
| `output: 'hybrid' not supported` | Change to `output: 'static'` |
| `Cannot find module '...icon'` | Run `npm install -D @iconify-json/phosphor @iconify-json/lucide` |
| `SITE is not defined` | Add `site:` to `astro.config.mjs` |
| Image not found | Verify `.webp` file exists in `public/images/` |

---

## Completion Report

Output:
```
Builder Complete
===============
Pages created:   index, about, contact, services, pricing, blog/index, blog/[slug] (2 posts)
Images created:  hero-bg.webp (2K), texture-bg.webp (1K), protocol-1/2/3.webp (1K), og-default.webp (2K)
Components:      Navbar, Hero, Features, Philosophy, Protocol, Pricing, Footer
Schema:          All 7 page types covered
Build result:    PASS / [errors listed]
```
