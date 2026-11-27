# English Quest — reglas del repositorio

App de inglés estilo Duolingo para una niña de 9 años. Hecha por Nestor con Claude.
Es una app **estática** (PWA: `index.html` + `img/` + `sw.js`), publicada con **GitHub Pages**.

## Reglas para cualquier Claude que trabaje acá

1. **Solo este repo.** Trabajar únicamente en `nestorortegaaus-spec/english-quest`.
   **Nunca** tocar, clonar ni modificar los repos privados de trabajo del dueño
   (`mox-gestion`, `mox-comercial`, `mox-stock`).

2. **Repo público = sin secretos ni datos personales.**
   - Nunca poner claves, contraseñas ni tokens en el código.
   - Ningún dato personal de la niña: ni nombre real, ni fotos de ella, ni escuela.

3. **Servicios externos:**
   - Si la app necesita base de datos o login: usar un proyecto de **Firebase propio de esta app**
     (jamás uno de MOX, por ejemplo `stock-mox`).
   - Si la app usa IA: **no** usar la cuenta de la API de Claude de MOX.

4. **Flujo de trabajo (automático, el dueño solo habla con Claude):**
   - Antes de cambiar algo: `git pull`.
   - Después de cada cambio: `commit` + `push` a `main` **sin pedir permiso**, e informar al dueño
     qué se subió (archivos, qué cambia, hash del commit) y el link para probarlo.
   - Si algo sale mal: `git revert` + push. **Nunca `git push --force`.**

5. **Archivos que el dueño adjunte en el chat** (imágenes, audios, etc.): guardarlos en el repo
   (`img/`, `audio/`…) con nombres claros, en minúscula y sin espacios; referenciarlos en la app y subirlos.
   Optimizar imágenes pesadas (por ejemplo a `.webp` o `.jpg` de menos de 300 KB).

6. **Publicación:** GitHub Pages sirve la rama `main`. Cada push a `main` actualiza la app sola.
   URL: https://nestorortegaaus-spec.github.io/english-quest/

## Estructura

- `index.html` — la app completa (HTML + CSS + JS en un archivo).
- `img/` — imágenes: personajes, escenas de cuentos y sprites del juego de plataforma.
- `manifest.json` + `icon.png` + `icon-192.png` — para instalarla como app (PWA).
- `sw.js` — service worker (offline; HTML/JSON van network-first, el resto cache-first).
  Si se cambia una imagen existente sin cambiarle el nombre, subir la versión de `CACHE` en `sw.js`.
- `ESTADO.md` — resumen del estado del proyecto y backlog.
