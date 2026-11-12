# design-sources

Dev-only Nx project holding the **design sources**: the committed DTCG token
files and icon SVGs every output is built from, and the in-memory models that
read them.
Never published — see `## Internals` in [AGENTS.md](../../AGENTS.md).

```text
tokens/
├─ figma/*.tokens.json   written by sync-figma, never edited by hand
└─ code/*.tokens.json    hand-written: values Figma variables can't hold
icons/
├─ *.svg                 written by sync-figma, never edited by hand
└─ icons.json            the export manifest (Figma node ids, last modified)
src/icons/model.ts       load and validate the icons
src/tokens/
├─ load.ts       read and flatten the files
├─ validate.ts   types, references, cycles, modes, naming
├─ standard.ts   DTCG conformance through Terrazzo's parser
└─ model.ts      select modes, resolve references, merge trees
```

A file name is `<order>.<collection>[.<mode>].tokens.json`: `2.theme.dark` is
the `dark` mode of the `theme` collection. Brands, themes and breakpoints are
read from these names, so a new mode in Figma is built without a code change.

## Commands

- `npx nx run design-sources:validate` — our rules, then the DTCG standard
  (Terrazzo), as CI does.
- `npx nx run design-sources:test`

## Rules

- **This project writes nothing and imports no other stage.** `sync-figma`
  writes `tokens/figma/`; `design-build` reads the model. The import rules are
  Nx tags (`stage:sources`).
- **Validation errors name the file and the token path** and fail the build.
  Naming issues (`Zcash-0%`, `Pressed`) are warnings until designers confirm the
  naming rules; outputs normalize names in one place (`design-build`).
- **Icons:** a file that isn't an SVG or has no `viewBox` fails; a
  non-kebab-case name (`auto-Lock`) or a hard-coded color (`#D5D5D5` in the
  chevrons) is a warning for designers.
- **The files are DTCG 2025.10**: colors are sRGB objects (with a `hex`
  fallback), dimensions and durations objects with a unit. `validate` parses
  them with [Terrazzo](https://terrazzo.app), the DTCG reference implementation,
  and fails on any warning, so "standard" is checked, not assumed.
