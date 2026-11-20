import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
const root = new URL('../', import.meta.url);
const origin = 'https://difmeil.com';
const store = 'https://chromewebstore.google.com/detail/difmeil/eojoffejiddgjbjgkkgkfhccgofjejad';
const routes = {
  es: ['/guias/gestionar-varias-cuentas-gmail/', '/guias/notificaciones-varias-cuentas-gmail/'],
  en: ['/en/guides/manage-multiple-gmail-accounts/', '/en/guides/notifications-multiple-gmail-accounts/'],
  fr: ['/fr/guides/gerer-plusieurs-comptes-gmail/', '/fr/guides/notifications-plusieurs-comptes-gmail/'],
  de: ['/de/ratgeber/mehrere-gmail-konten-verwalten/', '/de/ratgeber/benachrichtigungen-mehrere-gmail-konten/'],
  pt: ['/pt/guias/gerenciar-varias-contas-gmail/', '/pt/guias/notificacoes-varias-contas-gmail/'],
};
const read = (file) => readFileSync(new URL(file.replace(/^\//, ''), root), 'utf8');
const titles = new Set();
test('localized sources retain complete sections, FAQs, comparisons and installation steps', () => {
  const english = JSON.parse(read('scripts/guides/en.json'));
  for (const lang of Object.keys(routes)) {
    const content = JSON.parse(read(`scripts/guides/${lang}.json`));
    assert.deepEqual(Object.keys(content.ui).sort(), Object.keys(english.ui).sort());
    assert.deepEqual(content.guides.map(g => g.key), ['inbox', 'notifications']);
    for (const [index, guide] of content.guides.entries()) {
      assert.deepEqual(guide.sections.map(s => s.id), english.guides[index].sections.map(s => s.id));
      for (const [n, section] of guide.sections.entries()) {
        const base = english.guides[index].sections[n].html;
        for (const tag of ['h2', 'h3', 'details', 'tr', 'li']) {
          assert.equal((section.html.match(new RegExp(`<${tag}\\b`, 'g')) ?? []).length, (base.match(new RegExp(`<${tag}\\b`, 'g')) ?? []).length, `${lang}/${guide.key}/${section.id}: incomplete ${tag}`);
        }
        if (lang !== 'en') assert.notEqual(section.html, base, `${lang}: untranslated section`);
      }
    }
  }
});
for (const [lang, paths] of Object.entries(routes)) {
  for (const [index, path] of paths.entries()) {
    test(`${lang} guide ${index + 1}: localized static document, metadata and reciprocal language destinations`, () => {
      assert.ok(existsSync(new URL(path.slice(1) + 'index.html', root)), `missing ${path}`);
      const html = read(path + 'index.html');
      assert.match(html, new RegExp(`<html lang="${lang}">`));
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
      const title = html.match(/<title>(.*?)<\/title>/)[1];
      assert.ok(!titles.has(title)); titles.add(title);
      assert.match(html, /<meta name="description" content="[^"]{60,200}">/);
      assert.ok(html.includes(`rel="canonical" href="${origin + path}"`));
      assert.ok(html.includes(`property="og:url" content="${origin + path}"`));
      const alternates = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map(m => [m[1], m[2]]));
      assert.equal(Object.keys(alternates).length, 6);
      for (const code of Object.keys(routes)) {
        assert.equal(alternates[code], origin + routes[code][index]);
        assert.ok(html.includes(`href="${routes[code][index]}" hreflang="${code}" lang="${code}"`), 'selector must link equivalent article');
      }
      assert.equal(alternates['x-default'], origin + routes.en[index]);
      assert.ok(html.includes(`href="${paths[1-index]}"`), 'missing related guide');
      assert.ok(read(lang === 'es' ? 'index.html' : `${lang}/index.html`).includes(`href="${path}"`), 'orphan page');
      assert.ok(read('sitemap.xml').includes(`<loc>${origin + path}</loc>`));
      assert.ok(read('llms.txt').includes(`](${origin + path})`));
      assert.match(html, /class="guide-hero-cta"/);
      assert.match(html, /src="\/assets\/product\/appearance.png" width="1280" height="800"/);
      assert.ok((html.match(/<details>/g) ?? []).length >= 5);
      assert.doesNotMatch(html, /\{\{|undefined|noindex|gtag\(|oppref|utm_|aggregateRating|FAQPage/);
    });
    test(`${lang} guide ${index + 1}: links, article and breadcrumb structured data`, () => {
      assert.ok(existsSync(new URL(path.slice(1) + 'index.html', root)), `missing ${path}`);
      const html = read(path + 'index.html');
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
      assert.equal(ids.length, new Set(ids).size);
      for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const u = new URL(ref.replaceAll('&amp;', '&'), origin + path);
        if (u.hostname === 'chromewebstore.google.com') assert.equal(u.href, store);
        if (u.origin !== origin) continue;
        const file = u.pathname.endsWith('/') ? u.pathname + 'index.html' : u.pathname;
        assert.ok(existsSync(new URL(file.slice(1), root)), `missing ${ref}`);
        if (u.hash) assert.ok(read(file).includes(`id="${decodeURIComponent(u.hash.slice(1))}"`), `missing fragment ${ref}`);
      }
      const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      const article = graph['@graph'].find(d => d['@type'] === 'Article');
      const crumbs = graph['@graph'].find(d => d['@type'] === 'BreadcrumbList');
      assert.equal(article.inLanguage, lang);
      assert.equal(article.mainEntityOfPage, origin + path);
      assert.equal(article.headline, html.match(/<h1>(.*?)<\/h1>/)[1]);
      assert.equal(crumbs.itemListElement.at(-1).item, origin + path);
      assert.equal(article.image, origin + '/assets/product/appearance.png');
    });
  }
}
