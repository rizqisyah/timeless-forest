"""Turn get_design_context's React+Tailwind reference into a static HTML page.

The page reproduces Figma's layer stack in Chromium so plates can be rendered with the
live-text layers hidden (see render-plate.mjs). It is a build tool only; nothing here ships.

usage: python scripts/tsx-to-html.py .figma-ref/frame20-context.tsx .figma-tmp/frame20.html
"""
import html
import re
import sys
import subprocess
from pathlib import Path

src, out = Path(sys.argv[1]), Path(sys.argv[2])
code = src.read_text(encoding="utf-8")

prefix = re.search(r'const assetPathPrefix = "([^"]+)"', code).group(1)
# Assets are mirrored into .figma-tmp/assets (the MCP URLs expire after 7 days, and CSS masks
# need same-origin images); render-plate.mjs serves the project root over http.
root = Path(__file__).resolve().parent.parent
local = root / ".figma-tmp/assets"
local.mkdir(parents=True, exist_ok=True)
assets = {}
for name, path in re.findall(r"const (\w+) = `\$\{assetPathPrefix\}(/[^`]+)`;", code):
    f = local / path.lstrip("/")
    if not f.exists() or f.stat().st_size == 0:
        # urllib gets an empty 200 from this endpoint; curl gets the bytes.
        subprocess.run(["curl", "-sSLf", "-o", str(f), prefix + path], check=True)
    assets[name] = "/.figma-tmp/assets" + path

# The BxsCopy helper component, inlined.
bxs = re.search(r'src=\{(imgBxsCopy)\}', code).group(1)
jsx = code[code.index("export default function"):]
jsx = jsx[jsx.index("return (") + len("return ("): jsx.rindex(");")]

jsx = re.sub(
    r'<BxsCopy className="([^"]+)" />',
    lambda m: f'<div class="{m[1]}" data-node-id="2239:181"><img class="absolute block inset-0 max-w-none size-full" src="{assets[bxs]}"></div>',
    jsx,
)
jsx = jsx.replace("className=", "class=")
jsx = re.sub(r"src=\{(\w+)\}", lambda m: f'src="{assets[m[1]]}"', jsx)


# Figma's background blur only acts behind the layer's opaque pixels; a bare CSS
# backdrop-filter blurs the whole box. Mask a blurred backdrop layer with the image itself.
def backdrop(m):
    cls, radius, rest, url = m[1], m[2], m[3], m[4]
    fit = "cover" if "object-cover" in cls + rest else "100% 100%"
    mask = f"url({url}) center/{fit} no-repeat"
    layer = f'<div class="absolute inset-0" style="backdrop-filter:blur({radius});-webkit-mask:{mask};mask:{mask}"></div>'
    return layer + f'<img alt="" class="{cls}{rest}" src="{url}" />'


jsx = re.sub(r'<img alt="" class="([^"]*?)backdrop-blur-\[([^\]]+)\]([^"]*)" src="([^"]+)" />', backdrop, jsx)
jsx = jsx.replace('style={{ containerType: "size" }}', 'style="container-type:size"')
jsx = jsx.replace("style={{ fontVariationSettings: '\"wdth\" 100' }}", "")


def literal(m):
    s = re.sub(r"\\u([0-9A-Fa-f]{4})", lambda u: chr(int(u[1], 16)), m[1])
    return html.escape(s, quote=False)


jsx = re.sub(r"\{`(.*?)`\}", literal, jsx, flags=re.S)
# JSX self-closing divs are not valid HTML.
jsx = re.sub(r"<(div|p)([^<>]*?)\s*/>", r"<\1\2></\1>", jsx)


# font-['Family:Style'] -> data-ff, resolved by the inline script below.
def font(m):
    cls = m[1]
    f = re.search(r"font-\['([^']+)'\]", cls)
    if not f:
        return m[0]
    cls = cls.replace(f[0], "")
    return f'class="{cls}" data-ff="{f[1]}"'


jsx = re.sub(r'class="([^"]*)"', font, jsx)

fonts = "/src/assets/fonts"
page = f"""<!doctype html>
<html><head><meta charset="utf-8">
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Cormorant&family=Cormorant+Infant&family=Ibarra+Real+Nova:ital@0;1&family=Crimson+Text&family=Bellefair&family=Abhaya+Libre:wght@800&family=Roboto&display=block">
<style>
@font-face {{ font-family: "Cavilenny"; src: url("{fonts}/cavilenny-regular.otf"); }}
@font-face {{ font-family: "Roben Elegante"; src: url("{fonts}/roben-elegante-script.ttf"); }}
@font-face {{ font-family: "Visia Pro"; font-weight: 900; src: url("{fonts}/visia-pro-heavy.ttf"); }}
@font-face {{ font-family: "Visia Pro"; font-weight: 600; src: url("{fonts}/visia-pro-semibold.ttf"); }}
html, body {{ margin: 0; padding: 0; }}
#frame {{ position: relative; width: 747px; height: 21852px; overflow: hidden; }}
.plate-hide {{ visibility: hidden !important; }}
</style></head>
<body><div id="frame">{jsx}</div>
<script>
const weights = {{ Heavy: 900, SemiBold: 600, ExtraBold: 800 }};
for (const el of document.querySelectorAll('[data-ff]')) {{
  const [fam, style] = el.dataset.ff.split(':');
  let family = fam.replace(/_/g, ' ');
  if (family === 'Abhaya Libre ExtraBold') {{ family = 'Abhaya Libre'; el.style.fontWeight = 800; }}
  el.style.fontFamily = `"${{family}}"`;
  if (weights[style]) el.style.fontWeight = weights[style];
  if (/Italic/.test(style)) el.style.fontStyle = 'italic';
}}
</script></body></html>"""
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(page, encoding="utf-8")
print(f"{len(assets)} assets -> {out}")
