import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyEdgeStore, edgeLabel, edgeStoreActive, EDGE_STORE_URL, isEdge } from '../assets/stores.mjs';
import { setUpEdge } from '../assets/ads-install.mjs';

const EDGE_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0';
const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const URL_EDGE = 'https://microsoftedge.microsoft.com/addons/detail/flcohdbmbmijgehbeddkjbcncokhlbfn';

function link(href, text, { mark = false, aria } = {}) {
  const attrs = { href, ...(aria ? { 'aria-label': aria } : {}) };
  const marks = mark ? [{ removed: false, remove() { this.removed = true; } }] : [];
  return {
    attrs, marks,
    childNodes: [{ nodeType: 3, nodeValue: text }],
    getAttribute: (k) => attrs[k] ?? null,
    setAttribute: (k, v) => { attrs[k] = v; },
    querySelectorAll: (s) => (s === '.chrome-mark' ? marks : []),
    get text() { return this.childNodes[0].nodeValue; },
  };
}

function page(links) {
  return {
    querySelectorAll(selector) {
      if (selector === 'a[href^="https://chromewebstore.google.com/"]') return links.filter((l) => l.attrs.href.startsWith('https://chromewebstore.google.com/'));
      if (selector === 'a[href^="/"]') return links.filter((l) => l.attrs.href.startsWith('/'));
      return [];
    },
  };
}

test('detecta Edge por marca o por user agent, y nada más', () => {
  assert.equal(isEdge({ userAgent: EDGE_UA }), true);
  assert.equal(isEdge({ userAgent: CHROME_UA }), false);
  assert.equal(isEdge({ userAgentData: { brands: [{ brand: 'Microsoft Edge' }, { brand: 'Chromium' }] }, userAgent: '' }), true);
  assert.equal(isEdge({ userAgentData: { brands: [{ brand: 'Google Chrome' }] }, userAgent: EDGE_UA }), false);
  assert.equal(isEdge(undefined), false);
});

test('sin URL de Edge publicada no cambia nada, ni siquiera en Edge', () => {
  assert.equal(EDGE_STORE_URL, '', 'la ficha de Edge aún no está publicada');
  assert.equal(edgeStoreActive({ userAgent: EDGE_UA }), false);
  const links = [link('https://chromewebstore.google.com/detail/difmeil/x', 'Añadir a Chrome')];
  assert.equal(applyEdgeStore(page(links)), 0);
  assert.equal(links[0].attrs.href, 'https://chromewebstore.google.com/detail/difmeil/x');
});

test('con URL publicada, solo Edge la activa', () => {
  assert.equal(edgeStoreActive({ userAgent: EDGE_UA }, URL_EDGE), true);
  assert.equal(edgeStoreActive({ userAgent: CHROME_UA }, URL_EDGE), false);
});

test('los botones pasan a Edge Add-ons en los cinco idiomas y la privacidad a la de Edge', () => {
  const links = [
    link('https://chromewebstore.google.com/detail/difmeil/x', 'Añadir a Chrome', { mark: true }),
    link('https://chromewebstore.google.com/detail/difmeil/x', 'Install Difmeil from Chrome Web Store'),
    link('https://chromewebstore.google.com/search/Difmeil', 'Instalar Difmeil'),
    link('/privacidad/', 'Privacidad'),
    link('/de/datenschutz/', 'Datenschutz'),
    link('/precios/', 'Precios'),
  ];
  assert.equal(applyEdgeStore(page(links), URL_EDGE), 5);
  assert.deepEqual(links.map((l) => l.attrs.href), [URL_EDGE, URL_EDGE, URL_EDGE, '/privacidad/edge/', '/en/privacy/edge/', '/precios/']);
  assert.equal(links[0].text, 'Añadir a Edge');
  assert.equal(links[0].marks[0].removed, true);
  assert.equal(links[1].text, 'Install Difmeil from Microsoft Edge Add-ons');
  assert.equal(links[2].text, 'Instalar Difmeil');
});

test('los textos reales de los botones quedan bien en Edge', () => {
  assert.equal(edgeLabel('Zu Chrome hinzufügen'), 'Zu Edge hinzufügen');
  assert.equal(edgeLabel('Ajouter à Chrome'), 'Ajouter à Edge');
  assert.equal(edgeLabel('Adicionar ao Chrome'), 'Adicionar ao Edge');
  assert.equal(edgeLabel('Instalar Difmeil desde Chrome Web Store'), 'Instalar Difmeil desde Microsoft Edge Add-ons');
});

test('instalar en Edge: sin referencia del anuncio, sin casilla y sin paso de transferencia', () => {
  const removed = [];
  const store = new Map([['difmeilAdsClick', '{"oppref":"x"}']]);
  let replaced;
  const doc = {
    querySelectorAll: (s) => (s === '[data-ads-measurement]' ? [1, 2, 3, 4].map((n) => ({ remove: () => removed.push(n) })) : []),
    querySelector: () => null,
  };
  setUpEdge(doc, { removeItem: (k) => store.delete(k) }, { href: 'https://difmeil.com/instalar/?oppref=abc&x=1#a' },
    { replaceState: (_s, _t, url) => { replaced = url; } }, false);
  assert.equal(store.size, 0);
  assert.equal(replaced, '/instalar/?x=1#a');
  assert.deepEqual(removed, [1, 2, 3, 4]);
});

test('la página de instalación marca todo lo relativo a la medición', () => {
  const html = readFileSync(new URL('../instalar/index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/data-ads-measurement/g) ?? []).length, 4);
  assert.match(html, /<label data-ads-measurement><input id="measurement"/);
  assert.match(html, /<section aria-labelledby="continue-title" data-ads-measurement>/);
});

test('las políticas de Edge existen, se enlazan entre sí y no hablan de medición publicitaria en Edge', () => {
  for (const path of ['../privacidad/edge/index.html', '../en/privacy/edge/index.html']) {
    const html = readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.match(html, /Microsoft Edge/);
    assert.match(html, /href="\/(en\/privacy|privacidad)\/edge\/"/);
    assert.doesNotMatch(html, /chrome\.storage|Chrome Web Store/);
    assert.match(html, /support@difmeil\.com/);
  }
});
