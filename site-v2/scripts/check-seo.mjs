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
  '/teaching-outreach/', '/talks/', '/blog/', '/about/', '/contact/',
];
const projects = readdirSync(join(root, 'projects'), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => '/projects/' + entry.name + '/');
const articles = readdirSync(join(root, 'blog'), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => '/blog/' + entry.name + '/');
const urls = [...routes, ...projects, ...articles];
check(articles.length > 0, 'Blog must have at least one article');

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
  check(!/\/(?:cv|resume|portfolio|publication)\//.test(xml), 'Sitemap includes redirects');
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
      if (route === '/about/') {
        check(schema['@type'] === 'ProfilePage', 'Missing ProfilePage on About');
        check(schema.mainEntity?.name === 'Yaya Etiabi', 'Incorrect Person identity');
        check(schema.mainEntity?.sameAs?.length === 4, 'Incomplete identity links');
      }
      if (route === '/publications/') {
        check(schema['@type'] === 'CollectionPage', 'Missing publication CollectionPage');
        const items = schema.mainEntity?.itemListElement || [];
        check(items.length === 11, 'Expected 11 publication records in structured data');
        check(items.filter(x => x.item?.version === 'Preprint').length === 1, 'Preprint needs explicit distinction');
      }
      if (route === '/blog/') {
        check(schema['@type'] === 'CollectionPage', 'Missing Blog CollectionPage');
        check(schema.mainEntity?.itemListElement?.length === articles.length, 'Blog collection JSON-LD mismatch');
      }
      if (articles.includes(route)) {
        check(schema['@type'] === 'BlogPosting', 'Missing BlogPosting schema at ' + route);
        check(schema.datePublished && schema.headline && schema.author?.name === 'Yaya Etiabi', 'Incomplete blog article structured data at ' + route);
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
if (existsSync(join(root, '404.html'))) {
  check(/noindex/.test(html('404.html')), '404 must not be indexable');
}
const legacyPosts = [
  'reading-research-papers', 'first-research-paper', 'exploring-ml-research',
];
for (const slug of legacyPosts) {
  const path = 'posts/' + slug + '/index.html';
  check(existsSync(join(root, path)), 'Missing migrated post redirect: ' + path);
  if (existsSync(join(root, path))) {
    check(/noindex/.test(html(path)), 'Migrated post redirect must be noindex: ' + path);
    check(/http-equiv="refresh"/.test(html(path)), 'Migrated post redirect missing refresh: ' + path);
  }
}
for (const path of ['cv/index.html', 'resume/index.html', 'portfolio/index.html']) {
  check(/noindex/.test(html(path)), 'Redirect must not be indexed: ' + path);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('SEO checks passed: ' + urls.length + ' pages, canonical tags, indexability, JSON-LD and sitemap.');
