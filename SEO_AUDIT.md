# Auditoría SEO técnico y descubrimiento de Difmeil

Fecha: 19 de noviembre de 2026. Al cerrar la auditoría inicial, la implementación
estaba preparada localmente, sin commit, push ni despliegue. La preparación
posterior de publicación se documenta al final de este informe.

## Alcance y fuentes del producto

La web pública es este repositorio estático, `difmeil-web`, publicado con GitHub
Pages desde `main`, raíz `/`. La extensión está en el repositorio hermano
`difmeil`. Se revisaron primero este README y sus instrucciones de generación,
así como `../difmeil/README.md`, `PRODUCT.md`, `ARCHITECTURE.md`,
`WEBSTORE_LISTING.md` y la documentación de instalación/publicación.

Se auditaron las diez URLs del sitemap: portadas y políticas de privacidad en
español, inglés, francés, alemán y portugués. También se inspeccionaron las
exclusiones de instalación, partners, referidos y QR. No se accedió a cuentas
Gmail, sesiones privadas, paneles autenticados ni datos de clientes.

## Diagnóstico inicial

| Elemento | Situación encontrada | Decisión |
| --- | --- | --- |
| Cinco portadas | HTML estático con producto, funciones, instalación, precios y FAQ; título, descripción y un H1 por página | Conservar la estructura, títulos y descripciones existentes |
| Cinco políticas | HTML estático, título y H1; faltaba metadescripción | Añadir resumen localizado, sin alterar el texto legal |
| Canonical | HTTPS, dominio sin www y barra final; cada página se referencia a sí misma | Conservar |
| Hreflang | Dos grupos separados y recíprocos de cinco idiomas; x-default inglés en ambos | Conservar; no duplicar las declaraciones en el sitemap |
| Robots y sitemap | Existentes tanto localmente como publicados; diez URLs canónicas, sin rutas auxiliares | Conservar, sin cambios de política |
| JSON-LD | SoftwareApplication existente; ofertas de planes y navegadores tratados como sistema operativo | Retirar ofertas; usar requisitos de software e información contrastable |
| FAQ | Cinco preguntas estáticas con details/summary; compatibilidad con Edge, Brave y Opera sin pruebas documentadas específicas | Sustituir esa afirmación por instalación y añadir público objetivo |
| Accesibilidad | Los nombres de idioma no tenían lang propio; Nu detectó dos errores ARIA por portada | Añadir lang y corregir semántica sin cambiar el aspecto ni los controles |
| Responsive | URLs técnicas de permisos en las políticas desbordaban a 320 px | Permitir el salto de línea de code, conservando texto y estilos |
| llms.txt | No existía localmente; producción respondía 404 | Añadir resumen experimental breve con enlaces canónicos |
| HTTP | La portada responde 200 por HTTP sin redirección a HTTPS | Acción manual en GitHub Pages |

Los precios visibles existentes coinciden con la documentación del producto y
no se han modificado. No se añadieron compatibilidades, valoraciones,
testimonios, funciones futuras, ofertas estructuradas ni datos personales.

## Implementación y archivos modificados

| Archivos | Cambio |
| --- | --- |
| `scripts/build-homepages.mjs` | Fuente de las cinco portadas: público objetivo explícito, FAQ de instalación y público, lang en selector y JSON-LD corregido; quitar aria-expanded del invocador popover nativo |
| `index.html`, `en/index.html`, `fr/index.html`, `de/index.html`, `pt/index.html` | Regenerados desde esa fuente; no editados manualmente |
| `scripts/plan-comparison.mjs` | role=group permite nombrar la agrupación con aria-labelledby |
| `assets/site.js` | Dejar el estado expandido al popover nativo; mantener ARIA explícito en el fallback, con los mismos clics, Escape y cierre al navegar |
| `privacidad/index.html`, `en/privacy/index.html`, `fr/confidentialite/index.html`, `de/datenschutz/index.html`, `pt/privacidade/index.html` | Metadescripción localizada, lang/hreflang en enlaces de idioma y ajuste de línea de code |
| `llms.txt` | Resumen público experimental, funciones verificadas y enlaces a diez páginas y tienda; sin precios ni datos identificativos del responsable |
| `tests/seo.test.mjs` | Metadatos, indexabilidad, grupos hreflang, enlaces/fragmentos/recursos, JSON-LD, FAQ, semántica, llms.txt y exclusiones |
| `tests/menu.test.mjs` | Regresión del menú nativo y fallback |
| `README.md`, `SEO_AUDIT.md` | Mantenimiento, diagnóstico, resultados y publicación |

Ya había cambios locales antes de empezar: README y política española
modificados; `robots.txt`, `sitemap.xml`, pruebas de sitemap, instalación y sus
recursos/pruebas sin seguimiento. Se conservaron. Este informe distingue esos
archivos existentes de los nuevos cambios de SEO; no atribuye su creación a
esta auditoría. No usar `git add .` sin revisar esa mezcla de trabajos.

## Rastreo y datos estructurados

`User-agent: *` con `Disallow:` vacío permite Googlebot, Bingbot y OAI-SearchBot.
Se verificó con un parser de robots para las diez URLs publicadas. No había una
política específica de GPTBot y no se añadió ni cambió ninguna. Búsqueda y
entrenamiento son controles independientes, según la
[documentación de crawlers de OpenAI](https://developers.openai.com/api/docs/bots).

Las rutas `/partners/`, `/creador-qr/`, `/instalar/` y los cinco `/r/` conservan
sus valores noindex y no están en el sitemap. No se bloquean en robots para que
los buscadores puedan leer noindex. Robots y noindex no sustituyen el control
de acceso del producto.

El JSON-LD conserva SoftwareApplication y utiliza nombre, identificador estable,
categoría, descripción localizada, URL canónica, installUrl de Chrome Web
Store, idioma, requisito Google Chrome, imagen y funciones visibles. Chrome es
un requisito de software, no un sistema operativo. Se contrastaron propiedades
y tipos con [Schema.org](https://schema.org/SoftwareApplication).

No contiene offers, AggregateRating ni reviews. Esto describe el producto sin
pretender cumplir la elegibilidad del resultado enriquecido de aplicaciones de
Google, que exige propiedades adicionales. No se inventan para pasar ese test.
Referencia: [requisitos de Google para aplicaciones](https://developers.google.com/search/docs/appearance/structured-data/software-app).
No se añadió FAQPage ni se prometen resultados enriquecidos de FAQ.

Hreflang sigue en el head HTML, con autorreferencia y reciprocidad, sin mezclar
portadas con políticas. x-default sigue apuntando a `/en/` o `/en/privacy/`
según el grupo. No hay motivos para cambiarlo al español. Referencia:
[versiones localizadas de Google](https://developers.google.com/search/docs/specialty/international/localized-versions).

`llms.txt` es complementario y experimental, siguiendo la
[propuesta de llms.txt](https://llmstxt.org/). No es un requisito oficial de
indexación ni garantiza descubrimiento o citas. Los hechos esenciales siguen
en HTML visible para todos y se deben mantener sincronizados con este resumen.

## Pruebas locales realizadas

- Generación: `node scripts/build-homepages.mjs`, cinco portadas generadas.
- Suite completa: `node --test tests/*.test.mjs`, **79 pruebas, 79 correctas**.
  Las pruebas nuevas detectaron los defectos antes de corregirlos.
- Sitemap: análisis XML real con PowerShell `[xml]`, diez entradas; suite que
  compara el inventario indexable con el sitemap y detecta duplicados.
- HTML: Nu Validator **26.11.19 (7d4eff9)** sobre las diez páginas; inicialmente
  diez errores ARIA, después **cero errores**. Se usó `--errors-only`; no se
  presenta este resultado como ausencia de avisos o certificación WCAG.
- JSON-LD: JSON.parse de los cinco bloques y comprobación de tipos, campos,
  URLs, idioma, ausencia de ofertas/ratings y funciones frente al texto visible.
  Propiedades contrastadas con Schema.org; no se ejecutó su validador remoto
  ni el Rich Results Test de Google.
- Navegador: Playwright con Chromium **153.0.8010.12**, servido localmente por
  HTTP. Diez páginas × cuatro anchos (320, 390, 768, 1440 px) × JavaScript
  activado/desactivado = **80 comprobaciones sin desbordamiento horizontal**.
- FAQ operables con Enter y menú nativo con Enter/Escape a 390 y 768 px,
  con y sin JavaScript; fallback probado en la suite de Node. Producto, pasos
  e instalación ya están en la respuesta HTML, no dependen de hidratación.
- Revisión de capturas de escritorio y móvil; comprobación de carga de imágenes.
- axe-core **4.14.1**, reglas WCAG A/AA 2.0/2.1/2.2 en las diez páginas a
  1440 px: ninguna infracción detectada en las portadas; una infracción de
  contraste en cada política, detallada abajo. Hay comprobaciones incompletas
  de contraste en las portadas por fondos con degradados/solapamientos.
- Revisión independiente de los cambios y `git diff --check`.

La web es estática y no tiene package.json ni build de framework. El comando
de generación anterior es su build. No se compiló ni modificó la extensión.

Para repetir HTML con Nu instalado fuera del repositorio:

```powershell
java -jar "$env:TEMP/difmeil-vnu.jar" --errors-only --format json index.html en/index.html fr/index.html de/index.html pt/index.html privacidad/index.html en/privacy/index.html fr/confidentialite/index.html de/datenschutz/index.html pt/privacidade/index.html
```

## Comprobaciones reales de producción

Se hicieron peticiones HTTP de solo lectura; no son una verificación del
despliegue de los nuevos cambios locales.

| Recurso publicado | Resultado observado |
| --- | --- |
| Las diez URLs de sitemap | HTTP 200, HTML; idioma, H1, canonical y seis alternates correctos; sin X-Robots-Tag restrictivo |
| Las cinco políticas | Sin metadescripción todavía, como se detectó en el diagnóstico |
| `/robots.txt` | HTTP 200, text/plain, permite rastreo y referencia al sitemap |
| `/sitemap.xml` | HTTP 200, application/xml, diez URLs |
| Ficha oficial de Chrome Web Store | HTTP 200, título Difmeil - Chrome Web Store y canonical al mismo identificador |
| `/partners/`, `/r/`, `/creador-qr/`, `/instalar/` | HTTP 200, conservan noindex |
| `/llms.txt` | HTTP 404; nuevo archivo pendiente de publicar |
| `http://difmeil.com/` | HTTP 200 sin redirección, confirmado con GET y curl HEAD |
| `https://www.difmeil.com/` | HTTP 301 a `https://difmeil.com/` |
| `/en` | Redirección a `/en/`, respuesta final 200 |
| `/en/index.html` | HTTP 200, canonical a `/en/`; variante normalizada por señal canonical |

Enlace oficial contrastado:
[Difmeil en Chrome Web Store](https://chromewebstore.google.com/detail/difmeil/eojoffejiddgjbjgkkgkfhccgofjejad).
La validación de enlaces locales incluye las diez páginas, sus fragmentos,
imágenes y recursos, así como el destino oficial de los enlaces a la tienda.
No se probó una instalación real, OAuth con Gmail ni cada enlace externo legal.

## Pendientes y acciones manuales

1. **Publicar los cambios revisados en main y esperar GitHub Pages.** El sitio
   sirve archivos desde la raíz; no copiar a dist ni ejecutar Node en producción.
   Revisar primero los cambios previos de Ads/privacidad para no publicarlos
   accidentalmente. Los robots y sitemap ya están publicados pero aparecen sin
   seguimiento local: confirmar su incorporación/versionado con su trabajo original.
2. **Activar o comprobar Enforce HTTPS en Settings → Pages.** HTTP 200 sin
   redirección sigue permitiendo una variante adicional. Canonical HTTPS ya
   existe; una etiqueta HTML no puede sustituir la redirección del servidor.
3. **Revisar el contraste del enlace de soporte del bloque responsable en las
   cinco políticas.** axe mide 3,73:1 (`#1a73e8` sobre `#e8eaed`), inferior a
   4,5:1 para texto normal. No se cambiaron los colores por la restricción de
   conservar el diseño. Las portadas necesitan además revisión manual de los
   contrastes que axe dejó incompletos. No se afirma conformidad WCAG completa.
4. Tras desplegar, repetir las diez URLs y comprobar que `/llms.txt` responde
   200, metadescripciones y JSON-LD nuevos están en el HTML y no se han alterado
   noindex, robots ni sitemap. Confirmar HTTP → HTTPS tras cambiar Pages.
5. En Google Search Console y Bing Webmaster Tools, con las propiedades
   verificadas, enviar o revisar `https://difmeil.com/sitemap.xml` e inspeccionar
   las portadas principales. No se accedió a estas herramientas ni se solicitó
   indexación desde esta sesión.
6. Usar Schema.org Validator para el vocabulario y Rich Results Test para
   conocer la elegibilidad real. La ausencia intencional de ofertas/valoraciones
   puede impedir el resultado enriquecido de software; no es un motivo para
   inventarlas. Comprobar lector de pantalla y otros motores/navegadores si se
   necesita una auditoría de accesibilidad exhaustiva.

No se midieron Core Web Vitals de campo, indexación real, logs de bots, visitas
desde las IP oficiales de crawlers ni presencia o citas en asistentes. No se
garantiza posicionamiento, inclusión en índices ni visibilidad en IA.

## Preparación posterior del commit exclusivo de SEO

Se comprobó el estado real de Git y GitHub Pages antes de preparar el commit.
El remoto es `https://github.com/martinmunozb/difmeil.git`. La copia original
estaba en `main`, dos commits por detrás de `origin/main`; sus archivos se
conservaron íntegros, incluidos los cambios previos sin seguimiento local.

La base remota es `074bd6a5f1cd5de6ac5030f6542411aa03d41fc5`: ya incluye la
instalación con atribución consentida y la publicación de robots/sitemap. Pages
confirma ese mismo commit desplegado correctamente, desde `main`, raíz `/`,
con dominio `difmeil.com`, build legacy y `https_enforced: false`.

La preparación se hizo en un worktree separado, rama
`seo/technical-discovery-20261119`, basado en ese commit remoto. El parche de
README solo añade su sección SEO; el de la política española solo añade
metadescripción, idiomas de enlaces y ajuste de líneas de code. No se incluyen
modificaciones de texto legal sobre anuncios ni cambios de seguimiento.

La diferencia publicable contiene los 18 archivos del inventario anterior. Se
confirmó que los recursos/pruebas de Ads, `/instalar/`, robots y sitemap son
idénticos a la base remota. Se guardó además una referencia de hashes de las
12 rutas públicas de instalación, recursos Ads, referidos, QR, partners,
robots y sitemap para comprobar su conservación después del despliegue.

Se repitieron en el worktree las 79 pruebas (incluidas las cinco de Ads), el
build reproducible, el análisis XML y Nu Validator sin errores en las diez
páginas. También se repitieron las 80 comprobaciones de tamaño con y sin
JavaScript, con los mismos pendientes de contraste ya documentados.

El commit se prepara solo localmente. **El push a main y el despliegue automático
de Pages quedan pendientes de aprobación explícita del usuario.** Antes de
publicar, comprobar que el remoto siga en la base revisada; si avanzó, revisar
la nueva diferencia antes de integrar. No cambiar la configuración HTTPS ni
otras funcionalidades como parte de esta publicación.
