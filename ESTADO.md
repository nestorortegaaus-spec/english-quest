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
- 📸 Safari: 5 paisajes que rotan (SAFARI_SCENES: Bosque, Granja, Selva, Sabana, Nieve; arte ChatGPT img/safari_*.jpg, con posición de arbustos), cada uno prioriza ~65% sus animales (SAFARI_TAGS). 76 animales (SAFARI con f vuela/tierra y d dificultad 1-3); safariPool elige ~70% que nunca fotografió o le cuestan + ~30% conocidos, con voladores y de tierra.
- 📸 Safari de fotos (juego original del estilo "tocar lo que aparece"): la voz pide "Take a picture of the parrot!" y hay que sacarle la foto al animal que vuela o se asoma de los arbustos; las fotos quedan en un rollo. Rollo limitado. Fondo opcional img/safari_bg.jpg (window.SAFARI_BG).
- 🆕 Juegos 27/11: 🔠 Sopa de letras (grilla 6→8, 4-6 palabras, diagonales nivel 3+, al revés nivel 4+, palabras ocultas
  nivel 3+; al encontrar dice inglés+castellano), ❓ Adivinanzas (RIDDLES: 30 con 3 pistas en inglés; menos pistas = más
  puntos), 🔢 ¿Cuántos hay? ("How many apples?" → "There are seven apples!", números hasta 20, sin incontables).
  Rotan en GROT (12 tipos).
- ⏱️ Equilibrio (psicología del aprendizaje): cuenta minutos activos del día (S.play). Cada 20 min (configurable
  15/20/30) → descanso activo de 5 min al volver al camino/casa/sala (nunca corta una actividad): "Simon says" en
  inglés con voz (moverse, mirar lejos, tomar agua) y +5💎 al completarlo. Si nota cansancio (≥8 min y <45% de
  aciertos en las últimas 10) propone el descanso antes. Límite diario (default 60 min; 30/45/60/90/sin límite en panel
  de padres): aviso 5 min antes y pantalla "¡Muy bien por hoy! See you tomorrow!" con resumen; padres pueden dar +30
  min con la multiplicación. La Sala de Juegos se abre tras 2 paradas del día (primero aprender, después jugar).
- 🎓 Graduación (ciclo de vida sin muerte): a los 7 días de ser Grande (p.bigAt) la mascota avisa que está lista;
  la niña decide con "Despedir a…". Escena con mochila y frases, premio (🏅 S.medals + 60💎), queda en el muro
  "Amigos que crecieron" (S.home.grads) y llega un bebé nuevo de otra especie gratis. Postales en inglés de las graduadas
  (POSTCARDS, ~1 por día al abrir la Casa) con traducción y voz.
- 🤒 Enfermedad y costos (Casa de Amigos): se enferma sobre todo si se la descuida (hambre/suciedad <20 o 3 cacas:
  ~90% en 20 h; bien cuidada ~1% en 8 h). Enferma: pálida, termómetro, frases "I feel sick…", barras bajan x1.5, no juega.
  Botón 💊 Remedio: jarabe 8⭐, pastilla 12⭐, veterinario 25💎, con escenas. Nunca se muere.
  Comida: manzana, banana, zanahoria y leche GRATIS; frutilla 1⭐, queso 2⭐, galletita 2⭐, pizza 3⭐.
  Gastar ⭐ no baja el nivel 🌱 (lvl usa S.stars + S.spent).
- 🎒 Compañero de aventura: en la Casa de Amigos, botón "Llevar de aventura" (S.home.buddy). El elegido reemplaza al zorrito
  en el camino (con su etapa y accesorio), aparece con su carita en el cartel del relator y festeja en la pantalla de premio.
- 🎙️ Relator en todos los juegos (narr(), NARR): frases cortas en inglés + castellano hablado y cartelito, ligadas a lo
  que pasa (start, good, streak, close, miss, last, win, lose, pass, crash), espaciadas (≥9 s las comunes, ≥3 s las
  importantes), nunca encima de otra voz, rotando como mazo. Se dispara desde sGood/sBad y hooks en Ladrillos, Isla y Kart.
  Ladrillos ya no dice la palabra por bloque (la muestra escrita).
- 🏝️ Isla: al agarrar cada manzana la voz dice la palabra en inglés y después en castellano (sayBoth, voz es-AR);
  cartel grande arriba con dibujo + inglés + castellano; mezcla palabras del tema con muchas nuevas de otros temas.
- 🏡 Casa de Amigos = mascota virtual (inspirada en el diseño de Tamagotchi, propia y sin muerte):
  8 amigos para adoptar con 💎 (Zorrito gratis; 150-1100 💎). Los nuevos llegan como bebés; solo el Pingüino y el Dragoncito nacen de un 🥚 (4 toques).
  Crecen de a poco con cada cuidado (tamaño 55% → 100% a los 70 cuidados): Bebé (🍼) → Chiquito (25) → Grande (70). 5 necesidades que bajan con el tiempo real
  (hambre, diversión, limpieza, energía, cariño; S.home.pets[id].nd) y caca 💩 cada 4 h para limpiar. Pide atención con voz
  y "!" en el botón del camino. Acciones animadas: comer (la comida vuela a la boca, mastica, migas), jugar (juguete
  rebota y salta), baño (burbujas), dormir (luz baja, Zzz), mimos al tocarla (corazones; cuentan para crecer 3 por día).
  4 acciones al día = +15 💎. Se viste combinando accesorios de la tienda: uno por lugar (cabeza, cara, cuello, en la mano). Las posiciones están medidas para cada amigo y etapa (ACC_AN).
  POSES (arte nuevo por etapa): img/pet/<id>_<etapa>_<idle|closed|open|happy>.webp, cortadas de una hoja 2x2 de ChatGPT
  con scratchpad sheet.py (alineadas por los pies). Activar en POSE_SETS. Hecho: los 8 amigos completos (1-2-3). Parpadea, mueve la boca
  al hablar, boca abierta al morder, ojos cerrados al dormir, pose feliz en mimos/juego. Arte ChatGPT: img/friend_<id>.png y img/home_bg.jpg.
- 🕹️ Sala de Juegos (botón violeta del camino): juegos de premio que se compran con 💎 (Kart Quest 400; próximos 900/1600/2500)
  y se juegan gastando 🔮 cristales. 🔮 solo se ganan estudiando: 1 cada 3 paradas + 2 al cumplir la meta del día; máx. 5
  (configurable o apagable desde el panel de padres).
- 🏎️ Kart Quest: carrera pseudo-3D de 3 vueltas contra 5 rivales, 6 pilotos, 4 pistas (Playa, Ciudad, Nieve, Galaxia;
  se desbloquean saliendo 1°-3°). Portones con palabras: la voz dice "Go through the apple!" y pasar por el correcto da turbo.
  Al pasar un portón la voz dice la palabra en inglés y en castellano (sayBoth).
  Portones: 8 por vuelta, palabras distintas en cada vuelta, de todos los temas hasta el nivel del mundo (prioriza nuevas/difíciles).
  Choques: rebote lateral de ambos, el rival tambalea/gira y frena, sacudón de cámara, chispas y sonido de golpe.
  Arte (ChatGPT, completo): img/kart_<piloto>.png (fox, panda, koala, lion, bunny, robot; sin fondo, 360 px)
  y img/kart_bg_<pista>.jpg (beach, city, snow, space; panorama 1400 px).
- 🎨 Pintá: "Color the star yellow": elegir el color y tocar el dibujo (32 dibujos, 12 colores que rotan: salen primero los que menos vio, guardado en S.pnt; nivel 3+: solo escuchando). Al final de cada mundo y alternado con ¡Hablá! desde el mundo 3.
- 👨‍👩‍👧 Panel para padres: link "Para padres" en el inicio, protegido con una multiplicación. Muestra mundo y parada, racha, % de aciertos, gráfico de 14 días, palabras que más le cuestan (con audio), palabras dominadas, meta diaria (3/5/8/10) y empezar de cero.
- 🔥 Racha diaria: meta de 5 paradas por día; al cumplirla suma un día de racha y regala 20 💎 (si saltea un día, vuelve a 0).
- 🏪 Tienda (botón 💎 del camino): pestaña 👒 Ropa con 34 accesorios en 4 lugares, que se prueban y se ponen al compañero (se ven en el camino y en la casa) y 📒 álbum de 48 figuritas en sobres de 3 (25 💎), cada una con su palabra en inglés; las repetidas devuelven 5 💎.
- Se guarda qué palabras acierta y erra (S.hist) para el panel de padres.
- En los mundos 2+ los juegos rotan (9 tipos), así cada mundo tiene una mezcla distinta.
- 📖 Cuentos: 8. Los 4 nuevos (27/11: La Fiesta en la Playa, El Pingüino y la Nieve, El Dragón y las Estrellas, El Picnic en el Bosque) tienen
  escenas ARMADAS por código (sc en cada página: fondo img/world_<id>.jpg + amigos con poses/ropa + objetos animados; storyScene()), sin ChatGPT.
  Se leen en las Galaxias (mundo 5+). Para sumar más: agregar cuentos con sc a STORIES.

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
- ✅ HECHO (27/11): tema propio por mundo. Mundos 1-4 (pradera, ciudad, naturaleza, aventura) y del 5 en adelante 12 temas
  que rotan (WTHEMES: playa, polo, espacio, bajo el mar, selva, golosinas, desierto, dinosaurios, hadas, nubes, música, granja; al
  terminar la vuelta se repiten con "II"). Cada uno con colores, camino, decoración y un efecto que flota (pétalos, nieve, burbujas,
  estrellas, notas, nubes; WFX). Fondos de ChatGPT: los 16 hechos (img/world_<id>.jpg, 720 px de ancho, en WIMG; un valor <1 pone un velo blanco más fuerte, ej. music:.3). Los caminos de playa, mar, desierto, polo, nubes y espacio tienen colores con más contraste para que se vean sobre el fondo.
- ✅ HECHO (27/11): uso para las ⭐. Pestaña ⭐ Estrellas en la tienda (también al tocar ⭐ arriba): 10 trofeos por estrellas
  juntadas en total (STAR_GOALS, de 25 a 2000, cada uno regala 💎 al abrirlo; S.sgot), cambio de 20 ⭐ por 1 🔮 una vez por día
  (S.scrys) y 8 accesorios de ropa mágica que solo se compran con estrellas (ACC con st). Gastar estrellas no baja el nivel (S.spent).
- 🔄 EN CURSO: MUCHO más vocabulario (meta: miles). Hoy ~1115 palabras y frases (base + vocab.js con 100 temas, lv 1-5,
  números generados 11-20 → decenas → 21-99 → cientos → miles/millón, ordinales, hora, países, pasado...).
  Mundos 2-4 traen al final 2 temas nuevos cada uno (NEWU[0..5]) + parada 🔁 Repaso del mundo anterior.
  Galaxias (mundo 5+) usan NEWU desde el 7º, 6 temas por galaxia en orden de dificultad (~10 galaxias de contenido nuevo).
  prioW() prioriza palabras no vistas o difíciles (S.hist). Para sumar: agregar temas en vocab.js con b:3 (tanda nueva) y subir ?v=
  en index.html. Las tandas nuevas (b:2+) NO cambian los mundos 2-4 (NEWU[0..5] queda fijo): se mezclan por dificultad desde las
  Galaxias. Tanda 2 (27/11): 24 temas, 222 palabras/frases (playa, bebés animales, formas, casa, estaciones, cuerpo, plaza, bebidas,
  cocinar, arte, moverse, cómo es, tecnología, trabajos, viajes, sentimientos, opuestos, dónde, cuándo, pedir, pasado, planeta, futuro, comparar).
- 🔄 EN CURSO: FRASES estilo Kumon. Juego 🧩 Frases con 36 patrones (PHR, lv1-5, desde "I like…" hasta "If it rains,
  I will…", "When I grow up I want to be a…", y uno de dos huecos "My best friend likes…, but I like…").
  Pasos: mirar/escuchar → completar → ordenar → cambiar una palabra → escuchar y elegir → frase larga (une dos frases
  con "and", nivel 3+, solo patrones cortos) → decirla con micrófono. Tanda 2 (27/11): +24 patrones (60 en total),
  p. ej. "I have a…", "Where is my…?", "It is time to…", "Let's … together!", "I have never seen a…", "I am happy because…",
  "If I had a…, I would…".
- ⏭️ PENDIENTE (pedido 27/11, ya hechos: sopa, adivinanzas, contar, frases, crucigrama, karaoke): más juegos nuevos para aprender inglés, inspirados en mecánicas de otras apps
  (Lingokids, Duolingo, Studycat, Monkey Junior, etc.), originales, con niveles y rotando en el camino.
  Ideas posibles: sopa de letras, completar la frase, armar oraciones con fichas, crucigrama con dibujos,
  "Simon dice" (seguir órdenes en inglés), adivinanzas con pistas, karaoke de canciones cortas, contar objetos (numbers).
- ✅ HECHO (27/11): Vestir combinable con 34 accesorios (cabeza, cara, cuello y mano), posicionados por amigo y etapa. Queda como idea: arte de ChatGPT (remeras, capas, mochilas) en vez de emojis.
- ✅ HECHO (27/11): Pintá ahora tiene 32 dibujos y 12 colores (suma negro, blanco, gris y celeste). Rotan priorizando los menos vistos.
- ✅ HECHO (27/11): 🎯 Modo desafío de la Isla (nivel 3+): arriba dice una palabra en castellano (con dibujo hasta nivel 4, sin dibujo en
  nivel 5) y la voz la dice en castellano; vienen pares de manzanas (una abajo, otra arriba para saltar) y hay que agarrar la de esa palabra
  en inglés. Acertar suma y dice inglés + castellano; equivocarse no saca vida, muestra cuál era y la marca para repasar.
- Más lecciones y contenido

## Cómo seguir desde Claude Code + GitHub
1. git pull antes de tocar nada
2. commit + push después de cada cambio (nunca push --force)
3. Trabajar SOLO en english-quest; no tocar mox-gestion, mox-comercial, mox-stock
4. Repo público: ninguna clave/token en el código
- ✅ HECHO (27/11): en ¡Hablá! no aparece el narrador (GAME.quiet), porque se mezclaba con el micrófono. Voz: say() espera 150 ms después de cortar
  otra frase (en Android hablar justo después de cancel se perdía) y sayBoth dice el castellano después del inglés. Kart: la consigna dice solo
  la palabra y espera a que termine la palabra anterior en inglés + castellano.
- ✅ HECHO (27/11, idea tipo Buddy.ai): descanso guiado (openBreak). El amigo compañero aparece grande, con su ropa, mueve la boca al hablar,
  parpadea y festeja. Le habla por su nombre en inglés y castellano y va rotando actividades (PLAN): Simon says (botón ¡Listo!), respirar con un círculo,
  cerrar los ojos y contar hasta 5, repetir palabras que ya vio con el micrófono, y datos curiosos (BR_FACTS). Al terminar los 5 minutos: 💎 +5.
- ✅ HECHO (27/11): Sopa de letras más fácil (diagonal desde nivel 4, al revés desde nivel 5, menos palabras) y la lista muestra ícono + inglés +
  castellano; tocar una palabra la dice en inglés y castellano y hace titilar su primera letra como pista. Frases: la frase en castellano a armar va
  grande en un recuadro (ph-goal).
- ✅ HECHO (27/11): ropa bien ubicada en todas las poses: la pose feliz tiene anclas propias (ACC_ANH) y ojos cerrados / boca abierta se
  corrigen con ACC_PF; accPose() reacomoda la ropa cada vez que cambia la imagen. Casa: la comida, esponja, juguete… se ARRASTRAN hasta la
  mascota (tocar solo muestra una pista); la habitación con el globito queda fija arriba al bajar. Palabras en inglés más grandes en
  Ladrillos, Adivinanzas, Ordená, Memotest, Deletreá, ¿Cuántos hay?, lecciones, Globos, Isla y Kart.
- ✅ ARREGLADO (27/11): el descanso se trababa en "Try again": al cortar el micrófono (Ya lo dije ✓), Chrome avisaba tarde "no te escuché" y esa
  frase pisaba la que hacía avanzar. micListen ignora el aviso después de un corte, cada actividad del descanso tiene su turno (actTok) y hay un
  seguro: si nada avanza en 45 s pasa a la siguiente actividad.
- ✅ HECHO (27/11): cuentos sin botón ES: la traducción en castellano se ve siempre debajo del inglés.
- ✅ HECHO (27/11): Kart con 14 pistas: 10 nuevas bloqueadas (Pradera Florida, Bosque de Ardillas, Castillo Aventura, Selva Loca, Carrera Dulce,
  Dunas Doradas, Valle Dino, Bosque de Hadas, Islas del Cielo, Ciudad Musical). Se abren de a una saliendo en el podio en la anterior; los rivales
  van un poquito más rápido en cada una. Fondos img/kart_bg_<id>.jpg recortados del arte de los mundos (parte de arriba, en espejo para repetir).
- ✅ HECHO (27/11): Isla: se puede pisar al cangrejo (cae desde arriba → lo aplasta, rebota, +1 y dice crab / cangrejo); chocarlo de costado sigue
  sacando vida. Corre el amigo que la acompaña en la aventura (sus poses y su ropa); si no tiene dibujo, el zorrito de siempre.
- ✅ HECHO (27/11): ✏️ Crucigrama con dibujos (startCross, en la rotación GROT): grilla armada sola con 4-6 palabras que se cruzan; se toca
  un dibujo y se arma la palabra en inglés con letras (nivel 1-2 muestra la palabra en castellano; desde nivel 3 solo el dibujo y la voz en inglés;
  desde nivel 2 hay 2 letras de más). Botón 💡 pone la letra siguiente. Al completar cada palabra la dice en inglés y castellano.
- ✅ HECHO (27/11): 🎤 Karaoke (startSing, en GROT): 6 canciones tradicionales de dominio público (Twinkle Twinkle, Row Row Row Your Boat,
  Mary Had a Little Lamb, Old MacDonald, The Wheels on the Bus, Happy Birthday). Por cada frase: la voz la dice (escuchá) y después suena la
  melodía con la letra que se ilumina sílaba por sílaba (cantá), con traducción y dibujo; al final se canta la canción entera. Melodías en
  SONGS (nota:tiempos por sílaba), sintetizadas con tone(); sin narrador encima.
- ✅ HECHO (27/11): Panel para padres rediseñado (colores calmos salvia/azul, letra 15-30 px, tarjetas): entrada con teclado propio (sin prompt),
  anillo de avance del mundo, 4 indicadores, "Hoy" (anillo de meta + tiempo vs límite), barras de 14 días con línea de meta, minutos y aciertos
  por día (S.dlog, se guarda desde el 27/11, 60 días), aciertos totales + temas más practicados, palabras para practicar con barra, ajustes en
  botones segmentados.
- ✅ HECHO (27/11): acceso de padres con CLAVE de 4 números (teclado con puntitos), también para "dar más tiempo". En el código solo está la huella
  SHA-256 (PIN_H0), nunca la clave. Se puede cambiar desde el panel (S.pinH, solo en ese teléfono; "Empezar de cero" vuelve a la clave original).
