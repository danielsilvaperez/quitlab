# Architecture (MVP)

## Stack
- Next.js App Router (`web/`)
- Prisma ORM + Postgres
- NextAuth for auth
- Zod for validation
- Vitest for tests

## Modules
- `/onboarding`: choose substances + plan (quit date or gradual)
- `/checkin`: daily log (cravings, amount, triggers, mood)
- `/tools`: urge timer, if-then planner, trigger log
- `/dashboard`: streaks, charts (simple at first)
- `/community`: rooms, posts, comments, reactions
- `/safety`: crisis resources + content rules

## Data model (high-level)
- User
- SubstanceProfile (per user/substance)
- QuitPlan
- DailyCheckIn
- TriggerEvent
- CopingPlan
- CommunityRoom
- Post, Comment, Reaction
- Report, ModerationAction, Block
