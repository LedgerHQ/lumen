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

The canvas defaults to **padded** (start-aligned) in `.storybook/preview.tsx`.
Do not set `layout: 'centered'` and do not repeat `layout: 'padded'` on stories.

### Background

Stories that need a guaranteed white canvas can set:

```typescript
export const Base: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    // Component props  },
};
```

### Docs source type

Stories with interactive controls (`args` on `Base`) must use dynamic docs source so the code snippet updates when controls change. Set this on the story `meta`:

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

- Use `type: 'dynamic'` — not `'code'` — when the story exposes `args` / Controls.
- Use `type: 'code'` only for static showcase stories with a fixed, hand-written `parameters.docs.source.code` block.

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
| `type: 'code'` on a story that exposes `args`/Controls | all stories | `docs.source.type` vs presence of `args` | static showcase with hand-written `source.code` |
| `argTypes` duplicated for props docgen already infers | all stories | manual `argTypes` for plain unions/booleans/strings | overrides docgen can't express (actions, select mappings, hiding) |
