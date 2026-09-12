#!/usr/bin/env python3
"""
Liminex site build.

    python3 build.py

Reads everything in src/ and assets/, writes dist/.
No dependencies, no build tools — plain Python 3.

Which file do you want?
    src/content.js    all the words, Dutch and English side by side   <- most edits live here
    src/styles.css    colours, spacing, type
    src/app.js        page layout and behaviour
    src/drawings.js   the engineering line drawings
    src/graphics.js   the wave dividers and the ripples on the home page
    src/template.html the page shell (nav, footer)
"""
import base64, os, re, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
def p(*a): return os.path.join(ROOT, *a)
def read(f): return open(p(f), encoding="utf-8").read()

# ---------------------------------------------------------------- what the site says about itself
SITE_URL   = "https://liminex.net/"
SITE_TITLE = "Liminex — engineering, prototyping and web for SMEs in Noord-Brabant"
SITE_DESC  = ("Liminex is an engineering firm in 's-Hertogenbosch. Software and hardware in one team: "
              "websites and AI, prototyping, electronics, control and CAD for SMEs in Noord-Brabant.")
OG_TITLE   = "Liminex — software and hardware in one team"
CUSTOM_DOMAIN = "liminex.net"   # written to dist/CNAME; set to "" to serve from *.github.io

# ---------------------------------------------------------------- assemble
page = (read("src/template.html")
        .replace("__STYLES__",   read("src/styles.css"))
        .replace("__ASSETS__",   read("assets/logo_assets.js"))
        .replace("__CONTENT__",  read("src/content.js"))
        .replace("__GRAPHICS__", read("src/graphics.js"))
        .replace("__DRAWINGS__", read("src/drawings.js"))
        .replace("__APP__",      read("src/app.js")))

favicon = "data:image/webp;base64," + base64.b64encode(
    open(p("assets/logo_mark.webp"), "rb").read()).decode()

HEAD = f"""<title>{SITE_TITLE}</title>
<meta name="description" content="{SITE_DESC}">
<link rel="canonical" href="{SITE_URL}">
<link rel="icon" href="{favicon}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Liminex">
<meta property="og:title" content="{OG_TITLE}">
<meta property="og:description" content="{SITE_DESC}">
<meta property="og:url" content="{SITE_URL}">
<meta property="og:image" content="{SITE_URL}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#08080B">"""
page = page.replace("<title>Liminex Site Build</title>", HEAD, 1)

doc = ('<!doctype html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
       + page.replace("<a class=\"skip\"", "</head>\n<body>\n<a class=\"skip\"", 1)
       + "\n</body>\n</html>\n")

# ---------------------------------------------------------------- write dist/
os.makedirs(p("dist"), exist_ok=True)
open(p("dist/index.html"), "w", encoding="utf-8").write(doc)
shutil.copy(p("assets/og.png"), p("dist/og.png"))
open(p("dist/robots.txt"), "w").write(
    f"User-agent: *\nAllow: /\nSitemap: {SITE_URL}sitemap.xml\n")
open(p("dist/sitemap.xml"), "w").write(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    f'  <url><loc>{SITE_URL}</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n'
    '</urlset>\n')
open(p("dist/.nojekyll"), "w").write("")   # GitHub Pages: serve files as-is
if CUSTOM_DOMAIN:
    open(p("dist/CNAME"), "w").write(CUSTOM_DOMAIN + "\n")

print(f"dist/index.html  {len(doc)//1024} KB")
