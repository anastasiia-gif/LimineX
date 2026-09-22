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
import base64, hashlib, json, mimetypes, os, re, shutil, sys

# Python's table does not always carry WebP, and a portfolio screenshot saved as .webp
# would then be embedded as a data: URI claiming to be a JPEG. Browsers mostly sniff
# past that; some do not. Register it once so the data URI is honest.
mimetypes.add_type("image/webp", ".webp")

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
# GitHub passes an unset repository variable as an EMPTY STRING, not as "missing", so
# os.environ.get(name, default) would hand back "" and quietly lose the default. env()
# falls back on empty values too.
def env(name, default=""):
    return (os.environ.get(name) or "").strip() or default

# Defaults are the live site on Netlify at liminex.net. The GitHub Pages workflow
# overrides all of these with its own values, so both keep working.
SITE_ORIGIN   = env("SITE_ORIGIN", "https://liminex.net")
BASE_PATH     = env("BASE_PATH", "/").rstrip("/")
CUSTOM_DOMAIN = env("CUSTOM_DOMAIN")          # writes dist/CNAME when set

# Where the contact form posts. A static site cannot send mail itself, so this is a
# form-to-email service — see the README for how to get one. Leave it empty and the
# form falls back to opening the visitor's own mail client instead.
# "netlify" means Netlify's built-in form handling (no key, no third party): the hidden
# forms in template.html register the fields, submissions land in the Netlify dashboard
# and are emailed to you. Any other value is a Web3Forms-style endpoint plus FORM_KEY.
FORM_ENDPOINT = env("FORM_ENDPOINT", "netlify")
# Web3Forms and Formspree-style services want a key posted with the form. Set it as a
# repository variable next to FORM_ENDPOINT; leave empty for services that don't use one.
FORM_KEY = env("FORM_KEY")
# Where enquiries land. Used in the footer, the form fallback and the structured data.
CONTACT_EMAIL = env("CONTACT_EMAIL", "anastasiia@liminex.net")

# Two ways this has already gone wrong once, caught here instead of on the live site.
if FORM_ENDPOINT and "formsubmit.co" in FORM_ENDPOINT:
    print("  !! FORM_ENDPOINT points at formsubmit.co. Ad blockers and filtered company\n"
          "     DNS block that host, so the form fails before it sends and the visitor\n"
          "     never reaches you. Use https://api.web3forms.com/submit with FORM_KEY.\n"
          "     Dropping the endpoint for this build; the form will open the mail client.")
    FORM_ENDPOINT = ""
if FORM_ENDPOINT == "none":          # explicit: no service, the form opens the mail client
    FORM_ENDPOINT = ""
if FORM_ENDPOINT == "netlify":
    print("  form:            Netlify Forms (built in)")
if FORM_ENDPOINT and "web3forms" in FORM_ENDPOINT and not FORM_KEY:
    print("  !! Web3Forms needs FORM_KEY. Without it every submission is rejected.\n"
          "     Dropping the endpoint for this build; the form will open the mail client.")
    FORM_ENDPOINT = ""
print("  contact address:", CONTACT_EMAIL)
print("  form endpoint:  ", FORM_ENDPOINT or "(none - form opens the mail client)")

# Statistics. Umami (umami.is) is cookieless, so it needs no cookie banner under the
# Dutch rules for analytics that "solely count visitors". Paste the website ID from the
# Umami dashboard into UMAMI_ID; leave it empty and no tracking script is added at all.
# UMAMI_SRC only needs changing if the dashboard hands you a different script URL.
UMAMI_ID  = env("UMAMI_ID")
UMAMI_SRC = env("UMAMI_SRC", "https://cloud.umami.is/script.js")
# The dashboard hands you a whole <script> tag, and pasting that in as the ID produces a
# broken tag whose website-id is the start of another tag — the site then reports nothing
# and looks fine. Pull the id out of whatever was pasted.
if UMAMI_ID and "<" in UMAMI_ID:
    _m = re.search(r'data-website-id=["\']?([0-9a-fA-F-]{36})', UMAMI_ID)
    if _m:
        UMAMI_ID = _m.group(1)
        print("  !! UMAMI_ID held a whole <script> tag; using the id inside it. Set the\n"
              "     repository variable to just the id to silence this.")
    else:
        print("  !! UMAMI_ID is not a website id and no id could be found in it.\n"
              "     Dropping it for this build; no statistics script is added.")
        UMAMI_ID = ""
# Google Search Console ownership check: the content="…" value of the HTML-tag method.
GOOGLE_SITE_VERIFICATION = env("GOOGLE_SITE_VERIFICATION")
print("  statistics:      ", ("Umami " + UMAMI_ID) if UMAMI_ID else "(off - set UMAMI_ID)")

# Pages that are built and reachable by their URL but not linked anywhere, not in the
# sitemap and marked noindex — for pages the team still has to review. Comma-separated
# page ids; set HIDDEN_PAGES="" to publish everything.
HIDDEN = [x.strip() for x in env("HIDDEN_PAGES", "about").split(",") if x.strip()]
print("  hidden pages:   ", ", ".join(HIDDEN) or "(none)")

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

 {"id":"web",   "nl":{"slug":"website-laten-maken", "nav":"Software & web", "title":"Website laten maken in Den Bosch | Liminex",
   "desc":"Websites en webshops voor het mkb in Noord-Brabant, gebouwd op WCAG 2.1 AA. Plus AI die in uw proces zit in plaats van in een browsertab.",
   "h1":"Website laten maken in Den Bosch en Noord-Brabant",
   "intro":"Websites die klanten opleveren, webshops die op elk toestel werken, en AI die in uw proces zit in plaats van in een browsertab."},
   "en":{"nav":"Software & web", "slug":"web-and-ai", "title":"Web development and AI for SMEs | Liminex",
   "desc":"Websites and online shops for SMEs in Noord-Brabant, built to WCAG 2.1 AA, plus AI that sits inside your process instead of in a browser tab.",
   "h1":"Web development and AI for SMEs in Noord-Brabant",
   "intro":"Websites that bring in customers, online shops that work on every device, and AI that sits inside your process instead of in a browser tab."}},

 {"id":"proto", "nl":{"slug":"prototyping", "nav":"Engineering", "title":"Prototype laten maken | Liminex, Noord-Brabant",
   "desc":"Van schets naar werkend prototype: mechanica, elektronica, firmware en besturing in één team, op mkb-schaal.",
   "h1":"Prototype laten maken in Noord-Brabant",
   "intro":"Van schets naar werkend prototype: mechanica, elektronica, firmware en besturing in één team, op mkb-schaal."},
   "en":{"nav":"Engineering", "slug":"prototyping", "title":"Prototyping and engineering | Liminex",
   "desc":"From sketch to working prototype: mechanics, electronics, firmware and control in one team, at SME scale.",
   "h1":"Prototyping and engineering in Noord-Brabant",
   "intro":"From sketch to working prototype: mechanics, electronics, firmware and control in one team, at SME scale."}},

 {"id":"make",  "nl":{"slug":"onderdelen-en-productie", "nav":"Productie", "title":"Onderdelen laten maken en serieproductie | Liminex",
   "desc":"Onderdelen en kleine series laten maken: wij kiezen proces en werkplaats, bewaken de kwaliteit en begeleiden grotere aantallen.",
   "h1":"Onderdelen laten maken en productie begeleiden",
   "intro":"Wij maken uw ontwerp maakbaar en laten het maken bij de werkplaats die erbij past. Grotere aantallen begeleiden we — lokaal of in het buitenland."},
   "en":{"nav":"Manufacturing", "slug":"parts-and-production", "title":"Custom parts and production support | Liminex",
   "desc":"Parts and short runs made for you: we pick the process and the workshop, check the quality, and manage larger volumes.",
   "h1":"Custom parts and production support",
   "intro":"We make your design manufacturable and have it made by the workshop that fits it. Larger volumes we manage for you, locally or abroad."}},

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

 {"id":"price", "nl":{"slug":"tarieven", "nav":"Tarieven", "title":"Website laten maken: vaste prijzen | Liminex",
   "desc":"Website laten maken tegen een vaste prijs: one-pager €950, MKB-site vanaf €2.500, webshop vanaf €4.500. Onderhoud vanaf €35 per maand.",
   "h1":"Vaste prijzen voor websites en webshops",
   "intro":"Drie pakketten, uitbreidingen en Care-abonnementen — zodat u weet wat het kost voordat u belt."},
   "en":{"nav":"Pricing", "slug":"pricing", "title":"Website pricing: fixed packages | Liminex",
   "desc":"Fixed prices for a website or online shop: one-pager from €950, SME site from €2,500, online shop from €4,500. Care plans from €35 a month.",
   "h1":"Fixed prices for websites and online shops",
   "intro":"Three packages, add-ons and Care plans — so you know what it costs before you call."}},

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

 {"id":"privacy", "nl":{"slug":"privacy", "nav":"Privacyverklaring", "title":"Privacyverklaring | Liminex",
   "desc":"Wat Liminex met uw gegevens doet: alleen wat u zelf stuurt, alleen om te antwoorden, geen volgcookies en geen doorverkoop.",
   "h1":"Privacyverklaring",
   "intro":"Wat we met uw gegevens doen, in gewone taal: alleen wat u zelf stuurt, alleen om u te antwoorden."},
   "en":{"nav":"Privacy statement", "slug":"privacy", "title":"Privacy statement | Liminex",
   "desc":"What Liminex does with your data: only what you send us, only to reply to you, no tracking cookies and nothing sold on.",
   "h1":"Privacy statement",
   "intro":"What we do with your data, in plain language: only what you send us, only to answer you."}},

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

# Renders and photos for the picture slots. Name the file after the key the page asks
# for — "how-1".."how-4" for the home process rows, "web-1".."web-3" for the IT & Web
# rows, "machine-print3d" / "machine-laser" / "machine-cnc" for the three machines, and
# "domain-<icon>" for each engineering domain. Any of jpg/png/webp; without a file the
# slot falls back to a labelled placeholder, so partial sets are fine.
#
# A PNG or WebP with a real transparent background is treated as a CUT-OUT: it is drawn
# free on the page with a soft shadow, no frame and no box, which is the look Nastia
# asked for. A JPG (or a flat PNG) gets the framed treatment instead. So the decision is
# made by the file itself — knock the background out and the page changes with it.
def has_alpha(path):
    """Does this file carry transparency? Read from the file header, so it works on the
    GitHub runner with no Pillow installed (that is exactly where it used to fail:
    without Pillow everything was silently 'framed'). Pillow, when present, refines it
    by checking that some pixels really are transparent."""
    with open(path, "rb") as fh:
        head = fh.read(64)
    alpha = False
    if head[:8] == b"\x89PNG\r\n\x1a\n":
        alpha = head[25] in (4, 6)                   # colour type: grey+alpha / RGBA
        if not alpha:
            with open(path, "rb") as fh:             # or a palette with a tRNS chunk
                alpha = b"tRNS" in fh.read(1 << 16)
    elif head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        if head[12:16] == b"VP8X":
            alpha = bool(head[20] & 0x10)            # extended header, alpha flag
        elif head[12:16] == b"VP8L":
            alpha = bool(head[24] & 0x10)            # lossless: alpha_is_used bit
    if not alpha:
        return False
    try:
        from PIL import Image
        a = Image.open(path).convert("RGBA").split()[-1]
        return a.getextrema()[0] < 250               # some genuinely transparent pixels
    except Exception:
        return True

cutouts = []
renders = {}
render_files = []
rdir = p("assets/renders")
if os.path.isdir(rdir):
    for f in sorted(os.listdir(rdir)):
        key, ext = os.path.splitext(f)
        if ext.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        full = os.path.join(rdir, f)
        # Renders are copied to dist/assets/renders/ and referenced by URL rather than
        # embedded: with twenty-odd pictures, base64 in the shared JS would put every
        # picture on every page. Root-relative so it resolves at any page depth.
        render_files.append(full)
        # Stored as a path inside assets/; app.js resolves it relative to the page the
        # same way the CSS and JS links are, so it works at any base path — GitHub
        # Pages under /LimineX, a custom domain at /, or a local preview of dist/.
        renders[key] = "renders/" + f
        cut = has_alpha(full)
        if cut:
            cutouts.append(key)
        print("  render:", f, "(%d KB)%s" % (os.path.getsize(full) // 1024,
                                             "  cut-out" if cut else "  framed"))

# One picture can stand in for several slots. A slot with its own file always wins;
# the alias only fills a slot that has none. Slots: how-*, web-*, machine-*, card-*,
# domain-<icon> for the Prototyping grid, and part-<icon> for every icon-led list on
# the site (service rows, step lists, card grids) — one part per icon name.
RENDER_ALIAS = {
    "web-1":            "card-web",        # laptop
    "web-2":            "how-1",           # phone in hand
    "machine-print3d":  "domain-print3d",
    "part-web":         "card-web",
    "part-layout":      "part-layout",
    "part-cad":         "domain-cad",
    "part-pcb":         "domain-pcb",
    "part-elec":        "domain-elec",
    "part-firmware":    "domain-firmware",
    "part-control":     "domain-control",
    "part-robot":       "domain-robot",
    "part-drone":       "domain-drone",
    "part-data":        "domain-data",
    "part-dfm":         "domain-dfm",
    "part-test":        "domain-test",
    "part-print3d":     "domain-print3d",
    "part-mech":        "domain-mech",
    "part-cnc":         "machine-cnc",
    "part-laser":       "machine-laser",
    "part-maintain":    "part-gears",
}
for slot, source in RENDER_ALIAS.items():
    if slot not in renders and source in renders:
        renders[slot] = renders[source]
        if source in cutouts:
            cutouts.append(slot)

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
    "knowsAbout": ["prototyping", "electronics", "PCB design", "firmware", "embedded systems",
                   "control systems", "drone systems", "CAD design",
                   "web development", "AI for SMEs"],
}, ensure_ascii=False)

# ---------------------------------------------------------------- write
_app_src  = read("src/app.js")
_tpl_src  = read("src/template.html")
_wanted   = set(re.findall(r'getElementById\(\s*"([^"]+)"\s*\)', _app_src))
# ids the shell provides, plus every id app.js writes into the DOM itself
_present  = set(re.findall(r'id="([^"]+)"', _tpl_src)) \
          | set(re.findall(r'id="([^"]+)"', _app_src)) | {"app"}
_missing  = sorted(_wanted - _present)
if _missing:
    raise SystemExit(
        "\nBUILD STOPPED — src/app.js and src/template.html are out of step.\n"
        "app.js looks for element id(s) the page shell does not contain:\n"
        + "".join("    #%s\n" % i for i in _missing) +
        "This happens when only some of the src/ files are updated. Replace\n"
        "app.js, content.js, styles.css and template.html together, from the\n"
        "same set, and build again.\n")

dist = p("dist")
shutil.rmtree(dist, ignore_errors=True)
os.makedirs(p("dist/assets"), exist_ok=True)
if render_files:
    os.makedirs(p("dist/assets/renders"), exist_ok=True)
    for f in render_files:
        shutil.copy(f, p("dist/assets/renders", os.path.basename(f)))

_css_body = read("src/styles.css")
_js_body = "\n".join([
    read("assets/logo_assets.js"),
    "var WORKSHOTS = " + json.dumps(shots) + ";",
    "var RENDERS = " + json.dumps(renders) + ";",
    "var CUTOUT = " + json.dumps(cutouts) + ";",
    "var ROUTES = " + json.dumps(ROUTES, ensure_ascii=False) + ";",
    "var FORM_ENDPOINT = " + json.dumps(FORM_ENDPOINT) + ";",
    "var FORM_KEY = " + json.dumps(FORM_KEY) + ";",
    "var CONTACT_EMAIL = " + json.dumps(CONTACT_EMAIL) + ";",
    "var HIDDEN = " + json.dumps(HIDDEN) + ";",
    read("src/content.js"), read("src/graphics.js"),
    read("src/drawings.js"), _app_src])

def fingerprint(body, stem, ext):
    h = hashlib.sha256(body.encode("utf-8")).hexdigest()[:8]
    name = "%s.%s.%s" % (stem, h, ext)
    open(p("dist/assets/" + name), "w", encoding="utf-8").write(body)
    return name

CSS_NAME = fingerprint(_css_body, "site", "css")
JS_NAME  = fingerprint(_js_body,  "site", "js")

tpl = read("src/template.html")
UI = {"nl": {"skip": "Naar de inhoud", "nav": "Hoofdnavigatie"},
      "en": {"skip": "Skip to content", "nav": "Main navigation"}}

# Prerender: run app.js in Node for every page and put the resulting HTML in the file,
# so crawlers that don't execute JavaScript see the whole page rather than a heading and
# one sentence. The app re-renders over it on load. Needs Node (present on GitHub Actions
# and Netlify); without it the build carries on with the short static copy.
import subprocess, tempfile
PRE = {}
if env("PRERENDER", "1") != "0" and shutil.which("node"):
    _jobs = [{"page": pg["id"], "lang": lg, "assetBase": asset(url_for(pg, lg), "")}
             for pg in PAGES for lg in ("nl", "en")]
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as _f:
        json.dump(_jobs, _f); _jobs_path = _f.name
    try:
        _r = subprocess.run(["node", p("tools/prerender.js"), p("dist/assets/" + JS_NAME), _jobs_path],
                            capture_output=True, text=True, timeout=120)
        if _r.returncode == 0:
            PRE = json.loads(_r.stdout)
            print("  prerendered:      %d pages" % len(PRE))
        else:
            print("  !! prerender failed, shipping the short static copy instead:\n" + _r.stderr[-800:])
    finally:
        os.unlink(_jobs_path)
else:
    print("  prerender:        skipped (PRERENDER=0, or no Node on this machine)")

_STATIC_MAIN = re.compile(r'(<main id="app" tabindex="-1">).*?(</main>)', re.S)

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
            ('<meta name="robots" content="noindex,nofollow">' if pg["id"] in HIDDEN else ''),
            '<script type="application/ld+json">%s</script>' % LD,
            ('<meta name="google-site-verification" content="%s">' % GOOGLE_SITE_VERIFICATION
             if GOOGLE_SITE_VERIFICATION else ''),
            # data-domains: visits to a local preview or the old github.io address are
            # not counted, only the real site.
            ('<script defer src="%s" data-website-id="%s" data-domains="%s"></script>'
             % (UMAMI_SRC, UMAMI_ID.replace('"', "&quot;"), re.sub(r"^https?://", "", SITE_ORIGIN))
             if UMAMI_ID and pg["id"] not in HIDDEN else '')])
        # A plain list of links in the markup, so a crawler that never runs the
        # JavaScript still sees the whole site. The app replaces it on load.
        staticnav = "".join(
            '<a href="%s">%s</a>' % (url_for(o, lang), o[lang]["nav"])
            for o in PAGES if o["id"] != pg["id"] and o["id"] not in HIDDEN)
        body = (tpl.replace("__HEAD__", head)
                   .replace("__STATICNAV__", staticnav)
                   .replace("__SKIP__", UI[lang]["skip"])
                   .replace("__NAVLABEL__", UI[lang]["nav"])
                   .replace("__HOME__", ROUTES[lang]["home"])
                   .replace("__NL_URL__", url_for(pg, "nl"))
                   .replace("__EN_URL__", url_for(pg, "en"))
                   .replace("__H1__", meta["h1"])
                   .replace("__INTRO__", meta["intro"])
                   .replace("__CSS__", asset(url, CSS_NAME))
                   .replace("__JS__", asset(url, JS_NAME))
                   .replace("__BOOT__", json.dumps({"page": pg["id"], "lang": lang})))
        pre = PRE.get(pg["id"] + "|" + lang)
        if pre:
            body = _STATIC_MAIN.sub(lambda m: m.group(1) + pre["main"] + m.group(2), body, 1)
            for _id, _html in pre["foot"].items():
                if _html is None: continue
                body = re.sub(r'(id="%s"[^>]*>).*?(</(?:div|p|span)>)' % re.escape(_id),
                              lambda m: m.group(1) + _html + m.group(2), body, 1, re.S)
        doc = ('<!doctype html>\n<html lang="%s">\n<head>\n<meta charset="utf-8">\n'
               '<meta name="viewport" content="width=device-width,initial-scale=1">\n' % lang
               + body.replace('<a class="skip"', '</head>\n<body>\n<a class="skip"', 1)
               + "\n</body>\n</html>\n")
        out = p("dist" + local(url) + "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(doc)
        written.append(url)

# Anything in static/ is copied to the root of the site as-is. That is where ownership
# files go — Google Search Console's googleXXXX.html, Bing's BingSiteAuth.xml — and any
# other file that has to live at a fixed URL. Subfolders are kept.
_static = p("static")
if os.path.isdir(_static):
    for _root, _dirs, _files in os.walk(_static):
        for _f in _files:
            _src = os.path.join(_root, _f)
            _dst = p("dist", os.path.relpath(_src, _static))
            os.makedirs(os.path.dirname(_dst), exist_ok=True)
            shutil.copy(_src, _dst)
            print("  static:", os.path.relpath(_dst, p("dist")))

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
    if pg["id"] in HIDDEN: continue
    llms.append("- [%s](%s%s): %s" % (pg["en"]["nav"], SITE_ORIGIN, url_for(pg, "en"), pg["en"]["desc"]))
llms += ["", "## What we do", "",
         "- Websites and online shops, built to WCAG 2.1 AA",
         "- AI and workflow automation for small and medium businesses",
         "- Prototyping: mechanics, electronics, PCB design, firmware, control engineering",
         "- Robotics, drones and UAV systems, CAD and design for manufacturing",
         "- Parts and short runs made through partner workshops; larger volumes managed in NL and abroad", "",
         ] + ([] if "price" in HIDDEN else ["## Pricing", "",
         "Fixed website packages, add-ons and Care plans are published at %s%s. Other "
         "engineering work is priced per project after one conversation." % (SITE_ORIGIN, url_for([x for x in PAGES if x["id"]=="price"][0], "en")), ""])
open(p("dist/llms.txt"), "w", encoding="utf-8").write("\n".join(llms))

sm = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
      'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for pg in PAGES:
    if pg["id"] in HIDDEN: continue
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
           .replace('<link rel="stylesheet" href="assets/%s">' % CSS_NAME,
                    "<style>\n" + _css_body + "\n</style>")
           .replace('<script src="assets/%s" defer></script>' % JS_NAME,
                    "<script>\n" + _js_body + "\n</script>"))
    open(p("dist/single.html"), "w", encoding="utf-8").write(one)
    print("dist/single.html  %d KB" % (len(one) // 1024))

css_kb = os.path.getsize(p("dist/assets/" + CSS_NAME)) // 1024
js_kb = os.path.getsize(p("dist/assets/" + JS_NAME)) // 1024
print("served from  %s%s/" % (SITE_ORIGIN, BASE_PATH))
print("%d pages  ·  %s %d KB  ·  %s %d KB" % (len(written), CSS_NAME, css_kb, JS_NAME, js_kb))
for u in written: print("   ", u)
