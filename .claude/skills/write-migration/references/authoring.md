# Authoring a migration

## Changes

| Check line                                        | Entry                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| `removed export …#Foo`, and `Bar` replaces it 1:1 | `change: renamed`, `ref: …#Foo`, `to: …#Bar`                                  |
| `removed export …#Foo`, no 1:1 replacement        | `change: removed`; the body says what to use instead                          |
| `removed value …#Button.size=xs`                  | `change: removed`, `surface: value`                                           |
| `required member …#MenuTrigger.render`            | `change: required`, `surface: member`                                         |
| `changed member …#Tag.size (narrowed)`            | `change: changed`, `surface: member`, `signal: loud`                          |
| `required dependency @base-ui/react`              | `change: required`, `surface: dependency`, ref the package                    |
| `changed dependency react-native-reanimated (…)`  | `change: changed`, `surface: dependency`, manifests `detect` on the old range |

- Copy the ref exactly as printed. One entry per platform.
- Use a `*` ref only when every match is part of this update.
- A narrower peer range is usually `silent`
  (`libs/migrations/src/reanimated-4-3-peer.md`). Add `requires` only when the
  upgrade must stop until it is met.

## Signal

- A changed default is `silent` if it alters behavior, `visual` if only
  styling.
- A removed prop that is still a valid DOM prop is `silent`.
- Comment non-obvious ones: `signal: silent # onSelect is still a valid DOM prop`.

## Detect patterns

Add one to `loud` entries too when cheap: it shows the upgrade agent where to
look.

- Match the old usage only: `<MenuItem\b[^>]*\bonSelect=`, not `onSelect`.
- Exports: match the import from the exact entry point.
  `import\s*(type\s*)?\{[^}]*\bApex\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-react/symbols[''"]`
- Single-quoted YAML flow style: `- { pattern: '<Card\b[^>]*\bdisabled\b', expect: review }`.
- `expect: review` when a hit may be fine code, such as any use of a component
  whose behavior changed.
- A changed default: copy the lookahead from
  `libs/migrations/src/button-default-type-button.md`, with `expect: review`.

## Body

Write for an agent applying the change in an unknown codebase. Short sentences,
no history.

**`## Before → after`**: one realistic example covering every entry. Add a
`React Native:` block only where its code differs.

**`## Decide`**: one bullet per call the agent must make, ending with the
default. Cover what `detect` can't find (styles keyed on old `data-*`, a nested
context reset).

```md
- `Charon` is gone. `RecoveryKey` is the design replacement, but a different
  glyph. Default: use it; check the screen still reads right.
```

**`## Verify`**:

```md
Zero `detect` hits, and every `MenuLabel` hit reviewed. Typecheck passes.
Open each menu: it opens from its trigger and items run their action.
```
