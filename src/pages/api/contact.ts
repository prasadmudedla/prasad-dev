/**
 * POST /api/contact
 * Receives the contact form and emails it to you through Resend.
 * Runs as a Vercel serverless function; the rest of the site is static.
 *
 * Needs RESEND_API_KEY, CONTACT_TO and CONTACT_FROM (see .env.example).
 */
import type { APIRoute } from 'astro';
import { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } from 'astro:env/server';
import { Resend } from 'resend';

export const prerender = false;

const LIMITS = { name: 100, email: 200, message: 5000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple per-IP rate limit: 5 messages per 10 minutes.
// It lives in memory, so it resets when Vercel starts a fresh function instance.
// Good enough to stop casual spam; add Vercel Firewall rules if you ever need more.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let input: Record<string, unknown>;
  try {
    input = request.headers.get('content-type')?.includes('application/json')
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return json(400, { error: 'Could not read the form. Please try again.' });
  }

  const name = String(input.name ?? '').trim();
  const email = String(input.email ?? '').trim();
  const message = String(input.message ?? '').trim();
  const honeypot = String(input.company ?? '').trim();

  // Bots fill the hidden "company" field. Pretend it worked and drop the message.
  if (honeypot) return json(200, { ok: true });

  if (!name || !email || !message) {
    return json(400, { error: 'Add your name, a valid email and a message.' });
  }
  if (!EMAIL.test(email)) {
    return json(400, { error: 'That email address does not look right.' });
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return json(400, { error: 'That message is a bit long. Please shorten it.' });
  }

  if (rateLimited(clientAddress ?? 'unknown')) {
    return json(429, { error: 'Too many messages. Please try again in a few minutes.' });
  }

  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.error('[contact] Missing RESEND_API_KEY, CONTACT_TO or CONTACT_FROM');
    return json(503, { error: 'The contact form is not set up yet. Please reach me on LinkedIn.' });
  }

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: email, // hitting "Reply" in your inbox answers the visitor directly
    subject: `prasad.dev: message from ${name.replace(/[\r\n]+/g, ' ')}`,
    text: `${message}\n\n— ${name} <${email}>\nSent from the contact form on prasad.dev`,
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return json(502, { error: 'Could not send right now. Please try again later.' });
  }

  return json(200, { ok: true });
};
