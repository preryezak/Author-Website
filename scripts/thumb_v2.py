from pathlib import Path
from PIL import Image

src = Path('/home/ubuntu/webdev-static-assets/unedited-christmas/candidate-01-v2/unedited-christmas-candidate-01-v2.jpg')
img = Image.open(src).convert('RGB')
thumb = img.resize((98, 147), Image.Resampling.LANCZOS)
thumb.save(src.parent / 'unedited-christmas-candidate-01-v2-thumbnail-98x147.jpg', quality=95, subsampling=0)
print('Thumbnail saved')
