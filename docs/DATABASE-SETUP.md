# Hachathon database setup — 18 November 2026

A separate project named hachathon was created in the thanoof Neon organisation, using AWS Singapore and PostgreSQL 18. The main branch contains database hachathon. No existing projects were modified.

The user explicitly authorised applying prisma/migration.sql after the new target was created and inspected. The database was empty. The records table, its primary key, and records_owner_kind_created_idx were created together in a transaction. The initial schema remains defined in prisma/schema.prisma; no generated schema files were edited. Do not reapply the initial CREATE statements or make future schema changes without a separate explicit instruction.

Verification used the actual application store against Neon: encrypted write/read round-trip, isolation from another owner, duplicate-record prevention, and scoped cleanup. The fictional verification record was deleted. No demo accounts, private local records, or licence files were imported.

The pooled production DATABASE_URL and independent production authentication/encryption secrets are stored only in ignored .env.vercel.local. Local .env retains the existing demo store and encryption keys. Import production variables into the Hachathon Vercel project only; never commit the environment file or publish its values. Preserve the production encryption key after data is written.

Database setup and Vercel deployment are complete. The public site is https://hachathon-seven.vercel.app. Production runtime checks passed for secure guest sessions, private check-ins/journals, 12 specialist profiles, exact 20% markup, booking/cancellation, payment previews, and cross-site rejection. Temporary verification records were removed.
