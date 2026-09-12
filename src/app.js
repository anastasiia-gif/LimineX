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
  document.getElementById("foot-tag").textContent=t(C.home.tagline);
}
function svcList(list,heading){
  var h=(heading?'<h2>'+esc(heading)+'</h2>':'')+'<div class="svcs">';
  for(var i=0;i<list.length;i++)
    h+='<div class="svc"><h3>'+esc(t(list[i].n))+'</h3><p>'+esc(t(list[i].d))+'</p></div>';
  return h+'</div><p class="onreq">'
    +(lang==="nl"?"Elk project is anders, dus dit is geen prijslijst. Wat vergelijkbaar werk ongeveer kost staat bij "
                 :"Every project is different, so this isn't a price list. What comparable work roughly costs is on ")
    +'<button class="inlink" data-go="price">'+(lang==="nl"?"tarieven":"pricing")+'</button>'
    +(lang==="nl"?". Na één gesprek krijgt u een vaste prijs op één pagina."
                 :". After one conversation you get a fixed price on one page.")+'</p>';
}
function stepList(list){
  var h='<div class="steps">';
  for(var i=0;i<list.length;i++)
    h+='<div class="step"><div class="no">'+no(i+1)+'</div><div><h3>'+esc(t(list[i].h))
      +'</h3><p>'+esc(t(list[i].p))+'</p></div></div>';
  return h+'</div>';
}
function cardRow(list){
  var h='<div class="grid4">';
  for(var i=0;i<list.length;i++)
    h+='<div><h3>'+esc(t(list[i].h))+'</h3><p>'+esc(t(list[i].p))+'</p></div>';
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
/* a sheet of engineering drawings, used as the page's own machinery */
var PLATES={
  proto:{ h:{nl:"Wat er op de bank ligt",en:"What's on the bench"},
    items:[
      {k:"drone", t:{nl:"Drone-frame, bovenaanzicht",en:"Drone frame, top view"}, n:"LMX-PR-014"},
      {k:"valve", t:{nl:"Klep, doorsnede",en:"Valve, section"}, n:"LMX-PR-031"},
      {k:"part",  t:{nl:"Beugel, gefreesd",en:"Bracket, machined"}, n:"LMX-PR-047"}
    ]},
  make:{ h:{nl:"De machines die het werk doen",en:"The machines that do the work"},
    items:[
      {k:"printer",t:{nl:"FDM-printer",en:"FDM printer"}, n:"3D-PRINT"},
      {k:"laser",  t:{nl:"Lasersnijder",en:"Laser cutter"}, n:"LASER"},
      {k:"cnc",    t:{nl:"CNC-frees",en:"CNC mill"}, n:"CNC"}
    ]}
};
function plate(id){
  var p=PLATES[id]; if(!p) return "";
  var h='<h2 class="rv">'+esc(t(p.h))+'</h2><div class="plate rv"><div class="sheet">';
  for(var i=0;i<p.items.length;i++){
    var it=p.items[i];
    h+='<div class="cell">'+DRAW[it.k]
      +'<div class="cap"><span>'+esc(t(it.t))+'</span><span>'+esc(it.n)+'</span></div></div>';
  }
  h+='</div><div class="tb"><span>Liminex &middot; \'s-Hertogenbosch</span>'
    +'<span>'+(lang==="nl"?"Schaal":"Scale")+' <b>'+(lang==="nl"?"niet op schaal":"not to scale")+'</b></span>'
    +'<span>'+(lang==="nl"?"Aanzicht":"View")+' <b>'+(lang==="nl"?"Eerste hoek":"First angle")+'</b></span>'
    +'<span>'+(lang==="nl"?"Illustratief \u2014 geen productietekening"
                          :"Illustrative \u2014 not a production drawing")+'</span></div></div>';
  return h;
}
function watermark(kind){
  return '<div class="wmark" aria-hidden="true">'+DRAW[kind]+'</div>';
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
function expBlock(withNext, area){
  var items=expItems(area);
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
  h+='<h3 class="rv" style="margin-top:64px">'+(lang==="nl"?"Sites die live staan":"Sites that are live")+'</h3>';
  h+=folioCards();
  if(withNext) h+='<p class="deck rv" style="margin-top:30px">'+esc(t(C.folio.nextp))+'</p>';
  return h;
}
function ctaBlock(head){
  return '<div class="cta"><h2>'+esc(head)+'</h2>'
    +go("contact",' class="btn"')+esc(t(C.home.ctab))+'</a></div>';
}

function renderHome(){
  var d=C.home,h="";
  h+='<div class="opening"><section class="overture">'
    +'<div class="curves" aria-hidden="true">'+overtureCurves()+'</div>'
    +'<h1 class="logo"><img src="'+LOGO_HERO+'" alt="Liminex — Make non-existent reality"></h1>'
    +'<span class="scrollcue" aria-hidden="true">'+esc(t(d.scroll))+'</span></section></div>';

  h+='<section class="band band--grey"><div class="wrap center">'
    +'<div class="lbl rv">'+esc(t(d.blocksh))+'</div>'
    +'<h2 class="rv" style="margin-top:18px">'+esc(t(d.blocksd))+'</h2></div>'
    +'<div class="wrap"><div class="blocks">';
  for(var i=0;i<AREAS.length;i++){
    var a=AREAS[i];
    h+=go(a.id,' class="block rv"')+GLYPH[a.glyph]
      +'<span class="txt"><h3>'+esc(aName(a))+'</h3><p>'+esc(t(d.blurbs[a.id]))+'</p></span>'
      +'<span class="more">'+esc(t(d.more))+' &rarr;</span></a>';
  }
  h+='</div></div></section>';

  h+=flowSplit(1,"var(--paper2)","var(--paper)",5);

  h+='<section class="band band--tight"><div class="wrap center">'
    +'<div class="lbl rv">'+esc(t(d.teamh))+'</div>'
    +'<h2 class="rv" style="margin-top:18px;max-width:20ch;margin-left:auto;margin-right:auto">'
    +esc(t(d.teamd))+'</h2></div><div class="wrap"><div class="team rv">';
  for(var m=0;m<d.team.length;m++)
    h+='<div class="p">'+ph(t(d.team[m].n),lang==="nl"?"Portret · 4:5":"Portrait · 4:5")
      +'<div class="nm">'+esc(t(d.team[m].n))+'</div>'
      +'<div class="ro">'+esc(t(d.team[m].r))+'</div></div>';
  h+='</div><div class="twolinks rv">'
    +'<button class="btn" data-go="about">'+esc(t(d.teamabout))+'</button>'
    +'<button class="btn btn--ghost" data-go="work">'+esc(t(d.teamwork))+'</button>'
    +'</div></div></section>';

  h+='<section class="band band--dark"><div class="wrap">'
    +'<div class="lbl rv">'+esc(t(d.whoh))+'</div>'
    +'<h2 class="rv" style="margin-top:20px;max-width:19ch">'+esc(t(d.whoq))+'</h2>'
    +'<div class="phrow rv">'+ph(t(d.photo1),t(d.photo1s))+ph(t(d.photo2),t(d.photo2s))+'</div>'
    +'<div class="rv" style="margin-top:56px;max-width:64ch"><p class="muted">'
    +esc(t(d.whop)).split("\n\n").join('</p><p class="muted">')+'</p></div><div class="stats rv">';
  for(var s=0;s<d.stats.length;s++)
    h+='<div><div class="n">'+esc(d.stats[s].n)+'</div><div class="k">'+esc(t(d.stats[s].k))+'</div></div>';
  h+='</div></div></section>';

  /* Clients & partners strip: removed until there are logos we have permission to show.
     The copy for it still lives in C.home.clientsh / clientsd / logos. */
  h+=flowSplit(2,"var(--paper)","var(--paper2)",4);
  h+='<section class="band band--grey"><div class="wrap">'+ctaBlock(t(d.ctah))+'</div></section>';
  return h;
}

/* ---------------- about ---------------- */
function renderAbout(){
  var d=C.about,hm=C.home,h="";
  h+='<section class="opener"><div class="narrow"><div class="lbl">'+esc(t(hm.teamabout))+'</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';
  h+='<section class="band band--tight"><div class="wrap"><div class="team rv">';
  for(var m=0;m<hm.team.length;m++)
    h+='<div class="p">'+ph(t(hm.team[m].n),lang==="nl"?"Portret · 4:5":"Portrait · 4:5")
      +'<div class="nm">'+esc(t(hm.team[m].n))+'</div>'
      +'<div class="ro">'+esc(t(hm.team[m].r))+'</div></div>';
  h+='</div></div></section>';
  h+=flowSplit(7,"var(--paper)","var(--paper2)",5);
  h+='<section class="band band--grey"><div class="narrow"><h2>'+esc(t(d.storyh))+'</h2>'
    +'<div style="margin-top:24px"><p class="deck" style="max-width:none">'
    +esc(t(hm.whop)).split("\n\n").join('</p><p class="deck" style="max-width:none">')+'</p></div></div>'
    +'<div class="wrap"><div class="phrow rv" style="margin-top:56px">'
    +ph(t(hm.photo1),t(hm.photo1s))+ph(t(hm.photo2),t(hm.photo2s))+'</div></div></section>';
  h+='<section class="band"><div class="wrap"><h2 class="rv">'+esc(t(d.wayh))+'</h2>'
    +'<div class="rv">'+cardRow(d.way)+'</div>'
    +'<h2 class="rv" style="margin-top:88px">'+esc(t(d.kith))+'</h2>'
    +'<div class="rv">'+cardRow(d.kit)+'</div></div></section>';
  h+='<section class="band band--dark"><div class="wrap"><div class="stats rv" style="margin-top:0">';
  for(var st=0;st<hm.stats.length;st++)
    h+='<div><div class="n">'+esc(hm.stats[st].n)+'</div><div class="k">'+esc(t(hm.stats[st].k))+'</div></div>';
  h+='</div></div></section>';
  h+='<section class="band band--tight"><div class="wrap">'+expBlock(true)
    +ctaBlock(t(hm.ctah))+'</div></section>';
  return h;
}

/* IT & Web reads as an exhibition of what has been delivered */
function renderWeb(){
  var d=C.web,h="";

  /* 1. opener */
  h+='<section class="opener"><div class="narrow"><div class="lbl">IT &amp; Web</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';

  /* 2. what we do — the main content, first on the page */
  h+='<section class="band band--tight"><div class="narrow">'
    +'<p class="deck" style="max-width:none">'+esc(t(d.intro))+'</p></div>'
    +'<div class="wrap">'+svcList(d.svcs,lang==="nl"?"Wat we doen":"What we do")+'</div></section>';

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
  h+='<section class="band"><div class="wrap">'
    +'<h2>'+(lang==="nl"?"Hoe het gaat":"How it goes")+'</h2>'+stepList(d.steps)
    +'</div></section>';
  h+='<section class="band band--tight"><div class="wrap">'+expBlock(true,"web")
    +ctaBlock(lang==="nl"?"Zullen we hier een half uur over praten?":"Shall we spend half an hour on this?")
    +'</div></section>';
  return h;
}

/* Project Yard reads as a set of posters */
function renderYard(){
  var d=C.yard,h="";
  h+='<section class="opener"><div class="narrow"><div class="lbl">Project Yard</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';
  h+='<section class="band band--tight"><div class="wrap">'
    +'<div class="lbl lbl--q rv">'+esc(t(d.postersh))+'</div><div class="posters">';
  for(var i=0;i<d.posters.length;i++){
    var p=d.posters[i];
    h+='<div class="poster '+p.c+' rv"><div class="fig">'+esc(p.fig)+'</div>'
      +'<div><p class="say">'+esc(t(p.say))+'</p><p class="src">'+esc(t(p.src))+'</p></div></div>';
  }
  h+='</div></div></section>';
  h+=flowSplit(4,"var(--paper)","var(--paper)",5);
  h+='<section class="band band--tight"><div class="narrow">'
    +'<h2>'+esc(t(d.introh))+'</h2><p class="deck" style="max-width:none;margin-top:24px">'
    +esc(t(d.intro))+'</p></div><div class="wrap">'+cardRow(d.cards)+'</div></section>';
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
  h+='<section class="band band--tight"><div class="wrap">'+expBlock(true,"yard")
    +ctaBlock(lang==="nl"?"Zullen we hier een half uur over praten?":"Shall we spend half an hour on this?")
    +'</div></section>';
  return h;
}

function renderArea(id){
  if(id==="web") return renderWeb();
  if(id==="yard") return renderYard();
  var a=area(id),d=C[id],h="";
  var WM={proto:"part",make:"cnc",start:"drone"};
  h+='<section class="opener">'+(WM[id]?watermark(WM[id]):"")
    +'<div class="narrow"><div class="lbl">'+esc(aName(a))+'</div>'
    +'<h1>'+esc(t(d.lede))+'</h1></div></section>';
  h+=flowSplit(5,"var(--paper)","var(--paper)",5);
  h+='<section class="band band--tight"><div class="narrow">'
    +'<p class="deck" style="max-width:none">'+esc(t(d.intro))+'</p></div>';
  if(d.svcs) h+='<div class="wrap">'+svcList(d.svcs,lang==="nl"?"Wat we doen":"What we do")+'</div>';
  h+='</section>';
  if(PLATES[id]) h+='<section class="band band--tight"><div class="wrap">'+plate(id)+'</div></section>';
  if(d.cards) h+='<section class="band band--grey"><div class="wrap">'
    +(d.cardsh?'<h2 class="rv">'+esc(t(d.cardsh))+'</h2>':'')+'<div class="rv">'+cardRow(d.cards)+'</div></div></section>';
  h+='<section class="band"><div class="wrap">';
  if(d.steps) h+='<h2>'+(lang==="nl"?"Hoe het gaat":"How it goes")+'</h2>'+stepList(d.steps);
  if(d.note) h+='<div class="marginnote"><h3>'+esc(t(d.noteh))+'</h3><p>'+esc(t(d.note))+'</p></div>';
  h+='</div></section>';
  h+='<section class="band band--tight"><div class="wrap">'+expBlock(true,id)
    +ctaBlock(lang==="nl"?"Zullen we hier een half uur over praten?":"Shall we spend half an hour on this?")
    +'</div></section>';
  return h;
}

function renderWork(){
  var d=C.work;
  var h='<section class="opener"><div class="narrow"><div class="lbl">Portfolio</div>'
    +'<h1>'+(lang==="nl"?"Werk":"Work")+'</h1><p class="deck">'+esc(t(d.lede))+'</p></div></section>';
  h+=flowSplit(6,"var(--paper)","var(--paper)",5);
  h+='<section class="band band--tight"><div class="wrap">';
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
  h+='<section class="opener"><div class="narrow"><div class="lbl">'
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
  h+='<section class="band"><div class="wrap"><h2 class="rv">'+esc(t(d.whyh))+'</h2>'
    +'<div class="rv">'+cardRow(d.why)+'</div>'
    +'<h2 class="rv" style="margin-top:96px">'+esc(t(d.fixh))+'</h2>'+stepList(d.fix)
    +'<div class="marginnote"><h3>'+esc(t(d.noteh))+'</h3><p>'+esc(t(d.note))+'</p></div>'
    +ctaBlock(lang==="nl"?"Stuur uw vraag in twee zinnen."
                        :"Send your question in two sentences.")+'</div></section>';
  return h;
}

function renderContact(){
  var d=C.contact,opts=lang==="nl"?d.types.nl:d.types.en,o="";
  for(var i=0;i<opts.length;i++) o+='<option>'+esc(opts[i])+'</option>';
  var h='<section class="opener"><div class="narrow"><div class="lbl">'
    +(lang==="nl"?"Neem contact op":"Get in touch")+'</div><h1>Contact</h1>'
    +'<p class="deck">'+esc(t(d.lede))+'</p></div></section>';
  h+='<section class="band band--tight"><div class="narrow"><form onsubmit="return false;">'
    +'<div class="field"><label for="f-name">'+esc(t(d.fields.name))+'</label><input id="f-name" type="text" autocomplete="name"></div>'
    +'<div class="field"><label for="f-co">'+esc(t(d.fields.company))+'</label><input id="f-co" type="text" autocomplete="organization"></div>'
    +'<div class="field"><label for="f-em">'+esc(t(d.fields.email))+'</label><input id="f-em" type="email" autocomplete="email"></div>'
    +'<div class="field"><label for="f-ty">'+esc(t(d.fields.type))+'</label><select id="f-ty">'+o+'</select></div>'
    +'<div class="field"><label for="f-ms">'+esc(t(d.fields.msg))+'</label><textarea id="f-ms"></textarea></div>'
    +'<button class="btn" type="submit" style="justify-self:start">'+esc(t(d.fields.send))+'</button>'
    +'<p class="formnote">'+esc(t(d.formnote))+'</p></form><div class="details">';
  for(var j=0;j<d.details.length;j++)
    h+='<div><div class="k">'+esc(t(d.details[j].k))+'</div><div>'+esc(t(d.details[j].v))+'</div></div>';
  h+='</div></div></section>';
  h+='<section class="band band--tight"><div class="wrap">'+expBlock(false)+'</div></section>';
  return h;
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
function render(moveFocus){
  var h;
  if(page==="home") h=renderHome();
  else if(page==="about") h=renderAbout();
  else if(page==="work") h=renderWork();
  else if(page==="price") h=renderPrice();
  else if(page==="contact") h=renderContact();
  else h=renderArea(page);
  app.innerHTML=h;
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
