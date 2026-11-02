import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Accessibility checks with axe on every page, in both colour modes.
// The violation count is recorded so the footer can show it (see scripts/write-ci.mjs).
const pages = [
  '/', '/work', '/about', '/contact',
  '/work/canva-ai', '/work/affinity', '/work/brand-kits', '/work/process-mining', '/work/preqin', '/work/barclays-bpay',
];

for (const theme of ['dark', 'light'] as const) {
  for (const path of pages) {
    test(`no accessibility violations @a11y ${path} (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('prasad-theme', t), theme);
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      test.info().annotations.push({ type: 'axe-violations', description: String(results.violations.length) });

      const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`);
      expect(summary, summary.join('\n')).toEqual([]);
    });
  }
}
