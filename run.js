/* 🦊 CARRERA MÁGICA — corredor 3D de 3 carriles para la Sala de Juegos.
   Mundo en 3D real con three.js (lib/three.min.js, MIT). Personajes y objetos: arte de ChatGPT en img/run/.
   Gestos: deslizar ← → para cambiar de carril, ↑ saltar, ↓ agacharse (también flechas del teclado). */
(function(){
var IMG='img/run/', LW=1.4, CLEAN=null;
/* 🌍 paisajes que rotan en cada carrera: horizonte + decorados (ChatGPT) y piso dibujado con sus colores */
var RSCN=[
 {id:'meadow',n:'Pradera',bg:'bg_meadow.jpg',hz:0.72,sky:'#139FFA',fog:0x7CC46A,road:'stone',ground:{base:'#6CC24A',a:'#5DB33E',b:'#7DD158',dots:['#FF8DC7','#FFE07A','#FFFFFF','#B58BFF']},
  deco:[['d_tree',2.5,.38],['d_bush',1.0,.24],['d_lamp',0.95,.18,1],['d_house',1.9,.2]]},
 {id:'beach',n:'Playa',bg:'bg_beach.jpg',hz:0.80,sky:'#0C8BE9',fog:0xE6C98C,road:'boards',ground:{base:'#EBCB86',a:'#E0BC74',b:'#F3D79C',dots:['#FF9A3C','#FFFFFF','#FF8DC7','#FFE3B0'],shells:1},
  deco:[['b_palm',2.6,.4],['b_umbrella',1.6,.22],['b_castle',1.1,.18],['b_rocks',1.1,.2]]},
 {id:'snow',n:'Nieve',bg:'bg_snow.jpg',hz:0.80,sky:'#0086FD',fog:0xE4F1FF,road:'snow',ground:{base:'#F4F9FF',a:'#E3EEFA',b:'#FFFFFF',dots:['#BFE3FF','#FFFFFF','#DDEBFF','#FFFFFF'],sparkle:1},
  deco:[['s_pine',2.5,.42],['s_snowman',1.3,.22],['s_sled',1.2,.18],['s_igloo',1.4,.18]]},
 {id:'candy',n:'Golosinas',bg:'bg_candy.jpg',hz:0.80,sky:'#1297FC',fog:0xFFC2DD,road:'candy',ground:{base:'#FFB3D4',a:'#FF9EC6',b:'#FFC8E0',dots:['#FFE07A','#7FD3FF','#B58BFF','#7DD158','#FF6B6B'],sprinkles:1},
  deco:[['c_lolli',2.3,.36],['c_cupcake',1.4,.24],['c_cane',1.6,.2],['c_house',1.8,.2]]},
 {id:'jungle',n:'Selva',bg:'bg_jungle.jpg',hz:0.82,sky:'#2B9BE0',fog:0x7CBF6A,road:'stone',ground:{base:'#4FA83A',a:'#3E9530',b:'#62BC48',dots:['#FF6B6B','#FFE07A','#FF8DC7','#FFFFFF']},
  deco:[['j_palm',2.8,.34],['j_plant',1.6,.3],['j_statue',1.6,.18],['j_toucan',1.5,.18]]},
 {id:'desert',n:'Desierto',bg:'bg_desert.jpg',hz:0.8,sky:'#0590FE',fog:0xF2C66A,road:'adobe',ground:{base:'#F2C14E',a:'#E5AE3A',b:'#F8D06A',dots:['#D9824A','#C96E3A','#FF5FB0','#7CBF4A']},
  deco:[['de_cactus',2.2,.3],['de_palm',2.6,.26],['de_arch',2,.22],['de_camel',1.6,.22]]},
 {id:'space',stars:1,n:'Espacio',bg:'bg_space.jpg',hz:0.8,sky:'#050260',fog:0x8C5AD8,road:'space',ground:{base:'#9A5FE0',a:'#8A4FD2',b:'#AE78EA',dots:['#6FE6FF','#FF7AD9','#FFFFFF','#C9B5FF']},
  deco:[['sp_crystal',1.8,.34],['sp_rocket',2.4,.22],['sp_alien',1.6,.2],['sp_dish',2,.24]]},
 {id:'dino',n:'Valle Dino',bg:'bg_dino.jpg',hz:0.8,sky:'#0098FD',fog:0x9FD67A,road:'dino',ground:{base:'#6CC24A',a:'#5DB33E',b:'#7DD158',dots:['#FF6B3D','#B57BFF','#FFE07A','#FFFFFF']},
  deco:[['dn_brachio',2.2,.26],['dn_nest',1.3,.22],['dn_fern',1.8,.3],['dn_trice',1.4,.22]]}
];
function loadScript(src,cb){ var s=document.createElement('script'); s.src=src; s.onload=cb; s.onerror=function(){ toast('No pude cargar el juego. Probá con internet.'); }; document.head.appendChild(s); }
function runWords(){ var out=[], seen={}, maxU=UNITS.length;
 try{ var wi=worldInfo(S.world||1); (wi.u||[]).forEach(function(i){ UNITS[i].w.forEach(function(w){ if(/^[a-z]+$/i.test(w.en)&&w.e&&!seen[w.en]){seen[w.en]=1;out.push(w);} }); }); }catch(e){}
 [0,1,2,3,7].forEach(function(i){ if(UNITS[i])UNITS[i].w.forEach(function(w){ if(/^[a-z]+$/i.test(w.en)&&w.e&&!seen[w.en]){seen[w.en]=1;out.push(w);} }); });
 return prioW(out); }

/* 🏃 corredores: amigos de la Casa con su hoja de espaldas (img/run/<id>_run1, _run2, _jump, _slide.webp) */
var RUNNERS=['fox','kitty','puppy','bunny','penguin','panda'], RUNW={fox:0.9,kitty:0.8,puppy:0.8,bunny:0.86,penguin:0.8,panda:0.8}; /* RUNW: ancho del sprite para que todos midan parecido */
function runOwned(id){ try{ return id==='fox'||(S.home&&S.home.own&&S.home.own.indexOf(id)>=0); }catch(e){ return id==='fox'; } }
function runner(){ var c=S.run&&S.run.ch; return c&&RUNNERS.indexOf(c)>=0&&runOwned(c)?c:'fox'; }
window.startRun=function(){
 if(CLEAN){ try{CLEAN();}catch(e){} CLEAN=null; }
 var host=gSetup('🦊 Carrera Mágica'); GAME.quiet=true; ARCADE_RET=true;
 if(!S.run)S.run={best:0,stars:0}; gScore('🔮'+(S.crys||0));
 var ch=runner(), mates=RUNNERS.length>1?FRIENDS.filter(function(f){return RUNNERS.indexOf(f.id)>=0;}):[];
 host.innerHTML='<div class="rn-start"><img id="rnHero" src="'+IMG+ch+'_run1.webp" alt=""><h2>Carrera Mágica</h2>'
  +(mates.length?'<div class="rn-mates">'+mates.map(function(f){ var own=runOwned(f.id); return '<button class="rn-mate'+(own?'':' lock')+(f.id===ch?' on':'')+'" data-id="'+f.id+'"><img src="'+IMG+f.id+'_run1.webp" alt=""><span>'+(own?f.n:'🔒 '+f.n)+'</span></button>'; }).join('')+'</div>':'')
  +'<div class="rn-howto"><span><b>👈 👉</b>deslizá para cambiar de carril</span><span><b>👆</b>deslizá hacia arriba para saltar</span><span><b>👇</b>deslizá hacia abajo para agacharte</span><span><b>🌸</b>pasá por la puerta de la palabra que escuchás</span></div>'
  +(S.run.best?'<div class="rn-best">🏆 Tu récord: '+S.run.best+' m</div>':'')
  +'<button class="btn teal" id="rnGo">¡A correr! · 1 🔮</button><button class="btn ghost" onclick="openArcade()">← Volver</button></div>';
 musicStart();
 host.querySelectorAll('.rn-mate').forEach(function(b){ b.onclick=function(){ var id=b.dataset.id; if(!runOwned(id)){ sBad(); toast('🔒 Primero adoptalo en la Casa de Amigos'); return; } S.run.ch=id; save(); sTap(); document.getElementById('rnHero').src=IMG+id+'_run1.webp'; host.querySelectorAll('.rn-mate').forEach(function(x){x.classList.toggle('on',x===b);}); var f=friendById(id); if(f)sayBoth(f.en,f.n); }; });
 document.getElementById('rnGo').onclick=function(){
  if((S.crys||0)<1){ sBad(); toast('Necesitás 🔮. ¡Estudiá un poco para ganar cristales!'); return; }
  sTap(); musicStop(); host.innerHTML='<div class="rn-load">Cargando… 🦊</div>';
  if(window.THREE)play(host); else loadScript('lib/three.min.js',function(){ play(host); }); };
};

if(window.CanvasRenderingContext2D&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h){this.rect(x,y,w,h);};
function canvasTex(w,h,draw){ var c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); var t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }

function play(host){
 var T=THREE;
 if(S.run.scn==null)S.run.scn=0; var SC=RSCN[S.run.scn%RSCN.length]; S.run.scn++; save();
 var RN=runner(); var names=[RN+'_run1',RN+'_run2',RN+'_jump',RN+'_slide','hurdle','log','arch','cart','star','gate','pw_magnet','pw_shoes','pw_shield','pw_x2'].concat(SC.deco.map(function(d){return d[0];}));
 var TX={}, IM={}, left=names.length+1, ldr=new T.TextureLoader();
 function done(){ if(--left===0)start(); }
 names.forEach(function(n){ ldr.load(IMG+n+'.webp',function(t){ t.encoding=T.sRGBEncoding; t.anisotropy=4; TX[n]=t; IM[n]=t.image; done(); },undefined,function(){ done(); }); });
 ldr.load(IMG+SC.bg,function(t){ t.encoding=T.sRGBEncoding; TX.bg=t; done(); },undefined,done);

 function start(){
  if(!GAME.on)return;
  S.crys--; save(); gScore('🔮'+S.crys); document.getElementById('gTitle').textContent=((friendById(RN)||{}).e||'🦊')+' Carrera Mágica · '+SC.n;
  host.innerHTML='<div class="rn-wrap" id="rnW"><div class="rn-hud"><span id="rnHp">❤️❤️❤️</span><span id="rnSt">⭐ 0</span><span id="rnM">0 m</span></div>'
   +'<div class="rn-spd" id="rnSpd"></div><div class="rn-hitfx" id="rnHit"></div><div class="rn-pw" id="rnPw"></div><div class="rn-ask" id="rnAsk"></div><div class="rn-big" id="rnBig"></div><div class="rn-tip" id="rnTip">👈 👉 deslizá · 👆 saltá · 👇 agachate</div></div>';
  var wrap=document.getElementById('rnW'), W=wrap.clientWidth||360, H=wrap.clientHeight||600;
  var R=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); R.setClearColor(0x000000,0); R.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); R.setSize(W,H); R.outputEncoding=T.sRGBEncoding;
  wrap.insertBefore(R.domElement,wrap.firstChild);
  var scene=new T.Scene(); scene.fog=new T.Fog(SC.fog,26,82);
  var asp=W/H, FOV0=asp<0.75?60:46, cam=new T.PerspectiveCamera(FOV0,asp,0.1,400);
  scene.add(new T.HemisphereLight(0xffffff,0x6f9a4a,1.05)); var sun=new T.DirectionalLight(0xfff3d6,0.55); sun.position.set(-3,8,4); scene.add(sun);

  /* --- suelo: camino empedrado + pasto con flores (texturas dibujadas) --- */
  var roadTex=canvasTex(256,512,function(c,w,h){
   if(SC.road==='boards'){ /* muelle de tablas de madera */
    c.fillStyle='#B98250'; c.fillRect(0,0,w,h); var rb=rng(11);
    for(var y=0;y<h;y+=32){ for(var col=0;col<3;col++){ var x0=col*w/3+3, ww=w/3-6; c.fillStyle='hsl('+(26+rb()*6)+',48%,'+(52+rb()*10)+'%)'; c.fillRect(x0,y+2,ww,28); c.fillStyle='rgba(255,255,255,.18)'; c.fillRect(x0,y+4,ww,4); c.fillStyle='rgba(90,50,20,.35)'; c.fillRect(x0,y+26,ww,4); c.fillStyle='#6A4428'; c.beginPath(); c.arc(x0+8,y+16,2.4,0,7); c.arc(x0+ww-8,y+16,2.4,0,7); c.fill(); } }
    c.fillStyle='#7A4E2A'; c.fillRect(0,0,10,h); c.fillRect(w-10,0,10,h); return; }
   if(SC.road==='candy'){ /* camino de galletita con baño de chocolate y bordes de bastón */
    c.fillStyle='#D99A5B'; c.fillRect(0,0,w,h); var rc=rng(9); for(var i2=0;i2<160;i2++){ c.fillStyle='rgba(140,80,30,.35)'; c.beginPath(); c.arc(rc()*w,rc()*h,1.5+rc()*1.5,0,7); c.fill(); }
    c.fillStyle='#7A4524'; [w/3,2*w/3].forEach(function(x){ c.fillRect(x-3,0,6,h); }); c.fillStyle='rgba(255,255,255,.25)'; for(var y4=0;y4<h;y4+=40){ c.fillRect(20,y4+4,w-40,4); }
    for(var y5=0;y5<h;y5+=20){ c.fillStyle=(y5/20)%2?'#FFFFFF':'#E84A4A'; c.fillRect(0,y5,14,20); c.fillRect(w-14,y5,14,20); } return; }
   if(SC.road==='snow'){ /* nieve pisada con huellas de trineo */
    c.fillStyle='#BCD5EE'; c.fillRect(0,0,w,h); var rs=rng(5); for(var i=0;i<260;i++){ c.fillStyle=rs()<.5?'rgba(160,190,225,.35)':'rgba(255,255,255,.8)'; c.beginPath(); c.arc(rs()*w,rs()*h,1+rs()*3,0,7); c.fill(); }
    c.fillStyle='rgba(95,135,190,.55)'; [w/6,w/2,5*w/6].forEach(function(cx){ c.fillRect(cx-16,0,6,h); c.fillRect(cx+10,0,6,h); });
    c.fillStyle='#6E9BD0'; c.fillRect(0,0,16,h); c.fillRect(w-16,0,16,h); c.fillStyle='#FFFFFF'; for(var y=0;y<h;y+=18){ c.beginPath(); c.arc(5,y+9,8,0,7); c.arc(w-5,y+9,8,0,7); c.fill(); } c.fillStyle='rgba(255,255,255,.6)'; for(var y3=0;y3<h;y3+=64){ c.fillRect(w/3-2,y3,4,30); c.fillRect(2*w/3-2,y3,4,30); } return; }
   if(SC.road==='dino'){ /* sendero de tierra con huellas de dinosaurio */
    c.fillStyle='#C99A62'; c.fillRect(0,0,w,h); var rd=rng(19); for(var i3=0;i3<220;i3++){ c.fillStyle=rd()<.5?'rgba(120,80,40,.3)':'rgba(255,235,200,.35)'; c.beginPath(); c.arc(rd()*w,rd()*h,1+rd()*3,0,7); c.fill(); }
    c.fillStyle='rgba(110,70,35,.55)'; for(var yf=0;yf<h;yf+=128){ [[w/6,yf+20],[w/2,yf+84],[5*w/6,yf+40]].forEach(function(f){ var fx=f[0], fy=f[1]; c.beginPath(); c.ellipse(fx,fy+8,9,11,0,0,7); c.fill(); [-1,0,1].forEach(function(d){ c.beginPath(); c.ellipse(fx+d*8,fy-8+Math.abs(d)*4,3.5,7,d*.45,0,7); c.fill(); }); }); }
    c.fillStyle='#8A8A80'; for(var yg=0;yg<h;yg+=22){ c.fillStyle=(yg/22)%2?'#9E9C90':'#86847A'; c.beginPath(); c.roundRect(-2,yg+1,15,20,6); c.roundRect(w-13,yg+1,15,20,6); c.fill(); }
    c.fillStyle='rgba(255,255,255,.7)'; for(var yh=0;yh<h;yh+=64){ c.fillRect(w/3-3,yh,6,34); c.fillRect(2*w/3-3,yh,6,34); } return; }
   if(SC.road==='space'){ /* pista espacial de paneles metálicos con luces de neón */
    c.fillStyle='#3A2C6E'; c.fillRect(0,0,w,h); var rp=rng(17); for(var yp=0;yp<h;yp+=32){ for(var cp=0;cp<3;cp++){ var xp=cp*w/3+3, wp=w/3-6; c.fillStyle='hsl('+(252+rp()*10)+',38%,'+(34+rp()*8)+'%)'; c.fillRect(xp,yp+2,wp,28); c.fillStyle='rgba(255,255,255,.12)'; c.fillRect(xp,yp+4,wp,3); c.fillStyle='#8E7FD0'; c.beginPath(); c.arc(xp+6,yp+8,1.8,0,7); c.arc(xp+wp-6,yp+8,1.8,0,7); c.fill(); } }
    c.fillStyle='#22D3F5'; c.fillRect(0,0,12,h); c.fillRect(w-12,0,12,h); c.fillStyle='#FF5FCF'; for(var yq=0;yq<h;yq+=32){ c.fillRect(2,yq+10,8,12); c.fillRect(w-10,yq+10,8,12); }
    c.fillStyle='rgba(120,240,255,.85)'; for(var yr=0;yr<h;yr+=64){ c.fillRect(w/3-3,yr,6,34); c.fillRect(2*w/3-3,yr,6,34); } return; }
   if(SC.road==='adobe'){ /* camino de ladrillos de adobe con bordes de piedra rojiza */
    c.fillStyle='#E9B27A'; c.fillRect(0,0,w,h); var ra=rng(13); for(var ya=0;ya<h;ya+=24){ for(var xa=-20;xa<w;xa+=40){ var oa=(ya/24%2)*20; c.fillStyle='hsl('+(20+ra()*8)+',58%,'+(60+ra()*10)+'%)'; c.fillRect(xa+oa+2,ya+2,36,20); c.fillStyle='rgba(255,255,255,.22)'; c.fillRect(xa+oa+5,ya+4,24,3); } }
    c.fillStyle='#B4562E'; c.fillRect(0,0,14,h); c.fillRect(w-14,0,14,h); c.fillStyle='#8E3F20'; c.fillRect(10,0,4,h); c.fillRect(w-14,0,4,h);
    c.fillStyle='rgba(255,255,255,.7)'; for(var yb=0;yb<h;yb+=64){ c.fillRect(w/3-3,yb,6,34); c.fillRect(2*w/3-3,yb,6,34); } return; }
   c.fillStyle='#EBCB9E'; c.fillRect(0,0,w,h);
   var r=rng(7); for(var y=0;y<h;y+=22){ for(var x=-10;x<w;x+=30){ var ox=(y/22%2)*15; c.fillStyle='hsl('+(30+r()*8)+',52%,'+(70+r()*10)+'%)'; c.beginPath(); c.roundRect(x+ox+2,y+2,26,18,7); c.fill(); c.fillStyle='rgba(255,255,255,.25)'; c.fillRect(x+ox+6,y+4,14,3); } }
   c.fillStyle='#B88A5A'; c.fillRect(0,0,14,h); c.fillRect(w-14,0,14,h); c.fillStyle='#9C7046'; c.fillRect(10,0,4,h); c.fillRect(w-14,0,4,h);
   c.fillStyle='rgba(255,255,255,.75)'; for(var y2=0;y2<h;y2+=64){ c.fillRect(w/3-3,y2,6,34); c.fillRect(2*w/3-3,y2,6,34); } });
  roadTex.wrapS=roadTex.wrapT=T.RepeatWrapping; var RL=240; roadTex.repeat.set(1,RL/7);
  var road=new T.Mesh(new T.PlaneGeometry(LW*3+0.5,RL),new T.MeshLambertMaterial({map:roadTex})); road.rotation.x=-Math.PI/2; road.position.set(0,0,-RL/2+8); scene.add(road);
  var GR=SC.ground;
  var grassTex=canvasTex(256,256,function(c,w,h){ c.fillStyle=GR.base; c.fillRect(0,0,w,h); var r=rng(3);
   for(var i=0;i<500;i++){ c.fillStyle=r()<.5?GR.a:GR.b; if(GR.shells)c.fillRect(r()*w,r()*h,3,3); else c.fillRect(r()*w,r()*h,2,6); }
   if(GR.sprinkles){ for(var q3=0;q3<120;q3++){ c.save(); c.translate(r()*w,r()*h); c.rotate(r()*3.14); c.fillStyle=GR.dots[q3%5]; c.fillRect(-5,-1.5,10,3); c.restore(); } return; }
   if(GR.sparkle){ for(var q2=0;q2<40;q2++){ var gx=r()*w, gy=r()*h; c.fillStyle=q2%3?'#FFFFFF':'#BFE3FF'; c.fillRect(gx-3,gy,7,1.5); c.fillRect(gx,gy-3,1.5,7); } return; }
   if(GR.shells){ for(var q=0;q<10;q++){ var sx=r()*w, sy=r()*h; c.fillStyle=GR.dots[q%4]; c.beginPath(); if(q%2){ for(var k2=0;k2<10;k2++){ var a2=k2*Math.PI/5, rr=k2%2?2.5:6; c.lineTo(sx+Math.cos(a2)*rr,sy+Math.sin(a2)*rr); } } else c.arc(sx,sy,3.5,Math.PI,0); c.fill(); } return; }
   var cols=GR.dots; for(var j=0;j<14;j++){ var x=r()*w,y=r()*h; c.fillStyle=cols[j%4]; for(var k=0;k<5;k++){ c.beginPath(); c.arc(x+Math.cos(k*1.26)*3,y+Math.sin(k*1.26)*3,2.6,0,7); c.fill(); } c.fillStyle='#F2B632'; c.beginPath(); c.arc(x,y,1.8,0,7); c.fill(); } });
  grassTex.wrapS=grassTex.wrapT=T.RepeatWrapping; grassTex.repeat.set(30,RL/6);
  var grass=new T.Mesh(new T.PlaneGeometry(180,RL),new T.MeshLambertMaterial({map:grassTex})); grass.rotation.x=-Math.PI/2; grass.position.set(0,-0.02,-RL/2+8); scene.add(grass);
  /* horizonte: el paisaje de ChatGPT bien lejos, sin niebla */
  /* el paisaje va detrás del lienzo 3D y se acomoda al horizonte de la cámara en cada cuadro */
  wrap.style.background='url('+IMG+SC.bg+') repeat-x, '+(SC.stars?skyStars(SC.sky,W,H):'linear-gradient('+SC.sky+','+SC.sky+')'); var HZ=new T.Vector3(), bgX=0;
  function bgSync(){ HZ.set(0,0,-RL+8).project(cam); var Wd=wrap.clientWidth, Hd=wrap.clientHeight, bw=Wd*3.3, ih=bw*533/3200, hy=(1-HZ.y)/2*Hd;
   wrap.style.backgroundSize=bw+'px '+ih+'px, 100% 100%'; wrap.style.backgroundPosition=(bgX-cam.position.x*18)+'px '+(hy-ih*SC.hz)+'px, 0 0'; }

  /* --- sprites --- */
  function spr(name,w,h,anchorBottom){ var m=new T.SpriteMaterial({map:TX[name],transparent:true,alphaTest:0.04}); var s=new T.Sprite(m); s.scale.set(w,h||w*IM[name].height/IM[name].width,1); if(anchorBottom!==false)s.center.set(0.5,0); scene.add(s); return s; }
  var RW=RUNW[RN]||0.85, fox=spr(RN+'_run1',RW); var shadow=new T.Mesh(new T.CircleGeometry(0.3,24),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.22,depthWrite:false})); shadow.rotation.x=-Math.PI/2; shadow.position.y=0.01; scene.add(shadow);
  var dustTex=canvasTex(64,64,function(c){ var g=c.createRadialGradient(32,32,2,32,32,30); g.addColorStop(0,'rgba(240,225,200,.6)'); g.addColorStop(1,'rgba(250,240,220,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
  var sparkTex=canvasTex(64,64,function(c){ c.fillStyle='#FFF7C2'; c.beginPath(); for(var i=0;i<8;i++){ var a=i*Math.PI/4, r=i%2?8:30; c.lineTo(32+Math.cos(a)*r,32+Math.sin(a)*r); } c.fill(); });
  var dizzyTex=canvasTex(128,64,function(c){ c.font='40px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('💫',22,32); c.fillText('⭐',64,22); c.fillText('💫',106,32); });
  var dizzy=new T.Sprite(new T.SpriteMaterial({map:dizzyTex,transparent:true,depthTest:false})); dizzy.scale.set(0.8,0.4,1); dizzy.visible=false; scene.add(dizzy);
  var shieldS=spr('pw_shield',1.25,1.25,false); shieldS.material.opacity=0.45; shieldS.visible=false;

  /* --- estado --- */
  var knock=0, lastRamp=false, lane=0, px=0, py=0, vy=0, slide=0, onG=true, speed=9, dist=0, stars=0, hp=3, inv=0, words=0, wrongs=0, ended=false, t=0, frameT=0, dustT=0;
  /* --- modelos 3D hechos con código: rampa de madera, vagón con ruedas y plataforma turbo --- */
  var woodTex=canvasTex(128,128,function(c,w,h){ c.fillStyle='#C98A52'; c.fillRect(0,0,w,h); for(var y=0;y<h;y+=32){ c.fillStyle='#B27440'; c.fillRect(0,y+29,w,3); c.fillStyle='rgba(255,255,255,.12)'; c.fillRect(0,y+3,w,4); for(var k=0;k<3;k++){ c.strokeStyle='rgba(120,70,30,.35)'; c.beginPath(); c.moveTo(0,y+10+k*6); c.bezierCurveTo(w*.3,y+6+k*6,w*.6,y+14+k*6,w,y+9+k*6); c.stroke(); } }
   c.fillStyle='#8E5A2C'; c.fillRect(0,0,6,h); c.fillRect(w-6,0,6,h); });
  woodTex.wrapS=woodTex.wrapT=T.RepeatWrapping;
  var mWood=new T.MeshLambertMaterial({map:woodTex}), mDark=new T.MeshLambertMaterial({color:0x5A3A22}), mHub=new T.MeshLambertMaterial({color:0xFFD36B});
  function rampGeoOf(L,Hh){ var sh=new T.Shape(); sh.moveTo(0,0); sh.lineTo(L,0); sh.lineTo(L,Hh); sh.lineTo(L-0.2,Hh); sh.lineTo(0,0.04); var g=new T.ExtrudeGeometry(sh,{depth:1.22,bevelEnabled:false}); g.rotateY(Math.PI/2); g.translate(-0.61,0,0); return g; }
  var rampGeoHi=rampGeoOf(3,1.15), rampGeoLo=rampGeoOf(2.6,0.74);
  function makeRamp(lo){ var g=new T.Group(); var m=new T.Mesh(lo?rampGeoLo:rampGeoHi,mWood); g.add(m);
   var arrowTex=canvasTex(64,128,function(c,w,h){ c.fillStyle='rgba(0,0,0,0)'; c.clearRect(0,0,w,h); c.fillStyle='#FFE07A'; for(var y=10;y<h;y+=44){ c.beginPath(); c.moveTo(w/2,y); c.lineTo(w-8,y+26); c.lineTo(w/2,y+16); c.lineTo(8,y+26); c.fill(); } });
   var a=new T.Mesh(new T.PlaneGeometry(0.5,2.6),new T.MeshBasicMaterial({map:arrowTex,transparent:true})); var L=lo?2.6:3, Hh=lo?0.74:1.15; a.rotation.x=-Math.PI/2+Math.atan2(Hh,L); a.position.set(0,Hh/2+0.03,-L/2); a.scale.y=L/3; g.add(a); return g; }
  var WAG=['#E84A4A','#4A9BEF','#4CC37A','#9B6BE8','#FF9A3C'], wagMats=WAG.map(function(col){ return new T.MeshLambertMaterial({color:col}); }), roofMats=WAG.map(function(col){ var c=new T.Color(col).lerp(new T.Color(0xffffff),0.35); return new T.MeshLambertMaterial({map:woodTex,color:c}); });
  var wheelGeo=new T.CylinderGeometry(0.2,0.2,0.12,18); wheelGeo.rotateZ(Math.PI/2); var hubGeo=new T.CylinderGeometry(0.07,0.07,0.14,10); hubGeo.rotateZ(Math.PI/2);
  var WL=1.55, WH=0.74;
  function makeWagon(ci){ var g=new T.Group(), body=new T.Mesh(new T.BoxGeometry(1.2,0.5,WL-0.12),[wagMats[ci],wagMats[ci],mWood,mDark,wagMats[ci],wagMats[ci]]); body.position.y=0.44; g.add(body);
   var top=new T.Mesh(new T.BoxGeometry(1.26,0.06,WL-0.06),roofMats[ci]); top.position.y=0.71; g.add(top);
   var trim=new T.Mesh(new T.BoxGeometry(1.24,0.08,WL-0.1),mWood); trim.position.y=0.24; g.add(trim);
   [-1,1].forEach(function(sx){ [-1,1].forEach(function(sz){ var w=new T.Mesh(wheelGeo,mDark); w.position.set(sx*0.6,0.2,sz*(WL/2-0.34)); g.add(w); var hb=new T.Mesh(hubGeo,mHub); hb.position.copy(w.position); g.add(hb); g.userData.wheels=(g.userData.wheels||[]).concat([w]); }); });
   var lamp=new T.Mesh(new T.SphereGeometry(0.06,10,8),new T.MeshBasicMaterial({color:0xFFF3A0})); lamp.position.set(0,0.5,WL/2-0.05); g.add(lamp); return g; }
  var padTex=canvasTex(128,256,function(c,w,h){ var gr=c.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#FF9A3C'); gr.addColorStop(1,'#FFD36B'); c.fillStyle=gr; c.fillRect(0,0,w,h); c.fillStyle='#FFF7D6';
   for(var y=12;y<h;y+=60){ c.beginPath(); c.moveTo(w/2,y); c.lineTo(w-14,y+34); c.lineTo(w/2,y+20); c.lineTo(14,y+34); c.fill(); } c.strokeStyle='#E06E2A'; c.lineWidth=8; c.strokeRect(4,4,w-8,h-8); });
  padTex.wrapT=T.RepeatWrapping;
  function makePad(){ var m=new T.Mesh(new T.PlaneGeometry(1.15,2.2),new T.MeshBasicMaterial({map:padTex})); m.rotation.x=-Math.PI/2; m.position.y=0.02; var g=new T.Group(); g.add(m);
   var glow=new T.Mesh(new T.PlaneGeometry(1.5,2.6),new T.MeshBasicMaterial({color:0xFFE07A,transparent:true,opacity:0.35,depthWrite:false})); glow.rotation.x=-Math.PI/2; glow.position.y=0.01; g.add(glow); return g; }

  var PW={magnet:0,shoes:0,x2:0,shield:false,turbo:0}, objs=[], fx=[], nextRow=-22, rowN=0, pool=runWords(), wi=0, gateOpen=null, tipT=6;
  var keyMap={ArrowLeft:-1,ArrowRight:1};

  function hud(){ document.getElementById('rnHp').textContent='❤️'.repeat(Math.max(0,hp))+'🤍'.repeat(3-Math.max(0,hp)); document.getElementById('rnSt').textContent='⭐ '+stars; document.getElementById('rnM').textContent=Math.floor(dist)+' m';
   var p=[]; if(PW.magnet>0)p.push('<span><img src="'+IMG+'pw_magnet.webp">'+Math.ceil(PW.magnet)+'</span>'); if(PW.shoes>0)p.push('<span><img src="'+IMG+'pw_shoes.webp">'+Math.ceil(PW.shoes)+'</span>'); if(PW.x2>0)p.push('<span><img src="'+IMG+'pw_x2.webp">'+Math.ceil(PW.x2)+'</span>'); if(PW.shield)p.push('<span><img src="'+IMG+'pw_shield.webp"></span>'); if(PW.turbo>0)p.push('<span>⚡'+Math.ceil(PW.turbo)+'</span>');
   document.getElementById('rnPw').innerHTML=p.join(''); }
  function big(txt,ms){ var b=document.getElementById('rnBig'); if(!b)return; b.innerHTML=txt; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); clearTimeout(b._t); b._t=setTimeout(function(){b.classList.remove('on');},ms||1400); }

  /* --- objetos --- */
  var OB={hurdle:{w:1.25,h:0.49},log:{w:1.32,h:0.48},arch:{w:1.55,h:1.06},cart:{w:1.32,h:0.75}};
  function addObj(type,ln,z,extra){ var o=extra||{}; o.type=type; o.lane=ln; o.z=z; var x=ln*LW;
   if(OB[type]){ o.s=spr(type,OB[type].w,OB[type].h); }
   else if(type==='star'){ o.s=spr('star',0.36,0.35); o.y=o.y||0.28; o.ph=Math.random()*6; }
   else if(type==='pw'){ o.s=spr('pw_'+o.k,0.55); o.y=0.35; }
   else if(type==='deco'){ var dd=SC.deco.filter(function(d){return d[0]===o.k;})[0]; o.s=spr(o.k,dd?dd[1]:1.5); x=o.x; }
   else if(type==='ramp'){ o.s=makeRamp(o.lo); o.rl=o.lo?2.6:3; o.rh=o.lo?0.74:1.15; o.mesh=1; scene.add(o.s); }
   else if(type==='wagon'){ o.s=makeWagon(o.ci||0); o.mesh=1; scene.add(o.s); }
   else if(type==='pad'){ o.s=makePad(); o.mesh=1; scene.add(o.s); }
   else if(type==='gate'){ o.s=new T.Sprite(new T.SpriteMaterial({map:gateTex(o.w.en),transparent:true,alphaTest:0.04})); o.s.center.set(0.5,0); o.s.scale.set(1.42,1.27,1); scene.add(o.s); }
   o.s.position.set(x,o.y||0,z); objs.push(o); return o; }
  function gateTex(word){ var img=IM.gate, w=512, h=Math.round(512*img.height/img.width);
   return canvasTex(w,h,function(c){ c.drawImage(img,0,0,w,h); var fs=Math.min(64,Math.floor(230/(word.length*0.58))); c.font='900 '+fs+'px Nunito,Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle';
    c.lineWidth=7; c.strokeStyle='#FFF3D6'; c.strokeText(word,w*0.505,h*0.145); c.fillStyle='#5A2E0E'; c.fillText(word,w*0.505,h*0.145); }); }
  function starLine(ln,z,n,arc){ for(var i=0;i<n;i++){ var y=0.28; if(arc)y=0.28+Math.sin(i/(n-1)*Math.PI)*1.1; addObj('star',ln,z-i*1.1,{y:y}); } }
  function decoRow(z){ for(var side=-1;side<=1;side+=2){ var r=Math.random(), acc=0, d=SC.deco[0]; for(var i=0;i<SC.deco.length;i++){ acc+=SC.deco[i][2]; if(r<acc){d=SC.deco[i];break;} } var x=side*(d[3]?2.75:(3.1+Math.random()*3.2)); addObj('deco',0,z+Math.random()*2,{k:d[0],x:x}); } }
  function spawnRow(z){ rowN++;
   if(rowN%7===0&&pool.length>=3){ /* fila de puertas de palabras */
    var w=pool[wi++%pool.length], others=shuffle(pool.filter(function(x){return x!==w;})).slice(0,2), ws=shuffle([w].concat(others)), g={w:w,z:z,lanes:[],passed:false,announced:false};
    ws.forEach(function(x,i){ var o=addObj('gate',i-1,z,{w:x}); g.lanes.push(o); }); gateOpen=g; return 15; }
   if(PW.turbo>0){ [-1,0,1].forEach(function(ln){ starLine(ln,z,7,false); }); return 8; }
   var r0=Math.random();
   if(rowN>2&&r0<0.2){ /* trencito de vagones (con rampa adelante a veces) */
    var tl=pickR([-1,0,1]), n=2+((Math.random()*2)|0), ci=(Math.random()*WAG.length)|0, wz=z, withRamp=Math.random()<0.65;
    if(withRamp){ addObj('ramp',tl,z+WL/2+2.6,{lo:1}); }
    for(var k=0;k<n;k++){ var o=addObj('wagon',tl,wz-k*WL,{ci:ci}); }
    for(var k2=0;k2<n*2;k2++)addObj('star',tl,z-k2*0.75,{y:WH+0.3});
    var others=[-1,0,1].filter(function(l){return l!==tl;}); var ol=pickR(others); if(Math.random()<.6){ var t2=pickR(['hurdle','log','arch']); addObj(t2,ol,z-1); } else starLine(ol,z+1,5,false);
    return n*WL+9; }
   if(rowN>2&&r0<0.28){ /* rampa sola: vuelo con estrellas */
    var rl=pickR([-1,0,1]); addObj('ramp',rl,z+3); for(var k3=0;k3<8;k3++)addObj('star',rl,z-1.2-k3*1.05,{y:1.25+Math.sin(k3/7*Math.PI)*1.5}); return 16; }
   if(rowN>3&&r0<0.33&&PW.turbo<=0){ var pl=pickR([-1,0,1]); addObj('pad',pl,z); starLine(pl,z-3,4,false); return 10; }
   var nBlock=Math.random()<0.45?1:2, lanes=shuffle([-1,0,1]), blocked=lanes.slice(0,nBlock), free=lanes.slice(nBlock);
   if(speed<10.5)nBlock=1;
   blocked.forEach(function(ln){ var r=Math.random(), type=r<.3?'hurdle':r<.55?'log':r<.78?'arch':'cart'; if(nBlock===2&&type==='cart'&&blocked.every(function(){return true;}))type=Math.random()<.5?'hurdle':'arch'; addObj(type,ln,z);
    if((type==='hurdle'||type==='log')&&Math.random()<.6)starLine(ln,z+2.2,5,true); });
   free.forEach(function(ln,i){ if(i===0&&Math.random()<.75)starLine(ln,z+3,6,false); });
   if(Math.random()<.11){ var k=pickR(['magnet','shoes','shield','x2']); addObj('pw',free[free.length-1],z-4,{k:k}); }
   return Math.max(9,15-speed*0.28); }
  for(var dz=-6;dz>-80;dz-=4)decoRow(dz);

  function remove(o){ scene.remove(o.s); if(!o.mesh){ if(o.type==='gate'){ o.s.material.map.dispose(); } o.s.material.dispose(); } o.dead=true; }
  function puff(x,y,z,n,tex,col){ for(var i=0;i<n;i++){ var s=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,color:col||0xffffff})); s.position.set(x+(Math.random()-.5)*0.3,y,z); var sc=tex===sparkTex?0.25:0.14+Math.random()*0.1; s.scale.set(sc,sc,1); scene.add(s);
   fx.push({s:s,vx:(Math.random()-.5)*(tex===sparkTex?3:0.6),vy:tex===sparkTex?1.5+Math.random()*2:0.4+Math.random()*0.5,vz:tex===sparkTex?(Math.random()-.5)*2:1.5,life:tex===sparkTex?0.5:0.6,max:tex===sparkTex?0.5:0.6,grow:tex===sparkTex?0:1.6}); } }

  /* --- controles --- */
  function move(d){ if(ended)return; var nl=Math.max(-1,Math.min(1,lane+d)); if(nl!==lane){ lane=nl; SFX.lane(d); } else tone(200,.08,'sine',.1,0); }
  function jump(){ if(ended)return; if(onG){ vy=PW.shoes>0?10.2:7.6; onG=false; slide=0; SFX.jump(); } }
  function duck(){ if(ended)return; slide=0.75; if(!onG)vy=-14; tone(300,.1,'sine',.1,0); }
  var sx=0,sy=0,sw=false;
  wrap.addEventListener('touchstart',function(e){ var p=e.touches[0]; sx=p.clientX; sy=p.clientY; sw=false; },{passive:true});
  wrap.addEventListener('touchmove',function(e){ e.preventDefault(); if(sw)return; var p=e.touches[0], dx=p.clientX-sx, dy=p.clientY-sy; if(Math.max(Math.abs(dx),Math.abs(dy))<26)return; sw=true; if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1); else if(dy<0)jump(); else duck(); },{passive:false});
  wrap.addEventListener('touchend',function(){ if(!sw)jump(); });
  var md=null; wrap.addEventListener('mousedown',function(e){ md=[e.clientX,e.clientY]; }); wrap.addEventListener('mouseup',function(e){ if(!md)return; var dx=e.clientX-md[0], dy=e.clientY-md[1]; md=null; if(Math.max(Math.abs(dx),Math.abs(dy))<26){jump();return;} if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1); else if(dy<0)jump(); else duck(); });
  function onKey(e){ if(!GAME.on)return; if(e.key==='ArrowLeft')move(-1); else if(e.key==='ArrowRight')move(1); else if(e.key==='ArrowUp'||e.key===' ')jump(); else if(e.key==='ArrowDown')duck(); }
  window.addEventListener('keydown',onKey);
  window.__cart=function(){ addObj('cart',lane,-5); };
  window.__pause=function(v){ running=!v; };
  window.__add=function(){ addObj('ramp',0,-8,{lo:1}); for(var k=0;k<3;k++)addObj('wagon',0,-10.6-0.78-k*WL,{ci:k}); addObj('pad',1,-30); };
  window.__run={move:move,jump:jump,duck:duck,st:function(){return {lane:lane,py:py,onG:onG,slide:slide,objs:objs,gate:gateOpen,stars:stars,hp:hp,dist:dist,ended:ended,speed:speed,turbo:PW.turbo};}};

  /* --- choques y premios --- */
  function hit(o,keep){ if(inv>0||PW.turbo>0)return; if(PW.shield){ PW.shield=false; shieldS.visible=false; inv=1; tone(900,.2,'triangle',.15,0); puff(px,0.5,0,10,sparkTex,0x9FE3FF); big('🛡️ ¡El escudo te salvó!',1000); if(!keep)remove(o); hud(); return; }
   hp--; inv=1.6; speed=Math.max(8,speed*0.82); SFX.hit(); if(navigator.vibrate)try{navigator.vibrate([60,40,90]);}catch(e){} cam.userData.shake=0.6; knock=0.9; if(onG){ vy=4.2; onG=false; }
   var fl=document.getElementById('rnHit'); if(fl){ fl.classList.remove('on'); void fl.offsetWidth; fl.classList.add('on'); } dizzy.visible=true; puff(px,0.6,0.1,8,sparkTex,0xFFFFFF);
   if(!keep)remove(o); else { lane=lane===1?0:lane+1; } hud(); if(hp<=0)end(); else big(hp===1?'¡Cuidado! 💥 Te queda 1 ❤️':'¡Uy! 💥',900); }
  function speedFx(on){ var e=document.getElementById('rnSpd'); if(e)e.classList.toggle('on',on); }
  function turbo(){ PW.turbo=4.5; inv=0; SFX.turbo(); big('⚡ ¡TURBO! ⚡',1000); say('Turbo!'); speedFx(true); hud(); }
  function getStar(o){ var v=PW.x2>0?2:1; stars+=v; remove(o); puff(o.s.position.x,o.s.position.y+0.1,o.z,4,sparkTex); SFX.star(stars); hud(); }
  function getPw(o){ remove(o); SFX.power(); puff(o.s.position.x,0.5,o.z,10,sparkTex);
   var names={magnet:['¡Imán!','magnet'],shoes:['¡Súper salto!','super jump'],shield:['¡Escudo!','shield'],x2:['¡Estrellas x2!','double stars']}[o.k];
   if(o.k==='shield'){PW.shield=true;shieldS.visible=true;} else PW[o.k]=10; big('<img src="'+IMG+'pw_'+o.k+'.webp"> '+names[0],1200); say(names[1]); hud(); }
  function passGate(g){ g.passed=true; var mine=g.lanes.filter(function(o){return o.lane===lane;})[0], ok=mine&&mine.w===g.w;
   document.getElementById('rnAsk').classList.remove('on');
   if(ok){ words++; var v=(PW.x2>0?2:1)*10; stars+=v; markWord(g.w,true); burst(40); SFX.gate(); sayBoth(g.w.en,g.w.es); big('✨ <b>'+g.w.en+'</b> = '+g.w.es+' · +'+v+' ⭐',1700); }
   else { wrongs++; markWord(g.w,false); SFX.wrong(); say(g.w.en); big('🙈 Era <b>'+g.w.en+'</b> = '+g.w.es,1900); }
   g.lanes.forEach(function(o){ o.fade=true; }); hud(); }

  function end(){ if(ended)return; ended=true; var m=Math.floor(dist), gems=Math.floor(stars/5)+words*3, rec=m>S.run.best; if(rec)S.run.best=m; S.run.stars=(S.run.stars||0)+stars; S.gems+=gems; save();
   setTimeout(function(){ if(!GAME.on)return; GAME.stop(); var b=document.getElementById('rewBody');
    b.innerHTML='<div class="chest">'+(rec?'🏆':'🦊')+'</div><h2>'+(rec?'¡Nuevo récord!':'¡Buena carrera!')+'</h2><div class="rn-res"><div><b>'+m+' m</b><span>recorridos</span></div><div><b>'+stars+' ⭐</b><span>estrellas</span></div><div><b>'+words+'</b><span>palabras</span></div></div>'
     +'<div class="rewpill">💎 +'+gems+' · 🔮 te quedan '+(S.crys||0)+'</div>'+((S.crys||0)>0?'<button class="btn teal" onclick="startRun()">Otra carrera · 1 🔮</button><div style="height:8px"></div>':'<p style="font-size:13px">Estudiá para ganar más 🔮</p>')
     +'<button class="btn ghost" onclick="openArcade()">Volver a la Sala de Juegos</button>';
    show('s-reward'); sWin(); },900); }

  /* --- bucle --- */
  var last=0, running=false, cdown=3;
  function update(dt){ t+=dt; if(!running)return;
   speed=Math.min(21,speed+dt*0.16); var sp=PW.turbo>0?Math.max(22,speed*1.7):speed, dz=sp*dt; dist+=dz;
   if(PW.turbo>0){ PW.turbo-=dt; if(Math.random()<0.5)puff(px+(Math.random()-.5)*0.5,py+0.3,0.3,1,sparkTex,0xFFD36B); if(PW.turbo<=0){ PW.turbo=0; inv=1.2; speedFx(false); hud(); } }
   roadTex.offset.y+=dz/7; grassTex.offset.y+=dz/6; bgX-=dt*1.5;
   /* filas nuevas */
   nextRow+=dz; if(nextRow>=0){ nextRow=-spawnRow(-78); }
   if(Math.random()<dz/4.5)decoRow(-80);
   /* jugador */
   px+=(lane*LW-px)*Math.min(1,dt*14);
   var gh=groundAt(), onRamp=gh.r;
   if(onG){ if(gh.h<py-0.04){ if(lastRamp&&!onRamp){ var wAhead=objs.some(function(q){return !q.dead&&q.type==='wagon'&&Math.abs(q.lane*LW-px)<0.62&&q.z+WL/2>-3&&q.z-WL/2<0.5;}); vy=wAhead?1.5:(PW.shoes>0?9.5:7.8); SFX.whoosh(); big('¡Wiii! 🛝',700); } onG=false; } else py=gh.h; }
   if(!onG){ vy-=24*dt; py+=vy*dt; if(py<=gh.h&&vy<=0){ py=gh.h; vy=0; onG=true; puff(px,py+0.05,0.2,5,dustTex); SFX.land(); } }
   lastRamp=onRamp;
   if(slide>0)slide-=dt; if(inv>0)inv-=dt; ['magnet','shoes','x2'].forEach(function(k){ if(PW[k]>0){ PW[k]-=dt; if(PW[k]<=0){PW[k]=0;hud();} } });
   frameT+=dt*speed/5.5; var fr=RN+(!onG?'_jump':slide>0?'_slide':(Math.floor(frameT*3)%2?'_run2':'_run1'));
   if(fox.material.map!==TX[fr]){ fox.material.map=TX[fr]; var im=IM[fr]; fox.scale.set(RW,RW*im.height/im.width,1); }
   var bob=onG&&slide<=0?Math.abs(Math.sin(frameT*Math.PI*1.5))*0.05:0;
   fox.position.set(px,py+bob,0); fox.material.opacity=1; if(knock>0){ knock-=dt; var k=knock/0.9; fox.material.rotation=Math.sin(k*Math.PI*3)*0.9*k; fox.position.z=0.9*Math.sin(k*Math.PI)*0.9; var sq=1+Math.sin(k*Math.PI*4)*0.12*k; fox.scale.x*=sq; } else { fox.material.rotation=0; }
   if(dizzy.visible){ dizzy.position.set(px,fox.position.y+fox.scale.y+0.12,fox.position.z); dizzy.material.rotation=t*6; if(inv<=0.4)dizzy.visible=false; }
   shadow.position.x=px; var sh=Math.max(0.35,1-py*0.35); shadow.scale.set(sh,sh,sh); shadowM(1-py*0.25);
   shieldS.position.set(px,py+0.5,0.05); if(shieldS.visible){ var ps=1.2+Math.sin(t*5)*0.05; shieldS.scale.set(ps,ps,1); }
   dustT+=dt; if(onG&&slide<=0&&dustT>0.16){ dustT=0; puff(px+(Math.random()-.5)*0.2,0.06,0.25,1,dustTex); }
   /* cámara que sigue al zorrito */
   var sh2=cam.userData.shake||0; if(sh2>0)cam.userData.shake=Math.max(0,sh2-dt);
   cam.position.x+=(px*0.75-cam.position.x)*Math.min(1,dt*6); cam.position.y=1.85+py*0.25+(sh2?(Math.random()-.5)*sh2*0.4:0); cam.position.z=3.35;
   cam.lookAt(cam.position.x*0.6,0.55+py*0.2,-6); cam.fov+=(FOV0+(speed-9)*0.45+(PW.turbo>0?13:0)-cam.fov)*dt*2; cam.updateProjectionMatrix();
   /* objetos */
   var mag=PW.magnet>0;
   for(var i=0;i<objs.length;i++){ var o=objs[i]; if(o.dead)continue; o.z+=dz; var s=o.s;
    if(o.type==='star'){ var sc=Math.abs(Math.cos(t*3.2+o.ph)); s.scale.x=0.36*Math.max(0.18,sc); s.position.y=o.y+Math.sin(t*4+o.ph)*0.05;
     if(mag&&o.z>-9&&o.z<0.5){ s.position.x+=(px-s.position.x)*Math.min(1,dt*7); o.y+=(py+0.3-o.y)*Math.min(1,dt*7); o.z+=(0-o.z)*Math.min(1,dt*4); } }
    if(o.type==='pw'){ s.position.y=0.35+Math.sin(t*3)*0.08; }
    if(o.type==='wagon'){ (s.userData.wheels||[]).forEach(function(w){ w.rotation.x-=dz*3; }); }
    if(o.type==='pad'){ padTex.offset.y-=dt*1.5; }
    if(o.fade){ s.material.opacity=Math.max(0,s.material.opacity-dt*2.5); }
    s.position.z=o.z;
    /* choques en la fila del jugador */
    if(o.z>-0.45&&o.z<0.45&&!o.done){
     var same=Math.abs(s.position.x-px)<0.62;
     if(same){ if(o.type==='hurdle'||o.type==='log'){ if(py<0.42){o.done=true;hit(o);} }
      else if(o.type==='arch'){ if(slide<=0||py>0.2){o.done=true;hit(o);} }
      else if(o.type==='cart'){ o.done=true; hit(o); }
      else if(o.type==='pad'){ o.done=true; turbo(); }
      else if(o.type==='star'){ if(Math.abs(s.position.y-(py+0.35))<0.6){o.done=true;getStar(o);} }
      else if(o.type==='pw'){ if(Math.abs(0.35-(py+0.35))<0.75){o.done=true;getPw(o);} } } }
    if(o.type==='wagon'&&!o.done&&Math.abs(o.lane*LW-px)<0.62&&o.z+WL/2>-0.1&&o.z-WL/2<0.1&&py<WH-0.3){ o.done=true; if(PW.turbo>0){ o.done=true; } else { hit(o,true); } }
    if(o.z>4)remove(o); }
   objs=objs.filter(function(o){return !o.dead;});
   /* puertas de palabras */
   if(gateOpen){ var g=gateOpen, gz=g.lanes[0]?g.lanes[0].z:0;
    if(!g.announced&&gz>-46){ g.announced=true; var a=document.getElementById('rnAsk'); a.innerHTML='<b>'+g.w.e+'</b><span>🔊 Pasá por la palabra</span>'; a.classList.add('on'); say(g.w.en,0.85); a.onclick=function(){say(g.w.en,0.75);}; }
    if(g.announced&&!g.said2&&gz>-20){ g.said2=true; say(g.w.en,0.85); }
    if(!g.passed&&gz>-0.1){ passGate(g); gateOpen=null; } }
   /* partículas */
   fx.forEach(function(f){ f.life-=dt; var s=f.s; s.position.x+=f.vx*dt; s.position.y+=f.vy*dt; s.position.z+=(f.vz+speed*0.15)*dt; if(f.grow){var g2=s.scale.x+f.grow*dt*0.4; s.scale.set(g2,g2,1);} s.material.opacity=Math.max(0,f.life/f.max); if(f.life<=0){ scene.remove(s); s.material.dispose(); } });
   fx=fx.filter(function(f){return f.life>0;});
   if(tipT>0){ tipT-=dt; if(tipT<=0){ var tp=document.getElementById('rnTip'); if(tp)tp.classList.add('off'); } }
   if(Math.floor(dist/10)!==Math.floor((dist-dz)/10))hud();
  }
  function groundAt(){ var h=0, r=false, w=false;
   for(var i=0;i<objs.length;i++){ var o=objs[i]; if(o.dead||Math.abs(o.lane*LW-px)>0.62)continue;
    if(o.type==='ramp'&&o.z>0&&o.z-o.rl<0){ var hh=Math.min(o.rh,o.z/o.rl*o.rh); if(hh>h){h=hh;r=!o.lo;} }
    if(o.type==='wagon'&&Math.abs(o.z)<WL/2&&py>=WH-0.25){ if(WH>h){h=WH;w=true;r=false;} } }
   return {h:h,r:r,w:w}; }
  function shadowM(o){ shadow.material.opacity=0.22*Math.max(0.3,o); }
  function loop(ts){ if(!GAME.on){ cleanup(); return; } var dt=Math.min(0.05,last?(ts-last)/1000:0.016); last=ts; update(dt); R.render(scene,cam); bgSync(); GAME.raf=requestAnimationFrame(loop); }
  function cleanup(){ window.removeEventListener('keydown',onKey); try{ R.dispose(); R.forceContextLoss(); }catch(e){} CLEAN=null; }
  CLEAN=cleanup;
  function resize(){ var w=wrap.clientWidth, h=wrap.clientHeight; if(!w||!h)return; R.setSize(w,h); cam.aspect=w/h; asp=w/h; cam.updateProjectionMatrix(); }
  window.addEventListener('resize',resize);
  cam.position.set(0,1.85,3.35); cam.lookAt(0,0.55,-6); hud();
  big('3',800); say('Three');
  var cd=setInterval(function(){ if(!GAME.on){clearInterval(cd);return;} cdown--; if(cdown>0){ big(String(cdown),800); say(cdown===2?'Two':'One'); tone(500,.15,'square',.12,0); } else { clearInterval(cd); big('¡A correr! 🦊',800); say('Go!'); tone(900,.3,'square',.14,0); running=true; } },1000);
  GAME.raf=requestAnimationFrame(loop);
 }
}
})();
function skyStars(col,w,h){ var c=document.createElement('canvas'); c.width=Math.max(50,w|0); c.height=Math.max(50,h|0); var x=c.getContext('2d'); x.fillStyle=col; x.fillRect(0,0,c.width,c.height); var r=rng(5); for(var i=0;i<c.width*c.height/2600;i++){ var sx=r()*c.width, sy=r()*c.height, s=r(); x.fillStyle=s<.15?'#FFE9A8':s<.3?'#B8E8FF':'#FFFFFF'; x.globalAlpha=.45+r()*.55; x.beginPath(); x.arc(sx,sy,s<.08?2.2:.6+r()*1.1,0,7); x.fill(); } x.globalAlpha=1; return 'url('+c.toDataURL()+')'; }
