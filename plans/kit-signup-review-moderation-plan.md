# Kit Signup Test, Review Moderation, and Success-State Plan

## Goal

Verify that the live Influence Circle Kit signup captures a real subscriber, establish a reliable review-submission workflow that Pastor Eryeza can moderate, and add a polished success state after a confirmed Kit signup. The work must preserve the Neo-Monastic visual system, avoid fabricated success claims, keep review submissions unpublished until approval, and remain simple enough for a small ministry publishing team to operate.

## Decisions

The chosen moderation route is **Google Form + linked Google Sheet**. The test signup will use the Kit/admin email already selected by the user, and the same address will receive moderation notifications. No separate review inbox will be introduced at this stage.

The current local review form should not continue to imply that a submission has been delivered to an editorial team when it only displays a browser-side confirmation. It will be replaced or rerouted to the approved Google Form. The public review button will remain easy to find, but the source of truth will be the protected Google Sheet.

The current Payhip/Selar route logic, approved copy, launch date, product contents, and pending product URLs will remain unchanged. This task covers capture, moderation, and confirmation behavior only.

## Cloudflare free-plan alternative

Cloudflare does have a viable native path, but it is a different build from the selected Google workflow. A Cloudflare Worker or Pages Function could receive the form submission, D1 could store it, and Cloudflare Email Service can send notifications to verified destination addresses within its published limits. This would avoid Google Forms but would require a secure submission endpoint, spam protection, database schema, moderation dashboard or authenticated admin access, retention rules, and more ongoing maintenance.

| Approach | Tradeoffs | Cost | Setup complexity |
|---|---|---|---|
| Google Form + linked Sheet — selected | Fastest to operate, mature moderation table, minimal custom code; depends on Google access and an external form surface | No additional service expected if the existing Google account is available | Low |
| Cloudflare Worker/Pages Function + D1 + Email Service | Keeps data closer to the website and can later support a custom moderation dashboard; requires backend security, database operations, email verification, and maintenance | Designed to fit Cloudflare’s free allowances at low volume, subject to the account’s current limits and Email Service availability | Medium to high |
| Hosted form/email service | Quick setup and polished notifications; adds a third-party dependency, service limits, and possible paid upgrade pressure | Provider-dependent | Low to medium |

Cloudflare will remain a future option rather than being added to this first implementation. At the expected early volume, the Google route is the safer operational choice.

## Phase 1: Verify the real Kit signup

1. Open the published Influence Circle form in the authenticated browser and record the exact Kit/admin email being used without exposing it in public copy.
2. Submit the real form with the admin email and a clearly identifiable test name only if the form requests one. Do not enter passwords, payment details, or unrelated personal information.
3. Verify the visible form response, confirmation message or redirect, confirmation email if enabled, and the subscriber record inside Kit.
4. Confirm the form association, tag, sequence, or other expected subscriber metadata. If the admin email is already subscribed, do not create a duplicate; verify the existing subscriber’s form/source state and document the duplicate-handling result instead.
5. Record the outcome accurately: captured, confirmation delivered, metadata applied, or any limitation requiring a Kit setting change. Do not claim success merely because the button was clicked.

## Phase 2: Build the review moderation workflow

1. Create a Google Form with only the information needed for editorial review: reviewer name, role or location (optional), review/reflection text, and explicit permission for the reflection to be considered for publication.
2. Link the Form to a dedicated Google Sheet. Protect the sheet from public access and keep the form’s public URL separate from the private response table.
3. Add moderation columns to the response sheet: status, editorial notes, and publication date. New entries should default to **Pending** and should never publish automatically.
4. Configure notification delivery to the Kit/admin email where Google’s available notification settings support it. If native Sheet notifications are insufficient for the chosen account, use the simplest approved Google Workspace notification route rather than exposing the sheet.
5. Add a clear moderation procedure: review authenticity and attribution, check grammar without changing the writer’s meaning, mark Approved or Rejected, and publish approved material manually on a later editorial pass.
6. Replace the current local-only review form action with the Google Form destination. The button should open the form in a new tab or a reliable accessible modal/iframe, with a visible return path to the landing page. The page must not display “received” or “queued for editorial inclusion” unless the Google submission actually completes.

## Phase 3: Add the Kit success state

1. Use Kit’s native form confirmation or redirect capability first, because the Kit embed is third-party and may render inside an iframe that the page cannot safely inspect.
2. Add a branded success panel around the form area with a calm fade-and-rise entrance, an EK seal, and a factual confirmation such as: “You’re on the list. Watch your inbox for the next word from the library.”
3. Show the panel only after Kit’s documented success/redirect state is confirmed. Do not display it on a failed submission, validation error, network failure, or ordinary button click.
4. If Kit’s embedded form exposes a same-document success state, use a narrowly scoped observer or event bridge to switch from the form to the success panel. If it is cross-origin or inaccessible, retain Kit’s own confirmation view and use a dedicated thank-you route or anchor as the fallback.
5. Add a reduced-motion variant that preserves the same message and hierarchy without animation. Ensure the success panel is keyboard-readable and announced appropriately without trapping focus.

## Verification plan

The Kit path will be tested with the selected admin email, including the already-subscribed case if applicable. The review path will be tested with a clearly marked dummy review, and the result will be verified in the private response Sheet with a Pending status. The notification route will be checked without exposing the Sheet publicly. The approval flow will be tested by moving the dummy entry from Pending to Approved and then removing or clearly marking the test row so it cannot be mistaken for a genuine reader response.

The website will be checked on desktop and mobile for the review button, external-form return path, Kit success state, focus order, loading/failure behavior, and reduced-motion behavior. Production build and TypeScript checks must pass. The browser console must not gain new runtime errors. The final audit must confirm that no internal implementation notes, private email addresses, placeholder testimonials, or unverified review claims appear in the customer-facing page.

## Assumptions and open risks

The Kit/admin email is accessible in the authenticated browser and can receive the test confirmation and moderation notices. Google Workspace access is available for creating the Form and linked Sheet. The selected Kit form may already contain the admin email; if so, the test can verify existing subscriber metadata and confirmation behavior but cannot honestly be described as a brand-new subscriber record.

Kit’s embedded form may be cross-origin or may control its own success markup. The implementation must therefore prefer Kit’s documented confirmation/redirect behavior and use page-side observation only where technically safe. The review workflow will remain moderation-first: no user review will be published automatically, and no review wording or attribution will be fabricated or silently rewritten.

Cloudflare’s Worker, D1, and Email Service capabilities will not be added unless the user later chooses the native route. If selected later, current account limits, verified destination requirements, authentication, spam controls, and data-retention design must be rechecked before implementation.

## Deliverables

The completed implementation will include a verified Kit signup result, a working Google Form and private moderation Sheet, a corrected review button destination, a truthful Kit success state with reduced-motion support, a short operator note explaining the Pending/Approved workflow, and a final build/browser verification report.

## Official references to re-check during implementation

- [Kit Form Builder](https://help.kit.com/en/articles/2502640-the-kit-form-builder)
- [Kit custom fields](https://help.kit.com/en/articles/4000470-how-to-add-custom-fields-to-forms-and-landing-pages)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Cloudflare Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/)

## Approved Email Roles

Use `admin@theccndaily.com` as the Kit sending identity and operational moderation-notification address. Reserve `contact@theccndaily.com` for public reader enquiries. Do not expose either address in customer-facing copy unless the relevant contact pathway requires it.

## Verified Kit Findings

Kit states that the “Built With Kit” badge can be removed from Forms, Landing Pages, and email templates only on paid plans; on the free plan the control is disabled. Source: https://help.kit.com/en/articles/4375211-the-built-with-kit-badge

Kit’s confirmation email settings allow editing the confirmation email and redirecting subscribers after confirmation to a URL chosen by the account owner; the default `https://app.kit.com/confirm-subscription` page cannot be edited. Source: https://help.kit.com/en/articles/2502655-the-confirmation-email

Kit states that testing with the same address or domain as the sending address can cause spam placement, and that freemail sending addresses such as Gmail commonly reduce deliverability. Source: https://help.kit.com/en/articles/3961096-why-are-my-confirmation-emails-going-to-spam

Kit’s verified sending-domain guidance states that SPF, DKIM, and DMARC authentication through a verified domain improves control over the return path and deliverability. Source: https://help.kit.com/en/articles/2502558-verify-your-domain-to-optimize-your-deliverability

## Authenticated Kit Check

The authenticated Kit dashboard is available. The account shows one subscriber, `eryezawrites@gmail.com`, associated with `Influence Circle — The Influential Spirit Launch`. The branded confirmation redirect is saved on the Kit form as `https://theccndaily.com`.

The Google moderation form is published at `https://docs.google.com/forms/d/e/1FAIpQLSddMgY2w4tZhIwLXIVWtyPQ8mRFAzdAGlE4YwYb0U02_zXHCw/viewform` and is linked to the private spreadsheet `https://docs.google.com/spreadsheets/d/1Fae1keWAF-EMImVCrCPrZFzIajJjb81NItofYPjqv88/edit`. The linked response tab is `Form Responses 1`; moderation columns `Status`, `Editorial notes`, and `Publication date` have been added without inserting test data. The owner is `pastor.eryeza@gmail.com`, and the response destination is not public.
