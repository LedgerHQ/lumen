---
name: figma-token-sync
description: Sync processed CSS design tokens with JavaScript theme objects for React Native. Use when aligning tokens after Figma sync, checking token consistency, or updating JS theme files manually.
paths: libs/design-core/**/*.ts, libs/design-core/**/*.tsx, libs/design-core/**/*.css, libs/design-core/**/*.json
---

# Figma Token Sync

Keep the processed CSS tokens (from ETL) aligned with the JavaScript theme
objects used for React Native.

Pipeline: **Figma → JSON → CSS/Tailwind (automated)** → **JS themes (manual sync)**.
CSS is the source of truth; the JS `theme.dark.ts` / `theme.light.ts` files are
the sync targets.

## Never hardcode the brand/theme list

Brands come and go (today: `enterprise`, `ledger-live`, `websites` — but discover,
don't assume). Always enumerate them from the filesystem so a new brand can't be
silently missed:

```bash
bash .claude/skills/figma-token-sync/scripts/discover-themes.sh
```

This prints the CSS brands, the JS brands, every JS theme file that must be
updated together, and warns if the two sides disagree.

## Gap analysis

For a brand + category, compare CSS coverage against JS and list the token names
present in CSS but missing from JS:

```bash
bash .claude/skills/figma-token-sync/scripts/compare-tokens.sh <brand> <category>
# e.g. compare-tokens.sh ledger-live background
```

Run it for each category you touched (`background`, `border`, `text`, …) across
every brand from the discovery step.

## Applying updates

- Update **every** JS theme file the discovery script listed — never just one.
  Partial updates create per-brand inconsistencies.
- **Reference primitives, never hardcode values**, and use the correct
  light/dark primitive set:

```typescript
// CSS is kebab-case, JS is camelCase
'--color-border-base-inverted'        → baseInverted
'--color-background-surface-disabled' → surfaceDisabled

// ✅ reference the primitive
baseInverted: primitiveColorTokens.dark.grey['050']
// ❌ never hardcode
baseInverted: '#ffffff'
```

## Validate

```bash
npx tsc --noEmit --project libs/design-core/tsconfig.json
npx nx lint @ledgerhq/lumen-design-core --fix
npx nx build @ledgerhq/lumen-design-core
```

Checklist:

- [ ] Every JS theme file from `discover-themes.sh` was updated (no partial sync)
- [ ] `compare-tokens.sh` shows no CSS-only tokens for the categories you touched
- [ ] New tokens follow the CSS kebab → JS camelCase convention
- [ ] All values reference primitives (no hardcoded hex)
- [ ] typecheck, lint and build pass

## Troubleshooting

- **Counts differ**: rerun `compare-tokens.sh` to see which token names are
  CSS-only.
- **Type errors**: the new token must match the TypeScript theme interface.
- **A brand looks stale**: rerun `discover-themes.sh` — it may be new since the
  last sync, or present on only one side (it warns about that).
