# Cinematic Astro Site Builder

A Claude Code multi-agent toolkit that builds a complete, production-ready business website in a single session. Answer 7 questions and get a deployed site with real contact form, AI-generated images, full SEO, and optional CMS.

---

## What it builds

- **Astro 5** static site with cinematic animations (GSAP + ScrollTrigger)
- **Tailwind CSS v4** with a full design system (4 aesthetic presets)
- **6 AI-generated images** via Nano Banana Pro (Gemini), all converted to WebP
- **Working contact form** — validates input, sends email via Resend, sends confirmation to the visitor, includes honeypot spam protection
- **Custom 404 page** matching the site design
- **JSON-LD schema** on every page (Organization, WebPage, BlogPosting, FAQPage, BreadcrumbList, etc.)
- **Full SEO audit and auto-fix** pass before deployment
- **Optional Keystatic CMS** for editing content after launch (no code needed, runs on Cloudflare)
- **Deployed** to Cloudflare Pages with one command

---

## Prerequisites

Just one: **Claude Code** (the CLI tool from Anthropic).

Everything else (Node.js, GitHub CLI, Wrangler, uv) is checked automatically when you start. If anything is missing, you get the exact install command.

Get Claude Code: https://claude.ai/code

---

## Getting started

```bash
# 1. Clone this repo
git clone https://github.com/savvity/cinematic-astro-builder.git

# 2. Open the folder in Claude Code
cd cinematic-astro-builder
claude .

# 3. Say "build" — the wizard takes it from there
```

You will be asked 7 questions:

1. Brand name and one-line purpose
2. Aesthetic preset (A, B, C, or D)
3. Three key value propositions
4. Primary call to action
5. Domain name
6. Whether you want a CMS
7. Email address for contact form notifications

Then sit back. The agents build, connect, audit, fix, and deploy the site automatically.

---

## Aesthetic presets

| Preset | Feel | Colors | Fonts |
|--------|------|--------|-------|
| A: Organic Tech | Clinical boutique | Moss + Clay | Plus Jakarta Sans + Cormorant Garamond |
| B: Midnight Luxe | Dark editorial | Obsidian + Champagne | Inter + Playfair Display |
| C: Brutalist Signal | Raw precision | Paper + Signal Red | Space Grotesk + DM Serif Display |
| D: Vapor Clinic | Neon biotech | Deep Void + Plasma | Sora + Instrument Serif |

---

## The agents

| Agent | Role |
|-------|------|
| `01-builder` | Scaffolds the Astro project, generates all images, wires GSAP animations, writes JSON-LD schemas, builds every page, sets up the contact API route and 404 page |
| `02-cms-builder` | Sets up Keystatic CMS with collections for posts, services, testimonials, and pricing — hosted on Cloudflare, no separate server needed |
| `03-connector` | Updates Astro pages to read content from Keystatic instead of static data files |
| `04-seo-auditor` | Runs 10 SEO checks (meta descriptions, titles, H1s, image formats, schema, OG tags, canonicals, content uniqueness, links, sitemap) and writes a structured report |
| `05-seo-fixer` | Reads the audit report and fixes every failure before the final build |

---

## Contact form

The contact form is built and wired automatically. To activate email delivery after deployment:

1. Create a free account at https://resend.com
2. Verify your domain (adds DNS records — takes 5-30 minutes)
3. Get your API key from the Resend dashboard
4. Set two secrets in Cloudflare Pages:

```bash
wrangler pages secret put RESEND_API_KEY --project-name=your-site
wrangler pages secret put CONTACT_EMAIL --project-name=your-site
```

Until the secrets are set, form submissions are logged server-side and the visitor still sees a success message. No crashes, no broken experience.

---

## Tech stack

- Astro 5 (static output, Cloudflare adapter, content collections)
- Tailwind CSS v4 (no config file, all tokens in `@theme`)
- GSAP 3 + ScrollTrigger (stacking cards, word reveals, staggered entrances)
- Phosphor Icons via astro-icon (9000+ icons, 6 weight variants)
- Resend (transactional email for contact form)
- Keystatic CMS (optional, file-based, runs on Cloudflare)
- Cloudflare Pages (hosting, global CDN, serverless API routes)
- Nano Banana Pro / Gemini 3 Pro Image (AI image generation, bundled in this repo)

---

## Project structure

```
cinematic-astro-builder/
├── CLAUDE.md                    # Orchestrator — entry point for Claude Code
├── nano-banana-pro-skill/       # Bundled image generation skill
│   └── scripts/
│       └── generate_image.py
└── .claude/
    └── agents/
        ├── 01-builder.md
        ├── 02-cms-builder.md
        ├── 03-connector.md
        ├── 04-seo-auditor.md
        └── 05-seo-fixer.md
```

---

## License

MIT
