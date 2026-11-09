---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#TimelineItem'
    signal: visual # smaller indicator, hugging header, body aligned with the title
    detect:
      - { pattern: '<TimelineItem(?:Header|Body)\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#TimelineItem'
    signal: visual
    detect:
      - { pattern: '<TimelineItem(?:Header|Body)\b[^>]*\bstyle=', expect: review }
pr: 915
---

## Before → after

```tsx before
<TimelineItem>
  <TimelineItemHeader status='success' className='min-h-64'>
    <TimelineItemTitle>Sent</TimelineItemTitle>
  </TimelineItemHeader>
  <TimelineItemBody className='ms-40'>Details</TimelineItemBody>
</TimelineItem>
```

```tsx after
<TimelineItem>
  <TimelineItemHeader status='success'>
    <TimelineItemTitle>Sent</TimelineItemTitle>
  </TimelineItemHeader>
  <TimelineItemBody>Details</TimelineItemBody>
</TimelineItem>
```

```tsx before
// React Native
<TimelineItemBody style={{ marginStart: 40 }}>Details</TimelineItemBody>
```

```tsx after
// React Native
<TimelineItemBody>Details</TimelineItemBody>
```

## Decide

The status indicator shrinks from 24 to 20, the header hugs its content
(`py-8`, top-aligned) instead of a 64 minimum height, and the body sits in
line with the title next to the rail. No API change. Remove `className` or
`style` overrides that rebuilt the old spacing (header height, body
indent); keep the rest. Tests querying `timeline-indicator-*` still find it,
now on the rail.

## Verify

Look at every Timeline on web and mobile: the rail is continuous, the
indicator aligns with the first line of the title, and the body lines up with
the title.
