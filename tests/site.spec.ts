import { test, expect } from '@playwright/test';

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the headline and the six project stories', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/I help teams ship software\s*they can trust\./);
    await expect(page.getByRole('heading', { name: "Six launches I'm proud of" })).toBeVisible();
    await expect(page.locator('.story')).toHaveCount(6);
    await expect(page.locator('.story').first()).toContainText('Canva AI');
  });

  test('each story has a "What I built" section', async ({ page }) => {
    const stories = page.locator('.story');
    for (let i = 0; i < (await stories.count()); i++) {
      await expect(stories.nth(i).getByText('What I built')).toBeVisible();
    }
  });

  test('Canva AI story includes the eval coverage table', async ({ page }) => {
    const table = page.getByRole('table', { name: 'Eval coverage' });
    await expect(table).toBeVisible();
    await expect(table.getByRole('rowheader')).toHaveCount(4);
  });

  test('filter chips show only matching projects', async ({ page }) => {
    await page.getByRole('button', { name: 'payments' }).click();
    await expect(page.locator('.story:visible')).toHaveCount(1);
    await expect(page.locator('.story:visible')).toContainText('Barclays UK');
    await expect(page.getByRole('button', { name: 'payments' })).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'all', exact: true }).click();
    await expect(page.locator('.story:visible')).toHaveCount(6);
  });

  test('nav links jump to their sections', async ({ page, isMobile }) => {
    test.skip(isMobile, 'nav links are hidden on small screens');
    for (const [link, id] of [['Work', 'work'], ['Career', 'career'], ['Talks', 'talks'], ['Contact', 'contact']]) {
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: link }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test('dark by default, and the light/dark choice is remembered', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.getByRole('button', { name: 'Light' }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('no horizontal scrolling', async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
