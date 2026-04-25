#!/usr/bin/env bash
# Scaffolds create-vite into the current working directory, then runs vp migrate.
# No /tmp: uses "." first, else a child folder "app" + rsync.
# Usage: scaffold-into-cwd.sh <template>   e.g. vue-ts, react-ts
set -euo pipefail
TEMPLATE="${1:-}"
if [[ -z "$TEMPLATE" ]]; then
  echo "Usage: $0 <template>  (e.g. vue-ts, react-ts)" >&2
  exit 1
fi
if command -v bunx >/dev/null 2>&1; then
  RUN=(bunx --bun)
elif command -v npx >/dev/null 2>&1; then
  RUN=(npx --yes)
else
  echo "Need bunx or npx for create-vite" >&2
  exit 1
fi
ROOT=$(pwd)
if [[ -f "$ROOT/package.json" ]]; then
  echo "Refusing: $ROOT/package.json already exists" >&2
  exit 1
fi
child_scaffold() {
  "${RUN[@]}" create-vite@latest app -- --template "$TEMPLATE"
  rsync -a --exclude='.git' app/ .
  rm -rf app
}
set +e
"${RUN[@]}" create-vite@latest . -- --template "$TEMPLATE"
status=$?
set -e
if [[ "$status" -ne 0 ]]; then
  echo "In-place create-vite failed; using child folder app/ in $ROOT" >&2
  child_scaffold
fi
if command -v vp >/dev/null 2>&1; then
  command vp migrate --no-interactive
else
  echo "vp not on PATH; run: command vp migrate --no-interactive" >&2
  exit 1
fi
echo "Done. Next: set package name, command vp check, command vp run build"
