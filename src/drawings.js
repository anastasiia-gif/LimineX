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
