---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react/visualization#Scrubber.showBeacons'
    signal: visual # beacons now rest at the end of each line while idle
    detect:
      - { pattern: '<Scrubber\b[^>]*\bshowBeacons\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative/visualization#Scrubber.showBeacons'
    signal: visual
    detect:
      - { pattern: '<Scrubber\b[^>]*\bshowBeacons\b', expect: review }
pr: 924
---

## Before → after

```tsx before
<LineChart series={series}>
  <Scrubber showBeacons />
</LineChart>
```

```tsx after
<LineChart series={series}>
  <Scrubber showBeacons />
</LineChart>
```

## Decide

With `showBeacons`, a dot now sits at the end of each line while the user is
not scrubbing, and none show while the chart is loading. Default: keep it.
Remove `showBeacons` only if the dots must appear while scrubbing alone,
which is no longer possible. Remove any custom end-of-line dot that now
doubles the beacon.

## Verify

Look at each chart using `showBeacons`, idle and while scrubbing: one dot
per line end, no duplicate markers.
