from pathlib import Path
from PIL import Image

src = Path('/home/ubuntu/webdev-static-assets/influential-spirit/future-formats/the-influential-spirit-audiobook-selar-thumbnail.png')
out_dir = Path('/home/ubuntu/webdev-static-assets/influential-spirit/final-selar-audiobook')
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / 'the-influential-spirit-audiobook-selar-thumbnail-under-7mb.jpg'

if not src.exists():
    raise FileNotFoundError(src)

with Image.open(src) as im:
    rgb = im.convert('RGB')
    # Retain the square composition and original pixel dimensions.
    rgb.save(out, format='JPEG', quality=88, optimize=True, progressive=True, subsampling=0)

with Image.open(out) as check:
    if check.size[0] != check.size[1]:
        raise ValueError(f'Output is not square: {check.size}')
    if out.stat().st_size >= 7 * 1024 * 1024:
        raise ValueError(f'Output is not below 7 MiB: {out.stat().st_size} bytes')
    print(f'{out}\t{check.size[0]}x{check.size[1]}\t{out.stat().st_size} bytes\t{check.mode}')
    print(f'source_bytes={src.stat().st_size}')
