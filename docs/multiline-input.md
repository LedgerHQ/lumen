# Multiline support for TextInput and AddressInput

Adds `multiline` / `minLines` / `maxLines` / `scrollbarWidth` to the internal `BaseInput` on
both web and React Native, exposes them through `TextInput` and `AddressInput`, and narrows
`SearchInput` to single-line only.

Ships in two phases: a behaviour-preserving refactor of the web `BaseInput`, reviewable on its
own, then the feature itself on both platforms.

## Public API (identical on both platforms)

Four new props on `BaseInput`, inherited by `TextInput` and `AddressInput`:

- `multiline?: boolean` — renders a `<textarea>` (web) / RN `TextInput multiline`. Default `false`.
- `minLines?: number` — minimum height in lines. Default `1`.
- `maxLines?: number` — growth ceiling; past it the field scrolls internally. Default unbounded.
- `scrollbarWidth?: 'none' | 'auto'` — visibility of the scroll affordance once `maxLines` is hit. Default `'auto'`.

The field auto-grows from `minLines` to `maxLines`; setting them equal gives a fixed box. No user
resizing — web forces `resize-none`.

`scrollbarWidth` reuses [Dialog](../libs/ui-react/src/lib/Components/core/Dialog/types.ts)'s
existing vocabulary, but defaults to `'auto'` rather than Dialog's `'none'`, since the design
shows a visible scrollbar. All four props are ignored when `multiline` is false — state that in
their JSDoc.

## Figma measurements

[address-input 7887:67](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=7887-67)
and [text-input 2248:3905](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=2248-3905)
both carry a `type = one-line | multi-line` variant.

- AddressInput multi-line: 343x120 — unlabeled, `py-12`, `body-1` (16/24).
- TextInput multi-line: 343x88 — labeled, `py-6`, label `body-4` (10/16) over `body-2` (14/20).
- The `showScrollBar` boolean in Figma draws a 10px transparent track with a 6px
  `background-muted-strong` full-radius thumb. That is exactly the existing `scrollbar-custom`
  utility from `createScrollbarPlugin` in
  [createCustomPlugin.ts](../libs/design-core/src/lib/utils/createCustomPlugin.ts) — no new
  styling needed, and nothing to model as a "show" flag since visibility follows the `maxLines`
  clamp.

Height per line, both collapsing to the existing 48px at one line:

- unlabeled: `48 + (lines - 1) * 24`
- labeled: `48 + (lines - 1) * 20`

A consumer's explicit pixel `height` applies to the outer wrapper only, since the container moves
from `h-48` to `min-h-48`.

## Phase 1 — Refactor the web `BaseInput`

No behaviour change, no API change, web only. RN has a single element and no split to mirror, so
it is untouched here.

[BaseInput.tsx](../libs/ui-react/src/lib/Components/internal/BaseInput/BaseInput.tsx) is 342 lines
holding four concerns. Split the leaves out, keeping `BaseInput` as the orchestrator that owns the
container, floating label, prefix/suffix, clear button, footer and value tracking:

- `BaseInputSingleLine.tsx` — the `<input>` element (lines 245-260) plus `baseInputStyles` (lines 44-51).
- `BaseInputHelperText.tsx` — the sub-component at lines 312-333.
- `BaseInputCounter.tsx` — the sub-component at lines 335-341.

The three leaves are only consumed by `BaseInput` itself, so they stay sibling imports and the
folder barrel keeps exporting just `BaseInput` and its types. Nothing leaves the `internal/` layer,
so there is no public surface change.

Acceptance:
[BaseInput.test.tsx](../libs/ui-react/src/lib/Components/internal/BaseInput/BaseInput.test.tsx)
passes **untouched**, and the `TextInput` / `SearchInput` / `AddressInput` suites are green.

A patch version plan for `@ledgerhq/lumen-ui-react` is still required — the refactor touches
production source under `libs/*/src/`, which is not on the exemption list in `nx.json`.

## Phase 2 — Multiline

### Typing

`BaseInputProps` stays a single flat type. It today ends with
`& Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix'>`
([types.ts](../libs/ui-react/src/lib/Components/internal/BaseInput/types.ts) line 65). Add the new
props, and swap that one intersection for a union-parameterised equivalent:

```ts
export type BaseInputProps = {
  /* … existing shared props unchanged … */
  multiline?: boolean;
  minLines?: number;
  maxLines?: number;
  scrollbarWidth?: 'none' | 'auto';
} & Omit<
  InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
  'size' | 'prefix'
> & {
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
};
```

Two things to know when reading that:

- `InputHTMLAttributes<T>` extends `HTMLAttributes<T>` → `DOMAttributes<T>`, which parameterises
  every event handler by `T`. Passing the union types `onChange`, `onFocus`, `onBlur`, `onKeyDown`
  and the rest against both elements at once. `size` and `prefix` still need omitting.
- `ref` is declared explicitly because it is not part of `InputHTMLAttributes` —
  `ComponentPropsWithRef` picks it up from `ClassAttributes` via `DetailedHTMLProps`. It would need
  restating regardless of the base type, since the inherited version is `Ref<HTMLInputElement>` only.

### Web — `libs/ui-react`

#### 1. `BaseInputMultiline.tsx`

Sibling to the `BaseInputSingleLine.tsx` created in Phase 1: renders the `<textarea>` with
`whitespace-pre-wrap break-words resize-none` and owns the autosize hook. `break-words` is required
for `AddressInput`'s unbroken hex strings. `BaseInput` branches on `multiline` and passes a shared
prop bag (id, ref, disabled, readOnly, placeholder, aria attributes, className, onChange).

Scrollbar appearance follows the same mapping as
[Dialog.tsx](../libs/ui-react/src/lib/Components/core/Dialog/Dialog.tsx) line 242 —
`scrollbarWidth === 'auto' ? 'scrollbar-custom' : 'scrollbar-none'`.

#### 2. Autosize hook

New `internal/BaseInput/useAutosizeTextarea/`, co-located like
[useAutoWidthInput](../libs/ui-react/src/lib/Components/core/AmountInput/useAutoWidthInput/useAutoWidthInput.ts).
Called only from `BaseInputMultiline`, so it needs no `multiline` guard:

- `useLayoutEffect` on value change: reset `height = 'auto'`, read `scrollHeight`, subtract computed
  vertical padding, clamp to `[minLines * lineHeight, maxLines * lineHeight]`, write back
  `height = clamped + padding`.
- Toggle `overflowY` between `hidden` and `auto` depending on whether the clamp hit `maxLines`. This
  controls whether the field scrolls; `scrollbarWidth` controls how the bar looks.
- `ResizeObserver` on the element so width changes re-measure.
- Read `lineHeight` from `getComputedStyle`, so it covers both the labeled (`body-2`) and unlabeled
  (`body-1`) cases.

#### 3. Style changes in `BaseInput.tsx`

- `containerVariants`: add a `multiline` variant — `h-48` to `min-h-48`, `items-center` to
  `items-start`, `gap-8` to `gap-12`, plus `py-12` unlabeled / `py-6` labeled.
- `labelVariants`: the unfloated position uses
  `peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2` (line 55), which centers
  on a tall box. Add a `multiline` variant pinning it to `top-6`. The textarea then needs `pt-16`
  rather than the single-line `pt-12`.
- Clear button and `suffix` render inside a `self-start pt-6` wrapper when multiline.
- `handleClear` (line 196) grabs the setter off `window.HTMLInputElement.prototype` — must branch to
  `HTMLTextAreaElement.prototype` when multiline, or React will not see the controlled update.
- The container's `onPointerDown` early-return `target.closest('input, button, a')` (line 222) needs
  `textarea` added.
- `inputRef` becomes `useRef<HTMLInputElement | HTMLTextAreaElement>`.

#### 4. Wrappers

- [TextInput/types.ts](../libs/ui-react/src/lib/Components/core/TextInput/types.ts): drop the
  trailing `& ComponentPropsWithRef<'input'>` (it would re-narrow `ref` and the event handlers back
  to `HTMLInputElement`). `TextInput.tsx` needs no change.
- [AddressInput.tsx](../libs/ui-react/src/lib/Components/core/AddressInput/AddressInput.tsx): the
  `To:` prefix span needs `self-start` when multiline. The QR suffix needs no special casing — the
  existing clear-XOR-suffix rule already produces the design's result.
- [SearchInput/types.ts](../libs/ui-react/src/lib/Components/core/SearchInput/types.ts): add
  `'multiline' | 'minLines' | 'maxLines' | 'scrollbarWidth'` to the existing `Omit` and drop the
  trailing `& ComponentPropsWithRef<'input'>`.

#### 5. Web tests and docs

- Extend
  [BaseInput.test.tsx](../libs/ui-react/src/lib/Components/internal/BaseInput/BaseInput.test.tsx):
  renders a `textarea` when multiline, respects the `minLines` floor, stops growing at `maxLines`
  and becomes scrollable, clear button still works on a textarea, error/disabled/readOnly/counter
  unchanged. `scrollHeight` is 0 in jsdom, so stub it per-element with `Object.defineProperty`.
- Add multiline stories to `TextInput.stories.tsx` and `AddressInput.stories.tsx`, plus an MDX
  section in each.
- Add to the `props` map in both `.figma.tsx` files:

```ts
multiline: figma.enum('type', { 'multi-line': true }),
```

### React Native — `libs/ui-rnative`

RN's `TextInput` already accepts `multiline` and
[BaseInput](../libs/ui-rnative/src/lib/Components/internal/BaseInput/BaseInput.tsx) spreads
`{...props}` onto it, so it type-checks today but renders wrong.

#### 6. Types and autosize hook

- `BaseInputProps` currently spreads `Omit<TextInputProps, 'style'>`, which already carries
  `multiline` — so add `minLines` / `maxLines` / `scrollbarWidth`, and omit `numberOfLines` (on
  Android it fixes a multiline height and would compete with the autosize hook).
- RN keeps the platform-native scroll indicator; there is no themeable equivalent of
  `scrollbar-custom`. Keep the prop for API parity and map it to visibility only:
  `scrollbarWidth === 'none'` sets `showsVerticalScrollIndicator={false}`, `'auto'` leaves the
  native indicator on. Note the divergence in the RN MDX.
- New `internal/BaseInput/useAutosizeTextInput/`: track content height from `onContentSizeChange`,
  clamp to `[minLines * lineHeight, maxLines * lineHeight]` using
  `theme.typographies.body1.lineHeight` / `body2.lineHeight`, and flip `scrollEnabled` on once the
  max is reached.

#### 7. Style changes in RN `BaseInput`

- `useStyles` container (line 252): `alignItems: 'center'` to `'flex-start'`, `gap` from `s8` to
  `s12`, and explicit `paddingVertical` (`s12` unlabeled, `s6` labeled).
- Input style: `RuntimeConstants.isIOS && { lineHeight: 0 }` (line 297) collapses multiline text on
  iOS — must become the real token line height in the multiline branch.
- Set `textAlignVertical: 'top'` explicitly (Android defaults to `center`).
- `suffixContainer` needs top alignment plus an `s6` top offset when multiline.
- Floating label `top` interpolation (line 386): the floated end (`s6`) already matches the design,
  but the unfocused `s14` assumes a 48px centered box and needs a multiline-specific resting value.

#### 8. RN wrappers, tests, docs

- `TextInput/types.ts` and `AddressInput/types.ts` pick up the new props automatically;
  `SearchInput/types.ts` explicitly omits `multiline | minLines | maxLines | scrollbarWidth`.
- `AddressInput` prefix `Text` needs top alignment when multiline.
- Extend
  [TextInput.test.tsx](../libs/ui-rnative/src/lib/Components/core/TextInput/TextInput.test.tsx)
  (`ThemeProvider` + `ledgerLiveThemes.dark` wrapper, per the existing file), add stories plus MDX
  sections, and mirror the `multiline` Code Connect mapping.

### Release plans

One file per package (per the `release-plan` skill), all `patch`:

- Phase 1: `@ledgerhq/lumen-ui-react` —
  `refactor(BaseInput): split single-line input, helper text and counter into their own files`.
- Phase 2: `@ledgerhq/lumen-ui-react` and `@ledgerhq/lumen-ui-rnative` —
  `feat(TextInput): add multiline, minLines and maxLines support`.

## Checklist

Phase 1:

- [ ] Extract `BaseInputSingleLine.tsx`, `BaseInputHelperText.tsx` and `BaseInputCounter.tsx`; `BaseInput.test.tsx` passes untouched
- [ ] Version plan for `@ledgerhq/lumen-ui-react`

Phase 2 — web:

- [ ] Add the four props to `BaseInputProps` and swap in the union-parameterised element props
- [ ] `useAutosizeTextarea` hook
- [ ] `BaseInputMultiline.tsx` plus the `BaseInput` style changes
- [ ] Wrappers: `TextInput`, `AddressInput`, `SearchInput` narrowing
- [ ] Tests, stories, MDX, Code Connect

Phase 2 — React Native:

- [ ] Types plus `useAutosizeTextInput` hook
- [ ] `BaseInput` style changes
- [ ] Wrappers, tests, stories, MDX, Code Connect

Phase 2 — release:

- [ ] Version plans for `@ledgerhq/lumen-ui-react` and `@ledgerhq/lumen-ui-rnative`
