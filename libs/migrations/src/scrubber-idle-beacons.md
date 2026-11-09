---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react/visualization#Scrubber.showBeacons'
    signal: visual # beacons now rest at the end of each line while idle
    detect:
      - { pattern: '<Scrubber\b(?:[^>]|=>)*?\bshowBeacons\b', expect: review }
      - { pattern: '<Scrubber\b[^>]*\{\.\.\.', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative/visualization#Scrubber.showBeacons'
    signal: visual
    detect:
      - { pattern: '<Scrubber\b(?:[^>]|=>)*?\bshowBeacons\b', expect: review }
      - { pattern: '<Scrubber\b[^>]*\{\.\.\.', expect: review }
pr: 924
---

## Before → after

```tsx before
<LineChart series={series} enableScrubbing>
  <Scrubber {...scrubberProps} showBeacons />
</LineChart>
```

```tsx after
<LineChart series={series} enableScrubbing>
  <Scrubber {...scrubberProps} showBeacons />
</LineChart>
```

## Decide

With `showBeacons`, a dot now sits at the end of each line while the user is
not scrubbing. Beacons are now hidden while `LineChart` has `loading`, even
while scrubbing. Default: keep `showBeacons`. There is no scrub-only option:
removing it drops beacons entirely, including while scrubbing, so ask the
owner if idle dots are unwanted. Remove any custom end-of-line dot that now
doubles the beacon.

## Verify

Look at each chart using `showBeacons`, idle and while scrubbing: one dot
per line end, no duplicate markers. While idle, `<Scrubber showBeacons>` now
renders the `scrubber` and `scrubber-beacon-<id>` test IDs instead of nothing:
update tests that assert their absence.
