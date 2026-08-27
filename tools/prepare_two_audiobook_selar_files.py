from pathlib import Path
from PIL import Image

OUT_DIR = Path('/home/ubuntu/webdev-static-assets/influential-spirit/final-selar-audiobook')
OUT_DIR.mkdir(parents=True, exist_ok=True)

sources = [
    (
        Path('/home/ubuntu/upload/the-influential-spirit-audiobook-square-master.webp'),
        OUT_DIR / 'the-influential-spirit-audiobook-square-master-selar-safe.jpg',
    ),
    (
        Path('/home/ubuntu/upload/the-influential-spirit-audiobook-marked-selar-safe.jpg'),
        OUT_DIR / 'the-influential-spirit-audiobook-marked-selar-safe.jpg',
    ),
]

for source, target in sources:
    with Image.open(source) as image:
        if image.width != image.height:
            raise ValueError(f'Expected square artwork: {source} is {image.size}')
        rgb = image.convert('RGB')
        rgb.save(target, 'JPEG', quality=90, optimize=True, progressive=True, subsampling=0)
        print(f'{target}\t{target.stat().st_size}\t{rgb.width}x{rgb.height}')
