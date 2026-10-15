# Lumen breaking changes

Every breaking change since `ui-react@0.0.53` / `ui-rnative@0.0.42`
(December 2025), from the GitHub Releases (flagged or not) plus the pending
version plans. Icons and tokens removed by Figma syncs aren't listed one by
one: `scripts/lumen-api-diff.mjs` finds them for the repo's exact versions. A
row applies when the repo's installed version is **below** `since` and the
target is **at or above** it.

- 🔊 **Loud**: the typecheck or build fails, so it can't be missed.
- 🔇 **Silent**: still compiles, but renders wrong or not at all. Fix every hit.
- ⚖️ **Judgment**: needs a choice. Confirm it, or use the default and list it.
- 👁 **Visual only**: no code change. Review the affected screens.

Package keys: **R** = `ui-react`, **N** = `ui-rnative`, **DC** = `design-core`,
**US** = `utils-shared`. "Next" = the release after `ui-react@0.1.65`.

Detection patterns are `rg` regexes over the app's source (`.ts`, `.tsx`,
`.css`, Tailwind config). `\|` inside the tables is a Markdown escape: use `|`. Patterns cast a wide
net: `T4`–`T6` also match `duration-*`, `delay-*`, `z-*` and color steps
(`grey-400`). Keep only sizing and spacing utilities (`w`, `h`, `size`,
`min-*`, `max-*`, `basis`, `p*`, `m*`, `gap`, `inset`, `top`/`left`/…) before
counting or fixing.

## Setup

| Id | Since | Change | Detect | Fix | |
|---|---|---|---|---|---|
| S0 | R 0.0.53 | Packages renamed from `@ledgerhq/ldls-*` to `@ledgerhq/lumen-*` ([#371](https://github.com/LedgerHQ/lumen/pull/371)); `ldls-ui-core` has no successor | `@ledgerhq/ldls-` | Swap each package and import specifier (`ldls-ui-react` → `lumen-ui-react`, …), then treat the repo as being on `0.0.53` | 🔊 |
| S1 | R 0.0.64, DC 0.0.40 | Tailwind v4 required | `tailwindcss` < 4 in the lockfile | **Stop**: a separate project. `npx @tailwindcss/upgrade`, then `@tailwindcss/postcss` or `@tailwindcss/vite` ([#401](https://github.com/LedgerHQ/lumen/pull/401)) | 🔊 |
| S2 | R 0.1.57, N 0.1.60 | Visualization packages folded into the UI packages | `@ledgerhq/lumen-ui-(react\|rnative)-visualization` | Import from `@ledgerhq/lumen-ui-react/visualization` (or `ui-rnative/visualization`) and remove the old dependency | 🔊 |
| S3 | any | Lumen's dist scanned through a content glob, which breaks silently when the dist layout changes | `node_modules/@ledgerhq/lumen-ui-react/dist` in the Tailwind config or CSS | Replace with `@import '@ledgerhq/lumen-ui-react/tailwind.css';` in the main CSS (Tailwind v4 only) | 🔇 |
| S4 | Next | `cn` removed from `@ledgerhq/lumen-utils-shared` | `import\s*\{[^}]*\bcn\b[^}]*\}\s*from\s*'@ledgerhq/lumen-utils-shared'` | `import { cn } from '@ledgerhq/lumen-design-core/cn'` | 🔊 |
| S5 | Next | ui-react no longer installs `clsx` / `tailwind-merge` as peers | App imports them without declaring them in its own `package.json` | Migrate to Lumen's `cn` (SKILL.md, step 2.6), or declare them explicitly | 🔊 |
| S6 | Next | Lint plugin pins design-core exactly as a peer | `@ledgerhq/lumen-lint-plugin` in dependencies | Bump it in the same PR as design-core | 🔊 |
| S8 | R 0.1.57 | The undocumented `./*` wildcard export is removed (its deep paths already failed to resolve) | `@ledgerhq/lumen-ui-react/(dist\|lib\|src\|[A-Z])` | Import from the package root, or `/symbols`, `/visualization` | 🔊 |
| S7 | Next | Lumen owns the breakpoints; a config that replaces `theme.screens` no longer removes Lumen's | `screens` in the Tailwind config, `--breakpoint-` in CSS | Move custom breakpoints to `theme.extend.screens`, then check every responsive layout | ⚖️ |

## Tokens and Tailwind classes

| Id | Since | Change | Detect | Fix | |
|---|---|---|---|---|---|
| T1 | R 0.1.59, N 0.1.62 | `error`/`warning`/`success` backgrounds and colors render **solid** (were translucent) | `\b(bg\|text\|border)-(error\|warning\|success)\b`, `--(color\|background)-(error\|warning\|success)\b` | For the old look use `-transparent` (`bg-error-transparent`). Check each with design | ⚖️ |
| T2 | R 0.1.59, N 0.1.62 | Error `-hover`/`-pressed` renamed to `-transparent-hover`/`-transparent-pressed` | `-error-(hover\|pressed)\b` | Rename. The old classes produce no CSS | 🔇 |
| T3 | R 0.1.59, N 0.1.62 | Decorative backgrounds moved to their `-400` step | `-decorative-` | No change. Review the screens | 👁 |
| T4 | Next | Sizes from 256px up renamed to t-shirt sizes ([#888](https://github.com/LedgerHQ/lumen/pull/888)) | `\b[\w:-]*-(256\|288\|320)\b` in class strings, `--size-(256\|288\|320)`, RN `s(256\|288\|320)` | `256`→`3xs`, `288`→`2xs`, `320`→`xs` (`w-320`→`w-xs`, RN `sXs`) | 🔇 (web), 🔊 (RN) |
| T5 | Next | Sizes `400`, `480`, `560` removed (#888) | `\b[\w:-]*-(400\|480\|560)\b`, `--size-(400\|480\|560)`, RN `s(400\|480\|560)` | Use the smaller neighbor if the element must not grow, the larger if its content must not shrink: `400`→`sm`/**`md`**, `480`→`md`/**`lg`**, `560`→`lg`/**`xl`** (bold = Lumen's choice) | ⚖️ |
| T6 | Next | Spacing `160` removed (#888); also covers `w`/`h`/`size`/`min-*`/`max-*` | `\b[\w:-]*-160\b`, `--spacing-160`, RN `s160` | `144` or **`176`** (Lumen's choice) | ⚖️ |
| T7 | any | Tailwind font sizes, weights and line heights produce no CSS under the preset (found by the usage report) | `\b(text-(xs\|sm\|base\|lg\|[2-9]?xl)\|font-(thin\|light\|normal\|medium\|semibold\|bold)\|leading-\w+)\b` where used as type styles | Replace with Lumen typography (`body-*`, `heading-*`). `text-base` is a **color** in Lumen: leave it | ⚖️ |

## ui-react / ui-rnative components

| Id | Since | Change | Detect | Fix | |
|---|---|---|---|---|---|
| C1 | R 0.0.56 | `Dialog` requires `DialogBody`, adds `DialogFooter` and `height` | `<Dialog\b` | Wrap the content in `DialogBody` | 🔊 |
| C2 | R 0.0.58, N 0.0.46 | `Tag` size `lg` → `md` | `<Tag\b` with `size` | Rename | 🔊 |
| C3 | R 0.0.58 | `Search` → `SearchInput` | `\bSearch\b` imported from Lumen | Rename | 🔊 |
| C4 | R 0.0.58 | `DialogHeader` compact margin changed; `DialogBody` lost its top padding | `DialogHeader`, `DialogBody` | Review | 👁 |
| C5 | R 0.0.59, N 0.0.47 | `ListItem` became a composite component | `<ListItem\b` | Rewrite per the ListItem docs | 🔊 |
| C6 | R 0.0.60 / 0.1.12, N 0.0.48 / 0.1.11 | `Tile` became a compound component; `TileSpot` removed | `<Tile\b`, `TileSpot` | Rewrite with the compound API. `TileSpot`→`Spot` | 🔊 |
| C7 | R 0.0.72, N 0.0.59 | `Tile` trailing content goes in `TileTrailingContent` | `<Tile\b` with trailing nodes | Move them into `TileTrailingContent` | 👁 |
| C8 | R 0.0.66 / 0.1.12, N 0.0.54 / 0.1.11 | `Subheader` became a composite (`SubheaderRow`, `SubheaderTitle`); `SubheaderAction` removed | `<Subheader\b`, `SubheaderAction`, `Subheader\.` | Rewrite. Place actions beside `SubheaderRow` in a flex layout | 🔊 |
| C9 | N 0.0.54 | `LumenStyleSheetProvider`: `colorScheme` is controlled | `LumenStyleSheetProvider` | Pass `colorScheme` from app state | ⚖️ |
| C10 | N 0.0.69 | `PageIndicator` current page is 1-based | `<PageIndicator\b` | Add 1 to the current page value | 🔇 |
| C11 | R 0.1.6 | `ThemeProvider` `mode` → `colorScheme`; `useTheme` removed | `ThemeProvider`, `useTheme` from Lumen | Rename. Replace `useTheme` with app state | 🔊 |
| C12 | R 0.1.12 | `Dialog` `extended` → `expanded` | `extended` near `Dialog` | Rename | 🔊 |
| C13 | R 0.1.16, N 0.1.15 | `ListItemSpot`, `ListItemIcon`, `ListItemTruncate` removed | Those names | `Spot`; the icon component with `size={24}`; `ListItemContentRow` | 🔊 |
| C14 | R 0.1.16 | `Dialog` and `Popover` `hug` → `fit` ([#605](https://github.com/LedgerHQ/lumen/pull/605)) | `["']hug["']` near `Dialog`/`Popover` | Rename | 🔊 |
| C15 | N 0.1.16 | Inputs: `disabled` split from `editable` | `editable=\{false\}` | Disabled look → `disabled`; read-only → keep `editable={false}` | ⚖️ |
| C16 | R 0.1.17 | `Select` moved to a data-driven Base UI API (`items`, `SelectList renderItem`, `value: string \| null`) | `@ledgerhq/lumen-ui-react` `Select*` | Rewrite per [#599](https://github.com/LedgerHQ/lumen/pull/599) | 🔊 |
| C17 | R 0.1.18, N 0.1.17 | `InteractiveIcon` takes `icon` and `size`, not children | `<InteractiveIcon\b` | `icon={X} size={n}` | 🔊 |
| C18 | R 0.1.21, N 0.1.21 | `appearance` → `density` on `DialogHeader` (R), `NavBar` and `BottomSheetHeader` (N) | Those components with `appearance` | Rename | 🔊 |
| C19 | R 0.1.22, N 0.1.23 | `TriggerButton` → `MediaButton`; `SelectMediaButton` removed (R) | `TriggerButton`, `SelectMediaButton` | Rename. Use `MediaButton` in `SelectTrigger`'s `render` | 🔊 |
| C20 | R 0.1.28, N 0.1.29 | `Avatar` sizes shifted (`sm` 40→`md`, `md` 48→`lg`, `lg` 72→`xl` 64) | `<Avatar\b` with `size` | Map by pixels. 72px no longer exists: confirm with design | 🔇 |
| C21 | R 0.1.36, N 0.1.37 | `MediaButton`/`NavBarCoinCapsule` `icon` → `leadingContent`; `iconType` → `leadingContentShape` | Those components with `icon`/`iconType` | Rename | 🔊 |
| C22 | R 0.1.37, N 0.1.38 | `DotIndicator` rescaled to `sm\|md\|lg\|xl`, default `md` | `<DotIndicator\b` | `xs`→`lg`, `sm`→`xl`. Old `md`/`lg` have no equivalent. No `size` → pass `xl` to keep the old look | ⚖️ |
| C23 | R 0.1.45, N 0.1.48 | `OptionList*` generics: value type first, then meta | `OptionList\w*<` | `<string, MyMeta>` | 🔊 |
| C24 | R 0.1.46, N 0.1.49 | `Avatar` `showNotification` removed | `showNotification` | Wrap in `DotIndicator {...getDotIndicatorProps('avatar', size)}` | 🔊 |
| C25 | R 0.1.48 | `TableCellContent` became a compound (`TableCellItem`, `…Title`, `…Description`) | `TableCellContent` with props | Rewrite | 🔊 |
| C26 | R 0.1.49, N 0.1.52 | `Avatar`: no ring by default, `appearance` sets the ring; interactive avatars use `AvatarButton` | `<Avatar\b` with `appearance` or handlers | `AvatarButton` when clickable. Review the visuals | ⚖️ |
| C27 | R 0.1.53, N 0.1.56 | `BaseInput` (and `BaseButton` on R) no longer public | `BaseInput`, `BaseButton` | `TextInput`, `Button` | 🔊 |
| C28 | R 0.1.58, N 0.1.61 | Dot size maps → `getDotIconProps` / `getDotSymbolProps` | `(mediaImage\|spot)Dot(Icon)?SizeMap` | `{...getDotIconProps('mediaImage', 48)}` | 🔊 |
| C29 | N 0.1.62 | `OptionList*` → `SelectList*` | `OptionList` | Rename | 🔊 |
| C30 | N 0.1.62 | `resolveAvatarColor` → `useResolveAvatarColor` (a hook) | `resolveAvatarColor` | Rename. Call it only inside components | 🔊 |
| C31 | US 0.1.15 | `getStepperCalculations` returns new fields | `getStepperCalculations` | Use `progressDashArray`, `progressMaskDashArray`, `progressDashOffset`, `dashPatternOffset` | 🔊 |
| C32 | R 0.1.63 | `Link` with `size="inherit"` gets a 4px gap | `<Link\b` with `size=["']inherit` | Review | 👁 |
| C33 | Next | `Dialog` (448px, max height 576px), `Popover` fixed (448px), `Menu` min width (176px), `Toast` (448px) are bigger | Those components | Review the host layouts | 👁 |
| C34 | Next | Icons removed: `Apex` (→ `NanoGen5`), `Charon` (→ `RecoveryKey`), `BellNotification`, `ShieldCheckNotification` | Those names, and `apex.svg` / `charon.svg` | Rename. For the last two, ask design | 🔊 |
| C35 | Next | `Switch` renders a native input: Enter no longer toggles it, `className` lands on the wrapper; `@radix-ui/react-switch` no longer needed | `<Switch\b` with `className` | Review. Remove the Radix dependency if nothing else uses it | 👁 |
| C36 | Next | `cn` merges Lumen classes correctly: `className` overrides now win where CSS order used to decide | Any Lumen component given a `className` | Review the screens that override text color or typography | 👁 |
| C37 | N 0.0.46 | `LumenStyleSheet.useCreate` → `useStyleSheet`, `LumenStyleSheet.useTheme` → `useTheme`, `mergeStyles` removed | `LumenStyleSheet\.`, `mergeStyles` | Rename. `mergeStyles` → `StyleSheet.flatten()` | 🔊 |
| C38 | R 0.0.59, N 0.0.47 | `ListItem` `align` props removed (alignment is automatic) | `<ListItem\w*[^>]*\balign=` | Remove the prop. Review alignment | 🔊 |
| C39 | US 0.0.16, R 0.0.67 | `extractSlottable` removed | `extractSlottable` | Inline the logic in the app, or ask the Lumen team | 🔊 |
| C40 | R 0.1.13 | `ButtonTrigger` → `TriggerButton`, `SelectButtonTrigger` → `SelectTriggerButton` (both later replaced: `C19`) | `ButtonTrigger`, `SelectButtonTrigger` | Go straight to `MediaButton` (`C19`, `C21`) | 🔊 |
| C41 | R 0.1.24 | Select search: `autoFocusSearch` → `initialFocus`, now **on by default** | `autoFocusSearch` | Rename. Pass `initialFocus={false}` where focus must not move | ⚖️ |
| C42 | R 0.1.31, N 0.1.32 | Inputs: `errorMessage` → `helperText` + `status="error"`; `aria-invalid` is set automatically ([#653](https://github.com/LedgerHQ/lumen/pull/653)) | `errorMessage` | `helperText="…" status="error"`. Remove explicit `aria-invalid` | 🔊 |
| C43 | R 0.1.36 | `Menu` moved to Base UI ([#716](https://github.com/LedgerHQ/lumen/pull/716)): needs `@base-ui/react`; `MenuTrigger` `asChild`/children → `render`; items `onSelect` → `onClick`, `textValue` → `label`; keep-open via `closeOnClick={false}`; `MenuPortal`, `modal`, `inset`, `asChild`, collision/event props and `checked="indeterminate"` removed; checkbox items stay open by default | `<Menu\w*\b`, `MenuPortal`, `onSelect=` | Install `@base-ui/react`. `<MenuTrigger render={<IconButton …/>} />`. `e.preventDefault()` keep-open → `closeOnClick={false}` | 🔊 |
| C44 | N 0.1.38 | Deprecated `Select` removed | `Select` imported from `@ledgerhq/lumen-ui-rnative` | `SelectList` (`C29`) | 🔊 |
| C45 | R 0.1.52 | `BaseButton`, `MediaButton`, `CardButton` default to `type="button"`: inside a `<form>` they **no longer submit** | Those components inside a `<form>` without `type=` | Add `type="submit"` where the button submits | 🔇 |
| C46 | US 0.1.14 | `toPascalCase` removed | `toPascalCase` | Inline it in the app | 🔊 |
| C47 | R 0.1.63, N 0.1.66 | Default a11y labels removed (Legend, AmountInput, Donut chart, SegmentedControl arrows); N drops `i18next` / `react-i18next` (`ThemeProvider` `locale` unchanged) | `Legend`, `AmountInput`, `DonutChart`, `SegmentedControl`; tests querying those labels | Pass explicit labels. Update tests that query by those labels | ⚖️ |
| C48 | R 0.1.64, N 0.1.67 | `Spot`: `icon` required; `appearance` is a palette, plus `fill`; `icon`, `check`, `info`, `bluetooth`, `loader`, `number` appearances and the `number` prop removed ([#892](https://github.com/LedgerHQ/lumen/pull/892)) | `<Spot\b`, `DiscriminatedSpotProps` | `icon`→drop `appearance`; `check`→`appearance="success" icon={CheckmarkCircleFill}`; `info`→`muted` + `InformationFill`; `error`/`warning` + their icons; `loader`→`icon={Spinner}`; `bluetooth`→`icon={BluetoothCircleFill}`; `number`→`<SpotNumber value={n} />` | 🔊 |
| C49 | viz (R/N) | Charts: `RevealClip` → `RevealAnimationProvider` (+ `usePathReveal`, `usePointReveal` / `useRevealFadeProps`); N: `minShare` → `groupBelowShare`, `applyMagnetisation` → `applyMagnetization` | `RevealClip`, `minShare`, `applyMagnetisation` | Rename | 🔊 |

## Maintaining this file

Add a row whenever a version plan contains `BREAKING CHANGE`. Ids are
permanent: never renumber, append instead. Once a "Next" release ships,
replace "Next" with the real versions.
