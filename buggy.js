/* 🏖️ BUGGY SPLASH — carreras 3D de buggys en la playa, con poderes para tirarles a los rivales.
   three.js (lib/three.min.js). Arte ChatGPT en img/bug/ (buggys, poderes, objetos) y img/run/ (playa).
   Controles: mantener apretado izquierda/derecha para doblar, botón de poder abajo (o flechas + espacio). */
(function(){
var IMG='img/bug/', CLEAN=null;
function bugWords(){ var out=[], seen={};
 try{ var wi=worldInfo(S.world||1); (wi.u||[]).forEach(function(i){ UNITS[i].w.forEach(function(w){ if(/^[a-z]+$/i.test(w.en)&&w.e&&!seen[w.en]){seen[w.en]=1;out.push(w);} }); }); }catch(e){}
 [0,1,2,3,7].forEach(function(i){ if(UNITS[i])UNITS[i].w.forEach(function(w){ if(/^[a-z]+$/i.test(w.en)&&w.e&&!seen[w.en]){seen[w.en]=1;out.push(w);} }); });
 return prioW(out); }
function loadScript(src,cb){ var s=document.createElement('script'); s.src=src; s.onload=cb; s.onerror=function(){ toast('No pude cargar el juego. Probá con internet.'); }; document.head.appendChild(s); }
/* 🏁 pistas: trazado (seed/forma), colores del camino y del piso, horizonte y decorados */
var BTRK=[
 {id:'beach',n:'Playa Splash',e:'🏖️',seed:21,amp:70,bg:'bg_beach.jpg',sky:'#0C8BE9',hz:0.8,fog:0xE6C98C,road:['#D9B57A','#E84A4A','#FFFFFF'],ground:['#EBCB86','#E0BC74','#F5DCA4'],
  deco:[['b_palm',5],['b_palm',5],['b_umbrella',3.2],['b_castle',2.4],['b_rocks',2.4],['o_barrel',1.2]]},
 {id:'meadow',n:'Pradera Loca',e:'🌼',seed:7,amp:95,bg:'bg_meadow.jpg',sky:'#139FFA',hz:0.72,fog:0x9CCF7A,road:['#C9A06A','#FFD36B','#7A4E2A'],ground:['#6CC24A','#5DB33E','#7DD158'],
  deco:[['d_tree',5],['d_tree',5],['d_bush',2],['d_lamp',2],['d_house',3.6],['o_barrel',1.2]]},
 {id:'snow',n:'Pista Helada',e:'❄️',seed:33,amp:110,bg:'bg_snow.jpg',sky:'#0086FD',hz:0.8,fog:0xE4F1FF,road:['#BCD5EE','#3FA9F5','#FFFFFF'],ground:['#F4F9FF','#E3EEFA','#FFFFFF'],ice:1,
  deco:[['s_pine',5],['s_pine',5],['s_snowman',2.6],['s_sled',2.4],['s_igloo',2.8]]},
 {id:'candy',n:'Ruta Dulce',e:'🍭',seed:48,amp:120,bg:'bg_candy.jpg',sky:'#1297FC',hz:0.8,fog:0xFFC2DD,road:['#D99A5B','#E84A4A','#FFFFFF'],ground:['#FFB3D4','#FF9EC6','#FFC8E0'],
  deco:[['c_lolli',4.6],['c_cupcake',2.8],['c_cane',3.2],['c_house',3.6]]}
];
var PWN={banana:['banana','banana'],bubble:['bubble','burbuja'],rocket:['rocket','cohete'],wave:['wave','ola']};

window.startBuggy=function(){
 if(CLEAN){ try{CLEAN();}catch(e){} CLEAN=null; }
 var host=gSetup('🏖️ Buggy Splash'); GAME.quiet=true; ARCADE_RET=true;
 if(!S.bug)S.bug={best:0,wins:0}; if(!S.bug.unl)S.bug.unl=1; if(!S.bug.cup)S.bug.cup={}; if(S.bug.sel==null)S.bug.sel=0; gScore('🔮'+(S.crys||0));
 host.innerHTML='<div class="rn-start bg-start"><img src="'+IMG+'fox.webp" alt=""><h2>Buggy Splash</h2>'
  +'<div class="rn-howto"><span><b>👈 👉</b>mantené apretado un costado para doblar</span><span><b>🎁</b>agarrá la caja de la palabra que escuchás</span>'
  +'<span><img src="'+IMG+'p_banana.webp"><img src="'+IMG+'p_bubble.webp">tirá poderes a los rivales</span><span><b>🏁</b>3 vueltas: ¡llegá primero!</span></div>'
  +'<div class="bg-tracks">'+BTRK.map(function(tk,i){ var lock=i>=S.bug.unl, cup=S.bug.cup[tk.id];
    return '<button class="bg-tr'+(lock?' lock':'')+(S.bug.sel===i?' on':'')+'" data-i="'+i+'" style="background-image:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.45)),url(img/run/'+tk.bg+')"><b>'+(lock?'🔒':tk.e)+'</b><span>'+tk.n+'</span><small>'+(lock?'Salí en el podio en la anterior':cup?['','🥇','🥈','🥉'][cup]:'¡Nueva!')+'</small></button>'; }).join('')+'</div>'
  +(S.bug.wins?'<div class="rn-best">🏆 Carreras ganadas: '+S.bug.wins+'</div>':'')
  +'<button class="btn teal" id="bgGo">¡A correr! · 1 🔮</button><button class="btn ghost" onclick="openArcade()">← Volver</button></div>';
 if(window.musicStart)musicStart();
 host.querySelectorAll('.bg-tr').forEach(function(b){ b.onclick=function(){ var i=+b.dataset.i; if(i>=S.bug.unl){sBad();toast('🔒 Salí 1°, 2° o 3° en la pista anterior');return;} S.bug.sel=i; save(); sTap(); host.querySelectorAll('.bg-tr').forEach(function(x){x.classList.toggle('on',x===b);}); }; });
 document.getElementById('bgGo').onclick=function(){
  if((S.crys||0)<1){ sBad(); toast('Necesitás 🔮. ¡Estudiá un poco para ganar cristales!'); return; }
  sTap(); if(window.musicStop)musicStop(); host.innerHTML='<div class="rn-load">Cargando… 🏖️</div>';
  if(window.THREE)play(host); else loadScript('lib/three.min.js',function(){ play(host); }); };
};

function canvasTex(w,h,draw){ var c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); var t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }

function play(host){
 var T=THREE;
 var names=['fox','panda','koala','lion','bunny','p_box','p_banana','p_bubble','p_rocket','o_wave','o_finish','o_barrel','o_sign'];
 var TK=BTRK[Math.min(S.bug.sel||0,S.bug.unl-1)]; var deco=TK.deco.map(function(d){return d[0];}).filter(function(n,i,a){return a.indexOf(n)===i&&n.indexOf('o_')!==0;});
 var TX={}, IM={}, left=names.length+deco.length, ldr=new T.TextureLoader();
 function done(){ if(--left===0)start(); }
 names.forEach(function(n){ ldr.load(IMG+n+'.webp',function(t){ t.encoding=T.sRGBEncoding; t.anisotropy=4; TX[n]=t; IM[n]=t.image; done(); },undefined,done); });
 deco.forEach(function(n){ ldr.load('img/run/'+n+'.webp',function(t){ t.encoding=T.sRGBEncoding; TX[n]=t; IM[n]=t.image; done(); },undefined,done); });

 function start(){
  if(!GAME.on)return;
  S.crys--; save(); gScore('🔮'+S.crys); document.getElementById('gTitle').textContent=TK.e+' Buggy Splash · '+TK.n;
  host.innerHTML='<div class="rn-wrap bg-wrap" id="bgW"><div class="rn-hud"><span id="bgLap">Vuelta 1/3</span><span id="bgPos">5°</span></div>'
   +'<div class="rn-ask" id="bgAsk"></div><div class="rn-big" id="bgBig"></div><div class="rn-hitfx" id="bgHit"></div>'
   +'<div class="bg-pad l" id="bgL">◀</div><div class="bg-pad r" id="bgR">▶</div><button class="bg-pw" id="bgPw"></button></div>';
  var wrap=document.getElementById('bgW'), W=wrap.clientWidth||360, H=wrap.clientHeight||600;
  var R=new T.WebGLRenderer({antialias:true,alpha:true}); R.setClearColor(0,0); R.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); R.setSize(W,H); R.outputEncoding=T.sRGBEncoding;
  wrap.insertBefore(R.domElement,wrap.firstChild);
  var scene=new T.Scene(); scene.fog=new T.Fog(TK.fog,60,170);
  var asp=W/H, cam=new T.PerspectiveCamera(asp<0.75?62:48,asp,0.1,600);
  scene.add(new T.HemisphereLight(0xffffff,0xC9A66B,1.05)); var sun=new T.DirectionalLight(0xfff3d6,0.5); sun.position.set(-3,8,4); scene.add(sun);
  wrap.style.background='url(img/run/'+TK.bg+') repeat-x, linear-gradient('+TK.sky+','+TK.sky+')';

  /* --- pista: circuito cerrado con curvas --- */
  var rnd=rng(TK.seed), CP=[], NC=14; for(var i=0;i<NC;i++){ var a=i/NC*Math.PI*2, r=120+(rnd()-.5)*TK.amp+(i%3===0?30:0); CP.push(new T.Vector3(Math.cos(a)*r*1.25,0,Math.sin(a)*r)); }
  var curve=new T.CatmullRomCurve3(CP,true,'centripetal'), NP=900, PTS=curve.getSpacedPoints(NP), L=curve.getLength(), seg=L/NP, HW=6.2;
  var TAN=[], NRM=[], CUR=[];
  for(var k=0;k<NP;k++){ var p0=PTS[k], p1=PTS[(k+1)%NP], t=new T.Vector3().subVectors(p1,p0).normalize(); TAN.push(t); NRM.push(new T.Vector3(-t.z,0,t.x)); }
  for(var k2=0;k2<NP;k2++){ var a0=Math.atan2(TAN[k2].z,TAN[k2].x), a1=Math.atan2(TAN[(k2+4)%NP].z,TAN[(k2+4)%NP].x), da=a1-a0; while(da>Math.PI)da-=2*Math.PI; while(da<-Math.PI)da+=2*Math.PI; CUR.push(da/(4*seg)); }
  function wrapT(t){ t%=L; return t<0?t+L:t; }
  function at(t,d,out){ t=wrapT(t); var f=t/seg, i0=Math.floor(f)%NP, i1=(i0+1)%NP, u=f-Math.floor(f); out=out||new T.Vector3();
   out.lerpVectors(PTS[i0],PTS[i1],u); var n=NRM[i0]; out.x+=n.x*d; out.z+=n.z*d; return out; }
  function curvAt(t){ return CUR[Math.floor(wrapT(t)/seg)%NP]; }
  /* camino de arena mojada con huellas y bordes de soga y conchitas */
  var roadTex=canvasTex(256,256,function(c,w,h){ c.fillStyle=TK.road[0]; c.fillRect(0,0,w,h); var r=rng(4);
   for(var i=0;i<400;i++){ c.fillStyle=r()<.5?'rgba(160,120,60,.25)':'rgba(255,240,210,.35)'; c.beginPath(); c.arc(r()*w,r()*h,1+r()*2.5,0,7); c.fill(); }
   c.fillStyle='rgba(120,85,40,.22)'; [w*.3,w*.36,w*.64,w*.7].forEach(function(x){ for(var y=0;y<h;y+=10)c.fillRect(x,y,6,6); });
   c.fillStyle=TK.road[2]; c.fillRect(0,0,12,h); c.fillRect(w-12,0,12,h); for(var y2=0;y2<h;y2+=32){ c.fillStyle=TK.road[1]; c.fillRect(0,y2,12,16); c.fillRect(w-12,y2+16,12,16); } });
  roadTex.wrapS=roadTex.wrapT=T.RepeatWrapping;
  var pos=[], uv=[], idx=[], v=0;
  for(var k3=0;k3<=NP;k3++){ var kk=k3%NP, p=PTS[kk], n=NRM[kk]; pos.push(p.x-n.x*HW,0.02,p.z-n.z*HW, p.x+n.x*HW,0.02,p.z+n.z*HW); uv.push(0,v,1,v); v+=seg/12; if(k3<NP){ var b=k3*2; idx.push(b,b+2,b+1, b+1,b+2,b+3); } }
  var rg=new T.BufferGeometry(); rg.setAttribute('position',new T.Float32BufferAttribute(pos,3)); rg.setAttribute('uv',new T.Float32BufferAttribute(uv,2)); rg.setIndex(idx); rg.computeVertexNormals();
  scene.add(new T.Mesh(rg,new T.MeshLambertMaterial({map:roadTex,side:T.DoubleSide})));
  var sandTex=canvasTex(256,256,function(c,w,h){ c.fillStyle=TK.ground[0]; c.fillRect(0,0,w,h); var r=rng(8); for(var i=0;i<700;i++){ c.fillStyle=r()<.5?TK.ground[1]:TK.ground[2]; c.fillRect(r()*w,r()*h,3,3); }
   var cols=['#FF9A3C','#FFFFFF','#FF8DC7']; for(var q=0;q<6;q++){ var x=r()*w,y=r()*h; c.fillStyle=cols[q%3]; c.beginPath(); c.arc(x,y,4,Math.PI,0); c.fill(); } });
  sandTex.wrapS=sandTex.wrapT=T.RepeatWrapping; sandTex.repeat.set(70,70);
  var sand=new T.Mesh(new T.PlaneGeometry(900,900),new T.MeshLambertMaterial({map:sandTex})); sand.rotation.x=-Math.PI/2; scene.add(sand);

  function spr(name,w,h){ var s=new T.Sprite(new T.SpriteMaterial({map:TX[name],transparent:true,alphaTest:0.04})); s.center.set(0.5,0); s.scale.set(w,h||w*IM[name].height/IM[name].width,1); scene.add(s); return s; }
  /* decoración a los costados, carteles en las curvas, arco de llegada */
  var P0=new T.Vector3();
  for(var t0=8;t0<L;t0+=9){ for(var sd=-1;sd<=1;sd+=2){ if(rnd()<0.35)continue; var dd=TK.deco[(rnd()*TK.deco.length)|0], nm=dd[0], sz=dd[1];
    var s=spr(nm,sz); at(t0+rnd()*4,sd*(HW+2.5+rnd()*9),P0); s.position.copy(P0); } }
  for(var t1=0;t1<L;t1+=30){ var c1=curvAt(t1+25); if(Math.abs(c1)>0.012){ var sg=spr('o_sign',2.6); at(t1,-Math.sign(c1)*(HW+1.6),P0); sg.position.copy(P0); if(c1<0)sg.scale.x*=-1; } }
  var fin=spr('o_finish',HW*2+3); at(2,0,P0); fin.position.copy(P0);

  var dizzyTex=canvasTex(128,64,function(c){ c.font='40px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('💫',22,32); c.fillText('⭐',64,22); c.fillText('💫',106,32); });
  var dustTex=canvasTex(64,64,function(c){ var g=c.createRadialGradient(32,32,2,32,32,30); g.addColorStop(0,'rgba(235,205,150,.9)'); g.addColorStop(1,'rgba(235,205,150,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
  function dust(p,n){ for(var i=0;i<n;i++){ var s=new T.Sprite(new T.SpriteMaterial({map:dustTex,transparent:true,depthWrite:false})); s.scale.set(1.2,1.2,1); s.position.set(p.x+(Math.random()-.5)*1.5,p.y+0.4,p.z+(Math.random()-.5)*1.5); scene.add(s); fx.push({s:s,vx:(Math.random()-.5)*3,vy:1.5+Math.random()*2,vz:(Math.random()-.5)*3,life:0.8,grow:1}); } }
  /* --- corredores --- */
  var racers=[{id:'fox',me:1},{id:'panda',ai:0.97},{id:'koala',ai:1.0},{id:'lion',ai:1.03},{id:'bunny',ai:0.99}];
  racers.forEach(function(r,i){ var g=[4,0,1,2,3][i]; r.t=-3-g*5; r.d=[0,-2.6,2.6,-2.6,2.6][i]; r.sp=0; r.lap=-1; r.prog=r.t; r.spin=0; r.trap=0; r.slow=0; r.item=null; r.itemT=0; r.s=spr(r.id,2.1);
   r.bub=spr('p_bubble',3.2); r.bub.visible=false; r.hop=0; r.dz=0; r.dzS=new T.Sprite(new T.SpriteMaterial({map:dizzyTex,transparent:true,depthTest:false})); r.dzS.scale.set(2,1,1); r.dzS.visible=false; scene.add(r.dzS); r.wd=(rnd()-.5)*4; });
  var me=racers[0], MAX=30, objs=[], ended=false, started=false, steer=0, keyL=false, keyR=false, t=0, place=5, words=0, wrongs=0, boxRow=null, LAPS=3;

  function big(txt,ms){ var b=document.getElementById('bgBig'); if(!b)return; b.innerHTML=txt; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); clearTimeout(b._t); b._t=setTimeout(function(){b.classList.remove('on');},ms||1300); }
  function pwBtn(){ var b=document.getElementById('bgPw'); if(!b)return; if(me.item){ b.innerHTML='<img src="'+IMG+(me.item==='wave'?'o_wave':'p_'+me.item)+'.webp"><small>'+PWN[me.item][0]+'</small>'; b.classList.add('on'); } else { b.innerHTML=''; b.classList.remove('on'); } }

  /* --- cajas de palabras: la voz pide una palabra; la caja correcta da un poder --- */
  var pool=bugWords(), wi=0, ROWS=[0.18,0.43,0.68,0.9].map(function(f){return f*L;});
  var labTex={}; function wordTex(w){ if(labTex[w.en])return labTex[w.en]; return labTex[w.en]=canvasTex(256,128,function(c,cw,ch){ c.fillStyle='rgba(255,255,255,.95)'; c.beginPath(); c.roundRect?c.roundRect(4,4,cw-8,ch-8,26):c.rect(4,4,cw-8,ch-8); c.fill(); c.font='58px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(w.e,cw/2,ch/2+2); }); }
  function makeRow(t0){ var w=pool[wi++%pool.length], others=shuffle(pool.filter(function(x){return x!==w;})).slice(0,2), ws=shuffle([w].concat(others)), row={t:t0,w:w,boxes:[],said:false,done:false};
   ws.forEach(function(x,i){ var d=(i-1)*3.6, b=spr('p_box',2.2), lb=new T.Sprite(new T.SpriteMaterial({map:wordTex(x),transparent:true})); lb.center.set(0.5,0); lb.scale.set(3.2,1.6,1); scene.add(lb);
    at(t0,d,P0); b.position.copy(P0); b.position.y=0.3; lb.position.copy(P0); lb.position.y=2.7; row.boxes.push({w:x,d:d,s:b,lb:lb,y0:0.3}); });
   return row; }
  var rows=ROWS.map(makeRow);
  function resetRow(r){ r.boxes.forEach(function(b){ scene.remove(b.s); scene.remove(b.lb); }); var nr=makeRow(r.t); rows[rows.indexOf(r)]=nr; }

  /* --- poderes --- */
  function ahead(r){ var best=null, bd=1e9; racers.forEach(function(o){ if(o===r)return; var dd=o.prog-r.prog; if(dd>0&&dd<bd){bd=dd;best=o;} }); return best; }
  function usePower(r){ var k=r.item; if(!k)return; r.item=null; if(r.me){ pwBtn(); sayBoth(PWN[k][0],PWN[k][1]); }
   if(k==='banana'){ var o={k:'banana',t:r.t-3,d:r.d,s:spr('p_banana',1.3),life:30,owner:r}; objs.push(o); if(r.me)SFX.lane(-1); }
   else if(k==='bubble'||k==='rocket'){ var tg=ahead(r); var o2={k:k,t:r.t+2,d:r.d,s:spr(k==='bubble'?'p_bubble':'p_rocket',k==='bubble'?1.6:1.5),life:6,owner:r,tg:tg,sp:Math.max(r.sp,20)+26}; o2.s.position.y=0.6; objs.push(o2); if(r.me)(k==='rocket'?SFX.turbo:SFX.whoosh)(); }
   else if(k==='wave'){ var o3={k:'wave',t:r.t+4,d:0,s:spr('o_wave',HW*2),life:3,owner:r,sp:Math.max(r.sp,20)+18,hit:[]}; o3.s.material.opacity=0.85; objs.push(o3); if(r.me)SFX.whoosh(); } }
  function hitRacer(r,how){ if(r.trap>0||r.spin>0)return;
   if(how==='bubble'){ r.trap=1.7; r.bub.visible=true; } else { r.spin=1.2; r.hop=0.55; } r.sp*=0.35; r.dz=1.6; r.dzS.visible=true;
   for(var q=0;q<10;q++)burstAt(r.s.position,how==='wave'?0x9FE3FF:null); dust(r.s.position,8);
   if(r.me){ SFX.hit(); cam.userData.shake=0.5; var fl=document.getElementById('bgHit'); if(fl){fl.classList.remove('on');void fl.offsetWidth;fl.classList.add('on');} big(how==='bubble'?'🫧 ¡Atrapado!':how==='wave'?'🌊 ¡Ola!':'💥 ¡Uy!',900); if(navigator.vibrate)try{navigator.vibrate([60,40,90]);}catch(e){} }
   else { tone(500,.08,'triangle',.08,0); } }

  /* --- controles --- */
  function hold(el,on){ ['touchstart','mousedown'].forEach(function(ev){ el.addEventListener(ev,function(e){ e.preventDefault(); on(true); },{passive:false}); }); ['touchend','touchcancel','mouseup','mouseleave'].forEach(function(ev){ el.addEventListener(ev,function(){ on(false); }); }); }
  hold(document.getElementById('bgL'),function(v){keyL=v;}); hold(document.getElementById('bgR'),function(v){keyR=v;});
  var pwb=document.getElementById('bgPw'); ['touchstart','mousedown'].forEach(function(ev){ pwb.addEventListener(ev,function(e){ e.preventDefault(); e.stopPropagation(); if(started&&!ended)usePower(me); },{passive:false}); });
  function onKey(e){ if(!GAME.on)return; var dn=e.type==='keydown'; if(e.key==='ArrowLeft')keyL=dn; else if(e.key==='ArrowRight')keyR=dn; else if(dn&&(e.key===' '||e.key==='ArrowUp'))usePower(me); }
  window.addEventListener('keydown',onKey); window.addEventListener('keyup',onKey);
  window.__bug={me:me,racers:racers,rows:rows,L:L,keys:function(l,r){keyL=l;keyR=r;},use:function(){usePower(me);},objs:objs,st:function(){return {place:place,ended:ended,started:started,lap:me.lap,words:words};}};

  var newTrk=null; function end(){ if(ended)return; ended=true; var gems=[0,40,25,15,10,8][place]+words*2; S.gems+=gems; if(place===1)S.bug.wins=(S.bug.wins||0)+1; var ti=BTRK.indexOf(TK); if(place<=3){ if(!S.bug.cup[TK.id]||place<S.bug.cup[TK.id])S.bug.cup[TK.id]=place; if(ti+1>=S.bug.unl&&ti+1<BTRK.length){ S.bug.unl=ti+2; newTrk=BTRK[ti+1]; } } save();
   say(place===1?'You win!':'Finish!'); if(place<=3){sWin();burst(200);}
   setTimeout(function(){ if(!GAME.on)return; GAME.stop(); var b=document.getElementById('rewBody');
    b.innerHTML='<div class="chest">'+(['','🥇','🥈','🥉'][place]||'🏁')+'</div><h2>'+(place===1?'¡Ganaste la carrera!':place<=3?'¡Llegaste '+place+'°! ¡Al podio!':'Llegaste '+place+'°')+'</h2>'
     +(newTrk?'<p>🔓 ¡Nueva pista: '+newTrk.e+' '+newTrk.n+'!</p>':place>3?'<p>Salí entre los 3 primeros para desbloquear la próxima pista</p>':'')+'<div class="rn-res"><div><b>'+place+'°</b><span>puesto</span></div><div><b>'+words+'</b><span>palabras</span></div></div><div class="rewpill">💎 +'+gems+' · 🔮 te quedan '+(S.crys||0)+'</div>'
     +((S.crys||0)>0?'<button class="btn teal" onclick="startBuggy()">Otra carrera · 1 🔮</button><div style="height:8px"></div>':'<p style="font-size:13px">Estudiá para ganar más 🔮</p>')
     +'<button class="btn ghost" onclick="openArcade()">Volver a la Sala de Juegos</button>';
    show('s-reward'); },1500); }

  var V=new T.Vector3(), V2=new T.Vector3(), last=0;
  function update(dt){ t+=dt;
   racers.forEach(function(r){
    var c=curvAt(r.t+6);
    if(r.trap>0){ r.trap-=dt; r.sp=Math.max(0,r.sp-40*dt); if(r.trap<=0)r.bub.visible=false; }
    if(r.spin>0)r.spin-=dt;
    var top=MAX*(r.me?1:r.ai)*(r.spin>0?0.4:1)*(r.trap>0?0:1);
    if(!started)top=0;
    if(r.me){ var tgt=(keyR?1:0)-(keyL?1:0); steer+=(tgt-steer)*Math.min(1,dt*8); r.d+=steer*dt*11; r.d-=c*r.sp*r.sp*dt*(TK.ice?0.028:0.022); }
    else { /* IA: línea de carrera + esquivar + empujoncito si queda lejos */
     var line=-Math.sign(c)*Math.min(4,Math.abs(c)*220)+r.wd; r.d+=(line-r.d)*dt*1.3;
     var gap=me.prog-r.prog; top*=gap>40?1.1:gap>15?1.04:gap<-80?0.9:gap<-30?0.96:1;
     if(r.item){ r.itemT-=dt; if(r.itemT<=0)usePower(r); }
     racers.forEach(function(o){ if(o!==r&&Math.abs(o.t-r.t)<4&&Math.abs(o.d-r.d)<1.6&&o.prog>r.prog)r.d+=(r.d>o.d?1:-1)*dt*3; }); }
    var off=Math.abs(r.d)>HW-0.6; if(off)top*=0.55; r.d=Math.max(-HW-3,Math.min(HW+3,r.d));
    r.sp+=(top-r.sp)*Math.min(1,dt*(r.sp<top?0.9:2.5));
    var oldT=r.t; r.t+=r.sp*dt; r.prog+=r.sp*dt;
    if(Math.floor(r.prog/L)!==Math.floor((r.prog-r.sp*dt)/L)){ r.lap=Math.floor(r.prog/L); if(r.me&&started){ if(r.lap>=LAPS){ end(); } else if(r.lap>0){ big(r.lap===LAPS-1?'¡Última vuelta! 🏁':'Vuelta '+(r.lap+1),1200); say(r.lap===LAPS-1?'Final lap!':'Lap '+(r.lap+1)); document.getElementById('bgLap').textContent='Vuelta '+(r.lap+1)+'/'+LAPS; } } }
    if(r.hop>0)r.hop-=dt; var hopY=r.hop>0?Math.sin((1-r.hop/0.55)*Math.PI)*1.6:0;
    at(r.t,r.d,V); r.s.position.copy(V); r.s.position.y=(r.trap>0?1.1+Math.sin(t*4)*0.15:0)+hopY+(r.sp>2?Math.abs(Math.sin(t*18+r.t))*0.05:0);
    r.s.material.rotation=r.spin>0?(1-r.spin/1.2)*Math.PI*2*(r.d>0?1:-1):(r.me?-steer*0.12:0);
    if(r.dz>0){ r.dz-=dt; r.dzS.position.set(r.s.position.x,r.s.position.y+r.s.scale.y+0.2,r.s.position.z); r.dzS.material.rotation=t*5; if(r.dz<=0)r.dzS.visible=false; }
    if(r.bub.visible){ r.bub.position.copy(r.s.position); r.bub.position.y-=0.3; }
    /* cajas */
    rows.forEach(function(row){ if(row.done)return; if(Math.abs(wrapT(r.t)-row.t)<1.2||(oldT<row.t&&r.t>=row.t&&Math.abs(wrapT(r.t)-row.t)<3)){ row.boxes.forEach(function(b){ if(b.taken||Math.abs(b.d-r.d)>1.6)return;
      b.taken=1; b.s.visible=false; b.lb.visible=false;
      if(r.me){ var ok=b.w===row.w; if(ok){ words++; markWord(row.w,true); me.item=pickR(['banana','bubble','rocket','wave',place>2?'rocket':'bubble']); SFX.power(); sayBoth(row.w.en,row.w.es); big('✨ <b>'+row.w.en+'</b> = '+row.w.es,1300); pwBtn(); }
       else { wrongs++; markWord(row.w,false); SFX.wrong(); say(row.w.en); big('🙈 Era <b>'+row.w.en+'</b>',1300); }
       document.getElementById('bgAsk').classList.remove('on'); row.done=true; setTimeout(function(){ if(GAME.on)resetRow(row); },2500); }
      else if(!r.item&&Math.random()<0.55){ r.item=pickR(['banana','bubble','banana','rocket']); r.itemT=1+Math.random()*4; } }); } });
   });
   /* choques entre buggys: rebotan con chispas */
   for(var a=0;a<racers.length;a++)for(var b2=a+1;b2<racers.length;b2++){ var A=racers[a], B=racers[b2]; if(A.trap>0||B.trap>0)continue;
    if(Math.abs(wrapT(A.t)-wrapT(B.t))<2.2&&Math.abs(A.d-B.d)<1.9&&(!A.bumpT||A.bumpT<t)&&(!B.bumpT||B.bumpT<t)){ var sgn=A.d>B.d?1:-1; A.d+=sgn*1.1; B.d-=sgn*1.1; A.sp*=0.85; B.sp*=0.85; A.bumpT=B.bumpT=t+0.5;
     var mid=A.s.position.clone().lerp(B.s.position,0.5); for(var q2=0;q2<6;q2++)burstAt(mid,0xFFE07A); dust(mid,4);
     if(A.me||B.me){ SFX.land(); tone(300,.06,'square',.08,0); cam.userData.shake=0.25; if(navigator.vibrate)try{navigator.vibrate(40);}catch(e){} } } }
   /* anunciar la próxima fila de cajas */
   rows.forEach(function(row){ var dd=wrapT(row.t-me.t); if(!row.said&&dd<55&&dd>5&&started){ row.said=true; var a=document.getElementById('bgAsk'); a.innerHTML='<b>'+row.w.e+'</b><span>🔊 Agarrá: <i>'+row.w.en+'</i></span>'; a.classList.add('on'); a.onclick=function(){say(row.w.en,0.75);}; say(row.w.en,0.85); }
    if(row.said&&dd>L-20){ row.said=false; } row.boxes.forEach(function(b){ b.s.position.y=b.y0+Math.sin(t*3+b.d)*0.15; b.s.material.rotation=Math.sin(t*2+b.d)*0.08; }); });
   /* objetos lanzados */
   objs.forEach(function(o){ if(o.dead)return; o.life-=dt;
    if(o.k==='banana'){ at(o.t,o.d,V); o.s.position.copy(V); racers.forEach(function(r){ if(o.dead||r===o.owner&&o.life>28)return; if(Math.abs(wrapT(r.t)-wrapT(o.t))<1.3&&Math.abs(r.d-o.d)<1.3){ hitRacer(r,'banana'); o.dead=true; } }); }
    else if(o.k==='bubble'||o.k==='rocket'){ o.t+=o.sp*dt; if(o.tg){ o.d+=(o.tg.d-o.d)*Math.min(1,dt*4); } at(o.t,o.d,V); o.s.position.x=V.x; o.s.position.z=V.z; o.s.position.y=0.8+Math.sin(t*10)*0.1;
     if(o.k==='rocket'&&Math.random()<0.6){ burstAt(V); }
     racers.forEach(function(r){ if(o.dead||r===o.owner)return; if(Math.abs(r.prog-(o.owner.prog+(o.t-o.owner.t)))<2||(Math.abs(wrapT(r.t)-wrapT(o.t))<1.6&&Math.abs(r.d-o.d)<1.8)){ hitRacer(r,o.k==='bubble'?'bubble':'rocket'); o.dead=true; if(o.k==='rocket')for(var q=0;q<8;q++)burstAt(r.s.position); } }); }
    else if(o.k==='wave'){ o.t+=o.sp*dt; at(o.t,0,V); o.s.position.copy(V); o.s.material.opacity=Math.min(0.85,o.life); racers.forEach(function(r){ if(r===o.owner||o.hit.indexOf(r)>=0)return; if(Math.abs(wrapT(r.t)-wrapT(o.t))<2){ o.hit.push(r); hitRacer(r,'wave'); } }); }
    if(o.life<=0)o.dead=true; if(o.dead){ scene.remove(o.s); } });
   for(var i=objs.length-1;i>=0;i--)if(objs[i].dead)objs.splice(i,1);
   fx.forEach(function(f){ f.life-=dt; f.s.position.x+=f.vx*dt; f.s.position.y+=f.vy*dt; f.s.position.z+=f.vz*dt; f.vy-=(f.grow?1:9)*dt; if(f.grow){var g=f.s.scale.x+dt*1.5; f.s.scale.set(g,g,1);} f.s.material.opacity=Math.max(0,f.life/0.8); if(f.life<=0)scene.remove(f.s); }); fx=fx.filter(function(f){return f.life>0;});
   /* puesto */
   var order=racers.slice().sort(function(a,b){return b.prog-a.prog;}); place=order.indexOf(me)+1; var pe=document.getElementById('bgPos'); if(pe)pe.textContent=place+'°';
   /* cámara detrás del buggy */
   var sh=cam.userData.shake||0; if(sh>0)cam.userData.shake=Math.max(0,sh-dt);
   at(me.t-9.5,me.d*0.8,V); at(me.t+12,me.d*0.55,V2); cam.position.set(V.x+(sh?(Math.random()-.5)*sh:0),4.2,V.z); cam.lookAt(V2.x,0.9,V2.z);
   var bgx=-(Math.atan2(V2.z-V.z,V2.x-V.x))*W*0.9; wrap.style.backgroundSize=(W*3.3)+'px '+(W*3.3*533/3200)+'px, 100% 100%';
   var hz=new T.Vector3().copy(V2).add(new T.Vector3().subVectors(V2,V).multiplyScalar(30)); hz.y=0; hz.project(cam); var hy=(1-hz.y)/2*H;
   wrap.style.backgroundPosition=bgx+'px '+(hy-W*3.3*533/3200*TK.hz)+'px, 0 0';
  }
  var confTex=canvasTex(32,32,function(c){ c.fillStyle='#fff'; c.fillRect(6,10,20,12); }), fx=[], CC=[0xFF6B6B,0xFFD36B,0x6FCF6A,0x7FC4F2,0xB58BFF];
  function burstAt(p,col){ var s=new T.Sprite(new T.SpriteMaterial({map:confTex,transparent:true,color:col||CC[(Math.random()*5)|0],depthWrite:false})); s.scale.set(0.3,0.3,1); s.position.set(p.x,p.y+0.8,p.z); scene.add(s); fx.push({s:s,vx:(Math.random()-.5)*6,vy:2+Math.random()*4,vz:(Math.random()-.5)*6,life:0.8}); }
  function loop(ts){ if(!GAME.on){ cleanup(); return; } var dt=Math.min(0.05,last?(ts-last)/1000:0.016); last=ts; update(dt); R.render(scene,cam); GAME.raf=requestAnimationFrame(loop); }
  function cleanup(){ window.removeEventListener('keydown',onKey); window.removeEventListener('keyup',onKey); try{ R.dispose(); R.forceContextLoss(); }catch(e){} CLEAN=null; }
  CLEAN=cleanup;
  big('3',800); say('Three'); var cdn=3;
  var cd=setInterval(function(){ if(!GAME.on){clearInterval(cd);return;} cdn--; if(cdn>0){ big(String(cdn),800); say(cdn===2?'Two':'One'); tone(500,.15,'square',.12,0); } else { clearInterval(cd); big('¡YA! 🏁',800); say('Go!'); tone(900,.3,'square',.14,0); started=true; racers.forEach(function(r){ r.lap=0; }); } },1000);
  GAME.raf=requestAnimationFrame(loop);
 }
}
})();
