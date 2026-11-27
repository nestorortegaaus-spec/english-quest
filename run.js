/* 🦊 CARRERA MÁGICA — corredor 3D de 3 carriles para la Sala de Juegos.
   Mundo en 3D real con three.js (lib/three.min.js, MIT). Personajes y objetos: arte de ChatGPT en img/run/.
   Gestos: deslizar ← → para cambiar de carril, ↑ saltar, ↓ agacharse (también flechas del teclado). */
(function(){
var IMG='img/run/', LW=1.4, CLEAN=null;
function loadScript(src,cb){ var s=document.createElement('script'); s.src=src; s.onload=cb; s.onerror=function(){ toast('No pude cargar el juego. Probá con internet.'); }; document.head.appendChild(s); }
function runWords(){ var out=[], seen={}, maxU=UNITS.length;
 try{ var wi=worldInfo(S.world||1); (wi.u||[]).forEach(function(i){ UNITS[i].w.forEach(function(w){ if(/^[a-z]+$/i.test(w.en)&&w.e&&!seen[w.en]){seen[w.en]=1;out.push(w);} }); }); }catch(e){}
 [0,1,2,3,7].forEach(function(i){ if(UNITS[i])UNITS[i].w.forEach(function(w){ if(/^[a-z]+$/i.test(w.en)&&w.e&&!seen[w.en]){seen[w.en]=1;out.push(w);} }); });
 return prioW(out); }

window.startRun=function(){
 if(CLEAN){ try{CLEAN();}catch(e){} CLEAN=null; }
 var host=gSetup('🦊 Carrera Mágica'); GAME.quiet=true; ARCADE_RET=true;
 if(!S.run)S.run={best:0,stars:0}; gScore('🔮'+(S.crys||0));
 host.innerHTML='<div class="rn-start"><img src="'+IMG+'fox_run1.webp" alt=""><h2>Carrera Mágica</h2>'
  +'<div class="rn-howto"><span><b>👈 👉</b>deslizá para cambiar de carril</span><span><b>👆</b>deslizá hacia arriba para saltar</span><span><b>👇</b>deslizá hacia abajo para agacharte</span><span><b>🌸</b>pasá por la puerta de la palabra que escuchás</span></div>'
  +(S.run.best?'<div class="rn-best">🏆 Tu récord: '+S.run.best+' m</div>':'')
  +'<button class="btn teal" id="rnGo">¡A correr! · 1 🔮</button><button class="btn ghost" onclick="openArcade()">← Volver</button></div>';
 document.getElementById('rnGo').onclick=function(){
  if((S.crys||0)<1){ sBad(); toast('Necesitás 🔮. ¡Estudiá un poco para ganar cristales!'); return; }
  sTap(); host.innerHTML='<div class="rn-load">Cargando… 🦊</div>';
  if(window.THREE)play(host); else loadScript('lib/three.min.js',function(){ play(host); }); };
};

if(window.CanvasRenderingContext2D&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h){this.rect(x,y,w,h);};
function canvasTex(w,h,draw){ var c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); var t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }

function play(host){
 var T=THREE;
 var names=['fox_run1','fox_run2','fox_jump','fox_slide','hurdle','log','arch','cart','star','gate','pw_magnet','pw_shoes','pw_shield','pw_x2','d_tree','d_bush','d_lamp','d_house'];
 var TX={}, IM={}, left=names.length+1, ldr=new T.TextureLoader();
 function done(){ if(--left===0)start(); }
 names.forEach(function(n){ ldr.load(IMG+n+'.webp',function(t){ t.encoding=T.sRGBEncoding; t.anisotropy=4; TX[n]=t; IM[n]=t.image; done(); },undefined,function(){ done(); }); });
 ldr.load(IMG+'bg_meadow.jpg',function(t){ t.encoding=T.sRGBEncoding; TX.bg=t; done(); },undefined,done);

 function start(){
  if(!GAME.on)return;
  S.crys--; save(); gScore('🔮'+S.crys);
  host.innerHTML='<div class="rn-wrap" id="rnW"><div class="rn-hud"><span id="rnHp">❤️❤️❤️</span><span id="rnSt">⭐ 0</span><span id="rnM">0 m</span></div>'
   +'<div class="rn-pw" id="rnPw"></div><div class="rn-ask" id="rnAsk"></div><div class="rn-big" id="rnBig"></div><div class="rn-tip" id="rnTip">👈 👉 deslizá · 👆 saltá · 👇 agachate</div></div>';
  var wrap=document.getElementById('rnW'), W=wrap.clientWidth||360, H=wrap.clientHeight||600;
  var R=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); R.setClearColor(0x000000,0); R.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); R.setSize(W,H); R.outputEncoding=T.sRGBEncoding;
  wrap.insertBefore(R.domElement,wrap.firstChild);
  var scene=new T.Scene(); scene.fog=new T.Fog(0x7CC46A,26,82);
  var asp=W/H, FOV0=asp<0.75?60:46, cam=new T.PerspectiveCamera(FOV0,asp,0.1,400);
  scene.add(new T.HemisphereLight(0xffffff,0x6f9a4a,1.05)); var sun=new T.DirectionalLight(0xfff3d6,0.55); sun.position.set(-3,8,4); scene.add(sun);

  /* --- suelo: camino empedrado + pasto con flores (texturas dibujadas) --- */
  var roadTex=canvasTex(256,512,function(c,w,h){
   c.fillStyle='#EBCB9E'; c.fillRect(0,0,w,h);
   var r=rng(7); for(var y=0;y<h;y+=22){ for(var x=-10;x<w;x+=30){ var ox=(y/22%2)*15; c.fillStyle='hsl('+(30+r()*8)+',52%,'+(70+r()*10)+'%)'; c.beginPath(); c.roundRect(x+ox+2,y+2,26,18,7); c.fill(); c.fillStyle='rgba(255,255,255,.25)'; c.fillRect(x+ox+6,y+4,14,3); } }
   c.fillStyle='#B88A5A'; c.fillRect(0,0,14,h); c.fillRect(w-14,0,14,h); c.fillStyle='#9C7046'; c.fillRect(10,0,4,h); c.fillRect(w-14,0,4,h);
   c.fillStyle='rgba(255,255,255,.75)'; for(var y2=0;y2<h;y2+=64){ c.fillRect(w/3-3,y2,6,34); c.fillRect(2*w/3-3,y2,6,34); } });
  roadTex.wrapS=roadTex.wrapT=T.RepeatWrapping; var RL=240; roadTex.repeat.set(1,RL/7);
  var road=new T.Mesh(new T.PlaneGeometry(LW*3+0.5,RL),new T.MeshLambertMaterial({map:roadTex})); road.rotation.x=-Math.PI/2; road.position.set(0,0,-RL/2+8); scene.add(road);
  var grassTex=canvasTex(256,256,function(c,w,h){ c.fillStyle='#6CC24A'; c.fillRect(0,0,w,h); var r=rng(3);
   for(var i=0;i<500;i++){ c.fillStyle=r()<.5?'#5DB33E':'#7DD158'; c.fillRect(r()*w,r()*h,2,6); }
   var cols=['#FF8DC7','#FFE07A','#FFFFFF','#B58BFF']; for(var j=0;j<14;j++){ var x=r()*w,y=r()*h; c.fillStyle=cols[j%4]; for(var k=0;k<5;k++){ c.beginPath(); c.arc(x+Math.cos(k*1.26)*3,y+Math.sin(k*1.26)*3,2.6,0,7); c.fill(); } c.fillStyle='#F2B632'; c.beginPath(); c.arc(x,y,1.8,0,7); c.fill(); } });
  grassTex.wrapS=grassTex.wrapT=T.RepeatWrapping; grassTex.repeat.set(30,RL/6);
  var grass=new T.Mesh(new T.PlaneGeometry(180,RL),new T.MeshLambertMaterial({map:grassTex})); grass.rotation.x=-Math.PI/2; grass.position.set(0,-0.02,-RL/2+8); scene.add(grass);
  /* horizonte: el paisaje de ChatGPT bien lejos, sin niebla */
  /* el paisaje va detrás del lienzo 3D y se acomoda al horizonte de la cámara en cada cuadro */
  wrap.style.background='url('+IMG+'bg_meadow.jpg) repeat-x, linear-gradient(#139FFA,#139FFA)'; var HZ=new T.Vector3(), bgX=0;
  function bgSync(){ HZ.set(0,0,-RL+8).project(cam); var Wd=wrap.clientWidth, Hd=wrap.clientHeight, bw=Wd*3.3, ih=bw*533/3200, hy=(1-HZ.y)/2*Hd;
   wrap.style.backgroundSize=bw+'px '+ih+'px, 100% 100%'; wrap.style.backgroundPosition=(bgX-cam.position.x*18)+'px '+(hy-ih*0.72)+'px, 0 0'; }

  /* --- sprites --- */
  function spr(name,w,h,anchorBottom){ var m=new T.SpriteMaterial({map:TX[name],transparent:true,alphaTest:0.04}); var s=new T.Sprite(m); s.scale.set(w,h||w*IM[name].height/IM[name].width,1); if(anchorBottom!==false)s.center.set(0.5,0); scene.add(s); return s; }
  var fox=spr('fox_run1',0.9); var shadow=new T.Mesh(new T.CircleGeometry(0.3,24),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.22,depthWrite:false})); shadow.rotation.x=-Math.PI/2; shadow.position.y=0.01; scene.add(shadow);
  var dustTex=canvasTex(64,64,function(c){ var g=c.createRadialGradient(32,32,2,32,32,30); g.addColorStop(0,'rgba(240,225,200,.6)'); g.addColorStop(1,'rgba(250,240,220,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
  var sparkTex=canvasTex(64,64,function(c){ c.fillStyle='#FFF7C2'; c.beginPath(); for(var i=0;i<8;i++){ var a=i*Math.PI/4, r=i%2?8:30; c.lineTo(32+Math.cos(a)*r,32+Math.sin(a)*r); } c.fill(); });
  var shieldS=spr('pw_shield',1.25,1.25,false); shieldS.material.opacity=0.45; shieldS.visible=false;

  /* --- estado --- */
  var lane=0, px=0, py=0, vy=0, slide=0, onG=true, speed=9, dist=0, stars=0, hp=3, inv=0, words=0, wrongs=0, ended=false, t=0, frameT=0, dustT=0;
  var PW={magnet:0,shoes:0,x2:0,shield:false}, objs=[], fx=[], nextRow=-22, rowN=0, pool=runWords(), wi=0, gateOpen=null, tipT=6;
  var keyMap={ArrowLeft:-1,ArrowRight:1};

  function hud(){ document.getElementById('rnHp').textContent='❤️'.repeat(Math.max(0,hp))+'🤍'.repeat(3-Math.max(0,hp)); document.getElementById('rnSt').textContent='⭐ '+stars; document.getElementById('rnM').textContent=Math.floor(dist)+' m';
   var p=[]; if(PW.magnet>0)p.push('<span><img src="'+IMG+'pw_magnet.webp">'+Math.ceil(PW.magnet)+'</span>'); if(PW.shoes>0)p.push('<span><img src="'+IMG+'pw_shoes.webp">'+Math.ceil(PW.shoes)+'</span>'); if(PW.x2>0)p.push('<span><img src="'+IMG+'pw_x2.webp">'+Math.ceil(PW.x2)+'</span>'); if(PW.shield)p.push('<span><img src="'+IMG+'pw_shield.webp"></span>');
   document.getElementById('rnPw').innerHTML=p.join(''); }
  function big(txt,ms){ var b=document.getElementById('rnBig'); if(!b)return; b.innerHTML=txt; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); clearTimeout(b._t); b._t=setTimeout(function(){b.classList.remove('on');},ms||1400); }

  /* --- objetos --- */
  var OB={hurdle:{w:1.25,h:0.49},log:{w:1.32,h:0.48},arch:{w:1.55,h:1.06},cart:{w:1.32,h:0.75}};
  function addObj(type,ln,z,extra){ var o=extra||{}; o.type=type; o.lane=ln; o.z=z; var x=ln*LW;
   if(OB[type]){ o.s=spr(type,OB[type].w,OB[type].h); }
   else if(type==='star'){ o.s=spr('star',0.36,0.35); o.y=o.y||0.28; o.ph=Math.random()*6; }
   else if(type==='pw'){ o.s=spr('pw_'+o.k,0.55); o.y=0.35; }
   else if(type==='deco'){ var dn=o.k, sz={d_tree:2.5,d_bush:1.0,d_lamp:0.95,d_house:1.9}[dn]; o.s=spr(dn,sz); x=o.x; }
   else if(type==='gate'){ o.s=new T.Sprite(new T.SpriteMaterial({map:gateTex(o.w.en),transparent:true,alphaTest:0.04})); o.s.center.set(0.5,0); o.s.scale.set(1.42,1.27,1); scene.add(o.s); }
   o.s.position.set(x,o.y||0,z); objs.push(o); return o; }
  function gateTex(word){ var img=IM.gate, w=512, h=Math.round(512*img.height/img.width);
   return canvasTex(w,h,function(c){ c.drawImage(img,0,0,w,h); var fs=Math.min(64,Math.floor(230/(word.length*0.58))); c.font='900 '+fs+'px Nunito,Arial,sans-serif'; c.textAlign='center'; c.textBaseline='middle';
    c.lineWidth=7; c.strokeStyle='#FFF3D6'; c.strokeText(word,w*0.505,h*0.145); c.fillStyle='#5A2E0E'; c.fillText(word,w*0.505,h*0.145); }); }
  function starLine(ln,z,n,arc){ for(var i=0;i<n;i++){ var y=0.28; if(arc)y=0.28+Math.sin(i/(n-1)*Math.PI)*1.1; addObj('star',ln,z-i*1.1,{y:y}); } }
  function decoRow(z){ for(var side=-1;side<=1;side+=2){ var r=Math.random(), k=r<.38?'d_tree':r<.62?'d_bush':r<.8?'d_lamp':'d_house'; var x=side*(k==='d_lamp'?2.75:(3.1+Math.random()*3.2)); addObj('deco',0,z+Math.random()*2,{k:k,x:x}); } }
  function spawnRow(z){ rowN++;
   if(rowN%7===0&&pool.length>=3){ /* fila de puertas de palabras */
    var w=pool[wi++%pool.length], others=shuffle(pool.filter(function(x){return x!==w;})).slice(0,2), ws=shuffle([w].concat(others)), g={w:w,z:z,lanes:[],passed:false,announced:false};
    ws.forEach(function(x,i){ var o=addObj('gate',i-1,z,{w:x}); g.lanes.push(o); }); gateOpen=g; return 15; }
   var nBlock=Math.random()<0.45?1:2, lanes=shuffle([-1,0,1]), blocked=lanes.slice(0,nBlock), free=lanes.slice(nBlock);
   if(speed<10.5)nBlock=1;
   blocked.forEach(function(ln){ var r=Math.random(), type=r<.3?'hurdle':r<.55?'log':r<.78?'arch':'cart'; if(nBlock===2&&type==='cart'&&blocked.every(function(){return true;}))type=Math.random()<.5?'hurdle':'arch'; addObj(type,ln,z);
    if((type==='hurdle'||type==='log')&&Math.random()<.6)starLine(ln,z+2.2,5,true); });
   free.forEach(function(ln,i){ if(i===0&&Math.random()<.75)starLine(ln,z+3,6,false); });
   if(Math.random()<.11){ var k=pickR(['magnet','shoes','shield','x2']); addObj('pw',free[free.length-1],z-4,{k:k}); }
   return Math.max(9,15-speed*0.28); }
  for(var dz=-6;dz>-80;dz-=4)decoRow(dz);

  function remove(o){ scene.remove(o.s); if(o.type==='gate'){ o.s.material.map.dispose(); } o.s.material.dispose(); o.dead=true; }
  function puff(x,y,z,n,tex,col){ for(var i=0;i<n;i++){ var s=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,color:col||0xffffff})); s.position.set(x+(Math.random()-.5)*0.3,y,z); var sc=tex===sparkTex?0.25:0.14+Math.random()*0.1; s.scale.set(sc,sc,1); scene.add(s);
   fx.push({s:s,vx:(Math.random()-.5)*(tex===sparkTex?3:0.6),vy:tex===sparkTex?1.5+Math.random()*2:0.4+Math.random()*0.5,vz:tex===sparkTex?(Math.random()-.5)*2:1.5,life:tex===sparkTex?0.5:0.6,max:tex===sparkTex?0.5:0.6,grow:tex===sparkTex?0:1.6}); } }

  /* --- controles --- */
  function move(d){ if(ended)return; var nl=Math.max(-1,Math.min(1,lane+d)); if(nl!==lane){ lane=nl; tone(520+d*40,.06,'triangle',.12,0); } else tone(200,.08,'sine',.1,0); }
  function jump(){ if(ended)return; if(onG){ vy=PW.shoes>0?10.2:7.6; onG=false; slide=0; tone(620,.08,'square',.1,0); tone(820,.08,'square',.08,.05); } }
  function duck(){ if(ended)return; slide=0.75; if(!onG)vy=-14; tone(300,.1,'sine',.1,0); }
  var sx=0,sy=0,sw=false;
  wrap.addEventListener('touchstart',function(e){ var p=e.touches[0]; sx=p.clientX; sy=p.clientY; sw=false; },{passive:true});
  wrap.addEventListener('touchmove',function(e){ e.preventDefault(); if(sw)return; var p=e.touches[0], dx=p.clientX-sx, dy=p.clientY-sy; if(Math.max(Math.abs(dx),Math.abs(dy))<26)return; sw=true; if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1); else if(dy<0)jump(); else duck(); },{passive:false});
  wrap.addEventListener('touchend',function(){ if(!sw)jump(); });
  var md=null; wrap.addEventListener('mousedown',function(e){ md=[e.clientX,e.clientY]; }); wrap.addEventListener('mouseup',function(e){ if(!md)return; var dx=e.clientX-md[0], dy=e.clientY-md[1]; md=null; if(Math.max(Math.abs(dx),Math.abs(dy))<26){jump();return;} if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1); else if(dy<0)jump(); else duck(); });
  function onKey(e){ if(!GAME.on)return; if(e.key==='ArrowLeft')move(-1); else if(e.key==='ArrowRight')move(1); else if(e.key==='ArrowUp'||e.key===' ')jump(); else if(e.key==='ArrowDown')duck(); }
  window.addEventListener('keydown',onKey);
  window.__run={move:move,jump:jump,duck:duck,st:function(){return {lane:lane,py:py,slide:slide,objs:objs,gate:gateOpen,stars:stars,hp:hp,dist:dist,ended:ended,speed:speed};}};

  /* --- choques y premios --- */
  function hit(o){ if(inv>0)return; if(PW.shield){ PW.shield=false; shieldS.visible=false; inv=1; tone(900,.2,'triangle',.15,0); puff(px,0.5,0,10,sparkTex,0x9FE3FF); big('🛡️ ¡El escudo te salvó!',1000); remove(o); hud(); return; }
   hp--; inv=1.6; speed=Math.max(8,speed*0.82); tone(180,.25,'sawtooth',.12,0); tone(120,.3,'sine',.14,.08); if(navigator.vibrate)try{navigator.vibrate(120);}catch(e){} cam.userData.shake=0.35;
   remove(o); hud(); if(hp<=0)end(); else big(hp===1?'¡Cuidado! 💥 Te queda 1 ❤️':'¡Uy! 💥',900); }
  function getStar(o){ var v=PW.x2>0?2:1; stars+=v; remove(o); puff(o.s.position.x,o.s.position.y+0.1,o.z,4,sparkTex); tone(1100+((stars%8)*60),.05,'triangle',.09,0); hud(); }
  function getPw(o){ remove(o); tone(700,.08,'triangle',.14,0); tone(1050,.12,'triangle',.14,.08); puff(o.s.position.x,0.5,o.z,10,sparkTex);
   var names={magnet:['¡Imán!','magnet'],shoes:['¡Súper salto!','super jump'],shield:['¡Escudo!','shield'],x2:['¡Estrellas x2!','double stars']}[o.k];
   if(o.k==='shield'){PW.shield=true;shieldS.visible=true;} else PW[o.k]=10; big('<img src="'+IMG+'pw_'+o.k+'.webp"> '+names[0],1200); say(names[1]); hud(); }
  function passGate(g){ g.passed=true; var mine=g.lanes.filter(function(o){return o.lane===lane;})[0], ok=mine&&mine.w===g.w;
   document.getElementById('rnAsk').classList.remove('on');
   if(ok){ words++; var v=(PW.x2>0?2:1)*10; stars+=v; markWord(g.w,true); burst(40); tone(660,.1,'triangle',.18,0); tone(880,.1,'triangle',.18,.1); tone(1320,.2,'triangle',.18,.2); sayBoth(g.w.en,g.w.es); big('✨ <b>'+g.w.en+'</b> = '+g.w.es+' · +'+v+' ⭐',1700); }
   else { wrongs++; markWord(g.w,false); tone(260,.15,'sine',.12,0); say(g.w.en); big('🙈 Era <b>'+g.w.en+'</b> = '+g.w.es,1900); }
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
   speed=Math.min(21,speed+dt*0.16); var dz=speed*dt; dist+=dz;
   roadTex.offset.y+=dz/7; grassTex.offset.y+=dz/6; bgX-=dt*1.5;
   /* filas nuevas */
   nextRow+=dz; if(nextRow>=0){ nextRow=-spawnRow(-78); }
   if(Math.random()<dz/4.5)decoRow(-80);
   /* jugador */
   px+=(lane*LW-px)*Math.min(1,dt*14);
   if(!onG){ vy-=24*dt; py+=vy*dt; if(py<=0){ py=0; vy=0; onG=true; puff(px,0.05,0.2,5,dustTex); tone(240,.05,'sine',.08,0); } }
   if(slide>0)slide-=dt; if(inv>0)inv-=dt; ['magnet','shoes','x2'].forEach(function(k){ if(PW[k]>0){ PW[k]-=dt; if(PW[k]<=0){PW[k]=0;hud();} } });
   frameT+=dt*speed/5.5; var fr=!onG?'fox_jump':slide>0?'fox_slide':(Math.floor(frameT*3)%2?'fox_run2':'fox_run1');
   if(fox.material.map!==TX[fr]){ fox.material.map=TX[fr]; var im=IM[fr]; fox.scale.set(0.9,0.9*im.height/im.width,1); }
   var bob=onG&&slide<=0?Math.abs(Math.sin(frameT*Math.PI*1.5))*0.05:0;
   fox.position.set(px,py+bob,0); fox.material.opacity=inv>0&&Math.floor(t*14)%2?0.35:1; fox.material.transparent=true;
   shadow.position.x=px; var sh=Math.max(0.35,1-py*0.35); shadow.scale.set(sh,sh,sh); shadowM(1-py*0.25);
   shieldS.position.set(px,py+0.5,0.05); if(shieldS.visible){ var ps=1.2+Math.sin(t*5)*0.05; shieldS.scale.set(ps,ps,1); }
   dustT+=dt; if(onG&&slide<=0&&dustT>0.16){ dustT=0; puff(px+(Math.random()-.5)*0.2,0.06,0.25,1,dustTex); }
   /* cámara que sigue al zorrito */
   var sh2=cam.userData.shake||0; if(sh2>0)cam.userData.shake=Math.max(0,sh2-dt);
   cam.position.x+=(px*0.75-cam.position.x)*Math.min(1,dt*6); cam.position.y=1.85+py*0.25+(sh2?(Math.random()-.5)*sh2*0.4:0); cam.position.z=3.35;
   cam.lookAt(cam.position.x*0.6,0.55+py*0.2,-6); cam.fov+=(FOV0+(speed-9)*0.45-cam.fov)*dt*2; cam.updateProjectionMatrix();
   /* objetos */
   var mag=PW.magnet>0;
   for(var i=0;i<objs.length;i++){ var o=objs[i]; if(o.dead)continue; o.z+=dz; var s=o.s;
    if(o.type==='star'){ var sc=Math.abs(Math.cos(t*3.2+o.ph)); s.scale.x=0.36*Math.max(0.18,sc); s.position.y=o.y+Math.sin(t*4+o.ph)*0.05;
     if(mag&&o.z>-9&&o.z<0.5){ s.position.x+=(px-s.position.x)*Math.min(1,dt*7); o.y+=(py+0.3-o.y)*Math.min(1,dt*7); o.z+=(0-o.z)*Math.min(1,dt*4); } }
    if(o.type==='pw'){ s.position.y=0.35+Math.sin(t*3)*0.08; }
    if(o.fade){ s.material.opacity=Math.max(0,s.material.opacity-dt*2.5); }
    s.position.z=o.z;
    /* choques en la fila del jugador */
    if(o.z>-0.45&&o.z<0.45&&!o.done){
     var same=Math.abs(s.position.x-px)<0.62;
     if(same){ if(o.type==='hurdle'||o.type==='log'){ if(py<0.42){o.done=true;hit(o);} }
      else if(o.type==='arch'){ if(slide<=0||py>0.2){o.done=true;hit(o);} }
      else if(o.type==='cart'){ o.done=true; hit(o); }
      else if(o.type==='star'){ if(Math.abs(s.position.y-(py+0.35))<0.6){o.done=true;getStar(o);} }
      else if(o.type==='pw'){ if(Math.abs(0.35-(py+0.35))<0.75){o.done=true;getPw(o);} } } }
    if(o.z>3)remove(o); }
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
