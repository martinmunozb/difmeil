import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://difmeil.com';
const store = 'https://chromewebstore.google.com/detail/difmeil/eojoffejiddgjbjgkkgkfhccgofjejad';
const languages = ['es', 'en', 'fr', 'de', 'pt'];
const clusters = [
  ['/', '/en/', '/fr/', '/de/', '/pt/'],
  ['/privacidad/', '/en/privacy/', '/fr/confidentialite/', '/de/datenschutz/', '/pt/privacidade/'],
];
const read = (path) => readFileSync(join(root, path), 'utf8');
const htmlAt = (path) => read(`${path.slice(1)}index.html`);
// The site uses static HTML with quoted attributes; browser/HTML validation is separate.
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((m) => attributes(m[0]));

for (const cluster of clusters) {
  for (const [index, path] of cluster.entries()) {
    const lang = languages[index];
    test(`${path}: metadatos únicos, idioma y contenido indexable`, () => {
      const html = htmlAt(path);
      assert.equal(tags(html, 'html')[0].lang, lang);
      assert.equal((html.match(/<title>[^<]+<\/title>/g) ?? []).length, 1);
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
      assert.equal((html.match(/<main\b/g) ?? []).length, 1);
      const meta = tags(html, 'meta');
      const descriptions = meta.filter((m) => m.name === 'description');
      assert.equal(descriptions.length, 1, 'falta una metadescripción única');
      assert.ok(descriptions[0].content.length >= 60);
      assert.ok(!meta.some((m) => /robots|googlebot|bingbot/i.test(m.name ?? '') && /noindex|none/i.test(m.content)));
      assert.deepEqual(tags(html, 'link').filter((l) => l.rel === 'canonical').map((l) => l.href), [origin + path]);
    });

    test(`${path}: hreflang completo, recíproco y separado por tipo de página`, () => {
      const alternate = tags(htmlAt(path), 'link').filter((l) => l.rel === 'alternate' && l.hreflang);
      assert.equal(alternate.length, 6);
      assert.deepEqual(Object.fromEntries(alternate.map((l) => [l.hreflang, l.href])), {
        ...Object.fromEntries(cluster.map((url, i) => [languages[i], origin + url])),
        'x-default': origin + cluster[1],
      });
    });

    test(`${path}: enlaces, fragmentos, imágenes y recursos locales existentes`, () => {
      const html = htmlAt(path);
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
      assert.equal(ids.length, new Set(ids).size, 'IDs duplicados');
      for (const element of [...tags(html, 'a'), ...tags(html, 'link'), ...tags(html, 'img'), ...tags(html, 'script'), ...tags(html, 'source')]) {
        const references = [element.href, element.src, ...(element.srcset ?? '').split(',').map((s) => s.trim().split(/\s/)[0])].filter(Boolean);
        for (const ref of references) {
          const url = new URL(ref, origin + path);
          if (url.hostname === 'chromewebstore.google.com') assert.equal(url.href, store);
          if (url.origin !== origin) continue;
          assert.equal(url.search, '', 'no añadir parámetros a los enlaces canónicos');
          const file = url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname;
          assert.ok(existsSync(join(root, file.slice(1))), `${path}: recurso ausente ${ref}`);
          if (url.hash) assert.ok(htmlAt(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `fragmento ausente ${ref}`);
        }
        if (element.src?.startsWith('/assets/') && !element.src.endsWith('.js')) assert.ok('alt' in element, 'imagen sin alt');
      }
    });
  }
}

for (const [index, path] of clusters[0].entries()) {
  test(`${path}: SoftwareApplication describe solo hechos comprobables y texto visible`, () => {
    const html = htmlAt(path);
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 1);
    const data = JSON.parse(scripts[0][1]);
    assert.equal(data['@context'], 'https://schema.org');
    assert.equal(data['@type'], 'SoftwareApplication');
    assert.equal(data['@id'], origin + '/#software');
    assert.equal(data.name, 'Difmeil');
    assert.equal(data.url, origin + path);
    assert.equal(data.installUrl, store);
    assert.equal(data.softwareRequirements, 'Google Chrome');
    assert.equal(data.inLanguage, languages[index]);
    for (const property of ['offers', 'aggregateRating', 'review', 'operatingSystem']) assert.ok(!(property in data), `no publicar ${property} sin verificación específica`);
    const body = html.split('<body>')[1];
    assert.ok(data.featureList.length >= 4);
    for (const feature of data.featureList) assert.ok(body.includes(feature), `función sin respaldo visible: ${feature}`);
    assert.equal(data.description, tags(html, 'meta').find((m) => m.name === 'description').content);
  });

  test(`${path}: FAQ estáticas útiles y pronunciación de idiomas`, () => {
    const html = htmlAt(path);
    const faqs = [...html.matchAll(/<details><summary>([^<]+)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)];
    assert.ok(faqs.length >= 6, 'FAQ sobre instalación y público además de las dudas existentes');
    assert.equal(new Set(faqs.map((m) => m[1])).size, faqs.length);
    assert.doesNotMatch(html, /Edge, Brave|Brave o[u]? Opera|Brave oder Opera/);
    for (const link of tags(html, 'a').filter((a) => a.hreflang)) assert.equal(link.lang, link.hreflang);
  });

  test(`${path}: controles nativos y agrupaciones con semántica válida`, () => {
    const html = htmlAt(path);
    for (const button of tags(html, 'button').filter((b) => b.popovertarget)) {
      assert.ok(!('aria-expanded' in button), 'popover ya expone su estado nativamente');
    }
    const comparison = tags(html, 'div').find((d) => d.class === 'pricing-comparison');
    assert.equal(comparison.role, 'group', 'aria-labelledby necesita un rol que permita nombre');
  });
}

test('llms.txt es complementario y enlaza las diez páginas canónicas y la instalación oficial', () => {
  const content = read('llms.txt');
  assert.match(content, /^# Difmeil\n/);
  assert.match(content, /experimental/i);
  for (const path of clusters.flat()) assert.ok(content.includes(`](${origin + path})`));
  assert.ok(content.includes(`](${store})`));
  assert.doesNotMatch(content, /oppref|utm_|service_role|client_secret|58453962|Plaza Aparejos/);
});

test('las rutas auxiliares conservan noindex y quedan fuera del sitemap', () => {
  const paths = ['/partners/', '/creador-qr/', '/instalar/', '/r/', '/en/r/', '/fr/r/', '/de/r/', '/pt/r/'];
  const xml = read('sitemap.xml');
  for (const path of paths) {
    assert.ok(tags(htmlAt(path), 'meta').some((m) => m.name === 'robots' && m.content.includes('noindex')), path);
    assert.ok(!xml.includes(`<loc>${origin + path}</loc>`));
  }
});
