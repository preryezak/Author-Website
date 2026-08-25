# Kit Implementation Plan for The Influential Spirit

## Canonical system

Kit is the canonical subscriber database and lifecycle-email layer for launch, product, event, affiliate, and library communications. THE CCN DAILY weekly newsletter remains on Substack. Influence Circle is a campaign audience within Kit, not a replacement newsletter.

## Completed foundation

The form **Influence Circle — The Influential Spirit Launch** was created and published in Kit. It includes Email Address and First name fields. The live JavaScript embed is recorded in `integrations/kit-influence-circle-embed.md`.

## Tags to create and use

Use one subscriber database with durable tags rather than separate lists. The launch foundation requires `Interest: The Influential Spirit` and `Campaign: IS Launch 2026`. The wider system should later include `Buyer: The Influential Spirit`, `Buyer: Journal`, `Buyer: Study Guide`, `Interest: Deep Encounter Library`, `Interest: Events`, `Affiliate: Selar`, and `Customer: Legacy Selar`.

The first name field needs to be mapped to Kit’s native subscriber first-name field if the account exposes that selector. If Kit requires a custom field instead, preserve the visible label `First name` and document the mapping before launch.

## Welcome sequence, draft only

The six-email sequence is intentionally not activated:

1. Welcome and why the book exists.
2. A free preview or sample reading.
3. Formation Before Platform: the central idea.
4. Behind the book and the revision story.
5. Launch date and edition options.
6. Final prelaunch reminder.

## Launch broadcasts, draft only

Use scheduled Kit Broadcasts for launch-day and launch-week messages rather than placing every announcement inside the welcome sequence. Buyers should be excluded from purchase-pressure broadcasts once the relevant buyer tag is reliably applied by the storefront or an approved integration.

## Approval boundaries

The form itself is published with the creator’s confirmation. No welcome sequence, broadcast, buyer automation, affiliate automation, or purchase-triggered email should be activated or sent until the copy, consent language, storefront links, tagging method, and exclusion logic are reviewed and approved.
