#!/usr/bin/env bash
set -euo pipefail

# Integration test for scripts/check-versions.mjs
#
# Builds a throwaway git repo with a fake skill under skills/.curated/foo/,
# steps through commit states, and asserts the script's per-skill status
# matches expectations at each step.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CHECK_VERSIONS="$PROJECT_ROOT/scripts/check-versions.mjs"

WORKSPACE_ROOT="$(cd "$PROJECT_ROOT/../../.." && pwd)"
export NODE_PATH="$WORKSPACE_ROOT/node_modules"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
NC='\033[0m'

PASS=0
FAIL=0

assert_status() {
  local label="$1"
  local skill="$2"
  local expected="$3"

  local actual
  actual="$(node "$CHECK_VERSIONS" --json --root "$WORKDIR" \
    | node -e "
        let buf='';
        process.stdin.on('data', c => buf += c);
        process.stdin.on('end', () => {
          const rows = JSON.parse(buf);
          const r = rows.find(r => r.skill === '$skill');
          process.stdout.write(r ? r.status : 'MISSING');
        });
      ")"

  if [ "$actual" = "$expected" ]; then
    echo -e "${GREEN}OK${NC} $label (got $actual)"
    PASS=$((PASS + 1))
  else
    echo -e "${RED}FAIL${NC} $label (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo
echo -e "${BOLD}check-versions.mjs integration tests${NC}"
echo "---------------------------------------------"

# Set up a throwaway repo
cd "$WORKDIR"
git init -q
git config user.email "test@example.com"
git config user.name "Test"
mkdir -p skills/.curated/foo skills/.curated/bar

cat > skills/.curated/foo/SKILL.md <<'EOF'
---
name: foo
description: "A mock skill for testing check-versions.mjs integration."
metadata:
  version: "1.0.0"
---
# foo
EOF

cat > skills/.curated/bar/SKILL.md <<'EOF'
---
name: bar
description: "A mock skill for testing check-versions.mjs integration."
metadata:
  version: "1.0.0"
---
# bar
EOF

git add -A
git commit -q -m "initial: add foo and bar skills"

# Case 1: just committed initially, version was set in same commit → OK
assert_status "fresh skill is OK" "foo" "OK"

# Case 2: edit content without bumping version → STALE
echo "more docs" >> skills/.curated/foo/SKILL.md
git add -A
git commit -q -m "docs: expand foo"
assert_status "content change without bump is STALE" "foo" "STALE"

# Case 3: bump the version → OK again
node -e "
  const fs = require('fs');
  const yaml = require('js-yaml');
  const p = 'skills/.curated/foo/SKILL.md';
  const content = fs.readFileSync(p, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  const parsed = yaml.load(match[1]);
  parsed.metadata.version = '1.1.0';
  const newFrontmatter = yaml.dump(parsed, { lineWidth: -1 }).trim();
  const newContent = content.replace(/^---\n([\s\S]*?)\n---/, '---\n' + newFrontmatter + '\n---');
  fs.writeFileSync(p, newContent, 'utf8');
"
git add -A
git commit -q -m "chore: bump foo to 1.1.0"
assert_status "post-bump is OK" "foo" "OK"

# Case 4: uncommitted edit in working tree → DIRTY
echo "wip" >> skills/.curated/foo/SKILL.md
assert_status "uncommitted edit is DIRTY" "foo" "DIRTY"

# Clean it back up before next case
git checkout -q -- skills/.curated/foo/SKILL.md

# Case 5: a skill whose SKILL.md has never had its version line touched
# after creation behaves like Case 1 (OK) because the creation commit IS the
# bump commit. To exercise NEVER_BUMPED we need a skill whose SKILL.md
# was added WITHOUT a version key, then content changes after.
cat > skills/.curated/bar/SKILL.md <<'EOF'
---
name: bar
description: "A mock skill for testing check-versions.mjs integration."
---
# bar
EOF
git add -A
git commit -q -m "chore: strip bar version"
echo "more" >> skills/.curated/bar/SKILL.md
git add -A
git commit -q -m "docs: edit bar"
assert_status "skill without version bump history is NEVER_BUMPED" "bar" "NEVER_BUMPED"

echo "---------------------------------------------"
if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}All check-versions tests passed: $PASS/$((PASS + FAIL))${NC}"
  exit 0
else
  echo -e "${RED}check-versions tests failed: $PASS passed, $FAIL failed${NC}"
  exit 1
fi
