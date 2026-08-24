from __future__ import annotations

import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps

SOURCE = Path('/home/ubuntu/upload/influence_cover_definitive_master_v2.png')
OUT = Path('/home/ubuntu/webdev-static-assets/influential-spirit/future-formats')
OUT.mkdir(parents=True, exist_ok=True)

PARCHMENT = (247, 244, 239)
CHARCOAL = (26, 26, 26)
GOLD = (197, 160, 89)
SLATE = (30, 41, 59)
MUTED = (158, 151, 140)
SERIF = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
SERIF_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
SANS = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SANS_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
cover = Image.open(SOURCE).convert('RGB')


def font(path: str, size: int):
    return ImageFont.truetype(path, size)


def texture(size=(2400, 2400), seed=31):
    bg = ImageOps.fit(cover, size, method=Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(10))
    bg = ImageEnhance.Color(bg).enhance(0.72)
    bg = ImageEnhance.Brightness(bg).enhance(0.97)
    noise = Image.new('RGB', size, PARCHMENT)
    px = noise.load()
    rng = random.Random(seed)
    for y in range(size[1]):
        for x in range(size[0]):
            n = rng.randint(-3, 3)
            px[x, y] = tuple(max(0, min(255, c + n)) for c in PARCHMENT)
    noise = Image.blend(noise, bg, 0.36)
    return noise.convert('RGBA')


def feathered_crop(box, target_size, feather=26):
    crop = cover.crop(box)
    crop = ImageOps.fit(crop, target_size, method=Image.Resampling.LANCZOS)
    crop = crop.convert('RGBA')
    mask = Image.new('L', target_size, 255)
    if feather:
        grad = Image.new('L', target_size, 0)
        gp = grad.load()
        w, h = target_size
        for y in range(h):
            for x in range(w):
                d = min(x, y, w - 1 - x, h - 1 - y)
                gp[x, y] = min(255, int(255 * min(1, d / feather)))
        mask = grad
    crop.putalpha(mask)
    return crop


def paste(base, crop, xy):
    base.alpha_composite(crop, xy)


def border(draw, size, inset=34):
    w, h = size
    draw.rectangle((inset, inset, w - inset, h - inset), outline=GOLD, width=4)
    draw.rectangle((inset + 18, inset + 18, w - inset - 18, h - inset - 18), outline=(222, 211, 190), width=2)


def centered(draw, text, y, fnt, width, fill, tracking=0):
    if not tracking:
        box = draw.textbbox((0, 0), text, font=fnt)
        draw.text(((width - box[2] + box[0]) / 2, y), text, font=fnt, fill=fill)
        return
    widths = [draw.textlength(c, font=fnt) for c in text]
    total = sum(widths) + tracking * max(0, len(text) - 1)
    x = (width - total) / 2
    for c, width_c in zip(text, widths):
        draw.text((x, y), c, font=fnt, fill=fill)
        x += width_c + tracking


def save(img, name, quality=95):
    path = OUT / name
    if path.suffix.lower() in {'.jpg', '.jpeg'}:
        img.convert('RGB').save(path, 'JPEG', quality=quality, optimize=True, progressive=True)
    else:
        img.convert('RGB').save(path, 'PNG', optimize=True)
    print(path)


def genuine_square_master():
    size = (2400, 2400)
    base = texture(size)
    draw = ImageDraw.Draw(base)
    border(draw, size)

    # Each component is rebuilt into a square hierarchy from exact source-cover crops.
    # The source cover is never shown as a rectangular object and no title element is discarded.
    title = feathered_crop((0, 0, 1536, 770), (2010, 1010), feather=32)
    subtitle = feathered_crop((0, 735, 1536, 1110), (1870, 455), feather=28)
    emblem = feathered_crop((115, 925, 1420, 1915), (1510, 1145), feather=30)
    author = feathered_crop((90, 1925, 1446, 2304), (1770, 495), feather=30)

    paste(base, title, (195, 72))
    paste(base, subtitle, (265, 900))
    paste(base, emblem, (445, 1180))
    paste(base, author, (315, 1905))

    # The format marker is separate from the source-cover typography and stays unobtrusive.
    centered(draw, 'AUDIO EDITION', 35, font(SANS_BOLD, 32), size[0], GOLD, tracking=4)
    save(base, 'the-influential-spirit-audiobook-master-square.png')
    save(base, 'the-influential-spirit-audiobook-master-square.jpg')
    return base


def story(master):
    size = (1080, 1920)
    base = Image.new('RGBA', size, (25, 24, 22, 255))
    # Warm, restrained listening-room atmosphere.
    vignette = Image.new('RGBA', size, (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    vd.ellipse((-220, -180, 1300, 1650), fill=(101, 77, 45, 55))
    vignette = vignette.filter(ImageFilter.GaussianBlur(85))
    base.alpha_composite(vignette)
    draw = ImageDraw.Draw(base)
    border(draw, size, 32)

    centered(draw, 'THE AUDIOBOOK EDITION', 108, font(SANS_BOLD, 30), size[0], GOLD, tracking=3)
    art = ImageOps.contain(master, (860, 860), method=Image.Resampling.LANCZOS)
    x = (size[0] - art.width) // 2
    paste(base, art.convert('RGBA'), (x, 225))

    # A single restrained audio line; no redundant title or unverified platform claim.
    points = []
    for i in range(801):
        xx = 140 + i
        yy = 1340 + int(18 * (0.5 * __import__('math').sin(i / 18) + 0.25 * __import__('math').sin(i / 7)))
        points.append((xx, yy))
    draw.line(points, fill=GOLD, width=3)
    centered(draw, 'THE MESSAGE, HEARD', 1460, font(SERIF_BOLD, 36), size[0], (247, 244, 239))
    centered(draw, 'AUDIO EDITION • COMING SOON', 1530, font(SANS_BOLD, 27), size[0], GOLD, tracking=1)
    centered(draw, 'THE INFLUENTIAL SPIRIT', 1660, font(SANS, 20), size[0], MUTED, tracking=2)
    save(base, 'the-influential-spirit-audiobook-story-genuine-square-9x16.png')


def poster(master):
    size = (1350, 1688)
    base = Image.new('RGBA', size, PARCHMENT + (255,))
    draw = ImageDraw.Draw(base)
    border(draw, size, 36)
    centered(draw, 'THE MESSAGE, HEARD', 86, font(SERIF_BOLD, 52), size[0], CHARCOAL)
    centered(draw, 'AUDIO EDITION', 155, font(SANS_BOLD, 27), size[0], GOLD, tracking=3)
    art = ImageOps.contain(master, (930, 930), method=Image.Resampling.LANCZOS)
    paste(base, art.convert('RGBA'), ((size[0] - art.width) // 2, 265))
    centered(draw, 'AUDIO EDITION • COMING SOON', 1280, font(SANS_BOLD, 34), size[0], SLATE, tracking=2)
    centered(draw, 'THE INFLUENTIAL SPIRIT', 1370, font(SERIF_BOLD, 37), size[0], CHARCOAL)
    centered(draw, 'BY ERYEZA KALALU', 1450, font(SANS, 25), size[0], MUTED, tracking=2)
    save(base, 'the-influential-spirit-audiobook-poster-genuine-square-4x5.png')


def banner(master):
    size = (1800, 1000)
    base = Image.new('RGBA', size, PARCHMENT + (255,))
    draw = ImageDraw.Draw(base)
    border(draw, size, 28)
    draw.text((105, 150), 'THE MESSAGE, HEARD', font=font(SERIF_BOLD, 72), fill=CHARCOAL)
    draw.text((105, 262), 'AUDIO EDITION', font=font(SANS_BOLD, 32), fill=GOLD)
    draw.text((105, 340), 'COMING SOON', font=font(SANS_BOLD, 31), fill=SLATE)
    art = ImageOps.contain(master, (650, 650), method=Image.Resampling.LANCZOS)
    paste(base, art.convert('RGBA'), (1040, 175))
    centered(draw, 'THE INFLUENTIAL SPIRIT', 760, font(SANS_BOLD, 22), 860, MUTED, tracking=2)
    save(base, 'the-influential-spirit-audiobook-banner-genuine-square-16x9.png')


def main():
    master = genuine_square_master()
    story(master)
    poster(master)
    banner(master)


if __name__ == '__main__':
    main()
