import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInstallFlow } from '../assets/ads-install.mjs';
const setup = () => {
  const data = new Map();
  const calls = [];
  const storage = { getItem: k => data.get(k), setItem: (k,v) => data.set(k,v), removeItem: k => data.delete(k) };
  const flow = createInstallFlow({ storage, send: async m => { calls.push(m); return { ok: true }; }, now: () => 2000000000000 });
  return { flow, data, calls, storage };
};
test('no persistent advertising storage before an affirmative choice', () => {
  const { flow, data } = setup();
  flow.init('https://difmeil.com/instalar/?oppref=original%2F%2BOpaque%3D%3D');
  assert.equal(data.size, 0);
  flow.choose(true);
  assert.equal(data.size, 1);
});
test('the opaque reference survives reload with original capture time', async () => {
  const { flow, calls, storage } = setup();
  flow.init('https://difmeil.com/instalar/?oppref=original%2F%2BOpaque%3D%3D');
  flow.choose(true);
  const next = createInstallFlow({ storage, send: async m => { calls.push(m); return { ok: true }; }, now: () => 2000000001000 });
  assert.equal(next.init('https://difmeil.com/instalar/'), true);
  await next.continue();
  assert.deepEqual(calls, [{ type: 'ads:continue', attribution: { oppref: 'original/+Opaque==', capturedAt: 2000000000000, consent: true } }]);
});
test('denial clears storage and tells the extension to forget the click', async () => {
  const { flow, data, calls } = setup();
  flow.init('https://difmeil.com/instalar/?oppref=original');
  flow.choose(true);
  flow.choose(false);
  await flow.continue();
  assert.equal(data.size, 0);
  assert.deepEqual(calls, [{ type: 'ads:continue', attribution: null }]);
});
test('rejects duplicate, empty, template and expired references', async () => {
  for (const query of ['oppref=%7Boppref%7D', 'oppref=', 'oppref=a&oppref=b']) {
    const { flow, calls } = setup();
    flow.init('https://difmeil.com/instalar/?' + query);
    flow.choose(true);
    await flow.continue();
    assert.equal(calls[0].attribution, null);
  }
  const { flow, storage, calls } = setup();
  flow.init('https://difmeil.com/instalar/?oppref=original');
  flow.choose(true);
  const next = createInstallFlow({ storage, send: async m => { calls.push(m); return { ok: true }; }, now: () => 2000000000000 + 31 * 86400000 });
  assert.equal(next.init('https://difmeil.com/instalar/'), false);
  await next.continue();
  assert.equal(calls[0].attribution, null);
});
test('blocked storage still allows unmeasured installation', async () => {
  const calls=[];
  const storage={ getItem() { throw Error(); }, setItem() { throw Error(); }, removeItem() { throw Error(); } };
  const flow=createInstallFlow({storage, send:async m=>{calls.push(m);return {ok:true};}});
  flow.init('https://difmeil.com/instalar/');
  flow.choose(false);
  assert.equal((await flow.continue()).ok,true);
  assert.equal(calls[0].attribution,null);
});
