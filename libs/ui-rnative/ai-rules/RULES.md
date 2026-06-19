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

### Font Family (REQUIRED)

Lumen typography tokens set `fontFamily: 'Inter'`. The consumer project must load the Inter font with all required weight variants. On Android, Lumen appends weight suffixes to the font family name, so font files must be named accordingly (`Inter`, `Inter-Medium`, `Inter-SemiBold`, `Inter-Bold`).

---

## Available React Native Components

Below is a complete list of all available Lumen React Native components. Click any component name to view its documentation and interactive examples in Storybook.

**Components:**

- [Button](https://ldls-react-native.vercel.app/?path=/docs/core-button--docs) - Primary action button component
- [CardButton](https://ldls-react-native.vercel.app/?path=/docs/core-cardbutton--docs) - Card-style interactive button
- [IconButton](https://ldls-react-native.vercel.app/?path=/docs/core-iconbutton--docs) - Button with icon only
- [InteractiveIcon](https://ldls-react-native.vercel.app/?path=/docs/core-interactiveicon--docs) - Interactive icon with states
- [Link](https://ldls-react-native.vercel.app/?path=/docs/core-link--docs) - Hyperlink component
- [TileButton](https://ldls-react-native.vercel.app/?path=/docs/core-tilebutton--docs) - Interactive tile button
- [AmountDisplay](https://ldls-react-native.vercel.app/?path=/docs/core-amountdisplay--docs) - Display formatted amounts with currency
- [Avatar](https://ldls-react-native.vercel.app/?path=/docs/core-avatar--docs) - User avatar with image, initials, or placeholder
- [Banner](https://ldls-react-native.vercel.app/?path=/docs/core-banner--docs) - Alert and notification banners
- [ContentBanner](https://ldls-react-native.vercel.app/?path=/docs/core-contentbanner--docs) - Rich content banner with image support
- [MediaBanner](https://ldls-react-native.vercel.app/?path=/docs/core-mediabanner--docs) - Rich media banner with image and content
- [MediaCard](https://ldls-react-native.vercel.app/?path=/docs/core-mediacard--docs) - Card with media content
- [MediaImage](https://ldls-react-native.vercel.app/?path=/docs/core-mediaimage--docs) - Image display component with loading states
- [PageIndicator](https://ldls-react-native.vercel.app/?path=/docs/core-pageindicator--docs) - Step and page progress indicator
- [Skeleton](https://ldls-react-native.vercel.app/?path=/docs/core-skeleton--docs) - Loading placeholder skeleton
- [Spinner](https://ldls-react-native.vercel.app/?path=/docs/core-spinner--docs) - Loading spinner indicator
- [Spot](https://ldls-react-native.vercel.app/?path=/docs/core-spot--docs) - Icon container with background
- [Stepper](https://ldls-react-native.vercel.app/?path=/docs/core-stepper--docs) - Multi-step progress indicator
- [Subheader](https://ldls-react-native.vercel.app/?path=/docs/core-subheader--docs) - Section subheader component
- [Tag](https://ldls-react-native.vercel.app/?path=/docs/core-tag--docs) - Label and tag component
- [Tooltip](https://ldls-react-native.vercel.app/?path=/docs/core-tooltip--docs) - Tooltip overlay component
- [BottomSheet](https://ldls-react-native.vercel.app/?path=/docs/core-bottomsheet--docs) - Bottom sheet modal component
- [Card](https://ldls-react-native.vercel.app/?path=/docs/core-card--docs) - Content container card
- [ListItem](https://ldls-react-native.vercel.app/?path=/docs/core-listitem--docs) - List item with flexible composition
- [Tile](https://ldls-react-native.vercel.app/?path=/docs/core-tile--docs) - Content container tile
- [AddressInput](https://ldls-react-native.vercel.app/?path=/docs/core-addressinput--docs) - Input field for cryptocurrency addresses
- [AmountInput](https://ldls-react-native.vercel.app/?path=/docs/core-amountinput--docs) - Input field for amount values
- [SearchInput](https://ldls-react-native.vercel.app/?path=/docs/core-searchinput--docs) - Search input field
- [TextInput](https://ldls-react-native.vercel.app/?path=/docs/core-textinput--docs) - Text input field
- [Divider](https://ldls-react-native.vercel.app/?path=/docs/core-divider--docs) - Visual separator line
- [NavBar](https://ldls-react-native.vercel.app/?path=/docs/core-navbar--docs) - Top navigation bar
- [SegmentedControl](https://ldls-react-native.vercel.app/?path=/docs/core-segmentedcontrol--docs) - Segmented control for toggling between views
- [TabBar](https://ldls-react-native.vercel.app/?path=/docs/core-tabbar--docs) - Bottom tab navigation bar
- [Checkbox](https://ldls-react-native.vercel.app/?path=/docs/core-checkbox--docs) - Checkbox input for selections
- [Switch](https://ldls-react-native.vercel.app/?path=/docs/core-switch--docs) - Toggle switch component

**Symbols:**

- [Icon](https://ldls-react-native.vercel.app/?path=/docs/symbols-interface-icons--docs) - Interface icon components

**Utility Components:**

- [Box](https://ldls-react-native.vercel.app/?path=/docs/primitives-box--docs) - Layout container with style props
- [LinearGradient](https://ldls-react-native.vercel.app/?path=/docs/primitives-lineargradient--docs) - Linear gradient component
- [Pressable](https://ldls-react-native.vercel.app/?path=/docs/primitives-pressable--docs) - Pressable wrapper with visual feedback
- [RadialGradient](https://ldls-react-native.vercel.app/?path=/docs/primitives-radialgradient--docs) - Radial gradient component
- [Text](https://ldls-react-native.vercel.app/?path=/docs/primitives-text--docs) - Text component with style props

### Icons

[View all available icons in Storybook →](https://ldls-react-native.vercel.app/?path=/docs/symbols-interface-icons--docs)

- Always import icons from `/symbols` entry point
- Import: `import { ArrowRight, CheckCircle } from '@ledgerhq/lumen-ui-rnative/symbols'`
- Use as components: `<ArrowRight size={20} />`
- Pass as props: `<Button icon={ArrowRight}>Label</Button>`
- Available sizes: 12, 16, 20, 24, 32, 40, 48, 56

---

## React Native Style System

Lumen React Native uses a custom style system called `lx` that provides type-safe access to design tokens. 

Explore the complete theme reference:

- [Colors](https://ldls-react-native.vercel.app/?path=/docs/style-system-theme-colors--docs) - Semantic color tokens for background, text, and borders
- [Spacings](https://ldls-react-native.vercel.app/?path=/docs/style-system-theme-spacings--docs) - Spacing scale for padding, margin, and gaps
- [Sizes](https://ldls-react-native.vercel.app/?path=/docs/style-system-theme-sizes--docs) - Size tokens for width and height
- [Shadows](https://ldls-react-native.vercel.app/?path=/docs/style-system-theme-shadows--docs) - Elevation shadow styles
- [Border Width](https://ldls-react-native.vercel.app/?path=/docs/style-system-theme-border-width--docs) - Border width tokens
- [Border Radius](https://ldls-react-native.vercel.app/?path=/docs/style-system-theme-border-radius--docs) - Border radius tokens

### Style System Usage


- [Style System](https://ldls-react-native.vercel.app/?path=/docs/style-system-style-system--docs) - high level guidelines
- [useTheme](https://ldls-react-native.vercel.app/?path=/docs/style-system-usetheme--docs) - useTheme hook
- [useStyleSheet](https://ldls-react-native.vercel.app/?path=/docs/style-system-usestylesheet--docs) - useStyleSheet
- [lx property](https://ldls-react-native.vercel.app/?path=/docs/style-system-lx--docs) - lx property


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
