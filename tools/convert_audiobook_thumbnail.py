from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/webdev-static-assets/influential-spirit/future-formats/the-influential-spirit-audiobook-selar-thumbnail.png')
target = Path('/home/ubuntu/webdev-static-assets/influential-spirit/future-formats/the-influential-spirit-audiobook-selar-thumbnail.jpg')

with Image.open(source) as image:
    image.convert('RGB').save(target, 'JPEG', quality=90, optimize=True, progressive=True, subsampling=0)
    print(f'{target}\t{target.stat().st_size}\t{image.width}x{image.height}')
