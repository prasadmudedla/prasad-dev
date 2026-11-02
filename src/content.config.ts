/**
 * Shape of a project story (src/content/work/*.mdx).
 * If a file is missing a field or has a typo, `npm run dev` / `npm run build` tells you which one.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    /** Position on the page: 1 = first. */
    order: z.number(),
    /** Shown in the card's top bar, e.g. "canva-ai.spec". */
    spec: z.string(),
    client: z.string(),
    org: z.string(),
    years: z.string(),
    status: z.enum(['running', 'launched', 'shipped']),
    /** Big card heading. */
    headline: z.string(),
    /** One or two sentences of background under the heading. */
    context: z.string(),
    /** Small tool tags under the context. */
    stack: z.array(z.string()),
    /** Which filter chips show this card. Values must exist in workFilters (src/data/profile.ts). */
    filters: z.array(z.string()),
    /** The lead story gets a larger heading. */
    lead: z.boolean().default(false),
    /** Set to true to hide a story without deleting it. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { work };
