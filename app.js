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
// reels : lecture muette quand visible, son au toucher
var reels=[].slice.call(d.querySelectorAll('.reel'));
var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target.querySelector('video');
 if(e.isIntersecting&&e.intersectionRatio>.6){v.play().catch(function(){})}else{v.pause()}})},{threshold:[0,.6,1]});
reels.forEach(function(r){var v=r.querySelector('video'),s=r.querySelector('.snd');vio.observe(r);
 v.addEventListener('timeupdate',function(){r.style.setProperty('--p',(v.currentTime/v.duration*100||0)+'%')});
 r.addEventListener('click',function(){var on=v.muted;reels.forEach(function(o){var ov=o.querySelector('video');ov.muted=true;o.querySelector('.snd').textContent='🔇';o.setAttribute('aria-pressed','false')});
  v.muted=!on;s.textContent=on?'🔊':'🔇';r.setAttribute('aria-pressed',String(on));if(on){v.play().catch(function(){})}})});
var rail=d.querySelector('.rail'),rtl=d.documentElement.dir==='rtl';
d.querySelectorAll('.rail-nav button').forEach(function(b){b.addEventListener('click',function(){var k=+b.dataset.dir*(rtl?-1:1);rail.scrollBy({left:k*290,behavior:'smooth'})})});
// réservation
var f=d.getElementById('resa'), ok=d.getElementById('ok');
var today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
f.date.min=today.toISOString().slice(0,10);
function setErr(name,msg){var i=f[name],e=d.getElementById('e-'+name);i.setAttribute('aria-invalid',msg?'true':'false');e.textContent=msg||''}
function shabbat(date,time){var day=new Date(date+'T12:00').getDay(),h=+(time||'12:00').slice(0,2);return (day===5&&h>=15)||(day===6&&h<20)}
window.buildMsg=function(v){return [T.msgIntro,T.l_date+': '+v.date.split('-').reverse().join('/'),T.l_time+': '+v.time,T.l_people+': '+v.people,T.l_name+': '+v.name,T.l_phone+': '+v.phone].concat(v.note?[T.l_note+': '+v.note]:[]).join('\n')};
window.waUrl=function(v){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(buildMsg(v))};
f.addEventListener('submit',function(ev){ev.preventDefault();
 var v={date:f.date.value,time:f.time.value,people:f.people.value,name:f.name.value.trim(),phone:f.phone.value.trim(),note:f.note.value.trim()},bad=null;
 function chk(n,m){setErr(n,m);if(m&&!bad)bad=n}
 chk('date',!v.date?T.e_date:(v.date<f.date.min?T.e_past:(shabbat(v.date,v.time)?T.e_shabbat:'')));
 chk('time',v.time?'':T.e_time);
 chk('people',(+v.people>=1&&+v.people<=60)?'':T.e_people);
 chk('name',v.name.length>=2?'':T.e_name);
 chk('phone',/^\+?[0-9 ()-]{9,16}$/.test(v.phone)&&v.phone.replace(/\D/g,'').length>=9?'':T.e_phone);
 if(bad){f[bad].focus();return}
 var url=waUrl(v);d.getElementById('ok-msg').textContent=buildMsg(v);d.getElementById('ok-link').href=url;
 ok.classList.add('show');ok.focus();window.open(url,'_blank','noopener');});
})();
