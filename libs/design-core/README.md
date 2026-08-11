# @ledgerhq/lumen-design-core

**Design tokens and Tailwind presets for Ledger Design System** - Centralized design tokens that ensure consistency across React and React Native applications. All design tokens are automatically synchronized with Figma via the Figma REST API.

## 📦 Installation

```bash
npm install @ledgerhq/lumen-design-core

# Install required peer dependency
npm install tailwindcss@^4.1.17 @tailwindcss/postcss
```

**Note:** Tailwind CSS v4.x is the supported peer dependency.

## ⚡ Quick Setup

Create or update your `tailwind.config.js`:

```typescript
import type { Config } from 'tailwindcss';
import { ledgerLivePreset } from '@ledgerhq/lumen-design-core';

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [ledgerLivePreset],
} satisfies Config;

export default config;
```

If you also use `@ledgerhq/lumen-ui-react`, import its stylesheet next to
Tailwind in your main CSS file — it registers the compiled components as a
Tailwind source so their utilities are emitted:

```css
@import 'tailwindcss';
@import '@ledgerhq/lumen-ui-react/tailwind.css';
@config '../tailwind.config.ts';
```


## 🎨 Design Tokens

### Colors & Typography

```tsx
// Semantic colors that auto-adapt to light/dark themes
<div className="bg-canvas text-base">
<p className="text-muted">Secondary text</p>
<div className="bg-success text-success">Success state</div>

// Typography system
<h1 className="heading-1">Main Heading</h1>
<p className="body-1">Regular paragraph text</p>
```

### Spacing & Layout

1:1 pixel mapping where each number equals its pixel value:

```tsx
<div className="p-4 m-8 gap-12">  {/* padding: 4px, margin: 8px, gap: 12px */}
```

## 🌓 Dark Mode Support

All design tokens automatically support dark mode:

```tsx
<html className='dark'>
  <div className='bg-canvas text-base'>Dark mode content</div>
</html>
```

## 🔧 Alternative Usage

For non-Tailwind projects, use CSS custom properties:

```css
.my-component {
  background-color: var(--color-background-base);
  color: var(--color-text-base);
  padding: var(--spacing-16);
}
```

## 🔄 Token Synchronization

All design tokens are automatically kept in sync with Figma design files through:

- **Figma REST API integration** - Tokens are extracted directly from Figma design system
- **Automated updates** - Changes in Figma are automatically reflected in the token library
- **Version consistency** - Ensures perfect alignment between design and code

## 🔗 Links

- [📚 Full Documentation](https://ldls.vercel.app)
- [🎨 Setup Tailwind](https://ldls.vercel.app/?path=/docs/getting-started-setup-tailwind--docs)
- [🏠 Repository](https://github.com/LedgerHQ/lumen)
