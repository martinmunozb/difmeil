import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../assets/site.js', import.meta.url), 'utf8');

function setup(native) {
  const attrs = { popovertarget: 'mobile-menu' };
  const handlers = {};
  const linkHandlers = {};
  let focused = false;
  const button = {
    setAttribute: (key, value) => { attrs[key] = value; },
    removeAttribute: (key) => { delete attrs[key]; },
    addEventListener: (type, fn) => { handlers[`button:${type}`] = fn; },
    focus: () => { focused = true; },
  };
  const menu = {
    hidden: false, open: false,
    addEventListener: (type, fn) => { handlers[`menu:${type}`] = fn; },
    querySelectorAll: () => [{ addEventListener: (type, fn) => { linkHandlers[type] = fn; } }],
    matches: () => menu.open,
    hidePopover: () => { menu.open = false; },
  };
  vm.runInNewContext(source, {
    HTMLElement: { prototype: native ? { popover: '' } : {} },
    document: {
      querySelector: (selector) => selector === '#mobile-menu' ? menu : button,
      querySelectorAll: () => [],
      addEventListener: (type, fn) => { handlers[`document:${type}`] = fn; },
    },
  });
  return { attrs, handlers, linkHandlers, menu, focused: () => focused };
}

test('el menú nativo conserva popovertarget y deja el estado expandido al navegador', () => {
  const s = setup(true);
  s.menu.open = true;
  s.linkHandlers.click();
  assert.equal(s.menu.open, false);
  assert.equal(s.attrs.popovertarget, 'mobile-menu');
  assert.ok(!('aria-expanded' in s.attrs));
});

test('el fallback expone el estado y conserva apertura, cierre y Escape', () => {
  const s = setup(false);
  assert.equal(s.menu.hidden, true);
  assert.equal(s.attrs['aria-expanded'], 'false');
  assert.ok(!('popovertarget' in s.attrs));
  s.handlers['button:click']();
  assert.equal(s.menu.hidden, false);
  assert.equal(s.attrs['aria-expanded'], 'true');
  s.handlers['document:keydown']({ key: 'Escape' });
  assert.equal(s.menu.hidden, true);
  assert.equal(s.attrs['aria-expanded'], 'false');
  assert.equal(s.focused(), true);
  s.handlers['button:click']();
  s.linkHandlers.click();
  assert.equal(s.menu.hidden, true);
  assert.equal(s.attrs['aria-expanded'], 'false');
});
