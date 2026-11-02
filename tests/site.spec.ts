import { test, expect } from '@playwright/test';

const stories = ['canva-ai', 'affinity', 'brand-kits', 'process-mining', 'preqin', 'barclays-bpay'];
const tabs = [
  ['Home', '/'],
  ['Work', '/work'],
  ['About', '/about'],
  ['Contact', '/contact'],
] as const;

test.describe('tabs', () => {
  test('each tab opens its page and is highlighted there', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const [label, path] of tabs) {
      await nav.getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`${path === '/' ? '/' : path}$`));
      await expect(nav.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    }
  });

  test('Work stays highlighted on a story page', async ({ page }) => {
    await page.goto('/work/affinity');
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
  });

  test('the tabs stay pinned at the top while scrolling', async ({ page }) => {
    await page.goto('/work');
    await page.mouse.wheel(0, 2000);
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Contact' })).toBeInViewport();
  });
});

test.describe('home', () => {
  test('shows the headline and three featured projects', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/I help teams ship software\s*they can trust\./);
    await expect(page.locator('.tile')).toHaveCount(3);
  });

  test('"All six projects" and "See the work" go to the Work page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /All six projects/ }).click();
    await expect(page).toHaveURL(/\/work$/);
    await page.goto('/');
    await page.getByRole('link', { name: 'See the work' }).click();
    await expect(page).toHaveURL(/\/work$/);
  });
});

test.describe('work', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work');
  });

  test('lists all six projects', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: "Six launches I'm proud of" })).toBeVisible();
    await expect(page.locator('.tile')).toHaveCount(6);
    await expect(page.locator('.tile').first()).toContainText('Canva AI');
  });

  test('filter chips show only matching projects', async ({ page }) => {
    await page.getByRole('button', { name: 'payments' }).click();
    await expect(page.locator('.tile:visible')).toHaveCount(1);
    await expect(page.locator('.tile:visible')).toContainText('Barclays UK');
    await expect(page.getByRole('button', { name: 'payments' })).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'all', exact: true }).click();
    await expect(page.locator('.tile:visible')).toHaveCount(6);
  });

  test('clicking a card opens its story', async ({ page }) => {
    await page.getByRole('link', { name: /Affinity's website/ }).click();
    await expect(page).toHaveURL(/\/work\/affinity$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText("Affinity's website");
  });
});

test.describe('story pages', () => {
  for (const slug of stories) {
    test(`${slug} has a headline and "What I built"`, async ({ page }) => {
      const res = await page.goto(`/work/${slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'What I built' })).toBeVisible();
    });
  }

  test('Canva AI story includes the eval coverage table', async ({ page }) => {
    await page.goto('/work/canva-ai');
    const table = page.getByRole('table', { name: 'Eval coverage' });
    await expect(table).toBeVisible();
    await expect(table.getByRole('rowheader')).toHaveCount(4);
  });

  test('Next and Previous move between stories', async ({ page }) => {
    await page.goto('/work/canva-ai');
    await expect(page.getByRole('link', { name: /Previous/ })).toHaveCount(0);
    await page.getByRole('link', { name: /Next/ }).click();
    await expect(page).toHaveURL(/\/work\/affinity$/);
    await page.getByRole('link', { name: /Previous/ }).click();
    await expect(page).toHaveURL(/\/work\/canva-ai$/);
  });
});

test.describe('about', () => {
  test('shows career, tools and talks', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1, name: 'Five suites, ten years' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tools I reach for' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'On stage and in the room' })).toBeVisible();
  });
});

test('unknown pages show the 404 page', async ({ page }) => {
  const res = await page.goto('/no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("This page didn't pass.");
});

test('the light/dark choice carries across pages and reloads', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: 'Light' }).click();
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Work' }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('no horizontal scrolling on any page', async ({ page }) => {
  for (const path of ['/', '/work', '/about', '/contact', ...stories.map((s) => `/work/${s}`)]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
