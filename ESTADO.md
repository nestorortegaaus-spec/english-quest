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

## Mundos (desde 27/11/2026)
- Mundo 1 · La pradera: el camino original (31 paradas, temas 0-11).
- Mundo 2 · La ciudad: Ropa, Escuela, Transporte, Lugares + frases "En la escuela" + cuento "El Perro Perdido".
- Mundo 3 · La naturaleza: Clima, Naturaleza, Zoológico, Frutas y Verduras + frases del clima + cuento "El Día de Lluvia".
- Mundo 4 · Gran aventura: Emociones, Deportes, Más Acciones, Profesiones + "Mi día" y "Más preguntas" + cuento "El Cohete a la Luna".
- Mundo 5 en adelante · Galaxias: repaso mezclando todos los temas, infinito.
- Cada mundo sube de nivel todos los juegos (nivel = número de mundo; el desafío final es un nivel más).
- Dificultad: Ladrillos (más filas, 5 columnas desde nivel 3, formas distintas, ladrillos de 2 golpes,
  pelota más rápida, bloques más cerca, paleta más chica); Memotest (6 → 8 → 10 pares, se tapan más rápido);
  Isla (más larga, más rápida, más pozos y cangrejos, cangrejos que caminan desde nivel 3);
  Escuchá (6 opciones y más rondas desde nivel 2).
- Juegos nuevos (inspirados en mecánicas de Lingokids, Duolingo ABC, Studycat, Monkey Junior y Gus on the Go):
  🔤 Deletreá (armar la palabra letra por letra), 🎈 Globos (reventar el que dice la voz antes de que se escape),
  👾 Monstruo (darle de comer lo que pide, con frases "I want a/some..."), 🗂️ Ordená (cada cosa a su caja),
  ✅ ¿Sí o no? (rápido, con rachas 🔥). Todos con niveles.
- 🚀 ¡Hablá!: decir la palabra en voz alta con el micrófono hace subir el cohete hasta la Luna
  (nivel 3+: se muestra en español y hay que decirla en inglés). Al final de cada mundo y, desde el mundo 3, en cada par de temas.
- Reconocimiento de voz más permisivo (acepta pronunciaciones aproximadas, por ejemplo "cut" por "cat"), también en las lecciones.
- 📸 Safari de fotos (juego original del estilo "tocar lo que aparece"): la voz pide "Take a picture of the parrot!" y hay que sacarle la foto al animal que vuela o se asoma de los arbustos; las fotos quedan en un rollo. Rollo limitado. Fondo opcional img/safari_bg.jpg (window.SAFARI_BG).
- 🏝️ Isla: al agarrar cada manzana la voz dice la palabra en inglés y después en castellano (sayBoth, voz es-AR);
  cartel grande arriba con dibujo + inglés + castellano; mezcla palabras del tema con muchas nuevas de otros temas.
- 🏡 Casa de Amigos (zona de descanso, botón naranja del camino): 8 amigos para adoptar con 💎 (Zorrito gratis; 150 a 1100 💎).
  Se los cuida en inglés (Comer/Jugar/Bañar/Dormir eligiendo cosas en inglés; responden con voz) y se los viste con los
  accesorios de la tienda. 4 cuidados al día a un amigo = +15 💎 (una vez por día). Arte (ChatGPT, completo): img/friend_<id>.png y img/home_bg.jpg.
- 🕹️ Sala de Juegos (botón violeta del camino): juegos de premio que se compran con 💎 (Kart Quest 400; próximos 900/1600/2500)
  y se juegan gastando 🔮 cristales. 🔮 solo se ganan estudiando: 1 cada 3 paradas + 2 al cumplir la meta del día; máx. 5
  (configurable o apagable desde el panel de padres).
- 🏎️ Kart Quest: carrera pseudo-3D de 3 vueltas contra 5 rivales, 6 pilotos, 4 pistas (Playa, Ciudad, Nieve, Galaxia;
  se desbloquean saliendo 1°-3°). Portones con palabras: la voz dice "Go through the apple!" y pasar por el correcto da turbo.
  Portones: 8 por vuelta, palabras distintas en cada vuelta, de todos los temas hasta el nivel del mundo (prioriza nuevas/difíciles).
  Choques: rebote lateral de ambos, el rival tambalea/gira y frena, sacudón de cámara, chispas y sonido de golpe.
  Arte (ChatGPT, completo): img/kart_<piloto>.png (fox, panda, koala, lion, bunny, robot; sin fondo, 360 px)
  y img/kart_bg_<pista>.jpg (beach, city, snow, space; panorama 1400 px).
- 🎨 Pintá: "Color the star yellow": elegir el color y tocar el dibujo (10 dibujos, 8 colores; nivel 3+: solo escuchando). Al final de cada mundo y alternado con ¡Hablá! desde el mundo 3.
- 👨‍👩‍👧 Panel para padres: link "Para padres" en el inicio, protegido con una multiplicación. Muestra mundo y parada, racha, % de aciertos, gráfico de 14 días, palabras que más le cuestan (con audio), palabras dominadas, meta diaria (3/5/8/10) y empezar de cero.
- 🔥 Racha diaria: meta de 5 paradas por día; al cumplirla suma un día de racha y regala 20 💎 (si saltea un día, vuelve a 0).
- 🏪 Tienda (botón 💎 del camino): accesorios para el zorrito (se ven en el camino) y 📒 álbum de 48 figuritas en sobres de 3 (25 💎), cada una con su palabra en inglés; las repetidas devuelven 5 💎.
- Se guarda qué palabras acierta y erra (S.hist) para el panel de padres.
- En los mundos 2+ los juegos rotan (9 tipos), así cada mundo tiene una mezcla distinta.
- Ideas: más cuentos con ilustraciones de ChatGPT (hoy los nuevos usan emojis).

## Estado de features (funcionando)
- Camino con niveles, estrellas, vidas (corazones)
- Lecciones con voz + micrófono
- Cuentos ilustrados (5 escenas) con narración y traducción ES
- Juego "Word Blaster" (paleta arriba, zona libre para el dedo, power-ups) + versión difícil
- Juego "Isla" (plataformas estilo Adventure Island, el zorrito corre y salta, junta manzanas-palabras)
- Memotest (parear palabra ↔ emoji con voz)
- Escuchá y tocá: la voz dice una palabra y se toca el dibujo correcto entre 4 (botón 🐢 para oírla lento). 4 paradas en el camino
- Camino dibujado: sendero en curva, paradas 3D por color, zorrito guía
- Elegir voz (botón 🎙️ Voz en el camino): voz "Original" del teléfono sin retoque (por defecto) + 12 personajes con voz de EE.UU. (Oso, León, Panda, Koala, Búho, Elefante, Tortuga, Zorrito, Perrito, Delfín, Gatita, Hada). Se guarda aparte del avance
- Botón Atrás de Android: vuelve al camino (y del camino al inicio), no cierra la app
- Empezar de cero: mantener apretada la portada 3 segundos (para el adulto)
- Modo baile
- Cofres / recompensas
- Instalable como app con logo, offline

## Backlog (ideas que quedaron para más adelante)
- ⏭️ PENDIENTE (pedido 27/11): cada nivel/mundo con una TEMÁTICA nueva y mejores gráficos: ambientaciones hechas con
  ChatGPT (fondo del camino, decoración y colores propios por mundo/galaxia, en el estilo 3D de Kart Quest/Casa de Amigos).
- ⏭️ PENDIENTE (pedido 27/11): las ⭐ estrellas se acumulan pero no sirven para nada (solo suben el nivel 🌱).
  Darles uso: por ejemplo canjear estrellas por premios especiales, desbloquear cosas que no se compran con gemas,
  o convertir estrellas en gemas/cristales.
- 🔄 EN CURSO: MUCHO más vocabulario (meta: miles). Hoy 933 palabras (232 base + vocab.js con 76 temas, lv 1-5,
  números generados 11-20 → decenas → 21-99 → cientos → miles/millón, ordinales, hora, países, pasado...).
  Mundos 2-4 traen al final 2 temas nuevos cada uno (NEWU[0..5]) + parada 🔁 Repaso del mundo anterior.
  Galaxias (mundo 5+) usan NEWU desde el 7º, 6 temas por galaxia en orden de dificultad (~10 galaxias de contenido nuevo).
  prioW() prioriza palabras no vistas o difíciles (S.hist). Para sumar: agregar temas en vocab.js y subir ?v= en index.html.
- 🔄 EN CURSO: FRASES estilo Kumon. Hecho 27/11: juego 🧩 Frases (PHR: 16 patrones lv1-5). Cada partida toma un patrón
  y lo trabaja cambiando una palabra: mirar/escuchar → completar → ordenar fichas → cambiar una palabra → escuchar y
  elegir dibujo → decirla con micrófono (nivel 2+). Aparece en cada par de temas desde el mundo 3 y al final de cada mundo.
  Falta: más patrones y frases más largas.
- ⏭️ PENDIENTE (pedido 27/11): más juegos nuevos para aprender inglés, inspirados en mecánicas de otras apps
  (Lingokids, Duolingo, Studycat, Monkey Junior, etc.), originales, con niveles y rotando en el camino.
  Ideas posibles: sopa de letras, completar la frase, armar oraciones con fichas, crucigrama con dibujos,
  "Simon dice" (seguir órdenes en inglés), adivinanzas con pistas, karaoke de canciones cortas, contar objetos (numbers).
- ⏭️ PENDIENTE (pedido 27/11): Tienda/Vestir — hay muy pocos accesorios (10 en ACC, uno solo puesto a la vez).
  Agregar mucha más variedad de ropa y accesorios (sombreros, anteojos, collares, remeras/buzos, capas, mochilas,
  disfraces…) y poder combinar varios a la vez (uno por lugar: cabeza, cara, cuello, cuerpo). Ideal con arte de ChatGPT
  para que combine con los amigos 3D de la Casa de Amigos.
- ⏭️ PENDIENTE (pedido 27/11): Pintá — siempre salen los mismos objetos y colores (hoy 10 dibujos en PAINT_OBJ y
  8 colores en PAINT_COL; el nivel 1 usa solo los 4 primeros colores). Agregar muchos más dibujos y colores
  (white, black, gray, light blue…) y que roten entre partidas, priorizando los que menos vio.
- ⏭️ PENDIENTE (pedido 27/11): Safari de fotos — los animales se repiten siempre (hoy hay 16 en la lista SAFARI y
  cada partida usa 6-9). Agregar muchos más animales (voladores y de tierra) y que roten entre partidas/niveles
  para que aprenda animales nuevos (por ejemplo, priorizar los que todavía no fotografió).
- Segundo cuento
- "Modo desafío" en el juego de la Isla (palabra en español → agarrar la manzana en inglés correcta)
- Más lecciones y contenido
- Llegar a 10 juegos

## Cómo seguir desde Claude Code + GitHub
1. git pull antes de tocar nada
2. commit + push después de cada cambio (nunca push --force)
3. Trabajar SOLO en english-quest; no tocar mox-gestion, mox-comercial, mox-stock
4. Repo público: ninguna clave/token en el código
