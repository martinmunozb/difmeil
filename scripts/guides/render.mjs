import { readFileSync } from 'node:fs';
import { locales, origin, storeUrl } from './config.mjs';

export const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export function contentFor(lang) {
  return JSON.parse(readFileSync(new URL(`./${lang}.json`, import.meta.url), 'utf8'));
}
export function guideCards(lang) {
  const { ui, guides } = contentFor(lang);
  return `<section class="section section-soft" id="guides"><div class="wrap">
    <header class="section-heading"><p class="eyebrow">${escape(ui.guides)}</p><h2>${escape(ui.homeTitle)}</h2><p>${escape(ui.homeLead)}</p></header>
    <div class="story-grid">${guides.map(g => `<article class="story-card"><div class="story-copy"><h3><a href="${locales[lang].routes[g.key]}">${escape(g.title)}</a></h3><p>${escape(g.description)}</p></div></article>`).join('')}</div>
  </div></section>`;
}
export function guideDocument(lang, guide) {
  const { ui, guides } = contentFor(lang);
  const config = locales[lang];
  const route = config.routes[guide.key];
  const url = origin + route;
  const other = guides.find(g => g.key !== guide.key);
  const resolve = (html) => html.replace(/\{\{(home|privacy|store|inbox|notifications)\}\}/g, (_, key) => ({ home: config.home, privacy: config.privacy, store: storeUrl, ...config.routes })[key]);
  const install = (label, cls = 'btn btn-primary') => `<a class="${cls}" href="${storeUrl}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`;
  const languages = Object.entries(locales).map(([code, l]) => `<a href="${l.routes[guide.key]}" hreflang="${code}" lang="${code}"${code === lang ? ' aria-current="page"' : ''}>${l.name}</a>`).join('');
  const nav = `<a href="${config.home}">${escape(ui.product)}</a><a href="${config.home}#precios">${escape(ui.pricing)}</a><a href="#contents">${escape(ui.toc)}</a>`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': url + '#article', headline: guide.title, description: guide.description, mainEntityOfPage: url, inLanguage: lang, image: origin + '/assets/product/appearance.png', dateModified: '2026-11-20', author: { '@type': 'Organization', name: 'Difmeil', url: origin + config.home }, publisher: { '@type': 'Organization', name: 'Difmeil', url: origin + config.home } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: ui.home, item: origin + config.home }, { '@type': 'ListItem', position: 2, name: guide.title, item: url }] },
    ],
  };
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(guide.title)} | Difmeil</title>
  <meta name="description" content="${escape(guide.description)}">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#f7f5ef">
  <link rel="canonical" href="${url}">
  ${Object.entries(locales).map(([code, l]) => `<link rel="alternate" hreflang="${code}" href="${origin + l.routes[guide.key]}">`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${origin + locales.en.routes[guide.key]}">
  <link rel="icon" type="image/png" href="/assets/logo-mark.png">
  <link rel="stylesheet" href="/assets/site.css">
  <link rel="stylesheet" href="/assets/guide.css">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="${config.locale}">
  ${Object.entries(locales).filter(([code]) => code !== lang).map(([,l]) => `<meta property="og:locale:alternate" content="${l.locale}">`).join('\n  ')}
  <meta property="og:title" content="${escape(guide.title)}">
  <meta property="og:description" content="${escape(guide.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${origin}/assets/product/appearance.png">
  <meta property="og:image:width" content="1280">
  <meta property="og:image:height" content="800">
  <meta property="og:image:alt" content="${escape(ui.imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(guide.title)}">
  <meta name="twitter:description" content="${escape(guide.description)}">
  <meta name="twitter:image" content="${origin}/assets/product/appearance.png">
  <meta name="twitter:image:alt" content="${escape(ui.imageAlt)}">
  <script type="application/ld+json">${JSON.stringify(data, null, 2).replaceAll('<', '\\u003c')}</script>
  <script src="/assets/site.js" defer></script>
</head>
<body class="guide-page">
  <a class="skip-link" href="#contenido">${escape(ui.skip)}</a>
  <header class="site-header"><div class="wrap header-inner">
    <a class="brand" href="${config.home}" aria-label="Difmeil"><img src="/assets/logo-mark.png" width="32" height="32" alt="">Difmeil</a>
    <nav class="desktop-nav" aria-label="Difmeil">${nav}</nav>
    <div class="header-actions">${install(ui.install, 'btn btn-primary btn-small')}<button class="menu-button" type="button" popovertarget="mobile-menu" aria-controls="mobile-menu" aria-label="${escape(ui.menu)}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div>
  </div><div class="mobile-menu" id="mobile-menu" popover><nav aria-label="${escape(ui.menu)}">${nav}<a href="${config.privacy}">${escape(ui.privacy)}</a>${install(ui.install)}</nav></div></header>
  <main id="contenido"><article>
    <header class="guide-hero wrap">
      <div class="guide-topline"><nav class="guide-breadcrumb" aria-label="${escape(ui.home)}"><a href="${config.home}">${escape(ui.home)}</a><span aria-hidden="true">/</span><span>${escape(ui.guide)}</span></nav><nav class="guide-languages" aria-label="${escape(ui.language)}">${languages}</nav></div>
      <div class="guide-hero-grid"><div class="guide-hero-copy">
        <p class="eyebrow">${escape(guide.eyebrow)}</p><h1>${escape(guide.title)}</h1>
        <p class="guide-lead">${escape(guide.lead)}</p>
        <div class="guide-hero-cta">${install(ui.tryFree)}</div>
        <p class="guide-meta">${escape(ui.by)} · ${escape(ui.reviewed)} <time datetime="2026-11-20">${escape(ui.date)}</time></p>
      </div><figure class="guide-hero-image"><picture><source type="image/webp" srcset="/assets/product/appearance-640.webp 640w, /assets/product/appearance.webp 1280w" sizes="(max-width: 980px) calc(100vw - 40px), 44vw"><img src="/assets/product/appearance.png" width="1280" height="800" fetchpriority="high" decoding="async" alt="${escape(ui.imageAlt)}"></picture><figcaption>${escape(ui.imageCaption)}</figcaption></figure></div>
      <div class="guide-answer"><strong>${escape(ui.quick)}</strong><p>${resolve(guide.quick)}</p><a href="#comparison">${escape(ui.compare)}</a></div>
    </header>
    <div class="wrap guide-layout"><nav class="guide-toc" id="contents" aria-label="${escape(ui.toc)}"><h2>${escape(ui.toc)}</h2><ol>${guide.sections.map(s => `<li><a href="#${s.id}">${escape(s.label)}</a></li>`).join('')}</ol></nav>
      <div class="guide-body">${guide.sections.map(s => `<section id="${s.id}">${resolve(s.html)}${s.id === (guide.key === 'inbox' ? 'extensions' : 'plans') ? `<p>${install(ui.tryFree)}</p>` : ''}</section>`).join('\n')}
        <aside class="guide-related" aria-labelledby="related-title"><h2 id="related-title">${escape(ui.related)}</h2><p>${escape(ui.relatedText)}</p><a href="${config.routes[other.key]}">${escape(other.title)}</a></aside>
        <aside class="guide-cta" aria-labelledby="try-difmeil"><h2 id="try-difmeil">${escape(ui.ctaTitle)}</h2><p>${escape(ui.ctaText)}</p>${install(ui.ctaStore)}<p class="guide-meta"><a href="${config.home}">${escape(ui.product)}</a> · <a href="${config.privacy}">${escape(ui.privacy)}</a></p></aside>
      </div>
    </div>
  </article></main>
  <footer class="site-footer"><div class="wrap"><div class="footer-grid"><div class="footer-intro"><a class="brand" href="${config.home}"><img src="/assets/logo-mark.png" width="32" height="32" alt="">Difmeil</a><p>${escape(ui.footer)}</p></div><div class="footer-col"><h2>${escape(ui.product)}</h2><a href="${config.home}">${escape(ui.home)}</a><a href="${config.home}#precios">${escape(ui.pricing)}</a></div><div class="footer-col"><h2>${escape(ui.guides)}</h2>${guides.map(g => `<a href="${config.routes[g.key]}">${escape(g.title)}</a>`).join('')}</div><div class="footer-col"><h2>${escape(ui.privacy)}</h2><a href="${config.privacy}">${escape(ui.privacy)}</a><a href="mailto:support@difmeil.com">${escape(ui.support)}</a></div></div><div class="footer-bottom"><span>© <span data-year>2026</span> Difmeil</span></div></div></footer>
</body>
</html>
`;
}
