/* 🛒 COMIDA DE LAS MASCOTAS: hay 4 comidas gratis siempre (manzana, banana, zanahoria, leche) y un ALMACÉN con muchas más,
   que se compran con ⭐ en paquetes de 3 y quedan en la DESPENSA (S.home.pantry = {id: cantidad}).
   Cada amigo tiene comidas FAVORITAS parecidas a lo que come en la vida real (el pingüino: pescado, camarón, calamar…):
   llenan más la pancita y le dan más cariño. PARA SUMAR: agregar en FOODS (fav = ids de amigos). */
(function(){
var FREE=[['🍎','apple','manzana'],['🍌','banana','banana'],['🥕','carrot','zanahoria'],['🥛','milk','leche']];
var FOODS=[
 /* [id, emoji, inglés, castellano, ⭐ por paquete de 3, favoritos] */
 ['fish','🐟','fish','pescado',6,['penguin','kitty']],['shrimp','🦐','shrimp','camarón',7,['penguin']],['squid','🦑','squid','calamar',7,['penguin']],
 ['tuna','🥫','tuna','atún',6,['kitty']],['chicken','🍗','chicken','pollo',6,['kitty','puppy','fox']],['bone','🦴','bone','hueso',5,['puppy']],
 ['meat','🥩','meat','carne',7,['puppy','dragon']],['berries','🫐','berries','arándanos',4,['fox']],['egg','🥚','egg','huevo',4,['fox']],
 ['grapes','🍇','grapes','uvas',4,['fox']],['lettuce','🥬','lettuce','lechuga',3,['bunny']],['clover','🍀','clover','trébol',3,['bunny']],
 ['hay','🌾','hay','pasto seco',3,['bunny','unicorn']],['bamboo','🎋','bamboo','bambú',4,['panda']],['honey','🍯','honey','miel',5,['panda']],
 ['sweet potato','🍠','sweet potato','batata',4,['panda']],['flowers','🌸','flowers','flores',4,['unicorn']],['cupcake','🧁','cupcake','cupcake',6,['unicorn']],
 ['sugar cube','🧊','sugar cube','terrón de azúcar',4,['unicorn']],['hot pepper','🌶️','hot pepper','ají picante',5,['dragon']],['marshmallow','🍡','marshmallow','malvavisco',5,['dragon']],
 ['strawberry','🍓','strawberry','frutilla',3,[]],['watermelon','🍉','watermelon','sandía',4,[]],['pear','🍐','pear','pera',3,[]],['corn','🌽','corn','choclo',3,[]],
 ['broccoli','🥦','broccoli','brócoli',3,[]],['cheese','🧀','cheese','queso',5,[]],['cookie','🍪','cookie','galletita',5,[]],['pancakes','🥞','pancakes','panqueques',6,[]],
 ['popcorn','🍿','popcorn','pochoclo',5,[]],['ice cream','🍦','ice cream','helado',6,[]],['pizza','🍕','pizza','pizza',8,[]]
];
window.FOODS=FOODS;
function fById(id){ return FOODS.find(function(f){return f[0]===id;}); }
function pantry(){ var h=hData(); if(!h.pantry){ h.pantry={strawberry:1,fish:1}; } return h.pantry; }
function isFav(f,pid){ return f[5].indexOf(pid)>=0; }
/* lista para el panel de Comer: [emoji, inglés, frase, ⭐, 💎, idDespensa, cantidad, favorita, castellano] */
window.eatItems=function(){ var h=hData(), pid=h.cur, P=pantry(), out=[];
 FOODS.filter(function(f){return (P[f[0]]||0)>0;}).sort(function(a,b){return isFav(b,pid)-isFav(a,pid);}).forEach(function(f){ out.push([f[1],f[2],'Yummy '+f[2]+'!',0,0,f[0],P[f[0]],isFav(f,pid),f[3]]); });
 FREE.forEach(function(x){ out.push([x[0],x[1],'',0,0,null,0,false,x[2]]); });
 return out; };
window.eatPickHTML=function(f){ var items=eatItems(), favs=FOODS.filter(function(x){return isFav(x,hData().cur);});
 return '<div class="hm-pick"><div class="hm-ph">🍎 Elegí en inglés y <b>arrastralo hasta '+f.n+'</b> 👆</div>'
  +(favs.length?'<div class="fd-favs">💖 A '+f.n+' le encanta: '+favs.map(function(x){return x[1];}).join(' ')+'</div>':'')
  +'<div class="hm-items">'+items.map(function(it,i){ return '<button class="hm-it drag'+(it[7]?' fav':'')+'" data-i="'+i+'"><b>'+it[0]+'</b><span>'+it[1]+'</span><em class="'+(it[5]?'qty':'free')+'">'+(it[5]?'x'+it[6]:'Gratis')+'</em>'+(it[7]?'<i class="fd-heart">💖</i>':'')+'</button>'; }).join('')+'</div>'
  +'<button class="btn teal fd-shopb" onclick="openFoodShop()">🛒 Comprar más comida</button>'
  +'<button class="btn ghost" onclick="HOME_SEL=null;sTap();renderHome()">← Volver</button></div>'; };
/* al darle de comer: descuenta de la despensa y, si es su favorita, llena más */
window.eatUse=function(it,p){ if(it[5]){ var P=pantry(); P[it[5]]=Math.max(0,(P[it[5]]||0)-1); if(!P[it[5]])delete P[it[5]]; }
 if(it[7]){ p.nd.food=Math.min(100,p.nd.food+25); p.nd.love=Math.min(100,p.nd.love+10); setTimeout(function(){ try{ toast('💖 ¡Su comida favorita! Le encantó'); }catch(e){} },1200); } };
var TAB='fav';
window.openFoodShop=function(){ try{sTap();}catch(e){} var h=hData(), pid=h.cur, fr=friendById(pid)||{n:'tu amigo'};
 var ov=document.createElement('div'); ov.className='pk-ov fd-ov';
 function draw(){ var P=pantry(), list=TAB==='fav'?FOODS.filter(function(x){return isFav(x,pid);}):FOODS.slice();
  if(TAB==='fav'&&!list.length){ TAB='all'; list=FOODS.slice(); }
  ov.innerHTML='<div class="pk-box fd-box"><h2>🛒 Almacén de comida</h2><div class="fd-bal">Tenés <b>⭐ '+(S.stars||0)+'</b> · cada paquete trae 3</div>'
   +'<div class="fd-tabs"><button data-t="fav" class="'+(TAB==='fav'?'on':'')+'">💖 Para '+fr.n+'</button><button data-t="all" class="'+(TAB==='all'?'on':'')+'">🍽️ Todas</button></div>'
   +'<div class="fd-grid">'+list.map(function(x){ var can=(S.stars||0)>=x[4], fv=x[5].map(function(id){var q=friendById(id);return q?q.e:'';}).join('');
     return '<button class="fd-it'+(can?'':' poor')+(isFav(x,pid)?' fav':'')+'" data-id="'+x[0]+'"><b>'+x[1]+'</b><span>'+x[2]+'</span><small>'+x[3]+'</small>'+(fv?'<i>'+fv+'</i>':'')+'<em>x3 · ⭐ '+x[4]+'</em>'+(P[x[0]]?'<u>tenés '+P[x[0]]+'</u>':'')+'</button>'; }).join('')+'</div>'
   +'<button class="btn ghost" id="fdX">Listo</button></div>';
  ov.querySelectorAll('.fd-tabs button').forEach(function(b){ b.onclick=function(){ TAB=b.dataset.t; try{sTap();}catch(e){} draw(); }; });
  ov.querySelectorAll('.fd-it').forEach(function(b){ b.onclick=function(){ var x=fById(b.dataset.id);
   say(x[2]); if((S.stars||0)<x[4]){ try{sBad();}catch(e){} toast('Te faltan '+(x[4]-(S.stars||0))+' ⭐. ¡Estudiá para ganar más!'); return; }
   S.stars-=x[4]; S.spent=(S.spent||0)+x[4]; var P2=pantry(); P2[x[0]]=(P2[x[0]]||0)+3; save(); try{sGood();burst(20);}catch(e){}
   toast('🛍️ ¡Compraste 3 de '+x[3]+' ('+x[2]+')! Ya están en tu despensa'); draw(); }; });
  ov.querySelector('#fdX').onclick=function(){ ov.remove(); try{renderHome();}catch(e){} }; }
 draw(); document.body.appendChild(ov); ov.onclick=function(e){ if(e.target===ov){ ov.remove(); try{renderHome();}catch(_){} } }; };
/* frases al comer las comidas nuevas */
var L={fish:[['Fish! My favorite!','¡Pescado! ¡Mi favorito!'],['Fresh fish from the sea!','¡Pescado fresco del mar!']],shrimp:[['Pink shrimp, yum!','¡Camarones rosados, qué rico!']],squid:[['Squid is so fun to eat!','¡El calamar es re divertido de comer!']],
 tuna:[['Tuna! Meow meow!','¡Atún! ¡Miau miau!']],chicken:[['Chicken is delicious!','¡El pollo es delicioso!']],bone:[['A bone! I will chew it all day!','¡Un hueso! ¡Lo voy a morder todo el día!']],
 meat:[['Meat makes me strong!','¡La carne me hace fuerte!']],berries:[['Berries from the forest!','¡Frutitas del bosque!']],egg:[['An egg! Yummy!','¡Un huevo! ¡Rico!']],grapes:[['Purple grapes!','¡Uvas violetas!']],
 lettuce:[['Crunchy lettuce!','¡Lechuga crocante!']],clover:[['A lucky clover!','¡Un trébol de la suerte!']],hay:[['Hay is my favorite snack!','¡El pasto seco es mi snack favorito!']],
 bamboo:[['Bamboo! Crunch, crunch!','¡Bambú! ¡Crunch, crunch!'],['I can eat bamboo all day!','¡Puedo comer bambú todo el día!']],honey:[['Sweet honey!','¡Miel dulce!']],'sweet potato':[['A warm sweet potato!','¡Una batata calentita!']],
 flowers:[['Flowers taste like magic!','¡Las flores tienen gusto a magia!']],cupcake:[['A rainbow cupcake!','¡Un cupcake arcoíris!']],'sugar cube':[['A sugar cube! Sweet!','¡Un terrón de azúcar! ¡Dulce!']],
 'hot pepper':[['Hot, hot, hot! Now I can make fire!','¡Pica, pica! ¡Ahora puedo echar fuego!']],marshmallow:[['I toast it with my fire!','¡Lo tuesto con mi fuego!']],
 watermelon:[['Juicy watermelon!','¡Sandía jugosa!']],pear:[['A sweet pear!','¡Una pera dulce!']],corn:[['Yellow corn!','¡Choclo amarillo!']],broccoli:[['Broccoli is like a little tree!','¡El brócoli es como un arbolito!']],
 pancakes:[['Pancakes with honey!','¡Panqueques con miel!']],popcorn:[['Pop, pop, popcorn!','¡Pop, pop, pochoclo!']],'ice cream':[['Cold ice cream!','¡Helado fresquito!']]};
try{ Object.keys(L).forEach(function(k){ if(!FOOD_LINES[k])FOOD_LINES[k]=L[k]; else FOOD_LINES[k]=FOOD_LINES[k].concat(L[k]); }); }catch(e){}
})();
