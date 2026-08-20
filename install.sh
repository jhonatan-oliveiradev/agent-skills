#!/usr/bin/env bash
set -euo pipefail
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${HOME}/.agents/skills"
mkdir -p "$TARGET_DIR"
for dir in "$SOURCE_DIR"/*/; do
  [ -f "${dir}SKILL.md" ] || continue
  name="$(basename "$dir")"
  rm -rf "$TARGET_DIR/$name"
  cp -R "$dir" "$TARGET_DIR/$name"
  echo "Installed $name"
done
echo "Skills installed in $TARGET_DIR"
