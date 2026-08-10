---
name: code-connect
description: Creates and maintains Figma Code Connect files (`*.figma.tsx`) that map Figma components to code via the parser-based `figma.connect()` API. Use when the user mentions Code Connect, Figma component mapping, design-to-code translation, or asks to create/update .figma.tsx files.
paths: "**/*.figma.tsx"
disable-model-invocation: false
---

# Code Connect (`.figma.tsx`)

Lumen maps Figma components to real code with **parser-based Code Connect**:
`Component.figma.tsx` files co-located with each component, using
`figma.connect()` from `@figma/code-connect`. The Figma CLI parses these files
and publishes the snippets to Figma Dev Mode (CI:
`.github/workflows/figma-code-connect.yml`).

> The whole codebase uses parser-based `.figma.tsx` files (~90 of them across
> `libs/ui-react` and `libs/ui-rnative`). There are **no** `.figma.ts` MCP
> template files here — don't author that style.

## Where files live & config

- Co-locate as `Component.figma.tsx` inside the component folder (e.g.
  `libs/ui-rnative/src/lib/Components/core/Tag/Tag.figma.tsx`).
- Only `libs/ui-react` and `libs/ui-rnative` have a `figma.config.json` (with a
  `codeConnect` block: `include` globs, `label` (e.g. `"React Native"`), and
  `interactiveSetupFigmaFileUrl`). The visualization libs have no Code Connect
  coverage. Read the config to confirm the include path — there is no
  `parser`/`paths`/`importPaths` key.

## File structure

```tsx
import figma from '@figma/code-connect';
import { Placeholder } from '../../symbols';
import { Tag } from './Tag';

figma.connect(Tag, 'https://www.figma.com/design/<fileKey>?node-id=<node-id>', {
  imports: ["import { Tag } from '@ledgerhq/lumen-ui-rnative'"],
  props: {
    label: figma.string('label'),
    appearance: figma.enum('appearance', { base: 'base', gray: 'gray' /* …every value */ }),
    icon: figma.boolean('show-icon', { true: Placeholder, false: undefined }),
  },
  example: (props) => (
    <Tag label={props.label} appearance={props.appearance} icon={props.icon} />
  ),
});
```

- **`figma.connect(Component, url, opts)`** is the usual form. You can also call
  `figma.connect(url, opts)` **without** a component to map another Figma node to
  a different example of the same code component.
- **Multiple `figma.connect()` calls per file are normal** — a compound
  component maps each part in one file (e.g. `Card.figma.tsx` connects `Card`,
  `CardHeader`, … each with its own `example`).
- **`imports`** lists the import statements a consumer needs, written with the
  **published package specifier** (`@ledgerhq/lumen-ui-react`,
  `@ledgerhq/lumen-ui-rnative/symbols`, `@ledgerhq/crypto-icons`) — never relative
  paths.

## Mapping Figma props → code (`props`)

| Figma property | Helper | Notes |
|---|---|---|
| text | `figma.string('name')` | |
| variant / enum | `figma.enum('name', { FigmaValue: codeValue })` | map **every** value — an unmapped value returns `undefined` |
| boolean | `figma.boolean('name', { true: X, false: undefined })` | `undefined` omits the prop entirely |
| nested child | `figma.children('.layer-name')` | pulls a connected child layer into the example |
| swapped instance | `figma.instance('name')` | |

A single Figma property can drive two code props — e.g. map the visible variant
*and* derive `disabled` from it: `disabled: figma.enum('state', { disabled: true })`.

## Best practices

These are verified against the real files — follow them so the published
snippets stay readable and prop-driven.

**1. Keep `example` a flat render of props.** All conditional logic, branching,
and value derivation belongs in `props`, never in `example`.

```tsx
// ❌ BAD — conditional rendering in example
example: (props) => (
  <ListItem>
    {props.leadingContent === 'spot' && <Spot size={props.leadingContentSize} />}
    {props.leadingContent === 'interface-icon' && <Placeholder size={24} />}
  </ListItem>
)

// ✅ GOOD — example is a flat render, all logic is in props
example: (props) => <ListItem>{props.leadingContent}</ListItem>
```

**2. Nest `figma.enum` / `figma.boolean` to encode multi-axis logic.** When a
prop's JSX depends on more than one Figma property, nest the mapping calls
instead of branching in `example`.

```tsx
leadingContent: figma.enum('leading-content', {
  'no-icon': undefined,
  spot: figma.enum('size', {
    md: <Spot size={48} appearance='icon' icon={Settings} />,
    sm: <Spot size={24} appearance='icon' icon={Settings} />,
  }),
  'interface-icon': <Placeholder size={24} />,
}),
```

**3. Use a separate numeric prop when a size drives a third-party component.**
Derive it as its own prop and use it inline rather than branching.

```tsx
tagSize: figma.enum('size', { md: 16, sm: 12 }),
example: (props) => <MediaTag leadingContent={<CryptoIcon size={props.tagSize} />} />,
```

**4. Use a typed placeholder for un-mappable props** rather than inventing a
mapping — e.g. `example: (props: Omit<TagProps, 'icon'> & { icon: any }) => …`
or `size={'<insert-size>' as any}`.

**5. Never invent code props.** Every attribute in `example` must exist on the
component's real props interface. If a Figma property has no code equivalent,
omit it.

## Validate

- The Figma Code Connect CLI parses these files; run it locally to confirm a
  file parses before pushing.
- Publishing happens in CI via `.github/workflows/figma-code-connect.yml`.
- Note: `.figma.@(ts|tsx)` files are in `ignorePatternsForPlanCheck` (`nx.json`),
  so they don't require a version plan.
