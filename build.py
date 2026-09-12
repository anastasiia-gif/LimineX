#!/usr/bin/env python3
"""
Liminex site build.

    python3 build.py

Reads src/ and assets/, writes dist/ — one real HTML page per page per language,
plus shared CSS and JS. No dependencies.

    src/content.js     all the words, Dutch and English side by side  <- most edits
    src/styles.css     colours, spacing, type
    src/app.js         page layout and behaviour
    src/drawings.js    the engineering line drawings
    src/graphics.js    wave dividers and the ripples on the home page
    src/template.html  the page shell (nav, footer)
    PAGES below        the URL, title and description of every page
"""
import base64, json, mimetypes, os, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
def p(*a): return os.path.join(ROOT, *a)
def read(f): return open(p(f), encoding="utf-8").read()

SITE_URL = "https://liminex.net"          # no trailing slash
OG_IMAGE = SITE_URL + "/og.png"

# ---------------------------------------------------------------- the pages
# id       : must match the page ids in app.js
# slug     : URL per language. "" is the home page.
# title    : the browser tab and the blue line in Google. Keep under ~60 characters.
# desc     : the grey text under it in Google. Keep under ~155 characters.
# h1/intro : shown before JavaScript runs, so the page carries its own text.
PAGES = [
 {"id":"home",  "nl":{"slug":"", "title":"Liminex — engineering, prototyping en websites in Den Bosch",
   "desc":"Software en hardware in één team: websites en AI, prototyping, elektronica, besturing en CAD voor het mkb in Noord-Brabant.",
   "h1":"Software en hardware in één team, voor het mkb in Brabant.",
   "intro":"Websites en AI aan de ene kant, prototyping, elektronica en besturing aan de andere. Vier engineers in 's-Hertogenbosch."},
   "en":{"slug":"", "title":"Liminex — engineering, prototyping and websites in Den Bosch",
   "desc":"Software and hardware in one team: websites and AI, prototyping, electronics, control and CAD for SMEs in Noord-Brabant.",
   "h1":"Software and hardware in one team, for SMEs in Brabant.",
   "intro":"Websites and AI on one side, prototyping, electronics and control on the other. Four engineers in 's-Hertogenbosch."}},

 {"id":"web",   "nl":{"slug":"website-laten-maken", "title":"Website laten maken in Den Bosch | Liminex",
   "desc":"Websites, webshops en toegankelijkheidschecks voor het mkb in Noord-Brabant. Plus AI die in uw proces zit in plaats van in een browsertab.",
   "h1":"Website laten maken in Den Bosch en Noord-Brabant",
   "intro":"Websites die klanten opleveren, webshops, toegankelijkheidschecks tegen WCAG 2.1 AA, en AI die in uw proces zit in plaats van in een browsertab."},
   "en":{"slug":"web-and-ai", "title":"Web development and AI for SMEs | Liminex",
   "desc":"Websites, online shops and accessibility audits for SMEs in Noord-Brabant, plus AI that sits inside your process instead of in a browser tab.",
   "h1":"Web development and AI for SMEs in Noord-Brabant",
   "intro":"Websites that bring in customers, online shops, accessibility audits against WCAG 2.1 AA, and AI that sits inside your process."}},

 {"id":"proto", "nl":{"slug":"prototyping", "title":"Prototype laten maken | Liminex, Noord-Brabant",
   "desc":"Van schets naar werkend prototype: mechanica, elektronica, firmware en besturing in één team, op mkb-schaal. Eigen machines in huis.",
   "h1":"Prototype laten maken in Noord-Brabant",
   "intro":"Van schets naar werkend prototype: mechanica, elektronica, firmware en besturing in één team, en de machines om het te maken staan bij ons."},
   "en":{"slug":"prototyping", "title":"Prototyping and engineering | Liminex",
   "desc":"From sketch to working prototype: mechanics, electronics, firmware and control in one team, at SME scale, with the machines in house.",
   "h1":"Prototyping and engineering in Noord-Brabant",
   "intro":"From sketch to working prototype: mechanics, electronics, firmware and control in one team, and the machines to make it are ours."}},

 {"id":"make",  "nl":{"slug":"onderdelen-en-productie", "title":"Onderdelen laten maken en serieproductie | Liminex",
   "desc":"Kleine series maken we zelf op eigen machines; grotere aantallen begeleiden we, lokaal of in het buitenland. Inclusief eerlijke rekensom.",
   "h1":"Onderdelen laten maken en productie begeleiden",
   "intro":"Kleine series maken we hier op eigen machines. Grotere aantallen begeleiden we — lokaal of in het buitenland — en we rekenen voor wanneer dat níet loont."},
   "en":{"slug":"parts-and-production", "title":"Custom parts and production support | Liminex",
   "desc":"Short runs made on our own machines; larger volumes managed for you, locally or abroad, with an honest calculation of when that isn't worth it.",
   "h1":"Custom parts and production support",
   "intro":"Short runs we make here on our own machines. Larger volumes we manage for you, locally or abroad, and we do the maths on when that is not worth it."}},

 {"id":"yard",  "nl":{"slug":"project-yard", "title":"Project Yard — werkplaats voor Brabant | Liminex",
   "desc":"Een werkplaats waar bedrijven, studenten en makers dezelfde machines gebruiken. In opbouw — we toetsen eerst of er vraag is.",
   "h1":"Project Yard — een gedeelde werkplaats voor Brabant",
   "intro":"Machines, ruimte en begeleiding, open voor mkb'ers met een idee, studenten die willen bouwen, en makers zonder eigen werkplaats. In opbouw."},
   "en":{"slug":"project-yard", "title":"Project Yard — a shared workshop for Brabant | Liminex",
   "desc":"A workshop where companies, students and makers use the same machines. In development — we're testing whether the demand is real first.",
   "h1":"Project Yard — a shared workshop for Brabant",
   "intro":"Machines, space and guidance, open to SME owners with an idea, students who want to build, and makers without a workshop. In development."}},

 {"id":"start", "nl":{"slug":"start-ups", "title":"Technisch team voor start-ups | Liminex",
   "desc":"U heeft een idee en geen technisch team. Wij zijn dat team, tot u er zelf een heeft — van haalbaarheid tot werkend prototype.",
   "h1":"Een technisch team voor start-ups",
   "intro":"U heeft een idee en geen technisch team. Wij zijn dat team, tot u er zelf een heeft: haalbaarheid eerst, dan een prototype waar een investeerder iets van kan vinden."},
   "en":{"slug":"start-ups", "title":"A technical team for start-ups | Liminex",
   "desc":"You have an idea and no technical team. We are that team until you have your own — from feasibility to a working prototype.",
   "h1":"A technical team for start-ups",
   "intro":"You have an idea and no technical team. We are that team until you have your own: feasibility first, then a prototype an investor can react to."}},

 {"id":"price", "nl":{"slug":"tarieven", "title":"Wat kost het? Richtprijzen | Liminex",
   "desc":"Eerlijke bandbreedtes voor websites, webshops, AI-automatisering en prototyping. Geen prijslijst, wel een idee van de orde van grootte.",
   "h1":"Wat dingen ongeveer kosten",
   "intro":"Richtprijzen voor websites, webshops, automatisering en prototyping — zodat u weet waar u aan begint voordat u belt."},
   "en":{"slug":"pricing", "title":"What it costs — indicative prices | Liminex",
   "desc":"Honest ranges for websites, online shops, AI automation and prototyping. Not a price list, but a sense of the order of magnitude.",
   "h1":"What things cost, roughly",
   "intro":"Indicative prices for websites, shops, automation and prototyping — so you know what you're getting into before you call."}},

 {"id":"work",  "nl":{"slug":"werk", "title":"Ons werk — opgeleverde projecten | Liminex",
   "desc":"Websites die live staan en engineeringwerk dat we opgeleverd hebben. Een deel valt onder geheimhouding.",
   "h1":"Werk dat we opgeleverd hebben",
   "intro":"Twee websites die live staan en in gebruik zijn, plus engineeringwerk waarvan een deel onder geheimhouding valt."},
   "en":{"slug":"work", "title":"Our work — delivered projects | Liminex",
   "desc":"Websites that are live and engineering work we've delivered. Some of it is under NDA.",
   "h1":"Work we've delivered",
   "intro":"Two websites that are live and in use, plus engineering work, some of which is under NDA."}},

 {"id":"about", "nl":{"slug":"over-ons", "title":"Over Liminex — vier engineers in Den Bosch",
   "desc":"Vier engineers in 's-Hertogenbosch die software en hardware in één team doen. U spreekt de engineer die het werk doet.",
   "h1":"Vier engineers in 's-Hertogenbosch",
   "intro":"Software en hardware in één team. U spreekt de engineer die het werk doet — geen accountmanager ertussen."},
   "en":{"slug":"about", "title":"About Liminex — four engineers in Den Bosch",
   "desc":"Four engineers in 's-Hertogenbosch doing software and hardware in one team. You speak to the engineer doing the work.",
   "h1":"Four engineers in 's-Hertogenbosch",
   "intro":"Software and hardware in one team. You speak to the engineer doing the work — no account manager in between."}},

 {"id":"contact","nl":{"slug":"contact", "title":"Contact | Liminex, 's-Hertogenbosch",
   "desc":"Vertel in twee zinnen wat er moet gebeuren. Antwoord binnen één werkdag, van de engineer die het zou doen.",
   "h1":"Contact",
   "intro":"Vertel in twee zinnen wat er moet gebeuren. U krijgt binnen één werkdag antwoord van de engineer die het zou doen."},
   "en":{"slug":"contact", "title":"Contact | Liminex, 's-Hertogenbosch",
   "desc":"Tell us in two sentences what needs to happen. You'll hear back within one working day, from the engineer who'd do it.",
   "h1":"Contact",
   "intro":"Tell us in two sentences what needs to happen. You'll hear back within one working day, from the engineer who'd do it."}},
]

def url_for(pg, lang):
    slug = pg[lang]["slug"]
    base = "/" if lang == "nl" else "/en/"
    return base if not slug else base + slug + "/"

ROUTES = {l: {pg["id"]: url_for(pg, l) for pg in PAGES} for l in ("nl", "en")}

# ---------------------------------------------------------------- assets
shots = {}
work = p("assets/work")
if os.path.isdir(work):
    for f in sorted(os.listdir(work)):
        key, ext = os.path.splitext(f)
        if ext.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        mime = mimetypes.types_map.get(ext.lower(), "image/jpeg")
        shots[key] = "data:%s;base64,%s" % (
            mime, base64.b64encode(open(os.path.join(work, f), "rb").read()).decode())
        print("  screenshot:", f)

favicon = "data:image/webp;base64," + base64.b64encode(
    open(p("assets/logo_mark.webp"), "rb").read()).decode()

LD = json.dumps({
    "@context": "https://schema.org", "@type": "ProfessionalService",
    "@id": SITE_URL + "/#liminex", "name": "Liminex",
    "description": PAGES[0]["en"]["desc"], "url": SITE_URL + "/",
    "email": "info@liminex.net", "image": OG_IMAGE, "logo": OG_IMAGE,
    "slogan": "Make non-existent reality", "foundingDate": "2026",
    "address": {"@type": "PostalAddress", "streetAddress": "Graafseweg 194b",
                "addressLocality": "'s-Hertogenbosch", "addressRegion": "Noord-Brabant",
                "addressCountry": "NL"},
    "areaServed": [{"@type": "AdministrativeArea", "name": "Noord-Brabant"},
                   {"@type": "Country", "name": "Netherlands"}],
    "knowsLanguage": ["nl", "en"],
    "sameAs": ["https://www.linkedin.com/company/liminex"],
    "knowsAbout": ["prototyping", "3D printing", "laser cutting", "CNC machining",
                   "electronics", "PCB design", "firmware", "embedded systems",
                   "control systems", "drone systems", "CAD design",
                   "web development", "web accessibility", "AI for SMEs"],
}, ensure_ascii=False)

# ---------------------------------------------------------------- write
dist = p("dist")
shutil.rmtree(dist, ignore_errors=True)
os.makedirs(p("dist/assets"), exist_ok=True)

open(p("dist/assets/site.css"), "w", encoding="utf-8").write(read("src/styles.css"))
open(p("dist/assets/site.js"), "w", encoding="utf-8").write("\n".join([
    read("assets/logo_assets.js"),
    "var WORKSHOTS = " + json.dumps(shots) + ";",
    "var ROUTES = " + json.dumps(ROUTES, ensure_ascii=False) + ";",
    read("src/content.js"), read("src/graphics.js"),
    read("src/drawings.js"), read("src/app.js")]))

tpl = read("src/template.html")
UI = {"nl": {"skip": "Naar de inhoud", "nav": "Hoofdnavigatie"},
      "en": {"skip": "Skip to content", "nav": "Main navigation"}}

written = []
for pg in PAGES:
    for lang in ("nl", "en"):
        meta, url = pg[lang], url_for(pg, lang)
        head = "\n".join([
            "<title>%s</title>" % meta["title"],
            '<meta name="description" content="%s">' % meta["desc"],
            '<link rel="canonical" href="%s%s">' % (SITE_URL, url),
            '<link rel="alternate" hreflang="nl" href="%s%s">' % (SITE_URL, url_for(pg, "nl")),
            '<link rel="alternate" hreflang="en" href="%s%s">' % (SITE_URL, url_for(pg, "en")),
            '<link rel="alternate" hreflang="x-default" href="%s%s">' % (SITE_URL, url_for(pg, "nl")),
            '<link rel="icon" href="%s">' % favicon,
            '<meta property="og:type" content="website">',
            '<meta property="og:site_name" content="Liminex">',
            '<meta property="og:title" content="%s">' % meta["title"],
            '<meta property="og:description" content="%s">' % meta["desc"],
            '<meta property="og:url" content="%s%s">' % (SITE_URL, url),
            '<meta property="og:image" content="%s">' % OG_IMAGE,
            '<meta property="og:image:width" content="1200">',
            '<meta property="og:image:height" content="630">',
            '<meta property="og:locale" content="%s">' % ("nl_NL" if lang == "nl" else "en_GB"),
            '<meta name="twitter:card" content="summary_large_image">',
            '<meta name="theme-color" content="#08080B">',
            '<script type="application/ld+json">%s</script>' % LD])
        # A plain list of links in the markup, so a crawler that never runs the
        # JavaScript still sees the whole site. The app replaces it on load.
        staticnav = "".join(
            '<a href="%s">%s</a>' % (url_for(o, lang), o[lang]["h1"].split(" — ")[0][:38])
            for o in PAGES if o["id"] != pg["id"])
        body = (tpl.replace("__HEAD__", head)
                   .replace("__STATICNAV__", staticnav)
                   .replace("__SKIP__", UI[lang]["skip"])
                   .replace("__NAVLABEL__", UI[lang]["nav"])
                   .replace("__HOME__", ROUTES[lang]["home"])
                   .replace("__NL_URL__", url_for(pg, "nl"))
                   .replace("__EN_URL__", url_for(pg, "en"))
                   .replace("__H1__", meta["h1"])
                   .replace("__INTRO__", meta["intro"])
                   .replace("__BOOT__", json.dumps({"page": pg["id"], "lang": lang})))
        doc = ('<!doctype html>\n<html lang="%s">\n<head>\n<meta charset="utf-8">\n'
               '<meta name="viewport" content="width=device-width,initial-scale=1">\n' % lang
               + body.replace('<a class="skip"', '</head>\n<body>\n<a class="skip"', 1)
               + "\n</body>\n</html>\n")
        out = p("dist" + url + "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(doc)
        written.append(url)

shutil.copy(p("assets/og.png"), p("dist/og.png"))
open(p("dist/robots.txt"), "w").write(
    "User-agent: *\nAllow: /\nSitemap: %s/sitemap.xml\n" % SITE_URL)

sm = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
      'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for pg in PAGES:
    for lang in ("nl", "en"):
        sm.append("  <url><loc>%s%s</loc>" % (SITE_URL, url_for(pg, lang)))
        for alt in ("nl", "en"):
            sm.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s%s"/>'
                      % (alt, SITE_URL, url_for(pg, alt)))
        sm.append("    <changefreq>monthly</changefreq><priority>%s</priority></url>"
                  % ("1.0" if pg["id"] == "home" else "0.8"))
sm.append("</urlset>")
open(p("dist/sitemap.xml"), "w", encoding="utf-8").write("\n".join(sm) + "\n")

open(p("dist/.nojekyll"), "w").write("")
open(p("dist/404.html"), "w", encoding="utf-8").write(
    open(p("dist/index.html"), encoding="utf-8").read())
CUSTOM_DOMAIN = "liminex.net"
if CUSTOM_DOMAIN:
    open(p("dist/CNAME"), "w").write(CUSTOM_DOMAIN + "\n")

# A single self-contained file, for previewing or emailing. Not deployed.
if "--single" in sys.argv:
    one = (open(p("dist/index.html"), encoding="utf-8").read()
           .replace('<link rel="stylesheet" href="/assets/site.css">',
                    "<style>\n" + read("src/styles.css") + "\n</style>")
           .replace('<script src="/assets/site.js" defer></script>',
                    "<script>\n" + open(p("dist/assets/site.js"), encoding="utf-8").read() + "\n</script>"))
    open(p("dist/single.html"), "w", encoding="utf-8").write(one)
    print("dist/single.html  %d KB" % (len(one) // 1024))

css_kb = os.path.getsize(p("dist/assets/site.css")) // 1024
js_kb = os.path.getsize(p("dist/assets/site.js")) // 1024
print("%d pages  ·  site.css %d KB  ·  site.js %d KB" % (len(written), css_kb, js_kb))
for u in written: print("   ", u)
