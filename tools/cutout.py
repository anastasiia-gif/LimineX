#!/usr/bin/env python3
"""
Knock the background out of a picture and drop it into assets/renders/ as a cut-out.

    pip install "rembg[cpu]" pillow
    python3 tools/cutout.py raw/how-4.png                  # -> assets/renders/how-4.png
    python3 tools/cutout.py raw/*.png raw/*.jpg            # a whole batch
    python3 tools/cutout.py raw/domain-pcb.png --max 1400  # cap the long edge

The output is a WebP with real transparency, trimmed to the object, long edge 1600 px
by default, so build.py flags it "cut-out" and the page floats it. Works best on
studio shots with a plain ground — which is what the Canva/AI prompts ask for.
"""
import os, sys
from PIL import Image, ImageFilter
from rembg import remove, new_session

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "assets", "renders")
MAX = 1600
args = [a for a in sys.argv[1:] if not a.startswith("--")]
if "--max" in sys.argv:
    MAX = int(sys.argv[sys.argv.index("--max") + 1]); args = [a for a in args if a != str(MAX)]
if not args:
    sys.exit(__doc__)

session = new_session("isnet-general-use")
os.makedirs(OUT, exist_ok=True)
for src in args:
    key = os.path.splitext(os.path.basename(src))[0]
    im = Image.open(src).convert("RGBA")
    cut = remove(im, session=session)
    # Kill near-transparent haze so the trim box hugs the object, then soften the edge a touch.
    r, g, b, a = cut.split()
    a = a.point(lambda v: 0 if v < 24 else v)
    a = a.filter(ImageFilter.GaussianBlur(0.6))
    cut = Image.merge("RGBA", (r, g, b, a))
    box = cut.getbbox()
    if not box:
        print("  !!", src, "— nothing left after removal, skipped"); continue
    pad = 12
    box = (max(0, box[0]-pad), max(0, box[1]-pad), min(cut.width, box[2]+pad), min(cut.height, box[3]+pad))
    cut = cut.crop(box)
    if max(cut.size) > MAX:
        cut.thumbnail((MAX, MAX), Image.LANCZOS)
    # WebP with alpha: a third to a fifth of the PNG size, same transparency. Any old
    # PNG of the same key is removed so the build doesn't pick up both.
    dst = os.path.join(OUT, key + ".webp")
    cut.save(dst, "WEBP", quality=88, method=6)
    for old in (".png", ".jpg", ".jpeg"):
        if os.path.exists(os.path.join(OUT, key + old)): os.remove(os.path.join(OUT, key + old))
    print("  %-22s %dx%d  %d KB" % (key + ".webp", cut.width, cut.height, os.path.getsize(dst) // 1024))
