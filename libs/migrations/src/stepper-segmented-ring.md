---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#getStepperCalculations.trackDashArray'
    signal: loud
    detect:
      - { pattern: '\btrackDashArray\b' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#getStepperCalculations.trackArcLength'
    signal: loud
    detect:
      - { pattern: '\btrackArcLength\b' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#getStepperCalculations.showMinimalDot'
    signal: loud
    detect:
      - { pattern: '\bshowMinimalDot\b' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#StepperCalculationsInput.arcPercentage'
    signal: loud
    detect:
      - { pattern: '\barcPercentage\b' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-utils-shared#getStepperCalculations.progressDashArray'
    signal: silent # now a segment/gap pattern, offset by dashPatternOffset
    detect:
      - { pattern: '\bgetStepperCalculations\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#Stepper'
    signal: visual # segmented full ring, no dot at step 0, body-2 labels
    detect:
      - { pattern: '<Stepper\b', expect: review }
pr: 885
---

## Before → after

```tsx before
const { r, cx, cy, trackDashArray, trackArcLength, progressDashArray, progressDashOffset, showMinimalDot } =
  getStepperCalculations({ currentStep, totalSteps, size: 48, arcPercentage: 0.75 });

<circle cx={cx} cy={cy} r={r} strokeDasharray={trackDashArray} />
{showMinimalDot && <Dot length={trackArcLength} />}
<circle
  cx={cx}
  cy={cy}
  r={r}
  strokeDasharray={progressDashArray}
  strokeDashoffset={progressDashOffset}
/>

<Stepper currentStep={2} totalSteps={4} />
```

```tsx after
const { r, cx, cy, progressDashArray, progressMaskDashArray, progressDashOffset, dashPatternOffset } =
  getStepperCalculations({ currentStep, totalSteps, size: 48 });

<circle cx={cx} cy={cy} r={r} strokeDasharray={progressDashArray} strokeDashoffset={dashPatternOffset} />
<mask id={maskId}>
  <circle
    cx={cx}
    cy={cy}
    r={r}
    stroke='white'
    strokeDasharray={progressMaskDashArray}
    strokeDashoffset={progressDashOffset}
  />
</mask>
<circle
  cx={cx}
  cy={cy}
  r={r}
  mask={`url(#${maskId})`}
  strokeDasharray={progressDashArray}
  strokeDashoffset={dashPatternOffset}
/>

<Stepper currentStep={2} totalSteps={4} />
```

## Decide

`Stepper` is now a full ring split into one segment per step, drawn from the
top, instead of a 270° arc. Step 0 shows an empty ring instead of a dot, and
the center label uses `body-2` for both numbers. Nothing to change in
`<Stepper>` usage: check that it still fits its layout.

Code that draws its own ring with `getStepperCalculations`:

- Default: replace the custom ring with Lumen's `Stepper`, which now also has
  `size='lg'` and `appearance='success'`.
- If the custom ring must stay: the track and the progress circles both use
  `progressDashArray` with `strokeDashoffset={dashPatternOffset}`. The
  progress circle is revealed by a mask circle using `progressMaskDashArray`
  and `progressDashOffset`; animate the mask's offset. Rotate the SVG by -90°
  (was 135°). Drop `arcPercentage`, `trackDashArray`, `trackArcLength` and the
  `showMinimalDot` branch.

## Verify

Zero hits for the removed fields; every `getStepperCalculations` and
`<Stepper` hit is checked. Typecheck passes. Look at onboarding or multi-step
flows at step 0, a middle step and the last step.
