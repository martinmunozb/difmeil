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
GitHub ni de copiar archivos a `dist`. El generador de portadas no los modifica. El generador de guías añade sus URLs al sitemap sin eliminar las existentes y actualiza su sección de llms.txt; no cambia robots.txt.

El sitemap incluye las cinco portadas, las cinco políticas de privacidad, las dos de Microsoft Edge (`/privacidad/edge/`, `/en/privacy/edge/`) y diez guías de Gmail,
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

## SEO técnico y descubrimiento

Consulta [SEO_AUDIT.md](SEO_AUDIT.md) para el diagnóstico, inventario de archivos,
pruebas, comprobaciones reales de producción y pasos de despliegue.

Las portadas incluyen `SoftwareApplication` sin ofertas ni valoraciones; sus
funciones deben coincidir con el contenido visible y la extensión publicada.
Conservar los dos grupos hreflang recíprocos (portadas y privacidad), canonical
propia y x-default inglés. Las páginas auxiliares mantienen noindex.

`llms.txt` es un resumen experimental complementario, no un requisito de
buscadores ni una garantía de citas. Mantenerlo actualizado con las funciones y
enlaces públicos; no añadir datos privados ni precios que puedan quedar obsoletos.

Después de cambiar el generador, reconstruir y verificar:

```powershell
node scripts/build-homepages.mjs
node --test tests/*.test.mjs
```

## Guías editoriales en cinco idiomas

Las dos guías de Gmail se mantienen en `scripts/guides/{es,en,fr,de,pt}.json`.
Cada fichero contiene todos los textos del idioma: interfaz, metadatos, artículos,
tablas, FAQs, pies y textos alternativos. No hay traducción en tiempo de ejecución
ni contenido principal dependiente de JavaScript.

`scripts/guides/config.mjs` define rutas, idiomas y páginas de privacidad.
`scripts/guides/render.mjs` mantiene el HTML común y las tarjetas de portada.
`scripts/build-guides.mjs` genera las diez páginas, añade las rutas que falten al
sitemap sin eliminar las anteriores y actualiza la sección de guías de llms.txt.
No cambia robots.txt. Las cinco portadas enlazan ambas guías mediante su generador.
No editar directamente los HTML generados.

```powershell
node scripts/build-guides.mjs
node scripts/build-homepages.mjs
node --test tests/*.test.mjs
python -m http.server 8766 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8766/guias/gestionar-varias-cuentas-gmail/` o la portada
del idioma deseado y su sección de guías. El selector de idioma conserva el
artículo que se está leyendo. La URL inglesa original y sus fragmentos permanecen.

Consultar [GMAIL_GUIDE_REVIEW.md](GMAIL_GUIDE_REVIEW.md) para las diez URLs,
fuentes, archivos, validaciones y capturas. Al cambiar funciones o instalación,
contrastar primero con documentación y código de `../difmeil`; actualizar todas
las versiones y la fecha de revisión visible solo después de verificarlas.
Las capturas actuales reutilizan únicamente la imagen segura de Ajustes,
identificada como interfaz en español en cada idioma. No inventar capturas ni
utilizar mensajes o datos personales. El servidor de vista previa no publica.

La auditoría deja pendientes la redirección HTTP a HTTPS en GitHub Pages y la
revisión del contraste de un enlace en las políticas; ver detalle en el informe.

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
