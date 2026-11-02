/* 〇〇整体院 デモ v2 */
(function(){
  var root=document.documentElement;
  var still=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* 見出しを1文字ずつ分ける(<br>と<em>は保つ) */
  var h1=document.querySelector('.hero h1');
  if(h1){
    var n=0;
    var lines=h1.innerHTML.split(/<br\s*\/?>/i);
    h1.innerHTML=lines.map(function(line){
      var out=line.replace(/(<[^>]+>)|([^<])/g,function(m,tag,ch){
        if(tag)return tag;
        var d=(1.0+n*0.07).toFixed(2);n++;
        return '<span class="ch" style="transition-delay:'+d+'s">'+(ch===' '?'&nbsp;':ch)+'</span>';
      });
      return '<span class="ln">'+out+'</span>';
    }).join('');
  }

  /* ローディング */
  function done(){document.body.classList.add('loaded');}
  if(still){done();}
  else{
    var t0=Date.now();
    var go=function(){setTimeout(done,Math.max(0,900-(Date.now()-t0)));};
    if(document.readyState==='complete')go();else window.addEventListener('load',go);
    setTimeout(done,2600);
  }

  /* ヘッダー・ページトップ */
  var hd=document.querySelector('.header'),top=document.querySelector('.to-top');
  function onScroll(){
    var y=window.scrollY;
    if(hd)hd.classList.toggle('scrolled',y>10);
    if(top)top.classList.toggle('show',y>600);
    if(!still)document.querySelectorAll('.parallax').forEach(function(el){
      var r=el.getBoundingClientRect(),c=r.top+r.height/2-innerHeight/2;
      el.style.transform='translate3d(0,'+(c*-(+el.dataset.speed||.08)).toFixed(1)+'px,0)';
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* スマホメニュー */
  var mb=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');
  if(mb&&nav)mb.addEventListener('click',function(){
    var open=mb.getAttribute('aria-expanded')==='true';
    mb.setAttribute('aria-expanded',String(!open));
    mb.setAttribute('aria-label',open?'メニューを開く':'メニューを閉じる');
    nav.classList.toggle('open',!open);
  });

  /* ファーストビューの写真切り替え */
  var slides=document.querySelectorAll('.arch img'),dots=document.querySelectorAll('.slide-dots i');
  if(slides.length>1&&!still){
    var i=0;
    setInterval(function(){
      slides[i].classList.remove('on');if(dots[i])dots[i].classList.remove('on');
      i=(i+1)%slides.length;
      slides[i].classList.add('on');if(dots[i])dots[i].classList.add('on');
    },5200);
  }

  /* スクロールで現れる */
  var targets=document.querySelectorAll('.rv,.reveal-img,.worry,.steps,.worry-answer');
  if(still||!('IntersectionObserver' in window)){targets.forEach(function(e){e.classList.add('in');});}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15,rootMargin:'0px 0px -60px 0px'});
    targets.forEach(function(e){io.observe(e);});
  }

  /* 数字のカウントアップ(年数など。料金には使わない) */
  document.querySelectorAll('.count').forEach(function(el){
    var to=+el.dataset.to;if(still||!('IntersectionObserver' in window)){el.textContent=to;return;}
    el.textContent='0';
    var o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();
      var t0=null;function f(t){if(!t0)t0=t;var k=Math.min((t-t0)/1600,1);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f);}requestAnimationFrame(f);
    },{threshold:.6});o.observe(el);
  });

  /* お客様の声のスライド */
  var track=document.querySelector('.voice-track');
  if(track){
    var items=track.children.length,cur=0,vd=document.querySelectorAll('.voice-dots i'),timer;
    function show(k){cur=(k+items)%items;track.style.transform='translateX(-'+(cur*100)+'%)';vd.forEach(function(d,j){d.classList.toggle('on',j===cur);});}
    function auto(){clearInterval(timer);if(!still)timer=setInterval(function(){show(cur+1);},6500);}
    var pv=document.querySelector('.voice-prev'),nx=document.querySelector('.voice-next');
    if(pv)pv.addEventListener('click',function(){show(cur-1);auto();});
    if(nx)nx.addEventListener('click',function(){show(cur+1);auto();});
    show(0);auto();
  }

  /* デモ用フォーム */
  var f=document.getElementById('contact-form'),st=document.getElementById('form-status');
  if(f&&st)f.addEventListener('submit',function(e){e.preventDefault();if(!f.reportValidity())return;st.textContent='デモサイトのため、送信はされません。実際のサイトでは、このあと予約確認のご連絡が届きます。';});

  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
