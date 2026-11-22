import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../404.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function run(pathname, search = '', hash = '') {
  let target = null;
  runInNewContext(script, { location: { pathname, search, hash, replace: (to) => (target = to) } });
  return target;
}

test('las rutas directas del panel vuelven a /partners/ con la ruta en ?ruta=', () => {
  assert.equal(run('/partners/growth'), '/partners/?ruta=growth');
  assert.equal(
    run('/partners/influencers/abc', '?tab=pagos', '#notas'),
    '/partners/?ruta=' + encodeURIComponent('influencers/abc?tab=pagos') + '#notas',
  );
});

test('el resto del sitio es un 404 de verdad, sin redirección', () => {
  for (const path of ['/no-existe', '/guias/no-existe/', '/partnersx/a', '/partners/']) {
    assert.equal(run(path), null, path);
  }
});

test('la página 404 no se indexa y no depende de recursos inexistentes', () => {
  assert.match(html, /<meta name="robots" content="noindex"/);
  for (const src of html.matchAll(/(?:src|href)="(\/[^"]+)"/g)) {
    assert.doesNotThrow(() => readFileSync(new URL('..' + src[1], import.meta.url)), src[1]);
  }
});
