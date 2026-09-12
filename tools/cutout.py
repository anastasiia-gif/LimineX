#!/usr/bin/env python3
"""
Knock the background out of a picture and drop it into assets/renders/ as a cut-out.

    pip install "rembg[cpu]" pillow
    python3 tools/cutout.py raw/how-4.png                  # -> assets/renders/how-4.png
    python3 tools/cutout.py raw/*.png raw/*.jpg            # a whole batch
    python3 tools/cutout.py raw/domain-pcb.png --max 1400  # cap the long edge
    python3 tools/cutout.py raw/how-1.png --hard           # if a grey haze/shadow survives

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
HARD = "--hard" in sys.argv     # clamp faint alpha harder: kills retained table shadows
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
    if HARD:
        a = a.point(lambda v: 0 if v < 70 else min(255, int((v - 70) * 255 / 185)))
    else:
        a = a.point(lambda v: 0 if v < 24 else v)
    a = a.filter(ImageFilter.GaussianBlur(0.6))
    cut = Image.merge("RGBA", (r, g, b, a))
    box = cut.getbbox()
    if not box:
        print("  !!", src, "— nothing left after removal, skipped"); continue
    # Where the object runs off the photo (a hand entering from the top, a wrist at the
    # left edge) the cut would show a hard straight line. Fade the alpha out over that
    # edge so it dissolves instead.
    W, H = cut.size; fade = int(min(W, H) * 0.14)
    r, g, b, a = cut.split()
    if fade:
        edges = {"top": box[1] <= 2, "left": box[0] <= 2, "bottom": box[3] >= H-2, "right": box[2] >= W-2}
        if any(edges.values()):
            ramp = Image.new("L", (W, H), 255)
            px = ramp.load()
            for y in range(H):
                for x in range(W):
                    v = 255
                    if edges["top"] and y < fade:       v = min(v, int(255*y/fade))
                    if edges["bottom"] and y >= H-fade: v = min(v, int(255*(H-1-y)/fade))
                    if edges["left"] and x < fade:      v = min(v, int(255*x/fade))
                    if edges["right"] and x >= W-fade:  v = min(v, int(255*(W-1-x)/fade))
                    if v < 255: px[x, y] = v
            from PIL import ImageChops
            a = ImageChops.multiply(a, ramp)
            cut = Image.merge("RGBA", (r, g, b, a))
            print("     faded edge:", ", ".join(k for k, v in edges.items() if v))
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
