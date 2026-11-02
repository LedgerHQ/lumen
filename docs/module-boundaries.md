# Module boundaries

Two tools enforce who may import what. Both run in CI and block on violations.

| Level                        | Tool                               | Config                                       | Command                               |
| ---------------------------- | ---------------------------------- | -------------------------------------------- | ------------------------------------- |
| Between projects (libs/apps) | Nx `@nx/enforce-module-boundaries` | `eslint.config.mjs` + tags in `project.json` | `npx nx run-many --target=lint --all` |
| Inside a lib (folder layers) | dependency-cruiser                 | `.dependency-cruiser.cjs`                    | `npm run check:layers`                |

## Between projects (Nx tags)

Every project carries one `scope:*` and one `type:*` tag.

| Project                    | Tags                             |
| -------------------------- | -------------------------------- |
| `libs/utils-shared`        | `scope:shared`, `type:utils`     |
| `libs/design-core`         | `scope:shared`, `type:tokens`    |
| `libs/lint-plugin`         | `scope:shared`, `type:tooling`   |
| `libs/ui-react`            | `scope:react`, `type:ui`         |
| `libs/ui-rnative`          | `scope:react-native`, `type:ui`  |
| `internals/*`              | `scope:internal`, `type:tooling` |
| `apps/app-sandbox-react`   | `scope:react`                    |
| `apps/app-sandbox-rnative` | `scope:react-native`             |

Allowed imports:

- `utils-shared` imports no other Lumen lib.
- `design-core` imports `utils-shared` only.
- `ui-react` and `ui-rnative` import `utils-shared` and `design-core` only, and never each other.
- Nothing under `libs/` or `apps/` imports `internals/*`.

Visualization lives inside `ui-react` / `ui-rnative` as `Components/visualization`
(ADR 0002), so the web-vs-native isolation above also covers charts.

## Inside `ui-react` and `ui-rnative` (dependency-cruiser)

Layers under `src/lib/Components`. A layer may import the ones below it:

```
visualization, core
        ↓
     internal
        ↓
primitives, animations (RN only), symbols
        ↓
  utils (src/utils on web, src/lib/utils on RN) — imports no component
```

Also enforced: `visualization` is imported by nothing outside itself, no
circular imports, no web ↔ native imports, and `design-core` / `utils-shared`
never import a UI lib (`utils-shared` never imports `design-core`).

Tests, stories, Code Connect and MDX files are not checked.

## Exceptions

`internal` may import `core/Spinner` and `core/InteractiveIcon`: they are
self-contained leaves that `BaseButton` and `BaseInput` render directly. The
exception lives in the `internal-not-to-core` rule in `.dependency-cruiser.cjs`.
