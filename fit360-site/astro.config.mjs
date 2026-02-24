import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://fit360.studio',
  output: 'server',
  trailingSlash: 'always',
  integrations: [
    icon({
      iconDir: 'src/icons',
      include: {
        ph: ['*'],
        lucide: ['*'],
      },
    }),
    sitemap({
      filter: (page) => !page.includes('/api/'),
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        const url = item.url;
        if (url.replace(/\/$/, '') === 'https://fit360.studio') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (
          url.includes('/personal-training') ||
          url.includes('/nutrition-coaching') ||
          url.includes('/exercise-specialist') ||
          url.includes('/private-studio') ||
          url.includes('/home-training') ||
          url.includes('/pcod-reversal') ||
          url.includes('/diabetes-reversal') ||
          url.includes('/arthritis-relief') ||
          url.includes('/sciatica-pain-relief') ||
          url.includes('/slip-disc-back-pain') ||
          url.includes('/spondylitis-management')
        ) {
          item.priority = 0.9;
        } else if (url.includes('/about') || url.includes('/contact')) {
          item.priority = 0.8;
        } else if (url.includes('/blog')) {
          item.priority = 0.6;
        }
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  adapter: cloudflare(),
});
