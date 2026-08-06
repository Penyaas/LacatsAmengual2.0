# Lacats Amengual · Can Bareta — web estática

Web de una sola página para el taller de lacado y restauración de mobiliario Lacats Amengual (Can Bareta), en Manacor. HTML + CSS + JavaScript vanilla, sin build step, sin frameworks ni dependencias de render externas.

## Estructura de archivos

```
/
├── index.html                 página principal (10 secciones)
├── aviso-legal.html
├── politica-privacidad.html
├── politica-cookies.html
├── styles.css                 todo el CSS del sitio
├── main.js                    todo el JS del sitio
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── /assets
│   ├── favicon.svg
│   ├── og-image.svg           placeholder — sustituir por og-image.jpg
│   └── /img                   placeholders de fotos, ver más abajo
└── README.md
```

## Abrir en local

No requiere build. Basta con abrir `index.html` en el navegador, o servirlo con cualquier servidor estático:

```bash
npx serve .
# o
python -m http.server 8080
```

## Desplegar

**Netlify / Vercel:** arrastra la carpeta del proyecto al panel, o conecta el repositorio Git. No hay comando de build: déjalo vacío y el directorio de publicación como la raíz (`.`).

**GitHub Pages:** activa Pages en los ajustes del repositorio apuntando a la rama `main` y a la raíz (`/`).

En cualquiera de los tres, actualiza antes:
- La URL canónica (`https://www.lacatsamengual.es/...`) en el `<head>` de cada página, en `robots.txt` y en `sitemap.xml`, por el dominio real donde se publique.

## Sustituir las imágenes placeholder

Todas las fotos son `.svg` con un recuadro y una etiqueta indicando qué foto va ahí y en qué proporción. Sustitúyelas por fotografías reales del taller, manteniendo el mismo nombre de archivo (o actualizando la ruta en el HTML) y, idealmente, en formato `.webp` con fallback `.jpg`:

| Archivo actual | Foto que debe ir | Proporción / tamaño recomendado |
|---|---|---|
| `assets/img/hero-lacado.svg` | Superficie de mueble lacado, luz rasante | 4:5 · ~1200×1500 px |
| `assets/img/taller-can-bareta-manacor.svg` | Interior del taller | 3:4 · ~1200×1600 px |
| `assets/img/restauracion-antes-comoda.svg` | Mueble antes de restaurar | 4:3 · ~1200×900 px |
| `assets/img/restauracion-despues-comoda.svg` | Mismo mueble después | 4:3 · ~1200×900 px |
| `assets/img/detalle-acabado-satinado.svg` | Detalle de un acabado satinado | 4:3 · ~1200×900 px |
| `assets/img/lacado-puertas-cocina-mate.svg` | Puertas de cocina lacadas en mate | 4:3 · ~1200×900 px |
| `assets/img/mueble-medida-taller.svg` | Mueble a medida terminado | 3:4 · ~1200×1600 px |
| `assets/og-image.svg` | Imagen para compartir en redes (taller o pieza acabada) | 1200×630 px, formato `.jpg` |
| `assets/favicon.svg` | Puede mantenerse el monograma "CB" en SVG, o sustituirse | 32×32 px |

Todas las imágenes de la galería y del proceso llevan `loading="lazy"` salvo la del hero. Si generas versiones `.webp`, usa `<picture>` con fallback `.jpg` para máxima compatibilidad.

**Favicon `.ico`:** el sitio usa `favicon.svg` (soportado por navegadores modernos). Para compatibilidad total, genera un `favicon.ico` a partir del SVG (por ejemplo con [realfavicongenerator.net](https://realfavicongenerator.net)) y añade `<link rel="icon" href="/assets/favicon.ico" sizes="any">` en el `<head>` de cada página.

## Activar el formulario de contacto

Por defecto, el formulario de contacto **no requiere backend**: al enviarse, JavaScript abre el cliente de correo del visitante con un `mailto:` prerrellenado a `lacatsamengual@gmail.com` (ver `main.js`, variable `DEST_EMAIL`).

Para conectarlo a un servicio real (recomendado en producción):

### Opción A — Netlify Forms
1. En `index.html`, añade al `<form class="contact-form" ...>`:
   ```html
   <form class="contact-form" name="contacto" method="POST" data-netlify="true" data-backend="connected" ...>
     <input type="hidden" name="form-name" value="contacto">
   ```
2. Con `data-backend="connected"`, `main.js` deja de interceptar el envío con `mailto:` y el formulario lo gestiona Netlify de forma nativa.
3. Despliega en Netlify: detecta el formulario automáticamente en el build y las respuestas llegan al panel de "Forms".

### Opción B — Formspree
1. Crea un formulario en [formspree.io](https://formspree.io) y copia tu endpoint.
2. En `index.html`, cambia la etiqueta del formulario a:
   ```html
   <form class="contact-form" action="https://formspree.io/f/TU_ID" method="POST" data-backend="connected" ...>
   ```
3. Con `data-backend="connected"`, el envío lo gestiona Formspree y `main.js` ya no usa `mailto:`.

El campo oculto `empresa-web` es un honeypot anti-spam: debe permanecer vacío y oculto (ya está resuelto en el CSS con `.form-honeypot`).

## Mapa y cookies

El `<iframe>` de Google Maps en la sección de contacto **no se carga por defecto**: solo se activa si el visitante acepta el banner de cookies o pulsa "Cargar mapa". Esto evita cargar cookies de terceros sin consentimiento. Si en algún momento se elimina el mapa incrustado (por ejemplo, sustituyéndolo por una imagen estática con enlace a Google Maps), el banner de cookies y el bloque `.map-consent` de `main.js` pueden eliminarse por completo, ya que el sitio no cargaría ninguna cookie.

## Campos legales pendientes

El NIF de Lacats Amengual C.B. no se publica en el sitio. El correo de contacto ya está fijado a `lacatsamengual@gmail.com` en las páginas legales, el pie de página y `main.js` (`DEST_EMAIL`). Si el NIF se quisiera añadir más adelante (por ejemplo, si lo pide algún proveedor de pago o formulario), es obligatorio en el aviso legal según la LSSI-CE — revísalo con un asesor antes de publicar si eso cambia.

También revisa periódicamente el valor `reviewCount` del JSON-LD en `index.html` para que coincida con el número real de reseñas en Google.

## Checklist antes de publicar

- [ ] Responsive comprobado de 320 a 1920 px
- [ ] Teléfono y horario correctos en todas las páginas
- [ ] JSON-LD válido, con la dirección verificada ([validador de Google](https://search.google.com/test/rich-results))
- [ ] Enlaces legales funcionando
- [ ] Sin errores de consola ni enlaces rotos
- [ ] Imágenes placeholder sustituidas por fotos reales
- [ ] Formulario conectado a Netlify/Formspree si no se quiere depender del fallback `mailto:`
- [ ] URLs canónicas y `sitemap.xml` actualizados con el dominio real
- [ ] Lighthouse ≥ 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO
