# Authoring a migration

Judgment rules on top of the format in `libs/migrations/README.md`.

- [Changes](#changes)
- [Signal](#signal)
- [Detect patterns](#detect-patterns)
- [Body](#body)

## Changes

From a `check:breaking-changes` line to an entry:

| Check line                                        | Entry                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| `removed export …#Foo`, and `Bar` replaces it 1:1 | `change: renamed`, `ref: …#Foo`, `to: …#Bar`                                  |
| `removed export …#Foo`, no 1:1 replacement        | `change: removed`; the body says what to use instead                          |
| `removed value …#Button.size=xs`                  | `change: removed`, `surface: value`                                           |
| `required member …#MenuTrigger.render`            | `change: required`, `surface: member`                                         |
| `changed member …#Tag.size (narrowed)`            | `change: changed`, `surface: member`, `signal: loud`                          |
| `required dependency @base-ui/react`              | `change: required`, `surface: dependency`, ref the package                    |
| `changed dependency react-native-reanimated (…)`  | `change: changed`, `surface: dependency`, manifests `detect` on the old range |

- Keep the ref exactly as the check prints it. One entry per ref, one per
  platform: a prop removed on web and native is two entries.
- `*` covers a family in one ref, such as `#themes.*.bg.error` for a token
  across themes. Use it only when every match is part of this update.
- A narrower peer range is usually a `silent` change (package managers only
  warn), as in `libs/migrations/src/reanimated-4-3-peer.md`. Add `requires`
  only when the upgrade must stop until the consumer meets that range.

## Signal

- `loud`: the consumer's build or typecheck fails. Removed exports and props,
  new required props, narrowed unions.
- `silent`: it still compiles but works differently. A changed default that
  alters behavior, a removed prop that is still a valid DOM prop, a new
  runtime error.
- `visual`: same code, different rendering. A changed default that only
  alters styling, token values, spacing, sizes.

Add a YAML comment after `signal` when the reason isn't obvious:
`signal: silent # onSelect is still a valid DOM prop`.

## Detect patterns

Required unless `loud`. Add one to a `loud` entry too when it is cheap: it
tells the upgrade agent where to look.

- A regex over a whole source file. Match the **old** usage only, never the
  new one: `<MenuItem\b[^>]*\bonSelect=`, not `onSelect`.
- Exports: match the import from the exact entry point.
  `import\s*(type\s*)?\{[^}]*\bApex\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-react/symbols[''"]`
- Write it in single-quoted YAML; a literal `'` is `''`. Use flow style:
  `- { pattern: '<Card\b[^>]*\bdisabled\b', expect: review }`.
- `expect: review` when the pattern can't tell broken code from fine code
  (any use of a component whose behavior changed). A human reads each hit.
- A changed default: match the usages that don't pass the prop, with
  `expect: review`. Copy the lookahead from
  `libs/migrations/src/button-default-type-button.md`.
- `in: manifests` for a dependency, matched on `package.json` files:
  `{ pattern: '"@radix-ui/react-dropdown-menu"', in: manifests }`.
- `validate` requires each source pattern to match a `before` block and,
  unless `review`, no `after` block. Write the examples so they prove it.

## Body

Three sections, in this order, none empty. Write for an agent applying the
change in an unknown codebase. Say what changed and how to update, nothing the
version plan already says. Short sentences, no history.

**`## Before → after`**: fenced blocks whose info string ends in `before` or
`after` (`tsx before`). One realistic example covering every entry beats one
per prop. Add a `React Native:` block only where its code differs from web.

**`## Decide`**: one bullet per call the agent must make, each ending with the
default. Cover what `detect` can't find (styles keyed on old `data-*`, a
nested context reset), and whatever an unused dependency left behind.

```md
- `Charon` is gone. `RecoveryKey` is the design replacement, but a different
  glyph. Default: use it; check the screen still reads right.
```

**`## Verify`**: how the agent knows it's done.

```md
Zero `detect` hits, and every `MenuLabel` hit reviewed. Typecheck passes.
Open each menu: it opens from its trigger and items run their action.
```
