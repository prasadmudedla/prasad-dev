import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Accessibility checks with axe, in both colour modes.
// The violation count is recorded so the footer can show it (see scripts/write-ci.mjs).
for (const theme of ['dark', 'light'] as const) {
  test(`no accessibility violations @a11y (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('prasad-theme', t), theme);
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    test.info().annotations.push({ type: 'axe-violations', description: String(results.violations.length) });

    const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`);
    expect(summary, summary.join('\n')).toEqual([]);
  });
}
