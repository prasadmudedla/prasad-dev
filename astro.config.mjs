// @ts-check
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://prasad.dev',

  // Every page is static HTML. Only src/pages/api/contact.ts runs on the server
  // (it opts out with `export const prerender = false`).
  output: 'static',
  adapter: vercel(),
  integrations: [mdx()],

  // Secrets for the contact form. Set them in .env locally and in Vercel → Settings → Environment Variables.
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
