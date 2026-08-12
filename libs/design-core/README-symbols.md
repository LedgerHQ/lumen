# Symbol Generation

Automated system to convert SVG files from Figma into React/React Native icon components.

## Quick Start

### 1. Download SVGs from Figma

SVGs are automatically downloaded from Figma using the design tokens pipeline:

```bash
npx nx download-svgs @ledgerhq/lumen-design-core
```

### 2. Generate Components

```bash
# React
npx nx generate-symbols-react @ledgerhq/lumen-design-core

# React Native
npx nx generate-symbols-react-native @ledgerhq/lumen-design-core
```

### 3. Use Icons (Tree-Shakeable)

```tsx
// ✅ GOOD - Only imports what you need (tree-shakeable)
import { ArrowUp, Home } from '@ledgerhq/lumen-ui-react/symbols';

<Home size={24} className="text-base" />;
```

## Tree-Shaking Best Practices

**✅ DO - Named imports (tree-shakeable):**

```tsx
import { Home, ArrowUp, Settings } from '@ledgerhq/lumen-ui-react';
```

**❌ DON'T - Namespace imports (bundles everything):**

```tsx
import * as Icons from '@ledgerhq/lumen-ui-react'; // Imports ALL icons!
```

**❌ DON'T - Default imports:**

```tsx
import Icons from '@ledgerhq/lumen-ui-react'; // Not supported
```

## Styling with Tailwind

Icons use `currentColor` by default, so you can style them using Tailwind's `text-` utilities:

```tsx
// Using Design system colors
<Home className="text-base" />
<ArrowUp className="text-on-accent" />
<Settings className="text-on-interactive" />


// Interactive states
<Home className="text-base hover:text-base-hover active:text-base-pressed" />


// Combined with container styling
<div className="flex items-center gap-2 text-base">
  <Home />
  <span>All icons inherit base color</span>
  <ArrowUp />
</div>
```

## API

| Prop        | Type               | Default  | Description                      |
| ----------- | ------------------ | -------- | -------------------------------- |
| `size`      | `number \| string` | `"24px"` | Icon size in pixels or CSS units |
| `className` | `string`           | -        | CSS class (React only)           |

## Figma Integration

- Icons are sourced from Figma design files
- SVGs are automatically optimized during download
- Naming convention follows Figma component names (converted to kebab-case)
- Colors are automatically converted to `currentColor` for theming

## Troubleshooting

**Icons not showing?** Check SVG has proper viewBox and uses `currentColor`.

**Module not found?** Run generation commands and verify import names match component names.

**Missing icons?** Run the Figma download command first, then regenerate components.

**Bundle too large?** Use named imports only - avoid `import *` syntax.

**Need to regenerate all?**

```bash
# Re-download from Figma and regenerate
npx nx download-svgs @ledgerhq/lumen-design-core
npx nx generate-symbols-react @ledgerhq/lumen-design-core
```
