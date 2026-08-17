#!/usr/bin/env bash
# Compare token coverage between CSS (source of truth) and JS for one brand and
# category, so you can spot what JS is missing. Approximate by design — it is a
# guide to where to look, not a proof of completeness.
# Usage: compare-tokens.sh <brand> <category>
#   e.g. compare-tokens.sh ledger-live background
#   category is a CSS color-<category>-… group (background | border | text | …)
set -euo pipefail

brand="${1:?brand required, e.g. ledger-live (run discover-themes.sh to list)}"
category="${2:?category required, e.g. background|border|text}"

ROOT="libs/design-core/src/lib/themes"
css_file="$ROOT/css/$brand/theme.dark-css.ts"
js_file="$ROOT/js/$brand/theme.dark.ts"

# CSS category → JS section key (bg/border/text/…). Falls back to the category.
case "$category" in
  background) key=bg ;;
  *) key="$category" ;;
esac

# Keys inside the JS `<key>: { … }` block (flag scan — robust to indentation).
js_keys() {
  awk -v k="$key" '
    $0 ~ (k ": {")        { inblock=1; next }
    inblock && /^[[:space:]]*},/ { inblock=0 }
    inblock && /:/        { line=$0; sub(/:.*/, "", line); gsub(/[[:space:]]/, "", line); print line }
  ' "$js_file" | sort -u
}

# CSS token names for the category, converted kebab → camelCase (perl is portable
# across macOS/Linux; BSD sed cannot do \U).
css_keys() {
  grep -o "color-$category-[a-z0-9-]*" "$css_file" \
    | sed "s/color-$category-//" \
    | perl -pe 's/-([a-z])/\U$1/g' \
    | sort -u
}

echo "=== $brand / $category ==="
echo "CSS: $(css_keys | grep -c .) token names  ($css_file)"
echo "JS : $(js_keys | grep -c .) keys in \`$key\`  ($js_file)"
echo
echo "In CSS but not obviously in JS (candidates to add):"
comm -23 <(css_keys) <(js_keys) | sed 's/^/  /'
