from pathlib import Path
from PIL import Image

src = Path('/home/ubuntu/webdev-static-assets/unedited-christmas/candidate-05-sentence-backing/unedited-christmas-candidate-05-sentence-backing-v1.jpg')
out = Path('/home/ubuntu/webdev-static-assets/unedited-christmas/candidate-05-sentence-backing/unedited-christmas-candidate-05-sentence-backing-v1.png')
img = Image.open(src).convert('RGB')
img.save(out, format='PNG', optimize=True)
check = Image.open(out)
assert check.size == (2048, 3072)
assert check.mode == 'RGB'
print(out)
print(f'{check.size[0]}x{check.size[1]} {check.mode} {check.format} {out.stat().st_size} bytes')
