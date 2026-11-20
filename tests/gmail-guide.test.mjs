import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const route = '/en/guides/manage-multiple-gmail-accounts/';
const origin = 'https://difmeil.com';
const read = (path) => readFileSync(root + path, 'utf8');

test('the English Gmail guide is published as crawlable, self-canonical HTML', () => {
  assert.ok(existsSync(root + route + 'index.html'), 'English guide is missing');
  const html = read(route + 'index.html');
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<h1>How to Manage Multiple Gmail Accounts in One Inbox<\/h1>/);
  assert.match(html, /<title>How to Manage Multiple Gmail Accounts in One Inbox \| Difmeil<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]{80,170}">/);
  assert.ok(html.includes(`rel="canonical" href="${origin + route}"`));
  assert.doesNotMatch(html, /noindex|gtag\(|oppref|utm_/);
  assert.match(html, /<article\b/);
  assert.match(html, /<table>/);
  assert.match(html, /<caption\b/);
  assert.ok((html.match(/<details>/g) ?? []).length >= 5);
});

test('the guide is discoverable from the English homepage and discovery files', () => {
  assert.ok(read('en/index.html').includes(`href="${route}"`));
  assert.ok(read('scripts/build-homepages.mjs').includes('guideCards'), 'homepage build must retain guide discovery');
  assert.ok(read('sitemap.xml').includes(`<loc>${origin + route}</loc>`));
  assert.ok(read('llms.txt').includes(`](${origin + route})`));
});

test('guide links, fragments and resources resolve; store links use the official listing', () => {
  assert.ok(existsSync(root + route + 'index.html'), 'English guide is missing');
  const html = read(route + 'index.html');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(ref, origin + route);
    if (url.hostname === 'chromewebstore.google.com') {
      assert.equal(url.href, 'https://chromewebstore.google.com/detail/difmeil/eojoffejiddgjbjgkkgkfhccgofjejad');
    }
    if (url.origin !== origin) continue;
    const file = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
    assert.ok(existsSync(root + file), `missing resource ${ref}`);
    if (url.hash) assert.ok(read(file).includes(`id="${url.hash.slice(1)}"`), `missing fragment ${ref}`);
  }
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const data = graph['@graph'].find((item) => item['@type'] === 'Article');
  assert.equal(data.headline, 'How to Manage Multiple Gmail Accounts in One Inbox');
  assert.equal(data.mainEntityOfPage, origin + route);
  assert.equal(data.inLanguage, 'en');
  assert.doesNotMatch(html, /aggregateRating|FAQPage|HowTo"|testimonial/);
});
