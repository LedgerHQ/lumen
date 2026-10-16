# Reference design systems

Consult every entry for every discovery. Each entry says why it's on the list,
where its docs and source live, and the fastest way in. Context7 lookups follow
the `context7` skill.

To add a system: copy an entry, check its docs URL and source paths, and add its
name to the skill's `description`.

## Coinbase CDS

- **Why**: crypto product UI, with separate web and React Native packages that
  share an API. It's the closest peer to Lumen's two platforms.
- **Docs**: https://cds.coinbase.com. Component pages are at
  `/components/<category>/<Name>` (e.g. `/components/navigation/Tabs`).
- **Source**: `coinbase/cds`, in `packages/web/src/<category>/` and
  `packages/mobile/src/<category>/`.
- **Access**: Context7 `/coinbase/cds` (source) or `/websites/cds_coinbase`
  (docs). For exact props, `gh api repos/coinbase/cds/contents/packages/web/src/<category>`.
- **Platforms**: web, React Native (plus native iOS and Android packages).

## Adobe Spectrum (React Spectrum S2 + React Aria)

- **Why**: the deepest accessibility, i18n and interaction work. S2 pages
  include usage guidelines.
- **Docs**: https://react-spectrum.adobe.com/<Name> (S2) and
  https://react-aria.adobe.com/<Name> (behaviour and hooks). There is plain text
  at https://react-spectrum.adobe.com/llms.txt, with one `<Name>.md` per component.
- **Source**: `adobe/react-spectrum`, in
  `packages/@react-spectrum/s2/src/<Name>.tsx` and
  `packages/react-aria-components/src/`.
- **Access**: the llms.txt markdown first, then Context7 `/adobe/react-spectrum`
  or `/websites/react-aria_adobe`.
- **Platforms**: web.

## Astryx (Meta)

- **Why**: 150+ components behind more than 13,000 Meta apps; a strong tokens and
  theming model (10 themes); docs written to be read by agents.
- **Docs**: https://astryx.atmeta.com, with an index at
  https://astryx.atmeta.com/llms.txt.
- **Source**: `facebook/astryx`. Components are in `packages/core/src/<Name>/`,
  design rules in `docs/design/`, specs in `docs/specs/`.
- **Access**: Context7 `/facebook/astryx`. The official CLI
  (`npx @astryxdesign/cli component <Name>`) gives props and examples, but it
  runs an npm package: use it only if the user agrees.
- **Platforms**: web (React + StyleX).

## Material (Google Material Design 3 + MUI)

- **Why**: M3 for UX, motion and responsive-layout guidance; MUI for the most
  widely used React API and its prop-naming conventions. The two can disagree:
  attribute each finding to M3 or to MUI.
- **Docs**:
  - M3: https://m3.material.io/components/<name>/overview, with `guidelines`,
    `specs` and `accessibility` tabs.
  - MUI: https://mui.com/material-ui/react-<name>/, with the API at
    https://mui.com/material-ui/api/<name>/ and plain text at
    https://mui.com/material-ui/llms.txt.
- **Source**: `mui/material-ui`, in `packages/mui-material/src/<Name>/`.
- **Access**: m3.material.io renders client-side, so use Context7
  `/websites/m3_material_io`. For MUI, use Context7 `/websites/mui_material-ui`
  or llms.txt.
- **Platforms**: web (M3 also covers Android and Flutter).

## Primer (GitHub)

- **Why**: clear naming and content guidelines, an explicit accessibility section
  per component, mature product UI.
- **Docs**: https://primer.style/product/components/<kebab-name>/, with
  guidelines, accessibility and React API tabs.
- **Source**: `primer/react`, in `packages/react/src/<Name>/`.
- **Access**: Context7 `/websites/primer_style` (guidelines) and `/primer/react`
  (API). There's no llms.txt.
- **Platforms**: web.

## MetaMask Design System

- **Why**: a crypto wallet with React and React Native packages that share
  tokens and a Tailwind preset. It's the architecture closest to Lumen.
- **Docs**: Storybook at https://metamask.github.io/metamask-design-system/.
- **Source**: `MetaMask/metamask-design-system`, in
  `packages/design-system-react/src/components/<Name>/` and
  `packages/design-system-react-native/src/components/<Name>/`. Tokens are in
  `packages/design-tokens/`.
- **Access**: it isn't on Context7, and its Storybook renders client-side. Read
  the source and READMEs with `gh api repos/MetaMask/metamask-design-system/contents/<path>`.
- **Platforms**: web, React Native.
- **Note**: a small community. Treat it as a peer, not an authority.

## Base UI

- **Why**: Lumen already builds on `@base-ui/react`. It shows the behaviour,
  accessibility wiring and part-based composition, without visual opinions.
- **Docs**: https://base-ui.com/react/components/<kebab-name>, with plain text at
  https://base-ui.com/llms.txt.
- **Source**: `mui/base-ui`, in `packages/react/src/<kebab-name>/`.
- **Access**: Context7 `/mui/base-ui`. Pick the version Lumen uses, from
  `libs/ui-react/package.json`.
- **Platforms**: web.

## WAI-ARIA Authoring Practices (APG)

- **Why**: the reference for ARIA roles, states and keyboard models. It settles
  accessibility disagreements between systems.
- **Docs**: https://www.w3.org/WAI/ARIA/apg/patterns/<pattern>/
- **Access**: Context7 `/w3c/wai-aria-practices`.
- **Use**: whenever behaviour or accessibility is in scope. It isn't a design
  system: give it its own row, and don't count it towards consensus.
