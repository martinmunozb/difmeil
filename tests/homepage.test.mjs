import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url).pathname.replace(/^\/(?:([A-Za-z]:))/, '$1');
const storeUrl = 'https://chromewebstore.google.com/detail/difmeil/eojoffejiddgjbjgkkgkfhccgofjejad';

const pages = [
  { file: 'index.html', lang: 'es', canonical: 'https://difmeil.com/', privacy: '/privacidad/', headline: 'Todas tus cuentas de Gmail. Una sola bandeja.' },
  { file: 'en/index.html', lang: 'en', canonical: 'https://difmeil.com/en/', privacy: '/en/privacy/', headline: 'All your Gmail accounts. One inbox.' },
  { file: 'fr/index.html', lang: 'fr', canonical: 'https://difmeil.com/fr/', privacy: '/fr/confidentialite/', headline: 'Tous vos comptes Gmail. Une seule boîte de réception.' },
  { file: 'de/index.html', lang: 'de', canonical: 'https://difmeil.com/de/', privacy: '/de/datenschutz/', headline: 'Alle deine Gmail-Konten. Ein Posteingang.' },
  { file: 'pt/index.html', lang: 'pt', canonical: 'https://difmeil.com/pt/', privacy: '/pt/privacidade/', headline: 'Todas as suas contas do Gmail. Uma só caixa de entrada.' },
];

function htmlFor(file) {
  return readFileSync(join(root, file), 'utf8');
}

for (const page of pages) {
  test(`${page.lang}: la landing presenta el producto y enlaza la tienda sin fricción`, () => {
    const html = htmlFor(page.file);

    assert.match(html, new RegExp(`<html lang="${page.lang}"`));
    assert.ok(html.includes(page.headline), 'el mensaje principal debe explicar el producto de inmediato');
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'debe haber un único h1');
    assert.ok(html.includes(`rel="canonical" href="${page.canonical}"`));
    assert.ok(html.includes(`href="${page.privacy}"`));
    assert.ok(html.includes(`href="${storeUrl}"`));
    assert.ok(!html.includes('chromewebstore.google.com/search/Difmeil'));
  });

  test(`${page.lang}: comparte estilos, interacción y demostraciones reales`, () => {
    const html = htmlFor(page.file);

    assert.ok(html.includes('href="/assets/site.css"'));
    assert.ok(html.includes('src="/assets/site.js"'));
    assert.ok(html.includes('src="/assets/product/unified-inbox.png"'));
    assert.ok(html.includes('src="/assets/product/multiple-accounts.png"'));
    assert.ok(html.includes('src="/assets/product/appearance.png"'));
    assert.ok(html.includes('type="image/webp"'));
    assert.ok(html.includes('/assets/product/unified-inbox-640.webp 640w'));
    assert.ok(html.includes('type="application/ld+json"'));
    assert.ok(html.includes('"@type": "SoftwareApplication"'));
    assert.ok(!/<style[\s>]/.test(html), 'los estilos no deben duplicarse dentro de cada idioma');
  });

  test(`${page.lang}: cubre el recorrido completo de decisión`, () => {
    const html = htmlFor(page.file);

    for (const id of ['producto', 'funciones', 'privacidad', 'precios', 'faq']) {
      assert.match(html, new RegExp(`id="${id}"`), `falta la sección #${id}`);
    }
    for (const lang of ['es', 'en', 'fr', 'de', 'pt']) {
      assert.match(html, new RegExp(`hreflang="${lang}"`));
    }
    assert.match(html, /<details[\s>]/, 'las dudas deben usar disclosures nativos y accesibles');
  });

  test(`${page.lang}: compara Gratis y Pro con límites y funciones reales`, () => {
    const html = htmlFor(page.file);
    const comparison = html.match(/<div class="pricing-comparison"([\s\S]*?)<!-- end-pricing-comparison -->/)?.[1];
    assert.ok(comparison, 'precios y funciones deben compartir las mismas tarjetas');
    assert.equal((comparison.match(/data-plan="/g) ?? []).length, 2);
    assert.equal((comparison.match(/data-included="false"/g) ?? []).length, 6);
    assert.equal((comparison.match(/data-included="true"/g) ?? []).length, 16);
    assert.equal((comparison.match(/class="payment-option/g) ?? []).length, 2);
    assert.match(comparison, /<svg/);
    assert.doesNotMatch(comparison, /<table/);
    assert.match(html, /id="plan-comparison-note"/);
    assert.doesNotMatch(comparison, /billing\.|undefined/);
    assert.doesNotMatch(html, /Plantillas y acciones avanzadas|Templates and advanced actions|Modèles et actions avancées|Vorlagen und erweiterte Aktionen|Modelos e ações avançadas/);
  });
}

test('los recursos compartidos y las capturas optimizadas existen', () => {
  for (const file of [
    'assets/site.css',
    'assets/site.js',
    'assets/product/unified-inbox.png',
    'assets/product/multiple-accounts.png',
    'assets/product/appearance.png',
    'assets/product/unified-inbox.webp',
    'assets/product/unified-inbox-640.webp',
    'assets/product/multiple-accounts.webp',
    'assets/product/multiple-accounts-640.webp',
    'assets/product/appearance.webp',
    'assets/product/appearance-640.webp',
  ]) {
    assert.ok(existsSync(join(root, file)), `falta ${file}`);
  }
});

test('el CTA cumple contraste AA y el menú móvil cabe en la ventana', () => {
  const css = readFileSync(join(root, 'assets/site.css'), 'utf8');
  const coral = css.match(/--coral:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(coral, 'falta el token --coral');

  const channel = (hex, index) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(coral, 1) + 0.7152 * channel(coral, 3) + 0.0722 * channel(coral, 5);
  const contrastWithWhite = 1.05 / (luminance + 0.05);

  assert.ok(contrastWithWhite >= 4.5, `contraste blanco/coral insuficiente: ${contrastWithWhite.toFixed(2)}:1`);
  assert.ok(css.includes('max-block-size: calc(100dvh - 5.5rem)'));
  assert.match(css, /\.mobile-menu\s*\{[^}]*overflow:\s*auto/s);
});

test('las páginas no contienen caracteres rotos ni referencias locales ausentes', () => {
  for (const page of pages) {
    const html = htmlFor(page.file);
    assert.doesNotMatch(html, /(?:Ã.|Â.|â€|ðŸ)/, `${page.file} contiene texto con codificación dañada`);

    for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
      const url = match[1];
      if (url === '/' || url.includes('#') || url.startsWith('/en/') || url.startsWith('/fr/') || url.startsWith('/de/') || url.startsWith('/pt/') || url.startsWith('/privacidad/')) continue;
      assert.ok(existsSync(join(root, url.slice(1))), `${page.file} referencia un recurso ausente: ${url}`);
    }
  }
});
