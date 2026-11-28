/* 🏆 LOGROS Y MEDALLAS: se revisan solos al volver al camino y al terminar actividades.
   Cada logro da gemas una sola vez (S.ach = {id: fecha}). Se ven tocando el perfil en Juegos, el botón 🏆 del camino
   y en el panel de padres. */
(function(){
function nWords(){ var h=S.hist||{}; return Object.keys(h).filter(function(k){return h[k][0]>0;}).length; }
function nMaster(){ var h=S.hist||{}; return Object.keys(h).filter(function(k){return h[k][0]>=3&&h[k][1]===0;}).length; }
function nCups(){ var c=(S.kart&&S.kart.cup)||{}; return Object.keys(c).filter(function(k){return c[k]<=3;}).length; }
function nFriends(){ try{ return (S.home.own||[]).length+((S.home.grads||[]).length); }catch(e){ return 1; } }
var ACH=[
 {id:'w10',e:'🌱',n:'10 palabras',d:'¡Ya sabés 10 palabras en inglés!',g:20,v:nWords,t:10},
 {id:'w50',e:'🌿',n:'50 palabras',d:'¡Ya sabés 50 palabras en inglés!',g:40,v:nWords,t:50},
 {id:'w100',e:'🌳',n:'100 palabras',d:'¡Ya sabés 100 palabras en inglés!',g:80,v:nWords,t:100},
 {id:'w300',e:'🏞️',n:'300 palabras',d:'¡Ya sabés 300 palabras! ¡Un montón de inglés!',g:150,v:nWords,t:300},
 {id:'m25',e:'🧠',n:'Memoria de oro',d:'25 palabras perfectas (3 bien y ninguna mal)',g:60,v:nMaster,t:25},
 {id:'s3',e:'🔥',n:'3 días seguidos',d:'Cumpliste la meta 3 días seguidos',g:40,v:function(){return S.streak||0;},t:3},
 {id:'s10',e:'🔥',n:'10 días seguidos',d:'Cumpliste la meta 10 días seguidos',g:120,v:function(){return S.streak||0;},t:10},
 {id:'st100',e:'⭐',n:'100 estrellas',d:'Juntaste 100 estrellas en total',g:40,v:function(){return starsTotal();},t:100},
 {id:'st500',e:'🌟',n:'500 estrellas',d:'Juntaste 500 estrellas en total',g:120,v:function(){return starsTotal();},t:500},
 {id:'w2',e:'🗺️',n:'Exploradora',d:'Llegaste al Mundo 2',g:40,v:function(){return S.world||1;},t:2},
 {id:'w5',e:'🌌',n:'Viajera galáctica',d:'Llegaste a las Galaxias (Mundo 5)',g:150,v:function(){return S.world||1;},t:5},
 {id:'rev5',e:'🔁',n:'Repasadora',d:'Hiciste 5 repasos de palabras difíciles',g:60,v:function(){return S.revN||0;},t:5},
 {id:'day7',e:'📅',n:'Desafiante',d:'Hiciste 7 desafíos del día',g:60,v:function(){return S.dchN||0;},t:7}
];
window.ACH=ACH;
var QUEUE=[], showing=false;
function pop(){ if(showing||!QUEUE.length)return; var a=QUEUE.shift(); showing=true;
 var ov=document.createElement('div'); ov.className='pk-ov ach-ov';
 ov.innerHTML='<div class="pk-box ach-box"><div class="ach-medal">'+a.e+'</div><small>¡Nueva medalla!</small><h2>'+a.n+'</h2><p class="ach-learn">'+a.d+'</p><button class="btn teal">¡Genial!</button></div>';
 document.body.appendChild(ov); try{ sWin(); burst(120); sayBoth('New medal!','¡Nueva medalla! '+a.n); }catch(e){}
 ov.querySelector('.btn').onclick=function(){ ov.remove(); showing=false; try{sTap();}catch(e){} setTimeout(pop,250); }; }

/* 📅 DESAFÍOS SEMANALES: 3 por semana (se renuevan cada lunes), elegidos de WCH según la semana. Cada uno da 💎30 una vez.
   Contadores en S.wk = {w:lunes, ok, stops, rev, chat, perf, done:{id:1}}. PARA SUMAR: agregar en WCH. */
var WCH=[
 {id:'ok40',e:'✅',n:'40 respuestas bien',k:'ok',t:40},{id:'ok80',e:'🎯',n:'80 respuestas bien',k:'ok',t:80},
 {id:'st10',e:'🗺️',n:'10 paradas del camino',k:'stops',t:10},{id:'st20',e:'🚀',n:'20 paradas del camino',k:'stops',t:20},
 {id:'rv2',e:'🔁',n:'2 repasos',k:'rev',t:2},{id:'ch3',e:'💬',n:'3 charlas con tu mascota',k:'chat',t:3},
 {id:'pf3',e:'⭐',n:'3 lecciones perfectas',k:'perf',t:3},{id:'d4',e:'📅',n:'Practicar 4 días',k:'days',t:4}
];
function wkState(){ var w=window.wkKey?wkKey():''; if(!S.wk||S.wk.w!==w)S.wk={w:w,ok:0,stops:0,rev:0,chat:0,perf:0,done:{}}; return S.wk; }
window.wkInc=function(k){ try{ var s=wkState(); s[k]=(s[k]||0)+1; }catch(e){} };
function wkList(){ var s=wkState(), seed=0; for(var i=0;i<s.w.length;i++)seed=(seed*31+s.w.charCodeAt(i))&0xffff; var r=rng(seed+7), pool=WCH.slice(), out=[];
 while(out.length<3&&pool.length){ var j=(r()*pool.length)|0, c=pool.splice(j,1)[0]; if(out.some(function(x){return x.k===c.k;}))continue; out.push(c); } return out; }
function wkVal(c){ var s=wkState(); return c.k==='days'?(window.weekDays?weekDays():0):(s[c.k]||0); }
window.wkCheck=function(){ var s=wkState(), got=null; wkList().forEach(function(c){ if(!got&&!s.done[c.id]&&wkVal(c)>=c.t){ s.done[c.id]=1; S.gems+=30; got=c; } });
 if(got){ save(); var ov=document.createElement('div'); ov.className='pk-ov ach-ov'; ov.innerHTML='<div class="pk-box ach-box"><div class="ach-medal">'+got.e+'</div><small>¡Desafío de la semana cumplido!</small><h2>'+got.n+'</h2><div class="rewpill">💎 +30</div><button class="btn teal">¡Genial!</button></div>';
  document.body.appendChild(ov); try{sWin();burst(120);sayBoth('Weekly challenge complete!','¡Desafío de la semana cumplido!');}catch(e){} ov.querySelector('.btn').onclick=function(){ov.remove();}; try{ var g=document.getElementById('hGems'); if(g)g.textContent=S.gems; }catch(e){} return true; } return false; };
window.wkHTML=function(){ var s=wkState(), d=new Date(), left=(7-((d.getDay()+6)%7)); return '<div class="wk-h">📅 Desafíos de la semana <small>se renuevan en '+left+(left===1?' día':' días')+'</small></div><div class="wk-list">'+wkList().map(function(c){ var v=Math.min(c.t,wkVal(c)), ok=!!s.done[c.id];
  return '<div class="wk'+(ok?' ok':'')+'"><b>'+c.e+'</b><div><span>'+c.n+'</span><i><u style="width:'+Math.round(v/c.t*100)+'%"></u></i></div><em>'+(ok?'✓':v+'/'+c.t)+'</em></div>'; }).join('')+'</div>'; };
window.checkAch=function(){ try{ var on=document.querySelector('.screen.on'); if(!on||on.id!=='s-path')return; /* solo en el camino, para no tapar juegos */ if(document.querySelector('.pk-ov'))return; if(window.wkCheck&&wkCheck())return; if(!S.ach)S.ach={}; var got=[];
  ACH.forEach(function(a){ if(S.ach[a.id])return; if(a.v()>=a.t){ S.ach[a.id]=dkey(); S.gems+=a.g; got.push(a); } });
  if(got.length){ save(); if(!QUEUE.length&&!showing){ QUEUE.push(got[0]); pop(); } /* una por visita: las demás ya quedan ganadas y se ven en Mis medallas */ try{ var g=document.getElementById('hGems'); if(g)g.textContent=S.gems; }catch(e){} } }catch(e){} };
window.achGrid=function(){ if(!S.ach)S.ach={}; return '<div class="ach-grid">'+ACH.map(function(a){ var ok=!!S.ach[a.id], v=Math.min(a.t,a.v()), pc=Math.round(v/a.t*100);
  return '<div class="ach'+(ok?' ok':'')+'" title="'+a.d+'"><b>'+a.e+'</b><span>'+a.n+'</span>'+(ok?'':'<i><u style="width:'+pc+'%"></u></i>')+'</div>'; }).join('')+'</div>'; };
window.openAch=function(){ try{sTap();}catch(e){} var n=ACH.filter(function(a){return S.ach&&S.ach[a.id];}).length;
 var ov=document.createElement('div'); ov.className='pk-ov';
 ov.innerHTML='<div class="pk-box ach-list"><h2>🏆 Mis medallas</h2>'+wkHTML()+'<div class="wk-h">🏆 Medallas <small>'+n+' de '+ACH.length+'</small></div>'+achGrid()+'<button class="btn teal">Cerrar</button></div>';
 document.body.appendChild(ov); ov.querySelector('.btn').onclick=function(){ov.remove();}; ov.onclick=function(e){ if(e.target===ov)ov.remove(); }; };
setTimeout(function(){ try{checkAch();}catch(e){} },1500);
})();
