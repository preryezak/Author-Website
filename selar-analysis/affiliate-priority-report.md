# Selar Affiliate Priority Report

**Source file:** `affiliates_report_2026_08_27_08_29.csv`  
**Analysis date:** 27 August 2026  
**Purpose:** Prioritize affiliates with demonstrated sales first, then use verified engagement to fill the free-plan capacity of 40.

## Executive finding

The uploaded export contains **345 affiliate records**, all marked `active`, with a common commission entry of **25%**. The export records **one affiliate with a sale**, not two:

| Priority | Affiliate | Email | Sales | Views | Status | Commission |
|---:|---|---|---:|---:|---|---:|
| 1 | Izekor Godstime | izekorgodstime2462@gmail.com | 1 | 0 | active | 25% |

The Selar dashboard previously displayed **2 affiliates with sales**, so there is a data discrepancy between the dashboard summary and the exported table. No activation decision should rely on the second count until it is reconciled in Selar.

## Recommended selection logic

First reserve a place for Izekor Godstime because the export shows one completed sale. For the remaining 39 places, rank active affiliates by views, while treating views as a prospecting signal rather than proof of conversion. The strongest view-based candidates in the export are:

| Rank | Affiliate | Email | Sales | Views | Status | Commission |
|---:|---|---|---:|---:|---|---:|
| 2 | Daniel December | danieldecember754@gmail.com | 0 | 163 | active | 25% |
| 3 | Simon Pelaun | simonyuana887@gmail.com | 0 | 152 | active | 25% |
| 4 | Ebenezer Akoga | ebenezerphilimonakoga@gmail.com | 0 | 85 | active | 25% |
| 5 | Lawrence Osifo | aghatemwosa@gmail.com | 0 | 82 | active | 25% |
| 6 | Alabi Bolaji J. | bolajialabi928@gmail.com | 0 | 59 | active | 25% |
| 7 | Ekundayo | e0887422@gmail.com | 0 | 57 | active | 25% |
| 8 | Sheba Onome | 08089853537sheba@gmail.com | 0 | 56 | active | 25% |
| 9 | Isaac Moses | kekemoses99@mail.com | 0 | 50 | active | 25% |
| 10 | Ademoyegun Sunday | ademoyegunsunday@gmail.com | 0 | 40 | active | 25% |
| 11 | Odeyemi Oluwadamilola | odeyemioluwadamilola2@gmail.com | 0 | 32 | active | 25% |

The complete ranking is stored in `ranked_affiliates.csv`. It sorts by recorded sales, then sales count, then views, then active eligibility. All 345 records were active and none were marked deactivated in the export.

## Approval required before activation

The export shows a 25% commission for the existing affiliate records, but the user has not yet approved whether 25% should remain the final commission for this preorder. Selar’s official affiliate guide also says that free-plan access is limited to 40 affiliates and that marketplace listing has product, description, support, and commission requirements. The existing dashboard count of 345 affiliates must not be treated as 345 free-plan product slots.

No affiliate was activated, deactivated, or edited during this analysis.

## Source

Selar, “How To Add Affiliates To Your Selar Account,” https://selar.com/blog/how-to-add-affiliates-to-your-selar-account/.
