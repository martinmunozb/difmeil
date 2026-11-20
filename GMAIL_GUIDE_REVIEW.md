# Guías SEO de Gmail: revisión previa a publicación

Preparadas para revisión local el 20 de noviembre de 2026. Dos guías completas
localizadas en español, inglés, francés, alemán y portugués. Sin commit, push ni
despliegue. El artículo inglés original conserva su URL y todos sus fragmentos.

## Resultado y decisiones editoriales

La primera guía conserva la respuesta rápida, las alternativas, la comparación,
la instalación, la rutina, la resolución de problemas y sus siete FAQs. Ahora
incluye una captura real segura en el hero de escritorio y un CTA principal
visible bajo la introducción: «Try Difmeil for Free» en inglés y su equivalente
localizado. La segunda explica las notificaciones de Gmail en escritorio/móvil,
permisos de Chrome y del sistema, alternativas, instalación de Difmeil,
configuración, límites Gratis/Pro, diagnóstico y siete FAQs propias.

Ambas páginas tienen CTA en cabecera, introducción, una posición contextual y
cierre. Todos llevan directamente a la ficha oficial, sin parámetros ni eventos
nuevos. Se enlazan mutuamente y desde la portada de cada idioma. El selector de
idioma lleva al mismo artículo traducido, no a la portada.

Se conserva la estética oficial mediante assets/site.css y el estilo editorial
assets/guide.css. El contenido y FAQs son HTML estático. Las tablas tienen
cabeceras semánticas y una región desplazable con teclado. Hay canonical propia,
hreflang recíprocos es/en/fr/de/pt con x-default inglés, Open Graph localizado,
Twitter, Article y BreadcrumbList JSON-LD. No hay puntuaciones, testimonios ni
promesas de resultados enriquecidos o posicionamiento.

Se reutilizan appearance.png y sus variantes WebP existentes. La captura de
Ajustes no muestra mensajes, direcciones ni cuentas personales. El pie explica
en cada idioma que la interfaz de la captura está en español; no se simulan
pantallas traducidas ni de OAuth. Muestra Apariencia y el acceso a Notificaciones,
no se presenta como una captura de los controles de notificaciones. No se reutiliza
la captura de bandeja con asuntos de mensajes.

## URLs previstas

Todas bajo https://difmeil.com, con barra final:

| Idioma | Gestión de cuentas | Notificaciones |
| --- | --- | --- |
| Español | /guias/gestionar-varias-cuentas-gmail/ | /guias/notificaciones-varias-cuentas-gmail/ |
| English | /en/guides/manage-multiple-gmail-accounts/ | /en/guides/notifications-multiple-gmail-accounts/ |
| Français | /fr/guides/gerer-plusieurs-comptes-gmail/ | /fr/guides/notifications-plusieurs-comptes-gmail/ |
| Deutsch | /de/ratgeber/mehrere-gmail-konten-verwalten/ | /de/ratgeber/benachrichtigungen-mehrere-gmail-konten/ |
| Português | /pt/guias/gerenciar-varias-contas-gmail/ | /pt/guias/notificacoes-varias-contas-gmail/ |

Sitemap: veinte páginas indexables, diez guías y las diez páginas previas de
portadas/privacidad. No se eliminó ninguna URL existente. llms.txt enlaza las diez
guías con sus títulos e idiomas; sigue siendo un complemento experimental.
robots.txt no se modificó.

## Fuentes y comprobaciones del producto

Se revisaron README.md, SEO_AUDIT.md y el informe previo de la guía, además de
README.md, PRODUCT.md, ARCHITECTURE.md, WEBSTORE_LISTING.md y docs/SETTINGS.md
de la extensión. Los nombres de controles se contrastaron con sus diccionarios
localizados, no se tradujeron como si fueran pantallas nuevas.

Evidencia de implementación en ../difmeil:

- src/auth/oauth.ts: identidad básica, gmail.modify, gmail.send y
  contacts.other.readonly. Este último respalda fotos y sugerencias de
  destinatarios. No se inventa una pantalla fija de consentimiento.
- src/entrypoints/popup/App.tsx y AccountsPanel.tsx, e inbox/Sidebar.tsx:
  conectar cuentas, alta adicional, vista completa, selección de todas las
  cuentas o una sola y etiquetas reales de interfaz.
- src/gmail/client.ts: acciones sobre los mensajes originales mediante Gmail API.
- src/background/sync.ts, mailService.ts y notifier.ts: comprobaciones periódicas,
  avisos nativos, cuentas ocultas excluidas, identificación de avisos ya emitidos.
  No se promete entrega instantánea, funcionamiento con Chrome completamente
  cerrado ni ausencia de avisos de mensajes anteriores.
- src/settings/notificationRules.ts: interruptores global/por cuenta, filtros,
  bloqueo de remitentes y horarios. src/licensing/appearance.ts conserva los
  controles gratuitos y deja de aplicar las reglas premium cuando caduca Pro.
- src/licensing/types.ts: límite de tres cuentas gratuitas. No se duplican precios.

Fuentes oficiales consultadas y enlazadas dentro de los artículos, con el idioma
correspondiente en las versiones localizadas:

- [Varias cuentas de Google](https://support.google.com/accounts/answer/1721977?hl=en).
- [Diseños de bandeja, incluido Multiple Inboxes](https://support.google.com/mail/answer/18522?hl=en).
- [Añadir cuentas y All inboxes en Gmail móvil](https://support.google.com/mail/answer/6078445?hl=en).
- [Reenvío automático](https://support.google.com/mail/answer/10957?hl=en).
- [Send mail as](https://support.google.com/mail/answer/22370?hl=en).
- [Transición de Gmailify y POP](https://support.google.com/mail/answer/16604719?hl=en).
- [Notificaciones en escritorio](https://support.google.com/mail/answer/1075549?hl=en&co=GENIE.Platform%3DDesktop).
- [Notificaciones en Android](https://support.google.com/mail/answer/1075549?hl=en&co=GENIE.Platform%3DAndroid).
- [Notificaciones en iPhone/iPad](https://support.google.com/mail/answer/1075549?hl=en&co=GENIE.Platform%3DiOS).
- [Permisos de notificaciones en Chrome](https://support.google.com/chrome/answer/3220216?hl=en).
- [Ficha oficial de Difmeil](https://chromewebstore.google.com/detail/difmeil/eojoffejiddgjbjgkkgkfhccgofjejad).

La nota de POP mantiene el calendario oficial comprobado: sin nuevos usuarios
después del primer trimestre de 2026 y continuidad de existentes hasta enero de
2027. No se confunde con el cambio entre cuentas ni All inboxes móvil.

## Archivos de esta tarea

- scripts/build-guides.mjs: generación de artículos, altas en sitemap sin borrar
  URLs existentes y actualización de la sección de guías de llms.txt.
- scripts/guides/config.mjs: rutas, idiomas, portadas, privacidad y tienda oficial.
- scripts/guides/render.mjs: plantilla común, navegación, SEO y tarjetas de portada.
- scripts/guides/es.json, en.json, fr.json, de.json y pt.json: textos completos,
  incluidos metadatos, botones, tablas, FAQs, textos alternativos y pies.
- assets/guide.css: hero con captura real, CTA, idiomas y ajuste de palabras largas.
- Diez index.html de artículos, en las rutas de la tabla anterior.
- scripts/build-homepages.mjs y las cinco portadas generadas: sección y enlace de
  guías localizado, sin cambiar el recorrido de instalación ni instrumentación.
- sitemap.xml, llms.txt, tests/gmail-guide.test.mjs,
  tests/guides-localization.test.mjs, README.md y GMAIL_GUIDE_REVIEW.md.

El repositorio ya tenía cambios locales de SEO, privacidad, navegación y Ads. Se
conservaron. Se compararon hashes con el estado inicial: assets/site.js,
assets/site.css, assets/ads-install.css, assets/ads-install.mjs, instalar/index.html
y robots.txt permanecen idénticos. Tampoco se cambió ningún archivo de la
extensión. No usar git add . sin revisar la mezcla de trabajos locales previos.

## Validaciones ejecutadas

- Generación de las diez guías y cinco portadas con los comandos de abajo.
- Suite Node: 103 pruebas correctas. Las pruebas nuevas de diez páginas fallaron
  antes de implementar el generador y las localizaciones.
- Cobertura editorial: mismo inventario de secciones y pasos, misma estructura
  HTML, tablas y número de FAQs entre idiomas; todas las secciones traducidas.
- SEO: títulos y descripciones, un H1 por página, canonical, alternates recíprocos,
  equivalencia del selector, enlaces cruzados, descubrimiento desde portada,
  sitemap, llms.txt, datos Article/BreadcrumbList y destinos oficiales de CTA.
- Enlaces locales, fragmentos, recursos y preservación de los IDs ingleses.
- Nu HTML Validator 26.11.19: diez guías y cinco portadas, cero errores.
- Sitemap analizado como XML: veinte URLs, inventario indexable exacto sin duplicados.
- Chromium 153.0.8010.12: cien pruebas de las guías (diez páginas por cinco anchos,
  320/390/768/1024/1440 px, con/sin JavaScript), más treinta de las cinco portadas
  a 320/768/1440 px con/sin JavaScript. Sin desbordamiento horizontal de página.
- Veinte pruebas de teclado en las guías: FAQ, menú y desplazamiento de tablas,
  con/sin JavaScript. Diez comprobaciones adicionales de texto al 200 %.
- axe-core, WCAG A/AA 2.0/2.1/2.2: veinte análisis de guías, a 390 y 1440 px,
  sin infracciones detectadas ni comprobaciones incompletas.
- Veinte capturas de las dos guías por cinco idiomas, escritorio y móvil;
  revisión visual de hero, proporciones, legibilidad y texto largo alemán.
- Revisión independiente del contenido y plantilla; corregida la explicación
  sobre avisos de mensajes anteriores y su edad en las cinco versiones.
- git diff --check y comprobación de regeneración estable.

Los avisos no se probaron con mensajes reales ni se autorizó una cuenta mediante
OAuth durante esta tarea. La verificación del producto se basa en documentación
y código. No se realizó una auditoría exhaustiva con lectores de pantalla ni
medición de Core Web Vitals de campo. El alcance de axe indicado es el de las
guías; las incidencias históricas documentadas de las páginas legales no se
modifican en este trabajo.

## Capturas para revisión

La galería y los resultados de navegador están fuera del repositorio publicable:
C:/Users/nitra/AppData/Local/Temp/difmeil-guides-review/index.html

Esa carpeta contiene results.json y veinte PNG con el patrón
{es,en,fr,de,pt}-{inbox,notifications}-{desktop,mobile}.png. Las capturas de
escritorio miden 1440 × 1100 y las móviles 390 × 1400. No se empaquetan en la web.

## Previsualizar sin publicar

Desde D:/Programacion/Codigo/difmeil-web:

```powershell
node scripts/build-guides.mjs
node scripts/build-homepages.mjs
node --test tests/*.test.mjs
python -m http.server 8766 --bind 127.0.0.1
```

Abrir http://127.0.0.1:8766/guias/gestionar-varias-cuentas-gmail/ y
http://127.0.0.1:8766/guias/notificaciones-varias-cuentas-gmail/.
También se puede acceder desde la sección de guías de cada portada y usar el
selector de idioma. Detener el servidor con Ctrl+C.

Los HTML están listos para revisar; no se hizo commit, push ni despliegue.
