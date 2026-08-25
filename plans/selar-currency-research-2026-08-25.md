# Selar Currency Research

Selar’s official multicurrency page lists the supported currencies as USD, GBP, NGN, KES, GHS, TZS, UGX, XOF, XAF, ZMW, RWF, and ZAR. It states that Selar uses an automatic store IP detector to show a visitor’s likely local currency first, while also allowing merchants to enable currencies and control prices.

Selar’s official custom-pricing guide states that merchants can select currencies in Store Currency settings and manually set a product price for each enabled currency. It warns that every enabled currency must have a price or it may display as zero. The guide also recommends testing the store in each enabled currency.

Implementation decision: the website may provide a client-side currency selector that displays rounded planning estimates derived from the UGX anchor price, but it must label them as estimates until the exact fixed Selar prices are entered and verified in Selar. The Selar checkout remains the source of truth. The route-first UI should show USD only for Payhip and UGX plus supported Selar currencies for the Africa route.

## Sources

[1]: https://selar.com/features-multicurrency "Selar Multicurrency Payments"
[2]: https://help.selar.com/portal/en/kb/articles/how-do-i-set-my-product-prices-in-my-own-rates-for-different-currencies "Selar: Set Product Prices in Your Own Rates"
[3]: https://help.selar.com/portal/en/kb/articles/payout-conversion-structure "Selar: Payout and Conversion Structure"
