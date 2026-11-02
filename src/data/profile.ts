/**
 * Everything on the page that ISN'T a project story lives here.
 * Project stories are markdown files in src/content/work/.
 *
 * Edit the text, save, and the dev server reloads.
 */

export const site = {
  name: 'Prasad Mudedla',
  title: 'Prasad Mudedla · Quality Engineer',
  description:
    'Quality Engineer in Sydney. Ten years of testing, shift-left quality and, now, evals for AI at Canva.',
  url: 'https://prasad.dev',
};

export const links = {
  linkedin: { href: 'https://linkedin.com/in/prasadmudedla', label: 'linkedin/prasadmudedla' },
  github: { href: 'https://github.com/prasadmudedla', label: 'github/prasadmudedla' },
};

export const nav = [
  { href: '#work', label: 'Work' },
  { href: '#career', label: 'Career' },
  { href: '#talks', label: 'Talks' },
  { href: '#contact', label: 'Contact' },
];

/* ---------- hero ---------- */
export const hero = {
  label: 'Prasad Mudedla · Quality Engineer · Sydney',
  headline: ['I help teams ship software', 'they can trust.'],
  // `now: true` highlights the tag in green
  modes: [
    { label: 'Testing' },
    { label: 'Shift-left' },
    { label: 'AI evals', now: true },
  ],
  lede:
    "Ten years of making launches uneventful. NFC payments for Barclays, Preqin's website rebuild, ServiceNow Process Mining, and now Canva, where I build the evals behind Canva AI and test features that reach millions of people on day one.",
};

/** The animated "test run" in the hero. Set `current: true` on the job you're in now. */
export const terminalRun = [
  { file: 'cognizant.spec', year: 2015, what: 'Barclays bPay, contactless' },
  { file: 'thoughtworks.spec', year: 2017, what: 'Preqin · BMW & MINI · DBS' },
  { file: 'servicenow.spec', year: 2020, what: 'Process Mining, QA from zero' },
  { file: 'hellofresh.spec', year: 2022, what: 'moved to Sydney, wrote Go' },
  { file: 'canva.spec', year: 2024, what: 'Canva AI evals · Affinity', current: true },
];

/* ---------- work ---------- */
/** Filter chips above the project cards. `id` must match the `filters` values in each work file. */
export const workFilters = [
  { id: 'all', label: 'all' },
  { id: 'ai', label: 'AI' },
  { id: 'performance', label: 'performance' },
  { id: 'strategy', label: 'strategy' },
  { id: 'automation', label: 'automation' },
  { id: 'mobile', label: 'mobile' },
  { id: 'payments', label: 'payments' },
];

/** Smaller cards under the main stories. */
export const moreWork = [
  {
    org: 'ThoughtWorks',
    kind: 'BMW Group',
    title: 'BMW and MINI',
    text: 'Rebuilt the website once and white-labelled it for both brands. I led QA for releases, with UI automation and visual regression running across browsers.',
  },
  {
    org: 'ThoughtWorks',
    kind: 'Banking',
    title: 'DBS Bank',
    text: "Rebuilt DBS's UI test framework in Cypress and added performance testing with JMeter.",
  },
  {
    org: 'ThoughtWorks',
    kind: 'Data',
    title: 'Questback',
    text: 'A platform that turns team surveys and data from many other systems into insights. I set up daily security scans of its Docker images and built tools that checked the data arriving from S3 buckets and APIs.',
  },
  {
    org: 'Canva',
    kind: '2025 → now',
    title: 'Canva Business, and apps for real estate',
    text: "Tested the onboarding and setup flows for the Canva Business launch, which rolled out cleanly even with requirements changing up to launch day. Since then I've been the QA on business-specific apps built for real estate users.",
  },
];

/* ---------- career ---------- */
export const career = {
  title: 'Five suites, ten years',
  intro: 'From a trainee in Pune to Canva in Sydney, by way of consulting and product R&D.',
  chapters: [
    {
      years: '2024 → now',
      company: 'Canva',
      role: 'QA Engineer · Sydney',
      current: true,
      text: 'I work with the Brand and Business Workflows teams, owning quality for launches from first design review to release day, and building the evals behind Canva AI. I also help other teams with integration tests, hold TypeScript test office hours, and built a dashboard that keeps disabled tests from piling up.',
    },
    {
      years: '2022 → 2023',
      company: 'HelloFresh',
      role: 'Software Developer II · Sydney',
      text: 'Moved from Hyderabad to Sydney and crossed over to development, writing Go and Python. Built CI workflows in GitHub Actions and worked on delivery allocation for global markets.',
    },
    {
      years: '2020 → 2022',
      company: 'ServiceNow',
      role: 'Senior SDET · Hyderabad',
      text: 'First QA on Process Mining inside R&D. Test strategy from scratch, UI and API automation, chaos engineering and release management.',
    },
    {
      years: '2017 → 2020',
      company: 'ThoughtWorks',
      role: 'Senior Quality Consultant · Hyderabad',
      text: 'Consulted for Preqin, BMW and MINI, DBS Bank and Questback. Open-sourced a web services automation framework and helped design Vapasi, a returnship program for women technologists.',
    },
    {
      years: '2015 → 2017',
      company: 'Cognizant',
      role: 'Programmer Analyst · Pune',
      text: 'Started as a trainee on Barclays UK: bPay contactless payments and mobile banking. Taught myself automation along the way.',
    },
  ],
};

/* ---------- tools ---------- */
export const tools = [
  { area: 'ui automation', list: 'Cypress, Selenium, TestCafe, Protractor' },
  { area: 'api', list: 'Rest Assured, Supertest, Jest, Postman' },
  { area: 'performance', list: 'k6, Gatling, JMeter, BlazeMeter' },
  { area: 'resilience', list: 'Gremlin chaos engineering (certified)' },
  { area: 'security', list: 'OWASP ZAP, Burp Suite, container scanning' },
  { area: 'ci / infra', list: 'GitHub Actions, Jenkins, Terraform, AWS' },
  { area: 'ai', list: 'Eval pipelines, LLM-as-judge, Claude, MCP' },
  { area: 'languages', list: 'TypeScript, Java, Python, Go' },
];

/* ---------- talks ---------- */
export const talks = [
  {
    event: 'vodQA',
    title: 'Cypress: a JavaScript end-to-end testing framework',
    text: 'How Cypress fixes the pain points developers and QA engineers hit when testing modern apps.',
  },
  {
    event: 'Geek Night',
    title: 'Evolution of voice',
    text: 'How voice input, through Alexa and Google Home, is changing the way we interact with software.',
  },
  {
    event: 'Vapasi · ThoughtWorks',
    title: 'Bringing women back to tech',
    text: 'Helped design a three-week program on manual and automation testing for women technologists returning from a career break.',
  },
];

/* ---------- contact ---------- */
export const contact = {
  kicker: 'afterAll()',
  headline: "Shipping something that can't break? Let's talk.",
  placeholder: 'What are you building, and what worries you about it?',
};
