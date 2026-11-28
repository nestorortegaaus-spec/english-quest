/* 🗣️ CHARLA CON TU AMIGO: el amigo compañero le hace preguntas en inglés; ella responde tocando o hablando y él le contesta.
   📅 DESAFÍO DEL DÍA: 3 palabras nuevas por día (ver, escuchar, elegir y decir) con premio. */
(function(){
/* preguntas: [inglés, castellano, nivel, respuestas [inglés, castellano, emoji, contestación del amigo en inglés, en castellano]] */
var CHATQ=[
 ['Hi! How are you?','¡Hola! ¿Cómo estás?',1,[['I am fine, thank you!','Estoy bien, ¡gracias!','😊','Great! I am happy too!','¡Genial! ¡Yo también estoy feliz!'],['I am tired.','Estoy cansada.','😴','Oh! Let\'s rest a little.','¡Oh! Descansemos un poquito.'],['I am hungry!','¡Tengo hambre!','🍕','Me too! Let\'s eat a snack!','¡Yo también! ¡Comamos algo!']]],
 ['What is your favorite color?','¿Cuál es tu color favorito?',1,[['My favorite color is pink.','Mi color favorito es el rosa.','🩷','Pink is so pretty!','¡El rosa es muy lindo!'],['My favorite color is blue.','Mi color favorito es el azul.','💙','Blue like the sky!','¡Azul como el cielo!'],['My favorite color is purple.','Mi color favorito es el violeta.','💜','Purple is magic!','¡El violeta es mágico!']]],
 ['Do you like pizza?','¿Te gusta la pizza?',1,[['Yes, I do!','¡Sí, me gusta!','🍕','Yummy! Pizza is my favorite!','¡Rico! ¡La pizza es mi favorita!'],['No, I don\'t.','No, no me gusta.','🙅','OK! What about ice cream?','¡Bueno! ¿Y el helado?']]],
 ['How old are you?','¿Cuántos años tenés?',1,[['I am nine years old.','Tengo nueve años.','9️⃣','Nine! You are so big!','¡Nueve! ¡Sos re grande!'],['I am ten years old.','Tengo diez años.','🔟','Ten! Wow!','¡Diez! ¡Guau!'],['I am eight years old.','Tengo ocho años.','8️⃣','Eight! Cool!','¡Ocho! ¡Genial!']]],
 ['Do you have a pet?','¿Tenés una mascota?',1,[['Yes, I have a dog.','Sí, tengo un perro.','🐶','Woof! I love dogs!','¡Guau! ¡Me encantan los perros!'],['Yes, I have a cat.','Sí, tengo un gato.','🐱','Meow! Cats are so soft!','¡Miau! ¡Los gatos son re suaves!'],['No, but I have you!','No, ¡pero te tengo a vos!','🦊','Aww! You are my best friend!','¡Ay! ¡Sos mi mejor amiga!']]],
 ['What is your favorite animal?','¿Cuál es tu animal favorito?',1,[['I like dolphins.','Me gustan los delfines.','🐬','Dolphins are so smart!','¡Los delfines son re inteligentes!'],['I like horses.','Me gustan los caballos.','🐴','Horses run so fast!','¡Los caballos corren re rápido!'],['I like pandas.','Me gustan los pandas.','🐼','Pandas are so cute!','¡Los pandas son re tiernos!']]],
 ['Is it sunny today?','¿Hoy está soleado?',2,[['Yes, it is sunny!','¡Sí, está soleado!','☀️','Let\'s play outside!','¡Juguemos afuera!'],['No, it is raining.','No, está lloviendo.','🌧️','Let\'s read a story inside!','¡Leamos un cuento adentro!'],['It is cloudy.','Está nublado.','☁️','Clouds look like cotton!','¡Las nubes parecen algodón!']]],
 ['What do you like to do?','¿Qué te gusta hacer?',2,[['I like to dance.','Me gusta bailar.','💃','Let\'s dance together!','¡Bailemos juntos!'],['I like to draw.','Me gusta dibujar.','🎨','Can you draw me?','¿Me dibujás?'],['I like to play games.','Me gusta jugar juegos.','🎮','Games are so fun!','¡Los juegos son re divertidos!']]],
 ['What do you eat for breakfast?','¿Qué desayunás?',2,[['I eat cereal.','Como cereales.','🥣','Crunchy!','¡Crocante!'],['I eat toast and milk.','Como tostadas y leche.','🍞','Yummy breakfast!','¡Qué rico desayuno!'],['I eat fruit.','Como fruta.','🍓','Fruit is healthy!','¡La fruta es sana!']]],
 ['Where do you live?','¿Dónde vivís?',2,[['I live in Argentina.','Vivo en Argentina.','🇦🇷','Argentina is beautiful!','¡Argentina es hermosa!'],['I live in a house.','Vivo en una casa.','🏠','I live in the Friends House!','¡Yo vivo en la Casa de Amigos!'],['I live in an apartment.','Vivo en un departamento.','🏢','Up high! Cool!','¡Bien alto! ¡Genial!']]],
 ['Can you swim?','¿Sabés nadar?',2,[['Yes, I can!','¡Sí, sé!','🏊','You are a fish!','¡Sos un pez!'],['No, I can\'t.','No, no sé.','🙈','I can teach you!','¡Yo te enseño!'],['A little bit.','Un poquito.','🤏','Practice makes perfect!','¡Practicando sale perfecto!']]],
 ['What is your favorite food?','¿Cuál es tu comida favorita?',2,[['I love empanadas.','Me encantan las empanadas.','🥟','Empanadas are delicious!','¡Las empanadas son deliciosas!'],['I love pasta.','Me encanta la pasta.','🍝','Spaghetti! Yum!','¡Fideos! ¡Rico!'],['I love ice cream.','Me encanta el helado.','🍦','Chocolate or strawberry?','¿Chocolate o frutilla?']]],
 ['How do you feel today?','¿Cómo te sentís hoy?',3,[['I feel happy.','Me siento feliz.','😄','Yay! Happy day!','¡Bien! ¡Día feliz!'],['I feel a little sad.','Me siento un poco triste.','😢','Here is a big hug for you!','¡Acá tenés un abrazo grande!'],['I feel excited!','¡Me siento emocionada!','🤩','Something fun is coming!','¡Algo divertido se viene!']]],
 ['Who is your best friend?','¿Quién es tu mejor amiga?',3,[['My best friend is my sister.','Mi mejor amiga es mi hermana.','👭','Sisters are the best!','¡Las hermanas son lo mejor!'],['My best friend is at school.','Mi mejor amiga está en la escuela.','🏫','Say hello to her!','¡Saludala de mi parte!'],['You are my best friend!','¡Vos sos mi mejor amigo!','💖','And you are mine!','¡Y vos la mía!']]],
 ['What do you want to be when you grow up?','¿Qué querés ser cuando seas grande?',3,[['I want to be a vet.','Quiero ser veterinaria.','🐾','You will help many animals!','¡Vas a ayudar a muchos animales!'],['I want to be an artist.','Quiero ser artista.','🎨','Your art will be amazing!','¡Tu arte va a ser increíble!'],['I want to be a teacher.','Quiero ser maestra.','👩‍🏫','You can teach me English!','¡Me podés enseñar inglés!']]],
 ['What did you do yesterday?','¿Qué hiciste ayer?',3,[['I played with my friends.','Jugué con mis amigas.','⚽','That sounds fun!','¡Qué divertido!'],['I went to school.','Fui a la escuela.','🏫','Did you learn something new?','¿Aprendiste algo nuevo?'],['I watched a movie.','Miré una película.','🎬','I love movies!','¡Me encantan las películas!']]],
 ['Do you like summer or winter?','¿Te gusta el verano o el invierno?',3,[['I like summer.','Me gusta el verano.','🏖️','Beach time!','¡A la playa!'],['I like winter.','Me gusta el invierno.','⛄','Snowmen are so cute!','¡Los muñecos de nieve son re tiernos!']]],
 ['What is your favorite game here?','¿Cuál es tu juego favorito acá?',3,[['I love the kart race!','¡Me encanta la carrera de karts!','🏎️','Vroom vroom!','¡Brum brum!'],['I love the magic run!','¡Me encanta la carrera mágica!','🦊','Run, run, run!','¡Corré, corré!'],['I love taking care of you!','¡Me encanta cuidarte!','🏡','Thank you! I love you!','¡Gracias! ¡Te quiero!']]]
];
function petBox(id){ var p=S.home&&S.home.pets&&S.home.pets[id], key=petKey(id);
 var img=key?'<img id="chImg" src="'+buddyImg('idle')+'" alt="">':'<img id="chImg" src="'+(id==='fox'?IMG.fox:'img/friend_'+id+'.png')+'" alt="">';
 return dressWrap(key||'gen',img,wearOf(id)); }
/* 📊 registro para el panel de padres: S.chatSt={n,said,tap,last,days:{fecha:charlas}} */
function chatLog(k){ try{ var c=S.chatSt||(S.chatSt={n:0,said:0,tap:0,last:'',days:{}}); if(k==='done'){ c.n++; c.last=dkey(); c.lastT=Date.now(); if(window.wkInc)wkInc('chat'); c.days[dkey()]=(c.days[dkey()]||0)+1; var ks=Object.keys(c.days).sort(); while(ks.length>60)delete c.days[ks.shift()]; } else c[k]=(c[k]||0)+1; save(); }catch(e){} }
/* ✨ RESPUESTA LIBRE: además de las opciones, puede decir con el micrófono su propia respuesta. Se acepta si es una frase
   en inglés bien dicha: si las opciones empiezan igual ("My favorite color is…"), tiene que empezar así y agregar algo; si no,
   tiene que ser una frase de 2 palabras o más con palabras básicas del inglés (I, my, it, yes, like…). */
function cl(t){ return String(t||'').toLowerCase().replace(/[?.!,'’"]/g,'').replace(/\s+/g,' ').trim(); }
function frameOf(opts){ var ws=opts.map(function(o){return cl(o[0]).split(' ');}), f=[]; for(var i=0;i<ws[0].length;i++){ var x=ws[0][i]; if(ws.every(function(w){return w[i]===x;}))f.push(x); else break; } return f; }
function near(words,x){ var tol=x.length<=3?0:x.length<=5?1:2; return words.some(function(y){ return y===x||(tol&&lev(y,x)<=tol); }); }
function matchOpt(alts,opts,frame){ for(var a=0;a<alts.length;a++){ var h=cl(alts[a]), w=h.split(' ');
  for(var i=0;i<opts.length;i++){ var tg=cl(opts[i][0]); if(h.indexOf(tg)>=0)return i;
   var dw=tg.split(' ').filter(function(x){return frame.indexOf(x)<0&&x.length>1;}); if(dw.length&&dw.every(function(x){return near(w,x);})&&sim(h,tg))return i; } } return -1; }
var FUNC=['i','im','my','me','it','its','yes','no','am','is','are','was','like','love','want','have','has','can','the','a','an','we','you','because','to','do','dont','play','go','went','be','and','but','with','in','at','she','he','they','our','your','this','that','very','so','too','not','did','will','would','favorite'];
function freeOK(alts,frame){ for(var a=0;a<alts.length;a++){ var h=cl(alts[a]), w=h.split(' ').filter(Boolean); if(w.length<2||w.length>16)continue;
  if(frame.length>=2){ var hit=frame.filter(function(x,k){ return w[k]===x||near(w.slice(0,frame.length+1),x); }).length; if(hit/frame.length>=0.75&&w.length>frame.length)return h; }
  else if(w.filter(function(x){return FUNC.indexOf(x)>=0;}).length>=1)return h; } return null; }
var FREE_R=[['Wow, I love your answer!','¡Guau, me encanta tu respuesta!'],['Cool! Thank you for telling me!','¡Genial! ¡Gracias por contarme!'],['That is so interesting!','¡Qué interesante!'],['Great answer! You speak very well!','¡Muy buena respuesta! ¡Hablás muy bien!'],['Really? How nice!','¿En serio? ¡Qué lindo!'],['I did not know that! Tell me more next time!','¡No lo sabía! ¡La próxima contame más!']];
window.chatFreeReply=function(){ return FREE_R[(Math.random()*FREE_R.length)|0]; };
window.chatFreeBtn=function(opts){ if(!window.SR)return ''; var f=frameOf(opts), st=f.length>=2?opts[0][0].split(' ').slice(0,f.length).join(' ')+'…':'';
 return '<button class="ch-opt ch-free" type="button"><i>✨</i><span><b>Otra respuesta</b><small>Decí la tuya con el micrófono 🎤'+(st?' · Empezá con: "'+st+'"':'')+'</small></span></button>'; };
/* escucha libre: onPick(índice de opción) si dijo una de las opciones; onFree(texto) si dijo su propia respuesta bien dicha */
window.chatMic=function(wid,opts,onPick,onFree){ var frame=frameOf(opts);
 micListen(wid,null,null,function(heard,why,all){ if(why||heard==null)return; var alts=(all&&all.length?all:[heard]);
  var i=matchOpt(alts,opts,frame); if(i>=0){ micSet(wid,'ok','Dijiste "'+opts[i][0]+'"'); onPick(i); return; }
  var fr=freeOK(alts,frame); if(fr){ micSet(wid,'ok','¡Respuesta propia! "'+fr+'"'); onFree(fr.charAt(0).toUpperCase()+fr.slice(1)); return; }
  micSet(wid,'retry',heard?'Escuché "'+heard+'". Decí una frase completa en inglés'+(frame.length>=2?' (empezá con "'+opts[0][0].split(' ').slice(0,frame.length).join(' ')+'…")':'')+' y tocá 🎤':'No te escuché. Tocá 🎤 y hablá fuerte'); }); };
window.CHATQ=CHATQ; window.chatLog=chatLog;
window.startChat=function(u,lv){
 lv=lv||1; var id=buddyId(), f=friendById(id)||{n:'Zorrito'}, host=gSetup('🗣️ Charla con '+f.n+' · Nivel '+lv); GAME.quiet=true;
 var pool=CHATQ.filter(function(q){return q[2]<=Math.min(3,lv);}); if(S.chatI==null)S.chatI=0;
 var R=Math.min(6,pool.length), list=[]; for(var i=0;i<R;i++)list.push(pool[(S.chatI+i*3)%pool.length]); S.chatI+=2; save();
 var logged=false, r=0, said=0, flapT=0, nm=(S.name||'').split(' ')[0]||'friend';
 host.innerHTML='<div class="g2 ch"><div class="ch-top"><div class="ch-pet" id="chPet">'+petBox(id)+'</div><div class="ch-bub" id="chBub"></div></div><div class="ch-ans" id="chAns"></div></div>';
 function flap(on,ms){ clearInterval(flapT); var im=document.getElementById('chImg'); if(!im||!petKey(id))return; if(!on){im.src=buddyImg('idle');return;} var o=0; flapT=setInterval(function(){ var i2=document.getElementById('chImg'); if(!i2||!GAME.on){clearInterval(flapT);return;} o^=1; i2.src=buddyImg(o?'open':'idle'); },150); setTimeout(function(){flap(false);},ms||1800); }
 function talk(en,es,happy){ var b=document.getElementById('chBub'); b.innerHTML='<b>'+en+'</b><small>'+es+'</small>'; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); flap(true,900+en.length*55);
  var pe=document.getElementById('chPet'); if(happy&&pe){ pe.classList.remove('hap'); void pe.offsetWidth; pe.classList.add('hap'); var im=document.getElementById('chImg'); if(im&&petKey(id))setTimeout(function(){ im.src=buddyImg('happy'); },60); }
  sayBoth(en,es); }
 function ask(){ if(!GAME.on)return;
  if(r>=R){ talk('Thank you for talking with me, '+nm+'!','¡Gracias por charlar conmigo!',true); GAME.timer=setTimeout(function(){ finishGameNode('🗣️ ¡Qué linda charla!','Charlaste en inglés con '+f.n+' ('+said+' respuestas dichas en voz alta) 💬'); },3200); return; }
  var q=list[r]; gScore((r+1)+'/'+R); talk(q[0],q[1]);
  var A=document.getElementById('chAns'), opts=shuffle(q[3].slice());
  A.innerHTML='<div class="ch-hint">Tocá tu respuesta o decila con el micrófono 🎤</div>'+opts.map(function(o,i){return '<button class="ch-opt" data-i="'+i+'"><i>'+o[2]+'</i><span><b>'+o[0]+'</b><small>'+o[1]+'</small></span><em class="ch-spk" data-s="'+i+'">🔊</em></button>';}).join('')+chatFreeBtn(opts)+(window.SR?micWidgetHTML('chMic'):'');
  A.querySelectorAll('.ch-spk').forEach(function(sp){ sp.onclick=function(e){ e.stopPropagation(); say(opts[+sp.dataset.s][0],0.8); }; });
  A.querySelectorAll('.ch-opt').forEach(function(b){ b.onclick=function(){ answer(opts[+b.dataset.i],b,false); }; });
  var mb=document.querySelector('#chMic .mic-b'); if(mb)mb.onclick=function(){ chatMic('chMic',opts,function(i){ answer(opts[i],A.querySelector('.ch-opt[data-i="'+i+'"]'),true); },function(txt){ answerFree(txt); }); };
  var fb=A.querySelector('.ch-free'); if(fb)fb.onclick=function(){ fb.classList.add('on'); var mw=document.getElementById('chMic'); if(mw)mw.scrollIntoView({block:'center',behavior:'smooth'}); if(mb)mb.click(); }; }
 function answerFree(txt){ if(!GAME.on)return; var A=document.getElementById('chAns'), fb=A.querySelector('.ch-free');
  A.querySelectorAll('.ch-opt').forEach(function(x){ x.disabled=true; x.classList.toggle('pick',x===fb); x.classList.toggle('dim',x!==fb); });
  if(fb)fb.innerHTML='<i>🗣️</i><span><b>"'+txt+'"</b><small>¡Tu propia respuesta!</small></span>';
  if(!logged){ logged=true; chatLog('done'); } chatLog('said'); chatLog('free'); said++; burst(40); sGood();
  var rp=chatFreeReply(); GAME.timer=setTimeout(function(){ talk(rp[0],rp[1],true); r++; GAME.timer=setTimeout(ask,1500+rp[0].length*60); },700); }
 function answer(o,b,spoken){ if(!GAME.on)return; try{micStop();}catch(e){} var A=document.getElementById('chAns'); A.querySelectorAll('.ch-opt').forEach(function(x){ x.disabled=true; x.classList.toggle('pick',x===b); x.classList.toggle('dim',x!==b); });
  if(!logged){ logged=true; chatLog('done'); } /* cuenta como charla apenas responde la primera */ chatLog(spoken?'said':'tap'); if(spoken){ said++; burst(30); sGood(); } else { tone(700,.06,'triangle',.12,0); say(o[0],0.85); }
  markWord({en:o[0],es:o[1],e:o[2]},true);
  GAME.timer=setTimeout(function(){ talk(o[3],o[4],true); r++; GAME.timer=setTimeout(ask,1500+o[3].length*60); },spoken?600:1400+o[0].length*55); }
 GAME.timer=setTimeout(function(){ talk('Hi, '+nm+'! Let\'s talk in English!','¡Hola! ¡Charlemos en inglés!',true); GAME.timer=setTimeout(ask,3300); },400);
};

/* 📅 DESAFÍO DEL DÍA */
function dayWords(){ var k=dkey(), seed=0; for(var i=0;i<k.length;i++)seed=seed*31+k.charCodeAt(i)&0xfffffff; var r=rng(seed), h=S.hist||{}, all=[];
 UNITS.forEach(function(U,ui){ if(U.isP)return; var maxLv=Math.min(5,(S.world||1)); if(U.lv&&U.lv>maxLv)return; U.w.forEach(function(w){ if(w.e&&/^[a-z ]+$/i.test(w.en)&&w.en.split(' ').length<=2&&!h[w.en])all.push(w); }); });
 if(all.length<3)UNITS.slice(0,10).forEach(function(U){U.w.forEach(function(w){all.push(w);});});
 all.sort(function(){return r()-0.5;}); return all.slice(0,3); }
window.dchState=function(){ if(!S.dch||S.dch.day!==dkey())S.dch={day:dkey(),done:0}; return S.dch; };
window.openDaily=function(){ var st=dchState(), ws=dayWords(), host=gSetup('📅 Desafío del día'); GAME.quiet=false;
 if(st.done){ host.innerHTML='<div class="dc-done"><div class="dc-big">✅</div><h2>¡Ya hiciste el desafío de hoy!</h2><p>Mañana hay 3 palabras nuevas 🌅</p><div class="dc-ws">'+ws.map(function(w){return '<button onclick="sayBoth(\''+w.en.replace(/'/g,'')+'\',\''+w.es.replace(/'/g,'')+'\')"><b>'+w.e+'</b><span>'+w.en+'</span><small>'+w.es+'</small></button>';}).join('')+'</div><button class="btn ghost" onclick="exitGame()">Volver</button></div>'; return; }
 var steps=[]; ws.forEach(function(w){ steps.push(['learn',w]); }); ws.forEach(function(w){ steps.push(['pick',w]); }); if(window.SR)ws.forEach(function(w){ steps.push(['say',w]); });
 var i=0, first=0;
 function next(){ if(!GAME.on)return; if(i>=steps.length){ st.done=1; S.dchN=(S.dchN||0)+1; S.gems+=25; S.stars=(S.stars||0)+3; S.dstreak=(S.dlast===yesterdayKey()?(S.dstreak||0)+1:1); S.dlast=dkey(); save(); hdr();
   host.innerHTML='<div class="dc-done"><div class="dc-big">🏆</div><h2>¡Desafío completo!</h2><p>Aprendiste 3 palabras nuevas</p><div class="dc-ws">'+ws.map(function(w){return '<button><b>'+w.e+'</b><span>'+w.en+'</span><small>'+w.es+'</small></button>';}).join('')+'</div><div class="rewpill">💎 +25 · ⭐ +3'+(S.dstreak>1?' · 🔥 '+S.dstreak+' días seguidos':'')+'</div><button class="btn teal" onclick="exitGame()">¡Genial! →</button></div>';
   sWin(); burst(160); sayBoth('Great job! See you tomorrow!','¡Muy bien! ¡Nos vemos mañana!'); return; }
  var s=steps[i], w=s[1]; gScore((i+1)+'/'+steps.length);
  if(s[0]==='learn'){ host.innerHTML='<div class="dc"><div class="dc-step">✨ Palabra nueva '+(i+1)+' de 3</div><div class="dc-card"><b>'+w.e+'</b><span>'+w.en+'</span><small>'+w.es+'</small></div><button class="ls-spk" id="dcS">🔊</button><button class="btn teal" id="dcN">¡La aprendí! →</button></div>';
   sayBoth(w.en,w.es); document.getElementById('dcS').onclick=function(){say(w.en,0.7);}; document.getElementById('dcN').onclick=function(){sTap();i++;next();}; return; }
  if(s[0]==='pick'){ var others=shuffle(UNITS[0].w.concat(UNITS[1].w).filter(function(x){return x.e!==w.e&&ws.indexOf(x)<0;})).slice(0,1).concat(ws.filter(function(x){return x!==w;})), opts=shuffle([w].concat(others)).slice(0,4); if(opts.indexOf(w)<0)opts[0]=w;
   host.innerHTML='<div class="dc"><div class="dc-step">👂 ¿Cuál es? Escuchá y tocá</div><button class="ls-spk" id="dcS">🔊</button><div class="dc-word">'+w.en+'</div><div class="ls-grid" id="dcO"></div></div>';
   var O=document.getElementById('dcO'); shuffle(opts).forEach(function(o){ var b=document.createElement('button'); b.className='ls-card'; b.textContent=o.e; b.onclick=function(){ if(o===w){ b.classList.add('ok'); sGood(); markWord(w,true); first++; say(w.en); i++; GAME.timer=setTimeout(next,1100); } else { b.classList.add('no'); sBad(); markWord(w,false); } }; O.appendChild(b); });
   say(w.en); document.getElementById('dcS').onclick=function(){say(w.en,0.7);}; return; }
  if(s[0]==='say'){ host.innerHTML='<div class="dc"><div class="dc-step">🗣️ Ahora decila vos</div><div class="dc-card"><b>'+w.e+'</b><span>'+w.en+'</span><small>'+w.es+'</small></div>'+micWidgetHTML('dcMic')+'<button class="sk-skip" id="dcK" style="visibility:hidden">Ya lo dije ✓</button></div>';
   say(w.en); var tries=0; document.getElementById('dcK').onclick=function(){ i++; next(); };
   document.querySelector('#dcMic .mic-b').onclick=function(){ micListen('dcMic',w.en,function(){ sGood(); burst(20); i++; GAME.timer=setTimeout(next,900); },function(){ tries++; document.getElementById('dcK').style.visibility='visible'; }); }; } }
 next(); };
function hdr(){ try{ var b=document.getElementById('hDay'); if(b){ var st=dchState(); b.classList.toggle('done',!!st.done); b.querySelector('b').textContent=st.done?'Desafío ✓':'Desafío del día'; } }catch(e){} }
window.dailyHdr=hdr;
})();
