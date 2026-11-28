/* 🔁 REPASO INTELIGENTE: practica solo las palabras que más le cuestan (S.hist = [bien, mal] por palabra).
   Botón en el camino (debajo del Desafío del día) que aparece cuando hay al menos 3 palabras difíciles.
   Cada palabra se pregunta de 2 formas distintas; si se equivoca, la palabra vuelve más adelante.
   Una palabra deja de ser "difícil" cuando ya la acertó bastante más veces de las que la erró. */
(function(){
function findW(en){ for(var i=0;i<UNITS.length;i++){ var U=UNITS[i], w=U.w.find(function(x){return x.en===en;}); if(w)return {en:w.en,es:w.es,e:w.e,ui:i,isP:!!U.isP}; } return null; }
function isHard(x){ return x&&x[1]>0&&x[0]<x[1]+2; }
function hardList(){ var h=S.hist||{}, out=[];
 Object.keys(h).forEach(function(k){ var x=h[k]; if(!isHard(x))return; var w=findW(k); if(!w||!w.es)return; w.score=x[1]*1.2-x[0]*0.5; out.push(w); });
 out.sort(function(a,b){return b.score-a.score;}); return out; }
window.hardCount=function(){ try{ return hardList().length; }catch(e){ return 0; } };
function hdr(){ try{ var b=document.getElementById('hRev'); if(!b)return; var n=hardCount(); b.style.display=n>=3?'':'none';
  var done=S.rev&&S.rev.day===dkey(); b.querySelector('span').textContent=n+' palabra'+(n>1?'s':'')+(done?' · ✓ hoy · 💎10':' · 💎50'); }catch(e){} }
window.reviewHdr=hdr; setTimeout(hdr,0); /* el camino se dibuja antes de que cargue este archivo */

function pool(w){ /* distractores: primero del mismo tema, después de cualquiera; con emoji distinto */
 var same=UNITS[w.ui]?UNITS[w.ui].w:[], all=[]; UNITS.forEach(function(U,i){ if(!!U.isP===w.isP&&i!==w.ui)U.w.forEach(function(x){all.push(x);}); });
 var seenE={}, seenEn={}; seenE[w.e]=1; seenEn[w.en]=1; var out=[];
 shuffle(same).concat(shuffle(all)).forEach(function(x){ if(out.length>=3||seenE[x.e]||seenEn[x.en]||!x.es)return; seenE[x.e]=1; seenEn[x.en]=1; out.push({en:x.en,es:x.es,e:x.e}); });
 return out; }

window.openReview=function(){
 var list=hardList().slice(0,6), host=gSetup('🔁 Repaso inteligente'); GAME.quiet=false;
 if(list.length<3){ host.innerHTML='<div class="dc-done"><div class="dc-big">💚</div><h2>¡No tenés palabras difíciles!</h2><p>Cuando alguna te cueste, aparece acá para repasarla.</p><button class="btn ghost" onclick="exitGame()">Volver</button></div>'; return; }
 var before=hardCount(), firstOk={}, miss={};
 /* tipos de pregunta: escuchar→dibujo, dibujo→palabra, inglés→castellano, castellano→inglés (frases sin dibujo: solo texto) */
 var Q=[]; list.forEach(function(w){ var types=w.isP||!w.e?['meaning','toEn','listenTxt']:['listen','read','meaning','toEn']; shuffle(types).slice(0,2).forEach(function(t){ Q.push({w:w,t:t}); }); });
 var A=Q.filter(function(_,i){return i%2===0;}), B=Q.filter(function(_,i){return i%2===1;}); Q=shuffle(A).concat(shuffle(B)); /* primero una vuelta por todas, después la segunda */
 var qi=0, total=Q.length;
 function intro(){ host.innerHTML='<div class="dc rv"><div class="dc-step">🔁 Estas palabras te costaron. ¡Vamos a repasarlas!</div><div class="dc-ws rv-ws">'
   +list.map(function(w,i){return '<button data-i="'+i+'"><b>'+(w.e||'💬')+'</b><span>'+w.en+'</span><small>'+w.es+'</small></button>';}).join('')
   +'</div><p class="rv-tip">Tocá cada una para escucharla 👂</p><button class="btn teal" id="rvGo">¡Empezar! →</button></div>';
  host.querySelectorAll('.rv-ws button').forEach(function(b){ b.onclick=function(){ var w=list[+b.dataset.i]; sayBoth(w.en,w.es); b.classList.add('heard'); }; });
  document.getElementById('rvGo').onclick=function(){ sTap(); next(); };
  sayBoth('Let\'s practice!','¡Vamos a repasar!'); }
 function next(){ if(!GAME.on)return; if(qi>=Q.length)return finish(); var q=Q[qi], w=q.w, opts=shuffle([w].concat(pool(w))), done=false, tries=0;
  gScore((Math.min(qi+1,total))+'/'+total);
  var ask='', grid='', txt=false;
  if(q.t==='listen'){ ask='<div class="dc-step">👂 Escuchá y tocá el dibujo</div><button class="ls-spk" id="rvS">🔊</button>'; }
  else if(q.t==='read'){ ask='<div class="dc-step">🖼️ ¿Cómo se dice en inglés?</div><div class="rv-big">'+w.e+'</div>'; txt='en'; }
  else if(q.t==='meaning'){ ask='<div class="dc-step">🤔 ¿Qué significa?</div><div class="dc-word">'+w.en+'</div><button class="ls-spk sm" id="rvS">🔊</button>'; txt='es'; }
  else if(q.t==='toEn'){ ask='<div class="dc-step">🔤 ¿Cómo se dice en inglés…?</div><div class="dc-word rv-es">'+w.es+'</div>'; txt='en'; }
  else { ask='<div class="dc-step">👂 Escuchá y tocá la frase</div><button class="ls-spk" id="rvS">🔊</button>'; txt='en'; }
  host.innerHTML='<div class="dc rv">'+ask+'<div class="'+(txt?'rv-opts':'ls-grid')+'" id="rvO"></div><div class="rv-fb" id="rvF"></div></div>';
  var O=document.getElementById('rvO');
  opts.forEach(function(o){ var b=document.createElement('button'); b.className=txt?'rv-opt':'ls-card'; b.textContent=txt==='en'?o.en:txt==='es'?o.es:o.e;
   b.onclick=function(){ if(done||b.disabled)return;
    if(o===w){ done=true; b.classList.add('ok'); sGood(); if(!tries){ markWord(w,true); } burst(tries?6:14);
     document.getElementById('rvF').innerHTML='<b>'+(w.e||'💬')+' '+w.en+'</b> = '+w.es; sayBoth(w.en,w.es);
     if(tries){ miss[w.en]=1; Q.push({w:w,t:q.t==='listen'?'read':q.t==='read'?'listen':q.t}); total++; } else if(!miss[w.en])firstOk[w.en]=(firstOk[w.en]||0)+1;
     qi++; GAME.timer=setTimeout(next,1700); }
    else { tries++; b.disabled=true; b.classList.add('no'); sBad(); if(tries===1)markWord(w,false); say(o.en); } };
   O.appendChild(b); });
  var sp=document.getElementById('rvS'); if(sp)sp.onclick=function(){ say(w.en,0.7); };
  if(q.t==='listen'||q.t==='listenTxt'||q.t==='meaning')GAME.timer=setTimeout(function(){ say(w.en,0.85); },300); }
 function finish(){ var H=S.hist||{}; list.forEach(function(w){ var x=H[w.en]; if(x&&!miss[w.en])x[0]=Math.max(x[0],x[1]+2); }); /* perfecta en el repaso: deja de ser difícil */
  var after=hardCount(), today=dkey(), first=!(S.rev&&S.rev.day===today), g=first?50:10, st=first?2:0;
  S.gems+=g; S.stars=(S.stars||0)+st; S.rev={day:today,n:((S.rev&&S.rev.day===today)?S.rev.n:0)+1}; S.revN=(S.revN||0)+1; save(); hdr();
  host.innerHTML='<div class="dc-done"><div class="dc-big">🏆</div><h2>¡Repaso terminado!</h2>'
   +'<p>'+(after<before?'Palabras difíciles: <b>'+before+' → '+after+'</b> 💪':'¡Seguí practicando y van a ser fáciles!')+'</p>'
   +'<div class="dc-ws rv-ws">'+list.map(function(w){ var ok=!miss[w.en]; return '<button onclick="sayBoth(\''+w.en.replace(/'/g,'')+'\',\''+w.es.replace(/'/g,'')+'\')"><b>'+(w.e||'💬')+'</b><span>'+w.en+'</span><small>'+(ok?'✅ ¡bien!':'🔁 a repasar')+'</small></button>'; }).join('')+'</div>'
   +'<div class="rewpill rv-prize">🎉 ¡Ganaste <b>💎 '+g+'</b>'+(st?' y <b>⭐ '+st+'</b>':'')+'!'+(first?'':'<small>El premio grande (💎 50) es una vez por día</small>')+'</div><button class="btn teal" onclick="exitGame()">¡Genial! →</button></div>';
  sWin(); burst(140); try{mgGuide('cheer','Great practice!','¡Muy buen repaso!',4000);}catch(e){} sayBoth('Great practice!','¡Muy buen repaso! ¡Ganaste '+g+' gemas!'); try{toast('💎 +'+g+' gemas');}catch(e){} }
 window.__rv=function(){ return {Q:Q,qi:qi,list:list}; };
 intro();
};
})();
