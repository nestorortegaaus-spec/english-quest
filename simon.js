/* 🙋 SIMÓN DICE: el amigo compañero da órdenes en inglés y ella toca la tarjeta que corresponde.
   Nivel 1: siempre "Simon says", con castellano. Nivel 2+: órdenes trampa (sin "Simon says") → tocar "¡Simón no dijo!".
   Nivel 3+: sin castellano. Nivel 4+: a veces dos órdenes seguidas ("… and …") y el texto se ve recién después de escuchar. */
(function(){
var SIMON=[
 ['touch your nose','tocate la nariz','👃'],['touch your ears','tocate las orejas','👂'],['close your eyes','cerrá los ojos','🙈'],
 ['open your mouth','abrí la boca','😮'],['clap your hands','aplaudí','👏'],['wave your hand','saludá con la mano','👋'],
 ['raise your hands','levantá las manos','🙌'],['thumbs up','pulgar arriba','👍'],['point up','señalá para arriba','☝️'],
 ['stomp your feet','zapateá','🦶'],['jump','saltá','🤸'],['sit down','sentate','🪑'],['stand up','parate','🧍'],
 ['turn around','date una vuelta','🔄'],['dance','bailá','💃'],['sleep','dormí','😴'],['laugh','reíte','😂'],['cry','llorá','😢'],
 ['be quiet','hacé silencio','🤫'],['blow a kiss','tirá un beso','😘'],['show your muscles','mostrá los músculos','💪'],['wink','guiñá un ojo','😉'],
 ['cross your fingers','cruzá los dedos','🤞'],['brush your teeth','cepillate los dientes','🪥'],['swim','nadá','🏊'],['run','corré','🏃'],
 ['fly like a bird','volá como un pájaro','🐦'],['hop like a frog','saltá como una rana','🐸'],['roar like a lion','rugí como un león','🦁'],
 ['eat a sandwich','comé un sándwich','🥪'],['drink some water','tomá agua','🥤'],['ride a bike','andá en bici','🚲'],
 ['play the guitar','tocá la guitarra','🎸'],['read a book','leé un libro','📖'],['say hello','decí hola','🗣️'],['think','pensá','🤔']
];
function petBox(id){ var key=petKey(id);
 var img=key?'<img id="smImg" src="'+buddyImg('idle')+'" alt="">':'<img id="smImg" src="'+(id==='fox'?IMG.fox:'img/friend_'+id+'.png')+'" alt="">';
 return dressWrap(key||'gen',img,wearOf(id)); }
window.startSimon=function(u,lv){
 lv=lv||1; var id=buddyId(), f=friendById(id)||{n:'Zorrito'}, host=gSetup('🙋 Simón dice · Nivel '+lv); GAME.quiet=true;
 var R=Math.min(10,6+lv), r=0, pts=0, ok1=0, NC=lv<2?4:6, flapT=0, es=lv<3, tricks=lv>=2, dbl=lv>=4, hideTxt=lv>=4;
 var cur=null, need=[], got=0, simon=true, done=false, wrong=0, lastTrick=false;
 host.innerHTML='<div class="g2 ch sm"><div class="ch-top"><div class="ch-pet" id="smPet">'+petBox(id)+'</div><div class="ch-bub sm-bub" id="smBub"></div></div>'
  +'<div class="sm-grid'+(NC>4?' six':'')+'" id="smG"></div>'+(tricks?'<button class="sm-no" id="smNo">🙅 ¡Simón no dijo!</button>':'')+'</div>';
 function flap(on,ms){ clearInterval(flapT); var im=document.getElementById('smImg'); if(!im||!petKey(id))return; if(!on){im.src=buddyImg('idle');return;} var o=0;
  flapT=setInterval(function(){ var i2=document.getElementById('smImg'); if(!i2||!GAME.on){clearInterval(flapT);return;} o^=1; i2.src=buddyImg(o?'open':'idle'); },150); setTimeout(function(){flap(false);},ms||1800); }
 function happy(){ var pe=document.getElementById('smPet'); if(!pe)return; pe.classList.remove('hap'); void pe.offsetWidth; pe.classList.add('hap'); var im=document.getElementById('smImg'); if(im&&petKey(id))setTimeout(function(){ im.src=buddyImg('happy'); },60); }
 function bub(html){ var b=document.getElementById('smBub'); b.innerHTML=html; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); }
 function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
 function line(){ return (simon?'Simon says: ':'')+need.map(function(c){return c[0];}).join(' and ')+'!'; }
 function lineEs(){ return (simon?'Simón dice: ':'')+need.map(function(c){return c[1];}).join(' y ')+'!'; }
 function speak(){ var en=line(); flap(true,700+en.length*60); if(lv<2)sayBoth(en,lineEs()); else say(en,lv>=4?0.9:0.8); }
 function showLine(full){ bub((hideTxt&&!full?'<b class="sm-ear">👂 Escuchá bien…</b>':'<b>'+(simon?'<span class="sm-says">Simon says:</span> ':'')+cap(need.map(function(c){return c[0];}).join(' and '))+'!</b>')
   +(es&&(!hideTxt||full)?'<small>'+lineEs()+'</small>':'')+'<em class="sm-rep" id="smRep">🔊</em>');
  var rp=document.getElementById('smRep'); if(rp)rp.onclick=function(e){ e.stopPropagation(); speak(); }; }
 function round(){ if(!GAME.on)return;
  if(r>=R){ bub('<b>Great job! You are a Simon Says star!</b>'+(es?'<small>¡Muy bien! ¡Sos una estrella de Simón dice!</small>':'')); happy(); sayBoth('Great job!','¡Muy bien!');
   GAME.timer=setTimeout(function(){ finishGameNode('🙋 ¡Qué buena oreja!','Seguiste '+R+' órdenes en inglés · '+ok1+' a la primera 👂'); },2600); return; }
  done=false; wrong=0; got=0;
  simon=!tricks||lastTrick||Math.random()>0.3; lastTrick=!simon;
  var deck=shuffle(SIMON), two=dbl&&simon&&Math.random()<0.35;
  need=deck.slice(0,two?2:1); var opts=shuffle(deck.slice(0,NC)); cur=opts;
  var G=document.getElementById('smG');
  G.innerHTML=opts.map(function(c,i){ return '<button class="sm-card" data-i="'+i+'"><b>'+c[2]+'</b>'+(lv<3?'<small>'+c[0]+'</small>':'')+(lv<2?'<em>'+c[1]+'</em>':'')+'</button>'; }).join('');
  G.querySelectorAll('.sm-card').forEach(function(b){ b.onclick=function(){ tap(opts[+b.dataset.i],b); }; });
  gScore((r+1)+'/'+R); showLine(false); GAME.timer=setTimeout(speak,350); }
 function tap(c,b){ if(!GAME.on||done)return;
  if(!simon){ done=true; wrong++; sBad(); b.classList.add('no'); showLine(true);
   bub('<b>Oops! Simon didn\'t say!</b><small>¡Uy! ¡Simón no lo dijo! Había que tocar "Simón no dijo".</small>'); sayBoth('Oops! Simon didn\'t say!','¡Uy! ¡Simón no lo dijo!');
   var no=document.getElementById('smNo'); if(no){ no.classList.remove('hint'); void no.offsetWidth; no.classList.add('hint'); }
   r++; GAME.timer=setTimeout(round,3600); return; }
  var want=need[got];
  if(c!==want){ wrong++; sBad(); b.classList.add('no'); setTimeout(function(){b.classList.remove('no');},450); say('No, that is: '+c[0]+'.',0.85);
   if(wrong>=2){ var G=document.getElementById('smG'), k=cur.indexOf(want), wb=G.querySelector('.sm-card[data-i="'+k+'"]'); if(wb){ wb.classList.remove('hint'); void wb.offsetWidth; wb.classList.add('hint'); } showLine(true); }
   return; }
  got++; b.classList.add('ok'); b.disabled=true; tone(620+got*80,.08,'triangle',.16,0); markWord({en:want[0],es:want[1],e:want[2]},!wrong);
  if(got<need.length){ say(want[0],0.9); return; }
  done=true; if(!wrong)ok1++; pts+=wrong?1:3; sGood(); burst(16); happy(); showLine(true);
  var act=document.createElement('div'); act.className='sm-act'; act.textContent=need.map(function(x){return x[2];}).join(''); document.getElementById('smG').appendChild(act);
  say(need.map(function(x){return x[0];}).join(' and ')+'!',0.9); r++; GAME.timer=setTimeout(round,2200); }
 var no=document.getElementById('smNo'); if(no)no.onclick=function(){ if(!GAME.on||done)return; done=true; showLine(true);
  if(!simon){ ok1++; pts+=3; sGood(); burst(22); happy(); no.classList.add('ok'); setTimeout(function(){no.classList.remove('ok');},900);
   bub('<b>Yes! Simon didn\'t say!</b>'+(es?'<small>¡Sí! ¡Simón no lo dijo! No había que hacerlo 😄</small>':'')); sayBoth('Yes! Simon didn\'t say!','¡Muy bien! ¡Simón no lo dijo!'); r++; GAME.timer=setTimeout(round,2600); }
  else { wrong++; sBad(); done=false; no.classList.add('no'); setTimeout(function(){no.classList.remove('no');},450); bub('<b>Simon said it!</b><small>¡Simón sí lo dijo! Escuchá: "Simon says…"</small>'); say('Simon said it! '+line(),0.85); } };
 window.__sm=function(){ return {need:need,simon:simon,opts:cur,r:r,R:R}; };
 gScore('1/'+R);
 GAME.timer=setTimeout(function(){ var nm=(S.name||'').split(' ')[0]||'friend';
  bub('<b>Let\'s play Simon says, '+nm+'!</b><small>'+(tricks?'¡Hacé solo lo que dice "Simon says"! Si no lo dice, tocá 🙅.':'¡Hacé lo que dice Simón!')+'</small>'); happy();
  sayBoth('Let\'s play Simon says!',tricks?'¡Juguemos a Simón dice! Hacé solo lo que diga Simon says. Si no lo dice, tocá el botón de Simón no dijo.':'¡Juguemos a Simón dice!');
  GAME.timer=setTimeout(round,tricks?6500:3200); },400);
};
})();
