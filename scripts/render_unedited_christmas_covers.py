from __future__ import annotations

import os
import subprocess
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path('/home/ubuntu')
BG_DIR = ROOT / 'webdev-static-assets' / 'unedited-christmas'
OUT_DIR = ROOT / 'webdev-static-assets' / 'unedited-christmas' / 'covers'
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 2048, 3072
TITLE = 'Unedited Christmas'
SUBTITLE = 'A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance'
AUTHOR = 'ERYEZA KALALU'
CATEGORY = 'ADVENT DEVOTIONAL'


def fc_font(query: str, fallback: str) -> str:
    try:
        result = subprocess.check_output(['fc-match', '-f', '%{file}', query], text=True).strip()
        if result and Path(result).exists():
            return result
    except Exception:
        pass
    return fallback


SERIF = fc_font('Cormorant Garamond', '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf')
SANS = fc_font('DM Sans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
SERIF_ITALIC = fc_font('Cormorant Garamond Italic', SERIF)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, spacing: int = 0) -> tuple[int, int]:
    if spacing == 0:
        box = draw.textbbox((0, 0), text, font=fnt)
        return box[2] - box[0], box[3] - box[1]
    width = sum(draw.textlength(ch, font=fnt) for ch in text) + max(0, len(text) - 1) * spacing
    box = draw.textbbox((0, 0), text, font=fnt)
    return int(width), box[3] - box[1]


def draw_tracking(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fnt: ImageFont.FreeTypeFont, fill, tracking: int, anchor: str = 'la') -> None:
    x, y = xy
    total_w, _ = text_size(draw, text, fnt, tracking)
    if anchor == 'ma':
        x -= total_w // 2
    elif anchor == 'ra':
        x -= total_w
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill, anchor='la')
        x += int(draw.textlength(ch, font=fnt)) + tracking


def centered(draw: ImageDraw.ImageDraw, y: int, text: str, fnt: ImageFont.FreeTypeFont, fill, tracking: int = 0) -> int:
    width, height = text_size(draw, text, fnt, tracking)
    draw_tracking(draw, (W // 2, y), text, fnt, fill, tracking, anchor='ma')
    return height


def multiline_center(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, fnt: ImageFont.FreeTypeFont, fill, leading: int = 18, align: str = 'center') -> None:
    x0, y0, x1, y1 = box
    bbox = draw.multiline_textbbox((0, 0), text, font=fnt, spacing=leading, align=align)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = x0 + (x1 - x0 - tw) / 2
    y = y0 + (y1 - y0 - th) / 2
    draw.multiline_text((x, y), text, font=fnt, fill=fill, spacing=leading, align=align)


def fit_background(path: Path, base_color: tuple[int, int, int]) -> Image.Image:
    if path.exists():
        bg = Image.open(path).convert('RGB')
        scale = max(W / bg.width, H / bg.height)
        bg = bg.resize((int(bg.width * scale), int(bg.height * scale)), Image.Resampling.LANCZOS)
        left, top = (bg.width - W) // 2, (bg.height - H) // 2
        bg = bg.crop((left, top, left + W, top + H))
    else:
        bg = Image.new('RGB', (W, H), base_color)
    return bg


def translucent_gradient(canvas: Image.Image, top_color: tuple[int, int, int, int], bottom_color: tuple[int, int, int, int]) -> None:
    overlay = Image.new('RGBA', (W, H))
    px = overlay.load()
    for y in range(H):
        t = y / max(1, H - 1)
        color = tuple(int(top_color[i] * (1 - t) + bottom_color[i] * t) for i in range(4))
        for x in range(W):
            px[x, y] = color
    canvas.alpha_composite(overlay)


def add_soft_panel(canvas: Image.Image, xy: tuple[int, int, int, int], fill: tuple[int, int, int, int], radius: int = 34, blur: int = 24) -> None:
    panel = Image.new('RGBA', (W, H))
    pdraw = ImageDraw.Draw(panel)
    pdraw.rounded_rectangle(xy, radius=radius, fill=fill)
    if blur:
        panel = panel.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(panel)


def add_double_rule(draw: ImageDraw.ImageDraw, inset: int, color, gap: int = 18, width: int = 3) -> None:
    draw.rectangle((inset, inset, W - inset, H - inset), outline=color, width=width)
    draw.rectangle((inset + gap, inset + gap, W - inset - gap, H - inset - gap), outline=color, width=2)


def draw_title_block(draw: ImageDraw.ImageDraw, y: int, color, align: str = 'center', x: int | None = None, title_size: int = 228, line_gap: int = 8) -> int:
    f1 = font(SERIF, title_size)
    f2 = font(SERIF, title_size + 10)
    if align == 'center':
        centered(draw, y, 'Unedited', f1, color, tracking=1)
        centered(draw, y + title_size + line_gap, 'Christmas', f2, color, tracking=0)
        return y + (title_size * 2) + line_gap + 36
    x = x or 160
    draw.text((x, y), 'Unedited', font=f1, fill=color)
    draw.text((x, y + title_size + line_gap), 'Christmas', font=f2, fill=color)
    return y + (title_size * 2) + line_gap + 36


def add_standard_subtitle(draw: ImageDraw.ImageDraw, y: int, color, align: str = 'center', x: int | None = None, width: int = 1680) -> int:
    fcat = font(SANS, 52)
    fsub = font(SANS, 58)
    if align == 'center':
        centered(draw, y, CATEGORY, fcat, color, tracking=11)
        subtitle = 'A 24-DAY ADVENT DEVOTIONAL\nFOR FINDING PEACE BEYOND\nHOLIDAY PERFORMANCE'
        multiline_center(draw, (W // 2 - width // 2, y + 92, W // 2 + width // 2, y + 420), subtitle, fsub, color, leading=30)
        return y + 470
    x = x or 160
    draw_tracking(draw, (x, y), CATEGORY, fcat, color, 11)
    draw.multiline_text((x, y + 100), 'A 24-DAY ADVENT DEVOTIONAL\nFOR FINDING PEACE BEYOND\nHOLIDAY PERFORMANCE', font=fsub, fill=color, spacing=28)
    return y + 480


def add_author(draw: ImageDraw.ImageDraw, y: int, color, align: str = 'center', x: int | None = None) -> None:
    f = font(SANS, 66)
    if align == 'center':
        centered(draw, y, AUTHOR, f, color, tracking=16)
    else:
        draw_tracking(draw, (x or 160, y), AUTHOR, f, color, 16)


def prep(path: Path, base_color: tuple[int, int, int]) -> Image.Image:
    bg = fit_background(path, base_color)
    canvas = bg.convert('RGBA')
    canvas = ImageEnhance.Contrast(canvas).enhance(1.04)
    canvas = ImageEnhance.Color(canvas).enhance(0.92)
    return canvas


def save(canvas: Image.Image, name: str) -> None:
    out = OUT_DIR / name
    canvas.convert('RGB').save(out, quality=96, subsampling=0, optimize=True)
    print(out)


def variation_01() -> None:
    canvas = prep(BG_DIR / 'cover-variation-01-midnight-warmth-bg.png', (15, 23, 42))
    translucent_gradient(canvas, (6, 12, 28, 72), (217, 119, 6, 18))
    draw = ImageDraw.Draw(canvas)
    cream = (250, 247, 237, 255)
    amber = (236, 174, 75, 255)
    centered(draw, 250, CATEGORY, font(SANS, 48), amber, tracking=12)
    draw_title_block(draw, 440, cream, title_size=230)
    draw.line((420, 1120, 1628, 1120), fill=amber, width=3)
    add_standard_subtitle(draw, 1190, cream, width=1650)
    add_author(draw, 2660, cream)
    save(canvas, 'unedited-christmas-variation-01-midnight-warmth.jpg')


def variation_02() -> None:
    canvas = prep(BG_DIR / 'cover-variation-02-raw-linen-bg.png', (27, 59, 43))
    add_soft_panel(canvas, (120, 115, W - 120, H - 115), (11, 24, 19, 68), radius=18, blur=10)
    draw = ImageDraw.Draw(canvas)
    ivory = (248, 243, 231, 255)
    gold = (202, 168, 99, 255)
    draw_tracking(draw, (180, 250), CATEGORY, font(SANS, 48), gold, 11)
    draw_title_block(draw, 520, ivory, align='left', x=180, title_size=225)
    draw.line((180, 1250, 1030, 1250), fill=gold, width=3)
    add_standard_subtitle(draw, 1320, ivory, align='left', x=180, width=1400)
    add_author(draw, 2680, ivory, align='left', x=180)
    save(canvas, 'unedited-christmas-variation-02-raw-linen.jpg')


def variation_03() -> None:
    canvas = prep(BG_DIR / 'cover-variation-03-dawn-horizon-bg.png', (30, 41, 59))
    draw = ImageDraw.Draw(canvas)
    white = (250, 249, 245, 255)
    dawn = (222, 183, 102, 255)
    # A precise horizon accent reinforces the concept without adding literal Christmas imagery.
    draw.line((110, 1840, W - 110, 1840), fill=dawn, width=6)
    draw.line((110, 1865, W - 110, 1865), fill=(222, 183, 102, 95), width=2)
    draw_tracking(draw, (170, 220), CATEGORY, font(SANS, 48), dawn, 11)
    draw_title_block(draw, 480, white, align='left', x=170, title_size=225)
    add_standard_subtitle(draw, 1280, white, align='left', x=170, width=1500)
    add_author(draw, 2690, white, align='left', x=170)
    save(canvas, 'unedited-christmas-variation-03-dawn-horizon.jpg')


def variation_04() -> None:
    canvas = prep(BG_DIR / 'cover-variation-04-open-hand-bg.png', (247, 244, 239))
    draw = ImageDraw.Draw(canvas)
    charcoal = (35, 33, 31, 255)
    rust = (157, 81, 54, 255)
    draw_tracking(draw, (W // 2, 230), CATEGORY, font(SANS, 48), rust, 11, anchor='ma')
    centered(draw, 440, 'Unedited', font(SERIF, 225), charcoal, tracking=0)
    centered(draw, 700, 'Christmas', font(SERIF, 240), charcoal, tracking=0)
    draw.line((430, 1100, 1618, 1100), fill=rust, width=3)
    add_standard_subtitle(draw, 1170, charcoal, width=1600)
    add_author(draw, 2690, charcoal)
    save(canvas, 'unedited-christmas-variation-04-open-hand.jpg')


def variation_05() -> None:
    canvas = prep(BG_DIR / 'cover-variation-05-structured-editorial-bg.png', (63, 29, 43))
    draw = ImageDraw.Draw(canvas)
    cream = (250, 243, 227, 255)
    gold = (205, 165, 89, 255)
    add_double_rule(draw, 85, gold, gap=18, width=4)
    draw_tracking(draw, (W // 2, 230), CATEGORY, font(SANS, 48), gold, 11, anchor='ma')
    centered(draw, 520, 'Unedited', font(SERIF, 225), cream, tracking=0)
    centered(draw, 780, 'Christmas', font(SERIF, 240), cream, tracking=0)
    draw.line((480, 1160, 1568, 1160), fill=gold, width=3)
    add_standard_subtitle(draw, 1230, cream, width=1600)
    add_author(draw, 2670, cream)
    save(canvas, 'unedited-christmas-variation-05-structured-editorial.jpg')


if __name__ == '__main__':
    variation_01()
    variation_02()
    variation_03()
    variation_04()
    variation_05()
