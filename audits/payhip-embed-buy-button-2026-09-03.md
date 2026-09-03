

## Diagnosis

The homepage currently renders the tiered Payhip product `https://payhip.com/b/CidbX?is_embed_page=1` inside an iframe and places a direct product-page fallback beneath it. The product contains the Reader, Formation, and Complete tiers, so it is a tiered-priced bundle. Payhip’s current official integration guidance states that its embedded Buy Button is unavailable for tiered-priced products, while direct product-page links and direct checkout links are supported patterns. The reported endless processing state is therefore consistent with the iframe approach being unreliable for this product type, not with a local React button handler.

## Proposed correction

Replace the iframe as the primary International checkout experience with an explicit, branded Payhip product-page card that opens `https://payhip.com/b/CidbX` in a new tab. This preserves the tier-selection experience and removes the unsupported iframe dependency. Retain a clearly labeled direct product-page link as the only checkout entry point in this section. Do not change the Africa/Selar route or any approved pricing, product, or copy outside the checkout panel.

Source: Payhip Help Center, “Add Payhip to Your Website,” https://help.payhip.com/article/68-add-payhip-to-your-website.


## Correction and verification

The `PayhipEmbed` component no longer renders the unsupported `is_embed_page=1` iframe. It now presents a Neo-Monastic checkout panel with a clear `Open Payhip checkout` link to `https://payhip.com/b/CidbX`, opening in a new tab. The panel explains that edition selection occurs on the Payhip product page and keeps the three approved edition names visible for orientation. The live product endpoint returned HTTP 200. The source contains no remaining iframe and one direct Payhip product reference. TypeScript validation and the production build passed, and desktop and mobile full-page previews were visually inspected. No pricing, Selar route, newsletter flow, or approved long-form copy was changed.
