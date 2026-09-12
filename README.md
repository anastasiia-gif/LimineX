# Liminex website

One static page, built from plain files by one Python script. No framework, no npm,
no build tools. If you can edit a text file you can edit this site.

Deployed automatically from `main` to GitHub Pages.

**20 pages**: every page has a real URL in both languages (`/prototyping/`,
`/en/prototyping/`, …), its own title, description, canonical and `hreflang`. One
JavaScript app serves all of them; `build.py` writes the shells.

---

## Editing

Almost everything you'll want to change is in **one file**:

| File | What's in it |
|---|---|
| **`src/content.js`** | **Every word on the site, Dutch and English side by side.** Start here. |
| `src/styles.css` | Colours, spacing, type. The palette is the block of `--variables` at the top. |
| `src/app.js` | Page layout and behaviour — which sections appear, in what order. |
| `src/drawings.js` | Two sets: **`DRAW`** — the big engineering line drawings (drone, valve, bracket, PCB, printer, laser, CNC, gears, antenna, bench, layout, dimensioned block), used for the drawing plates and the corner marks on each page opener. **`ICON`** — the small discipline marks used on service rows, cards and steps. |
| `src/graphics.js` | The wave dividers and the ripples on the home page. |
| `src/template.html` | The page shell: nav, footer. |
| `build.py` | **`PAGES`** — the URL, title, description and pre-JavaScript text of every page. Edit here to add a page or change a slug. Also the structured data and the domain. |
| `assets/` | Logo files and the social preview image. |

### How the copy works

Every piece of text is an object with a Dutch and an English version:

```js
lede:{nl:"Van schets naar werkend prototype.",
      en:"From sketch to working prototype."},
```

Change both, or the site will show the old wording to half its visitors.

### Adding an image to the home cards

The five cards in *What we do* on the home page show a line icon until you supply an image.

1. Export at **1600 x 1000** (16:10), JPG or WebP, 150–250 KB — the build embeds it into
   every page, so weight matters.
2. Name it `card-web`, `card-proto`, `card-make`, `card-yard` or `card-start`.
3. Drop it in **`assets/renders/`** and run `python3 build.py`. It prints what it found.

Partial sets are fine. Prompts for generating these are in the image brief in the project
docs; the process steps and the engineering domains use icons, not images.

### Adding a project screenshot

Portfolio cards show a real screenshot if there's a file for them, and a labelled
placeholder if there isn't.

1. Screenshot the site at **1440 x 900**, save as JPG (quality ~80, under ~300 KB).
2. Name it after the case's `img` key in `src/content.js` — currently `hutko` and `maks`.
3. Drop it in **`assets/work/`** → `assets/work/hutko.jpg`, `assets/work/maks.jpg`.
4. `python3 build.py`. The build embeds it and prints the size.

The cards and the Work page link out to the live sites either way.

### AI crawlers

`robots.txt` explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and
Google-Extended, and the build writes an **`llms.txt`** — a plain summary of the company,
its pages and its services for assistants to quote. That is a deliberate choice: for a
services firm, being cited in an AI answer is distribution, and the buyer still has to
contact a human to get the work done. To reverse it, add `Disallow: /` blocks for those
agents in `build.py` and delete the `llms.txt` write.

### Where the drawings appear

- **Corner marks** on every page opener except the home page: two per page, top-left and
  bottom-right, picked in `WMARKS` in `app.js`. Decorative, `aria-hidden`, positioned at
  the edges so they never sit behind the heading, and the second one is hidden below 520px.
  The framed drawing plate that used to sit mid-page was removed; `DRAW` still holds every
  drawing, so putting one back is a one-line render call.
- **Discipline icons** on service rows, cards and process steps. Each render call passes a
  list of `ICON` keys, so changing an icon is editing one array in `app.js`.

### The domains grid

`DISCIPLINES` in `content.js` — twelve engineering domains, each with an icon key, a
two-sentence description, **a worked example from a real project**, and a tool line. It
renders on the Prototyping page in place of a generic card row. Adding a domain is adding
an entry; the example is the part that does the persuading, so don't leave it empty.

### What proof shows where

`expBlock(withNext, area)` decides it, and `SHOWFOLIO` in `app.js` is the switch:

- **IT & Web** shows the two delivered websites, and no engineering work.
- **Prototyping, Manufacturing, Start-ups** show the engineering work, and no websites.
- **Project Yard and Contact** show neither — one is an idea being tested, the other is a form.
- **About and Pricing** show both.

Each engineering item lists the `areas` it belongs to, in `EXPERIENCE` in `content.js`.

### Two things worth knowing

- **Prices.** There are none anywhere, deliberately. `svcList()` in `app.js` closes every
  service list with "we don't work from a price list". Don't reintroduce prices without
  deciding that on purpose.
- **The opening.** The black panel on the home page is `position:fixed` and collapses as
  you scroll — `setupOpening` logic lives in `onScroll()` in `app.js`, which writes a `--p`
  variable (0 open, 1 closed) that `styles.css` uses for the panel height, the logo scale
  and the fade. `.opening` is the spacer that gives it scroll distance. To change how fast
  it closes, change `travel` in `onScroll()`.
- **`LINES_ABOVE_LOGO`.** The home page used to have blue lines crossing above the logo.
  They were removed in `src/graphics.js` → `overtureCurves()`. The ripples that remain
  spread from the mark. Put the loop back if you want them again.

---

## Building locally

```bash
python3 build.py                              # writes dist/
python3 -m http.server 8899 --directory dist  # then open http://localhost:8899
```

Open `dist/index.html` straight from disk and the shared CSS and JS won't load —
they're referenced from the site root. Use the server, or:

```bash
python3 build.py --single     # dist/single.html, everything inlined, for emailing
```

### Adding or renaming a page

Both live in `PAGES` in `build.py`: the `slug` sets the URL, and the `id` must match
the page id the app uses. Changing a slug changes the URL — set up a redirect or
accept the lost links.

`dist/` is generated and **not** committed — GitHub rebuilds it on every push.

---

## Deploying

Push to `main`. That's it.

`.github/workflows/deploy.yml` runs `build.py` and publishes `dist/` to GitHub Pages.
Watch it under the repo's **Actions** tab; a red cross there means the site didn't update.

**First-time setup:** repo **Settings → Pages → Source: GitHub Actions**.

### Where the site is served from

GitHub Pages serves a project repo at `https://<owner>.github.io/<repo>/`, not at the
domain root, so every URL needs that prefix. Two settings control it, and the CI workflow
sets them for you:

| | Project page (now) | Custom domain (later) |
|---|---|---|
| `SITE_ORIGIN` | `https://<owner>.github.io` | `https://liminex.net` |
| `BASE_PATH` | `/<repo>` | `/` (a bare slash means site root) |
| `CUSTOM_DOMAIN` | unset | `liminex.net` |

The workflow derives the first two from the repo automatically. **When the domain is
live**, set all three as repository variables under *Settings → Secrets and variables →
Actions → Variables* and push — nothing in the code changes.

Locally, `python3 build.py` uses the defaults at the top of the file, or environment
variables:

```bash
BASE_PATH=/ SITE_ORIGIN=https://liminex.net python3 build.py
```

### The contact form

There are two copies of the same form: the full one on the Contact page and a short one in
the footer of every other page. Both come from `contactForm(prefix, shape)` in `app.js` —
the prefix keeps their element ids apart. **Email, phone and message are required**; adding
or removing a field is editing that one function plus `C.contact.fields`.

A site on GitHub Pages is static files — there is no server, so the page cannot send
mail by itself. It posts to a form-to-email service instead, set with `FORM_ENDPOINT`.

**With no endpoint configured**, the form opens the visitor's own mail client with
everything filled in. That works, but it loses people who use webmail, so set one up.

**To set one up** (any of these, all have a free tier):

| Service | Account needed | Notes |
|---|---|---|
| [Web3Forms](https://web3forms.com) | email only | **Recommended.** Endpoint `https://api.web3forms.com/submit` plus an access key. A plain API host, so corporate DNS and ad blockers rarely touch it. |
| [Formspree](https://formspree.io) | yes | The most established; 50 submissions/month free; offers a DPA on paid plans. |
| [FormSubmit](https://formsubmit.co) | no | Quickest to set up, but the host is blocked on some corporate networks and by some ad blockers. |

Then set these repository variables (*Settings → Secrets and variables → Actions →
Variables*) and push. Nothing in the code changes:

| Variable | Value |
|---|---|
| `FORM_ENDPOINT` | `https://api.web3forms.com/submit` |
| `FORM_KEY` | the access key from Web3Forms |
| `CONTACT_EMAIL` | `anastasiia@liminex.net` (also used in the footer and structured data) |

`FORM_KEY` is posted as `access_key`, which is what Web3Forms expects. Services that don't
use a key simply ignore it — leave the variable unset.

Two things already handled: a hidden honeypot field that catches most bots, and a
status line that is announced to screen readers. One thing to decide: these services
process your visitors' messages on their servers, outside your control. For a company
that sells accessibility and compliance work, it is worth reading the provider's terms
and mentioning them if you ever publish a privacy statement.

### DNS for liminex.net

At whoever holds the DNS for liminex.net (currently pointing at Squarespace),
replace the website records with these — and **leave every other record alone**:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `<your-github-username>.github.io` |

Then repo **Settings → Pages → Custom domain** → `liminex.net` → wait for the check to
pass → tick **Enforce HTTPS** (can take up to 24 h to become available).

> **Do not delete the MX or TXT records.** They carry `anastasiia@liminex.net`, which is on every
> invoice already sent. Screenshot the existing records before changing anything. Only the
> A records and the `www` CNAME should change.

---

## Accessibility

The site is tested against WCAG 2.1 AA with axe-core: every URL in the sitemap at
desktop and mobile widths, plus the navigation dropdown open. Last run: **0 violations, 42 scans across 20 pages**.

We sell accessibility audits. Keep it at zero.

If you change colours, re-check contrast — that's where breakage happens. The dark band
accent (`--dark-accent`) sits at 9.0:1 on the dark ground and has room to spare; the light
accent does not.

---

## Checking accessibility yourself

```bash
npm install axe-core
pip install playwright && playwright install chromium
python3 build.py
python3 -m http.server 8899 --directory dist &
python3 tools/audit.py
```

Exits non-zero if anything is wrong, so it drops straight into CI when you want it there.
