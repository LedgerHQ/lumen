---
name: component-stories
description: >-
  Use when creating or editing Storybook stories (*.stories.tsx, React or React
  Native) — story layout, docs source type, controls, and export naming conventions.
paths: "**/*.stories.tsx"
---

# Storybook Story Guidelines

When creating or modifying Storybook stories, follow these conventions strictly:

## Meta typing

```typescript
const meta = {
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof Component>;
```

Use `satisfies Meta<typeof Component>` (not a `Meta<…>` annotation) and
`StoryObj<typeof Component>` (not `typeof meta` — that makes `args` required
on every story).

## Story Layout Configuration

### Centering and Background

All stories must include these parameters:

```typescript
export const Base: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    // Component props
  },
};
```

- **Layout**: Stories should be centered.
- **Background**: Stories should use white background.

### Docs source type

Set dynamic docs source once on the story `meta`. Every story inherits it, including showcases and feature stories that have no `args`. Storybook extracts the snippet from the `render` function, so `<Source of={…} />` in the MDX stays in sync with the story.

```typescript
const meta = {
  component: Component,
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic',
      },
    },
  },
} satisfies Meta<typeof Component>;
```

- Do not set `docs.source.type` to `'code'`.
- Do not hand-write `parameters.docs.source.code`. A second copy of the JSX drifts from the render.
- Do not override the meta source on an individual story.

### Controls

Prefer controls inferred from component prop types (`react-docgen-typescript` is configured in Storybook). Do not duplicate `argTypes` for basic props already described in `types.ts` (unions, booleans, strings).

- Add a `Base` story with `args` and a `render` that consumes them — required for Controls to appear in docs.
- Add manual `argTypes` only for overrides docgen cannot express (actions, select mappings, hiding props).

## Story Export Names

To maintain consistency across our Storybook documentation, follow these naming rules:

#### 1. Base Story

The default, most basic usage of the component.

- Use: `Base`
- Do not use: `Default`, `Primary`, `Basic`

#### 2. Showcase Stories

Showcase stories demonstrate variations of a single property.

- Use the pattern: `{Property}Showcase`
- Do not use: `States`, `AllStates`, `StatesShowcase`

#### 3. Feature-Specific Stories

Stories highlighting specific features.

- Use: `With{Feature}` (e.g., `WithIcon`, `WithTooltip`)

#### 4. Truncation / Responsiveness Stories

Stories that demonstrate how a component truncates or adapts to constrained space.

- Use: `ResponsivenessShowcase`
- Do not use: `TruncateShowcase`, `Truncation`, `LongLabel`

## Comments

Do not add comments in `*.stories.tsx` — no JSDoc above stories, no `//` or `/* */` explanations. Story intent belongs in MDX or the export name. Keep only a required lint directive (e.g. `eslint-disable-next-line`) when a suppression is unavoidable.

## General Principles

1. **Consistency over creativity**: Follow the patterns even if you think another name might be clearer
2. **Singular property names**: Use `SizeShowcase` not `SizesShowcase`
3. **PascalCase**: All story names use PascalCase (e.g., `WithTooltip`)
4. **Avoid ambiguity**: Don't use generic names like `Example1`, `Test`, `Demo`

## Review checks

Rules verifiable from a diff.

| Check | Applies to | Detect | Skip |
| --- | --- | --- | --- |
| Base story named `Default`/`Primary`/`Basic` instead of `Base` | all stories | export name | — |
| Showcase/feature story off-convention | all stories | not `{Property}Showcase` / `With{Feature}` / `ResponsivenessShowcase` | — |
| Missing `layout: 'centered'` + `backgrounds: { default: 'light' }` | all stories | `Base` parameters | — |
| `type: 'code'` or a hand-written `docs.source.code` | all stories | `docs.source` override on meta or a story | — |
| `argTypes` duplicated for props docgen already infers | all stories | manual `argTypes` for plain unions/booleans/strings | overrides docgen can't express (actions, select mappings, hiding) |
