/* ============================================================ ENGINEERING DRAWINGS
   Line art drawn for this site. Thin strokes, centre lines, dimension arrows.
   ============================================================ */
var S='fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" '
     +'stroke-linecap="round" stroke-linejoin="round"';
var SD='fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" '
      +'stroke-dasharray="7 4 2 4" opacity=".55"';   /* centre line */
var SH='fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" opacity=".38"';
function dim(x1,y1,x2,y2){  /* dimension line with end ticks */
  return '<g '+SH+'><path d="M'+x1+','+y1+' L'+x2+','+y2+'"/>'
    +'<path d="M'+x1+','+(y1-4)+' L'+x1+','+(y1+4)+'"/>'
    +'<path d="M'+x2+','+(y2-4)+' L'+x2+','+(y2+4)+'"/></g>';
}
function svgw(inner,w,h){
  return '<svg class="dw" viewBox="0 0 '+w+' '+h+'" aria-hidden="true">'+inner+'</svg>';
}
var DRAW={};

/* quadcopter, top view */
DRAW.drone=(function(){
  var g='<g '+S+'>';
  g+='<rect x="98" y="72" width="44" height="40" rx="7"/>';           /* body */
  g+='<rect x="108" y="82" width="24" height="20" rx="3"/>';          /* flight controller */
  var arms=[[58,40],[182,40],[58,144],[182,144]];
  for(var i=0;i<arms.length;i++){
    var x=arms[i][0], y=arms[i][1];
    var bx=(x<120?104:136), by=(y<92?80:104);
    g+='<path d="M'+bx+','+by+' L'+x+','+y+'"/>';
    g+='<circle cx="'+x+'" cy="'+y+'" r="9"/>';
    g+='<circle cx="'+x+'" cy="'+y+'" r="3"/>';
    g+='<ellipse cx="'+x+'" cy="'+y+'" rx="30" ry="7"/>';             /* prop disc */
  }
  g+='<path d="M120,112 L120,132"/><rect x="112" y="132" width="16" height="9" rx="2"/>'; /* payload */
  g+='</g>';
  g+='<g '+SD+'><path d="M120,18 L120,166"/><path d="M22,92 L218,92"/></g>';
  g+=dim(58,178,182,178);
  return svgw(g,240,190);
})();

/* ball valve, section */
DRAW.valve=(function(){
  var g='<g '+S+'>';
  g+='<path d="M40,74 L40,110 L64,110 L64,120 L176,120 L176,110 L200,110 L200,74 L176,74 L176,64 L64,64 L64,74 Z"/>';
  g+='<path d="M64,74 L64,110 M176,74 L176,110"/>';                   /* flange faces */
  g+='<circle cx="120" cy="92" r="30"/>';                             /* ball */
  g+='<path d="M90,92 L150,92" stroke-width="1"/>';                   /* bore */
  g+='<path d="M100,80 L100,104 M140,80 L140,104"/>';                 /* seats */
  g+='<rect x="113" y="34" width="14" height="30" rx="2"/>';          /* stem */
  g+='<path d="M84,34 L156,34"/><path d="M84,29 L84,39 M156,29 L156,39"/>'; /* handle */
  g+='</g>';
  g+='<g '+SH+'>';
  for(var x=42;x<62;x+=6) g+='<path d="M'+x+',76 L'+(x+10)+',108"/>';  /* hatching */
  for(var x2=180;x2<200;x2+=6) g+='<path d="M'+x2+',76 L'+(x2+10)+',108"/>';
  g+='</g>';
  g+='<g '+SD+'><path d="M20,92 L220,92"/><path d="M120,24 L120,140"/></g>';
  g+=dim(40,152,200,152);
  return svgw(g,240,190);
})();

/* machined bracket with holes and dimensions */
DRAW.part=(function(){
  var g='<g '+S+'>';
  g+='<path d="M46,146 L46,44 L74,44 L74,118 L196,118 L196,146 Z"/>';
  g+='<path d="M74,118 L74,44"/>';
  var holes=[[60,66],[60,96],[112,132],[152,132],[184,132]];
  for(var i=0;i<holes.length;i++){
    g+='<circle cx="'+holes[i][0]+'" cy="'+holes[i][1]+'" r="6"/>';
  }
  g+='<path d="M74,54 L84,44"/>';                                     /* chamfer note */
  g+='</g>';
  g+='<g '+SD+'>';
  for(var j=0;j<holes.length;j++){
    var hx=holes[j][0],hy=holes[j][1];
    g+='<path d="M'+(hx-11)+','+hy+' L'+(hx+11)+','+hy+'"/><path d="M'+hx+','+(hy-11)+' L'+hx+','+(hy+11)+'"/>';
  }
  g+='</g>';
  g+=dim(46,164,196,164);
  g+='<g '+SH+'><path d="M28,44 L28,146"/><path d="M24,44 L32,44 M24,146 L32,146"/>'
    +'<path d="M92,36 L120,20"/><text x="122" y="19" font-size="9" fill="currentColor" '
    +'font-family="inherit" letter-spacing="1">R2</text></g>';
  return svgw(g,240,190);
})();

/* FDM printer */
DRAW.printer=(function(){
  var g='<g '+S+'>';
  g+='<rect x="34" y="26" width="172" height="132" rx="4"/>';         /* frame */
  g+='<path d="M34,58 L206,58"/>';                                    /* X gantry rail */
  g+='<rect x="96" y="50" width="34" height="22" rx="3"/>';           /* carriage */
  g+='<path d="M107,72 L113,86 L119,72 Z"/>';                         /* nozzle */
  g+='<path d="M56,132 L184,132"/>';                                  /* bed */
  g+='<path d="M56,132 L56,140 M184,132 L184,140"/>';
  g+='<path d="M96,132 L96,110 L128,110 L128,132"/>';                 /* printed part */
  g+='<path d="M104,110 L104,98 L120,98 L120,110"/>';
  g+='<circle cx="176" cy="42" r="10"/><circle cx="176" cy="42" r="3"/>'; /* spool */
  g+='<path d="M166,42 C140,42 130,46 130,50"/>';                     /* filament */
  g+='</g>';
  g+='<g '+SH+'><path d="M212,58 L212,132"/><path d="M208,58 L216,58 M208,132 L216,132"/>'
    +'<path d="M212,86 L212,92 M209,89 L215,89" opacity="0"/></g>';
  g+='<g '+SD+'><path d="M113,26 L113,158"/></g>';
  return svgw(g,240,190);
})();

/* laser cutter */
DRAW.laser=(function(){
  var g='<g '+S+'>';
  g+='<rect x="30" y="40" width="180" height="112" rx="5"/>';         /* enclosure */
  g+='<path d="M30,62 L210,62"/>';                                    /* Y rail */
  g+='<rect x="106" y="54" width="28" height="16" rx="2"/>';          /* head */
  g+='<path d="M120,70 L120,108"/>';                                  /* beam */
  g+='<path d="M114,96 L120,108 L126,96"/>';                          /* cone */
  g+='<rect x="52" y="108" width="136" height="30" rx="2"/>';         /* sheet */
  g+='<path d="M74,124 a10,10 0 1,0 0.01,0"/>';                       /* cut circle */
  g+='<path d="M140,114 L170,114 L170,132 L140,132 Z"/>';             /* cut rect */
  g+='</g>';
  g+='<g '+SH+'>';
  for(var x=52;x<=188;x+=17) g+='<path d="M'+x+',108 L'+x+',138"/>';  /* honeycomb bed hint */
  g+='<path d="M196,40 L196,20 L176,20"/>';                           /* extraction */
  g+='</g>';
  g+='<g '+SD+'><path d="M120,30 L120,152"/></g>';
  g+=dim(52,160,188,160);
  return svgw(g,240,190);
})();

/* CNC router */
DRAW.cnc=(function(){
  var g='<g '+S+'>';
  g+='<path d="M34,150 L34,52 L206,52 L206,150"/>';                   /* gantry */
  g+='<path d="M34,68 L206,68"/>';
  g+='<rect x="100" y="60" width="40" height="30" rx="3"/>';          /* spindle carriage */
  g+='<path d="M112,90 L112,110 L128,110 L128,90"/>';                 /* spindle */
  g+='<path d="M116,110 L116,124 L124,124 L124,110"/>';               /* collet */
  g+='<path d="M118,124 L118,134 L122,134 L122,124"/>';               /* cutter */
  g+='<rect x="52" y="134" width="136" height="16" rx="2"/>';         /* table */
  g+='<path d="M66,134 L66,150 M104,134 L104,150 M142,134 L142,150 M178,134 L178,150"/>'; /* T-slots */
  g+='</g>';
  g+='<g '+SH+' stroke-dasharray="4 4"><path d="M64,142 L96,142 L96,138 L150,138 L150,146 L182,146"/></g>';
  g+='<g '+SD+'><path d="M120,44 L120,158"/></g>';
  g+=dim(34,168,206,168);
  return svgw(g,240,190);
})();

var GLYPH={
  wave:'<svg class="mk" viewBox="0 0 40 40" aria-hidden="true"><g '+K+'><rect x="3" y="8" width="34" height="24" rx="4"/><path d="M8,24 C12,13 16,13 20,20 S28,28 32,15"/></g></svg>',
  frame:'<svg class="mk" viewBox="0 0 40 40" aria-hidden="true"><g '+K+'><rect x="14" y="14" width="12" height="12" rx="2.5"/><path d="M14,16 L6,8 M26,16 L34,8 M14,24 L6,32 M26,24 L34,32"/><circle cx="6" cy="8" r="2.6"/><circle cx="34" cy="8" r="2.6"/><circle cx="6" cy="32" r="2.6"/><circle cx="34" cy="32" r="2.6"/></g></svg>',
  turn:'<svg class="mk" viewBox="0 0 40 40" aria-hidden="true"><g '+K+'><ellipse cx="20" cy="16" rx="14" ry="5.5"/><ellipse cx="20" cy="16" rx="6.5" ry="2.6"/><path d="M6,16 L6,25 C6,28 12.3,30.5 20,30.5 S34,28 34,25 L34,16"/></g></svg>',
  shed:'<svg class="mk" viewBox="0 0 40 40" aria-hidden="true"><g '+K+'><path d="M4,32 L4,17 L20,6 L36,17 L36,32"/><path d="M4,32 L36,32"/><rect x="10" y="22" width="8" height="10"/><rect x="23" y="22" width="7" height="6"/></g></svg>',
  vector:'<svg class="mk" viewBox="0 0 40 40" aria-hidden="true"><g '+K+'><circle cx="8" cy="31" r="2.8"/><path d="M10.5,28.5 L31,9"/><path d="M24,9 L32,8 L31,16"/><path d="M8,21 C8,15 12.5,10.5 18.5,10.5" stroke-dasharray="2.5 2.5"/></g></svg>'
};

/* ---- more plates, so every page has something of its own ---- */

/* populated PCB */
DRAW.pcb=(function(){
  var g='<g '+S+'>';
  g+='<rect x="34" y="40" width="172" height="112" rx="6"/>';
  g+='<rect x="96" y="72" width="48" height="40" rx="3"/>';            /* MCU */
  for(var i=0;i<6;i++){
    g+='<path d="M'+(102+i*8)+',72 L'+(102+i*8)+',64"/>';
    g+='<path d="M'+(102+i*8)+',112 L'+(102+i*8)+',120"/>';
  }
  g+='<circle cx="120" cy="92" r="3"/>';
  g+='<rect x="48" y="54" width="26" height="12" rx="2"/>';            /* passives */
  g+='<rect x="48" y="76" width="26" height="12" rx="2"/>';
  g+='<rect x="166" y="54" width="26" height="12" rx="2"/>';
  g+='<circle cx="176" cy="118" r="11"/><circle cx="176" cy="118" r="4"/>';
  g+='<path d="M74,60 L96,60 M74,82 L96,82 M144,60 L166,60"/>';        /* traces */
  g+='<path d="M144,92 L176,92 L176,107"/>';
  g+='<path d="M62,96 L62,134 L150,134"/>';
  for(var j=0;j<4;j++) g+='<circle cx="'+(44+j*6)+'" cy="146" r="2"/>';
  g+='</g>';
  g+='<g '+SD+'><path d="M120,30 L120,162"/></g>';
  g+=dim(34,168,206,168);
  return svgw(g,240,190);
})();

/* page layout / wireframe */
DRAW.layout=(function(){
  var g='<g '+S+'>';
  g+='<rect x="34" y="34" width="172" height="124" rx="5"/>';
  g+='<path d="M34,54 L206,54"/>';
  g+='<circle cx="44" cy="44" r="2.4"/><circle cx="52" cy="44" r="2.4"/><circle cx="60" cy="44" r="2.4"/>';
  g+='<rect x="46" y="66" width="66" height="34" rx="2"/>';
  g+='<path d="M124,70 L192,70 M124,80 L192,80 M124,90 L166,90"/>';
  g+='<rect x="46" y="112" width="44" height="30" rx="2"/>';
  g+='<rect x="100" y="112" width="44" height="30" rx="2"/>';
  g+='<rect x="154" y="112" width="38" height="14" rx="7"/>';
  g+='</g>';
  g+='<g '+SH+'><path d="M46,66 L112,100 M112,66 L46,100"/></g>';   /* image cross */
  g+=dim(34,170,206,170);
  return svgw(g,240,190);
})();

/* gear train */
DRAW.gears=(function(){
  var g='<g '+S+'>';
  function gear(cx,cy,r,n){
    var s='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>'
         +'<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.28).toFixed(1)+'"/>';
    for(var i=0;i<n;i++){
      var a=i*2*Math.PI/n;
      var x1=cx+Math.cos(a)*r, y1=cy+Math.sin(a)*r;
      var x2=cx+Math.cos(a)*(r+6), y2=cy+Math.sin(a)*(r+6);
      s+='<path d="M'+x1.toFixed(1)+','+y1.toFixed(1)+' L'+x2.toFixed(1)+','+y2.toFixed(1)+'"/>';
    }
    return s;
  }
  g+=gear(88,96,34,12)+gear(162,74,22,9);
  g+='</g>';
  g+='<g '+SD+'><path d="M88,44 L88,148"/><path d="M30,96 L200,96"/>'
    +'<path d="M162,40 L162,110"/></g>';
  g+=dim(54,166,122,166);
  return svgw(g,240,190);
})();

/* antenna and signal — detection work */
DRAW.signal=(function(){
  var g='<g '+S+'>';
  g+='<path d="M120,144 L120,72"/><path d="M104,152 L136,152 L128,144 L112,144 Z"/>';
  g+='<path d="M104,80 L136,80 M108,68 L132,68 M112,56 L128,56"/>';
  g+='<circle cx="120" cy="46" r="4"/>';
  g+='</g>';
  g+='<g '+SH+'>';
  for(var i=1;i<=4;i++){
    var r=22+i*20;
    g+='<path d="M'+(120-r)+',46 A'+r+','+r+' 0 0,1 '+(120+r)+',46" opacity="'+(0.5-i*0.08).toFixed(2)+'"/>';
  }
  g+='</g>';
  g+='<g '+SD+'><path d="M120,30 L120,160"/></g>';
  return svgw(g,240,190);
})();

/* dimensioned block — the estimating page */
DRAW.rule=(function(){
  var g='<g '+S+'>';
  g+='<rect x="52" y="58" width="136" height="72" rx="3"/>';
  g+='<path d="M52,86 L188,86 M96,58 L96,130 M144,58 L144,130"/>';
  g+='</g>';
  g+=dim(52,146,188,146);
  g+='<g '+SH+'><path d="M38,58 L38,130"/><path d="M34,58 L42,58 M34,130 L42,130"/>'
    +'<path d="M52,46 L96,46"/><path d="M52,42 L52,50 M96,42 L96,50"/></g>';
  return svgw(g,240,190);
})();

/* workshop bench — the yard */
DRAW.bench=(function(){
  var g='<g '+S+'>';
  g+='<path d="M28,150 L28,74 L120,36 L212,74 L212,150"/>';
  g+='<path d="M28,74 L212,74"/>';
  g+='<rect x="52" y="104" width="60" height="12" rx="2"/>';
  g+='<path d="M58,116 L58,146 M106,116 L106,146"/>';
  g+='<rect x="136" y="96" width="46" height="34" rx="2"/>';
  g+='<path d="M136,110 L182,110"/>';
  g+='<circle cx="150" cy="120" r="4"/><circle cx="168" cy="120" r="4"/>';
  g+='<path d="M64,96 L64,86 M80,96 L80,90 M96,96 L96,84"/>';
  g+='</g>';
  g+='<g '+SD+'><path d="M120,28 L120,158"/></g>';
  return svgw(g,240,190);
})();

/* ============================================================ DISCIPLINE ICONS
   Small line marks, one per engineering discipline. 40x40, stroke only, so they
   inherit colour and stay crisp at any size.
   ============================================================ */
var I='fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
     +'stroke-linejoin="round" vector-effect="non-scaling-stroke"';
function ico(inner){
  return '<svg class="ic" viewBox="0 0 40 40" aria-hidden="true"><g '+I+'>'+inner+'</g></svg>';
}
var ICON={
  cad:      ico('<path d="M7,31 L7,11 L21,5 L33,11 L33,29 L19,35 Z"/><path d="M7,11 L19,17 L33,11 M19,17 L19,35"/>'),
  mech:     ico('<circle cx="16" cy="20" r="9"/><circle cx="16" cy="20" r="3"/><path d="M16,7 L16,11 M16,29 L16,33 M5,20 L9,20 M23,20 L27,20"/><path d="M29,13 L35,13 L35,27 L29,27"/>'),
  elec:     ico('<path d="M5,20 L12,20 L15,12 L21,28 L25,20 L35,20"/><circle cx="5" cy="20" r="1.6"/><circle cx="35" cy="20" r="1.6"/>'),
  pcb:      ico('<rect x="6" y="9" width="28" height="22" rx="2"/><rect x="16" y="16" width="8" height="8" rx="1"/><path d="M6,14 L16,14 M24,14 L34,14 M6,26 L16,26 M24,26 L34,26"/><circle cx="11" cy="20" r="1.4"/><circle cx="29" cy="20" r="1.4"/>'),
  firmware: ico('<rect x="8" y="8" width="24" height="24" rx="3"/><path d="M14,16 L18,20 L14,24 M21,24 L27,24"/>'),
  control:  ico('<path d="M6,28 L14,28 L14,14 L26,14 L26,24 L34,24"/><circle cx="14" cy="28" r="2"/><circle cx="26" cy="14" r="2"/>'),
  robot:    ico('<rect x="11" y="15" width="18" height="14" rx="3"/><circle cx="16" cy="22" r="1.8"/><circle cx="24" cy="22" r="1.8"/><path d="M20,15 L20,9 M16,9 L24,9 M11,22 L6,22 M29,22 L34,22"/>'),
  drone:    ico('<rect x="15" y="15" width="10" height="10" rx="2"/><path d="M15,15 L8,8 M25,15 L32,8 M15,25 L8,32 M25,25 L32,32"/><ellipse cx="8" cy="8" rx="5" ry="2"/><ellipse cx="32" cy="8" rx="5" ry="2"/><ellipse cx="8" cy="32" rx="5" ry="2"/><ellipse cx="32" cy="32" rx="5" ry="2"/>'),
  dfm:      ico('<path d="M6,30 L14,30 L14,18 L20,18 L20,26 L34,26"/><path d="M24,6 L24,16 M20,12 L24,16 L28,12"/>'),
  print3d:  ico('<rect x="6" y="6" width="28" height="22" rx="2"/><rect x="16" y="10" width="9" height="6" rx="1"/><path d="M20.5,16 L20.5,20"/><path d="M11,28 L29,28"/><path d="M16,28 L16,23 L25,23 L25,28"/><path d="M9,34 L31,34"/>'),
  laser:    ico('<path d="M20,6 L20,20"/><path d="M15,16 L20,24 L25,16"/><rect x="8" y="26" width="24" height="8" rx="1.5"/><path d="M14,26 L14,34 M20,26 L20,34 M26,26 L26,34"/>'),
  cnc:      ico('<path d="M7,10 L33,10 M20,10 L20,20 M16,20 L24,20 L22,27 L18,27 Z"/><rect x="9" y="29" width="22" height="5" rx="1"/>'),
  web:      ico('<rect x="6" y="9" width="28" height="22" rx="2.5"/><path d="M6,15 L34,15"/><circle cx="10.5" cy="12" r="1.1"/><circle cx="14.5" cy="12" r="1.1"/><path d="M11,21 L23,21 M11,26 L29,26"/>'),
  ai:       ico('<circle cx="20" cy="20" r="5"/><circle cx="9" cy="11" r="2.6"/><circle cx="31" cy="11" r="2.6"/><circle cx="9" cy="29" r="2.6"/><circle cx="31" cy="29" r="2.6"/><path d="M11,13 L16,17 M29,13 L24,17 M11,27 L16,23 M29,27 L24,23"/>'),
  data:     ico('<path d="M6,32 L6,8"/><path d="M6,32 L34,32"/><path d="M11,26 L11,32 M18,18 L18,32 M25,22 L25,32 M32,12 L32,32"/>'),
  access:   ico('<circle cx="20" cy="9" r="3"/><path d="M9,16 L31,16"/><path d="M20,16 L20,24 M20,24 L14,34 M20,24 L26,34"/>'),
  pipe:     ico('<path d="M5,15 L18,15 L18,25 L35,25"/><path d="M5,11 L5,19 M35,21 L35,29"/><circle cx="18" cy="20" r="2"/>'),
  maintain: ico('<path d="M33,20 A13,13 0 1,1 28,9.5"/><path d="M28,4 L28,10 L22,10"/><circle cx="20" cy="20" r="4"/>'),
  test:     ico('<path d="M16,6 L16,16 L8,31 A3,3 0 0,0 11,34 L29,34 A3,3 0 0,0 32,31 L24,16 L24,6"/><path d="M13,6 L27,6"/><path d="M12,24 L28,24"/>')
};
