# Organisation and payment contracts

## Pricing

Public provider fee/groupFee are therapist base charges in rupees. Booking fee is the patient total. therapistFee and platformFee snapshot the split at booking time; changing future provider fees cannot change an existing bill. The platform fee is exactly 20% of the base, rounded in integer paise. Concessions apply to base first; free sessions cost zero. Subscription price is ₹50,000 per year and does not receive a therapist markup.

## Payment records

Existing encrypted generic records are used; these features require no additional schema fields. The initial table and index were applied to the new Hachathon Neon database with explicit approval on 18 November 2026. payment belongs to the booking owner, or annual organisation administrator. qrId indexes a private gateway-index for signed events. The website cannot supply its own amount, merchant recipient or paid state. Bookings retain booking/after payment timing. Preview QR contents are plain demonstration text, never UPI credentials. Preview calls remain unpaid; they never activate a real subscription or create a therapist transfer. Preview payments can follow personal guest-account migration.

The optional provider adapter remains disabled by default. It requires merchant keys and a webhook secret, checks captured INR amount exactly, and uses timing-safe HMAC validation of the original webhook body. Real transfers require session completion after its scheduled end and an approved server-configured linked account; the therapist receives the saved base charge. Transfer creation locks remain held after ambiguous provider responses to avoid duplicate transfers; an operator must reconcile these cases. Key rotation, webhook delivery/replay reconciliation, QR expiry/retry, refunds/disputes and operational monitoring must be verified with the provider before live collection. No credentials or payouts were configured during this task.

Primary implementation references: [Razorpay QR events](https://github.com/razorpay/markdown-docs/blob/master/webhooks/qr-codes.md), [Route transfer API](https://github.com/razorpay/markdown-docs/blob/master/api/payments/route.md). Financial and operational eligibility must be checked with the merchant provider; this prototype is not an escrow service.

## Organisation scope

Organisation signup creates its own signed institution role and organisation namespace. It cannot read another organisation. organisation-profile contains name/type/work contact/size/consent. subscription is explicitly preview or active with start/expiry. Only confirmed merchant payment can create an active subscription. Preview access is unpaid, expires after a year and supports fictional providers only. Real included-workshop fulfilment remains coordinated operationally and is not delivered by the local prototype.

One survey per organisation/month has a public unguessable survey-link. Owner survey identifiers are preserved separately from link record identifiers. Submission requires personal or guest identity, privacy consent and valid answers. Private check-in answers stay with the participant. survey-response contains a survey-scoped participant hash, derived score/risk/themes, no name, comments, journal or raw answers. It is upserted once per participant/survey. Guest identities cannot establish unique real people; real member verification must precede a reliable production programme.

The organisation API exposes no participant rows and suppresses all reports under five responses. Individual theme counts under five are also suppressed. Aggregate report AI, when configured, receives only count/average/common themes, and suggestions are cached by safe aggregate fingerprint. Without a key, deterministic suggestions are labelled as rules. This is not diagnosis or individual-risk monitoring. Included-group requests must name a recommendation from an eligible paid/preview survey, have a future date within the annual subscription term, and cost members zero extra. Survey months must also fall inside the plan period. Duplicate recommendation bookings are rejected.

## Localisation

The React language context stores only the language preference in the browser. Malayalam font assets are bundled. Stable option values, answer indices and API identifiers remain in English; translated UI labels cannot change backend enums. Authored user records remain unchanged. A dictionary fallback keeps unreviewed dynamic prose in English rather than inventing a translation. Source and clinical-language review remain necessary before a real service.
