#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "COMPLETION ORACLE FAILED: $1" >&2
  exit 1
}

# Baseline quality gate.
./oracle.sh

# Ensure PRD has an explicit checklist and all items are complete.
if ! rg -q "^- \\[[ xX]\\]" PRD.md; then
  fail "PRD.md must include checklist items using '- [ ]' / '- [x]'."
fi

if rg -q "^- \\[ \\]" PRD.md; then
  fail "PRD checklist still contains incomplete items."
fi

# Ensure MVP route and API surface exists.
required_files=(
  "web/prisma/schema.prisma"
  "web/src/app/onboarding/page.tsx"
  "web/src/app/checkin/page.tsx"
  "web/src/app/tools/page.tsx"
  "web/src/app/dashboard/page.tsx"
  "web/src/app/community/page.tsx"
  "web/src/app/safety/page.tsx"
  "web/src/app/api/auth/[...nextauth]/route.ts"
  "web/src/app/api/quit-plan/route.ts"
  "web/src/app/api/checkins/route.ts"
  "web/src/app/api/community/report/route.ts"
  "web/src/app/api/community/block/route.ts"
)

missing_files=()
for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    missing_files+=("$file")
  fi
done

if [ "${#missing_files[@]}" -gt 0 ]; then
  printf 'COMPLETION ORACLE FAILED: Missing required files:\n' >&2
  printf '  - %s\n' "${missing_files[@]}" >&2
  exit 1
fi

# Ensure required Prisma models exist.
schema_file="web/prisma/schema.prisma"
required_models=(
  "User"
  "SubstanceProfile"
  "QuitPlan"
  "DailyCheckIn"
  "TriggerEvent"
  "CopingPlan"
  "CommunityRoom"
  "Post"
  "Comment"
  "Reaction"
  "Report"
  "ModerationAction"
  "Block"
)

missing_models=()
for model in "${required_models[@]}"; do
  if ! rg -q "model\\s+${model}\\b" "$schema_file"; then
    missing_models+=("$model")
  fi
done

if [ "${#missing_models[@]}" -gt 0 ]; then
  printf 'COMPLETION ORACLE FAILED: Missing Prisma models:\n' >&2
  printf '  - %s\n' "${missing_models[@]}" >&2
  exit 1
fi

echo "COMPLETION ORACLE PASSED."
