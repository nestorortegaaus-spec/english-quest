/* 🦖 DINO AVENTURA — aventura 3D para explorar (three.js, lib/three.min.js).
   El dino bebé recorre una isla: junta gemas, encuentra los 5 huevos (al nacer, cada dino bebé le pregunta una palabra en inglés),
   embiste a los bichitos gruñones y entra al portal. Mundos que se destraban en cadena (S.dino.unl).
   Arte: protagonista de ChatGPT en img/dino/ (de espaldas: run1, run2, jump, charge); bichitos en img/dino/e_<mundo>.webp.
   Si falta una imagen, usa un dibujo de reemplazo para que el juego igual funcione. */
(function(){
var DIMG='img/dino/', CLEAN=null, PWID={run1:443,run2:435,jump:438,charge:553}; /* ancho real de cada pose (px) para que el dino no cambie de tamaño */
function loadScript(src,cb){ var s=document.createElement('script'); s.src=src; s.onload=cb; s.onerror=function(){ toast('No pude cargar el juego. Probá con internet.'); }; document.head.appendChild(s); }
function dinoWords(){ var out=[], seen={};
 try{ var wi=worldInfo(S.world||1); (wi.u||[]).forEach(function(i){ UNITS[i].w.forEach(function(w){ if(/^[a-z ]+$/i.test(w.en)&&w.en.length<=12&&w.e&&!seen[w.en]){seen[w.en]=1;out.push(w);} }); }); }catch(e){}
 [0,1,2,3,7].forEach(function(i){ if(UNITS[i])UNITS[i].w.forEach(function(w){ if(/^[a-z ]+$/i.test(w.en)&&w.en.length<=12&&w.e&&!seen[w.en]){seen[w.en]=1;out.push(w);} }); });
 return prioW(out); }
/* 🗺️ mundos: horizonte y decorados (arte de la Carrera Mágica), colores del pasto, la arena y el agua */
var DW=[
 {id:'valley',foe:'e_beetle',n:'Valle Dino',e:'🦖',seed:5,bg:'bg_dino.jpg',sky:'#0098FD',hz:0.8,fog:0xA6DA84,grass:'#6CC24A',sand:'#EAD59B',rock:'#A89F91',water:'#38C3EA',en:'🪲',
  deco:[['dn_fern',2.6],['dn_fern',2.6],['dn_brachio',4.2],['dn_nest',1.5],['dn_trice',2.2]]},
 {id:'jungle',foe:'e_beetle',n:'Selva Escondida',e:'🐒',seed:17,bg:'bg_jungle.jpg',sky:'#2B9BE0',hz:0.82,fog:0x7CBF6A,grass:'#4FA83A',sand:'#D9C08A',rock:'#8F8A7A',water:'#2FB8C8',en:'🐍',
  deco:[['j_palm',5.2],['j_palm',5.2],['j_plant',2.6],['j_statue',2.8],['j_toucan',2.4]]},
 {id:'desert',foe:'e_crab',n:'Oasis de Arena',e:'🐪',seed:29,bg:'bg_desert.jpg',sky:'#0590FE',hz:0.8,fog:0xF2C66A,grass:'#F2C14E',sand:'#F6D58A',rock:'#C9764A',water:'#35C6E0',en:'🦂',
  deco:[['de_cactus',3.2],['de_cactus',3.2],['de_palm',4.6],['de_arch',3.4],['de_camel',2.6]]},
 {id:'snow',foe:'e_snowman',n:'Montaña Nevada',e:'❄️',seed:41,bg:'bg_snow.jpg',sky:'#0086FD',hz:0.8,fog:0xE4F1FF,grass:'#F4F9FF',sand:'#DCE9F7',rock:'#9FB3C8',water:'#8FD3F5',en:'⛄',
  deco:[['s_pine',4.6],['s_pine',4.6],['s_snowman',2.4],['s_sled',2],['s_igloo',3]]},
 {id:'space',foe:'e_alien',n:'Planeta Cristal',e:'🚀',seed:53,stars:1,bg:'bg_space.jpg',sky:'#050260',hz:0.8,fog:0x8C5AD8,grass:'#9A5FE0',sand:'#7E4CC4',rock:'#5B4A9A',water:'#3A2C8E',en:'👾',
  deco:[['sp_crystal',2.6],['sp_crystal',2.6],['sp_rocket',3.4],['sp_alien',2],['sp_dish',2.8]]}
];

window.startDino=function(){
 if(CLEAN){ try{CLEAN();}catch(e){} CLEAN=null; }
 var host=gSetup('🦖 Dino Aventura'); GAME.quiet=true; ARCADE_RET=true;
 if(!S.dino)S.dino={unl:1,done:{},sel:0,eggs:0}; if(!S.dino.done)S.dino.done={}; gScore('🔮'+(S.crys||0));
 host.innerHTML='<div class="rn-start bg-start dn-start"><div class="dn-hero">🦖</div><h2>Dino Aventura</h2>'
  +'<div class="rn-howto"><span><b>🕹️</b>mové el dino con el círculo de la izquierda</span><span><b>⬆️ 💥</b>saltá y embestí con los botones</span>'
  +'<span><b>🥚</b>encontrá los 5 huevos: ¡cada dino bebé te pregunta una palabra!</span><span><b>💎 🌀</b>juntá gemas y entrá al portal</span></div>'
  +'<div class="bg-tracks">'+DW.map(function(w,i){ var lock=i>=S.dino.unl, ok=S.dino.done[w.id];
    return '<button class="bg-tr'+(lock?' lock':'')+(S.dino.sel===i?' on':'')+'" data-i="'+i+'" style="background-image:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.45)),url(img/run/'+w.bg+')"><b>'+(lock?'🔒':w.e)+'</b><span>'+w.n+'</span><small>'+(lock?'Terminá el mundo anterior':ok?'✅ 💎 '+ok:'¡Nuevo!')+'</small></button>'; }).join('')+'</div>'
  +(S.dino.eggs?'<div class="rn-best">🥚 Huevos encontrados: '+S.dino.eggs+'</div>':'')
  +'<button class="btn teal" id="dnGo">¡A explorar! · 1 🔮</button><button class="btn ghost" onclick="openArcade()">← Volver</button></div>';
 var hero=new Image(); hero.onload=function(){ var h=host.querySelector('.dn-hero'); if(h)h.innerHTML='<img src="'+DIMG+'run1.webp" alt="">'; }; hero.src=DIMG+'run1.webp';
 if(window.musicStart)musicStart();
 host.querySelectorAll('.bg-tr').forEach(function(b){ b.onclick=function(){ var i=+b.dataset.i; if(i>=S.dino.unl){sBad();toast('🔒 Terminá el mundo anterior (5 huevos + portal)');return;} S.dino.sel=i; save(); sTap(); host.querySelectorAll('.bg-tr').forEach(function(x){x.classList.toggle('on',x===b);}); }; });
 document.getElementById('dnGo').onclick=function(){
  if((S.crys||0)<1){ sBad(); toast('Necesitás 🔮. ¡Estudiá un poco para ganar cristales!'); return; }
  sTap(); if(window.musicStop)musicStop(); host.innerHTML='<div class="rn-load">Cargando… 🦖</div>';
  if(window.THREE)play(host); else loadScript('lib/three.min.js',function(){ play(host); }); };
};

function canvasTex(w,h,draw){ var c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); var t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }
function emojiTex(e,sz){ return canvasTex(sz||128,sz||128,function(c,w,h){ c.font=(w*0.8|0)+'px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(e,w/2,h*0.55); }); }

function play(host){
 var T=THREE, WD=DW[Math.min(S.dino.sel||0,S.dino.unl-1)];
 var deco=WD.deco.map(function(d){return d[0];}).filter(function(n,i,a){return a.indexOf(n)===i;});
 var TX={}, IM={}, ldr=new T.TextureLoader(), list=[];
 ['run1','run2','jump','charge'].forEach(function(n){ list.push([n,DIMG+n+'.webp']); });
 if(WD.foe)list.push(['enemy',DIMG+WD.foe+'.webp']); list.push(['egg',DIMG+'egg.webp']);
 deco.forEach(function(n){ list.push([n,'img/run/'+n+'.webp']); }); ['dn_trice','dn_brachio'].forEach(function(n){ if(deco.indexOf(n)<0)list.push([n,'img/run/'+n+'.webp']); });
 var left=list.length; function done(){ if(--left===0)start(); }
 list.forEach(function(it){ ldr.load(it[1],function(t){ t.encoding=T.sRGBEncoding; t.anisotropy=4; TX[it[0]]=t; IM[it[0]]=t.image; done(); },undefined,done); });

 function start(){
  if(!GAME.on)return;
  /* reemplazos si todavía no está el arte */
  if(!TX.run1){ var ph=emojiTex('🦖',256); ['run1','run2','jump','charge'].forEach(function(n){ TX[n]=ph; IM[n]={width:1,height:1}; }); }
  ['run2','jump','charge'].forEach(function(n){ if(!TX[n]){ TX[n]=TX.run1; IM[n]=IM.run1; } });
  if(!TX.enemy){ TX.enemy=emojiTex(WD.en,128); IM.enemy={width:1,height:1}; }
  S.crys--; save(); gScore('🔮'+S.crys); document.getElementById('gTitle').textContent=WD.e+' Dino Aventura · '+WD.n;
  host.innerHTML='<div class="rn-wrap dn-wrap" id="dnW"><div class="rn-hud dn-hud"><span id="dnHp">❤️❤️❤️</span><span id="dnEgg">🥚 0/5</span><span id="dnGem">💎 0</span></div>'
   +'<div class="dn-arrow" id="dnArr"><i>⬆</i><small id="dnArrL">🥚</small></div>'
   +'<div class="rn-big" id="dnBig"></div><div class="rn-hitfx" id="dnHit"></div>'
   +'<div class="dn-joy" id="dnJoy"><div class="dn-knob" id="dnKnob"></div></div>'
   +'<button class="dn-btn jump" id="dnJump">⬆️</button><button class="dn-btn dash" id="dnDash">💥</button><div class="dn-quiz" id="dnQ"></div></div>';
  var wrap=document.getElementById('dnW'), W=wrap.clientWidth||360, H=wrap.clientHeight||600;
  var R=new T.WebGLRenderer({antialias:true,alpha:true}); R.setClearColor(0,0); R.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); R.setSize(W,H); R.outputEncoding=T.sRGBEncoding;
  wrap.insertBefore(R.domElement,wrap.firstChild);
  var scene=new T.Scene(); scene.fog=new T.Fog(WD.fog,38,125);
  var asp=W/H, cam=new T.PerspectiveCamera(asp<0.75?64:50,asp,0.1,500);
  scene.add(new T.HemisphereLight(0xffffff,0x8a7a5a,0.95)); var sun=new T.DirectionalLight(0xfff3d6,0.6); sun.position.set(-4,10,3); scene.add(sun);
  wrap.style.background='url(img/run/'+WD.bg+') repeat-x, '+(WD.stars&&window.skyStars?skyStars(WD.sky,W,H):'linear-gradient('+WD.sky+','+WD.sky+')');

  /* --- la isla: colinas suaves, una montaña, playa y agua alrededor --- */
  var rnd=rng(WD.seed), RAD=58, HILL={x:-6,z:-24,r:17,h:5.5};
  function sstep(a,b,x){ var t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); }
  function th(x,z){ var d=Math.sqrt(x*x+z*z), base=0.7+0.45*Math.sin(x*0.09+1)*Math.cos(z*0.08)+0.3*Math.sin((x-z)*0.05);
   var hd=((x-HILL.x)*(x-HILL.x)+(z-HILL.z)*(z-HILL.z))/(HILL.r*HILL.r), hill=hd<1?HILL.h*(1-hd)*(1-hd)*(1+0.3*(1-hd)):0;
   var f=sstep(RAD-11,RAD+2,d); return (base+hill)*(1-f)-2.6*f; }
  var noiseTex=canvasTex(256,256,function(c,w,h){ c.fillStyle='#ffffff'; c.fillRect(0,0,w,h); var r=rng(3); for(var i=0;i<1600;i++){ var g=200+(r()*55|0); c.fillStyle='rgb('+g+','+g+','+g+')'; c.fillRect(r()*w,r()*h,2+r()*3,2+r()*3); }
   for(var j=0;j<40;j++){ c.fillStyle=['#FFE07A','#FF8DC7','#FFFFFF'][j%3]; c.beginPath(); c.arc(r()*w,r()*h,2.2,0,7); c.fill(); } });
  noiseTex.wrapS=noiseTex.wrapT=T.RepeatWrapping; noiseTex.repeat.set(22,22);
  var gg=new T.PlaneGeometry(160,160,120,120); gg.rotateX(-Math.PI/2); var gp=gg.attributes.position, cols=[], cG=new T.Color(WD.grass), cS=new T.Color(WD.sand), cc=new T.Color();
  for(var i=0;i<gp.count;i++){ var x=gp.getX(i), z=gp.getZ(i), y=th(x,z); gp.setY(i,y); cc.copy(cS).lerp(cG,sstep(0.02,0.3,y)); var n=0.93+0.07*Math.sin(x*1.3+z*0.7); cols.push(cc.r*n,cc.g*n,cc.b*n); }
  gg.setAttribute('color',new T.Float32BufferAttribute(cols,3)); gg.computeVertexNormals();
  scene.add(new T.Mesh(gg,new T.MeshLambertMaterial({map:noiseTex,vertexColors:true})));
  var waterTex=canvasTex(128,128,function(c,w,h){ c.fillStyle=WD.water; c.fillRect(0,0,w,h); c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=3; for(var y=10;y<h;y+=28){ c.beginPath(); for(var x=0;x<=w;x+=8)c.lineTo(x,y+Math.sin(x/12)*4); c.stroke(); } });
  waterTex.wrapS=waterTex.wrapT=T.RepeatWrapping; waterTex.repeat.set(30,30);
  var water=new T.Mesh(new T.PlaneGeometry(700,700),new T.MeshLambertMaterial({map:waterTex,transparent:true,opacity:0.92})); water.rotation.x=-Math.PI/2; water.position.y=-0.55; scene.add(water);

  /* --- plataformas: columnas de piedra que suben a una isla flotante + escalones al otro lado --- */
  var PL=[], rockTex=canvasTex(128,128,function(c,w,h){ c.fillStyle=WD.rock; c.fillRect(0,0,w,h); var r=rng(9); for(var i=0;i<60;i++){ c.fillStyle=r()<.5?'rgba(0,0,0,.12)':'rgba(255,255,255,.15)'; c.beginPath(); c.roundRect?c.roundRect(r()*w,r()*h,14+r()*20,8+r()*10,4):c.rect(r()*w,r()*h,20,10); c.fill(); } });
  rockTex.wrapS=rockTex.wrapT=T.RepeatWrapping;
  function pillar(x,z,r,top,thick){ var bot=thick?top-thick:th(x,z)-1, hgt=top-bot, rt=rockTex.clone(); rt.needsUpdate=true; rt.repeat.set(Math.max(1,r),Math.max(1,hgt/2));
   var m=new T.Mesh(new T.CylinderGeometry(r,thick?r*0.55:r*1.08,hgt,18),[new T.MeshLambertMaterial({map:rt}),new T.MeshLambertMaterial({color:WD.grass}),new T.MeshLambertMaterial({map:rt})]);
   m.position.set(x,bot+hgt/2,z); scene.add(m); var p={x:x,z:z,r:r,top:top,bot:bot,m:m}; PL.push(p); return p; }
  var path=[], ang0=0.35;
  for(var k=0;k<6;k++){ var a=ang0+k*0.32, rr=30-k*0.6, px=Math.cos(a)*rr, pz=-Math.sin(a)*rr*0.9; path.push(pillar(px,pz,1.9,th(px,pz)+1.25*(k+1))); }
  var lp=path[5], fa=ang0+6*0.32, FI=pillar(Math.cos(fa)*27,-Math.sin(fa)*24,4.4,lp.top+1.1,2.2);
  var steps=[]; for(var s2=0;s2<4;s2++){ var sx=-30+s2*1.2, sz=8-s2*4.2; steps.push(pillar(sx,sz,2.1,th(sx,sz)+1.1*(s2+1))); }
  var LEDGE=pillar(-28,-11,4.2,steps[3].top+1,0);

  /* --- decorado (sprites del mundo), con choque suave --- */
  function spr(name,w,h){ var s=new T.Sprite(new T.SpriteMaterial({map:TX[name],transparent:true,alphaTest:0.04})); s.center.set(0.5,0); var im=IM[name]||{width:1,height:1}; s.scale.set(w,h||w*im.height/im.width,1); scene.add(s); return s; }
  var shTex=canvasTex(64,64,function(c){ var g=c.createRadialGradient(32,32,2,32,32,30); g.addColorStop(0,'rgba(0,0,0,.45)'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
  function shadow(sz){ var m=new T.Mesh(new T.PlaneGeometry(sz,sz),new T.MeshBasicMaterial({map:shTex,transparent:true,depthWrite:false})); m.rotation.x=-Math.PI/2; scene.add(m); return m; }
  var COL=[];
  function freeSpot(x,z,minD){ if(th(x,z)<0.25)return false; if(Math.sqrt(x*x+z*z)>RAD-10)return false; for(var i=0;i<PL.length;i++){ var p=PL[i]; if(Math.hypot(x-p.x,z-p.z)<p.r+minD)return false; } if(Math.hypot(x,z-40)<7)return false; return true; }
  for(var dI=0;dI<70;dI++){ var dx=(rnd()-.5)*2*RAD, dz=(rnd()-.5)*2*RAD; if(!freeSpot(dx,dz,2.5))continue; if(COL.some(function(c){return Math.hypot(c.x-dx,c.z-dz)<4;}))continue;
   var dd=WD.deco[(rnd()*WD.deco.length)|0]; if(!TX[dd[0]])continue; var s=spr(dd[0],dd[1]*(0.85+rnd()*0.3)); s.position.set(dx,th(dx,dz)-0.05,dz); COL.push({x:dx,z:dz,r:Math.min(1.4,dd[1]*0.22),s:s,w:dd[1]}); }

  /* --- gemas 3D --- */
  var GEMC=[0xFF4D6D,0x37D67A,0x3FA9F5,0xFFC83D,0xB36BFF], gemGeo=new T.OctahedronGeometry(0.42,0), gems=[], gemsGot=0;
  function gem(x,z,y){ var c=GEMC[gems.length%5], m=new T.Mesh(gemGeo,new T.MeshLambertMaterial({color:c,emissive:c,emissiveIntensity:0.35}));
   m.scale.set(1,1.45,1); var gy=(y!=null?y:th(x,z))+0.9; m.position.set(x,gy,z); scene.add(m); gems.push({m:m,y:gy,ph:gems.length*0.7}); }
  function ring(cx,cz,cy,r,n){ for(var i=0;i<n;i++){ var a=i/n*Math.PI*2; gem(cx+Math.cos(a)*r,cz+Math.sin(a)*r,cy==null?null:cy); } }
  for(var g1=0;g1<9;g1++){ var gz=34-g1*3.2; gem(Math.sin(g1*0.6)*2,gz); }
  path.forEach(function(p){ gem(p.x,p.z,p.top); }); steps.forEach(function(p){ gem(p.x,p.z,p.top); });
  ring(FI.x,FI.z,FI.top,2.6,6); ring(LEDGE.x,LEDGE.z,LEDGE.top,2.6,5); ring(HILL.x,HILL.z,null,6,8);
  for(var g2=0;g2<40&&gems.length<70;g2++){ var gx=(rnd()-.5)*2*(RAD-14), gz2=(rnd()-.5)*2*(RAD-14); if(freeSpot(gx,gz2,1.2))gem(gx,gz2); }
  var GEMS_N=gems.length;

  /* --- huevos: 5 escondidos; al tocarlos nace un dino bebé con una pregunta --- */
  var eggTex=TX.egg||canvasTex(128,128,function(c,w,h){ c.fillStyle='#FFF4DC'; c.fillRect(0,0,w,h); var r=rng(WD.seed); var cs=['#3FA9F5','#FF6FA8','#37D67A','#FFB23D','#B36BFF'];
   for(var i=0;i<16;i++){ c.fillStyle=cs[i%5]; c.beginPath(); c.arc(r()*w,r()*h,6+r()*9,0,7); c.fill(); } });
  var eggs=[], eggsGot=0;
  function egg(x,z,y){ var gy=(y!=null?y:th(x,z)); var m=TX.egg?spr('egg',1.8):new T.Mesh(new T.SphereGeometry(0.62,20,16),new T.MeshLambertMaterial({map:eggTex}));
   if(!TX.egg){ m.scale.set(1,1.3,1); m.position.set(x,gy+0.8,z); scene.add(m); } else m.position.set(x,gy,z);
   var glow=shadow(2.6); glow.material.color=new T.Color(0xFFF2A0); glow.material.opacity=0.9; glow.position.set(x,gy+0.04,z);
   eggs.push({m:m,x:x,z:z,y:gy,glow:glow,got:false}); }
  egg(FI.x,FI.z,FI.top); egg(LEDGE.x,LEDGE.z,LEDGE.top); egg(HILL.x,HILL.z);
  var far=[[38,-30],[-40,26],[30,30],[-42,-22],[44,8]].filter(function(p){return freeSpot(p[0],p[1],1);}); shuffle(far).slice(0,2).forEach(function(p){ egg(p[0],p[1]); });
  while(eggs.length<5){ var ex=(rnd()-.5)*70, ez=(rnd()-.5)*70; if(freeSpot(ex,ez,1))egg(ex,ez); }

  /* --- portal: se abre con los 5 huevos --- */
  var PX=0, PZ=30, py0=th(PX,PZ), portal=new T.Group();
  var pring=new T.Mesh(new T.TorusGeometry(2.1,0.32,12,40),new T.MeshLambertMaterial({color:0x9A8F80}));
  var pin=new T.Mesh(new T.CircleGeometry(1.9,32),new T.MeshBasicMaterial({color:0x7FE0FF,transparent:true,opacity:0.0,side:T.DoubleSide}));
  portal.add(pring); portal.add(pin); portal.position.set(PX,py0+2.4,PZ); scene.add(portal); var portalOn=false;

  /* --- bichitos gruñones --- */
  var foes=[]; for(var fI=0;fI<40&&foes.length<7;fI++){ var fx=(rnd()-.5)*2*(RAD-14), fz=(rnd()-.5)*2*(RAD-14); if(!freeSpot(fx,fz,2)||Math.hypot(fx,fz-40)<16)continue;
   var fs=spr('enemy',WD.foe==='e_snowman'?1.6:1.8); fs.position.set(fx,th(fx,fz),fz); foes.push({s:fs,x:fx,z:fz,hx:fx,hz:fz,a:rnd()*7,sh:shadow(1.6),dead:false,fly:0,vx:0,vy:0,vz:0}); }

  /* --- el dino --- */
  var me={x:0,z:40,y:th(0,40),vy:0,yaw:0,sp:0,ground:true,dash:0,dashCd:0,hurt:0,inv:0,hp:3,safe:{x:0,z:40},walk:0,kx:0,kz:0};
  var hero=spr('run1',2.3), heroSh=shadow(1.9), dz=new T.Sprite(new T.SpriteMaterial({map:canvasTex(128,64,function(c){ c.font='40px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('💫',22,32); c.fillText('⭐',64,22); c.fillText('💫',106,32); }),transparent:true,depthTest:false}));
  dz.scale.set(2,1,1); dz.visible=false; scene.add(dz);
  function groundAt(x,z,y){ var h=th(x,z); for(var i=0;i<PL.length;i++){ var p=PL[i]; if((x-p.x)*(x-p.x)+(z-p.z)*(z-p.z)<p.r*p.r&&y>=p.top-0.7)h=Math.max(h,p.top); } return h; }

  /* --- controles: joystick (izquierda) + saltar y embestir (derecha) --- */
  var joy={x:0,y:0,id:null,cx:0,cy:0}, keys={}, paused=false, ended=false, t=0;
  var jEl=document.getElementById('dnJoy'), kEl=document.getElementById('dnKnob');
  function jset(px,py){ var dx=px-joy.cx, dy=py-joy.cy, d=Math.hypot(dx,dy), m=46; if(d>m){dx*=m/d;dy*=m/d;} joy.x=dx/m; joy.y=dy/m; kEl.style.transform='translate('+dx+'px,'+dy+'px)'; }
  function jrel(){ joy.x=0; joy.y=0; joy.id=null; kEl.style.transform=''; jEl.classList.remove('on'); }
  wrap.addEventListener('touchstart',function(e){ for(var i=0;i<e.changedTouches.length;i++){ var tc=e.changedTouches[i], r=wrap.getBoundingClientRect(); if(joy.id===null&&tc.clientX-r.left<r.width*0.55&&tc.clientY-r.top>r.height*0.35&&!e.target.closest('.dn-quiz')){ joy.id=tc.identifier; var b=jEl.getBoundingClientRect(); joy.cx=b.left+b.width/2; joy.cy=b.top+b.height/2; jEl.classList.add('on'); jset(tc.clientX,tc.clientY); e.preventDefault(); } } },{passive:false});
  wrap.addEventListener('touchmove',function(e){ for(var i=0;i<e.changedTouches.length;i++){ var tc=e.changedTouches[i]; if(tc.identifier===joy.id){ jset(tc.clientX,tc.clientY); e.preventDefault(); } } },{passive:false});
  wrap.addEventListener('touchend',function(e){ for(var i=0;i<e.changedTouches.length;i++)if(e.changedTouches[i].identifier===joy.id)jrel(); });
  wrap.addEventListener('touchcancel',jrel);
  var mdown=false; jEl.addEventListener('mousedown',function(e){ mdown=true; var b=jEl.getBoundingClientRect(); joy.cx=b.left+b.width/2; joy.cy=b.top+b.height/2; jEl.classList.add('on'); jset(e.clientX,e.clientY); });
  window.addEventListener('mousemove',function(e){ if(mdown)jset(e.clientX,e.clientY); }); window.addEventListener('mouseup',function(){ if(mdown){ mdown=false; jrel(); } });
  function btn(id,fn){ var b=document.getElementById(id); ['touchstart','mousedown'].forEach(function(ev){ b.addEventListener(ev,function(e){ e.preventDefault(); e.stopPropagation(); b.classList.add('on'); fn(); },{passive:false}); }); ['touchend','mouseup','mouseleave'].forEach(function(ev){ b.addEventListener(ev,function(){ b.classList.remove('on'); }); }); }
  function jump(){ if(paused||ended)return; if(me.ground){ me.vy=11.5; me.ground=false; SFX.jump(); dust(me,5); } }
  function dash(){ if(paused||ended||me.dashCd>0||me.hurt>0)return; me.dash=0.5; me.dashCd=0.9; SFX.whoosh(); if(navigator.vibrate)try{navigator.vibrate(20);}catch(e){} }
  btn('dnJump',jump); btn('dnDash',dash);
  function onKey(e){ if(!GAME.on)return; var dn=e.type==='keydown'; keys[e.key]=dn; if(dn&&(e.key===' '||e.key==='z'))jump(); if(dn&&(e.key==='x'||e.key==='Shift'))dash(); }
  window.addEventListener('keydown',onKey); window.addEventListener('keyup',onKey);

  /* --- efectos --- */
  var confTex=canvasTex(32,32,function(c){ c.fillStyle='#fff'; c.fillRect(6,10,20,12); }), fx=[], CC=[0xFF6B6B,0xFFD36B,0x6FCF6A,0x7FC4F2,0xB58BFF];
  var dustTex=canvasTex(64,64,function(c){ var g=c.createRadialGradient(32,32,2,32,32,30); g.addColorStop(0,'rgba(240,225,190,.9)'); g.addColorStop(1,'rgba(240,225,190,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
  var sparkTex=canvasTex(64,64,function(c){ c.font='48px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('✨',32,34); });
  function burstAt(p,col,n){ for(var i=0;i<(n||1);i++){ var s=new T.Sprite(new T.SpriteMaterial({map:confTex,transparent:true,color:col||CC[(Math.random()*5)|0],depthWrite:false})); s.scale.set(0.3,0.3,1); s.position.set(p.x,(p.y||0)+0.9,p.z); scene.add(s); fx.push({s:s,vx:(Math.random()-.5)*7,vy:2+Math.random()*5,vz:(Math.random()-.5)*7,life:0.9,g:9}); } }
  function dust(p,n){ for(var i=0;i<n;i++){ var s=new T.Sprite(new T.SpriteMaterial({map:dustTex,transparent:true,depthWrite:false})); s.scale.set(1,1,1); s.position.set(p.x+(Math.random()-.5)*1.2,(p.y||0)+0.3,p.z+(Math.random()-.5)*1.2); scene.add(s); fx.push({s:s,vx:(Math.random()-.5)*2.5,vy:1+Math.random()*1.5,vz:(Math.random()-.5)*2.5,life:0.7,g:1,grow:1}); } }
  function sparkle(p){ var s=new T.Sprite(new T.SpriteMaterial({map:sparkTex,transparent:true,depthWrite:false})); s.scale.set(1.2,1.2,1); s.position.set(p.x,p.y,p.z); scene.add(s); fx.push({s:s,vx:0,vy:2.5,vz:0,life:0.6,g:0,grow:1}); }
  function big(txt,ms){ var b=document.getElementById('dnBig'); if(!b)return; b.innerHTML=txt; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); clearTimeout(b._t); b._t=setTimeout(function(){b.classList.remove('on');},ms||1400); }
  function hud(){ document.getElementById('dnHp').textContent='❤️'.repeat(Math.max(0,me.hp))+'🤍'.repeat(Math.max(0,3-me.hp)); document.getElementById('dnEgg').textContent='🥚 '+eggsGot+'/5'; document.getElementById('dnGem').textContent='💎 '+gemsGot; }

  /* --- golpe: sale despedido, mareo, temblor y destello (sin titilar) --- */
  function hurt(fromX,fromZ){ if(me.inv>0||ended)return; me.hp--; me.hurt=0.55; me.inv=1.4; var dx=me.x-fromX, dzz=me.z-fromZ, d=Math.hypot(dx,dzz)||1; me.kx=dx/d*11; me.kz=dzz/d*11; me.vy=7; me.ground=false;
   SFX.hit(); cam.userData.shake=0.5; dz.visible=true; me.dz=1.6; for(var q=0;q<8;q++)burstAt(me,0xFFE07A); var fl=document.getElementById('dnHit'); if(fl){fl.classList.remove('on');void fl.offsetWidth;fl.classList.add('on');}
   if(navigator.vibrate)try{navigator.vibrate([60,40,90]);}catch(e){} hud(); if(me.hp<=0)setTimeout(function(){ end(false); },900); else big('💥 ¡Uy!',800); }
  function beat(f){ f.dead=true; f.fly=1.2; var dx=f.x-me.x, dzz=f.z-me.z, d=Math.hypot(dx,dzz)||1; f.vx=dx/d*14; f.vz=dzz/d*14; f.vy=9; SFX.land(); tone(880,.08,'square',.1,0); cam.userData.shake=0.25;
   for(var q=0;q<12;q++)burstAt({x:f.x,y:f.s.position.y,z:f.z}); setTimeout(function(){ if(!GAME.on)return; gem(f.x,f.z,groundAt(f.x,f.z,99)); GEMS_N++; },700); }

  /* --- huevo: nace el dino bebé y pregunta una palabra --- */
  var pool=dinoWords(), wi=0, words=0;
  function hatch(e){ e.got=true; eggsGot++; S.dino.eggs=(S.dino.eggs||0)+1; scene.remove(e.m); scene.remove(e.glow); SFX.power(); for(var q=0;q<26;q++)burstAt({x:e.x,y:e.y+0.5,z:e.z}); hud();
   paused=true; var w=pool[wi++%pool.length], opts=shuffle([w].concat(shuffle(pool.filter(function(x){return x!==w&&x.e!==w.e;})).slice(0,2))), baby=pickR(['dn_trice','dn_brachio']), tries=0;
   var Q=document.getElementById('dnQ'); Q.innerHTML='<div class="dn-qbox"><img src="img/run/'+baby+'.webp" class="dn-baby" alt=""><div class="dn-qb"><b>🐣 Hi! I am a baby dino!</b><small>¡Hola! ¡Soy un dino bebé! ¿Qué es esto?</small></div>'
    +'<div class="dn-qe">'+w.e+'</div><div class="dn-qo">'+opts.map(function(o,i){return '<button data-i="'+i+'">'+o.en+'</button>';}).join('')+'</div></div>';
   Q.classList.add('on'); setTimeout(function(){ say('Hi! What is this?',0.9); },300);
   Q.querySelectorAll('.dn-qo button').forEach(function(b){ b.onclick=function(){ var o=opts[+b.dataset.i]; if(b.disabled)return;
    if(o===w){ b.classList.add('ok'); if(!tries){ words++; } markWord(w,!tries); sGood(); sayBoth(w.en,w.es); Q.querySelector('.dn-qb').innerHTML='<b>Yes! '+w.e+' '+w.en+'!</b><small>¡Sí! '+w.es+' · ¡Gracias! 💛</small>'; Q.querySelectorAll('.dn-qo button').forEach(function(x){x.disabled=true;});
     setTimeout(function(){ Q.classList.remove('on'); paused=false; last=0; if(eggsGot>=5)openPortal(); else big('🥚 '+eggsGot+'/5',1100); },2100); }
    else { tries++; b.disabled=true; b.classList.add('no'); sBad(); say(o.en); } }; }); }
  function openPortal(){ portalOn=true; pring.material.color.set(0xFFD36B); pring.material.emissive=new T.Color(0xFF9A3C); pring.material.emissiveIntensity=0.5; pin.material.opacity=0.75; SFX.gate(); big('🌀 ¡Se abrió el portal!<br><small>Volvé al principio</small>',2200); sayBoth('The portal is open!','¡Se abrió el portal!'); }

  window.__dino={me:me,eggs:eggs,gems:gems,foes:foes,PL:PL,keys:keys,joy:joy,jump:jump,dash:dash,th:th,hatch:hatch,portal:{x:PX,z:PZ},st:function(){return {eggs:eggsGot,gems:gemsGot,hp:me.hp,ended:ended,paused:paused,portal:portalOn};}};

  function end(win){ if(ended)return; ended=true; var bonus=win?20:0, got=gemsGot+eggsGot*5+bonus; S.gems+=got; var wi2=DW.indexOf(WD), nw=null;
   if(win){ var best=S.dino.done[WD.id]||0; if(gemsGot>best)S.dino.done[WD.id]=gemsGot; if(wi2+1>=S.dino.unl&&wi2+1<DW.length){ S.dino.unl=wi2+2; nw=DW[wi2+1]; } sWin(); burst(200); say('You did it!'); } else say('Oh no!');
   save();
   setTimeout(function(){ if(!GAME.on)return; GAME.stop(); var b=document.getElementById('rewBody');
    b.innerHTML='<div class="chest">'+(win?'🏆':'🦖')+'</div><h2>'+(win?'¡Terminaste '+WD.n+'!':'¡Te quedaste sin corazones!')+'</h2>'
     +(nw?'<p>🔓 ¡Nuevo mundo: '+nw.e+' '+nw.n+'!</p>':win?'':'<p>Encontrá los 5 huevos y entrá al portal para pasar de mundo</p>')
     +'<div class="rn-res"><div><b>'+gemsGot+'/'+GEMS_N+'</b><span>gemas</span></div><div><b>'+eggsGot+'/5</b><span>huevos</span></div><div><b>'+words+'</b><span>palabras</span></div></div><div class="rewpill">💎 +'+got+' · 🔮 te quedan '+(S.crys||0)+'</div>'
     +((S.crys||0)>0?'<button class="btn teal" onclick="startDino()">Jugar otra vez · 1 🔮</button><div style="height:8px"></div>':'<p style="font-size:13px">Estudiá para ganar más 🔮</p>')
     +'<button class="btn ghost" onclick="openArcade()">Volver a la Sala de Juegos</button>';
    show('s-reward'); },1600); }

  /* --- bucle --- */
  var F=new T.Vector3(), V=new T.Vector3(), camYaw=0, last=0, landed=true, tileW=W*3.3, tileH=tileW*533/3200;
  function update(dt){ t+=dt;
   waterTex.offset.x=t*0.01; waterTex.offset.y=t*0.006;
   gems.forEach(function(g){ if(g.got)return; g.m.rotation.y+=dt*2.2; g.m.position.y=g.y+Math.sin(t*2.4+g.ph)*0.15; });
   eggs.forEach(function(e){ if(e.got)return; var wob=Math.sin(t*5+e.x)*0.12; if(e.m.isSprite)e.m.material.rotation=wob; else e.m.rotation.z=wob; e.glow.material.opacity=0.55+Math.sin(t*3)*0.35; });
   if(portalOn){ portal.rotation.y+=dt*0.8; pin.material.opacity=0.55+Math.sin(t*4)*0.2; } else portal.rotation.y=Math.sin(t*0.5)*0.2;
   fx.forEach(function(f){ f.life-=dt; f.s.position.x+=f.vx*dt; f.s.position.y+=f.vy*dt; f.s.position.z+=f.vz*dt; f.vy-=f.g*dt; if(f.grow){var gs=f.s.scale.x+dt*1.6; f.s.scale.set(gs,gs,1);} f.s.material.opacity=Math.max(0,f.life/0.8); if(f.life<=0)scene.remove(f.s); }); fx=fx.filter(function(f){return f.life>0;});
   if(paused||ended&&me.hp>0)return renderCam(dt);
   /* entrada */
   var jx=joy.x+((keys.ArrowRight||keys.d)?1:0)-((keys.ArrowLeft||keys.a)?1:0), jy=joy.y+((keys.ArrowDown||keys.s)?1:0)-((keys.ArrowUp||keys.w)?1:0);
   jx=Math.max(-1,Math.min(1,jx)); jy=Math.max(-1,Math.min(1,jy));
   if(me.hurt>0){ me.hurt-=dt; jx=0; jy=0; } if(me.inv>0)me.inv-=dt; if(me.dashCd>0)me.dashCd-=dt;
   /* girar con el costado, avanzar con arriba (la cámara siempre queda atrás: el dino se ve de espaldas) */
   var fwd=-jy, turn=-jx*(Math.abs(fwd)>0.3?2.1:2.6); if(Math.abs(jx)<0.12)turn=0; me.yaw+=turn*dt;
   var want=fwd>0.15?fwd*9.5:fwd<-0.15?fwd*4:0; if(Math.abs(jx)>0.5&&fwd<=0.15&&fwd>=-0.15)want=2.5;
   if(me.dash>0){ me.dash-=dt; want=21; if(Math.random()<0.6)dust(me,1); }
   me.sp+=(want-me.sp)*Math.min(1,dt*(me.dash>0?14:7));
   F.set(-Math.sin(me.yaw),0,-Math.cos(me.yaw));
   var nx=me.x+F.x*me.sp*dt+me.kx*dt, nz=me.z+F.z*me.sp*dt+me.kz*dt; me.kx*=Math.pow(0.05,dt); me.kz*=Math.pow(0.05,dt);
   /* paredes de las columnas y troncos */
   PL.forEach(function(p){ var dx=nx-p.x, dzz=nz-p.z, d=Math.hypot(dx,dzz); if(d<p.r+0.5&&me.y<p.top-0.7&&me.y+2>p.bot){ var k=(p.r+0.5)/(d||1); nx=p.x+dx*k; nz=p.z+dzz*k; } });
   COL.forEach(function(c){ var dx=nx-c.x, dzz=nz-c.z, d=Math.hypot(dx,dzz); if(d<c.r+0.4&&me.y<th(c.x,c.z)+2){ var k=(c.r+0.4)/(d||1); nx=c.x+dx*k; nz=c.z+dzz*k; } });
   var dd=Math.hypot(nx,nz); if(dd>RAD+6){ nx*=(RAD+6)/dd; nz*=(RAD+6)/dd; }
   me.x=nx; me.z=nz;
   /* gravedad y piso */
   me.vy-=30*dt; me.y+=me.vy*dt; var gh=groundAt(me.x,me.z,me.y);
   if(me.y<=gh){ if(!me.ground&&me.vy<-6){ SFX.land(); dust(me,4); } me.y=gh; me.vy=0; me.ground=true; } else if(me.y>gh+0.05)me.ground=false;
   if(me.ground&&gh>0.2&&th(me.x,me.z)>0.2){ me.safe.x=me.x; me.safe.z=me.z; }
   /* se cae al agua: chapuzón y vuelve a la orilla */
   if(me.y<-0.35){ for(var q=0;q<10;q++)burstAt(me,0xBFEFFF); tone(300,.2,'sine',.12,0); tone(200,.25,'sine',.1,.08); me.x=me.safe.x; me.z=me.safe.z; me.y=th(me.x,me.z)+3; me.vy=0; me.sp=0; big('💦 ¡Splash!',900); }
   /* gemas */
   gems.forEach(function(g){ if(g.got)return; var p=g.m.position; if(Math.abs(p.x-me.x)<1.3&&Math.abs(p.z-me.z)<1.3&&Math.abs(p.y-0.9-me.y)<1.6){ g.got=true; scene.remove(g.m); gemsGot++; SFX.star(); sparkle(p); hud(); } });
   /* huevos */
   eggs.forEach(function(e){ if(e.got)return; if(Math.hypot(e.x-me.x,e.z-me.z)<1.6&&Math.abs(e.y-me.y)<1.8)hatch(e); });
   /* portal */
   if(portalOn&&Math.hypot(me.x-PX,me.z-PZ)<2.4&&Math.abs(me.y-py0)<2.5){ portalOn=false; SFX.gate(); for(var q2=0;q2<30;q2++)burstAt({x:PX,y:py0+1,z:PZ}); big('🌀 ¡Lo lograste!',1500); end(true); }
   /* bichitos */
   foes.forEach(function(f){
    if(f.dead){ if(f.fly>0){ f.fly-=dt; f.x+=f.vx*dt; f.z+=f.vz*dt; f.vy-=20*dt; f.s.position.set(f.x,f.s.position.y+f.vy*dt,f.z); f.s.material.rotation+=dt*14; f.sh.visible=false; if(f.fly<=0)scene.remove(f.s); } return; }
    var dx=me.x-f.x, dzz=me.z-f.z, d=Math.hypot(dx,dzz);
    if(d<9&&me.hp>0){ f.x+=dx/d*2.6*dt; f.z+=dzz/d*2.6*dt; } else { f.a+=(Math.random()-.5)*dt*2; var hx=f.hx-f.x, hz=f.hz-f.z; f.x+=(Math.cos(f.a)*1.2+hx*0.15)*dt; f.z+=(Math.sin(f.a)*1.2+hz*0.15)*dt; }
    var fy=groundAt(f.x,f.z,99); if(fy<0.2){ f.x-=dx/(d||1)*0.1; f.z-=dzz/(d||1)*0.1; fy=th(f.x,f.z); }
    f.s.position.set(f.x,fy+Math.abs(Math.sin(t*8+f.hx))*0.18,f.z); f.s.material.rotation=Math.sin(t*6+f.hz)*0.12; f.sh.position.set(f.x,fy+0.04,f.z);
    if(d<1.5&&Math.abs(me.y-fy)<1.6){ if(me.dash>0||(me.vy<-2&&me.y>fy+0.5)){ beat(f); if(me.dash<=0){ me.vy=9; } } else hurt(f.x,f.z); } });
   renderCam(dt);
  }
  function renderCam(dt){
   /* sprite del dino */
   var moving=Math.abs(me.sp)>0.6&&me.ground, pose=me.dash>0?'charge':!me.ground?'jump':moving&&Math.floor(t*(me.sp>6?9:6))%2?'run2':'run1';
   if(hero.material.map!==TX[pose]){ hero.material.map=TX[pose]; hero.material.needsUpdate=true; }
   var im=IM[pose]||{width:1,height:1}, pw=(PWID[pose]||440)/440*2.0; hero.scale.set(pw,pw*im.height/im.width,1);
   var bob=moving&&me.dash<=0?Math.abs(Math.sin(t*12))*0.12:0;
   hero.position.set(me.x,me.y+bob,me.z); hero.material.rotation=me.hurt>0?Math.sin(me.hurt*20)*0.5:(-(joy.x||0)*0.12);
   var gh=groundAt(me.x,me.z,me.y+0.01); heroSh.position.set(me.x,gh+0.05,me.z); var hs=Math.max(0.4,1.9-(me.y-gh)*0.18); heroSh.scale.set(hs/1.9,hs/1.9,1);
   if(me.dz>0){ me.dz-=dt; dz.position.set(me.x,me.y+hero.scale.y+0.2,me.z); dz.material.rotation=t*5; if(me.dz<=0)dz.visible=false; }
   /* cámara atrás del dino */
   var dy=me.yaw-camYaw; while(dy>Math.PI)dy-=2*Math.PI; while(dy<-Math.PI)dy+=2*Math.PI; camYaw+=dy*Math.min(1,dt*5);
   var sh=cam.userData.shake||0; if(sh>0)cam.userData.shake=Math.max(0,sh-dt);
   var cf=new T.Vector3(-Math.sin(camYaw),0,-Math.cos(camYaw)), camY=Math.max(me.y,th(me.x,me.z))+3.9;
   cam.position.set(me.x-cf.x*8.6+(sh?(Math.random()-.5)*sh:0),camY,me.z-cf.z*8.6);
   var cg=th(cam.position.x,cam.position.z)+1.2; if(cam.position.y<cg)cam.position.y=cg;
   cam.lookAt(me.x+cf.x*5,me.y+1.3,me.z+cf.z*5);
   /* los decorados que quedan entre la cámara y el dino se vuelven transparentes */
   var cx=cam.position.x, cz=cam.position.z, sx=me.x-cx, sz=me.z-cz, sl=sx*sx+sz*sz||1;
   COL.forEach(function(c){ var u=((c.x-cx)*sx+(c.z-cz)*sz)/sl, op=1; if(u>-0.15&&u<1.05){ var qx=cx+sx*u-c.x, qz=cz+sz*u-c.z; if(qx*qx+qz*qz<(c.w*0.45+0.8)*(c.w*0.45+0.8))op=0.22; }
    var m=c.s.material; m.opacity+=(op-m.opacity)*Math.min(1,dt*10); m.alphaTest=m.opacity<0.9?0.01:0.04; });
   /* horizonte de fondo: gira con la cámara */
   var bgx=(camYaw/(Math.PI*2))*tileW; V.set(cam.position.x+cf.x*300,0,cam.position.z+cf.z*300); V.project(cam); var hy=(1-V.y)/2*H;
   wrap.style.backgroundSize=tileW+'px '+tileH+'px, 100% 100%'; wrap.style.backgroundPosition=bgx+'px '+(hy-tileH*WD.hz)+'px, 0 0';
   /* flecha al próximo huevo (o al portal) */
   var tg=null, bd=1e9; if(!portalOn&&eggsGot<5){ eggs.forEach(function(e){ if(e.got)return; var d=Math.hypot(e.x-me.x,e.z-me.z); if(d<bd){bd=d;tg=e;} }); } else if(portalOn){ tg={x:PX,z:PZ}; bd=Math.hypot(PX-me.x,PZ-me.z); }
   var ar=document.getElementById('dnArr'); if(ar){ if(tg&&bd>6){ var ex=tg.x-me.x, ez=tg.z-me.z, fd=ex*cf.x+ez*cf.z, rt=ex*(-cf.z)+ez*cf.x; var rel=Math.atan2(-rt,fd);
     ar.style.display=''; ar.firstChild.style.transform='rotate('+(-rel)+'rad)'; document.getElementById('dnArrL').textContent=(portalOn?'🌀 ':'🥚 ')+Math.round(bd)+' m'; } else ar.style.display='none'; }
  }
  function loop(ts){ if(!GAME.on){ cleanup(); return; } var dt=Math.min(0.05,last?(ts-last)/1000:0.016); last=ts; update(dt); R.render(scene,cam); GAME.raf=requestAnimationFrame(loop); }
  function cleanup(){ window.removeEventListener('keydown',onKey); window.removeEventListener('keyup',onKey); try{ R.dispose(); R.forceContextLoss(); }catch(e){} CLEAN=null; }
  CLEAN=cleanup; hud();
  big('🥚 ¡Encontrá los 5 huevos!',2200); sayBoth('Find the five eggs!','¡Encontrá los cinco huevos!');
  GAME.raf=requestAnimationFrame(loop);
 }
}
})();
