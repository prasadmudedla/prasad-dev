# prasad.dev

My personal site, in four tabs:

| Tab | Address | What's on it |
| --- | --- | --- |
| Home | `/` | Who I am, the test-run terminal, three featured projects |
| Work | `/work` | Every project as a card, with filters. Each card opens its own story page, e.g. `/work/canva-ai` |
| About | `/about` | Career, tools and talks |
| Contact | `/contact` | The contact form |

The tabs stay pinned to the top of every page, and the current one is highlighted.

- **Built with** [Astro](https://astro.build): plain HTML and CSS, with a little JavaScript for the theme toggle, the filters and the form.
- **Hosted on** [Vercel](https://vercel.com).
- **Contact form** sends email through [Resend](https://resend.com). My email address never appears on the page.
- **Tested with** [Playwright](https://playwright.dev) and [axe](https://github.com/dequelabs/axe-core). The results show in the footer.

---

## Quick start

You need **Node 24** (`nvm use` reads `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:4321
```

Edits show up straight away in the browser.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the site locally at http://localhost:4321 |
| `npm run build` | Builds the production site into `.vercel/output/` |
| `npm run check` | Type-checks everything and validates the project files |
| `npm test` | Runs every Playwright and accessibility test |
| `npm run test:report` | Runs the tests, then updates the footer numbers (`src/data/ci.json`) |

The first time you run the tests, also run `npx playwright install chromium`.

---

## How to change things

You'll rarely need to touch code. Almost everything is text in two places.

### 1. Project stories → `src/content/work/`

One file per project. The number at the front of the filename is only there to keep the folder tidy. The order on the page comes from `order:`.

```mdx
---
order: 2
spec: affinity.spec            # shown in the card's top bar
client: Affinity
org: Canva
years: "2025"
status: launched               # running | launched | shipped
headline: Getting Affinity's website ready for the day it went free
context: One or two sentences of background, shown under the headline.
stack: [k6, JMeter, AWS, Cloudflare]
filters: [performance]         # which filter chips show this card
---

The "What I built" text goes here, as normal paragraphs.
```

- **Each file becomes a page.** `03-brand-kits.mdx` is served at `/work/brand-kits` (the number is dropped).
- **Add a project:** copy an existing file, rename it and edit it. Its page, its card on Work and the Next/Previous links appear automatically. The heading ("Six launches…") counts the cards for you.
- **Hide a project without deleting it:** add `draft: true`.
- **Make a card the big, full-width one:** add `lead: true`.
- **Change which projects show on Home:** edit `home.featured` in `src/data/profile.ts`.
- **Typos in the front matter:** `npm run dev` points to the exact file and field.

The Canva AI story embeds the eval table with `<EvalMatrix />`. Edit the table in `src/components/EvalMatrix.astro`.

### 2. Everything else → `src/data/profile.ts`

The tabs, the hero text, the terminal "test run", the featured projects on Home, the filter chips, "More client work", career, tools, talks, contact copy and social links. It's plain text inside quotes. Keep the commas and quotes where they are and you're fine.

### 3. Colours and fonts → `src/styles/tokens.css`

One file holds both palettes, light and dark (the "Forest" theme). Change a colour there and it changes everywhere. The page opens in dark mode, and the toggle in the nav remembers each visitor's choice.

---

## Project map

```
src/
  pages/                 one file per page; the file path is the web address
    index.astro          Home  (/)
    work/index.astro     Work  (/work)
    work/[slug].astro    one page per project story (/work/canva-ai, …)
    about.astro          About (/about)
    contact.astro        Contact (/contact)
    404.astro            "page not found"
    api/contact.ts       the contact form's server function (Resend)
  components/            the building blocks: Nav, Hero, StoryCard, CaseCard, Career, Contact, Footer…
  layouts/
    Base.astro           <head>, fonts, SEO tags, theme setup
    Page.astro           every page's frame: pinned nav, content, footer
  lib/work.ts            loads the stories and works out their web addresses
  content/work/          ← project stories (edit these)
  data/
    profile.ts           ← all other page text (edit this)
    ci.json              footer test numbers (written by `npm run test:report`)
  styles/
    tokens.css           ← colours and fonts
    global.css           layout and component styles
  content.config.ts      the fields every project story must have
tests/                   Playwright tests: page, contact form, accessibility
scripts/write-ci.mjs     turns the test report into src/data/ci.json
public/                  files served as-is (favicon)
.github/workflows/       runs check, build and tests on every push
```

This repo only holds what's on the website. Research and working notes live elsewhere, not here.

---

## Contact form (Resend)

The form posts to `/api/contact`. That route checks the input, drops spam caught by a hidden "honeypot" field, limits each visitor to 5 messages every 10 minutes, and emails the message to you. In your inbox, **Reply** goes straight to the visitor.

**Setup, once:**

1. Create a free account at [resend.com](https://resend.com).
2. **Domains → Add domain →** `prasad.dev`, then add the DNS records Resend shows you at your domain registrar. It verifies within minutes to hours.
3. **API Keys → Create** a key with *Sending access*.
4. Copy `.env.example` to `.env` and fill in the three values:

   ```bash
   RESEND_API_KEY=re_...
   CONTACT_TO=you@yourmail.com
   CONTACT_FROM="prasad.dev <hello@prasad.dev>"
   ```

   Before the domain is verified, you can test with `CONTACT_FROM=onboarding@resend.dev`. Resend only delivers those test emails to your own account address.

5. Add the same three values in **Vercel → Project → Settings → Environment Variables**.

Without the keys, the site still works, and the form tells visitors to reach you on LinkedIn instead.

> `.env` is git-ignored. Never commit real keys.

---

## Tests

```bash
npm test
```

| File | Checks |
| --- | --- |
| `tests/site.spec.ts` | The tabs (each opens its page, the right one is highlighted, they stay pinned), Home, Work and its filters, every story page, Next/Previous, About, the 404 page, light/dark carrying across pages, no sideways scrolling |
| `tests/contact.spec.ts` | Form validation, success and error messages (API mocked), and the real API's validation and honeypot. **No email is ever sent by tests.** |
| `tests/a11y.spec.ts` | axe WCAG 2.1 AA scan of every page, in both dark and light mode |

Every test runs on a desktop browser and a phone-sized browser. A failed run leaves an HTML report: `npx playwright show-report`.

**Footer numbers.** "This page is tested too" reads `src/data/ci.json`. After changes, run `npm run test:report` and commit the updated `ci.json`, so the live site shows the latest run. If the tests fail, the footer honestly shows the failures.

---

## Deploying

### First time

1. Push this repo to GitHub.
2. At [vercel.com/new](https://vercel.com/new), import the repo. Vercel detects Astro, so leave the settings as they are.
3. Add the three environment variables (see [Contact form](#contact-form-resend)).
4. Deploy.
5. **Settings → Domains →** add `prasad.dev`, and set the DNS records Vercel shows you at your registrar.

### After that

Push to `main` and Vercel deploys automatically. Every pull request gets its own preview URL, and GitHub Actions runs the type check, build and tests on every push and pull request.

---

## Housekeeping

- `npm outdated` lists packages with newer versions. Update with `npm update`, then run `npm run check && npm test`.
- `npm audit` currently flags a few advisories in packages that Vercel's adapter uses during the build. They don't run in the browser, and they clear as Vercel updates the adapter.
