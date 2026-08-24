# Sentence-Case Cover Refinement and Migration of Existing Covers into Editable Workflows

## Goal

Create a final comparison refinement for the reordered *Unedited Christmas* Candidate 5 cover by retaining the sentence-case subtitle and testing a restrained local backing field behind the subtitle only. In parallel, establish the practical migration route for the covers and promotional assets already created into an editable Affinity, Canva, or comparable professional workflow.

The central question is not merely what Affinity or Canva can export. It is **how the existing work can be transferred into those tools, what will remain editable after transfer, and what must be rebuilt because the current deliverables are flattened raster compositions**.

## Current cover decision to test

Retain the **sentence-case subtitle** as the primary direction. It is more readable, warmer, and more suitable for a devotional cover than the small-caps alternative. The title and emblem already supply the formal Neo-Monastic character.

Add a restrained local backing field behind the subtitle only. The field should be soft-edged, low-contrast, and integrated with the textile background. It should improve subtitle separation without looking like a rectangular label or a pasted-on design element. The title, emblem, textile background, border, corner ornaments, subtitle wording, two-line break, and author lock-up remain locked.

## What exists now and what its editability means

The completed Candidate 5 covers are primarily **flattened JPEG outputs**. A flattened JPEG can be imported into Affinity or Canva as an editable image object, but the title, subtitle, author name, emblem, border, and background cannot be edited as separate native layers inside those applications.

The project also contains a more useful source asset: the text-free art field used by the compositor, including the textile background, border, corner ornaments, and Star-and-Olive emblem. The project also retains the Python/Pillow compositor and the font files. These do not constitute a native Affinity or Canva file, but they provide enough information to reconstruct the typography accurately.

The migration therefore has two levels:

| Existing element | Transfer status | Practical treatment |
|---|---|---|
| Text-free art field | Transferable as a high-resolution raster background | Import as the locked base layer in Affinity or Canva |
| Title, subtitle, author name | Reconstructable as editable text | Recreate as native text layers using the recorded fonts, sizes, tracking, and coordinates |
| Emblem and corner ornaments | Editable only if separate transparent/vector source exists | Otherwise retain as a locked raster layer; redraw or trace only if a genuinely editable symbol is required |
| Border | Editable only if supplied as separate vector/raster asset | Otherwise retain within the art field or redraw as vector guides |
| Current final JPEG | Transferable but flattened | Use for visual reference, not as the main editable source |
| Python compositor | Transferable as a technical production record | Use to reproduce exact layout; it does not open as native Affinity or Canva layers |
| Fonts | Transferable through documented font files and license records | Install or activate them before reconstructing text layers |

## Migration route for the covers already created

### Phase 1: Gather and lock the best source materials

Use the approved text-free art field rather than the final JPEG wherever possible. For *Unedited Christmas*, the relevant source is the existing Candidate 5 art field and the reordered art field retained in the project assets. Preserve the approved final JPEGs as visual references, but do not use them as the sole editable source.

Collect the Cormorant Garamond and DM Sans font files, the compositor script, the exact title/subtitle/author strings, the recorded coordinates, the font sizes, the tracking values, the border-safe margins, and the approved emblem position. Store these in a migration package together with a short layer map.

### Phase 2: Transfer into Affinity Designer or Affinity Publisher

For a single front cover, create a new Affinity Designer document at 2048 × 3072 px or at the intended print dimensions with 300 DPI. Place the text-free art field as an embedded or linked background layer and lock it.

Create native text layers for `Unedited`, `Christmas`, the two-line sentence-case subtitle, and `ERYEZA KALALU`. Apply the recorded fonts and rebuild the text positions from the compositor. Create the local subtitle backing field as its own layer so it can be adjusted or removed without touching the background.

If a full paperback or hardcover wrap is needed, use Affinity Publisher or an Affinity Designer document with separate front, spine, and back sections. The background, typography, barcode area, spine text, bleed, and print guides should be kept separate. The existing front-cover JPEG should never be stretched across a full wrap without rebuilding the spine and checking bleed.

Affinity is the strongest migration target for the existing covers because it can hold the imported art field and rebuild the typography as native editable objects in one professional document. The result will be a **hybrid editable master**: text and new layout controls are editable; the generated art field remains a locked raster layer unless separate source elements are reconstructed.

### Phase 3: Transfer into Canva

Canva cannot generally turn the lettering already baked into a JPEG into editable Canva text. The practical transfer route is to create a new Canva design, upload the text-free art field, place it as the locked background, and recreate the title, subtitle, author name, and backing field as separate Canva text and shape layers.

The approved final JPEG may also be uploaded as a reference layer, but it should not be used as the working background if it already contains the old title and subtitle, because duplicated lettering will remain visible. Canva is therefore suitable for rebuilding the front cover and for producing social, banner, carousel, and ad variants, but the cover must be reconstructed inside Canva rather than converted automatically from the flattened JPEG.

If only the flattened JPEG is available, the migration route becomes less exact. The old typography would need to be covered with a carefully matched background patch before new text is placed. That approach risks visible texture seams and should be avoided when the text-free art field is available.

### Phase 4: Transfer through an interchange format when useful

For broader professional compatibility, generate a structured SVG or PDF reconstruction containing the art field and vector/text layout. This can serve as an interchange file for Affinity Designer, Affinity Publisher, Inkscape, Illustrator, and similar tools. The SVG/PDF should be treated as a migration aid, not as a guarantee that every application will preserve identical text-layer behavior.

A layered PSD can also be useful for Photoshop-compatible workflows, but it should not be presented as native editable vector art unless the layers have been deliberately created. Figma can accept SVG and PNG assets and is useful for collaborative layouts, but it is not the preferred print-master application for a full book cover.

The migration package should include the original background PNG, any separated emblem or border assets that can be recovered, the SVG/PDF interchange file, the font files or official font references, the compositor script, the exact text, and a layout specification. This makes the work recoverable even if one application becomes unavailable.

## Editable-tool recommendation

Use **Affinity Designer as the canonical editable front-cover master** and **Affinity Publisher for complete print wraps and book interiors**. Use Canva as a downstream marketing and collaboration environment, or as a secondary cover-rebuild environment when quick team editing is more important than precise print control.

Do not expect a finished JPEG to become fully editable simply by importing it. For the covers already created, the correct method is to transfer the text-free art field, then rebuild the typography and any adjustable contrast treatment as native layers. The compositor and font files make that reconstruction substantially more accurate than manually guessing from the flattened image.

## Sentence-case backing-field production and proofing

After the migration route is defined, create the new sentence-case comparison variant from the approved reordered cover. Add the local backing field beneath the subtitle only, keep its edges soft, and ensure it does not touch the emblem, author name, border, or corner ornaments.

Render a 2048 × 3072 RGB master, a 98 × 147 marketplace thumbnail, a 45 × 45 small-icon proof where useful, and a grayscale proof. Audit exact wording, dimensions, aspect ratio, safe margins, subtitle line geometry, background interference, and whether the backing field appears intentional at both full size and thumbnail size.

## Approval gates

The sentence-case/backing-field variant must pass the following gate before it replaces the current cover direction: the title remains dominant; the emblem remains recognizable; the subtitle gains separation without looking boxed in; the local field does not introduce an artificial or AI-slop appearance; the thumbnail remains coherent; and grayscale preserves the hierarchy.

The editable migration should be validated with one existing cover before being generalized to the other books. The first migration proof should show the background layer, editable title, editable subtitle, editable author name, and editable backing field separately. It should also include an exported visual comparison against the approved flattened cover.

No print-wrap, CMYK conversion, audiobook square, or promotional suite should be treated as final until the user approves the refined front-cover direction and the migration proof demonstrates that the editable workflow is reliable.

## Assumptions and risks

This plan assumes the current reordered Candidate 5 cover is the approved composition and that the exact subtitle remains “A 24-Day Advent Devotional for Finding Peace Beyond Holiday Performance.” It assumes the user wants genuine future editability for existing as well as new covers.

The main technical limitation is that the generated art field may remain raster even after migration. That is acceptable for a hybrid editable master, provided the typography and adjustable layout elements are native and the background is high resolution. A second risk is that the emblem and ornaments may be baked into the art field; separating them perfectly may require manual masking or redrawing and should not be promised without inspection. A third risk is that different applications may interpret fonts, tracking, and imported PDFs slightly differently, so the migration proof must be visually compared against the approved cover.
