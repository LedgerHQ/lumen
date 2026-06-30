import type { Meta, StoryObj } from '@storybook/react-vite';
import { toKebab } from '../formatToken';
import { SectionHeader, TokenTable } from '../shared';
import { useResolvedTheme } from '../useResolvedTheme';

const meta: Meta = {
  id: 'react-typography',
  title: 'Foundations/Styles/Typography',
};

export default meta;
type Story = StoryObj;

type TypographyCategory = 'responsive' | 'heading' | 'body';

type TypographyDefinition = {
  fontFamily: string;
  fontWeight: string | number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

const TypographyTable = ({ category }: { category: TypographyCategory }) => {
  const typographies = useResolvedTheme().typographies.sm[category];
  const entries = Object.entries(typographies) as [
    string,
    TypographyDefinition,
  ][];

  const rows = entries.map(([key, value]) => ({
    key,
    cells: [
      <code>{toKebab(key)}</code>,
      <span
        style={{
          fontFamily: value.fontFamily,
          fontSize: value.fontSize,
          fontWeight: value.fontWeight,
          lineHeight: `${value.lineHeight}px`,
          letterSpacing: value.letterSpacing,
        }}
      >
        The quick brown fox jumps over the lazy dog
      </span>,
    ],
  }));

  return <TokenTable headers={['Tailwind utility', 'Sample']} rows={rows} />;
};

export const Typography: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Typography'
        description='Tailwind classes for controlling the typography of an element. Use `body-1`, `body-2`, `responsive-display-1`, `heading-2`... for the display text.'
      />
      <h3 className='mt-24 mb-8 heading-4 text-base'>Responsive</h3>
      <TypographyTable category='responsive' />
      <h3 className='mt-24 mb-8 heading-4 text-base'>Heading</h3>
      <TypographyTable category='heading' />
      <h3 className='mt-24 mb-8 heading-4 text-base'>Body</h3>
      <TypographyTable category='body' />
    </div>
  ),
};
