from __future__ import annotations

import math
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = Path('/home/ubuntu/webdev-static-assets/influential-spirit/promo')
ROOT.mkdir(parents=True, exist_ok=True)
COVER_PATH = Path('/home/ubuntu/upload/influence_cover_definitive_master_v2.png')
AUTHOR_PATH = Path('/home/ubuntu/ccndaily-books/client/public/assets/images/author.jpg')

PARCHMENT = (247, 244, 239)
PARCHMENT_DARK = (228, 218, 199)
CHARCOAL = (26, 26, 26)
SLATE = (30, 41, 59)
GOLD = (197, 160, 89)
CREAM = (252, 249, 244)
MUTED = (105, 95, 83)

FONT_DIRS = [
    Path('/usr/share/fonts/truetype/dejavu'),
    Path('/usr/share/fonts/truetype/noto'),
    Path('/usr/share/fonts/opentype'),
]

def font_file(preferred: str, fallback: str) -> str:
    for d in FONT_DIRS:
        for p in d.rglob(preferred):
            return str(p)
    for d in FONT_DIRS:
        for p in d.rglob(fallback):
            return str(p)
    return '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

SERIF = font_file('DejaVuSerif.ttf', 'DejaVuSerif.ttf')
SERIF_BOLD = font_file('DejaVuSerif-Bold.ttf', 'DejaVuSerif.ttf')
SANS = font_file('DejaVuSans.ttf', 'DejaVuSans.ttf')
SANS_BOLD = font_file('DejaVuSans-Bold.ttf', 'DejaVuSans.ttf')

cover = Image.open(COVER_PATH).convert('RGB')


def fnt(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def parchment(size: tuple[int, int], seed: int = 7) -> Image.Image:
    w, h = size
    img = Image.new('RGB', size, PARCHMENT)
    px = img.load()
    rng = random.Random(seed)
    for y in range(h):
        for x in range(w):
            vignette = int(9 * ((x - w / 2) ** 2 / (w / 2) ** 2 + (y - h / 2) ** 2 / (h / 2) ** 2))
            n = rng.randint(-2, 2)
            px[x, y] = tuple(max(0, min(255, base + n - vignette)) for base in PARCHMENT)
    return img


def fit_image(img: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    x0, y0, x1, y1 = box
    return ImageOps.contain(img, (x1 - x0, y1 - y0), method=Image.Resampling.LANCZOS)


def paste_with_shadow(base: Image.Image, img: Image.Image, xy: tuple[int, int], shadow_offset=(18, 24), blur=22, radius=0) -> None:
    x, y = xy
    shadow = Image.new('RGBA', base.size, (0, 0, 0, 0))
    mask = Image.new('L', img.size, 255)
    if radius:
        mask = Image.new('L', img.size, 0)
        md = ImageDraw.Draw(mask)
        md.rounded_rectangle((0, 0, img.width, img.height), radius=radius, fill=255)
    layer = Image.new('RGBA', img.size, (0, 0, 0, 150))
    layer.putalpha(mask.filter(ImageFilter.GaussianBlur(2)))
    shadow.alpha_composite(layer, (x + shadow_offset[0], y + shadow_offset[1]))
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(shadow)
    base.alpha_composite(img.convert('RGBA'), (x, y))


def centered(draw: ImageDraw.ImageDraw, text: str, y: int, font: ImageFont.FreeTypeFont, fill=CHARCOAL, canvas_width: int | None = None, tracking: int = 0) -> None:
    if canvas_width is None:
        raise ValueError('canvas_width is required')
    if tracking == 0:
        bbox = draw.textbbox((0, 0), text, font=font)
        draw.text(((canvas_width - (bbox[2] - bbox[0])) / 2, y), text, font=font, fill=fill)
        return
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * max(0, len(text) - 1)
    x = (canvas_width - total) / 2
    for ch, width in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += width + tracking


def wrap_lines(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ''
    for word in words:
        candidate = word if not current else current + ' ' + word
        if draw.textlength(candidate, font=font) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_hairline(draw: ImageDraw.ImageDraw, y: int, width: int, color=GOLD) -> None:
    x0 = int(width * 0.12)
    x1 = int(width * 0.88)
    draw.line((x0, y, x1, y), fill=color, width=2)
    draw.ellipse((x0 - 4, y - 4, x0 + 4, y + 4), fill=color)
    draw.ellipse((x1 - 4, y - 4, x1 + 4, y + 4), fill=color)
    cx = width // 2
    draw.arc((cx - 35, y - 12, cx, y + 12), 180, 360, fill=color, width=2)
    draw.arc((cx, y - 12, cx + 35, y + 12), 180, 360, fill=color, width=2)


def add_frame(draw: ImageDraw.ImageDraw, size: tuple[int, int], inset: int = 45) -> None:
    w, h = size
    draw.rectangle((inset, inset, w - inset, h - inset), outline=GOLD, width=2)
    draw.rectangle((inset + 13, inset + 13, w - inset - 13, h - inset - 13), outline=(220, 207, 183), width=1)


def save(img: Image.Image, name: str) -> None:
    path = ROOT / name
    img.convert('RGB').save(path, 'PNG', optimize=True)
    print(path)


def ebook_hero() -> None:
    size = (1600, 900)
    img = parchment(size, seed=13).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 30)
    draw.text((105, 175), 'DIGITAL EBOOK', font=fnt(SANS_BOLD, 38), fill=GOLD)
    draw.text((105, 235), 'The Influential', font=fnt(SERIF_BOLD, 72), fill=CHARCOAL)
    draw.text((105, 315), 'Spirit', font=fnt(SERIF, 86), fill=SLATE)
    draw_hairline(draw, 432, 630, GOLD)
    draw.text((105, 480), 'PDF + EPUB', font=fnt(SANS_BOLD, 28), fill=SLATE)
    draw.text((105, 550), 'Read the digital edition', font=fnt(SANS, 27), fill=CHARCOAL)
    cover_fit = fit_image(cover, (1000, 74, 1420, 805))
    paste_with_shadow(img, cover_fit, (1080, 84), shadow_offset=(16, 22), blur=24)
    save(img, 'ebook-hero-deterministic-16x9.png')


def ebook_showcase() -> None:
    size = (1350, 1688)
    img = parchment(size, seed=19).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 38)
    centered(draw, 'THE INFLUENTIAL SPIRIT', 90, fnt(SANS_BOLD, 28), GOLD, size[0], tracking=3)
    centered(draw, 'DIGITAL EBOOK', 140, fnt(SERIF_BOLD, 55), CHARCOAL, size[0])
    centered(draw, 'PDF + EPUB', 207, fnt(SANS_BOLD, 26), SLATE, size[0], tracking=2)
    # tablet body
    tablet = Image.new('RGBA', (610, 1030), (19, 22, 27, 255))
    td = ImageDraw.Draw(tablet)
    td.rounded_rectangle((0, 0, 609, 1029), radius=34, fill=(19, 22, 27), outline=(90, 77, 55), width=4)
    screen = fit_image(cover, (34, 34, 576, 996))
    tablet.alpha_composite(screen.convert('RGBA'), ((610 - screen.width) // 2, 36))
    td.ellipse((298, 1002, 312, 1016), fill=(100, 100, 100))
    paste_with_shadow(img, tablet, (365, 345), shadow_offset=(20, 25), blur=28, radius=34)
    # small gold bookmark and notebook accent
    draw.rounded_rectangle((1030, 390, 1100, 800), radius=12, fill=GOLD)
    draw.rectangle((1047, 390, 1084, 760), fill=(230, 197, 124))
    draw.polygon([(1047, 760), (1084, 760), (1065, 795)], fill=GOLD)
    draw.rounded_rectangle((1030, 935, 1210, 1110), radius=12, fill=(239, 233, 222), outline=(190, 177, 155), width=2)
    for y in range(975, 1080, 28):
        draw.line((1050, y, 1190, y), fill=(199, 190, 174), width=2)
    centered(draw, 'READ THE DIGITAL EDITION', 1440, fnt(SANS_BOLD, 27), CHARCOAL, size[0], tracking=1)
    save(img, 'ebook-device-showcase-deterministic-4x5.png')


def ebook_square() -> None:
    size = (1080, 1080)
    img = parchment(size, seed=23).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 30)
    centered(draw, 'THE INFLUENTIAL SPIRIT', 70, fnt(SERIF_BOLD, 45), CHARCOAL, size[0])
    centered(draw, 'DIGITAL EBOOK', 132, fnt(SANS_BOLD, 28), GOLD, size[0], tracking=2)
    tablet = Image.new('RGBA', (410, 650), (18, 21, 25, 255))
    screen = fit_image(cover, (26, 28, 384, 620))
    tablet.alpha_composite(screen.convert('RGBA'), ((410 - screen.width) // 2, 30))
    paste_with_shadow(img, tablet, (255, 265), shadow_offset=(15, 18), blur=24, radius=24)
    phone = Image.new('RGBA', (190, 380), (22, 23, 24, 255))
    pd = ImageDraw.Draw(phone)
    ps = fit_image(cover, (14, 20, 176, 352))
    phone.alpha_composite(ps.convert('RGBA'), ((190 - ps.width) // 2, 20))
    paste_with_shadow(img, phone, (680, 485), shadow_offset=(12, 16), blur=18, radius=20)
    centered(draw, 'PDF + EPUB', 925, fnt(SANS_BOLD, 27), SLATE, size[0], tracking=2)
    save(img, 'ebook-product-square-deterministic-1x1.png')


def ebook_story() -> None:
    size = (1080, 1920)
    img = parchment(size, seed=29).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 28)
    centered(draw, 'THE DIGITAL EDITION', 105, fnt(SANS_BOLD, 31), GOLD, size[0], tracking=3)
    centered(draw, 'THE INFLUENTIAL', 210, fnt(SERIF_BOLD, 66), CHARCOAL, size[0])
    centered(draw, 'SPIRIT', 290, fnt(SERIF, 85), SLATE, size[0])
    phone = Image.new('RGBA', (525, 1000), (20, 22, 25, 255))
    pdraw = ImageDraw.Draw(phone)
    pdraw.rounded_rectangle((0, 0, 524, 999), radius=48, outline=(94, 77, 53), width=5)
    ps = fit_image(cover, (35, 40, 490, 960))
    phone.alpha_composite(ps.convert('RGBA'), ((525 - ps.width) // 2, 42))
    pdraw.ellipse((250, 968, 274, 992), fill=(95, 95, 95))
    paste_with_shadow(img, phone, (278, 540), shadow_offset=(20, 26), blur=30, radius=48)
    draw_hairline(draw, 1650, 780, GOLD)
    centered(draw, 'PDF + EPUB', 1698, fnt(SANS_BOLD, 36), CHARCOAL, size[0], tracking=3)
    centered(draw, 'READ THE INFLUENTIAL SPIRIT', 1770, fnt(SANS, 27), SLATE, size[0], tracking=1)
    save(img, 'ebook-phone-story-deterministic-9x16.png')


def digital_banner() -> None:
    size = (1800, 1000)
    img = parchment(size, seed=31).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 32)
    draw.text((120, 190), 'A DEVOTIONAL', font=fnt(SANS_BOLD, 34), fill=GOLD)
    draw.text((120, 250), 'for the working week', font=fnt(SERIF, 68), fill=CHARCOAL)
    draw_hairline(draw, 760, 690, GOLD)
    draw.text((120, 810), 'DIGITAL EBOOK • PDF + EPUB', font=fnt(SANS_BOLD, 28), fill=SLATE)
    c = fit_image(cover, (1160, 100, 1580, 900))
    paste_with_shadow(img, c, (1280, 100), shadow_offset=(18, 25), blur=28)
    save(img, 'digital-edition-banner-deterministic-16x9.png')


def daily_story_template() -> None:
    size = (1080, 1920)
    img = parchment(size, seed=37).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 28)
    centered(draw, 'THE CCN DAILY', 100, fnt(SANS_BOLD, 27), GOLD, size[0], tracking=4)
    centered(draw, 'DAY 01', 190, fnt(SERIF_BOLD, 70), CHARCOAL, size[0])
    centered(draw, 'THE INFLUENTIAL SPIRIT', 290, fnt(SANS_BOLD, 26), SLATE, size[0], tracking=2)
    c = fit_image(cover, (200, 405, 880, 1425))
    paste_with_shadow(img, c, ((size[0] - c.width) // 2, 420), shadow_offset=(14, 18), blur=22)
    draw_hairline(draw, 1540, 700, GOLD)
    centered(draw, 'TODAY’S REFLECTION', 1600, fnt(SERIF_BOLD, 42), CHARCOAL, size[0])
    centered(draw, 'Replace this line with the approved daily excerpt.', 1680, fnt(SANS, 23), MUTED, size[0])
    centered(draw, 'books.theccndaily.com', 1810, fnt(SANS_BOLD, 22), SLATE, size[0], tracking=1)
    save(img, 'daily-reflection-story-template-deterministic-9x16.png')


def quote_card(filename: str, quote: str, attribution: str, source: str | None = None, author_card: bool = False) -> None:
    size = (1080, 1080)
    img = parchment(size, seed=sum(ord(c) for c in quote) % 1000).convert('RGBA')
    draw = ImageDraw.Draw(img)
    add_frame(draw, size, 34)
    draw.text((100, 110), '“', font=fnt(SERIF_BOLD, 110), fill=GOLD)
    qfont = fnt(SERIF, 46)
    lines = wrap_lines(draw, quote, qfont, 850)
    y = 280
    line_gap = 20
    for line in lines:
        centered(draw, line, y, qfont, CHARCOAL, size[0])
        y += qfont.size + line_gap
    draw_hairline(draw, y + 50, 680, GOLD)
    centered(draw, attribution, y + 105, fnt(SANS_BOLD, 28), SLATE, size[0])
    if source:
        centered(draw, source, y + 155, fnt(SANS, 22), MUTED, size[0], tracking=1)
    elif author_card:
        centered(draw, 'AUTHOR RESPONSE', y + 155, fnt(SANS, 21), MUTED, size[0], tracking=2)
    save(img, filename)


def review_cards() -> None:
    quote_card('review-amazon-derry-flay-deterministic-1x1.png', 'This is well written and biblically sound.', 'Rev. Derry Flay, UK', 'AMAZON VERIFIED PURCHASE')
    quote_card('review-amazon-jeff-mutenga-deterministic-1x1.png', 'This book is simple and practical and yet very instructive and inspiring.', 'Jeff Mutenga, UK', 'AMAZON VERIFIED PURCHASE')
    quote_card('review-amazon-chris-gould-deterministic-1x1.png', 'Practical and full of wisdom gained from experience.', 'Chris Gould, UK', 'AMAZON VERIFIED PURCHASE')
    quote_card('review-amazon-vine-voice-deterministic-1x1.png', 'I felt that the message of this book was encouraging and timely for our day and age.', 'Vine Voice', 'AMAZON VERIFIED PURCHASE')
    quote_card('endorsement-martin-nangoli-deterministic-1x1.png', 'The principles Pastor Eryeza writes daily can influence a chef on the kitchen table to the judge on the verdict table.', 'Martin Nangoli', 'Specialty Coffee Producer', author_card=True)


def main() -> None:
    ebook_hero()
    ebook_showcase()
    ebook_square()
    ebook_story()
    digital_banner()
    daily_story_template()
    review_cards()


if __name__ == '__main__':
    main()
