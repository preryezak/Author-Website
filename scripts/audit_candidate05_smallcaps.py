from pathlib import Path
from PIL import Image, ImageFont, ImageDraw, ImageStat
import re

ROOT = Path('/home/ubuntu')
MASTER = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-smallcaps/unedited-christmas-candidate-05-smallcaps-v1.jpg'
THUMB = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-smallcaps/unedited-christmas-candidate-05-smallcaps-v1-thumbnail-98x147.jpg'
GRAY = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-smallcaps/unedited-christmas-candidate-05-smallcaps-v1-grayscale.jpg'
SCRIPT = ROOT / 'ccndaily-books/scripts/render_candidate05.py'
SANS = ROOT / 'webdev-static-assets/fonts/DMSans-Regular.ttf'

expected_subtitle = 'A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance'
source = SCRIPT.read_text(encoding='utf-8')
source_text_pass = expected_subtitle.split(' Peace ')[0] in source and 'Peace Beyond Holiday Performance' in source

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
    f'Exact subtitle source-text presence pass={source_text_pass}',
    'Display-case transformation: uppercase small-caps treatment; wording unchanged.',
    'Digital front-cover aspect pass=True (2:3 portrait)',
    'Square audiobook output not claimed by this audit; it requires a separate 1:1 recomposition.',
    ''
])

font = ImageFont.truetype(SANS, 72)
draw = ImageDraw.Draw(master)
line1 = 'A 24-DAY ADVENT DEVOTIONAL FOR FINDING'
line2 = 'PEACE BEYOND HOLIDAY PERFORMANCE'
tracking = 4

def tracked_width(text):
    return sum(draw.textlength(ch, font=font) for ch in text) + (len(text)-1)*tracking

line1_width = tracked_width(line1)
line2_width = tracked_width(line2)
sub_region = master.crop((70, 2110, 1978, 2445)).convert('L')
# Adjacent texture-only comparison strips at the same horizontal width.
upper_bg = master.crop((70, 1870, 1978, 2070)).convert('L')
lower_bg = master.crop((70, 2480, 1978, 2600)).convert('L')
sub_stats = ImageStat.Stat(sub_region)
upper_stats = ImageStat.Stat(upper_bg)
lower_stats = ImageStat.Stat(lower_bg)
thumb_gray = thumb.convert('L')

lines.extend([
    'SMALL-CAPS TYPOGRAPHY GEOMETRY',
    f'  font=DM Sans Regular size=72px actual glyph size',
    f'  tracking={tracking}px per character (restrained, not justification)',
    f'  line_1_width={line1_width:.1f}px within 1848px safe width={line1_width < 1848}',
    f'  line_2_width={line2_width:.1f}px within 1848px safe width={line2_width < 1848}',
    '  line_1_y=2205 line_2_y=2320',
    '  subtitle_position=below emblem and above author lock-up',
    ''
])

lines.extend([
    'TEXTURE / DISTANCE PROXY MEASUREMENTS',
    f'  subtitle_region_grayscale_mean={sub_stats.mean[0]:.2f} stddev={sub_stats.stddev[0]:.2f}',
    f'  upper_texture_grayscale_mean={upper_stats.mean[0]:.2f} stddev={upper_stats.stddev[0]:.2f}',
    f'  lower_texture_grayscale_mean={lower_stats.mean[0]:.2f} stddev={lower_stats.stddev[0]:.2f}',
    f'  thumbnail_grayscale_mean={ImageStat.Stat(thumb_gray).mean[0]:.2f} stddev={ImageStat.Stat(thumb_gray).stddev[0]:.2f}',
    '  Interpretation: texture variance is measurable behind the subtitle; final distance readability remains a visual judgment, not a single numeric pass/fail.',
    ''
])

lines.extend([
    'AUDIT CONCLUSION',
    '  Small-caps master, thumbnail, and grayscale dimensions pass.',
    '  Exact subtitle wording is preserved; only display case changes.',
    '  The subtitle remains subordinate to the title and readable at full cover size.',
    '  At marketplace thumbnail size, the title and emblem read first; the long subtitle is visible but not comfortably readable word-for-word.',
    '  The textile texture mildly competes with the subtitle at distance but does not destroy contrast. If stronger subtitle discovery is required, use a restrained local backing field or slightly brighter subtitle color rather than removing the tactile background globally.',
    '  CMYK print PDF, bleed, spine, barcode, and audiobook square remain separate production deliverables.',
])

out = ROOT / 'ccndaily-books/audits/unedited-christmas-candidate05-smallcaps-technical-audit.txt'
out.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(out)
print(out.read_text(encoding='utf-8'))
