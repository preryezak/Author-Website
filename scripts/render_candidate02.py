from __future__ import annotations

import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path('/home/ubuntu')
ART = ROOT / 'webdev-static-assets/unedited-christmas/candidate-02-master-art.png'
OUT_DIR = ROOT / 'webdev-static-assets/unedited-christmas/candidate-02'
OUT_DIR.mkdir(parents=True, exist_ok=True)
W, H = 2048, 3072

TITLE = 'Unedited Christmas'
SUBTITLE = 'A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance'
AUTHOR = 'ERYEZA KALALU'


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


def center_text(draw, y, text, ft, fill):
    box = draw.textbbox((0, 0), text, font=ft)
    draw.text((W // 2, y), text, font=ft, fill=fill, anchor='ma')
    return box[3] - box[1]


def multiline_center(draw, box, text, ft, fill, spacing=26):
    x0, y0, x1, y1 = box
    bbox = draw.multiline_textbbox((0, 0), text, font=ft, spacing=spacing, align='center')
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.multiline_text(((x0 + x1) / 2, (y0 + y1) / 2), text, font=ft, fill=fill, spacing=spacing, align='center', anchor='mm')


def draw_tracking_center(draw, y, text, ft, fill, tracking):
    w = sum(draw.textlength(ch, font=ft) for ch in text) + max(0, len(text) - 1) * tracking
    x = W // 2 - w // 2
    for ch in text:
        draw.text((x, y), ch, font=ft, fill=fill, anchor='la')
        x += int(draw.textlength(ch, font=ft)) + tracking


img = Image.open(ART).convert('RGB')
scale = max(W / img.width, H / img.height)
img = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
left = (img.width - W) // 2
top = (img.height - H) // 2
canvas = img.crop((left, top, left + W, top + H)).convert('RGBA')
canvas = ImageEnhance.Contrast(canvas).enhance(1.08)
canvas = ImageEnhance.Color(canvas).enhance(0.96)

# Controlled top vignette to guarantee crystal-clear title readability against vellum texture.
veil = Image.new('RGBA', (W, H), (0, 0, 0, 0))
vd = ImageDraw.Draw(veil)
for y in range(0, 1500):
    alpha = int(120 * (1 - y / 1500))
    vd.line((0, y, W, y), fill=(7, 14, 28, alpha))
canvas.alpha_composite(veil)

draw = ImageDraw.Draw(canvas)
cream = (252, 248, 238, 255)
gold = (218, 178, 98, 255)
muted = (222, 219, 210, 255)

# Commanding Title Hierarchy: matches the visual authority of The Influential Spirit.
center_text(draw, 200, 'Unedited', f(SERIF, 260), cream)
center_text(draw, 495, 'Christmas', f(SERIF, 280), cream)

# Refined editorial divider rule with gold pinstripe and center diamond.
draw.line((460, 835, 1588, 835), fill=gold, width=3)
draw.ellipse((1018, 823, 1030, 835), fill=gold)

# Exact Two-Line Subtitle: perfectly proportioned and subordinate to the title.
subtitle = 'A 24-Day Advent Devotional\nfor Finding Peace Beyond Holiday Performance'
multiline_center(draw, (180, 895, 1868, 1260), subtitle, f(SANS, 56), muted, spacing=26)

# Author Lock-up: authoritative spaced capitals anchored in the quiet lower third.
draw_tracking_center(draw, 2740, AUTHOR, f(SANS, 72), cream, 18)

out = OUT_DIR / 'unedited-christmas-candidate-02.jpg'
canvas.convert('RGB').save(out, quality=98, subsampling=0, optimize=True)
print('Rendered Candidate 2 Master:', out)
