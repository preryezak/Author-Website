from pathlib import Path
from PIL import Image

SOURCE = Path('/home/ubuntu/ccndaily-books/client/public/assets/images/cover.jpg')
OUTPUT = Path('/home/ubuntu/ccndaily-books/selar-assets/the-influential-spirit-selar-cover.jpg')
MAX_BYTES = 6_500_000

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with Image.open(SOURCE) as image:
    image = image.convert('RGB')
    source_size = image.size
    quality = 94
    working = image
    while True:
        working.save(
            OUTPUT,
            format='JPEG',
            quality=quality,
            optimize=True,
            progressive=True,
            subsampling=0,
        )
        size = OUTPUT.stat().st_size
        if size <= MAX_BYTES or quality <= 82:
            break
        quality -= 2

    print(f'source={SOURCE}')
    print(f'source_dimensions={source_size[0]}x{source_size[1]}')
    print(f'source_bytes={SOURCE.stat().st_size}')
    print(f'output={OUTPUT}')
    print(f'output_dimensions={working.size[0]}x{working.size[1]}')
    print(f'output_bytes={size}')
    print(f'quality={quality}')
