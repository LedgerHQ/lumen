---
changes:
  - change: required
    surface: dependency
    ref: '@base-ui/react'
    signal: silent # the JS bundles it; only the Popover type declarations import it
    detect:
      - { pattern: '"@ledgerhq/lumen-ui-react":', in: manifests, expect: review }
pr: 587
---

## Before → after

```json before
"dependencies": {
  "@ledgerhq/lumen-ui-react": "0.1.14"
}
```

```json after
"dependencies": {
  "@base-ui/react": "^1.3.0",
  "@ledgerhq/lumen-ui-react": "0.1.15"
}
```

## Decide

`@ledgerhq/lumen-ui-react` now has `@base-ui/react` as a peer dependency. Its
type declarations for `Popover` import `@base-ui/react/popover`; without the
package they fail to resolve, which `skipLibCheck` hides. Add it to every
package that depends on `@ledgerhq/lumen-ui-react`, with the range the installed
version declares in its `peerDependencies`. Skip a package that already has a
matching version.

## Verify

`@base-ui/react` resolves from each package using `@ledgerhq/lumen-ui-react`.
Install shows no missing peer warning for it.
