#!/usr/bin/env bash
set -euo pipefail

: "${MAX_ITERS:=0}"

# The completion oracle decides "done".
ORACLE="${ORACLE:-./completion_oracle.sh}"

# Keep a single rolling memory file for Kimi.
MEMORY_FILE="KIMI_MEMORY.md"
LOG_DIR=".ralph"
mkdir -p "$LOG_DIR"

touch "$MEMORY_FILE"

# Rate-limit patterns that should stop the loop early.
RATE_LIMIT_REGEX="${RATE_LIMIT_REGEX:-rate limit|ratelimit|too many requests|429|quota exceeded|insufficient quota}"

i=1
while true; do
  if [ "$MAX_ITERS" -gt 0 ] && [ "$i" -gt "$MAX_ITERS" ]; then
    echo "Reached MAX_ITERS=$MAX_ITERS without completion."
    exit 2
  fi

  echo
  echo "=============================="
  echo "RALPH ITERATION $i"
  echo "=============================="

  # Capture latest oracle failure (if any) to feed into next prompt.
  FAILURE_SNIP=""
  if [ -f "$LOG_DIR/last_failure.txt" ]; then
    FAILURE_SNIP="$(cat "$LOG_DIR/last_failure.txt")"
  fi

  # Compose prompt (Kimi gets: PRD + constraints + current failure + memory).
  PROMPT_FILE="$LOG_DIR/prompt_$i.md"
  cat > "$PROMPT_FILE" <<EOF
# ROLE
You are Kimi Code operating as an autonomous engineering agent in a strict loop.
Your job: implement the PRD and make the ORACLE pass.

# REPO RULES
- Work only in this repo.
- Prefer small, testable increments.
- Update PRD checklists when you complete items.
- Do not mark PRD checklist items complete unless implemented and passing tests.
- Do NOT claim medical efficacy; use "evidence-informed" language and include disclaimers.
- Community must include report/block and basic moderation queue.
- No procurement or advice on obtaining controlled substances.

# TARGET
Make this command succeed with exit code 0:
$ORACLE

# CURRENT STATE
- PRD: see PRD.md
- Rolling memory: see $MEMORY_FILE
- Latest oracle failure (if any):
${FAILURE_SNIP}

# TASK
1) Decide the next smallest set of changes that moves us toward MVP and keeps tests green.
2) Implement: code, schema, UI, API routes as needed.
3) Add/adjust tests where appropriate (Vitest).
4) Run the oracle command locally and fix until it passes.
5) Append a short, factual summary to $MEMORY_FILE:
   - What changed
   - What remains
   - Any decisions/tradeoffs
EOF

  echo ">>> Running Kimi..."
  # --print: non-interactive; exits after response
  # -y: auto-approve tool actions (run only in a safe repo)
  set +e
  kimi --print -y --prompt "$(cat "$PROMPT_FILE")" | tee "$LOG_DIR/kimi_$i.out"
  KIMI_EXIT=${PIPESTATUS[0]}
  set -e

  if rg -iq "$RATE_LIMIT_REGEX" "$LOG_DIR/kimi_$i.out"; then
    echo "KIMI RATE LIMITED. Exiting early."
    exit 75
  fi

  if [ "$KIMI_EXIT" -ne 0 ]; then
    echo "Kimi exited non-zero ($KIMI_EXIT). Continuing to oracle check."
  fi

  echo ">>> Running oracle: $ORACLE"
  if $ORACLE 2>&1 | tee "$LOG_DIR/oracle_$i.out"; then
    echo "ORACLE PASSED. Project complete."
    exit 0
  else
    echo "ORACLE FAILED."
    tail -n 250 "$LOG_DIR/oracle_$i.out" > "$LOG_DIR/last_failure.txt"
  fi

  i=$((i + 1))
done

exit 0
