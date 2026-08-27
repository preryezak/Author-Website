from pathlib import Path
from PIL import Image

SOURCE_DIR = Path('/home/ubuntu/webdev-static-assets/influential-spirit')
OUT_DIR = SOURCE_DIR / 'selar-safe'
OUT_DIR.mkdir(parents=True, exist_ok=True)

sources = [
    SOURCE_DIR / 'future-formats' / 'the-influential-spirit-audiobook-master-square.png',
    SOURCE_DIR / 'future-formats' / 'the-influential-spirit-audiobook-cover-square.png',
]

for source in sources:
    target = OUT_DIR / f'{source.stem}.jpg'
    with Image.open(source) as image:
        rgb = image.convert('RGB')
        rgb.save(target, 'JPEG', quality=88, optimize=True, progressive=True, subsampling=0)
        print(f'{target}\t{target.stat().st_size}\t{rgb.size[0]}x{rgb.size[1]}')
