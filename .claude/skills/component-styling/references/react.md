# React web styling (`libs/ui-react`, `libs/ui-react-visualization`)

Tailwind + `class-variance-authority` (`cva`) + `cn`. The shared principles live
in the parent `SKILL.md`; this file is the web mechanism and the token catalogue.

## class-variance-authority (cva)

- Use `cva` at the top of the file when there is **variant composition** or an
  element carries **many** classnames.
- For only a couple of static classnames, set them inline in the JSX — don't
  force `cva`.

## Classname merging

- Never concatenate classnames. ``className={`text-${color}`}`` is wrong.
- Use complete strings and `cn` for conditionals:
  `cn("text-base", cond && "bg-muted")`. `cn` comes from
  `@ledgerhq/lumen-utils-shared`.

## Never hold classnames in a bare string variable

Classes belong in a JSX `className` or inside a `cn()` / `cva()` call. ESLint
(`callees` in [eslint.shared.mjs](../../../../eslint.shared.mjs)) and Tailwind
IntelliSense (`tailwindCSS.classFunctions` in
[.vscode/settings.json](../../../../.vscode/settings.json)) both resolve classes from
`className` plus those two names, so anything else ships with no validation, no
autocomplete and no sorting — a typo stays silent.

```tsx
// Wrong — invisible to every Tailwind tool
const shadowStyles = 'invisible absolute h-0 py-0';

// Right — inline at the point of use
<div className={cn(fieldStyles, 'invisible absolute h-0 py-0')} />;
```

Extract only when the classes are reused or numerous, and wrap the value in `cn()`.
A new class helper must be registered in both configs above.

## Design-system tokens

Custom plugins live in `libs/design-core/src/lib/presets/allBrands.ts`. All
`-default` suffixes are stripped by the plugin, so omit them from utilities.

### Typography

- Do **not** use Tailwind typography utilities (`font-bold`, `text-sm`, …).
- Use the custom typography utilities. Source of truth:
  `libs/design-core/src/lib/utils/createCustomPlugin.ts` (`createTypographyPlugin`).
- Classes include: `.responsive-display-1`–`4`; `.heading-0`,
  `.heading-0-semi-bold` … `.heading-4`, `.heading-4-semi-bold`; `.body-1`,
  `.body-1-semi-bold` … `.body-4`, `.body-4-semi-bold`.

### Colours & background

- Do **not** use the Tailwind default palette (`text-gray-500`, `bg-blue-600`).
- Use the design tokens from `createThemePlugin`:
  - Text: `text-base`, `text-on-accent`, `text-muted`, …
  - Background: `bg-base`, `bg-muted`, `bg-accent`, …
  - Border: `border-base`, `border-muted`, `border-accent`, …
  - Crypto: `crypto-btc`, `crypto-eth`, … (and variants like `crypto-btc-0`)
  - Discovery: `discover-base`, `discover-muted`, …

### Spacing & layout

- Padding: `p-{size}`, `px-{size}`, `py-{size}`, `pt-{size}`, …
- Margin: `m-{size}`, `mx-{size}`, `my-{size}`, `mt-{size}`, …
- `{size}` is a pixel-based value (`4`, `8`, `16`, …).

### Width / height / size

- Do **not** use arbitrary sizes (`w-[108px]`, `h-[90px]`).
- Only use `--size-*` tokens from
  `libs/design-core/src/lib/themes/css/primitives.css`.
  - Small: 0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56,
    64, 72, 80, 96
  - Large: 112, 128, 144, 176, 192, 208, 224, 256, 288, 320, 400, 480, 560
- If a Figma size has no token, pick the closest and document it — see
  `figma-to-code`.

### Borders & shadows

- Border radius (`createThemePlugin`): `rounded-sm`, `rounded-md`, `rounded-lg`, …
- Border width: `border` (default), `border-2` (active/emphasised).
- Shadow (`createShadowPlugin`): `shadow-sm`, `shadow-md`, `shadow-lg`,
  `shadow-xl`, `shadow-2xl`.

### Gradients

- `createGradientPlugin`: `bg-gradient-top`, `bg-gradient-bottom`,
  `bg-gradient-{crypto}`.

## Base UI vs Radix (data attributes)

Both are live dependencies — the correct attribute form depends on which
primitive the file actually imports. **Check the import, then the attribute:**

- **Base UI** (`@base-ui/react`) — used in `Popover`, `Select`, `Menu`. Use
  `data-[open]` / `data-[closed]`.
- **Radix** (`@radix-ui/*`) — used in `Checkbox`, `Dialog`, `Tooltip`, `Switch`,
  `MediaButton`, `TileButton`, `Link` (Slot). Use `data-[state=open]` /
  `data-[state=closed]`, `data-[state=checked]`, etc.

A `data-[state=…]` selector on a Base UI primitive (or `data-[open]` on a Radix
one) is a `Consistency` bug.

## Types

- `ComponentPropsWithRef<'element'>` for HTML element extension; `ref` is a plain
  destructured prop (no `forwardRef` — lint-banned anyway).
- No `React.FC`. Public prop types carry JSDoc.
- Reuse named type aliases (e.g. `PopoverSide`) instead of repeating inline
  unions.

## Visualization exception

`libs/ui-react-visualization` still uses Tailwind, but stories live in
`__stories__/` and it has no `.figma.tsx` coverage (see `component-anatomy`).
