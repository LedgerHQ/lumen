---
name: component-mdx
description: >-
  Use when writing or editing Storybook MDX docs (*.mdx) — the two-tab
  Overview/Implementation structure, story-backed `<Source>` examples, and doc
  table guidelines.
paths: "**/*.mdx"
---

# Documentation Guidelines

## MDX Documentation Structure

Component documentation MUST use the two-tab structure with Overview and Implementation tabs.

### Overview Tab

**Intent**: Provide designers and developers with a comprehensive understanding of the component's purpose, behavior, and usage patterns.

**Include**:

- Introduction and Figma link
- Anatomy with visual breakdown
- Properties (appearance, size, states, etc.)
- Responsive behavior
- Accessibility considerations
- Interactive examples

### Implementation Tab

**Intent**: Give developers practical, copy-paste ready code examples and integration patterns.

**Include**:

- Installation instructions (`<SetupNote />` where applicable)
- Code examples via `<Source of={ComponentStories.StoryName} />` — not hand-written fenced code blocks when a matching story exists
- Advanced patterns (icons, routing, custom styling) — prefer `<Source>` linked to the relevant story; use fenced blocks only when no story covers the snippet (e.g. one-off prop combinations)

**Use `<Source>` for story-backed examples:**

```tsx
import { Meta, Canvas, Controls, Source } from '@storybook/addon-docs/blocks';
import * as ComponentStories from './Component.stories';

<Tab label='Implementation'>
  <SetupNote />

  ### Basic Usage

  <Source of={ComponentStories.Base} />

  ### With icon

  <Source of={ComponentStories.WithIcon} />
</Tab>
```

- Pair each `<Source>` with a real story export — the snippet stays in sync with Storybook (`type: 'dynamic'` on stories keeps it accurate when controls change).
- Do not duplicate story code as manual ` ```tsx ` blocks in the Implementation tab.

See the `component-stories` skill for story setup (`type: 'dynamic'`, `Base` + `args`, naming conventions).

### Required Structure

```tsx
import { Meta, Canvas, Controls, Source } from '@storybook/addon-docs/blocks';
import * as ComponentStories from './Component.stories';
import { CustomTabs, Tab, SetupNote } from '../../../../.storybook/components';

<Meta title='Core/Component' of={ComponentStories} />

# Component Name

<CustomTabs>
  <Tab label='Overview'>
    ## Introduction
    <Canvas of={ComponentStories.Base} />
    <Controls of={ComponentStories.Base} />
  </Tab>

  <Tab label='Implementation'>
    <SetupNote />
    ### Basic Usage
    <Source of={ComponentStories.Base} />
    ### Advanced Patterns
    <Source of={ComponentStories.WithFeature} />
  </Tab>
</CustomTabs>
```

**Example**: See `Button.mdx` in ui-react or ui-rnative for reference implementation.

# Tables in docs

When a doc needs a table, use the copy-paste markup template in
`references/tables.md` — it carries the container/header/body classnames and the
design-system typography, colour, spacing and border tokens to use.

## Review checks

Rules verifiable from a diff.

| Check | Applies to | Detect | Skip |
| --- | --- | --- | --- |
| Doc doesn't use the two-tab Overview / Implementation structure | `.mdx` | missing `<Tab label='Overview'>` / `'Implementation'` | visualization libs (no `.mdx`) |
| Implementation example is a hand-written ` ```tsx ` block where a story exists | `.mdx` | fenced code duplicating a story instead of `<Source of={…} />` | snippets no story covers |
| Doc references a removed/renamed prop or a stale default | `.mdx` | prop names vs current `types.ts` | — |
| Table uses raw Tailwind palette instead of tokens | `.mdx` | `text-gray-`, arbitrary sizes in table markup | — |
