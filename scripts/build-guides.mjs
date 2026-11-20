import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentFor, guideDocument } from './guides/render.mjs';
import { locales, origin } from './guides/config.mjs';

const sources = Object.keys(locales).map(lang => [lang, contentFor(lang)]);
for (const [lang, content] of sources) {
  if (content.guides.length !== 2) throw new Error(`${lang}: both guides are required`);
}
for (const [lang, content] of sources) {
  const config = locales[lang];
  for (const guide of content.guides) {
    const target = new URL(`..${config.routes[guide.key]}index.html`, import.meta.url);
    mkdirSync(dirname(fileURLToPath(target)), { recursive: true });
    writeFileSync(target, guideDocument(lang, guide), 'utf8');
  }
}
// Retain every existing URL; only add missing canonical guide entries.
const sitemapPath = new URL('../sitemap.xml', import.meta.url);
let sitemap = readFileSync(sitemapPath, 'utf8');
for (const config of Object.values(locales)) {
  for (const route of Object.values(config.routes)) {
    const entry = `<url><loc>${origin + route}</loc></url>`;
    if (!sitemap.includes(entry)) sitemap = sitemap.replace('</urlset>', `  ${entry}\n</urlset>`);
  }
}
writeFileSync(sitemapPath, sitemap, 'utf8');
const llmsPath = new URL('../llms.txt', import.meta.url);
let llms = readFileSync(llmsPath, 'utf8');
const guides = `## Gmail guides\n\n${sources.map(([lang, content]) => content.guides.map(g => `- [${g.title}](${origin + locales[lang].routes[g.key]}): ${locales[lang].name}.`).join('\n')).join('\n')}\n\n`;
llms = llms.replace(/## (?:Guides \(English\)|Gmail guides)[\s\S]*?(?=## Privacy)/, guides);
writeFileSync(llmsPath, llms, 'utf8');
console.log('Generated 10 localized Gmail guides.');
