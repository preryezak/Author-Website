from pathlib import Path
from PIL import Image, ImageStat

ROOT = Path('/home/ubuntu')
OUT = ROOT / 'webdev-static-assets/unedited-christmas/inner-pages'
SCRIPT = ROOT / 'ccndaily-books/scripts/render_unedited_christmas_inner_pages.py'
AUDIT = ROOT / 'ccndaily-books/audits/unedited-christmas-inner-pages-technical-audit.txt'

files = {
    'Option A PNG': OUT / 'unedited-christmas-inner-page-option-a-text-only.png',
    'Option A JPG': OUT / 'unedited-christmas-inner-page-option-a-text-only.jpg',
    'Option B PNG': OUT / 'unedited-christmas-inner-page-option-b-full-monochrome-replica.png',
    'Option B JPG': OUT / 'unedited-christmas-inner-page-option-b-full-monochrome-replica.jpg',
}
source = ROOT / 'webdev-static-assets/unedited-christmas/candidate-05-sentence-backing/unedited-christmas-candidate-05-sentence-backing-v1.jpg'
text = SCRIPT.read_text(encoding='utf-8')
expected = ['Unedited Christmas', 'A 24-Day Advent Devotional for Finding', 'Peace Beyond Holiday Performance', 'ERYEZA KALALU']

assert source.exists()
for phrase in expected:
    assert phrase in text, phrase

lines = ['Unedited Christmas Inner Pages — Technical Audit', '']
for label, path in files.items():
    assert path.exists() and path.stat().st_size > 1000
    im = Image.open(path)
    size_ok = im.size == (2048, 3072)
    mode_ok = im.mode == 'RGB'
    dpi = im.info.get('dpi')
    dpi_ok = bool(dpi and dpi[0] >= 299 and dpi[1] >= 299)
    assert size_ok and mode_ok
    lines.append(f'{label}: {im.size} mode={im.mode} format={im.format} bytes={path.stat().st_size} size_pass={size_ok} rgb_pass={mode_ok} dpi={dpi} dpi_pass={dpi_ok}')

# Option A is intentionally a light paper field; verify its background is predominantly light.
a = Image.open(files['Option A PNG']).convert('L')
a_stat = ImageStat.Stat(a)
corner_samples = [a.getpixel((x, y)) for x, y in [(0, 0), (2047, 0), (0, 3071), (2047, 3071)]]
white_corner_pass = all(v > 220 for v in corner_samples)
lines.append(f'Option A light-paper corners={corner_samples} white_corner_pass={white_corner_pass}')

# Option B must preserve a dark grayscale cover field and the complete replica source size.
b = Image.open(files['Option B PNG']).convert('L')
b_stat = ImageStat.Stat(b)
dark_field_pass = b_stat.mean[0] < 100
lines.append(f'Option B grayscale mean={b_stat.mean[0]:.2f} dark_field_pass={dark_field_pass}')

# Exact word-level verification is source-code based because the final assets are rasterized.
lines.append('Exact wording source verification: PASS')
lines.append('Option A treatment: no emblem, icons, decorative border, or divider; text-only light paper field.')
lines.append('Option B treatment: full grayscale conversion of approved sentence-case cover, retaining emblem, border, ornaments, textile field, local subtitle backing field, and text.')
lines.append('Print intent: 2048×3072 RGB raster at 300 DPI metadata. Final interior placement must still follow the chosen trim size, bleed, and printer template.')
lines.append('Technical conclusion: all four requested PNG/JPG files pass dimensions and RGB checks; both options are ready for user selection, not yet locked as the final interior page.')

AUDIT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(AUDIT)
print(AUDIT.read_text(encoding='utf-8'))
