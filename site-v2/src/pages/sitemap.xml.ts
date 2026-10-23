import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Publish stable root-domain URLs even when building the fork preview under a subpath.
export const GET: APIRoute = async () => {
  const projects = await getCollection('projects');
  const articles = await getCollection('blog');
  const paths = [
    '/', '/research/', '/projects/', '/publications/',
    '/teaching-outreach/', '/talks/', '/blog/', '/about/', '/contact/',
    ...projects.map(project => '/projects/' + project.id + '/'),
    ...articles.map(article => '/blog/' + article.id + '/'),
  ];
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + paths.map(path => '  <url><loc>https://yaya-etiabi.github.io' + path + '</loc></url>').join('\n')
    + '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
