import { applyEdgeStore, edgeLabel, edgeStoreActive, isEdge } from './stores.mjs';

const KEY = 'difmeilAdsClick';
export const EXTENSION_ID = 'eojoffejiddgjbjgkkgkfhccgofjejad';
function valid(value, now) {
  return value && value.consent === true && typeof value.oppref === 'string' &&
    value.oppref.trim() && value.oppref.length <= 4096 && !/[{}\u0000-\u001f\u007f]/.test(value.oppref) &&
    Number.isSafeInteger(value.capturedAt) && value.capturedAt <= now + 600000 && value.capturedAt >= now - 30 * 86400000;
}
export function createInstallFlow({storage, send, now = Date.now}) {
  let candidate = null;
  let allowed = false;
  function clear() { try { storage.removeItem(KEY); } catch {} }
  function choose(allow) {
    allowed = allow === true;
    if (allowed && valid(candidate, now())) {
      try { storage.setItem(KEY, JSON.stringify(candidate)); } catch {}
    } else clear();
  }
  return {
    init(url) {
      const params = new URL(url).searchParams;
      const values = params.getAll('oppref');
      let saved;
      try { saved = JSON.parse(storage.getItem(KEY) ?? 'null'); } catch {}
      if (!valid(saved, now())) { saved = null; clear(); }
      candidate = values.length ? {oppref: values.length === 1 ? values[0] : '', capturedAt: now(), consent: true} : saved;
      if (!valid(candidate, now())) candidate = null;
      // A new click needs its own affirmative choice; a previously saved choice survives reload.
      allowed = values.length === 0 && saved !== null;
      return allowed;
    },
    choose,
    async continue() {
      const attribution = allowed && valid(candidate, now()) ? candidate : null;
      return send({type:'ads:continue', attribution});
    },
  };
}

/**
 * Microsoft Edge: sin medición de anuncios (política 1.5.3 de Edge Add-ons).
 * Se borra cualquier referencia guardada, se quita de la URL y desaparecen la
 * casilla y el paso «Continuar», que solo existen para transferirla.
 */
export function setUpEdge(doc, storage, location, history, storeActive) {
  try { storage.removeItem(KEY); } catch {}
  const clean = new URL(location.href);
  clean.searchParams.delete('oppref');
  history.replaceState(null, '', clean.pathname + clean.search + clean.hash);
  doc.querySelectorAll('[data-ads-measurement]').forEach((el) => el.remove());
  if (storeActive) {
    applyEdgeStore(doc);
    const title = doc.querySelector('#install-title');
    if (title) title.textContent = edgeLabel(title.textContent);
  }
}

if (typeof document !== 'undefined' && isEdge()) {
  setUpEdge(document, localStorage, location, history, edgeStoreActive());
} else if (typeof document !== 'undefined') {
  const checkbox = document.querySelector('#measurement');
  const status = document.querySelector('#status');
  const button = document.querySelector('#continue');
  const safeStorage = {
    getItem: key => localStorage.getItem(key), setItem: (key,value) => localStorage.setItem(key,value), removeItem: key => localStorage.removeItem(key),
  };
  const send = message => new Promise((resolve, reject) => {
    if (!globalThis.chrome?.runtime?.sendMessage) { reject(new Error('extension_unavailable')); return; }
    chrome.runtime.sendMessage(EXTENSION_ID, message, response => {
      if (chrome.runtime.lastError || !response?.ok) reject(new Error('extension_unavailable'));
      else resolve(response);
    });
  });
  const flow = createInstallFlow({storage: safeStorage, send});
  checkbox.checked = flow.init(location.href);
  // No click identifier in later requests/referrers or copied browser URLs.
  const clean = new URL(location.href);
  clean.searchParams.delete('oppref');
  history.replaceState(null, '', clean.pathname + clean.search + clean.hash);
  checkbox.addEventListener('change', () => {
    flow.choose(checkbox.checked);
    if (!checkbox.checked) void send({type:'ads:forget'}).catch(() => undefined);
  });
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      await flow.continue();
      status.textContent = 'Difmeil está abierto. Ya puedes conectar tu primera cuenta de Gmail.';
    } catch {
      status.textContent = 'Instala la versión compatible de Difmeil y recarga esta página. Después pulsa Continuar. También puedes abrir Difmeil desde la barra de Chrome.';
    } finally { button.disabled = false; }
  });
}
