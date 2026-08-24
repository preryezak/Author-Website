# Unedited Christmas Candidate 5 — Editable Migration Guide

## Purpose

This package explains how to move the existing Candidate 5 cover into an editable professional workflow. The final JPEG is a flattened delivery image. It can be placed into another application, but its baked-in title, subtitle, author name, border, and emblem do not become separate editable objects automatically.

The migration package therefore uses the approved text-free art field as the background and rebuilds the typography as native text. This produces a hybrid editable master: the typography and local subtitle backing field are editable, while the generated art field remains a locked raster layer unless its individual elements are separately reconstructed.

## Included source materials

| File | Purpose |
|---|---|
| `unedited-christmas-candidate05-editable-reconstruction.svg` | Affinity/Illustrator-friendly reconstruction aid containing the art field, editable SVG text elements, divider, title veil, author name, and local subtitle backing field |
| `/home/ubuntu/webdev-static-assets/unedited-christmas/candidate-05-reordered-master-art.png` | Approved text-free art field used as the background source |
| `/home/ubuntu/webdev-static-assets/unedited-christmas/candidate-05-sentence-backing/unedited-christmas-candidate-05-sentence-backing-v1.jpg` | Flattened visual proof of the sentence-case variant with local subtitle backing field |
| `/home/ubuntu/ccndaily-books/scripts/render_sentence_backing_and_migration.py` | Deterministic reference compositor containing the verified wording, coordinates, font sizes, and local-field treatment |
| `/home/ubuntu/webdev-static-assets/fonts/CormorantGaramond-Regular.ttf` | Display font used for the title |
| `/home/ubuntu/webdev-static-assets/fonts/DMSans-Regular.ttf` | Supporting font used for subtitle and author name |

## Affinity migration: recommended route

Affinity Designer is the preferred destination for the editable front-cover master. Affinity Publisher is preferable when the document will become a complete paperback or hardcover wrap with a spine, back cover, bleed, barcode area, and print guides.

Open the SVG reconstruction in Affinity Designer. If Affinity asks how to interpret the file, preserve the imported text as text objects where possible and keep the embedded background image as an image layer. Save the document immediately as a native Affinity file. The native file is the editable master; the SVG remains an interchange backup.

In the Layers panel, rename and organize the imported objects into the following groups: `BACKGROUND ART FIELD`, `TITLE VEIL`, `SUBTITLE LOCAL BACKING FIELD`, `TITLE`, `DIVIDER`, `SUBTITLE`, and `AUTHOR`. Lock the background art field. Keep the title, subtitle, author, divider, and backing field unlocked so the wording, font sizes, tracking, and placement can be revised without rebuilding the background.

If the SVG opens with fonts substituted, install or activate Cormorant Garamond and DM Sans before making any spacing decisions. Then compare the native Affinity rendering against the approved flattened JPEG. Font substitution can change line lengths and optical centering, so the cover should not be approved until the comparison is visually close.

For a full print cover, create a separate Affinity Publisher document at the final trim size, page count, paper stock, spine width, bleed, and distributor specification. Place the editable front-cover master into the front-cover panel, then construct the spine and back cover as separate areas. Do not stretch the portrait front cover across a full wrap and do not use the digital front-cover JPEG as a substitute for a print-ready wrap.

## Canva migration: realistic route

Canva cannot normally inspect the lettering baked into a JPEG and convert it into editable Canva text. The correct Canva route is reconstruction rather than automatic conversion.

Create a new Canva design at the intended cover dimensions. Upload the text-free art field and use it as the locked background. Recreate the title, subtitle, author name, divider, and local backing field as separate Canva text and shape elements. Use the font names if available in the Canva account. If the exact fonts are unavailable, do not silently substitute them; record the replacement and compare the result against the approved cover.

The final flattened JPEG may be uploaded temporarily as a reference layer at low opacity. It should not remain behind the new text because the old baked-in lettering will show through and create doubled or misaligned typography. Once the new native text is aligned, remove or hide the reference layer.

Canva is a good destination for social graphics, banners, carousel posts, and promotional variants. It is not the strongest canonical source for a precision-controlled print wrap unless the full cover is deliberately rebuilt and checked inside Canva. The Canva design remains editable inside Canva; an exported JPG or PNG will again be flattened.

## What is and is not editable after migration

| Element | Affinity reconstruction | Canva reconstruction |
|---|---|---|
| Title | Editable native text after SVG import or manual rebuild | Editable only if rebuilt as Canva text |
| Subtitle | Editable native text | Editable only if rebuilt as Canva text |
| Author name | Editable native text | Editable only if rebuilt as Canva text |
| Local backing field | Editable vector/shape layer | Editable shape or transparency layer |
| Background textile | Locked raster image | Locked uploaded image |
| Emblem and ornaments | Editable only if separate source artwork exists; otherwise locked inside background | Same limitation |
| Flattened JPEG | Editable as one image object only | Editable as one image object only |

## Recommended file discipline

Keep the flattened JPEGs as delivery proofs, not as the only source. Keep the text-free art field, native Affinity file, SVG interchange file, font record, compositor script, and exact-text record together. When a cover is revised, export a new proof and preserve the previous approved version rather than overwriting it.

For future books, the same migration package should be created immediately after the cover direction is approved. This avoids trying to reverse-engineer a flattened marketplace image later.

## Current recommendation

Use **Affinity Designer as the editable front-cover master**, use **Affinity Publisher for complete print wraps**, and use **Canva for promotional adaptations or a separately rebuilt collaborative version**. For the existing Candidate 5 cover, the text-free art field plus the SVG reconstruction is the most reliable bridge into an editable workflow. The final JPEG alone is not sufficient for true layer-level editing.
