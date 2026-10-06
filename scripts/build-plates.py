"""Cut the rendered Frame 20 plate into per-section WebPs under src/assets/sheet/, and turn
the sprite renders into src/assets/sprites/*.webp plus the manifest src/data/sprites.json.

Inputs (all in .figma-tmp/):
  plate-1.5x.png         render-plate.mjs at 1.5x, live-nodes.json and sprites.json hidden
  sprites/               render-sprites.mjs at 1.5x
  frame20.png            Figma's own 1x render of Frame 20 (get_screenshot)
  recon-nofont-1x.png    render-plate.mjs at 1x with only the missing-font text hidden

Two headings use fonts we don't have (Amore Dreaming Signature, Amilly Signature). Their glyphs
are lifted from Figma's render: the mask is wherever Figma differs from the same render
without them, so only the lettering (and its shadow) is pasted, not the art around it.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

Image.MAX_IMAGE_PIXELS = None
root = Path(__file__).resolve().parent.parent
tmp = root / ".figma-tmp"
out_dir = root / "src/assets/sheet"
out_dir.mkdir(parents=True, exist_ok=True)

SCALE = 1.5
plate = Image.open(tmp / "plate-1.5x.png").convert("RGB")
figma = Image.open(tmp / "frame20.png").convert("RGB")
bare = Image.open(tmp / "recon-nofont-1x.png").convert("RGB")

# (x, y, w, h) in design px, padded around the Figma text boxes for shadows/swashes.
MISSING_FONT_BOXES = {
    "together": (220, 19170, 520, 280),  # 2249:281 / 2249:282
    "with-love": (200, 21160, 350, 128),  # 2249:289; stops above the live names at 21296
}

for name, (x, y, w, h) in MISSING_FONT_BOXES.items():
    f = np.asarray(figma.crop((x, y, x + w, y + h)), dtype=np.float32)
    b = np.asarray(bare.crop((x, y, x + w, y + h)), dtype=np.float32)
    diff = np.abs(f - b).max(axis=2)
    mask = Image.fromarray(np.clip((diff - 6) * 12, 0, 255).astype(np.uint8))
    mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1))
    size = (round(w * SCALE), round(h * SCALE))
    patch = figma.crop((x, y, x + w, y + h)).resize(size, Image.LANCZOS)
    plate.paste(patch, (round(x * SCALE), round(y * SCALE)), mask.resize(size, Image.LANCZOS))
    print(f"{name}: {np.count_nonzero(np.asarray(mask) > 128)} px lifted")

# Section bands in design px -- must match the `top`/`height` in src/data/sheet.ts.
BANDS = [
    ("01-hero", 0, 1149),
    ("02-quote", 1149, 3810),
    ("03-couple", 3810, 7335),
    ("04-gallery", 7335, 9134),
    ("05-video", 9134, 9554),
    ("06-events", 9554, 13878),
    ("07-gift", 13878, 15560),
    ("08-wishes", 15560, 17330),
    ("09-rsvp", 17330, 18000),
    ("10-closing", 18000, 19691),
    ("11-thanks", 19691, 21852),
]
total = 0
for name, y0, y1 in BANDS:
    band = plate.crop((0, round(y0 * SCALE), plate.width, round(y1 * SCALE)))
    path = out_dir / f"{name}.webp"
    band.save(path, "WEBP", quality=78, method=6)
    total += path.stat().st_size
    print(f"{path.name}: {band.size} {path.stat().st_size // 1024} KB")
print(f"total {total // 1024} KB")

# Sprites: trim to their painted pixels, then record the box in design px and the band
# whose coordinates the app positions them in.
sprite_dir = root / "src/assets/sprites"
sprite_dir.mkdir(parents=True, exist_ok=True)
boxes = json.loads((tmp / "sprites/boxes.json").read_text())
manifest = []
for name, b in boxes.items():
    im = Image.open(tmp / f"sprites/{name}.png").convert("RGBA")
    alpha = np.asarray(im.split()[3])
    ys, xs = np.nonzero(alpha > 2)
    # Pad the trim so a sprite's soft edge never starts on its own border.
    l, t = max(0, xs.min() - 3), max(0, ys.min() - 3)
    r, btm = min(im.width, xs.max() + 4), min(im.height, ys.max() + 4)
    im = im.crop((l, t, r, btm))
    im.save(sprite_dir / f"{name}.webp", "WEBP", quality=80, alpha_quality=80, method=6)
    x, y = b["x"] + l / SCALE, b["y"] + t / SCALE
    band = next(n for n, y0, y1 in BANDS if y0 <= y < y1)
    manifest.append({
        "name": name,
        "band": band.split("-", 1)[1],
        "x": round(x, 2),
        "y": round(y, 2),
        "w": round(im.width / SCALE, 2),
        "h": round(im.height / SCALE, 2),
        "z": b["z"],
    })
    total += (sprite_dir / f"{name}.webp").stat().st_size
(root / "src/data/sprites.json").write_text(json.dumps(manifest, indent=2) + chr(10))
print(f"{len(manifest)} sprites, total with plates {total // 1024} KB")
