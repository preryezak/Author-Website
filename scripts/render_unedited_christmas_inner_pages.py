from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance

ROOT = Path('/home/ubuntu')
OUT = ROOT / 'webdev-static-assets/unedited-christmas/inner-pages'
OUT.mkdir(parents=True, exist_ok=True)
SOURCE = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-sentence-backing/unedited-christmas-candidate-05-sentence-backing-v1.jpg'
SERIF = '/home/ubuntu/webdev-static-assets/fonts/CormorantGaramond-Regular.ttf'
SANS = '/home/ubuntu/webdev-static-assets/fonts/DMSans-Regular.ttf'
W, H = 2048, 3072
TITLE = 'Unedited Christmas'
SUBTITLE_LINES = ('A 24-Day Advent Devotional for Finding', 'Peace Beyond Holiday Performance')
AUTHOR = 'ERYEZA KALALU'
DPI = (300, 300)

# Inner-page system reminder: preserve the approved cover wording and hierarchy;
# Option A removes all emblem, icons, and decorative border; Option B is a true
# grayscale replica of the approved sentence-case front cover.


def f(path, size):
    return ImageFont.truetype(path, size)


def center(draw, xy, text, font, fill, anchor='mm'):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor)


def tracking_center(draw, y, text, font, fill, tracking):
    width = sum(draw.textlength(ch, font=font) for ch in text) + max(0, len(text) - 1) * tracking
    x = W / 2 - width / 2
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill, anchor='la')
        x += draw.textlength(ch, font=font) + tracking


def save_both(img, stem):
    png = OUT / f'{stem}.png'
    jpg = OUT / f'{stem}.jpg'
    rgb = img.convert('RGB')
    rgb.save(png, format='PNG', optimize=True, dpi=DPI)
    rgb.save(jpg, format='JPEG', quality=98, subsampling=0, optimize=True, dpi=DPI)
    return png, jpg


def option_a_text_only():
    # A clean inner title page: warm white paper field, no emblem, no icons,
    # no border, no decorative divider. The cover's type hierarchy is retained.
    canvas = Image.new('RGB', (W, H), (250, 249, 246))
    draw = ImageDraw.Draw(canvas)
    ink = (24, 26, 29)
    soft_ink = (68, 70, 73)

    center(draw, (W // 2, 775), 'Unedited', f(SERIF, 330), ink)
    center(draw, (W // 2, 1065), 'Christmas', f(SERIF, 355), ink)

    center(draw, (W // 2, 1570), SUBTITLE_LINES[0], f(SANS, 92), soft_ink)
    center(draw, (W // 2, 1690), SUBTITLE_LINES[1], f(SANS, 92), soft_ink)
    tracking_center(draw, 2390, AUTHOR, f(SANS, 96), ink, 22)

    return save_both(canvas, 'unedited-christmas-inner-page-option-a-text-only')


def option_b_full_replica():
    # This is a true monochrome adaptation, not a crop or simulated replacement.
    # Convert the approved complete front-cover master so every approved visual
    # element remains present: textile field, border, ornaments, emblem, and text.
    src = Image.open(SOURCE).convert('RGB')
    if src.size != (W, H):
        src = src.resize((W, H), Image.Resampling.LANCZOS)
    gray = ImageOps.grayscale(src)
    gray = ImageEnhance.Contrast(gray).enhance(1.03)
    return save_both(gray, 'unedited-christmas-inner-page-option-b-full-monochrome-replica')


if __name__ == '__main__':
    for path in (*option_a_text_only(), *option_b_full_replica()):
        print(path)
