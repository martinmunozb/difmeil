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
