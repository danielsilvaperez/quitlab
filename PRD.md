# QuitLab - Addiction Support App (PRD)

## Goal
Help users reduce or quit addictions (marijuana, cigarettes/nicotine, vaping, alcohol optional later) using evidence-informed behavior change methods, habit tracking, and supportive community.

## Non-medical disclaimer
This app provides educational and self-help tools, not medical advice. Crisis/safety resources must be shown for severe withdrawal, suicidal ideation, or medical emergencies.

## Science-based approaches to include
1) CBT basics (Cognitive Behavioral Therapy): trigger -> thought -> craving -> action mapping; reframe prompts.
2) Motivational Interviewing (MI) style reflections: values clarification, reasons to quit, confidence scaling (0-10).
3) Implementation intentions: "If X happens, then I will do Y."
4) Urge surfing: timed craving timer + breathing / grounding exercises.
5) Habit substitution: replacement activities and friction design.
6) Contingency management lite: streaks + rewards + "savings" (money not spent).
7) Lapse recovery: "slip != relapse"; fast return plan.

## Core features (MVP)
- Auth (email/password or magic link) + profile
- Choose substance(s): nicotine, marijuana, vaping (others later)
- Quit plan: quit date OR gradual reduction (daily target)
- Daily check-in: cravings, use amount, mood, sleep, triggers
- Tools:
  - Craving timer (urge surfing)
  - Trigger log + coping plan
  - "If-Then" planner
  - Reasons/values list
- Progress dashboard: streaks, usage reduction graphs, money saved
- Community:
  - Public rooms by substance (nicotine, marijuana)
  - Posts + comments
  - Reactions (no downvotes)
  - Report/block + moderation queue (basic)
- Safety:
  - Content rules + auto-warning keywords (self-harm, medical crisis)
  - Crisis resources page

## Community guardrails
- No selling substances, no procurement, no "how to get high better"
- No harassment
- Encourage help-seeking
- Clear report flow

## MVP success criteria (oracle)
- App boots, auth works, onboarding works
- User can create quit plan, log daily check-in, view dashboard
- User can post/comment in community and report content
- Tests pass + lint passes

## Delivery checklist (completion oracle)
- [x] Auth works (email/password or magic link) with profile setup
- [x] Onboarding exists for substance selection and quit-plan creation
- [x] Daily check-in flow exists (create + read)
- [x] Dashboard exists with streak/reduction/savings summary
- [x] Tools page exists with urge timer, trigger log, and if-then planner
- [x] Community rooms/posts/comments/reactions exist
- [x] Report/block flow exists with moderation queue support
- [x] Safety page exists with crisis resources and content rules
- [x] Prisma schema includes all MVP entities
- [x] Lint, tests, and production build pass
