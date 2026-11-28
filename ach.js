/* 🏆 LOGROS Y MEDALLAS: se revisan solos al volver al camino y al terminar actividades.
   Cada logro da gemas una sola vez (S.ach = {id: fecha}). Se ven tocando el perfil en Juegos, el botón 🏆 del camino
   y en el panel de padres. */
(function(){
function nWords(){ var h=S.hist||{}; return Object.keys(h).filter(function(k){return h[k][0]>0;}).length; }
function nMaster(){ var h=S.hist||{}; return Object.keys(h).filter(function(k){return h[k][0]>=3&&h[k][1]===0;}).length; }
function nCups(){ var c=(S.kart&&S.kart.cup)||{}; return Object.keys(c).filter(function(k){return c[k]<=3;}).length; }
function nFriends(){ try{ return (S.home.own||[]).length+((S.home.grads||[]).length); }catch(e){ return 1; } }
var ACH=[
 {id:'w10',e:'🌱',n:'10 palabras',d:'Acertaste 10 palabras distintas',g:20,v:nWords,t:10},
 {id:'w50',e:'🌿',n:'50 palabras',d:'Acertaste 50 palabras distintas',g:40,v:nWords,t:50},
 {id:'w100',e:'🌳',n:'100 palabras',d:'Acertaste 100 palabras nuevas',g:80,v:nWords,t:100},
 {id:'w300',e:'🏞️',n:'300 palabras',d:'¡Sabés un montón de inglés!',g:150,v:nWords,t:300},
 {id:'m25',e:'🧠',n:'Memoria de oro',d:'25 palabras perfectas (3 bien y ninguna mal)',g:60,v:nMaster,t:25},
 {id:'s3',e:'🔥',n:'3 días seguidos',d:'Cumpliste la meta 3 días seguidos',g:40,v:function(){return S.streak||0;},t:3},
 {id:'s10',e:'🔥',n:'10 días seguidos',d:'Cumpliste la meta 10 días seguidos',g:120,v:function(){return S.streak||0;},t:10},
 {id:'st100',e:'⭐',n:'100 estrellas',d:'Juntaste 100 estrellas en total',g:40,v:function(){return starsTotal();},t:100},
 {id:'st500',e:'🌟',n:'500 estrellas',d:'Juntaste 500 estrellas en total',g:120,v:function(){return starsTotal();},t:500},
 {id:'w2',e:'🗺️',n:'Exploradora',d:'Llegaste al Mundo 2',g:40,v:function(){return S.world||1;},t:2},
 {id:'w5',e:'🌌',n:'Viajera galáctica',d:'Llegaste a las Galaxias (Mundo 5)',g:150,v:function(){return S.world||1;},t:5},
 {id:'egg10',e:'🥚',n:'10 huevos',d:'Encontraste 10 huevos en Dino Aventura',g:40,v:function(){return (S.dino&&S.dino.eggs)||0;},t:10},
 {id:'egg50',e:'🦖',n:'50 huevos',d:'Encontraste 50 huevos en Dino Aventura',g:120,v:function(){return (S.dino&&S.dino.eggs)||0;},t:50},
 {id:'cup3',e:'🏆',n:'Piloto de podio',d:'Subiste al podio en 3 pistas del Kart',g:60,v:nCups,t:3},
 {id:'bug1',e:'🏖️',n:'Campeona de playa',d:'Ganaste una carrera de Buggy Splash',g:40,v:function(){return (S.bug&&S.bug.wins)||0;},t:1},
 {id:'run500',e:'🦊',n:'Corredora',d:'Corriste 500 m en la Carrera Mágica',g:40,v:function(){return (S.run&&S.run.best)||0;},t:500},
 {id:'fr3',e:'🏡',n:'Familia de amigos',d:'Tenés 3 amigos en la Casa',g:50,v:nFriends,t:3},
 {id:'fr6',e:'💞',n:'Gran familia',d:'Tenés 6 amigos en la Casa',g:120,v:nFriends,t:6},
 {id:'acc10',e:'👒',n:'Fashionista',d:'Compraste 10 accesorios',g:50,v:function(){return (S.owned||[]).length;},t:10},
 {id:'stk30',e:'📒',n:'Coleccionista',d:'Juntaste 30 figuritas en el álbum',g:60,v:function(){return Object.keys(S.stk||{}).length;},t:30},
 {id:'rev5',e:'🔁',n:'Repasadora',d:'Hiciste 5 repasos de palabras difíciles',g:60,v:function(){return S.revN||0;},t:5},
 {id:'day7',e:'📅',n:'Desafiante',d:'Hiciste 7 desafíos del día',g:60,v:function(){return S.dchN||0;},t:7}
];
window.ACH=ACH;
var QUEUE=[], showing=false;
function pop(){ if(showing||!QUEUE.length)return; var a=QUEUE.shift(); showing=true;
 var ov=document.createElement('div'); ov.className='pk-ov ach-ov';
 ov.innerHTML='<div class="pk-box ach-box"><div class="ach-medal">'+a.e+'</div><small>¡Nueva medalla!</small><h2>'+a.n+'</h2><p>'+a.d+'</p><div class="rewpill">💎 +'+a.g+'</div><button class="btn teal">¡Genial!</button></div>';
 document.body.appendChild(ov); try{ sWin(); burst(120); sayBoth('New medal!','¡Nueva medalla! '+a.n); }catch(e){}
 ov.querySelector('.btn').onclick=function(){ ov.remove(); showing=false; try{sTap();}catch(e){} setTimeout(pop,250); }; }
window.checkAch=function(){ try{ var on=document.querySelector('.screen.on'); if(!on||on.id!=='s-path')return; /* solo en el camino, para no tapar juegos */ if(!S.ach)S.ach={}; var got=[];
  ACH.forEach(function(a){ if(S.ach[a.id])return; if(a.v()>=a.t){ S.ach[a.id]=dkey(); S.gems+=a.g; got.push(a); } });
  if(got.length){ save(); got.forEach(function(a){QUEUE.push(a);}); pop(); try{ var g=document.getElementById('hGems'); if(g)g.textContent=S.gems; }catch(e){} } }catch(e){} };
window.achGrid=function(){ if(!S.ach)S.ach={}; return '<div class="ach-grid">'+ACH.map(function(a){ var ok=!!S.ach[a.id], v=Math.min(a.t,a.v()), pc=Math.round(v/a.t*100);
  return '<div class="ach'+(ok?' ok':'')+'"><b>'+(ok?a.e:'🔒')+'</b><span>'+a.n+'</span><small>'+a.d+'</small>'+(ok?'<em>✓ 💎'+a.g+'</em>':'<i><u style="width:'+pc+'%"></u></i><em>'+v+'/'+a.t+' · 💎'+a.g+'</em>')+'</div>'; }).join('')+'</div>'; };
window.openAch=function(){ try{sTap();}catch(e){} var n=ACH.filter(function(a){return S.ach&&S.ach[a.id];}).length;
 var ov=document.createElement('div'); ov.className='pk-ov';
 ov.innerHTML='<div class="pk-box ach-list"><h2>🏆 Mis medallas</h2><div class="ach-cnt">'+n+' de '+ACH.length+'</div>'+achGrid()+'<button class="btn teal">Cerrar</button></div>';
 document.body.appendChild(ov); ov.querySelector('.btn').onclick=function(){ov.remove();}; ov.onclick=function(e){ if(e.target===ov)ov.remove(); }; };
setTimeout(function(){ try{checkAch();}catch(e){} },1500);
})();
