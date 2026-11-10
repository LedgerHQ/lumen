---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Tag.label'
    signal: visual # long labels end in an ellipsis instead of wrapping
    detect:
      - { pattern: '<Tag\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Tag.label'
    signal: visual # the label Text now has numberOfLines={1}
    detect:
      - { pattern: '<Tag\b', expect: review }
pr: 594
---

## Before → after

```tsx before
<div className='w-80'>
  <Tag label='A label longer than its container' />
</div>
```

```tsx after
<div className='w-80'>
  <Tag label='A label longer than its container' />
</div>
```

## Decide

`Tag` keeps its label on one line and cuts it with an ellipsis when it
overflows, on web and React Native. Most tags hold a short label: leave them
as is (the default). Act only where a long or dynamic label must stay fully
readable: give the container more room, or shorten the label.

## Verify

Look at screens where tags hold long or translated labels, at narrow widths,
on web and native. Each truncated label is acceptable or has been given room.
