/* ============================================================ CURVES & MARKS ============================================================ */
function grad(id){
  return '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="0">'
    +'<stop offset="0%" stop-color="#2349B2"/><stop offset="45%" stop-color="#2440E0"/>'
    +'<stop offset="100%" stop-color="#5C23B2"/></linearGradient></defs>';
}
/* long flowing lines — the page's only ornament */
/* a divider where the two backgrounds meet along the wave, with hairlines following it */
function wavePath(o){
  var a=112+o, b=150-o*0.55, c=96+o*0.9;
  return "M0,"+a+" C220,"+(a-52)+" 400,"+(b+50)+" 620,"+b+" S1000,"+(c-46)+" 1200,"+(c+o*0.35);
}
function flowSplit(seed,top,bot,lines){
  lines=lines||5; var id="g"+seed, s=grad(id), H=240;
  s+='<path d="'+wavePath(0)+' L1200,0 L0,0 Z" fill="'+top+'"/>';
  s+='<path d="'+wavePath(0)+' L1200,'+H+' L0,'+H+' Z" fill="'+bot+'"/>';
  for(var i=1;i<=lines;i++){
    var o=i*15;
    s+='<path d="'+wavePath(o)+'" fill="none" stroke="url(#'+id+')" stroke-width="1" '
      +'vector-effect="non-scaling-stroke" opacity="'+(0.40-i*0.055).toFixed(2)+'"/>';
    s+='<path d="'+wavePath(-o)+'" fill="none" stroke="url(#'+id+')" stroke-width="1" '
      +'vector-effect="non-scaling-stroke" opacity="'+(0.30-i*0.05).toFixed(2)+'"/>';
  }
  return '<div class="flowsplit" aria-hidden="true" style="background:'+bot+'">'
    +'<svg viewBox="0 0 1200 '+H+'" preserveAspectRatio="none" '
    +'style="display:block;width:100%;height:clamp(96px,14vw,200px)">'+s+'</svg></div>';
}
function flow(seed,lines){
  lines=lines||5; var id="g"+seed, s=grad(id), h=210;
  for(var i=0;i<lines;i++){
    var o=i*13-((lines-1)*13)/2, a=70+o, b=150-o*0.7, c=110+o*1.2;
    s+='<path d="M0,'+a+' C220,'+(a-58)+' 400,'+(b+56)+' 620,'+b
      +' S1000,'+(c-52)+' 1200,'+(c+o*0.4)+'" fill="none" stroke="url(#'+id+')" '
      +'stroke-width="1" vector-effect="non-scaling-stroke" opacity="'+(0.42-i*0.055).toFixed(2)+'"/>';
  }
  return '<svg class="flow" viewBox="0 0 1200 '+h+'" preserveAspectRatio="none" aria-hidden="true" '
    +'style="height:clamp(90px,13vw,190px)">'+s+'</svg>';
}
/* the ripple that spreads from the mark in the opening */
/* The opening is the logo on black and nothing else. The ripples and the horizontal
   lines that used to sit behind it were removed — grad() stays because the wave
   dividers use it. */
function overtureCurves(){
  return "";
}
function overtureCurvesOld(){
  var id="og", s=grad(id);
  for(var i=0;i<9;i++){
    var rx=140+i*105, ry=rx*0.30;
    s+='<ellipse cx="600" cy="330" rx="'+rx+'" ry="'+ry.toFixed(0)+'" fill="none" stroke="url(#'+id+')" '
      +'stroke-width="1" vector-effect="non-scaling-stroke" opacity="'+(0.30-i*0.03).toFixed(2)+'"/>';
  }
  /* Only the ripples spreading from the mark. The horizontal lines that used to cross
     above the logo were removed — see LINES_ABOVE_LOGO in the README if you want them back. */
  return '<svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+s+'</svg>';
}
var K='fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" vector-effect="non-scaling-stroke"';
