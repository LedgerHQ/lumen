# Lumen UI React - AI Assistant Rules

## About Lumen

**Lumen** (Ledger Design Language System), also known as **Lumen**, is Ledger's comprehensive design system providing:

- **UI components** available via `@ledgerhq/lumen-ui-react`
- **Design tokens** (colors, spacing, typography) available via `@ledgerhq/lumen-design-core`
- **Multiple brand presets**: available via `@ledgerhq/lumen-design-core`

## Setup Requirements

### Package Installation

- Import components from `@ledgerhq/lumen-ui-react`
- Import icons from `@ledgerhq/lumen-ui-react/symbols` (not from main package)
- Import design tokens/presets from `@ledgerhq/lumen-design-core`

### Tailwind Configuration (REQUIRED)

- Tailwind config MUST include Lumen in content array: `'./node_modules/@ledgerhq/lumen-ui-react/dist/lib/**/*.{js,ts,jsx,tsx}'`
- Always use a preset from `@ledgerhq/lumen-design-core`: ledgerLivePreset, enterprisePreset or websitesPreset
- Import presets: `import { ledgerLivePreset } from '@ledgerhq/lumen-design-core'`

### Peer Dependencies

- Button requires `@radix-ui/react-slot`
- Checkbox requires `@radix-ui/react-checkbox`
- Switch requires `@radix-ui/react-switch`
- Dialog requires `@radix-ui/react-dialog`
- Tooltip requires `@radix-ui/react-tooltip`
- Select requires `@radix-ui/react-select`

---

## Design Tokens

### Typography Utilities

- Do not use Tailwind Typography utilities (e.g., `font-bold`, `text-sm`, etc.)
- Use Lumen custom typography utilities:
  - `responsive-display-1` to `responsive-display-4`
  - `heading-0`, `heading-0-semi-bold` through `heading-5`, `heading-5-semi-bold`
  - `body-1`, `body-1-semi-bold` through `body-4`, `body-4-semi-bold`

### Colors and Background

- Do not use Tailwind default color palette (e.g., `text-gray-500`, `bg-blue-600`)
- Use Lumen design tokens

#### Available background Colors

- **Canvas**: `bg-canvas`, `bg-canvas-muted`, `bg-canvas-sheet`, `bg-canvas-overlay`
- **Base**: `bg-base`, `bg-base-hover`, `bg-base-pressed`
- **Base Transparent**: `bg-base-transparent`, `bg-base-transparent-hover`, `bg-base-transparent-pressed`
- **Muted**: `bg-muted`, `bg-muted-hover`, `bg-muted-pressed`
- **Muted Transparent**: `bg-muted-transparent`, `bg-muted-transparent-hover`, `bg-muted-transparent-pressed`, `bg-muted-transparent-disabled`
- **Muted Strong**: `bg-muted-strong`, `bg-muted-strong-hover`, `bg-muted-strong-pressed`
- **Accent**: `bg-accent`, `bg-accent-hover`, `bg-accent-pressed`
- **Interactive**: `bg-interactive`, `bg-interactive-hover`, `bg-interactive-pressed`
- **Status**: `bg-error`, `bg-error-strong`, `bg-error-transparent`, `bg-warning`, `bg-warning-strong`, `bg-success`, `bg-success-strong`, `bg-success-transparent`
- **Active**: `bg-active`, `bg-active-hover`, `bg-active-pressed`, `bg-active-subtle`, `bg-active-subtle-hover`, `bg-active-subtle-pressed`
- **Surface**: `bg-surface`, `bg-surface-hover`, `bg-surface-pressed`
- **Utility**: `bg-white`, `bg-black`, `bg-disabled`, `bg-disabled-strong`

#### Available Text Colors

- **Base**: `text-base`, `text-base-hover`, `text-base-pressed`
- **Muted**: `text-muted`, `text-muted-hover`, `text-muted-pressed`, `text-muted-subtle`
- **Interactive**: `text-interactive`, `text-interactive-hover`, `text-interactive-pressed`
- **Status**: `text-error`, `text-warning`, `text-success`
- **On Colors**: `text-on-accent`, `text-on-interactive`, `text-on-error-strong`, `text-on-warning`, `text-on-success-strong`
- **Utility**: `text-white`, `text-black`, `text-grey`, `text-disabled`, `text-active`

#### Available Border Colors

- **Base**: `border-base`, `border-base-hover`, `border-base-pressed`
- **Muted**: `border-muted`, `border-muted-hover`, `border-muted-pressed`, `border-muted-subtle`
- **Status**: `border-error`, `border-warning`, `border-success`
- **Interactive**: `border-focus`, `border-active`
- **Utility**: `border-black`, `border-white`, `border-disabled`

#### Available Crypto Colors

Use with `bg-crypto-*` prefix. Available tokens include: `bitcoin`, `ethereum`, `bitcoin-cash`, `litecoin`, `cardano`, `polkadot`, `solana`, `avax`, `polygon`, `cosmos`, `tezos`, `algorand`, `stellar`, `dogecoin`, `chainlink`, `uniswap`, `compound`, `dai`, `usdc`, `tether-usdt`, and many more.

#### Available Discover Colors

Use with `bg-discover-*` prefix. Available for platform integrations: `1inch`, `changelly`, `compound`, `opensea`, `paraswap`, `rarible`, `zerion`, `bitrefill`, `simplex`, `mercuryo`, `lido`, etc.

#### Colors mapping

To verify or discover additional color tokens, explore:

- Theme files: `node_modules/@ledgerhq/lumen-design-core/dist/themes/ledger-live/theme.light.js` (or `enterprise`, `websites`)
- Look for CSS variables: `--color-background-*`, `--color-text-*`, `--color-border-*`, `--color-crypto-*`, `--color-discover-*`
- Plugin mapping: `node_modules/@ledgerhq/lumen-design-core/dist/utils/create-custom-plugin.js` shows how CSS variables map to Tailwind utilities

### Size (Width & Height)

- Size utilities use a **pixel-based scale** (not rem-based like default Tailwind)
- The number in each utility corresponds directly to pixels (e.g., `h-64` = `64px`, `w-160` = `160px`)
- Available size utilities:
  - Width: `w-{size}`, `min-w-{size}`, `max-w-{size}`
  - Height: `h-{size}`, `min-h-{size}`, `max-h-{size}`
  - Both: `size-{size}` (sets both width and height)
- Available size scale: `1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 112, 128, 144, 160, 176, 208, 224, 256, 320, 400, 480, 560`

### Spacing (Padding, Margin, Gap)

- Spacing utilities use a **pixel-based scale** (not rem-based like default Tailwind)
- The number in each utility corresponds directly to pixels (e.g., `p-16` = `16px`, `gap-24` = `24px`)
- Available spacing utilities:
  - Padding: `p-{size}`, `px-{size}`, `py-{size}`, `pt-{size}`, `pr-{size}`, `pb-{size}`, `pl-{size}`
  - Margin: `m-{size}`, `mx-{size}`, `my-{size}`, `mt-{size}`, `mr-{size}`, `mb-{size}`, `ml-{size}`
  - Gap: `gap-{size}`, `gap-x-{size}`, `gap-y-{size}`
- Available spacing scale: `0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 256`

#### Size & Spacing Discovery

To verify or discover additional values, explore:

- Primitives theme: `node_modules/@ledgerhq/lumen-design-core/dist/themes/primitives.js`
- Look for CSS variables: `--spacing-*` (for padding/margin/gap) and `--size-*` (for width/height)
- Plugin configuration: `node_modules/@ledgerhq/lumen-design-core/dist/utils/create-primitives-plugin.js`

### Borders and Shadows

- Border radius: `rounded-sm`, `rounded-md`, `rounded-lg`, etc.
- Border width: `border` for default, `border-2` for active/emphasized states
- Drop shadows: `drop-shadow-sm`, `drop-shadow-md`, `drop-shadow-lg`, `drop-shadow-xl`, `drop-shadow-2xl`

### Gradients

- Background gradients: `bg-gradient-top`, `bg-gradient-bottom`, `bg-gradient-{crypto}`

### Tailwind Classnames Rules

- Tailwind utilities should never be concatenated
- Always use complete class names as strings
- Use conditional logic for dynamic class names
- Valid example: `className={cn("text-base", color && "bg-muted")}` ✅
- Invalid Example: `className={text-${color}}`

---

## Component Pattern Examples

### Building a Card Component

```tsx
import { Button } from '@ledgerhq/lumen-ui-react';
import { ArrowRight } from '@ledgerhq/lumen-ui-react/symbols';

const Card = () => (
  <div className='bg-base border border-base rounded-lg p-16'>
    <h2 className='heading-4'>Card Title</h2>
    <p className='body-2 text-muted mt-8'>This is a description using proper spacing and typography tokens.</p>
    <Button icon={ArrowRight} className='mt-16'>
      Learn More
    </Button>
  </div>
);
```

### Building a Status Banner

```tsx
import { Banner, Button } from '@ledgerhq/lumen-ui-react';

// Info banner
<Banner
  appearance='info'
  title='New Feature Available'
  description='Check out our latest update to improve your experience'
/>

// Warning banner with actions
<Banner
  appearance='warning'
  title='Terms of Service Updated'
  description='Please review and accept the updated terms to continue'
  primaryAction={
    <Button appearance='transparent' size='sm' onClick={() => console.log('Accept')}>
      Accept
    </Button>
  }
  secondaryAction={
    <Button appearance='no-background' size='sm' onClick={() => console.log('Review')}>
      Review Later
    </Button>
  }
/>

// Error banner with close
<Banner
  appearance='error'
  title='Connection Failed'
  description='Unable to connect to the server. Please try again.'
  onClose={() => console.log('Closed')}
  closeAriaLabel='Close error banner'
/>
```

### Building a List with Interactive Items

```tsx
import { ListItem, Spot } from '@ledgerhq/lumen-ui-react';
import { ChevronRight, Settings } from '@ledgerhq/lumen-ui-react/symbols';

const InteractiveList = () => (
  <div className='flex flex-col gap-2'>
    {items.map((item) => (
      <ListItem>
        <ListItemLeading>
          <ListItemSpot appearance='icon' icon={Settings} />
          <ListItemContent>
            <ListItemTitle>Simple composition</ListItemTitle>
            <ListItemDescription>With description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ChevronRight />
        </ListItemTrailing>
      </ListItem>
    ))}
  </div>
);
```

---

## Component Usage

### Component Imports

- Import components from `@ledgerhq/lumen-ui-react`
- Import compound components together: `Select, SelectTrigger, SelectContent, SelectItem, SelectItemText`
- Example: `import { Button, Banner, Tag } from '@ledgerhq/lumen-ui-react'`

### Available Components

Below is a complete list of all available Lumen components. Click any component name to view its documentation and interactive examples in Storybook.

- [AddressInput](https://ldls.vercel.app/?path=/docs/input-addressinput--docs) - Input field for cryptocurrency addresses
- [AmountDisplay](https://ldls.vercel.app/?path=/docs/communication-amountdisplay--docs) - Display formatted amounts with currency
- [AmountInput](https://ldls.vercel.app/?path=/docs/input-amountinput--docs) - Input field for amount values
- [Avatar](https://ldls.vercel.app/?path=/docs/communication-avatar--docs) - User avatar with image, initials, or placeholder
- [Banner](https://ldls.vercel.app/?path=/docs/communication-banner--docs) - Alert and notification banners
- [Button](https://ldls.vercel.app/?path=/docs/action-button--docs) - Primary action button component
- [CardButton](https://ldls.vercel.app/?path=/docs/action-cardbutton--docs) - Card-style interactive button
- [Checkbox](https://ldls.vercel.app/?path=/docs/selection-checkbox--docs) - Checkbox input for selections
- [ContentBanner](https://ldls.vercel.app/?path=/docs/communication-contentbanner--docs) - Rich content banner with image support
- [DataTable](https://ldls.vercel.app/?path=/docs/data-datatable--docs) - Advanced data table with sorting and filtering
- [Dialog](https://ldls.vercel.app/?path=/docs/containment-dialog--docs) - Modal dialog and sheet component
- [Divider](https://ldls.vercel.app/?path=/docs/layout-divider--docs) - Visual separator line
- [Icon](https://ldls.vercel.app/?path=/docs/symbols-interface-icons--docs) - Interface icon components
- [IconButton](https://ldls.vercel.app/?path=/docs/action-iconbutton--docs) - Button with icon only
- [InteractiveIcon](https://ldls.vercel.app/?path=/docs/action-interactiveicon--docs) - Interactive icon with states
- [Link](https://ldls.vercel.app/?path=/docs/action-link--docs) - Hyperlink component
- [ListItem](https://ldls.vercel.app/?path=/docs/containment-listitem--docs) - List item with flexible composition
- [Menu](https://ldls.vercel.app/?path=/docs/selection-menu--docs) - Dropdown menu component
- [NavBar](https://ldls.vercel.app/?path=/docs/navigation-navbar--docs) - Top navigation bar
- [PageIndicator](https://ldls.vercel.app/?path=/docs/communication-pageindicator--docs) - Step and page progress indicator
- [SearchInput](https://ldls.vercel.app/?path=/docs/input-searchinput--docs) - Search input field
- [Select](https://ldls.vercel.app/?path=/docs/selection-select--docs) - Dropdown select component
- [SideBar](https://ldls.vercel.app/?path=/docs/navigation-sidebar--docs) - Side navigation panel
- [Skeleton](https://ldls.vercel.app/?path=/docs/communication-skeleton--docs) - Loading placeholder skeleton
- [Spinner](https://ldls.vercel.app/?path=/docs/communication-spinner--docs) - Loading spinner indicator
- [Spot](https://ldls.vercel.app/?path=/docs/communication-spot--docs) - Icon container with background
- [Stepper](https://ldls.vercel.app/?path=/docs/feedback-stepper--docs) - Multi-step progress indicator
- [Subheader](https://ldls.vercel.app/?path=/docs/communication-subheader--docs) - Section subheader component
- [Switch](https://ldls.vercel.app/?path=/docs/selection-switch--docs) - Toggle switch component
- [Table](https://ldls.vercel.app/?path=/docs/data-table--docs) - Static data table component
- [Tag](https://ldls.vercel.app/?path=/docs/communication-tag--docs) - Label and tag component
- [TextInput](https://ldls.vercel.app/?path=/docs/input-textinput--docs) - Text input field
- [Tile](https://ldls.vercel.app/?path=/docs/containment-tile--docs) - Content container tile
- [TileButton](https://ldls.vercel.app/?path=/docs/action-tilebutton--docs) - Interactive tile button
- [Tooltip](https://ldls.vercel.app/?path=/docs/communication-tooltip--docs) - Tooltip overlay component

### Icons

[View all available icons in Storybook →](https://ldls.vercel.app/?path=/docs/symbols-interface-icons--docs)

- Always import icons from `/symbols` entry point
- Import: `import { ArrowRight, CheckCircle } from '@ledgerhq/lumen-ui-react/symbols'`
- Use as components: `<ArrowRight size={20} />`
- Pass as props: `<Button icon={ArrowRight}>Label</Button>`
- Available sizes: 12, 16, 20, 24, 32, 40, 48, 56

### Compound Components

Import all parts together:

```tsx
// Select
import { Select, SelectTrigger, SelectContent, SelectItem, SelectItemText } from '@ledgerhq/lumen-ui-react';

// Dialog
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from '@ledgerhq/lumen-ui-react';

// Tooltip
import { Tooltip, TooltipTrigger, TooltipContent } from '@ledgerhq/lumen-ui-react';
```

### Dark Mode

- Lumen components support dark mode automatically via CSS custom properties
- Enable by adding `dark` class to root element: `<html className="dark">`
- No component-level changes needed

---

## Figma Integration

Use these rules when extracting components from Figma designs.

### Token to Tailwind Mapping

Combine the Tailwind prefix for the CSS property with the unique part of the token name.
Use ONLY the unique part after the last hyphen of the CSS variable name.

#### Background Colors

- Figma shows: `background-color: var(--background-base);`
- Result: `bg-base` (NOT `bg-background-base`)

#### Text Colors

- Figma shows: `color: var(--text-on-accent);`
- Result: `text-on-accent` (NOT `text-text-on-accent`)

#### Border Colors

- Figma shows: `border-color: var(--border-muted);`
- Result: `border-muted` (NOT `border-border-muted`)

#### Spacing

- Figma shows: `padding: var(--spacing-16);`
- Result: `p-16` (NOT `p-spacing-16`)

- Figma shows: `margin: var(--spacing-8);`
- Result: `m-8` (NOT `m-spacing-8`)

#### Border Radius

- Figma shows: `border-radius: var(--radius-lg);`
- Result: `rounded-lg` (NOT `rounded-radius-lg`)

#### Border Width

- Figma shows: `border-width: var(--border-width);`
- Result: `border` (NOT `border-width`)

- Figma shows: `border-width: var(--border-width-active);`
- Result: `border-2` (NOT `border-width-active`)

#### Typography Styles

- Figma shows: a comment with the style name, like `/* body/3 */`
- Transform: replace `/` with `-`
- Result: `body-3` (transform `body/3` → `body-3`)
- Example: `/* heading/2-semi-bold */` → `heading-3-semi-bold`
