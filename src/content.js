/* ============================================================ COPY ============================================================ */
var AREAS = [
  {id:"web",   glyph:"wave",  nl:"IT & Web",         en:"IT & Web"},
  {id:"proto", glyph:"frame", nl:"Prototyping",      en:"Prototyping"},
  {id:"make",  glyph:"turn",  nl:"Productie",        en:"Manufacturing"},
  {id:"yard",  glyph:"shed",  nl:"Project Yard",     en:"Project Yard"},
  {id:"start", glyph:"vector",nl:"Start-up support", en:"Start-up support"}
];
var TOPROW = 3;
var FORMS = {
  nl:"https://docs.google.com/forms/d/e/1FAIpQLSdeJxAmT8HDOpLdU8Btsm11Axnidh0sK7JIV5eqvxPnAKQYxA/viewform",
  en:"https://docs.google.com/forms/d/e/1FAIpQLScyRzXrcnD57-Fo27h5iNfAS59IsyiOmTJ825Avvrt87ieJWA/viewform"
};


/* ============================================================ EXPERIENCE
   Engineering work behind the two public websites. Clients under NDA are described
   by what was built, never by who paid for it. `areas` decides which activity pages
   each item appears on.
   ============================================================ */
var EXPERIENCE = [
  {id:"acoustic", areas:["proto","start"],
   t:{nl:"Akoestische dronedetectie",en:"Acoustic drone detection"},
   k:{nl:"Onderzoek + hardwarespec",en:"Research + hardware spec"},
   p:{nl:"Een gesynchroniseerde microfoonarray die drones detecteert, classificeert en lokaliseert. Wij deden het onderzoek, de systeemarchitectuur, de hardwarespecificatie en de onderdelenlijst voor de eerste bouw in Nederland.",
      en:"A synchronised microphone array that detects, classifies and locates drones. We did the research, the system architecture, the hardware specification and the bill of materials for the first build in the Netherlands."},
   m:{nl:"Onder geheimhouding",en:"Under NDA"}},
  {id:"rtk", areas:["proto","make"],
   t:{nl:"RTK-positionering voor een drone",en:"RTK positioning for a drone"},
   k:{nl:"Integratie + firmware",en:"Integration + firmware"},
   p:{nl:"Centimeterpositionering aan boord: een dual-band RTK-ontvanger gekoppeld aan een vluchtcontroller, inclusief de correctiestroom en de brug ertussen. Van losse modules naar een werkend geheel.",
      en:"Centimetre-level positioning on board: a dual-band RTK receiver tied to a flight controller, including the correction stream and the bridge between them. From loose modules to a working whole."},
   m:{nl:"Vliegend getest",en:"Flight tested"}},
  {id:"wearable", areas:["proto","start"],
   t:{nl:"Draagbare alarmknop",en:"Wearable alarm device"},
   k:{nl:"Haalbaarheid + fasering",en:"Feasibility + phasing"},
   p:{nl:"Een start-up wilde een alarmarmband die zonder telefoon werkt — in sieraadformaat. De eerste vraag was niet hoe, maar of het past: radio, antenne en accu in die maat. We deden de haalbaarheid en stelden een goedkoper prototype voor eerst, zodat het dure deel pas betaald hoeft te worden als het idee klopt.",
      en:"A start-up wanted an alarm bracelet that works without a phone — at jewellery scale. The first question wasn't how but whether it fits: radio, antenna and battery in that volume. We did the feasibility and proposed a cheaper prototype first, so the expensive part only gets paid for once the idea holds up."},
   m:{nl:"Fase 1 gedefinieerd",en:"Phase 1 defined"}},
  {id:"mech", areas:["make","proto"],
   k:{nl:"Constructie + fabricage",en:"Structure + fabrication"},
   t:{nl:"Draagconstructie op een voertuig",en:"Vehicle-mounted structure"},
   p:{nl:"Een railsysteem op een autodak dat een zware, bewegende last moet dragen en bij snelheid stabiel moet blijven. Berekening, CAD, en onderdelen die met de machines hier gemaakt konden worden.",
      en:"A rail system on a car roof carrying a heavy moving load that has to stay stable at speed. Calculation, CAD, and parts that could be made on the machines here."},
   m:{nl:"Onder geheimhouding",en:"Under NDA"}},
  {id:"inspect", areas:["proto","start"],
   t:{nl:"Inspectiedrone voor leidingen",en:"Pipeline inspection drone"},
   k:{nl:"Scope + planning",en:"Scope + planning"},
   p:{nl:"Vóór er iets gebouwd wordt: wat moet het ding kunnen, in welke leidingen, bij welke druk, en wat kost dat aan tijd. Een plan waar een opdrachtgever een besluit op kan nemen in plaats van een offerte met aannames.",
      en:"Before anything gets built: what the thing has to do, in which pipes, at what pressure, and what that costs in time. A plan a client can decide on, rather than a quote full of assumptions."},
   m:{nl:"In uitvoering",en:"In progress"}}
];

var EXPH={
  h:{nl:"Ervaring",en:"Experience"},
  d:{nl:"Werk dat we op dit terrein gedaan hebben. Een deel valt onder geheimhouding — we beschrijven wat er gebouwd is, niet voor wie.",
     en:"Work we've done in this area. Some of it is under NDA — we describe what was built, not who paid for it."},
  none:{nl:"Wilt u de volgende zijn?",en:"Would you like to be next?"}
};


/* ============================================================ DISCIPLINES
   What "engineering" actually means here. Shown on the Prototyping page.
   `ic` is a key in the ICON set (src/drawings.js).
   ============================================================ */
var DISCIPLINES = {
  h:{nl:"Welke technische vakgebieden we dekken",en:"The engineering domains we cover"},
  d:{nl:"\u201CEngineering\u201D zegt weinig. Dit zijn de vakgebieden die we zelf in huis hebben, met bij elk een voorbeeld van werk dat we erin gedaan hebben. Waarom dat uitmaakt: een prototype dat over vier partijen verdeeld wordt, wordt vier keer opnieuw uitgelegd.",
     en:"\u201CEngineering\u201D says very little. These are the domains we cover ourselves, each with an example of work we have done in it. Why that matters: a prototype split across four suppliers gets explained four times over."},
  items:[
    {ic:"mech", t:{nl:"Werktuigbouw",en:"Mechanical engineering"},
     p:{nl:"Constructie, sterkte en beweging. Wat moet het dragen, hoe stijf moet het zijn, en waar gaat het stuk als het valt.",
        en:"Structure, strength and motion. What it has to carry, how stiff it must be, and where it fails when it's dropped."},
     ex:{nl:"Een railsysteem op een autodak dat een zware, bewegende last draagt en bij snelheid stabiel blijft.",
         en:"A roof rail system carrying a heavy moving load that stays stable at speed."},
     k:"CAD · FEM · tolerantie"},
    {ic:"cad", t:{nl:"CAD en ontwerp",en:"CAD and design"},
     p:{nl:"Van schets naar tekening waar een machine mee overweg kan. Inclusief de tekeningen die een leverancier nodig heeft.",
        en:"From sketch to a drawing a machine can work from, including the drawings a supplier needs."},
     ex:{nl:"Een gefreesde beugel met boorpatroon en toleranties, zo getekend dat de verspaner niets hoefde te vragen.",
         en:"A machined bracket with hole pattern and tolerances, drawn so the machinist had nothing to ask."},
     k:"SolidWorks · STEP · 2D"},
    {ic:"elec", t:{nl:"Elektronica",en:"Electronics"},
     p:{nl:"Voeding, sensoren, motoren en alles wat daar tussen moet. Meten waarom iets niet doet wat het hoort te doen.",
        en:"Power, sensors, motors and everything in between. Measuring why something isn't doing what it should."},
     ex:{nl:"Meten waarom een sensorsignaal wegviel bij koude \u2014 en het opgelost met voeding, niet met software.",
         en:"Measuring why a sensor signal dropped out in the cold \u2014 and fixing it in the power supply, not the software."},
     k:"analoog · vermogen · meten"},
    {ic:"pcb", t:{nl:"PCB-ontwerp",en:"PCB design"},
     p:{nl:"Schema en print, van eenvoudige tweelaags tot ontwerpen waar layout en storing echt uitmaken.",
        en:"Schematic and board, from simple two-layer up to designs where layout and noise genuinely matter."},
     ex:{nl:"Schema en print voor een meetkaart met gesynchroniseerde kanalen, waar layout het verschil maakte.",
         en:"Schematic and board for a measurement card with synchronised channels, where layout made the difference."},
     k:"schema · layout · BOM"},
    {ic:"firmware", t:{nl:"Firmware en embedded",en:"Firmware and embedded"},
     p:{nl:"De code die op het ding zelf draait: C/C++ op microcontrollers, drivers, communicatie en opstarten zonder verrassingen.",
        en:"The code that runs on the thing itself: C/C++ on microcontrollers, drivers, comms, and starting up without surprises."},
     ex:{nl:"De brug tussen een RTK-ontvanger en een vluchtcontroller: correctiestroom in, positie uit, zonder haperen.",
         en:"The bridge between an RTK receiver and a flight controller: corrections in, position out, without stutter."},
     k:"C/C++ · RTOS · drivers"},
    {ic:"control", t:{nl:"Besturing en regeltechniek",en:"Control engineering"},
     p:{nl:"Regelkringen die stabiel blijven als de werkelijkheid afwijkt van het model. Positie, snelheid, temperatuur, kracht.",
        en:"Control loops that stay stable when reality departs from the model. Position, speed, temperature, force."},
     ex:{nl:"Een achtervolgingsregelaar die een bewegend doel volgt terwijl het platform zelf ook beweegt.",
         en:"A pursuit controller that tracks a moving target while the platform itself is moving too."},
     k:"PID · state · tuning"},
    {ic:"robot", t:{nl:"Robotica en mechatronica",en:"Robotics and mechatronics"},
     p:{nl:"Waar mechanica, elektronica en software \u00e9\u00e9n systeem worden. Aandrijving, terugkoppeling en veiligheid.",
        en:"Where mechanics, electronics and software become one system. Drives, feedback and safety."},
     ex:{nl:"Aandrijving, terugkoppeling en noodstop van een mechanisme dat op een rijdend voertuig werkt.",
         en:"Drive, feedback and emergency stop for a mechanism operating on a moving vehicle."},
     k:"actuatie · feedback"},
    {ic:"drone", t:{nl:"Drones en UAV",en:"Drones and UAV"},
     p:{nl:"Frames, vluchtcontrollers, positionering en payloads. Inclusief wat er nodig is om er legaal mee te vliegen.",
        en:"Frames, flight controllers, positioning and payloads. Including what it takes to fly one legally."},
     ex:{nl:"Centimeterpositionering aan boord van een drone: dual-band RTK gekoppeld aan de vluchtcontroller, vliegend getest.",
         en:"Centimetre positioning on board a drone: dual-band RTK tied to the flight controller, flight tested."},
     k:"ArduPilot · RTK · payload"},
    {ic:"data", t:{nl:"Signalen en data",en:"Signals and data"},
     p:{nl:"Metingen omzetten in iets waar een besluit op kan: filteren, karakteriseren, en zeggen hoe zeker het antwoord is.",
        en:"Turning measurements into something you can decide on: filtering, characterising, and saying how certain the answer is."},
     ex:{nl:"Een gesynchroniseerde microfoonarray die drones detecteert, classificeert en lokaliseert \u2014 inclusief hoe zeker dat antwoord is.",
         en:"A synchronised microphone array that detects, classifies and locates drones \u2014 including how certain that answer is."},
     k:"Python · DSP · analyse"},
    {ic:"dfm", t:{nl:"Ontwerpen voor productie",en:"Design for manufacturing"},
     p:{nl:"Een prototype dat niet te maken is, is geen prototype. We ontwerpen naar het proces dat het uiteindelijk maakt.",
        en:"A prototype that can't be made isn't a prototype. We design towards the process that will eventually make it."},
     ex:{nl:"Een draagbaar alarmapparaat in sieraadformaat: eerst uitgerekend of radio, antenne en accu er \u00fcberhaupt in passen.",
         en:"A wearable alarm device at jewellery scale: first working out whether radio, antenna and battery fit at all."},
     k:"DFM · kostprijs · serie"},
    {ic:"test", t:{nl:"Testen en validatie",en:"Testing and validation"},
     p:{nl:"Bewijzen dat het werkt, niet hopen. Testopstellingen, meetplannen en een eerlijk verslag als het tegenvalt.",
        en:"Proving it works rather than hoping. Test rigs, measurement plans, and an honest report when it disappoints."},
     ex:{nl:"Een meetplan voor een inspectiedrone: welke leidingen, welke druk, en wat er gemeten moet worden om iets te kunnen zeggen.",
         en:"A measurement plan for an inspection drone: which pipes, what pressure, and what has to be measured to conclude anything."},
     k:"rigs · meetplan · rapport"},
    {ic:"print3d", t:{nl:"Maken in huis",en:"Making it here"},
     p:{nl:"3D-print, lasersnijden en kleine CNC staan bij ons. Een ontwerpfout op dinsdag is woensdag een nieuw onderdeel.",
        en:"3D printing, laser cutting and small CNC are ours. A design mistake on Tuesday is a new part on Wednesday."},
     ex:{nl:"Een jig om honderd identieke onderdelen uit te lijnen \u2014 ontworpen op dinsdag, geprint en in gebruik op woensdag.",
         en:"A jig to align a hundred identical parts \u2014 designed on Tuesday, printed and in use on Wednesday."},
     k:"FDM · laser · CNC"}
  ],
  shots:[
    {t:{nl:"Foto — de bank",en:"Photo — the bench"},s:{nl:"Solderen of meten · 4:3",en:"Soldering or measuring · 4:3"}},
    {t:{nl:"Foto — een onderdeel",en:"Photo — a part"},s:{nl:"Net van de printer · 4:3",en:"Fresh off the printer · 4:3"}},
    {t:{nl:"Foto — CAD op het scherm",en:"Photo — CAD on screen"},s:{nl:"Over de schouder · 4:3",en:"Over the shoulder · 4:3"}}
  ]
};

var C = {
home:{
  tagline:{nl:"Make non-existent reality", en:"Make non-existent reality"},
  scroll:{nl:"Scroll", en:"Scroll"},
  blocksh:{nl:"Wat we doen", en:"What we do"},
  blocksd:{nl:"Vijf richtingen, één team. Software en hardware onder hetzelfde dak, met de machines om het ook echt te maken.",
           en:"Five directions, one team. Software and hardware under one roof, with the machines to actually make it."},
  blurbs:{
    web:{nl:"Websites die klanten opleveren, en AI die in uw proces zit in plaats van in een browsertab.",
         en:"Websites that bring in customers, and AI that sits inside your process instead of in a browser tab."},
    proto:{nl:"Van schets naar werkend prototype. Mechanica, elektronica, firmware en besturing in één team.",
           en:"From sketch to working prototype. Mechanics, electronics, firmware and control in one team."},
    make:{nl:"Kleine series maken we hier, met eigen printers, lasersnijder en CNC. Grotere aantallen begeleiden we.",
          en:"Small runs we make here, on our own printers, laser cutter and CNC. Larger volumes we manage for you."},
    yard:{nl:"Een werkplaats voor de regio, waar bedrijven, studenten en makers samen bouwen. In opbouw.",
          en:"A workshop for the region, where companies, students and makers build together. In development."},
    start:{nl:"U heeft een idee en geen technisch team. Wij zijn dat team, tot u er zelf een heeft.",
           en:"You have an idea and no technical team. We are that team, until you have your own."}
  },
  more:{nl:"Bekijken", en:"View"},
  whoh:{nl:"Wie we zijn", en:"Who we are"},
  teamh:{nl:"Het team", en:"The team"},
  teamd:{nl:"Vier engineers, elk met een eigen hoek van het werk. U spreekt degene die het doet.",
         en:"Four engineers, each with their own corner of the work. You speak to the one doing it."},
  team:[
    {n:{nl:"Naam",en:"Name"}, r:{nl:"Mechanica & CAD — constructie, 3D-print, CNC",en:"Mechanics & CAD — structures, 3D print, CNC"}},
    {n:{nl:"Naam",en:"Name"}, r:{nl:"Elektronica & besturing — PCB, sensoren, firmware",en:"Electronics & control — PCB, sensors, firmware"}},
    {n:{nl:"Naam",en:"Name"}, r:{nl:"Software & AI — Python, C/C++, data",en:"Software & AI — Python, C/C++, data"}},
    {n:{nl:"Naam",en:"Name"}, r:{nl:"Web & oplevering — sites, toegankelijkheid, hosting",en:"Web & delivery — sites, accessibility, hosting"}}
  ],
  teamwork:{nl:"Bekijk ons werk", en:"See our work"},
  teamabout:{nl:"Over ons", en:"About us"},
  whoq:{nl:"Vier engineers, eigen machines en een bank studenten. Klein genoeg om u de engineer te laten spreken die het werk doet.",
        en:"Four engineers, our own machines and a bench of students. Small enough that you speak to the engineer doing the work."},
  whop:{nl:"Liminex begon als een afstudeerproject en werd een bedrijf. We werken vanuit 's-Hertogenbosch voor het hele Brabantse mkb — websites en AI aan de ene kant, drones, besturing en elektronica aan de andere. Wat die twee bij elkaar houdt is dat de meeste bedrijven iets nodig hebben dat op beide raakt, en dat er bijna niemand is die het allebei doet.\n\nWe leiden studenten op terwijl ze aan echt werk werken. Dat is deels overtuiging en deels rekenkunde: Brabant heeft te weinig technische mensen, en er zijn maar twee manieren om daaraan iets te doen.",
        en:"Liminex started as a graduation project and turned into a company. We work from 's-Hertogenbosch for SMEs across Brabant — websites and AI on one side, drones, control systems and electronics on the other. What holds those together is that most companies need something touching both, and almost nobody does both.\n\nWe train students on real work. That is part conviction and part arithmetic: Brabant is short of technical people, and there are only two ways to change that."},
  stats:[
    {n:"4", k:{nl:"engineers, plus studenten die meebouwen",en:"engineers, plus students who build with us"}},
    {n:"3", k:{nl:"machines in huis: 3D-print, laser, CNC",en:"machines in the building: 3D print, laser, CNC"}},
    {n:"2026", k:{nl:"opgericht in 's-Hertogenbosch",en:"founded in 's-Hertogenbosch"}}
  ],
  photo1:{nl:"Foto — het team aan het werk",en:"Photo — the team at work"},
  photo1s:{nl:"Breed, handen en machines in beeld · 16:9",en:"Wide, hands and machines in shot · 16:9"},
  photo2:{nl:"Foto — iemand aan het werk",en:"Photo — someone working"},
  photo2s:{nl:"Staand portret · 3:4",en:"Portrait · 3:4"},
  clientsh:{nl:"Klanten & partners", en:"Clients & partners"},
  clientsd:{nl:"Logo's komen hier zodra we toestemming hebben. Onder geheimhouding werken we ook aan detectie- en besturingstechniek.",
            en:"Logos go here once we have permission. Under NDA we also work on detection and control engineering."},
  logos:["HUTKO Kitchen","МАКС Автосервіс",{nl:"Logo klant 3",en:"Client logo 3"},{nl:"Logo partner",en:"Partner logo"},{nl:"Logo partner",en:"Partner logo"}],
  ctah:{nl:"Een concreet probleem? Stuur het in twee zinnen.", en:"Got a concrete problem? Send it in two sentences."},
  ctab:{nl:"Neem contact op", en:"Get in touch"}
},
foot:{work:{nl:"Werk",en:"Work"}, more:{nl:"Meer",en:"More"}, contact:{nl:"Contact",en:"Contact"},
  legal:{nl:"Richtprijzen staan op de tarievenpagina",en:"Indicative prices are on the pricing page"}},
about:{
  lede:{nl:"Vier engineers uit 's-Hertogenbosch die software en hardware onder hetzelfde dak doen.",
        en:"Four engineers from 's-Hertogenbosch doing software and hardware under one roof."},
  storyh:{nl:"Hoe het begon", en:"How it started"},
  wayh:{nl:"Hoe we werken", en:"How we work"},
  way:[
    {h:{nl:"U spreekt de engineer",en:"You speak to the engineer"},
     p:{nl:"Geen accountmanager tussen u en het werk. Degene die het bouwt zit bij het gesprek.",
        en:"No account manager between you and the work. Whoever builds it is in the conversation."}},
    {h:{nl:"Eerst een pagina, dan pas bouwen",en:"One page first, then build"},
     p:{nl:"Scope, prijs en planning op één pagina voordat er iets gemaakt wordt. Geen prijslijst — elk project is anders.",
        en:"Scope, price and timeline on one page before anything is made. No price list — every project differs."}},
    {h:{nl:"We zeggen het als het niet past",en:"We say so when it doesn't fit"},
     p:{nl:"Kleine series maken we hier; grote aantallen in India of lokaal, en we rekenen voor wanneer dat níet loont.",
        en:"Small runs we make here; large volumes in India or locally, and we do the maths on when that is not worth it."}},
    {h:{nl:"Studenten bouwen mee",en:"Students build with us"},
     p:{nl:"Onder begeleiding, op echt werk. Dat houdt onze tarieven redelijk en leidt mensen op die Brabant nodig heeft.",
        en:"Supervised, on real work. It keeps our rates reasonable and trains the people Brabant needs."}}
  ],
  kith:{nl:"Wat er in huis staat", en:"What is in the building"},
  kit:[
    {h:{nl:"3D-printers",en:"3D printers"},p:{nl:"Functionele onderdelen, jigs en behuizingen in kunststof.",en:"Functional parts, jigs and enclosures in plastic."}},
    {h:{nl:"Lasersnijder",en:"Laser cutter"},p:{nl:"Plaatwerk, panelen en frontplaten, snel van tekening naar deel.",en:"Sheet parts, panels and front plates, quickly from drawing to part."}},
    {h:{nl:"CNC (klein)",en:"CNC (small)"},p:{nl:"Aluminium en kunststof onderdelen waar print te zwak is.",en:"Aluminium and plastic parts where printing is too weak."}},
    {h:{nl:"Elektronicabank",en:"Electronics bench"},p:{nl:"Solderen, meten en testen van besturing en sensoren.",en:"Soldering, measuring and testing control and sensors."}}
  ]
},
folio:{
  h:{nl:"Werk dat live staat", en:"Work that is live"},
  exph:{nl:"Ervaring", en:"Experience"},
  expd:{nl:"Wat we op dit terrein al hebben opgeleverd.", en:"What we have already delivered in this area."},
  d:{nl:"Twee opgeleverde projecten, allebei nog in gebruik.", en:"Two delivered projects, both still in use."},
  next:{nl:"Wilt u de volgende zijn?", en:"Would you like to be next?"},
  nextp:{nl:"Vertel in twee zinnen wat er moet gebeuren. Wij zeggen eerlijk of het bij ons past.",
         en:"Tell us in two sentences what needs to happen. We'll say honestly whether it suits us."}
},
web:{
  lede:{nl:"Websites die klanten opleveren, en AI die in uw proces zit — niet alleen in een browsertab.",
        en:"Websites that bring in customers, and AI that sits inside your process — not just in a browser tab."},
  intro:{nl:"Zeven op de tien Nederlandse mkb-bedrijven heeft een website, maar bij veel bedrijven is die jaren oud en levert hij niets op. En terwijl 33% van de bedrijven met tien of meer medewerkers AI gebruikt, is dat bij bedrijven van twee tot tien medewerkers maar 14%. De grootste blokkade is niet geld maar ervaring: 73% van de bedrijven die AI overwogen en het niet deden, noemt gebrek aan ervaring als reden.",
         en:"Seven in ten Dutch SMEs have a website, but for many it is years old and brings in nothing. And while 33% of firms with ten or more staff use AI, among firms of two to ten staff it is 14%. The biggest blocker is not money but experience: 73% of firms that considered AI and didn't adopt name lack of experience as the reason."},
  exhibh:{nl:"De tentoonstelling", en:"The exhibition"},
  exhibd:{nl:"Dit is wat we tot nu toe hebben opgeleverd. Beide sites staan live en worden nog gebruikt.",
          en:"This is what we have delivered so far. Both sites are live and still in use."},
  svcs:[
    {n:{nl:"Toegankelijkheidscheck + herstel",en:"Accessibility audit + fix"},
     d:{nl:"Sinds 28 juni 2025 geldt de European Accessibility Act. Verkoopt u online en heeft u meer dan tien medewerkers óf meer dan €2 miljoen omzet, dan valt u eronder. De ACM controleerde in maart 2026 grote Nederlandse webshops en vond dat ongeveer 60% niet voldeed. Wij testen, rapporteren en repareren — en we hebben dezelfde check op onze eigen site gedraaid voordat we hem gingen verkopen.",
        en:"The European Accessibility Act has applied since 28 June 2025. If you sell online and have more than ten staff or over €2m turnover, you are in scope. In March 2026 the ACM tested large Dutch webshops and found around 60% non-compliant. We test, report and fix — and we ran the same audit on our own site before we started selling it."}},
    {n:{nl:"Website of webshop",en:"Website or online shop"},
     d:{nl:"Van één pagina tot een site met een echt contentsysteem, tweetalig, snel en vindbaar. U kunt de teksten zelf aanpassen.",
        en:"From a single page to a site with a real content system, bilingual, fast and findable. You can edit the text yourself."}},
    {n:{nl:"AI-automatisering",en:"AI automation"},
     d:{nl:"Eén proces dat nu handwerk is en dat niet hoeft te zijn: offertes uit e-mail halen, facturen inlezen, post sorteren, rapportages die zichzelf maken. We beginnen met het proces dat u het meeste tijd kost.",
        en:"One process that is manual today and doesn't need to be: pulling quotes out of email, reading invoices, triaging messages, reports that write themselves. We start with whatever costs you the most time."}},
    {n:{nl:"Onderhoud",en:"Care"},
     d:{nl:"Updates, back-ups, monitoring en kleine wijzigingen, zodat de site over twee jaar nog werkt. Voor automatisering: bijsturen als uw proces verandert.",
        en:"Updates, backups, monitoring and small changes, so the site still works in two years. For automation: adjusting when your process changes."}}
  ],
  steps:[
    {h:{nl:"Gesprek van een half uur",en:"A half-hour conversation"},p:{nl:"Wat moet het opleveren, en voor wie. Kost niets.",en:"What it has to achieve, and for whom. Costs nothing."}},
    {h:{nl:"Voorstel op één pagina",en:"A proposal on one page"},p:{nl:"Scope, prijs en planning, op maat. Geen verrassingen achteraf.",en:"Scope, price and timeline, made for you. No surprises afterwards."}},
    {h:{nl:"Bouwen, met u erbij",en:"We build, with you in the loop"},p:{nl:"U ziet het groeien en stuurt onderweg bij.",en:"You watch it grow and steer as we go."}},
    {h:{nl:"Live, en daarna onderhouden",en:"Live, then maintained"},p:{nl:"Overdracht, uitleg, en desgewenst onderhoud.",en:"Handover, training, and maintenance if you want it."}}
  ]
},
proto:{
  lede:{nl:"Van schets naar werkend prototype: mechanica, elektronica, firmware en besturing — en de machines om het te maken staan bij ons.",
        en:"From sketch to working prototype: mechanics, electronics, firmware and control — and the machines to make it are ours."},
  intro:{nl:"De meeste Nederlandse ontwikkelbureaus doen óf elektronica, óf industrieel ontwerp, óf ze zijn geprijsd voor grote bedrijven. Wij doen mechanica, elektronica, firmware en besturing in één team, op mkb-schaal. Een ontwerpfout op dinsdag is woensdag opgelost.",
         en:"Most Dutch development studios do either electronics, or industrial design, or are priced for corporates. We do mechanics, electronics, firmware and control in one team, at SME scale. A design mistake on Tuesday is fixed on Wednesday."},
  svcs:[
    {n:{nl:"Haalbaarheidssprint",en:"Feasibility sprint"},
     d:{nl:"Twee weken: kan het, wat kost het, waar zit het risico. Technisch onderbouwd antwoord plus kostenraming. Bewust zo opgezet dat hij binnen MIT-Zuid past — 35% van de kosten vergoed tot €20.000, en kosten van derden zijn subsidiabel. Wij helpen met de aanvraag.",
        en:"Two weeks: can it be done, what will it cost, where is the risk. A technically grounded answer plus a cost estimate. Deliberately sized to fit MIT-Zuid — 35% of costs covered up to €20,000, third-party costs eligible. We help you apply."}},
    {n:{nl:"Prototype",en:"Prototype build"},
     d:{nl:"Behuizing, print en firmware tot een werkend exemplaar dat u kunt laten zien, testen en in handen van een klant geven.",
        en:"Enclosure, PCB and firmware to one working unit you can show, test and put in a customer's hands."}},
    {n:{nl:"Engineering-capaciteit",en:"Engineering capacity"},
     d:{nl:"Vaste uren per maand, voor bedrijven met structureel ontwikkelwerk en geen engineer. Of losse dagen als u alleen even handen nodig heeft.",
        en:"Fixed hours per month, for companies with steady development work and nobody to hire. Or single days when you just need hands."}}
  ],
  cardsh:{nl:"Wat we in huis doen", en:"What we do in-house"},
  cards:[
    {h:{nl:"Mechanica & CAD",en:"Mechanics & CAD"},p:{nl:"Constructie, behuizingen, jigs. Ontworpen om gemaakt te worden.",en:"Structures, enclosures, jigs. Designed to be manufacturable."}},
    {h:{nl:"Elektronica & firmware",en:"Electronics & firmware"},p:{nl:"Schema, printontwerp, embedded software in C en C++.",en:"Schematics, PCB layout, embedded software in C and C++."}},
    {h:{nl:"Besturing & robotica",en:"Control & robotics"},p:{nl:"Machinebesturing, aandrijving, meet- en regeltechniek.",en:"Machine control, drives, measurement and regulation."}},
    {h:{nl:"Data & simulatie",en:"Data & simulation"},p:{nl:"Python, meetdata, modellen. Uitrekenen wat er gebeurt voordat u bouwt.",en:"Python, measurement data, models. Working out what happens before you build."}}
  ]
},
make:{
  lede:{nl:"Eerst hier maken, dan pas opschalen. Wij zijn eerlijk over waar dat omslagpunt ligt.",
        en:"Make it here first, scale it later. We're honest about where that tipping point is."},
  intro:{nl:"Met een 3D-printer, lasersnijder en CNC in huis maken we kleine series direct hier — geen minimale afname, geen wachttijd, en u kunt tussentijds nog wijzigen. Voor grotere aantallen brengen we u in contact met producenten in Nederland en India, en begeleiden we het traject.",
         en:"With a 3D printer, laser cutter and CNC in the building we make small runs here — no minimum order, no lead time, and you can still change something halfway. For larger volumes we connect you with manufacturers in the Netherlands and India, and manage the process."},
  svcs:[
    {n:{nl:"Maken uit uw bestand",en:"Make from your file"},
     d:{nl:"3D-printen, lasersnijden of frezen. Stuur het bestand, wij zeggen wat het wordt.",en:"3D printing, laser cutting or milling. Send the file and we'll tell you what it becomes."}},
    {n:{nl:"Ontwerp + maken",en:"Design + make"},
     d:{nl:"U heeft een probleem, wij leveren het onderdeel. Een schets of foto is genoeg om te beginnen.",en:"You have a problem, we deliver the part. A sketch or a photo is enough to start."}},
    {n:{nl:"Klaarmaken voor serie",en:"Ready for series"},
     d:{nl:"Uw ontwerp geschikt maken voor serieproductie, leveranciers zoeken en beoordelen, monsters laten maken en de kwaliteit controleren.",
        en:"Getting your design ready for series production, finding and vetting suppliers, running samples and checking quality."}},
    {n:{nl:"Inkoopbegeleiding",en:"Sourcing"},
     d:{nl:"Wij regelen de productie en de kwaliteitscontrole. U blijft zelf importeur van de goederen — dat scheelt u niets in kwaliteit en ons allebei een hoop juridische rompslomp.",
        en:"We manage production and quality control. You remain importer of record — it costs you nothing in quality and saves us both a great deal of legal trouble."}}
  ],
  noteh:{nl:"Eerlijk over India", en:"Honest about India"},
  note:{nl:"Indiase productie is echt goedkoper voor arbeidsintensief werk, maar niet voor alles: passieve componenten zijn er 15–25% duurder, kale printplaten zijn in China goedkoper, en sinds 1 januari 2026 gelden er weer volle invoerrechten. Reken op 15–25% extra voor transport en heffingen, en 31 dagen over zee. Onder de paar honderd stuks wint Nederland bijna altijd — en dat zeggen we dan ook.",
        en:"Indian manufacturing genuinely is cheaper for labour-intensive work, but not for everything: passive components cost 15–25% more there, bare PCBs are cheaper in China, and since 1 January 2026 full import duties apply again. Budget 15–25% extra for freight and duties, and 31 days by sea. Below a few hundred units the Netherlands almost always wins — and we'll say so."}
},
yard:{
  lede:{nl:"Een plek in Noord-Brabant waar bedrijven, studenten en makers samen techniek bouwen. We onderzoeken nu of er genoeg vraag is.",
        en:"A place in Noord-Brabant where companies, students and makers build technology together. We're testing whether the demand is really there."},
  postersh:{nl:"Waarom we dit onderzoeken", en:"Why we are testing this"},
  posters:[
    {c:"p1", fig:"25,1%", say:{nl:"van alle Nederlandse R&D-investering komt uit Noord-Brabant. In Brainport is 68% daarvan van vijf bedrijven.",
        en:"of all Dutch R&D investment comes from Noord-Brabant. In Brainport, 68% of it belongs to five companies."},
     src:{nl:"Brainport Monitor · CBS StatLine 84985NED",en:"Brainport Monitor · CBS StatLine 84985NED"}},
    {c:"p2", fig:"14%", say:{nl:"van de bedrijven met 2–10 medewerkers gebruikt AI. Bij bedrijven met 250+ is dat 66%.",
        en:"of firms with 2–10 staff use AI. Among firms with 250+ it is 66%."},
     src:{nl:"CBS, 2025",en:"CBS, 2025"}},
    {c:"p3", fig:"73%", say:{nl:"noemt gebrek aan ervaring als reden om geen AI te gebruiken. Niet geld. Niet techniek. Ervaring.",
        en:"name lack of experience as the reason they didn't adopt AI. Not money. Not technology. Experience."},
     src:{nl:"CBS, 2025",en:"CBS, 2025"}},
    {c:"p4", fig:"50.000", say:{nl:"technische mensen tekort in Brainport over tien jaar. Het onderwijs levert er 20.000 van de 70.000.",
        en:"technical people short in Brainport over ten years. Education supplies 20,000 of the 70,000 needed."},
     src:{nl:"Brainport",en:"Brainport"}}
  ],
  introh:{nl:"Wat het zou zijn", en:"What it would be"},
  intro:{nl:"Een werkplaats met machines, ruimte en begeleiding: open voor mkb'ers met een idee, studenten die iets willen bouwen en makers zonder eigen werkplaats. In Brabant staan 22.805 bedrijven met twee of meer medewerkers in de sectoren waar wij werken — bijna allemaal te klein om zelf een engineer in dienst te nemen. Tegelijk studeren er meer dan 30.000 techniek- en ICT-studenten in de provincie. Die twee groepen ontmoeten elkaar nu nauwelijks.",
         en:"A workshop with machines, space and guidance: open to SME owners with an idea, students who want to build something, and makers without a workshop of their own. Brabant has 22,805 businesses with two or more staff in the sectors we work in — nearly all too small to employ an engineer. At the same time more than 30,000 engineering and ICT students are studying in the province. Those two groups barely meet."},
  cardsh:{nl:"Voor wie het is", en:"Who it is for"},
  cards:[
    {h:{nl:"Voor bedrijven",en:"For companies"},p:{nl:"Machinetijd, een plek om te testen, en engineers om mee te sparren.",en:"Machine time, somewhere to test, and engineers to think out loud with."}},
    {h:{nl:"Voor studenten",en:"For students"},p:{nl:"Echt werk aan echte opdrachten, betaald, naast je studie.",en:"Real work on real projects, paid, alongside your studies."}},
    {h:{nl:"Voor makers",en:"For makers"},p:{nl:"Toegang tot machines die je thuis niet hebt, en mensen die weten hoe ze werken.",en:"Access to machines you don't have at home, and people who know how to use them."}}
  ],
  formh:{nl:"Doe mee aan het onderzoek", en:"Take part in the survey"},
  formd:{nl:"Vier minuten. Geen account nodig. Uw antwoord bepaalt of dit er komt, waar het komt en wat het gaat kosten — en of we het klein beginnen of groot.",
         en:"Four minutes. No account needed. Your answer decides whether this happens, where, what it will cost — and whether we start small or large."},
  formnl:{nl:"Nederlandse vragenlijst",en:"Dutch questionnaire"},
  formen:{nl:"English questionnaire",en:"English questionnaire"},
  formnls:{nl:"Voor ondernemers, studenten en makers in Noord-Brabant.",en:"For entrepreneurs, students and makers in Noord-Brabant."},
  formens:{nl:"Dezelfde vragen, in het Engels.",en:"The same questions, in English."},
  open:{nl:"Vragenlijst openen",en:"Open the questionnaire"},
  statush:{nl:"Waar het nu staat", en:"Where this stands"},
  status:{nl:"We zoeken ruimte en financiering, en peilen eerst of er genoeg vraag is voordat we iets huren. Bent u ondernemer, student of maker in Noord-Brabant? Vul de vragenlijst in — dat is op dit moment het nuttigste wat u kunt doen.",
          en:"We're looking for space and funding, and testing whether the demand is really there before we rent anything. Are you an entrepreneur, student or maker in Noord-Brabant? Fill in the questionnaire — right now that is the most useful thing you can do."}
},
start:{
  lede:{nl:"U heeft een idee en geen technisch team. Wij zijn dat team, tot u er zelf een heeft.",
        en:"You have an idea and no technical team. We are that team, until you have your own."},
  intro:{nl:"De meeste startende ondernemers met een technisch product lopen op hetzelfde punt vast: ze kunnen het niet zelf bouwen, en een engineeringbureau dat voor grote bedrijven werkt is onbetaalbaar. Wij zitten daartussen. We beginnen klein en eerlijk — vaak met de vraag of het idee überhaupt kan.",
         en:"Most founders with a technical product hit the same wall: they can't build it themselves, and an engineering firm that works for corporates is out of reach. We sit in between. We start small and honestly — often with the question of whether the idea works at all."},
  steps:[
    {h:{nl:"Klopt het idee technisch?",en:"Does the idea hold up technically?"},p:{nl:"Een eerlijk antwoord voordat u geld uitgeeft. Soms is dat 'nee', en dan zeggen we dat.",en:"An honest answer before you spend money. Sometimes it's no, and we'll say so."}},
    {h:{nl:"Wat kost het echt?",en:"What will it really cost?"},p:{nl:"Ontwikkeling, onderdelen, certificering, productie. Het volledige plaatje, niet alleen het leuke deel.",en:"Development, parts, certification, production. The whole picture, not just the fun part."}},
    {h:{nl:"Eén werkend exemplaar",en:"One working unit"},p:{nl:"Iets dat u kunt laten zien aan klanten en investeerders. Dat verandert gesprekken.",en:"Something you can show customers and investors. That changes conversations."}},
    {h:{nl:"En dan verder",en:"And then onward"},p:{nl:"Naar een kleine serie, of naar uw eigen team — wij dragen over en houden niets achter.",en:"To a small production run, or to your own team — we hand over and keep nothing back."}}
  ],
  noteh:{nl:"Subsidie waar u recht op kunt hebben", en:"Funding you may be entitled to"},
  note:{nl:"MIT-Zuid vergoedt 35% van de kosten van een haalbaarheidsproject tot €20.000, en kosten van derden — dus onze factuur — tellen mee. De regeling loopt tot 2030. Wij helpen met de aanvraag, ook als u ons daarna niet inhuurt.",
        en:"MIT-Zuid covers 35% of the cost of a feasibility project up to €20,000, and third-party costs — our invoice — count. The scheme runs to 2030. We'll help you apply, even if you don't hire us afterwards."}
},
price:{
  lede:{nl:"Wat dingen ongeveer kosten. Geen prijslijst — wel eerlijke bandbreedtes, zodat u weet waar u aan begint.",
        en:"What things cost, roughly. Not a price list — honest ranges, so you know what you're getting into."},
  intro:{nl:"De meeste bureaus zeggen \u201Cneem contact op\u201D en laten u raden. Dat is prettig voor hen en vervelend voor u: zonder enig idee van de orde van grootte kunt u niet beslissen of het gesprek de moeite waard is.\n\nHieronder staat wat vergelijkbaar werk bij ons meestal kost. Het zijn bandbreedtes, geen offertes: het echte getal hangt af van hoeveel er al ligt, hoe vaak er iets verandert en hoe streng de eisen zijn. Na \u00e9\u00e9n gesprek krijgt u een vaste prijs op \u00e9\u00e9n pagina.",
         en:"Most agencies say \u201Cget in touch\u201D and leave you guessing. That is comfortable for them and annoying for you: without any sense of the order of magnitude you cannot decide whether the conversation is even worth having.\n\nBelow is what comparable work usually costs with us. These are ranges, not quotes: the real number depends on how much already exists, how often things change, and how strict the requirements are. After one conversation you get a fixed price on one page."},
  tblh:{nl:"Richtprijzen",en:"Indicative prices"},
  groups:[
    {g:{nl:"Websites en webshops",en:"Websites and online shops"},
     rows:[
      {n:{nl:"E\u00e9n pagina, \u00e9\u00e9n doel",en:"One page, one purpose"},
       d:{nl:"Een landingspagina die \u00e9\u00e9n ding moet doen: bellen, boeken of bestellen.",en:"A landing page that has to do one thing: call, book or order."},
       v:"\u20ac800 \u2013 1.500"},
      {n:{nl:"Bedrijfssite, meerdere pagina's",en:"Business site, several pages"},
       d:{nl:"Vijf tot vijftien pagina's, zelf aanpasbaar, twee talen als dat nodig is. Dit is waar de meeste klanten uitkomen.",en:"Five to fifteen pages, editable by you, two languages when needed. This is where most clients land."},
       v:"\u20ac2.500 \u2013 5.000"},
      {n:{nl:"Webshop",en:"Online shop"},
       d:{nl:"Producten, betalen, verzenden, voorraad. Prijs hangt vooral aan hoeveel uitzonderingen er in uw verzending zitten.",en:"Products, payments, shipping, stock. The price hangs mostly on how many exceptions live in your shipping rules."},
       v:"\u20ac3.500 \u2013 8.000"},
      {n:{nl:"Toegankelijkheidscheck + herstel",en:"Accessibility audit + fix"},
       d:{nl:"Testen tegen WCAG 2.1 AA, rapport met wat er stuk is, en het repareren. Verplicht voor veel webshops sinds de European Accessibility Act.",en:"Tested against WCAG 2.1 AA, a report of what is broken, and the repair. Mandatory for many online shops since the European Accessibility Act."},
       v:"\u20ac600 \u2013 1.800"},
      {n:{nl:"Onderhoud en hosting",en:"Maintenance and hosting"},
       d:{nl:"Updates, back-ups, kleine wijzigingen. Per maand, opzegbaar.",en:"Updates, backups, small changes. Per month, cancel any time."},
       v:{nl:"\u20ac30 \u2013 90 / maand",en:"\u20ac30 \u2013 90 / month"}}
     ]},
    {g:{nl:"AI en automatisering",en:"AI and automation"},
     rows:[
      {n:{nl:"E\u00e9n proces automatiseren",en:"Automate one process"},
       d:{nl:"E\u00e9n terugkerende handmatige stap wegnemen \u2014 offertes, facturen, e-mail sorteren, gegevens overtypen.",en:"Remove one recurring manual step — quotes, invoices, sorting email, retyping data."},
       v:"\u20ac1.500 \u2013 4.000"},
      {n:{nl:"Meerdere systemen koppelen",en:"Connect several systems"},
       d:{nl:"Uw webshop, boekhouding en voorraad laten praten, met AI waar regels niet volstaan.",en:"Making your shop, bookkeeping and stock talk to each other, with AI where rules aren't enough."},
       v:"\u20ac4.000 \u2013 12.000"},
      {n:{nl:"Draaiend houden",en:"Keeping it running"},
       d:{nl:"Monitoring, model- en API-kosten, en een klein wijzigingsbudget.",en:"Monitoring, model and API cost, and a small change budget."},
       v:{nl:"\u20ac75 \u2013 250 / maand",en:"\u20ac75 \u2013 250 / month"}}
     ]},
    {g:{nl:"Prototyping en engineering",en:"Prototyping and engineering"},
     rows:[
      {n:{nl:"Haalbaarheid, \u00e9\u00e9n week",en:"Feasibility, one week"},
       d:{nl:"Kan dit wat u wilt? Berekeningen, risico's, een grove kostenraming en een eerlijk advies om wel of niet door te gaan.",en:"Can this do what you want? Calculations, risks, a rough cost estimate and an honest recommendation on whether to continue."},
       v:"\u20ac1.500 \u2013 3.000"},
      {n:{nl:"Werkend prototype",en:"Working prototype"},
       d:{nl:"Mechanica, elektronica, firmware en besturing tot iets dat doet wat het moet doen. Breed, omdat een drone iets anders is dan een testopstelling.",en:"Mechanics, electronics, firmware and control until something does what it should. A wide band, because a drone is not a test rig."},
       v:"\u20ac6.000 \u2013 20.000"},
      {n:{nl:"Onderdelen laten maken",en:"Parts made"},
       d:{nl:"Losse onderdelen op de machines hier: 3D-print, lasersnijden of kleine CNC. Per onderdeel, meestal binnen een week.",en:"Individual parts on the machines here: 3D print, laser cutting or small CNC. Per part, usually within a week."},
       v:{nl:"vanaf \u20ac45",en:"from \u20ac45"}},
      {n:{nl:"Engineering-capaciteit",en:"Engineering capacity"},
       d:{nl:"Vaste uren per maand voor bedrijven met structureel ontwikkelwerk en geen eigen engineer.",en:"Fixed hours per month for companies with ongoing development work and no engineer of their own."},
       v:{nl:"\u20ac65 \u2013 95 / uur",en:"\u20ac65 \u2013 95 / hour"}}
     ]}
  ],
  whyh:{nl:"Waarom bandbreedtes en geen vaste prijzen",en:"Why ranges and not fixed prices"},
  why:[
    {h:{nl:"Wat er al ligt",en:"What already exists"},
     p:{nl:"Teksten, foto's en merk aanwezig? Dan zit u aan de onderkant. Moet dat er nog komen, aan de bovenkant.",en:"Copy, photos and brand ready? You're at the bottom of the range. If those still have to be made, the top."}},
    {h:{nl:"Hoe vaak het verandert",en:"How often it changes"},
     p:{nl:"Eén beslisser die knopen doorhakt is goedkoper dan een commissie. Dat is geen verwijt, het is planning.",en:"One decision-maker who decides is cheaper than a committee. That's not a complaint, it's planning."}},
    {h:{nl:"Hoe streng de eisen zijn",en:"How strict the requirements are"},
     p:{nl:"Een testopstelling mag stuk. Iets dat buiten hangt of dat mensen bedienen, mag dat niet — en dat kost tijd.",en:"A test rig is allowed to break. Something mounted outdoors or operated by people is not, and that costs time."}},
    {h:{nl:"Wie het doet",en:"Who does it"},
     p:{nl:"Waar het kan zetten we studenten in onder begeleiding. Dat scheelt u geld en leidt mensen op die deze regio nodig heeft.",en:"Where we can, we put students on it with supervision. That saves you money and trains the people this region needs."}}
  ],
  fixh:{nl:"Hoe u aan een vast bedrag komt",en:"How you get to a fixed number"},
  fix:[
    {h:{nl:"Twee zinnen",en:"Two sentences"},p:{nl:"U stuurt wat er moet gebeuren. Wij zeggen eerlijk of het bij ons past \u2014 soms is het antwoord nee.",en:"You send what needs to happen. We say honestly whether it suits us — sometimes the answer is no."}},
    {h:{nl:"Een half uur",en:"Half an hour"},p:{nl:"Gratis, met de engineer die het werk zou doen. Geen accountmanager.",en:"Free, with the engineer who'd do the work. No account manager."}},
    {h:{nl:"E\u00e9n pagina",en:"One page"},p:{nl:"Scope, vaste prijs en planning. Geen bijlagen van dertig pagina's.",en:"Scope, fixed price and timeline. No thirty-page appendix."}},
    {h:{nl:"Daarna pas rekenen",en:"Only then the bill"},p:{nl:"Meerwerk gaat alleen door als u er vooraf ja op zegt. Geen verrassingen achteraf.",en:"Extra work only proceeds if you say yes to it in advance. No surprises afterwards."}}
  ],
  noteh:{nl:"Wat hier niet in staat",en:"What's not in here"},
  note:{nl:"Serieproductie, inkoop en grotere engineeringtrajecten begroten we per geval \u2014 daar bepalen aantallen en materiaal de prijs, niet ons uurtarief. Voor Project Yard geldt hetzelfde: dat is nog in opbouw.",
        en:"Series production, sourcing and larger engineering programmes are quoted case by case — there the volumes and materials set the price, not our hourly rate. The same goes for Project Yard: that one is still being built."}
},

work:{
  lede:{nl:"Opgeleverd werk, nog in gebruik. Wilt u met een klant spreken, dan regelen we dat.",
        en:"Delivered work, still in use. If you want to speak to a client, we'll arrange it."},
  cases:[
    {t:"HUTKO Kitchen", img:"hutko", tag:{nl:"Website & webshop",en:"Website & online shop"}, url:"hutko-kitchen.com",
     short:{nl:"Oekraïens diepvriesmerk in Nederland. Wij bouwen en onderhouden de site, de webshop en de orderafhandeling.",en:"Ukrainian frozen food brand in the Netherlands. We build and maintain the site, the shop and order handling."},
     p:{nl:"HUTKO Kitchen maakt Oekraïense gerechten, vriest ze vers in en bezorgt door heel Nederland. Wij bouwden de website en de webshop: losse gerechten en samengestelde pakketten, bestellen met bezorging op donderdag en zaterdag tussen 16.00 en 21.00 uur, en een verhaal dat uitlegt waarom bevroren hier juist een voordeel is.",
        en:"HUTKO Kitchen makes Ukrainian dishes, freezes them fresh and delivers across the Netherlands. We built the website and the shop: individual dishes and ready-made boxes, ordering with delivery on Thursdays and Saturdays between 16:00 and 21:00, and a story that explains why frozen is an advantage rather than a compromise."},
     dl:[{k:{nl:"Wat we deden",en:"What we did"},v:{nl:"Ontwerp, bouw, webshop",en:"Design, build, online shop"}},
         {k:{nl:"Bijzonder",en:"Notable"},v:{nl:"Bezorging in vaste vensters door heel NL",en:"Fixed delivery windows nationwide"}},
         {k:{nl:"Status",en:"Status"},v:{nl:"Live en in gebruik",en:"Live and in use"}}]},
    {t:"МАКС Автосервіс", img:"maks", tag:{nl:"Website met online afspraken",en:"Website with online booking"}, url:"maksavtoservice.com",
     short:{nl:"Autoservice in Kyiv. Elke dienst met prijs én tijdsduur, en zelf een tijdslot kiezen.",en:"Car service in Kyiv. Every service with price and duration, and pick your own slot."},
     p:{nl:"Een autoservice in Kyiv die het anders wilde doen dan de rest van de branche: geen verrassingen op de rekening. Wij bouwden een tweetalige site (Oekraïens en Engels) waarop elke dienst met prijs én tijdsduur staat — olie verversen, computerdiagnose, banden, remmen, uitlijnen op 3D-apparatuur — plus een afsprakensysteem waarin de klant zelf een tijdslot kiest.",
        en:"A car service in Kyiv that wanted to work differently from the rest of the trade: no surprises on the bill. We built a bilingual site (Ukrainian and English) where every service is listed with its price and how long it takes — oil changes, computer diagnostics, tyres, brakes, 3D wheel alignment — plus a booking system where the customer picks their own time slot."},
     dl:[{k:{nl:"Wat we deden",en:"What we did"},v:{nl:"Ontwerp, bouw, afsprakensysteem, prijslijst",en:"Design, build, booking system, price list"}},
         {k:{nl:"Bijzonder",en:"Notable"},v:{nl:"Prijs én duur per dienst openbaar",en:"Price and duration published per service"}},
         {k:{nl:"Status",en:"Status"},v:{nl:"Live en in gebruik",en:"Live and in use"}}]}
  ],
  moreh:{nl:"Ook gedaan, nog niet openbaar", en:"Also delivered, not yet public"},
  morep:{nl:"Een deel van ons werk valt onder geheimhouding — onder andere in detectie- en besturingstechniek. In een gesprek kunnen we op hoofdlijnen vertellen wat we daar gedaan hebben.",
         en:"Some of our work is under NDA — including detection and control engineering. In a conversation we can describe at a high level what we did."}
},
contact:{
  lede:{nl:"Vertel in twee zinnen wat er moet gebeuren. U krijgt binnen één werkdag antwoord van de engineer die het zou doen.",
        en:"Tell us in two sentences what needs to happen. You'll hear back within one working day, from the engineer who'd do it."},
  fields:{name:{nl:"Naam",en:"Name"},company:{nl:"Bedrijf",en:"Company"},email:{nl:"E-mail",en:"Email"},
    type:{nl:"Waar gaat het over",en:"What is it about"},msg:{nl:"Wat moet er gebeuren",en:"What needs to happen"},
    send:{nl:"Versturen",en:"Send"}},
  types:{nl:["Website of webshop","AI / automatisering","Prototype of engineering","Besturing van een machine","Onderdeel laten maken","Serieproductie / inkoop","Project Yard","Start-up: idee toetsen","Iets anders"],
         en:["Website or online shop","AI / automation","Prototype or engineering","Machine control","Get a part made","Production / sourcing","Project Yard","Start-up: test an idea","Something else"]},
  hp:{nl:"Laat dit veld leeg",en:"Leave this field empty"},
  sending:{nl:"Versturen\u2026",en:"Sending\u2026"},
  ok:{nl:"Verstuurd. U krijgt binnen \u00e9\u00e9n werkdag antwoord van de engineer die het zou doen.",
      en:"Sent. You'll hear back within one working day, from the engineer who'd do it."},
  fail:{nl:"Het versturen lukte niet. Mail ons rechtstreeks op info@liminex.net \u2014 dat komt altijd aan.",
        en:"That didn't send. Email us directly at info@liminex.net — that always arrives."},
  need:{nl:"Vul uw e-mailadres en uw bericht in.",en:"Please fill in your email address and your message."},
  privacy:{nl:"Wat u hier invult gebruiken we alleen om te antwoorden. We bewaren het niet langer dan nodig en geven het niet door.",
           en:"What you enter here is used only to reply. We don't keep it longer than needed and don't pass it on."},
  formnote:{nl:"Dit formulier is nog niet aangesloten — in de live site komen de berichten binnen op info@liminex.net.",
            en:"This form is not wired up yet — on the live site messages arrive at info@liminex.net."},
  details:[
    {k:{nl:"E-mail",en:"Email"},v:"info@liminex.net"},
    {k:{nl:"Werkgebied",en:"We work across"},v:{nl:"'s-Hertogenbosch en heel Noord-Brabant",en:"'s-Hertogenbosch and all of Noord-Brabant"}},
    {k:{nl:"KvK",en:"Chamber of Commerce"},v:"42104253"},
    {k:{nl:"Talen",en:"Languages"},v:{nl:"Nederlands, Engels, Oekraïens",en:"Dutch, English, Ukrainian"}}
  ]
}
};
