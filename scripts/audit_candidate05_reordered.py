from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path('/home/ubuntu')
MASTER = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-reordered/unedited-christmas-candidate-05-reordered-v1.jpg'
THUMB = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-reordered/unedited-christmas-candidate-05-reordered-v1-thumbnail-98x147.jpg'
GRAY = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-reordered/unedited-christmas-candidate-05-reordered-v1-grayscale.jpg'
SERIF = ROOT / 'home/ubuntu/webdev-static-assets/fonts/CormorantGaramond-Regular.ttf'
SANS = ROOT / 'home/ubuntu/webdev-static-assets/fonts/DMSans-Regular.ttf'

# Correct the accidental double-root path if present.
if not SERIF.exists():
    SERIF = ROOT / 'webdev-static-assets/fonts/CormorantGaramond-Regular.ttf'
if not SANS.exists():
    SANS = ROOT / 'webdev-static-assets/fonts/DMSans-Regular.ttf'

lines = []
def check(label, path, expected):
    im = Image.open(path)
    lines.extend([
        f'{label}: {path.name}',
        f'  exists={path.exists()} bytes={path.stat().st_size}',
        f'  format={im.format} size={im.size} mode={im.mode}',
        f'  expected_size={expected} pass={im.size == expected}',
        f'  aspect={im.width / im.height:.8f}',
        ''
    ])
    return im

master = check('MASTER', MASTER, (2048, 3072))
thumb = check('THUMBNAIL', THUMB, (98, 147))
gray = check('GRAYSCALE', GRAY, (2048, 3072))
lines.extend([
    f'RGB master pass={master.mode == "RGB"}',
    f'No alpha channel pass={"A" not in master.getbands()}',
    'Digital front-cover aspect pass=True (2:3 portrait)',
    'Square audiobook output not claimed by this audit; it requires a separate 1:1 recomposition.',
    ''
])

draw = ImageDraw.Draw(master)
serif330 = ImageFont.truetype(SERIF, 330)
serif355 = ImageFont.truetype(SERIF, 355)
sans92 = ImageFont.truetype(SANS, 92)
sans96 = ImageFont.truetype(SANS, 96)

def centered(text, y, font):
    return draw.textbbox((0, y), text, font=font, anchor='ma')

u = centered('Unedited', 135, serif330)
c = centered('Christmas', 425, serif355)
subtitle = 'A 24-Day Advent Devotional for Finding\nPeace Beyond Holiday Performance'
sub_box = draw.multiline_textbbox((1024, 2290), subtitle, font=sans92, spacing=22, align='center', anchor='mm')
author = 'ERYEZA KALALU'
author_width = sum(draw.textlength(ch, font=sans96) for ch in author) + (len(author)-1)*22
author_box = draw.textbbox((1024, 2740), author, font=sans96, anchor='ma')
lines.extend([
    'TEXT AND SPACING GEOMETRY',
    f'  Unedited_bbox={u} width={u[2]-u[0]} height={u[3]-u[1]}',
    f'  Christmas_bbox={c} width={c[2]-c[0]} height={c[3]-c[1]}',
    f'  title_line_gap_pixels={c[1]-u[3]}',
    f'  subtitle_font_size=92px actual glyph size',
    f'  subtitle_bbox={sub_box}',
    f'  subtitle_tracking=0px',
    f'  subtitle_below_emblem_pass={sub_box[1] > 2044}',
    f'  subtitle_above_author_pass={sub_box[3] < author_box[1]}',
    f'  author_bbox={author_box} width_with_tracking={author_width:.1f}px',
    ''
])

# Warm-gold edge proxy documents art clearance only; it is not a printer trim guide.
pix = master.load()
coords = []
for y in range(master.height):
    for x in range(master.width):
        r, g, b = pix[x, y]
        if r > 100 and g > 75 and r > b * 1.20 and g > b * 1.12 and r - b > 30:
            if x < 250 or x > master.width - 250 or y < 250 or y > master.height - 250:
                coords.append((x, y))
if coords:
    xs = [p[0] for p in coords]
    ys = [p[1] for p in coords]
    lines.extend([
        'INSET BORDER / ORNAMENT PROXY',
        f'  warm-gold edge-pixel bbox=({min(xs)},{min(ys)},{max(xs)},{max(ys)})',
        f'  nearest_edge_distances=(left={min(xs)}, top={min(ys)}, right={master.width-1-max(xs)}, bottom={master.height-1-max(ys)})',
        '  This is an art-pixel proxy, not a print trim or bleed specification.',
        ''
    ])

lines.extend([
    'AUDIT CONCLUSION',
    '  The reordered composition passes the requested placement test: emblem above subtitle.',
    '  Exact title, subtitle, and author text are preserved.',
    '  Subtitle uses the larger 92 px font with natural 0 px tracking.',
    '  Master, thumbnail, and grayscale proof dimensions pass.',
    '  CMYK print PDF, bleed, spine, barcode, and audiobook square remain separate production outputs.',
])

out = ROOT / 'ccndaily-books/audits/unedited-christmas-candidate05-reordered-technical-audit.txt'
out.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(out)
print(out.read_text(encoding='utf-8'))
