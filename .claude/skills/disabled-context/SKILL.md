---
name: disabled-context
description: >-
  Use when a component has a `disabled` state/variant, or when building a
  compound component that owns a disabled state — inherit/provide it via the
  shared disabled context so state flows from parent to sub-components.
paths: "libs/**/*.tsx"
---

# Shared disabled context

Source of truth: `libs/utils-shared/src/lib/context/disabledContext.tsx`

- **Consumers**: Any component with a `disabled` state/variant must use the shared disabled context so it inherits disabled state from parent components. Follow existing consumers (e.g. `BaseButton`, `Switch`) for the pattern.
- **Providers**: Compound components that own a disabled state must provide it via the shared disabled context so sub-components inherit it automatically. If the compound component already has its own context provider, add disabled to that context instead of nesting a separate provider.
