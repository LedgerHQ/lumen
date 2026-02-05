# Contributing to Lumen Design System

<h3 align="center">Development and Contribution Guidelines</h3>

## Table of Contents

- [Architecture](#architecture)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Documentation Guidelines](#documentation-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Contribution Process](#contribution-process)

## Architecture

The Lumen Design System is structured as a monorepo using Nx, with the following key libraries:

```sh
lumen
  ├──libs/
  │    ├── ui-react/       # React components
  │    │                   # name: @ledgerhq/lumen-ui-react
  │    │
  │    ├── ui-rnative/     # React Native components
  │    │                   # name: @ledgerhq/lumen-ui-rnative
  │    │
  │    ├── design-core/    # Design tokens and themes
  │    │                   # name: @ledgerhq/lumen-design-core
  │    │
  │    └── utils-shared/   # Shared utilities
  │                        # name: @ledgerhq/lumen-utils-shared
  │
  └──apps/
       ├── app-sandbox-rnative   # Demo React-Native application
       └── app-sandbox-react     # Demo React application
```

- NXJS libraries are prefixed by `@ledgerhq/lumen-*` - defined in the project.json
- NPM package will match the name of the NXJS library, to make a library publishable a private:false needs to be set

### Technology Stack

- **Monorepo Management**: [Nx](https://nx.dev/)
- **Documentation & Testing**: [Storybook](https://storybook.js.org/) & [Chromatic](https://www.chromatic.com/)
- **Building & Bundling**: [Rollup](https://rollupjs.org/) & [Vite](https://vitejs.dev/)

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/your-org/lumen.git
cd lumen
```

2. Setup proto
Proto is a pluggable version manager, a unified toolchain.
[Installation docs](https://moonrepo.dev/docs/proto/install)

You might need to run this command to sync your bashprofile, or zshrc
```bash
proto setup
```

Then run install to synchronize tools versions
```bash
proto install
```

Then proto use
```bash
proto use
```


3. Install dependencies:

```bash
npm install --legacy-peer-deps
```

4. Start development environment:

```bash
# Build all libraries
npx nx run-many --target=build --all

# Start React Storybook
npx nx run @ledgerhq/lumen-ui-react:serve:storybook

# Start React Native Storybook
npx nx run @ledgerhq/lumen-ui-rnative:serve:storybook
```

## Development Workflow

### Running the Libraries

```bash
# Start React components in Storybook
npx nx run @ledgerhq/lumen-ui-react:serve:storybook

# Build React components
npx nx run @ledgerhq/lumen-ui-react:build

# Build React Native components
npx nx run @ledgerhq/lumen-ui-rnative:build

```

### Branch Strategy

1. Create a new branch from main
2. Make your changes
3. Add tests and stories
4. Submit a pull request

## Documentation Guidelines

### Writing Component Documentation

Components are documented using Storybook stories. Create a `.stories.tsx` file next to your component:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
  title: 'Components/YourComponent',
  tags: ['autodocs'], // Enables automatic documentation
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

// Basic usage example
export const Base: Story = {
  args: {
    // Component props
  },
};
```

### Story Naming Conventions

To maintain consistency across our Storybook documentation, follow these naming rules:

#### 1. Base Story

The default, most basic usage of the component.

- ✅ Use: `Base`
- ❌ Do not use: `Default`, `Primary`, `Basic`

#### 2. Showcase Stories

Showcase stories demonstrate variations of a single property.

- ✅ Use the pattern: `{Property}Showcase`
- ❌ Do not use: `States`, `AllStates`, `StatesShowcase`

#### 3. Feature-Specific Stories

Stories highlighting specific features.

- ✅ Use: `With{Feature}` (e.g., `WithIcon`, `WithTooltip`)

### Story Layout Configuration

All stories should follow these visual guidelines:

#### Centering and Background

- **Layout**: Stories should be centered.
- **Background**: Stories should use white background.

**Example**:

```typescript
export const Base: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  // ...
};
```

### MDX Documentation Structure

Component documentation should use a two-tab structure for clarity:

#### Overview Tab

**Intent**: Provide designers and developers with a comprehensive understanding of the component's purpose, behavior, and usage patterns.

**Focus**: Design specifications, visual examples, anatomy, properties, and accessibility guidelines.

#### Implementation Tab

**Intent**: Give developers practical, copy-paste ready code examples and integration patterns.

**Focus**: Installation instructions, code examples, API usage, routing integration, and best practices.

**Example Structure**:

```tsx
import { CustomTabs, Tab } from '../../../../.storybook/components';

<CustomTabs>
  <Tab label='Overview '>{/* Design documentation, anatomy, properties, showcases */}</Tab>
  <Tab label='Implementation '>{/* Installation, code examples, do's and don'ts */}</Tab>
</CustomTabs>;
```

### Documentation Best Practices

1. Include a clear component description
2. Document all props and their types
3. Provide usage examples
4. Include accessibility considerations
5. Document any known limitations or edge cases
6. Follow the story naming conventions above for consistency

### Code connect best practices

#### Generate Your Figma Access Token

1. Go to your Figma account settings
2. Navigate to **Security** section
3. In the **Personal access tokens** section, click **Generate new token**
4. Give it a descriptive name (e.g., "Code Connect - Local Dev")
5. Copy the token (it starts with `figd_`)

#### Configure Your Token

Add your token to a `.env` file at the root of your project:
```bash
FIGMA_ACCESS_TOKEN=figd_your_token_here
```

Once configured, you can skip the `--token` flag in all commands:
```bash
# Instead of this:
figma connect publish --token $FIGMA_ACCESS_TOKEN

# You can simply use:
figma connect publish
```

### Daily Workflow Commands

#### Test Before Publishing
Always dry run before publishing to catch errors early:
```bash
# Dry run with directory
figma connect publish --dry-run --dir libs/ui-react/src/lib/Components/YourComponent/
```

#### Publish Specific Directory
When working on a single component, publish only its directory:
```bash
figma connect publish --dir libs/ui-react/src/lib/Components/YourComponent/
```

#### Remove Broken Connections
If a component connection is broken, unpublish it by node URL, and label, specified in figma.config.json:
```bash
figma connect unpublish --node "https://figma.com/file/abc?node-id=123" --label "React"
```

## Testing Guidelines

### Writing Interaction Tests

Add interaction tests in your stories using the `play` function:

```typescript
export const WithInteraction: Story = {
  args: {
    // Component props
  },
  play: async ({ canvasElement, step }) => {
    // Test steps are automatically documented
    await step('Click the button', async () => {
      const button = canvasElement.querySelector('button');
      button?.click();
    });
  },
};
```

### Testing Requirements

1. Unit tests for all components
2. Interaction tests for complex components
3. Visual regression tests via **Chromatic**
4. Accessibility tests
5. Cross-browser testing

## Contribution Process

### Before Contributing

1. Check existing issues and pull requests
2. Discuss major changes in an issue first
3. Review our coding standards
4. Set up your development environment

### Making Changes

1. Write clean, maintainable code
2. Follow the existing code style
3. Add or update tests as needed
4. Update documentation
5. Test your changes thoroughly

### Submitting Changes

1. Create a pull request
2. Fill out the pull request template
3. Reference any related issues
4. Wait for code review
5. Address feedback

### Code Review Process

1. All changes must be reviewed
2. Changes must pass automated tests
3. Documentation must be updated
4. Breaking changes must be clearly marked

## Getting Help

- Join our Discord community
- Check the FAQ in the wiki
- Open an issue for bugs
- Discuss features in discussions

---

Thank you for contributing to Lumen! 🎉
