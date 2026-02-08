#!/usr/bin/env bash
set -euo pipefail

cd web

# Keep it strict: failures force another iteration.
npm run lint
npm run test
npm run build
