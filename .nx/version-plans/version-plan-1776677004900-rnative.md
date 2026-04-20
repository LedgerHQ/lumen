---
'@ledgerhq/lumen-ui-rnative': patch
---

feat(DotSymbol): add `icon` variant and restrict sizes

The `DotSymbol` component now supports an `icon` variant in addition to the existing `image` variant. Use the new `type="icon"` prop together with `icon` and `appearance` to render an icon on a semantic background (`success`, `muted`, `error`).

```tsx
<DotSymbol
  type='icon'
  appearance='success'
  icon={ArrowDown}
  pin='bottom-end'
>
  <MediaImage src='https://example.com/usdc.png' alt='USDC' size={48} />
</DotSymbol>
```

BREAKING_CHANGE(DotSymbol): `DotSymbolSize` no longer accepts `8 | 10 | 12`. Allowed values are now `16 | 20 | 24`. 
