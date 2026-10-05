---
'@ledgerhq/lumen-ui-rnative': patch
---

feat(Spot)!: replace content-based appearances with palette and fill props

React Native only. Same API as `@ledgerhq/lumen-ui-react`.

## New API

- `icon` is optional. `deprecatedNumber` replaces it when set.
- `appearance` selects the palette: `base`, `success`, `error`, `warning`,
  `muted`, or a `decorative-*` color. It defaults to `base`.
- `fill` is `transparent` or `plain`. It defaults to `transparent`.
- `bluetooth` is deprecated.
- `loader` is no longer built into Spot.
- `number` becomes the deprecated `deprecatedNumber` prop.
- `disabled` and `size` are unchanged.

```tsx
<Spot icon={Settings} />
<Spot appearance="success" icon={CheckmarkCircleFill} />
<Spot appearance="success" fill="plain" icon={Settings} />
```

`transparent` keeps the muted transparent circle and colors the icon. `plain`
uses the palette's solid background and paired icon color.

## Migration

```tsx
// Custom icon
<Spot appearance="icon" icon={Settings} />
<Spot icon={Settings} />

// Success
<Spot appearance="check" />
<Spot appearance="success" icon={CheckmarkCircleFill} />

// Error
<Spot appearance="error" />
<Spot appearance="error" icon={DeleteCircleFill} />

// Warning
<Spot appearance="warning" />
<Spot appearance="warning" icon={WarningFill} />

// Information
<Spot appearance="info" />
<Spot appearance="muted" icon={InformationFill} />
```

Pass the icon component, not a rendered element.

## Removed modes

Keep the loading circle by passing `Spinner` as the icon. Spot maps its size
to the spinner (`32 → 12`, `40 → 16`, `48 → 20`, `56 → 24`, `72 → 40`).

```tsx
<Spot appearance="loader" size={48} />
<Spot icon={Spinner} size={48} />
```

Bluetooth is not used by any team, so it is deprecated with no replacement.

Numbers move to the deprecated `deprecatedNumber` prop. It replaces `icon`
when set, and the digit follows `appearance` and `fill`:

```tsx
<Spot appearance="number" number={5} />
<Spot deprecatedNumber={5} />
```

`lx` stays limited to layout adjustments.
