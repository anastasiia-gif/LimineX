Drop photos or renders here and rebuild — they are picked up by filename.

  Home page rows     how-1      how-2      how-3      how-4
  IT & Web rows      web-1      web-2      web-3
  Manufacturing      machine-print3d       machine-laser      machine-cnc
  Domain tiles       domain-mech, domain-pcb, domain-drone, domain-cad, ...

jpg, png or webp. Any file that is missing falls back to the grey placeholder,
so you can add them one at a time.

CUT-OUT vs FRAMED — decided by the file, not by the code:
  a PNG or WebP with a transparent background  -> drawn free on the page,
                                                  no frame, soft shadow
  a JPG, or a PNG with a solid background      -> drawn inside a frame

So to turn a picture into a floating object, knock its background out and save
it as PNG. `python3 build.py` prints "cut-out" or "framed" for every file it
picks up, so you can check without opening the site.
