/* 👾 ARMÁ EL MONSTRUO: sigue instrucciones en inglés ("It has three eyes", "The body is green") y arma un monstruo dibujado en SVG.
   💬 PREGUNTA Y RESPUESTA: el zorrito pregunta ("How old are you?") y ella elige la respuesta correcta.
   🎱 BINGO: escucha palabras y las marca en su cartón (3x3, o 4x4 desde nivel 3). ¡Línea = BINGO!
   Usan el sistema de minijuegos (gSetup) y terminan con finishGameNode. PARA SUMAR: preguntas en QA, colores en MCOL. */
(function(){
var NUM=['zero','one','two','three','four','five','six'], NUMES=['cero','uno','dos','tres','cuatro','cinco','seis'];
var MCOL=[['green','verde','#5CCB5F'],['blue','azul','#4A9BF0'],['red','rojo','#F25C54'],['yellow','amarillo','#FFD23F'],['purple','violeta','#9B6BE8'],['pink','rosa','#FF7AB8'],['orange','naranja','#FF9A3C']];
function col(n){ return MCOL.find(function(c){return c[0]===n;})||MCOL[0]; }
function monsterSVG(m){
 var b=col(m.body)[2], nose=col(m.nose)[2], s='<svg viewBox="0 0 200 210" class="mo-svg">';
 for(var i=0;i<m.legs;i++){ var x=100+(i-(m.legs-1)/2)*(90/Math.max(1,m.legs-1)); s+='<rect x="'+(x-9)+'" y="150" width="18" height="40" rx="9" fill="'+b+'" stroke="#2A2A40" stroke-width="3"/><ellipse cx="'+x+'" cy="192" rx="15" ry="8" fill="#2A2A40"/>'; }
 for(var a=0;a<m.arms;a++){ var side=a%2?1:-1, row=Math.floor(a/2), y=100+row*28; s+='<path d="M'+(100+side*58)+' '+y+' Q'+(100+side*90)+' '+(y-14)+' '+(100+side*92)+' '+(y-34)+'" stroke="'+b+'" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M'+(100+side*58)+' '+y+' Q'+(100+side*90)+' '+(y-14)+' '+(100+side*92)+' '+(y-34)+'" stroke="#2A2A40" stroke-width="3" fill="none" stroke-linecap="round" opacity=".35"/>'; }
 for(var h=0;h<m.horns;h++){ var hx=100+(h-(m.horns-1)/2)*34; s+='<path d="M'+(hx-9)+' 52 L'+hx+' 18 L'+(hx+9)+' 52 Z" fill="#FFF3C4" stroke="#2A2A40" stroke-width="3" stroke-linejoin="round"/>'; }
 s+='<ellipse cx="100" cy="105" rx="62" ry="60" fill="'+b+'" stroke="#2A2A40" stroke-width="4"/><ellipse cx="82" cy="78" rx="18" ry="10" fill="#fff" opacity=".35"/>';
 var ew=m.eyes>3?20:24; for(var e=0;e<m.eyes;e++){ var ex=100+(e-(m.eyes-1)/2)*(m.eyes>3?24:30), ey=m.eyes>3&&e%2?72:84; s+='<circle cx="'+ex+'" cy="'+ey+'" r="'+(ew/2)+'" fill="#fff" stroke="#2A2A40" stroke-width="3"/><circle cx="'+(ex+2)+'" cy="'+(ey+2)+'" r="'+(ew/4.5)+'" fill="#2A2A40"/>'; }
 s+='<circle cx="100" cy="112" r="9" fill="'+nose+'" stroke="#2A2A40" stroke-width="3"/>';
 if(m.mouth==='sad')s+='<path d="M78 146 Q100 128 122 146" stroke="#2A2A40" stroke-width="4" fill="none" stroke-linecap="round"/>';
 else if(m.mouth==='teeth')s+='<path d="M74 130 Q100 158 126 130 Z" fill="#7A2238" stroke="#2A2A40" stroke-width="3"/><path d="M84 132 l5 9 l5-8 l6 9 l5-9 l6 9 l5-9" fill="#fff" stroke="#2A2A40" stroke-width="1.5"/>';
 else s+='<path d="M76 132 Q100 156 124 132" stroke="#2A2A40" stroke-width="4" fill="none" stroke-linecap="round"/>';
 return s+'</svg>'; }
window.startBuildMonster=function(u,lv){
 lv=lv||1; var host=gSetup('👾 Mi monstruo · Nivel '+lv);
 var R=lv>=3?3:2, r=0, first=0, total=0;
 function plan(){ var c=shuffle(MCOL.slice()), m={body:c[0][0],nose:c[1][0],eyes:1+((Math.random()*(lv>=2?5:3))|0),legs:2+((Math.random()*(lv>=2?4:2))|0),horns:(Math.random()*3)|0,arms:2+2*((Math.random()*2)|0),mouth:pickR(['happy','sad','teeth'])};
  var steps=[{k:'body',en:'The body is '+m.body+'.',es:'El cuerpo es '+col(m.body)[1]+'.'},{k:'eyes',en:'It has '+NUM[m.eyes]+' eye'+(m.eyes>1?'s':'')+'.',es:'Tiene '+NUMES[m.eyes]+(m.eyes>1?' ojos.':' ojo.')},{k:'legs',en:'It has '+NUM[m.legs]+' legs.',es:'Tiene '+NUMES[m.legs]+' patas.'}];
  if(lv>=2)steps.push({k:'nose',en:'The nose is '+m.nose+'.',es:'La nariz es '+col(m.nose)[1]+'.'},{k:'horns',en:m.horns?'It has '+NUM[m.horns]+' horn'+(m.horns>1?'s':'')+'.':'It has no horns.',es:m.horns?'Tiene '+NUMES[m.horns]+(m.horns>1?' cuernos.':' cuerno.'):'No tiene cuernos.'});
  if(lv>=3)steps.push({k:'arms',en:'It has '+NUM[m.arms]+' arms.',es:'Tiene '+NUMES[m.arms]+' brazos.'},{k:'mouth',en:m.mouth==='sad'?'It is sad.':m.mouth==='teeth'?'It has big teeth.':'It is happy.',es:m.mouth==='sad'?'Está triste.':m.mouth==='teeth'?'Tiene dientes grandes.':'Está contento.'});
  return {m:m,steps:steps}; }
 function opts(k,m){
  if(k==='body'||k==='nose')return shuffle(MCOL.slice()).filter(function(c){return c[0]!==m[k];}).slice(0,lv>=3?3:2).concat([col(m[k])]).map(function(c){return {v:c[0],h:'<i class="mo-sw" style="background:'+c[2]+'"></i><span>'+c[0]+'</span>'};});
  if(k==='mouth')return [{v:'happy',h:'<b>😊</b><span>happy</span>'},{v:'sad',h:'<b>😢</b><span>sad</span>'},{v:'teeth',h:'<b>😬</b><span>big teeth</span>'}];
  var lo=k==='legs'?2:k==='arms'?2:k==='horns'?0:1, hi=k==='legs'?6:k==='arms'?4:k==='horns'?3:5, out=[];
  for(var n=lo;n<=hi;n+=(k==='arms'?2:1))out.push(n); out=shuffle(out.filter(function(n){return n!==m[k];})).slice(0,lv>=3?3:2).concat([m[k]]);
  return out.sort(function(a,b){return a-b;}).map(function(n){return {v:n,h:'<b>'+n+'</b><span>'+NUM[n]+'</span>'};}); }
 function round(){ if(!GAME.on)return;
  if(r>=R){ finishGameNode('👾 ¡Qué monstruos geniales!','Armaste '+R+' monstruos siguiendo '+total+' instrucciones ('+first+' a la primera) 🎨'); return; }
  var P=plan(), cur={body:'green',nose:'pink',eyes:0,legs:0,horns:0,arms:0,mouth:'happy'}, si=0; cur.body='grey';
  function step(){ if(!GAME.on)return;
   if(si>=P.steps.length){ sGood(); burst(24); sayBoth('Look at your monster! It is great!','¡Mirá tu monstruo! ¡Es genial!'); r++; gScore(r+'/'+R); GAME.timer=setTimeout(round,3200); return; }
   var st=P.steps[si], O=opts(st.k,P.m), tries=0;
   host.innerHTML='<div class="g2 mo"><div class="g2-sub">👂 Escuchá y armá el monstruo</div><div class="mo-stage">'+monsterSVG(Object.assign({},cur,{body:cur.body==='grey'?'green':cur.body}))+'</div>'
    +'<div class="mo-ins"><button class="ls-spk sm" id="moSay">🔊</button><div><b>'+st.en+'</b>'+(lv<3?'<small>'+st.es+'</small>':'')+'</div></div>'
    +'<div class="mo-opts">'+O.map(function(o,i){return '<button class="ls-card mo-o" data-i="'+i+'">'+o.h+'</button>';}).join('')+'</div></div>';
   if(cur.body==='grey')host.querySelector('.mo-svg ellipse').setAttribute('fill','#D9DEE8');
   document.getElementById('moSay').onclick=function(){ say(st.en,0.8); }; say(st.en,0.85);
   host.querySelectorAll('.mo-o').forEach(function(b){ b.onclick=function(){ if(!GAME.on||b.disabled)return; var o=O[+b.dataset.i];
    if(o.v===P.m[st.k]){ b.classList.add('ok'); host.querySelectorAll('.mo-o').forEach(function(x){x.disabled=true;}); cur[st.k]=o.v; total++; if(!tries)first++;
     var w=typeof o.v==='number'?{en:NUM[o.v],es:NUMES[o.v],e:String(o.v)}:(st.k==='body'||st.k==='nose')?{en:o.v,es:col(o.v)[1],e:'🎨'}:null; if(w)markWord(w,!tries);
     tone(600,.08,'triangle',.15,0); burst(8); si++; GAME.timer=setTimeout(step,900); }
    else { tries++; b.disabled=true; b.classList.add('no'); sBad(); say(st.en,0.75); } }; }); }
  step(); }
 gScore('0/'+R); round();
};

var QA=[ /* [nivel, pregunta, pregunta es, respuesta, respuesta es, incorrectas...] {n} = su nombre */
 [1,'What is your name?','¿Cómo te llamás?','My name is {n}.','Me llamo {n}.','I am fine.','It is blue.','Yes, I do.'],
 [1,'How are you?','¿Cómo estás?','I am fine, thank you!','¡Estoy bien, gracias!','I am nine.','It is a cat.','Good night.'],
 [1,'What color is the sun?','¿De qué color es el sol?','It is yellow.','Es amarillo.','It is a dog.','I am happy.','Yes, please.'],
 [1,'Do you like ice cream?','¿Te gusta el helado?','Yes, I do!','¡Sí, me gusta!','I am a girl.','It is Monday.','Three apples.'],
 [1,'What is this? 🐶','¿Qué es esto? 🐶','It is a dog.','Es un perro.','It is red.','I am fine.','Good morning.'],
 [1,'How many legs does a cat have?','¿Cuántas patas tiene un gato?','Four legs.','Cuatro patas.','Two eyes.','It is big.','I like cats.'],
 [2,'How old are you?','¿Cuántos años tenés?','I am nine years old.','Tengo nueve años.','I am fine.','It is sunny.','My name is Lucy.'],
 [2,'What is your favorite animal?','¿Cuál es tu animal favorito?','My favorite animal is the cat.','Mi animal favorito es el gato.','I have two hands.','It is cold.','Yes, it is.'],
 [2,'Where do you live?','¿Dónde vivís?','I live in Argentina.','Vivo en Argentina.','I live in a banana.','I am seven.','It is a pencil.'],
 [2,'What is the weather like?','¿Cómo está el tiempo?','It is sunny.','Está soleado.','It is a hat.','I am sunny.','I like pizza.'],
 [2,'Can you swim?','¿Sabés nadar?','Yes, I can.','Sí, sé.','Yes, I am.','It is a fish.','Blue and green.'],
 [2,'What day is today?','¿Qué día es hoy?','Today is Monday.','Hoy es lunes.','Today is red.','I am Monday.','It is a dog.'],
 [2,'Do you have a pet?','¿Tenés una mascota?','Yes, I have a dog.','Sí, tengo un perro.','Yes, I am a dog.','No, it is blue.','I am nine.'],
 [3,'What time is it?','¿Qué hora es?','It is three o\'clock.','Son las tres.','It is three apples.','I am three.','It is Tuesday.'],
 [3,'What do you want to eat?','¿Qué querés comer?','I want a sandwich, please.','Quiero un sándwich, por favor.','I want to sleep.','I am hungry yesterday.','It is a sandwich.'],
 [3,'Who is your best friend?','¿Quién es tu mejor amiga?','My best friend is Sofi.','Mi mejor amiga es Sofi.','My friend is a table.','It is my best.','Yes, she is.'],
 [3,'Where is the cat?','¿Dónde está el gato?','It is under the table.','Está debajo de la mesa.','It is a table.','The cat is happy.','Yes, it is.'],
 [3,'What do you do after school?','¿Qué hacés después de la escuela?','I play with my friends.','Juego con mis amigos.','I am the school.','It is after.','I go to school.'],
 [3,'Why are you happy?','¿Por qué estás contenta?','Because it is my birthday!','¡Porque es mi cumpleaños!','Because it is a cat.','Yes, I am happy.','I am happy.'],
 [4,'What did you do yesterday?','¿Qué hiciste ayer?','I went to the park.','Fui a la plaza.','I go to the park tomorrow.','I am going yesterday.','Yes, I did.'],
 [4,'What will you do tomorrow?','¿Qué vas a hacer mañana?','I will visit my grandma.','Voy a visitar a mi abuela.','I visited my grandma yesterday.','I am grandma.','Yes, I will.'],
 [4,'How do you go to school?','¿Cómo vas a la escuela?','I go by bus.','Voy en colectivo.','I go to the bus.','It is a school bus.','I like buses.'],
 [4,'What is your favorite subject?','¿Cuál es tu materia favorita?','My favorite subject is art.','Mi materia favorita es plástica.','My favorite is a subject.','I am art.','It is a book.'],
 [4,'Can I borrow your pencil?','¿Me prestás tu lápiz?','Sure! Here you are.','¡Claro! Acá tenés.','Yes, I am a pencil.','It is my pencil yesterday.','No, it is blue.'],
 [5,'What would you do if you were a bird?','¿Qué harías si fueras un pájaro?','I would fly over the sea.','Volaría sobre el mar.','I am a bird.','I flew yesterday.','Birds are blue.'],
 [5,'Have you ever been to the beach?','¿Alguna vez fuiste a la playa?','Yes, I have. It was fun!','Sí. ¡Fue divertido!','Yes, I am at the beach.','I will be the beach.','No, it is sunny.'],
 [5,'Which is bigger, a cat or an elephant?','¿Qué es más grande, un gato o un elefante?','An elephant is bigger.','El elefante es más grande.','A cat is the biggest elephant.','Yes, it is bigger.','I like elephants.'],
 [5,'What do you want to be when you grow up?','¿Qué querés ser cuando seas grande?','I want to be a vet.','Quiero ser veterinaria.','I am grown up.','I wanted a vet yesterday.','Yes, I want.']
];
window.QA=QA;
window.startQA=function(u,lv){
 lv=lv||1; var host=gSetup('💬 Preguntas · Nivel '+lv);
 var nm=(S.name||'').trim()||'Sol', L=Math.min(5,lv), pool=shuffle(QA.filter(function(q){return q[0]<=L&&q[0]>=L-1;})); if(pool.length<5)pool=shuffle(QA.filter(function(q){return q[0]<=L;}));
 var R=Math.min(pool.length,5+Math.min(lv,3)), r=0, first=0;
 function round(){ if(!GAME.on)return;
  if(r>=R){ finishGameNode('💬 ¡Qué buena charla!','Respondiste '+R+' preguntas ('+first+' a la primera) 🗣️'); return; }
  var q=pool[r], ans=q[3].replace('{n}',nm), opts=shuffle([ans].concat(shuffle(q.slice(5)).slice(0,lv>=3?3:2))), tries=0;
  host.innerHTML='<div class="g2 qa"><div class="g2-sub">💬 Elegí la mejor respuesta</div>'
   +'<div class="qa-q"><img src="img/guide/fox_think.webp" alt=""><div class="qa-bub"><b>'+q[1]+'</b>'+(lv<4?'<small>'+q[2]+'</small>':'')+'<button class="ls-spk sm" id="qaSay">🔊</button></div></div>'
   +'<div class="rv-opts qa-opts">'+opts.map(function(o,i){return '<button class="rv-opt qa-o" data-i="'+i+'">'+o+'</button>';}).join('')+'</div></div>';
  document.getElementById('qaSay').onclick=function(){ say(q[1],0.8); }; say(q[1],0.85);
  host.querySelectorAll('.qa-o').forEach(function(b){ b.onclick=function(){ if(!GAME.on||b.disabled)return; var o=opts[+b.dataset.i];
   if(o===ans){ b.classList.add('ok'); host.querySelectorAll('.qa-o').forEach(function(x){x.disabled=true;}); if(!tries)first++; sGood(); burst(14);
    var im=host.querySelector('.qa-q img'); if(im)im.src='img/guide/fox_cheer.webp';
    sayBoth(ans,q[4].replace('{n}',nm)); r++; gScore(r+'/'+R); GAME.timer=setTimeout(round,2600); }
   else { tries++; b.disabled=true; b.classList.add('no'); sBad(); } }; }); }
 gScore('0/'+R); round();
};

window.startBingo=function(u,lv){
 lv=lv||1; var host=gSetup('🎱 Bingo · Nivel '+lv);
 var N=lv>=3?4:3, pool=prioW(singleWords(u).filter(function(w){return w.e;})), seen={}, card=[];
 pool.concat(shuffle(singleWords([0,1,2,3,4]).filter(function(w){return w.e;}))).forEach(function(w){ if(card.length<N*N&&!seen[w.en]&&!seen['e'+w.e]){ seen[w.en]=1; seen['e'+w.e]=1; card.push(w); } });
 var calls=shuffle(card.map(function(_,i){return i;})), ci=0, marked={}, lines=0, errs=0, done=false;
 function linesNow(){ var L=[],i,j; for(i=0;i<N;i++){ var row=[],cl=[]; for(j=0;j<N;j++){row.push(i*N+j);cl.push(j*N+i);} L.push(row,cl); } var d1=[],d2=[]; for(i=0;i<N;i++){d1.push(i*N+i);d2.push(i*N+N-1-i);} L.push(d1,d2);
  return L.filter(function(l){return l.every(function(x){return marked[x];});}).length; }
 host.innerHTML='<div class="g2 bn"><div class="g2-sub">🎱 Escuchá y marcá la palabra en tu cartón</div>'
  +'<div class="bn-call"><button class="ls-spk" id="bnSay">🔊</button><span id="bnTxt">¡Atenta!</span></div>'
  +'<div class="bn-card" style="grid-template-columns:repeat('+N+',1fr)">'+card.map(function(w,i){return '<button class="bn-c" data-i="'+i+'"><b>'+w.e+'</b>'+(lv<2?'<small>'+w.en+'</small>':'')+'</button>';}).join('')+'</div>'
  +'<div class="bn-lines" id="bnL">Líneas: 0</div></div>';
 function call(){ if(!GAME.on||done)return; if(ci>=calls.length){ done=true; GAME.timer=setTimeout(function(){ finishGameNode('🎱 ¡CARTÓN LLENO!','Marcaste las '+card.length+' palabras · '+lines+' líneas de BINGO'+(errs?'':' ¡sin errores!')+' 🎉'); },1400); return; }
  var w=card[calls[ci]]; document.getElementById('bnTxt').textContent=lv>=4?'¿Cuál es?':'Palabra '+(ci+1)+' de '+card.length; say(w.en,0.85); }
 document.getElementById('bnSay').onclick=function(){ if(ci<calls.length)say(card[calls[ci]].en,0.7); };
 host.querySelectorAll('.bn-c').forEach(function(b){ b.onclick=function(){ if(!GAME.on||done||marked[+b.dataset.i])return; var i=+b.dataset.i, want=calls[ci];
  if(i===want){ marked[i]=1; b.classList.add('ok'); var w=card[i]; markWord(w,true); tone(560,.08,'triangle',.15,0); burst(8);
   var nl=linesNow(); if(nl>lines){ lines=nl; document.getElementById('bnL').textContent='Líneas: '+lines; sWin(); burst(40); sayBoth('Bingo!','¡Bingo! ¡Línea!'); try{mgGuide('cheer','Bingo!','¡Línea!',2200);}catch(e){} ci++; GAME.timer=setTimeout(call,2200); return; }
   say(w.en); ci++; GAME.timer=setTimeout(call,1100); }
  else { errs++; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); sBad(); markWord(card[want],false); setTimeout(function(){ say(card[want].en,0.7); },500); } }; });
 gScore('🎱'); GAME.timer=setTimeout(call,1800);
};
})();
