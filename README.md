# Therapulse

**Feel the pulse of your mind.** Check in. Find calm. Get the right help.

A React / Next.js / TypeScript mental-wellbeing **website** with REST APIs and a PostgreSQL adapter for Neon. Patient support and therapist workspaces are separate. Changes are published only when the user explicitly requests it. Payments remain in preview mode until a merchant account is supplied.

## Start on Windows

Node.js 20.9 or newer is required. Use `npm.cmd` in PowerShell if its execution policy blocks `npm.ps1`; no security-policy change is needed.

```powershell
cd C:\Hachathon
npm.cmd ci
npm.cmd run db:seed
npm.cmd run dev
```

Open http://127.0.0.1:3000 (or http://localhost:3000). Use the same address consistently within a browsing session. The origin check compares the incoming browser-facing Host rather than Next.js's internal localhost URL.

Without `DATABASE_URL`, development uses encrypted local records in ignored `.data/`. Guest journals are encrypted in this browser. Local demo storage is disabled in production. Never commit `.data/` or real environment values.

### Demo accounts

Run the seed first. Password: `DemoCare!2026`.

| Email | Purpose |
| --- | --- |
| user@therapulse.demo | Personal support account |
| therapist@therapulse.demo | Fictional therapist workspace |
| admin@therapulse.demo | Demo college administrator |

The therapist must submit a current fictional licence document for the local demonstration before configuring practice settings. A submitted file stays pending review; the website never treats an AI confidence score as credential approval.

The seed is local-only and refuses to run against a remote database. It creates three accounts, twelve fictional public specialist examples, one institution, 40 aggregate check-ins, and one pending example. No patient data or actual professional credentials are seeded.

## Website journeys

### For someone seeking support

- **Home → Pulse Check → My next step → guided exercise or therapist.** Questions can be skipped. Comments are optional. The next step explains why it was suggested and opens the specific tool or filtered therapist list.
- A person may go straight to **Find a therapist**, **Calming tools**, or their **Private journal**. A check-in and signup are optional.
- Booking has three clear stages: choose a therapist, choose a time/type/fee, then review and confirm. Free and reduced-fee choices show their exact totals. Available times are reserved atomically; cancelled appointments release the time.
- My sessions contains confirmation, time changes, cancellation, demo feedback, and a clearly labelled session-room/chat preview.
- More support contains a journal, expression helper, safety plan, peer circles, and private progress/history. Saved expressions and gratitude can be revisited. Contact links only open the person's own calling/messaging service; nothing is sent automatically.
- Progress milestones, gentle XP, hiding counts, and a downloadable weekly reflection are optional and never gate access to support.
- Self-harm selections/comments trigger immediate-support options before a normal result. The deterministic safety layer cannot be downgraded by AI. Reflections are not diagnoses.

### For a therapist

1. Choose **Therapist sign in**, then log in or create a therapist account.
2. Paste a picture with Ctrl+V / Cmd+V, drop a file, or select a PNG/JPG/PDF. Confirm name, registration number, authority and expiry. Existing current documents can be confirmed instead of uploaded again.
3. Use **Services & fees** to describe the practice, choose languages/modes/duration, and set individual and group fees. Platform minimums are ₹200 individual and ₹100 per group participant; optional pro-bono and 50% reduced-fee sessions are supported.
4. Use **Availability** to choose weekly days, start times, and whether to offer help to new clients.
5. View only the therapist's own sessions in **My sessions**. Patient journals and check-in answers are never included.

A profile remains unlisted until a human review is approved, the account's verified state is updated, the uploaded licence remains current, and accepting-new-client status is enabled. Replacing a licence resets review. There is no staffed review console or registry integration in this prototype. Production must cross-check applicable official registries (RCI/NMC/state councils or the relevant authority) before approval.

### For an organisation

Choose **Register organisation** to create an organisation account, then complete **Organisation setup** with name, type (institution/corporate/nonprofit/other), contact, size and privacy consent. Institution and corporate annual plans cost **₹50,000 per year**. Other types use the same clearly disclosed prototype price. Annual renewal is manual.

The dedicated workspace follows **monthly survey → aggregate report → recommended included group workshop**. At least five responses are required; rare theme counts below five are suppressed. Personal answers, comments, names and journals never appear in reports. Each account/guest session contributes once per survey; guest sessions do not establish unique real people. Production member verification/invitations are still required.

An organisation can try a **subscription preview**, which is explicitly unpaid and can only make demonstration bookings. A real annual plan is activated only by a verified merchant payment. Monthly recommended group workshops show ₹0 extra to participating members; unlimited individual therapy is not promised. The legacy seeded aggregate endpoint remains for compatibility.

### Malayalam

The header offers English / മലയാളം with a remembered browser preference, the correct document language and a bundled Malayalam font. Navigation, the complete 13-question check-in, next-step guidance, booking/payment, organisation onboarding, core professional setup, tools, privacy and personal-support text use a reviewed source dictionary. Entered names, comments and journals retain their original text. Missing or dynamically generated AI prose falls back to English; AI-generated text and third-party payment pages are not automatically translated. Clinical-language review by a Malayalam-speaking practitioner is still required before real use.

### Session prices and payments

A therapist's saved charge is the base earnings amount. **Patient total = therapist charge + 20% of that charge**. For ₹500, the patient sees ₹600; the platform retains ₹100, the therapist is owed ₹500. This is a 20% markup, equivalent to 16.67% of that gross total, rather than a 20% deduction from the therapist. Calculations use integer paise. Free sessions have no markup; reduced fees apply before markup. The twelve fictional specialists have the requested base fees of ₹499–₹1,299 and all offer Malayalam.

Choose **Pay while booking** or **Pay after the session**. A separate payment page shows the exact breakdown and QR preview. **The preview QR contains non-payment demonstration text. It cannot transfer money.** A receipt or client button cannot mark a payment paid. No merchant account or real payout was configured.

The dormant Razorpay adapter prepares single-use merchant QRs, checks captured payments by amount/currency and verifies webhook HMAC signatures. Payment is first collected by the platform merchant; a Route transfer for the therapist's base charge is only eligible after payment confirmation and session completion, with an approved linked account. This integration has not been exercised against a merchant sandbox or live account. Refunds/disputes, expiring/reconciliation workflows, Route activation and live institutional fulfilment require operational work before enabling collection. See [commerce contracts](docs/COMMERCE.md).

## Architecture and data contracts

- `app/`: Next.js pages and REST route handler.
- `components/website.tsx`: website header, role-specific navigation and page composition.
- `components/pulse-journey.tsx`: focused questions, saved plan, immediate support.
- `components/provider-workspace.tsx`: authentication, private licence intake and therapist settings.
- `components/patient-support.tsx`: directory, booking and appointment management.
- `components/toolkit.tsx`, `components/views.tsx`: retained self-help, journal, community and institution features.
- `lib/care-plan.ts`: deterministic, explained next-step routing.
- `lib/provider-service.ts`, `lib/booking-service.ts`: verified publication, saved prices, slots and scoped appointments.
- `lib/store.ts`: parameterized Neon queries or encrypted development records.
- `docs/UX-REVIEW.md`: public reference review, design decisions and verification scope.

The existing PostgreSQL `Record` model (`owner_id`, `kind`, encrypted `payload`) is unchanged. This revision adds behaviour contracts for kinds `license`, `profile`, public `provider`, `reservation`, and private `appointment`, plus the organisation/payment contracts in `docs/COMMERCE.md`. Licence content stays in the therapist owner namespace; directory entries contain only public profile fields. Reservation IDs are provider/date/time scoped. Therapist appointment copies have their own `appointment:` IDs and never reuse the patient booking's primary key.

**No database schema, migration, Neon project, or remote seed has been applied.** `prisma/schema.prisma` and `prisma/migration.sql` remain prepared definitions. Obtain a separate explicit application instruction before applying SQL. Use a separate Therapulse project in the `thanoof` Neon account; do not use `hasan-buildcon` or `watify`.

## Environment

See `.env.example`. Keep actual values in ignored `.env.local` or deployment secrets.

- `DATABASE_URL`: Neon PostgreSQL pooled URL with SSL parameters. Leave empty for local development.
- `AUTH_SECRET`: independent random secret of at least 32 characters; required in production.
- `DATA_ENCRYPTION_KEY`: independent secret of at least 32 characters; required in production. Preserve it or migrate encrypted records before rotation.
- `ANTHROPIC_API_KEY`: optional, server-only. No key means deterministic reflection and manual licence review.
- `ANTHROPIC_MODEL`: optional model identifier.
- Session markup is fixed at 20% in `lib/pricing.ts`; the legacy `PLATFORM_COMMISSION` setting is unused.
- `PAYMENTS_MODE=preview` by default; merchant keys, webhook secret and approved Route linked-account configuration are server-only and required before any live integration.
- `APP_ORIGIN`: optional exact public origin. Set it when a TLS reverse proxy changes the internal protocol. A configured origin is authoritative. Arbitrary forwarded-host headers are not trusted.

The production deployment requires a Node-compatible Next.js host, database, and secrets. Static-only hosting cannot serve these REST APIs. No hosted deployment was created for this revision.

## REST routes

Mutations use origin checks, a demo-process rate limiter, validated inputs, signed HttpOnly sessions, and encrypted payloads. Personal records are owner scoped.

| Endpoint | Methods | Access / purpose |
| --- | --- | --- |
| `/api/session`, `/api/guest`, `/api/auth`, `/api/logout` | GET / POST | Session, anonymous entry, signup/login/logout |
| `/api/checkins` | GET, POST | Own answers/analysis; optional UUID request key avoids duplicate saves |
| `/api/journal`, `/api/gratitude`, `/api/expression`, `/api/habit` | GET, POST | Own private records |
| `/api/expression/generate` | POST | Template-assisted sentence |
| `/api/safety` | GET, POST | Own plan and up to three optional contacts |
| `/api/therapists` | GET | Fictional examples plus eligible published profiles; no credential files |
| `/api/therapists/:id/slots?date=YYYY-MM-DD` | GET | Available future times, IST |
| `/api/bookings` | GET, POST, PATCH | Own appointments, reschedule/cancel/demo feedback |
| `/api/therapist/workspace` | GET | Own profile, licence summary, appointment copies, review state |
| `/api/therapist/license` | GET, POST multipart | Own encrypted licence; file signature/type/size, expiry and consent checks |
| `/api/therapist/verify` | POST multipart | Alias for licence submission |
| `/api/therapist/profile` | GET, POST | Own practice settings; current licence required to save |
| `/api/organisation/workspace`, `/api/organisation/profile`, `/api/organisation/preview` | GET / POST | Own organisation setup and explicitly unpaid plan preview |
| `/api/organisation/surveys`, `/api/organisation/groups`, `/api/surveys/:token` | POST / POST / GET | Monthly surveys, included workshop booking and public survey introduction |
| `/api/payments`, `/api/payments/:id/qr`, `/api/payments/:id/refresh` | POST | Own price-authoritative payment preview / provider QR / confirmed status |
| `/api/payments/webhook` | POST | Raw-body HMAC-verified provider event; no browser payment confirmation |
| `/api/therapist/earnings`, `/api/therapist/complete` | GET / POST | Own fee accounting and completion after scheduled session end |
| `/api/institution`, `/api/institution/groups` | GET / GET, POST | Organisation-scoped aggregate report and schedules |
| `/api/circles`, `/api/circles/report` | GET, POST / POST | Alias messages, automated keyword checks and report recording |

## Run verification

With the development server on port 3000:

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run test:browser
npm.cmd run build
node scripts/smoke.mjs
```

The browser suite uses the installed Chrome browser on Windows. Set `E2E_BROWSER_PATH` for another Chromium executable or `E2E_BASE_URL` if the server is on a different local port. Browser reports, traces, screenshots, temporary profiles, and test records are kept in ignored `.data/`.

Unit/contract tests cover care guidance, safety overrides, licence validation, own prices, directory publication, privacy thresholds, progress, atomic booking and cancellation. Provider contract tests use a separate temporary local store and never alter database schemas. Browser tests exercise patient and therapist journeys, nine tools, private writing, contacts, circles, organisations, appointments, downloads, keyboard focus, responsive navigation, and automated WCAG A/AA checks. They use fictional data only and must not target production.

## Five-minute demonstration

1. Open Home. Explain the three-step journey and optional guest entry.
2. Complete Pulse Check. Show the reason for its single suggested next step, open that exercise, and continue from its completion screen. Use fictional answers for immediate-support demonstration and do not place calls.
3. Browse sample therapists. Show exact fees and free options, review a demo appointment, then reschedule or cancel from My sessions.
4. Sign in as a therapist. Paste a fictional licence, save services/prices, set weekly times, and show the pending-review boundary and separate workspace.
5. Register an organisation, choose institution or corporate, review the ₹50,000 annual plan, start its unpaid preview, share a monthly survey, then book an included demo workshop after five fictional responses.

## Explicit limits

This is a working local demonstration, not a clinical product. Public sample therapists are fictional. Payments, live video, email delivery, invitations, staffed credential review, registry checks and human community moderation are not connected. AI reflection/vision can only be verified with an authorised API key. Organisation recommendations use privacy-protected aggregate AI when an authorised key is configured and fall back to clearly labelled rules; expression generation remains template based. Peer messages use keyword checks, not clinical monitoring.

Neon is not connected in this checkout. Production deployment, real credential validation, security/retention review, shared rate limiting, distributed scheduling transactions, clinical evaluation, and assistive-technology user testing remain operational work. Automated accessibility tests do not certify that every user or browser can complete every task. Password reset and email verification are not enabled. Malayalam source translations are provided for the core journeys; generated AI prose and third-party content retain an English fallback.

Guest aliases are not untraceable network identities. Optional safety contacts are personal data. Guest journal keys stay on the device; an unlocked browser or malicious code can expose local text. AI and rule-based reflections do not diagnose or replace professional judgement.

**Therapulse is not a substitute for professional medical care or emergency services.**
