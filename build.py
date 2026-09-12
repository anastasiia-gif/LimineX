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

# ---------------------------------------------------------------- where the site lives
# Two settings, and they must match how GitHub Pages is serving the repo.
#
#   GitHub Pages *project* page   https://<user>.github.io/<repo>/
#       SITE_ORIGIN = "https://<user>.github.io"
#       BASE_PATH   = "/<repo>"          <- the repo name, with a leading slash
#
#   Custom domain (or a <user>.github.io user page)
#       SITE_ORIGIN = "https://liminex.net"
#       BASE_PATH   = ""                 <- empty
#
# Both can be overridden by environment variables, which is how the CI workflow
# sets them without anyone editing this file.
SITE_ORIGIN   = os.environ.get("SITE_ORIGIN", "https://anastasiia-gif.github.io")
BASE_PATH     = os.environ.get("BASE_PATH", "/LimineX").rstrip("/")
CUSTOM_DOMAIN = os.environ.get("CUSTOM_DOMAIN", "")   # writes dist/CNAME when set

# Where the contact form posts. A static site cannot send mail itself, so this is a
# form-to-email service — see the README for how to get one. Leave it empty and the
# form falls back to opening the visitor's own mail client instead.
FORM_ENDPOINT = os.environ.get("FORM_ENDPOINT", "")
# Web3Forms and Formspree-style services want a key posted with the form. Set it as a
# repository variable next to FORM_ENDPOINT; leave empty for services that don't use one.
FORM_KEY = os.environ.get("FORM_KEY", "")
# Where enquiries land. Used in the footer, the form fallback and the structured data.
CONTACT_EMAIL = os.environ.get("CONTACT_EMAIL", "anastasiia@liminex.net")

SITE_URL = SITE_ORIGIN + BASE_PATH        # no trailing slash
OG_IMAGE = SITE_URL + "/og.png"

# ---------------------------------------------------------------- the pages
# id       : must match the page ids in app.js
# slug     : URL per language. "" is the home page.
# title    : the browser tab and the blue line in Google. Keep under ~60 characters.
# desc     : the grey text under it in Google. Keep under ~155 characters.
# h1/intro : shown before JavaScript runs, so the page carries its own text.
PAGES = [
 {"id":"home",  "nl":{"slug":"", "nav":"Home", "title":"Liminex — engineering, prototyping en websites in Den Bosch",
   "desc":"Software en hardware in één team: websites en AI, prototyping, elektronica, besturing en CAD voor het mkb in Noord-Brabant.",
   "h1":"Software en hardware in één team, voor het mkb in Brabant.",
   "intro":"Websites en AI aan de ene kant, prototyping, elektronica en besturing aan de andere. Vier engineers in 's-Hertogenbosch."},
   "en":{"nav":"Home", "slug":"", "title":"Liminex — engineering, prototyping and websites in Den Bosch",
   "desc":"Software and hardware in one team: websites and AI, prototyping, electronics, control and CAD for SMEs in Noord-Brabant.",
   "h1":"Software and hardware in one team, for SMEs in Brabant.",
   "intro":"Websites and AI on one side, prototyping, electronics and control on the other. Four engineers in 's-Hertogenbosch."}},

 {"id":"web",   "nl":{"slug":"website-laten-maken", "nav":"IT & Web", "title":"Website laten maken in Den Bosch | Liminex",
   "desc":"Websites, webshops en toegankelijkheidschecks voor het mkb in Noord-Brabant. Plus AI die in uw proces zit in plaats van in een browsertab.",
   "h1":"Website laten maken in Den Bosch en Noord-Brabant",
   "intro":"Websites die klanten opleveren, webshops, toegankelijkheidschecks tegen WCAG 2.1 AA, en AI die in uw proces zit in plaats van in een browsertab."},
   "en":{"nav":"IT & Web", "slug":"web-and-ai", "title":"Web development and AI for SMEs | Liminex",
   "desc":"Websites, online shops and accessibility audits for SMEs in Noord-Brabant, plus AI that sits inside your process instead of in a browser tab.",
   "h1":"Web development and AI for SMEs in Noord-Brabant",
   "intro":"Websites that bring in customers, online shops, accessibility audits against WCAG 2.1 AA, and AI that sits inside your process."}},

 {"id":"proto", "nl":{"slug":"prototyping", "nav":"Prototyping", "title":"Prototype laten maken | Liminex, Noord-Brabant",
   "desc":"Van schets naar werkend prototype: mechanica, elektronica, firmware en besturing in één team, op mkb-schaal. Eigen machines in huis.",
   "h1":"Prototype laten maken in Noord-Brabant",
   "intro":"Van schets naar werkend prototype: mechanica, elektronica, firmware en besturing in één team, en de machines om het te maken staan bij ons."},
   "en":{"nav":"Prototyping", "slug":"prototyping", "title":"Prototyping and engineering | Liminex",
   "desc":"From sketch to working prototype: mechanics, electronics, firmware and control in one team, at SME scale, with the machines in house.",
   "h1":"Prototyping and engineering in Noord-Brabant",
   "intro":"From sketch to working prototype: mechanics, electronics, firmware and control in one team, and the machines to make it are ours."}},

 {"id":"make",  "nl":{"slug":"onderdelen-en-productie", "nav":"Productie", "title":"Onderdelen laten maken en serieproductie | Liminex",
   "desc":"Kleine series maken we zelf op eigen machines; grotere aantallen begeleiden we, lokaal of in het buitenland. Inclusief eerlijke rekensom.",
   "h1":"Onderdelen laten maken en productie begeleiden",
   "intro":"Kleine series maken we hier op eigen machines. Grotere aantallen begeleiden we — lokaal of in het buitenland — en we rekenen voor wanneer dat níet loont."},
   "en":{"nav":"Manufacturing", "slug":"parts-and-production", "title":"Custom parts and production support | Liminex",
   "desc":"Short runs made on our own machines; larger volumes managed for you, locally or abroad, with an honest calculation of when that isn't worth it.",
   "h1":"Custom parts and production support",
   "intro":"Short runs we make here on our own machines. Larger volumes we manage for you, locally or abroad, and we do the maths on when that is not worth it."}},

 {"id":"yard",  "nl":{"slug":"project-yard", "nav":"Project Yard", "title":"Project Yard — werkplaats voor Brabant | Liminex",
   "desc":"Een werkplaats waar bedrijven, studenten en makers dezelfde machines gebruiken. In opbouw — we toetsen eerst of er vraag is.",
   "h1":"Project Yard — een gedeelde werkplaats voor Brabant",
   "intro":"Machines, ruimte en begeleiding, open voor mkb'ers met een idee, studenten die willen bouwen, en makers zonder eigen werkplaats. In opbouw."},
   "en":{"nav":"Project Yard", "slug":"project-yard", "title":"Project Yard — a shared workshop for Brabant | Liminex",
   "desc":"A workshop where companies, students and makers use the same machines. In development — we're testing whether the demand is real first.",
   "h1":"Project Yard — a shared workshop for Brabant",
   "intro":"Machines, space and guidance, open to SME owners with an idea, students who want to build, and makers without a workshop. In development."}},

 {"id":"start", "nl":{"slug":"start-ups", "nav":"Start-ups", "title":"Technisch team voor start-ups | Liminex",
   "desc":"U heeft een idee en geen technisch team. Wij zijn dat team, tot u er zelf een heeft — van haalbaarheid tot werkend prototype.",
   "h1":"Een technisch team voor start-ups",
   "intro":"U heeft een idee en geen technisch team. Wij zijn dat team, tot u er zelf een heeft: haalbaarheid eerst, dan een prototype waar een investeerder iets van kan vinden."},
   "en":{"nav":"Start-ups", "slug":"start-ups", "title":"A technical team for start-ups | Liminex",
   "desc":"You have an idea and no technical team. We are that team until you have your own — from feasibility to a working prototype.",
   "h1":"A technical team for start-ups",
   "intro":"You have an idea and no technical team. We are that team until you have your own: feasibility first, then a prototype an investor can react to."}},

 {"id":"price", "nl":{"slug":"tarieven", "nav":"Tarieven", "title":"Wat kost het? Richtprijzen | Liminex",
   "desc":"Eerlijke bandbreedtes voor websites, webshops, AI-automatisering en prototyping. Geen prijslijst, wel een idee van de orde van grootte.",
   "h1":"Wat dingen ongeveer kosten",
   "intro":"Richtprijzen voor websites, webshops, automatisering en prototyping — zodat u weet waar u aan begint voordat u belt."},
   "en":{"nav":"Pricing", "slug":"pricing", "title":"What it costs — indicative prices | Liminex",
   "desc":"Honest ranges for websites, online shops, AI automation and prototyping. Not a price list, but a sense of the order of magnitude.",
   "h1":"What things cost, roughly",
   "intro":"Indicative prices for websites, shops, automation and prototyping — so you know what you're getting into before you call."}},

 {"id":"work",  "nl":{"slug":"werk", "nav":"Werk", "title":"Ons werk — opgeleverde projecten | Liminex",
   "desc":"Websites die live staan en engineeringwerk dat we opgeleverd hebben. Een deel valt onder geheimhouding.",
   "h1":"Werk dat we opgeleverd hebben",
   "intro":"Twee websites die live staan en in gebruik zijn, plus engineeringwerk waarvan een deel onder geheimhouding valt."},
   "en":{"nav":"Work", "slug":"work", "title":"Our work — delivered projects | Liminex",
   "desc":"Websites that are live and engineering work we've delivered. Some of it is under NDA.",
   "h1":"Work we've delivered",
   "intro":"Two websites that are live and in use, plus engineering work, some of which is under NDA."}},

 {"id":"about", "nl":{"slug":"over-ons", "nav":"Over ons", "title":"Over Liminex — vier engineers in Den Bosch",
   "desc":"Vier engineers in 's-Hertogenbosch die software en hardware in één team doen. U spreekt de engineer die het werk doet.",
   "h1":"Vier engineers in 's-Hertogenbosch",
   "intro":"Software en hardware in één team. U spreekt de engineer die het werk doet — geen accountmanager ertussen."},
   "en":{"nav":"About us", "slug":"about", "title":"About Liminex — four engineers in Den Bosch",
   "desc":"Four engineers in 's-Hertogenbosch doing software and hardware in one team. You speak to the engineer doing the work.",
   "h1":"Four engineers in 's-Hertogenbosch",
   "intro":"Software and hardware in one team. You speak to the engineer doing the work — no account manager in between."}},

 {"id":"contact","nl":{"slug":"contact", "nav":"Contact", "title":"Contact | Liminex, 's-Hertogenbosch",
   "desc":"Vertel in twee zinnen wat er moet gebeuren. Antwoord binnen één werkdag, van de engineer die het zou doen.",
   "h1":"Contact",
   "intro":"Vertel in twee zinnen wat er moet gebeuren. U krijgt binnen één werkdag antwoord van de engineer die het zou doen."},
   "en":{"nav":"Contact", "slug":"contact", "title":"Contact | Liminex, 's-Hertogenbosch",
   "desc":"Tell us in two sentences what needs to happen. You'll hear back within one working day, from the engineer who'd do it.",
   "h1":"Contact",
   "intro":"Tell us in two sentences what needs to happen. You'll hear back within one working day, from the engineer who'd do it."}},
]

def url_for(pg, lang):
    """The site-root-relative URL of a page, including BASE_PATH."""
    slug = pg[lang]["slug"]
    base = BASE_PATH + ("/" if lang == "nl" else "/en/")
    return base if not slug else base + slug + "/"

def local(url):
    """Where a page is written on disk. GitHub Pages already serves the repo at
    BASE_PATH, so dist/ is the site root and the prefix must come off again."""
    return url[len(BASE_PATH):] if BASE_PATH and url.startswith(BASE_PATH) else url

def asset(url, name):
    """Assets referenced relative to the page, so they resolve at any base path."""
    rel = local(url).strip("/")
    depth = rel.count("/") + 1 if rel else 0
    return ("../" * depth) + "assets/" + name

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

# Renders and photos for the cascade sections. Name the file after the key the page
# asks for — "how-1".."how-4" for the home process, "domain-<icon>" for each engineering
# domain (domain-mech, domain-pcb, domain-drone, ...). Any of jpg/png/webp.
# Without a file the section falls back to the line drawing, so partial sets are fine.
renders = {}
rdir = p("assets/renders")
if os.path.isdir(rdir):
    for f in sorted(os.listdir(rdir)):
        key, ext = os.path.splitext(f)
        if ext.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        mime = mimetypes.types_map.get(ext.lower(), "image/jpeg")
        renders[key] = "data:%s;base64,%s" % (
            mime, base64.b64encode(open(os.path.join(rdir, f), "rb").read()).decode())
        print("  render:", f, "(%d KB)" % (os.path.getsize(os.path.join(rdir, f)) // 1024))

favicon = "data:image/webp;base64," + base64.b64encode(
    open(p("assets/logo_mark.webp"), "rb").read()).decode()

LD = json.dumps({
    "@context": "https://schema.org", "@type": "ProfessionalService",
    "@id": SITE_URL + "/#liminex", "name": "Liminex",
    "description": PAGES[0]["en"]["desc"], "url": SITE_URL + "/",
    "email": CONTACT_EMAIL, "image": OG_IMAGE, "logo": OG_IMAGE,
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
    "var RENDERS = " + json.dumps(renders) + ";",
    "var ROUTES = " + json.dumps(ROUTES, ensure_ascii=False) + ";",
    "var FORM_ENDPOINT = " + json.dumps(FORM_ENDPOINT) + ";",
    "var FORM_KEY = " + json.dumps(FORM_KEY) + ";",
    "var CONTACT_EMAIL = " + json.dumps(CONTACT_EMAIL) + ";",
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
            '<link rel="canonical" href="%s%s">' % (SITE_ORIGIN, url),
            '<link rel="alternate" hreflang="nl" href="%s%s">' % (SITE_ORIGIN, url_for(pg, "nl")),
            '<link rel="alternate" hreflang="en" href="%s%s">' % (SITE_ORIGIN, url_for(pg, "en")),
            '<link rel="alternate" hreflang="x-default" href="%s%s">' % (SITE_ORIGIN, url_for(pg, "nl")),
            '<link rel="icon" href="%s">' % favicon,
            '<meta property="og:type" content="website">',
            '<meta property="og:site_name" content="Liminex">',
            '<meta property="og:title" content="%s">' % meta["title"],
            '<meta property="og:description" content="%s">' % meta["desc"],
            '<meta property="og:url" content="%s%s">' % (SITE_ORIGIN, url),
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
            '<a href="%s">%s</a>' % (url_for(o, lang), o[lang]["nav"])
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
                   .replace("__CSS__", asset(url, "site.css"))
                   .replace("__JS__", asset(url, "site.js"))
                   .replace("__BOOT__", json.dumps({"page": pg["id"], "lang": lang})))
        doc = ('<!doctype html>\n<html lang="%s">\n<head>\n<meta charset="utf-8">\n'
               '<meta name="viewport" content="width=device-width,initial-scale=1">\n' % lang
               + body.replace('<a class="skip"', '</head>\n<body>\n<a class="skip"', 1)
               + "\n</body>\n</html>\n")
        out = p("dist" + local(url) + "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(doc)
        written.append(url)

shutil.copy(p("assets/og.png"), p("dist/og.png"))
# AI crawlers are allowed on purpose. For a services firm, being quoted in an AI answer
# is distribution, not theft — the buyer still has to contact a human to get the work done.
# To opt out later, add Disallow: / blocks for the named agents below.
open(p("dist/robots.txt"), "w").write(
    "User-agent: *\nAllow: /\n\n"
    "# Assistants and AI search\n"
    "User-agent: GPTBot\nAllow: /\n"
    "User-agent: OAI-SearchBot\nAllow: /\n"
    "User-agent: ClaudeBot\nAllow: /\n"
    "User-agent: PerplexityBot\nAllow: /\n"
    "User-agent: Google-Extended\nAllow: /\n\n"
    "Sitemap: %s/sitemap.xml\n" % SITE_URL)

# llms.txt — a plain-text summary for assistants, so an AI answering
# "who does prototyping in Den Bosch" has something accurate to quote.
llms = ["# Liminex", "",
        "> %s" % PAGES[0]["en"]["desc"], "",
        "Engineering firm in 's-Hertogenbosch, Noord-Brabant, the Netherlands.",
        "Four engineers. Software and hardware in one team. Contact: " + CONTACT_EMAIL, "",
        "## Pages", ""]
for pg in PAGES:
    llms.append("- [%s](%s%s): %s" % (pg["en"]["nav"], SITE_ORIGIN, url_for(pg, "en"), pg["en"]["desc"]))
llms += ["", "## What we do", "",
         "- Websites, online shops, and WCAG 2.1 AA accessibility audits",
         "- AI and workflow automation for small and medium businesses",
         "- Prototyping: mechanics, electronics, PCB design, firmware, control engineering",
         "- Robotics, drones and UAV systems, CAD and design for manufacturing",
         "- Short-run manufacturing in house: 3D printing, laser cutting, small CNC", "",
         "## Pricing", "",
         "Indicative ranges are published at %s%s — no price list; a fixed price follows one "
         "conversation." % (SITE_ORIGIN, url_for([x for x in PAGES if x["id"]=="price"][0], "en")), ""]
open(p("dist/llms.txt"), "w", encoding="utf-8").write("\n".join(llms))

sm = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
      'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for pg in PAGES:
    for lang in ("nl", "en"):
        sm.append("  <url><loc>%s%s</loc>" % (SITE_ORIGIN, url_for(pg, lang)))
        for alt in ("nl", "en"):
            sm.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s%s"/>'
                      % (alt, SITE_ORIGIN, url_for(pg, alt)))
        sm.append("    <changefreq>monthly</changefreq><priority>%s</priority></url>"
                  % ("1.0" if pg["id"] == "home" else "0.8"))
sm.append("</urlset>")
open(p("dist/sitemap.xml"), "w", encoding="utf-8").write("\n".join(sm) + "\n")

open(p("dist/.nojekyll"), "w").write("")
# GitHub Pages serves this for unknown paths. Point its assets at the site root.
notfound = open(p("dist" + local(url_for(PAGES[0], "nl")) + "index.html"), encoding="utf-8").read()
notfound = (notfound.replace('href="assets/', 'href="%s/assets/' % (BASE_PATH or ""))
                    .replace('src="assets/',  'src="%s/assets/'  % (BASE_PATH or "")))
open(p("dist/404.html"), "w", encoding="utf-8").write(notfound)
if CUSTOM_DOMAIN:
    open(p("dist/CNAME"), "w").write(CUSTOM_DOMAIN + "\n")

# A single self-contained file, for previewing or emailing. Not deployed.
if "--single" in sys.argv:
    one = (open(p("dist/index.html"), encoding="utf-8").read()
           .replace('<link rel="stylesheet" href="assets/site.css">',
                    "<style>\n" + read("src/styles.css") + "\n</style>")
           .replace('<script src="assets/site.js" defer></script>',
                    "<script>\n" + open(p("dist/assets/site.js"), encoding="utf-8").read() + "\n</script>"))
    open(p("dist/single.html"), "w", encoding="utf-8").write(one)
    print("dist/single.html  %d KB" % (len(one) // 1024))

css_kb = os.path.getsize(p("dist/assets/site.css")) // 1024
js_kb = os.path.getsize(p("dist/assets/site.js")) // 1024
print("served from  %s%s/" % (SITE_ORIGIN, BASE_PATH))
print("%d pages  ·  site.css %d KB  ·  site.js %d KB" % (len(written), css_kb, js_kb))
for u in written: print("   ", u)
