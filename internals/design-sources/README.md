# design-sources

The committed DTCG token files every output is built from, and the models
that read them and the icons. Dev-only, never published. How it fits the
pipeline: [docs/design-pipeline.md](../../docs/design-pipeline.md).

```text
tokens/
├─ figma/*.tokens.json   written by sync-figma, never edited by hand
└─ code/*.tokens.json    hand-written: values Figma variables can't hold
src/tokens/              load, validate, Terrazzo conformance, model
src/icons/model.ts       load and validate libs/design-core/symbols/icons/
```

A file is `<order>.<collection>[.<mode>].tokens.json` (`2.theme.dark`).
Brands, themes and breakpoints come from these names, so a new Figma mode
builds without a code change.

Validated by `npx nx run design-build:check`, as in CI. Tests:
`npx nx run design-sources:test`.

## Rules

- **DTCG 2025.10:** colors are sRGB objects with a `hex`, dimensions and
  durations objects with a unit. Terrazzo's parser checks the format; our
  checks add what the outputs need (`hex`, `ms`), references, cycles and modes.
- **Errors name the file and token path** and fail the build. Naming issues
  and icon issues (non-kebab-case names, hard-coded colors) are warnings.
- **It writes nothing and imports no other stage** (Nx tag `stage:sources`).
