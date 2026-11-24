
(function(){
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;


try{
/* ---- 1. loader ---- */
var loader=document.getElementById('loader'), ld=document.getElementById('ld');
function endLoad(){
  ld.classList.add('shrink');
  setTimeout(function(){loader.classList.add('done');document.body.classList.remove('lock');},560);
}
if(loader) setTimeout(endLoad, rm?200:4600);


}catch(_e){}
try{
/* ---- 2. nav ---- */
var hdr=document.getElementById('hdr'), t1=false;
function navScroll(){hdr.classList.toggle('stuck',scrollY>40);t1=false;}
addEventListener('scroll',function(){if(!t1){t1=true;requestAnimationFrame(navScroll)}},{passive:true});
navScroll();


}catch(_e){}
try{
/* ---- 3. hero parallax + glow ---- */
var hM=document.getElementById('hM'),hS=document.getElementById('hS'),
    glow=document.getElementById('glow'),hero=document.querySelector('.hero');
if(!rm) hero.addEventListener('mousemove',function(e){
  var r=hero.getBoundingClientRect(),
      dx=(e.clientX-r.width/2)/r.width, dy=(e.clientY-r.top-r.height/2)/r.height;
  hM.style.transform='translate('+(dx*26).toFixed(1)+'px,'+(dy*16).toFixed(1)+'px)';
  hS.style.transform='translate('+(-dx*26).toFixed(1)+'px,'+(-dy*16).toFixed(1)+'px)';
  glow.style.left=(e.clientX-r.left)+'px'; glow.style.top=(e.clientY-r.top)+'px';
});

/* rotating service words */
var rot=document.getElementById('rot').querySelectorAll('b'), ri=0;
setInterval(function(){
  rot[ri].className='up'; ri=(ri+1)%rot.length;
  rot.forEach(function(b,i){if(i!==ri&&b.className!=='up')b.className='';});
  rot[ri].className='on';
}, 2200);


}catch(_e){}
try{
/* ---- 4. M X S signature ---- */
var mw=document.getElementById('signature'), mlet=document.getElementById('mxsLetters'),
    sigBar=document.getElementById('sigBar'),
    cards=[document.getElementById('CM'),document.getElementById('CX'),document.getElementById('CS')],
    t2=false;
function cl(v){return Math.min(1,Math.max(0,v))}
function sigRender(){
  t2=false;
  if(!mw) return;
  var r=mw.getBoundingClientRect(), tot=mw.offsetHeight-innerHeight, p=cl((-r.top)/tot);
  var spread = cl((p-.04)/.18) - cl((p-.80)/.16);     // apart, hold, back together
  var reveal = cl((p-.18)/.14) - cl((p-.78)/.13);
  mlet.style.setProperty('--gap', (spread*7.2).toFixed(2)+'%');
  sigBar.style.transform='scaleX('+p.toFixed(4)+')';
  cards.forEach(function(c,i){
    var d=cl(reveal-(i*.06));
    c.style.opacity=d; c.style.transform='translateY('+(18-18*d).toFixed(1)+'px)';
  });
}
addEventListener('scroll',function(){if(!t2){t2=true;requestAnimationFrame(sigRender)}},{passive:true});
addEventListener('resize',sigRender); sigRender();


}catch(_e){}
try{
/* ---- 5. services dim-siblings ---- */
var svcs=document.getElementById('svcs');
svcs.addEventListener('mouseenter',function(){svcs.classList.add('dim')});
svcs.addEventListener('mouseleave',function(){svcs.classList.remove('dim')});


}catch(_e){}
try{
/* ---- 6. work card tilt ---- */
document.querySelectorAll('.wk').forEach(function(c){
  if(rm) return;
  var m=c.querySelector('.wk-mock'), eye=c.querySelector('.wk-eye');
  c.addEventListener('mousemove',function(e){
    var r=c.getBoundingClientRect(),
        x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    m.style.transform='scale(1.06) rotateY('+(x*7).toFixed(2)+'deg) rotateX('+(-y*7).toFixed(2)+'deg)';
    eye.style.left=(e.clientX-r.left)+'px'; eye.style.top=(e.clientY-r.top)+'px';
  });
  c.addEventListener('mouseleave',function(){m.style.transform=''});
});



}catch(_e){}
try{
/* ---- 6b. project preview ---- */
(function(){
  var wrap=document.getElementById('pvWrap');
  if(!wrap) return;
  var view=document.getElementById('pvView'), scroll=document.getElementById('pvScroll'),
      urlEl=document.getElementById('pvUrl'), hint=document.getElementById('pvHint'),
      sites=[].slice.call(scroll.querySelectorAll('.pvsite')),
      devBtns=[].slice.call(wrap.querySelectorAll('.pv-dev')),
      lastFocus=null, open=false;

  function show(key){
    var found=false;
    sites.forEach(function(el){
      var m=el.getAttribute('data-site')===key;
      el.classList.toggle('on',m);
      if(m){found=true; urlEl.textContent=el.getAttribute('data-url')||'preview';}
    });
    if(!found) return false;
    scroll.scrollTop=0;
    hint.classList.remove('gone');
    return true;
  }
  function openPv(key,trigger){
    if(!show(key)) return;
    lastFocus=trigger||null;
    wrap.classList.add('on'); wrap.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    document.documentElement.style.overflow='hidden';
    syncDev();
    open=true;
    setTimeout(function(){ var b=wrap.querySelector('.pv-x'); if(b) b.focus(); },80);
  }
  function closePv(){
    if(!open) return;
    wrap.classList.remove('on'); wrap.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    document.documentElement.style.overflow='';
    open=false;
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('.wk[data-preview]').forEach(function(card){
    var key=card.getAttribute('data-preview'),
        img=card.querySelector('.wk-img');
    if(img) img.addEventListener('click',function(){ openPv(key,card) });
    card.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openPv(key,card) }
    });
    var lnk=card.querySelector('.wk-open');
    if(lnk) lnk.addEventListener('click',function(e){ e.preventDefault(); openPv(key,card) });
  });

  wrap.addEventListener('click',function(e){
    if(e.target.closest('[data-pvclose]')) closePv();
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && open) closePv();
  });
  scroll.addEventListener('scroll',function(){
    if(scroll.scrollTop>40) hint.classList.add('gone');
  },{passive:true});
  function isPhone(){ return window.innerWidth<=820 }
  function syncDev(){
    if(isPhone()){ view.classList.add('mob'); return; }
    var on=wrap.querySelector('.pv-dev.on');
    view.classList.toggle('mob', !!on && on.getAttribute('data-dev')==='mob');
  }
  devBtns.forEach(function(b){
    b.addEventListener('click',function(){
      devBtns.forEach(function(o){o.classList.remove('on')});
      b.classList.add('on');
      syncDev();
      scroll.scrollTop=0;
    });
  });
  window.addEventListener('resize',function(){ if(open) syncDev(); });
})();



}catch(_e){}
try{
/* ---- 6c. preview site interactivity ---- */
(function(){
  var root=document.getElementById('pvScroll');
  if(!root) return;

  /* ===== Know a City ===== */
  (function(){
    var host=root.querySelector('.pv-kc'); if(!host) return;
    var DATA={
      "Detroit":{wx:"71\u00B0F \u00B7 Clear all afternoon",cafes:[
        {n:"Rosetta & Co.",a:"Corktown \u00B7 0.4 mi",r:"4.8",g:["#D8A87C","#B4764A"],t:["Filter","Wi-Fi","Outdoor"],o:"Open until 6pm",x:22,y:34},
        {n:"The Long Pour",a:"Midtown \u00B7 0.9 mi",r:"4.7",g:["#A8B79E","#6F8265"],t:["Espresso","Quiet"],o:"Open until 8pm",x:44,y:22},
        {n:"Paperback Coffee",a:"Eastern Market \u00B7 1.2 mi",r:"4.9",g:["#C69A8E","#96635A"],t:["Books","Brunch","Wi-Fi"],o:"Open until 5pm",x:63,y:38},
        {n:"Northline Roasters",a:"New Center \u00B7 1.6 mi",r:"4.6",g:["#9AA9BF","#63748C"],t:["Roastery","Seating"],o:"Open until 7pm",x:36,y:58},
        {n:"Fourteen Grams",a:"Greektown \u00B7 2.1 mi",r:"4.8",g:["#D3B27A","#A6844A"],t:["Pour-over","Pastry"],o:"Closes at 4pm",x:58,y:66},
        {n:"Halcyon",a:"Rivertown \u00B7 2.8 mi",r:"4.5",g:["#8FA8A5","#5C7674"],t:["Outdoor","Riverside"],o:"Open until 9pm",x:80,y:52}]},
      "Chicago":{wx:"64\u00B0F \u00B7 Breezy, clouds later",cafes:[
        {n:"Halsted Grounds",a:"Lincoln Park \u00B7 0.3 mi",r:"4.7",g:["#B78A6A","#8A5C3D"],t:["Filter","Wi-Fi"],o:"Open until 7pm",x:30,y:28},
        {n:"The Blue Line",a:"Wicker Park \u00B7 0.8 mi",r:"4.9",g:["#7A93AD","#4C6580"],t:["Espresso","Quiet","Wi-Fi"],o:"Open until 8pm",x:52,y:40},
        {n:"Marigold & Rye",a:"Logan Square \u00B7 1.4 mi",r:"4.6",g:["#C9A55E","#997534"],t:["Brunch","Pastry"],o:"Open until 3pm",x:24,y:56},
        {n:"Pilsen Roast Co.",a:"Pilsen \u00B7 2.0 mi",r:"4.8",g:["#A66A5C","#733F35"],t:["Roastery","Outdoor"],o:"Open until 6pm",x:66,y:62},
        {n:"Ashland Slow Bar",a:"West Loop \u00B7 2.3 mi",r:"4.5",g:["#8FA394","#5E7263"],t:["Pour-over","Quiet"],o:"Open until 5pm",x:74,y:30}]},
      "Austin":{wx:"93\u00B0F \u00B7 Hot, seek the shade",cafes:[
        {n:"Cedar & Cortado",a:"South Congress \u00B7 0.5 mi",r:"4.8",g:["#C99A66","#98693A"],t:["Espresso","Outdoor"],o:"Open until 7pm",x:40,y:64},
        {n:"Barton Springs Brew",a:"Zilker \u00B7 1.1 mi",r:"4.7",g:["#93AE8F","#61805C"],t:["Outdoor","Wi-Fi"],o:"Open until 6pm",x:22,y:48},
        {n:"The Tallboy",a:"East Austin \u00B7 1.7 mi",r:"4.6",g:["#B7818F","#87515F"],t:["Filter","Pastry"],o:"Open until 8pm",x:68,y:36},
        {n:"Rio Frio Coffee",a:"Downtown \u00B7 0.9 mi",r:"4.9",g:["#7E96AB","#50687D"],t:["Quiet","Wi-Fi","Espresso"],o:"Open until 9pm",x:50,y:26}]}
    };
    var TAGS=["Wi-Fi","Outdoor","Espresso","Quiet","Brunch","Pastry"];
    var city="Detroit", q="", tags=[], sel=-1;
    var elC=host.querySelector('#kcCities'), elWx=host.querySelector('#kcWx'),
        elS=host.querySelector('#kcSearch'), elCh=host.querySelector('#kcChips'),
        elN=host.querySelector('#kcCount'), elI=host.querySelector('#kcItems'),
        elM=host.querySelector('#kcMap'), elF=host.querySelector('#kcInfo');

    Object.keys(DATA).forEach(function(c){
      var b=document.createElement('button');
      b.type='button'; b.className='kc-city'+(c===city?' on':''); b.textContent=c;
      b.addEventListener('click',function(){
        city=c; sel=-1; q=''; elS.value='';
        elC.querySelectorAll('.kc-city').forEach(function(o){o.classList.toggle('on',o===b)});
        render();
      });
      elC.appendChild(b);
    });
    TAGS.forEach(function(t){
      var b=document.createElement('button');
      b.type='button'; b.className='kc-chip'; b.textContent=t;
      b.addEventListener('click',function(){
        var i=tags.indexOf(t);
        if(i>-1){tags.splice(i,1); b.classList.remove('on')}
        else{tags.push(t); b.classList.add('on')}
        sel=-1; render();
      });
      elCh.appendChild(b);
    });
    elS.addEventListener('input',function(){ q=elS.value.toLowerCase(); sel=-1; render(); });

    function visible(){
      return DATA[city].cafes.filter(function(cf){
        if(q && cf.n.toLowerCase().indexOf(q)===-1) return false;
        for(var i=0;i<tags.length;i++) if(cf.t.indexOf(tags[i])===-1) return false;
        return true;
      });
    }
    function mapDecor(){
      return '<i class="rd h" style="height:12px;left:0;right:0;top:31%"></i>'
        +'<i class="rd h" style="height:12px;left:0;right:0;top:67%"></i>'
        +'<i class="rd v" style="width:12px;top:0;bottom:0;left:26%"></i>'
        +'<i class="rd v" style="width:12px;top:0;bottom:0;left:63%"></i>'
        +'<span class="kc-wtr" style="right:-50px;top:56%;width:240px;height:240px"></span>'
        +'<span class="kc-park" style="left:8%;top:8%;width:130px;height:96px"></span>'
        +'<span class="kc-park" style="right:12%;top:6%;width:80px;height:64px"></span>';
    }
    function render(){
      elWx.textContent=DATA[city].wx;
      var v=visible();
      elN.textContent=v.length+' caf\u00E9'+(v.length===1?'':'s')+' \u00B7 '+city;
      elI.innerHTML='';
      elM.querySelectorAll('.kc-dot').forEach(function(d){d.remove()});
      if(!elM.querySelector('.rd')) elM.insertAdjacentHTML('afterbegin',mapDecor());
      if(!v.length){
        elI.innerHTML='<div class="kc-none">Nothing matches that combination. Clear a filter and try again.</div>';
        elF.classList.add('off'); return;
      }
      v.forEach(function(cf,i){
        var it=document.createElement('div');
        it.className='kc-it'+(i===sel?' on':'');
        it.innerHTML='<span class="kc-th" style="background:linear-gradient(135deg,'+cf.g[0]+','+cf.g[1]+')"></span>'
          +'<div><h4>'+cf.n+'</h4><p>'+cf.a+'</p><div class="kc-tg">'
          +cf.t.map(function(t){return '<span>'+t+'</span>'}).join('')+'</div></div>'
          +'<span class="kc-rt">\u2605 '+cf.r+'</span>';
        it.addEventListener('click',function(){ pick(i,v) });
        elI.appendChild(it);
        var d=document.createElement('span');
        d.className='kc-dot'+(i===sel?' on':'');
        d.style.left=cf.x+'%'; d.style.top=cf.y+'%';
        d.setAttribute('title',cf.n);
        d.addEventListener('click',function(){ pick(i,v) });
        elM.appendChild(d);
      });
      if(sel>-1 && v[sel]){
        var cf=v[sel];
        elF.innerHTML='<h4>'+cf.n+'</h4><p>'+cf.a+' \u00B7 \u2605 '+cf.r+'</p>'
          +'<span class="kc-open">'+cf.o+'</span><span class="kc-act">Save to list \u2192</span>';
        elF.classList.remove('off');
      } else elF.classList.add('off');
    }
    function pick(i,v){ sel=(sel===i?-1:i); render(); }
    render();
  })();

  /* ===== Between the Words ===== */
  (function(){
    var host=root.querySelector('.pv-bw'); if(!host) return;
    var BOOKS=[
      {t:"The Salt Almanac",a:"Ines Vaziri",p:18.00,g:"Fiction",c:["#7A4E3B","#4A2C20"],s:5,
       d:"A coastal town, a missing ledger, and a narrator you will not fully trust until the final chapter. Our bestselling debut of the year.",
       n:"\u201CRead it in two sittings and immediately handed it to a customer.\u201D \u2014 Sarah, front of shop"},
      {t:"Northbound",a:"Clare Adeyemi",p:16.50,g:"Fiction",c:["#38566B","#1F3243"],s:4,
       d:"Three generations drive the same highway for very different reasons. Quiet, precise, and devastating in the last thirty pages.",
       n:"\u201CThe road-trip novel, finally done right.\u201D \u2014 Devon, buyer"},
      {t:"A Quiet Inventory",a:"Tomas Reiner",p:21.00,g:"Essays",c:["#6B6440","#3F3B22"],s:5,
       d:"Essays on the objects we keep and the people they stand in for. The title piece alone is worth the cover price.",
       n:"\u201CI dog-eared half the book. Sorry, stockroom.\u201D \u2014 Priya, events"},
      {t:"The Glasshouse Year",a:"Mira Okonkwo",p:19.50,g:"Memoir",c:["#8A4B54","#54282F"],s:5,
       d:"Twelve months rebuilding a ruined conservatory, and a marriage, one pane at a time. Tender without ever being soft.",
       n:"\u201CThe memoir I press into the most hands.\u201D \u2014 Sarah, front of shop"},
      {t:"Small Hours",a:"Ruth Delacroix",p:15.00,g:"Poetry",c:["#4C5F53","#2A3730"],s:4,
       d:"Poems written between night shifts at a city hospital. Short, exact, and kinder than the circumstances that produced them.",
       n:"\u201CBuy two. You will give the first away.\u201D \u2014 Devon, buyer"},
      {t:"Paper Cities",a:"Jonas Wren",p:22.00,g:"Essays",c:["#6A5478","#3D2F47"],s:4,
       d:"How maps lie, why we let them, and what the corrected picture costs. Cartography for people who read fiction.",
       n:"\u201CThe footnotes are half the fun.\u201D \u2014 Priya, events"},
      {t:"The Lending Room",a:"Anya Petrov",p:17.50,g:"Fiction",c:["#8A6A3B","#523F21"],s:5,
       d:"A village library run on favours and secrets. Cosy on the surface, with a spine of real steel underneath.",
       n:"\u201COur book-club pick three months running.\u201D \u2014 Sarah, front of shop"},
      {t:"Everything Kept",a:"Sam Oyelaran",p:20.00,g:"Memoir",c:["#3F5A6B","#243642"],s:4,
       d:"A son inherits a house he has never visited and a father he never knew. Grief, inventory lists, and unexpected comedy.",
       n:"\u201CFunnier than any grief memoir has a right to be.\u201D \u2014 Devon, buyer"}];
    var GEN=["All","Fiction","Essays","Memoir","Poetry"];
    var genre="All", focus=0, basket=0;
    var elG=host.querySelector('#bwGenres'), elGr=host.querySelector('#bwGrid'),
        elF=host.querySelector('#bwFocus'), elH=host.querySelector('#bwHead'),
        elN=host.querySelector('#bwCount'), elB=host.querySelector('#bwBkt');

    GEN.forEach(function(g){
      var n=(g==="All")?BOOKS.length:BOOKS.filter(function(b){return b.g===g}).length;
      var b=document.createElement('button');
      b.type='button'; b.className='bw-gn'+(g===genre?' on':'');
      b.innerHTML=g+'<i>'+n+'</i>';
      b.addEventListener('click',function(){
        genre=g; focus=0;
        elG.querySelectorAll('.bw-gn').forEach(function(o){o.classList.toggle('on',o===b)});
        render();
      });
      elG.appendChild(b);
    });
    function stars(n){var s='';for(var i=0;i<5;i++)s+=(i<n?'\u2605':'\u2606');return s}
    function list(){ return genre==="All"?BOOKS:BOOKS.filter(function(b){return b.g===genre}) }
    function render(){
      var v=list();
      elH.textContent=(genre==="All"?"All titles":genre);
      elN.textContent=v.length+' of '+BOOKS.length+' titles';
      if(focus>=v.length) focus=0;
      var f=v[focus];
      elF.innerHTML='<div class="bw-fc" style="background:linear-gradient(160deg,'+f.c[0]+','+f.c[1]+')">'
        +'<span>'+f.t+'</span></div>'
        +'<div class="bw-fx"><div class="bw-star">'+stars(f.s)+'</div><h3>'+f.t+'</h3>'
        +'<div class="bw-au">'+f.a+' \u00B7 '+f.g+'</div><p>'+f.d+'</p>'
        +'<p style="font-size:12.5px;color:#96795A;font-style:italic">'+f.n+'</p>'
        +'<div class="bw-fr"><span class="bw-pr">$'+f.p.toFixed(2)+'</span>'
        +'<button class="bw-add" type="button">Add to basket</button></div></div>';
      elF.querySelector('.bw-add').addEventListener('click',function(){
        basket++; elB.textContent='Basket \u00B7 '+basket;
        this.textContent='Added \u2713'; this.classList.add('done');
        var btn=this; setTimeout(function(){btn.textContent='Add to basket';btn.classList.remove('done')},1200);
      });
      elGr.innerHTML='';
      v.forEach(function(bk,i){
        var el=document.createElement('article');
        el.className='bw-bk'+(i===focus?' on':'');
        el.innerHTML='<div class="bw-cv" style="background:linear-gradient(160deg,'+bk.c[0]+','+bk.c[1]+')">'
          +'<span>'+bk.t+'</span></div><h4>'+bk.t+'</h4><p>'+bk.a+'</p><b>$'+bk.p.toFixed(2)+'</b>';
        el.addEventListener('click',function(){
          focus=i; render();
          elF.scrollIntoView({behavior:'smooth',block:'nearest'});
        });
        elGr.appendChild(el);
      });
    }
    render();
  })();

  /* ===== MMI Group ===== */
  (function(){
    var host=root.querySelector('.pv-mmi'); if(!host) return;
    var CATS={
      "Oils & Vinegars":{d:"Estate-pressed olive oils and aged vinegars, retail and food-service formats. All lines carry origin and lot documentation.",items:[
        {n:"Extra Virgin Olive Oil \u2014 Koroneiki",o:"Greece",k:"12 \u00D7 750ml",p:"$68.40",w:11,c:"#5A7A4A"},
        {n:"Cold-Pressed EVOO \u2014 Picual",o:"Spain",k:"4 \u00D7 5L tin",p:"$96.00",w:19,c:"#6B8A3F"},
        {n:"Aged Balsamic \u2014 6 year",o:"Italy",k:"12 \u00D7 500ml",p:"$74.20",w:9,c:"#5C3A2E"},
        {n:"Pomace Oil \u2014 food service",o:"T\u00FCrkiye",k:"1 \u00D7 20L drum",p:"$52.80",w:20,c:"#8A7A3A"}]},
      "Grains & Pulses":{d:"Long-grain and specialty rice, bulgur and lentils, packed to order in food-grade sacks by the pallet.",items:[
        {n:"Basmati Rice \u2014 extra long",o:"India",k:"1 \u00D7 20kg sack",p:"$31.50",w:20,c:"#9C7B3F"},
        {n:"Calrose Rice \u2014 medium",o:"USA",k:"1 \u00D7 22.7kg sack",p:"$24.90",w:23,c:"#B09055"},
        {n:"Coarse Bulgur #3",o:"T\u00FCrkiye",k:"1 \u00D7 25kg sack",p:"$22.40",w:25,c:"#8A6A34"},
        {n:"Red Split Lentils",o:"Canada",k:"1 \u00D7 25kg sack",p:"$28.70",w:25,c:"#A15E32"},
        {n:"Chickpeas \u2014 9mm",o:"Mexico",k:"1 \u00D7 25kg sack",p:"$33.10",w:25,c:"#B08A4A"}]},
      "Preserves & Pickles":{d:"Jarred vegetables, olives and antipasti in retail and catering formats, with long ambient shelf life.",items:[
        {n:"Kalamata Olives \u2014 pitted",o:"Greece",k:"2 \u00D7 5kg pail",p:"$58.60",w:11,c:"#4A3A57"},
        {n:"Pickled Turnip \u2014 beet cured",o:"Lebanon",k:"6 \u00D7 1.8kg jar",p:"$41.20",w:12,c:"#8A3A54"},
        {n:"Roasted Red Peppers",o:"Peru",k:"12 \u00D7 660g jar",p:"$44.80",w:9,c:"#A1442E"},
        {n:"Stuffed Vine Leaves",o:"T\u00FCrkiye",k:"12 \u00D7 400g tin",p:"$38.90",w:6,c:"#5A6E3C"}]},
      "Spices":{d:"Whole and ground spice lines, packed to order. Certificates of analysis available on every lot.",items:[
        {n:"Aleppo-Style Pepper Flakes",o:"T\u00FCrkiye",k:"1 \u00D7 10kg carton",p:"$84.00",w:10,c:"#9A3A26"},
        {n:"Cumin \u2014 whole seed",o:"India",k:"1 \u00D7 25kg sack",p:"$96.50",w:25,c:"#7A5A2E"},
        {n:"Sumac \u2014 ground",o:"Lebanon",k:"1 \u00D7 10kg carton",p:"$78.30",w:10,c:"#6E2E3A"},
        {n:"Sweet Paprika \u2014 120 ASTA",o:"Spain",k:"1 \u00D7 25kg sack",p:"$112.00",w:25,c:"#A13A22"}]},
      "Canned & Ambient":{d:"Tomatoes, legumes and ready lines with 18\u201336 month shelf life, palletised by layer or full pallet.",items:[
        {n:"Peeled Plum Tomatoes",o:"Italy",k:"6 \u00D7 2.55kg tin",p:"$29.40",w:16,c:"#A13226"},
        {n:"Cooked Chickpeas",o:"Spain",k:"12 \u00D7 800g tin",p:"$21.80",w:10,c:"#B0904A"},
        {n:"Tahini \u2014 100% sesame",o:"Ethiopia sesame",k:"6 \u00D7 2kg tub",p:"$67.90",w:12,c:"#8A7A5A"},
        {n:"Pomegranate Molasses",o:"Lebanon",k:"12 \u00D7 500ml",p:"$52.30",w:8,c:"#5E2434"}]}
    };
    var cat=Object.keys(CATS)[0], pallet={};
    var elT=host.querySelector('#mmiTabs'), elD=host.querySelector('#mmiDesc'),
        elTb=host.querySelector('#mmiTbl'), elP=host.querySelector('#mmiPallet'),
        elPC=host.querySelector('#mmiPCount'), elPW=host.querySelector('#mmiPWt'),
        elQ=host.querySelector('#mmiQuote');

    Object.keys(CATS).forEach(function(c){
      var b=document.createElement('button');
      b.type='button'; b.className='mmi-tab'+(c===cat?' on':''); b.textContent=c;
      b.addEventListener('click',function(){
        cat=c;
        elT.querySelectorAll('.mmi-tab').forEach(function(o){o.classList.toggle('on',o===b)});
        render();
      });
      elT.appendChild(b);
    });
    function palletUpdate(){
      var keys=Object.keys(pallet), wt=0;
      keys.forEach(function(k){wt+=pallet[k]});
      elPC.textContent=keys.length+' line'+(keys.length===1?'':'s');
      elPW.textContent=wt+' kg';
      elP.classList.toggle('on',keys.length>0);
    }
    function render(){
      elD.textContent=CATS[cat].d;
      var h='<div class="mmi-tr hd"><div>Product</div><div>Origin</div><div>Pack</div><div>Trade price</div><div></div></div>';
      elTb.innerHTML=h;
      CATS[cat].items.forEach(function(it){
        var key=cat+'|'+it.n, inP=pallet.hasOwnProperty(key);
        var row=document.createElement('div');
        row.className='mmi-tr';
        row.innerHTML='<div class="mmi-pn"><span class="mmi-sw" style="background:'+it.c+'"></span>'
          +'<div><b>'+it.n+'</b><span>Lot-traceable \u00B7 COA on request</span></div></div>'
          +'<div class="mmi-org">'+it.o+'</div><div class="mmi-pk">'+it.k+'</div>'
          +'<div class="mmi-prc">'+it.p+'</div>'
          +'<button class="mmi-addp'+(inP?' in':'')+'" type="button">'+(inP?'On pallet \u2713':'Add to pallet')+'</button>';
        row.querySelector('.mmi-addp').addEventListener('click',function(){
          if(pallet.hasOwnProperty(key)){delete pallet[key];
            this.classList.remove('in'); this.textContent='Add to pallet';}
          else{pallet[key]=it.w;
            this.classList.add('in'); this.textContent='On pallet \u2713';}
          palletUpdate();
        });
        elTb.appendChild(row);
      });
    }
    elQ.addEventListener('click',function(){
      elQ.textContent='Quote requested \u2713';
      setTimeout(function(){elQ.textContent='Request quote'; pallet={}; palletUpdate(); render();},1500);
    });
    render(); palletUpdate();
  })();
})();


}catch(_e){}
try{
/* ---- 7. process line ---- */
var proc=document.getElementById('proc'), fill=document.getElementById('procFill'),
    steps=[].slice.call(proc.querySelectorAll('.step')), t3=false;
function procRender(){
  t3=false;
  if(!proc) return;
  var r=proc.getBoundingClientRect(), h=proc.offsetHeight,
      p=cl((innerHeight*0.72-r.top)/h);
  fill.style.height=(p*(h-20))+'px';
  steps.forEach(function(s){
    var sr=s.getBoundingClientRect();
    s.classList.toggle('on', sr.top < innerHeight*0.72);
  });
}
addEventListener('scroll',function(){if(!t3){t3=true;requestAnimationFrame(procRender)}},{passive:true});
procRender();


}catch(_e){}
try{
/* ---- 8. pricing toggle ---- */
var tg=document.getElementById('tg');
tg.addEventListener('click',function(e){
  var b=e.target.closest('button'); if(!b) return;
  tg.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)});
  document.querySelectorAll('.panelset .panel').forEach(function(pn){
    pn.classList.toggle('on', pn.dataset.p===b.dataset.p);
  });
});


}catch(_e){}
try{
/* ---- 11. about name flip ---- */
var aa=document.getElementById('aboutAnim');
new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting) setTimeout(function(){aa.classList.add('flip')},700); });
},{threshold:.6}).observe(aa);


}catch(_e){}
try{
/* ---- 13. cta light through the X ---- */
var cta=document.getElementById('cta'), cl2=document.getElementById('ctaLight');
if(!rm) cta.addEventListener('mousemove',function(e){
  if(!cta) return;
  var r=cta.getBoundingClientRect();
  cl2.style.left=(e.clientX-r.left)+'px'; cl2.style.top=(e.clientY-r.top)+'px';
});


}catch(_e){}
try{
/* ---- whatsapp label peek ---- */
var waLbl=document.getElementById('waLbl');
setTimeout(function(){waLbl.classList.add('show');
  setTimeout(function(){waLbl.classList.remove('show')},3800);},6000);


}catch(_e){}
try{
/* ---- legal page routing ---- */
var LEGALIDS=['privacy','terms','cookies','accessibility'];
function showLegal(id){
  LEGALIDS.forEach(function(k){
    var el=document.getElementById(k); if(el) el.classList.toggle('on',k===id);
  });
  document.body.classList.toggle('legalmode',!!id);
  if(id){scrollTo(0,0)}
}
function routeHash(){
  var h=(location.hash||'').replace('#','');
  showLegal(LEGALIDS.indexOf(h)>-1?h:(document.body.getAttribute('data-page')==='legal'?'privacy':null));
}
addEventListener('hashchange',routeHash); routeHash();
document.addEventListener('click',function(e){
  var a=e.target.closest('a[href^="#"]'); if(!a) return;
  var id=a.getAttribute('href').replace('#','');
  if(LEGALIDS.indexOf(id)<0 && document.body.classList.contains('legalmode')){
    showLegal(null);
  }
});


}catch(_e){}
try{
/* ---- cookie banner ---- */
(function(){
  var bar=document.getElementById('cookiebar');
  if(!bar) return;
  setTimeout(function(){bar.classList.add('on')},1400);
  bar.addEventListener('click',function(e){
    if(e.target.closest('[data-ck]')) bar.classList.remove('on');
  });
})();


}catch(_e){}
try{
/* ---- section entrances ---- */
if(!rm){
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){
      e.target.style.opacity=1; e.target.style.transform='none'; io.unobserve(e.target);
    }});
  },{threshold:.12});
  document.querySelectorAll('.sec .eyebrow, .sec h2, .sec .lede, .tier, .tr, .wk, .prin').forEach(function(el,i){
    el.style.opacity=0; el.style.transform='translateY(18px)';
    el.style.transition='opacity .6s var(--eo) '+((i%6)*45)+'ms, transform .6s var(--eo) '+((i%6)*45)+'ms';
    io.observe(el);
  });
}

}catch(_e){}
try{
var _brg=document.querySelector('.burger'),_nv=document.querySelector('.nav');
if(_brg){_brg.addEventListener('click',function(){_nv.classList.toggle('open')});
_nv.addEventListener('click',function(e){if(e.target.closest('ul a'))_nv.classList.remove('open')});}
}catch(_e){}
})();
