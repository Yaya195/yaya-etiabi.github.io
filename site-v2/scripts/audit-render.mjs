import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:4321';
const routes = [
  '/', '/research/', '/projects/', '/projects/locllm/',
  '/projects/radio-slam/', '/publications/', '/teaching-outreach/',
  '/talks/', '/blog/', '/blog/reading-research-papers/', '/about/', '/contact/'
];
const widths = [320, 375, 768, 1280];
const screenshotRoutes = new Set(['/', '/projects/', '/teaching-outreach/', '/blog/', '/blog/reading-research-papers/', '/about/']);
const errors = [];
const summaries = [];
mkdirSync('visual-audit', { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on('pageerror', error => runtimeErrors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const status = response?.status();
      // Load lazy images before evaluating their actual width and taking screenshots.
      for (const img of await page.locator('img').all()) {
        await img.scrollIntoViewIfNeeded({ timeout: 10000 });
        await img.evaluate(el => el.decode().catch(() => {}));
      }
      const result = await page.evaluate(() => {
        const main = document.querySelector('main');
        const heading = document.querySelectorAll('main h1');
        const brokenImages = [...document.images].filter(img => !img.complete || img.naturalWidth === 0)
          .map(img => img.getAttribute('src'));
        const missingAlt = [...document.images].filter(img => !img.hasAttribute('alt'))
          .map(img => img.getAttribute('src'));
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const allNavLinks = [...document.querySelectorAll('nav[aria-label="Primary navigation"] a')];
        const clippedNavLinks = allNavLinks.filter(link => {
          const rect = link.getBoundingClientRect();
          return rect.left < -1 || rect.right > window.innerWidth + 1;
        }).map(link => link.textContent.trim());
        const selectedNav = allNavLinks.filter(link => link.getAttribute('aria-current') === 'page').map(link => link.textContent.trim());
        return {
          title: document.title,
          h1Count: heading.length,
          missingMain: !main,
          documentWidth: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
          brokenImages,
          missingAlt,
          canonical,
          selectedNav,
          clippedNavLinks,
          hasSkipTarget: Boolean(document.getElementById('content')),
        };
      });
      const label = width + 'px ' + route;
      if (status !== 200) errors.push(label + ': HTTP ' + status);
      if (result.documentWidth > width + 2) errors.push(label + ': horizontal overflow ' + result.documentWidth);
      if (result.h1Count !== 1 || result.missingMain || !result.hasSkipTarget) errors.push(label + ': document landmarks');
      if (result.brokenImages.length || result.missingAlt.length) errors.push(label + ': images ' + JSON.stringify({broken:result.brokenImages,missingAlt:result.missingAlt}));
      if (result.clippedNavLinks.length) errors.push(label + ': hidden navigation items ' + result.clippedNavLinks.join(', '));
      if (!result.canonical?.startsWith('https://yaya-etiabi.github.io/')) errors.push(label + ': canonical ' + result.canonical);
      if (route !== '/' && route.split('/').filter(Boolean).length === 1 && !result.selectedNav.length && route !== '/contact/') errors.push(label + ': nav not marked current');
      if (runtimeErrors.length) errors.push(label + ': JS errors ' + JSON.stringify(runtimeErrors.splice(0)));
      summaries.push({ width, route, status, ...result });
      if (screenshotRoutes.has(route) && (width === 375 || width === 1280)) {
        const name = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-');
        await page.screenshot({ path: 'visual-audit/' + name + '-' + width + '.png', fullPage: true, animations: 'disabled' });
      }
      console.log(JSON.stringify({ width, route, status, scrollWidth: result.documentWidth, images: result.brokenImages.length, canonical: result.canonical }));
    }
    await context.close();
  }
} finally {
  await browser.close();
}
writeFileSync('visual-audit/report.json', JSON.stringify({ errors, summaries }, null, 2));
if (errors.length) {
  console.error('Visual/browser audit failed with ' + errors.length + ' issue(s):\n' + errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Visual/browser audit succeeded: ' + routes.length + ' routes × ' + widths.length + ' viewport widths; no global overflow, broken images or missing landmarks.');
}
