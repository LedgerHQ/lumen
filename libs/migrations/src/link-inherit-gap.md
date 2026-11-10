---
changes:
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Link.size=inherit'
    signal: visual # a 4px gap now separates the icon, text and external-link icon
    detect:
      - pattern: '<Link\b(?!(?:[^>]|=>)*\bsize=\{?[''"](?:sm|md)[''"])(?:[^>]|=>)*\b(?:icon=|isExternal|asChild)'
        expect: review
pr: 897
---

## Before → after

```tsx before
<Link href={docsUrl} isExternal className='gap-4'>
  Read the docs
</Link>
```

```tsx after
<Link href={docsUrl} isExternal>
  Read the docs
</Link>
```

## Decide

`size="inherit"` is the default, so this applies to every `Link` without `sm`
or `md`. Its icon, text and external-link icon now sit 4px apart, as with
`sm`. Only links with an `icon`, `isExternal` or an `asChild` child with
several elements can change.

- Manual spacing that recreated the gap (`gap-*`, `ml-*`/`mr-*` on the icon or
  text, a space character): remove it.
- No manual spacing: keep the link as is (the default).
- A design that needs the icon flush with the text: ask design before adding a
  `gap-0` override.

## Verify

Each review hit has no duplicated spacing. Look at screens with inline links
that carry an icon or open in a new tab.
