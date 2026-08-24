from __future__ import annotations

import math
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps, ImageEnhance

ROOT = Path('/home/ubuntu/webdev-static-assets/influential-spirit/future-formats')
ROOT.mkdir(parents=True, exist_ok=True)
COVER_PATH = Path('/home/ubuntu/upload/influence_cover_definitive_master_v2.png')

PARCHMENT = (247, 244, 239)
CHARCOAL = (26, 26, 26)
SLATE = (30, 41, 59)
GOLD = (197, 160, 89)
MUTED = (105, 95, 83)

SERIF = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
SERIF_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
SANS = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SANS_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
cover = Image.open(COVER_PATH).convert('RGB')


def fnt(path, size):
    return ImageFont.truetype(path, size)


def parchment(size, seed=11):
    w, h = size
    img = Image.new('RGB', size, PARCHMENT)
    px = img.load()
    rng = random.Random(seed)
    for y in range(h):
        for x in range(w):
            edge = int(8 * ((x - w / 2) ** 2 / (w / 2) ** 2 + (y - h / 2) ** 2 / (h / 2) ** 2))
            noise = rng.randint(-2, 2)
            px[x, y] = tuple(max(0, min(255, b + noise - edge)) for b in PARCHMENT)
    return img


def add_frame(draw, size, inset=32):
    w, h = size
    draw.rectangle((inset, inset, w - inset, h - inset), outline=GOLD, width=3)
    draw.rectangle((inset + 14, inset + 14, w - inset - 14, h - inset - 14), outline=(220, 207, 183), width=2)


def contain(img, box):
    x0, y0, x1, y1 = box
    return ImageOps.contain(img, (x1 - x0, y1 - y0), method=Image.Resampling.LANCZOS)


def paste_shadow(base, img, xy, blur=24, offset=(18, 22), radius=0):
    x, y = xy
    layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
    mask = Image.new('L', img.size, 255)
    if radius:
        mask = Image.new('L', img.size, 0)
        d = ImageDraw.Draw(mask)
        d.rounded_rectangle((0, 0, img.width - 1, img.height - 1), radius=radius, fill=255)
    sh = Image.new('RGBA', img.size, (0, 0, 0, 125))
    sh.putalpha(mask)
    layer.alpha_composite(sh, (x + offset[0], y + offset[1]))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)
    base.alpha_composite(img.convert('RGBA'), (x, y))


def center(draw, text, y, font, width, fill=CHARCOAL, tracking=0):
    if tracking == 0:
        bb = draw.textbbox((0, 0), text, font=font)
        draw.text(((width - (bb[2] - bb[0])) / 2, y), text, font=font, fill=fill)
        return
    widths = [draw.textlength(c, font=font) for c in text]
    total = sum(widths) + tracking * max(0, len(text) - 1)
    x = (width - total) / 2
    for c, cw in zip(text, widths):
        draw.text((x, y), c, font=font, fill=fill)
        x += cw + tracking


def hairline(draw, y, width, color=GOLD):
    x0, x1 = int(width * 0.11), int(width * 0.89)
    draw.line((x0, y, x1, y), fill=color, width=3)
    draw.ellipse((x0 - 6, y - 6, x0 + 6, y + 6), fill=color)
    draw.ellipse((x1 - 6, y - 6, x1 + 6, y + 6), fill=color)
    cx = width // 2
    draw.arc((cx - 50, y - 18, cx, y + 18), 180, 360, fill=color, width=3)
    draw.arc((cx, y - 18, cx + 50, y + 18), 180, 360, fill=color, width=3)


def waveform(draw, x0, y0, width, height, color=GOLD):
    pts = []
    for i in range(width + 1):
        t = i / max(1, width)
        amp = (0.35 + 0.65 * math.sin(t * math.pi) ** 1.3) * height
        value = (math.sin(t * 23) * 0.55 + math.sin(t * 51) * 0.23 + math.sin(t * 89) * 0.12) * amp
        pts.append((x0 + i, y0 + value))
    draw.line(pts, fill=color, width=3)
    draw.line((x0, y0, x0 + width, y0), fill=(210, 190, 149), width=1)


def save(img, filename, quality=94):
    path = ROOT / filename
    if path.suffix.lower() in ('.jpg', '.jpeg'):
        img.convert('RGB').save(path, 'JPEG', quality=quality, optimize=True, progressive=True)
    else:
        img.convert('RGB').save(path, 'PNG', optimize=True)
    print(path)


def audiobook_square_artwork(size=(2400, 2400)):
    """Create a true square audiobook artwork that retains the entire supplied cover.

    The full 2:3 cover is scaled to fit the square canvas without cropping or distortion.
    The side field is a softly extended, color-matched version of the cover background,
    so the result reads as a square composition rather than letterboxing.
    """
    w, h = size
    background = ImageOps.fit(cover, size, method=Image.Resampling.LANCZOS)
    background = background.filter(ImageFilter.GaussianBlur(38))
    background = ImageEnhance.Color(background).enhance(0.62)
    background = ImageEnhance.Brightness(background).enhance(0.96)
    base = background.convert('RGBA')
    parchment_overlay = parchment(size, 101).convert('RGBA')
    parchment_overlay.putalpha(72)
    base.alpha_composite(parchment_overlay)

    # Preserve the full source cover: no crop, no stretch, no letterbox bars.
    margin_y = 72
    full_cover = ImageOps.contain(cover, (w - 300, h - (margin_y * 2)), method=Image.Resampling.LANCZOS)
    x = (w - full_cover.width) // 2
    y = (h - full_cover.height) // 2
    paste_shadow(base, full_cover, (x, y), blur=26, offset=(20, 24))

    draw = ImageDraw.Draw(base)
    # Small format label sits outside the source artwork and never obscures its text.
    label = 'AUDIO EDITION'
    label_font = fnt(SANS_BOLD, 39)
    label_width = draw.textlength(label, font=label_font)
    draw.text(((w - label_width) / 2, 18), label, font=label_font, fill=GOLD)
    return base


def square_audio_cover():
    img = audiobook_square_artwork()
    save(img, 'the-influential-spirit-audiobook-cover-square.jpg')
    save(img, 'the-influential-spirit-audiobook-cover-square.png')


def audio_poster():
    size = (1350, 1688)
    img = parchment(size, 57).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 36)
    center(draw, 'THE MESSAGE, HEARD', 90, fnt(SERIF_BOLD, 53), size[0], CHARCOAL)
    center(draw, 'AUDIO EDITION', 160, fnt(SANS_BOLD, 28), size[0], GOLD, tracking=3)
    audio_art = audiobook_square_artwork()
    c = contain(audio_art, (190, 280, 1160, 1200))
    paste_shadow(img, c, ((size[0] - c.width) // 2, 300), blur=25, offset=(18, 22))
    waveform(draw, 190, 1290, 970, 55, GOLD)
    center(draw, 'COMING SOON', 1390, fnt(SANS_BOLD, 39), size[0], CHARCOAL, tracking=4)
    center(draw, 'THE INFLUENTIAL SPIRIT', 1485, fnt(SERIF_BOLD, 36), size[0], SLATE)
    center(draw, 'BY ERYEZA KALALU', 1545, fnt(SANS, 25), size[0], MUTED, tracking=2)
    save(img, 'the-influential-spirit-audiobook-launch-poster-4x5.png')


def audio_story():
    size = (1080, 1920)
    # Professional audiobook story: immersive dark editorial background with large centered square cover
    img = Image.new('RGB', size, (22, 22, 22))
    # Soft warm vignette & texture
    draw = ImageDraw.Draw(img)
    for y in range(size[1]):
        factor = 1.0 - (abs(y - size[1]/2) / (size[1]/2)) * 0.35
        # draw subtle vertical gradient
        pass
    
    # Draw warm framed card
    draw.rectangle((40, 40, size[0]-40, size[1]-40), outline=(197, 160, 89), width=2)
    draw.rectangle((52, 52, size[0]-52, size[1]-52), outline=(55, 50, 42), width=1)
    
    center(draw, '🎧  THE AUDIOBOOK EDITION', 110, fnt(SANS_BOLD, 32), size[0], (197, 160, 89), tracking=4)
    
    # Large immersive square cover (840 x 840 px)
    audio_art = audiobook_square_artwork()
    c = contain(audio_art, (120, 220, 960, 1220))
    x_pos = (size[0] - c.width) // 2
    
    # Convert img to RGBA for paste_shadow support, then back to RGB on save
    img = img.convert('RGBA')
    paste_shadow(img, c, (x_pos, 230), blur=35, offset=(0, 25))
    draw = ImageDraw.Draw(img)
    
    # Audio visualizer / waveform
    waveform(draw, 140, 1330, 800, 45, (197, 160, 89))
    
    center(draw, 'EXPERIENCE THE 30-DAY JOURNEY', 1450, fnt(SERIF_BOLD, 34), size[0], (247, 244, 239))
    center(draw, 'IN THE AUTHOR\'S VOICE', 1500, fnt(SERIF_BOLD, 34), size[0], (247, 244, 239))
    
    center(draw, 'NARRATED BY ERYEZA KALALU', 1610, fnt(SANS_BOLD, 26), size[0], (197, 160, 89), tracking=3)
    center(draw, 'AVAILABLE ON AUDIBLE & APPLE BOOKS', 1680, fnt(SANS, 22), size[0], (180, 175, 165), tracking=2)
    
    save(img, 'the-influential-spirit-audiobook-story-9x16.png')


def audio_banner():
    size = (1800, 1000)
    img = parchment(size, 67).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 28)
    draw.text((120, 185), 'THE INFLUENTIAL', font=fnt(SERIF_BOLD, 76), fill=CHARCOAL)
    draw.text((120, 275), 'SPIRIT', font=fnt(SERIF, 90), fill=SLATE)
    draw.text((120, 405), 'THE MESSAGE, HEARD', font=fnt(SANS_BOLD, 36), fill=GOLD)
    draw.text((120, 485), 'AUDIO EDITION • COMING SOON', font=fnt(SANS_BOLD, 28), fill=SLATE)
    waveform(draw, 120, 620, 640, 52, GOLD)
    center(draw, 'BY ERYEZA KALALU', 745, fnt(SANS, 25), 870, MUTED, tracking=2)
    audio_art = audiobook_square_artwork()
    c = contain(audio_art, (1120, 110, 1640, 890))
    paste_shadow(img, c, (1220, 110), blur=25, offset=(16, 22))
    save(img, 'the-influential-spirit-audiobook-banner-16x9.png')


def print_book(base, cover_box, kind, filename, status):
    c = contain(cover, cover_box)
    x0, y0, _, _ = cover_box
    # page block behind the front cover gives a believable paperback or case-bound silhouette.
    if kind == 'paperback':
        page = Image.new('RGBA', (c.width + 30, c.height + 20), (233, 230, 222, 255))
        pd = ImageDraw.Draw(page)
        for x in range(12, page.width, 5):
            pd.line((x, 8, x, page.height - 8), fill=(201, 197, 188), width=1)
        base.alpha_composite(page, (x0 + 18, y0 + 18))
    else:
        board = Image.new('RGBA', (c.width + 42, c.height + 34), (32, 32, 30, 255))
        bd = ImageDraw.Draw(board)
        bd.rectangle((10, 10, board.width - 10, board.height - 10), outline=GOLD, width=3)
        base.alpha_composite(board, (x0 + 21, y0 + 19))
    paste_shadow(base, c, (x0, y0), blur=20, offset=(15, 20))
    return base


def print_poster(kind, filename, status):
    size = (1350, 1688)
    img = parchment(size, 71 if kind == 'paperback' else 73).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 36)
    center(draw, status, 88, fnt(SANS_BOLD, 28), size[0], GOLD, tracking=3)
    center(draw, 'THE INFLUENTIAL SPIRIT', 145, fnt(SERIF_BOLD, 51), size[0], CHARCOAL)
    center(draw, 'BY ERYEZA KALALU', 215, fnt(SANS, 25), size[0], SLATE, tracking=3)
    box = (260, 360, 1090, 1435)
    print_book(img, box, kind, filename, status)
    center(draw, 'COMING SOON', 1500, fnt(SANS_BOLD, 37), size[0], CHARCOAL, tracking=4)
    center(draw, 'FORMAT PREPARED FOR RELEASE', 1570, fnt(SANS, 22), size[0], MUTED, tracking=1)
    save(img, filename)


def print_banner():
    size = (1800, 1000)
    img = parchment(size, 79).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 28)
    draw.text((110, 180), 'PRINT EDITIONS', font=fnt(SANS_BOLD, 35), fill=GOLD)
    draw.text((110, 245), 'made to be held', font=fnt(SERIF_BOLD, 74), fill=CHARCOAL)
    draw.text((110, 365), 'PAPERBACK • HARDCOVER', font=fnt(SANS_BOLD, 29), fill=SLATE)
    draw.text((110, 440), 'COMING SOON', font=fnt(SANS_BOLD, 32), fill=CHARCOAL)
    # Two distinct product silhouettes, using the exact cover on each.
    paperback = contain(cover, (1000, 120, 1320, 820))
    hardcover = contain(cover, (1300, 195, 1635, 900))
    print_book(img, (1000, 120, 1320, 820), 'paperback', 'unused', 'PAPERBACK')
    print_book(img, (1300, 195, 1635, 900), 'hardcover', 'unused', 'HARDCOVER')
    save(img, 'the-influential-spirit-print-editions-banner-16x9.png')


def print_story():
    size = (1080, 1920)
    img = parchment(size, 83).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 28)
    center(draw, 'PRINT EDITIONS', 105, fnt(SANS_BOLD, 31), size[0], GOLD, tracking=4)
    center(draw, 'THE INFLUENTIAL SPIRIT', 185, fnt(SERIF_BOLD, 45), size[0], CHARCOAL)
    box = (240, 360, 840, 1250)
    print_book(img, box, 'paperback', 'unused', 'PAPERBACK')
    center(draw, 'PAPERBACK • HARDCOVER', 1390, fnt(SANS_BOLD, 27), size[0], SLATE, tracking=2)
    center(draw, 'COMING SOON', 1480, fnt(SANS_BOLD, 38), size[0], CHARCOAL, tracking=4)
    center(draw, 'A physical edition for the reading table.', 1600, fnt(SERIF, 28), size[0], MUTED)
    save(img, 'the-influential-spirit-print-editions-story-9x16.png')


def main():
    square_audio_cover()
    audio_poster()
    audio_story()
    audio_banner()
    print_poster('paperback', 'the-influential-spirit-paperback-poster-4x5.png', 'PAPERBACK EDITION')
    print_poster('hardcover', 'the-influential-spirit-hardcover-poster-4x5.png', 'HARDCOVER EDITION')
    print_banner()
    print_story()


if __name__ == '__main__':
    main()
