/* ⚖️ BALANCE ESTUDIO-RECOMPENSA (informe del 28/11):
   1) 🎯 Meta de ahorro con barra de progreso en el inicio.
   3) 🛡️ Comodín de racha: 1 día de perdón por semana.
   4) 🗓️ Premio semanal: 5 días practicados en la semana = 💎100 una vez.
   (2: lecciones 10/15/20 💎 en index.html · 5: medallas de a una, en ach.js) */
(function(){
function wkKey(d){ d=d?new Date(d):new Date(); var day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); return dkey(d); } /* lunes de la semana */
function daysAgoKey(n){ var d=new Date(); d.setDate(d.getDate()-n); return dkey(d); }
window.wkKey=wkKey;
/* 🛡️ comodín: si faltó UN solo día y no usó el comodín esta semana, la racha sigue */
window.streakAlive=function(){ if(!S.streak)return false; if(S.lastGoal===dkey()||S.lastGoal===daysAgoKey(1))return true;
 return S.lastGoal===daysAgoKey(2)&&S.freezeWk!==wkKey(); };
window.streakNext=function(){ /* al cumplir la meta: continuar o empezar de nuevo */
 if(S.lastGoal===daysAgoKey(1))return (S.streak||0)+1;
 if(S.lastGoal===daysAgoKey(2)&&S.freezeWk!==wkKey()){ S.freezeWk=wkKey(); S.freezeUsed=dkey(); return (S.streak||0)+1; }
 return 1; };
/* 🗓️ premio semanal */
function practicedThisWeek(){ var w=wkKey(), n=0; Object.keys(S.days||{}).forEach(function(k){ if(S.days[k]>0&&wkKey(k.replace(/-/g,'/'))===w)n++; }); return n; }
window.weekCheck=function(){ var w=wkKey(), n=practicedThisWeek(); if(n>=5&&S.wkBonus!==w){ S.wkBonus=w; S.gems+=100; save();
  var ov=document.createElement('div'); ov.className='pk-ov ach-ov'; ov.innerHTML='<div class="pk-box ach-box"><div class="ach-medal">🗓️</div><small>¡Premio de la semana!</small><h2>¡5 días practicando!</h2><p>Estudiaste 5 días esta semana. ¡Eso es constancia!</p><div class="rewpill">💎 +100</div><button class="btn teal">¡Genial!</button></div>';
  document.body.appendChild(ov); try{sWin();burst(140);sayBoth('Five days this week! Great job!','¡Cinco días esta semana! ¡Muy bien!');}catch(e){} ov.querySelector('.btn').onclick=function(){ov.remove();}; return true; } return false; };
window.weekDays=practicedThisWeek;
/* 🎯 meta de ahorro */
function goals(){ var out=[]; try{ var h=hData(); FRIENDS.forEach(function(f){ if(f.p>0&&h.own.indexOf(f.id)<0)out.push({k:'f:'+f.id,n:f.n,e:f.e,p:f.p,img:'img/friend_'+f.id+'.png'}); }); }catch(e){}
 (window.CARTS||[]).forEach(function(c){ if(!c.soon&&(S.carts||[]).indexOf(c.id)<0)out.push({k:'c:'+c.id,n:c.n,e:c.e,p:c.p,img:'img/ui/cover_'+(c.id==='run'?'run':c.id)+'.webp'}); });
 return out.sort(function(a,b){return a.p-b.p;}); }
function curGoal(){ var g=goals(), k=S.saveGoal; return g.find(function(x){return x.k===k;})||null; }
window.saveGoalHTML=function(){ var g=curGoal(), all=goals(); if(!all.length)return '';
 if(!g)return '<button class="sg-card sg-empty" onclick="pickSaveGoal()">🎯 <b>Elegí para qué ahorrar</b><span>un amigo o un juego</span></button>';
 var have=S.gems||0, pc=Math.min(100,Math.round(have/g.p*100)), falta=Math.max(0,g.p-have), dias=Math.max(1,Math.ceil(falta/250));
 return '<button class="sg-card" onclick="pickSaveGoal()"><img src="'+g.img+'" alt="" onerror="this.outerHTML=\'<b class=sg-e>'+g.e+'</b>\'"><div class="sg-t"><b>🎯 Ahorrando para '+g.n+'</b><div class="sg-bar"><i style="width:'+pc+'%"></i></div><small>'+(falta?'Te faltan <b>💎 '+falta+'</b> · '+(dias<=1?'¡hoy o mañana lo tenés!':'unos '+dias+' días estudiando'):'¡Ya te alcanza! Andá a comprarlo 🎉')+'</small></div></button>'; };
window.pickSaveGoal=function(){ try{sTap();}catch(e){} var all=goals(); var ov=document.createElement('div'); ov.className='pk-ov';
 ov.innerHTML='<div class="pk-box sg-pick"><h2>🎯 ¿Para qué querés ahorrar?</h2><div class="sg-list">'+all.map(function(g){return '<button data-k="'+g.k+'"'+(S.saveGoal===g.k?' class="on"':'')+'><img src="'+g.img+'" alt=""><b>'+g.n+'</b><span>💎 '+g.p+'</span></button>';}).join('')+'</div><button class="btn ghost" id="sgX">Cerrar</button></div>';
 document.body.appendChild(ov); ov.querySelectorAll('.sg-list button').forEach(function(b){ b.onclick=function(){ S.saveGoal=b.dataset.k; save(); ov.remove(); try{sGood();}catch(e){} try{renderPath();}catch(e){} }; });
 ov.querySelector('#sgX').onclick=function(){ov.remove();}; };
})();
