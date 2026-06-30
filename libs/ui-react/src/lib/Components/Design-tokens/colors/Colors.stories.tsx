import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { toKebab } from '../formatToken';
import { SectionHeader, TokenTable } from '../shared';
import { useResolvedTheme } from '../useResolvedTheme';

const meta: Meta = {
  id: 'react-colors',
  title: 'Foundations/Colors',
  parameters: {
    backgrounds: {
      grid: {
        cellSize: 20,
        opacity: 0.2,
        cellAmount: 5,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

type ColorCategory = 'bg' | 'text' | 'border' | 'crypto' | 'discover';

const isCloseToWhite = (hex: string, threshold = 230): boolean => {
  if (parseInt(hex.slice(7, 9)) === 0) {
    return true;
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return (r + g + b) / 3 >= threshold;
};

const formatCSSToken = (key: string, category: ColorCategory): string => {
  const prefix =
    category === 'bg' ? 'background' : category === 'text' ? 'text' : category;
  return `--color-${prefix}-${toKebab(key)}`;
};

const formatTailwindUtility = (
  key: string,
  category: ColorCategory,
): string => {
  const suffix = toKebab(key);
  switch (category) {
    case 'text':
      return `text-${suffix}`;
    case 'border':
      return `border-${suffix}`;
    case 'crypto':
      return `bg-crypto-${suffix}`;
    case 'discover':
      return `bg-discover-${suffix}`;
    default:
      return `bg-${suffix}`;
  }
};

const ColorSample = ({
  category,
  value,
}: {
  category: ColorCategory;
  value: string;
}) => {
  if (category === 'text') {
    const style: CSSProperties = {
      color: value,
      fontWeight: 'bold',
      paddingInline: 4,
      borderRadius: 6,
      backgroundColor: isCloseToWhite(value)
        ? 'var(--color-background-black)'
        : 'var(--color-background-white)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'var(--color-border-muted-subtle)',
    };
    return <span style={style}>Aa</span>;
  }

  if (category === 'border') {
    return (
      <div
        style={{
          width: '100%',
          height: 32,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: value,
          borderRadius: 8,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: 32,
        backgroundColor: value,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--color-border-muted-subtle)',
      }}
    />
  );
};

const ColorTable = ({ category }: { category: ColorCategory }) => {
  const { colors } = useResolvedTheme();

  const rows = Object.entries(colors[category])
    .filter(([, value]) => !(category === 'crypto' && value.endsWith('00')))
    .map(([key, value]) => ({
      key,
      cells: [
        <code>{formatCSSToken(key, category)}</code>,
        <code>{formatTailwindUtility(key, category)}</code>,
        <code>{value}</code>,
        <ColorSample category={category} value={value} />,
      ],
    }));

  return (
    <TokenTable
      headers={['CSS token name', 'Tailwind utility', 'Hex', 'Sample']}
      rows={rows}
    />
  );
};

export const Background: Story = {
  render: () => (
    <div className='p-24 transition-colors duration-300'>
      <SectionHeader
        title='Background Colors'
        description='Background color tokens, used via the matching `bg-*` Tailwind utility.'
      />
      <ColorTable category='bg' />
    </div>
  ),
};

export const Text: Story = {
  render: () => (
    <div className='p-24 transition-colors duration-300'>
      <SectionHeader
        title='Text Colors'
        description='Text color tokens, used via the matching `text-*` Tailwind utility.'
      />
      <ColorTable category='text' />
    </div>
  ),
};

export const Border: Story = {
  render: () => (
    <div className='p-24 transition-colors duration-300'>
      <SectionHeader
        title='Border Colors'
        description='Border color tokens, used via the matching `border-*` Tailwind utility.'
      />
      <ColorTable category='border' />
    </div>
  ),
};

export const Crypto: Story = {
  name: 'Crypto background',
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Crypto Colors'
        description='Crypto color tokens for different cryptocurrencies.'
      />
      <ColorTable category='crypto' />
    </div>
  ),
};

export const Discover: Story = {
  name: 'Discover background',
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Discover Colors'
        description='Brand colors for discover services and platform integrations.'
      />
      <ColorTable category='discover' />
    </div>
  ),
};
