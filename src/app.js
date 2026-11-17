/* ============================================================ RENDER ============================================================ */
var lang="nl", page="home", app=document.getElementById("app");
function t(o){ if(o==null) return ""; return (typeof o==="string")?o:(o[lang]||o.en||o.nl||""); }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function area(id){ for(var i=0;i<AREAS.length;i++){ if(AREAS[i].id===id) return AREAS[i]; } return null; }
function aName(a){ return lang==="nl"?a.nl:a.en; }
function no(n){ return (n<10?"0":"")+n; }

var ACT=[{id:"proto",nl:"Engineering",en:"Engineering"},
  {id:"web",nl:"Software & web",en:"Software & web"},{id:"make",nl:"Productie",en:"Manufacturing"},
  {id:"start",nl:"Start-ups",en:"Start-ups"},
  {id:"work",nl:"Ons werk",en:"Our work"},
  {id:"dev",nl:"In ontwikkeling",en:"In development"}];
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
function hidden(id){ return typeof HIDDEN!=="undefined" && HIDDEN.indexOf(id)>=0; }
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
  for(var j=0;j<NAV.length;j++){
    if(hidden(NAV[j].id)) continue;
    h+='<a href="'+href(NAV[j].id)+'" data-go="'+NAV[j].id+'"'
      +(page===NAV[j].id?' aria-current="page"':'')+'>'
      +esc(lang==="nl"?NAV[j].nl:NAV[j].en)+'</a>';
  }
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
  m+=go("dev")+esc(t(DEV.lbl))+'</a>';
  if(!hidden("price")) m+=go("price")+esc(lang==="nl"?"Tarieven":"Pricing")+'</a>';
  if(!hidden("about")) m+=go("about")+esc(lang==="nl"?"Over ons":"About us")+'</a>';
  m+=go("contact")+esc(t(C.foot.contact))+'</a>';
  if(!hidden("privacy")) m+=go("privacy")+esc(lang==="nl"?"Privacyverklaring":"Privacy statement")+'</a>';
  document.getElementById("f-work").innerHTML=w;
  document.getElementById("f-more").innerHTML=m;
  document.getElementById("f-h1").textContent=t(C.foot.work);
  document.getElementById("f-h2").textContent=t(C.foot.more);
  document.getElementById("f-h3").textContent=t(C.foot.contact);
  document.getElementById("f-legal").textContent=t(C.foot.legal);
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
  if(!icon || icon.indexOf("ic:")===0) return "";
  var key = icon.indexOf("img:")===0 ? icon.slice(4) : "part-"+icon;
  var src=renderSrc(key);
  var cut=src && typeof CUTOUT!=="undefined" && CUTOUT.indexOf(key)>=0;
  if(!cut) return "";
  return '<span class="fly" aria-hidden="true"><img src="'+src+'" alt=""></span>';
}
function anyPart(icons){
  if(!icons) return false;
  for(var i=0;i<icons.length;i++) if(part(icons[i])) return true;
  return false;
}
function svcList(list,heading,icons,noPrice){
  var h=(heading?'<h2>'+esc(heading)+'</h2>':'')+'<div class="svcs'+(anyPart(icons)?' svcs--fly':'')+'">';
  for(var i=0;i<list.length;i++){
    var ic = icons && ICON[String(icons[i]).replace(/^ic:/,"")], pt = icons && part(icons[i]);
    h+='<div class="svc'+(ic||pt?' svc--ic':'')+(pt?' has-fly':'')+'">'+(pt||ic||'')
      +'<h3>'+esc(t(list[i].n))+'</h3><p>'+esc(t(list[i].d))+'</p></div>';
  }
  return h+'</div>';
}
function stepList(list,icons,mode){
  /* mode "pics": the same four-up picture grid as the home page's "How it works",
     using the how-1 … how-N renders. Anything else: the numbered list with icons. */
  if(mode==="pics"){
    /* The inner pages start at the conversation (the home page's step 2) and end on
       the handover, so their pictures run how-2 … how-5. */
    var rows=[];
    for(var k=0;k<list.length;k++)
      rows.push({key:"how-"+(k+2), n:no(k+1), t:list[k].h, p:list[k].p, shot:{nl:"Foto",en:"Photo"}});
    return altRows(rows,true);
  }
  var h='<div class="steps'+(anyPart(icons)?' steps--fly':'')+'">';
  for(var i=0;i<list.length;i++){
    var ic = icons && ICON[String(icons[i]).replace(/^ic:/,"")], pt = icons && part(icons[i]);
    h+='<div class="step'+(pt?' has-fly':'')+'"><div class="no">'+(pt||ic||no(i+1))+'</div>'
      +'<div>'+(ic||pt?'<span class="sn">'+no(i+1)+'</span>':'')
      +'<h3>'+esc(t(list[i].h))+'</h3><p>'+esc(t(list[i].p))+'</p></div></div>';
  }
  return h+'</div>';
}
function cardRow(list,icons){
  var h='<div class="grid4'+(anyPart(icons)?' grid4--fly':'')+'">';
  for(var i=0;i<list.length;i++){
    var ic = icons && ICON[String(icons[i]).replace(/^ic:/,"")], pt = icons && part(icons[i]);
    h+='<div'+(pt?' class="has-fly"':'')+'>'+(pt||ic||'')+'<h3>'+esc(t(list[i].h))+'</h3><p>'+esc(t(list[i].p))+'</p></div>';
  }
  return h+'</div>';
}
function ph(title,sub){
  return '<div class="ph"><span class="t">'+esc(title)+'</span><span class="s">'+esc(sub)+'</span></div>';
}
/* A team portrait. Uses assets/renders/<p.img> when that file exists and falls back to
   the labelled 4:5 slot when it doesn't, so the strip still works with a partial set.
   alt is empty on purpose — the name sits in the .nm line directly beneath it, and a
   screen reader reading it twice is worse than not reading the picture at all. */
/* Statistics events. Umami counts page views on its own; these mark the few actions that
   mean someone is interested. Silent when the tracker is off or blocked. */
function track(name,data){ try{ if(window.umami&&umami.track) umami.track(name,data); }catch(e){} }
function portrait(p){
  var src = p.img && renderSrc(p.img);
  return src ? '<div class="ph has-img"><img src="'+src+'" alt=""></div>'
             : ph(t(p.n), lang==="nl"?"Portret · 4:5":"Portrait · 4:5");
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
    +esc(c.t+(lang==="nl"?" — de site die wij bouwden":" — the site we built"))+'"></span>';
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
  /* Resolved to an absolute URL once, here: the page URL changes on client-side
     navigation, and a path relative to the old page would point at the wrong folder. */
  var abs=new URL(h, location.href).href;
  return abs.slice(0, abs.lastIndexOf("/")+1);
})();
function renderSrc(key){
  var r=(typeof RENDERS!=="undefined") && RENDERS[key];
  return r ? ASSET_BASE + r : "";
}

/* ---------------- real photos and video ----------------
   Files in assets/photos/ and assets/video/, listed by build.py in MEDIA. Nothing here is
   preloaded: images are lazy and videos load their poster only, then play while they are
   on screen (setupVideos). See GALLERY in content.js. */
function hasMedia(path){ return typeof MEDIA!=="undefined" && MEDIA.indexOf(path)>=0; }
function mediaSrc(path){ return ASSET_BASE + path; }
function photoTag(name, r, alt, sizes){
  if(!hasMedia("photos/"+name+"-800.webp")) return "";
  var big=hasMedia("photos/"+name+"-1600.webp");
  return '<img src="'+mediaSrc("photos/"+name+"-800.webp")+'"'
    +(big?' srcset="'+mediaSrc("photos/"+name+"-800.webp")+' 800w, '+mediaSrc("photos/"+name+"-1600.webp")+' 1600w"'
         +' sizes="'+(sizes||"(max-width:700px) 84vw, 640px")+'"':'')
    +' width="800" height="'+Math.round(800/(r||1.5))+'" loading="lazy" decoding="async" alt="'+esc(alt||"")+'">';
}
/* A silent loop. data-auto: setupVideos plays it while visible and pauses it off screen;
   with reduced motion it stays on its poster and gets controls instead. */
function videoTag(name, r, label, cls){
  if(!hasMedia("video/"+name+".mp4")) return "";
  var w=r>=1?960:720, h=Math.round(w/(r||1.6));
  return '<video class="'+(cls||"gvid")+'" data-auto muted loop playsinline preload="none"'
    +' width="'+w+'" height="'+h+'"'
    +(hasMedia("video/"+name+".webp")?' poster="'+mediaSrc("video/"+name+".webp")+'"':'')
    +' src="'+mediaSrc("video/"+name+".mp4")+'"'
    +(label?' aria-label="'+esc(label)+'"':' aria-hidden="true"')+'></video>';
}
function galleryItems(area){
  var out=[];
  for(var i=0;i<GALLERY.items.length;i++){
    var it=GALLERY.items[i];
    if(area && it.a.indexOf(area)<0) continue;
    if(it.img ? !hasMedia("photos/"+it.img+"-800.webp") : !hasMedia("video/"+it.vid+".mp4")) continue;
    out.push(it);
  }
  return out;
}
/* The sideways strip. Every cell has the same height and its own width, so photos are
   never cropped to one shape; captions sit underneath. Arrow buttons scroll it, and it is
   a focusable region so the keyboard can scroll it too. */
var galN=0;
function gallery(items, label){
  if(!items.length) return "";
  var id="gal"+(++galN);
  var h='<div class="galbar rv"><span class="galcount">'+items.length+' '
    +(lang==="nl"?"foto’s en video’s":"photos and videos")+'</span>'
    +'<div class="fcbtns"><button type="button" class="fcbtn" data-gal="'+id+'" data-dir="-1" aria-label="'+esc(t(GALLERY.prev))+'">&larr;</button>'
    +'<button type="button" class="fcbtn" data-gal="'+id+'" data-dir="1" aria-label="'+esc(t(GALLERY.next))+'">&rarr;</button></div></div>'
    +'<div class="gal rv" id="'+id+'" role="region" tabindex="0" aria-label="'+esc(label||t(GALLERY.region))+'">';
  for(var i=0;i<items.length;i++){
    var it=items[i];
    h+='<figure class="gcell'+(it.vid?' gcell--vid':'')+'" style="--r:'+it.r+'">'
      +'<div class="gmedia">'+(it.img ? photoTag(it.img,it.r,t(it.alt)) : videoTag(it.vid,it.r,t(it.alt)))+'</div>'
      +'<figcaption>'+esc(t(it.c))+'</figcaption></figure>';
  }
  return h+'</div>';
}
/* ---------------- page openers, photo steps, project stories ---------------- */
/* A picture or clip that fills its box. eager: for the first screen, never lazy. */
function fillMedia(m, alt, eager){
  if(!m) return "";
  if(m.img){
    var t2=photoTag(m.img, m.r||1.5, alt||"", "100vw");
    return eager ? t2.replace(' loading="lazy"',' fetchpriority="high"') : t2;
  }
  if(m.vid && hasMedia("video/"+m.vid+".mp4"))
    return '<video data-auto'+(eager?' data-hero autoplay preload="auto"':' preload="none"')+' muted loop playsinline'
      +(hasMedia("video/"+m.vid+".webp")?' poster="'+mediaSrc("video/"+m.vid+".webp")+'"':'')
      +' src="'+mediaSrc("video/"+m.vid+".mp4")+'"'+(alt?' aria-label="'+esc(alt)+'"':' aria-hidden="true"')+'></video>';
  if(m.art) return caseArt(m.art, alt);
  if(m.shot && typeof WORKSHOTS!=="undefined" && WORKSHOTS[m.shot])
    return '<img class="isshot" src="'+WORKSHOTS[m.shot]+'" alt="'+esc(alt||"")+'" loading="lazy">';
  return "";
}
function caseById(id){ for(var i=0;i<CASES.length;i++) if(CASES[i].id===id) return CASES[i]; return null; }
function caseLinks(c){
  return (c.site?'<a class="caselink" href="'+c.site+'" target="_blank" rel="noopener">'+esc(t(CASEUI.site))+' &nearr;</a>':'')
        +(c.code?'<a class="caselink caselink--code" href="'+c.code+'" target="_blank" rel="noopener">'+esc(t(CASEUI.code))+' &nearr;</a>':'');
}
/* The opener of Engineering, Manufacturing and Work: the page's promise over real work. */
function pageHook(id, title, lbl, firstId){
  var P=PHOOK[id];
  return '<section class="hook hook--page">'
    +'<div class="hookvid" aria-hidden="true">'+fillMedia(P.media,"",true)+'</div>'
    +'<div class="wrap hookin"><div class="lbl">'+esc(lbl)+'</div>'
    +'<h1>'+esc(title)+'</h1><p class="hookp">'+esc(t(P.p))+'</p>'
    +'<div class="hookbtns">'+go("contact",' class="btn btn--light" data-umami-event="cta-contact" data-umami-event-from="'+id+'-hook"')+esc(t(PHOOK.cta))+'</a>'
    +'<a class="btn btn--line" href="#'+firstId+'">'+esc(t(id==="work"?PHOOK.seework:PHOOK.see))+' &darr;</a></div></div>'
    +(P.cap?'<span class="hookcap">'+esc(t(P.cap))+'</span>':'')
    +'</section>';
}
/* How we work, in four photographed steps. */
function photoSteps(id){
  var S=PSTEPS[id]; if(!S) return "";
  var h='<section class="band band--steps" id="how"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(S.lbl))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:20ch">'+esc(t(S.h))+'</h2>'
    +'<ol class="psteps">';
  for(var i=0;i<S.items.length;i++){
    var it=S.items[i];
    h+='<li class="pstep rv"><div class="psmedia">'+fillMedia(it,"",false)+'</div>'
      +'<span class="sn">'+no(i+1)+'</span><h3>'+esc(t(it.h))+'</h3><p>'+esc(t(it.p))+'</p></li>';
  }
  return h+'</ol></div></section>';
}
/* Drawings for projects we have no photos of. On-brand line work, no text inside, so
   one drawing serves both languages; the alt text says what it shows. */
function caseArt(name, alt){
  if(name==="planecar") return '<svg class="caseart" viewBox="0 0 640 420" role="img" aria-label="'+esc(alt||"")+'">'
    +'<defs><linearGradient id="caFlight" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#70B9F8"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient>'
    +'<pattern id="caGrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#FFFFFF" stroke-opacity=".06"/></pattern></defs>'
    +'<rect width="640" height="420" fill="#0E1016"/><rect width="640" height="420" fill="url(#caGrid)"/>'
    /* the road, in perspective */
    +'<path d="M40 400 L600 300" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="2"/>'
    +'<path d="M40 420 L640 312" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="2"/>'
    +'<path d="M60 410 L620 306" stroke="#FFFFFF" stroke-opacity=".22" stroke-width="2" stroke-dasharray="14 14"/>'
    /* the car, with the marker on its roof */
    +'<g transform="translate(408 318) rotate(-10.5)"><rect x="-58" y="-26" width="116" height="34" rx="9" fill="#1C2130" stroke="#70B9F8" stroke-opacity=".8"/>'
    +'<rect x="-32" y="-44" width="62" height="22" rx="7" fill="#1C2130" stroke="#70B9F8" stroke-opacity=".8"/>'
    +'<g transform="translate(-10 -40)"><rect width="20" height="14" fill="#FFFFFF"/><rect x="3" y="3" width="6" height="4" fill="#0E1016"/><rect x="11" y="7" width="6" height="4" fill="#0E1016"/></g>'
    +'<circle cx="-34" cy="9" r="9" fill="#0E1016" stroke="#70B9F8" stroke-opacity=".8"/><circle cx="34" cy="9" r="9" fill="#0E1016" stroke="#70B9F8" stroke-opacity=".8"/></g>'
    /* the flight path, descending onto the car */
    +'<path d="M70 70 C 210 40, 300 110, 340 190 S 380 270, 400 278" fill="none" stroke="url(#caFlight)" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>'
    +'<g fill="#70B9F8"><circle cx="70" cy="70" r="3.5"/><circle cx="190" cy="58" r="3.5"/><circle cx="290" cy="118" r="3.5"/><circle cx="340" cy="190" r="3.5"/></g>'
    /* the camera cone from the plane to the marker */
    +'<path d="M372 232 L382 278 L420 268 Z" fill="#70B9F8" fill-opacity=".14"/>'
    /* the plane, nose down along the path */
    +'<g transform="translate(364 224) rotate(52) scale(1.25)"><path d="M24 0 L7 -3 L2 -22 L-4 -22 L-2 -3 L-15 -2 L-19 -9 L-23 -9 L-21 0 L-23 9 L-19 9 L-15 2 L-2 3 L-4 22 L2 22 L7 3 Z" fill="#FFFFFF"/></g>'
    /* a second plane, flying the same route behind */
    +'<g transform="translate(150 55) rotate(-6) scale(.85)" opacity=".7"><path d="M24 0 L7 -3 L2 -22 L-4 -22 L-2 -3 L-15 -2 L-19 -9 L-23 -9 L-21 0 L-23 9 L-19 9 L-15 2 L-2 3 L-4 22 L2 22 L7 3 Z" fill="#B9A8FF"/></g>'
    +'</svg>';
  return "";
}
function caseMedia(c, eager){ return fillMedia(c.media, t(c.alt), eager); }
/* The full story rows on the Work page. */
function caseRows(){
  var h='<div class="cases">';
  for(var i=0;i<CASES.length;i++){
    var c=CASES[i], tags=t(c.tags)||[];
    if(!c.featured) continue;
    h+='<article class="case rv" id="case-'+c.id+'">'
      +'<div class="casemedia'+(c.media.art?' casemedia--art':'')+'">'+caseMedia(c,false)
      +(c.more?'<div class="casemore">'+fillMedia(c.more,"",false)+'</div>':'')+'</div>'
      +'<div class="casetext"><div class="casemeta">'+esc(t(c.meta))+'</div>'
      +'<h3>'+esc(t(c.t))+'</h3>'
      +'<div class="casek">'+esc(t(CASEUI.sit))+'</div><p>'+esc(t(c.sit))+'</p>'
      +'<div class="casek">'+esc(t(CASEUI.did))+'</div><ul>';
    for(var j=0;j<c.did.length;j++) h+='<li>'+esc(t(c.did[j]))+'</li>';
    h+='</ul><div class="casefoot"><span class="casestatus">'+esc(t(c.status))+'</span>';
    for(var k=0;k<tags.length;k++) h+='<span class="casetag">'+esc(tags[k])+'</span>';
    h+='</div>'+(c.site||c.code?'<div class="caselinks">'+caseLinks(c)+'</div>':'')+'</div></article>';
  }
  return h+'</div>';
}
/* The project grid: every project that is not a full story, as a card, with filter
   chips. Cards carry id="case-<id>" so a teaser elsewhere can link straight to one. */
var gridN=0;
function projectGrid(list, withFilter){
  if(!list.length) return "";
  var gid="pg"+(++gridN), h="";
  if(withFilter){
    var have={};
    for(var x=0;x<list.length;x++) have[list[x].cat]=1;
    h+='<div class="pfilter rv" role="group" aria-label="'+esc(t(CASEUI.filter))+'" data-grid="'+gid+'">';
    for(var f=0;f<CASECATS.length;f++){
      var cc=CASECATS[f]; if(cc.id!=="all" && !have[cc.id]) continue;
      h+='<button type="button" class="pchip" data-cat="'+cc.id+'" aria-pressed="'+(cc.id==="all")+'">'+esc(t(cc.n))+'</button>';
    }
    h+='</div>';
  }
  h+='<div class="pgrid" id="'+gid+'">';
  for(var i=0;i<list.length;i++){
    var c=list[i], tags=t(c.tags)||[];
    h+='<article class="pcard rv" id="case-'+c.id+'" data-cat="'+c.cat+'">'
      +'<div class="pmedia'+(c.media.art?' pmedia--art':'')+(c.fit==="contain"?' is-contain':'')+(c.media.shot?' is-shot':'')+'">'+caseMedia(c,false)+'</div>'
      +'<div class="pbody"><span class="casemeta">'+esc(t(c.meta))+'</span>'
      +'<h3>'+esc(t(c.t))+'</h3><p>'+esc(t(c.one))+'</p>'
      +'<div class="casefoot">';
    for(var k=0;k<tags.length;k++) h+='<span class="casetag">'+esc(tags[k])+'</span>';
    h+='</div>'+(c.site||c.code?'<div class="caselinks">'+caseLinks(c)+'</div>':'')+'</div></article>';
  }
  return h+'</div>';
}
/* Engineering: problems a client recognises, what we do about each, and where we did
   it. A sticky heading on the left; the rows reveal one after another on the right. */
function offersBlock(){
  var O=OFFERS, h='<section class="band band--grey" id="offers"><div class="wrap"><div class="offers">'
    +'<div class="offershead"><div class="lbl">'+esc(t(O.lbl))+'</div>'
    +'<h2>'+esc(t(O.h))+'</h2><p class="deck">'+esc(t(O.d))+'</p>'
    +go("contact",' class="btn" data-umami-event="cta-contact" data-umami-event-from="offers"')+esc(t(O.cta))+'</a></div>'
    +'<ol class="offerlist">';
  for(var i=0;i<O.items.length;i++){
    var it=O.items[i], pc=it.p && caseById(it.p);
    h+='<li class="offer rv" style="--d:'+((i%3)*90)+'ms"><span class="sn">'+no(i+1)+'</span><div>'
      +'<h3>'+esc(t(it.q))+'</h3><p>'+esc(t(it.a))+'</p>'
      +(pc?'<a class="offerseen" href="'+href("work")+'#case-'+pc.id+'">'+esc(t(O.seen))+': '+esc(t(pc.t))+' &rarr;</a>':'')
      +'</div></li>';
  }
  return h+'</ol></div></div></section>';
}

/* Three stories as cards, for a service page; each links to its place on Work. */
function caseTeasers(area, n){
  var list=[];
  for(var i=0;i<CASES.length && list.length<(n||3);i++) if(CASES[i].area.indexOf(area)>=0) list.push(CASES[i]);
  if(!list.length) return "";
  var h='<section class="band"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(CASEUI.teaserlbl))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:20ch">'+esc(t(CASEUI.teaserh))+'</h2>'
    +'<div class="teasers">';
  for(var j=0;j<list.length;j++){
    var c=list[j];
    h+='<a class="teaser rv" href="'+href("work")+'#case-'+c.id+'">'
      +'<span class="teasermedia'+(c.media.art?' teasermedia--art':'')+(c.fit==="contain"?' is-contain':'')+'">'+caseMedia(c,false)+'</span>'
      +'<span class="teaserbody"><span class="casemeta">'+esc(t(c.meta))+'</span>'
      +'<span class="teaserh">'+esc(t(c.t))+'</span>'
      +'<span class="needgo">'+esc(t(CASEUI.read))+' &rarr;</span></span></a>';
  }
  return h+'</div></div></section>';
}

/* Gallery block for the end of an engineering activity page: only work from that area. */
function galleryBlock(area){
  var shown={}, P=(typeof PHOOK!=="undefined") && PHOOK[area], S=(typeof PSTEPS!=="undefined") && PSTEPS[area];
  if(P&&P.media) shown[P.media.img||P.media.vid]=1;
  if(S) for(var x=0;x<S.items.length;x++) shown[S.items[x].img||S.items[x].vid]=1;
  var items=galleryItems(area).filter(function(it){ return !shown[it.img||it.vid]; });
  if(!items.length) return "";
  return '<section class="band band--grey band--gal"><div class="wrap">'
    +'<div class="lbl lbl--q rv">'+esc(t(EXPH.h))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:20ch">'+esc(t(EXPH.d))+'</h2>'
    +gallery(items)
    +'<div class="rv" style="margin-top:30px">'+go("work",' class="btn btn--ghost"')+esc(t(GALLERY.all))+' &rarr;</a></div>'
    +'</div></section>';
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
      +(src ? '<img src="'+src+'" alt="">'
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
      +(dsrc?'<span class="dpic'+(dcut?' dpic--cut':'')+'"><img src="'+dsrc+'" alt=""></span>':'')
      +(dcut?'':(ICON[it.ic]||''))+'<h3>'+esc(t(it.t))+'</h3>'
      +'<p>'+esc(t(it.p))+'</p>'
      +(it.ex?'<p class="eg"><span>'+(lang==="nl"?"Voorbeeld":"Example")+'</span>'+esc(t(it.ex))+'</p>':'')
      +'<div class="tags">'+esc(it.k)+'</div>'+domFold(it.ic)+'</div>';
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
  start: ["signal","gears"],
  price: ["rule","valve"],
  work:  ["layout","gears"],
  dev:   ["bench","signal"],
  "dev-knee":["signal","pcb"],
  "dev-crew":["gears","drone"],
  "dev-ballout":["part","rule"],
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
/* The engineering cases are not published any more — every one of them is under NDA.
   EXPERIENCE stays in content.js so they can come back, but nothing renders them; what
   is left on the site is the software portfolio, the websites that are live. */
/* Which proof belongs on which page. Websites are proof for web work, engineering
   items are proof for hardware work; showing both everywhere is noise. */
var SHOWFOLIO={web:true, work:true, about:true, price:true};
/* Proof on an activity page: the sites that are live, nothing else. */
function expBlock(withNext, area){
  if(!((area===undefined)||SHOWFOLIO[area]===true)) return "";
  var h='<div class="lbl lbl--q rv">'+esc(t(EXPH.h))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:20ch">'+esc(t(withNext?EXPH.none:C.folio.expd))+'</h2>'
    +'<p class="deck rv" style="margin-top:18px">'+esc(t(EXPH.d))+'</p>'
    +folioCards();
  if(withNext) h+='<p class="deck rv" style="margin-top:30px">'+esc(t(C.folio.nextp))+'</p>';
  return h;
}
function ctaBlock(head){
  return '<div class="cta"><h2>'+esc(head)+'</h2>'
    +go("contact",' class="btn" data-umami-event="cta-contact"')+esc(t(C.home.ctab))+'</a></div>';
}

function renderHome(){
  var H=HOME2, d=C.home, h="";

  /* 1. the hook — what we do, for whom, and proof it's real, inside six seconds.
     Real footage behind a promise; the logo lives in the bar above. No reveal delay
     here: this text is in the prerendered HTML and visible before any script runs. */
  var hv=(typeof HERO_VIDEO!=="undefined") && HERO_VIDEO;
  var hvBig=hv && hasMedia("video/"+hv.big+".mp4"), hvSmall=hv && hasMedia("video/"+hv.small+".mp4");
  var poster=hv && (hasMedia("video/"+hv.big+".webp") ? mediaSrc("video/"+hv.big+".webp") : "");
  h+='<section class="hook'+(hvBig||hvSmall?' hook--vid':'')+'">';
  if(hvBig||hvSmall)
    h+='<div class="hookvid" aria-hidden="true"><video data-auto data-hero autoplay muted loop playsinline preload="auto"'
      +(poster?' poster="'+poster+'"':'')+'>'
      +(hvSmall&&hvBig?'<source src="'+mediaSrc("video/"+hv.small+".mp4")+'" type="video/mp4" media="(max-width: 900px)">':'')
      +'<source src="'+mediaSrc("video/"+(hvBig?hv.big:hv.small)+".mp4")+'" type="video/mp4"></video></div>';
  h+='<div class="wrap hookin">'
    +'<div class="lbl">'+esc(t(H.hook.lbl))+'</div>'
    +'<h1>'+esc(t(H.hook.h))+'</h1>'
    +'<p class="hookp">'+esc(t(H.hook.p))+'</p>'
    +'<div class="hookbtns">'+go("contact",' class="btn btn--light" data-umami-event="cta-contact" data-umami-event-from="hook"')+esc(t(H.hook.cta))+'</a>'
    +'<a class="btn btn--line" href="#built">'+esc(t(H.hook.see))+' &darr;</a></div>'
    +'<p class="hookproof">'+esc(t(H.hook.proof))+'</p>'
    +'</div></section>';

  /* 2. proof, straight away: five things we built, each with a one-line story */
  var bi=[];
  for(var i=0;i<H.built.items.length;i++){
    var it=H.built.items[i];
    var m = it.img ? photoTag(it.img,it.r,t(it.alt),i===0?"(max-width:760px) 92vw, 560px":"(max-width:760px) 92vw, 280px")
                   : videoTag(it.vid,it.r,t(it.alt),"bvid");
    if(m) bi.push('<figure class="bento-i'+(bi.length===0?' bento-i--big':'')+'">'+m
      +'<figcaption>'+esc(t(it.c))+'</figcaption></figure>');
  }
  if(bi.length){
    h+='<section class="band band--built" id="built"><div class="wrap">'
      +'<div class="lbl rv">'+esc(t(H.built.lbl))+'</div>'
      +'<h2 class="rv" style="margin-top:16px;max-width:22ch">'+esc(t(H.built.h))+'</h2>'
      +'<div class="bento rv">'+bi.join("")+'</div>'
      +'<div class="rv" style="margin-top:30px">'+go("work",' class="btn btn--ghost"')+esc(t(H.built.all))+' &rarr;</a></div>'
      +'</div></section>';
  }

  /* 3. four situations a visitor recognises, each one a door to a service page */
  h+='<section class="band band--grey"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(H.needs.lbl))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:20ch">'+esc(t(H.needs.h))+'</h2>'
    +'<div class="needs">';
  for(var n=0;n<H.needs.items.length;n++){
    var nd=H.needs.items[n], ar=area(nd.id), pic="";
    if(nd.img) pic=photoTag(nd.img,nd.r,"", "(max-width:760px) 92vw, 540px");
    else if(nd.shot && typeof WORKSHOTS!=="undefined" && WORKSHOTS[nd.shot]) pic='<img src="'+WORKSHOTS[nd.shot]+'" alt="" loading="lazy">';
    h+=go(nd.id,' class="need rv"')
      +'<span class="needpic'+(nd.shot?' needpic--shot':'')+'">'+pic+'</span>'
      +'<span class="needbody"><span class="needq">'+esc(t(nd.q))+'</span>'
      +'<span class="needa">'+esc(t(nd.a))+'</span>'
      +'<span class="needgo">'+esc(aName(ar))+' &rarr;</span></span></a>';
  }
  h+='</div></div></section>';

  /* 4. the people, and only numbers we can stand behind */
  h+='<section class="band band--dark"><div class="wrap">'
    +'<div class="whorow rv"><div class="whotext">'
    +'<div class="lbl">'+esc(t(H.team.lbl))+'</div>'
    +'<h2 style="margin-top:18px">'+esc(t(H.team.h))+'</h2>'
    +'<p class="muted">'+esc(t(H.team.p))+'</p></div>'
    +'<div class="stats stats--side stats--two">';
  for(var s2=0;s2<H.team.stats.length;s2++)
    h+='<div><div class="n">'+esc(H.team.stats[s2].n)+'</div><div class="k">'+esc(t(H.team.stats[s2].k))+'</div></div>';
  h+='</div></div>';
  h+='<div class="team rv" style="margin-top:56px">';
  for(var m2=0;m2<d.team.length;m2++)
    h+='<div class="p">'+portrait(d.team[m2])
      +'<div class="nm">'+esc(t(d.team[m2].n))+'</div>'
      +'<div class="ro">'+esc(t(d.team[m2].r))+'</div></div>';
  h+='</div></div></section>';

  /* 5. how it works, folded into the ask: four short lines next to the button */
  h+='<section class="band"><div class="wrap"><div class="howask rv">'
    +'<div class="howask-cta"><div class="lbl">'+esc(t(H.how.lbl))+'</div>'
    +'<h2>'+esc(t(H.how.h))+'</h2><p class="deck">'+esc(t(H.how.p))+'</p>'
    +'<div class="twolinks">'+go("contact",' class="btn" data-umami-event="cta-contact" data-umami-event-from="how"')+esc(t(d.ctab))+'</a>'
    +go("work",' class="btn btn--ghost"')+esc(t(d.teamwork))+'</a></div></div>'
    +'<ol class="howlist">';
  for(var k=0;k<H.how.steps.length;k++)
    h+='<li><span class="sn">'+no(k+1)+'</span><div><h3>'+esc(t(H.how.steps[k].h))+'</h3><p>'+esc(t(H.how.steps[k].p))+'</p></div></li>';
  h+='</ol></div></div></section>';

  /* 6. our own products, as an invitation */
  h+='<section class="band band--grey"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(H.partners.lbl))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:22ch">'+esc(t(H.partners.h))+'</h2>'
    +'<p class="deck rv" style="margin-top:18px">'+esc(t(H.partners.p))+'</p>'
    +devCards()
    +'<div class="twolinks rv" style="margin-top:34px">'
    +go("contact",' class="btn" data-umami-event="cta-contact" data-umami-event-from="partners"')+esc(t(H.partners.cta))+'</a>'
    +go("dev",' class="btn btn--ghost"')+esc(t(DEV.all))+'</a></div>'
    +'</div></section>';
  return h;
}

/* ---------------- about ---------------- */
function renderAbout(){
  var d=C.about,hm=C.home,h="";
  h+='<section class="opener">'+watermark("about")
    +'<div class="narrow"><div class="lbl">'+esc(t(hm.teamabout))+'</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';

  /* the team */
  h+='<section class="band band--tight">'+bandMark("gears","bench")+'<div class="wrap">'
    +'<p class="deck rv" style="max-width:58ch">'+esc(t(hm.teamd))+'</p>'
    +'<div class="team rv">';
  for(var m=0;m<hm.team.length;m++)
    h+='<div class="p">'+portrait(hm.team[m])
      +'<div class="nm">'+esc(t(hm.team[m].n))+'</div>'
      +'<div class="ro">'+esc(t(hm.team[m].r))+'</div></div>';
  h+='</div></div></section>';

  /* the history, and nothing else — everything that used to follow it moved or went */
  h+=flowSplit(7,"var(--paper)","var(--paper2)",5);
  h+='<section class="band band--grey"><div class="narrow"><h2>'+esc(t(d.storyh))+'</h2>'
    +'<div style="margin-top:24px"><p class="deck" style="max-width:none">'
    +esc(t(hm.whop)).split("\n\n").join('</p><p class="deck" style="max-width:none">')+'</p></div></div>'
    +'<div class="wrap"><div class="phrow rv" style="margin-top:56px">'
    +(hasMedia("photos/drone-response-build-table-wide-800.webp")
       ? '<div class="ph has-img">'+photoTag("drone-response-build-table-wide",1.5,
           lang==="nl"?"Twee engineers van Liminex aan hun werktafel tijdens Drone Response 2.0":"Two Liminex engineers at their build table during Drone Response 2.0",
           "(max-width:760px) 92vw, 760px")+'</div>'
       : ph(t(hm.photo1),t(hm.photo1s)))
    +(hasMedia("photos/wiring-machine-cabinets-800.webp")
       ? '<div class="ph has-img">'+photoTag("wiring-machine-cabinets",0.8,
           lang==="nl"?"Engineer die bedrading aanlegt tussen besturingskasten":"Engineer wiring between machine control cabinets",
           "(max-width:760px) 92vw, 380px")+'</div>'
       : ph(t(hm.photo2),t(hm.photo2s)))
    +'</div></div></section>';

  h+='<section class="band band--dark"><div class="wrap"><div class="stats rv" style="margin-top:0">';
  for(var st=0;st<hm.stats.length;st++)
    h+='<div><div class="n">'+esc(hm.stats[st].n)+'</div><div class="k">'+esc(t(hm.stats[st].k))+'</div></div>';
  h+='</div></div></section>';
  return h;
}

/* IT & Web reads as an exhibition of what has been delivered */
function renderWeb(){
  var d=C.web, S=SOFT, h="";
  /* 1. the promise, over our own ground-station software */
  var P={media:S.hook.media, p:S.hook.p, cap:S.hook.cap};
  PHOOK.web=P;
  h+=pageHook("web", t(S.hook.h), "Software, web & AI", "sides");

  /* 2. two sides of the same craft */
  h+='<section class="band" id="sides"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(S.sides.lbl))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:20ch">'+esc(t(S.sides.h))+'</h2>'
    +'<div class="sides">';
  for(var i=0;i<S.sides.items.length;i++){
    var sd=S.sides.items[i];
    h+='<div class="side rv"><h3>'+esc(t(sd.h))+'</h3><ul>';
    for(var j=0;j<sd.l.length;j++) h+='<li>'+esc(t(sd.l[j]))+'</li>';
    h+='</ul><div class="sideproof">';
    for(var k=0;k<sd.p.length;k++){ var pc=caseById(sd.p[k]); if(pc) h+='<a href="'+href("work")+'#case-'+pc.id+'">'+esc(t(pc.t))+' &rarr;</a>'; }
    h+='</div></div>';
  }
  h+='</div></div></section>';

  /* 3. the software we wrote, web and machines together */
  var soft=CASES.filter(function(c){ return c.area.indexOf("web")>=0; });
  h+='<section class="band band--grey"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(S.projlbl))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:20ch">'+esc(t(S.projh))+'</h2>'
    +projectGrid(soft,true)+'</div></section>';

  /* 4. websites in detail: the services with their renders, and the prices */
  h+='<section class="band band--tight band--bub">'+bandMark("layout","pcb")+'<div class="wrap">'
    +'<h2 class="rv">'+esc(t(S.webh))+'</h2>'
    +'<p class="deck rv" style="margin-top:18px">'+esc(t(d.intro))+'</p>'
    +altRows([
      {key:"part-layout", t:d.svcs[0].n, p:d.svcs[0].d, shot:C.home.shots.web},
      {key:"web-2", t:d.svcs[1].n, p:d.svcs[1].d, shot:{nl:"Foto — afrekenen en boeken op een telefoon",en:"Photo — checkout and booking on a phone"}},
      {key:"web-1", t:d.svcs[4].n, p:d.svcs[4].d, shot:{nl:"Foto — een werkstroom die zichzelf uitvoert",en:"Photo — a workflow that runs itself"}}
    ], true)
    +'<div class="rv" style="margin-top:64px">'+svcList([d.svcs[2],d.svcs[3],d.svcs[5]], t(d.moreh), null, true)+'</div>'
    +pricePreview()+'</div></section>';

  /* 5. how it goes, next to the ask */
  h+='<section class="band band--grey"><div class="wrap"><div class="howask rv">'
    +'<div class="howask-cta"><div class="lbl">'+(lang==="nl"?"Hoe het gaat":"How it goes")+'</div>'
    +'<h2>'+esc(t(S.howh))+'</h2><p class="deck">'+esc(t(S.howp))+'</p>'
    +'<div class="twolinks">'+go("contact",' class="btn" data-umami-event="cta-contact" data-umami-event-from="web"')+esc(t(C.home.ctab))+'</a></div></div>'
    +'<ol class="howlist">';
  for(var st=0;st<d.steps.length;st++)
    h+='<li><span class="sn">'+no(st+1)+'</span><div><h3>'+esc(t(d.steps[st].h))+'</h3><p>'+esc(t(d.steps[st].p))+'</p></div></li>';
  h+='</ol></div></div></section>';
  return h;
}

function formPreview(url,title,sub,open){
  return '<a class="formcard formcard--preview" href="'+url+'" target="_blank" rel="noopener">'
    +'<span class="fp"><span class="fp-bar"></span>'
    +'<span class="fp-title">'+esc(title)+'</span><span class="fp-sub">'+esc(sub)+'</span>'
    +'<span class="fp-q"><span class="fp-l"></span><span class="fp-l fp-l--s"></span></span>'
    +'<span class="fp-opts"><span class="fp-o"></span><span class="fp-o"></span><span class="fp-o"></span></span>'
    +'<span class="fp-q"><span class="fp-l"></span><span class="fp-l fp-l--s"></span></span>'
    +'<span class="fp-btn">'+esc(open)+' &rarr;</span></span></a>';
}

function renderArea(id){
  if(id==="web") return renderWeb();
  if(id==="dev") return renderDev();
  if(id.indexOf("dev-")===0) return renderDevProject(id.slice(4));
  var a=area(id),d=C[id],h="";
  if(id==="proto"||id==="make") return renderAreaStory(id,a,d);
  h+='<section class="opener">'+watermark(id)
    +'<div class="narrow"><div class="lbl">'+esc(aName(a))+'</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';
  h+=flowSplit(5,"var(--paper)","var(--paper)",5);
  h+='<section class="band band--tight">'+bandMark("printer","cnc")+'<div class="narrow">'
    +'<p class="deck" style="max-width:none">'+esc(t(d.intro))+'</p></div>';
  /* One list per page carries renders; the others keep line icons so no picture
     repeats on a page. "img:<key>" names a render, "ic:<name>" forces the icon. */
  var SVCICONS={proto:["img:svc-feasibility","img:svc-build","img:svc-capacity"],
                make:["img:make-design","img:make-series","img:svc-sourcing"],
                start:["ic:test","ic:cad","ic:elec","ic:data","ic:robot"]};
  /* The start page shows its services once, in the "how we make this affordable"
     section below, so it skips this generic list. */
  if(d.svcs && id!=="start") h+='<div class="wrap">'
    +svcList(d.svcs,
             id==="make" ? t(d.aroundh) : (lang==="nl"?"Wat we doen":"What we do"),
             SVCICONS[id], id==="make")+'</div>';
  h+='</section>';

  if(id==="proto") h+='<section class="band band--grey"><div class="wrap">'+discGrid()+'</div></section>';
  if(id==="start" && d.svch){
    h+='<section class="band band--grey">'+bandMark("signal","gears")+'<div class="wrap">'
      +'<h2 class="rv">'+esc(t(d.svch))+'</h2>'
      +'<p class="deck rv" style="margin-top:18px">'+esc(t(d.svcd))+'</p>'
      +'<div class="rv">'+svcList(d.svcs,"",["ic:data","ic:ai","ic:maintain"],true)+'</div>'
      +'</div></section>';
  }
  var CARDICONS={start:["ic:test","ic:cad","ic:robot","ic:dfm"],make:["ic:dfm","ic:print3d","ic:pipe","ic:data"]};
  /* Prototyping shows the domains grid instead of a generic card row. */
  if(d.cards && id!=="proto") h+='<section class="band band--grey"><div class="wrap">'
    +(d.cardsh?'<h2 class="rv">'+esc(t(d.cardsh))+'</h2>':'')
    +'<div class="rv">'+cardRow(d.cards,CARDICONS[id])+'</div></div></section>';
  /* A page with no steps and no note has nothing for this band, and it used to leave a
     screen of empty white between the grey sections. */
  var stepsBand = d.steps || (d.note && id!=="start");
  if(stepsBand) h+='<section class="band'+(d.steps?' band--bub':'')+'">'+bandMark(WMARKS[id]?WMARKS[id][1]:"gears",WMARKS[id]?WMARKS[id][0]:"rule")
    +'<div class="wrap">';
  var STEPICONS={proto:["test","cad","elec","firmware","dfm"],
                 make:["dfm","cad","print3d","pipe","test"],
                 start:["test","cad","robot","dfm","data"]};
  if(d.steps) h+='<h2>'+(lang==="nl"?"Hoe het gaat":"How it goes")+'</h2>'
    +stepList(d.steps,STEPICONS[id],"pics");
  if(d.note && id!=="start") h+='<div class="marginnote"><h3>'+esc(t(d.noteh))+'</h3><p>'+esc(t(d.note))+'</p></div>';
  if(stepsBand) h+='</div></section>';
  h+=galleryBlock(id);
  h+='<section class="band band--tight"><div class="wrap">'
    +(id==="start" ? "" : expBlock(true,id))
    +ctaBlock(lang==="nl"?"Zullen we hier een half uur over praten?":"Shall we spend half an hour on this?")
    +'</div></section>';
  return h;
}

/* Engineering and Manufacturing: open on real work, show how it's done in photos, then
   the services (with their renders, easier to compare), then proof, then the ask. */
function renderAreaStory(id,a,d){
  var h=pageHook(id, t(PHOOK[id].h||d.lede), aName(a), "how");
  h+=photoSteps(id);
  if(id==="proto") h+=offersBlock();
  else h+='<section class="band band--grey">'+bandMark(WMARKS[id][0],WMARKS[id][1])+'<div class="wrap">'
    +svcList(d.svcs, t(d.aroundh), ["img:make-design","img:make-series","img:svc-sourcing"], true)+'</div></section>';
  if(id==="proto"){
    h+=caseTeasers("proto",3);
    h+='<section class="band band--grey"><div class="wrap">'+discGrid()+'</div></section>';
  }
  if(id==="make"){
    h+='<section class="band band--dark"><div class="wrap"><div class="why rv">';
    for(var i=0;i<MAKEWHY.length;i++)
      h+='<div><h3>'+esc(t(MAKEWHY[i].n))+'</h3><p>'+esc(t(MAKEWHY[i].p))+'</p></div>';
    h+='</div></div></section>';
    h+=caseTeasers("make",3);
    h+=galleryBlock(id);
  }
  h+='<section class="band band--tight"><div class="wrap">'
    +ctaBlock(lang==="nl"?"Zullen we hier een half uur over praten?":"Shall we spend half an hour on this?")
    +'</div></section>';
  return h;
}

/* ---------------- in development ----------------
   Our own products. DEV in content.js holds the copy; the cards reuse .block from the
   home page so the two rows look like one site. A project page is: opener with status,
   three numbers, the render, the blocks, and the ask. */
function devItem(id){ for(var i=0;i<DEV.items.length;i++){ if(DEV.items[i].id===id) return DEV.items[i]; } return null; }
function devCards(){
  var h='<div class="blocks blocks--dev">';
  for(var i=0;i<DEV.items.length;i++){
    var it=DEV.items[i];
    var src=renderSrc(it.img);
    var cut=src && typeof CUTOUT!=="undefined" && CUTOUT.indexOf(it.img)>=0;
    h+=go("dev-"+it.id,' class="block rv'+(cut?' has-cut':'')+'"')
      +'<span class="prev'+(src?(cut?' has-cut':' has-img'):'')+'">'
      +(src?'<img src="'+src+'" alt="">':GLYPH.frame+'<span class="cap">'+esc(t(it.t))+'</span>')
      +'</span>'
      +'<span class="body"><h3>'+esc(t(it.t))+'</h3>'
      +'<span class="intro">'+esc(t(it.one))+'</span>'
      +'<span class="more">'+esc(t(DEV.more))+' &rarr;</span></span></a>';
  }
  return h+'</div>';
}
function renderDev(){
  var h='<section class="opener">'+watermark("dev")+'<div class="narrow"><div class="lbl">'+esc(t(DEV.lbl))+'</div>'
    +'<h1>'+esc(t(DEV.h))+'</h1></div></section>';
  h+=flowSplit(6,"var(--paper)","var(--paper)",5);
  h+='<section class="band band--tight">'+bandMark("bench","signal")+'<div class="wrap">'+devCards()+'</div></section>';
  h+='<section class="band band--grey"><div class="wrap">'
    +'<div class="cta"><h2>'+esc(t(DEV.ctah))+'</h2><p class="deck" style="margin:14px auto 0;max-width:52ch">'+esc(t(DEV.ctap))+'</p>'
    +go("contact",' class="btn" data-umami-event="cta-contact" data-umami-event-from="dev"')+esc(t(DEV.ctab))+'</a></div>'
    +'</div></section>';
  return h;
}
function renderDevProject(id){
  var it=devItem(id); if(!it) return renderDev();
  var src=renderSrc(it.img);
  var cut=src && typeof CUTOUT!=="undefined" && CUTOUT.indexOf(it.img)>=0;
  /* 1. what it is and why: lede, status, the problem in a few lines */
  var h='<section class="opener">'+watermark("dev-"+id)+'<div class="narrow">'
    +'<div class="lbl">'+go("dev",' class="crumb"')+esc(t(DEV.lbl))+'</a></div>'
    +'<h1>'+esc(t(it.lede))+'</h1>'
    +'<p class="status status--big">'+esc(t(it.status))+'</p>'
    +'<p class="deck">'+esc(t(it.why))+'</p></div></section>';
  h+=flowSplit(5,"var(--paper)","var(--paper)",5);
  /* 2. the concept, next to the render */
  h+='<section class="band band--tight">'+bandMark(WMARKS["dev-"+id][1],WMARKS["dev-"+id][0])+'<div class="wrap">'
    +'<div class="devhero rv">'
    +'<div class="devmedia'+(cut?' devmedia--cut':'')+'">'+(src?'<img src="'+src+'" alt="'+esc(t(it.t))+'">':ph(t(it.t),"16:10"))+'</div>'
    +'<div class="concept"><div class="lbl">'+esc(t(DEV.conceptl))+'</div>';
  for(var c=0;c<it.concept.length;c++) h+='<p>'+esc(t(it.concept[c]))+'</p>';
  h+='</div></div>'
  /* 3. the facts and the value, as one strip to flick through */
    +'<div class="fcarhead rv"><div class="lbl">'+esc(t(DEV.whyl))+'</div>'
    +'<div class="fcbtns"><button type="button" class="fcbtn" aria-label="&larr;" '
    +'onclick="this.closest(\'.fcarhead\').nextElementSibling.scrollBy({left:-320,behavior:\'smooth\'})">&larr;</button>'
    +'<button type="button" class="fcbtn" aria-label="&rarr;" '
    +'onclick="this.closest(\'.fcarhead\').nextElementSibling.scrollBy({left:320,behavior:\'smooth\'})">&rarr;</button></div></div>'
    +'<div class="fcar rv" role="region" tabindex="0" aria-label="'+esc(t(DEV.whyl))+'">';
  for(var f=0;f<it.stats.length;f++)
    h+='<div class="fcell"><div class="n">'+esc(t(it.stats[f].n))+'</div><div class="k">'+esc(t(it.stats[f].k))+'</div></div>';
  for(var v=0;v<it.value.length;v++)
    h+='<div class="fcell"><h3>'+esc(t(it.value[v].h))+'</h3><p>'+esc(t(it.value[v].p))+'</p></div>';
  h+='</div></div></section>';
  /* 4. who we're looking for: the reason the page exists */
  h+='<section class="band band--dark"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(DEV.askh))+'</div>'
    +'<p class="deck rv" style="margin-top:16px">'+esc(t(DEV.askd))+'</p>'
    +'<div class="askt rv"><div class="askrow askrow--head">';
  for(var ac=0;ac<DEV.askcols.length;ac++) h+='<div>'+esc(t(DEV.askcols[ac]))+'</div>';
  h+='</div>';
  for(var a=0;a<it.ask.length;a++){
    var r=it.ask[a];
    h+='<div class="askrow">'
      +'<div class="awho"><span class="acol">'+esc(t(DEV.askcols[0]))+'</span>'+esc(t(r.who))+'</div>'
      +'<div><span class="acol">'+esc(t(DEV.askcols[1]))+'</span>'+esc(t(r.ask))+'</div>'
      +'<div><span class="acol">'+esc(t(DEV.askcols[2]))+'</span>'+esc(t(r.get))+'</div></div>';
  }
  h+='</div>'
    +'<div class="rv" style="text-align:center;margin-top:42px">'
    +go("contact",' class="btn" data-umami-event="cta-contact" data-umami-event-from="dev-'+id+'"')+esc(t(DEV.ctab))+'</a></div>'
    +'</div></section>';
  /* 5. how we work and where we stand */
  h+='<section class="band band--grey">'+bandMark("rule","gears")+'<div class="wrap">'
    +'<h2 class="rv">'+esc(t(DEV.howh))+'</h2>'
    +'<div class="devblocks">';
  for(var b=0;b<DEV.how.length;b++)
    h+='<div class="rv"><span class="sn">'+no(b+1)+'</span><h3>'+esc(t(DEV.how[b].h))+'</h3><p>'+esc(t(DEV.how[b].p))+'</p></div>';
  h+='</div></div></section>';
  /* 6. close */
  h+='<section class="band band--dark"><div class="wrap">'
    +'<div class="teamcta rv" style="margin-top:0;padding-top:0;border-top:0"><h2>'+esc(t(DEV.ctah))+'</h2><p>'+esc(t(DEV.ctap))+'</p>'
    +go("contact",' class="btn" data-umami-event="cta-contact" data-umami-event-from="dev-'+id+'-end"')+esc(t(DEV.ctab))+'</a>'
    +'<div class="twolinks" style="justify-content:center;margin-top:28px">'+go("dev",' class="btn btn--ghost"')+esc(t(DEV.back))+'</a></div></div>'
    +'</div></section>';
  return h;
}
function renderWork(){
  var d=C.work, W=WORKENG, P=PHOOK.work;
  var h=pageHook("work", t(P.h), t(P.lbl), "cases");

  /* 1. engineering, as stories */
  h+='<section class="band" id="cases"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(W.lbl))+'</div>'
    +'<h2 class="rv" style="margin-top:16px;max-width:18ch">'+esc(t(W.h))+'</h2>'
    +'<p class="deck rv" style="margin-top:18px">'+esc(t(W.d))+'</p>'
    +caseRows()+'</div></section>';

  /* 1b. every other project, filterable */
  var rest=CASES.filter(function(c){ return !c.featured; });
  if(rest.length)
    h+='<section class="band band--grey"><div class="wrap">'
      +'<div class="lbl rv">'+esc(t(CASEUI.gridlbl))+'</div>'
      +'<h2 class="rv" style="margin-top:16px;max-width:20ch">'+esc(t(CASEUI.gridh))+'</h2>'
      +projectGrid(rest,true)+'</div></section>';

  /* 2. the thermal clip, which can only be told without its client */
  var f=W.feat, fv=videoTag(f.vid,f.r,t(f.alt),"featvid");
  if(fv){
    h+='<section class="band band--dark"><div class="wrap"><div class="feat rv">'
      +'<div class="featmedia">'+fv+'</div>'
      +'<div class="feattext"><div class="lbl">'+esc(t(f.lbl))+'</div>'
      +'<h2>'+esc(t(f.h))+'</h2><p>'+esc(t(f.p))+'</p>'
      +'<dl class="featdl">';
    for(var q=0;q<f.dl.length;q++) h+='<dt>'+esc(t(f.dl[q].k))+'</dt><dd>'+esc(t(f.dl[q].v))+'</dd>';
    h+='</dl></div></div></div></section>';
  }

  /* 4. everything else from the workshop */
  var gitems=galleryItems();
  if(gitems.length)
    h+='<section class="band band--grey band--gal"><div class="wrap">'
      +'<div class="lbl rv">'+esc(t(GALLERY.lbl))+'</div>'
      +'<h2 class="rv" style="margin-top:16px;max-width:18ch">'+(lang==="nl"?"Meer uit de werkplaats":"More from the workshop")+'</h2>'
      +gallery(gitems)+'</div></section>';
  h+='<section class="band band--tight"><div class="wrap">'+ctaBlock(t(C.folio.next))+'</div></section>';
  return h;
}

/* Prices. Ranges, with the reasons they are ranges — see C.price in content.js. */
/* ---- web pricing ----------------------------------------------------------------
   Fixed packages, add-ons and Care plans, from C.price. The launch discount is computed
   here, not written into the copy, so changing pct or until in content.js is the only edit
   needed — and after `until` the page quietly goes back to list prices. */
/* Website packages and the discountable add-ons carry the October 2026 launch prices as
   their list prices: C.price.web.pct below the calculated rate, shown plainly, with no
   badge and nothing struck through. */
function webPrice(n){ var w=C.price.web; return (w&&w.pct) ? Math.round(n*(100-w.pct)/100) : n; }
function money(n){
  var s=String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang==="nl"?".":",");
  return "€"+s;
}
function priceTag(v,from,web){
  var fromTxt = from ? '<span class="pfrom">'+(lang==="nl"?"vanaf ":"from ")+'</span>' : '';
  return fromTxt+'<b>'+money(web?webPrice(v):v)+'</b>';
}
function pkgCards(){
  var d=C.price,h='<div class="pkgs rv">';
  for(var i=0;i<d.pkgs.length;i++){
    var k=d.pkgs[i], items=lang==="nl"?k.d.nl:k.d.en, li="";
    for(var j=0;j<items.length;j++) li+='<li>'+esc(items[j])+'</li>';
    h+='<div class="pkg"><h3>'+esc(k.n)+'</h3><ul>'+li+'</ul>'
      +'<div class="pkg-p">'+priceTag(price(k.c,k.x),k.from,true)+'</div></div>';
  }
  return h+'</div>';
}
/* The preview that sits on the Software & web page: the three packages and a way through
   to the full page. Nothing if the pricing page is switched off. */
function pricePreview(){
  if(hidden("price")) return "";
  var d=C.price;
  return '<div class="pricepre"><h2 class="rv">'+esc(t(d.pkgh))+'</h2>'+pkgCards()
    +'<p class="onreq rv" style="margin-top:22px">'+go("price",' class="inlink" data-umami-event="price-preview-click"')
    +esc(t(d.previewmore))+' &rarr;</a></p></div>';
}
function careTable(c){
  var  h='<div class="tblwrap rv"><table class="care"><thead><tr><th scope="col"><span class="sr">'
    +(lang==="nl"?"Onderdeel":"Item")+'</span></th>';
  for(var i=0;i<c.tiers.length;i++) h+='<th scope="col">'+esc(c.tiers[i])+'</th>';
  h+='</tr></thead><tbody>';
  for(var r=0;r<c.rows.length;r++){
    var row=c.rows[r]; h+='<tr><th scope="row">'+esc(t(row.k))+'</th>';
    for(var j=0;j<row.v.length;j++){
      var v=row.v[j], cell;
      if(v===true) cell='<span aria-hidden="true">✓</span><span class="sr">'+(lang==="nl"?"ja":"yes")+'</span>';
      else if(v===false) cell='<span aria-hidden="true">—</span><span class="sr">'+(lang==="nl"?"nee":"no")+'</span>';
      else if(row.money) cell='<b>'+money(v)+'</b>';
      else cell=esc(t(v));
      h+='<td data-t="'+esc(c.tiers[j])+'">'+cell+'</td>';
    }
    h+='</tr>';
  }
  return h+'</tbody></table></div>';
}
function addRows(){
  var d=C.price,h='<div class="prices rv">';
  for(var i=0;i<d.adds.length;i++){
    var a=d.adds[i], parts=[];
    if(a.rate){
      parts.push('<b>'+money(C.price.rate[a.rate])+'</b>');
    } else for(var j=0;j<a.hrs.length;j++)
      parts.push(priceTag(price(a.hrs[j][0],a.hrs[j][1]),false,a.disc)
        +(a.of?' <span class="pfrom">('+esc((lang==="nl"?a.of.nl:a.of.en)[j])+')</span>':''));
    h+='<div class="prow"><div class="pn">'+esc(t(a.n))+'</div><div class="pd"></div>'
      +'<div class="pv">'+parts.join('<br>')+(a.unit?' <span class="pfrom">'+esc(t(a.unit))+'</span>':'')+'</div></div>';
  }
  return h+'</div>';
}
/* Name, one line of description, one price. `money` when the row carries a number,
   otherwise whatever string the row gives (ranges, "hardware at cost + …"). */
function priceRows(rows){
  var h='<div class="prices rv">';
  for(var i=0;i<rows.length;i++){
    var r=rows[i], v=(r.c!==undefined)
      ? (r.from?'<span class="pfrom">'+(lang==="nl"?"vanaf ":"from ")+'</span>':'')+'<b>'+money(price(r.c,r.x))+'</b>'
      : '<b>'+esc(t(r.v))+'</b>';
    h+='<div class="prow"><div class="pn">'+esc(t(r.n))+'</div>'
      +'<div class="pd">'+(r.d?esc(t(r.d)):'')+'</div>'
      +'<div class="pv">'+v+'</div></div>';
  }
  return h+'</div>';
}
/* Example projects per domain. The price is computed from the hours and the two rates in
   C.price.rate, never typed into the copy, so changing what an hour costs re-prices the
   whole catalogue at once. Rounded to ten euros. */
function price(c,x){
  var R=C.price.rate, h=R.hoursPerDay, f=R.learn||1;
  return Math.round(((c||0)*h*R.concept + (x||0)*h*R.exec)*f/10)*10;
}
function domPrice(it){ return price(it.c,it.x); }
/* What a client needs is a date, not our estimating arithmetic: concept and execution days
   exist to compute the price and stay off the page. This turns the total into a calendar
   band that runs from the first conversation to the finished part. */
function leadOf(it){
  var tot=((it.c||0)+(it.x||0))*(C.price.rate.learn||1), b=C.price.lead;
  for(var i=0;i<b.length;i++) if(tot<=b[i].d) return t(b[i]);
  return t(b[b.length-1]);
}
function domRows(items,showLead){
  var cols=(lang==="nl"?C.price.domcols.nl:C.price.domcols.en), h="";
  for(var i=0;i<items.length;i++){
    var it=items[i];
    h+='<div class="prow prow--dom"><div class="pn">'+esc(t(it.n))+'</div>'
      +(showLead?'<div class="pd">'+esc(cols[1])+': '+esc(leadOf(it))+'</div>':'')
      +'<div class="pv"><b>'+money(domPrice(it))+'</b>'
      +(it.parts?' <span class="pfrom">'+(lang==="nl"?"+ materiaal":"+ parts")+'</span>':'')
      +'</div></div>';
  }
  return h;
}
/* ---- Tarieven as one menu -------------------------------------------------------------
   Every block on the page is a labelled button that opens a panel over what sits below it,
   so the page stays one screen long whatever is open. A price in the button means the
   entry is one product; no price means the panel holds a table or a list of rows. */
/* The reveal animation only fires for elements an observer has seen, and a closed panel is
   never seen — inside a panel the markup has to be visible from the start. */
function bare(h){ return h.replace(/ rv(?=")/g,""); }
function menuItem(label,priceHtml,body,wide){
  return '<details class="fold fold--dom'+(wide?" fold--full":"")+'">'
    +'<summary><span class="mn">'+esc(label)+'</span>'
    +(priceHtml?'<span class="mp">'+priceHtml+'</span>':'')+'</summary>'
    +'<div class="prices--fold">'+bare(body)+'</div></details>';
}
function menuGrid(items){ return '<div class="domgrid rv">'+items.join("")+'</div>'; }
/* One row inside a panel: what it is, one grey line under it, the price on the right. The
   same three parts whether the row is a website package or a machine frame. */
function rowLine(name,sub,priceHtml){
  return '<div class="prow prow--dom"><div class="pn">'+esc(name)+'</div>'
    +(sub?'<div class="pd">'+esc(sub)+'</div>':'')
    +'<div class="pv">'+priceHtml+'</div></div>';
}
function fromTag(v){
  return '<span class="pfrom">'+(lang==="nl"?"vanaf ":"from ")+'</span><b>'+money(v)+'</b>';
}
/* Websites: the three packages, then the add-ons under a divider. */
function webPanel(){
  var d=C.price,h="";
  for(var i=0;i<d.pkgs.length;i++){
    var k=d.pkgs[i], items=(lang==="nl"?k.d.nl:k.d.en);
    h+=rowLine(k.n, items.join(" \u00b7 "), priceTag(price(k.c,k.x),k.from,true));
  }
  h+='<div class="psub">'+esc(t(d.addh))+'</div>'+bare(addRows());
  /* Care belongs to what it cares for: the website plan lives inside the website fold. */
  return h+'<div class="psub">'+esc(t(d.careh))+'</div>'
    +'<p class="pnote">'+esc(t(d.cared))+'</p>'+careTable(d.care);
}
/* Industry: the fixed studies, then what the plant prices itself. */
function indPanel(){
  var d=C.price,h="";
  for(var i=0;i<d.ind.length;i++){
    var r=d.ind[i];
    h+=rowLine(t(r.n), t(r.d), (r.from?fromTag(price(r.c,r.x)):'<b>'+money(price(r.c,r.x))+'</b>'));
  }
  h+='<div class="psub">'+esc(t(d.indqh))+'</div>'+bare(priceRows(d.indq));
  return h+'<div class="psub">'+esc(t(d.mcareh))+'</div>'
    +'<p class="pnote">'+esc(t(d.mcared))+'</p>'+careTable(d.mcare);
}
/* Cheapest thing behind a button, so the menu answers the page's own question without
   anything being opened. */
function domMin(items){
  var m=0;
  for(var i=0;i<items.length;i++){ var v=domPrice(items[i]); if(!m||v<m) m=v; }
  return m;
}
/* The page is one menu: websites, industry, and every engineering field, all the same
   kind of button. */
function mainMenu(){
  var d=C.price, out=[], i;
  var webMin=0;
  for(i=0;i<d.pkgs.length;i++){ var v=price(d.pkgs[i].c,d.pkgs[i].x); if(!webMin||v<webMin) webMin=v; }
  out.push(menuItem(t(d.pkgh), fromTag(webPrice(webMin)), webPanel(), true));
  var indMin=0;
  for(i=0;i<d.ind.length;i++){ var w=price(d.ind[i].c,d.ind[i].x); if(!indMin||w<indMin) indMin=w; }
  out.push(menuItem(t(d.indh), fromTag(indMin), indPanel(), true));
  for(i=0;i<d.domains.length;i++)
    out.push(menuItem(domTitle(d.domains[i].key), fromTag(domMin(d.domains[i].items)),
             domRows(d.domains[i].items,true)));
  return menuGrid(out);
}
function domTitle(key){
  for(var j=0;j<DISCIPLINES.items.length;j++)
    if(DISCIPLINES.items[j].ic===key) return t(DISCIPLINES.items[j].t);
  return key;
}
/* The fold on the Prototyping page: a native <details>, so it works without JavaScript
   and a keyboard reaches it for free. Open, the panel is positioned over whatever sits
   below it rather than growing the card, so the grid never reflows. */
function domFold(key){
  var d=C.price, dom=null;
  if(hidden("price")) return "";
  for(var i=0;i<d.domains.length;i++) if(d.domains[i].key===key) dom=d.domains[i];
  if(!dom) return "";
  return '<details class="fold"><summary>'+(lang==="nl"?"Prijzen":"Prices")+'</summary>'
    +'<div class="prices prices--fold">'+domRows(dom.items,false)+'</div></details>';
}
/* Tarieven: twelve fields as a collapsible menu instead of twelve stacked tables. Closed
   it is one screen; opened, the panel floats over the block beneath it, so the section
   keeps its height whatever is open. */
function renderPrice(){
  var d=C.price,h="";
  h+='<section class="opener">'+watermark("price")+'<div class="narrow"><div class="lbl">'
    +(lang==="nl"?"Tarieven":"Pricing")+'</div><h1>'+esc(t(d.lede))+'</h1></div></section>';
  h+='<section class="band band--tight"><div class="narrow">'
    +'<p class="deck" style="max-width:none">'+esc(t(d.intro))+'</p></div></section>';

  h+='<section class="band band--grey">'+bandMark("gears","part")+'<div class="wrap">'
    +'<h2 class="rv">'+esc(t(d.domh))+'</h2>'
    +'<p class="deck rv" style="margin-top:18px">'+esc(t(d.domd))+'</p>'
    +mainMenu()
    +'<p class="onreq rv">'+esc(t(d.domnote))+'</p>'
    +'<p class="onreq rv">'+esc(t(d.vat))+'</p>'
    +'</div></section>';
  h+=flowSplit(6,"var(--paper2)","var(--paper)",5);
  h+='<section class="band">'+bandMark("valve","rule")+'<div class="wrap">'
    +'<h2 class="rv">'+esc(t(d.fixh))+'</h2>'
    +stepList(d.fix,["web","elec","data","dfm"])
    +ctaBlock(lang==="nl"?"Stuur uw vraag in twee zinnen."
                        :"Send your question in two sentences.")+'</div></section>';
  return h;
}

function renderPrivacy(){
  var d=C.privacy,h="";
  h+='<section class="opener">'+watermark("contact")+'<div class="narrow"><div class="lbl">'
    +(lang==="nl"?"Privacyverklaring":"Privacy statement")+'</div><h1>'+esc(t(d.lede))+'</h1>'
    +'<p class="deck">'+esc(t(d.intro))+'</p></div></section>';
  h+='<section class="band band--tight"><div class="narrow">';
  for(var i=0;i<d.secs.length;i++)
    h+='<h2 style="font-size:clamp(22px,2.6vw,30px);margin-top:'+(i?"54px":"0")+'">'
      +esc(t(d.secs[i].h))+'</h2><p class="deck" style="max-width:none;margin-top:14px">'
      +esc(t(d.secs[i].p))+'</p>';
  h+='<p class="onreq">'+esc(t(d.updated))+'</p></div></section>';
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
    if(FORM_ENDPOINT==="netlify"){
      /* Netlify Forms: the hidden form in the page shell registers the fields at deploy;
         submissions are urlencoded posts to any page on the site with form-name set. */
      var nd=new FormData(f); nd.append("form-name","contact"); nd.append("_language",lang);
      fetch(location.pathname,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body:new URLSearchParams(nd).toString()})
        .then(function(r){ if(!r.ok) throw new Error(r.status);
          f.reset(); stat.className="formstat is-ok"; stat.textContent=t(d.ok); track("contact-form-sent",{page:page,lang:lang}); })
        .catch(function(){ var link=mailtoLink(get("ty"),body);
          stat.className="formstat is-bad";
          stat.innerHTML=esc(t(d.fail))+' <a href="'+link+'">'+(lang==="nl"?"Open mijn mailprogramma":"Open my mail app")+'</a>'; })
        .then(function(){ btn.disabled=false; });
      return;
    }
    var data=new FormData(f);
    if(typeof FORM_KEY==="string" && FORM_KEY) data.append("access_key",FORM_KEY);
    data.append("subject","Liminex \u2014 "+(get("ty")||"website"));   /* Web3Forms */
    data.append("_subject","Liminex \u2014 "+(get("ty")||"website"));  /* FormSubmit */
    data.append("from_name","Liminex website");
    data.append("_language",lang);
    fetch(FORM_ENDPOINT,{method:"POST",body:data,headers:{"Accept":"application/json"}})
      .then(function(r){ if(!r.ok) throw new Error(r.status);
        f.reset(); stat.className="formstat is-ok"; stat.textContent=t(d.ok); track("contact-form-sent",{page:page,lang:lang}); })
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
/* Silent loops play only while at least a third of them is on screen, so a page with a
   dozen clips decodes one or two at a time. Reduced motion: nothing autoplays; gallery
   clips get controls so they can still be watched, the hero keeps its poster. */
var vio=null;
function setupVideos(){
  var vids=app.querySelectorAll("video[data-auto]");
  if(vio){ vio.disconnect(); vio=null; }
  if(!vids.length) return;
  var still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(still || !("IntersectionObserver" in window)){
    for(var i=0;i<vids.length;i++){
      vids[i].removeAttribute("autoplay");
      if(!vids[i].hasAttribute("data-hero") && still) vids[i].setAttribute("controls","");
      else if(!still) { var pr=vids[i].play(); if(pr&&pr.catch) pr.catch(function(){}); }
    }
    return;
  }
  vio=new IntersectionObserver(function(en){
    en.forEach(function(e){
      var v=e.target;
      if(e.isIntersecting){ var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){}); }
      else v.pause();
    });
  },{threshold:0.33});
  for(var j=0;j<vids.length;j++) vio.observe(vids[j]);
}
function render(moveFocus){
  var h;
  if(page==="home") h=renderHome();
  else if(page==="about") h=renderAbout();
  else if(page==="work") h=renderWork();
  else if(page==="price") h=renderPrice();
  else if(page==="contact") h=renderContact();
  else if(page==="privacy") h=renderPrivacy();
  else h=renderArea(page);
  app.innerHTML=h;
  app.className="page-"+page;
  waitForPictures();      /* lets one page carry its own palette — see Project Yard */
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
  var target = !moveFocus && location.hash && document.getElementById(location.hash.slice(1));
  if(target) setTimeout(function(){ target.scrollIntoView(); }, 0); else window.scrollTo(0,0);
  setupReveal();
  setupFly();
  setupForm();
  setupVideos();
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
  var pc=e.target.closest(".pchip");
  if(pc){
    var bar=pc.parentNode, grid=document.getElementById(bar.getAttribute("data-grid")), cat=pc.getAttribute("data-cat");
    var chips=bar.querySelectorAll(".pchip");
    for(var ci=0;ci<chips.length;ci++) chips[ci].setAttribute("aria-pressed", String(chips[ci]===pc));
    if(grid){ var cards=grid.querySelectorAll(".pcard");
      for(var cj=0;cj<cards.length;cj++){ cards[cj].hidden = !(cat==="all" || cards[cj].getAttribute("data-cat")===cat); cards[cj].classList.add("in"); } }
    return;
  }
  var gb=e.target.closest("[data-gal]");
  if(gb){
    var g=document.getElementById(gb.getAttribute("data-gal"));
    if(g){
      var cell=g.querySelector(".gcell"), step=cell ? cell.getBoundingClientRect().width+18 : 320;
      g.scrollBy({left:Number(gb.getAttribute("data-dir"))*Math.max(step, g.clientWidth*0.7),
                  behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
    }
    return;
  }
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
/* The price panels float over what sits beneath them instead of stretching the page, so
   only one may be open at a time and the card it escapes needs to win the stacking order.
   `toggle` does not bubble — hence the capture phase. */
document.addEventListener("toggle",function(e){
  var d=e.target;
  if(!d||!d.classList||!d.classList.contains("fold")) return;
  if(d.open){
    var all=document.querySelectorAll("details.fold[open]");
    for(var i=0;i<all.length;i++) if(all[i]!==d) all[i].open=false;
  }
  if(!d.classList.contains("fold--dom")){
    var host=d.parentNode;
    if(host&&host.classList) host.classList.toggle("fold-open", d.open);
  }
},true);
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
/* After a client-side page switch the new pictures are usually cached already; if not,
   hold the reveal until they have decoded (capped at 1.2 s) so nothing pops in late. */
function waitForPictures(){
  var imgs=app.querySelectorAll("img"), pending=[];
  for(var i=0;i<imgs.length;i++) if(!imgs[i].complete && imgs[i].decode && imgs[i].loading!=="lazy") pending.push(imgs[i].decode().catch(function(){}));
  if(!pending.length) return;
  app.classList.add("is-waiting");
  var done=false, fin=function(){ if(done) return; done=true; app.classList.remove("is-waiting"); setupReveal(); };
  Promise.all(pending).then(fin); setTimeout(fin,1200);
}
/* ---------------- loading screen ----------------
   Every render on the site is fetched before the page is shown, so nothing pops in
   while you read. Runs once per browser session; later pages find everything cached.
   The overlay is in the HTML shell so it is visible before this script runs. */
function preloadAll(done){
  var urls=[];
  if(typeof RENDERS!=="undefined") for(var k in RENDERS) urls.push(renderSrc(k));
  if(typeof WORKSHOTS!=="undefined") for(var w in WORKSHOTS) urls.push(WORKSHOTS[w]);
  if(typeof LOGO_HERO!=="undefined") urls.push(LOGO_HERO);
  var seen={}, list=[];
  for(var i=0;i<urls.length;i++) if(urls[i] && !seen[urls[i]]){ seen[urls[i]]=1; list.push(urls[i]); }
  var left=list.length, finished=false;
  function one(){ if(--left<=0 && !finished){ finished=true; done(); } }
  if(!left){ done(); return; }
  for(var j=0;j<list.length;j++){ var im=new Image(); im.onload=one; im.onerror=one; im.src=list[j]; }
  setTimeout(function(){ if(!finished){ finished=true; done(); } }, 9000);   /* never hang */
}
function liftCurtain(){
  var l=document.getElementById("loader"); if(!l) return;
  l.classList.add("is-done");
  document.body.classList.remove("loading");
  setTimeout(function(){ if(l.parentNode) l.parentNode.removeChild(l); }, 650);
}
if(typeof BOOT!=="undefined"){ page=BOOT.page; lang=BOOT.lang; }
render(false);
(function(){
  var l=document.getElementById("loader"), first=true;
  try{ first = !sessionStorage.getItem("liminex-loaded"); }catch(e){}
  if(!l){ return; }
  /* The page is never held behind the loader any more: the first six seconds are the
     ones that decide whether someone stays. The renders are still fetched, in the
     background, so the next page has them cached. */
  liftCurtain();
  if(first) preloadAll(function(){ try{ sessionStorage.setItem("liminex-loaded","1"); }catch(e){} });
})();
