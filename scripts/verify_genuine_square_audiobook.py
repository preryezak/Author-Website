from pathlib import Path
from PIL import Image

ROOT = Path('/home/ubuntu/webdev-static-assets/influential-spirit/future-formats')
EXPECTED = {
    'the-influential-spirit-audiobook-master-square.png': (2400, 2400),
    'the-influential-spirit-audiobook-master-square.jpg': (2400, 2400),
    'the-influential-spirit-audiobook-story-genuine-square-9x16.png': (1080, 1920),
    'the-influential-spirit-audiobook-poster-genuine-square-4x5.png': (1350, 1688),
    'the-influential-spirit-audiobook-banner-genuine-square-16x9.png': (1800, 1000),
}
for name, dimensions in EXPECTED.items():
    path = ROOT / name
    assert path.exists(), f'missing: {name}'
    with Image.open(path) as image:
        print(f'{name}: {image.size}')
        assert image.size == dimensions, f'{name}: expected {dimensions}, got {image.size}'
print('QA=PASS: genuine square master and derived promotional assets have correct dimensions.')
