"""Stitch render-plate.mjs chunk PNGs back into one image.

usage: python scripts/stitch.py <out.png>   (reads <out.png>.partNN.png, deletes them)
"""
import sys
from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None
out = Path(sys.argv[1])
parts = sorted(out.parent.glob(out.name + ".part*.png"))
ims = [Image.open(p).convert("RGB") for p in parts]
canvas = Image.new("RGB", (ims[0].width, sum(i.height for i in ims)))
y = 0
for im in ims:
    canvas.paste(im, (0, y))
    y += im.height
canvas.save(out)
for p in parts:
    p.unlink()
print(out, canvas.size)
