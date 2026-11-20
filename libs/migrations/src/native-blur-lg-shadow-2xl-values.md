---
changes:
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#coreTokens.blur.lg'
    signal: visual # 64 → 16: a BlurView fed theme.blur.lg blurs far less
    detect:
      - { pattern: '\bblur\.lg\b', expect: review }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#coreTokens.shadows.2xl'
    signal: visual # the shadow color goes from 20% to 25% black, as on the web
    detect:
      - { pattern: 'boxShadow:\s*[''"]2xl[''"]', expect: review }
      - { pattern: 'shadows\[[''"]2xl[''"]\]', expect: review }
---

## Before → after

```tsx before
<BlurView blurAmount={theme.blur.lg} blurType='light' style={styles.blur} />
```

```tsx after
// An intensity from 0 to 100, not the pixel radius the `blur` tokens hold.
const BLUR_INTENSITY = 64;

<BlurView blurAmount={BLUR_INTENSITY} blurType='light' style={styles.blur} />;
```

```tsx before
const styles = useStyleSheet((t) => ({ card: { boxShadow: t.shadows['2xl'] } }), []);
<Box lx={{ boxShadow: '2xl' }} />;
```

```tsx after
const styles = useStyleSheet((t) => ({ card: { boxShadow: t.shadows['2xl'] } }), []);
<Box lx={{ boxShadow: '2xl' }} />;
```

## Decide

Two React Native theme values now match the design tokens, as they already did
on the web.

- `theme.blur.lg` is 16, the token's pixel radius, instead of 64. A
  `blur.lg` passed to `BlurView`'s `blurAmount`, an intensity from 0 to 100,
  now blurs much less: to keep the look, replace it with your own constant
  `64`. A `blur.lg` used as a radius needs no change.
- The `2xl` shadow is 25% black instead of 20%. Nothing to change in code;
  check the screens that use it.

## Verify

Screens with a `BlurView` look as before, and `2xl` shadows render a little
darker. Each `detect` hit is reviewed.
