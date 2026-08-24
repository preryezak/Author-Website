from pathlib import Path
from PIL import ImageFont

font_path = '/home/ubuntu/webdev-static-assets/fonts/DMSans-Regular.ttf'
lines = ['A 24-DAY ADVENT DEVOTIONAL FOR FINDING', 'PEACE BEYOND HOLIDAY PERFORMANCE']
for size in [62, 64, 66, 68, 70, 72, 74, 76, 78]:
    ft = ImageFont.truetype(font_path, size)
    print(f'size={size}')
    for line in lines:
        base = sum(ft.getlength(ch) for ch in line)
        natural = ft.getlength(line)
        print(f'  {line[:12]} base_char_sum={base:.1f} natural={natural:.1f}')
        for tracking in [0, 2, 4, 6, 8]:
            width = base + max(0, len(line)-1) * tracking
            if width < 1848:
                print(f'    tracking={tracking} width={width:.1f}')
