/* 🗣️ MASCOTAS QUE HABLAN SOLAS: cada 13-20 s el amigo de la Casa dice algo por su cuenta.
   Si alguna necesidad está baja, habla de eso (más urgente si está muy baja); si está todo bien, dice una frase de su
   personalidad. Las frases rotan como un mazo (no se repiten hasta usar todas, ver pline en index.html).
   PARA SUMAR FRASES: agregar pares ['inglés','castellano'] en la lista del amigo (PET_CHAT) o de la necesidad (NEED_MORE). */
(function(){
/* necesidades: 'lo' = baja (<35), 'vlo' = muy baja (<18) */
var NEED_MORE={
 food:{lo:[['I am hungry!','¡Tengo hambre!'],['Is it lunch time?','¿Es hora de comer?'],['I smell something yummy…','Huelo algo rico…'],['Can I have a fruit?','¿Me das una fruta?'],['My tummy says grrr!','¡Mi pancita hace grrr!'],['I want a snack, please!','¡Quiero algo para comer, por favor!']],
  vlo:[['I am very, very hungry!','¡Tengo muchísima hambre!'],['Please feed me! I am so hungry!','¡Dame de comer, por favor! ¡Tengo mucha hambre!'],['My tummy is empty!','¡Tengo la pancita vacía!'],['Food! Food! I need food!','¡Comida! ¡Comida! ¡Necesito comida!']]},
 fun:{lo:[['I am a little bored…','Estoy un poco aburrido…'],['Do you want to play?','¿Querés jugar?'],['Let\'s play a game!','¡Juguemos a algo!'],['Where is my ball?','¿Dónde está mi pelota?'],['I want to have fun!','¡Quiero divertirme!']],
  vlo:[['I am so bored! Play with me!','¡Estoy re aburrido! ¡Jugá conmigo!'],['Please, please, let\'s play!','¡Por favor, por favor, juguemos!'],['Nothing to do… so boring…','Nada que hacer… qué aburrido…']]},
 clean:{lo:[['I feel a little dirty…','Me siento un poco sucio…'],['I want to take a bath!','¡Me quiero bañar!'],['My fur is messy!','¡Tengo el pelo desarreglado!'],['Bubbles, please!','¡Burbujas, por favor!'],['I need some soap!','¡Necesito jabón!']],
  vlo:[['I am very dirty! I need a bath!','¡Estoy muy sucio! ¡Necesito un baño!'],['I smell bad! Wash me, please!','¡Huelo feo! ¡Bañame, por favor!'],['So much mud on me!','¡Tengo barro por todos lados!']]},
 energy:{lo:[['I am a little tired…','Estoy un poco cansado…'],['*yawn* I want a nap…','*bostezo* Quiero una siesta…'],['My eyes are closing…','Se me cierran los ojitos…'],['Can I go to bed?','¿Me puedo ir a dormir?']],
  vlo:[['I am so, so sleepy…','Tengo muchísimo sueño…'],['I can\'t open my eyes…','No puedo abrir los ojos…'],['Please, I need to sleep…','Por favor, necesito dormir…']]},
 love:{lo:[['Can you pet me?','¿Me hacés mimos?'],['I want a hug!','¡Quiero un abrazo!'],['Do you still love me?','¿Me seguís queriendo?'],['Tap me, please!','¡Tocame, por favor!']],
  vlo:[['I feel lonely…','Me siento solito…'],['I need a big hug!','¡Necesito un abrazo enorme!'],['Please stay with me!','¡Por favor, quedate conmigo!']]}
};
/* personalidad de cada amigo: temas propios para que no digan lo mismo */
var PET_CHAT={
 fox:[['I can run very fast!','¡Puedo correr muy rápido!'],['Foxes love the forest!','¡A los zorros nos encanta el bosque!'],['Look at my fluffy tail!','¡Mirá mi cola peluda!'],['Let\'s go on an adventure!','¡Vamos de aventura!'],['I found a shiny stone!','¡Encontré una piedra brillante!'],['Orange is my color!','¡El naranja es mi color!'],['I like to explore new places.','Me gusta explorar lugares nuevos.'],['Can we race? Ready, set, go!','¿Corremos? ¡Preparados, listos, ya!'],['I hear a bird in the tree!','¡Escucho un pájaro en el árbol!'],['My purple scarf is my favorite.','Mi pañuelo violeta es mi favorito.'],['Clever foxes learn English!','¡Los zorros inteligentes aprenden inglés!'],['I want to climb a mountain!','¡Quiero subir una montaña!']],
 kitty:[['Meow! Hello!','¡Miau! ¡Hola!'],['I love to sleep in the sun.','Me encanta dormir al sol.'],['Purr, purr… I am happy.','Purr, purr… estoy feliz.'],['I can jump very high!','¡Puedo saltar muy alto!'],['Where is my ball of yarn?','¿Dónde está mi ovillo de lana?'],['I like milk and fish.','Me gusta la leche y el pescado.'],['Look, a butterfly!','¡Mirá, una mariposa!'],['My whiskers are long!','¡Mis bigotes son largos!'],['I clean my paws every day.','Me limpio las patitas todos los días.'],['Cats have nine lives!','¡Los gatos tienen siete vidas!'],['I want to play with a box!','¡Quiero jugar con una caja!'],['Can you hear me purr?','¿Me escuchás ronronear?']],
 puppy:[['Woof woof!','¡Guau guau!'],['Throw the stick!','¡Tirá el palito!'],['I love to go for a walk!','¡Me encanta salir a pasear!'],['My tail is wagging!','¡Estoy moviendo la cola!'],['I can sit. Look!','Sé sentarme. ¡Mirá!'],['I buried a bone in the garden.','Enterré un hueso en el jardín.'],['Dogs are good friends!','¡Los perros somos buenos amigos!'],['Let\'s run in the park!','¡Corramos en la plaza!'],['I smell something…','Huelo algo…'],['Can I lick your face?','¿Te puedo lamer la cara?'],['I am a good puppy!','¡Soy un buen perrito!'],['Let\'s dig a hole!','¡Hagamos un pozo!']],
 bunny:[['Hop, hop, hop!','¡Salto, salto, salto!'],['I love carrots!','¡Me encantan las zanahorias!'],['Look at my long ears!','¡Mirá mis orejas largas!'],['I can hear very well.','Escucho muy bien.'],['Let\'s pick flowers!','¡Juntemos flores!'],['My nose goes wiggle, wiggle!','¡Mi nariz se mueve así!'],['I live in a garden.','Vivo en un jardín.'],['I am soft and fluffy.','Soy suave y esponjosa.'],['Spring is my favorite season!','¡La primavera es mi estación favorita!'],['I want a big green salad!','¡Quiero una ensalada verde grande!'],['Can you hop like me?','¿Podés saltar como yo?'],['Shh… I am very quiet.','Shh… soy muy silenciosa.']],
 penguin:[['Brrr! I love the cold!','¡Brrr! ¡Me encanta el frío!'],['I can swim very fast!','¡Nado muy rápido!'],['I cannot fly, but I can slide!','¡No puedo volar, pero me deslizo!'],['I live near the ice.','Vivo cerca del hielo.'],['Fish is my favorite food!','¡El pescado es mi comida favorita!'],['Let\'s make a snowman!','¡Hagamos un muñeco de nieve!'],['I walk like this: waddle, waddle!','¡Camino así: bamboleo, bamboleo!'],['My scarf keeps me warm.','Mi bufanda me abriga.'],['Do you like snow?','¿Te gusta la nieve?'],['I have many penguin friends!','¡Tengo muchos amigos pingüinos!'],['Splash! Into the water!','¡Splash! ¡Al agua!'],['Ice cream is cold like me!','¡El helado es frío como yo!']],
 panda:[['I love bamboo!','¡Me encanta el bambú!'],['Pandas are black and white.','Los pandas somos blancos y negros.'],['I like to roll on the grass.','Me gusta rodar en el pasto.'],['I am big but gentle.','Soy grande pero tranquilo.'],['Let\'s eat some leaves!','¡Comamos unas hojitas!'],['I can climb trees!','¡Puedo trepar árboles!'],['Time for a lazy day…','Hoy es un día tranquilo…'],['Do you want a panda hug?','¿Querés un abrazo de panda?'],['I live in the mountains.','Vivo en las montañas.'],['My green cap is cool!','¡Mi gorra verde es genial!'],['I eat a lot every day!','¡Como un montón todos los días!'],['Slow and happy, that\'s me!','¡Tranquilo y feliz, así soy yo!']],
 unicorn:[['I have a magic horn!','¡Tengo un cuerno mágico!'],['Rainbows are beautiful!','¡Los arcoíris son hermosos!'],['I can make wishes come true!','¡Puedo cumplir deseos!'],['Sparkle, sparkle!','¡Brillo, brillo!'],['I live above the clouds.','Vivo arriba de las nubes.'],['My mane has all the colors!','¡Mi melena tiene todos los colores!'],['Let\'s look for stars!','¡Busquemos estrellas!'],['Magic is everywhere!','¡La magia está en todos lados!'],['I love glitter!','¡Me encanta la purpurina!'],['Close your eyes and make a wish!','¡Cerrá los ojos y pedí un deseo!'],['I can gallop on rainbows!','¡Puedo galopar sobre arcoíris!'],['You are magical too!','¡Vos también sos mágica!']],
 dragon:[['Roar! I am a little dragon!','¡Rugido! ¡Soy un dragoncito!'],['Look at my wings!','¡Mirá mis alas!'],['I want to fly high!','¡Quiero volar alto!'],['I can make warm air!','¡Puedo echar aire calentito!'],['Dragons love treasure!','¡A los dragones nos encanta el tesoro!'],['I am brave and strong!','¡Soy valiente y fuerte!'],['I live in a castle.','Vivo en un castillo.'],['My scales are shiny!','¡Mis escamas brillan!'],['Let\'s go to the clouds!','¡Vamos a las nubes!'],['I am not scary, I am friendly!','¡No doy miedo, soy amigable!'],['I love hot chocolate!','¡Me encanta el chocolate caliente!'],['One day I will be very big!','¡Algún día voy a ser muy grande!']]
};
var CHAT_ALL=[['Do you know a new word today?','¿Sabés una palabra nueva hoy?'],['English is fun!','¡El inglés es divertido!'],['What is your favorite color?','¿Cuál es tu color favorito?'],['I like spending time with you!','¡Me gusta pasar tiempo con vos!'],['How was school today?','¿Cómo te fue hoy en la escuela?'],['Let\'s learn together!','¡Aprendamos juntos!'],['You are very smart!','¡Sos muy inteligente!'],['I had a funny dream last night!','¡Anoche tuve un sueño gracioso!'],['What do you want to do today?','¿Qué querés hacer hoy?'],['Thank you for taking care of me!','¡Gracias por cuidarme!']];

/* 📈 FRASES QUE CRECEN CON ELLA: nivel 1 (mundo 1), 2 (mundos 2-3), 3 (mundo 4 en adelante). Cada nivel suma frases más largas;
   las anteriores siguen saliendo. PARA SUMAR: agregar pares en CHAT_LV[1|2|3] o en PET_CHAT2 (por amigo, nivel 2+). */
var CHAT_LV={
 1:[['Hello!','¡Hola!'],['I am happy!','¡Estoy feliz!'],['You are my friend!','¡Sos mi amiga!'],['Look at me!','¡Mirame!'],['I like you!','¡Me caés bien!'],['Let\'s play!','¡Juguemos!'],['Yes! Yes! Yes!','¡Sí! ¡Sí! ¡Sí!'],['Hi, how are you?','Hola, ¿cómo estás?']],
 2:[['I like to play with you every day.','Me gusta jugar con vos todos los días.'],['What did you learn today?','¿Qué aprendiste hoy?'],['Can you tell me a new word?','¿Me decís una palabra nueva?'],['My favorite place is this house.','Mi lugar favorito es esta casa.'],['When it rains, I like to stay inside.','Cuando llueve, me gusta quedarme adentro.'],['I want to go to the park with you.','Quiero ir a la plaza con vos.'],['Do you have a lot of homework?','¿Tenés mucha tarea?'],['I am learning English with you!','¡Estoy aprendiendo inglés con vos!'],['What is your favorite food?','¿Cuál es tu comida favorita?'],['I feel happy when you visit me.','Me siento feliz cuando me visitás.']],
 3:[['Yesterday I had a dream about a big castle.','Ayer soñé con un castillo enorme.'],['If I could fly, I would visit the clouds.','Si pudiera volar, visitaría las nubes.'],['I think you are getting better at English every day.','Creo que cada día estás mejor en inglés.'],['Tomorrow I am going to practice new words with you.','Mañana voy a practicar palabras nuevas con vos.'],['Can you tell me about your best friend?','¿Me contás de tu mejor amiga?'],['I would like to travel around the world one day.','Algún día me gustaría viajar por el mundo.'],['When I grow up, I want to be as smart as you.','Cuando sea grande, quiero ser tan inteligente como vos.'],['Have you ever seen a shooting star?','¿Alguna vez viste una estrella fugaz?'],['I was a little bored, but now I am happy because you are here.','Estaba un poco aburrido, pero ahora estoy feliz porque estás acá.'],['Which do you like more, summer or winter?','¿Qué te gusta más, el verano o el invierno?']]
};
var PET_CHAT2={
 fox:[['Yesterday I ran through the forest and found a river.','Ayer corrí por el bosque y encontré un río.'],['Do you want to explore the mountains with me tomorrow?','¿Querés explorar las montañas conmigo mañana?'],['Foxes are clever because they listen carefully.','Los zorros somos listos porque escuchamos con atención.']],
 kitty:[['I slept in the sun all morning, and now I am full of energy!','¡Dormí al sol toda la mañana y ahora tengo un montón de energía!'],['If I find a box, I will play with it all day.','Si encuentro una caja, voy a jugar con ella todo el día.'],['Cats are quiet, but we understand everything.','Los gatos somos callados, pero entendemos todo.']],
 puppy:[['When you come home, my tail wags very fast!','¡Cuando llegás a casa, muevo la cola re rápido!'],['I hid my bone, but now I cannot remember where.','Escondí mi hueso, pero ahora no me acuerdo dónde.'],['Can we go for a long walk after you study?','¿Podemos salir a pasear un rato largo después de que estudies?']],
 bunny:[['I planted a carrot, and now I am waiting for it to grow.','Planté una zanahoria y ahora estoy esperando que crezca.'],['My ears are long so I can hear you from far away.','Tengo las orejas largas para escucharte desde lejos.'],['In spring, the garden is full of flowers and butterflies.','En primavera, el jardín se llena de flores y mariposas.']],
 penguin:[['I slid on the ice so fast that I fell in the water!','¡Me deslicé tan rápido en el hielo que me caí al agua!'],['Penguins cannot fly, but we are excellent swimmers.','Los pingüinos no volamos, pero nadamos re bien.'],['Would you like to build a snow castle with me?','¿Te gustaría hacer un castillo de nieve conmigo?']],
 panda:[['I ate so much bamboo that now I need a nap.','Comí tanto bambú que ahora necesito una siesta.'],['Pandas are calm because we take things slowly.','Los pandas somos tranquilos porque nos tomamos las cosas con calma.'],['If you are tired, you can rest with me.','Si estás cansada, podés descansar conmigo.']],
 unicorn:[['Last night I followed a rainbow to the end of the sky.','Anoche seguí un arcoíris hasta el final del cielo.'],['Every word you learn makes my horn shine brighter!','¡Cada palabra que aprendés hace brillar más mi cuerno!'],['If you could make a wish, what would it be?','Si pudieras pedir un deseo, ¿cuál sería?']],
 dragon:[['One day I will fly over the mountains and the sea.','Algún día voy a volar sobre las montañas y el mar.'],['I am small now, but I am getting stronger every day.','Ahora soy chiquito, pero cada día me pongo más fuerte.'],['My treasure is not gold, it is our friendship.','Mi tesoro no es el oro, es nuestra amistad.']]
};
/* frases con palabras que ella YA aprendió (S.hist), según su nivel */
var WORD_T={
 1:[['{E} {w}! I know this word!','¡{E} {es}! ¡Conozco esta palabra!'],['Look! {E} {w}!','¡Mirá! {E} ¡{es}!'],['{w}! {w}! {E}','¡{w}! ¡{w}! {E} ({es})']],
 2:[['Do you remember? {E} {w}!','¿Te acordás? {E} ¡{es}!'],['You taught me a word: {w}! {E}','Me enseñaste una palabra: ¡{w}! {E} ({es})'],['I am thinking about… {w}! {E}','Estoy pensando en… ¡{es}! {E}'],['Can you say {w}? I can! {E}','¿Sabés decir "{w}"? ¡Yo sí! {E} ({es})']],
 3:[['Yesterday I dreamed about {w}, and it was so funny! {E}','Ayer soñé con: {es}, ¡y fue re gracioso! {E}'],['Do you know what {w} means? It means "{es}"! {E}','¿Sabés qué significa "{w}"? ¡Significa "{es}"! {E}'],['My favorite word today is {w}. What is yours? {E}','Mi palabra favorita de hoy es "{w}". ¿Y la tuya? {E}'],['If I could have anything, I would choose {w}! {E}','Si pudiera tener cualquier cosa, elegiría: ¡{es}! {E}']]
};
function petLv(){ var w=S.world||1; return w>=4?3:w>=2?2:1; }
function learned(){ var h=S.hist||{}, out=[]; try{ UNITS.forEach(function(U){ if(U.isP)return; U.w.forEach(function(w){ var x=h[w.en]; if(x&&x[0]>0&&w.e&&/^[a-z ]+$/i.test(w.en)&&w.en.split(' ').length<=2)out.push(w); }); }); }catch(e){} return out; }
var LASTW='';
function wordLine(){ var ws=learned().filter(function(w){return w.en!==LASTW;}); if(ws.length<3)return null; var w=ws[(Math.random()*ws.length)|0]; LASTW=w.en;
 var lv=petLv(), T=[]; for(var i=1;i<=lv;i++)T=T.concat(WORD_T[i]); if(!S.pdeck)S.pdeck={}; var d=S.pdeck['wordT'+lv]||(S.pdeck['wordT'+lv]={q:[]});
 if(!d.q.length)d.q=shuffle(T.map(function(_,j){return j;})); var t=T[d.q.shift()%T.length];
 function f(x){ return x.replace(/\{w\}/g,w.en).replace(/\{es\}/g,w.es).replace(/\{E\}/g,w.e); } return [f(t[0]),f(t[1])]; }

var ADDED=false;
function addLines(){
 if(ADDED||!window.PET_LINES)return; ADDED=true;
 Object.keys(NEED_MORE).forEach(function(k){ PET_LINES['nd_'+k]={lo:NEED_MORE[k].lo.concat(PET_LINES.need[k]||[]),vlo:NEED_MORE[k].vlo}; });
 [1,2,3].forEach(function(lv){ Object.keys(PET_CHAT).forEach(function(id){ var L=PET_CHAT[id].concat(PET_CHAT[id],CHAT_ALL); if(lv>=2)L=L.concat(PET_CHAT2[id]||[],PET_CHAT2[id]||[]); for(var i=1;i<=lv;i++)L=L.concat(CHAT_LV[i]); PET_LINES['chat_'+id+'_'+lv]={say:L}; }); }); /* sus frases propias salen más seguido; cada nivel suma frases más complejas */
}
window.PET_CHAT=PET_CHAT; window.petLv=petLv; window.petWordLine=wordLine;
var NEXT=0, INV_T=0;
var INVITE=[['Do you want to talk with me?','¿Querés charlar conmigo?'],['Let\'s talk in English!','¡Charlemos en inglés!'],['Can I ask you a question?','¿Te puedo hacer una pregunta?'],['I want to know more about you!','¡Quiero saber más de vos!'],['Talk with me, please!','¡Charlá conmigo, por favor!'],['I have a question for you!','¡Tengo una pregunta para vos!']];
function petInvite(){ if(!PET_LINES.invite)PET_LINES.invite={say:INVITE}; petTalk('invite','say'); try{petAnim('a-jump',900);}catch(e){}
 var room=document.querySelector('.hm-room'); if(!room||room.querySelector('.hm-inv'))return;
 var b=document.createElement('button'); b.className='hm-inv'; b.setAttribute('aria-label','Charlar con tu mascota'); b.innerHTML='💬<i>!</i>'; room.appendChild(b);
 b.onclick=function(e){ e.stopPropagation(); b.remove(); try{ S.chatInvA=(S.chatInvA||0)+1; save(); startChat(0,Math.min(3,(S.world||1))); }catch(x){} };
 S.chatInv=(S.chatInv||0)+1; try{save();}catch(e){}
 setTimeout(function(){ if(b.parentNode)b.remove(); },20000); }
/* ⏰ solo invita si pasaron 24 hs desde la última charla (o nunca charló) */
function chatAgo(){ var c=S.chatSt; if(!c||!c.n)return 1e12; var t=c.lastT||(c.last?new Date(c.last.replace(/-/g,'/')).getTime():0); return Date.now()-t; }
/* se llama cada 2,6 s desde petIdle; habla cuando toca */
window.petProactive=function(){ try{ addLines();
 if(HOME_BUSY||HOME_SEL)return; var scr=document.getElementById('s-home'); if(!scr||!scr.classList.contains('on'))return;
 if(document.querySelector('.pk-ov'))return; var now=Date.now(); if(now<NEXT)return;
 try{ if(speechSynthesis.speaking)return; }catch(e){}
 var h=hData(), p=pet(), id=h.cur; if(!p||p.stage===0||p.sick)return;
 if(p.poop){ petTalk('need','poop'); NEXT=now+14000+Math.random()*5000; return; }
 var low=NEEDS.filter(function(n){return p.nd[n.k]<35&&PET_LINES['nd_'+n.k];}).sort(function(a,b){return p.nd[a.k]-p.nd[b.k];});
 if(low.length){ var n=low.length>1&&Math.random()<0.35?low[1]:low[0]; /* casi siempre la más urgente, a veces la otra */ petTalk('nd_'+n.k,p.nd[n.k]<18?'vlo':'lo'); try{petAnim(p.nd[n.k]<18?'a-shake':'a-wiggle',700);}catch(e){} NEXT=now+13000+Math.random()*6000; return; }
 /* 💬 invitación a charlar: solo si es su compañero y hace más de 24 hs que no charlan */
 if(id===buddyId()&&chatAgo()>864e5&&now-INV_T>90000&&Math.random()<0.5){ INV_T=now; petInvite(); NEXT=now+20000; return; }
 var wl=Math.random()<0.3?wordLine():null; if(wl){ homeSay(wl[0],wl[1]); try{petAnim('a-jump',800);}catch(e){} }
 else if(PET_LINES['chat_'+id+'_'+petLv()]){ petTalk('chat_'+id+'_'+petLv(),'say'); try{petAnim('a-jump',800);}catch(e){} }
 NEXT=now+16000+Math.random()*8000;
}catch(e){} };
window.petProactiveReset=function(d){ NEXT=Date.now()+(d==null?6000:d); };
})();
