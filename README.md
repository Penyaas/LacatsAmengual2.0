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

## Imágenes

Las fotos placeholder en `.svg` ya se han sustituido por fotografías reales del taller (recortadas, corregidas de color/nitidez y exportadas en `.jpg` + `.webp`, servidas con `<picture>`). Los originales sin recortar quedan en `assets/img/originals/` por si hace falta re-encuadrar algo — no se referencian desde el HTML.

| Archivo | Foto |
|---|---|
| `assets/img/hero-fondo.jpg/.webp` | Foto de taller a pantalla completa, fondo del hero con degradado |
| `assets/img/trabajo-armario-antes/-despues.jpg/.webp` | Armario, antes/después |
| `assets/img/trabajo-cocina-antes/-despues.jpg/.webp` | Cocina, antes/después |
| `assets/img/trabajo-mesa-antes/-despues.jpg/.webp` | Mesa, antes/después |
| `assets/img/trabajo-persianas-antes/-despues.jpg/.webp` | Persianas, antes/después |
| `assets/img/trabajo-puerta-antes/-despues.jpg/.webp` | Puerta, antes/después |
| `assets/og-image.jpg` | Fachada de la vivienda, imagen para compartir en redes (1200×630) |
| `assets/favicon.svg` | Monograma "CB", sin cambios |

> **Nota:** las 10 fotos `trabajo-*` (5 parejas antes/después) tienen aspecto de imagen generada por IA/stock, no de fotografías reales de encargos del taller (mismo encuadre exacto en cada pareja, con solo el acabado cambiado). Se usan en la sección "Trabajos" por decisión explícita del cliente pese a advertirlo — revisar si en algún momento se quiere sustituir por trabajos reales fotografiados, dado que la sección los presenta como "piezas que han pasado por el taller".

Si llegan fotos nuevas, sigue el mismo patrón: recorte a la proporción del hueco (ver `aspect-ratio` en `styles.css`, sección `.gallery-item` / `.hero-media`), exporta `.jpg` (calidad ~78) y `.webp` (calidad ~74), y enlaza ambos con `<picture><source type="image/webp">...<img></picture>`. Todas las imágenes de la galería llevan `loading="lazy"` salvo la del hero.

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

## Campos legales

El NIF de Lacats Amengual C.B. (E16593071) ya está publicado en el aviso legal, junto con el correo de contacto `lacatsamengual@gmail.com` (fijado también en el pie de página y en `main.js`, `DEST_EMAIL`).

También revisa periódicamente el valor `reviewCount` del JSON-LD en `index.html` para que coincida con el número real de reseñas en Google.

## Checklist antes de publicar

- [ ] Responsive comprobado de 320 a 1920 px
- [ ] Teléfono y horario correctos en todas las páginas
- [ ] JSON-LD válido, con la dirección verificada ([validador de Google](https://search.google.com/test/rich-results))
- [ ] Enlaces legales funcionando
- [ ] Sin errores de consola ni enlaces rotos
- [x] Imágenes placeholder sustituidas por fotos reales
- [x] NIF publicado en el aviso legal
- [ ] Formulario conectado a Netlify/Formspree si no se quiere depender del fallback `mailto:`
- [ ] URLs canónicas y `sitemap.xml` actualizados con el dominio real
- [ ] Lighthouse ≥ 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO
