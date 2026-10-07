---
'@ledgerhq/lumen-ui-react': patch
---

feat(Spot): replace content-based appearances with palette and fill props

## New API

- `icon` is required.
- `appearance` selects the palette: `base`, `success`, `error`, `warning`,
  `muted`, or a `decorative-*` color. It defaults to `base`.
- `fill` is `transparent` or `plain`. It defaults to `transparent`.
- `disabled` and `size` are unchanged.

Removed appearances:

- `appearance="bluetooth"`: pass `BluetoothCircleFill` as `icon`.
- `appearance="loader"`: pass `Spinner` as `icon`.
- `appearance="number"` and `number`: use `SpotNumber`.

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

Pass the icon component, not a rendered element:

```tsx
<Spot icon={Settings} />
```

## Removed modes

Keep the loading circle by passing `Spinner` as the icon. Spot maps its size
to the spinner (`32 → 12`, `40 → 16`, `48 → 20`, `56 → 24`, `72 → 40`).

```tsx
<Spot appearance="loader" size={48} />
<Spot icon={Spinner} size={48} />
```

Spot passes the palette text color to the icon, so a `Spinner` icon follows `appearance`.

Pass the Bluetooth icon:

```tsx
<Spot appearance="bluetooth" />
<Spot icon={BluetoothCircleFill} />
```

The `number` prop is dropped. Digits are now a `SpotNumber` component, and the digit follows `appearance` and `fill`:

```tsx
<Spot appearance="number" number={5} />
<SpotNumber value={5} />
```

Update dynamic appearance maps and wrappers as well as literal JSX. `className`
should remain limited to layout adjustments.
