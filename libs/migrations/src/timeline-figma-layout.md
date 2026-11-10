---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#TimelineItem'
    signal: visual # smaller indicator, hugging header, body aligned with the title
    detect:
      - { pattern: '<TimelineItem(?:Header|Body)?\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#TimelineItem'
    signal: visual
    detect:
      - { pattern: '<TimelineItem(?:Header|Body)?\b[^>]*\b(?:style|lx)=', expect: review }
pr: 915
---

## Before → after

```tsx before
<TimelineItem status='success'>
  <TimelineItemHeader className='min-h-48'>
    <TimelineItemLeading>
      <TimelineItemTitle>Sent</TimelineItemTitle>
    </TimelineItemLeading>
  </TimelineItemHeader>
  <TimelineItemBody className='ms-48'>Details</TimelineItemBody>
</TimelineItem>
```

```tsx after
<TimelineItem status='success'>
  <TimelineItemHeader>
    <TimelineItemLeading>
      <TimelineItemTitle>Sent</TimelineItemTitle>
    </TimelineItemLeading>
  </TimelineItemHeader>
  <TimelineItemBody>Details</TimelineItemBody>
</TimelineItem>
```

```tsx before
// React Native
<TimelineItemBody lx={{ marginStart: 's48' }}>Details</TimelineItemBody>
```

```tsx after
// React Native
<TimelineItemBody>Details</TimelineItemBody>
```

## Decide

The status indicator shrinks from 24 to 20, the header hugs its content
(8px vertical padding, top-aligned) instead of a 64 minimum height, and the
body sits in line with the title. No API change.

The rail no longer spans the whole `TimelineItem`: the header draws it, and
the body draws its own connector column. Body `className`, `style` or `lx`
now apply to the row holding that column, so a start margin or padding moves
the line off the rail. The body also lost its top padding. The header rail
bleeds 8px into the header padding, so overriding that padding breaks it.
Padding or gap on `TimelineItem`, or children other than Header and Body, also
break the line: move that content into `TimelineItemBody`. Remove overrides
that rebuilt the old spacing (header height, body indent); keep the rest.

Tests querying `timeline-indicator-*` still find it. On React Native,
`timeline-line-out` now always renders (opacity 0 on the last item), so
update tests expecting it to be absent.

## Verify

Look at every Timeline on web and mobile: the rail is continuous, the
indicator aligns with the first line of the title, and the body lines up with
the title.
