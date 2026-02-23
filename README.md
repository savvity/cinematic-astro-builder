# Cinematic Astro Site Builder

A Claude Code multi-agent toolkit that builds a complete, production-ready website in a single session. Answer 5 questions and get a deployed site with a CMS.

---

## What it builds

- **Astro 5** static site with cinematic animations (GSAP + ScrollTrigger)
- **Tailwind CSS v4** with a full design system (4 aesthetic presets)
- **Payload CMS** headless backend deployed to Railway
- **AI-generated images** via Nano Banana Pro, all converted to WebP
- **JSON-LD schema** on every page (Organization, BlogPosting, FAQPage, etc.)
- **Full SEO audit and auto-fix** pass before deployment
- **Deployed** to Cloudflare Pages with one command

---

## Prerequisites

Just one: **Claude Code** (the CLI tool from Anthropic).

Everything else (Node.js, GitHub CLI, Wrangler, Railway CLI, uv) is checked automatically when you start. If anything is missing, you get the exact install command.

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

You will be asked 5 questions:
1. Brand name and one-line purpose
2. Aesthetic preset (A, B, C, or D)
3. Three key value propositions
4. Primary call to action
5. Domain name

Then sit back. Five agents build, connect, audit, fix, and deploy the site automatically.

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
| `01-builder` | Scaffolds the Astro project, generates all images, wires GSAP animations, writes all JSON-LD schemas, builds every page |
| `02-cms-builder` | Sets up Payload CMS with 5 collections, deploys to Railway with PostgreSQL |
| `03-connector` | Creates a typed REST client that connects the Astro site to the CMS with local data fallbacks |
| `04-seo-auditor` | Runs 10 SEO checks (meta descriptions, titles, H1s, image formats, schema, OG tags, canonicals, content uniqueness, links, sitemap) and writes a structured report |
| `05-seo-fixer` | Reads the audit report and fixes every failure before the final build |

---

## Tech stack

- Astro 5 (static output, content collections, file-based routing)
- Tailwind CSS v4 (no config file, all tokens in `@theme`)
- GSAP 3 + ScrollTrigger (stacking cards, word reveals, staggered entrances)
- Phosphor Icons via astro-icon (9000+ icons, 6 weight variants)
- Payload CMS 3 (headless, PostgreSQL, REST API)
- Railway (CMS hosting, managed PostgreSQL)
- Cloudflare Pages (site hosting, global CDN)
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
