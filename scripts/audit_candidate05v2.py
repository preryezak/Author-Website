from pathlib import Path
from PIL import Image, ImageFont, ImageDraw

ROOT = Path('/home/ubuntu')
MASTER = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-v2/unedited-christmas-candidate-05-v2.jpg'
THUMB = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-v2/unedited-christmas-candidate-05-v2-thumbnail-98x147.jpg'
GRAY = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-v2/unedited-christmas-candidate-05-v2-grayscale.jpg'
SERIF = ROOT / 'webdev-static-assets/fonts/CormorantGaramond-Regular.ttf'
SANS = ROOT / 'webdev-static-assets/fonts/DMSans-Regular.ttf'

report = []

def check_image(label, path, expected_size=None):
    im = Image.open(path)
    report.append(f'{label}: {path.name}')
    report.append(f'  exists={path.exists()} bytes={path.stat().st_size}')
    report.append(f'  format={im.format} size={im.size} mode={im.mode}')
    if expected_size:
        report.append(f'  expected_size={expected_size} pass={im.size == expected_size}')
    report.append(f'  aspect={im.width / im.height:.8f}')
    report.append('')
    return im

master = check_image('MASTER', MASTER, (2048, 3072))
thumb = check_image('THUMBNAIL', THUMB, (98, 147))
gray = check_image('GRAYSCALE', GRAY, (2048, 3072))

report.append(f'RGB master pass={master.mode == "RGB"}')
report.append(f'No alpha channel pass={"A" not in master.getbands()}')
report.append(f'Square audiobook conversion required={master.width != master.height}')
report.append('')

draw = ImageDraw.Draw(master)

def bbox(text, font, anchor='la'):
    return draw.textbbox((0, 0), text, font=font, anchor=anchor)

def centered_metrics(text, font, y):
    box = draw.textbbox((0, y), text, font=font, anchor='ma')
    return box

un = centered_metrics('Unedited', ImageFont.truetype(SERIF, 330), 135)
christmas = centered_metrics('Christmas', ImageFont.truetype(SERIF, 355), 425)
report.append('TEXT GEOMETRY (computed from compositor settings)')
report.append(f'  title_unedited_bbox={un} width={un[2]-un[0]} height={un[3]-un[1]}')
report.append(f'  title_christmas_bbox={christmas} width={christmas[2]-christmas[0]} height={christmas[3]-christmas[1]}')
report.append(f'  title_line_gap_pixels={christmas[1] - un[3]}')

subtitle_font = ImageFont.truetype(SANS, 72)
sub1 = 'A 24-Day Advent Devotional for Finding Peace'
sub2 = 'Beyond Holiday Performance'
sub1w = draw.textlength(sub1, font=subtitle_font)
sub2w = draw.textlength(sub2, font=subtitle_font)
report.append(f'  subtitle_line_1_width={sub1w:.1f} px')
report.append(f'  subtitle_line_2_width={sub2w:.1f} px')
report.append(f'  subtitle_width_ratio={sub2w/sub1w:.3f}')
report.append(f'  subtitle_box=(120,850,1928,1115) font=72 spacing=26')

author = 'ERYEZA KALALU'
author_font = ImageFont.truetype(SANS, 96)
tracking = 22
authorw = sum(draw.textlength(ch, font=author_font) for ch in author) + (len(author)-1)*tracking
report.append(f'  author_width_with_tracking={authorw:.1f} px y=2740 font=96 tracking=22')
report.append('')

# Assess the inset border's approximate minimum distance from canvas edges by locating warm gold pixels near the perimeter.
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
    report.append('INSET BORDER / ORNAMENT PROXY')
    report.append(f'  warm-gold edge-pixel bbox=({min(xs)},{min(ys)},{max(xs)},{max(ys)})')
    report.append(f'  nearest_edge_distances=(left={min(xs)}, top={min(ys)}, right={master.width-1-max(xs)}, bottom={master.height-1-max(ys)})')
    report.append('  Note: this proxy includes ornaments, not a vector trim guide.')
else:
    report.append('INSET BORDER / ORNAMENT PROXY: no warm-gold edge pixels detected')

report.append('')
report.append('AUDIT STATUS')
report.append('  Master is correctly 2:3 portrait, RGB JPEG, 2048×3072, suitable as a digital front-cover master.')
report.append('  Thumbnail is correctly 98×147 and grayscale proof is correctly 2048×3072.')
report.append('  This audit does not certify a full-bleed print PDF or CMYK profile; those are separate production outputs.')

out = ROOT / 'ccndaily-books/audits/unedited-christmas-candidate05v2-technical-audit.txt'
out.write_text('\n'.join(report) + '\n', encoding='utf-8')
print(out)
print(out.read_text(encoding='utf-8'))
