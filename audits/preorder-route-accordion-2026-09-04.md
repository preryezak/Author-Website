

## Implementation

The Pre-Order route selector now uses the existing accessible accordion primitive. International and Africa remain visible as separate headers at all times. International is open by default; selecting Africa opens the Africa section and closes International; selecting the open header collapses it so neither route is hidden or unreachable. Existing Payhip and Selar links, prices, and bundle content were preserved.

## Verification

TypeScript validation and the production build passed. Full-page desktop and mobile previews were inspected. The layout remains readable at narrow widths, and each route header remains discoverable after the other route expands. The route state is controlled and supports keyboard interaction through the existing accordion implementation.
