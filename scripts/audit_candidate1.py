from pathlib import Path
from PIL import Image, ImageOps, ImageStat

src = Path('/home/ubuntu/webdev-static-assets/unedited-christmas/candidate-01/unedited-christmas-candidate-01-midnight-warmth.jpg')
out = src.parent
img = Image.open(src).convert('RGB')
thumb = img.resize((98, 147), Image.Resampling.LANCZOS)
thumb.save(out / 'unedited-christmas-candidate-01-thumbnail-98x147.jpg', quality=95, subsampling=0)
gray = ImageOps.grayscale(img)
gray.save(out / 'unedited-christmas-candidate-01-grayscale.jpg', quality=95)
stat = ImageStat.Stat(gray)
report = f'''# Candidate 1 Audit Proofs\n\n- Source: {src}\n- Source dimensions: {img.size}\n- Thumbnail dimensions: {thumb.size}\n- Grayscale range: {stat.extrema[0][0]} to {stat.extrema[0][1]}\n- Locked title: Unedited Christmas\n- Locked subtitle: A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance\n- Locked author: ERYEZA KALALU\n- Typography files: /home/ubuntu/webdev-static-assets/fonts/CormorantGaramond-Regular.ttf and /home/ubuntu/webdev-static-assets/fonts/DMSans-Regular.ttf\n\n## Human visual check\n\n- [ ] Title remains clear at thumbnail size.\n- [ ] Subtitle remains readable enough to identify the book's promise.\n- [ ] Author name remains distinct from the background.\n- [ ] Candle remains one focal metaphor rather than visual clutter.\n- [ ] No visible mockup border, spine, or cropped cover treatment.\n- [ ] The overall finish feels like a complete shelf cover, not a sketch or mood board.\n'''
Path('/home/ubuntu/ccndaily-books/unedited_christmas_candidate1_audit.md').write_text(report, encoding='utf-8')
print(report)
