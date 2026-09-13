# Putting liminex.net live on Netlify

Netlify hosts the static site for free, handles the contact form itself (no third-party
key), and gives you HTTPS on liminex.net. No git needed.

## 1. Build

    python3 build.py

Defaults are already liminex.net at the site root and Netlify form handling, so nothing
to set. `dist/` is the site.

## 2. Deploy (drag and drop)

1. app.netlify.com → Sign up (email is fine).
2. "Add new site" → "Deploy manually" → drag the `dist` folder onto the page.
3. You get a `something.netlify.app` URL. Check it.

Every later update: build again, open the site in Netlify → "Deploys" → drag `dist`
onto the page again.

## 3. Domain

1. Site → "Domain management" → "Add a domain" → liminex.net.
2. Netlify shows two DNS records. At the registrar where you bought liminex.net:
   - `A`      `@`    →  `75.2.60.5`
   - `CNAME`  `www`  →  `<your-site>.netlify.app`
   (Or move the nameservers to Netlify's; either works.)
3. Wait for DNS (minutes to a few hours). Netlify issues the HTTPS certificate itself.

## 4. Form notifications

Site → "Forms" → you should see `contact` and `interest` after the first deploy.
"Form notifications" → "Email notification" → anastasiia@liminex.net.
Free tier: 100 submissions/month, then it queues. Spam is filtered by the honeypot field.

Test it: send one message through the live contact page; it appears under Forms and in
your inbox within a minute.

## GitHub Pages

Still works unchanged: the workflow passes its own SITE_ORIGIN/BASE_PATH, and there the
form falls back to opening the visitor's mail client (Pages has no form handling).
