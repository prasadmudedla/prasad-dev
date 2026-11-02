/** Helpers for the project stories in src/content/work/. */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Story = CollectionEntry<'work'>;

/** "01-canva-ai" → "canva-ai". The number in the filename only keeps the folder tidy. */
export const slugOf = (story: Story) => story.id.replace(/^\d+-/, '');

/** The story's own page, e.g. /work/canva-ai */
export const storyUrl = (story: Story) => `/work/${slugOf(story)}`;

/** Every published story, in `order`. */
export async function getStories() {
  return (await getCollection('work', ({ data }) => !data.draft)).sort((a, b) => a.data.order - b.data.order);
}

const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
/** 6 → "Six" */
export const countWord = (n: number) => words[n] ?? String(n);
