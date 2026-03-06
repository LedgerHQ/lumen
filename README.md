# Ledger Design System

<h3 align="center">A cross-platform design system for React and React Native applications</h3>

<p align="center">
  <a href="https://ldls.vercel.app" target="_blank">📚 View Storybook</a> |
  <a href="https://github.com/LedgerHQ/lumen/releases">📋 Changelog</a>
</p>

---

## 👩‍💻 Using Lumen in Your Project

Lumen is a comprehensive design system that provides consistent UI components for both web and mobile applications..

### Quick Start

1. Install the packages and their peer dependencies:

```bash
# Install the UI Kit and required peer dependencies
npm install @ledgerhq/lumen-ui-react @ledgerhq/lumen-design-core clsx tailwind-merge class-variance-authority
```

2. Configure Tailwind:

```typescript
import type { Config } from 'tailwindcss';
import { ledgerLivePreset } from '@ledgerhq/lumen-design-core';

const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Your project's files
    './node_modules/@ledgerhq/lumen-ui-react/dist/lib/**/*.{js,ts,jsx,tsx}', // Ledger UI Kit components
  ],
  presets: [ledgerLivePreset], // the installed tailwind preset
} satisfies Config;

export default config;
```

3. Use components:

```bash
# Install peer dependency related to the button component
npm install @radix-ui/react-slot
```

`@radix-ui/react-slot`: This dependency is used internally by the Button component to enable flexible composition patterns. It allows the Button to merge its props with child elements when needed.

```tsx
import { Button } from '@ledgerhq/lumen-ui-react';

function App() {
  return <Button appearance='accent'>Get Started</Button>;
}
```

### 🤖 AI Assistant Support

Lumen includes AI rules to help assistants (Cursor, Claude, VS Code Copilot, etc.) suggest correct usage patterns.

**For Cursor users**, add to your `.cursorrules`:

```
@node_modules/@ledgerhq/lumen-ui-react/ai-rules/RULES.md
```

**For other AI tools**, see our [AI Rules README](./libs/ui-react/ai-rules/README.md).

The rules help with:

- ✅ Correct import paths and package usage
- ✅ Lumen design tokens instead of Tailwind defaults
- ✅ Proper Tailwind configuration
- ✅ Figma-to-code token mapping

[View the rules →](./libs/ui-react/ai-rules/)

---

## 🛠 Contributing to Lumen

Lumen is built with Nx, supporting both React and React Native development. Here's how to get started with development:

### Setup Development Environment

1. Clone and install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Start development environment:

```bash
# Start React Storybook
npx nx run @ledgerhq/lumen-ui-react:serve:storybook

# Build all libraries
npx nx run-many --target=build --all
```

### Project Structure

```
lumen/
├── libs/
│   ├── ui-react/      # React components
│   ├── ui-rnative/    # React Native components
│   ├── design-core/   # Design tokens and themes
│   └── utils-shared/  # Shared utilities
└── apps/
    ├── app-sandbox-rnative  # Demo React-Native application
    └── app-sandbox-react    # Demo React application
```

### Development Workflow

1. Create a new branch from main
2. Make your changes
3. Add tests and stories
4. Submit a pull request

### Learn More About Contributing

- [🔧 Development Guide](./CONTRIBUTING.md) - Detailed development setup and guidelines
- [📝 Coding Standards](./CONTRIBUTING.md#coding-standards) - Our coding conventions
- [🧪 Testing Guide](./CONTRIBUTING.md#testing) - How to write and run tests
- [📚 Documentation Guide](./CONTRIBUTING.md#documentation) - How to document your changes

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.

---

<p align="center">
  Built with ❤️ by the LDS Team
</p>
