/* 🔡 ¿QUÉ LETRA FALTA?: ve el dibujo y la palabra con un hueco; elige la letra que falta (más huecos en niveles altos).
   🎵 RIMAS: escucha una palabra y elige la que rima (cat → hat).
   🕐 ¿QUÉ VA PRIMERO?: ordena 3 o 4 pasos de una rutina o historia (wake up → brush teeth → …).
   Los tres usan el sistema de minijuegos (gSetup) y terminan con finishGameNode. PARA SUMAR: agregar en RHY o SEQ. */
(function(){
var ABC='abcdefghijklmnopqrstuvwxyz';
window.startMissing=function(u,lv){
 lv=lv||1; var host=gSetup('🔡 ¿Qué letra? · Nivel '+lv);
 var maxL=lv<=1?5:lv===2?6:lv===3?7:9, gaps=lv>=4?2:1;
 var pool=prioW(singleWords(u).filter(function(w){return /^[a-z]+$/i.test(w.en)&&w.en.length>=3&&w.en.length<=maxL&&w.e;}));
 if(pool.length<4)pool=shuffle(singleWords([0,1,2]).filter(function(w){return /^[a-z]+$/i.test(w.en)&&w.en.length>=3&&w.en.length<=maxL&&w.e;}));
 var R=Math.min(pool.length,5+Math.min(lv,3)), r=0, first=0;
 function round(){ if(!GAME.on)return;
  if(r>=R){ finishGameNode('🔡 ¡Ojo de detective!','Completaste '+R+' palabras ('+first+' a la primera) 🔍'); return; }
  var w=pool[r], word=w.en.toLowerCase(), idx=[], tries=0;
  var cand=word.split('').map(function(_,i){return i;}); if(word.length>3)cand=cand.filter(function(i){return i>0;}); /* la primera letra ayuda a leerla */
  idx=shuffle(cand).slice(0,Math.min(gaps,word.length-2)).sort(function(a,b){return a-b;});
  var k=0;
  function draw(){ var cur=idx[k], need=word[cur];
   var opts=[need]; shuffle(ABC.split('')).forEach(function(c){ if(opts.length<(lv>=3?4:3)&&opts.indexOf(c)<0)opts.push(c); }); opts=shuffle(opts);
   host.innerHTML='<div class="g2 ms"><div class="g2-sub">🔡 ¿Qué letra falta? · Which letter is missing?</div>'
    +'<div class="op-card"><b>'+w.e+'</b>'+(lv<3?'<small>'+w.es+'</small>':'')+'</div>'
    +'<div class="sp-slots ms-slots">'+word.split('').map(function(c,i){ var hole=idx.indexOf(i)>=k&&idx.indexOf(i)>=0; return '<span class="'+(hole?(i===cur?'ms-gap':'ms-gap2'):'ok')+'">'+(hole?'':c)+'</span>'; }).join('')+'</div>'
    +'<div class="ms-opts">'+opts.map(function(c){return '<button class="ls-card ms-o" data-c="'+c+'">'+c+'</button>';}).join('')+'</div>'
    +'<button class="ls-spk sm" id="msSay">🔊</button></div>';
   document.getElementById('msSay').onclick=function(){ say(w.en,0.75); };
   host.querySelectorAll('.ms-o').forEach(function(b){ b.onclick=function(){ if(!GAME.on||b.disabled)return;
    if(b.dataset.c===need){ b.classList.add('ok'); host.querySelectorAll('.ms-o').forEach(function(x){x.disabled=true;}); tone(620,.08,'triangle',.15,0); k++;
     if(k<idx.length){ GAME.timer=setTimeout(draw,500); return; }
     if(!tries)first++; markWord(w,!tries); sGood(); burst(14);
     var sl=host.querySelector('.ms-slots'); if(sl)sl.innerHTML=word.split('').map(function(c){return '<span class="ok">'+c+'</span>';}).join('');
     sayBoth(w.en,w.es); r++; gScore(r+'/'+R); GAME.timer=setTimeout(round,1900); }
    else { tries++; b.disabled=true; b.classList.add('no'); sBad(); } }; });
   if(k===0)GAME.timer=setTimeout(function(){ say(w.en,0.8); },300); }
  draw(); }
 gScore('0/'+R); round();
};

var RHY=[ /* grupos que riman: [palabra, castellano, emoji] */
 [['cat','gato','🐱'],['hat','sombrero','🎩'],['bat','murciélago','🦇'],['rat','rata','🐀']],
 [['dog','perro','🐶'],['frog','rana','🐸'],['log','tronco','🪵']],
 [['bee','abeja','🐝'],['tree','árbol','🌳'],['three','tres','3️⃣'],['key','llave','🔑']],
 [['star','estrella','⭐'],['car','auto','🚗'],['jar','frasco','🫙'],['guitar','guitarra','🎸']],
 [['cake','torta','🎂'],['snake','serpiente','🐍'],['lake','lago','🏞️'],['rake','rastrillo','🧹']],
 [['moon','luna','🌙'],['spoon','cuchara','🥄'],['balloon','globo','🎈']],
 [['fish','pez','🐟'],['dish','plato','🍽️'],['wish','deseo','🌠']],
 [['bear','oso','🐻'],['chair','silla','🪑'],['pear','pera','🍐'],['hair','pelo','💇']],
 [['boat','barco','⛵'],['goat','cabra','🐐'],['coat','abrigo','🧥']],
 [['king','rey','🤴'],['ring','anillo','💍'],['swing','hamaca','🛝'],['wing','ala','🪽']],
 [['house','casa','🏠'],['mouse','ratón','🐭']],
 [['bed','cama','🛏️'],['red','rojo','🔴'],['bread','pan','🍞'],['head','cabeza','🗣️']],
 [['sun','sol','☀️'],['bun','bollo','🍞'],['run','correr','🏃']],
 [['box','caja','📦'],['fox','zorro','🦊'],['socks','medias','🧦']],
 [['night','noche','🌙'],['kite','barrilete','🪁'],['light','luz','💡'],['white','blanco','⚪']],
 [['rain','lluvia','🌧️'],['train','tren','🚆'],['plane','avión','✈️']],
 [['book','libro','📖'],['cook','cocinar','🧑‍🍳'],['hook','gancho','🪝']],
 [['ball','pelota','⚽'],['wall','pared','🧱'],['tall','alto','🦒']],
 [['shoe','zapato','👟'],['two','dos','2️⃣'],['zoo','zoológico','🦁'],['blue','azul','🔵']],
 [['nose','nariz','👃'],['rose','rosa','🌹'],['toes','dedos del pie','🦶']],
 [['clock','reloj','🕰️'],['sock','media','🧦'],['rock','piedra','🪨']],
 [['pig','chancho','🐷'],['wig','peluca','💇'],['dig','cavar','⛏️']],
 [['bell','campana','🔔'],['shell','caracol','🐚'],['well','pozo','🪣']],
 [['snow','nieve','❄️'],['bow','moño','🎀'],['crow','cuervo','🐦‍⬛']]
];
window.RHY=RHY;
window.startRhymes=function(u,lv){
 lv=lv||1; var host=gSetup('🎵 Rimas · Nivel '+lv);
 var R=Math.min(8,5+lv), r=0, first=0, NO=lv>=3?4:3, groups=shuffle(RHY.slice());
 function round(){ if(!GAME.on)return;
  if(r>=R){ finishGameNode('🎵 ¡Sos una poeta!','Encontraste '+R+' rimas ('+first+' a la primera) 🎶'); return; }
  var g=groups[r%groups.length], two=shuffle(g.slice()).slice(0,2), a=two[0], b=two[1], tries=0;
  var others=shuffle(RHY.filter(function(x){return x!==g;})).slice(0,NO-1).map(function(x){return x[(Math.random()*x.length)|0];});
  var opts=shuffle([b].concat(others));
  host.innerHTML='<div class="g2 op"><div class="g2-sub">🎵 ¿Qué palabra <b>rima</b> con…? · What rhymes with…?</div>'
   +'<div class="op-card"><b>'+a[2]+'</b><span>'+a[0]+'</span>'+(lv<3?'<small>'+a[1]+'</small>':'')+'</div><button class="ls-spk sm" id="rhSay">🔊</button>'
   +'<div class="op-opts">'+opts.map(function(o,i){return '<button class="ls-card op-o" data-i="'+i+'"><b>'+o[2]+'</b><span>'+o[0]+'</span>'+(lv<2?'<small>'+o[1]+'</small>':'')+'</button>';}).join('')+'</div></div>';
  document.getElementById('rhSay').onclick=function(){ say(a[0],0.75); };
  say(a[0]+'. What rhymes with '+a[0]+'?',0.85);
  host.querySelectorAll('.op-o').forEach(function(btn){ btn.onclick=function(){ if(!GAME.on||btn.disabled)return; var o=opts[+btn.dataset.i];
   if(o===b){ btn.classList.add('ok'); host.querySelectorAll('.op-o').forEach(function(x){x.disabled=true;}); if(!tries)first++; markWord({en:b[0],es:b[1],e:b[2]},!tries); sGood(); burst(14); sayBoth(a[0]+', '+b[0]+'!',a[1]+' y '+b[1]+' riman en inglés'); r++; gScore(r+'/'+R); GAME.timer=setTimeout(round,2400); }
   else { tries++; btn.disabled=true; btn.classList.add('no'); sBad(); say(o[0]); } }; }); }
 gScore('0/'+R); round();
};

var SEQ=[ /* pasos en orden: [inglés, castellano, emoji]; lv = desde qué nivel aparece */
 {lv:1,n:'La mañana',s:[['wake up','despertarse','⏰'],['brush my teeth','lavarme los dientes','🪥'],['eat breakfast','desayunar','🥣'],['go to school','ir a la escuela','🏫']]},
 {lv:1,n:'La noche',s:[['take a bath','bañarme','🛁'],['put on pajamas','ponerme el pijama','👚'],['read a story','leer un cuento','📖'],['go to sleep','dormirme','😴']]},
 {lv:1,n:'La planta',s:[['seed','semilla','🌰'],['sprout','brote','🌱'],['plant','planta','🪴'],['flower','flor','🌻']]},
 {lv:1,n:'La mariposa',s:[['egg','huevo','🥚'],['caterpillar','oruga','🐛'],['cocoon','capullo','🫘'],['butterfly','mariposa','🦋']]},
 {lv:2,n:'Hacer una torta',s:[['mix the eggs','mezclar los huevos','🥚'],['put it in the oven','meterla al horno','♨️'],['add the frosting','ponerle el glaseado','🧁'],['eat the cake','comer la torta','🎂']]},
 {lv:2,n:'El día',s:[['morning','mañana','🌅'],['afternoon','tarde','☀️'],['evening','atardecer','🌇'],['night','noche','🌙']]},
 {lv:2,n:'Crecer',s:[['baby','bebé','👶'],['child','niña','👧'],['teenager','adolescente','🧑'],['grandma','abuela','👵']]},
 {lv:2,n:'Lavarse las manos',s:[['turn on the water','abrir la canilla','🚰'],['use soap','usar jabón','🧼'],['rinse your hands','enjuagarse las manos','💧'],['dry your hands','secarse las manos','🧻']]},
 {lv:3,n:'Hacer un muñeco de nieve',s:[['roll a big ball','hacer una bola grande','⚪'],['put a small ball on top','poner una bola chica arriba','⛄'],['add a carrot nose','ponerle la nariz de zanahoria','🥕'],['put on a hat','ponerle un sombrero','🎩']]},
 {lv:3,n:'La rana',s:[['eggs','huevitos','🫧'],['tadpole','renacuajo','🐟'],['little frog','ranita','🐸'],['big frog','rana grande','🐸']]},
 {lv:3,n:'Mandar una carta',s:[['write a letter','escribir una carta','📝'],['put it in an envelope','meterla en un sobre','✉️'],['add a stamp','pegar la estampilla','📮'],['send it','mandarla','📬']]},
 {lv:3,n:'Las estaciones',s:[['spring','primavera','🌸'],['summer','verano','☀️'],['autumn','otoño','🍂'],['winter','invierno','❄️']]},
 {lv:4,n:'Ir de picnic',s:[['make sandwiches','hacer sándwiches','🥪'],['pack the basket','preparar la canasta','🧺'],['go to the park','ir a la plaza','🌳'],['eat on a blanket','comer sobre una manta','🧺']]},
 {lv:4,n:'Plantar un árbol',s:[['dig a hole','cavar un pozo','⛏️'],['put in the seed','poner la semilla','🌰'],['cover it with soil','taparla con tierra','🟫'],['water it','regarla','💧']]},
 {lv:4,n:'El cohete',s:[['get in the rocket','subir al cohete','🧑‍🚀'],['count down','hacer la cuenta regresiva','🔟'],['blast off','despegar','🚀'],['land on the moon','aterrizar en la luna','🌕']]},
 {lv:5,n:'Un cuento',s:[['Once upon a time','Había una vez','📖'],['there was a brave princess','una princesa valiente','👸'],['she found a dragon','encontró un dragón','🐉'],['and they became friends','y se hicieron amigos','🤝']]}
];
window.SEQ=SEQ;
window.startSequence=function(u,lv){
 lv=lv||1; var host=gSetup('🕐 En orden · Nivel '+lv);
 var pool=shuffle(SEQ.filter(function(q){return q.lv<=Math.min(5,lv)&&q.lv>=Math.min(5,lv)-2;})); if(pool.length<3)pool=shuffle(SEQ.slice());
 var R=Math.min(pool.length,lv>=3?5:4), r=0, first=0;
 function round(){ if(!GAME.on)return;
  if(r>=R){ finishGameNode('🕐 ¡Todo en orden!','Ordenaste '+R+' historias ('+first+' sin errores) 📋'); return; }
  var q=pool[r], steps=q.s.slice(0,lv<=1?3:4), order=shuffle(steps.map(function(_,i){return i;})), pos=0, errs=0;
  if(order.every(function(x,i){return x===i;}))order.reverse();
  host.innerHTML='<div class="g2 sq"><div class="g2-sub">🕐 Tocá en orden: ¿qué va primero? · '+q.n+'</div>'
   +'<div class="sq-line" id="sqLine">'+steps.map(function(_,i){return '<span class="sq-slot">'+(i+1)+'</span>';}).join('')+'</div>'
   +'<div class="sq-opts">'+order.map(function(i){var s=steps[i]; return '<button class="ls-card sq-o" data-i="'+i+'"><b>'+s[2]+'</b><span>'+s[0]+'</span>'+(lv<4?'<small>'+s[1]+'</small>':'')+'</button>';}).join('')+'</div></div>';
  var slots=host.querySelectorAll('.sq-slot');
  host.querySelectorAll('.sq-o').forEach(function(b){ b.onclick=function(){ if(!GAME.on||b.disabled)return; var i=+b.dataset.i, s=steps[i];
   if(i===pos){ b.disabled=true; b.classList.add('ok','used'); slots[pos].innerHTML='<b>'+s[2]+'</b>'; slots[pos].classList.add('ok'); say(s[0],0.9); tone(520+pos*80,.08,'triangle',.15,0); pos++;
    if(pos>=steps.length){ if(!errs)first++; steps.forEach(function(x){ markWord({en:x[0],es:x[1],e:x[2]},!errs); }); sGood(); burst(18);
     GAME.timer=setTimeout(function(){ sayBoth(steps.map(function(x){return x[0];}).join(', then '),'¡Muy bien ordenado!'); },700); r++; gScore(r+'/'+R); GAME.timer=setTimeout(round,3600); } }
   else { errs++; sBad(); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); setTimeout(function(){ b.classList.remove('no'); },600); } }; }); }
 gScore('0/'+R); round();
};
})();
