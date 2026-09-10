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
│   ├── favicon.ico
│   ├── og-image.jpg
│   └── /img                   fotos del sitio, ver más abajo
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
| `assets/img/hero-fondo.jpg/.webp` | Foto de taller a pantalla completa, fondo del hero con degradado (escritorio/tablet) |
| `assets/img/hero-fondo-movil.jpg/.webp` | Misma idea, encuadre vertical dedicado para <=639px (ver `<picture><source media>` en el hero) |
| `assets/img/trabajo-armario-antes/-despues.jpg/.webp` | Armario, antes/después |
| `assets/img/trabajo-cocina-antes/-despues.jpg/.webp` | Cocina, antes/después |
| `assets/img/trabajo-mesa-antes/-despues.jpg/.webp` | Mesa, antes/después |
| `assets/img/trabajo-persianas-antes/-despues.jpg/.webp` | Persianas, antes/después |
| `assets/img/trabajo-puerta-antes/-despues.jpg/.webp` | Puerta, antes/después |
| `assets/og-image.jpg` | Fachada de la vivienda, imagen para compartir en redes (1200×630) |
| `assets/favicon.svg` / `favicon.ico` | Monograma "CB" |

> **Nota:** las 10 fotos `trabajo-*` (5 parejas antes/después) tienen aspecto de imagen generada por IA/stock, no de fotografías reales de encargos del taller (mismo encuadre exacto en cada pareja, con solo el acabado cambiado). Se usan en la sección "Trabajos" por decisión explícita del cliente pese a advertirlo — revisar si en algún momento se quiere sustituir por trabajos reales fotografiados, dado que la sección los presenta como "piezas que han pasado por el taller".

Si llegan fotos nuevas, sigue el mismo patrón: recorte a la proporción del hueco (ver `aspect-ratio` en `styles.css`, sección `.gallery-item` / `.hero-media`), exporta `.jpg` (calidad ~78) y `.webp` (calidad ~74), y enlaza ambos con `<picture><source type="image/webp">...<img></picture>`. Todas las imágenes de la galería llevan `loading="lazy"` salvo la del hero.

**Favicon `.ico`:** además de `favicon.svg` (navegadores modernos), el sitio incluye `assets/favicon.ico` (16/32/48 px, mismo monograma "CB") enlazado con `<link rel="icon" href="/assets/favicon.ico" sizes="any">` en el `<head>` de cada página, para compatibilidad con navegadores y dispositivos que no soportan favicon SVG.

## Formulario de contacto

El formulario está conectado a **Netlify Forms**: `<form>` lleva `name="contacto"`, `data-netlify="true"`, `data-netlify-honeypot="empresa-web"` y `data-backend="connected"`, con el `<input type="hidden" name="form-name" value="contacto">` requerido por Netlify. Netlify detecta el formulario automáticamente al desplegar (rastrea el HTML estático) y las respuestas llegan al panel del sitio, pestaña **Forms**.

El envío se hace por AJAX (`fetch` en `main.js`) para mostrar el mensaje de confirmación sin salir de la página, en vez de dejar que el navegador navegue a una página en blanco. Si Netlify Forms fallara alguna vez, el `catch` avisa al usuario con el teléfono y el correo.

Si en algún momento se quisiera cambiar a otro proveedor (p. ej. [Formspree](https://formspree.io)): cambia el `<form>` a `action="https://formspree.io/f/TU_ID"` y quita los atributos `data-netlify*`; con `data-backend="connected"` puesto, `main.js` no usa el fallback `mailto:`.

Quitar `data-backend="connected"` (o ponerlo a cualquier otro valor) hace que el formulario vuelva al modo `mailto:` sin backend, útil para probar en local sin depender de Netlify.

El campo oculto `empresa-web` es un honeypot anti-spam: debe permanecer vacío y oculto (ya está resuelto en el CSS con `.form-honeypot`, y Netlify lo usa también en el servidor vía `data-netlify-honeypot`).

## Mapa y cookies

El `<iframe>` de Google Maps en la sección de contacto **no se carga por defecto**: solo se activa si el visitante acepta el banner de cookies o pulsa "Cargar mapa". Esto evita cargar cookies de terceros sin consentimiento. Si en algún momento se elimina el mapa incrustado (por ejemplo, sustituyéndolo por una imagen estática con enlace a Google Maps), el banner de cookies y el bloque `.map-consent` de `main.js` pueden eliminarse por completo, ya que el sitio no cargaría ninguna cookie.

## Campos legales

El NIF de Lacats Amengual C.B. (E16593071) ya está publicado en el aviso legal, junto con el correo de contacto `lacatsamengual@gmail.com` (fijado también en el pie de página y en `main.js`, `DEST_EMAIL`).

También revisa periódicamente el valor `reviewCount` del JSON-LD en `index.html` para que coincida con el número real de reseñas en Google.

## Checklist antes de publicar

- [ ] Responsive comprobado de 320 a 1920 px
- [x] Teléfono y horario correctos en todas las páginas
- [ ] JSON-LD válido, con la dirección verificada ([validador de Google](https://search.google.com/test/rich-results))
- [ ] Enlaces legales funcionando
- [ ] Sin errores de consola ni enlaces rotos
- [x] Imágenes placeholder sustituidas por fotos reales
- [x] NIF publicado en el aviso legal
- [x] Formulario conectado a Netlify Forms
- [x] URLs canónicas y `sitemap.xml` apuntan al dominio real (`lacatsamengual.es`, conectado en Netlify — pendiente de que termine de propagar el DNS)
- [ ] Lighthouse ≥ 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO
- [x] Favicon `.ico` generado
