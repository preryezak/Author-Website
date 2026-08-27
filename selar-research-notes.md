
## Official Selar affiliate guidance checked 2026-08-27

Source: https://selar.com/blog/how-to-add-affiliates-to-your-selar-account/

Key facts from the official Selar guide: merchants can list products to the Selar affiliate marketplace or add affiliates directly to a product. To list a product, go to All Products, open the product’s three-dot menu, choose Publish to the Affiliate network, set a commission, and publish. The guide says affiliate access is available on free, pro, and turbo plans, but the free plan limits access to 40 affiliates and does not provide affiliate access to sales pages, which are a Pro/Turbo feature. Directly adding an affiliate is done from Affiliate Settings using the affiliate email, product, and commission; the guide says the affiliate link is generated afterward. Affiliates can be edited or deactivated from the affiliate dashboard. Commission terms must be confirmed before activation because the guide describes typical minimums of 30% for products below N50,000 and 20% for products priced N50,000 or higher. The guide also recommends clear product imagery, a detailed description, social/store links, a support channel, and affiliate resources.

Operational note: the user has an existing group of 40 affiliates. Do not bulk-activate or change commission terms without the user’s explicit confirmation of the final commission and product access.

Source: https://help.selar.com/portal/en/kb/articles/how-to-create-a-digital-product-on-selar-using-the-file-manager
Source: https://help.selar.com/portal/en/kb/articles/how-to-direct-customers-straight-to-checkout
Source: https://help.selar.com/portal/en/kb/articles/how-to-pass-transaction-fees-to-your-customers-from-your-selar-dashboard

These additional official help URLs were identified for checking product creation, direct checkout, and transaction-fee settings before making account changes.

Source: https://selar.com/pricing
The official affiliate guide states that the free plan supports affiliate access with a 40-affiliate limit; current pricing and fee details should be confirmed in the account before publishing.

## Selar account inspection status

On 2026-08-27, opening https://selar.co/dashboard in the connected browser redirected to a public Selar product page titled “Building Dashboard Course” rather than a merchant dashboard. No product or affiliate account data was inspected or changed. This indicates the current merchant session may not be authenticated at the dashboard route, or Selar may require its current app URL. Do not attempt product or affiliate actions until the merchant dashboard is visible.

## Affiliate dashboard findings 2026-08-27

The authenticated Selar merchant dashboard was reached at https://selar.com/me/dashboard and the affiliate view at https://selar.com/me/affiliates. The dashboard displayed 345 total affiliates and 2 affiliates with sales. The affiliate table showed an existing roster with active status and 25% commission entries; the first visible rows had 0 sales, and one visible row had 1 view and 0 sales. Sorting by Sales did not visibly surface the two affiliates with sales in the current table capture, so the identities of those two affiliates are not yet verified. An export action was clicked, but no CSV appeared in the sandbox Downloads folder because the connected browser uses a separate download context. No activation, commission change, or product setting was performed.

The browser connection then failed while opening chrome://downloads. Continue only after the Selar affiliate page is reachable again or the user provides the exported CSV/screenshot. Prioritize the two affiliates with verified sales, then fill remaining free-plan capacity only after commission approval.

## Selar product audit 2026-08-27

The authenticated merchant dashboard reached All Products through https://selar.com/me/dashboard. The account currently shows four products, all marked DEACTIVATED: The Passion Path (0 sales, UGX 38,610), Prayer Craft (5 sales, UGX 14,500), The Spiritual Health Solution (3 sales, UGX 14,500), and BECOMING AN INFLUENCE (1 sale, UGX 14,500). No The Influential Spirit preorder product was visible on the first page. A new Selar product therefore appears to be required unless it exists on another page or under a different title. No product was created or changed.

## Selar preorder creation form 2026-08-27

The current Selar merchant form supports Digital Product creation, a rich-text description, multiple product variations, Selar Discovery categories including Faith and Spirituality and Books and Education, preorder release date, downloadable/non-downloadable file access, up to 750MB per file, email marketing tags, and an external redirect after purchase. It also exposes currency price fields for UGX, NGN, USD, GBP, GHS, KES, ZAR, TZS, XAF, XOF, and RWF. The approved website pricing data is Reader Edition UGX 45,000, Formation Bundle UGX 90,000, and Complete Formation UGX 150,000, with delivery date 15 September 2026. The product title entered in the draft form is “The Influential Spirit: 30 Days to a Life of Kingdom Authority, Character, and Marketplace Impact.” No product has been created or submitted yet.

## Selar draft state 2026-08-27

The new Digital Product form is open at https://selar.com/me/products/create?type=digital_product. The approved full product title has been entered, and the UGX 45,000 base price has been entered for the Reader Edition. The category dropdown is still unselected; product variations, description, cover/image, preorder release date, downloadable file, and final Create Product submission remain incomplete. No product has been created, published, or made available for sale.

## Selar draft and affiliate analysis checkpoint 2026-08-27

The affiliate export contains 345 active records, one verified sales-producing affiliate (Izekor Godstime, 1 sale), and total recorded views of 942. The dashboard summary previously showed 2 affiliates with sales, which remains an unresolved discrepancy. The Selar product draft has the approved full title and UGX 45,000 base price entered. Faith and Spirituality is the intended category, but it has not yet been selected because native select keyboard interaction needs to be completed. Variations, description, cover, preorder date, file delivery, and final submission remain incomplete. No product or affiliate setting has been published or activated.

## Selar form state after approval 2026-08-27

The approved title and UGX 45,000 base price remain in the unsaved Digital Product draft. The form exposes a File Manager selector for the cover, a rich-text description field, discovery category selectors, product variations, preorder release date, downloadable file access, and the final Create Product action. The user approved 25% commission, All Products scope, and a selection of one proven seller plus the 39 highest-view active affiliates. No affiliate activation or product creation has been submitted.

## Current blocker 2026-08-27

Opening the Selar File Manager from the new preorder form timed out in the connected browser. The draft remains open with title and UGX 45,000 base price entered; no cover, description, category, variants, preorder date, file, or Create Product submission has been completed. No account or affiliate settings were changed.

## Cover upload blocker 2026-08-27

Selar’s File Manager opened and reported no files. Its Upload Files tab exposes a modal control but no file-input element to the connected browser, so the automated upload attempt could not target a file. The approved local cover candidate is `/home/ubuntu/ccndaily-books/client/public/assets/images/cover.jpg`, but no asset was uploaded and no product was created. The draft still needs the cover, description, category, variations, preorder date, and delivery files.

## Selar bundle form resumed 2026-08-27

The authenticated Selar bundle form is reachable again at https://selar.com/me/products/create?type=bundle_product. The optimized cover `the-influential-spirit-selar-cover.jpg` is selected and Selar displays it at 5.5 MB, within the 7 MB recommendation. The approved full title is entered. The form exposes category selection, bundle tiers, UGX and other currency amount fields, product tier descriptions, file access type, and Create Product. No product has been submitted or published.

## Selar bundle form field map 2026-08-27

The authenticated bundle form is visible. The uploaded cover `the-influential-spirit-selar-cover.jpg` is selected and displayed by Selar as 5.5 MB. The full product title is entered. The main rich-text description is empty. Category remains visually unselected; Faith and Spirituality is the intended category. Product Type is Bundle. Bundle Tier 1 is collapsed, while Bundle Tier 2 is available for editing. The form exposes per-tier bundle name, UGX and other currency amounts, tier description, unlimited-sale/close-sale controls, and file upload. No product creation has been submitted.
