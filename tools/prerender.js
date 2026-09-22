/* Prerender — runs the site's own app.js in Node at build time and returns the HTML each
   page would render in the browser, so the published files carry the full text instead
   of a 70-word stub. Search engines that skip JavaScript (Bing, DuckDuckGo) and AI
   crawlers (GPTBot, ClaudeBot, PerplexityBot) then read the same page a visitor sees.

   No dependencies: a stub DOM is enough because every render*() function in app.js only
   builds strings. Called by build.py; if Node is missing the build simply skips it.

     node tools/prerender.js dist/assets/site.<hash>.js jobs.json  ->  JSON on stdout
*/
"use strict";
const fs = require("fs"), vm = require("vm");
const [, , jsPath, jobsPath] = process.argv;
const jobs = JSON.parse(fs.readFileSync(jobsPath, "utf8"));
let src = fs.readFileSync(jsPath, "utf8");
/* Stop before the browser boot: render(false), the loader, event wiring that needs a page. */
const cut = src.lastIndexOf('if(typeof BOOT!=="undefined")');
if (cut > 0) src = src.slice(0, cut);

/* A value that absorbs anything: any property, call or construction returns itself, and
   it turns into an empty string when concatenated. Enough for top-level wiring code. */
function absorb() {
  const f = function () {};
  const p = new Proxy(f, {
    get(_, k) {
      if (k === Symbol.toPrimitive) return () => "";
      if (k === "then") return undefined;
      if (k === "length") return 0;
      return p;
    },
    set() { return true; }, apply() { return p; }, construct() { return p; }
  });
  return p;
}
/* Elements the app writes into by id are recorded, so nav and footer can be captured. */
const els = {};
function el(id) {
  if (els[id]) return els[id];
  const store = { id: id };
  els[id] = new Proxy(store, {
    get(t, k) { return k in t ? t[k] : absorb(); },
    set(t, k, v) { t[k] = v; return true; }
  });
  return els[id];
}
const noop = () => {};
const document = {
  getElementById: el, querySelector: () => null, querySelectorAll: () => [],
  addEventListener: noop, removeEventListener: noop, createElement: absorb,
  documentElement: absorb(), body: absorb(), activeElement: null
};
const ctx = {
  document, console, URL, Promise, Math, JSON, Date, String, Number, Array, Object, RegExp,
  location: { href: "https://example.org/", pathname: "/", hostname: "example.org" },
  history: { pushState: noop, replaceState: noop },
  navigator: { userAgent: "prerender" },
  innerHeight: 800, innerWidth: 1280, scrollY: 0,
  addEventListener: noop, removeEventListener: noop, scrollTo: noop,
  matchMedia: () => ({ matches: false, addEventListener: noop }),
  sessionStorage: { getItem: () => null, setItem: noop },
  localStorage: { getItem: () => null, setItem: noop },
  setTimeout: noop, clearTimeout: noop, setInterval: noop, requestAnimationFrame: noop,
  IntersectionObserver: function () { return { observe: noop, unobserve: noop, disconnect: noop }; },
  Image: function () { return {}; }, fetch: () => new Promise(noop)
};
ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: "site.js" });

/* Big data: URIs (the hero logo, portfolio screenshots) would put ~150 KB into every
   page's HTML. The app swaps the real image in on load; the file keeps the alt text. */
const PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const slim = h => String(h).replace(/src="data:[^"]{400,}"/g, 'src="' + PIXEL + '"');

const out = {};
for (const j of jobs) {
  vm.runInContext(
    "page=" + JSON.stringify(j.page) + ";lang=" + JSON.stringify(j.lang) +
    ";ASSET_BASE=" + JSON.stringify(j.assetBase) + ";", ctx);
  for (const k in els) delete els[k];
  /* Same dispatch as render() in app.js. A page that throws is skipped rather than
     failing the build: that one file keeps the short static copy. */
  let main;
  try {
    main = vm.runInContext(
      'page==="home"?renderHome():page==="about"?renderAbout():page==="work"?renderWork():' +
      'page==="price"?renderPrice():page==="contact"?renderContact():' +
      'page==="privacy"?renderPrivacy():renderArea(page)', ctx);
  } catch (e) {
    process.stderr.write("prerender: skipped " + j.page + "/" + j.lang + " - " + e.message + "\n");
    continue;
  }
  try { vm.runInContext("renderFooter()", ctx); } catch (e) { /* footer is optional */ }
  const rec = {};
  for (const id of ["f-work", "f-more", "f-seo", "f-h1", "f-h2", "f-h3", "f-legal", "foot-tag"]) {
    const e = els[id];
    if (e) rec[id] = typeof e.innerHTML === "string" ? e.innerHTML
                   : typeof e.textContent === "string" ? escapeHtml(e.textContent) : null;
  }
  out[j.page + "|" + j.lang] = { main: slim(main), foot: rec };
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
process.stdout.write(JSON.stringify(out));
