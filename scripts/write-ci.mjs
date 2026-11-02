/**
 * Turns the latest Playwright JSON report into src/data/ci.json,
 * the numbers shown in the footer ("This page is tested too").
 *
 * Run with: npm run test:report
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const REPORT = 'test-results/results.json';
const OUT = 'src/data/ci.json';

if (!existsSync(REPORT)) {
  console.error(`No report at ${REPORT}. Run the tests first (npm test).`);
  process.exit(1);
}

const report = JSON.parse(readFileSync(REPORT, 'utf8'));

// Walk every test in the report (suites can be nested).
const tests = [];
const walk = (suite) => {
  for (const spec of suite.specs ?? []) for (const t of spec.tests ?? []) tests.push(t);
  for (const child of suite.suites ?? []) walk(child);
};
(report.suites ?? []).forEach(walk);

const ran = tests.filter((t) => t.status !== 'skipped');
const passed = ran.filter((t) => t.status === 'expected' || t.status === 'flaky').length;

if (ran.length === 0) {
  console.error('The report has no test results (did the test server fail to start?). Leaving ci.json unchanged.');
  process.exit(1);
}

let violations = 0;
for (const t of tests) {
  const notes = [...(t.annotations ?? []), ...(t.results ?? []).flatMap((r) => r.annotations ?? [])];
  const axe = notes.filter((a) => a.type === 'axe-violations');
  if (axe.length) violations += Number(axe.at(-1).description) || 0;
}

const ci = {
  updated: new Date().toISOString(),
  e2e: { passed, total: ran.length },
  a11y: { violations },
};

writeFileSync(OUT, JSON.stringify(ci, null, 2) + '\n');
console.log(`Updated ${OUT}: e2e ${passed}/${ran.length}, a11y ${violations} violations`);
