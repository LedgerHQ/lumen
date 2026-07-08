import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader, TokenTable } from '../shared';
import { useResolvedTheme } from '../useResolvedTheme';

const meta: Meta = {
  id: 'react-borderwidth',
  title: 'Foundations/Border/Width',
};

export default meta;
type Story = StoryObj;

const BorderWidthTable = () => {
  const theme = useResolvedTheme();
  const accentColor = theme.colors.bg.accent;

  const rows = Object.entries(theme.borderWidth).map(([key, value]) => ({
    key,
    cells: [
      <code>{`--stroke-${value}`}</code>,
      <code>{value === 1 ? 'border' : `border-${value}`}</code>,
      <code>{`${value}px`}</code>,
      <div
        style={{
          width: 36,
          height: 36,
          borderWidth: value,
          borderStyle: 'solid',
          borderColor: accentColor,
          borderRadius: 8,
          backgroundColor: 'transparent',
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

export const BorderWidth: Story = {
  name: 'Width',
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Border Width'
        description='Tailwind classes for controlling the border width of an element.'
      />
      <BorderWidthTable />
    </div>
  ),
};
