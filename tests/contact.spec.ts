import { test, expect } from '@playwright/test';

test.describe('contact form (UI)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact');
  });

  test('asks for missing fields instead of sending', async ({ page }) => {
    let called = false;
    await page.route('**/api/contact', (route) => { called = true; return route.abort(); });

    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('status')).toHaveText(/Add your name, a valid email and a message/);
    await expect(page.getByLabel('Your email')).toHaveAttribute('aria-invalid', 'true');
    expect(called).toBe(false);
  });

  test('sends the message and confirms', async ({ page }) => {
    // The API is mocked here, so no real email is sent.
    let sent: Record<string, string> | undefined;
    await page.route('**/api/contact', async (route) => {
      sent = route.request().postDataJSON();
      await route.fulfill({ status: 200, json: { ok: true } });
    });

    await page.getByLabel('Name').fill('Test Person');
    await page.getByLabel('Your email').fill('test@example.com');
    await page.getByLabel('Message').fill('Hello from Playwright');
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByRole('status')).toHaveText(/your message is in my inbox/);
    expect(sent).toMatchObject({ name: 'Test Person', email: 'test@example.com', message: 'Hello from Playwright' });
    await expect(page.getByLabel('Name')).toHaveValue('');
  });

  test('shows the server error if sending fails', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 502, json: { error: 'Could not send right now. Please try again later.' } }),
    );
    await page.getByLabel('Name').fill('Test Person');
    await page.getByLabel('Your email').fill('test@example.com');
    await page.getByLabel('Message').fill('Hello');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('status')).toHaveText(/Could not send right now/);
  });
});

test.describe('contact API', () => {
  // These hit the real endpoint. The test server has no Resend key, so nothing is ever emailed.
  test('rejects a missing message', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { name: 'A', email: 'a@example.com', message: '' } });
    expect(res.status()).toBe(400);
  });

  test('rejects a bad email', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { name: 'A', email: 'not-an-email', message: 'hi' } });
    expect(res.status()).toBe(400);
  });

  test('quietly accepts honeypot spam without sending', async ({ request }) => {
    const res = await request.post('/api/contact', {
      data: { name: 'Bot', email: 'bot@example.com', message: 'spam', company: 'Spam Inc' },
    });
    expect(res.status()).toBe(200);
  });

  test('says the form is not set up when Resend keys are missing', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { name: 'A', email: 'a@example.com', message: 'hi' } });
    expect(res.status()).toBe(503);
  });
});
