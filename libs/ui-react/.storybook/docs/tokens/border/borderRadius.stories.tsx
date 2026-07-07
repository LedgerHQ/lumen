import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader, TokenTable } from '../shared';
import { useResolvedTheme } from '../useResolvedTheme';

const meta: Meta = {
  id: 'react-borderradius',
  title: 'Foundations/Border/Radius',
};

export default meta;
type Story = StoryObj;

const BorderRadiusTable = () => {
  const theme = useResolvedTheme();
  const accentColor = theme.colors.bg.accent;

  const rows = Object.entries(theme.borderRadius).map(([key, value]) => ({
    key,
    cells: [
      <code>{`--border-radius-${key}`}</code>,
      <code>{`rounded-${key}`}</code>,
      <code>{`${value}px`}</code>,
      <div
        style={{
          width: 64,
          height: 64,
          backgroundColor: accentColor,
          borderRadius: value,
        }}
      />,
    ],
  }));

  return (
    <TokenTable
      headers={['CSS token name', 'Tailwind utility', 'Value', 'Sample']}
      rows={rows}
    />
  );
};

export const BorderRadius: Story = {
  name: 'Radius',
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Border Radius'
        description='Tailwind classes for controlling the border radius of an element.'
      />
      <BorderRadiusTable />
    </div>
  ),
};
