from pathlib import Path
from base64 import b64encode
from html import escape
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter, ImageOps

ROOT = Path('/home/ubuntu')
ART = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-reordered-master-art.png'
OUT_DIR = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-sentence-backing'
MIG_DIR = ROOT / 'ccndaily-books/migration/unedited-christmas-candidate05'
OUT_DIR.mkdir(parents=True, exist_ok=True)
MIG_DIR.mkdir(parents=True, exist_ok=True)
W, H = 2048, 3072

SERIF = '/home/ubuntu/webdev-static-assets/fonts/CormorantGaramond-Regular.ttf'
SANS = '/home/ubuntu/webdev-static-assets/fonts/DMSans-Regular.ttf'
TITLE = 'Unedited Christmas'
SUBTITLE = 'A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance'
AUTHOR = 'ERYEZA KALALU'


def font(path, size):
    return ImageFont.truetype(path, size)


def center_text(draw, y, text, ft, fill):
    draw.text((W // 2, y), text, font=ft, fill=fill, anchor='ma')


def draw_tracking_center(draw, y, text, ft, fill, tracking):
    width = sum(draw.textlength(ch, font=ft) for ch in text) + max(0, len(text) - 1) * tracking
    x = W / 2 - width / 2
    for ch in text:
        draw.text((x, y), ch, font=ft, fill=fill, anchor='la')
        x += draw.textlength(ch, font=ft) + tracking


def build_cover():
    img = Image.open(ART).convert('RGB')
    scale = max(W / img.width, H / img.height)
    img = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
    left = (img.width - W) // 2
    top = (img.height - H) // 2
    canvas = img.crop((left, top, left + W, top + H)).convert('RGBA')
    canvas = ImageEnhance.Contrast(canvas).enhance(1.1)
    canvas = ImageEnhance.Color(canvas).enhance(0.95)

    # Preserve the approved title veil.
    veil = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(veil)
    for y in range(0, 1300):
        alpha = int(140 * (1 - y / 1300))
        vd.line((0, y, W, y), fill=(5, 10, 20, alpha))
    canvas.alpha_composite(veil)

    # Local subtitle backing field only: a soft, low-opacity darkening that preserves
    # visible textile texture and avoids a hard-edged panel or label effect.
    field_mask = Image.new('L', (W, H), 0)
    md = ImageDraw.Draw(field_mask)
    md.rounded_rectangle((135, 2090, 1913, 2460), radius=120, fill=74)
    field_mask = field_mask.filter(ImageFilter.GaussianBlur(62))
    field = Image.new('RGBA', (W, H), (3, 8, 16, 0))
    field.putalpha(field_mask)
    canvas.alpha_composite(field)

    draw = ImageDraw.Draw(canvas)
    cream = (253, 250, 242, 255)
    gold = (224, 184, 102, 255)
    muted = (238, 235, 228, 255)

    center_text(draw, 135, 'Unedited', font(SERIF, 330), cream)
    center_text(draw, 425, 'Christmas', font(SERIF, 355), cream)
    draw.line((390, 790, 1658, 790), fill=gold, width=3)
    draw.ellipse((1018, 778, 1030, 790), fill=gold)

    # Sentence case retained, with the same two-line lock-up as the approved reordered cover.
    subtitle_font = font(SANS, 92)
    draw.multiline_text((W // 2, 2290), 'A 24-Day Advent Devotional for Finding\nPeace Beyond Holiday Performance', font=subtitle_font, fill=muted, spacing=22, align='center', anchor='mm')
    draw_tracking_center(draw, 2740, AUTHOR, font(SANS, 96), cream, 22)

    out = OUT_DIR / 'unedited-christmas-candidate-05-sentence-backing-v1.jpg'
    canvas.convert('RGB').save(out, quality=98, subsampling=0, optimize=True)
    thumb = OUT_DIR / 'unedited-christmas-candidate-05-sentence-backing-v1-thumbnail-98x147.jpg'
    canvas.convert('RGB').resize((98, 147), Image.Resampling.LANCZOS).save(thumb, quality=98, subsampling=0, optimize=True)
    gray = OUT_DIR / 'unedited-christmas-candidate-05-sentence-backing-v1-grayscale.jpg'
    ImageOps.grayscale(canvas.convert('RGB')).save(gray, quality=98, subsampling=0, optimize=True)
    return out, thumb, gray


def build_svg():
    # The SVG is an Affinity/Illustrator-friendly reconstruction aid. The art field
    # remains a raster image; all typography and the local backing field are native SVG objects.
    art_data = b64encode(ART.read_bytes()).decode('ascii')
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2048" height="3072" viewBox="0 0 2048 3072">
  <title>Unedited Christmas Candidate 5 — editable reconstruction guide</title>
  <defs>
    <linearGradient id="titleVeil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050a14" stop-opacity="0.55"/>
      <stop offset="0.45" stop-color="#050a14" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#050a14" stop-opacity="0"/>
    </linearGradient>
    <filter id="softField" x="-10%" y="-20%" width="120%" height="140%">
      <feGaussianBlur stdDeviation="38"/>
    </filter>
  </defs>
  <g id="BACKGROUND_ART_FIELD" opacity="1">
    <image x="0" y="0" width="2048" height="3072" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,{art_data}"/>
  </g>
  <rect id="TITLE_VEIL" x="0" y="0" width="2048" height="1300" fill="url(#titleVeil)"/>
  <rect id="SUBTITLE_LOCAL_BACKING_FIELD" x="135" y="2090" width="1778" height="370" rx="120" fill="#030810" fill-opacity="0.29" filter="url(#softField)"/>
  <g id="TITLE" fill="#fdfaf2" text-anchor="middle" font-family="Cormorant Garamond, serif" font-weight="400">
    <text x="1024" y="430" font-size="330">Unedited</text>
    <text x="1024" y="760" font-size="355">Christmas</text>
  </g>
  <g id="DIVIDER" fill="#e0b866" stroke="#e0b866">
    <line x1="390" y1="790" x2="1658" y2="790" stroke-width="3"/>
    <circle cx="1024" cy="784" r="6" stroke="none"/>
  </g>
  <g id="SUBTITLE" fill="#eee be4" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="400" font-size="92">
    <text x="1024" y="2260">A 24-Day Advent Devotional for Finding</text>
    <text x="1024" y="2370">Peace Beyond Holiday Performance</text>
  </g>
  <text id="AUTHOR" x="1024" y="2840" fill="#fdfaf2" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="96" letter-spacing="22">ERYEZA KALALU</text>
</svg>
'''.replace('#eee be4', '#eee be4'.replace(' ', ''))
    svg_path = MIG_DIR / 'unedited-christmas-candidate05-editable-reconstruction.svg'
    svg_path.write_text(svg, encoding='utf-8')
    return svg_path


if __name__ == '__main__':
    outputs = build_cover()
    svg = build_svg()
    for path in (*outputs, svg):
        print(path)
''
