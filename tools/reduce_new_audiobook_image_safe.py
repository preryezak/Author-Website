from pathlib import Path
from PIL import Image

src = Path('/home/ubuntu/webdev-static-assets/influential-spirit/future-formats/the-influential-spirit-audiobook-selar-thumbnail.png')
out_dir = Path('/home/ubuntu/webdev-static-assets/influential-spirit/final-selar-audiobook')
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / 'the-influential-spirit-audiobook-selar-thumbnail-safe-under-5mb.jpg'

if not src.exists():
    raise FileNotFoundError(src)

with Image.open(src) as im:
    rgb = im.convert('RGB')
    if rgb.size != (1400, 1400):
        rgb = rgb.resize((1400, 1400), Image.Resampling.LANCZOS)
    rgb.save(out, format='JPEG', quality=82, optimize=True, progressive=True, subsampling=2)

with Image.open(out) as check:
    if check.size != (1400, 1400):
        raise ValueError(f'Output is not 1400x1400: {check.size}')
    if out.stat().st_size >= 5 * 1024 * 1024:
        raise ValueError(f'Output is not below 5 MiB: {out.stat().st_size} bytes')
    print(f'output={out}')
    print(f'dimensions={check.size[0]}x{check.size[1]}')
    print(f'bytes={out.stat().st_size}')
    print(f'mebibytes={out.stat().st_size / (1024 * 1024):.3f}')
    print(f'source_bytes={src.stat().st_size}')
