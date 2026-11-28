/* ✍️ DICTADO: escucha la palabra y la escribe con el teclado de la pantalla (después ve el dibujo).
   ↔️ OPUESTOS: ve una palabra y elige su contrario (big ↔ small). Los dos usan el sistema de minijuegos (gSetup). */
(function(){
window.startDictation=function(u,lv){
 lv=lv||1; var host=gSetup('✍️ Dictado · Nivel '+lv);
 var maxL=lv<=1?4:lv===2?5:lv===3?6:8, pool=prioW(singleWords(u).filter(function(w){return w.en.length<=maxL&&w.en.length>=3;}));
 if(pool.length<4)pool=shuffle(singleWords([0,1,2]).filter(function(w){return w.en.length<=maxL&&w.en.length>=3;}));
 var R=Math.min(pool.length,5+Math.min(lv,3)), r=0, first=0;
 var ROWS=['qwertyuiop','asdfghjkl','zxcvbnm'];
 function round(){ if(!GAME.on)return;
  if(r>=R){ finishGameNode('✍️ ¡Qué buena oreja!','Escribiste '+R+' palabras ('+first+' sin errores) 👂'); return; }
  var w=pool[r], word=w.en.toLowerCase(), pos=0, errs=0;
  host.innerHTML='<div class="g2 dt"><div class="g2-sub">👂 Escuchá y escribí la palabra en inglés</div>'
   +'<button class="ls-spk" id="dtSay">🔊</button><button class="dt-slow" id="dtSlow">🐢 más lento</button>'
   +'<div class="dt-pic" id="dtPic">❓</div>'
   +'<div class="sp-slots dt-slots" id="dtSlots">'+word.split('').map(function(){return '<span></span>';}).join('')+'</div>'
   +'<div class="dt-kb" id="dtKb">'+ROWS.map(function(row){return '<div>'+row.split('').map(function(ch){return '<button data-k="'+ch+'">'+ch+'</button>';}).join('')+'</div>';}).join('')+'</div></div>';
  var slots=document.getElementById('dtSlots').children;
  document.getElementById('dtSay').onclick=function(){say(w.en);}; document.getElementById('dtSlow').onclick=function(){say(w.en,0.55);};
  function hint(){ var k=document.querySelector('.dt-kb button[data-k="'+word[pos]+'"]'); if(k){k.classList.remove('hint');void k.offsetWidth;k.classList.add('hint');} }
  document.querySelectorAll('.dt-kb button').forEach(function(b){ b.onclick=function(){ if(!GAME.on||pos>=word.length)return; var ch=b.dataset.k;
   if(ch===word[pos]){ slots[pos].textContent=ch; slots[pos].classList.add('ok'); pos++; tone(500+pos*60,.07,'triangle',.15,0);
    if(pos>=word.length){ markWord(w,!errs); if(!errs)first++; sGood(); burst(16); document.getElementById('dtPic').textContent=w.e; say(w.en);
     var s=document.querySelector('.dt .g2-sub'); if(s)s.innerHTML='<b>'+w.en+'</b> = '+w.es; r++; gScore(r+'/'+R); GAME.timer=setTimeout(round,1700); } }
   else { errs++; sBad(); b.classList.add('no'); setTimeout(function(){b.classList.remove('no');},350); if(errs===2||errs%3===0){ say(w.en,0.6); hint(); } } }; });
  GAME.timer=setTimeout(function(){say(w.en);},400); }
 gScore('0/'+R); round();
};

var OPP=[['big','grande','🐘','small','chico','🐭'],['hot','caliente','🔥','cold','frío','🧊'],['happy','feliz','😄','sad','triste','😢'],['day','día','☀️','night','noche','🌙'],
 ['up','arriba','⬆️','down','abajo','⬇️'],['fast','rápido','🐆','slow','lento','🐢'],['open','abierto','📖','closed','cerrado','📕'],['full','lleno','🍽️','empty','vacío','🥣'],
 ['tall','alto','🦒','short','bajo','🐧'],['old','viejo','👴','young','joven','👶'],['wet','mojado','💦','dry','seco','🏜️'],['clean','limpio','🧼','dirty','sucio','🐷'],
 ['loud','fuerte','📢','quiet','silencioso','🤫'],['heavy','pesado','🏋️','light','liviano','🪶'],['in','adentro','📦','out','afuera','🚪'],['yes','sí','✅','no','no','❌'],
 ['left','izquierda','⬅️','right','derecha','➡️'],['black','negro','⚫','white','blanco','⚪'],['hard','duro','🪨','soft','suave','☁️'],['near','cerca','📍','far','lejos','🔭'],
 ['first','primero','🥇','last','último','🐌'],['awake','despierto','👀','asleep','dormido','😴'],['sweet','dulce','🍬','sour','ácido','🍋'],['new','nuevo','✨','old','viejo','🧓'],
 ['start','empezar','🏁','stop','parar','🛑'],['push','empujar','👐','pull','tirar','🪢'],['come','venir','👋','go','ir','🏃'],['win','ganar','🏆','lose','perder','😞']];
window.startOpposites=function(u,lv){
 lv=lv||1; var host=gSetup('↔️ Opuestos · Nivel '+lv);
 var lvMax=lv<=1?10:lv===2?16:lv===3?22:OPP.length, pool=shuffle(OPP.slice(0,lvMax)), R=Math.min(8,5+lv), r=0, first=0, NO=lv>=3?4:3;
 function round(){ if(!GAME.on)return;
  if(r>=R){ finishGameNode('↔️ ¡Sabés los opuestos!','Encontraste '+R+' contrarios ('+first+' a la primera) 🔄'); return; }
  var pr=pool[r%pool.length], flip=Math.random()<0.5, a=flip?[pr[3],pr[4],pr[5]]:[pr[0],pr[1],pr[2]], b=flip?[pr[0],pr[1],pr[2]]:[pr[3],pr[4],pr[5]], tries=0;
  var others=shuffle(OPP.filter(function(x){return x!==pr;})).slice(0,NO-1).map(function(x){return Math.random()<.5?[x[0],x[1],x[2]]:[x[3],x[4],x[5]];});
  var opts=shuffle([b].concat(others));
  host.innerHTML='<div class="g2 op"><div class="g2-sub">¿Cuál es el <b>contrario</b>? · What is the opposite?</div>'
   +'<div class="op-card"><b>'+a[2]+'</b><span>'+a[0]+'</span>'+(lv<3?'<small>'+a[1]+'</small>':'')+'</div><div class="op-arrow">↔️</div>'
   +'<div class="op-opts">'+opts.map(function(o,i){return '<button class="ls-card op-o" data-i="'+i+'"><b>'+o[2]+'</b><span>'+o[0]+'</span>'+(lv<2?'<small>'+o[1]+'</small>':'')+'</button>';}).join('')+'</div></div>';
  say(a[0]+'. What is the opposite?',0.85);
  host.querySelectorAll('.op-o').forEach(function(btn){ btn.onclick=function(){ if(!GAME.on||btn.disabled)return; var o=opts[+btn.dataset.i];
   if(o===b){ btn.classList.add('ok'); host.querySelectorAll('.op-o').forEach(function(x){x.disabled=true;}); if(!tries)first++; markWord({en:b[0],es:b[1],e:b[2]},!tries); sGood(); burst(14); sayBoth(a[0]+' and '+b[0]+'!',a[1]+' y '+b[1]); r++; gScore(r+'/'+R); GAME.timer=setTimeout(round,2300); }
   else { tries++; btn.disabled=true; btn.classList.add('no'); sBad(); say(o[0]); } }; }); }
 gScore('0/'+R); round();
};
})();
