from __future__ import annotations

import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

ROOT = Path('/home/ubuntu')
ART = ROOT / 'webdev-static-assets/unedited-christmas/cover-variation-01-midnight-warmth-art.png'
OUT_DIR = ROOT / 'webdev-static-assets/unedited-christmas/candidate-01'
OUT_DIR.mkdir(parents=True, exist_ok=True)
W, H = 2048, 3072

TITLE = 'Unedited Christmas'
SUBTITLE = 'A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance'
AUTHOR = 'ERYEZA KALALU'
CATEGORY = 'ADVENT DEVOTIONAL'


def font_path(query: str, fallback: str) -> str:
    try:
        p = subprocess.check_output(['fc-match', '-f', '%{file}', query], text=True).strip()
        if p and Path(p).exists():
            return p
    except Exception:
        pass
    return fallback

SERIF = '/home/ubuntu/webdev-static-assets/fonts/CormorantGaramond-Regular.ttf'
SANS = '/home/ubuntu/webdev-static-assets/fonts/DMSans-Regular.ttf'


def f(path: str, size: int):
    return ImageFont.truetype(path, size)


def tracking_width(draw, text, ft, tracking):
    return int(sum(draw.textlength(ch, font=ft) for ch in text) + max(0, len(text) - 1) * tracking)


def draw_tracking_center(draw, y, text, ft, fill, tracking):
    x = W // 2 - tracking_width(draw, text, ft, tracking) // 2
    for ch in text:
        draw.text((x, y), ch, font=ft, fill=fill, anchor='la')
        x += int(draw.textlength(ch, font=ft)) + tracking


def center(draw, y, text, ft, fill):
    box = draw.textbbox((0, 0), text, font=ft)
    draw.text((W // 2, y), text, font=ft, fill=fill, anchor='ma')
    return box[3] - box[1]


def multiline_center(draw, box, text, ft, fill, spacing=26):
    x0, y0, x1, y1 = box
    bbox = draw.multiline_textbbox((0, 0), text, font=ft, spacing=spacing, align='center')
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.multiline_text(((x0 + x1) / 2, (y0 + y1) / 2), text, font=ft, fill=fill, spacing=spacing, align='center', anchor='mm')


img = Image.open(ART).convert('RGB')
scale = max(W / img.width, H / img.height)
img = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
left = (img.width - W) // 2
top = (img.height - H) // 2
canvas = img.crop((left, top, left + W, top + H)).convert('RGBA')
canvas = ImageEnhance.Contrast(canvas).enhance(1.05)
canvas = ImageEnhance.Color(canvas).enhance(0.94)

# A restrained upper veil protects exact typography without flattening the candle and wood texture.
veil = Image.new('RGBA', (W, H), (0, 0, 0, 0))
vd = ImageDraw.Draw(veil)
for y in range(0, 1800):
    alpha = int(95 * (1 - y / 1800))
    vd.line((0, y, W, y), fill=(3, 10, 22, alpha))
canvas.alpha_composite(veil)

draw = ImageDraw.Draw(canvas)
cream = (249, 246, 235, 255)
gold = (223, 177, 83, 255)
muted = (210, 208, 198, 255)

# Small category marker gives clear Advent shelf signaling without holiday clip art.
draw_tracking_center(draw, 220, CATEGORY, f(SANS, 48), gold, 12)

# Large title with restrained two-line editorial hierarchy.
center(draw, 500, 'Unedited', f(SERIF, 240), cream)
center(draw, 775, 'Christmas', f(SERIF, 260), cream)

draw.line((450, 1140, 1598, 1140), fill=gold, width=3)
# Fine center ornament, intentionally abstract and non-generic.
draw.ellipse((1018, 1128, 1030, 1140), fill=gold)
draw.line((985, 1140, 1063, 1140), fill=gold, width=3)

subtitle = 'A 24-DAY ADVENT DEVOTIONAL\nFOR FINDING PEACE BEYOND\nHOLIDAY PERFORMANCE'
multiline_center(draw, (180, 1200, 1868, 1640), subtitle, f(SANS, 57), muted, spacing=28)

# Author credit sits in a quiet lower-left zone, away from the candle and table edge.
draw_tracking_center(draw, 2740, AUTHOR, f(SANS, 68), cream, 17)

# Safe margin guide is represented only by spacing; no visible border or mockup edge.
out = OUT_DIR / 'unedited-christmas-candidate-01-midnight-warmth.jpg'
canvas.convert('RGB').save(out, quality=97, subsampling=0, optimize=True)
print(out)
print('Dimensions:', canvas.size)
print('Font pairing:', SERIF, '+', SANS)
print('Locked copy:', TITLE, '|', SUBTITLE, '|', AUTHOR)
