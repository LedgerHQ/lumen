# @ledgerhq/lumen-ui-react

**React UI component library for Ledger Design System (Lumen)** - A comprehensive collection of accessible, customizable React components built with Tailwind CSS and Radix UI primitives.

## 🎨 [View Components in Storybook →](https://ldls.vercel.app)

---

## 📦 Installation

Install the package and its required peer dependencies:

```bash
npm install @ledgerhq/lumen-ui-react @ledgerhq/lumen-design-core

# Install peer dependencies
npm install @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tooltip class-variance-authority clsx tailwind-merge

# React (if not already installed)
npm install react react-dom
```

→ [View @ledgerhq/lumen-design-core on npm](https://www.npmjs.com/package/@ledgerhq/lumen-design-core?activeTab=readme)

## ⚡ Quick Setup

### 1. Configure Tailwind CSS

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

Then import Lumen's stylesheet next to Tailwind in your main CSS file. It
registers our compiled components as a Tailwind source, so you never have to
reference our build layout yourself:

```css
@import 'tailwindcss';
@import '@ledgerhq/lumen-ui-react/tailwind.css';
@config '../tailwind.config.ts';
```

### 2. Start Using Components

```tsx
import { Button } from '@ledgerhq/lumen-ui-react';
import { ArrowRight } from '@ledgerhq/lumen-ui-react/symbols';

function App() {
  return (
    <Button appearance='accent' icon={ArrowRight}>
      Get Started
    </Button>
  );
}
```

---

## 🎨 Theming & Customization

### Using Design Tokens

All components use design tokens from `@ledgerhq/lumen-design-core`:

```tsx
// Components automatically use theme tokens
<Button appearance='accent'>Themed Button</Button>;

const CustomCard = () => <div className='bg-base hover:bg-base-hover heading-0 p-12'>Custom themed content</div>;
```

### Dark Mode Support

Lumen components automatically support dark mode through CSS custom properties. The design system includes both light and dark theme tokens.

#### Enable Dark Mode

Add the `dark` class to your root element or use CSS media queries:

```tsx
// Manual dark mode toggle
<html className='dark'>
  <body>
    <App />
  </body>
</html>
```

---

## ♿ Accessibility

All components are built with accessibility in mind:

- **Keyboard Navigation** - Full keyboard support for all interactive elements
- **Screen Readers** - Proper ARIA labels and descriptions
- **Focus Management** - Visible focus indicators and logical tab order
- **Color Contrast** - WCAG AA compliant color combinations
- **Semantic HTML** - Proper HTML elements and structure

---

## 🎨 Icon System

Import icons directly from the symbols export:

```tsx
import { ArrowRight, CheckCircle, AlertTriangle } from '@ledgerhq/lumen-ui-react/symbols';

// Use icons as components with size prop
<ArrowRight size={24} />
<CheckCircle size={20} className="text-success" />
<AlertTriangle size={16} />

// Available sizes: 16, 20, 24, 40, 48, 56
```

---

## 🤖 AI Assistant Setup

Lumen includes AI rules to help assistants (Cursor, Claude, VS Code Copilot, etc.) understand and suggest correct usage patterns.

### Quick Setup

The AI rules are included in the package. Reference them from `node_modules`:

**For Cursor users**, add to your `.cursorrules`:

```
@node_modules/@ledgerhq/lumen-ui-react/ai-rules/RULES.md
```

**For other AI tools**, see our [AI Rules README](./ai-rules/README.md) for setup instructions.

### What These Rules Do

The AI rules help assistants:

- ✅ Suggest correct import paths (`/symbols` for icons)
- ✅ Use Lumen design tokens instead of Tailwind defaults
- ✅ Configure Tailwind correctly with Lumen content paths
- ✅ Extract components from Figma with proper token mapping
- ✅ Recommend correct peer dependencies

[View the rules →](./ai-rules/)

---

## 🔷 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { ButtonProps, BannerProps, InputProps } from '@ledgerhq/lumen-ui-react';

const CustomButton = (props: ButtonProps) => {
  return <Button {...props} className='custom-button' />;
};
```

---

## 📋 API Reference

Each component exports:

- **Component** - The React component
- **Props interface** - TypeScript interface for props
- **Variants** - Available styling variants

For detailed API documentation, visit our [Storybook](https://ldls.vercel.app).

---

## 🤝 Contributing

This package is part of the [Ledger Design System monorepo](https://github.com/LedgerHQ/lumen).

To contribute:

1. Visit the [main repository](https://github.com/LedgerHQ/lumen)
2. Read our [Contributing Guide](https://github.com/LedgerHQ/lumen/blob/main/CONTRIBUTING.md)
3. Check the [Development Setup](https://github.com/LedgerHQ/lumen#setup-development-environment)

---

## 🔗 Links

- [📚 Storybook Documentation](https://ldls.vercel.app)
- [🏠 Main Repository](https://github.com/LedgerHQ/lumen)
- [📦 npm Package](https://www.npmjs.com/package/@ledgerhq/lumen-ui-react)
- [🎨 Design System SetUp Guide](https://ldls.vercel.app/?path=/docs/getting-started-setup-tailwind--docs)
- [🐛 Report Issues](https://github.com/LedgerHQ/lumen/issues)
