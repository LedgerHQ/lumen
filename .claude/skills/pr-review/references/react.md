# React web review checklist (`libs/ui-react`, `libs/ui-react-visualization`)

Load this when the PR touches `libs/ui-react/**` or
`libs/ui-react-visualization/**`. Authoritative rules live in the `react-styling`
and `react-testing` skills — the items below are the review-checkable
violations. Do not restate the skills.

## Styling (Tailwind + cva + cn)

- **Design tokens, not raw Tailwind.** These lint clean but violate the design
  system — flag under `Consistency`:
  - Raw colors: `text-gray-500`, `bg-blue-600` → tokens (`text-base`,
    `text-muted`, `bg-muted`, `border-accent`, `crypto-btc`, …).
  - Raw typography: `font-bold`, `text-sm` → typography tokens
    (`body-1-semi-bold`, `heading-2`, `responsive-display-1`, …).
  - Arbitrary sizes: `w-[108px]` → `--size-*` tokens from
    `libs/design-core/src/lib/themes/css/primitives.css`.
- **`cva` at the top of the file** when there is variant composition or an
  element has many classnames. A couple of static classnames stay inline in JSX;
  don't force `cva` for those.
- **Never concatenate classnames dynamically.** ``className={`text-${color}`}``
  is wrong; use complete strings and `cn("text-base", cond && "bg-muted")`.
  `cn` comes from `@ledgerhq/lumen-utils-shared`.
- **Props drilling to the top-level element.** Behaviour must not be hidden. A
  legitimate nested `ref`/`className` gets a distinct name
  (e.g. `contentClassName`) rather than overloading the top-level prop.

## Base UI vs Radix (data attributes)

Both are live dependencies — the correct attribute form depends on which
primitive the file actually imports. Check the import, then the attribute:

- **Base UI** (`@base-ui/react`) — used in `Popover`, `Select`, `Menu`. Use
  `data-[open]` / `data-[closed]`.
- **Radix** (`@radix-ui/*`) — used in `Checkbox`, `Dialog`, `Tooltip`,
  `Switch`, `MediaButton`, `TileButton`, `Link` (Slot). Use
  `data-[state=open]` / `data-[state=closed]`, `data-[state=checked]`, etc.

Flag a `data-[state=…]` selector on a Base UI primitive (or `data-[open]` on a
Radix one) under `Consistency`.

## Types

- `ComponentPropsWithRef<'element'>` for HTML element extension; `ref` is a plain
  destructured prop (no `forwardRef` — lint-banned anyway).
- No `React.FC`. Public prop types carry JSDoc.
- Reuse named type aliases (e.g. `PopoverSide`) instead of repeating inline
  unions.

## Tests (Vitest + React Testing Library)

- Runner is **Vitest**: `import { describe, it, expect, vi } from 'vitest'` and
  `import '@testing-library/jest-dom'`. `vi.fn()`, not `jest.fn()`.
- `render` from `@testing-library/react`, **no wrapper**.
- Prefer accessible queries (`getByRole`, `getByLabelText`, `getByText`);
  `data-testid` only when nothing accessible applies.
- Cover: rendering, interaction, controlled state, callbacks, disabled state.
- No snapshot tests unless justified.

## Component addition checklist (`libs/ui-react`)

A new core component folder should have:

```
ComponentName/
- [ ] ComponentName.tsx            implementation
- [ ] types.ts                     prop types with JSDoc
- [ ] ComponentName.test.tsx       meaningful Vitest coverage
- [ ] ComponentName.stories.tsx    Base + {Property}Showcase + With{Feature}
- [ ] ComponentName.mdx            Overview + Implementation tabs
- [ ] ComponentName.figma.tsx      Code Connect (if the component is in Figma)
- [ ] index.ts                     barrel: export * and export type *
- [ ] parent index.ts              component re-exported from Components barrel
```

- Disabled state → must consume `useDisabledContext` (see `disabled-context`).
- Stories: `Base` (not `Default`/`Primary`), `parameters` include
  `layout: 'centered'` and `backgrounds: { default: 'light' }`.

**Visualization exception** (`libs/ui-react-visualization`): stories live in a
`__stories__/` subfolder and there is **no** `.mdx` or `.figma.tsx`. Don't flag
their absence.
