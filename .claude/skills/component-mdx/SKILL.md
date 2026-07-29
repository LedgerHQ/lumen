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

See the `storybook-stories` skill for story setup (`type: 'dynamic'`, `Base` + `args`, naming conventions).

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

# Table Documentation Guidelines

When writing tables in documentation, follow this structure:

## Table Container

```jsx
<div className='my-24 overflow-hidden rounded-lg'>
  <table className='w-full'>{/* table content */}</table>
</div>
```

## Table Structure

- **Container**: Use `my-24 overflow-hidden rounded-lg` for spacing and rounded corners
- **Table**: Use `w-full` for full width
- **Header**: Use `border-b border-muted bg-muted` for the thead row
- **Header cells**: Use `p-12 text-left text-on-accent body-2` for th elements
- **Body**: Use `bg-canvas` for tbody
- **Body rows**: Use `border-b border-muted` for all rows except the last one
- **Body cells**:
  - First column (utilities/classes): Use `text-accent p-12`
  - Other columns: Use `p-12 text-muted`

## Example Structure

```jsx
<div className='my-24 overflow-hidden rounded-lg'>
  <table className='w-full'>
    <thead>
      <tr className='border-b border-muted bg-muted'>
        <th className='p-12 text-left text-on-accent body-2'>
          Tailwind class (utilities)
        </th>
        <th className='p-12 text-left text-on-accent body-2'>styles</th>
      </tr>
    </thead>
    <tbody className='bg-canvas'>
      <tr className='border-b border-muted'>
        <td className='text-accent p-12'>h-1</td>
        <td className='p-12 text-muted'>height: var(--size-1); /* 1px */</td>
      </tr>
      {/* More rows... */}
      <tr>
        <td className='text-accent p-12'>h-256</td>
        <td className='p-12 text-muted'>
          height: var(--size-256); /* 256px */
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## Key Points

- Always use design system typography classes (`body-3`, `body-4`)
- Use design system colors (`text-accent`, `text-muted`, `text-on-accent`, `bg-muted`, `bg-canvas`)
- Use design system spacing (`p-12`, `my-24`)
- Use design system borders (`border-muted`)
- Last row should not have `border-b` class
- First column typically shows utility classes and uses `text-accent`
- Other columns show values/descriptions and use `text-muted`
