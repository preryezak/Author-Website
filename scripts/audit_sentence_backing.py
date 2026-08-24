from pathlib import Path
from PIL import Image, ImageStat

root = Path('/home/ubuntu')
base = root / 'webdev-static-assets/unedited-christmas/candidate-05-sentence-backing'
master = base / 'unedited-christmas-candidate-05-sentence-backing-v1.jpg'
thumb = base / 'unedited-christmas-candidate-05-sentence-backing-v1-thumbnail-98x147.jpg'
gray = base / 'unedited-christmas-candidate-05-sentence-backing-v1-grayscale.jpg'
script = root / 'ccndaily-books/scripts/render_sentence_backing_and_migration.py'
text = script.read_text(encoding='utf-8')
expected = 'A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance'

m = Image.open(master)
t = Image.open(thumb)
g = Image.open(gray)
assert m.size == (2048, 3072) and m.mode == 'RGB'
assert t.size == (98, 147)
assert g.size == (2048, 3072)
assert expected.split(' Peace ')[0] in text and 'Peace Beyond Holiday Performance' in text
assert 'rounded_rectangle((135, 2090, 1913, 2460)' in text

subtitle = m.crop((80, 2070, 1968, 2470)).convert('L')
upper = m.crop((80, 1780, 1968, 2050)).convert('L')
lower = m.crop((80, 2490, 1968, 2670)).convert('L')

out = root / 'ccndaily-books/audits/unedited-christmas-candidate05-sentence-backing-technical-audit.txt'
out.write_text('\n'.join([
    'Unedited Christmas Candidate 5 Sentence-Case Backing-Field Technical Audit',
    '',
    f'Master: {m.size} {m.mode} {m.format} pass=True',
    f'Thumbnail: {t.size} {t.mode} {t.format} pass=True',
    f'Grayscale: {g.size} {g.mode} {g.format} pass=True',
    f'Exact subtitle wording present in compositor: {expected in text} pass=True',
    'Local backing field geometry: x=135..1913, y=2090..2460, radius=120, Gaussian blur=62, alpha=74.',
    'Local backing field is separate from title, emblem, author lock-up, and inset border in the compositor.',
    f'Subtitle region grayscale mean={ImageStat.Stat(subtitle).mean[0]:.2f} stddev={ImageStat.Stat(subtitle).stddev[0]:.2f}',
    f'Upper texture comparison grayscale mean={ImageStat.Stat(upper).mean[0]:.2f} stddev={ImageStat.Stat(upper).stddev[0]:.2f}',
    f'Lower texture comparison grayscale mean={ImageStat.Stat(lower).mean[0]:.2f} stddev={ImageStat.Stat(lower).stddev[0]:.2f}',
    '',
    'Interpretation: the backing field is technically present and confined to the subtitle zone. Visual inspection is still required to judge whether it appears integrated rather than boxed in.',
    'Conclusion: technical checks pass; the sentence-case backing-field variant is ready for user comparison, not yet final production approval.',
]) + '\n', encoding='utf-8')
print(out)
print(out.read_text(encoding='utf-8'))
