// Validate SEO metadata in the output that a crawler actually receives.
// Run for both the official root-domain build and the noindex fork preview.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('dist');
const official = 'https://yaya-etiabi.github.io';
const preview = (process.env.BASE_PATH || '/').replace(/\/$/, '') !== '';
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const html = file => readFileSync(join(root, file), 'utf8');
const routes = [
  '/', '/research/', '/projects/', '/publications/',
  '/teaching-outreach/', '/talks/', '/about/', '/cv/', '/contact/',
];
const projects = readdirSync(join(root, 'projects'), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => '/projects/' + entry.name + '/');
const urls = [...routes, ...projects];

check(existsSync(join(root, 'sitemap.xml')), 'Missing sitemap.xml');
check(existsSync(join(root, 'robots.txt')), 'Missing robots.txt');
check(existsSync(join(root, 'portrait.webp')), 'Missing social image');

if (existsSync(join(root, 'sitemap.xml'))) {
  const xml = html('sitemap.xml');
  const published = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const expected = urls.map(url => official + url);
  check(published.length === expected.length, 'Sitemap URL count does not match the main pages');
  check(new Set(published).size === published.length, 'Duplicate sitemap URLs');
  for (const url of expected) check(published.includes(url), 'Sitemap omits ' + url);
  check(!/\/(?:resume|portfolio|publication)\//.test(xml), 'Sitemap includes redirects');
}
if (existsSync(join(root, 'robots.txt'))) {
  check(html('robots.txt').includes('Sitemap: ' + official + '/sitemap.xml'), 'Wrong robots.txt sitemap');
}
for (const route of urls) {
  const markup = html(route.slice(1) + 'index.html');
  const canonical = (markup.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const robotRule = (markup.match(/<meta name="robots" content="([^"]+)"/) || [])[1];
  const title = (markup.match(/<title>([^<]+)<\/title>/) || [])[1];
  const description = (markup.match(/<meta name="description" content="([^"]+)"/) || [])[1];
  const ldScripts = [...markup.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  check(canonical === official + route, 'Wrong canonical at ' + route + ': ' + canonical);
  check(robotRule === (preview ? 'noindex,nofollow' : 'index,follow'), 'Wrong robots meta at ' + route);
  check(Boolean(title && description), 'Missing title/description at ' + route);
  check(ldScripts.length === 1, 'Expected one JSON-LD block at ' + route);
  for (const [,script] of ldScripts) {
    try {
      const schema = JSON.parse(script);
      check(schema['@context'] === 'https://schema.org', 'Wrong schema context ' + route);
      if (route === '/cv/') {
        check(/Research experience/.test(markup) && /Education/.test(markup), 'CV is missing academic experience or education');
        check(/UQAM/.test(markup) && /ISEP/.test(markup) && /UM6P/.test(markup), 'CV is missing verified research institutions');
        check(/Earlier engineering experience/.test(markup), 'CV is missing earlier technical roles');
      }
      if (route === '/about/') {
        check(schema['@type'] === 'ProfilePage', 'Missing ProfilePage on About');
        check(schema.mainEntity?.name === 'Yaya Etiabi', 'Incorrect Person identity');
        check(schema.mainEntity?.sameAs?.length === 4, 'Incomplete identity links');
      }
      if (route === '/publications/') {
        check(schema['@type'] === 'CollectionPage', 'Missing publication CollectionPage');
        const items = schema.mainEntity?.itemListElement || [];
        check(items.length === 13, 'Expected 13 publication records in structured data');
        check(items.filter(x => x.item?.version === 'Preprint').length === 3, 'All 3 preprints need explicit distinction');
      }
      if (route === '/') {
        check(schema['@graph']?.some(x => x['@type'] === 'WebSite'), 'Missing WebSite');
        check(schema['@graph']?.some(x => x['@type'] === 'Person'), 'Missing Person');
      }
    } catch {
      failures.push('Invalid JSON-LD on ' + route);
    }
  }
}
// Verify that the generated project cards expose the correct associated research output.
const expectedProjectOutputs = [
  ['ai-iscc-survey', 'https://arxiv.org/abs/2611.01521', 'View preprint'],
  ['factorized-transformer', 'https://arxiv.org/abs/2611.01491', 'View preprint'],
  ['femloc', 'https://doi.org/10.1109/JIOT.2024.3440175', 'View publication'],
  ['federated-distillation', 'https://doi.org/10.1109/JSEN.2024.3357798', 'View publication'],
];
const projectPage = html('projects/index.html');
const basePath = process.env.BASE_PATH || '/';
const basePrefix = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
for (const [slug, paperUrl, label] of expectedProjectOutputs) {
  const projectLink = basePrefix + '/projects/' + slug + '/';
  const marker = 'href="' + projectLink + '"';
  const linkPosition = projectPage.indexOf(marker);
  const cardStart = projectPage.lastIndexOf('<article class="card project-card">', linkPosition);
  const cardEnd = projectPage.indexOf('</article>', linkPosition);
  const card = linkPosition !== -1 && cardStart !== -1 && cardEnd !== -1
    ? projectPage.slice(cardStart, cardEnd)
    : '';
  check(Boolean(card), 'Missing project card for ' + slug);
  if (card) {
    check(card.includes('href="' + paperUrl + '"'), 'Missing paper URL on ' + slug);
    check(card.includes(label), 'Incorrect paper type label on ' + slug);
    check(card.includes('class="project-card-actions"'), 'Missing two-action layout on ' + slug);
  }
  const details = html('projects/' + slug + '/index.html');
  check(details.includes('href="' + paperUrl + '"'), 'Project details omit research output for ' + slug);
}
const homepage = html('index.html');
for (const url of ['https://arxiv.org/abs/2611.01521', 'https://arxiv.org/abs/2611.01491']) {
  check(homepage.includes('href="' + url + '"'), 'Featured homepage card omits ' + url);
}

if (existsSync(join(root, '404.html'))) {
  check(/noindex/.test(html('404.html')), '404 must not be indexable');
}
for (const path of ['resume/index.html', 'portfolio/index.html']) {
  check(/noindex/.test(html(path)), 'Redirect must not be indexed: ' + path);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('SEO checks passed: ' + urls.length + ' pages, canonical tags, indexability, JSON-LD and sitemap.');
