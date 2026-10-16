---
name: component-stories
description: >-
  Use when creating or editing Storybook stories (*.stories.tsx, React or React
  Native) — story layout, controls, and export naming conventions.
paths: '**/*.stories.tsx'
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

The snippet consumers (and AI agents) copy from must be real code. A snippet that prints `icon={() => {}}` is wrong and misleading. Storybook has three source types; pick the one that makes the snippet correct.

#### The three types

- **`dynamic`:** serialises the rendered element tree. It expands values and shared consts (`data={assets}` becomes the array) and works for `args` and `render` stories. It cannot show component or icon references (`icon={Plus}` prints `icon={() => {}}`), functions whose body matters (`renderItem`, `getRowProps`), local helpers, or hooks, state, refs and local logic; those print as `() => {}` or disappear.
- **`code`:** prints the story source exactly as written, so icons, functions, hooks and state all appear. It does not expand shared consts (`data={assets}` stays as written), and it prints the whole story object (`{ render: () => … }`, or `{ args: … }` for `args` stories).
- **`auto` (type unset):** Storybook's default. It behaves like `dynamic` for stories that take `args` and like `code` for `render: () => …` stories. Do not rely on it; set `dynamic` or `code` explicitly.

#### How to pick

Decide per story, then set the type on `meta`:

1. **Plain-data story** (strings, numbers, booleans, objects, arrays, plain JSX) → `dynamic`. Write it with `args` (Controls work) or `render`.
2. **Story that needs real code** → `code`. It passes a component, icon or other function-valued reference (`icon={Plus}`, `leading={Spot}`), a function whose body matters at any depth, a local helper or formatter, or it uses hooks, state, refs or local logic. "At any depth" means: a top-level prop (`renderItem`, `getRowProps`), a function nested in an object arg (`yAxis: { tickLabelFormatter: (v) => … }`, `domain`), a function used as a JSX child (a render prop such as `{({ payload }) => …}`), and a function that only exists in `meta.args` (e.g. `formatter`) and is inherited by the story. All of them print as `() => {}` under `dynamic`. Write it as `render: () => <Button icon={Plus}>…</Button>`, not `args: { icon: Plus }`, so the printed source is the usage.
3. Trivial callbacks (`onClick={() => {}}`, `onChange: () => console.log('…')`, a bare `fn()`) do not count as functions that matter, unless the call is the point of the story (e.g. a Toast demo whose handler is `toast.info(…)`): then the story needs `code`.

Where to set the type: a per-story `type: 'code'` prints its own `parameters` block inside the snippet, and a per-story `type: 'dynamic'` does not. So never put `type: 'code'` on a story:

- At least one story needs real code: `meta` `type: 'code'`, and `type: 'dynamic'` on every plain story (even when that is most of the file).
- Every story is plain data: `meta` `type: 'dynamic'`, no overrides.

`Base` always keeps its `args` so the Controls table in the docs stays live and drives the preview, even when the printed code does not follow the controls. Do not replace `<Controls of={Stories.Base} />` with `<ArgTypes />`, and do not turn `Base` into a `render` that ignores `args`.

- `Base` needs an icon or component reference (`icon: Settings`): this is the one exception to "icon references are never `dynamic`". Keep `Base` `args`-based so the Controls stay live, and print it `dynamic` with a story-local lookup that turns the icon function back into its name, so the snippet is JSX with the real icon, not an `{ args }` object and not `icon={() => {}}`:

  ```tsx
  export const Base: Story = {
    parameters: {
      docs: { source: { type: 'dynamic' } },
      jsx: {
        functionValue: (fn: unknown) => Object.entries(iconMap).find(([, icon]) => icon === fn)?.[0] ?? '() => {}',
      },
    },
    args: { icon: Settings, children: 'Settings' },
  };
  ```

  `iconMap` is the map the story file already uses for the `icon` control (`mapping`), or a one-entry object like `{ Settings }`. For a named local helper (e.g. a `formatter`), `fn.name` is enough: `functionValue: (fn: { name?: string }) => fn.name || '() => {}'`. Use the same lookup in both libs so the snippets match. Nothing is hand-written, so it cannot drift. Use this only for `Base`; every other story that needs an icon is written as `render` JSX under `code`.

- `Base` needs state or handlers (a controlled input): keep `args` and add `render: (args) => { const [value, setValue] = useState(''); return <TextInput {...args} value={value} onChangeText={setValue} /> }`, so the Controls still drive the preview and the snippet is the real source.
- A `code` snippet never prints `meta.args`, so repeat any meta-level arg the story relies on (e.g. `formatter`) in the story's own `args`. A story that inherits a meta-level function arg is a `code` story, not a plain one, even though its own source shows no function.

A story must render the real component the consumer uses. A story-local wrapper component (e.g. `TextInputStory`, `Container`, `HorizontalScrollTable`) shows up by name in the snippet, which is wrong, so do not use one:

- inline the real component and its state in `render`;
- move pure layout (centering, max width) into `meta.decorators` so it stays out of the snippet;
- a reused helper that is only a function (not a component, e.g. `getInitials`) may stay at module level.

```typescript
const meta = {
  component: Component,
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic', // or 'code' per the rule above
      },
    },
  },
} satisfies Meta<typeof Component>;
```

Never hand-write `parameters.docs.source.code`; it drifts from the render. Content a story cannot print (an integration example such as a router `asChild` link, several alternative usages) goes in the component's MDX Implementation tab as a fenced `tsx` block, not in the story.

### Inline sample data

The docs snippet prints the JSX/args as written, so a reference to a module-level constant (`data={assets}`) shows consumers an unresolved identifier. The stories consumers copy from must therefore carry their data inline:

- **Inline the data** in `Base` and in any feature story that teaches an API (e.g. `WithRenderItem`), in its `args` or `render`, so the snippet is copy-pasteable.
- **Showcase and variation stories** (`SizeShowcase`, `ShapeShowcase`, `WithOverflow`, `Disabled`, …) may share a module-level sample const (`assets`) and derive from it (`.slice()`, `.map()`). They illustrate one property, and repeating the data (e.g. ten sizes) buries it.
- Do not leave an unused `args: { data }` next to a `render` that ignores it; the render is the source of truth.

### Controls

Prefer controls inferred from component prop types (`react-docgen-typescript` is configured in Storybook). Do not duplicate `argTypes` for basic props already described in `types.ts` (unions, booleans, strings).

- Add a `Base` story with `args` and a `render` that consumes them — required for Controls to appear in docs.
- Add manual `argTypes` only for overrides docgen cannot express (actions, select mappings, hiding props).

Controls must be set up for every component docs page:

- The MDX has a `<Controls of={Stories.Base} />` block (Overview tab, under "Properties"), except for components with no configurable props.
- The bound story (`Base`) has `args` with the root component's main props, and its `render`, if it has one, takes `(args)` and applies them (e.g. `{...args}`), so changing a control changes the preview. Meta-level `args` alone are not enough if `render` ignores its parameter, and a composition `Base` (Table, Dialog, SideBar) still seeds the root component from `args`.
- State seeded from an arg must follow later changes: `useState(args.page)` only reads the arg once, so add `useEffect(() => { setPage(args.page); }, [args.page]);`. Otherwise changing the control after the first click does nothing.
- Spread the root `args` first and put locally controlled props after it (`<SelectList {...args} value={value} onValueChange={…}>`), so every other control (`disabled`, `searchValue`, …) still reaches the component. Do not pass only one arg (e.g. `items={args.items}`).
- Defaults in `args` equal what the story rendered before, so adding controls does not change the preview.
- Controls expose only the component's real API props (the root, and its subcomponents through `meta.subcomponents`). Never invent playground args (`title`, `showBackButton`, `showCoinCapsule`, …) and never type a story with a custom args type (`StoryObj<{ title: string }>`) to fake controls: the snippet then shows conditionals and placeholders no consumer would write. A composition whose root has no configurable props (e.g. `NavBar`, `Subheader`) keeps its `Controls` block with just the real props (`children`, `className`, …) and a plain `render` composition with literal content, no `args`. Do not leave an empty `args: {}` placeholder either.
- Controls only control the root component (`meta.component`). Subcomponents listed in `meta.subcomponents` get extra tabs in the Controls block that always show "Setup controls"; that is expected and cannot be fixed, so only list real subcomponents. Never list the main `component` again in `subcomponents`: it adds a duplicate tab whose controls are always empty.

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

| Check                                                                                                       | Applies to              | Detect                                                                                                                                                                                                                                                      | Skip                                                              |
| ----------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Base story named `Default`/`Primary`/`Basic` instead of `Base`                                              | all stories             | export name                                                                                                                                                                                                                                                 | —                                                                 |
| Showcase/feature story off-convention                                                                       | all stories             | not `{Property}Showcase` / `With{Feature}` / `ResponsivenessShowcase`                                                                                                                                                                                       | —                                                                 |
| Missing `layout: 'centered'` + `backgrounds: { default: 'light' }`                                          | all stories             | `Base` parameters                                                                                                                                                                                                                                           | —                                                                 |
| `Base` or a feature story (`With{Feature}`) reads its data from a module-level const instead of inlining it | all stories             | `data={<const>}` / `args: { data: <const> }` in `Base` or `With{Feature}`                                                                                                                                                                                   | `{Property}Showcase` and variation stories                        |
| `type: 'dynamic'` applied to a story with function props, hooks, state or handlers                          | all stories             | `docs.source.type: 'dynamic'` (on `meta` or the story) where a story has `use*` hooks, component or icon references (`icon={Settings}`), or function props with a meaningful body (`render*`, `get*`, function children, multi-statement handlers, helpers) | stories with plain-data props only                                |
| Hand-written `docs.source.code`                                                                             | all stories             | a `source.code` string                                                                                                                                                                                                                                      | —                                                                 |
| Story renders a local wrapper component instead of the real one                                             | all stories             | `render` or `args` story whose rendered JSX uses a story-local component (e.g. `<TextInputStory … />`, `<Container>`)                                                                                                                                       | — (inline it; move layout to `meta.decorators`)                   |
| `Base` lost its Controls                                                                                    | all stories             | `Base` without `args`, or `<ArgTypes of={…Base} />` / a `render` that ignores `args` on `Base`                                                                                                                                                              | —                                                                 |
| Controls not set up on a docs page                                                                          | `.stories.tsx` + `.mdx` | `.mdx` without `<Controls of={…Base} />`, or a `Controls` block bound to a story with no `args` or a zero-parameter `render`                                                                                                                                | component with no configurable props                              |
| Story with a nested function, function child or meta-inherited function printed `dynamic` | all stories | `type: 'dynamic'` (own or inherited) on a story whose `args` hold `{ yAxis: { tickLabelFormatter: … } }`, a `{({ payload }) => …}` child, or that relies on a function in `meta.args` | — |
| Control state does not follow the arg | all stories | `useState(args.x)` in a `Base` with no `useEffect` re-sync, or `<Root items={args.items} …>` instead of `{...args}` | — |
| Invented playground args | all stories | `StoryObj<{ … }>` / `StoryObj<Playground…>` custom args types, or args that are not props of `meta.component` (`showBackButton`, `title` on a root with no `title` prop), or an empty `args: {}` | the `Icon` `name` picker (icons are separate generated components, so there is no single component to control) |
| Main component listed in `meta.subcomponents`                                                               | all stories             | `subcomponents: { <Root>, … }` where `<Root>` is also `component`                                                                                                                                                                                           | —                                                                 |
| Per-story `type: 'code'`                                                                                    | all stories             | `parameters.docs.source.type: 'code'` on a story (its snippet then prints the `parameters` block)                                                                                                                                                           | — (set `code` on `meta` and `dynamic` on the plain stories)       |
| `argTypes` duplicated for props docgen already infers                                                       | all stories             | manual `argTypes` for plain unions/booleans/strings                                                                                                                                                                                                         | overrides docgen can't express (actions, select mappings, hiding) |
