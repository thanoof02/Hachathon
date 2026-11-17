# Therapulse

**Feel the pulse of your mind.** Check in. Calm down. Get the right help.

A Next.js 16 / React 19 / TypeScript hackathon prototype for Mental Health & Wellbeing: Calm, Heal, Thrive. Built for `thanoof02/Hachathon`, with a PostgreSQL adapter for Neon. It is a demonstrable wellbeing app, not a clinical service.

## Run locally

Requires Node.js 20.9 or newer.

```powershell
cd C:\Hachathon
npm ci
npm run db:seed
npm run dev -- --port 3001
```

Open http://127.0.0.1:3001. No API key, Neon account, or network connection is needed after dependencies are installed. With no DATABASE_URL, development uses an encrypted local store under `.data/`. Do not commit that directory. Local storage is intentionally disabled in production.

Do not set NODE_ENV=production when running the local demo. `npm run build` still verifies the production bundle without requiring database credentials. A production server requires a configured database and secrets.

### Demo credentials

Run the local seed first. All accounts use `DemoCare!2026`.

| Email | Role |
| --- | --- |
| user@therapulse.demo | Registered user, sample check-ins |
| therapist@therapulse.demo | Fictional therapist |
| admin@therapulse.demo | Demo college administrator |

The seed adds four fictional therapist profiles, one institution, 40 anonymized aggregate records, and one pending example profile. It refuses to write to a remote database. No real people, provider credentials, patient data, or transactions are seeded.

## Included experience

- Expressive botanical dashboard: deep-teal hero, original inline SVG landscape and logo, lavender/peach wellness cards, locally served Inter/Nunito fonts, subtle floating/pulse motion, coordinated dark mode, responsive layouts, keyboard focus, and reduced-motion CSS.
- Guest alias in a signed HttpOnly session; email/password auth with bcrypt; server-enforced roles; opt-in guest-data migration on signup. Public signup cannot create institution admins.
- Thirteen optional questions with five or more choices and comments, consent, persisted history, non-diagnostic score and support recommendations.
- Backend-only Anthropic integration with structured validation and offline rules. Deterministic self-harm/keyword routing cannot be downgraded by AI. Concerning Q11 selections immediately open the support screen before an ordinary result.
- India support details sourced through the local helpline lookup; country selector makes unsupported locations explicit. No automatic messages or emergency monitoring.
- Breathing (box/4-7-8), 5-4-3-2-1 grounding, bubble pop, worry release, focus plant/timer with generated ambient noise, memory match, colouring flower, sliding puzzle, and positive-word scramble.
- Encrypted browser journal for guests; encrypted account journal; browser speech-to-text where supported and permission granted. Gratitude entries, expression builder, safety plan and trusted-contact call/message drafts.
- Therapist search/filters, free and sliding-scale demo appointments, mock checkout, reschedule/cancel, feedback, local-only session-room/chat preview.
- Therapist settings, pricing, availability, commission calculator, document upload/AI extraction, mandatory manual-review status.
- Anonymous peer-circle messages with keyword checks, report recording and per-view alias hiding.
- Institution-only aggregate reporting from seeded records, suppression below five, demo group scheduling, pricing proposals, and `/pitch`.
- Daily check-in streak, gentle XP/level, three-consecutive-decline prompt, and English/Hindi/Kannada sample strings.

## PostgreSQL / Neon setup

Neon is not yet connected to this checkout. Browser sign-in to the `thanoof` account does not grant this development session API access. Connect Neon using that account and use a **new Therapulse project**. Do not reuse `hasan-buildcon` or `watify`.

`prisma/schema.prisma` documents the PostgreSQL record model; `prisma/migration.sql` is a prepared, unapplied definition. The app uses parameterized queries via `@neondatabase/serverless` and stores AES-256-GCM-encrypted record payloads. Every personal read and update is scoped to the authenticated owner. Authentication records have separate namespaces; public circle messages and fictional aggregate records have separate owners.

**No migration, schema creation, db push, or remote seed has been run.** Obtain a separate explicit database-application instruction before applying the prepared SQL. Do not run scripts against an existing project.

After schema approval and application, configure server-only environment variables using `.env.example` as a reference:

- `DATABASE_URL`: Neon pooled PostgreSQL URL including SSL parameters, stored in deployment secrets or ignored `.env.local`.
- `AUTH_SECRET`: independent random secret of at least 32 characters.
- `DATA_ENCRYPTION_KEY`: independent random secret of at least 32 characters. Preserve it: changing it without key migration makes existing records unreadable.
- `ANTHROPIC_API_KEY`: optional; never prefixed NEXT_PUBLIC_. Without it, reflection uses deterministic rules.
- `ANTHROPIC_MODEL`: optional model identifier; default `claude-sonnet-4-6`.
- `PLATFORM_COMMISSION`: default 0.15; illustrative commission for paid sessions.
- `APP_ORIGIN`: actual deployment origin for cross-origin request checks.

Deployment target is a Node-compatible Next.js host. Do not deploy as static-only output: REST endpoints require a server. For Sites hosting, an appropriate Next.js-to-Worker adapter and production secrets must be configured and tested first; no hosted Site was created or published in this task.

## REST contract

All responses use JSON and no-store. Mutations validate input with Zod. Sessions use a signed, seven-day cookie. State-changing cross-origin requests are rejected. The process-local rate limiter is suitable for one demo process; production requires a shared limiter and trusted-proxy configuration.

| Endpoint | Methods | Access |
| --- | --- | --- |
| `/api/session` | GET | Current session and storage mode |
| `/api/guest`, `/api/auth`, `/api/logout` | POST | Guest / signup / signin / signout |
| `/api/checkins` | GET, POST | Own history, consented analysis |
| `/api/journal`, `/api/gratitude`, `/api/expression`, `/api/habit` | GET, POST | Own records |
| `/api/expression/generate` | POST | Authenticated template-assisted expression |
| `/api/safety` | GET, POST | Own safety plan, up to three contacts |
| `/api/therapists` | GET | Fictional public catalog |
| `/api/bookings` | GET, POST, PATCH | Own demo bookings and feedback |
| `/api/therapist/profile` | GET, POST | Therapist-only settings |
| `/api/therapist/verify` | POST multipart | Therapist-only, consented document processing |
| `/api/institution` | GET | Institution role and signed org scope required |
| `/api/institution/groups` | POST | Institution-only demo group scheduling |
| `/api/circles`, `/api/circles/report` | GET/POST, POST | Signed-in alias messages and reports |

## Five-minute pitch walkthrough

1. **0:00–0:45:** Show the dashboard, anonymous entry, original identity, dark mode and privacy notice.
2. **0:45–1:45:** Complete a Pulse Check, explain non-diagnostic results and deterministic fallback. Using fictional answers only, demonstrate immediate-support routing. Do not place a call.
3. **1:45–2:30:** Open breathing, bubble pop and expression helper. Save a private journal page.
4. **2:30–3:15:** Browse fictional therapist profiles, filter free slots, book a demo appointment and enter the preview room. Show the explicit simulation labels.
5. **3:15–4:15:** Sign in to the demo college account, show aggregated trends and privacy suppression, schedule a demo group, and explain subscription pricing.
6. **4:15–5:00:** Open `/pitch`. Explain institutional subscriptions, transparent booking commission, sponsored access and the validation plan.

## Checks

```powershell
npm run typecheck
npm test
npm run build
# With the dev server on port 3001:
node scripts/smoke.mjs
```

Tests cover deterministic risk overrides and minimum cohort privacy. The REST smoke test uses fictional local data to verify sessions, role access, private-record isolation, invalid inputs, crisis routing, booking validation/ownership/rescheduling/cancellation, institution aggregates, guest migration and page responses. Never point it at a production server.

## Explicit demo boundaries / remaining production work

Payments, live video, email delivery, therapist availability matching and capacity reservations are simulated. Stored therapist settings do not change the separate fictional public catalog. Group sessions are saved as demo schedules; member invite distribution, enrollment and delivery are not connected. Peer-circle moderation uses simple keyword checks, not AI or a live moderation team; hiding an alias is local to the current view. The expression builder uses deterministic templates. Institution insights are deterministic descriptions of seeded aggregates, not live AI insights.

Therapist uploads remain in manual review. There is no operational reviewer console or official-registry integration; AI extraction cannot establish authenticity. Production must cross-check RCI/NMC/state or other applicable professional registries and provide a staffed review process before listing actual professionals. The prototype intentionally never auto-approves an uploaded license based on AI confidence alone. It does not provide clinical records or real client notes.

The language switch demonstrates sample strings, not a complete translation. The gentle-streak preference is a saved reminder preference, not a fully implemented freeze credit system. Full badge milestones, weekly report exports, income eligibility, group invites, production provider matching and operational alerts remain future work. No real emergency therapist connection is offered.

Security requires further production review: deployment secret validation/rotation, per-account authorization audit, robust shared rate limits, retention/deletion workflows, request-size enforcement at the ingress, CSP, production backups, official provider checks, human moderation, accessibility testing and a clinical safety evaluation. Password reset/email verification are not enabled. Anonymous aliases do not mean untraceable network traffic; safety contacts are optional personal data. Browser vault keys stay on the same device, so device access or XSS could expose journal text. AI reflection is a heuristic, not a validated clinical risk assessment.

**Therapulse is not a substitute for professional medical care or emergency services.**
