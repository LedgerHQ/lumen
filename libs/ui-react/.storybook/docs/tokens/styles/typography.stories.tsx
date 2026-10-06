import type { Meta, StoryObj } from '@storybook/react-vite';
import { toKebab } from '../formatToken';
import { SectionHeader, TokenTable } from '../shared';
import { useResolvedTheme } from '../useResolvedTheme';

const meta = {
  id: 'react-typography',
  title: 'Foundations/Styles/Typography',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type TypographyCategory = 'heading' | 'body';

type TypographyDefinition = {
  fontFamily: string;
  fontWeight: string | number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

// The theme object is a single breakpoint, so applying it inline loses the
// media queries. These utilities carry the responsive sizes themselves.
const responsiveUtilities = [
  'responsive-display-1',
  'responsive-display-2',
  'responsive-display-3',
  'responsive-display-4',
] as const;

const ResponsiveTypographyTable = () => {
  const rows = responsiveUtilities.map((utility) => ({
    key: utility,
    cells: [
      <code>{utility}</code>,
      <span className={utility}>
        The quick brown fox jumps over the lazy dog
      </span>,
    ],
  }));

  return <TokenTable headers={['Tailwind utility', 'Sample']} rows={rows} />;
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
  parameters: {
    chromatic: { viewports: [360, 640, 768] },
  },
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Typography'
        description='Tailwind classes for controlling the typography of an element. Use `body-1`, `body-2`, `responsive-display-1`, `heading-2`... for the display text.'
      />
      <h3 className='mt-24 mb-8 heading-4 text-base'>Responsive</h3>
      <ResponsiveTypographyTable />
      <h3 className='mt-24 mb-8 heading-4 text-base'>Heading</h3>
      <TypographyTable category='heading' />
      <h3 className='mt-24 mb-8 heading-4 text-base'>Body</h3>
      <TypographyTable category='body' />
    </div>
  ),
};
