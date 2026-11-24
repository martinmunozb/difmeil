// Tiendas de Difmeil. Las páginas enlazan a Chrome Web Store en el HTML; en
// Microsoft Edge, y solo cuando la ficha de Edge Add-ons esté publicada, los
// enlaces de instalación y la política de privacidad pasan a los de Edge.
export const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/difmeil/eojoffejiddgjbjgkkgkfhccgofjejad';

// Vacía hasta que Microsoft publique la ficha: antes, ese enlace daría error, y
// en Edge se sigue ofreciendo Chrome Web Store, que Edge admite.
// Al publicar: 'https://microsoftedge.microsoft.com/addons/detail/flcohdbmbmijgehbeddkjbcncokhlbfn'
export const EDGE_STORE_URL = '';

// Política propia de Edge (es, en). Fr, de y pt van a la inglesa.
export const EDGE_PRIVACY = {
  '/privacidad/': '/privacidad/edge/',
  '/en/privacy/': '/en/privacy/edge/',
  '/fr/confidentialite/': '/en/privacy/edge/',
  '/de/datenschutz/': '/en/privacy/edge/',
  '/pt/privacidade/': '/en/privacy/edge/',
};

/** Microsoft Edge (Chromium), por marca del navegador o, si no la da, por user agent. */
export function isEdge(nav = globalThis.navigator) {
  const brands = nav?.userAgentData?.brands;
  if (Array.isArray(brands) && brands.length) return brands.some((b) => b.brand === 'Microsoft Edge');
  return /\bEdg\//.test(nav?.userAgent ?? '');
}

/** Edge con la ficha publicada: solo entonces se cambia algo. */
export function edgeStoreActive(nav = globalThis.navigator, url = EDGE_STORE_URL) {
  return Boolean(url) && isEdge(nav);
}

/** «Añadir a Chrome» → «Añadir a Edge»; «Chrome Web Store» → «Microsoft Edge Add-ons». */
export function edgeLabel(text) {
  return text.replace(/\bChrome Web Store\b/g, 'Microsoft Edge Add-ons').replace(/\bChrome\b/g, 'Edge');
}

/**
 * Cambia a Edge los enlaces de instalación y de privacidad de la página. Los
 * botones nombran Chrome en los cinco idiomas: se cambia solo ese nombre y se
 * quita el logotipo de Chrome. Devuelve cuántos enlaces cambió.
 */
export function applyEdgeStore(doc, url = EDGE_STORE_URL) {
  if (!url) return 0;
  let changed = 0;
  for (const link of doc.querySelectorAll('a[href^="https://chromewebstore.google.com/"]')) {
    link.setAttribute('href', url);
    link.querySelectorAll('.chrome-mark').forEach((mark) => mark.remove());
    for (const node of link.childNodes) {
      if (node.nodeType === 3) node.nodeValue = edgeLabel(node.nodeValue);
    }
    const label = link.getAttribute('aria-label');
    if (label) link.setAttribute('aria-label', edgeLabel(label));
    changed++;
  }
  for (const link of doc.querySelectorAll('a[href^="/"]')) {
    const target = EDGE_PRIVACY[link.getAttribute('href')];
    if (target) {
      link.setAttribute('href', target);
      changed++;
    }
  }
  return changed;
}
