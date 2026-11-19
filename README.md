# difmeil.com

Sitio estático publicado con GitHub Pages desde la rama `main`.

## Landing multidioma

Las portadas de español, inglés, francés, alemán y portugués se generan desde
`scripts/build-homepages.mjs`. No edites directamente los cinco `index.html`:
actualiza el contenido o la plantilla del generador y vuelve a ejecutar:

```powershell
node scripts\build-homepages.mjs
node --test tests\homepage.test.mjs
```

Los estilos y la interacción compartidos están en `assets/site.css` y
`assets/site.js`. Las capturas de producto mantienen PNG como respaldo y WebP
responsivo para la entrega normal del navegador.

## Publicación

La comparativa Gratis/Pro se define en `scripts/plan-comparison.mjs` y se incluye
al generar las cinco portadas. Mantenerla alineada con las restricciones de
licencia de la extensión; no anunciar funciones futuras como incluidas.
Precios y funciones comparten dos tarjetas: Gratis separa incluidas y exclusivas
de Pro con ticks/cruces SVG; Pro ofrece mensual/permanente y una sola lista.

GitHub Pages sirve la raíz de `main` bajo el dominio definido en `CNAME`.
Después de publicar, comprueba `/`, `/en/`, `/fr/`, `/de/` y `/pt/`.

## Sitemap e indexación

`sitemap.xml` y `robots.txt` son archivos estáticos en la raíz que publica
GitHub Pages (`main`, `/`), junto a `CNAME`. No dependen de ejecutar Node en
GitHub ni de copiar archivos a `dist`. El generador de portadas no los modifica.

El sitemap incluye las cinco portadas y las cinco políticas de privacidad,
con HTTPS, dominio canónico y barra final. Excluye instalación, referidos,
QR, partners, URLs de la extensión, parámetros y fragmentos. Al añadir o retirar
una página pública indexable, actualizar `sitemap.xml` y ejecutar:

```powershell
node scripts/build-homepages.mjs
node --test tests/*.test.mjs
[xml]$sitemap = Get-Content -Raw -Encoding UTF8 sitemap.xml
```

Para publicar estos cambios, incluir `sitemap.xml`, `robots.txt`,
`tests/sitemap.test.mjs` y esta documentación en un commit y subirlo a `main`.
Esperar a que termine correctamente el despliegue de Pages y comprobar que
`https://difmeil.com/sitemap.xml` responde HTTP 200 con XML (no HTML/404), y que
`https://difmeil.com/robots.txt` responde 200 con la referencia al sitemap.
En Google Search Console, seleccionar la propiedad verificada de `difmeil.com`,
abrir **Sitemaps** y enviar `https://difmeil.com/sitemap.xml`. Revisar después
su procesamiento y usar **Inspección de URLs** para las páginas prioritarias.
El envío del sitemap no garantiza la indexación.

Referencias: [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
y [publicación en GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Instalación desde OpenAI Ads (preparada, sin publicar)

`/instalar/` conserva `oppref` con consentimiento explícito antes de abrir la
tienda. El usuario instala, vuelve/recarga la página y pulsa Continuar antes
de conectar Gmail. `assets/ads-install.mjs` transfiere la referencia mediante
la API externa de Chrome a `eojoffejiddgjbjgkkgkfhccgofjejad`. Requiere una
versión de la extensión que acepte ese puente. No hay claves, Pixel ni correos
en esta página. La referencia caduca para su uso a los 30 días.

Destino del anuncio: `https://difmeil.com/instalar/`. Parámetros:
`utm_source=chatgpt&utm_medium=cpc&utm_campaign=difmeil_launch&utm_content=ad_es&oppref={oppref}`.
Publicar esta web y la extensión antes de cambiar el destino del anuncio.
Detalle de backend, deduplicación, pruebas y limitaciones: `docs/OPENAI_ADS.md`
en el repositorio de la extensión. No se ha cambiado la portada ni su generador.

```powershell
node --test tests/*.test.mjs
```
