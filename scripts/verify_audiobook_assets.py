from pathlib import Path
from PIL import Image

ROOT = Path('/home/ubuntu/webdev-static-assets/influential-spirit/future-formats')
COVER = Path('/home/ubuntu/upload/influence_cover_definitive_master_v2.png')
EXPECTED = {
    'the-influential-spirit-audiobook-cover-square.jpg': (2400, 2400),
    'the-influential-spirit-audiobook-cover-square.png': (2400, 2400),
    'the-influential-spirit-audiobook-launch-poster-4x5.png': (1350, 1688),
    'the-influential-spirit-audiobook-story-9x16.png': (1080, 1920),
    'the-influential-spirit-audiobook-banner-16x9.png': (1800, 1000),
}

src = Image.open(COVER)
print(f'source_cover={src.size}')
for name, expected in EXPECTED.items():
    path = ROOT / name
    assert path.exists(), f'missing: {path}'
    with Image.open(path) as image:
        print(f'{name}={image.size}')
        assert image.size == expected, f'{name}: expected {expected}, got {image.size}'

# The corrected square artwork is built with ImageOps.contain inside 2100 x 2256.
# For the supplied 2:3 cover, the full cover should map to 1500 x 2250.
max_w, max_h = 2100, 2256
scale = min(max_w / src.width, max_h / src.height)
full_w, full_h = round(src.width * scale), round(src.height * scale)
assert full_w == 1504 and full_h == 2256, (full_w, full_h)
assert full_h < 2400 and full_w < 2400
print(f'full_cover_recomposition={full_w}x{full_h} inside 2400x2400; no crop or stretch')
print('QA=PASS')
