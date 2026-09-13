/* ============================================================ RENDER ============================================================ */
var lang="nl", page="home", app=document.getElementById("app");
function t(o){ if(o==null) return ""; return (typeof o==="string")?o:(o[lang]||o.en||o.nl||""); }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function area(id){ for(var i=0;i<AREAS.length;i++){ if(AREAS[i].id===id) return AREAS[i]; } return null; }
function aName(a){ return lang==="nl"?a.nl:a.en; }
function no(n){ return (n<10?"0":"")+n; }

var ACT=[{id:"web",nl:"IT & Web",en:"IT & Web"},
  {id:"proto",nl:"Prototyping",en:"Prototyping"},{id:"make",nl:"Productie",en:"Manufacturing"},
  {id:"yard",nl:"Project Yard",en:"Project Yard"},{id:"start",nl:"Start-ups",en:"Start-ups"},
  {id:"work",nl:"Ons werk",en:"Our work"}];
var NAV=[{id:"price",nl:"Tarieven",en:"Pricing"},
  {id:"about",nl:"Over ons",en:"About us"},{id:"contact",nl:"Contact",en:"Contact"}];
var ACTL={nl:"Activiteiten",en:"Activities"};

/* ---------------- URLs ----------------
   ROUTES is written by build.py so the JS and the build always agree on slugs.
   Every clickable destination is a real <a href> so crawlers can follow it;
   clicks are intercepted and handled client-side. */
function href(id, l){
  var m = (typeof ROUTES!=="undefined") && ROUTES[l||lang];
  return (m && m[id]) || "/";
}
function pageFromPath(path){
  for(var l in ROUTES){ for(var id in ROUTES[l]){ if(ROUTES[l][id]===path) return {page:id, lang:l}; } }
  return null;
}
function go(id, attrs){
  return '<a href="'+href(id)+'" data-go="'+id+'"'+(attrs||"")+'>';
}
function renderNav(){
  var open=ACT.some(function(a){return a.id===page;});
  var m="";
  for(var i=0;i<ACT.length;i++)
    m+='<a role="menuitem" href="'+href(ACT[i].id)+'" data-go="'+ACT[i].id+'"'
      +(page===ACT[i].id?' aria-current="page"':'')+'>'
      +esc(lang==="nl"?ACT[i].nl:ACT[i].en)+'</a>';
  var h='<div class="dd"><button id="ddbtn" aria-expanded="false" aria-haspopup="true" aria-controls="ddmenu"'
    +(open?' aria-current="page"':'')+'>'+esc(t(ACTL))+'</button>'
    +'<div class="ddmenu" id="ddmenu" role="menu" aria-labelledby="ddbtn" hidden>'+m+'</div></div>';
  for(var j=0;j<NAV.length;j++)
    h+='<a href="'+href(NAV[j].id)+'" data-go="'+NAV[j].id+'"'
      +(page===NAV[j].id?' aria-current="page"':'')+'>'
      +esc(lang==="nl"?NAV[j].nl:NAV[j].en)+'</a>';
  document.getElementById("navlinks").innerHTML=h;
}
function ddSet(open){
  var b=document.getElementById("ddbtn"), m=document.getElementById("ddmenu");
  if(!b||!m) return;
  b.setAttribute("aria-expanded",String(open)); m.hidden=!open;
}
function renderFooter(){
  var w="",m="";
  w+=go("work")+esc(t(C.foot.work))+'</a>';
  for(var i=0;i<TOPROW;i++) w+=go(AREAS[i].id)+esc(aName(AREAS[i]))+'</a>';
  for(var j=TOPROW;j<AREAS.length;j++) m+=go(AREAS[j].id)+esc(aName(AREAS[j]))+'</a>';
  m+=go("price")+esc(lang==="nl"?"Tarieven":"Pricing")+'</a>';
  m+=go("about")+esc(lang==="nl"?"Over ons":"About us")+'</a>';
  m+=go("contact")+esc(t(C.foot.contact))+'</a>';
  document.getElementById("f-work").innerHTML=w;
  document.getElementById("f-more").innerHTML=m;
  document.getElementById("f-h1").textContent=t(C.foot.work);
  document.getElementById("f-h2").textContent=t(C.foot.more);
  document.getElementById("f-h3").textContent=t(C.foot.contact);
  document.getElementById("f-legal").textContent=t(C.foot.legal);
  document.getElementById("f-seo").textContent=t(C.foot.seo);
  var fm=document.getElementById("f-mail");
  if(fm){ fm.textContent=mailAddress(); fm.setAttribute("href","mailto:"+mailAddress()); }
  /* Nothing above the footer columns: every page already closes on its own call to
     action, and a second one right underneath said the same thing twice. */
  document.getElementById("foot-tag").textContent=t(C.home.tagline);
}
/* A part for an icon name: assets/renders/part-<icon>.webp (or an alias in build.py).
   Returns the floating cut-out markup, or "" when there is none — then the line icon
   is used, as before. */
function part(icon){
  var src=icon && renderSrc("part-"+icon);
  var cut=src && typeof CUTOUT!=="undefined" && CUTOUT.indexOf("part-"+icon)>=0;
  if(!cut) return "";
  return '<span class="fly" aria-hidden="true"><img src="'+src+'" alt="" loading="lazy"></span>';
}
function anyPart(icons){
  if(!icons) return false;
  for(var i=0;i<icons.length;i++) if(part(icons[i])) return true;
  return false;
}
function svcList(list,heading,icons,noPrice){
  var h=(heading?'<h2>'+esc(heading)+'</h2>':'')+'<div class="svcs'+(anyPart(icons)?' svcs--fly':'')+'">';
  for(var i=0;i<list.length;i++){
    var ic = icons && ICON[icons[i]], pt = icons && part(icons[i]);
    h+='<div class="svc'+(ic||pt?' svc--ic':'')+(pt?' has-fly':'')+'">'+(pt||ic||'')
      +'<h3>'+esc(t(list[i].n))+'</h3><p>'+esc(t(list[i].d))+'</p></div>';
  }
  if(noPrice) return h+'</div>';
  return h+'</div><p class="onreq">'
    +(lang==="nl"
        ? "Elk project is anders, dus dit is geen prijslijst. Wat vergelijkbaar werk ongeveer kost, staat op de pagina "
        : "Every project is different, so this isn't a price list. What comparable work roughly costs is on the ")
    +go("price",' class="inlink"')+(lang==="nl"?"tarieven":"pricing")+'</a>'
    +(lang==="nl"
        ? ". Na \u00e9\u00e9n gesprek krijgt u een vaste prijs op \u00e9\u00e9n pagina."
        : " page. After one conversation you get a fixed price on one page.")+'</p>';
}
function stepList(list,icons){
  var h='<div class="steps'+(anyPart(icons)?' steps--fly':'')+'">';
  for(var i=0;i<list.length;i++){
    var ic = icons && ICON[icons[i]], pt = icons && part(icons[i]);
    h+='<div class="step'+(pt?' has-fly':'')+'"><div class="no">'+(pt||ic||no(i+1))+'</div>'
      +'<div>'+(ic||pt?'<span class="sn">'+no(i+1)+'</span>':'')
      +'<h3>'+esc(t(list[i].h))+'</h3><p>'+esc(t(list[i].p))+'</p></div></div>';
  }
  return h+'</div>';
}
function cardRow(list,icons){
  var h='<div class="grid4'+(anyPart(icons)?' grid4--fly':'')+'">';
  for(var i=0;i<list.length;i++){
    var ic = icons && ICON[icons[i]], pt = icons && part(icons[i]);
    h+='<div'+(pt?' class="has-fly"':'')+'>'+(pt||ic||'')+'<h3>'+esc(t(list[i].h))+'</h3><p>'+esc(t(list[i].p))+'</p></div>';
  }
  return h+'</div>';
}
function ph(title,sub){
  return '<div class="ph"><span class="t">'+esc(title)+'</span><span class="s">'+esc(sub)+'</span></div>';
}
/* the portfolio strip that appears on every page */
function folioStrip(withNext){
  var f=C.folio,d=C.work,h='<div class="lbl lbl--q rv">'+esc(t(f.h))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:16ch">'+esc(t(withNext?f.next:f.d))+'</h2>';
  if(withNext) h+='<p class="deck rv" style="margin-top:20px">'+esc(t(f.nextp))+'</p>';
  return h+folioCards();
}
/* A card per delivered project. Drop a screenshot in assets/work/<img>.jpg|png|webp and
   the build embeds it here; without one you get a labelled placeholder instead. */
function shotFor(c){
  var src = (typeof WORKSHOTS!=="undefined") && WORKSHOTS[c.img];
  if(src) return '<span class="shot has-img"><img src="'+src+'" alt="'
    +esc(c.t+(lang==="nl"?" — de site die wij bouwden":" — the site we built"))+'" loading="lazy"></span>';
  return '<span class="shot"><span class="t">'+(lang==="nl"?"Screenshot":"Screenshot")+'</span>'
    +'<span class="s">'+esc(c.url)+' &middot; 16:10</span></span>';
}
function folioCards(){
  var d=C.work,h='<div class="folio rv">';
  for(var i=0;i<d.cases.length;i++){
    var c=d.cases[i];
    h+=go("work",' class="fcard"')+shotFor(c)
      +'<span class="body"><span class="tag">'+esc(t(c.tag))+'</span>'
      +'<h3>'+esc(c.t)+'</h3><p>'+esc(t(c.short))+'</p>'
      +'<span class="live">'+esc(c.url)+'</span></span></a>';
  }
  return h+'</div>';
}
/* Where assets/ is, relative to this page — read off the stylesheet link build.py wrote,
   so a render URL resolves at any base path. RENDERS holds "renders/<file>". */
var ASSET_BASE=(function(){
  var l=document.querySelector('link[rel="stylesheet"][href*="site."]');
  var h=l?l.getAttribute("href"):"assets/site.css";
  return h.slice(0, h.lastIndexOf("/")+1);
})();
function renderSrc(key){
  var r=(typeof RENDERS!=="undefined") && RENDERS[key];
  return r ? ASSET_BASE + r : "";
}
/* Alternating rows: picture then text, then text then picture. `key` names an image in
   assets/renders/; without one you get a labelled photo slot saying what belongs there. */
function altRows(items,compact){
  var h='<div class="alt'+(compact?' alt--compact':'')+'">';
  for(var i=0;i<items.length;i++){
    var it=items[i];
    var src=renderSrc(it.key);
    /* A picture with a transparent background is drawn free on the page — no frame,
       no box — which is what build.py flags as a cut-out. Everything else gets a frame. */
    var cut=src && typeof CUTOUT!=="undefined" && CUTOUT.indexOf(it.key)>=0;
    h+='<div class="altrow rv">'
      +'<div class="altmedia'+(cut?' altmedia--cut':'')+'">'
      +(src ? '<img src="'+src+'" alt="" loading="lazy">'
            : ph(t(it.shot), lang==="nl"?"16:10":"16:10"))
      +'</div>'
      +'<div class="alttext">'
      +(it.n?'<span class="sn">'+it.n+'</span>':'')
      +'<h3>'+esc(t(it.t))+'</h3><p>'+esc(t(it.p))+'</p></div></div>';
  }
  return h+'</div>';
}

/* The domains grid: what "engineering" means here, one card per domain, each with a
   worked example. Content lives in DISCIPLINES in content.js. */
function discGrid(){
  var D=DISCIPLINES;
  var h='<h2 class="rv">'+esc(t(D.h))+'</h2>'
    +'<p class="deck rv" style="margin-top:20px">'+esc(t(D.d))+'</p>'
    +'<div class="disc rv">';
  for(var i=0;i<D.items.length;i++){
    var it=D.items[i];
    /* assets/renders/domain-<ic>.png — a cut-out floats above the card text;
       a framed picture sits in a rounded box. No file, no picture. */
    var dsrc=renderSrc("domain-"+it.ic);
    var dcut=dsrc && typeof CUTOUT!=="undefined" && CUTOUT.indexOf("domain-"+it.ic)>=0;
    h+='<div'+(dcut?' class="has-cut"':'')+'>'
      +(dsrc?'<span class="dpic'+(dcut?' dpic--cut':'')+'"><img src="'+dsrc+'" alt="" loading="lazy"></span>':'')
      +(dcut?'':(ICON[it.ic]||''))+'<h3>'+esc(t(it.t))+'</h3>'
      +'<p>'+esc(t(it.p))+'</p>'
      +(it.ex?'<p class="eg"><span>'+(lang==="nl"?"Voorbeeld":"Example")+'</span>'+esc(t(it.ex))+'</p>':'')
      +'<div class="tags">'+esc(it.k)+'</div></div>';
  }
  h+='</div>';
  /* The three photo placeholders under the grid only matter while the cards have no
     pictures of their own; once any domain-* render exists they go. */
  var anyDomain=false;
  if(typeof RENDERS!=="undefined") for(var k in RENDERS){ if(k.indexOf("domain-")===0) anyDomain=true; }
  if(!anyDomain){
    h+='<div class="discshots rv">';
    for(var j=0;j<D.shots.length;j++) h+=ph(t(D.shots[j].t),t(D.shots[j].s));
    h+='</div>';
  }
  return h;
}

/* The engineering drawings appear as corner marks on each page opener. The framed
   plate that used to sit mid-page was removed; DRAW still holds every drawing.
   Two per page: the first goes top-left, the second bottom-right. */
var WMARKS={
  web:   ["layout","pcb"],
  proto: ["part","drone"],
  make:  ["cnc","printer"],
  yard:  ["bench","laser"],
  start: ["signal","gears"],
  price: ["rule","valve"],
  work:  ["layout","gears"],
  about: ["gears","bench"],
  contact:["signal","rule"]
};
function watermark(id){
  var pair=WMARKS[id];
  if(!pair) return "";
  return '<div class="wmark" aria-hidden="true">'+DRAW[pair[0]]+DRAW[pair[1]]+'</div>';
}
/* The same marks, fainter, for the plain white sections between the openers —
   otherwise every second screen is an unbroken white field. Pass two drawing names. */
function bandMark(a,b){
  if(!DRAW[a] || !DRAW[b]) return "";
  return '<div class="wmark wmark--band" aria-hidden="true">'+DRAW[a]+DRAW[b]+'</div>';
}
/* The experience section every activity page ends on: engineering work for this area,
   then the two public websites, then the ask. Pass an area id to filter. */
function expItems(area){
  var out=[];
  for(var i=0;i<EXPERIENCE.length;i++){
    var e=EXPERIENCE[i];
    if(!area || e.areas.indexOf(area)>=0) out.push(e);
  }
  return out;
}
/* Which proof belongs on which page. Websites are proof for web work, engineering
   items are proof for hardware work; showing both everywhere is noise. */
var SHOWFOLIO={web:true, work:true, about:true, price:true};
function expBlock(withNext, area){
  var items=expItems(area);
  var folio=(area===undefined)||SHOWFOLIO[area]===true;
  if(!items.length && !folio) return "";
  var h='<div class="lbl lbl--q rv">'+esc(t(EXPH.h))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:20ch">'+esc(t(withNext?EXPH.none:C.folio.expd))+'</h2>'
    +'<p class="deck rv" style="margin-top:18px">'+esc(t(EXPH.d))+'</p>';
  if(items.length){
    h+='<div class="exp rv">';
    for(var i=0;i<items.length;i++){
      var e=items[i];
      h+='<div class="expitem"><div class="k">'+esc(t(e.k))+'</div>'
        +'<div><h3>'+esc(t(e.t))+'</h3><p>'+esc(t(e.p))+'</p>'
        +'<span class="st">'+esc(t(e.m))+'</span></div></div>';
    }
    h+='</div>';
  }
  if(folio){
    if(items.length)
      h+='<h3 class="rv" style="margin-top:64px">'
        +(lang==="nl"?"Sites die live staan":"Sites that are live")+'</h3>';
    h+=folioCards();
  }
  if(withNext) h+='<p class="deck rv" style="margin-top:30px">'+esc(t(C.folio.nextp))+'</p>';
  return h;
}
function ctaBlock(head){
  return '<div class="cta"><h2>'+esc(head)+'</h2>'
    +go("contact",' class="btn"')+esc(t(C.home.ctab))+'</a></div>';
}

function renderHome(){
  var d=C.home,h="";

  /* 1. the opening: the mark on black, nothing else */
  h+='<div class="opening"><section class="overture">'
    +'<h1 class="logo"><img src="'+LOGO_HERO+'" alt="Liminex \u2014 Make non-existent reality"></h1>'
    +'<span class="scrollcue" aria-hidden="true">'+esc(t(d.scroll))+'</span></section></div>';

  /* 2. what we do — one card per area, with a preview and the fact worth clicking for */
  h+='<section class="band band--grey"><div class="wrap center">'
    +'<div class="lbl rv">'+esc(t(d.blocksh))+'</div>'
    +'<h2 class="rv" style="margin-top:18px">'+esc(t(d.blocksd))+'</h2></div>'
    +'<div class="wrap"><div class="blocks">';
  for(var i=0;i<AREAS.length;i++){
    var ar=AREAS[i];
    var cimg = renderSrc("card-"+ar.id);
    /* a transparent PNG floats in the card's preview area, same rule as altRows */
    var ccut = cimg && typeof CUTOUT!=="undefined" && CUTOUT.indexOf("card-"+ar.id)>=0;
    h+=go(ar.id,' class="block rv'+(ccut?' has-cut':'')+'"')
      +'<span class="prev'+(cimg?(ccut?' has-cut':' has-img'):'')+'">'
        +(cimg ? '<img src="'+cimg+'" alt="" loading="lazy">'
               : GLYPH[ar.glyph]+'<span class="cap">'+esc(t(d.shots[ar.id]))+'</span>')
      +'</span>'
      +'<span class="body"><h3>'+esc(aName(ar))+'</h3>'
        +'<span class="intro">'+esc(t(d.blurbs[ar.id]))+'</span>'
        +'<span class="hook">'+esc(t(d.hooks[ar.id]))+'</span>'
        +'<span class="more">'+esc(t(d.more))+' &rarr;</span></span></a>';
  }
  h+='</div></div></section>';

  /* 3. how working with us actually goes */
  h+=flowSplit(1,"var(--paper2)","var(--paper)",5);
  h+='<section class="band">'+bandMark("rule","gears")+'<div class="wrap">'
    +'<h2 class="rv">'+esc(t(d.howh))+'</h2>'
    +'<p class="deck rv" style="margin-top:18px">'+esc(t(d.howd))+'</p>'
    +altRows([
      {key:"how-1", n:"01", t:d.how[0].h, p:d.how[0].p, shot:d.how[0].note},
      {key:"how-2", n:"02", t:d.how[1].h, p:d.how[1].p, shot:d.how[1].note},
      {key:"how-3", n:"03", t:d.how[2].h, p:d.how[2].p, shot:d.how[2].note},
      {key:"how-4", n:"04", t:d.how[3].h, p:d.how[3].p, shot:d.how[3].note}
    ], true)
    +'</div></section>';

  /* 4. who we are, the team, and the ask — one dark block */
  /* The claim and the story sit in one column; the three numbers hold the other, so the
     headline no longer leaves half the screen empty beside it. */
  h+='<section class="band band--dark"><div class="wrap">'
    +'<div class="whorow rv"><div class="whotext">'
    +'<div class="lbl">'+esc(t(d.whoh))+'</div>'
    +'<h2 style="margin-top:18px">'+esc(t(d.whoq))+'</h2>'
    +'<p class="muted">'
    +esc(t(d.whop)).split("\n\n").join('</p><p class="muted">')+'</p></div>'
    +'<div class="stats stats--side">';
  for(var s=0;s<d.stats.length;s++)
    h+='<div><div class="n">'+esc(d.stats[s].n)+'</div><div class="k">'+esc(t(d.stats[s].k))+'</div></div>';
  h+='</div></div>';
  h+='<div class="team rv" style="margin-top:76px">';
  for(var m=0;m<d.team.length;m++)
    h+='<div class="p">'+ph(t(d.team[m].n),lang==="nl"?"Portret \u00b7 4:5":"Portrait \u00b7 4:5")
      +'<div class="nm">'+esc(t(d.team[m].n))+'</div>'
      +'<div class="ro">'+esc(t(d.team[m].r))+'</div></div>';
  h+='</div>';
  h+='<div class="teamcta rv"><h2>'+esc(t(d.ctah))+'</h2>'
    +'<p>'+esc(t(d.ctasub))+'</p>'
    +go("contact",' class="btn"')+esc(t(d.ctab))+'</a>'
    +'<div class="twolinks" style="justify-content:center;margin-top:28px">'
    +go("about",' class="btn btn--ghost"')+esc(t(d.teamabout))+'</a>'
    +go("work",' class="btn btn--ghost"')+esc(t(d.teamwork))+'</a></div></div>';
  h+='</div></section>';
  return h;
}

/* ---------------- about ---------------- */
function renderAbout(){
  var d=C.about,hm=C.home,h="";
  h+='<section class="opener">'+watermark("about")
    +'<div class="narrow"><div class="lbl">'+esc(t(hm.teamabout))+'</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';

  /* the team */
  h+='<section class="band band--tight">'+bandMark("gears","bench")+'<div class="wrap"><div class="team rv">';
  for(var m=0;m<hm.team.length;m++)
    h+='<div class="p">'+ph(t(hm.team[m].n),lang==="nl"?"Portret \u00b7 4:5":"Portrait \u00b7 4:5")
      +'<div class="nm">'+esc(t(hm.team[m].n))+'</div>'
      +'<div class="ro">'+esc(t(hm.team[m].r))+'</div></div>';
  h+='</div></div></section>';

  /* the history, and nothing else — everything that used to follow it moved or went */
  h+=flowSplit(7,"var(--paper)","var(--paper2)",5);
  h+='<section class="band band--grey"><div class="narrow"><h2>'+esc(t(d.storyh))+'</h2>'
    +'<div style="margin-top:24px"><p class="deck" style="max-width:none">'
    +esc(t(hm.whop)).split("\n\n").join('</p><p class="deck" style="max-width:none">')+'</p></div></div>'
    +'<div class="wrap"><div class="phrow rv" style="margin-top:56px">'
    +ph(t(hm.photo1),t(hm.photo1s))+ph(t(hm.photo2),t(hm.photo2s))+'</div></div></section>';

  h+='<section class="band band--dark"><div class="wrap"><div class="stats rv" style="margin-top:0">';
  for(var st=0;st<hm.stats.length;st++)
    h+='<div><div class="n">'+esc(hm.stats[st].n)+'</div><div class="k">'+esc(t(hm.stats[st].k))+'</div></div>';
  h+='</div></div></section>';
  return h;
}

/* IT & Web reads as an exhibition of what has been delivered */
function renderWeb(){
  var d=C.web,h="";

  /* 1. opener */
  h+='<section class="opener">'+watermark("web")+'<div class="narrow"><div class="lbl">IT &amp; Web</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';

  /* 2. what we do — the main content, first on the page */
  h+='<section class="band band--tight">'+bandMark("layout","pcb")+'<div class="narrow">'
    +'<p class="deck" style="max-width:none">'+esc(t(d.intro))+'</p></div>'
    +'<div class="wrap"><h2 class="rv">'+(lang==="nl"?"Wat we doen":"What we do")+'</h2>'
    +altRows([
      {key:"web-1", t:d.svcs[0].n, p:d.svcs[0].d, shot:C.home.shots.web},
      {key:"web-2", t:d.svcs[1].n, p:d.svcs[1].d, shot:{nl:"Foto \u2014 afrekenen en boeken op een telefoon",
                                                        en:"Photo \u2014 checkout and booking on a phone"}},
      {key:"web-3", t:d.svcs[2].n, p:d.svcs[2].d, shot:{nl:"Foto \u2014 een configurator op het scherm",
                                                        en:"Photo \u2014 a configurator on screen"}}
    ], true)
    +'<div class="rv" style="margin-top:64px">'
    +svcList(d.svcs.slice(3), t(d.moreh), null, true)+'</div>'
    +'<p class="onreq rv" style="margin-top:44px">'
    +(lang==="nl"
        ? "Elk project is anders, dus dit is geen prijslijst. Wat vergelijkbaar werk ongeveer kost, staat op de pagina "
        : "Every project is different, so this isn't a price list. What comparable work roughly costs is on the ")
    +go("price",' class="inlink"')+(lang==="nl"?"tarieven":"pricing")+'</a>'
    +(lang==="nl"
        ? ". Na \u00e9\u00e9n gesprek krijgt u een vaste prijs op \u00e9\u00e9n pagina."
        : " page. After one conversation you get a fixed price on one page.")
    +'</p></div></section>';

  /* 3. the exhibition of delivered work, ending on the ask */
  h+=flowSplit(3,"var(--paper)","var(--paper2)",5);
  h+='<section class="band band--grey"><div class="wrap center">'
    +'<div class="lbl lbl--q rv">'+esc(t(d.exhibh))+'</div>'
    +'<p class="deck rv" style="margin-top:16px">'+esc(t(d.exhibd))+'</p></div>'
    +'<div class="wrap">'+folioCards()
    +'<div class="cta"><h2>'+esc(t(C.folio.next))+'</h2>'
    +'<p class="deck" style="margin:0 auto 28px">'+esc(t(C.folio.nextp))+'</p>'
    +go("contact",' class="btn"')+esc(t(C.home.ctab))+'</a></div>'
    +'</div></section>';

  /* 4. how a project runs, then experience last */
  h+='<section class="band">'+bandMark("pcb","layout")+'<div class="wrap">'
    +'<h2>'+(lang==="nl"?"Hoe het gaat":"How it goes")+'</h2>'
    +stepList(d.steps,["web","layout","access","data"])
    +'</div></section>';
  h+='<section class="band band--tight"><div class="wrap">'
    +ctaBlock(lang==="nl"?"Zullen we hier een half uur over praten?":"Shall we spend half an hour on this?")
    +'</div></section>';
  return h;
}

/* Project Yard reads as a set of posters */
function renderYard(){
  var d=C.yard,h="";
  h+='<section class="opener">'+watermark("yard")+'<div class="narrow"><div class="lbl">Project Yard</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';
  h+='<section class="band band--tight">'+bandMark("pcb","gears")+'<div class="wrap">'
    +'<div class="lbl lbl--q rv">'+esc(t(d.postersh))+'</div><div class="posters">';
  for(var i=0;i<d.posters.length;i++){
    var p=d.posters[i];
    h+='<div class="poster '+p.c+' rv"><div class="fig">'+esc(p.fig)+'</div>'
      +'<div><p class="say">'+esc(t(p.say))+'</p><p class="src">'+esc(t(p.src))+'</p></div></div>';
  }
  h+='</div></div></section>';
  h+=flowSplit(4,"var(--paper)","var(--paper)",5);
  h+='<section class="band band--tight">'+bandMark("bench","laser")+'<div class="narrow">'
    +'<h2>'+esc(t(d.introh))+'</h2><p class="deck" style="max-width:none;margin-top:24px">'
    +esc(t(d.intro))+'</p></div><div class="wrap">'
    +cardRow(d.cards,["print3d","robot","test","cad"])+'</div></section>';
  h+='<section class="band band--dark"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(d.formh))+'</div>'
    +'<h2 class="rv" style="margin-top:18px;max-width:18ch">'+esc(t(d.statush))+'</h2>'
    +'<p class="deck muted rv" style="margin-top:22px">'+esc(t(d.formd))+'</p>'
    +'<div class="formrow rv">'
    +'<div class="formcard"><h3>'+esc(t(d.formnl))+'</h3><p>'+esc(t(d.formnls))+'</p>'
    +'<a href="'+FORMS.nl+'" target="_blank" rel="noopener">'+esc(t(d.open))+' &rarr;</a></div>'
    +'<div class="formcard"><h3>'+esc(t(d.formen))+'</h3><p>'+esc(t(d.formens))+'</p>'
    +'<a href="'+FORMS.en+'" target="_blank" rel="noopener">'+esc(t(d.open))+' &rarr;</a></div>'
    +'</div><p class="muted rv" style="margin-top:34px;max-width:62ch">'+esc(t(d.status))+'</p>'
    +'</div></section>';
  h+='<section class="band band--tight">'+bandMark("rule","signal")+'<div class="wrap">'
    +ctaBlock(lang==="nl"?"Zullen we hier een half uur over praten?":"Shall we spend half an hour on this?")
    +'</div></section>';
  return h;
}

/* "Coming soon" with a one-click interest register. A static site has no database, so a
   click posts to the same form endpoint the contact page uses — which is better than a
   counter anyway: an interested person leaves an address we can reply to. The browser
   remembers it locally so the panel doesn't ask twice. */
function indiaPanel(){
  var d=C.india;
  return '<section class="band band--grey"><div class="wrap"><div class="soon rv" id="soon">'
    +'<div class="lbl lbl--q">'+esc(t(d.lbl))+'</div>'
    +'<h2>'+esc(t(d.h))+'</h2>'
    +'<p class="deck">'+esc(t(d.p)).split("\n\n").join('</p><p class="deck">')+'</p>'
    +'<div id="soonbox">'
      +'<button class="btn" id="soonbtn" type="button">'+esc(t(d.btn))+'</button>'
    +'</div>'
    +'<p class="formstat" id="soonstat" role="status" aria-live="polite"></p>'
    +'</div></div></section>';
}
function setupSoon(){
  var box=document.getElementById("soonbox");
  if(!box) return;
  var d=C.india, stat=document.getElementById("soonstat");
  var done=false;
  try{ done = localStorage.getItem("liminex-india")==="1"; }catch(e){}
  if(done){ box.innerHTML=""; stat.className="formstat is-ok"; stat.textContent=t(d.already); return; }

  document.getElementById("soonbtn").addEventListener("click",function(){
    box.innerHTML='<form id="soonform" class="soonform">'
      +'<label class="sr" for="soonmail">'+esc(t(d.mailph))+'</label>'
      +'<input id="soonmail" name="email" type="email" placeholder="'+esc(t(d.mailph))+'">'
      +'<button class="btn" type="submit">'+esc(t(d.send))+'</button></form>';
    document.getElementById("soonmail").focus();
    document.getElementById("soonform").addEventListener("submit",function(e){
      e.preventDefault();
      var mail=document.getElementById("soonmail").value.trim();
      var finish=function(ok){
        try{ localStorage.setItem("liminex-india","1"); }catch(e){}
        box.innerHTML="";
        stat.className="formstat is-ok";
        stat.textContent = ok ? (mail?t(d.ok):t(d.okq)) : t(d.fail);
      };
      if(typeof FORM_ENDPOINT!=="string" || !FORM_ENDPOINT){ finish(true); return; }
      var fd=new FormData();
      if(typeof FORM_KEY==="string" && FORM_KEY) fd.append("access_key",FORM_KEY);
      fd.append("subject","Liminex \u2014 interest: production in India");
      fd.append("_subject","Liminex \u2014 interest: production in India");
      fd.append("email", mail || "no address given");
      fd.append("message","Someone registered interest in series production in India."
        +(mail?"":" They did not leave an address."));
      fetch(FORM_ENDPOINT,{method:"POST",body:fd,headers:{"Accept":"application/json"}})
        .then(function(r){ finish(r.ok); })
        .catch(function(){ finish(false); });
    });
  });
}

function renderArea(id){
  if(id==="web") return renderWeb();
  if(id==="yard") return renderYard();
  var a=area(id),d=C[id],h="";
  h+='<section class="opener">'+watermark(id)
    +'<div class="narrow"><div class="lbl">'+esc(aName(a))+'</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';
  h+=flowSplit(5,"var(--paper)","var(--paper)",5);
  h+='<section class="band band--tight">'+bandMark("printer","cnc")+'<div class="narrow">'
    +'<p class="deck" style="max-width:none">'+esc(t(d.intro))+'</p></div>';
  var SVCICONS={proto:["test","cad","elec","firmware","mech"],
                make:["print3d","laser","cnc","dfm","pipe"],
                start:["test","cad","elec","data","robot"]};
  if(d.svcs) h+='<div class="wrap">'
    +svcList(d.svcs,
             id==="make" ? t(d.aroundh) : (id==="start" ? "" : (lang==="nl"?"Wat we doen":"What we do")),
             SVCICONS[id], id==="make")+'</div>';
  h+='</section>';

  /* Manufacturing leads on the three machines that are physically here — a picture and
     what the process is actually good for, alternating sides like the home page. */
  if(id==="make" && d.machines){
    h+='<section class="band band--grey">'+bandMark("cnc","printer")+'<div class="wrap">'
      +'<h2 class="rv">'+esc(t(d.machh))+'</h2>'
      +'<p class="deck rv" style="margin-top:18px">'+esc(t(d.machd))+'</p>'
      +altRows(d.machines.map(function(m,i){
         return {key:m.key, n:no(i+1), t:m.n, p:m.d, shot:m.shot};
       }), true)
      +'</div></section>';
  }
  if(id==="proto") h+='<section class="band band--grey"><div class="wrap">'+discGrid()+'</div></section>';
  if(id==="start" && d.svch){
    h+='<section class="band band--grey">'+bandMark("signal","gears")+'<div class="wrap">'
      +'<h2 class="rv">'+esc(t(d.svch))+'</h2>'
      +'<p class="deck rv" style="margin-top:18px">'+esc(t(d.svcd))+'</p>'
      +'<div class="rv">'+svcList(d.svcs,"",["data","gears","signal"],true)+'</div>'
      +'</div></section>';
  }
  var CARDICONS={start:["test","cad","robot","dfm"],make:["dfm","print3d","pipe","data"]};
  /* Prototyping shows the domains grid instead of a generic card row. */
  if(d.cards && id!=="proto") h+='<section class="band band--grey"><div class="wrap">'
    +(d.cardsh?'<h2 class="rv">'+esc(t(d.cardsh))+'</h2>':'')
    +'<div class="rv">'+cardRow(d.cards,CARDICONS[id])+'</div></div></section>';
  h+='<section class="band">'+bandMark(WMARKS[id]?WMARKS[id][1]:"gears",WMARKS[id]?WMARKS[id][0]:"rule")
    +'<div class="wrap">';
  var STEPICONS={proto:["test","cad","elec","firmware","dfm"],
                 make:["dfm","cad","print3d","pipe","test"],
                 start:["test","cad","robot","dfm","data"]};
  if(d.steps) h+='<h2>'+(lang==="nl"?"Hoe het gaat":"How it goes")+'</h2>'
    +stepList(d.steps,STEPICONS[id]);
  if(d.note) h+='<div class="marginnote"><h3>'+esc(t(d.noteh))+'</h3><p>'+esc(t(d.note))+'</p></div>';
  h+='</div></section>';
  if(id==="make") h+=indiaPanel();
  h+='<section class="band band--tight"><div class="wrap">'
    +(id==="start" ? "" : expBlock(true,id))
    +ctaBlock(lang==="nl"?"Zullen we hier een half uur over praten?":"Shall we spend half an hour on this?")
    +'</div></section>';
  return h;
}

function renderWork(){
  var d=C.work;
  var h='<section class="opener">'+watermark("work")+'<div class="narrow"><div class="lbl">Portfolio</div>'
    +'<h1>'+(lang==="nl"?"Werk":"Work")+'</h1><p class="deck">'+esc(t(d.lede))+'</p></div></section>';
  h+=flowSplit(6,"var(--paper)","var(--paper)",5);
  h+='<section class="band band--tight">'+bandMark("layout","gears")+'<div class="wrap">';
  for(var i=0;i<d.cases.length;i++){
    var c=d.cases[i];
    h+='<div class="rv" style="margin-bottom:56px">'
      +'<div class="lbl">'+esc(t(c.tag))+' · '+esc(c.url)+'</div>'
      +'<h2 style="margin-top:14px">'+esc(c.t)+'</h2>'
      +'<div class="folio" style="margin-top:28px">'
      +((typeof WORKSHOTS!=="undefined" && WORKSHOTS[c.img])
         ? '<a class="shotlink" href="https://'+c.url+'" target="_blank" rel="noopener">'
           +'<img src="'+WORKSHOTS[c.img]+'" alt="'+esc(c.t+(lang==="nl"?" — de site die wij bouwden"
                                                                      :" — the site we built"))+'"></a>'
         : ph(lang==="nl"?"Screenshot van de site":"Screenshot of the site","16:10"))
      +'<div><p>'+esc(t(c.p))+'</p><dl style="display:grid;grid-template-columns:auto 1fr;gap:9px 22px;margin:0;font-size:15px">';
    for(var k=0;k<c.dl.length;k++)
      h+='<dt style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);padding-top:4px">'
        +esc(t(c.dl[k].k))+'</dt><dd style="margin:0">'+esc(t(c.dl[k].v))+'</dd>';
    h+='</dl><p style="margin-top:20px"><a class="livelink" href="https://'+c.url
      +'" target="_blank" rel="noopener">'+(lang==="nl"?"Bekijk de site":"Visit the site")
      +' &nearr;</a></p></div></div></div>';
  }
  h+='<div class="marginnote"><h3>'+esc(t(d.moreh))+'</h3><p>'+esc(t(d.morep))+'</p></div>'
    +ctaBlock(t(C.folio.next))+'</div></section>';
  return h;
}

/* Prices. Ranges, with the reasons they are ranges — see C.price in content.js. */
function renderPrice(){
  var d=C.price,h="";
  h+='<section class="opener">'+watermark("price")+'<div class="narrow"><div class="lbl">'
    +(lang==="nl"?"Tarieven":"Pricing")+'</div><h1>'+esc(t(d.lede))+'</h1></div></section>';
  h+='<section class="band band--tight"><div class="narrow">'
    +'<p class="deck" style="max-width:none">'
    +esc(t(d.intro)).split("\n\n").join('</p><p class="deck" style="max-width:none">')
    +'</p></div></section>';

  h+='<section class="band band--grey"><div class="wrap"><h2 class="rv">'+esc(t(d.tblh))+'</h2>';
  for(var g=0;g<d.groups.length;g++){
    var grp=d.groups[g];
    h+='<div class="prices rv"><h3>'+esc(t(grp.g))+'</h3>';
    for(var r=0;r<grp.rows.length;r++){
      var row=grp.rows[r];
      h+='<div class="prow"><div class="pn">'+esc(t(row.n))+'</div>'
        +'<div class="pd">'+esc(t(row.d))+'</div>'
        +'<div class="pv">'+esc(t(row.v))+'</div></div>';
    }
    h+='</div>';
  }
  h+='<p class="onreq rv">'+(lang==="nl"
      ?"Alle bedragen zijn exclusief btw en zijn richtprijzen, geen offerte."
      :"All amounts exclude VAT and are indicative, not a quote.")+'</p></div></section>';

  h+=flowSplit(8,"var(--paper2)","var(--paper)",5);
  h+='<section class="band">'+bandMark("valve","rule")+'<div class="wrap"><h2 class="rv">'+esc(t(d.whyh))+'</h2>'
    +'<div class="rv">'+cardRow(d.why,["cad","control","test","robot"])+'</div>'
    +'<h2 class="rv" style="margin-top:96px">'+esc(t(d.fixh))+'</h2>'
    +stepList(d.fix,["web","elec","data","dfm"])
    +'<div class="marginnote"><h3>'+esc(t(d.noteh))+'</h3><p>'+esc(t(d.note))+'</p></div>'
    +ctaBlock(lang==="nl"?"Stuur uw vraag in twee zinnen."
                        :"Send your question in two sentences.")+'</div></section>';
  return h;
}

function renderContact(){
  var d=C.contact,h="";
  h+='<section class="opener">'+watermark("contact")+'<div class="narrow"><div class="lbl">'
    +(lang==="nl"?"Neem contact op":"Get in touch")+'</div><h1>Contact</h1>'
    +'<p class="deck">'+esc(t(d.lede))+'</p></div></section>';
  h+='<section class="band band--tight">'+bandMark("signal","rule")+'<div class="narrow">'+contactForm("f","full")+'<div class="details">';
  for(var j=0;j<d.details.length;j++)
    h+='<div><div class="k">'+esc(t(d.details[j].k))+'</div><div>'+esc(t(d.details[j].v))+'</div></div>';
  h+='</div></div></section>';
  return h;
}

/* One form, two shapes. `p` prefixes every id so the footer copy and the contact-page
   copy can live on the same document without colliding. */
function sel(id,name,opts){
  var o="";
  for(var i=0;i<opts.length;i++) o+='<option>'+esc(opts[i])+'</option>';
  return '<select id="'+id+'" name="'+name+'">'+o+'</select>';
}
function contactForm(p,shape){
  var d=C.contact, full=(shape==="full");
  var lab=function(id,text,required){
    return '<label for="'+p+'-'+id+'">'+esc(text)
      +(required?'<span class="rq" aria-hidden="true">*</span>':'')+'</label>';
  };
  var h='<form id="'+p+'form" class="'+(full?"":"footform")+'" novalidate>';
  if(!full) h+='<div class="frow">';
  h+='<div class="field">'+lab("name",t(d.fields.name),false)
      +'<input id="'+p+'-name" name="name" type="text" autocomplete="name"></div>'
    +'<div class="field">'+lab("em",t(d.fields.email),true)
      +'<input id="'+p+'-em" name="email" type="email" autocomplete="email" required></div>'
    +'<div class="field">'+lab("ph",t(d.fields.phone),true)
      +'<input id="'+p+'-ph" name="phone" type="tel" autocomplete="tel" required></div>';
  if(!full) h+='</div>';
  if(full){
    h+='<div class="field">'+lab("co",t(d.fields.company),false)
        +'<input id="'+p+'-co" name="company" type="text" autocomplete="organization"></div>'
      +'<div class="field">'+lab("ty",t(d.fields.type),false)
        +sel(p+"-ty","subject",lang==="nl"?d.types.nl:d.types.en)+'</div>'
      +'<div class="field">'+lab("bd",t(d.fields.budget),false)
        +sel(p+"-bd","budget",lang==="nl"?d.budgets.nl:d.budgets.en)+'</div>'
      +'<div class="field">'+lab("wh",t(d.fields.when),false)
        +sel(p+"-wh","timeline",lang==="nl"?d.whens.nl:d.whens.en)+'</div>'
      +'<div class="field">'+lab("fd",t(d.fields.found),false)
        +sel(p+"-fd","source",lang==="nl"?d.founds.nl:d.founds.en)+'</div>';
  }
  h+='<div class="field">'+lab("ms",t(d.fields.msg),true)
      +'<textarea id="'+p+'-ms" name="message" required></textarea></div>'
    +'<div class="hp" aria-hidden="true"><label for="'+p+'-hp">'+esc(t(d.hp))+'</label>'
      +'<input id="'+p+'-hp" name="_gotcha" type="text" tabindex="-1" autocomplete="off"></div>'
    +'<button class="btn" type="submit" id="'+p+'send" style="justify-self:start">'
      +esc(t(d.fields.send))+'</button>'
    +'<p class="formstat" id="'+p+'stat" role="status" aria-live="polite"></p>'
    +'<p class="reqnote">'+esc(t(d.fields.reqnote))+'</p>';
  if(full){
    h+='<p class="formnote">'+esc(t(d.formnote))+'</p>'
      +'<p class="formnote">'+esc(t(d.privacy))+'</p>';
  }
  return h+'</form>';
}

/* The form posts to whatever endpoint build.py was given (FORM_ENDPOINT).
   With no endpoint configured it falls back to opening the visitor's mail client,
   so the page never has a button that silently does nothing. */
function setupForm(){
  var forms=document.querySelectorAll("form[id$=form]");
  for(var i=0;i<forms.length;i++) wireForm(forms[i]);
}
function mailAddress(){
  return (typeof CONTACT_EMAIL==="string" && CONTACT_EMAIL) || "anastasiia@liminex.net";
}
function mailtoLink(subject, body){
  return "mailto:"+mailAddress()+"?subject="
    +encodeURIComponent("Liminex \u2014 "+(subject||"website"))
    +"&body="+encodeURIComponent(body);
}
function wireForm(f){
  var p=f.id.replace(/form$/,"");
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var d=C.contact;
    var stat=document.getElementById(p+"stat"), btn=document.getElementById(p+"send");
    var get=function(s){ var el=document.getElementById(p+"-"+s); return el?el.value.trim():""; };
    var email=get("em"), phone=get("ph"), msg=get("ms");
    stat.className="formstat";
    var missing = !email ? "em" : (!phone ? "ph" : (!msg ? "ms" : null));
    if(missing){
      stat.className="formstat is-bad"; stat.textContent=t(d.need);
      document.getElementById(p+"-"+missing).focus(); return;
    }
    if(get("hp")) return;                        /* bot */

    var lines=[];
    var add=function(k,v){ if(v) lines.push(k+": "+v); };
    add(t(d.fields.name),get("name")); add(t(d.fields.company),get("co"));
    add(t(d.fields.email),email);      add(t(d.fields.phone),phone);
    add(t(d.fields.type),get("ty"));   add(t(d.fields.budget),get("bd"));
    add(t(d.fields.when),get("wh"));   add(t(d.fields.found),get("fd"));
    var body=lines.join("\n")+"\n\n"+msg;

    if(typeof FORM_ENDPOINT!=="string" || !FORM_ENDPOINT){
      window.location.href=mailtoLink(get("ty"),body);
      return;
    }
    btn.disabled=true; stat.textContent=t(d.sending);
    var data=new FormData(f);
    if(typeof FORM_KEY==="string" && FORM_KEY) data.append("access_key",FORM_KEY);
    data.append("subject","Liminex \u2014 "+(get("ty")||"website"));   /* Web3Forms */
    data.append("_subject","Liminex \u2014 "+(get("ty")||"website"));  /* FormSubmit */
    data.append("from_name","Liminex website");
    data.append("_language",lang);
    fetch(FORM_ENDPOINT,{method:"POST",body:data,headers:{"Accept":"application/json"}})
      .then(function(r){ if(!r.ok) throw new Error(r.status);
        f.reset(); stat.className="formstat is-ok"; stat.textContent=t(d.ok); })
      .catch(function(err){
        var link=mailtoLink(get("ty"),body);
        stat.className="formstat is-bad";
        stat.innerHTML = esc(t(d.fail))+' <a href="'+link+'">'
          +(lang==="nl"?"Open mijn mailprogramma":"Open my mail app")+'</a>';
        /* Network-level failure: the request never reached anyone. Open the mail client
           ourselves so the message still goes out. An HTTP error code means the service
           answered, so there we leave the choice to the visitor. */
        if(err instanceof TypeError) window.location.href=link;
      })
      .then(function(){ btn.disabled=false; });
  });
}

var UI={skip:{nl:"Naar de inhoud",en:"Skip to content"},nav:{nl:"Hoofdnavigatie",en:"Main navigation"},
  home:{nl:"Liminex — naar de homepage",en:"Liminex — go to the homepage"}};
var io=null;
function setupReveal(){
  var els=app.querySelectorAll(".rv");
  if(!("IntersectionObserver" in window)||matchMedia("(prefers-reduced-motion: reduce)").matches){
    for(var i=0;i<els.length;i++) els[i].classList.add("in"); return;
  }
  if(io) io.disconnect();
  io=new IntersectionObserver(function(en){
    en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  },{rootMargin:"0px 0px -8% 0px",threshold:0.04});
  for(var j=0;j<els.length;j++){
    var r=els[j].getBoundingClientRect();
    if(r.top<window.innerHeight*1.15) els[j].classList.add("in"); else io.observe(els[j]);
  }
  setTimeout(function(){ for(var k=0;k<els.length;k++) els[k].classList.add("in"); },1600);
}
/* The row cut-outs drift with the scroll: --py runs from -1 (below the fold) to +1
   (scrolled past), and the CSS turns that into a small vertical shift and a 3D turn. */
var FLY=[];
function setupFly(){
  FLY=Array.prototype.slice.call(app.querySelectorAll(".altmedia--cut img"));
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) FLY=[];
  onFly();
}
var flyTick=false;
function onFly(){
  if(!FLY.length||flyTick) return;
  flyTick=true;
  requestAnimationFrame(function(){
    flyTick=false;
    var vh=window.innerHeight;
    for(var i=0;i<FLY.length;i++){
      var r=FLY[i].getBoundingClientRect();
      var c=(r.top+r.height/2)/vh;              /* 0 top of screen … 1 bottom */
      var py=Math.max(-1,Math.min(1,(0.5-c)*2));
      FLY[i].style.setProperty("--py",py.toFixed(3));
    }
  });
}
window.addEventListener("scroll",onFly,{passive:true});
window.addEventListener("resize",onFly);
function render(moveFocus){
  var h;
  if(page==="home") h=renderHome();
  else if(page==="about") h=renderAbout();
  else if(page==="work") h=renderWork();
  else if(page==="price") h=renderPrice();
  else if(page==="contact") h=renderContact();
  else h=renderArea(page);
  app.innerHTML=h;
  app.className="page-"+page;      /* lets one page carry its own palette — see Project Yard */
  renderNav(); renderFooter();
  document.getElementById("navlogo").src=LOGO_MARK;
  document.getElementById("footlogo").src=LOGO_MARK;
  document.documentElement.lang=lang;
  document.getElementById("skiplink").textContent=t(UI.skip);
  document.getElementById("mainnav").setAttribute("aria-label",t(UI.nav));
  var wm=document.getElementById("wordmark");
  wm.setAttribute("aria-label",t(UI.home));
  wm.setAttribute("href",href("home"));
  document.body.classList.toggle("home",page==="home");
  if(page!=="home") document.body.classList.add("scrolled"); else onScroll();
  ddSet(false);
  if(moveFocus) app.focus();
  window.scrollTo(0,0);
  setupReveal();
  setupFly();
  setupForm();
  setupSoon();
}
/* The opening collapses over the first ~85% of a screen height of scrolling.
   p = 0 fully open, p = 1 fully closed. The nav slides in as it closes. */
function onScroll(){
  if(page!=="home"){ document.body.classList.add("scrolled"); return; }
  var el=app.querySelector(".overture");
  if(!el){ document.body.classList.add("scrolled"); return; }
  var travel=Math.max(240, window.innerHeight*0.85);
  var p=Math.min(1, Math.max(0, window.scrollY/travel));
  el.style.setProperty("--p", p.toFixed(4));
  document.body.classList.toggle("scrolled", p>0.5);
}
window.addEventListener("scroll",onScroll,{passive:true});
document.addEventListener("click",function(e){
  var dd=e.target.closest("#ddbtn");
  if(dd){ ddSet(dd.getAttribute("aria-expanded")!=="true"); return; }
  if(!e.target.closest("#ddmenu")) ddSet(false);
  var b=e.target.closest("[data-go]");
  if(b){
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0) return;   /* let new-tab work */
    e.preventDefault();
    page=b.getAttribute("data-go");
    if(window.history&&history.pushState) history.pushState({page:page}, "", href(page));
    render(true);
    return;
  }
  /* language links navigate for real — each language has its own URL */
});
document.addEventListener("keydown",function(e){
  var m=document.getElementById("ddmenu"), b=document.getElementById("ddbtn");
  if(!m||!b) return;
  if(e.key==="Escape"&&!m.hidden){ ddSet(false); b.focus(); return; }
  if(e.key==="ArrowDown"&&document.activeElement===b){
    e.preventDefault(); ddSet(true);
    var f=m.querySelector("button"); if(f) f.focus(); return;
  }
  if(!m.hidden&&m.contains(document.activeElement)&&(e.key==="ArrowDown"||e.key==="ArrowUp")){
    e.preventDefault();
    var it=m.querySelectorAll("button"), i=Array.prototype.indexOf.call(it,document.activeElement);
    var n=(e.key==="ArrowDown")?(i+1)%it.length:(i-1+it.length)%it.length;
    it[n].focus();
  }
});
document.addEventListener("focusout",function(){
  setTimeout(function(){
    var d=document.querySelector(".dd");
    if(d&&!d.contains(document.activeElement)) ddSet(false);
  },0);
});
window.addEventListener("popstate",function(){
  var hit=pageFromPath(location.pathname);
  if(hit && hit.lang===lang){ page=hit.page; render(false); }
  else location.reload();
});
if(typeof BOOT!=="undefined"){ page=BOOT.page; lang=BOOT.lang; }
render(false);
