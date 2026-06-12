#!/bin/bash
# Stop hook: auto-fix lint on the projects affected by the agent's changes.
#
# Lets Nx compute the affected project set (changed projects + their dependents)
# and runs lint --fix across them:
#
#   npx nx affected --target=lint --fix
#
# Always exits 0 so lint problems never block the agent (fail open).

set -u

# Drain stdin so the hook process doesn't hang waiting on the pipe.
cat >/dev/null 2>&1 || true

repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$repo_root" || exit 0

npx nx affected --target=lint --fix >/dev/null 2>&1 || true

exit 0
