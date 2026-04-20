---
'@ledgerhq/lumen-ui-rnative': patch
---

feat(DotIcon): introduce new DotIcon component

Adds a new `DotIcon` component that renders a small icon badge with a semantic
background (`success`, `muted`, `error`) pinned at a corner of its children
(e.g. `MediaImage`, `Spot`). Supported sizes: 16, 20, 24.

```tsx
<DotIcon appearance='success' icon={ArrowDown} pin='bottom-end'>
  <MediaImage src='https://example.com/usdc.png' alt='USDC' size={48} />
</DotIcon>
```
