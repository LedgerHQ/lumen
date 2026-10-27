# Lumen breaking changes

Every breaking change since December 2025 (`ui-react@0.0.53`), from the
GitHub Releases (flagged or not) and the pending version plans. Icons and
tokens removed by Figma syncs aren't listed one by one:
`scripts/lumen-api-diff.mjs` finds them for the repo's exact versions.

## Which rows apply

"Introduced in" lists the first version of **each** affected package.

- **Skip a row** when every listed package the repo installs is already at
  or above its listed version. Don't run its detection.
- **Apply it** when at least one listed package is installed below its
  listed version, and the target reaches it.
- **`always`**: check on every repo.
- **♻️ Replacement rows** follow their own rule: they apply whenever the
  **target** is at or above their version, whatever is installed. A repo can
  be past the version and still keep its local copy, since nothing forced the
  switch. The detection decides whether there's anything to replace.
- Compare versions numerically: `0.1.9` < `0.1.12`.
- A row listing a package the repo doesn't install is judged on the others.
  A repo still on `@ledgerhq/ldls-*` starts at `S0`.

Example: a repo on `ui-react@0.1.40` skips `C21` (`ui-react@0.1.36`) and
applies `C24` (`ui-react@0.1.46`). It still runs `S3` (♻️, `ui-react@0.1.51`)
even once it's past 0.1.51.

## Legend

- 🔊 **Loud**: the typecheck or build fails, so it can't be missed.
- 🔇 **Silent**: still compiles, but renders wrong or not at all. Fix every hit.
- ⚖️ **Judgment**: needs a choice. Confirm it, or use the default and list it.
- 👁 **Visual only**: no code change. Review the affected screens.
- ♻️ **Replacement**: Lumen now provides something apps built themselves. The
  row says how to find the local version and what makes it safe to replace.
  Smaller cases appear as a ♻️ step inside another row's fix.

A fix that starts with **Stop** means the upgrade can't proceed in this PR.

Detection patterns are `rg` regexes over the app's source (`.ts`, `.tsx`,
`.css`, Tailwind config). `\|` inside the tables is a Markdown escape: use `|`. Some patterns cast a
wide net: keep only the hits that match the row's change before counting or
fixing.

## Setup

| Id | Introduced in | Change | Detect | Fix | |
|---|---|---|---|---|---|
| S0 | ui-react@0.0.53, ui-rnative@0.0.42, design-core@0.0.34, utils-shared@0.0.11 | Packages renamed from `@ledgerhq/ldls-*` to `@ledgerhq/lumen-*` ([#371](https://github.com/LedgerHQ/lumen/pull/371)); `ldls-ui-core` has no successor | `@ledgerhq/ldls-` | Swap each package and import specifier (`ldls-ui-react` → `lumen-ui-react`, …), then treat the repo as being on `0.0.53` | 🔊 |
| S1 | ui-react@0.0.64, design-core@0.0.40 | Tailwind v4 required | `tailwindcss` < 4 in the lockfile | **Stop**: a separate project. `npx @tailwindcss/upgrade`, then `@tailwindcss/postcss` or `@tailwindcss/vite` ([#401](https://github.com/LedgerHQ/lumen/pull/401)) | 🔊 |
| S2 | ui-react@0.1.57, ui-rnative@0.1.60 | Visualization packages folded into the UI packages | `@ledgerhq/lumen-ui-(react\|rnative)-visualization` | Import from `@ledgerhq/lumen-ui-react/visualization` (or `ui-rnative/visualization`) and remove the old dependency | 🔊 |
| S3 | ui-react@0.1.51 | Lumen ships `tailwind.css`, which registers its compiled components as a Tailwind source ([#819](https://github.com/LedgerHQ/lumen/pull/819)). Apps that scan Lumen's `dist` with their own glob break silently when the dist layout changes | `node_modules/@ledgerhq/lumen-ui-react(-visualization)?/dist` in the Tailwind config (`content`) or CSS (`@source`). Safe to replace when the app is on Tailwind v4 and the glob covers only Lumen's `dist` | Remove the glob, then add `@import '@ledgerhq/lumen-ui-react/tailwind.css';` after `@import 'tailwindcss';`. It also covers charts | ♻️ |
| S4 | utils-shared@0.1.17 | `cn` removed from `@ledgerhq/lumen-utils-shared` | `import\s*\{[^}]*\bcn\b[^}]*\}\s*from\s*'@ledgerhq/lumen-utils-shared'` | `import { cn } from '@ledgerhq/lumen-design-core/cn'` | 🔊 |
| S5 | ui-react@0.1.66 | ui-react no longer installs `clsx` / `tailwind-merge` as peers | App imports them without declaring them in its own `package.json`. Also every workspace that declares them (`dependencies`, `devDependencies`, `peerDependencies`, `peerDependenciesMeta`, pnpm `catalog` entries, knip `ignoreDependencies`) but imports neither | Replace the local helper (`T8`), or declare them explicitly. Remove the declarations that only satisfied ui-react's old peers: design-core 0.1.34 depends on `clsx` and `tailwind-merge` itself for `cn` | 🔊 |
| S6 | lint-plugin@0.1.1 | Lint plugin pins design-core exactly as a peer | `@ledgerhq/lumen-lint-plugin` in dependencies | Bump it in the same PR as design-core | 🔊 |
| S8 | ui-react@0.1.57 | The undocumented `./*` wildcard export is removed (its deep paths already failed to resolve) | `@ledgerhq/lumen-ui-react/(dist\|lib\|src\|[A-Z])` | Import from the package root, or `/symbols`, `/visualization` | 🔊 |

## Tokens and Tailwind classes

| Id | Introduced in | Change | Detect | Fix | |
|---|---|---|---|---|---|
| T1 | design-core@0.1.29, ui-react@0.1.59, ui-rnative@0.1.62 | `error`/`warning`/`success` backgrounds and colors render **solid** (were translucent) | Web: `\b(bg\|text\|border)-(error\|warning\|success)\b`, `--(color\|background)-(error\|warning\|success)\b`. React Native: `\b(bg\|text\|border)\.(error\|warning\|success)\b` (`t.colors.bg.error`) | For the old look use the `-transparent` variant (`bg-error-transparent`, `t.colors.bg.errorTransparent`). Check each with design | ⚖️ |
| T2 | design-core@0.1.29, ui-react@0.1.59, ui-rnative@0.1.62 | **Background** error `-hover`/`-pressed` renamed to `-transparent-hover`/`-transparent-pressed`. Border error hover/pressed are unchanged: leave `border-error-hover`, `ring-error-pressed` and `--border-error-*` alone | Web: `\b(bg\|from\|via\|to\|fill\|accent\|shadow)-error-(hover\|pressed)\b`, `--(color-)?background-error-(hover\|pressed)\b`. React Native: `\bbg\.error(Hover\|Pressed)\b` | Rename (`bg-error-transparent-hover`, `t.colors.bg.errorTransparentHover`). The old classes produce no CSS | 🔇 |
| T3 | design-core@0.1.29, ui-react@0.1.59, ui-rnative@0.1.62 | Decorative backgrounds moved to their `-400` step | `-decorative-` | No change. Review the screens | 👁 |
| T7 | always | Tailwind font sizes, weights and named line heights produce no CSS under the preset (found by the usage report). Dead code that predates the upgrade, not caused by a bump. Other `leading-*` classes do emit CSS: `leading-none` (`1`), `leading-px` and arbitrary `leading-[…]` are static, and `leading-<n>` reads Lumen's spacing in px (`leading-6` is **6px**, not 1.5rem) | `\b(text-(xs\|sm\|base\|lg\|[2-9]?xl)\|font-(thin\|light\|normal\|medium\|semibold\|bold)\|leading-(tight\|snug\|normal\|relaxed\|loose))\b` where used as type styles. Review `leading-[0-9]+\b` hits separately | Removing them changes nothing on screen: they emit no CSS, and on a Lumen component `cn` keeps its own typography class (`cn('body-2', 'font-semibold')` keeps both). Replacing them with Lumen typography (`body-*`, `heading-*`) does change the screen: confirm with design. `text-base` is a **color** in Lumen: leave it | ⚖️ |
| T8 | design-core@0.1.34 | Lumen ships `cn` (`@ledgerhq/lumen-design-core/cn`): clsx + tailwind-merge configured for Lumen's classes | Files importing `tailwind-merge`, `clsx` or `classnames`. Safe to replace only when the helper uses no `extendTailwindMerge` / `createTailwindMerge` of its own, and the app doesn't restore Tailwind font sizes (`fontSize` in its config, `--text-*` in `@theme`) | `export { cn } from '@ledgerhq/lumen-design-core/cn';` in the helper's file | ♻️ |

## ui-react / ui-rnative components

| Id | Introduced in | Change | Detect | Fix | |
|---|---|---|---|---|---|
| C1 | ui-react@0.0.56 | `Dialog` requires `DialogBody`, adds `DialogFooter` and `height` | `<Dialog\b` | Wrap the content in `DialogBody` | 🔊 |
| C2 | ui-react@0.0.58, ui-rnative@0.0.46 | `Tag` size `lg` → `md` | `<Tag\b` with `size` | Rename | 🔊 |
| C3 | ui-react@0.0.58 | `Search` → `SearchInput` | `\bSearch\b` imported from Lumen | Rename | 🔊 |
| C4 | ui-react@0.0.58 | `DialogHeader` compact margin changed; `DialogBody` lost its top padding | `DialogHeader`, `DialogBody` | Review | 👁 |
| C5 | ui-react@0.0.59, ui-rnative@0.0.47 | `ListItem` became a composite component | `<ListItem\b` | Rewrite per the ListItem docs | 🔊 |
| C6 | ui-react@0.1.12, ui-rnative@0.1.11 | `Tile` became a compound component; `TileSpot` removed | `<Tile\b`, `TileSpot` | Rewrite with the compound API. `TileSpot`→`Spot` | 🔊 |
| C7 | ui-react@0.0.72, ui-rnative@0.0.59 | `Tile` trailing content goes in `TileTrailingContent`, which provides its spacing | `<Tile\b` with trailing nodes | Move them into `TileTrailingContent` | 🔇 |
| C8 | ui-react@0.1.12, ui-rnative@0.1.11 | `Subheader` became a composite (`SubheaderRow`, `SubheaderTitle`); `SubheaderAction` removed | `<Subheader\b`, `SubheaderAction`, `Subheader\.` | Rewrite. Place actions beside `SubheaderRow` in a flex layout | 🔊 |
| C9 | ui-rnative@0.0.54 | `LumenStyleSheetProvider`: `colorScheme` is controlled | `LumenStyleSheetProvider` | Pass `colorScheme` from app state | ⚖️ |
| C10 | ui-react@0.0.80, ui-rnative@0.0.69 | `PageIndicator` current page is 1-based | `<PageIndicator\b` | Add 1 to the current page value | 🔇 |
| C11 | ui-react@0.1.6 | `ThemeProvider` `mode` → `colorScheme`; `useTheme` removed | `ThemeProvider`, `useTheme` from Lumen | Rename. Replace `useTheme` with app state | 🔊 |
| C12 | ui-react@0.1.12 | `Dialog` `extended` → `expanded` | `extended` near `Dialog` | Rename | 🔊 |
| C13 | ui-react@0.1.16, ui-rnative@0.1.15 | `ListItemSpot`, `ListItemIcon`, `ListItemTruncate` removed | Those names | `Spot`; the icon component with `size={24}`; `ListItemContentRow` | 🔊 |
| C14 | ui-react@0.1.16, ui-rnative@0.1.15 | `Dialog` and `Popover` `hug` → `fit` ([#605](https://github.com/LedgerHQ/lumen/pull/605)) | `["']hug["']` near `Dialog`/`Popover` | Rename | 🔊 |
| C15 | ui-rnative@0.1.16 | Inputs: `disabled` split from `editable` | `editable=\{false\}` | Disabled look → `disabled`; read-only → keep `editable={false}` | ⚖️ |
| C16 | ui-react@0.1.17 | `Select` moved to a data-driven Base UI API (`items`, `SelectList renderItem`, `value: string \| null`) | `@ledgerhq/lumen-ui-react` `Select*` | Rewrite per [#599](https://github.com/LedgerHQ/lumen/pull/599). ♻️ With `SelectSearch`, a case-insensitive label filter is now the default: remove a custom `filter` that does only that | 🔊 |
| C17 | ui-react@0.1.18, ui-rnative@0.1.17 | `InteractiveIcon` takes `icon` and `size`, not children | `<InteractiveIcon\b` | `icon={X} size={n}` | 🔊 |
| C18 | ui-react@0.1.21, ui-rnative@0.1.21 | `appearance` → `density` on `DialogHeader` (ui-react), `NavBar` and `BottomSheetHeader` (ui-rnative) | Those components with `appearance` | Rename | 🔊 |
| C19 | ui-react@0.1.22, ui-rnative@0.1.23 | `TriggerButton` → `MediaButton`; `SelectMediaButton` removed (ui-react) | `TriggerButton`, `SelectMediaButton` | Rename. Use `MediaButton` in `SelectTrigger`'s `render` | 🔊 |
| C20 | ui-react@0.1.29, ui-rnative@0.1.30 | `Avatar` sizes. Up to ui-react 0.1.27 (ui-rnative 0.1.28): `sm` 40, `md` 48, `lg` 72. From 0.1.29 (0.1.30): `sm` 40, `md` 48, `lg` **56**, `xl` 72 (`xs` 24 and `2xl` 128 from 0.1.49 / 0.1.52). The 0.1.29 release notes ("lg now 64") are wrong | `<Avatar\w*\b` with `size=["']lg` | Keep 72px: `lg` → `xl`. `sm` and `md` are unchanged. A repo on exactly ui-react 0.1.28 (`sm` 32, `md` 40, `lg` 48, `xl` 64): `md`→`sm`, `lg`→`md`, `xl` → `lg` (56) or `xl` (72), `sm` → `xs` (24, from 0.1.49) or `sm` (40), confirm with design | 🔇 |
| C21 | ui-react@0.1.36, ui-rnative@0.1.37 | `MediaButton`/`NavBarCoinCapsule` `icon` → `leadingContent`; `iconType` → `leadingContentShape` | Those components with `icon`/`iconType` | Rename | 🔊 |
| C22 | ui-react@0.1.37, ui-rnative@0.1.38 | `DotIndicator` rescaled to `sm\|md\|lg\|xl`, default `md` | `<DotIndicator\b` | `xs`→`lg`, `sm`→`xl`. Old `md`/`lg` have no equivalent. No `size` → pass `xl` to keep the old look | ⚖️ |
| C23 | ui-react@0.1.45, ui-rnative@0.1.48 | `OptionList*` generics: value type first, then meta | `OptionList\w*<` | `<string, MyMeta>` | 🔊 |
| C24 | ui-react@0.1.46, ui-rnative@0.1.49, utils-shared@0.1.8 | `Avatar` `showNotification` removed | `showNotification` | Wrap in `DotIndicator {...getDotIndicatorProps('avatar', size)}` | 🔊 |
| C25 | ui-react@0.1.48 | `TableCellContent` became a compound (`TableCellItem`, `…Title`, `…Description`) | `TableCellContent` with props | Rewrite | 🔊 |
| C26 | ui-react@0.1.49, ui-rnative@0.1.52, design-core@0.1.23, utils-shared@0.1.10 | `Avatar`: no ring by default, `appearance` sets the ring; interactive avatars use `AvatarButton` | `<Avatar\b` with `appearance` or handlers | `AvatarButton` when clickable. Review the visuals | ⚖️ |
| C27 | ui-react@0.1.53, ui-rnative@0.1.56 | `BaseInput` (and `BaseButton` on ui-react) no longer public | `BaseInput`, `BaseButton` | `TextInput`, `Button` | 🔊 |
| C28 | ui-react@0.1.58, ui-rnative@0.1.61 | Dot size maps → `getDotIconProps` / `getDotSymbolProps` | `(mediaImage\|spot)Dot(Icon)?SizeMap` | `{...getDotIconProps('mediaImage', 48)}` | 🔊 |
| C29 | ui-rnative@0.1.62 | `OptionList*` → `SelectList*` | `OptionList` | Rename | 🔊 |
| C30 | ui-rnative@0.1.62, utils-shared@0.1.13 | `resolveAvatarColor` → `useResolveAvatarColor` (a hook) | `resolveAvatarColor` | Rename. Call it only inside components | 🔊 |
| C31 | ui-react@0.1.62, ui-rnative@0.1.65, utils-shared@0.1.15 | `getStepperCalculations` returns new fields | `getStepperCalculations` | Use `progressDashArray`, `progressMaskDashArray`, `progressDashOffset`, `dashPatternOffset` | 🔊 |
| C32 | ui-react@0.1.63 | `Link` with `size="inherit"` gets a 4px gap | `<Link\b` with `size=["']inherit` | Review | 👁 |
| C34 | ui-react@0.1.66, ui-rnative@0.1.69, design-core@0.1.34 | Icons removed: `Apex` (→ `NanoGen5`), `Charon` (→ `RecoveryKey`), `BellNotification`, `ShieldCheckNotification` | Those names, and `apex.svg` / `charon.svg` | Rename. For the last two, the default is the base icon (`Bell`, `ShieldCheck`) inside `<DotIndicator appearance="red" size="md">`, as a small local component (`BellNotificationIcon`) that takes the icon's props (`size`, `className` on web; `size`, `style`, `color` on React Native) so it still fits any `icon` prop (`IconButton`, `Spot`). Confirm with design | 🔊 |
| C35 | ui-react@0.1.66 | `Switch` renders a native input: Enter no longer toggles it, `className` lands on the wrapper `<span>`; `@radix-ui/react-switch` is no longer a peer. `data-state` / `data-disabled` now sit on the hidden `<input>` and the inner track, not the wrapper, so state variants in `className` (`data-[state=checked]:bg-…`) **stop applying** | `<Switch\b` with `className`; `data-\[state=`, `data-disabled` or `data-\[disabled` in that `className`; `@radix-ui/react-switch` in any `package.json` (all dependency fields, `peerDependenciesMeta`), pnpm `catalog` or knip ignore list | Review plain overrides. A state variant has no supported replacement (a Lumen gap): drop it and accept the default, or ask the Lumen team. Remove the Radix declarations wherever nothing imports it | 👁 🔇 |
| C36 | design-core@0.1.34 | `cn` merges Lumen classes correctly: `className` overrides now win where CSS order used to decide | Any Lumen component given a `className` | Review the screens that override text color or typography | 👁 |
| C37 | ui-rnative@0.0.46 | `LumenStyleSheet.useCreate` → `useStyleSheet`, `LumenStyleSheet.useTheme` → `useTheme`, `mergeStyles` removed | `LumenStyleSheet\.`, `mergeStyles` | Rename. `mergeStyles` → `StyleSheet.flatten()` | 🔊 |
| C38 | ui-react@0.0.59, ui-rnative@0.0.47 | `ListItem` `align` props removed (alignment is automatic) | `<ListItem\w*[^>]*\balign=` | Remove the prop. Review alignment | 🔊 |
| C39 | ui-react@0.0.67, ui-rnative@0.0.55, utils-shared@0.0.16 | `extractSlottable` removed | `extractSlottable` | Inline the logic in the app, or ask the Lumen team | 🔊 |
| C40 | ui-react@0.1.13, ui-rnative@0.1.12 | `ButtonTrigger` → `TriggerButton`, `SelectButtonTrigger` → `SelectTriggerButton` (both later replaced: `C19`) | `ButtonTrigger`, `SelectButtonTrigger` | Go straight to `MediaButton` (`C19`, `C21`) | 🔊 |
| C41 | ui-react@0.1.24 | Select: `autoFocusSearch` → `initialFocus`, and focus now **moves into the content on open by default**, including for every `SelectContent` that sets neither prop | `autoFocusSearch`, `<SelectContent\b` | Rename. Where focus must stay put, pass `initialFocus={false}` | ⚖️ |
| C42 | ui-react@0.1.31, ui-rnative@0.1.32 | Inputs: `errorMessage` → `helperText` + `status="error"`; `aria-invalid` is set automatically ([#653](https://github.com/LedgerHQ/lumen/pull/653)) | `errorMessage`, `aria-invalid` on Lumen inputs | `helperText="…" status="error"`. ♻️ Remove `aria-invalid` where it only mirrors the error state | 🔊 |
| C43 | ui-react@0.1.36 | `Menu` moved to Base UI ([#716](https://github.com/LedgerHQ/lumen/pull/716)): needs `@base-ui/react`; `MenuTrigger` `asChild`/children → `render`; items `onSelect` → `onClick`, `textValue` → `label`; keep-open via `closeOnClick={false}`; `MenuPortal`, `modal`, `inset`, `asChild`, collision/event props and `checked="indeterminate"` removed; checkbox items stay open by default. **`onSelect` still typechecks** (it's a valid DOM prop) but no longer runs on activation | `<Menu\w*\b`, `MenuPortal`, `onSelect=` | Install `@base-ui/react`. `<MenuTrigger render={<IconButton …/>} />`. Rename every `onSelect` on menu items to `onClick`, and check each item's close behavior: `e.preventDefault()` keep-open → `closeOnClick={false}` | 🔊 🔇 |
| C44 | ui-rnative@0.1.38 | Deprecated `Select` removed | `Select` imported from `@ledgerhq/lumen-ui-rnative` | `SelectList` (`C29`) | 🔊 |
| C45 | ui-react@0.1.52 | Lumen buttons default to `type="button"`: inside a `<form>` they **no longer submit**. Applies to `Button`, `IconButton`, `MediaButton` and `CardButton` (all render `BaseButton`) | `<(Button\|IconButton\|MediaButton\|CardButton)\b` without `type=`, in files containing `<form` or `onSubmit` | Add `type="submit"` where the button submits the form | 🔇 |
| C46 | utils-shared@0.1.14 | `toPascalCase` removed | `toPascalCase` | Inline it in the app | 🔊 |
| C47 | ui-react@0.1.63, ui-rnative@0.1.66 | Default a11y labels removed (Legend, AmountInput, Donut chart, SegmentedControl arrows); ui-rnative drops `i18next` / `react-i18next` (`ThemeProvider` `locale` unchanged) | `Legend`, `AmountInput`, `DonutChart`, `SegmentedControl`; tests querying those labels | Pass explicit labels. Update tests that query by those labels | ⚖️ |
| C48 | ui-react@0.1.64, ui-rnative@0.1.67 | `Spot`: `icon` required; `appearance` is a palette, plus `fill`; `icon`, `check`, `info`, `bluetooth`, `loader`, `number` appearances and the `number` prop removed ([#892](https://github.com/LedgerHQ/lumen/pull/892)) | `<Spot\b`, `DiscriminatedSpotProps` | `icon`→drop `appearance`; `check`→`appearance="success" icon={CheckmarkCircleFill}`; `info`→`muted` + `InformationFill`; `error`/`warning` + their icons; `loader`→`icon={Spinner}`; `bluetooth`→`icon={BluetoothCircleFill}`; `number`→`<SpotNumber value={n} />` | 🔊 |
| C49 | ui-react-visualization@0.1.20, ui-rnative-visualization@0.1.19 | Charts: `RevealClip` → `RevealAnimationProvider`, with `usePathReveal` and `usePointReveal` (web) / `useRevealFadeProps` (React Native) | `RevealClip` | Rename | 🔊 |
| C50 | ui-react-visualization@0.1.30, ui-rnative-visualization@0.1.31 | Donut charts: the `useDonutSeries` / `prepareDonutSeries` option `minShare` → `groupBelowShare`. A stale key in an untyped options object fails silently | `minShare` | Rename | 🔊 🔇 |
| C51 | ui-rnative-visualization@0.1.32 | `applyMagnetisation` → `applyMagnetization`; the default magnet radius moved to `chartConfig.scrubber.defaultMagnetRadius` | `applyMagnetisation`, `MagnetRadius` | Rename | 🔊 |
| C52 | ui-react@0.1.66 | `Checkbox` renders a native input ([#908](https://github.com/LedgerHQ/lumen/pull/908)): `className` lands on the wrapper `<span>` (`relative inline-flex size-20 …`), `CheckboxProps` no longer extends the Radix root props; `@radix-ui/react-checkbox` is no longer a peer. `data-state` now sits on the hidden `<input>` and the inner box, not the wrapper, so state variants in `className` (`data-[state=checked]:bg-…`) **stop applying** | `<Checkbox\b` with `className`; `data-\[state=` in that `className`; `@radix-ui/react-checkbox` in any `package.json` (all dependency fields, `peerDependenciesMeta`), pnpm `catalog` or knip ignore list | Review plain overrides. There is no supported way to restyle the checked box (a Lumen gap): drop the state variant and accept the default, or ask the Lumen team. Remove the Radix declarations wherever nothing imports it | 👁 🔇 |

## Maintaining this file

Add a row whenever a version plan contains `BREAKING CHANGE`. Ids are
permanent: never renumber, append instead. Add a row only once its release
is published, with the real versions.
