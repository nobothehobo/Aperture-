# Aperture

Aperture is a photo-first social platform MVP for photographers (classic Instagram-style, before short-form video). This repository contains a web-first Next.js app with a backend structure designed for future React Native / Expo clients to share the same domain logic and API.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Google OAuth)
- S3-compatible upload flow (presigned upload stub scaffold)
- Zod validation on mutations/queries
- Vitest for basic unit/integration-style tests

## Architecture

The project intentionally separates concerns:

- `app/`: route handlers + UI pages (web surface)
- `components/`: reusable UI components
- `lib/`: framework-agnostic utilities (db, auth wiring, validation, security helpers)
- `server/`: business logic/services and query composition

This keeps API/domain behavior portable so a future mobile app can call the same API routes (or shared server package).

## Implemented features (Phase 1)

- Auth (Google login) + session persistence
- Health endpoint: `GET /api/health -> { ok: true }`
- Onboarding: first login must set unique username
- Profile URL format: `/@username`
- Profile fields: `displayName`, `bio`, `location`, `website`, `gear`, `createdAt`
- Post creation (single image URL + caption + optional camera/lens/settings + tags)
- Chronological feed query (self + followed users)
- Follow/unfollow API
- Like/unlike API
- Comment API
- Tag browse API
- Basic moderation report API
- Security basics:
  - server-side auth checks for mutations
  - simple in-memory rate limiting for post creation
  - upload type/size validation
  - caption/comment/profile sanitization

## Database

Prisma schema and initial migration are in:

- `prisma/schema.prisma`
- `prisma/migrations/20260214221500_init/migration.sql`

Core tables include:

- `User`, `Post`, `Media`, `Follow`, `Like`, `Comment`, `Tag`, `PostTag`, `Report`
- Auth tables: `Account`, `Session`, `VerificationToken`

Indexes are added for feed/profile/tag/report lookups.

## Local development

1. Copy env template:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Run Prisma migration + generate client:

```bash
npx prisma migrate dev
npx prisma generate
```

4. Start dev server:

```bash
npm run dev
```

5. Open http://localhost:3000

## Required environment variables

### Core

- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: NextAuth secret
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

### S3-compatible media (for real presigned uploads)

- `S3_PUBLIC_BASE_URL`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

## Deploy notes (Vercel + managed Postgres + R2/S3)

1. Create PostgreSQL database (Neon/Supabase/RDS/etc.) and set `DATABASE_URL`.
2. Configure Google OAuth callback URL:
   - `https://<your-domain>/api/auth/callback/google`
3. Add all env vars in Vercel project settings.
4. Run Prisma migrate in deploy pipeline (or pre-deploy job).
5. Point storage vars to Cloudflare R2/AWS S3 and replace presign stub with actual signed URL generation.

## Security notes

Current rate limiting is in-memory (`lib/security/rate-limit.ts`) and resets per process. For production use:

- Replace with Redis/Upstash shared limiter.
- Add WAF/CDN rules for abuse-heavy endpoints.
- Add moderation queue tooling for `Report` review workflow.

## Testing

Run:

```bash
npm test
```

Included tests:

- schema validation tests (`tests/validators.test.ts`)
- feed query composition test (`tests/feed-query.test.ts`)

## What is not done yet / recommended next tasks

1. Replace upload stub with real S3/R2 presigned upload generation and client uploader.
2. Add robust API pagination for all listing endpoints (cursor consistency on tags).
3. Add optimistic UI interactions for like/follow/comment.
4. Add richer moderation tooling (admin queue, status transitions, audit trail).
5. Add e2e tests (Playwright) and CI checks.
6. Add mobile-ready API docs (OpenAPI/typed client package).
7. Add image processing pipeline (blurhash/placeholders, EXIF handling).
