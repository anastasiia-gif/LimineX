#!/usr/bin/env python3
"""
Accessibility audit — WCAG 2.1 AA via axe-core.

    pip install playwright && playwright install chromium
    npm install axe-core
    python3 tools/audit.py

Walks every page in both languages at desktop and mobile widths, plus the nav
dropdown open, and reports violations, JavaScript errors and horizontal overflow.
Run it before every deploy that touches colours or markup. It should print 0.
"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
AXE  = ROOT / "node_modules/axe-core/axe.min.js"
PAGE = ROOT / "dist/index.html"
PAGES = ["home","web","proto","make","yard","start","work","about","contact"]
VIEWPORTS = [{"width":1440,"height":900}, {"width":390,"height":844}]
TAGS = ["wcag2a","wcag2aa","wcag21a","wcag21aa"]

if not AXE.exists(): sys.exit("axe-core not found — run: npm install axe-core")
if not PAGE.exists(): sys.exit("dist/index.html not found — run: python3 build.py")

axe = AXE.read_text()
url = PAGE.as_uri()
total, scans, errors, overflow = 0, 0, [], []

with sync_playwright() as p:
    browser = p.chromium.launch()
    for vp in VIEWPORTS:
        page = browser.new_page(viewport=vp)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(url)
        for lang in ("nl","en"):
            page.evaluate("l => document.querySelector('[data-lang='+l+']').click()", lang)
            for name in PAGES:
                page.evaluate("""id => {
                    let b = document.querySelector('[data-go='+id+']');
                    if (!b) { document.getElementById('ddbtn').click();
                              b = document.querySelector('#ddmenu [data-go='+id+']'); }
                    b.click();
                }""", name)
                page.wait_for_timeout(3000)          # let the reveal animation settle
                page.evaluate(axe)
                res = page.evaluate("axe.run(document,{runOnly:{type:'tag',values:%s}})" % json.dumps(TAGS))
                scans += 1
                if page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"):
                    overflow.append((name, lang, vp["width"]))
                for v in res["violations"]:
                    total += len(v["nodes"])
                    print(f'{vp["width"]:>5}  {lang}  {name:<9} {v["id"]:<22} {v["impact"]:<8} '
                          f'{len(v["nodes"])}x  {v["nodes"][0]["html"][:90]}')
        page.close()
    browser.close()

print(json.dumps({"scans":scans, "violations":total,
                  "js_errors":errors, "overflow":overflow}, indent=2))
sys.exit(1 if (total or errors or overflow) else 0)
