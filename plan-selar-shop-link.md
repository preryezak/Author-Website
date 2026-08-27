# Connect the Verified Selar Shop to the Author Website

## Goal

Replace the temporary Selar placeholder destination on the live author website with the verified Selar storefront URL:

`https://selar.com/8818840887`

The website should continue to show Payhip as the default International route and reveal the Selar storefront through the explicit Africa route, preserving the existing Neo-Monastic presentation, bundle cards, pricing, and approved copy.

## Current State

The Africa route is already present in `client/src/pages/Home.tsx`. Its three bundle-card CTAs are currently directed to `#influence-circle`, which was a temporary placeholder while the final Selar product URL was pending. The project handoff confirms that `https://selar.com/8818840887` is the verified live Selar product, with the expected UGX and NGN tier pricing and strike-through launch pricing.

## Planned Changes

1. Update the three Africa/Selar bundle-card CTAs in `client/src/pages/Home.tsx` so each points to `https://selar.com/8818840887` instead of `#influence-circle`.
2. Open the external Selar storefront in a new tab using `target="_blank"` and `rel="noopener noreferrer"`, keeping the existing button styling and label unless a visual audit shows a clear need for a minor accessibility adjustment.
3. Preserve the existing route-first behavior: International remains selected by default and continues to render the Payhip embed; Selar remains visible only after the visitor selects Africa.
4. Ensure the Influence Circle capture flow remains intact as a separate newsletter/community action and is not used as a commerce fallback now that the final Selar URL exists.
5. Run the project’s production build and TypeScript check.
6. Inspect the rendered desktop and mobile Africa route to confirm that all three CTAs have the correct destination, remain readable, and do not create navigation dead ends.
7. Save a new project checkpoint documenting the exact URL change and verification results.

## Acceptance Tests

| Area | Test | Pass condition |
|---|---|---|
| Source | Search the homepage source for the old Africa CTA target | No Africa/Selar purchase CTA still points to `#influence-circle` |
| Source | Search for the verified shop URL | The URL is present in all intended Selar purchase CTAs |
| Build | Run production build and TypeScript validation | Both complete without new errors |
| Desktop | Select Africa and inspect all three bundle cards | Each CTA is visible, correctly styled, and links to the verified Selar shop |
| Mobile | Select Africa and inspect the stacked cards | Each CTA remains accessible, readable, and does not overflow the viewport |
| Commerce separation | Inspect Influence Circle controls | Newsletter/community capture remains separate from the Selar purchase action |
| External link safety | Inspect rendered anchor attributes | New-tab links include `rel="noopener noreferrer"` |

## Assumptions

The single verified Selar product page contains the Reader, Formation, and Complete tiers, so all three website bundle cards should link to the same storefront rather than attempting to construct tier-specific URLs. No pricing, product contents, delivery date, copy, or Payhip behavior will be changed.

The user has supplied the final URL and is asking for a website connection, not for a purchase or other sensitive external submission. The live Selar listing itself will not be edited.

## Risks and Mitigations

The website cannot expose or validate Selar’s cross-origin checkout contents from its own page. Verification will therefore confirm the exact outbound URL and the successful opening behavior, while the Selar storefront remains responsible for the final tier selection and checkout.

Because the current website preview may retain a cached build, verification will include the source/build version and the rendered preview. Deployment or custom-domain propagation will be reported separately if the updated build is not immediately visible.

## Deliverable

A committed, built, and checkpointed website revision in which the Africa/Selar purchase CTAs lead directly to `https://selar.com/8818840887`, with the existing Payhip default route and Influence Circle capture flow preserved.
