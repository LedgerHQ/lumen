# @ledgerhq/lumen-design-core

**Design tokens and Tailwind theme for Ledger Design System** - Centralized design tokens that ensure consistency across React and React Native applications. All design tokens are automatically synchronized with Figma via the Figma REST API.

## 📦 Installation

```bash
npm install @ledgerhq/lumen-design-core

# Install required peer dependency
npm install tailwindcss@^4.1.17 @tailwindcss/postcss
```

**Note:** Tailwind CSS v4.x is the supported peer dependency.

## ⚡ Quick Setup

The theme ships as Tailwind v4 CSS: tokens, utilities and variants are all
defined in CSS, so no `tailwind.config` is needed. Import Tailwind, then the
theme for your brand, in your main CSS file:

```css
@import 'tailwindcss';
@import '@ledgerhq/lumen-design-core/tailwind/ledger-live.css';
```

There is one file per brand: `enterprise.css`, `ledger-live.css` and
`websites.css`. `all-brands.css` defines all three, switched by a
`.ledger-live`, `.enterprise` or `.websites` class on a parent. They share a
generated `theme.css`: import a brand file, not that one.

If you also use `@ledgerhq/lumen-ui-react`, import its stylesheet after the
theme — it registers the compiled components as a Tailwind source so their
utilities are emitted:

```css
@import '@ledgerhq/lumen-ui-react/tailwind.css';
```

Dark mode is class-based (`.dark` on a parent).

### Migrating from the JS presets

The JS presets (`ledgerLivePreset`, `enterprisePreset`, `websitesPreset`,
`allBrandsPreset`) and their plugins are removed. The CSS files generate
exactly the classes and token values the presets did, so switching changes
nothing on screen:

1. Replace `@config '…/tailwind.config.ts'` in your stylesheet with the
   `@import` of the matching brand file (`allBrandsPreset` →
   `all-brands.css`).
2. Keep `@ledgerhq/lumen-ui-react/tailwind.css` (or your own `@source` globs):
   the CSS file holds the theme, not your content paths.
3. Delete the Lumen preset from `tailwind.config.ts`, and the file itself if
   nothing else is in it. Point any tooling that read the config (the
   Prettier Tailwind plugin, `eslint-plugin-better-tailwindcss`) at your
   stylesheet instead.

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
