# Local verification — 17 November 2026

Verification baseline: `4102fb4`. The user subsequently authorised publication to thanoof02/Hachathon main. No database migration, live merchant setup, real payment, payout, or website deployment was performed during verification.

## Passed checks

- Production build: npm.cmd run build completed successfully, including TypeScript and static page generation.

- TypeScript: `npm.cmd run typecheck`.
- Unit and isolated service contracts: **34 passed**, using `npm.cmd test`.
- Browser and REST integration: **20 passed** in one sequential run, with the affected organisation journey rechecked after adding annual-plan date limits, using installed Chrome and `npm.cmd run test:browser -- --reporter=list`.
- The REST smoke script also passed owner isolation, role checks, validation, urgency routing, booking ownership, rescheduling/cancellation, and personal guest-data migration.
- Automated WCAG A/AA checks found no violations in the audited states: public patient pages, first question, therapist licence/services, organisation dashboard, mobile navigation, and dark-mode toolkit.
- Visual review: patient home/next-step and therapist licence/services layouts at desktop and 390-pixel mobile width. No horizontal overflow was measured in the reviewed mobile home, plan, or therapist screens.
- Keyboard checks: native question radios, modal Tab wrapping, Escape close, and restoration of the opener's focus.

Additional checks cover persistent Malayalam selection and every check-in question/result, twelve replacement specialist rates with exact 20% markup, both payment timings, non-payment QR contents and unpaid status, organisation registration/type/annual-plan preview, monthly survey privacy and included zero-extra-cost workshop booking, and the participant survey-confirmation journey. Unit contracts reject price tampering, cross-owner payments, invalid webhook signatures, expired entitlements, and included-session dates outside the annual term.

## Browser flows exercised

1. Patient check-in → specific next step → breathing → saved private journal.
2. Higher-support answers → free therapist options without an empty general filter.
3. Immediate-support dialog appears before an ordinary result; no call/message is placed.
4. Therapist signup → paste image → private licence submission → own fees → weekly availability → pending/unlisted state.
5. Booking → exact free total → review → confirmation → room/chat preview → reschedule → cancellation.
6. Nine tools, including grounding, bubbles, worry release, colouring, memory, sliding puzzle, words, breathing, and simulated completion of the focus timer.
7. Accessibility audit, mobile navigation, and dark theme.
8. Gratitude, journal, saved expression text, trusted-contact persistence/removal, and safe contact-link construction.
9. Peer post visibility, reporting/hiding aliases, and private urgency routing.
10. Organisation signup, private monthly aggregate report, annual subscription preview, and saved included group workshop.
11. Keyboard focus throughout dialogs and a question.
12. Optional progress, quiet counts, and weekly reflection download.
13. Personal guest journal migration, followed by login in a separate browser session.
14. Temporary check-in save failure retains answers and succeeds on retry.
15. Private record isolation, HttpOnly cookie, role/JSON/answer validation, cross-site rejection, and idempotent submissions.
16. Missing/expired/invalid licence and professional-portal access protection.

Isolated provider service tests additionally verify that approved/current credentials and saved prices feed the directory, appointment copies are scoped to the right therapist, duplicate-slot reservations fail atomically, and cancellation releases the slot. These tests use a disposable temporary store, not the running website's records or a remote database.

## Limits of verification

These checks are not a clinical validation, WCAG certification, or a guarantee for every device and assistive technology. Neon, authorised Anthropic calls, real professional-registry approval, staffed review/moderation, merchant QR capture, transfers, refunds, live video, email, and invitations remain unconnected or operationally unverified. AI reports and dynamic/third-party text may remain English. Malayalam clinical terminology still needs practitioner review. All browser test accounts, uploaded images, posted messages, and appointment data were fictional local fixtures.
