---
name: figma-token-sync
description: Sync processed CSS design tokens with JavaScript theme objects for React Native. Use when aligning tokens after Figma sync, checking token consistency, or updating JS theme files manually.
---

# Figma Token Sync

Ensure alignment between processed CSS tokens (from ETL) and JavaScript theme objects used for React Native.

## Core Process

Your pipeline: **Figma → JSON → CSS/Tailwind (automated)** → **JS themes (manual sync)**

```
Sync Workflow:
- [ ] 1. Discover all CSS and JS theme files
- [ ] 2. Compare token coverage systematically  
- [ ] 3. Update ALL JS theme files consistently
- [ ] 4. Validate alignment across all themes
```

## Quick Discovery

```bash
# Find CSS tokens (source of truth)
find . -name "*.ts" -path "*/themes/css/*" | sort

# Find JS theme files (sync targets - ALL must be updated)
find . -name "theme*.ts" -path "*/themes/js/*" | grep -E "(dark|light)\.ts$" | sort
```

## Token Gap Analysis

### Compare CSS vs JS systematically

```bash
# Generic comparison for any token category
compare_category() {
  local category=$1  # "background", "border", "text"
  local css_file="libs/design-core/src/lib/themes/css/enterprise/theme.dark-css.ts"
  local js_file="libs/design-core/src/lib/themes/js/enterprise/theme.dark.ts"
  
  echo "=== $category TOKENS ==="
  echo "CSS: $(grep -c "color-$category-" "$css_file") tokens"
  echo "JS:  $(awk "/${category%s}: \\{/,/\\},/" "$js_file" | grep -c ":")"
}

# Check all major categories
compare_category "background"  # CSS: color-background-* → JS: bg: {}
compare_category "border"      # CSS: color-border-* → JS: border: {}  
compare_category "text"        # CSS: color-text-* → JS: text: {}
```

### Find specific missing tokens

```bash
# Extract CSS token names and convert to JS naming
css_to_js_tokens() {
  local category=$1
  local css_file=$2
  
  grep -o "color-$category-[a-z0-9-]*" "$css_file" | 
    sed "s/color-$category-//" | 
    sed 's/-\([a-z]\)/\U\1/g' | 
    sort | uniq
}

# Compare what CSS has vs what JS has
css_tokens=$(css_to_js_tokens "background" "libs/design-core/src/lib/themes/css/enterprise/theme.dark-css.ts")
js_tokens=$(awk '/bg: \{/,/\},/' "libs/design-core/src/lib/themes/js/enterprise/theme.dark.ts" | 
            grep -o '[a-zA-Z][a-zA-Z0-9]*:' | sed 's/://' | sort)

echo "$css_tokens" > /tmp/css_tokens
echo "$js_tokens" > /tmp/js_tokens
echo "Missing in JS:" && comm -23 /tmp/css_tokens /tmp/js_tokens
```

## Update All Theme Files

**CRITICAL**: Never update just one theme - always update ALL 6 files:

```bash
# All theme files that must be synchronized
THEME_FILES=(
  "enterprise/theme.dark.ts"
  "enterprise/theme.light.ts" 
  "websites/theme.dark.ts"
  "websites/theme.light.ts"
  "ledger-live/theme.dark.ts"
  "ledger-live/theme.light.ts"
)

# Apply same changes to all files
for theme in "${THEME_FILES[@]}"; do
  echo "Updating libs/design-core/src/lib/themes/js/$theme"
done
```

## Common Transformations

### CSS → JS Naming Patterns
```typescript
// CSS uses kebab-case, JS uses camelCase
'--color-border-base-inverted'         → baseInverted
'--color-background-surface-disabled'  → surfaceDisabled
'--color-text-muted-subtle'           → mutedSubtle

// Add to appropriate section in JS theme:
border: {
  // existing tokens...
  baseInverted: primitiveColorTokens.dark.grey['050'],
},
bg: {
  // existing tokens...
  surfaceDisabled: primitiveColorTokens.dark.grey['100'],
},
```

### Token Value Mapping
```typescript
// Always reference primitives, never hardcode
✅ baseInverted: primitiveColorTokens.dark.grey['050']
❌ baseInverted: '#ffffff'

// Use correct theme variant (light/dark)
// Dark theme: primitiveColorTokens.dark.*
// Light theme: primitiveColorTokens.light.*
```

## Comprehensive Validation

```bash
# 1. Verify all theme files were updated
for theme in enterprise websites ledger-live; do
  echo "$theme dark: $(ls -la libs/design-core/src/lib/themes/js/$theme/theme.dark.ts)"
  echo "$theme light: $(ls -la libs/design-core/src/lib/themes/js/$theme/theme.light.ts)"
done

# 2. Check token counts are consistent across themes
for theme in enterprise websites ledger-live; do
  css_count=$(grep -c "color-background-" "libs/design-core/src/lib/themes/css/$theme/theme.dark-css.ts")
  js_count=$(awk '/bg: \{/,/\},/' "libs/design-core/src/lib/themes/js/$theme/theme.dark.ts" | grep -c ":")
  echo "$theme: CSS=$css_count, JS=$js_count"
done

# 3. Standard validation
npx tsc --noEmit --project libs/design-core/tsconfig.json
npx nx lint @ledgerhq/lumen-design-core --fix
npx nx build @ledgerhq/lumen-design-core
```

## Validation Checklist

```
Complete Token Sync Validation:
- [ ] All 6 theme files have recent modification timestamps
- [ ] Token counts are consistent between CSS and JS per theme
- [ ] New tokens follow CSS→JS naming conventions  
- [ ] All themes reference primitives (no hardcoded values)
- [ ] TypeScript compilation passes
- [ ] Linting passes
- [ ] Build succeeds
```

## Troubleshooting

**Inconsistent token counts**: Run gap analysis scripts to find missing tokens systematically

**Type errors**: Ensure new tokens match TypeScript interface definitions  

**Only updated one theme**: Check all 6 theme files were modified - partial updates create inconsistencies

**Naming mismatches**: Verify CSS kebab-case was properly converted to JS camelCase

This skill ensures systematic alignment between your CSS and JS tokens across all brand themes without missing any variants.