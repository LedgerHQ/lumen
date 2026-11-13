---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#StepperCalculationsOutput.trackDashArray'
    signal: loud
    detect:
      - { pattern: '\btrackDashArray\b' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#StepperCalculationsOutput.trackArcLength'
    signal: loud
    detect:
      - { pattern: '\btrackArcLength\b' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#StepperCalculationsOutput.showMinimalDot'
    signal: loud
    detect:
      - { pattern: '\bshowMinimalDot\b' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#StepperCalculationsInput.arcPercentage'
    signal: loud # only in object literals; a prebuilt input object still compiles
    detect:
      - { pattern: '\barcPercentage\b' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#StepperCalculationsOutput.progressDashArray'
    signal: silent # now a segment/gap pattern, offset by dashPatternOffset
    detect:
      - { pattern: '\bgetStepperCalculations\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#StepperCalculationsOutput.progressDashOffset'
    signal: silent # now full-circumference based, meant for the mask circle
    detect:
      - { pattern: '\bprogressDashOffset\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#Stepper'
    signal: visual # segmented full ring, no dot at step 0, regular body-2 labels
    detect:
      - { pattern: '<Stepper\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#Stepper'
    signal: visual # segmented full ring, no dot at step 0, regular body2 labels
    detect:
      - { pattern: '<Stepper\b', expect: review }
pr: 885
---

## Before → after

```tsx before
const { r, cx, cy, trackDashArray, trackArcLength, progressDashArray, progressDashOffset, showMinimalDot } =
  getStepperCalculations({ currentStep, totalSteps, size: 48, arcPercentage: 0.75 });

<svg width={48} height={48} viewBox='0 0 48 48' className='rotate-135'>
  <circle cx={cx} cy={cy} r={r} strokeDasharray={trackDashArray} />
  {showMinimalDot && <Dot length={trackArcLength} />}
  <circle
    cx={cx}
    cy={cy}
    r={r}
    strokeDasharray={progressDashArray}
    strokeDashoffset={progressDashOffset}
  />
</svg>

<Stepper currentStep={2} totalSteps={4} />
```

```tsx after
const maskId = useId();
const { r, cx, cy, progressDashArray, progressMaskDashArray, progressDashOffset, dashPatternOffset } =
  getStepperCalculations({ currentStep, totalSteps, size: 48 });

<svg width={48} height={48} viewBox='0 0 48 48' className='-rotate-90'>
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill='none'
    strokeWidth={4}
    strokeDasharray={progressDashArray}
    strokeDashoffset={dashPatternOffset}
  />
  <mask id={maskId} maskUnits='userSpaceOnUse' x={0} y={0} width={48} height={48}>
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill='none'
      stroke='white'
      strokeWidth={4}
      strokeDasharray={progressMaskDashArray}
      strokeDashoffset={progressDashOffset}
    />
  </mask>
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill='none'
    strokeWidth={4}
    mask={`url(#${maskId})`}
    strokeDasharray={progressDashArray}
    strokeDashoffset={dashPatternOffset}
  />
</svg>

<Stepper currentStep={2} totalSteps={4} />
```

## Decide

`Stepper` (web and React Native) is now a full ring split into one segment
per step, drawn from the top, instead of a 270° arc. Step 0 shows an empty
ring instead of a dot. The center text, custom `label` included, is regular
`body-2` (was semi-bold, with the current step at `body-1`), and uses the
disabled text color when disabled. Nothing to change in `<Stepper>` usage:
check that it still fits its layout.

Code that draws its own ring with `getStepperCalculations`:

- Default: replace the custom ring with Lumen's `Stepper`, which now also has
  `size='lg'` and `appearance='success'`.
- If the custom ring must stay: the track and the progress circles both use
  `progressDashArray` with `strokeDashoffset={dashPatternOffset}`.
  `progressDashOffset` no longer goes on the progress circle: it is now based
  on the full circumference and belongs on a mask circle using
  `progressMaskDashArray`. Animate the mask's offset. On React Native, wrap
  the mask in `<Defs><Mask>` from `react-native-svg`. Rotate the SVG by -90°
  (was 135°). Drop `arcPercentage`, `trackDashArray`, `trackArcLength` and the
  `showMinimalDot` branch.

## Verify

Zero hits for the removed fields; every `getStepperCalculations`,
`progressDashOffset` and `<Stepper` hit is checked. Typecheck passes. Look at
onboarding or multi-step flows at step 0, a middle step, the last step and
disabled.
