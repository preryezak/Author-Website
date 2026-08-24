from pathlib import Path
from PIL import Image

path = Path('/home/ubuntu/webdev-static-assets/unedited-christmas/candidate-05-reordered-master-art.png')
im = Image.open(path).convert('RGB')
coords = []
for y in range(500, 1900):
    for x in range(200, im.width - 200):
        r, g, b = im.getpixel((x, y))
        # Gold/olive emblem proxy, excluding most blue-black textile pixels.
        if r > 90 and g > 65 and r > b * 1.35 and g > b * 1.18 and r - b > 32:
            coords.append((x, y))
if coords:
    xs = [x for x, _ in coords]
    ys = [y for _, y in coords]
    print('emblem_proxy_bbox_source=', (min(xs), min(ys), max(xs), max(ys)))
    print('emblem_proxy_bbox_at_2048=', (round(min(xs)*2048/im.width), round(min(ys)*3072/im.height), round(max(xs)*2048/im.width), round(max(ys)*3072/im.height)))
else:
    print('No central emblem proxy detected')
