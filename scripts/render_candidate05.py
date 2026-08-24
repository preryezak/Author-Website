from __future__ import annotations

import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path('/home/ubuntu')
ART = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-reordered-master-art.png'
OUT_DIR = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-smallcaps'
OUT_DIR.mkdir(parents=True, exist_ok=True)
W, H = 2048, 3072

TITLE = 'Unedited Christmas'
SUBTITLE = 'A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance'
AUTHOR = 'ERYEZA KALALU'

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
    draw.multiline_text(((x0 + x1) / 2, (y0 + y1) / 2), text, font=ft, fill=fill, spacing=spacing, align='center', anchor='mm')


def draw_tracking_center(draw, y, text, ft, fill, tracking):
    w = sum(draw.textlength(ch, font=ft) for ch in text) + max(0, len(text) - 1) * tracking
    x = W // 2 - w // 2
    for ch in text:
        draw.text((x, y), ch, font=ft, fill=fill, anchor='la')
        x += int(draw.textlength(ch, font=ft)) + tracking


def draw_justified_center(draw, y, text, ft, fill, target_width):
    base_width = sum(draw.textlength(ch, font=ft) for ch in text)
    tracking = (target_width - base_width) / max(1, len(text) - 1)
    x = W / 2 - target_width / 2
    for ch in text:
        draw.text((x, y), ch, font=ft, fill=fill, anchor='ma')
        x += draw.textlength(ch, font=ft) + tracking


def draw_caps_center(draw, y, text, ft, fill, tracking):
    caps = text.upper()
    width = sum(draw.textlength(ch, font=ft) for ch in caps) + max(0, len(caps) - 1) * tracking
    x = W / 2 - width / 2
    for ch in caps:
        draw.text((x, y), ch, font=ft, fill=fill, anchor='la')
        x += draw.textlength(ch, font=ft) + tracking


img = Image.open(ART).convert('RGB')
scale = max(W / img.width, H / img.height)
img = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
left = (img.width - W) // 2
top = (img.height - H) // 2
canvas = img.crop((left, top, left + W, top + H)).convert('RGBA')
canvas = ImageEnhance.Contrast(canvas).enhance(1.1)
canvas = ImageEnhance.Color(canvas).enhance(0.95)

# Controlled top vignette for crystal-clear title dominance.
veil = Image.new('RGBA', (W, H), (0, 0, 0, 0))
vd = ImageDraw.Draw(veil)
for y in range(0, 1300):
    alpha = int(140 * (1 - y / 1300))
    vd.line((0, y, W, y), fill=(5, 10, 20, alpha))
canvas.alpha_composite(veil)

draw = ImageDraw.Draw(canvas)
cream = (253, 250, 242, 255)
gold = (224, 184, 102, 255)
muted = (228, 224, 215, 255)

# Commanding Title Hierarchy: massive, crisp Cormorant Garamond display.
center_text(draw, 135, 'Unedited', f(SERIF, 330), cream)
center_text(draw, 425, 'Christmas', f(SERIF, 355), cream)

# Refined editorial divider rule with gold accent.
draw.line((390, 790, 1658, 790), fill=gold, width=3)
draw.ellipse((1018, 778, 1030, 790), fill=gold)

# Reordered small-caps subtitle: exact wording retained, displayed in restrained uppercase with natural tracking.
smallcaps_font = f(SANS, 72)
draw_caps_center(draw, 2205, 'A 24-Day Advent Devotional for Finding', smallcaps_font, muted, 4)
draw_caps_center(draw, 2320, 'Peace Beyond Holiday Performance', smallcaps_font, muted, 4)

# Author Lock-up: authoritative spaced capitals, larger and crisper in the quiet lower zone.
draw_tracking_center(draw, 2740, AUTHOR, f(SANS, 96), cream, 22)

out = OUT_DIR / 'unedited-christmas-candidate-05-smallcaps-v1.jpg'
canvas.convert('RGB').save(out, quality=98, subsampling=0, optimize=True)
print('Rendered Candidate 5 Small Caps V1 Master:', out)
