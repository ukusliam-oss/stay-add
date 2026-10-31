import { defineConfig } from 'astro/config';
import { BASE_PATH, SITE_ORIGIN } from './src/config/site.ts';
export default defineConfig({
  site: SITE_ORIGIN,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false }
});
