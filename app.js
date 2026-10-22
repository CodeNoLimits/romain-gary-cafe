// Comportements du site : apparitions, reels, réservation WhatsApp
(function(){
var T=window.T, d=document, WA='972546657655';
d.documentElement.classList.add('js');
var top=d.querySelector('.top'), dock=d.querySelector('.dock'), hero=d.querySelector('.hero');
function onScroll(){var y=scrollY;top.classList.toggle('solid',y>40);if(dock)dock.classList.toggle('on',y>hero.offsetHeight*.7&&!inBook)}
var inBook=false;addEventListener('scroll',onScroll,{passive:true});onScroll();
// apparitions au défilement
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
d.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
var book=d.getElementById('reserver');
new IntersectionObserver(function(es){inBook=es[0].isIntersecting;onScroll()}).observe(book);
// reels : lecture muette auto seulement sur grand écran (vidéos lourdes), toucher = son, nouveau toucher = pause
var reels=[].slice.call(d.querySelectorAll('.reel'));
var auto=matchMedia('(min-width:900px)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches&&!(navigator.connection&&navigator.connection.saveData);
function st(r){var v=r.querySelector('video');r.dataset.s=v.paused?'pause':(v.muted?'muet':'son');r.setAttribute('aria-pressed',String(!v.paused&&!v.muted))}
var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target.querySelector('video');
 if(!e.isIntersecting){v.pause()}else if(auto&&e.intersectionRatio>.6&&v.muted){v.play().catch(function(){})}})},{threshold:[0,.6,1]});
reels.forEach(function(r){var v=r.querySelector('video');vio.observe(r);st(r);
 ['play','pause','volumechange'].forEach(function(n){v.addEventListener(n,function(){st(r)})});
 v.addEventListener('timeupdate',function(){r.style.setProperty('--p',(v.currentTime/v.duration*100||0)+'%')});
 r.addEventListener('click',function(){
  if(v.paused||v.muted){reels.forEach(function(o){var ov=o.querySelector('video');if(ov!==v){ov.muted=true;if(!auto)ov.pause()}});v.muted=false;v.play().catch(function(){})}
  else{v.pause()}})});
var rail=d.querySelector('.rail'),rtl=d.documentElement.dir==='rtl';
d.querySelectorAll('.rail-nav button').forEach(function(b){b.addEventListener('click',function(){var k=+b.dataset.dir*(rtl?-1:1);rail.scrollBy({left:k*290,behavior:'smooth'})})});
// réservation
var f=d.getElementById('resa'), ok=d.getElementById('ok');
// heure de Jérusalem, quel que soit le fuseau du visiteur (format « AAAA-MM-JJ HH:MM »)
function jlm(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date())}
f.date.min=jlm().slice(0,10);
function setErr(name,msg){var i=f[name],e=d.getElementById('e-'+name);i.setAttribute('aria-invalid',msg?'true':'false');e.textContent=msg||''}
function shabbat(date,time){var day=new Date(date+'T12:00').getDay(),h=+(time||'12:00').slice(0,2);return (day===5&&h>=15)||(day===6&&h<20)}
window.buildMsg=function(v){return [T.msgIntro,T.l_date+T.sep+v.date.split('-').reverse().join('/'),T.l_time+T.sep+v.time,T.l_people+T.sep+v.people,T.l_name+T.sep+v.name,T.l_phone+T.sep+v.phone].concat(v.note?[T.l_note+T.sep+v.note]:[]).join('\n')};
window.waUrl=function(v){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(buildMsg(v))};
f.addEventListener('submit',function(ev){ev.preventDefault();
 var v={date:f.date.value,time:f.time.value,people:f.people.value,name:f.name.value.trim(),phone:f.phone.value.trim(),note:f.note.value.trim()},bad=null;
 function chk(n,m){setErr(n,m);if(m&&!bad)bad=n}
 var past=v.date&&v.time&&(v.date+' '+v.time)<jlm();
 chk('date',!v.date?T.e_date:((v.date<f.date.min||past)?T.e_past:(shabbat(v.date,v.time)?T.e_shabbat:'')));
 chk('time',v.time?'':T.e_time);
 chk('people',(+v.people>=1&&+v.people<=60)?'':T.e_people);
 chk('name',v.name.length>=2?'':T.e_name);
 chk('phone',/^\+?[0-9 ()-]{9,16}$/.test(v.phone)&&v.phone.replace(/\D/g,'').length>=9?'':T.e_phone);
 if(bad){f[bad].focus();return}
 var url=waUrl(v);d.getElementById('ok-msg').textContent=buildMsg(v);d.getElementById('ok-link').href=url;
 ok.classList.add('show');ok.focus();window.open(url,'_blank','noopener');});
})();
