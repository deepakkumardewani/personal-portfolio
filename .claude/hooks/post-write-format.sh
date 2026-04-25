#!/bin/bash
# PostToolUse: auto-fix Biome formatting + import sorting after Write/Edit.
# Runs biome check --write on the specific file immediately after AI agent edits/writes it.

cd /Users/deepakdewani1/Documents/Programs/vue/periodic-table-explorer

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

if [ "$TOOL_NAME" != "Write" ] && [ "$TOOL_NAME" != "Edit" ]; then
  echo '{"continue":true}'
  exit 0
fi

FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -f "$FILE" ] && echo "$FILE" | grep -qE '\.(ts|tsx|js|jsx|json|css|vue)$'; then
  ./node_modules/.bin/biome check --write "$FILE" 2>/dev/null
fi

echo '{"continue":true}'
