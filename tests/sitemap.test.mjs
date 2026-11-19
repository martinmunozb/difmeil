import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (file) => readFileSync(join(root, file), 'utf8');

function indexablePages(directory = '') {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.')) return [];
    const file = join(directory, entry.name);
    if (entry.isDirectory()) return indexablePages(file);
    if (entry.name !== 'index.html') return [];
    const html = read(file);
    if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) return [];
    const url = `https://difmeil.com/${directory ? directory.replaceAll('\\', '/') + '/' : ''}`;
    assert.ok(html.includes(`rel="canonical" href="${url}"`), `${file}: canonical incorrecta`);
    return [url];
  });
}

test('el sitemap publicado contiene todas y solo las páginas reales, canónicas e indexables', () => {
  const xml = read('sitemap.xml');
  // Gramática deliberadamente limitada al formato estático usado por este sitio.
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">\s*(?:<url><loc>https:\/\/difmeil\.com\/[a-z/]*<\/loc><\/url>\s*)+<\/urlset>\s*$/);
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.equal(urls.length, new Set(urls).size, 'URLs duplicadas');
  assert.deepEqual(urls.sort(), indexablePages().sort());
  assert.equal(read('CNAME').trim(), 'difmeil.com');
});

test('robots.txt permite el rastreo y anuncia el sitemap en la raíz pública', () => {
  assert.match(read('robots.txt'), /^User-agent: \*\r?\nDisallow:\s*\r?\n\r?\nSitemap: https:\/\/difmeil\.com\/sitemap\.xml\r?\n?$/);
});
