#!/usr/bin/env python3
"""
Accessibility audit — WCAG 2.1 AA via axe-core, across every real URL.

    npm install axe-core
    pip install playwright && playwright install chromium
    python3 build.py
    python3 -m http.server 8899 --directory dist &
    python3 tools/audit.py

Checks every page in both languages at desktop and mobile widths, plus the nav
dropdown open, and reports violations, JavaScript errors and horizontal overflow.
Exits non-zero if anything is wrong.
"""
import json, pathlib, re, sys, urllib.parse, urllib.request
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
AXE  = ROOT / "node_modules/axe-core/axe.min.js"
# Pass the URL the site is actually served at, including any base path:
#     python3 tools/audit.py http://localhost:8899/LimineX
SITE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8899").rstrip("/")
ORIGIN = "{0.scheme}://{0.netloc}".format(urllib.parse.urlparse(SITE))
VIEWPORTS = [{"width": 1440, "height": 900}, {"width": 390, "height": 844}]
TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]

if not AXE.exists():
    sys.exit("axe-core not found — run: npm install axe-core")

try:
    sitemap = urllib.request.urlopen(SITE + "/sitemap.xml", timeout=5).read().decode()
except Exception as e:
    sys.exit("can't reach %s/sitemap.xml (%s) — is the server running?" % (SITE, e))
urls = [re.sub(r"^https?://[^/]+", "", u) for u in re.findall(r"<loc>(.*?)</loc>", sitemap)]

axe = AXE.read_text()
total, scans, errors, overflow = 0, 0, [], []

with sync_playwright() as p:
    browser = p.chromium.launch()
    for vp in VIEWPORTS:
        page = browser.new_page(viewport=vp)
        page.on("pageerror", lambda e: errors.append(str(e)))
        # Don't wait on the webfont CDN — it makes a 20-page sweep take minutes and
        # tells us nothing about accessibility.
        page.route("**://fonts.googleapis.com/**", lambda r: r.abort())
        page.route("**://fonts.gstatic.com/**", lambda r: r.abort())
        for path in urls:
            page.goto(ORIGIN + path)
            page.wait_for_timeout(2200)          # let the reveal animation settle
            page.evaluate(axe)
            res = page.evaluate("axe.run(document,{runOnly:{type:'tag',values:%s}})" % json.dumps(TAGS))
            scans += 1
            if page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"):
                overflow.append((path, vp["width"]))
            for v in res["violations"]:
                total += len(v["nodes"])
                print("%5d  %-26s %-22s %-8s %dx  %s" % (
                    vp["width"], path, v["id"], v["impact"], len(v["nodes"]),
                    v["nodes"][0]["html"][:80]))
        # dropdown open
        page.goto(SITE + "/")
        page.wait_for_timeout(2000)
        page.evaluate("document.getElementById('ddbtn').click()")
        page.wait_for_timeout(400)
        page.evaluate(axe)
        res = page.evaluate("axe.run(document,{runOnly:{type:'tag',values:%s}})" % json.dumps(TAGS))
        scans += 1
        for v in res["violations"]:
            total += len(v["nodes"])
            print("%5d  %-26s %-22s %-8s %dx" % (vp["width"], "(dropdown open)", v["id"], v["impact"], len(v["nodes"])))
        page.close()
    browser.close()

print(json.dumps({"pages": len(urls), "scans": scans, "violations": total,
                  "js_errors": errors, "overflow": overflow}, indent=2))
sys.exit(1 if (total or errors or overflow) else 0)
