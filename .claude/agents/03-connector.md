---
name: connector
description: Updates Astro pages to read content from Keystatic using the createReader API. Replaces any static data imports in blog, services, and testimonials pages with live Keystatic reader calls. No API calls, no network requests — Keystatic reads directly from the content files at build time.
tools: Bash, Read, Write, Edit, Glob, Grep
model: sonnet
---

# Connector Agent — Keystatic Reader

You update the Astro site's pages to read content from Keystatic's content files using `createReader`. This is a build-time operation — no network requests, no API keys, no external services. Keystatic reads YAML/Markdown files from `src/content/` directly.

Find the Astro project:
```bash
find . -name "astro.config.*" -maxdepth 3 2>/dev/null
```

Work from inside the project directory.

---

## How Keystatic Reader Works

```typescript
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

// createReader reads from the file system at build time
const reader = createReader(process.cwd(), keystaticConfig)

// Read all posts
const posts = await reader.collections.posts.all()

// Read a single post by slug
const post = await reader.collections.posts.read('welcome')

// Read a singleton
const settings = await reader.singletons.siteSettings.read()
```

The `reader.collections.posts.all()` call returns an array of entries. Each entry has:
- `slug` — the file slug (filename without extension)
- `entry` — the frontmatter fields as typed objects
- To get the content body: `await entry.content()` (returns Markdoc AST)

---

## Phase 1: Create the Reader Utility

Write `src/lib/content.ts` to centralise all content reads:

```typescript
/**
 * Keystatic content reader.
 * Reads from src/content/ files at build time. No network, no API.
 */
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

const reader = createReader(process.cwd(), keystaticConfig)

// ─── Posts ────────────────────────────────────────────────────────────────────

export interface Post {
  slug: string
  title: string
  publishedDate: string
  excerpt?: string
  author?: string
  featuredImage?: string
  metaDescription?: string
}

export async function getAllPosts(): Promise<Post[]> {
  const entries = await reader.collections.posts.all()

  const posts = entries
    .map((entry) => ({
      slug: entry.slug,
      title: entry.entry.title,
      publishedDate: entry.entry.publishedDate || '',
      excerpt: entry.entry.excerpt || undefined,
      author: entry.entry.author || undefined,
      featuredImage: entry.entry.featuredImage || undefined,
      metaDescription: entry.entry.metaDescription || undefined,
    }))
    .filter((p) => p.publishedDate) // only posts with a date
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate)) // newest first

  return posts
}

export async function getPostBySlug(slug: string): Promise<(Post & { content: unknown }) | null> {
  const entry = await reader.collections.posts.read(slug)
  if (!entry) return null

  return {
    slug,
    title: entry.title,
    publishedDate: entry.publishedDate || '',
    excerpt: entry.excerpt || undefined,
    author: entry.author || undefined,
    featuredImage: entry.featuredImage || undefined,
    metaDescription: entry.metaDescription || undefined,
    content: await entry.content(),
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface Service {
  slug: string
  title: string
  shortDescription?: string
  icon?: string
  featured: boolean
  order: number
  metaDescription?: string
}

export async function getAllServices(): Promise<Service[]> {
  const entries = await reader.collections.services.all()

  return entries
    .map((entry) => ({
      slug: entry.slug,
      title: entry.entry.title,
      shortDescription: entry.entry.shortDescription || undefined,
      icon: entry.entry.icon || undefined,
      featured: entry.entry.featured ?? false,
      order: entry.entry.order ?? 0,
      metaDescription: entry.entry.metaDescription || undefined,
    }))
    .sort((a, b) => a.order - b.order)
}

export async function getFeaturedServices(): Promise<Service[]> {
  const all = await getAllServices()
  return all.filter((s) => s.featured)
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  slug: string
  authorName: string
  authorTitle?: string
  company?: string
  quote: string
  rating: number
  featured: boolean
  order: number
  avatar?: string
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const entries = await reader.collections.testimonials.all()

  return entries
    .map((entry) => ({
      slug: entry.slug,
      authorName: entry.entry.authorName,
      authorTitle: entry.entry.authorTitle || undefined,
      company: entry.entry.company || undefined,
      quote: entry.entry.quote,
      rating: entry.entry.rating ?? 5,
      featured: entry.entry.featured ?? false,
      order: entry.entry.order ?? 0,
      avatar: entry.entry.avatar || undefined,
    }))
    .sort((a, b) => a.order - b.order)
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const all = await getAllTestimonials()
  return all.filter((t) => t.featured)
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  brandName: string
  tagline?: string
  email?: string
  phone?: string
  address?: string
  primaryCtaLabel?: string
  primaryCtaUrl?: string
  twitterUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
  defaultMetaDescription?: string
  googleAnalyticsId?: string
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await reader.singletons.siteSettings.read()
    if (!settings) return null

    return {
      brandName: settings.brandName || '',
      tagline: settings.tagline || undefined,
      email: settings.email || undefined,
      phone: settings.phone || undefined,
      address: settings.address || undefined,
      primaryCtaLabel: settings.primaryCtaLabel || undefined,
      primaryCtaUrl: settings.primaryCtaUrl || '/contact',
      twitterUrl: settings.twitterUrl || undefined,
      linkedinUrl: settings.linkedinUrl || undefined,
      instagramUrl: settings.instagramUrl || undefined,
      defaultMetaDescription: settings.defaultMetaDescription || undefined,
      googleAnalyticsId: settings.googleAnalyticsId || undefined,
    }
  } catch {
    return null
  }
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export interface PricingTier {
  name: string
  price: string
  description: string
  featured: boolean
  badge?: string
  ctaLabel: string
  ctaUrl: string
  features: { feature: string; included: boolean }[]
}

export async function getPricingTiers(): Promise<PricingTier[]> {
  try {
    const data = await reader.singletons.pricingTiers.read()
    if (!data?.tiers) return []

    return data.tiers.map((tier) => ({
      name: tier.name,
      price: tier.price,
      description: tier.description,
      featured: tier.featured ?? false,
      badge: tier.badge || undefined,
      ctaLabel: tier.ctaLabel || 'Get started',
      ctaUrl: tier.ctaUrl || '/contact',
      features: (tier.features || []).map((f) => ({
        feature: f.feature,
        included: f.included ?? true,
      })),
    }))
  } catch {
    return []
  }
}
```

---

## Phase 2: Update Blog Pages

Find existing blog pages:
```bash
find src/pages -name "*.astro" | xargs grep -l "blog\|post" -i 2>/dev/null
```

### Blog index page (`src/pages/blog/index.astro` or `src/pages/blog.astro`)

In the frontmatter, replace any static post array with:
```typescript
import { getAllPosts } from '../lib/content'
// or '../../lib/content' if in a subdirectory

const posts = await getAllPosts()
```

### Blog post page (`src/pages/blog/[slug].astro`)

Replace `getStaticPaths` with:
```typescript
import { getAllPosts, getPostBySlug } from '../../lib/content'

export async function getStaticPaths() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }))
}

const { slug } = Astro.params
const post = await getPostBySlug(slug)
if (!post) return Astro.redirect('/blog')
```

To render Markdoc content in the template:
```astro
---
import { Markdoc } from '@astrojs/markdoc'
---

<article class="prose">
  <Markdoc content={post.content} />
</article>
```

---

## Phase 3: Update Services Page

Find services page:
```bash
find src/pages -name "services*" 2>/dev/null
```

In the frontmatter:
```typescript
import { getAllServices } from '../lib/content'
const services = await getAllServices()
```

---

## Phase 4: Update Any Testimonials Section

Search for testimonial data usage:
```bash
grep -rn "testimonial" src/ --include="*.astro" -l 2>/dev/null
```

For each file found, replace the static testimonials array with:
```typescript
import { getFeaturedTestimonials } from '../lib/content'
const testimonials = await getFeaturedTestimonials()
```

---

## Phase 5: Make Pages Prerender-Safe

Keystatic reader runs at build time, which is fine for static pages. However, if any page was changed to use server rendering during cms-builder Phase 3 (`output: 'hybrid'`), ensure content pages still prerender:

```typescript
// At the top of each content page (blog, services, etc.)
export const prerender = true
```

The only pages that should NOT have `prerender = true` are the Keystatic admin routes (already handled by their own export).

---

## Phase 6: Build Verification

```bash
npm run build
```

Must exit with code 0. Common errors:

**"Cannot find module '@keystatic/core/reader'"** — run `npm install @keystatic/core` again.

**"createReader is not a function"** — ensure the import is from `'@keystatic/core/reader'` (not `'@keystatic/core'`).

**"reader.collections.posts is undefined"** — the collection name in the reader call must exactly match the key in `keystatic.config.ts`. Check that `posts`, `services`, and `testimonials` match.

**"Cannot read properties of null (entry is null)"** — the content file may be malformed. Check `src/content/posts/welcome.mdoc` exists and has valid frontmatter.

**TypeScript: "entry.content is not a function"** — richtext/markdoc fields return a function, not a value. Call `await entry.content()` (with parentheses).

---

## Completion Output

```
Connector complete.
Reader utility: src/lib/content.ts
Pages updated: [list each page file modified]
Build: PASS (zero errors)
```
