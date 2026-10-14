---
name: ds-discovery
description: >-
  Use when asked how other design systems handle a component, prop, token or
  pattern; to name a component, prop or token; to research best practices
  (composition, when to split, a11y, responsiveness, motion) before building;
  or for a design-system discovery or benchmark report. Compares Coinbase CDS,
  Adobe Spectrum, Astryx, Material, Primer, MetaMask DS and Base UI, anchors
  the recommendation in Lumen's code, and outputs a shareable HTML report.
---

# Design-system discovery

Answers "how do other design systems handle X?" for Lumen designers and
engineers, and ends with a shareable HTML report.

- Who to consult and how: [references/sources.md](references/sources.md)
- What to compare per question type: [references/dimensions.md](references/dimensions.md)
- Report skeleton: [assets/report-template.html](assets/report-template.html)

## 1. Frame

- **Type**: new component, naming, pattern or token. A request can mix them:
  pick the main one and borrow dimensions from the others.
- **Subject and synonyms**: other systems often use another name (Tabs,
  SegmentedControl, UnderlineNav). Search for all of them.
- **Platforms**: web, React Native, or both.

Ask one question only if the subject is ambiguous.

## 2. Lumen baseline

- What exists today: search `libs/ui-react` and `libs/ui-rnative` for the
  component or related ones (names, props, parts), and `libs/design-core` for
  tokens.
- Constraints the answer must respect: the `component-architecture` skill (API,
  composition, prop naming) and the `component-styling` skill (tokens).
- If the user shared a Figma link, read the Lumen design with the Figma MCP (see
  the `figma-to-code` skill).

## 3. Research

Consult **every** entry in `references/sources.md`, so reports stay comparable.
Include WAI-ARIA APG whenever behaviour or accessibility is in scope.

When you can run subagents, run them in parallel, one per design system. Systems
likely to lack the subject (often CDS and MetaMask for anything beyond core
components) can share one agent. Give each agent the subject and synonyms, the
dimensions, its entries from `sources.md`, a cap of about 8 fetches, and this
return shape (under 250 words per system). Without subagents, go through them
in turn with the same shape.

```
DS: <name> (<version or docs date read>)
Coverage: yes | partial | not covered (their name: <name>)
Maturity: stable | beta | pre-1.0 | preview | draft spec
Findings: one line per dimension: <dimension>: <finding> [<source URL>]
Notable: up to 2 things Lumen should copy or avoid, with why
```

- Read docs for guidance, and source code for exact prop names, types and defaults.
- Every finding carries a URL. Write "not covered" rather than guessing.
- Summarize in your own words and link to the source. Quote a short phrase at most.

## 4. Synthesize

- **Consensus vs divergence**: what most systems agree on, where they differ and why.
  Weigh each system by its maturity: two preview components are a weak consensus.
- **Recommendation for Lumen**, split by audience:
  - *Design*: when to use, anatomy, states, behaviour, content.
  - *Engineering*: an API sketch that follows the `component-architecture`
    skill, composition, web/RN parity, and the a11y implementation (Base UI part,
    APG pattern).
- Flag any recommendation that contradicts an existing Lumen choice, and why.
- **Open questions**, one list for design and one for engineering.

## 5. Report

Copy `assets/report-template.html` whole (title, styles and all) and replace
only what sits between the `REPORT CONTENT` markers; then delete the example
rows and the `<!-- -->` guidance. The `<title>` is the subject in 2–4 words
(e.g. "Tabs discovery"). Write it to `tmp/ds-discovery/<YYYY-MM-DD>-<slug>.html`
(gitignored), never elsewhere in the repo tree.

- **With the Artifact tool (Claude Code)**: publish that file. It stays private
  until the user shares it. Reply with the link and the TL;DR.
- **Otherwise (Cursor and others)**: wrap the page in a full HTML document (the
  template's header comment shows how), and reply with its path and the TL;DR.

Never commit a report: the repo is public.
