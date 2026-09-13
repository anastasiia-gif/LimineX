# liminex.net — GitHub → Netlify, step by step

Push to GitHub; Netlify notices, runs `python3 build.py`, publishes `dist/`. About a
minute per deploy. Nothing to upload by hand, ever.

## A. One-time setup (15 minutes)

### 1. Repo
The repo you already push to (anastasiia-gif/LimineX) is fine. Make sure this version
is committed and pushed:

    git add -A
    git commit -m "Netlify deploy, hidden pages, content round"
    git push

### 2. Netlify account and site
1. app.netlify.com → Sign up **with GitHub** (that is what lets it read the repo).
2. "Add new site" → "Import an existing project" → GitHub → authorise → pick `LimineX`.
3. Build settings are read from `netlify.toml` in the repo, so the form is pre-filled:
   build command `python3 build.py`, publish directory `dist`. Leave as is.
4. "Deploy". Watch the log; the last lines should be `20 pages · site.….css …`.
5. You get `https://<random-name>.netlify.app`. Open it, click around. This is the site.
   (Site configuration → "Change site name" if you want a nicer temporary name.)

### 3. Domain
1. Site → "Domain management" → "Add a domain" → `liminex.net` → "Add domain".
   Also add `www.liminex.net` when it asks.
2. Netlify shows what to set at your registrar (where you bought liminex.net). Two options:

   **Option 1 (simplest): Netlify DNS.** Click "Set up Netlify DNS", and at the registrar
   replace the nameservers with the four `dns1.p0x.nsone.net`-style names it shows.
   Netlify then manages everything, including the www redirect.

   **Option 2: keep your registrar's DNS.** Add two records there:
   - `A`      host `@`     value `75.2.60.5`
   - `CNAME`  host `www`   value `<your-site>.netlify.app`

3. Wait. Usually minutes, at most a day. When Domain management shows a green tick,
   Netlify issues the HTTPS certificate on its own ("HTTPS" → "Verify DNS configuration"
   if it doesn't do it automatically). Set `liminex.net` as the primary domain.

### 4. Turn off GitHub Pages
Repo → Settings → Pages → Source: "None". Otherwise every push also deploys the old
copy at anastasiia-gif.github.io/LimineX. (Or leave it; it does no harm, it just costs a
minute of Actions time per push.)

## B. Every update after that

    python3 build.py               # optional: check locally first
    git add -A && git commit -m "what changed" && git push

Netlify → Deploys shows it building, then "Published". Hard-refresh the site.

## C. Contact form — configuration

Nothing to configure in code: the form posts to Netlify's built-in form handling.
Netlify discovers the two forms (`contact`, `interest`) from the HTML on the first deploy.

1. Site → "Forms". You should see `contact` and `interest` listed. If not, the first
   deploy predates the forms: trigger "Deploys → Trigger deploy → Clear cache and deploy".
2. "Forms" → "Form notifications" → "Add notification" → "Email notification" →
   event "New form submission", form `contact`, email `anastasiia@liminex.net`. Save.
   Repeat for `interest`.
3. Free tier: 100 submissions per month across both forms, then Netlify queues them and
   asks you to upgrade (€19/month). For a company site that is a good problem to have.

## D. Contact form — testing

1. Open the live site (the `.netlify.app` URL is enough; the domain doesn't matter).
2. Contact page → fill Email, Phone and Message (the three required ones), send.
3. You should see the green "Sent." line under the button within a second.
4. Netlify → Forms → `contact` → the submission is listed with every field.
5. Your inbox gets the email within a minute (check spam the first time and mark it
   safe).
6. Send one from the small form in the footer of another page as well; it uses the same
   form, so it should appear in the same list.
7. Project Yard page → "Yes, I'd be interested" → enter an address → it shows up under
   `interest`.
8. Negative test: fill nothing and press send → red "please fill in…" line, nothing
   sent. Fill the hidden honeypot? You can't from the page, which is the point: bots that
   do get discarded by Netlify silently.

If step 3 shows the red "could not send" line instead: Forms weren't detected on that
deploy. Redeploy with cleared cache (step C.1) and try again.

## E. Hidden pages (Pricing, About us)
They are built and reachable, but not linked anywhere, not in the sitemap, and marked
noindex. Share the URLs with the team directly:

    https://liminex.net/en/pricing/     https://liminex.net/tarieven/
    https://liminex.net/en/about/       https://liminex.net/over-ons/

To publish them, remove them from `HIDDEN_PAGES` in `netlify.toml`
(set it to an empty string) and push.
