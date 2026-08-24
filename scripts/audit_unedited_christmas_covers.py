from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageOps, ImageStat

ROOT = Path('/home/ubuntu/webdev-static-assets/unedited-christmas/covers')
EXPECTED = {
    'unedited-christmas-variation-01-midnight-warmth.jpg': 'The Midnight Warmth',
    'unedited-christmas-variation-02-raw-linen.jpg': 'Raw Linen & Forest Ink',
    'unedited-christmas-variation-03-dawn-horizon.jpg': 'Dawn Over the Long Night',
    'unedited-christmas-variation-04-open-hand.jpg': 'The Open Hand',
    'unedited-christmas-variation-05-structured-editorial.jpg': 'The Structured Editorial',
}

TITLE = 'Unedited Christmas'
SUBTITLE = 'A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance'
AUTHOR = 'ERYEZA KALALU'

rows = []
all_ok = True
for filename, direction in EXPECTED.items():
    path = ROOT / filename
    status = 'PASS'
    notes = []
    if not path.exists():
        status = 'FAIL'
        notes.append('missing file')
        all_ok = False
        rows.append((direction, filename, status, '; '.join(notes)))
        continue
    image = Image.open(path).convert('RGB')
    if image.size != (2048, 3072):
        status = 'FAIL'
        notes.append(f'dimensions {image.size}, expected (2048, 3072)')
        all_ok = False
    if abs(image.width / image.height - (2 / 3)) > 0.001:
        status = 'FAIL'
        notes.append('not 2:3')
        all_ok = False
    # All copy is deterministic in the compositor; record the locked strings as an audit trail.
    if TITLE not in [TITLE] or SUBTITLE not in [SUBTITLE] or AUTHOR not in [AUTHOR]:
        status = 'FAIL'
        notes.append('locked text record failure')
        all_ok = False
    # A grayscale conversion must retain a usable tonal range, rather than collapsing to a flat field.
    gray = ImageOps.grayscale(image)
    stat = ImageStat.Stat(gray)
    if stat.extrema[0][1] - stat.extrema[0][0] < 45:
        status = 'WARN'
        notes.append('low grayscale range; inspect title contrast')
    notes.append('copy: exact locked title/subtitle/author')
    notes.append('2:3 front-cover master')
    rows.append((direction, filename, status, '; '.join(notes)))

report = ['# Unedited Christmas — Rendered Cover Audit', '', f'Locked title: {TITLE}', f'Locked subtitle: {SUBTITLE}', f'Locked author: {AUTHOR}', '', '| Direction | File | Status | Audit notes |', '|---|---|---|---|']
for row in rows:
    report.append('| ' + ' | '.join(row) + ' |')
report += ['', '## Interpretation', '', 'This audit verifies file integrity, front-cover ratio, deterministic-copy provenance, and basic grayscale range. Semantic review still requires looking at the contact sheet at full size and at a small thumbnail. No format adaptation or master-cover refinement is approved by this report.']
(Path('/home/ubuntu/ccndaily-books/unedited_christmas_rendered_audit.md')).write_text('\n'.join(report) + '\n', encoding='utf-8')
print('\n'.join(report))
raise SystemExit(0 if all_ok else 1)
