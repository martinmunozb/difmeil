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

GitHub Pages sirve la raíz de `main` bajo el dominio definido en `CNAME`.
Después de publicar, comprueba `/`, `/en/`, `/fr/`, `/de/` y `/pt/`.
