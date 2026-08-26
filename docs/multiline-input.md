# Multiline support for TextInput and AddressInput

Adds `multiline` / `minLines` / `maxLines` / `scrollbarWidth` to the internal `BaseInput` on
both web and React Native, exposes them through `TextInput` and `AddressInput`, and narrows
`SearchInput` to single-line only.

Ships in two phases: a behaviour-preserving refactor of `BaseInput` on both platforms,
reviewable on its own, then the multiline feature itself.

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

## Phase 1 — Refactor `BaseInput` on both platforms (shipped)

Merged in [#849](https://github.com/LedgerHQ/lumen/pull/849) (`c233d951`).

Split the leaves out of each platform's `BaseInput.tsx`, keeping `BaseInput` as
the orchestrator that owns the container, prefix/suffix, clear button, footer,
and value tracking.

Shared on both platforms:

- `BaseInputLabel.tsx` — the floating label (CSS peers on web, Reanimated on RN).
- `BaseInputHelperText.tsx` — hint / error / success copy under the field.
- `BaseInputCounter.tsx` — the `count/maxCount` footer.
- `useBaseInputValue/` — controlled/uncontrolled value mirror and clear. Clear
  is a value change, then `onClear`, in both modes: web dispatches a native
  `input` event (`onChange`); RN calls `onChangeText('')`. RN previously skipped
  `onChangeText` on uncontrolled clear — that is an intentional alignment with
  web. Both attach the consumer `ref` with `useMergedRef`. Each hook folder has
  its own tests.

Web only:

- `BaseInputSingleLine.tsx` — the `<input>` plus `baseInputStyles`. RN keeps a
  single `TextInput` in `BaseInput` (no element split to mirror).

The leaves are only consumed by `BaseInput` itself, so they stay sibling imports
and each folder barrel keeps exporting just `BaseInput` and its types. Nothing
leaves the `internal/` layer.

Acceptance: existing `BaseInput` / `TextInput` / `SearchInput` / `AddressInput`
suites stay green (web `BaseInput.test.tsx` untouched). New hook tests cover
uncontrolled typing, controlled ignore-internal-tracking, and clear.

Patch version plans are required for both `@ledgerhq/lumen-ui-react` and
`@ledgerhq/lumen-ui-rnative` — the refactor touches production source under
`libs/*/src/`, which is not on the exemption list in `nx.json`.

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

Sibling to the `BaseInputSingleLine.tsx` created in Phase 1: renders a fragment with the visible
`<textarea>` plus a hidden measurement clone, `whitespace-pre-wrap break-words resize-none` on the
visible field, and owns the autosize hook. `break-words` is required for `AddressInput`'s unbroken
hex strings. `BaseInput` branches on `multiline` and passes a shared prop bag (id, ref, disabled,
readOnly, placeholder, aria attributes, className, onChange).

Set `rows={minLines}` on the visible textarea for a correct first paint before the layout effect
measures.

Scrollbar appearance follows the same mapping as
[Dialog.tsx](../libs/ui-react/src/lib/Components/core/Dialog/Dialog.tsx) line 242 —
`scrollbarWidth === 'auto' ? 'scrollbar-custom' : 'scrollbar-none'`.

#### 2. Autosize hook

New `internal/BaseInput/useAutosizeTextarea/`, co-located like
[useAutoWidthInput](../libs/ui-react/src/lib/Components/core/AmountInput/useAutoWidthInput/useAutoWidthInput.ts).
Called only from `BaseInputMultiline`, so it needs no `multiline` guard.

Reference implementation:
[MUI TextareaAutosize v9.3.1](https://github.com/mui/material-ui/tree/v9.3.1/packages/mui-material/src/TextareaAutosize).
Re-implement the algorithm in-house (MIT) — do not add `@mui/material` as a dependency.

The hook never measures the visible textarea. All measurement runs on an off-screen shadow clone:

- **Shadow textarea.** `BaseInputMultiline` returns a fragment: the real `<textarea>` plus a
  measurement clone with `aria-hidden`, `readOnly`, `tabIndex={-1}` and
  `visibility:hidden; position:absolute; top:0; left:0; height:0; overflow:hidden; transform:translateZ(0)`.
  `overflow:hidden` keeps the scrollbar out of the measurement; `translateZ(0)` isolates its
  computed values. Vertical padding is zeroed inline so `scrollHeight` is pure content height — this
  removes the "subtract computed vertical padding" step entirely.
- **Single-row probe replaces `line-height`.** Copy the live width and value into the shadow, read
  `scrollHeight` → `innerHeight`. Set the shadow's value to `'x'`, read `scrollHeight` →
  `singleRowHeight`. Clamp with `minLines * singleRowHeight` / `maxLines * singleRowHeight`. This
  drops a `getComputedStyle().lineHeight` read and covers labeled (`body-2`) vs unlabeled (`body-1`)
  for free, without trusting a `normal` or fractional line-height.
- **Box sizing.** Add `padding + border` back only for `border-box`; Tailwind preflight makes that
  always true for us, but keep the branch faithful to MUI.
- **Trailing newline.** Append a space when the value ends in `\n` — some fonts report a different
  `scrollHeight` for an empty last line.
- **Overflow with tolerance.** `fits = Math.abs(outerHeight - innerHeight) <= 1`, then
  `style.overflow = fits ? 'hidden' : ''`. The 1px epsilon absorbs subpixel rounding. This controls
  whether the field scrolls; `scrollbarWidth` controls how the bar looks.

##### Computation and performance guards

- **Height memo.** A `heightRef` holds the last applied height; `style.height` is written only when
  the clamped value actually changes. Typing within a line costs zero DOM writes.
- **ResizeObserver loop guard.** A naive `new ResizeObserver(syncHeight)` observes the element it
  resizes, which throws "ResizeObserver loop completed with undelivered notifications". Adopt MUI's
  dance: gate on a `didHeightChange()` pre-check, then `unobserve` → `cancelAnimationFrame` →
  `syncHeight()` → re-`observe` inside a `requestAnimationFrame`.
- **Width-0 bail-out.** Skip the sync when computed width is `0px` so a field inside a closed
  Dialog, Drawer or inactive tab panel does not get a garbage height written.
- **Debounced window resize** alongside the observer, using
  [debounce](../libs/utils-shared/src/lib/debounce/debounce.ts) from `@ledgerhq/lumen-utils-shared`.
  Two API differences from MUI: our debounce needs an explicit `wait` (MUI defaults to 166ms) and
  cleanup is `.cancel()`, not MUI's `.clear()`.
- **`useLayoutEffect` on every render** to sync height (see "Adapting to our `BaseInput`" below).
- **Hooks we do not need.** `calculateTextareaStyles` depends only on primitives (`minLines`,
  `maxLines`, `placeholder`), so plain `useCallback` gives a stable identity and MUI's
  `useEventCallback` is unnecessary. Keep plain `useLayoutEffect` to match `useAutoWidthInput`; an
  isomorphic wrapper is out of scope unless SSR becomes a target.
- **Cost.** Two forced reflows per sync, both on the off-screen shadow, none on the live field —
  versus write/read/write on the live element in the naive version, each invalidating the
  container's layout.

##### Adapting to our `BaseInput`

- **The shadow must not carry `peer`.**
  [BaseInputLabel.tsx](../libs/ui-react/src/lib/Components/internal/BaseInput/BaseInputLabel.tsx)
  floats the label off `peer-placeholder-shown:`, and Tailwind compiles that to a general-sibling
  rule. A second `.peer` sibling that renders empty before the first measurement would momentarily
  satisfy `:placeholder-shown` and drop the label. Give the shadow the typography and horizontal
  padding classes it needs to measure faithfully, minus `peer`.
- **Probe `'x'`, not the placeholder.** MUI seeds the shadow with `value || placeholder || 'x'` so
  the placeholder always fits. For `AddressInput`, a long hex placeholder plus `break-words` would
  make an empty field several lines tall; our Figma governs the empty height through `minLines`
  (343x120 unlabeled is 4 lines), so fall back straight to `'x'`.
- **`useBaseInputValue` makes us effectively controlled.** It mirrors the value and re-renders on
  every keystroke, so the unconditional every-render layout effect covers typing — do not call
  `syncHeight` imperatively from `onChange`. A programmatic clear re-measures through the same
  path.
- **Caret pinning.** Port MUI's `handleChange` behaviour: when the last character is `\n` and the
  caret sits at the end, `setSelectionRange` to the end so the field does not scroll-jump. Compose
  around `handleChange` from `useBaseInputValue`.

#### 3. Style changes in `BaseInput.tsx`

- `containerVariants`: add a `multiline` variant — `h-48` to `min-h-48`, `items-center` to
  `items-start`, plus `py-12` unlabeled / `py-6` labeled. The `gap-8` is unchanged: Figma
  uses the same gap on both variants.
- `labelVariants` in `BaseInputLabel`: the unfloated position uses
  `peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2`, which centers
  on a tall box. Add a `multiline` variant pinning it to `top-6`. The textarea then needs `pt-16`
  rather than the single-line `pt-12`.
- Clear button and `suffix` render inside a `self-start pt-6` wrapper when multiline.
- `handleClear` in `useBaseInputValue` grabs the setter off
  `window.HTMLInputElement.prototype` — must branch to `HTMLTextAreaElement.prototype`
  when multiline, or React will not see the controlled update. `inputRef` becomes
  `useRef<HTMLInputElement | HTMLTextAreaElement>`.
- The container's `onPointerDown` early-return `target.closest('input, button, a')`
  needs `textarea` added.

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
  unchanged. `scrollHeight` is 0 in jsdom — stub it with a value-aware getter on
  `HTMLTextAreaElement.prototype` returning `lineCount(value) * LINE_HEIGHT`, so the `'x'` probe
  naturally yields one row. Assert `getByRole('textbox')` resolves to exactly one element: the
  shadow is `aria-hidden` and stays out of the a11y tree.
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

MUI's shadow textarea trick does not port to RN: `onContentSizeChange` is measured natively with no
JS reflow, so it is already the equivalent. Transferable parts only:

- **Skip unchanged height writes.** Keep the last clamped height in a ref and skip the state write
  when it is unchanged — avoids a render per keystroke while the clamped value stays the same.
- **Derive line height from theme tokens.** Use `theme.typographies.body1.lineHeight` /
  `body2.lineHeight` rather than measuring, since there is no shadow element to probe with `'x'`.

#### 7. Style changes in RN `BaseInput`

- `useStyles` container: `alignItems: 'center'` to `'flex-start'`, and explicit
  `paddingVertical` (`s12` unlabeled, `s6` labeled). `gap` stays `s8`, mirroring web.
- Input style: `RuntimeConstants.isIOS && { lineHeight: 0 }` collapses multiline text on
  iOS — must become the real token line height in the multiline branch.
- Set `textAlignVertical: 'top'` explicitly (Android defaults to `center`).
- `suffixContainer` needs top alignment plus an `s6` top offset when multiline.
- Floating label `top` interpolation in `BaseInputLabel`: the floated end (`s6`) already
  matches the design, but the unfocused `s14` assumes a 48px centered box and needs a
  multiline-specific resting value.

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

- Phase 1: `@ledgerhq/lumen-ui-react` and `@ledgerhq/lumen-ui-rnative` —
  `refactor(BaseInput): split the control, label, helper text and counter into their own files and extract the value/clear logic into useBaseInputValue`.
- Phase 2: `@ledgerhq/lumen-ui-react` and `@ledgerhq/lumen-ui-rnative` —
  `feat(TextInput): add multiline, minLines and maxLines support`.

## Checklist

Phase 1:

- [x] Extract label, helper text, counter, and `useBaseInputValue` on both platforms; web also extracts `BaseInputSingleLine`
- [x] Hook tests on web and RN; existing input suites stay green
- [x] Version plans for `@ledgerhq/lumen-ui-react` and `@ledgerhq/lumen-ui-rnative`

Phase 2 — web:

- [ ] Add the four props to `BaseInputProps` and swap in the union-parameterised element props
- [ ] `useAutosizeTextarea` hook (shadow textarea, `'x'` single-row probe, performance guards)
- [ ] `BaseInputMultiline.tsx` plus the `BaseInput` style changes
- [ ] Caret pinning on trailing newline in multiline `onChange`
- [ ] Wrappers: `TextInput`, `AddressInput`, `SearchInput` narrowing
- [ ] Tests, stories, MDX, Code Connect

Phase 2 — React Native:

- [ ] Types plus `useAutosizeTextInput` hook (skip unchanged height writes)
- [ ] `BaseInput` style changes
- [ ] Wrappers, tests, stories, MDX, Code Connect

Phase 2 — release:

- [ ] Version plans for `@ledgerhq/lumen-ui-react` and `@ledgerhq/lumen-ui-rnative`
