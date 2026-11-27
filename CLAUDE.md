# English Quest — reglas del repositorio

App de inglés estilo Duolingo para una niña de 9 años. Hecha por Nestor con Claude.
Es una app **estática** (un `index.html` + carpeta `img/`), publicada con **GitHub Pages**.

## Reglas para cualquier Claude que trabaje acá

1. **Solo este repo.** Trabajar únicamente en `nestorortegaaus-spec/english-quest`.
   **Nunca** tocar, clonar ni modificar los repos privados de trabajo del dueño
   (`mox-gestion`, `mox-comercial`, `mox-stock`).

2. **Repo público = sin secretos.** Nunca poner claves, contraseñas ni tokens en el código.
   Si algún día la app necesita login/datos, usar un proyecto de **Firebase propio de esta app**
   (jamás uno de MOX, por ejemplo `stock-mox`).

3. **Flujo de trabajo:**
   - Antes de cambiar algo: `git pull`.
   - Después de cada cambio: `commit` + `push`, e informar al dueño qué se subió
     (archivos, qué cambia y el hash del commit).
   - Si algo sale mal: volver atrás con `git revert`. **Nunca `git push --force`.**

4. **Publicación:** GitHub Pages sirve la rama `main`. Cada push a `main` actualiza la app sola.
   URL: https://nestorortegaaus-spec.github.io/english-quest/

## Estructura

- `index.html` — la app completa (HTML + CSS + JS en un archivo).
- `img/` — imágenes: personajes, escenas de cuentos y sprites del juego de plataforma.
- `manifest.json` + `icon.png` — para instalarla como app (PWA / "Agregar a pantalla de inicio").
