#!/usr/bin/env bash
# Discover every brand theme so nothing is hardcoded. CSS is the source of
# truth; the JS theme files are the sync targets. A brand is any directory with
# a theme.dark-css.ts (CSS side) or theme.dark.ts (JS side).
set -euo pipefail

ROOT="libs/design-core/src/lib/themes"

brands_css=$(find "$ROOT/css" -maxdepth 2 -name 'theme.dark-css.ts' | sed -E 's#.*/([^/]+)/theme\.dark-css\.ts#\1#' | sort -u)
brands_js=$(find "$ROOT/js" -maxdepth 2 -name 'theme.dark.ts' | sed -E 's#.*/([^/]+)/theme\.dark\.ts#\1#' | sort -u)

echo "CSS brands (source of truth):"; echo "$brands_css" | sed 's/^/  /'
echo "JS brands (sync targets):";     echo "$brands_js"  | sed 's/^/  /'

# A brand present on one side only is itself a sync gap.
if ! diff <(echo "$brands_css") <(echo "$brands_js") >/dev/null; then
  echo "WARNING: CSS and JS brand sets differ — reconcile before syncing tokens."
fi

echo
echo "JS theme files that must all be updated together:"
find "$ROOT/js" \( -name 'theme.dark.ts' -o -name 'theme.light.ts' \) | sort | sed 's/^/  /'
