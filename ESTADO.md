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
- 📖 Cuentos: 12 (+27/11: Un Día en la Granja, El Tesoro del Mar, El Cumpleaños de Unicornio, El Gran Concierto, también armados).
  Antes 8. Los 4 nuevos (27/11: La Fiesta en la Playa, El Pingüino y la Nieve, El Dragón y las Estrellas, El Picnic en el Bosque) tienen
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
- 🔄 EN CURSO: MUCHO más vocabulario (meta: miles). Hoy ~1890 palabras y frases (base + vocab.js con 144 temas, lv 1-5,
  números generados 11-20 → decenas → 21-99 → cientos → miles/millón, ordinales, hora, países, pasado...).
  Mundos 2-4 traen al final 2 temas nuevos cada uno (NEWU[0..5]) + parada 🔁 Repaso del mundo anterior.
  Galaxias (mundo 5+) usan NEWU desde el 7º, 6 temas por galaxia en orden de dificultad (~10 galaxias de contenido nuevo).
  prioW() prioriza palabras no vistas o difíciles (S.hist). Para sumar: agregar temas en vocab.js con b:3 (tanda nueva) y subir ?v=
  en index.html. Las tandas nuevas (b:2+) NO cambian los mundos 2-4 (NEWU[0..5] queda fijo): se mezclan por dificultad desde las
  Galaxias. Tanda 2 (27/11): 24 temas, 222 palabras/frases (playa, bebés animales, formas, casa, estaciones, cuerpo, plaza, bebidas,
  cocinar, arte, moverse, cómo es, tecnología, trabajos, viajes, sentimientos, opuestos, dónde, cuándo, pedir, pasado, planeta, futuro, comparar).
  Tanda 3 (27/11): 24 temas, 206 palabras/frases (mar, insectos, juegos de plaza, mi cuarto, colores, granja, frutas, comidas argentinas,
  baño, instrumentos, emociones, acciones, naturaleza, animales salvajes, deportes, auto, hospital, cielo, verbos útiles, me presento,
  tiempo libre, palabras largas, pasado, contar una historia).
  Tanda 4 (27/11, b:4): 20 temas, 160 palabras/frases (selva argentina, juguetes, jardín, desayuno, disfraces, clima, escuela, mascotas,
  verbos del día, cuentos de hadas, espacio, cosas de la casa, comparar, profesiones, cine, preguntas, palabras de tiempo, pasado, valores, conversación).
  Tanda 5 (28/11, b:5): 23 temas, 243 palabras/frases sin repetir (animales raros, comida rica, parque de diversiones, costura y taller,
  frases del día a día, lugares de la ciudad, negocios del barrio, salud, texturas y sabores, acciones, frases para jugar, cosas que hace
  el cuerpo, más adjetivos, planeta, puntos cardinales, aeropuerto, de viaje, ciencia, sentimientos, pasado 5 y 6, palabras para unir, palabritas útiles).
- 🔄 EN CURSO: FRASES estilo Kumon. Juego 🧩 Frases con 36 patrones (PHR, lv1-5, desde "I like…" hasta "If it rains,
  I will…", "When I grow up I want to be a…", y uno de dos huecos "My best friend likes…, but I like…").
  Pasos: mirar/escuchar → completar → ordenar → cambiar una palabra → escuchar y elegir → frase larga (une dos frases
  con "and", nivel 3+, solo patrones cortos) → decirla con micrófono. Tanda 2 (27/11): +24 patrones (60 en total),
  p. ej. "I have a…", "Where is my…?", "It is time to…", "Let's … together!", "I have never seen a…", "I am happy because…",
  "If I had a…, I would…". Tanda 3: +20 patrones (80 en total): "I want to…", "Please, …", "We are…", "What time is…?",
  "I always … before bed", "Can you help me…?", "When I was little, I…", "My dream is to…", "Yesterday it was…, but today it is…".
  Tanda 4 (28/11): +20 patrones (100 en total): "I hear a…", "Give me the…, please", "I am … now", "Is it a…?", "Don't…!", "Who wants…?",
  "I have to … today", "Have you ever seen a…?", "It smells like…", "I have been … for an hour", "I like … more than …", "You should…",
  "While I was…, it started to rain", "I can't wait to…!".
- ⏭️ PENDIENTE (pedido 27/11, ya hechos: sopa, adivinanzas, contar, frases, crucigrama, karaoke, tienda, charla, Simón dice): más juegos nuevos para aprender inglés, inspirados en mecánicas de otras apps
  (Lingokids, Duolingo, Studycat, Monkey Junior, etc.), originales, con niveles y rotando en el camino.
  Ideas posibles: sopa de letras, completar la frase, armar oraciones con fichas, crucigrama con dibujos,
  "Simon dice" (seguir órdenes en inglés), adivinanzas con pistas, karaoke de canciones cortas, contar objetos (numbers).
- ✅ HECHO (27/11): Vestir combinable con 34 accesorios (cabeza, cara, cuello y mano), posicionados por amigo y etapa. 27/11: +12 prendas DIBUJADAS en código (SVG en ACC_SVG, svg:1): gorrito de fiesta, tiara, corona de flores, sombrero
  de bruja, gorro de chef, moñito, corbata, pañuelo y el lugar nuevo "Espalda" (capa, alas de hada, de mariposa y de ángel, van detrás del cuerpo).
  Se ven en la casa, el camino, la tienda, el descanso, los cuentos y la Isla (canvas: accImg). Tanda 2 (27/11): mochilas (escuela, estrella, osito, cohete), púas de dino, escudo,
  sombreros pirata/vaquera/vikingo, orejitas de gato y conejo, vincha ninja, parche, antifaz, escoba y espada (dx = cuánto asoman al costado).
  🎭 14 DISFRACES (COSTUMES): conjuntos que se compran juntos con 20% menos y se ponen de una (tienda y pestaña Disfraces del vestidor).
  Tanda 3: sombrero de princesa, casco de bombera, casco de astronauta (big), gorro de Papá Noel, gorro de lana, orejeras, collar de
  perlas, medalla de héroe, cola de sirena + caracol, matafuego, regalo, copo de nieve, bandera. +7 disfraces (Sirena, Princesa, Bombera,
  Astronauta en el espacio, Navidad, Invierno, Abrigadita). Total 84 accesorios y 21 disfraces.
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
- ✅ HECHO (27/11): Isla con 9 paisajes que rotan cada partida (ISL_SCN, S.islScn): Isla clásica, Selva, Desierto, Nieve, Golosinas, Luna,
  Bosque de hadas, Valle Dino, Ciudad Musical. Fondo = img/kart_bg_<id>.jpg con parallax, piso y líquido de colores propios, y un bichito
  distinto para pisar (snake, scorpion, penguin, snail, alien, ladybug, dinosaur, mouse) que dice su nombre en inglés y castellano.
- ✅ HECHO (27/11): Kart con 16 pistas (+Granja Feliz y Bajo el Mar, bloqueadas en cadena).
- ✅ HECHO (28/11): 4 pilotos nuevos del Kart hechos con ChatGPT (de espaldas, mismo estilo que kart_panda.png): 🐱 Gatita (kart_cat.png, n° 7), 🐧 Pingüino (kart_penguin.png, n° 8), 🦄 Unicornio (kart_unicorn.png, n° 9), 🦖 Dino (kart_dino.png, n° 10). 10 pilotos en total; los rivales salen al azar entre todos.
- ✅ HECHO (27/11): 🦊 Carrera Mágica (run.js, Sala de Juegos, 600 💎, 1 🔮 por partida): corredor 3D de 3 carriles con three.js
  (lib/three.min.js, MIT, guardado local para funcionar offline). Arte ChatGPT en img/run/ (zorrito de espaldas 4 poses, valla, tronco, arco con
  cartel, carrito, estrella, 4 poderes, arco de palabras, horizonte, 4 decorados). Deslizar ←→ carril, ↑ saltar, ↓ agacharse. Puertas de palabras
  cada 7 filas (emoji + voz en inglés → pasar por la puerta con esa palabra, +10 ⭐). Poderes: imán, súper salto, escudo, x2. 3 vidas, velocidad
  sube de a poco. Premio: 💎 = estrellas/5 + 3 por palabra; récord en S.run.best. 27/11 v2: 🛝 rampas 3D de madera (vuelo con
  arco de estrellas), ⚡ plataforma turbo (4,5 s: muy rápido, invencible, solo estrellas, líneas de velocidad) y 🚃 trencitos de vagones 3D
  (con o sin rampa adelante) para correr por arriba; chocarlos de frente saca vida. Modelos hechos con código (ExtrudeGeometry/Box/Cylinder).
  28/11: se elige corredor entre los amigos adoptados en la Casa (RUNNERS/RUNW en run.js, S.run.ch; hoja img/run/<id>_run1, _run2, _jump, _slide).
  Hechos: 🦊 Zorrito, 🐱 Gatita, 🐶 Perrito, 🐰 Conejita, 🐧 Pingüino, 🐼 Panda, 🦄 Unicornio, 🐲 Dragoncito (los 8 amigos).
- ✅ HECHO (27/11): 🏪 La Tienda (startStore, en GROT): ella atiende un negocio (rotan: frutería, panadería, juguetería, librería, ropa, kiosco)
  y los amigos de la Casa le piden cosas en inglés ("Can I have…, please?", "I want…", "I would like…"). Nivel 1 con traducción y voz en
  castellano; nivel 3+ piden cantidades (two apples → tocar 2 veces + "Here you are!"); nivel 4+ estante sin nombres.
- ✅ HECHO (27/11): Karaoke con 11 canciones (+Baa Baa Black Sheep, London Bridge, The Itsy Bitsy Spider, If You're Happy and You Know It,
  Are You Sleeping Brother John).
- ✅ HECHO (27/11): los cuentos con amigos usan SOLO amigos desbloqueados y ya nacidos (storyPick/ownedFriends): si el cuento trae un
  amigo que no tiene, se reemplaza por uno suyo (también en el texto: storyTxt) y aparece en su etapa real; si tiene pocos amigos, le tocan
  cuentos con menos personajes o los clásicos. Así no se arruina la sorpresa de los amigos que faltan.
- ✅ HECHO (27/11): Carrera Mágica cuesta 2000 💎. Golpe sin titilar (sale despedido girando, rebote, temblor de cámara, destello rojo, estrellitas
  de mareo, vibración). Sonidos sintetizados SFX (estrella, poder, puerta, error, golpe, salto, aterrizaje, rampa, turbo, carril). Música suave
  sintetizada (musicStart/musicStop) en los menús del Kart y de la Carrera; se corta al empezar a jugar.
- ✅ HECHO (28/11): 🏁 Garaje del Kart (KCARS): 4 autos de ChatGPT manejados por el Zorrito (Rayo, Tornado, Galaxia, Dorado; img/kcar_*.png),
  cada uno más rápido (sp/ac). Se compran con ⭐ (80/200/400/700) o 💎 (300/700/1300/2200); S.kart.cars. Los rivales siguen siendo los 5 pilotos.
- 🔄 EN CURSO (hechos: Pradera, Playa, Nieve, Golosinas, Selva, Desierto, Espacio, Valle Dino, Bajo el Mar; rotan en cada carrera, RSCN en run.js, S.run.scn): más paisajes para la Carrera Mágica con ChatGPT (por paisaje: 1 horizonte panorámico + 1 hoja 2x2 de decorados; el camino y el
  pasto se dibujan por código con los colores del paisaje).
- ✅ HECHO (28/11, buggy.js, Sala 2500 💎): 🏖️ Buggy Splash — antes: EN COLA (pedido 27/11): juego nuevo de carreras de BUGGYS en la playa (estilo de juego de Beach Buggy Racing, pero original: arte, personajes
  y nombre propios). Caminos de arena anchos, 3D con three.js como la Carrera Mágica, rivales, y el buggy tira poderes a los contrincantes
  (por ejemplo burbuja, cáscara de banana, ola, cohete de confeti). Inglés integrado (cajas de poder con palabras). Arte de buggys y pilotos con ChatGPT.
- ✅ HECHO (28/11): Buggy Splash con 9 pistas (BTRK en buggy.js): Playa Splash, Pradera Loca, Pista Helada (derrapa más), Ruta Dulce, Selva Salvaje, Dunas del Oasis, Ruta Galáctica, Valle Dino y Arrecife Mágico; cada una con
  su trazado, colores, horizonte y decorados (reusa el arte de la Carrera Mágica). Se desbloquean saliendo en el podio (S.bug.unl/cup/sel).
- ✅ HECHO (28/11, chat.js): 🗣️ Charla con el amigo compañero (startChat, en GROT y botón en la Casa): 18 preguntas en inglés por nivel con 2-3
  respuestas (tocar o decir con micrófono), el amigo contesta con voz, boca animada y pose feliz. 📅 Desafío del día (openDaily, botón en el
  camino): 3 palabras nuevas por día (ver/escuchar, elegir, decir) → 💎25 ⭐3, racha S.dstreak. 📊 Resumen semanal en el panel de padres
  (días, minutos, palabras nuevas por S.hfirst, aciertos, comparación con la semana anterior, botón Compartir).
- ✅ HECHO (28/11, simon.js): 🙋 Simón dice (startSimon, en GROT): el amigo compañero da órdenes en inglés (36 acciones: touch your nose, clap your hands,
  hop like a frog…) y ella toca la tarjeta. Nivel 1 siempre "Simon says" + castellano; nivel 2+ órdenes trampa (sin "Simon says") → botón
  "🙅 ¡Simón no dijo!"; nivel 3+ sin castellano ni nombres; nivel 4+ dos órdenes seguidas ("… and …") y el texto aparece después de escuchar.
- ✅ HECHO (28/11, dino.js): 🦖 Dino Aventura (Sala, 3000 💎; dino de ChatGPT en img/dino/run1, run2, jump, charge.webp): aventura 3D libre con three.js.
  Isla con colinas, montaña, playa y agua; columnas de piedra que suben a una isla flotante y escalones a una cornisa. Joystick (izquierda) para
  girar/avanzar (cámara siempre atrás: el dino se ve de espaldas), botones saltar ⬆️ y embestir 💥. 💎 gemas 3D (~65), 🥚 5 huevos (al tocarlos
  nace un dino bebé que pregunta una palabra en inglés con 3 opciones), bichitos gruñones (embestirlos o caerles encima; si te tocan: golpe
  sin titilar, 3 ❤️), flecha al huevo más cercano, chapuzón si cae al agua. Con los 5 huevos se abre el 🌀 portal → mundo siguiente.
  5 mundos en cadena (S.dino.unl): Valle Dino, Selva Escondida, Oasis de Arena, Montaña Nevada, Planeta Cristal (reusa horizontes y decorados).
  Arte ChatGPT: bichitos img/dino/e_beetle (Valle, Selva), e_crab (Oasis), e_snowman (Nieve), e_alien (Planeta Cristal) y huevo img/dino/egg.webp (campo foe en DW).
  Los decorados entre la cámara y el dino se vuelven transparentes. (Modelado 3D .glb del dino: descartado por el dueño el 28/11; se queda con el arte de ChatGPT.)
- ✅ REGLA (28/11, pedido del dueño): en cuentos Y juegos solo aparecen amigos de la Casa desbloqueados y ya nacidos (ownedFriends()).
  Aplicado en: cuentos (storyPick), Tienda (clientes), Carrera Mágica (selector de corredor: solo los desbloqueados; las hojas de los demás
  quedan guardadas y aparecen solas al desbloquearlos), Kart (KFRIEND/kOk: Coneja, Panda, Gatita, Pingüino y Unicornio solo si ya son
  amigos, también como rivales) y Buggy Splash (si no tiene Panda/Conejita, corren otro koala/león). Charla y Simón dice usan el amigo compañero.
- ✅ HECHO (28/11, review.js): 🔁 Repaso inteligente. Botón naranja en el camino (debajo del Desafío del día) que aparece con 3+ palabras
  difíciles (S.hist: errores > 0 y aciertos < errores+2). Elige hasta 6 de las más falladas, las muestra para escuchar, y pregunta cada una
  de 2 formas (escuchar→dibujo, dibujo→palabra, inglés→castellano, castellano→inglés; las frases sin dibujo, solo texto). Si erra, la palabra
  vuelve al final. Las que hace perfectas dejan de ser difíciles. Premio 💎50 ⭐2 la primera vez del día, 💎10 las siguientes (S.rev); el botón y el final lo muestran claro.
- ✅ HECHO (28/11): las ⭐ disponibles se ven donde se compra: arriba en la Tienda y la Sala de Juegos (junto a 💎), en el garaje del Kart
  ("Tenés ⭐ X y 💎 Y") y en la ventana de compra del auto ("te faltan N" en cada botón). La Casa y el camino ya las mostraban.
- 🎨 REDISEÑO (pedido 28/11), referencias del dueño en design/: ref_rediseno_principal.webp (Juegos, Casa, Tienda) y ref_rediseno_minijuegos.webp.
  Regla: copiar la referencia TAL CUAL (el dueño rechazó una versión "inspirada").
  ✅ HECHO (28/11): Juegos, Casa y Tienda rediseñadas (clase .rd, bloque CSS "REDISEÑO" al final del <style>; fuentes propias fonts/ EQ Baloo y EQ Nunito).
  Arte ChatGPT: img/ui/cover_*.webp (portadas), img/ui/shop_bg.webp (probador), img/acc/<id>.webp (49 accesorios) y img/acc/cos_<id>.webp (14 disfraces)
  → accIcon()/cosIcon(). Juegos: perfil + barra inferior (Juegos/Casa/Tienda/Colección=álbum). Casa: barras de necesidad dentro de cada
  botón, ❤️ cariño junto a la carita, 👒 Vestir en la habitación, 🎒 en el amigo que acompaña. Tienda: flechas ‹ › eligen qué amigo vestir.
- ✅ HECHO (28/11): sistema de minijuegos (mgSetup en gSetup; CSS "SISTEMA DE MINIJUEGOS"): fondo img/ui/game_bg.webp, barra superior grande,
  barra de progreso automática (gScore "a/b"), zorrito guía img/guide/fox_<wave|think|cheer|point|apple|sad>.webp abajo a la izquierda
  con globo (saluda al empezar, festeja con sGood, se pone triste con sBad, dice las frases de narr). Guía solo en MG_GUIDE (juegos de
  tarjetas); no en Crucigrama/Ordená/Globos/Hablá/Tienda/Simón/Charla porque tapaba controles. (Lección y retoques: hechos el 28/11.)
- (antes EN COLA) rediseño de TODOS los minijuegos con la misma línea (ref_rediseno_minijuegos.webp): fondo de naturaleza/cielo,
  Zorrito guía en cada actividad con globo de diálogo (instrucción en inglés + castellano), tarjetas 3D con volumen, instrucciones grandes,
  verde/rojo + animación al responder, barra de progreso visible arriba. Hacerlo como SISTEMA de diseño global (mismos componentes en todos).
- ✅ HECHO (28/11): menú del inicio según design/ref_rediseno_inicio.webp (CSS "MENÚ DEL INICIO", clase .pt; íconos ChatGPT img/ui/ic_cal|ic_rev|ic_house|ic_pad.webp;
  el calendario muestra el día y mes de hoy). Tienda del camino con puesto img/ui/stall.webp. Minijuegos: 5 fondos rotando (MG_BGS).
- (antes EN COLA) rediseñar el menú de arriba del inicio/camino (contadores ⭐ Nv. Voz 💎, saludo, racha, Desafío, Repaso,
  Casa y Sala) con la misma línea del rediseño. Referencia del dueño: design/ref_rediseno_inicio.webp (copiar tal cual): pastillas blancas
  arriba, Desafío/Repaso como botones gruesos con ícono 3D a la izquierda y la info en una cápsula a la derecha, Casa y Sala con ícono 3D
  grande (casita, joystick amarillo). Íconos 3D: hechos el 28/11.
- ✅ HECHO (28/11): la LECCIÓN con el estilo de los minijuegos (fondo, barra grande, consigna en globo, tarjeta blanca, opciones con volumen,
  zorrito guía y cartel de resultado con el zorrito festejando/triste + dibujo + 🔊). Todos los minijuegos usan el sistema (salvo la Isla,
  que es un juego aparte). Textos sueltos van en recuadro blanco. Memotest con 🐾. Fondos: MG_BGS rota en cada juego; faltan más fondos ChatGPT.
- ✅ HECHO (28/11): pantalla de premio (fondo que rota + tarjeta blanca + Zorrito festejando), panel de padres, elegir voz y vestidor
  (íconos 3D, pestañas grandes) con el estilo nuevo (CSS "PREMIO, PADRES, VOZ Y VESTIDOR").
- ✅ HECHO (28/11, pedido del dueño): en el descanso el castellano se cortaba (el siguiente texto arrancaba antes y cancelaba la voz).
  Ahora talk() espera a que termine el castellano (margen según el largo) y el castellano se dice un poco más rápido (rate 1.12, también en sayBoth).
- ✅ HECHO (28/11): cuentos por dentro con el estilo nuevo (marco blanco en la escena, texto en tarjeta, letra nueva). Toda la app
  queda con el rediseño salvo los videojuegos de la Sala y la Isla (juegos aparte).
- ✅ HECHO (28/11): videojuegos de la Sala con el estilo nuevo por fuera: inicio con portada (.gs-cover, img/ui/cover_*), instrucciones
  en tarjetas, pistas/mundos en fila deslizable, selección de piloto/pista del Kart en tarjetas, paneles de carrera grandes, barra de
  velocidad en el Kart (.kq-dash) y portal de Dino como arco de piedra con 🔒 hasta abrirse.
- ✅ HECHO (28/11): 🏆 Logros y medallas (ach.js): 22 medallas (palabras, rachas, estrellas, mundos, huevos, podios, amigos, accesorios,
  figuritas, repasos, desafíos) con 💎 una vez; aviso solo en el camino; se ven con 🏆 arriba, tocando el perfil en Juegos y en el panel de padres.
- ✅ HECHO (28/11): juegos nuevos en el camino (games2.js): ✍️ Dictado (escuchá y escribí con teclado, 🐢 más lento, pista de letra) y
  ↔️ Opuestos (28 pares). Dino Aventura: bichitos dicen su nombre (beetle, crab, snowman, alien), misión del dino amigo (3 gemas de un
  color = +15 💎) y récord de gemas por mundo. Tanda 6 de vocabulario (17 temas, 127 palabras, b:6) y frases tanda 5 (116 patrones).
  Ladrillos con tablero claro. Voces del narrador: el dueño decidió NO ocultarlas.
- ✅ HECHO (28/11, pedido del dueño): se quitó el botón flotante de sonido 🔊 (muteB); el volumen se maneja con el celular. Las barras de
  arriba ya no reservan lugar para ese botón.
- ✅ HECHO (28/11, pedido del dueño): mascotas proactivas (pets.js, petProactive desde petIdle): cada 13-24 s hablan solas; si una
  necesidad está baja dicen frases de esa necesidad (más urgentes si <18), si todo está bien dicen frases de su personalidad (PET_CHAT por
  amigo, 12 c/u + 10 generales). Rotan como mazo. REGLA: seguir sumando frases a PET_CHAT / NEED_MORE en pets.js.
- ✅ HECHO (28/11, pedido del dueño): precios de los amigos de la Casa: Gatita y Perrito 2000 💎, Conejita, Pingüino y Panda 2500 💎,
  Unicornio y Dragoncito 3000 💎.
- ✅ HECHO (28/11, pedido del dueño): Kart no da gemas (su premio son pistas nuevas) y ahora la pista siguiente se destraba SOLO saliendo 1°
  (antes 1°, 2° o 3°). Las pistas ya destrabadas se conservan.
- ✅ REGLA (28/11, pedido del dueño): los juegos de la Sala (Kart, Carrera Mágica, Buggy Splash, Dino Aventura) NO dan gemas: las gemas se
  ganan estudiando y sirven para comprar esos juegos. Su premio es avanzar (pistas, mundos, récords). No agregar gemas a juegos de la Sala.
- ✅ HECHO (28/11): recomendaciones del informe de balance (balance.js): 🎯 meta de ahorro en el inicio (S.saveGoal, barra y días que faltan),
  lecciones dan 10/15/20 💎 (antes 5/10/15) con mensaje de esfuerzo si no fue perfecta, 🛡️ comodín de racha (1 día de perdón por semana,
  S.freezeWk), 🗓️ premio semanal 💎100 por 5 días practicados (S.wkBonus), medallas de a una por visita y con texto de lo aprendido.
- (28/11, pedido del dueño) se QUITÓ del inicio la tarjeta de meta de ahorro (sobrecargaba el home). El código sigue en balance.js sin usarse.
- ✅ HECHO (28/11, pedido del dueño): el Repaso ya no es botón del inicio: es una parada del camino ('rev', 🔁) en todos los mundos (cerca
  del final, antes del Memotest; en el mundo 1 antes del último cofre). Usa las palabras difíciles y completa con las del mundo si hay pocas.
- ✅ ARREGLADO (28/11): la app se reiniciaba sola (al alimentar en la Casa) por la auto-actualización: recargaba también en Casa/Sala
  y al cambiar el service worker en cualquier pantalla. Ahora recarga SOLO en inicio o camino y sin ventanas abiertas.
- ✅ HECHO (28/11, pedido del dueño): frases del descanso en brk.js (saludos, ánimo, respiración, ojos, pedir palabra, 30 datos curiosos,
  asombro), rotan como mazo (S.brdeck). REGLA: seguir sumando frases nuevas en brk.js constantemente.
- ✅ HECHO (28/11, pedido del dueño): las mascotas hablan según su nivel (petLv: mundo 1 → 1, mundos 2-3 → 2, mundo 4+ → 3), suman frases
  más largas por nivel (CHAT_LV, PET_CHAT2) y ~30% de las veces usan palabras que ella YA aprendió (S.hist) con plantillas por nivel (WORD_T).
  REGLA: seguir sumando frases en pets.js.
- ✅ HECHO (28/11): panel de padres con tarjeta "🗣️ Charla con su mascota" (S.chatSt: charlas por día, total, respuestas en voz alta vs tocadas,
  última charla). Se cuenta desde el 28/11.
- ✅ HECHO (28/11, pedido del dueño): en el descanso el amigo charla con ella (paso chat en PLAN, preguntas CHATQ de chat.js, tocar o
  micrófono); cuenta en la tarjeta del panel de padres. Pendiente: seguir mirando en el panel si charla por voluntad propia.
- ✅ HECHO (28/11, pedido del dueño): medallas simplificadas a 13, solo de estudio (palabras, rachas, estrellas, mundos, repasos,
  desafíos); se quitaron las de juegos de la Sala (huevos, podios, Buggy, Carrera) y las de compras. Tarjetas: ícono + nombre + barrita.
- ✅ HECHO (28/11, pedido del dueño): jerarquía visual única en minijuegos y lección (CSS "JERARQUÍA VISUAL"): instrucción = cinta violeta,
  inglés = tarjeta blanca grande azul, castellano = texto chico celeste en itálica (sin bandera), respuestas = botones con borde y sombra de color.
- ✅ HECHO (28/11, pedido del dueño): la mascota compañera invita a charlar en la Casa ("Do you want to talk with me?") con botón
  "💬 ¡Sí, charlemos!" que dura 15 s (cada ~1,5 min si hoy no charló, cada ~4 min si ya charló). Panel: invitaciones aceptadas (S.chatInv/chatInvA).
- ✅ HECHO (28/11): 📅 desafíos semanales (ach.js, lista WCH): 3 por semana elegidos según la semana, se renuevan cada lunes,
  💎30 cada uno; se ven arriba en 🏆 Mis medallas. Las medallas NO se resetean nunca (solo "Empezar de cero").
- ✅ HECHO (28/11): la invitación a charlar de la mascota ahora es un ícono 💬 chico a la derecha y solo aparece si pasaron 24 hs sin charlar (S.chatSt.lastT).
