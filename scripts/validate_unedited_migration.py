from pathlib import Path
import xml.etree.ElementTree as ET
from PIL import Image

root = Path('/home/ubuntu')
svg = root / 'ccndaily-books/migration/unedited-christmas-candidate05/unedited-christmas-candidate05-editable-reconstruction.svg'
readme = root / 'ccndaily-books/migration/unedited-christmas-candidate05/README.md'
art = root / 'webdev-static-assets/unedited-christmas/candidate-05-reordered-master-art.png'
master = root / 'webdev-static-assets/unedited-christmas/candidate-05-sentence-backing/unedited-christmas-candidate-05-sentence-backing-v1.jpg'
thumb = root / 'webdev-static-assets/unedited-christmas/candidate-05-sentence-backing/unedited-christmas-candidate-05-sentence-backing-v1-thumbnail-98x147.jpg'
gray = root / 'webdev-static-assets/unedited-christmas/candidate-05-sentence-backing/unedited-christmas-candidate-05-sentence-backing-v1-grayscale.jpg'

ET.parse(svg)
assert svg.exists() and svg.stat().st_size > 1000
assert readme.exists() and readme.stat().st_size > 1000
assert art.exists()
assert Image.open(art).size[0] > 1000
assert Image.open(master).size == (2048, 3072)
assert Image.open(thumb).size == (98, 147)
assert Image.open(gray).size == (2048, 3072)
source = svg.read_text(encoding='utf-8')
for token in ['BACKGROUND_ART_FIELD', 'TITLE', 'SUBTITLE_LOCAL_BACKING_FIELD', 'SUBTITLE', 'AUTHOR', 'Cormorant Garamond', 'DM Sans']:
    assert token in source, token
print('Editable migration validation passed.')
print(f'SVG bytes: {svg.stat().st_size}')
print(f'Art field: {art.name} {Image.open(art).size}')
print(f'Master: {master.name} {Image.open(master).size}')
print(f'Thumbnail: {thumb.name} {Image.open(thumb).size}')
print(f'Grayscale: {gray.name} {Image.open(gray).size}')
