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
  legal:{nl:"Prijs altijd op aanvraag",en:"Price always on request"}},
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
work:{
  lede:{nl:"Opgeleverd werk, nog in gebruik. Wilt u met een klant spreken, dan regelen we dat.",
        en:"Delivered work, still in use. If you want to speak to a client, we'll arrange it."},
  cases:[
    {t:"HUTKO Kitchen", tag:{nl:"Website & webshop",en:"Website & online shop"}, url:"hutko-kitchen.com",
     short:{nl:"Oekraïense gerechten, vers ingevroren, bezorgd door heel Nederland.",en:"Ukrainian dishes, frozen fresh, delivered across the Netherlands."},
     p:{nl:"HUTKO Kitchen maakt Oekraïense gerechten, vriest ze vers in en bezorgt door heel Nederland. Wij bouwden de website en de webshop: losse gerechten en samengestelde pakketten, bestellen met bezorging op donderdag en zaterdag tussen 16.00 en 21.00 uur, en een verhaal dat uitlegt waarom bevroren hier juist een voordeel is.",
        en:"HUTKO Kitchen makes Ukrainian dishes, freezes them fresh and delivers across the Netherlands. We built the website and the shop: individual dishes and ready-made boxes, ordering with delivery on Thursdays and Saturdays between 16:00 and 21:00, and a story that explains why frozen is an advantage rather than a compromise."},
     dl:[{k:{nl:"Wat we deden",en:"What we did"},v:{nl:"Ontwerp, bouw, webshop",en:"Design, build, online shop"}},
         {k:{nl:"Bijzonder",en:"Notable"},v:{nl:"Bezorging in vaste vensters door heel NL",en:"Fixed delivery windows nationwide"}},
         {k:{nl:"Status",en:"Status"},v:{nl:"Live en in gebruik",en:"Live and in use"}}]},
    {t:"МАКС Автосервіс", tag:{nl:"Website met online afspraken",en:"Website with online booking"}, url:"maksavtoservice.com",
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
