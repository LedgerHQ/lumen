---
name: figma-token-sync
description: Sync Figma design tokens with JavaScript theme objects for React Native. Use when aligning tokens after Figma sync, checking token inconsistencies, or updating JS theme files manually.
---

# Figma Token Sync

Synchronize processed CSS design tokens with JavaScript theme objects used for React Native components.

Your pipeline: **Figma → JSON → CSS/Tailwind (automated)** → **JS themes (manual sync)**

## Quick Discovery

**Find token files dynamically:**

```bash
# Find processed CSS token files (ETL output - source for sync)
find . -name "*.ts" -path "*/design-core/src/lib/themes/css/*" | head -5

# Find ALL JS brand theme files (manual sync target) - CRITICAL: Don't miss any!
find . -name "theme*.ts" -path "*/design-core/src/lib/themes/js/*" | grep -v "/primitives/" | sort
```

## Core Sync Workflow - COMPREHENSIVE

```
Token Sync Checklist - MUST COMPLETE ALL:
- [ ] 1. Discover ALL brand theme files (enterprise, websites, ledger-live)
- [ ] 2. Compare CSS vs JS token counts per category (bg, border, text)  
- [ ] 3. Update primitives first (colors, typography, spacing)
- [ ] 4. Update ALL brand themes consistently (not just one!)
- [ ] 5. Validate EVERY brand theme file was updated
- [ ] 6. Run comprehensive type checking and validation
```

## Critical: Find ALL Brand Themes

**Never miss brand themes again:**

```bash
# List ALL brand theme files that need updating
ls libs/design-core/src/lib/themes/js/*/theme*.ts

# Should show all these files:
# enterprise/theme.dark.ts, enterprise/theme.light.ts  
# websites/theme.dark.ts, websites/theme.light.ts
# ledger-live/theme.dark.ts, ledger-live/theme.light.ts
```

## Comprehensive Token Gap Analysis

**Check for missing tokens systematically:**

```bash
# 1. Count CSS background tokens
grep -o "color-background-[a-z0-9-]*" libs/design-core/src/lib/themes/css/*/theme*css.ts | 
  sed 's/.*color-background-//' | sort | uniq | wc -l

# 2. Count JS background properties (should be similar)  
grep -c ": primitiveColorTokens\." libs/design-core/src/lib/themes/js/*/theme*.ts

# 3. Find specific missing tokens by comparing CSS vs JS names
grep -o "color-background-[a-z0-9-]*" libs/design-core/src/lib/themes/css/enterprise/theme.dark-css.ts |
  sed 's/.*color-background-//' | sed 's/-\([a-z]\)/\U\1/g' | sort > /tmp/css_tokens

grep -o "[a-zA-Z][a-zA-Z0-9]*:" libs/design-core/src/lib/themes/js/enterprise/theme.dark.ts |
  sed 's/://' | sort > /tmp/js_tokens
  
diff /tmp/css_tokens /tmp/js_tokens
```

## Key Token Transformations

### Colors: CSS → JS
```typescript
// FROM: Processed CSS tokens (themes/css/*.ts)
export const ledgerLiveLightColorTokens = {
  grey: {
    '100': '#fafafa',
    '200': '#f1f1f1',
  },
};

// TO: JS Theme Object (themes/js/*.ts)
export const primitiveColorTokens = {
  light: {
    grey: {
      '100': '#fafafa',  // Match CSS token values
      '200': '#f1f1f1',
    },
  },
};
```

### Typography: CSS → JS
```typescript
// FROM: Processed CSS tokens
export const typographyTokens = {
  fontSize: {
    sm: 14,
    md: 16,
  },
  fontWeight: {
    medium: '500',
    semibold: '600',
  },
};

// TO: JS Theme Object
export const primitiveTypographyTokens = {
  fontSize: {
    sm: 14,        // Match CSS values exactly
    md: 16,
  },
  fontWeight: {
    medium: '500', // Keep as string
    semibold: '600',
  },
};
```

### Spacing/Motion: CSS → JS
```typescript
// FROM: Processed CSS tokens
export const layoutTokens = {
  spacings: { md: 16, lg: 24 },
  durations: { fast: 150, normal: 300 }, // Already processed, no units
};

// TO: JS Theme Object  
export const tokens = {
  spacings: { md: 16, lg: 24 },      // Match CSS values
  durations: { fast: 150, normal: 300 }, // Already numbers
};
```

### Shadows: CSS → JS
```typescript
// FROM: Processed CSS tokens  
export const shadowTokens = {
  sm: [{
    offsetX: 0, offsetY: 1,
    blurRadius: 3, spreadDistance: 0,
    color: '#00000012',
  }],
};

// TO: JS Theme Object (same structure, verify consistency)
export const shadows = {
  sm: [{
    offsetX: 0, offsetY: 1,
    blurRadius: 3, spreadDistance: 0,
    color: '#00000012',
  }],
};
```

## Critical Missing Token Patterns (Learn from Past Mistakes!)

### Pattern 1: Missing Border Tokens
**What was missed**: `baseInverted` border token across all brand themes

```typescript
// CSS: --color-border-base-inverted
// JS: MISSING - had to add to ALL 6 theme files

// ✅ Fix: Add to ALL brand themes consistently
border: {
  // ... existing tokens
  baseInverted: primitiveColorTokens.dark.grey['050'], // Don't miss this!
}
```

### Pattern 2: Missing Background Opacity Tokens  
**What was missed**: `surfaceDisabled`, `gradient40`, `gradient30`, `gradientOverlay80`, `gradientOverlay0`

```typescript
// CSS has these but JS was missing them:
'--color-background-surface-disabled'     → surfaceDisabled
'--color-background-gradient-40'          → gradient40  
'--color-background-gradient-30'          → gradient30
'--color-background-gradient-overlay-80'  → gradientOverlay80
'--color-background-gradient-overlay-0'   → gradientOverlay0

// ✅ Fix: Add to ALL theme files, both light and dark
bg: {
  // ... existing tokens
  surfaceDisabled: primitiveColorTokens.dark.grey['100'],
  gradient40: primitiveColorTokens.dark.grey['050-40'],
  gradient30: primitiveColorTokens.dark.grey['050-30'], 
  gradientOverlay80: primitiveColorTokens.dark.grey['050-80'],
  gradientOverlay0: primitiveColorTokens.dark.grey['050-0'],
}
```

### Pattern 3: Incomplete Brand Coverage
**What was missed**: Only updated enterprise, forgot websites and ledger-live

```typescript
// ❌ WRONG: Only updating one brand theme
// "Fixed enterprise, done!"

// ✅ CORRECT: Update ALL brand themes
const themesToUpdate = [
  'enterprise/theme.dark.ts',
  'enterprise/theme.light.ts', 
  'websites/theme.dark.ts',
  'websites/theme.light.ts',
  'ledger-live/theme.dark.ts', 
  'ledger-live/theme.light.ts'
];
// Apply SAME changes to ALL files!
```

## Systematic Token Discovery

### Find Missing Tokens by Category

```bash
# Background tokens - compare CSS naming vs JS properties
echo "CSS background tokens:"
grep -o "background-[a-z0-9-]*" libs/design-core/src/lib/themes/css/enterprise/theme.dark-css.ts | 
  sed 's/background-//' | sort

echo "JS background properties:"  
awk '/bg: \{/,/\},/' libs/design-core/src/lib/themes/js/enterprise/theme.dark.ts |
  grep -o '[a-zA-Z][a-zA-Z0-9]*:' | sed 's/://' | sort

# Border tokens
echo "CSS border tokens:"
grep -o "border-[a-z0-9-]*" libs/design-core/src/lib/themes/css/enterprise/theme.dark-css.ts |
  sed 's/border-//' | sort

echo "JS border properties:"
awk '/border: \{/,/\},/' libs/design-core/src/lib/themes/js/enterprise/theme.dark.ts |  
  grep -o '[a-zA-Z][a-zA-Z0-9]*:' | sed 's/://' | sort
```

## Comprehensive Validation - PREVENT MISSING TOKENS

### Step 1: Verify ALL Theme Files Were Updated

```bash
# Check that ALL 6 theme files have the same recent modification time
ls -la libs/design-core/src/lib/themes/js/*/theme*.ts | grep -E "(dark|light)\.ts$"

# Count token additions in each file (should be similar)
for file in libs/design-core/src/lib/themes/js/*/theme*.ts; do
  if [[ $file == *"dark.ts" || $file == *"light.ts" ]]; then
    echo "$file: $(grep -c "Added missing token" "$file") new tokens"
  fi
done

# Verify no linting errors were introduced
echo "=== CHECKING FOR LINTING ISSUES IN THEME FILES ==="
npx nx lint @ledgerhq/lumen-design-core --max-warnings=0
if [ $? -eq 0 ]; then
  echo "✅ All theme files pass linting"
else
  echo "❌ Linting errors found - run 'npx nx lint @ledgerhq/lumen-design-core --fix' to auto-fix"
fi
```

### Step 2: Token Count Validation

```bash
# Validate token coverage per theme - should be consistent
echo "=== BACKGROUND TOKEN COUNTS ==="
for theme in enterprise websites ledger-live; do
  css_count=$(grep -o "background-[a-z0-9-]*" libs/design-core/src/lib/themes/css/$theme/theme.dark-css.ts 2>/dev/null | wc -l || echo "0")  
  js_count=$(awk '/bg: \{/,/\},/' libs/design-core/src/lib/themes/js/$theme/theme.dark.ts 2>/dev/null | grep -c ":" || echo "0")
  echo "$theme: CSS=$css_count, JS=$js_count"
done

echo "=== BORDER TOKEN COUNTS ==="  
for theme in enterprise websites ledger-live; do
  css_count=$(grep -o "border-[a-z0-9-]*" libs/design-core/src/lib/themes/css/$theme/theme.dark-css.ts 2>/dev/null | wc -l || echo "0")
  js_count=$(awk '/border: \{/,/\},/' libs/design-core/src/lib/themes/js/$theme/theme.dark.ts 2>/dev/null | grep -c ":" || echo "0")  
  echo "$theme: CSS=$css_count, JS=$js_count"
done
```

### Step 3: Specific Token Verification

```bash
# Verify critical tokens exist in ALL theme files
echo "=== CHECKING FOR BASEINVERTED TOKEN ==="
for file in libs/design-core/src/lib/themes/js/*/theme*.ts; do
  if [[ $file == *"dark.ts" || $file == *"light.ts" ]]; then
    if grep -q "baseInverted:" "$file"; then
      echo "✅ $file has baseInverted"
    else  
      echo "❌ $file MISSING baseInverted"
    fi
  fi
done

echo "=== CHECKING FOR SURFACE DISABLED TOKEN ==="
for file in libs/design-core/src/lib/themes/js/*/theme*.ts; do
  if [[ $file == *"dark.ts" || $file == *"light.ts" ]]; then
    if grep -q "surfaceDisabled:" "$file"; then
      echo "✅ $file has surfaceDisabled"  
    else
      echo "❌ $file MISSING surfaceDisabled"
    fi
  fi  
done

echo "=== CHECKING FOR GRADIENT TOKENS ==="
for file in libs/design-core/src/lib/themes/js/*/theme*.ts; do
  if [[ $file == *"dark.ts" || $file == *"light.ts" ]]; then
    missing_gradients=()
    grep -q "gradient40:" "$file" || missing_gradients+=("gradient40")
    grep -q "gradient30:" "$file" || missing_gradients+=("gradient30") 
    grep -q "gradientOverlay80:" "$file" || missing_gradients+=("gradientOverlay80")
    grep -q "gradientOverlay0:" "$file" || missing_gradients+=("gradientOverlay0")
    
    if [ ${#missing_gradients[@]} -eq 0 ]; then
      echo "✅ $file has all gradient tokens"
    else
      echo "❌ $file MISSING: ${missing_gradients[*]}"
    fi
  fi
done
```

### Step 4: Standard Validation

```bash
# Type check (must pass)
npx tsc --noEmit --project libs/design-core/tsconfig.json

# Lint validation (must pass) - CRITICAL for code quality
npx nx lint @ledgerhq/lumen-design-core

# Auto-fix linting issues if possible
npx nx lint @ledgerhq/lumen-design-core --fix

# Build validation  
npx nx build @ledgerhq/lumen-design-core

# Run tests
npx nx test @ledgerhq/lumen-design-core
```

## Troubleshooting

**Missing tokens**: Compare token structure between CSS and JS files using:
```bash
# Show CSS theme exports
grep -n "export.*=" */design-core/src/lib/themes/css/*.ts | head -10

# Show JS theme exports  
grep -n "export.*=" */design-core/src/lib/themes/js/*/*.ts | head -10
```

**Type errors**: Check if new tokens need type definition updates in `types.ts`

**Inconsistent references**: Brand themes should always reference primitive tokens, not hardcode values

## Best Practices - Learn from Past Mistakes!

### CRITICAL: Complete Coverage

1. **NEVER update just one brand theme** - always update ALL:
   - ✅ enterprise/theme.dark.ts + enterprise/theme.light.ts
   - ✅ websites/theme.dark.ts + websites/theme.light.ts  
   - ✅ ledger-live/theme.dark.ts + ledger-live/theme.light.ts

2. **Systematic token discovery** - don't rely on spot checks:
   - Compare token counts between CSS and JS
   - Use diff commands to find missing tokens
   - Validate specific token existence across ALL files

3. **Common missed token patterns**:
   - Border tokens: `baseInverted`
   - Background disabled: `surfaceDisabled` 
   - Opacity variants: `gradient40`, `gradient30`, `gradientOverlay80`, `gradientOverlay0`

### Technical Standards

4. **Use processed CSS tokens as source of truth** - the ETL has already handled transformations
5. **Reference primitives in brand themes** - avoid hardcoded values in semantic tokens
6. **Quote numeric keys** in JS objects (`'100'`, not `100`)
7. **Match CSS token values exactly** - no additional transformations needed
8. **Maintain consistent structure** between CSS and JS theme objects

### Validation Process

9. **Validate EVERY theme file individually** - don't assume they're all the same
10. **Run comprehensive token verification scripts** - check for specific missing tokens
11. **Test incrementally** - validate after each brand theme update
12. **Always run the complete validation suite** before considering sync complete

This skill helps you maintain consistency between your design system tokens without getting bogged down in complex tooling or rigid file structures.

## Synthesis & Documentation

After completing a token sync, document what was changed:

### Sync Summary Template
```
## Token Sync Summary - [Date]

### Files Updated (MUST BE ALL 6 BRAND THEME FILES):
- [ ] enterprise/theme.dark.ts - [changes made]
- [ ] enterprise/theme.light.ts - [changes made]
- [ ] websites/theme.dark.ts - [changes made] 
- [ ] websites/theme.light.ts - [changes made]
- [ ] ledger-live/theme.dark.ts - [changes made]
- [ ] ledger-live/theme.light.ts - [changes made]
- [ ] primitive.colors.ts - [changes made]
- [ ] primitive.typographies.ts - [changes made]  
- [ ] primitives.others.ts - [changes made]

### Key Changes by Token Type:
- **Colors**: [describe color updates]
- **Border Tokens**: baseInverted added to ALL themes
- **Background Tokens**: surfaceDisabled, gradient40, gradient30, gradientOverlay80, gradientOverlay0
- **Typography**: [describe typography updates]
- **Spacing**: [describe spacing updates]
- **Other**: [describe other changes]

### Comprehensive Validation Results:
- [ ] ALL 6 brand theme files were updated (not just enterprise!)
- [ ] Critical tokens verified across ALL files:
  - [ ] baseInverted exists in all theme files
  - [ ] surfaceDisabled exists in all theme files  
  - [ ] gradient40, gradient30, gradientOverlay80, gradientOverlay0 exist in all theme files
- [ ] Token count validation: CSS vs JS counts are consistent
- [ ] Type checking passed: `npx tsc --noEmit --project libs/design-core/tsconfig.json`
- [ ] Lint validation passed: `npx nx lint @ledgerhq/lumen-design-core`
- [ ] Build validation: `npx nx build @ledgerhq/lumen-design-core`
- [ ] Tests passed: `npx nx test @ledgerhq/lumen-design-core`

### Coverage Verification:
- **Enterprise**: ✅ Dark theme, ✅ Light theme
- **Websites**: ✅ Dark theme, ✅ Light theme  
- **Ledger-Live**: ✅ Dark theme, ✅ Light theme

### Issues Found:
- [List any issues discovered during sync]
- [Note any ETL process issues that need separate attention]
- [Document any tokens that were initially missed]

### Next Steps:
- [ ] Update related components if needed
- [ ] Test React Native theme integration across ALL brands
- [ ] Create PR with changes
- [ ] Document lessons learned for future syncs
```

### Post-Sync Verification - MANDATORY CHECKLIST

**⚠️ CRITICAL: Do not consider sync complete until ALL items are verified:**

1. **Complete Theme Coverage**:
   - ✅ Updated enterprise themes (dark + light)
   - ✅ Updated websites themes (dark + light)  
   - ✅ Updated ledger-live themes (dark + light)
   - ❌ Only updating one brand = INCOMPLETE SYNC

2. **Token Verification**:
   - ✅ Run comprehensive token verification scripts
   - ✅ Confirm critical missing tokens are now present
   - ✅ Validate token counts are consistent across themes
   
3. **Technical Validation**:
   - ✅ **No type errors** in design-core
   - ✅ **Lint validation passes** - code follows project standards
   - ✅ **Build succeeds** without errors
   - ✅ **Tests pass** for design-core
   
4. **Integration Validation**:
   - ✅ **Visual regression testing** if available
   - ✅ **Component integration** works across all brands
   - ✅ **React Native theme usage** validated

**Remember: A partial sync is worse than no sync - it creates inconsistencies across brand themes!**