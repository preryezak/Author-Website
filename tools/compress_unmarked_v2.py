from pathlib import Path
from PIL import Image
source = Path('/home/ubuntu/upload/the-influential-spirit-audiobook-square-master.webp')
target = Path('/home/ubuntu/webdev-static-assets/influential-spirit/final-selar-audiobook/the-influential-spirit-audiobook-square-master-selar-safe-v2.jpg')
with Image.open(source) as image:
    if image.width != image.height:
        raise ValueError(f'Not square: {image.size}')
    image.convert('RGB').save(target, 'JPEG', quality=88, optimize=True, progressive=True, subsampling=0)
    print(f'{target}\t{target.stat().st_size}\t{image.width}x{image.height}')
