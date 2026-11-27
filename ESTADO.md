# English Quest — Estado del proyecto (26/11/2026)

## Qué es
PWA de inglés estilo Duolingo para una nena de 9 años. Un solo camino guiado,
voz (lee en inglés) + micrófono (escucha y corrige), cuentos ilustrados,
juegos arcade, modo baile, recompensas. Instalable como app en Android,
guarda el progreso, funciona offline.

## Live
https://nestorortegaaus-spec.github.io/english-quest/
(GitHub Pages, rama main — se actualiza solo con cada push)

## Estructura del repo (todo en la raíz)
- index.html        → la app entera (un solo archivo, 57 KB)
- manifest.json     → datos de la PWA (nombre, íconos, standalone)
- sw.js             → service worker (offline + hace que aparezca "Instalar app")
- icon.png          → ícono 512 (zorrito)
- icon-192.png      → ícono 192
- img/              → 20 imágenes (personajes, escenas de cuentos, sprites del juego de la isla)
- CLAUDE.md         → las reglas de trabajo del repo

## Arreglo del micrófono (subido el 27/11/2026)
El index.html ya incluye el ARREGLO DEL MICRÓFONO.
El arreglo: mensajes claros en pantalla cuando escucha ("Escuchando…",
"Te escucho…"), manejo de permiso de micrófono denegado, varias
alternativas de reconocimiento y comparación por similitud para que
le acepte la voz a la nena.

## Estado de features (funcionando)
- Camino con niveles, estrellas, vidas (corazones)
- Lecciones con voz + micrófono
- Cuentos ilustrados (5 escenas) con narración y traducción ES
- Juego "Word Blaster" (paleta arriba, zona libre para el dedo, power-ups) + versión difícil
- Juego "Isla" (plataformas estilo Adventure Island, el zorrito corre y salta, junta manzanas-palabras)
- Memotest (parear palabra ↔ emoji con voz)
- Escuchá y tocá: la voz dice una palabra y se toca el dibujo correcto entre 4 (botón 🐢 para oírla lento). 4 paradas en el camino
- Camino dibujado: sendero en curva, paradas 3D por color, zorrito guía
- Elegir voz (botón 🎙️ Voz en el camino): 12 personajes con voz de EE.UU. (Oso por defecto, León, Panda, Koala, Búho, Elefante, Tortuga, Zorrito, Perrito, Delfín, Gatita, Hada). Se guarda aparte del avance
- Botón Atrás de Android: vuelve al camino (y del camino al inicio), no cierra la app
- Empezar de cero: mantener apretada la portada 3 segundos (para el adulto)
- Modo baile
- Cofres / recompensas
- Instalable como app con logo, offline

## Backlog (ideas que quedaron para más adelante)
- Segundo cuento
- "Modo desafío" en el juego de la Isla (palabra en español → agarrar la manzana en inglés correcta)
- Más lecciones y contenido
- Llegar a 10 juegos

## Cómo seguir desde Claude Code + GitHub
1. git pull antes de tocar nada
2. commit + push después de cada cambio (nunca push --force)
3. Trabajar SOLO en english-quest; no tocar mox-gestion, mox-comercial, mox-stock
4. Repo público: ninguna clave/token en el código
