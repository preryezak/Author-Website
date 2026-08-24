from pathlib import Path
from PIL import Image, ImageOps

src = Path('/home/ubuntu/webdev-static-assets/unedited-christmas/candidate-05-smallcaps/unedited-christmas-candidate-05-smallcaps-v1.jpg')
img = Image.open(src).convert('RGB')
out_dir = src.parent
img.resize((98, 147), Image.Resampling.LANCZOS).save(out_dir / 'unedited-christmas-candidate-05-smallcaps-v1-thumbnail-98x147.jpg', quality=98, subsampling=0, optimize=True)
ImageOps.grayscale(img).save(out_dir / 'unedited-christmas-candidate-05-smallcaps-v1-grayscale.jpg', quality=98, subsampling=0, optimize=True)
print('Created small-caps thumbnail and grayscale proofs')
