# Lumen UI React Native - AI Assistant Rules

## About Lumen

**Lumen** (Ledger Design Language System), also known as **Lumen**, is Ledger's comprehensive design system providing:

- **UI components** available via `@ledgerhq/lumen-ui-rnative`
- **Design tokens** (colors, spacing, typography) available via `@ledgerhq/lumen-design-core`
- **Multiple brand presets**: available via `@ledgerhq/lumen-design-core`

## Setup Requirements

### Package Installation

- Import components from `@ledgerhq/lumen-ui-rnative`
- Import icons from `@ledgerhq/lumen-ui-rnative/symbols` (not from main package)
- Import design tokens/presets from `@ledgerhq/lumen-design-core`

---

## Available React Native Components

Below is a complete list of all available Lumen React Native components. Click any component name to view its documentation and interactive examples in Storybook.

**Components:**

- [Button](https://ldls.vercel.app/?path=/docs/action-button--docs) - Primary action button component
- [CardButton](https://ldls.vercel.app/?path=/docs/action-cardbutton--docs) - Card-style interactive button
- [IconButton](https://ldls.vercel.app/?path=/docs/action-iconbutton--docs) - Button with icon only
- [InteractiveIcon](https://ldls.vercel.app/?path=/docs/action-interactiveicon--docs) - Interactive icon with states
- [Link](https://ldls.vercel.app/?path=/docs/action-link--docs) - Hyperlink component
- [TileButton](https://ldls.vercel.app/?path=/docs/action-tilebutton--docs) - Interactive tile button
- [AmountDisplay](https://ldls.vercel.app/?path=/docs/communication-amountdisplay--docs) - Display formatted amounts with currency
- [Banner](https://ldls.vercel.app/?path=/docs/communication-banner--docs) - Alert and notification banners
- [Spinner](https://ldls.vercel.app/?path=/docs/communication-spinner--docs) - Loading spinner indicator
- [Spot](https://ldls.vercel.app/?path=/docs/communication-spot--docs) - Icon container with background
- [Subheader](https://ldls.vercel.app/?path=/docs/communication-subheader--docs) - Section subheader component
- [Tag](https://ldls.vercel.app/?path=/docs/communication-tag--docs) - Label and tag component
- [Tooltip](https://ldls.vercel.app/?path=/docs/communication-tooltip--docs) - Tooltip overlay component
- [BottomSheet](https://ldls.vercel.app/?path=/docs/containment-bottomsheet--docs) - Bottom sheet modal component
- [ListItem](https://ldls.vercel.app/?path=/docs/containment-listitem--docs) - List item with flexible composition
- [Tile](https://ldls.vercel.app/?path=/docs/containment-tile--docs) - Content container tile
- [AddressInput](https://ldls.vercel.app/?path=/docs/input-addressinput--docs) - Input field for cryptocurrency addresses
- [AmountInput](https://ldls.vercel.app/?path=/docs/input-amountinput--docs) - Input field for amount values
- [SearchInput](https://ldls.vercel.app/?path=/docs/input-searchinput--docs) - Search input field
- [TextInput](https://ldls.vercel.app/?path=/docs/input-textinput--docs) - Text input field
- [Divider](https://ldls.vercel.app/?path=/docs/layout-divider--docs) - Visual separator line
- [TabBar](https://ldls.vercel.app/?path=/docs/navigation-tabbar--docs) - Bottom tab navigation bar
- [Checkbox](https://ldls.vercel.app/?path=/docs/selection-checkbox--docs) - Checkbox input for selections
- [Select](https://ldls.vercel.app/?path=/docs/selection-select--docs) - Dropdown select component
- [Switch](https://ldls.vercel.app/?path=/docs/selection-switch--docs) - Toggle switch component

**Symbols:**

- [Icon](https://ldls.vercel.app/?path=/docs/symbols-interface-icons--docs) - Interface icon components

**Utility Components:**

- [Box](https://ldls.vercel.app/?path=/docs/utility-box--docs) - Layout container with style props
- [LinearGradient](https://ldls.vercel.app/?path=/docs/utility-lineargradient--docs) - Linear gradient component
- [Pressable](https://ldls.vercel.app/?path=/docs/utility-pressable--docs) - Pressable wrapper with visual feedback
- [RadialGradient](https://ldls.vercel.app/?path=/docs/utility-radialgradient--docs) - Radial gradient component
- [Text](https://ldls.vercel.app/?path=/docs/utility-text--docs) - Text component with style props

### Icons

[View all available icons in Storybook →](https://ldls.vercel.app/?path=/docs/symbols-interface-icons--docs)

- Always import icons from `/symbols` entry point
- Import: `import { ArrowRight, CheckCircle } from '@ledgerhq/lumen-ui-rnative/symbols'`
- Use as components: `<ArrowRight size={20} />`
- Pass as props: `<Button icon={ArrowRight}>Label</Button>`
- Available sizes: 12, 16, 20, 24, 32, 40, 48, 56

---

## React Native Style System

Lumen React Native uses a custom style system called `lx` that provides type-safe access to design tokens. Explore the style system documentation:

- [Colors](https://ldls.vercel.app/?path=/docs/style-system-theme-colors--docs) - Semantic color tokens for background, text, and borders
- [Spacings](https://ldls.vercel.app/?path=/docs/style-system-theme-spacings--docs) - Spacing scale for padding, margin, and gaps
- [Sizes](https://ldls.vercel.app/?path=/docs/style-system-theme-sizes--docs) - Size tokens for width and height
- [Shadows](https://ldls.vercel.app/?path=/docs/style-system-theme-shadows--docs) - Elevation shadow styles
- [Border Width](https://ldls.vercel.app/?path=/docs/style-system-theme-border-width--docs) - Border width tokens
- [Border Radius](https://ldls.vercel.app/?path=/docs/style-system-theme-border-radius--docs) - Border radius tokens

### Style System Usage

```tsx
import { Box, Text } from '@ledgerhq/lumen-ui-rnative';

// Using lx prop for type-safe styling
<Box
  lx={{
    backgroundColor: 'base',
    padding: 16,
    borderRadius: 'md',
    borderWidth: 1,
    borderColor: 'muted',
  }}
>
  <Text lx={{ color: 'base', fontSize: 'body-2' }}>Styled with design tokens</Text>
</Box>;
```

---

## Design Tokens

### Colors

Use Lumen design tokens -- do not use default React Native color values.

#### Available Background Colors

- **Canvas**: `canvas`, `canvas-muted`, `canvas-sheet`, `canvas-overlay`
- **Base**: `base`, `base-hover`, `base-pressed`
- **Base Transparent**: `base-transparent`, `base-transparent-hover`, `base-transparent-pressed`
- **Muted**: `muted`, `muted-hover`, `muted-pressed`
- **Muted Transparent**: `muted-transparent`, `muted-transparent-hover`, `muted-transparent-pressed`, `muted-transparent-disabled`
- **Muted Strong**: `muted-strong`, `muted-strong-hover`, `muted-strong-pressed`
- **Accent**: `accent`, `accent-hover`, `accent-pressed`
- **Interactive**: `interactive`, `interactive-hover`, `interactive-pressed`
- **Status**: `error`, `error-strong`, `error-transparent`, `warning`, `warning-strong`, `success`, `success-strong`, `success-transparent`
- **Active**: `active`, `active-hover`, `active-pressed`, `active-subtle`, `active-subtle-hover`, `active-subtle-pressed`
- **Surface**: `surface`, `surface-hover`, `surface-pressed`
- **Utility**: `white`, `black`, `disabled`, `disabled-strong`

#### Available Text Colors

- **Base**: `base`, `base-hover`, `base-pressed`
- **Muted**: `muted`, `muted-hover`, `muted-pressed`, `muted-subtle`
- **Interactive**: `interactive`, `interactive-hover`, `interactive-pressed`
- **Status**: `error`, `warning`, `success`
- **On Colors**: `on-accent`, `on-interactive`, `on-error-strong`, `on-warning`, `on-success-strong`
- **Utility**: `white`, `black`, `grey`, `disabled`, `active`

#### Available Border Colors

- **Base**: `base`, `base-hover`, `base-pressed`
- **Muted**: `muted`, `muted-hover`, `muted-pressed`, `muted-subtle`
- **Status**: `error`, `warning`, `success`
- **Interactive**: `focus`, `active`
- **Utility**: `black`, `white`, `disabled`

### Dark Mode

- Lumen components support dark mode automatically via the theme provider
- No component-level changes needed
