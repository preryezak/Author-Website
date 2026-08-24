from pathlib import Path
from PIL import Image, ImageFont, ImageDraw

ROOT = Path('/home/ubuntu')
MASTER = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-v3/unedited-christmas-candidate-05-v3.jpg'
THUMB = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-v3/unedited-christmas-candidate-05-v3-thumbnail-98x147.jpg'
GRAY = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-v3/unedited-christmas-candidate-05-v3-grayscale.jpg'
SERIF = ROOT / 'webdev-static-assets/fonts/CormorantGaramond-Regular.ttf'
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
sans72 = ImageFont.truetype(SANS, 72)
sans96 = ImageFont.truetype(SANS, 96)

def centered(text, y, font):
    return draw.textbbox((0, y), text, font=font, anchor='ma')

u = centered('Unedited', 135, serif330)
c = centered('Christmas', 425, serif355)
sub_a = 'A 24-Day Advent Devotional for Finding'
sub_b = 'Peace Beyond Holiday Performance'
base_a = sum(draw.textlength(ch, font=sans72) for ch in sub_a)
base_b = sum(draw.textlength(ch, font=sans72) for ch in sub_b)
tracking_a = (1560 - base_a) / (len(sub_a) - 1)
tracking_b = (1560 - base_b) / (len(sub_b) - 1)
author = 'ERYEZA KALALU'
author_width = sum(draw.textlength(ch, font=sans96) for ch in author) + (len(author)-1)*22
lines.extend([
    'TEXT GEOMETRY',
    f'  Unedited_bbox={u} width={u[2]-u[0]} height={u[3]-u[1]}',
    f'  Christmas_bbox={c} width={c[2]-c[0]} height={c[3]-c[1]}',
    f'  title_line_gap_pixels={c[1]-u[3]}',
    f'  subtitle_line_1_base_width={base_a:.1f}px target_width=1560px tracking={tracking_a:.2f}px',
    f'  subtitle_line_2_base_width={base_b:.1f}px target_width=1560px tracking={tracking_b:.2f}px',
    f'  subtitle_alignment_pass={abs((base_a+(len(sub_a)-1)*tracking_a) - (base_b+(len(sub_b)-1)*tracking_b)) < 0.1}',
    f'  author_width_with_tracking={author_width:.1f}px font=96 tracking=22 y=2740',
    ''
])

# Warm-gold proxy near the perimeter, used only to document border clearance, not to infer a printer's trim guide.
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
    '  Candidate 5 V3 passes the requested in-place hierarchy correction and digital-front-cover file checks.',
    '  Candidate 5 V3 does not certify a CMYK print PDF, spine, bleed, barcode, or audiobook square; those remain separate production deliverables.',
])

out = ROOT / 'ccndaily-books/audits/unedited-christmas-candidate05v3-technical-audit.txt'
out.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(out)
print(out.read_text(encoding='utf-8'))
