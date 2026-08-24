from pathlib import Path
from PIL import ImageFont

font = ImageFont.truetype('/home/ubuntu/webdev-static-assets/fonts/DMSans-Regular.ttf', 72)
words = 'A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance'.split()
for i in range(1, len(words)):
    a = ' '.join(words[:i])
    b = ' '.join(words[i:])
    aw = sum(font.getlength(ch) for ch in a)
    bw = sum(font.getlength(ch) for ch in b)
    print(f'{i:02d} | {aw:7.1f} | {bw:7.1f} | {a} / {b}')
